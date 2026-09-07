# 使用 AWS Lightsail 搭建 WireGuard VPN

> 适用场景：个人设备安全访问公网和公共 Wi-Fi 加密。本文不包含家庭或公司内网的站点到站点访问。请遵守所在地法律、AWS 服务条款及目标网站规则。
> 本文以东京区域、Ubuntu 24.04、WireGuard UDP 443 和 IPv4 默认路由为例。文中的公网 IP 与密钥均为占位符。

## 方案概览

```text
手机 / 电脑
    │  WireGuard（UDP 443）
    ▼
AWS Lightsail 静态公网 IPv4
    │  NAT 转发
    ▼
互联网
```

为什么选择这套方案：

- Lightsail 比 EC2 更容易管理，套餐自带一定流量额度。
- WireGuard 性能好、配置少，不需要 Docker。
- 使用 UDP 443 可能避开部分网络对非常用 UDP 端口的限制，但 WireGuard 仍是 UDP 协议，受限网络中必须实测。
- UDP 443 与 VLESS 使用的 TCP 443 可以共存。若同机网站启用了 HTTP/3 或 QUIC，它也需要 UDP 443，此时会发生端口冲突。

::: warning IPv6 不在本文隧道内
客户端的 `AllowedIPs` 只有 `0.0.0.0/0`，因此仅接管 IPv4。客户端若具有公网 IPv6，IPv6 请求仍可能从本地网络直连。需要全量隧道时，应完整配置服务器 IPv6 地址、转发、防火墙和客户端 `::/0`；不能只在客户端追加 `::/0`。
:::

## 创建 Lightsail 实例

打开 [Amazon Lightsail 控制台](https://lightsail.aws.amazon.com/)：

1. 选择“创建实例”。
2. 区域选择“东京”，即 `ap-northeast-1`。
3. 平台选择 Linux/Unix。
4. 蓝图选择 Ubuntu 24.04 LTS。
5. 个人轻量使用可从最低的“包含公网 IPv4”Linux 套餐开始。IPv6-only 套餐更便宜，但客户端、本地网络和目标网站都必须支持 IPv6，不适合本文的 IPv4 默认路由方案。实际价格和流量额度以控制台为准。
6. 实例名称可设为 `wg-tokyo`。

实例创建后，在“Networking / 网络”页面创建并绑定静态 IPv4。未绑定静态 IP 时，实例停止再启动可能更换公网地址；静态 IP 必须与实例位于同一区域。参见 [AWS 静态 IP 文档](https://docs.aws.amazon.com/lightsail/latest/userguide/lightsail-create-static-ip.html)。

### 可选：在 CloudShell 中绑定静态 IP

```bash
REGION=ap-northeast-1
INSTANCE_NAME=wg-tokyo
STATIC_IP_NAME=wg-tokyo-ip

aws lightsail allocate-static-ip \
  --region "$REGION" \
  --static-ip-name "$STATIC_IP_NAME"

aws lightsail attach-static-ip \
  --region "$REGION" \
  --static-ip-name "$STATIC_IP_NAME" \
  --instance-name "$INSTANCE_NAME"
```

## 配置 Lightsail 防火墙

保留：

- TCP 22：SSH 管理，最好限制为自己的公网 IP。
- UDP 443：WireGuard 客户端入口。

关闭不使用的 TCP 80、UDP 51820 等端口。Lightsail 的 IPv4 和 IPv6 防火墙相互独立：本文只在 IPv4 防火墙开放 WireGuard UDP 443，但双栈实例仍需单独审计 IPv6 防火墙，避免 SSH 或其他服务通过 IPv6 意外暴露。参见 [AWS Lightsail 防火墙文档](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-firewall-and-port-mappings-in-amazon-lightsail.html)。

CloudShell 命令：

```bash
aws lightsail open-instance-public-ports \
  --region ap-northeast-1 \
  --instance-name wg-tokyo \
  --port-info fromPort=443,protocol=UDP,toPort=443
```

注意不要误开成 TCP 443。

## 安装 WireGuard

从 Lightsail 控制台进入浏览器 SSH，执行：

```bash
sudo apt update
sudo apt install -y curl wireguard qrencode
sudo install -d -m 700 /etc/wireguard/clients
```

生成服务器密钥和第一台客户端的独立密钥：

```bash
if sudo test -e /etc/wireguard/server.key || \
   sudo test -e /etc/wireguard/clients/phone.key; then
  echo '密钥文件已经存在，停止以避免覆盖现有配置' >&2
  exit 1
fi

sudo sh -c '
  set -eu
  umask 077
  cleanup() {
    rm -f \
      /etc/wireguard/server.key.new \
      /etc/wireguard/server.pub.new \
      /etc/wireguard/clients/phone.key.new \
      /etc/wireguard/clients/phone.pub.new
  }
  trap cleanup EXIT

  wg genkey > /etc/wireguard/server.key.new
  wg pubkey < /etc/wireguard/server.key.new > /etc/wireguard/server.pub.new
  wg genkey > /etc/wireguard/clients/phone.key.new
  wg pubkey < /etc/wireguard/clients/phone.key.new > /etc/wireguard/clients/phone.pub.new

  mv /etc/wireguard/server.key.new /etc/wireguard/server.key
  mv /etc/wireguard/server.pub.new /etc/wireguard/server.pub
  mv /etc/wireguard/clients/phone.key.new /etc/wireguard/clients/phone.key
  mv /etc/wireguard/clients/phone.pub.new /etc/wireguard/clients/phone.pub
  trap - EXIT
'
```

WireGuard 密钥本身不会定期过期。每台设备应使用独立私钥、公钥和隧道 IP，方便单独吊销。

## 启用 IPv4 转发

```bash
echo 'net.ipv4.ip_forward=1' |
  sudo tee /etc/sysctl.d/99-wireguard-forward.conf >/dev/null

sudo sysctl --system
```

确认结果：

```bash
sysctl net.ipv4.ip_forward
```

应显示：

```text
net.ipv4.ip_forward = 1
```

## 创建服务端配置

先确认 `10.66.66.0/24` 不与手机、电脑的常用局域网、公司网络、云内网或其他 VPN 网段冲突；如果冲突，应在服务端和所有客户端统一更换一个私有网段。

下面的命令会自动读取密钥和默认公网网卡名称，不会把私钥输出到终端。先检查变量，再通过临时目录验证配置，避免直接覆盖已有文件：

```bash
SERVER_PRIVATE_KEY=$(sudo cat /etc/wireguard/server.key)
PHONE_PUBLIC_KEY=$(sudo cat /etc/wireguard/clients/phone.pub)
PUBLIC_IF=$(ip route show default | awk '/default/ {print $5; exit}')

test -n "$SERVER_PRIVATE_KEY" || { echo "服务器私钥为空" >&2; exit 1; }
test -n "$PHONE_PUBLIC_KEY" || { echo "客户端公钥为空" >&2; exit 1; }
ip link show "$PUBLIC_IF" >/dev/null || { echo "默认公网网卡无效" >&2; exit 1; }

sudo install -d -m 700 /etc/wireguard/staging
sudo tee /etc/wireguard/staging/wg0.conf >/dev/null <<EOF
[Interface]
Address = 10.66.66.1/24
ListenPort = 443
PrivateKey = ${SERVER_PRIVATE_KEY}
MTU = 1280
PostUp = iptables -I FORWARD 1 -i %i -o ${PUBLIC_IF} -j ACCEPT; iptables -I FORWARD 1 -i ${PUBLIC_IF} -o %i -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT; iptables -t nat -A POSTROUTING -s 10.66.66.0/24 -o ${PUBLIC_IF} -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -o ${PUBLIC_IF} -j ACCEPT; iptables -D FORWARD -i ${PUBLIC_IF} -o %i -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT; iptables -t nat -D POSTROUTING -s 10.66.66.0/24 -o ${PUBLIC_IF} -j MASQUERADE

[Peer]
PublicKey = ${PHONE_PUBLIC_KEY}
AllowedIPs = 10.66.66.2/32
EOF

sudo chmod 600 /etc/wireguard/staging/wg0.conf
if ! sudo wg-quick strip /etc/wireguard/staging/wg0.conf >/dev/null; then
  sudo rm -f /etc/wireguard/staging/wg0.conf
  echo "配置校验失败，未覆盖现有 wg0.conf" >&2
  exit 1
fi

if sudo test -f /etc/wireguard/wg0.conf; then
  sudo cp -p /etc/wireguard/wg0.conf \
    "/etc/wireguard/wg0.conf.bak-$(date +%Y%m%d%H%M%S)"
fi

sudo install -m 600 \
  /etc/wireguard/staging/wg0.conf \
  /etc/wireguard/wg0.conf
sudo rm -f /etc/wireguard/staging/wg0.conf
unset SERVER_PRIVATE_KEY
```

若 `sudo ufw status` 显示 UFW 已启用，还需要执行：

```bash
sudo ufw allow 443/udp
```

## 启动并验证服务

```bash
sudo systemctl enable --now wg-quick@wg0
sudo systemctl status --no-pager wg-quick@wg0
sudo wg show
sudo ss -lunp | grep ':443'
```

正确状态应包括：

- `wg-quick@wg0` 为 `active`。
- `wg0` 监听 UDP 443。
- `10.66.66.2/32` 对应的客户端 Peer 已存在。

如果修改配置，可先检查再重启：

```bash
if sudo wg-quick strip wg0 >/dev/null; then
  sudo systemctl restart wg-quick@wg0
else
  echo "配置校验失败，未重启 WireGuard" >&2
  exit 1
fi
```

## 生成客户端配置和二维码

先取得实例的静态公网 IPv4：

```bash
SERVER_IP=$(curl -4 -fsS https://checkip.amazonaws.com)
SERVER_PUBLIC_KEY=$(sudo cat /etc/wireguard/server.pub)
PHONE_PRIVATE_KEY=$(sudo cat /etc/wireguard/clients/phone.key)

test -n "$SERVER_IP" || { echo "未取得服务器公网 IPv4" >&2; exit 1; }
test -n "$SERVER_PUBLIC_KEY" || { echo "服务器公钥为空" >&2; exit 1; }
test -n "$PHONE_PRIVATE_KEY" || { echo "客户端私钥为空" >&2; exit 1; }

sudo tee /etc/wireguard/clients/phone.conf >/dev/null <<EOF
[Interface]
PrivateKey = ${PHONE_PRIVATE_KEY}
Address = 10.66.66.2/32
DNS = 1.1.1.1
MTU = 1280

[Peer]
PublicKey = ${SERVER_PUBLIC_KEY}
Endpoint = ${SERVER_IP}:443
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF

sudo chmod 600 /etc/wireguard/clients/phone.conf
sudo qrencode -t ansiutf8 < /etc/wireguard/clients/phone.conf
unset PHONE_PRIVATE_KEY
```

用官方 WireGuard 客户端扫描：

1. 点击“添加隧道”。
2. 选择“从二维码创建”。
3. 保存并打开隧道。

桌面版 WireGuard 客户端可选择“从文件导入隧道”，安全地传输并导入 `phone.conf`。不要通过公开网盘、公开聊天或邮件明文传递该文件。

Shadowrocket 也可以扫描此二维码导入 WireGuard 节点。测试 IPv4 默认路由时，应临时切换到全局代理；在“配置/规则模式”下，只有命中规则的请求才走节点。

二维码和 `phone.conf` 都包含客户端私钥，不能公开发送。确认客户端已经导入、能够重新取得配置或具有安全备份后，可以从服务器删除客户端私钥配置：

```bash
sudo rm -f \
  /etc/wireguard/clients/phone.key \
  /etc/wireguard/clients/phone.conf
```

服务端只需保留该设备的公钥。

## 检查是否连接成功

客户端开启隧道后，在服务器执行：

```bash
sudo wg show
```

重点查看：

- `latest handshake`：最近一次握手时间。
- `transfer`：接收和发送字节是否持续增长。
- `endpoint`：客户端当前公网地址和临时端口。

客户端访问：

```text
https://checkip.amazonaws.com/
```

显示结果应与 Lightsail 静态 IPv4 一致。随后打开 `https://test-ipv6.com/`：如果仍检测到本地运营商的公网 IPv6，说明它没有进入本文的 IPv4 隧道，这与当前配置相符，不能宣称“所有流量都经过 VPS”。

还应分别验证：

- DNS 解析是否正常，是否出现本地 DNS 泄漏。
- 常用网站是否能连续打开，而不是只成功一次。
- Wi-Fi 和蜂窝网络下的握手、延迟、抖动与丢包。
- Shadowrocket 规则模式下，目标请求实际命中的规则和节点。

桌面客户端可连续执行 10 次 HTTPS 探测，观察失败率和首字节时间：

```bash
for i in $(seq 1 10); do
  curl -4 -fsS -o /dev/null \
    -w "status=%{http_code} connect=%{time_connect} total=%{time_total}\n" \
    https://www.google.com/generate_204 || echo "request_failed"
done
```

握手、流量计数、客户端节点选择和真实网页成功分别属于不同证据，不能用其中一项替代全部验证。

## 增加第二台设备

不要让多台设备长期共用同一个私钥。为第二台设备生成新密钥，并分配未使用的 `10.66.66.3`。执行前先确认该地址没有出现在现有配置中：

```bash
if sudo grep -Eq \
  '^[[:space:]]*AllowedIPs[[:space:]]*=[[:space:]]*10\.66\.66\.3/32([[:space:],]|$)' \
  /etc/wireguard/wg0.conf; then
  echo '10.66.66.3 已被使用，请先选择其他地址' >&2
  exit 1
fi

if sudo test -e /etc/wireguard/clients/phone2.key; then
  echo 'phone2.key 已存在，停止以避免覆盖现有设备密钥' >&2
  exit 1
fi

sudo sh -c '
  set -eu
  umask 077
  cleanup() {
    rm -f \
      /etc/wireguard/clients/phone2.key.new \
      /etc/wireguard/clients/phone2.pub.new
  }
  trap cleanup EXIT

  wg genkey > /etc/wireguard/clients/phone2.key.new
  wg pubkey < /etc/wireguard/clients/phone2.key.new > /etc/wireguard/clients/phone2.pub.new
  mv /etc/wireguard/clients/phone2.key.new /etc/wireguard/clients/phone2.key
  mv /etc/wireguard/clients/phone2.pub.new /etc/wireguard/clients/phone2.pub
  trap - EXIT
'

PHONE2_PUBLIC_KEY=$(sudo cat /etc/wireguard/clients/phone2.pub)
test -n "$PHONE2_PUBLIC_KEY" || { echo "第二台设备公钥为空" >&2; exit 1; }

WG_BACKUP="/etc/wireguard/wg0.conf.bak-$(date +%Y%m%d%H%M%S)"
sudo cp -p /etc/wireguard/wg0.conf "$WG_BACKUP"

sudo tee -a /etc/wireguard/wg0.conf >/dev/null <<EOF

# phone2 - 10.66.66.3
[Peer]
PublicKey = ${PHONE2_PUBLIC_KEY}
AllowedIPs = 10.66.66.3/32
EOF

if ! sudo wg-quick strip wg0 >/dev/null; then
  sudo cp -p "$WG_BACKUP" /etc/wireguard/wg0.conf
  echo "配置无效，已经恢复备份" >&2
  exit 1
fi

if ! sudo bash -c 'wg syncconf wg0 <(wg-quick strip wg0)'; then
  sudo cp -p "$WG_BACKUP" /etc/wireguard/wg0.conf
  sudo systemctl restart wg-quick@wg0
  echo "运行时加载失败，已经恢复备份并重启 WireGuard" >&2
  exit 1
fi
```

为第二台设备生成独立客户端配置，不要复用第一台设备的 `phone.key`：

```bash
SERVER_IP=$(curl -4 -fsS https://checkip.amazonaws.com)
SERVER_PUBLIC_KEY=$(sudo cat /etc/wireguard/server.pub)
PHONE2_PRIVATE_KEY=$(sudo cat /etc/wireguard/clients/phone2.key)

test -n "$SERVER_IP" || { echo "未取得服务器公网 IPv4" >&2; exit 1; }
test -n "$SERVER_PUBLIC_KEY" || { echo "服务器公钥为空" >&2; exit 1; }
test -n "$PHONE2_PRIVATE_KEY" || { echo "第二台设备私钥为空" >&2; exit 1; }

sudo tee /etc/wireguard/clients/phone2.conf >/dev/null <<EOF
[Interface]
PrivateKey = ${PHONE2_PRIVATE_KEY}
Address = 10.66.66.3/32
DNS = 1.1.1.1
MTU = 1280

[Peer]
PublicKey = ${SERVER_PUBLIC_KEY}
Endpoint = ${SERVER_IP}:443
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF

sudo chmod 600 /etc/wireguard/clients/phone2.conf
sudo qrencode -t ansiutf8 < /etc/wireguard/clients/phone2.conf
unset PHONE2_PRIVATE_KEY
```

导入后先验证 `10.66.66.3` 对应 Peer 的握手和传输。确认客户端能够重新取得配置或具有安全备份后，再删除服务器副本：

```bash
sudo rm -f \
  /etc/wireguard/clients/phone2.key \
  /etc/wireguard/clients/phone2.conf
```

建议在一份不含私钥的资产记录中维护“设备名称、公钥、隧道 IP、创建日期”，避免地址冲突。

设备丢失时，先从运行中的接口移除 Peer，再从 `wg0.conf` 删除该设备的完整 `[Peer]` 配置块：

```bash
LOST_PUBLIC_KEY='<丢失设备的公钥>'
sudo wg set wg0 peer "$LOST_PUBLIC_KEY" remove
sudoedit /etc/wireguard/wg0.conf
sudo wg-quick strip wg0 >/dev/null
```

编辑前应备份 `wg0.conf`。仅执行运行时的 `wg set ... remove` 不会永久修改配置，服务器重启后仍可能恢复该 Peer。

## 可选：增加 VLESS REALITY 备用节点

如果当前网络对 WireGuard UDP 不稳定，可以另外部署 VLESS REALITY TCP 443 作为备用。它是独立代理方案，不是 WireGuard Peer；使用客户端的 TUN 或全局模式时才能形成近似全局代理。

WireGuard UDP 443 与 VLESS TCP 443 可以在同一个公网 IP 上共存。若同机网站启用了 HTTP/3 或 QUIC，它也需要 UDP 443，此时必须改用其他端口。

多区域 VLESS 节点可以通过固定订阅地址统一更新。订阅只分发配置，不承载代理流量，也不能分发包含逐设备私钥的 WireGuard 配置。完整的生成、Lambda 部署、客户端导入、令牌轮换和回滚流程见 [用 AWS Lambda 管理 VLESS REALITY 私有订阅](./aws-lambda-vless-reality-subscription)。

## 常见故障定位

### 完全没有握手

依次检查：

```bash
sudo systemctl is-active wg-quick@wg0
sudo ss -lunp | grep ':443'
sudo wg show
```

通常原因是：

- Lightsail 防火墙开成了 TCP 443，而不是 UDP 443。
- 客户端 Endpoint 地址或端口错误。
- 客户端私钥与服务端登记的公钥不匹配。
- 当前网络屏蔽或干扰了目标 UDP 端口。

### 有握手，但不能访问网站

通常检查：

```bash
sysctl net.ipv4.ip_forward
sudo iptables -S FORWARD
sudo iptables -t nat -S POSTROUTING
```

还可以把客户端 DNS 暂时改成 `1.1.1.1` 或 `8.8.8.8`，排除 DNS 问题。

### 能连接，但部分网页偶尔失败

移动网络常见原因是路径 MTU。本文已经使用较保守的 `MTU = 1280`；服务端和客户端应保持一致。

### UDP 443 正常，UDP 51820 失败

如果同一个 Peer 只修改 Endpoint 端口后，443 正常而 51820 在官方 WireGuard 和 Shadowrocket 中都失败，基本可排除密钥、服务端和客户端软件问题。这通常是网络路径对 UDP 51820 的端口级过滤或干扰，继续使用 UDP 443 即可；修改 MTU 或 `PersistentKeepalive` 无法修复端口级屏蔽。

### Shadowrocket 显示已连接，但公网 IP 没变化

检查当前是“全局”还是“配置/规则”模式。规则模式不代表所有请求都会经过 VPS。

## 安全与维护

- 每台设备一个 Peer；设备遗失时，只删除对应公钥。
- 不公开分享二维码、私钥或完整客户端配置。
- SSH 只使用密钥认证，并尽量限制 TCP 22 的来源地址。
- 关闭 TCP 80、UDP 51820 等无用端口。
- 定期执行：

```bash
sudo apt update
sudo apt upgrade
sudo wg show
sudo journalctl -u wg-quick@wg0 --since today
```

- CDN 通常不能代理原始 WireGuard UDP 流量，因此不能靠普通 CDN 隐藏 WireGuard 的静态公网 IP。
- 如果 UDP 网络质量不稳定，可在同一台 VPS 上另行部署 VLESS REALITY TCP 443 作为备用。TCP 443 与 WireGuard UDP 443 可以共存。

## 费用控制

Lightsail 套餐包含月度流量额度；超出后，主要针对超额的公网出站流量计费。东京区域的具体额度和单价应以 [AWS Lightsail 定价页](https://aws.amazon.com/lightsail/pricing/) 为准。绑定在运行实例上的 Lightsail 静态 IP 不单独收费，长期未绑定的静态 IP 会产生费用。

建议立即执行：

1. 在 Billing 中启用 Cost Explorer；首次启用后，当月数据通常约 24 小时可见。
2. 创建 AWS Budget，例如按月设置一个略高于实例套餐价格的预算。
3. 同时设置实际费用和预测费用邮件提醒。
4. 不再使用时，删除实例、快照及未绑定静态 IP，单纯停止实例并不会停止实例费用。

相关文档：

- [启用 Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-enable.html)
- [创建 AWS 成本预算](https://docs.aws.amazon.com/cost-management/latest/userguide/create-cost-budget.html)
- [Lightsail 数据传输说明](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-faq-data-transfer-allowance.html)

## 附录：保留内部 UDP 51820，同时增加公网 UDP 443

已有 WireGuard 服务监听 UDP 51820 时，可以不改现有配置，用服务器端端口重定向增加 UDP 443 入口：

```bash
sudo iptables -t nat -A PREROUTING \
  -p udp --dport 443 \
  -j REDIRECT --to-ports 51820
```

客户端 Endpoint 使用：

```text
<静态公网 IPv4>:443
```

服务端仍会显示监听 51820，这是正常现象。若要永久保留此规则，可把以下内容加入 `wg0.conf` 的 `[Interface]`：

```ini
PostUp = iptables -t nat -C PREROUTING -p udp --dport 443 -j REDIRECT --to-ports 51820 || iptables -t nat -A PREROUTING -p udp --dport 443 -j REDIRECT --to-ports 51820
PostDown = iptables -t nat -D PREROUTING -p udp --dport 443 -j REDIRECT --to-ports 51820 || true
```

新部署不需要这层重定向，直接让 WireGuard 监听 UDP 443 更简单。

## 参考资料

- [Amazon Lightsail 创建 Linux 实例](https://docs.aws.amazon.com/lightsail/latest/userguide/getting-started-with-amazon-lightsail.html)
- [Amazon Lightsail 静态 IP](https://docs.aws.amazon.com/lightsail/latest/userguide/lightsail-create-static-ip.html)
- [Amazon Lightsail 防火墙](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-firewall-and-port-mappings-in-amazon-lightsail.html)
- [AWS CLI: open-instance-public-ports](https://docs.aws.amazon.com/cli/latest/reference/lightsail/open-instance-public-ports.html)
- [WireGuard Quick Start](https://www.wireguard.com/quickstart/)
