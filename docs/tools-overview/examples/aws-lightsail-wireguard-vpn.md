# 使用 AWS Lightsail 搭建 WireGuard VPN

> 适用场景：个人设备安全访问公网、公共 Wi-Fi 加密和远程访问。请遵守所在地法律、AWS 服务条款及目标网站规则。
> 本文以东京区域、Ubuntu 24.04、WireGuard UDP 443 和 IPv4 全局隧道为例。文中的公网 IP 与密钥均为占位符。

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
- 使用 UDP 443 能避开部分网络对非常用 UDP 端口的限制。
- UDP 443 与网站或 VLESS 使用的 TCP 443 不冲突，因为协议不同。

本方案只转发 IPv4。若需要完整 IPv6 隧道，应额外配置服务器 IPv6 转发，而不是简单把 `::/0` 加进客户端配置。

## 创建 Lightsail 实例

打开 [Amazon Lightsail 控制台](https://lightsail.aws.amazon.com/)：

1. 选择“创建实例”。
2. 区域选择“东京”，即 `ap-northeast-1`。
3. 平台选择 Linux/Unix。
4. 蓝图选择 Ubuntu 24.04 LTS。
5. 个人轻量使用可从最低双栈 IPv4 套餐开始，实际价格和流量额度以控制台为准。
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

关闭不使用的 TCP 80、UDP 51820 等端口。Lightsail 的 IPv4 和 IPv6 防火墙相互独立；本文客户端通过静态 IPv4 连接，只需要配置 IPv4 防火墙。参见 [AWS Lightsail 防火墙文档](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-firewall-and-port-mappings-in-amazon-lightsail.html)。

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
sudo apt install -y wireguard qrencode
sudo install -d -m 700 /etc/wireguard/clients
```

生成服务器密钥和第一台客户端的独立密钥：

```bash
sudo sh -c '
  umask 077
  wg genkey > /etc/wireguard/server.key
  wg pubkey < /etc/wireguard/server.key > /etc/wireguard/server.pub
  wg genkey > /etc/wireguard/clients/phone.key
  wg pubkey < /etc/wireguard/clients/phone.key > /etc/wireguard/clients/phone.pub
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

下面的命令会自动读取密钥和默认公网网卡名称，不会把私钥输出到终端：

```bash
SERVER_PRIVATE_KEY=$(sudo cat /etc/wireguard/server.key)
PHONE_PUBLIC_KEY=$(sudo cat /etc/wireguard/clients/phone.pub)
PUBLIC_IF=$(ip route show default | awk '/default/ {print $5; exit}')

sudo tee /etc/wireguard/wg0.conf >/dev/null <<EOF
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

sudo chmod 600 /etc/wireguard/wg0.conf
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
sudo wg-quick strip wg0 >/dev/null
sudo systemctl restart wg-quick@wg0
```

## 生成客户端配置和二维码

先取得实例的静态公网 IPv4：

```bash
SERVER_IP=$(curl -4 -fsS https://checkip.amazonaws.com)
SERVER_PUBLIC_KEY=$(sudo cat /etc/wireguard/server.pub)
PHONE_PRIVATE_KEY=$(sudo cat /etc/wireguard/clients/phone.key)

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
```

用官方 WireGuard 客户端扫描：

1. 点击“添加隧道”。
2. 选择“从二维码创建”。
3. 保存并打开隧道。

Shadowrocket 也可以扫描此二维码导入 WireGuard 节点。测试是否所有流量都经过 VPS 时，应临时切换到全局代理；在“配置/规则模式”下，只有命中规则的请求才走节点。

二维码和 `phone.conf` 都包含客户端私钥，不能公开发送。导入并确认备份后，可以从服务器删除客户端私钥配置：

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

显示结果应与 Lightsail 静态 IPv4 一致。还应分别测试 DNS、Google、ChatGPT 和常用网站，不能只依赖客户端里的“连通性测试”。

## 增加第二台设备

不要让多台设备长期共用同一个私钥。为第二台设备生成新密钥，并分配 `10.66.66.3`：

```bash
sudo sh -c '
  umask 077
  wg genkey > /etc/wireguard/clients/phone2.key
  wg pubkey < /etc/wireguard/clients/phone2.key > /etc/wireguard/clients/phone2.pub
'

PHONE2_PUBLIC_KEY=$(sudo cat /etc/wireguard/clients/phone2.pub)

sudo tee -a /etc/wireguard/wg0.conf >/dev/null <<EOF

[Peer]
PublicKey = ${PHONE2_PUBLIC_KEY}
AllowedIPs = 10.66.66.3/32
EOF

sudo wg set wg0 \
  peer "$PHONE2_PUBLIC_KEY" \
  allowed-ips 10.66.66.3/32
```

随后按上一节生成客户端配置，把地址改为 `10.66.66.3/32`。端口、公网 IP 和服务器公钥保持不变。

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
