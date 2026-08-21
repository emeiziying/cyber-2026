# Agent 技术栈选型：平台、框架、编排与 Harness 怎么分

> **资料快照：** 2026-08-20
> **证据范围：** 官方文档、官方仓库和许可证；除非特别标记，项目能力与边界默认是文档证据（D），不代表已经完成 POC 或生产验证
> **本文目标：** 建立可复用的分类和决策基线，而不是给所有项目排一个总榜

---

## 先看结论

Agent 项目不能只按功能多少比较。Dify、LangGraph 和 Pi 虽然都能运行 Agent，但分别主要解决业务应用发布、持久化状态编排和终端 Coding Agent Harness，彼此不是同层替代品。

更稳妥的选型顺序是：

1. 先确定要交付的是业务应用、后端 Agent、持久工作流、多 Agent 自动化，还是 Coding Agent
2. 用部署、许可证、安全和耐久执行等硬门槛过滤候选
3. 只在同一赛道内评分
4. 每个赛道最多选 2～3 个候选做同输入、同模型、同工具的 POC
5. 最后形成带切换条件的 ADR，而不是宣布一个永久赢家

当前只能先形成候选路由，不能形成生产排名：

- 需要业务应用发布和运营时考察 Dify；需要受信开发团队使用的可编程可视化 IDE / Runtime 时考察 Langflow
- Python 后端强调类型安全和结构化输出时，优先考察 PydanticAI；需要显式状态图和中断恢复时，单独考察 LangGraph
- TypeScript 团队建设代码优先的通用 Agent 服务时，优先比较 Mastra 与 VoltAgent
- 角色分工本身就是业务模型时，再比较 CrewAI、Microsoft Agent Framework 等多 Agent 方案
- 构建终端 Coding Agent 时，先根据模型锁定、LangGraph 依赖和插件化要求，从 Pi、DeepSeek Harness、Claude Agent SDK、Deep Agents 中筛到最多两个 POC 候选
- Flowise、AutoGen、LlamaIndexTS 和 SWE-agent 已出现停止维护、继任或研发重心转移，不应继续按普通绿地候选打分

---

## 先统一分类口径

下面的分类描述项目的**主要交付物**，不是互斥的技术层级。一个项目可以同时覆盖多个位置，但选型时必须先明确它主要替团队承担哪部分责任。

| 类别 | 主要交付物 | 典型项目 |
|------|------------|----------|
| 应用层 SDK | 模型调用、流式 UI、工具接口等应用能力 | Vercel AI SDK |
| Agent SDK / Framework | Agent loop、模型与工具抽象、结构化输出 | LangChain、PydanticAI、OpenAI Agents SDK、Google ADK |
| Workflow Runtime | 状态图、检查点、暂停恢复、长任务控制 | LangGraph、Microsoft Agent Framework |
| Agent Harness | Agent loop、上下文、工具、会话和可扩展运行骨架；审批、沙箱等能力因项目而异 | Pi、DeepSeek Harness、Claude Agent SDK、Deep Agents |
| 垂直 Agent 产品 | 面向具体任务直接交付 CLI、Web 或工作区产品 | OpenHands、mini-swe-agent |
| 应用平台 / 控制面 | 应用发布、运行服务、运营、身份权限、观测和部署 | Dify（具体能力取决于版本）、Agno AgentOS；部分能力也由 Mastra、VoltAgent 的商业平台提供 |

```text
业务使用者
    │
    ├── 业务 Agent 应用平台：Dify
    ├── 可视化开发环境：Langflow
    ├── Coding Agent 产品：OpenHands
    │
应用与服务层
    ├── TypeScript 应用 SDK：Vercel AI SDK
    ├── Agent Framework：LangChain / PydanticAI / Mastra / CrewAI
    ├── Durable Runtime：LangGraph / Microsoft Agent Framework
    └── Agent Harness：Pi / DeepSeek Harness / Claude Agent SDK / Deep Agents
         │
         └── 模型、工具、MCP、存储、沙箱与宿主基础设施
```

三个概念尤其不能混淆：

- 保存会话历史，不等于任务能在进程崩溃后从步骤检查点恢复
- 工具审批，不等于文件、进程和网络已经处于强隔离沙箱
- 提供 HTTP Server，不等于已经具备多租户、RBAC、审计和高可用控制面

### 四项能力的最低验收语义

| 能力 | 至少要验证什么 |
|------|----------------|
| Durable execution | 状态落盘、进程重启后恢复位置、重试语义、重复副作用与幂等处理 |
| 人工审批 | 审批人身份、授权策略、审计记录、超时/拒绝以及审批后的安全恢复；只有 interrupt 不算完整审批 |
| 强沙箱 | 先定义攻击者和受保护资产，再分别验证文件、进程、网络、凭证和宿主逃逸边界 |
| 控制面 | 身份、租户、RBAC、审计、配置/版本、运行状态和运维入口；只有 Web UI 或 Server 不算完整控制面 |

---

## 核心候选定位

以下九个项目是用户最初点名、因此优先展开的候选，不代表它们属于同一赛道，也不代表邻近项目不可以进入后续 shortlist。`初步角色` 只是进入 POC 前的分类，不是最终中标结论。

真正进入评分表的比较单元应写成：`项目 + 版本/commit + OSS/Enterprise 版本 + 部署形态 + 外接组件`。不能用一个品牌名同时代表 OSS Core、Cloud、Enterprise 和宿主自建能力。

| 项目 | 主定位 | 原生负责 | 不应误认为 | 初步角色 |
|------|--------|----------|------------|----------|
| [Dify](https://github.com/langgenius/dify) | 低代码 LLM / Agent 应用开发与发布平台 | Workflow、Chatflow、RAG、Agent、插件、WebApp/API、日志监控 | 轻量嵌入式 Agent SDK | 业务应用平台候选 |
| [Langflow](https://docs.langflow.org/) | Python 可视化 AI 开发 IDE + Runtime | 组件画布、Agent/RAG 组件、自定义 Python 组件、API、MCP | 开箱即用的不可信多租户执行平台 | 可视化开发候选 |
| [LangChain](https://docs.langchain.com/oss/python/langchain/overview) | Python / TS Agent Framework 与最小 Harness | 模型与工具抽象、Agent loop、Middleware、结构化输出、流式响应 | 业务应用控制面或复杂持久工作流引擎 | 通用代码框架候选 |
| [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) | 低层状态化 Agent 编排 Runtime | 状态图、检查点、interrupt/resume、time travel、子图 | Dify 式应用平台 | Durable Workflow 候选 |
| [Mastra](https://github.com/mastra-ai/mastra) | TypeScript Agent Framework + Workflow Runtime + Server | Agent、Tool、MCP、Memory、Workflow、Server、Studio | 纯 OSS 即具备完整企业多租户治理 | TS 平台栈候选 |
| [PydanticAI](https://pydantic.dev/docs/ai/overview/) | 类型安全的 Python Agent SDK / Harness | 依赖注入、结构化输出、工具、Agent loop、Graph、评测接口 | 自带部署集群、RBAC 和耐久任务基础设施 | Python 后端候选 |
| [CrewAI](https://docs.crewai.com/) | 角色与任务驱动的多 Agent 自动化框架 | Crews、Flows、委派、状态、人工反馈 | 所有业务 Agent 的默认架构 | 多 Agent 自动化候选 |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | Everything-is-a-plugin 的 Agent Harness / Runtime | Cordis Plugin、模型、工具、Preset、持久化、审批、沙箱、本地 Web | 已稳定的企业多租户平台 | Harness 挑战者；开发者预览 |
| [Pi](https://github.com/earendil-works/pi) | 极简终端 Coding Agent Harness + 可嵌入 Runtime | 多模型 API、Agent loop、CLI/TUI、Extension、Skill、SDK/RPC | 业务平台、耐久工作流或默认强沙箱 | 极简 Coding Harness 候选 |

### 生产边界速查

| 项目 | 持久执行 | 控制面 | 安全与隔离边界 |
|------|----------|--------|----------------|
| Dify | 平台工作流与会话持久化；具体失败恢复需按节点和部署验证 | Community 有应用管理；多 Workspace、SSO、HA 等看 Enterprise | Community 与 Enterprise 能力和许可证必须分别核对 |
| Langflow | 可部署 Flow Runtime；不按通用 durable queue 计算 | 有 IDE、API 和认证接口，不等于完整租户治理 | 自定义组件可执行宿主代码；多租户需进程、网络、存储和授权插件隔离 |
| LangChain | Agent memory / HITL；复杂恢复依赖底层 LangGraph | 部署、追踪和评测主要由独立 LangSmith 承担 | 工具权限、身份和租户由宿主应用负责 |
| LangGraph | 原生 checkpoint、interrupt/resume 和步骤恢复 | OSS 是 Runtime；Agent Server、部署和运营面需自建或使用 LangSmith | 业务授权、工具隔离和租户治理仍属于宿主边界 |
| Mastra | Workflow 支持 suspend/resume 与存储快照 | 有 Server、Studio、Cloud；企业 RBAC/ACL 需核对商业边界 | LocalSandbox 不是强隔离；生产代码执行应使用远端沙箱或容器 |
| PydanticAI | 可接 Temporal、DBOS、Prefect、Restate 等耐久引擎 | SDK 本身没有部署和租户控制面 | 输入、身份、工具权限和基础设施由宿主负责 |
| CrewAI | Flow 可持久化和恢复，需用目标存储做故障验证 | 托管部署与企业治理属于 CrewAI AMP | 角色自治会提高调试与权限分析成本 |
| DeepSeek Harness | 会话 resume/fork；不能据此推导业务工作流步骤级恢复 | 本地 Web / Headless / SDK；原生 Web Server 无 TLS、认证和 Origin Policy | OS sandbox、审批、网络和进程边界需分别验证 |
| Pi | 会话落盘、恢复和上下文压缩；没有通用 DAG / durable queue | CLI、JSON、RPC、SDK；没有生产控制面 | 官方明确没有内置权限系统或强沙箱，默认继承启动进程权限 |

---

## 分赛道比较

### 可视化与低代码：Dify、Langflow、Flowise

| 项目 | 更适合 | 主要门槛 | 当前建议 |
|------|--------|----------|----------|
| Dify | 业务人员参与配置的 Agent、RAG、Workflow 和应用发布 | [Dify Open Source License](https://github.com/langgenius/dify/blob/main/LICENSE) 带额外条件；Community 与 Enterprise 的 Workspace、SSO、HA 和治理能力不同 | 进入业务平台 POC，先过许可证与部署门槛 |
| Langflow | 受信开发团队进行可视化原型、自定义 Python 组件并部署 Flow Runtime | 官方将其视为代码执行平台；OSS RBAC 默认不能当成完整租户策略 | 作为可视化开发挑战者，不直接公网暴露共享 IDE |
| Flowise | 仅适合既有系统迁移评估或自行维护 fork | 官方已停止功能开发，仓库于 2026-08-10 归档，并计划于 2026-08-31 EOL | 绿地项目直接 Rejected，参见[停止运营公告](https://flowiseai.com/sunset) |

Dify 和 Langflow 虽然都提供可视化界面，但评价重点不同：Dify 更接近业务应用开发、发布和运营平台；Langflow 更接近可编程的可视化开发 IDE 与 Runtime。只有当决策问题明确包含这两种交付方式时，才比较完整方案的建设成本；不要把两者的品牌功能直接放入同一总分。

### Python Agent 后端：LangChain、PydanticAI、LangGraph

| 决策问题 | LangChain | PydanticAI | LangGraph |
|----------|-----------|------------|-----------|
| 首要价值 | 广泛集成、Middleware 和通用 Agent Framework | 类型安全、依赖注入、结构化输出和可测试后端 | 显式状态图、检查点、暂停恢复和长任务控制 |
| 主要抽象 | `create_agent` + Tool + Middleware | Agent + Dependency + structured output + Tool | State + Node + Edge + Checkpointer |
| 耐久执行 | 复杂任务底层使用 LangGraph | 对接外部 durable engine | 原生核心能力 |
| 应用控制面 | 无；可组合 LangSmith | 无；宿主负责 | 无；可自建或组合 LangSmith |
| 更适合 | 需要大量现成集成和标准 Agent loop | 强 schema、强类型、后端服务化 | 可恢复审批、长任务和复杂状态机 |

三者不一定三选一。常见组合是用 LangChain 提供模型和工具集成、LangGraph 承担状态编排；PydanticAI 则更适合以 Python 类型契约为中心的独立后端。

### TypeScript Agent 栈：Mastra、VoltAgent、Vercel AI SDK

| 项目 | 主责任 | Workflow / Server | 关键边界 |
|------|--------|-------------------|----------|
| [Mastra](https://mastra.ai/) | 通用 Agent、RAG、类型化 Workflow 和独立服务 | 原生 Workflow、Storage、Server、Studio，并可接 Mastra Cloud | Core 为 Apache-2.0，企业目录另有许可证；LocalSandbox 不按强隔离计算 |
| [VoltAgent](https://voltagent.dev/) | Agent、Team/Supervisor、Workflow 和可插拔 API Server | Workflow 当前仍需关注 Preview 语义；可接 VoltOps Console/Deploy | 默认未启用认证时 API 可能公开；Sandbox 仍需按具体后端验证 |
| [Vercel AI SDK](https://ai-sdk.dev/docs/agents/overview) | Web / TS 应用中的模型、工具、流式 UI 和 Agent 能力 | 普通 Agent 主要是应用进程内循环；组合 Workflow SDK 后才获得耐久恢复 | 它是应用 SDK，不是独立多租户 Agent 平台 |

如果目标是“在已有 Next.js 产品中增加 AI 交互”，先看 Vercel AI SDK；如果目标是“建设独立 Agent 服务和工作流”，再比较 Mastra 与 VoltAgent。

### 多 Agent 与企业工作流：CrewAI、Microsoft Agent Framework、Google ADK

| 项目 | 主要模型 | 适合场景 | 当前边界 |
|------|----------|----------|----------|
| CrewAI | Crew 角色协作 + Flow 确定性流程 | 调研、报告、运营等角色分工明确的业务自动化 | 不要为了“多 Agent”标签拆分原本可由单 Agent 完成的任务 |
| [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/) | Agent + 显式 Workflow，覆盖顺序、并行、handoff、group chat 等模式 | Python / .NET、Azure 集成、需要 checkpoint 和 HITL 的多 Agent 工作流 | Azure 托管和治理能力不属于 OSS 框架本体 |
| [Google ADK](https://adk.dev/) | Agent + graph/dynamic workflow + session service | Gemini / Google Cloud、多语言、A2A 和图工作流 | 不同语言能力成熟度不同；自托管仍需自行承担 IAM 和运维 |

[AutoGen](https://github.com/microsoft/autogen) 已进入维护模式，Microsoft 官方将 Agent Framework 作为继任方向。绿地项目应比较 Agent Framework，而不是继续把 AutoGen 当作长期主选；存量 AutoGen 系统应单独形成迁移计划。

### Coding Agent 与 Harness：Pi、DeepSeek Harness、Claude Agent SDK、Deep Agents、OpenHands

| 项目 | 主定位 | 更适合 | 不适合直接承担 |
|------|--------|--------|----------------|
| Pi | 极简终端 Coding Agent Harness | 定制 CLI/TUI、嵌入自有工具和会话体验 | 业务平台、耐久工作流、多租户 Server、默认强沙箱 |
| DeepSeek Harness | Cordis 插件化 Harness / Runtime | 研究或组装可替换模型、工具、持久化、UI、Preset 的运行体系 | 当前即需稳定 API、生产认证/TLS 和企业控制面 |
| [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) | Claude Code Agent Loop 的 Python / TS SDK | 自托管 Claude Code 级工具、Skill、MCP、权限和会话能力 | 多模型中立方案、通用 DAG、任务队列或自动生成的控制面 |
| [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview) | 基于 LangGraph 的 batteries-included 通用 Harness | 需要规划、文件系统、子 Agent、Skill，并希望继续组合 LangGraph | 不采用 LangGraph/LangSmith，却要求开箱即用生产控制面 |
| [OpenHands](https://github.com/OpenHands/OpenHands) | 软件工程 Agent SDK + Server + CLI/Web/Cloud/Enterprise | 需要远程工作区和完整 Coding Agent 产品 | 通用业务流程平台或轻量嵌入式 SDK |

Pi 与 DeepSeek Harness 最接近“自己造 Coding Agent 的底座”；OpenHands 更接近可直接部署的软件工程 Agent 产品。Claude Agent SDK 和 Deep Agents 位于两者之间：已经提供较完整 Harness 能力，但部署控制面仍需另建或组合官方平台。

[SWE-agent](https://github.com/SWE-agent/SWE-agent) 已进入维护模式并推荐迁移到 [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent)。mini-swe-agent 适合 SWE-bench、教学和最小研究基线，不应被误认为生产 Coding Agent 平台。

---

## 扩展候选雷达

这些项目不需要与核心九项全部同表打分，只在命中特定工作负载时进入对应赛道：

| 项目 | 进入 POC 的条件 | 当前提醒 |
|------|-----------------|----------|
| [LlamaIndex Python](https://github.com/run-llama/llama_index) | 文档处理、复杂检索、RAG 和数据型 Agent 是主要矛盾 | 应用认证、租户和 Web 安全由宿主负责 |
| [LlamaIndexTS](https://github.com/run-llama/LlamaIndexTS) | 不建议进入绿地 POC | 仓库已于 2026-04-30 归档并停止维护 |
| [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) | 需要轻量 Agent loop、handoff、Session 和 OpenAI-first 能力 | 长任务崩溃恢复和控制面依赖外部基础设施 |
| [Agno](https://docs.agno.com/) | 希望同时评估 SDK、AgentOS Runtime、存储、RBAC、租户与运营 UI | Hosted Control Plane、离线部署和商业条款需要单独核验 |
| Microsoft Agent Framework | Microsoft / .NET / Azure 是硬约束 | 作为 AutoGen 的绿地继任者评估 |
| Google ADK | Gemini、Google Cloud、A2A 或多语言是重要约束 | ADK 2.0 有破坏性变化，需锁定语言与版本 |
| VoltAgent | TS 多 Agent、Server 和 VoltOps 组合有吸引力 | Workflow、认证和 Sandbox 必须做目标版本 POC |
| OpenHands | 目标本身就是软件工程 Agent 产品 | 运行栈和隔离成本明显高于嵌入式 Harness |

---

## 先过硬门槛，再评分

以下任一条件不满足，都不应依靠其他高分抵消。核心方案本身无法满足时标记 `Gate-Rejected` 并退出评分；可以由外部组件补齐时标记 `External`，并把该组件、建设成本和验证结果纳入完整方案后重新过门槛：

- 是否允许私有化、内网或离线部署
- OSS 许可证是否允许目标商业模式，企业目录和托管服务是否另有条款
- Python、TypeScript、Java/.NET 或多语言是否为硬约束
- 是否支持目标模型、国内模型和自有 Model Gateway
- 是否要求 MCP、A2A 或现有工具 API
- 是否需要步骤级 checkpoint、跨进程恢复和人工审批
- 是否需要真正隔离文件、Shell、进程、网络和凭证的沙箱
- 是否必须具备多租户、RBAC、SSO、审计和数据隔离
- 是否需要业务人员使用的可视化界面和应用发布能力
- 团队是否愿意承担宿主 API、队列、存储、观测和升级维护成本

许可证必须按具体仓库和目录核对，不能把 Core 的 OSS 许可证外推到 Enterprise、Cloud 或 Control Plane。

---

## 证据和评分规则

### 能力来源

| 标记 | 含义 |
|------|------|
| Native | 核心原生支持 |
| First-party | 官方插件、配套组件或商业产品支持 |
| Third-party | 社区插件支持 |
| External | 需要宿主或其他基础设施实现 |
| Absent | 没有找到可验证实现 |

### 证据等级

| 标记 | 含义 | 能支持的结论 |
|------|------|--------------|
| D | 官方文档声明 | 可以进入候选，不能证明实际可用 |
| C | 源码或配置确认 | 可以确认实现入口，不能证明部署效果 |
| T | 同条件 POC 通过 | 可以支持当前场景的阶段性选择 |
| P | 生产环境验证 | 可以支持组织级默认方案，但仍需记录适用边界 |
| U | 尚未验证 | 不参与优势计分 |

本文当前的项目定位和能力结论均按 D 级处理；许可证文件和源码入口的 C 级核对，也不能证明实际运行效果。评分表中建议写成 `4/T`，表示能力得 4 分且已通过 POC；不要只写一个无法追溯的数字。

### 参考权重

权重必须按赛道调整。下面只是一份企业 Agent 服务的起始模板：

| 维度 | 权重 |
|------|-----:|
| 目标工作负载适配 | 20 |
| 安全、身份和治理 | 20 |
| 持久化与故障恢复 | 15 |
| 模型、工具和协议集成 | 10 |
| 部署与运维复杂度 | 10 |
| 可观测、评测和调试 | 10 |
| 开发体验与学习成本 | 10 |
| 许可证、成本和锁定风险 | 5 |

```text
加权总分 = Σ（单项得分 ÷ 5 × 权重）
```

硬门槛先于总分。一个没有满足许可证或租户隔离要求的项目，不会因为开发体验得 5 分就重新进入候选。

分数锚点建议统一为：

| 分数 | 含义 |
|-----:|------|
| 0 | 不违反硬门槛，但该非必选能力完全缺失 |
| 1 | 主要依赖高成本外接或大量自建 |
| 2 | 部分满足、实验性能力或存在明显限制 |
| 3 | 满足当前场景基线 |
| 4 | 超过基线，并明显降低建设或运行风险 |
| 5 | 对当前工作负载形成经过验证的关键优势 |

证据等级与分数分开记录。`U` 不是 0 分，而是“无法评分”；任何决策性维度仍为 `U` 时，不生成总排名，关键维度至少达到 T 级后才能支持选型结论。上面的参考权重只适用于代码优先的企业 Agent 服务；低代码平台应提高应用生命周期和治理权重，Durable Runtime 应提高恢复与副作用语义权重，Coding Harness 应提高上下文、工具、扩展与沙箱权重。

---

## 最小 POC 设计

每个赛道最多保留 2～3 个候选，并使用同模型、同工具接口、同输入数据和同资源上限。

前文定义的 durable execution、人工审批、强沙箱和控制面最低语义，是所有相关赛道的强制验收项，不能因为下面的用例表没有重复展开就省略。

| 赛道 | 代表工作负载 | 必须收集的证据 |
|------|--------------|----------------|
| 低代码业务平台 | 知识检索 + 工具调用 + 人工确认 + 应用发布 | 应用生命周期、租户边界、日志、许可证和失败恢复 |
| 可视化 IDE / Runtime | 自定义组件 + Flow 调试 + API 部署 | 开发效率、代码执行隔离、认证、授权插件和运行部署 |
| 类型安全后端 | 严格 JSON Schema 输入输出 + MCP 工具调用 | schema 成功率、异常分支、测试便利性、胶水代码量 |
| Durable Workflow | 三步审批，在第二步暂停并模拟进程重启 | checkpoint、幂等性、恢复位置、重复副作用和审计记录 |
| 多 Agent 自动化 | 调研、分析、复核、生成报告 | 任务成功率、重复劳动、角色漂移、人工介入次数和 Token 成本 |
| Coding Harness | 修改小型仓库、运行测试、处理失败并恢复会话 | 工具成功率、权限边界、上下文压缩、恢复能力和沙箱逃逸检查 |

建议统一记录：

- 任务成功率与失败类型
- P50 / P95 延迟
- Token、模型和基础设施成本
- 进程重启后的恢复成功率
- 工具副作用是否重复执行
- 人工审批与接管次数
- Trace 是否能解释每一步决策
- 自建 API、身份、队列、存储和 UI 的胶水代码量

测试前还要锁定模型版本、temperature、工具契约版本、数据集、Token/时间预算、并发和运行硬件。成功率必须同时报告成功数、总样本数和失败分类；延迟与成本必须报告样本量，不能只留下一个百分比或平均值。

不要让所有项目跑同一个不合适的 Demo。例如 Pi 不需要参加低代码业务应用发布测试，Dify 也不需要参加终端 Coding Harness 测试。

---

## 条件式候选路由

在尚未完成 POC 前，只记录谁进入同赛道评估，不指定 Primary：

| 目标场景 | 首轮候选 | 备选或组合路径 | 排除 / 不进入同场评分 |
|----------|----------|----------------|------------------------|
| 低代码业务 Agent / RAG 应用 | Dify | 若接受代码优先平台，再单独评估 Agno | Flowise：已 sunset；Langflow 属 IDE/Runtime 赛道 |
| 受信开发团队的可视化 Python Flow | Langflow | 若应用发布运营更重要，转入 Dify 赛道 | Flowise：已 sunset |
| Python 类型安全后端 Agent | PydanticAI、LangChain | 复杂状态另组合 LangGraph | Dify：属于应用平台赛道 |
| 可恢复长任务与审批工作流 | LangGraph、Microsoft Agent Framework | PydanticAI + 外部 durable engine 作为完整方案另评 | Pi：无 durable workflow |
| TypeScript Agent 服务 | Mastra、VoltAgent | Vercel AI SDK 作为应用交互层组合件 | 不把 Vercel AI SDK 当独立平台评分 |
| 角色型业务自动化 | CrewAI、Microsoft Agent Framework | Google ADK 在 Google/A2A 约束下加入 | AutoGen：绿地项目不再采用 |
| 多模型终端 Coding Harness | Pi、DeepSeek Harness | Claude-only 时改评 Claude Agent SDK；LangGraph 栈改评 Deep Agents | OpenHands：属于更重的产品平台赛道 |
| 完整软件工程 Agent 产品 | OpenHands | Claude Agent SDK / Deep Agents + 自建产品层只做 make-or-buy 总成本比较 | SWE-agent：仅保留研究用途 |
| 文档与复杂 RAG | LlamaIndex Python | Dify RAG / LangChain 组合 | LlamaIndexTS：已停止维护 |

硬门槛阶段可以使用 `Gate-Rejected`；完成 POC 后再使用 `Primary`、`Challenger`、`Deferred` 和 `Rejected-after-POC`。成品与“SDK + 自建产品层”只能做 make-or-buy 总成本比较，不能只比较框架功能分。

### ADR 最小模板

```markdown
# ADR：Agent 技术选型

- 状态：Proposed / Accepted for POC / Accepted / Superseded
- 决策日期：YYYY-MM-DD
- 决策范围：具体工作负载，不写“所有 Agent”
- Primary Candidate：
- Challenger Candidate：

## 硬门槛

## POC 证据

## 决策与理由

## 需要宿主平台承担的能力

## 风险和不适用范围

## 切换条件与复审日期
```

---

## 官方资料入口

以下链接是本次快照的主要一手资料入口。项目迭代较快，复审时应重新核对版本、许可证和维护状态。

- Dify：[仓库](https://github.com/langgenius/dify)、[许可证](https://github.com/langgenius/dify/blob/main/LICENSE)
- Langflow：[文档](https://docs.langflow.org/)、[部署架构](https://docs.langflow.org/deployment-architecture)、[安全边界](https://docs.langflow.org/security)
- LangChain / LangGraph：[产品分层](https://docs.langchain.com/oss/python/concepts/products)、[LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- Mastra：[仓库](https://github.com/mastra-ai/mastra)、[Workflow snapshots](https://mastra.ai/en/reference/workflows/snapshots)
- PydanticAI：[概览](https://pydantic.dev/docs/ai/overview/)、[Durable execution](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/)
- CrewAI：[文档](https://docs.crewai.com/)、[Enterprise / AMP](https://docs.crewai.com/enterprise/introduction)
- DeepSeek Harness：[仓库](https://github.com/deepseek-ai/deepseek-harness)、[架构](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)
- DeepSeek Harness 当前状态：[开发者预览声明](https://github.com/deepseek-ai/deepseek-harness#developer-preview)
- Pi：[仓库](https://github.com/earendil-works/pi)、[安全说明](https://pi.dev/docs/latest/security)
- Microsoft Agent Framework：[概览](https://learn.microsoft.com/en-us/agent-framework/overview/)、[Checkpoint](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints)
- AutoGen：[维护状态与继任说明](https://github.com/microsoft/autogen)
- Google ADK：[文档](https://adk.dev/)、[部署](https://adk.dev/deploy/)
- OpenAI Agents SDK：[Python 文档](https://openai.github.io/openai-agents-python/)
- Agno：[AgentOS](https://docs.agno.com/agent-os/introduction)、[安全](https://docs.agno.com/agent-os/security/overview)
- Claude Agent SDK：[概览](https://code.claude.com/docs/en/agent-sdk/overview)、[安全部署](https://code.claude.com/docs/en/agent-sdk/secure-deployment)
- Deep Agents：[概览](https://docs.langchain.com/oss/python/deepagents/overview)、[生产部署](https://docs.langchain.com/oss/python/deepagents/going-to-production)
- OpenHands：[仓库](https://github.com/OpenHands/OpenHands)、[Agent Server](https://docs.openhands.dev/sdk/guides/agent-server/overview)
- VoltAgent：[文档](https://voltagent.dev/docs/)、[认证](https://voltagent.dev/docs/api/authentication/)、[Sandbox](https://voltagent.dev/docs/workspaces/sandbox/)
- Vercel AI SDK：[Agent 文档](https://ai-sdk.dev/docs/agents/overview)、[许可证](https://github.com/vercel/ai/blob/main/LICENSE)
- SWE-agent / mini-swe-agent：[SWE-agent](https://github.com/SWE-agent/SWE-agent)、[mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent)
- Flowise：[停止运营公告](https://flowiseai.com/sunset)、[归档仓库](https://github.com/FlowiseAI/Flowise)
- LlamaIndex：[Python 仓库](https://github.com/run-llama/llama_index)、[已归档 TypeScript 仓库](https://github.com/run-llama/LlamaIndexTS)

---

## 完成检查清单

- [ ] 已明确本次选型对应的工作负载，而不是笼统选择“Agent 平台”
- [ ] 比较单元已固定到版本、版本形态、部署方式和外接组件
- [ ] SDK、Runtime、Harness、产品和控制面没有混为一谈
- [ ] 已逐项核对许可证、私有化和企业目录边界
- [ ] 会话历史、durable execution、审批和沙箱分别验证
- [ ] 每项决策性优势都带有 D/C/T/P 证据等级，所有决策性 `U` 已解决，关键维度至少达到 T
- [ ] 每个赛道最多保留 2～3 个 POC 候选
- [ ] 最终 ADR 写明宿主平台仍需承担的能力
- [ ] 已定义切换条件和下一次复审日期

---

## 延伸阅读

- [Agent 开发](../) — 先判断任务是否值得做成 Agent
- [Harness Engineering](../../harness-engineering/) — 选定运行内核后，继续建设上下文、约束和反馈闭环
- [工具全景](../../tools-overview/) — 从团队工作方式和治理成本出发做通用工具选型
