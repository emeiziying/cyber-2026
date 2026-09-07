# 用 AWS Lambda 管理 VLESS REALITY 私有订阅

> 适用场景：已经拥有一个或多个可用的 VLESS REALITY 节点，希望在 Clash Verge Rev 和 Shadowrocket 中只导入一次订阅地址，后续通过刷新订阅更新节点。
> 本文只讲配置分发，不讲 VLESS REALITY 服务端部署。节点必须先独立完成端到端连接和出口 IP 验证。示例中的地址、UUID、公钥、Short ID、SNI 和令牌均为占位符。

WireGuard 不进入此订阅。WireGuard 配置包含逐设备私钥，仍应为每台设备维护独立 Peer。

## 方案概览

```text
私有 Clash 节点 YAML（唯一节点源）
    │
    ├─ 生成完整 Clash YAML
    └─ 派生 Shadowrocket VLESS URI，再编码为 Base64 文本
                │
                ▼
       AWS Lambda Function URL
          ├─ /<随机令牌>/clash
          └─ /<随机令牌>/shadowrocket
                │
                ▼
        客户端添加一次，后续刷新
```

Lambda 只在客户端添加或更新订阅时分发配置。实际代理流量仍从客户端直接连接所选 VLESS 节点，不经过 Lambda。

两种响应的职责不同：

| 客户端 | 响应内容 | 路由规则 |
| --- | --- | --- |
| Clash Verge Rev | 完整 Mihomo/Clash YAML | 可以同时更新节点、策略组和规则 |
| Shadowrocket | 多行 VLESS URI 的 Base64 文本 | 只更新节点，规则需由本地配置、远程配置或模块维护 |

## 前置条件

- 至少一个已经验证可用的 VLESS REALITY TCP 节点。
- 本地安装 Git、curl、Ruby、Python 3、ZIP、OpenSSL、AWS CLI，以及生成二维码时使用的 `qrencode`。
- 已通过 `aws configure sso` 建立 IAM Identity Center Profile；本文命令不使用根用户或长期 Access Key。
- 当前身份可以管理 Lambda、IAM Role 和 Lambda 资源策略，并具有把执行角色交给 Lambda 的 `iam:PassRole` 权限。
- 安装与 Clash Verge Rev 核心兼容的 Mihomo，用于发布前执行完整配置校验。
- 准备可信的二维码解码工具；二维码交付前必须反向解码验证。

首次使用时先完成交互式 SSO Profile 配置：

```bash
aws configure sso --profile my-sso-profile
```

随后初始化当前 Bash 会话，并确认 AWS 身份和目标区域：

```bash
set -euo pipefail

AWS_PROFILE_NAME='my-sso-profile'
export AWS_PROFILE="$AWS_PROFILE_NAME"
export AWS_REGION='ap-northeast-1'
FUNCTION_NAME='vpn-subscription'
ROLE_NAME='vpn-subscription-lambda-role'
RESOURCE_OWNER='cyber-2026-vpn-subscription'

aws sso login --profile "$AWS_PROFILE_NAME"
aws sts get-caller-identity
```

后续命令默认在同一个 Bash 会话中执行。重新打开终端时，先重新执行上面的变量初始化和身份检查；`set -euo pipefail` 会让命令在失败或变量缺失时立即停止。不要在脚本、文档或仓库中保存登录凭据。

## 准备私有工作目录

下面的文件都包含或能够生成访问凭据，应放在公开仓库之外：

```text
vpn-subscription/
├── base-profile.yaml
├── nodes/
│   ├── tokyo.yaml
│   └── singapore.yaml
├── build/
├── build_subscription.rb
├── lambda_function.py
├── trust-policy.json
├── .subscription-token
├── clash-url.txt
└── shadowrocket-url.txt
```

明确选择一个不属于任何 Git 工作树的目录，并限制默认权限：

```bash
set -euo pipefail
umask 077

SUBSCRIPTION_DIR="$HOME/.config/private-vpn/subscription"
install -d -m 700 \
  "$SUBSCRIPTION_DIR" \
  "$SUBSCRIPTION_DIR/nodes" \
  "$SUBSCRIPTION_DIR/build"
cd "$SUBSCRIPTION_DIR"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo '私有订阅目录位于 Git 工作树中，请更换目录' >&2
  exit 1
fi
```

不要只依赖 `.gitignore` 保护凭据；本文要求整个目录位于 Git 工作树之外。即使示例使用占位符，也不要先把真实参数写进公开仓库再尝试删除，Git 历史仍可能保留它们。

## 建立单一节点源

`base-profile.yaml` 只维护公共的 Clash 设置、策略组和规则，不存放节点：

```yaml
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info

proxies: []

proxy-groups:
  - name: PROXY
    type: select
    proxies: []

rules:
  - MATCH,PROXY
```

每个 `nodes/*.yaml` 只保存一个或多个 Clash VLESS REALITY 节点。例如：

```yaml
proxies:
  - name: Tokyo-REALITY
    type: vless
    server: 192.0.2.10
    port: 443
    uuid: 00000000-0000-4000-8000-000000000000
    network: tcp
    tls: true
    udp: true
    flow: xtls-rprx-vision
    servername: www.example.com
    client-fingerprint: chrome
    reality-opts:
      public-key: REPLACE_WITH_REALITY_PUBLIC_KEY
      short-id: 0123456789abcdef
```

示例中的测试网 IP、全零 UUID、示例 SNI 和 `REPLACE_` 值必须全部替换。不要再单独维护一份 Shadowrocket URI；生成器应从同一组 YAML 字段派生 URI，避免两个客户端拿到不同的 UUID、SNI 或 REALITY 参数。

## 生成两个客户端产物

下面的最小 Ruby 生成器只依赖标准库。保存为 `build_subscription.rb`：

```ruby
#!/usr/bin/env ruby

require "base64"
require "fileutils"
require "uri"
require "yaml"

root = __dir__
base_path = File.join(root, "base-profile.yaml")
node_paths = Dir[File.join(root, "nodes", "*.yaml")].sort
build_dir = File.join(root, "build")

abort "base-profile.yaml not found" unless File.file?(base_path)
abort "no node YAML found" if node_paths.empty?

base = YAML.safe_load(File.read(base_path), aliases: true)
nodes = node_paths.flat_map do |path|
  YAML.safe_load(File.read(path), aliases: true).fetch("proxies")
end

serialized_nodes = YAML.dump(nodes)
placeholders = [
  "192.0.2.10",
  "00000000-0000-4000-8000-000000000000",
  "www.example.com",
  "REPLACE_",
]
abort "replace every example placeholder" if placeholders.any? { |value| serialized_nodes.include?(value) }

names = nodes.map { |node| node.fetch("name") }
abort "proxy names must be unique" unless names.uniq.length == names.length

required = %w[
  name type server port uuid network tls flow servername
  client-fingerprint reality-opts
]
uuid_pattern = /\A[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\z/i
short_id_pattern = /\A(?:[0-9a-f]{2}){1,8}\z/i

nodes.each do |node|
  missing = required.reject { |key| node.key?(key) }
  abort "#{node.fetch("name", "unnamed")}: missing #{missing.join(", ")}" unless missing.empty?
  abort "#{node.fetch("name")}: type must be vless" unless node["type"] == "vless"
  abort "#{node.fetch("name")}: network must be tcp" unless node["network"] == "tcp"
  abort "#{node.fetch("name")}: tls must be true" unless node["tls"] == true
  abort "#{node.fetch("name")}: unsupported flow" unless node["flow"] == "xtls-rprx-vision"
  port = Integer(node["port"], exception: false)
  abort "#{node.fetch("name")}: invalid port" unless port && (1..65_535).cover?(port)
  abort "#{node.fetch("name")}: invalid UUID" unless node["uuid"].to_s.match?(uuid_pattern)
  abort "#{node.fetch("name")}: server missing" if node["server"].to_s.empty?
  abort "#{node.fetch("name")}: SNI missing" if node["servername"].to_s.empty?
  abort "#{node.fetch("name")}: fingerprint missing" if node["client-fingerprint"].to_s.empty?

  reality = node.fetch("reality-opts")
  abort "#{node.fetch("name")}: public key missing" if reality["public-key"].to_s.empty?
  abort "#{node.fetch("name")}: invalid short ID" unless reality["short-id"].to_s.match?(short_id_pattern)
end

profile = Marshal.load(Marshal.dump(base))
profile["proxies"] = nodes
group = profile.fetch("proxy-groups").find { |item| item["name"] == "PROXY" }
abort "PROXY group not found" unless group
group["proxies"] = names
abort "MATCH,PROXY rule missing" unless profile.fetch("rules").include?("MATCH,PROXY")

vless_uris = nodes.map do |node|
  reality = node.fetch("reality-opts")
  query = URI.encode_www_form(
    "encryption" => "none",
    "flow" => node.fetch("flow"),
    "security" => "reality",
    "sni" => node.fetch("servername"),
    "fp" => node.fetch("client-fingerprint"),
    "pbk" => reality.fetch("public-key"),
    "sid" => reality.fetch("short-id"),
    "type" => node.fetch("network"),
    "headerType" => "none"
  )
  name = URI.encode_www_form_component(node.fetch("name"))
  "vless://#{node.fetch("uuid")}@#{node.fetch("server")}:#{node.fetch("port")}?#{query}##{name}"
end

FileUtils.mkdir_p(build_dir)
clash_path = File.join(build_dir, "clash.yaml")
shadowrocket_path = File.join(build_dir, "shadowrocket.txt")

File.write(clash_path, YAML.dump(profile).sub(/\A---\s*\n/, ""))
File.write(shadowrocket_path, Base64.strict_encode64(vless_uris.join("\n")))
File.chmod(0o600, clash_path)
File.chmod(0o600, shadowrocket_path)

decoded = Base64.strict_decode64(File.read(shadowrocket_path)).split("\n")
abort "generated node counts differ" unless decoded.length == nodes.length
decoded.each { |value| abort "invalid VLESS URI" unless URI.parse(value).scheme == "vless" }

puts "validated and built #{nodes.length} nodes"
```

生成并校验：

```bash
ruby build_subscription.rb

# Mihomo 校验比只解析 YAML 更接近客户端真实行为。
mihomo -t -f build/clash.yaml
```

只有以上检查通过后才能发布。不要在终端或 CI 日志中打印生成文件正文。

## 创建 Lambda 响应程序

保存为 `lambda_function.py`：

```python
import hmac
import os
from pathlib import Path


ROOT = Path(__file__).parent
RESPONSES = {
    "clash": (
        "clash.yaml",
        "text/yaml; charset=utf-8",
        'attachment; filename="vpn-subscription.yaml"',
    ),
    "shadowrocket": (
        "shadowrocket.txt",
        "text/plain; charset=utf-8",
        'attachment; filename="vpn-subscription.txt"',
    ),
}


def response(status, body, headers=None):
    return {
        "statusCode": status,
        "headers": {
            "cache-control": "no-store",
            "x-content-type-options": "nosniff",
            **(headers or {}),
        },
        "body": body,
        "isBase64Encoded": False,
    }


def handler(event, _context):
    method = event.get("requestContext", {}).get("http", {}).get("method")
    if method != "GET":
        return response(405, "Method Not Allowed")

    parts = event.get("rawPath", "").strip("/").split("/")
    expected_token = os.environ.get("SUBSCRIPTION_TOKEN", "")
    if len(parts) != 2 or not expected_token:
        return response(404, "Not Found")
    if not hmac.compare_digest(parts[0], expected_token):
        return response(404, "Not Found")

    item = RESPONSES.get(parts[1])
    if not item:
        return response(404, "Not Found")

    filename, content_type, disposition = item
    return response(
        200,
        (ROOT / filename).read_text(encoding="utf-8"),
        {
            "content-type": content_type,
            "content-disposition": disposition,
            # Clash Verge Rev 的单位是小时。
            "profile-update-interval": "6",
        },
    )
```

此函数不记录 `event`，避免令牌路径进入应用日志。`AuthType=NONE` 仍代表公开入口，路径令牌只是应用层 Bearer 凭据。

## 首次部署

保存以下内容为 `trust-policy.json`：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }
  ]
}
```

先生成随机令牌并打包。ZIP 同样包含节点凭据，必须限制权限：

```bash
set -euo pipefail
umask 077

chmod 600 \
  base-profile.yaml \
  nodes/*.yaml \
  build_subscription.rb \
  lambda_function.py \
  trust-policy.json

if ! test -f .subscription-token && aws lambda get-function \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" >/dev/null 2>&1; then
  echo '远端同名函数已存在，但本地令牌缺失；停止以避免现有订阅失效' >&2
  exit 1
fi

if ! test -f .subscription-token; then
  openssl rand -hex 32 > .subscription-token
fi
chmod 600 .subscription-token

ruby build_subscription.rb
mihomo -t -f build/clash.yaml

rm -f build/vpn-subscription.zip
zip -j -q build/vpn-subscription.zip \
  lambda_function.py \
  build/clash.yaml \
  build/shadowrocket.txt
chmod 600 build/vpn-subscription.zip
```

创建最小执行角色。新资源会写入 `ManagedBy` 所有权标签；同名角色只有标签完全匹配时才允许复用：

```bash
set -euo pipefail

if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document file://trust-policy.json \
    --description 'Execution role for a private VPN subscription endpoint' \
    --tags Key=ManagedBy,Value="$RESOURCE_OWNER"
else
  EXISTING_ROLE_OWNER=$(aws iam list-role-tags \
    --role-name "$ROLE_NAME" \
    --query "Tags[?Key=='ManagedBy'].Value | [0]" \
    --output text)
  test "$EXISTING_ROLE_OWNER" = "$RESOURCE_OWNER" || {
    echo '同名 IAM Role 不属于本教程，停止以避免误修改' >&2
    exit 1
  }
fi

aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

创建或更新专用 Lambda。IAM Role 刚创建时可能尚未完成传播；如果出现“role cannot be assumed”错误，等待数秒后原样重试，不要改成权限更大的角色：

```bash
set -euo pipefail

ROLE_ARN=$(aws iam get-role \
  --role-name "$ROLE_NAME" \
  --query 'Role.Arn' \
  --output text)
TOKEN=$(tr -d '\n' < .subscription-token)

if aws lambda get-function \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" >/dev/null 2>&1; then
  FUNCTION_ARN=$(aws lambda get-function-configuration \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME" \
    --query 'FunctionArn' \
    --output text)
  EXISTING_FUNCTION_OWNER=$(aws lambda list-tags \
    --resource "$FUNCTION_ARN" \
    --query 'Tags.ManagedBy' \
    --output text)
  EXISTING_FUNCTION_ROLE=$(aws lambda get-function-configuration \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME" \
    --query 'Role' \
    --output text)
  test "$EXISTING_FUNCTION_OWNER" = "$RESOURCE_OWNER" || {
    echo '同名 Lambda 不属于本教程，停止以避免覆盖其代码' >&2
    exit 1
  }
  test "$EXISTING_FUNCTION_ROLE" = "$ROLE_ARN" || {
    echo '现有 Lambda 的执行角色不匹配，停止以避免误接管' >&2
    exit 1
  }

  aws lambda update-function-code \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME" \
    --zip-file fileb://build/vpn-subscription.zip
  aws lambda wait function-updated \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME"
  aws lambda update-function-configuration \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME" \
    --environment "Variables={SUBSCRIPTION_TOKEN=$TOKEN}"
  aws lambda wait function-updated \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME"
else
  aws lambda create-function \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME" \
    --runtime python3.12 \
    --architectures arm64 \
    --handler lambda_function.handler \
    --role "$ROLE_ARN" \
    --zip-file fileb://build/vpn-subscription.zip \
    --timeout 5 \
    --memory-size 128 \
    --environment "Variables={SUBSCRIPTION_TOKEN=$TOKEN}" \
    --tags ManagedBy="$RESOURCE_OWNER"
  aws lambda wait function-active-v2 \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME"
fi
```

创建 Function URL 和调用权限：

```bash
set -euo pipefail

if ! FUNCTION_URL=$(aws lambda get-function-url-config \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --query 'FunctionUrl' \
  --output text 2>/dev/null); then
  FUNCTION_URL=$(aws lambda create-function-url-config \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME" \
    --auth-type NONE \
    --query 'FunctionUrl' \
    --output text)
fi

FUNCTION_URL_AUTH=$(aws lambda get-function-url-config \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --query 'AuthType' \
  --output text)
test "$FUNCTION_URL_AUTH" = 'NONE' || {
  echo '现有 Function URL 不是 NONE 认证，停止以避免误改共享入口' >&2
  exit 1
}

if ! aws lambda get-policy \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --query 'Policy' \
  --output text 2>/dev/null | grep -Fq 'FunctionURLAllowPublicAccess'; then
  aws lambda add-permission \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME" \
    --statement-id FunctionURLAllowPublicAccess \
    --action lambda:InvokeFunctionUrl \
    --principal '*' \
    --function-url-auth-type NONE
fi

if ! aws lambda get-policy \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --query 'Policy' \
  --output text 2>/dev/null | grep -Fq 'FunctionURLAllowPublicInvoke'; then
  aws lambda add-permission \
    --region "$AWS_REGION" \
    --function-name "$FUNCTION_NAME" \
    --statement-id FunctionURLAllowPublicInvoke \
    --action lambda:InvokeFunction \
    --principal '*' \
    --invoked-via-function-url
fi
```

把两个地址分别保存到权限为 `0600` 的文件中，不要输出到公开日志：

```bash
set -euo pipefail
umask 077

test -n "$FUNCTION_URL"
test -n "$TOKEN"
printf '%s%s/clash' "$FUNCTION_URL" "$TOKEN" > clash-url.txt
printf '%s%s/shadowrocket' "$FUNCTION_URL" "$TOKEN" > shadowrocket-url.txt
chmod 600 clash-url.txt shadowrocket-url.txt
unset TOKEN
```

## 验证远端订阅

验证时只输出状态和校验结论，不显示订阅正文：

```bash
set -euo pipefail
umask 077

FUNCTION_URL=$(aws lambda get-function-url-config \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --query 'FunctionUrl' \
  --output text)
CLASH_URL=$(<clash-url.txt)
SHADOWROCKET_URL=$(<shadowrocket-url.txt)

curl -fsS \
  -D build/clash.headers \
  -o build/remote-clash.yaml \
  "$CLASH_URL"

curl -fsS \
  -D build/shadowrocket.headers \
  -o build/remote-shadowrocket.txt \
  "$SHADOWROCKET_URL"

grep -Ei '^(content-type|content-disposition|profile-update-interval|cache-control):' \
  build/clash.headers
grep -Eiq '^content-type:[[:space:]]*text/yaml' build/clash.headers
grep -Eiq '^cache-control:[[:space:]]*no-store' build/clash.headers
grep -Eiq '^profile-update-interval:[[:space:]]*6' build/clash.headers
grep -Eiq '^content-type:[[:space:]]*text/plain' build/shadowrocket.headers
grep -Eiq '^cache-control:[[:space:]]*no-store' build/shadowrocket.headers
mihomo -t -f build/remote-clash.yaml

ruby -rbase64 -ruri -e '
  values = Base64.strict_decode64(File.read(ARGV.fetch(0))).split("\n")
  abort "empty subscription" if values.empty?
  values.each { |value| abort "invalid URI" unless URI.parse(value).scheme == "vless" }
  puts "validated #{values.length} Shadowrocket nodes"
' build/remote-shadowrocket.txt

INVALID_STATUS=$(curl -sS -o /dev/null -w '%{http_code}' \
  "${FUNCTION_URL}invalid-token/clash")
test "$INVALID_STATUS" = '404'

unset CLASH_URL SHADOWROCKET_URL
```

最后必须在 Clash Verge Rev 和 Shadowrocket 中分别更新一次，并确认节点数量、名称、策略组、规则、实际连接和出口 IP。HTTP `200` 只证明订阅可下载，不证明节点可用。

## 导入 Clash Verge Rev

1. 打开订阅或配置页面。
2. 从 `clash-url.txt` 复制 URL，以远程订阅方式导入。
3. 更新订阅并选择生成的配置。
4. 检查 `PROXY` 组包含所有节点，且规则引用的组均存在。
5. 如果使用 Merge、覆写或脚本，确认它没有替换订阅中的策略组和规则。

服务端返回的 `profile-update-interval: 6` 表示建议每 6 小时更新一次。客户端是否自动更新、失败后是否重试，仍由当前 Clash Verge Rev 版本和本地设置决定。

## 导入 Shadowrocket

Shadowrocket 中新增“Subscribe/订阅”（不同版本名称可能略有差异），粘贴 `shadowrocket-url.txt` 中的原始 HTTPS URL。

也可以生成订阅二维码：

```bash
qrencode -r shadowrocket-url.txt \
  -o shadowrocket-subscription.png
chmod 600 shadowrocket-subscription.png
```

二维码本身包含 Bearer URL，必须与令牌同等保护。生成后应反向解码一次，并确认结果与 `shadowrocket-url.txt` 完全一致，再交给设备扫描。

如果扫描没有反应：

- 不要改用未经验证的 URL Scheme 包装。
- 手动新增 Subscribe/订阅并粘贴原始 HTTPS URL。
- 浏览器看到 `.txt`、下载文本或显示 Base64 字符串是正常现象；应让 Shadowrocket 读取 URL，不需要手工保存响应。

Shadowrocket 的这类 Base64 订阅只同步节点，不包含路由规则。新增必须代理的域名时，要另行更新 Shadowrocket 配置或规则模块。

## 更新节点与回滚

新增或修改 `nodes/*.yaml` 后：

```bash
set -euo pipefail

ruby build_subscription.rb
mihomo -t -f build/clash.yaml

DEPLOYED_BACKUP="build/vpn-subscription.zip.bak-$(date +%Y%m%d%H%M%S)"
CURRENT_CODE_URL=$(aws lambda get-function \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --query 'Code.Location' \
  --output text)
curl -fsS -o "$DEPLOYED_BACKUP" "$CURRENT_CODE_URL"
chmod 600 "$DEPLOYED_BACKUP"
test -s "$DEPLOYED_BACKUP"
unset CURRENT_CODE_URL

rm -f build/vpn-subscription.zip
zip -j -q build/vpn-subscription.zip \
  lambda_function.py \
  build/clash.yaml \
  build/shadowrocket.txt
chmod 600 build/vpn-subscription.zip

aws lambda update-function-code \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://build/vpn-subscription.zip

aws lambda wait function-updated \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME"
```

订阅 URL 不会改变，客户端刷新即可取得新节点。更新后重新执行远端验证；失败时用刚才保留的备份 ZIP 回滚：

```bash
set -euo pipefail

ROLLBACK_ZIP='build/vpn-subscription.zip.bak-YYYYMMDDHHMMSS'

aws lambda update-function-code \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --zip-file "fileb://$ROLLBACK_ZIP"

aws lambda wait function-updated \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME"
```

回滚完成后再次执行“验证远端订阅”，不能只凭 Lambda 更新命令成功就判断旧配置已经恢复。

这个最小方案直接更新 `$LATEST`，不提供真正的原子发布。需要更严格的生产级回滚时，应发布 Lambda Version，并把 Function URL 绑定到 Alias 后再切换版本。

## 轮换订阅令牌

令牌泄露后先生成候选令牌，不覆盖仍可用于回滚的旧令牌。此教程使用专用 Lambda，环境变量中只有 `SUBSCRIPTION_TOKEN`；`update-function-configuration --environment` 会替换整个变量集合，不要把该命令直接用于还承载其他环境变量的共享函数。

```bash
set -euo pipefail
umask 077

openssl rand -hex 32 > .subscription-token.new
NEW_TOKEN=$(tr -d '\n' < .subscription-token.new)
OLD_CLASH_URL=$(<clash-url.txt)

aws lambda update-function-configuration \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --environment "Variables={SUBSCRIPTION_TOKEN=$NEW_TOKEN}"

aws lambda wait function-updated \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME"

FUNCTION_URL=$(aws lambda get-function-url-config \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --query 'FunctionUrl' \
  --output text)

NEW_CLASH_URL="${FUNCTION_URL}${NEW_TOKEN}/clash"
NEW_SHADOWROCKET_URL="${FUNCTION_URL}${NEW_TOKEN}/shadowrocket"

curl -fsS -o /dev/null "$NEW_CLASH_URL"
curl -fsS -o /dev/null "$NEW_SHADOWROCKET_URL"

OLD_STATUS=$(curl -sS -o /dev/null -w '%{http_code}' "$OLD_CLASH_URL")
test "$OLD_STATUS" = '404'

mv .subscription-token.new .subscription-token
printf '%s' "$NEW_CLASH_URL" > clash-url.txt
printf '%s' "$NEW_SHADOWROCKET_URL" > shadowrocket-url.txt
chmod 600 clash-url.txt shadowrocket-url.txt
unset NEW_TOKEN NEW_CLASH_URL NEW_SHADOWROCKET_URL OLD_CLASH_URL
```

如果更新环境变量后新 URL 验证失败，不要删除 `.subscription-token.new`；使用 `.subscription-token` 中保留的旧值恢复函数环境变量：

```bash
set -euo pipefail

OLD_TOKEN=$(tr -d '\n' < .subscription-token)
NEW_TOKEN=$(tr -d '\n' < .subscription-token.new)
aws lambda update-function-configuration \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --environment "Variables={SUBSCRIPTION_TOKEN=$OLD_TOKEN}"
aws lambda wait function-updated \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME"

FUNCTION_URL=$(aws lambda get-function-url-config \
  --region "$AWS_REGION" \
  --function-name "$FUNCTION_NAME" \
  --query 'FunctionUrl' \
  --output text)
curl -fsS -o /dev/null "${FUNCTION_URL}${OLD_TOKEN}/clash"
NEW_STATUS=$(curl -sS -o /dev/null -w '%{http_code}' \
  "${FUNCTION_URL}${NEW_TOKEN}/clash")
test "$NEW_STATUS" = '404'
unset OLD_TOKEN NEW_TOKEN NEW_STATUS
```

轮换成功后，旧 URL 已验证为 `404`，所有客户端都必须重新导入新 URL，旧二维码也应删除。

## 安全与费用控制

- `AuthType=NONE` 不要求 AWS 签名，任何拿到 URL 的人都能调用函数并取得其中节点凭据。
- IAM Role 和 Lambda 都使用固定 `ManagedBy` 标签；更新前必须校验标签与执行角色，不能只凭名称复用资源。
- 不记录完整请求事件、请求路径或响应正文；错误令牌与未知路径统一返回 `404`。
- 私有目录使用 `0700`；令牌、URL 文件、节点 YAML、生成结果、ZIP 和二维码等敏感普通文件使用 `0600`，并全部排除在 Git 之外。已有文件也要重新检查权限，`umask` 不会自动收紧旧文件。
- 给 Lambda 设置合理的并发上限、调用量告警和 AWS Budget，降低 URL 泄露后的滥用费用风险。
- 订阅不是监控或控制面。节点失效后不会自动修复；只有使用健康检查策略组的客户端才能自动切换。
- 删除函数前先确认客户端已经迁移。删除 Function URL 时还应检查并清理相关资源策略、IAM Role 和本地敏感产物。

## 参考资料

- [创建和管理 Lambda Function URL](https://docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html)
- [Lambda Function URL 访问控制](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html)
- [Clash Verge Rev 订阅响应头](https://www.clashverge.dev/guide/url_schemes.html)
- [Xray REALITY 配置](https://xtls.github.io/config/transports/reality.html)
