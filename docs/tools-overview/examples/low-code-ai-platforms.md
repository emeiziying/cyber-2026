# 可视化 AI 编排平台：Dify / Langflow / Flowise

> **定位：** 这一页介绍三个主流的可视化 AI 应用构建平台，帮助团队在"是否需要 Low-Code 编排工具"这个问题上做出判断。
>
> 它们不替代 Claude Code、Cursor 等编码工具，而是面向**不同场景和不同角色**的另一条路线。

---

## 先看结论

| 维度 | Dify | Langflow | Flowise |
|------|------|----------|---------|
| **一句话定位** | 全栈 LLM 应用开发平台，从原型到生产 | 可视化 + 代码双模的 AI 工作流构建器 | 面向非开发者的拖拽式 AI Agent 构建工具 |
| **核心优势** | 功能最全面：Workflow + RAG + Agent + LLMOps 一体化 | 可视化与 Python 代码自由切换，开发者友好 | 上手最快、部署最轻，适合快速验证想法 |
| **适合谁** | 需要完整 AI 应用交付能力的团队 | 希望保留代码控制力的开发者 | 非技术人员或需要快速原型的小团队 |
| **技术栈** | Python（后端）+ React（前端） | Python | Node.js（后端）+ React（前端） |
| **许可证** | 开源（附加条款） | MIT | Apache 2.0 |
| **GitHub Stars** | 90k+ | 50k+ | 50k+ |

---

## Dify —— 全栈 LLM 应用开发平台

[Dify](https://github.com/langgenius/dify) 是目前功能覆盖面最广的开源 LLM 应用平台，目标是让团队从"有一个 Prompt"到"上线一个完整 AI 应用"的全链路都能在同一个平台内完成。

### 核心能力

**1. 可视化 Workflow**

在画布上拖拽节点构建多步骤 AI 工作流。支持条件分支、循环、并行执行，适合构建复杂的业务流程自动化。

**2. RAG 管道**

内置文档摄取和检索管道，支持 PDF、PPT、Word 等常见格式。不需要额外搭建向量数据库基础设施，导入文档即可开始做知识问答。

**3. Agent 能力**

支持 Function Calling 和 ReAct 两种 Agent 模式，内置 50+ 工具（Google 搜索、DALL-E、Stable Diffusion、WolframAlpha 等），也可以自定义工具。

**4. Prompt IDE**

可视化的 Prompt 编辑和调试界面，支持对比不同模型的输出效果，内置文本转语音能力。

**5. 多模型支持**

接入数十家模型供应商的数百个 LLM，包括 GPT、Claude、Mistral、Llama 等，统一管理模型密钥和调用。

**6. LLMOps 可观测性**

应用日志监控、性能分析，可对接 Langfuse、Opik、Arize Phoenix 等第三方可观测平台。

**7. Backend-as-a-Service**

所有能力都暴露为 API，构建好的应用可以直接通过 REST API 集成到现有系统。

### 部署方式

- **Dify Cloud：** 官方托管，注册即用，含 200 次免费 GPT-4 调用
- **Docker Compose 自托管：** 最低要求 2 核 CPU + 4GB 内存
- **Kubernetes：** 社区提供 Helm Chart
- **云厂商市场：** 支持 AWS、Azure、GCP、阿里云一键部署

### 适用场景

- 需要从原型到生产的完整交付链路
- 团队中有非开发者需要参与 AI 应用构建
- 需要 RAG 知识库能力，但不想自己搭基础设施
- 需要同时管理多个模型供应商和多个 AI 应用

---

## Langflow —— 可视化与代码双模的工作流构建器

[Langflow](https://github.com/langflow-ai/langflow) 的独特之处在于"可视化和代码不是二选一"——你可以用拖拽快速搭建，也可以随时切到 Python 源码层做精细控制。

### 核心能力

**1. 可视化工作流构建**

基于节点的画布编辑器，支持快速原型迭代。每个节点都可以直接查看和修改底层 Python 代码。

**2. 交互式调试**

支持逐步调试工作流，查看每个节点的输入输出，定位问题时不用靠猜。

**3. 多 Agent 编排**

支持对话管理、检索增强、多 Agent 协作等复杂场景。

**4. 灵活的部署形态**

构建好的工作流可以导出为 API、JSON 文件，甚至发布为 MCP Server——这意味着用 Langflow 构建的能力可以直接被 Claude Code 等工具通过 MCP 协议调用。

**5. 可观测性集成**

对接 LangSmith、Langfuse 等主流监控平台。

### 部署方式

- **桌面应用：** 提供 Windows / macOS 独立安装包，开箱即用
- **pip 安装：** 支持 Python 3.10–3.13，通过 `uv` 包管理器安装
- **Docker：** 预构建镜像
- **源码部署：** 直接从 GitHub 克隆

### 适用场景

- 开发者想要可视化的便利，但不愿放弃代码层的控制力
- 需要把构建好的工作流发布为 MCP Server，与 Claude Code 等工具联动
- 团队同时有"用拖拽搭流程"和"用代码做精细调优"两类需求

---

## Flowise —— 最轻量的拖拽式 AI Agent 构建工具

[Flowise](https://github.com/FlowiseAI/Flowise) 追求的是"最快让非开发者也能构建 AI Agent"。它比 Dify 和 Langflow 更轻量，上手门槛也更低。

### 核心能力

**1. 拖拽式节点编辑器**

基于 React Flow 的可视化界面，拖拽连线即可构建 Agent 工作流，不需要写代码。

**2. 丰富的第三方集成**

支持主流 LLM、向量数据库、工具和数据源的节点接入，通过组件化的方式扩展能力。

**3. 自动生成 API**

每个构建好的工作流自动暴露为 REST API，带有 Swagger 文档。

**4. 极简部署**

只需 `npx flowise start` 即可本地运行，Node.js 18.15+ 是唯一前置依赖。

### 部署方式

- **npm 快速启动：** `npx flowise start` 一行命令
- **Docker / Docker Compose：** 预构建容器
- **云平台：** AWS、Azure、GCP、阿里云均有部署文档
- **PaaS：** Railway、Render、HuggingFace Spaces 等一键部署
- **Flowise Cloud：** 官方托管服务

### 适用场景

- 非技术人员想要自己构建简单的 AI 工作流
- 团队需要快速验证一个 AI 想法，不想搭复杂基础设施
- 小团队需要一个轻量级的内部 AI 工具，部署和维护成本要低

---

## 三者对比

### 功能维度

| 能力 | Dify | Langflow | Flowise |
|------|------|----------|---------|
| 可视化工作流 | 完整画布，支持分支/循环/并行 | 节点画布 + 代码双模 | 节点画布，简洁直观 |
| RAG / 知识库 | 内置完整管道 | 通过组件支持 | 通过组件支持 |
| Agent 能力 | Function Calling + ReAct，50+ 内置工具 | 多 Agent 编排 | 基础 Agent 构建 |
| 模型支持 | 数十家供应商，统一管理 | 主流 LLM + 向量数据库 | 主流 LLM + 向量数据库 |
| Prompt 管理 | 独立 Prompt IDE | 节点内编辑 | 节点内编辑 |
| 可观测性 | 内置 + 第三方集成 | 第三方集成 | 基础日志 |
| API 输出 | REST API | API / JSON / MCP Server | REST API + Swagger |
| 代码控制力 | 主要通过 API 扩展 | 可直接编辑 Python 源码 | 主要通过节点配置 |

### 选型建议

| 你的情况 | 推荐 |
|----------|------|
| 需要从原型到生产的完整平台，团队中有非开发者参与 | **Dify** |
| 开发者为主，想要可视化便利但不放弃代码控制 | **Langflow** |
| 想用最少的时间和资源跑通一个 AI 工作流验证 | **Flowise** |
| 需要与 Claude Code 通过 MCP 协议联动 | **Langflow**（可导出为 MCP Server） |
| 需要内置 RAG 知识库，不想自己搭向量数据库 | **Dify** |
| 非技术人员主导构建 | **Flowise** > Dify > Langflow |

---

## 与编码工具的关系

这三个平台和 Claude Code、Cursor 等编码工具**不是替代关系**，而是面向不同场景：

| 场景 | 更适合的工具 |
|------|-------------|
| 写代码、改代码、重构、调试 | Claude Code、Cursor、Copilot |
| 构建不涉及代码仓库的 AI 工作流（客服、知识问答、数据处理） | Dify、Langflow、Flowise |
| 需要可视化编排，但最终要集成进代码项目 | Langflow（MCP Server 导出）或 Dify（REST API） |
| 快速验证一个 AI 想法，还不确定值不值得写代码 | Flowise 或 Dify Cloud |

本站 [工具全景](../) 主文档中的"按使用形态分类"已经把这类工具归入"平台 / 编排类"。如果你的团队同时有编码场景和非编码的 AI 工作流场景，组合使用是常见的成熟做法。

---

## 延伸资源

- [Dify GitHub 仓库](https://github.com/langgenius/dify) — 源码、文档与部署指南
- [Langflow GitHub 仓库](https://github.com/langflow-ai/langflow) — 源码与安装说明
- [Flowise GitHub 仓库](https://github.com/FlowiseAI/Flowise) — 源码与部署文档
- [工具全景](../) — 本站的工具选型框架和横向对比
- [MCP 模块](../../mcp/) — 如果你想了解 Langflow 导出的 MCP Server 怎么接入 Claude Code
