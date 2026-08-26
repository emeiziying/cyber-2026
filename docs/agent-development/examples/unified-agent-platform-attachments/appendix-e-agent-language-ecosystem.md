# 附件 E：Agent 开源核心实现的 Python / TypeScript 生态快照

> **所属报告：** [公司 Agent 技术现状、需求与平台演进规划](../unified-agent-platform-selection-report)
> **资料快照：** 2026-08-24 10:27 CST
> **统计区间：** 2025-08-24 00:00 UTC 至资料快照时间
> **附件性质：** 当前选型材料覆盖范围内的开源生态样本，不代表商业市场份额、企业使用率或生产成熟度

---

## 结论先行

本次从当前报告已覆盖的项目及其官方同级语言实现中，得到 20 个活跃项目家族、28 个独立核心实现单元。一个项目家族可以同时提供多种语言实现，因此“项目家族覆盖率”允许重复计数；“实现单元占比”互斥且合计为 100%。例如 LangChain、LangGraph、Google ADK、OpenAI Agents 和 Deep Agents 在家族口径各计一次，在实现单元口径则分别计入其活跃的官方语言实现。

| 统计口径 | Python | TypeScript | 其他语言 | 如何理解 |
|----------|-------:|-----------:|---------:|----------|
| 项目家族覆盖率（20 个，可多选） | 14 / 70.0% | 11 / 55.0% | 2 / 10.0% | 反映代表性项目家族是否提供官方核心实现，合计可超过 100% |
| 独立实现单元占比（28 个） | 14 / 50.0% | 11 / 39.3% | 3 / 10.7% | 反映当前样本中独立实现的数量结构 |
| 对数活跃度权重占比 | 49.2% | 41.3% | 9.5% | 使用近 12 个月默认分支提交数的对数权重，降低单个高频仓库的支配影响 |
| 服务端实现单元（23 个） | 12 / 52.2% | 8 / 34.8% | 3 / 13.0% | Python 在服务端 Framework、Workflow 和 Runtime 样本中更多 |
| 端侧 / Coding Harness（5 个） | 2 / 40.0% | 3 / 60.0% | 0 | TypeScript 在本次端侧样本中更多，但样本量较小 |

如果只比较 Python 与 TypeScript 实现单元，整体为 **56.0% : 44.0%**；服务端为 **60.0% : 40.0%**，端侧 / Coding Harness 为 **40.0% : 60.0%**。这组结果支持“服务端领域和数据能力优先利用 Python 生态、TypeScript 适合代码优先服务和端侧产品、两者通过统一 API 与 MCP 并存”的路线，不支持宣布一种语言全面取代另一种语言。

---

## 统计对象与规则

### 样本如何确定

样本不是按语言分别挑选，而是从[主报告](../unified-agent-platform-selection-report)和[详细选型文档](../agent-technology-selection)已经覆盖的项目出发，再补充这些项目官方维护的同级语言实现。例如，报告已覆盖 LangChain、LangGraph、Google ADK、OpenAI Agents SDK 和 Deep Agents，因此它们活跃的 Python 与 TypeScript 实现都进入样本。

纳入条件：

- 官方公开仓库包含可检查的 Agent SDK、Framework、Workflow Runtime 或 Harness 核心代码；
- 不是 Fork，资料快照时没有归档；
- 默认分支或对应语言核心目录在近 12 个月有提交；
- 能够独立作为开发实现使用，而不只是 UI、示例、遥测客户端或第三方移植。

排除规则：

- Dify、Langflow、Coze Studio 等完整应用平台单独用于产品选型，不进入代码框架语言分母；其仓库通常同时包含 API、执行服务和 Web UI，整仓主语言不能代表 Agent 核心开发语言；
- Flowise、LlamaIndexTS 等已归档实现不进入当前活跃样本；
- AutoGen、SWE-agent 等已明确进入维护、继任或研发重心转移的项目不重复计入，分别使用 Microsoft Agent Framework 和 mini-swe-agent；
- Claude Agent SDK 的公开仓库没有提供可按语言统计的完整核心源码，因此不进入“开源核心实现”分母；
- 前端、Studio、Dev UI、客户端 SDK 或观测 SDK 不会改变执行核心的语言归类。

### 语言如何归类

- 归类依据是 Agent loop、Workflow、Runtime 或 SDK 核心包，而不是 GitHub 首页展示的仓库主语言；
- 同一项目家族具有独立且活跃的官方语言实现时，每种实现分别计一个实现单元；
- 同一项目家族存在多个核心实现时，按核心目录或独立官方仓库拆分。例如 Microsoft Agent Framework 的 Python、.NET 和 Go 分别计数；
- “其他语言”在本次样本中包括 Go 和 .NET，不表示其他语言在整个行业只有这些项目。

### 活跃度如何计算

GitHub GraphQL `Commit.history` 用于统计固定 HEAD 之前、默认分支自 2025-08-24 起的提交数；Microsoft Agent Framework 使用 `path` 参数分别统计主仓库的 `python` 和 `dotnet` 目录，Go 则统计其独立官方仓库。GitHub 官方说明 `history` 支持 `since`、`path` 和 `totalCount`；GitHub 的仓库语言统计来自 Linguist，主要反映文件字节，不能自动识别哪个目录承担 Agent 核心责任。

为避免提交习惯不同或单个高频 Monorepo 支配结果，活跃度只作为敏感性检查，并采用对数权重：

```text
单个实现权重 = ln(1 + 近 12 个月默认分支提交数)
语言活跃度占比 = 该语言所有实现权重之和 ÷ 全部实现权重之和
```

没有使用 Star 作为语言权重，也没有把 npm 与 PyPI 下载量直接相加。Star 更接近项目关注度；不同包管理器的下载语义、自动化流量和包拆分方式不同，不能直接形成跨语言份额。

统计方法参考：[GitHub GraphQL Commit](https://docs.github.com/en/graphql/reference/commits)、[GitHub 仓库语言说明](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-repository-languages)。

---

## 样本明细

“HEAD”是资料快照时默认分支的短提交号；提交数不是代码行数，也不直接代表功能、质量或用户规模。

| 场景 | 语言 | 独立实现单元 | HEAD | 近 12 个月默认分支提交 |
|------|------|--------------|------|-----------------------:|
| 服务端 | Python | [LangChain Python](https://github.com/langchain-ai/langchain) | `5a273e0` | 2,602 |
| 服务端 | Python | [LangGraph Python](https://github.com/langchain-ai/langgraph) | `f09cfe8` | 838 |
| 服务端 | Python | [PydanticAI](https://github.com/pydantic/pydantic-ai) | `fde1bbb` | 1,747 |
| 服务端 | Python | [CrewAI](https://github.com/crewAIInc/crewAI) | `9e9a857` | 1,141 |
| 服务端 | Python | [AgentScope](https://github.com/agentscope-ai/agentscope) | `da00849` | 483 |
| 服务端 | Python | [Google ADK Python](https://github.com/google/adk-python) | `e753651` | 2,818 |
| 服务端 | Python | [OpenAI Agents Python](https://github.com/openai/openai-agents-python) | `fe45b41` | 1,506 |
| 服务端 | Python | [Deep Agents Python](https://github.com/langchain-ai/deepagents) | `2c80153` | 3,413 |
| 服务端 | Python | [LlamaIndex Python](https://github.com/run-llama/llama_index) | `d802122` | 919 |
| 服务端 | Python | [Agno](https://github.com/agno-agi/agno) | `9644f22` | 1,991 |
| 服务端 | Python | [Haystack](https://github.com/deepset-ai/haystack) | `c7cb46c` | 1,808 |
| 服务端 | Python | [Microsoft Agent Framework Python](https://github.com/microsoft/agent-framework/tree/main/python) | `d9d3fb6` | 1,364（`python` 目录） |
| 服务端 | TypeScript | [Mastra](https://github.com/mastra-ai/mastra) | `d55807c` | 8,979 |
| 服务端 | TypeScript | [VoltAgent](https://github.com/VoltAgent/voltagent) | `35efe17` | 915 |
| 服务端 | TypeScript | [Vercel AI SDK](https://github.com/vercel/ai) | `9d9a73f` | 3,896 |
| 服务端 | TypeScript | [LangChain.js](https://github.com/langchain-ai/langchainjs) | `fca7d2f` | 1,339 |
| 服务端 | TypeScript | [LangGraph.js](https://github.com/langchain-ai/langgraphjs) | `f8bdf16` | 721 |
| 服务端 | TypeScript | [Google ADK JavaScript](https://github.com/google/adk-js) | `bb2dd8f` | 566 |
| 服务端 | TypeScript | [OpenAI Agents JavaScript](https://github.com/openai/openai-agents-js) | `89df1ac` | 1,079 |
| 服务端 | TypeScript | [Deep Agents JavaScript](https://github.com/langchain-ai/deepagentsjs) | `c0bc769` | 531 |
| 服务端 | 其他 | [Google ADK Go](https://github.com/google/adk-go) | `0a51e15` | 466 |
| 服务端 | 其他 | [Microsoft Agent Framework .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet) | `d9d3fb6` | 1,141（`dotnet` 目录） |
| 服务端 | 其他 | [Microsoft Agent Framework Go](https://github.com/microsoft/agent-framework-go) | `e001564` | 681 |
| 端侧 / Coding Harness | TypeScript | [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | `b150a55` | 13,147 |
| 端侧 / Coding Harness | TypeScript | [Pi](https://github.com/earendil-works/pi) | `a470b12` | 5,741 |
| 端侧 / Coding Harness | TypeScript | [OpenCode](https://github.com/anomalyco/opencode) | `03bba46` | 13,269 |
| 端侧 / Coding Harness | Python | [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) | `25941c8` | 445 |
| 端侧 / Coding Harness | Python | [OpenHands Software Agent SDK](https://github.com/OpenHands/software-agent-sdk) | `6d38810` | 2,217 |

---

## 容易误判的项目

| 项目 | 本次处理 | 原因 |
|------|----------|------|
| Dify | 不进入语言比例 | 当前仓库同时包含 Go Agent Runtime、Python API 和 TypeScript Web，整仓主语言不能回答执行核心选型 |
| Langflow | 不进入语言比例 | 作为可视化 Python IDE / Runtime 单独比较产品交付形态，避免与纯 SDK、Framework 重复计权 |
| Coze Studio | 不进入语言比例 | Go 后端与 TypeScript 前端共同构成完整平台，不属于单语言 Agent Framework |
| OpenHands | 计入 Python `software-agent-sdk`，不使用产品仓库主语言 | 产品仓库以 TypeScript UI 为主，独立 Agent SDK 才是可复用执行核心 |
| DeepSeek Harness | 计为 TypeScript | Python SDK 通过 JSON-RPC 驱动随包分发的 TypeScript Runtime，不是 Python 核心重写 |
| AgentScope、Agno | 计为 Python | Studio 或 Agent UI 使用 TypeScript，不改变 Python Agent 核心 |
| Flowise、LlamaIndexTS | 排除 | 资料快照时仓库已经归档 |
| Claude Agent SDK | 排除 | 官方包可用，但公开仓库没有完整核心源码，不满足本次“开源核心实现”口径 |

---

## 如何使用这组结果

- 这组数据只能回答“当前选型材料覆盖的活跃开源核心实现中，哪些语言路线更常见、开发活动是否仍然活跃”，不能回答市场收入、企业装机量、招聘需求或生产成熟度；
- Python 在服务端 Agent Framework、数据、RAG 和工作流生态中覆盖更广；TypeScript 已形成完整服务端路线，并在本次端侧 / Coding Harness 样本中占优；
- 语言占比不能替代场景选型。公司仍应按工作负载、团队能力、治理边界、部署和总体拥有成本比较完整方案；
- 建议在新增重要候选、项目归档或进入场景级选型时更新快照；如果以后要长期追踪，再把当前静态清单升级为自动化采集脚本。
