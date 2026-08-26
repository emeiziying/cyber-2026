# 附件 F：Dify、Langflow、Mastra 与 Agno 选型对比

> **所属报告：** [公司 Agent 技术现状、需求与平台演进规划](../unified-agent-platform-selection-report)
> **资料快照：** 2026-08-25
> **附件性质：** 四个代表方案的定位、能力与场景对比；不构成正式候选名单、采购或生产上线结论
> **比较口径：** 以公开版本和明确的产品边界为基础；商业版、外接组件和公司自建能力不默认计入项目原生能力

---

## 结论先行

1. **四者不是同一种产品。** Dify 侧重低代码 AI 应用交付，Langflow 侧重 Python 可视化开发与 Flow 执行服务，Mastra、Agno 侧重代码优先的 Agent 执行后端。
2. **Dify 与 Langflow 最值得直接比较的场景是可视化开发和应用交付。** 两者在问答、RAG、Agent、API 等能力上也有交集，但 Dify 更接近完整应用产品，Langflow 更接近供开发者使用的可编程画布和运行服务。
3. **Mastra 与 Agno 更适合直接比较复杂 Agent 编排。** 两者都提供 Agent、Workflow、Memory、MCP、API 和开发工作台，主要差异是 TypeScript 与 Python 生态、产品边界和配套控制面。
4. **当前没有脱离场景的四选一排名。** 先定义工作负载和硬约束，再确定同场景候选；语言只能在其他条件相当时决定优先验证顺序。
5. **四者都不应被视为公司统一控制面的完整替代。** 可信身份、资源授权、Run 账本、业务审计、安全输出和执行后端适配仍由统一 Agent API 掌握；MCP 按委托范围受控调用，业务后端执行最终授权。

### 阅读术语

| 术语 | 本文含义 |
|------|----------|
| Runtime（执行后端） | 负责模型、工具、Agent 和 Workflow 实际运行的服务 |
| Control Plane（控制面）/ Agent BFF | 公司管理身份、策略、发布、运行和审计的服务；Agent BFF 是业务系统接入统一 Agent API 的实现形态之一 |
| 可信知识访问层 | 接收控制面下发的已验证身份和资源范围，将其落实为不可放宽的数据集、文档或 Metadata 过滤条件并执行检索；可先由现有 Python BFF / MCP 内部模块承载 |
| Run 账本 / 安全 SSE | 公司保存的运行主体、版本、状态、幂等和安全输出记录 / 只向客户端发送白名单字段的流式事件 |
| Edition / shortlist | 产品版本形态，如社区版、企业版 / 通过硬约束后形成的正式候选名单 |
| Trace / Eval | 模型、工具和工作流的技术调用链 / 基于数据集或规则的质量评测 |
| 四个证据门 | `Implemented` 为源码实现，`Deployed` 为环境部署，`Enforced` 为在约定边界内不可旁路，`Verified` 为测试验证 |

---

## 四个方案的核心定位

| 方案 | 产品形态 | 主要技术栈 | 主要交付物 | 多 Agent 模式 | 前端与控制面边界 |
|------|----------|------------|------------|----------------|------------------|
| [Dify](https://docs.dify.ai/en/home) | 低代码 AI 应用开发与运营平台 | 后端以 Python 为主，Web 端为 TypeScript，部分运行组件使用 Go | 问答应用、RAG、Workflow、Web App、API 和运营后台 | Workflow 内编排多个 Agent 节点，适合固定协作拓扑 | 自带应用与管理界面，但不等于公司的租户、业务授权和审计控制面 |
| [Langflow](https://docs.langflow.org/) | Python 可视化 Flow IDE 与 Runtime | Python Runtime、React/TypeScript 前端 | 组件画布、Agent/Flow、Playground、API 和无编辑器 Runtime | 将其他 Agent 或 Flow 作为工具组合，由开发者明确设计协作关系 | IDE 面向受信开发者；业务前端、租户隔离和生产治理需要公司补齐 |
| [Mastra](https://mastra.ai/) | TypeScript 代码优先 Agent Framework、Workflow Runtime 与 Server | TypeScript / Node.js | Agent 服务、类型化 Workflow、API、Studio、Trace 和 Eval | 统筹 Agent 动态委派专业 Agent，并可组合确定性工作流 | Studio 可本地或自托管部署并配置认证，细粒度 RBAC 属于企业功能；它仍不是完整业务应用或公司控制面 |
| [Agno](https://docs.agno.com/agent-os/introduction) | Python Agent SDK、Team/Workflow 与自托管 AgentOS Runtime | Python / FastAPI | Agent、Team、Workflow、REST/SSE、Session、Knowledge、Eval 和 Trace | Team 原生支持协调、路由和广播 | 开源 Agent UI 是聊天前端；完整 Control Plane / Studio 是厂商托管能力 |

### 开源与许可证边界

| 方案 | 当前边界 | 选型时应核验 |
|------|----------|--------------|
| Dify | 使用带附加条件的开源许可证 | 未经授权运营多租户环境、前端标识、多 Workspace、SSO 和高可用等边界；以[许可证原文](https://github.com/langgenius/dify/blob/main/LICENSE)和合同为准 |
| Langflow | 主仓库采用 [MIT License](https://github.com/langflow-ai/langflow/blob/main/LICENSE) | 自定义组件可以执行宿主 Python 代码，不能把共享 IDE 直接开放给不可信用户 |
| Mastra | 开源核心代码与部分企业功能代码采用不同许可证 | 按目录和 Edition 核对，[许可证映射](https://github.com/mastra-ai/mastra/blob/main/LICENSE.md)不能被概括为“全部 Apache-2.0” |
| Agno | SDK 与 AgentOS Runtime 主仓库采用 [Apache-2.0](https://github.com/agno-agi/agno/blob/main/LICENSE)，Agent UI 为 MIT | 自托管 Runtime、开源 Agent UI 与厂商托管 Control Plane / Studio 分别评估 |

---

## 同口径能力比较

以下内容表示公开资料中的能力和产品边界，不表示公司已经在目标版本、部署形态和故障条件下验证通过。

### 应用、RAG 与多 Agent

| 能力 | Dify | Langflow | Mastra | Agno |
|------|------|----------|--------|------|
| 问答应用交付 | 直接提供 Web App、API、会话和运营日志 | 提供 Playground 和运行 API，业务前端通常需要建设 | 提供 Agent Server/API，业务应用需要建设 | AgentOS 提供运行 API，开源 Agent UI 可作聊天前端基础 |
| RAG 与知识库 | 内置知识流水线、文档与分段管理、索引、检索、重排和检索测试，产品化程度较高 | 内置 Knowledge Base 只覆盖结构化数据和基础相似度检索；非结构化文档与复杂检索通过 Flow、向量库组件或外部服务组合 | 提供切分、Embedding、向量检索、过滤、重排和评测等代码原语 | 提供 Reader、Knowledge API、内容状态、混合检索和多种向量库适配 |
| 多 Agent | Workflow 内并行或串行编排多个 Agent 节点，再由后续节点汇总；是否确定性取决于汇总实现 | Agent-as-Tool 或嵌套 Flow | Supervisor/Subagent 动态委派 | Team 协调、路由或广播 |
| 适合的协作复杂度 | 固定拓扑和可视化流程 | 开发者定义的组件组合 | 动态委派与类型化工作流混合 | 多个专业 Agent 的团队协作 |
| MCP | 支持消费 MCP Tool，也可把应用暴露为 MCP | 支持 MCP Client/Server | 支持 MCP Client/Server 和工具审批 | Agent、Team、Workflow 可消费 MCP，AgentOS 可暴露 MCP Server |
| 接入 RAGFlow | 可通过外部知识库 API、HTTP Tool 或 MCP 接入 | 可通过 API、自定义组件或 MCP 接入 | 通过 Tool、API 或 MCP 接入 | 通过 Tool、API 或 MCP 接入 |

RAGFlow 是否作为独立知识层，应按文档解析质量、检索效果、权限过滤和知识运营需求单独决策；“能调用 RAGFlow API”不等于已经完成用户级知识授权。

### 知识库能力与 RAGFlow 引入判断

选型时需要先区分“能够编写 RAG 流程”和“已经提供可运营的知识库产品”。四者都能完成检索增强问答，但原生承担的知识摄取、管理和质量治理职责不同。

| 方案 | 原生知识库能覆盖的范围 | 主要缺口 | 对 RAGFlow 的判断 |
|------|------------------------|----------|--------------------|
| Dify | 可视化知识流水线，General / Parent-child 切分、分段摘要索引、Q&A 索引、向量/全文/混合检索、Rerank、Metadata、多知识库重排、多模态检索、文档与分段管理和检索测试，适合普通制度、FAQ、网页、Word 和文本型 PDF 问答。详见[知识流水线](https://docs.dify.ai/en/self-host/use-dify/knowledge/knowledge-pipeline/readme)、[切分设置](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/chunking-and-cleaning-text)和[索引与检索](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/setting-indexing-methods) | 知识库权限主要面向 Workspace 成员，不等于业务终端用户、部门或单文档 ACL；未提供公司所需的不可变文档版本、审批发布和版本回滚合同 | 首期通常不需要。只有复杂文档解析、统一知识数据面或实测检索质量不达标时才进入 RAGFlow POC |
| Langflow | 内置 Knowledge Base 提供 Embedding、Metadata 和基础语义检索；非结构化文档可通过 Read File、Split Text、Embedding 和向量库组件形成 RAG Flow；混合检索、MMR、Rerank 和 Graph RAG 取决于具体 Provider 组件。详见[Knowledge Base](https://docs.langflow.org/knowledge-base)和[Vector RAG](https://docs.langflow.org/1.8.0/chat-with-rag) | 内置 Knowledge Base 官方限定为结构化数据和标准相似度检索；缺少统一的非结构化知识摄取、任务状态、版本管理和检索回归面，能力与执行位置受向量库组件影响 | 已有向量库和文档处理服务时不需要；若要减少非结构化文档管理与复杂解析的自建量，RAGFlow 更有价值 |
| Mastra | 提供 MDocument、切分、Embedding、多种向量库、Metadata Filter、检索、Rerank、Graph RAG / ReAG、Trace、Dataset 和 Scorer，适合对 RAG 逻辑进行代码化控制。详见[Mastra RAG](https://mastra.ai/rag-pipeline) | 更接近 RAG 开发工具箱；文件上传、来源同步、PDF/OCR/表格解析、入库任务、删除重建、知识运营页面、文档权限和版本合同需要应用建设 | 文档已经由业务系统清洗且规模有限时不需要；若不准备自建知识数据面，可把 RAGFlow 作为独立服务候选 |
| Agno | Reader 支持 PDF、DOCX、网页、文件目录和远程来源；提供多种切分策略、向量/关键词/混合检索、RRF、Rerank、Metadata Filter、Content DB、Knowledge API 和基础内容管理。详见[Knowledge](https://docs.agno.com/knowledge/overview)、[Reader](https://docs.agno.com/knowledge/concepts/readers/overview)、[Content DB](https://docs.agno.com/knowledge/concepts/contents-db)和[混合检索](https://docs.agno.com/knowledge/concepts/search-and-retrieval/hybrid-search) | 复杂版面与表格知识工程能力不等于 RAGFlow；过滤语义受实际向量库支持范围约束；缺少完整文档修订历史和业务单文档 ACL；完整管理 UI 仍受前述托管 Control Plane 边界影响 | 普通企业文档先验证 Agno 原生能力；复杂文档或多个 Runtime 共用一套知识服务时再比较 RAGFlow |

统一 Agent API / 控制面负责验证身份、计算授权策略并下发不可伪造的资源范围；可信知识访问层负责将该范围落实为数据集、文档或 Metadata 过滤条件。MCP 只是调用通道或适配位置，RAGFlow 只执行服务端给定的过滤与检索，二者都不自行决定授权。Prompt、自动 Metadata Filter 或 Agent 自行选择数据集不能扩大范围；越权验证应同时覆盖允许访问和相邻拒绝场景。

**RAGFlow 实际增强的范围**

RAGFlow 的增量主要在知识工程与检索数据面，而不是 Agent 编排：

- DeepDoc 提供 OCR、版面分析和表格结构识别，面向扫描件、双栏 PDF、图片、Excel、PPT 等复杂资料；
- General、Table、Paper、Book、Laws、Presentation、Picture、Q&A 等模板按文档类型切分，并允许查看和人工修正 Chunk；
- 提供独立入库流水线、混合检索、Rerank、检索测试、引用、Metadata、RAPTOR 和 Knowledge Graph 等能力；
- 可以成为多个 Agent Runtime 共用的知识摄取与检索服务。

这些能力可见于 RAGFlow 的[知识库配置](https://github.com/infiniflow/ragflow/blob/main/docs/guides/dataset/configure_knowledge_base.md)、[检索测试](https://github.com/infiniflow/ragflow/blob/main/docs/guides/dataset/run_retrieval_test.md)和 [DeepDoc](https://github.com/infiniflow/ragflow/blob/main/deepdoc/README.md)。“支持”不表示在公司语料上一定更准确；Rerank、RAPTOR、Knowledge Graph 和 VLM 解析都会增加计算、模型调用或响应时间，需要按问题类型逐项开启。

RAGFlow 可以执行服务端传入的数据集、文档或 Metadata 过滤，但不能从 Prompt 或过滤条件本身推导可信授权范围。

RAGFlow 也不是轻量 SDK。官方开发环境要求至少 4 核 CPU、16 GB 内存和 50 GB 磁盘，默认部署还涉及 Elasticsearch / Infinity、MySQL、MinIO 和 Redis；该数字只是启动门槛，不能替代生产容量评估。详见[启动要求](https://github.com/infiniflow/ragflow/blob/main/docs/develop/launch_ragflow_from_source.md)和[依赖配置](https://github.com/infiniflow/ragflow/blob/main/docs/administrator/configurations/configurations.md)。

**当前项目的引入原则**

当前不把 RAGFlow 设为统一 Agent 平台的默认依赖，采用“原生基线 + 复杂文档对照 POC”：

1. 先用候选 Runtime 的原生知识能力完成普通制度、FAQ、网页、Word、Markdown 和文本型 PDF 基线；公司当前 Dify 问答落地实现仍处早期，可作为基线但不构成必须保留的资产。
2. 单独选择电力交易规则、已发布且版本固定的历史市场公告、扫描 PDF、复杂表格和长文档，与 RAGFlow 使用相同 Embedding、Rerank 模型和问题集对照。
3. 比较解析完整率、Recall@5、MRR、引用准确率、无答案拒答、更新与删除生效、越权泄漏、P95 延迟、入库成本和运维复杂度。
4. 只有 RAGFlow 在核心资料上产生可测量的质量提升、显著减少人工预处理，或多个 Runtime 已确认需要共享知识数据面时，才进入生产候选。

POC 开始前应预先写明通过门槛：越权泄漏必须为 0，更新与删除必须按合同生效；质量提升、P95 延迟、成本和人工处理量的数值门槛由业务语料与容量目标确定。未预设门槛的演示结果不作为选型证据。

若引入，同一批正式文档只保留一套权威摄取和索引链路，避免 Dify、Langflow、Mastra 或 Agno 与 RAGFlow 长期重复入库。现有 Python BFF / MCP 可先承载最小的可信检索适配，不为尚未确认的多后端需求提前建设工厂或独立微服务：

```text
统一 Agent API
  → Agent Runtime
      ├─ 原生知识库（简单、共享语料）
      └─ 可信知识访问层 → RAGFlow（复杂或统一知识语料）
```

Dify 调用[外部知识库 API](https://docs.dify.ai/en/self-host/use-dify/knowledge/external-knowledge-api)时会携带配置的 Bearer API Key 做服务间认证；但其请求体合同只有 `knowledge_id`、查询、检索参数和 Metadata 条件等字段，没有业务终端用户身份。该凭据识别 Dify 与知识服务之间的连接，不等于终端用户授权。需要按用户或部门过滤时，应由统一 Agent API 计算可信范围，再由知识访问层执行；现有 Python MCP 可以承载适配，但不是授权策略来源。

电力交易规则、政策、市场手册和已发布且版本固定的历史公告属于知识库候选；实时行情、持仓、信用额度、风险限额、交易约束，以及刚发布且状态仍变化的公告仍通过 MCP / 业务 API 查询，固化后再进入知识库。不能把向量索引当作实时事实来源。

### 上下文、恢复与人工介入

| 能力 | Dify | Langflow | Mastra | Agno |
|------|------|----------|--------|------|
| 会话上下文 | 会话历史、流程变量和 Agent 记忆 | `session_id`、消息历史和外部 Memory 组件 | Thread、Resource 和消息历史 | Session、用户标识和消息历史 |
| 长期记忆 | 跨会话长期用户记忆通常需要外接或建设 | Memory Base 可进行语义检索；跨会话使用必须限制租户和用户范围 | Working Memory、语义召回和 Observational Memory | 用户级 Memory 和自动 Session Summary |
| 自动上下文压缩 | 无统一的产品级滚动总结结论，按目标应用核验 | 没有开箱即用的统一滚动总结开关，可在 Flow 中自行编排 | Observational Memory 可按上下文阈值压缩和形成观察结果 | 可启用自动 Session Summary |
| 暂停与人工介入 | Workflow 支持暂停、恢复和 Human Input | 支持 Human Input；嵌套 Flow 和目标版本限制需核验 | Workflow 暂停恢复和工具审批 | Agent、Team、Workflow 支持审批和用户输入 |
| 传输断线 | Workflow 可按运行标识恢复订阅；普通聊天流需单独验证 | 后台 Workflow API 支持事件恢复，但目标版本和 Beta 状态需核验 | 支持暂停后的继续执行，不默认等同于任意 SSE 事件重放 | 支持后台 Run 和流式重连，不能直接等同于进程崩溃恢复 |
| 服务故障与多副本 | 进程崩溃、节点副作用和多副本接管均待目标版本核验 | 进程崩溃、后台状态持久性和多副本接管均待目标版本核验 | Workflow Snapshot 提供基础；高可靠长任务可能需要外接耐久执行引擎 | 后台运行和持久化审批提供基础；进程崩溃、多副本和副作用幂等仍需核验 |

“具有暂停恢复 API”不等于已经具备生产级耐久执行。候选进入场景级比较后，应分别验证进程终止、容器重启、多副本竞争、重复事件和工具副作用幂等。

### 工程、评测与可观测

| 能力 | Dify | Langflow | Mastra | Agno |
|------|------|----------|--------|------|
| 主要开发方式 | 可视化配置为主，可通过插件和 API 扩展 | 可视化组件为主，可编写 Python 自定义组件 | TypeScript 代码定义 Agent、Tool 和 Workflow | Python 代码定义 Agent、Team 和 Workflow |
| 测试与版本控制 | 流程调试和运行日志较完整，复杂逻辑的代码审查与单元测试约束较弱 | Flow 可导出，组件可测试；复杂画布仍需制定评审和版本规范 | 与 TypeScript 工程、类型检查、单元测试和 CI 自然结合 | 与 Python 测试、数据分析和模型生态自然结合 |
| 评测 | 提供调试、反馈、检索测试和外部观测集成；完整回归门禁需组合 | 原生 Trace 较完整，评测主要通过外部集成 | Dataset、Scorer、Experiment 和发布 Gate 较完整 | 内置准确性、Judge、性能和可靠性 Eval |
| 技术可观测 | 节点运行历史、日志、Token 和延迟 | Flow/组件/工具调用 Trace | Agent、Tool、Memory、Workflow Trace 和 OpenTelemetry | Agent、模型、工具 Trace 和 OpenTelemetry |
| 业务审计 | 仍须由公司控制面和业务后端保存 | 仍须由公司控制面和业务后端保存 | 仍须由公司控制面和业务后端保存 | 仍须由公司控制面和业务后端保存 |

Trace 用于研发和运维，业务审计用于证明“谁基于什么授权，对哪个业务对象执行了什么动作”；两者不能互相替代。

---

## 两组关键差异

### Dify 与 Langflow

两者都能画流程，但交付重点不同：

- 需要直接发布企业问答、知识库和标准流程时，Dify 的应用产品能力更完整。
- 需要 Python 开发者通过画布编写自定义组件、组合外部服务和调试 Flow 时，Langflow 更灵活。
- Dify 的主要决策成本是许可证、Edition 和业务控制面边界；Langflow 的主要决策成本是业务前端、租户隔离和生产运行加固。
- Langflow 能替换 Dify 的部分编排和执行能力，但应用配置、知识索引、会话、API 和事件格式都需要迁移或适配，不是无缝替换。

### Mastra 与 Agno

两者都是代码优先候选，核心差异不应简化为语言名称：

- Mastra 更适合由 TypeScript/Node 团队负责 Agent 服务，并重视类型化 Workflow、Studio、评测和前后端工程协作。
- Agno 更适合由 Python/AI/数据团队负责 Agent 服务，并需要一等 Team、AgentOS API、Session、Knowledge 和审批能力。
- Mastra 可自托管的 Studio 是研发工作台，Agno 的开源 Agent UI 是聊天前端；两者都不应被视为公司企业管理端的完整替代。
- 若要求完全离线且管理端源码可控，Agno 的托管 Control Plane 边界需要重点评估；Mastra 则需核对企业功能目录的许可证，并评估业务应用和知识运营自建量。

---

## 公司场景映射

| 场景 | 当前判断 | 候选使用方式 |
|------|----------|--------------|
| 早期 AI 问答与 RAG | 公司当前 AI 问答落地仍处早期，Dify 可以保留，也可以替换，不构成沉没成本约束 | 将 Dify 作为低代码交付基线；当许可证、私有部署、身份数据边界等硬约束不通过，所需能力无法核验，或复杂画布的测试、恢复和维护成本不可接受时，再比较 Langflow 或代码优先方案 |
| 多业务系统统一 Agent 平台 | 首要目标是统一控制边界，而不是先选一个覆盖全部功能的产品 | 业务系统只依赖统一 Agent API；四个候选均作为其后的可替换 Runtime 评估 |
| 电力交易多 Agent | 需要多个专业 Agent、统一证据格式、固定规则聚合、风险校验和人工确认 | 四者内先过硬约束，再优先比较 Mastra、Agno 的代码路线；Python 可视化是硬要求时评估 Langflow，固定拓扑和低代码交付已满足需求时以 Dify 为基线；其他项目在详细选型中另行筛选 |
| Python 可视化开发 | 只有在可视化编排是明确需求时才形成独立赛道 | 比较 Langflow 的开发效率、Runtime 稳定性、隔离和自建前端成本；Dify 作为应用交付基准 |
| RAGFlow 作为知识层 | 不是默认依赖；与 Agent Runtime 解耦，单独评价复杂文档、检索质量、权限过滤和运维成本 | POC 通过后，四者均可通过 API、Tool 或 MCP 接入；用户、租户和资源范围仍由可信服务端上下文决定 |

电力交易中的金额、敞口、风险限额、正式建议批准和交易执行继续由确定性代码及业务系统承担，不能由统筹 Agent 最终决定。

---

## 与统一平台架构的关系

本附件只比较四个项目承担执行后端角色时的差异。目标链路仍是“业务系统 → Gateway → 统一 Agent API → 可替换执行后端”；执行后端可使用原生知识库，在 RAGFlow POC 通过后也可通过可信知识访问层调用 RAGFlow，并通过 MCP / 受控业务 API 调用业务后端，业务后端执行最终授权。详细职责见[主报告](../unified-agent-platform-selection-report)和[附件 D](./appendix-d-server-endpoint-capability-matrix)。当前证据不足以把任何候选视为公司完整控制面的替代，也不能把用户身份、业务资源范围或最终授权交给 Prompt 和模型自行声明。

---

## 四方案同场景验证项

候选进入方法以[主报告](../unified-agent-platform-selection-report#agent-方案如何选型)为准。只有公开资料无法回答决策性问题时，才在相同模型、数据、MCP、权限和资源限制下开展隔离、限时、非生产验证；涉及知识层对比时，再使用相同 Embedding、Rerank 模型、语料和问题集比较原生知识库与 RAGFlow。验证至少覆盖：

- 企业问答、引用来源和用户级知识权限；
- 市场、政策、预测和风险等专业 Agent 并行分析；
- 结构化证据输出、确定性聚合、冲突处理和人工确认；
- Gateway 身份到会话、Runtime、MCP 和业务后端的完整传递；
- SSE 中断、取消、容器重启、多副本竞争和恢复；
- 工具重复调用、幂等、超时和失败补偿；
- 数据集回归、Trace、成本、发布和版本回滚；
- 不使用厂商托管控制面时，必要管理功能能否由 API 和公司前端完成。

验证结果应分别记录 `Implemented`、`Deployed`、`Enforced` 和 `Verified`，不以 Demo 成功代替生产证据。

当前决策、职责边界和演进触发条件以[主报告](../unified-agent-platform-selection-report)为准；完整外部资料入口见[附件 C](./appendix-c-evidence-sources)，服务端平台能力和公司自建边界见[附件 D](./appendix-d-server-endpoint-capability-matrix)。
