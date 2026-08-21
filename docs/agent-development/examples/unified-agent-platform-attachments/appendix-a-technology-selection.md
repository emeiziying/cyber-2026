# 附件 A：Agent 技术分类与方案对比

> **所属报告：** [公司 Agent 技术现状、需求与平台演进规划](../unified-agent-platform-selection-report)
> **资料快照：** 2026-08-21
> **附件性质：** 技术路线说明，不构成 shortlist、采购建议或 Runtime 选型结论

---

## 为什么要先分类

市场上的“Agent 项目”并不是同一种产品。有些交付完整应用平台，有些只提供代码编排，有些重点解决持久工作流、多 Agent、端侧运行或可观测性。若不先区分类别，容易把完整平台与 SDK、中心 Runtime 与桌面 Harness 放在同一张表中比较。

类别会重叠，以下分类按项目的主要交付物划分，不表示一个项目只能属于一种类别。

## 技术分类

| 主要类别 | 主要交付物 | 代表项目 | 典型场景 | 通常仍需补充 |
|----------|------------|----------|----------|--------------|
| AI 应用平台 | 可视化应用、RAG、Workflow、发布和运营 | Dify、Haystack Enterprise | 问答、知识应用、标准流程 | 深度业务集成、公司身份和最终业务授权 |
| 可视化开发与 Runtime | 组件画布、Flow 设计、API 和运行服务 | Langflow；Flowise（已归档，仅作历史参考） | 可视化开发、流程实验和生产 Runtime | 公司控制面、最终业务授权以及具体部署形态的治理边界 |
| Agent Framework | Agent loop、工具、结构化输出、模型抽象 | Mastra、PydanticAI、LangChain | 代码优先的 Agent 服务 | 控制面、业务前端、部署和企业治理 |
| Workflow Runtime | 状态图、检查点、暂停恢复和长任务 | LangGraph、Microsoft Agent Framework | 审批、人工确认、故障恢复 | 完整产品 UI 和组织级控制面 |
| 多 Agent Framework | 角色协作、委派和任务编排 | CrewAI、AgentScope、Google ADK | 多角色分析和业务自动化 | 确定性聚合、身份、权限和最终执行边界 |
| Agent Harness | 上下文、工具、Session、运行骨架和本地能力 | DeepSeek Harness、Claude Agent SDK | Coding Agent、端侧 Agent、运行环境扩展 | 企业控制面、设备治理和业务系统集成 |
| 可观测与评测 | Trace、质量、成本、数据集和回归 | LangSmith、Langfuse、Phoenix | 生产监控和质量治理 | Agent Runtime 和业务应用本身 |

## 代表性路线比较

| 路线 | 代表方案 | 主要能力 | 优势 | 主要限制或待验证项 | 更适合 |
|------|----------|----------|------|--------------------|--------|
| 低代码应用平台 | Dify | Agent、Workflow、RAG、应用发布和管理页面 | 快速形成业务应用，配置和运营门槛较低 | 复杂工程控制、跨 Runtime 合同、长期恢复和企业治理需按实际 Edition 验证 | 早期问答、知识检索和标准业务流程 |
| 商业 RAG/Agent 平台 | Haystack Enterprise | Pipeline Builder、RAG、部署、运行历史与组织治理 | 显式 Pipeline 和企业控制面结合 | 商业许可、完整 TCO 和多 Agent 灵活度需评估 | 强调文档、RAG 和治理的企业场景 |
| 可视化开发与 Runtime | Langflow | 可视化 IDE、API、生产 Runtime、Helm 部署及认证扩展路径 | 原型构建直观，也可作为生产 Runtime 完整方案评估 | 具体版本、认证、外部 SSO、可插拔 RBAC 与公司控制面集成需验证 | 可视化开发、流程实验和生产 Runtime 候选 |
| TypeScript 代码优先 | Mastra | Agent、Workflow、MCP、Memory、服务端 Runtime | 与 TS 服务和前端工程协同自然，代码控制力强 | OSS 与企业能力边界、版本稳定性、耐久执行和生产控制面需验证 | 新建复杂 TS Agent 服务 |
| Python 类型化 Agent | PydanticAI | 类型化 Agent、工具、结构化输出、评测和耐久执行集成 | 与 Python 类型、数据和模型生态结合紧密 | 完整平台 UI、组织治理和部署体系通常需要组合 | Python 后端、数据和算法驱动场景 |
| Python 状态图 Runtime | LangGraph | 图编排、状态、检查点、暂停恢复和人工确认 | 对复杂状态和长流程表达清晰 | 完整应用平台通常需要结合 LangSmith 或公司自建能力 | 长流程、审批和可恢复工作流 |
| Python 一体化 Runtime | Agno | Agent、Team、Workflow、API Runtime 和前端路径 | 后端能力集中，适合快速验证 Python 平台形态 | 开源 UI 与商业控制面边界、升级稳定性和跨节点耐久性需验证 | Python Agent 平台型 POC |
| 角色协作与 Flow | CrewAI OSS | Crews、Flows、状态与流程控制 | 角色协作表达直接，Flows 适合确定性流程组合 | 终端产品 UI、企业身份和部署控制面需要组合 | 多角色业务自动化和流程型 Agent |
| CrewAI 完整平台 | CrewAI OSS + AMP | OSS Crews/Flows 加部署、API、观测及企业控制面 | 从多 Agent 开发到平台治理路径集中 | 商业 Edition、部署形态、SSO/RBAC 和完整 TCO 需单独核验 | 需要厂商平台能力的多 Agent 方案 |
| 多 Agent Runtime | AgentScope 2.0 + Studio | 多 Agent、Runtime、沙箱、AaaS、部署和 OTel | 复杂协作、受控执行和研发可视化能力集中 | Studio 的产品定位以及企业 SSO、RBAC、租户和控制面仍需验证 | 多 Agent 引擎、研发与评测平台 |
| 端侧 Harness | DeepSeek Harness | 本地工具、文件、插件、Session 和 Agent 运行骨架 | 与桌面、本地项目和文件场景匹配 | Developer Preview；认证、隔离、设备治理和企业 API 尚不完整 | 未来员工桌面 Agent 研究 |

上述比较只说明路线差异。每个候选的版本、Edition、部署形态和外接组件不同，能力边界也会变化。

## 完整方案比较单位

正式比较对象必须写成：

> 项目及版本 + 许可证或 Edition + 部署形态 + 必需外接组件 + 公司自建能力

例如，“Mastra 对比 Dify”不是完整比较。至少应明确：

- 使用哪个版本和许可证；
- 自托管还是厂商托管；
- 是否包含 Studio、控制面、观测和评测；
- 需要外接哪些数据库、工作流、身份、前端和监控组件；
- 公司需要维护多少适配代码、基础设施和升级路径。

候选只有在同一工作负载、数据、模型、工具、权限和资源上限下才可比较，并把胶水代码、部署、升级、安全、观测、值班和完整 TCO 一并计入。

## 主要选型维度

| 维度 | 需要回答的问题 |
|------|----------------|
| 业务能力 | 能否支持目标问答、RAG、工具、复杂流程、多 Agent 或端侧工作负载 |
| 工程方式 | 低代码还是代码优先；Schema、测试、版本和扩展方式是否适合团队 |
| 状态与恢复 | 会话、检查点、暂停、恢复、重试和幂等如何实现 |
| 平台控制面 | 是否提供 API、前端、发布、版本、评测、观测和运营管理 |
| 企业治理 | 身份、租户、资源授权、模型/RAG 路径、工具审批和审计如何落地 |
| 部署运维 | 私有化、集群、容量、升级、回滚、告警和故障处理成本 |
| 成熟度 | 版本稳定性、兼容策略、许可证、社区或厂商支持 |
| 完整 TCO | 许可证、模型、基础设施、开发、运维和值班的总成本 |

## TypeScript 与 Python

| 责任 | 当前建议 |
|------|----------|
| 当前 Agent BFF 与 Agent MCP | 延续 Python，不为候选框架重写现有安全边界 |
| 业务 Gateway 与前端 | 延续现有技术栈，通过统一 Agent API 隔离 Runtime |
| 预测、优化、量化和数据处理 | 保留 Python，通过 MCP 或业务 API 提供领域能力 |
| TypeScript Runtime 候选 | 在代码优先 TS 路线与团队工程能力匹配时评估 |
| Python Runtime 候选 | 在 Python 编排、数据生态或耐久工作流有明确需求时评估 |
| 端侧 Runtime | 使用候选原生技术栈，但必须满足统一身份、安全和审计合同 |

语言本身不单独计分。新增技术栈必须把 CI/CD、供应链、观测、值班和人员能力计入完整方案；没有明确收益时继续沿用当前基线。
