# 附件 D：服务端 Agent 平台与端侧 Agent 能力覆盖矩阵

> **所属报告：** [公司 Agent 技术现状、需求与平台演进规划](../unified-agent-platform-selection-report)
> **资料快照：** 2026-08-24
> **附件性质：** 功能边界与开源覆盖分析；不构成最终 shortlist、采购或生产上线结论
> **判断口径：** “开源覆盖”只表示项目已提供可复用能力，不表示已经满足公司的业务授权、审计和生产治理要求

本附件选择与服务端、端侧能力边界直接相关的代表项目，不重复收录主报告中的全部候选清单。

---

## 使用说明

- 主报告是当前决策与规划的唯一入口；本附件只回答“需要哪些能力、代表项目覆盖到哪里、哪些责任仍由公司掌握”。
- 服务端平台面向多个业务系统提供统一服务，端侧 Agent 在员工电脑上调用本地文件、应用和工具，两条路线分别评估。
- 项目分类描述主要交付物；下图中的 Runtime 是架构装配角色，可由应用平台、Framework 服务或 Workflow Runtime 承担。
- “代表项目未覆盖”只限本附件核验的候选范围，不外推为整个开源生态都不存在该能力。

~~~text
公司 Agent 控制面
├─ 服务端统一 Agent API → 应用平台 / Framework 服务 / Workflow Runtime
└─ 端侧管理接口       → 端侧 Harness / Runtime
~~~

控制面可以统一身份、Agent 目录、模型、知识、工具、策略和审计原则；服务端与端侧的运行方式、安全边界和发布方式不同，不应为追求技术统一而使用同一个 Runtime。

---

## 服务端 Agent 平台需要实现的功能

| 能力 | 最小实现内容 | 主要责任 | 开源复用判断 |
|------|--------------|----------|--------------|
| 统一入口 | Agent 注册、版本与发布；Run、会话、SSE、取消和幂等 API | 公司控制面 | Runtime 可提供基础 API，公司仍应掌握稳定对外合同 |
| 身份与资源授权 | 绑定用户、租户、业务系统、Agent、知识、工具和业务对象 | 公司控制面与业务后端 | 平台 RBAC 只能复用一部分，不能替代业务对象级授权 |
| 模型治理 | 模型目录、凭据隔离、路由、降级、配额、成本和数据分级 | 公司模型网关或控制面 | 可复用模型适配器，不应把公司模型凭据下发给业务前端或模型 |
| 知识治理 | 采集、索引、检索、版本、ACL、来源和引用 | 公司知识访问门与 Runtime | 可复用 RAG 引擎；知识范围必须由可信服务端上下文决定 |
| Tool 与 MCP | 工具目录、白名单、短期委托、逐次授权、超时和幂等 | 公司控制面、MCP 与业务后端 | 可复用 MCP Client/Server；每次调用仍须重新授权 |
| Agent Runtime | Agent loop、结构化输出、Workflow、多 Agent 和人工介入 | 候选开源 Runtime | 优先复用，不自研通用 Agent loop 或画布 |
| 状态与恢复 | 会话、Run 状态、检查点、后台任务、重试、断线重连和人工恢复 | Runtime 与公司控制面 | Runtime 可保存执行状态；公司仍需维护跨 Runtime 的业务状态合同 |
| Run 账本 | 调用主体、Agent、资源、策略和版本、状态、幂等键及上游引用 | 公司控制面 | Runtime 历史记录不等于公司 Run 账本 |
| 输出治理 | 生成面向客户端的事件白名单，移除推理、工具原始参数、内部地址和敏感字段 | 统一 Agent API / BFF | Prompt 脱敏和 Runtime 日志配置不能替代安全输出投影 |
| 审计与可观测 | 业务审计、Trace、日志、指标、成本、质量评测和告警 | 公司控制面、业务后端与 Runtime | Trace 可大量复用，但 Trace 不等于不可抵赖的业务审计 |
| 开发工作台 | Prompt、流程、调试、Trace、数据集、评测和版本比较 | Runtime 或配套开源工具 | 优先复用，避免公司先自研通用 Studio |
| 生产运维 | 环境隔离、部署、扩缩容、灰度、容灾、升级和回滚 | 公司平台与基础设施 | 可复用容器和部署能力，生产责任不能外包给框架默认配置 |

### 四个容易混淆的边界

- Runtime 的会话和运行历史不等于公司 Run 账本。
- Trace、日志和 Token 成本不等于业务审计。
- 平台工作区或 RBAC 不等于对业务资源标识所指对象的最终授权。
- Prompt 中的“不要输出敏感信息”不等于服务端事件白名单和字段裁剪。

---

## 服务端开源项目覆盖范围

下表描述各项目最值得复用的能力和仍需补齐的边界，不做脱离工作负载的总排名。

| 项目 | 定位 | 开源版本重点覆盖 | 仍需公司补齐或单独核验 | 适用场景 |
|------|------|------------------|--------------------------|----------|
| [Dify](https://github.com/langgenius/dify) | 低代码 AI 应用平台 | 可视化 Agent/Workflow、RAG、模型与插件、应用 API、会话和运行日志 | 业务资源授权、公司 Run 账本、安全 SSE；许可证明确限制未经书面授权运营多租户环境，且多工作区、SSO 和高级治理存在 Enterprise 边界 | 问答、RAG 和标准流程 |
| [Mastra](https://github.com/mastra-ai/mastra) | TypeScript 代码优先 Runtime | Agent、Workflow、MCP、Memory、Server API、Studio、Trace、Eval 和耐久执行基础 | 业务 ACL、公司 Run 账本和安全输出；核心主要为 Apache-2.0，`ee/` 目录的功能受 Enterprise License 约束，生产使用须按 Edition 核验 | 复杂 TypeScript Agent 服务 |
| [Agno](https://github.com/agno-agi/agno) / AgentOS | Python 平台型 Runtime | Agent、Team、Workflow、FastAPI、SSE/WS、MCP、知识、记忆、后台任务、检查点、人工介入，以及开源 Runtime 中的 JWT/RBAC、多用户和多租户能力 | 业务资源授权、对外合同、公司账本和安全输出；Hosted 浏览器 Control Plane 与开源 Runtime、Agent UI 需分别核验 | Python 平台型 Runtime |
| [LangGraph](https://github.com/langchain-ai/langgraph) | 耐久工作流 Runtime | 状态图、多 Agent 编排、检查点、持久化、Interrupt、人工介入和流式执行 | 统一 API、RAG 管理、业务前端和企业控制面需组合；Studio、部署与评测需区分开源和 LangSmith | 长任务、审批和复杂状态流程 |
| [Langflow](https://github.com/langflow-ai/langflow) | Python 可视化开发与 Runtime | 可视化 Flow、Agent、多 Agent、API、MCP Client/Server、Memory、人工介入和 Trace | 业务授权、公司账本和安全输出；OSS 授权强制仍需集成或扩展 | 可视化开发和 Python Runtime |
| [Coze Studio](https://github.com/coze-dev/coze-studio) | 一体化低代码平台 | Agent、App、Workflow、RAG、Plugin、模型、OpenAPI 和 Chat SDK | 企业组织、工作空间、多人协作、审计和安全加固存在商业或自建边界 | 单团队 PoC 和低代码产品体验参考 |
| [CrewAI](https://github.com/crewAIInc/crewAI) | 多 Agent 与 Flow 引擎 | Crew、Flow、角色、委派、工具和多 Agent 编排 | 统一 API/BFF、业务授权和公司账本；完整控制台、部署和企业观测需区分 AMP | 多角色业务自动化引擎 |
| [PydanticAI](https://github.com/pydantic/pydantic-ai) | Python 类型化 Agent 框架 | 类型化 Agent、结构化输出、Tool、MCP、多 Agent 模式和耐久执行集成 | 完整应用 Studio、企业控制面和平台 API 需公司组装 | Python Agent 服务层，不是现成平台产品 |
| [Flowise](https://github.com/FlowiseAI/Flowise) | 已归档的可视化平台 | 历史版本覆盖 Agentflow、Workflow、RAG、HITL 和运行部署 | 官方公告 2026-07-29 code freeze，仓库已于 2026-08-13 归档，并给出 2026-08-31 EOL 日期 | 仅作历史参考，不进入绿地 shortlist |

### 服务端矩阵解读

- Dify 一类应用平台主要覆盖问答、RAG、标准流程和应用发布。
- Mastra、Agno、LangGraph、Langflow 和 PydanticAI 等路线主要覆盖代码编排、复杂流程或工作流 Runtime，完整服务方案仍需组合公司控制面。
- CrewAI、LangGraph、Agno 等项目提供多 Agent 编排能力，但不替代证据归一化、确定性聚合、风控和最终执行。
- 各路线都不能以 Runtime 默认行为替代统一 Agent API、业务资源授权、Run 账本、安全输出和业务审计。

---

## 端侧 Agent 需要实现的功能

| 能力 | 最小实现内容 | 主要责任 | 开源复用判断 |
|------|--------------|----------|--------------|
| 本地 Runtime | Agent loop、流式交互、后台任务、本地会话和恢复 | 端侧 Runtime | 候选项目已有较多基础能力，可优先复用 |
| 端侧 UI | 桌面、Web 或 TUI；运行轨迹、授权提示和状态展示 | 端侧 Runtime 与公司端侧 Shell | 可复用候选 UI，但需统一公司品牌、登录和安全提示 |
| 多业务 Agent | 按业务装配 Prompt、Skill、Tool、模型和权限的 Preset 或 Profile | 公司目录与端侧 Runtime | 可复用预设和插件机制，配置必须签名并可撤销 |
| 本地工具 | 文件、Shell、浏览器、桌面应用、本地 API 和 MCP | 端侧 Runtime | 工具容易复用，权限范围和审计必须由公司策略约束 |
| 本地上下文 | 文档、项目知识、会话记忆、索引和离线缓存 | 端侧 Runtime | 候选普遍有会话，通用本地 RAG 通常仍需组合 |
| 隔离与审批 | 文件、进程、网络、浏览器隔离；高风险操作逐次确认 | 公司安全策略与端侧 Runtime | “询问用户”不等于真实沙箱，必须做对抗验证 |
| 凭据安全 | OS Keychain、短期令牌或凭据代理，使 Agent 进程不能读取长期凭据 | 公司控制面与端侧 Shell | 多数候选覆盖不足，不能只依赖文件权限 |
| 企业身份 | 员工登录、SSO、设备身份、注册和设备证明 | 公司控制面 | 候选普遍缺失，是企业端侧产品的核心自建项 |
| 中央策略 | 下发签名的 Agent、Skill、Tool、模型和权限策略，支持过期和远程撤销 | 公司控制面 | 候选插件系统不能替代可信策略分发 |
| 审计回传 | 本地脱敏、断网缓冲、补传、去重和保留期限 | 公司控制面与端侧 Shell | 会话日志和遥测可复用，但不能直接上传完整原始轨迹 |
| 分发与升级 | 签名安装包、版本锁定、灰度、强制升级和快速回滚 | 公司端侧平台 | 候选发布包只能作为基础，企业发布链路仍需建设 |
| 离线与弱网 | 本地模型、策略缓存、断点续跑和策略过期后的失败关闭 | 端侧 Runtime 与公司控制面 | 可复用本地运行能力，安全策略失联行为必须自行定义 |

---

## 端侧开源项目覆盖范围

| 项目 | 定位 | 开源版本重点覆盖 | 企业端侧主要缺口 | 适用参考 |
|------|------|------------------|--------------------|----------|
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | Developer Preview 的插件化端侧 Agent Runtime | Web、Headless、ACP、SDK、多个 Agent Preset、Plugin、Skill、Tool、MCP、Session、审批和基础 Sandbox | 企业登录、设备身份、中央策略、远程撤销、凭据代理、脱敏审计、签名分发；WebServer 不能直接视为企业平台 API | 端侧 Runtime 研究对象，不作为中心平台基座 |
| [pi](https://github.com/earendil-works/pi) | 极简本地 Coding Agent 内核与 CLI | 多模型 API、Agent Core、状态、TUI、Skill、Extension 和会话树 | 官方不内置权限系统或 Sandbox；MCP、设备治理、凭据和企业策略需外部建设 | 轻量内核和扩展机制参考，不是受管企业客户端 |
| [OpenHands](https://github.com/OpenHands/OpenHands) | 软件开发 Agent 产品与 Agent Server | 本地 Browser UI、Agent Server、Session、文件、终端、MCP、Docker Sandbox 和多种客户端 | Coding 场景偏重；多用户、RBAC 和企业治理需核验开源、商业与部署边界 | 完整端侧产品和沙箱架构的重要参考 |
| [OpenCode](https://github.com/anomalyco/opencode) | 本地 Coding Agent TUI、桌面端与 Server | TUI、Desktop、自定义 Agent/Subagent、Skill、MCP、权限提示和 OpenAPI Server | 官方明确权限提示不是硬沙箱；企业 SSO、中央配置、设备和凭据治理不足 | 客户端体验、扩展和 API 架构参考 |

### 端侧覆盖判断

- 本附件核验的代表候选能较好复用本地 Runtime、Session、Tool、插件、UI 和部分 Sandbox，但尚未发现完整覆盖企业端侧治理的开源版本。
- DeepSeek Harness 支持多个 Agent Preset，不代表已经具备面向业务系统的稳定企业平台 API；其当前 WebServer 仍需认证、TLS、来源策略和版本稳定性核验。
- `pi` 和 OpenCode 的权限提示不能作为安全隔离证明；OpenHands 的容器沙箱值得参考，但仍要验证公司业务所需的身份、策略和审计边界。

---

## 能力归属汇总

本节展开主报告中的职责边界，不发布新的候选路线。“公司自建或掌握”不等于全部从零开发：Gateway、IAM、MDM、OS Keychain、日志和发布系统均可复用现有平台或原生能力；关键是接口合同、策略、数据和运营责任由公司掌握。

### 服务端 Agent 平台

**公司自建或掌握：**

- Gateway 后的统一 Agent API / BFF；
- 可信身份、租户与业务资源绑定；
- Run 账本、幂等、取消、恢复和必要的 Runtime 适配；
- MCP 逐次授权、短期委托与业务后端最终权限；
- 面向客户端的安全事件白名单、业务审计和运营指标。

**优先复用：**

- 通用 Agent loop、模型适配、Workflow 和多 Agent 编排；
- RAG、Memory、MCP SDK、Trace、Eval 和开发 Studio；
- 通用容器部署和开源可观测组件。

### 端侧 Agent

**公司自建或掌握：**

- 企业登录、设备注册与设备状态；
- 签名的 Agent、Skill、Tool、模型和权限策略；
- OS Keychain、短期凭据代理与远程撤销；
- 脱敏审计、离线补传和保留策略；
- 签名安装、灰度升级、强制更新和回滚。

**优先复用：**

- 本地 Agent Runtime、Session 和基础 UI；
- 文件、终端、浏览器、MCP 和插件机制；
- 逐次审批与已有沙箱基础，但须经过公司安全验证。

---

## 资料与复核

当前决策、路线与触发条件以[主报告](../unified-agent-platform-selection-report)为准；项目官方资料统一收录在[附件 C](./appendix-c-evidence-sources)。候选进入 shortlist 后，再固定版本、Edition 和部署形态，并分别核验四个证据门。
