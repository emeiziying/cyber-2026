# 附件 D：DeepSeek Harness 定位与适用性分析

> **所属报告：** [公司 Agent 技术现状、需求与平台演进规划](../unified-agent-platform-selection-report)
> **资料快照：** 2026-08-21
> **附件性质：** 端侧候选技术分析，不构成中心平台或端侧 Runtime 选型结论

---

## 当前定位

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 是 TypeScript/Node.js 和 Cordis 插件架构的 Agent Harness。它提供 Python SDK，但底层仍启动 Node Runtime。[Python SDK](https://github.com/deepseek-ai/deepseek-harness/blob/master/python/README.md)、[Runtime 载体](https://github.com/deepseek-ai/deepseek-harness/blob/master/python/sdk-runtime/README.md)

官方标注为 [Developer Preview](https://github.com/deepseek-ai/deepseek-harness#developer-preview)。截至资料快照日，最新版本为 [v0.1.0-rc.8 预发布版](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.0-rc.8)，仍可能发生兼容性破坏。

它与未来桌面 Agent 的需求有一定匹配：处理获授权的本地文件、调用受控本地能力、进行用户确认，并作为中心平台管理下的端侧节点。但这只构成定向研究理由，不构成端侧选型结论。

## 为什么不作为中心平台

- 底层 Web Server 没有 TLS 和认证；API carrier 提供 Host 与 Origin 可达性围栏，但它不是身份认证。
- 当前公开资料不能证明完整企业 SSO、RBAC、多租户、设备管理和集群高可用。
- 原生 `SandboxMode` 只控制文件写入是否落盘，并不限制读取、网络或进程可见性；真正的读取隔离仍需低权限账号、容器或操作系统策略。
- 端侧产品仍需设备注册、软件签名、升级、回滚、远程停用和终端响应。

官方边界见 [Web Server](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/web-server.md)、[Sandbox](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/sandbox.md)、[连接边界](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/connection/README.md)和 [Gateway 限制](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/host/apiproxy/README.md)。

## 分阶段验证边界

| 阶段 | 建议验证范围 | 进入下一阶段前需要证明 |
|------|--------------|--------------------------|
| 合成数据可行性研究 | 合成数据或经数据责任人批准的公开语料；业务工具仅暴露指定目录；由低权限账号、容器或操作系统策略强制读取隔离；本地控制面仅监听回环地址；禁止 Shell、写入和业务写工具 | 正向对照成功，路径逃逸、恶意文档、外网绕过、未授权本地控制面访问、凭据撤销、审计、重启、安装签名和回滚等攻击尝试全部被阻断 |
| 受限真实数据验证 | 仅限经过评审的用户、受管设备、目录、用途和时限；只读；读取范围由独立低权限账号或容器强制；数据最小化；短期凭据；本地控制面由公司认证代理或受管壳层与进程隔离保护；控制面凭据与业务凭据分离；禁止非回环监听 | 合成阶段通过；完成数据与安全评审；正向对照成功；未授权本地进程调用、控制面访问、外传、越界和凭据重放全部被阻断；设备、版本、加密、撤销、审计和应急停用通过 |
| 写入或交易能力 | 不属于当前端侧研究范围 | 重新进行威胁建模，并作为独立高风险场景评估 |

合成数据验证通过只说明候选具备继续评估真实数据场景的条件。出现越界访问、审计缺口或撤销失效时应停止验证；真实数据验证通过也不能外推到 Shell、跨目录写入或交易权限。
