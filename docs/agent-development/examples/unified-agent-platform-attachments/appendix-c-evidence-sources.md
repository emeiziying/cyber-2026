# 附件 C：证据口径与外部资料索引

> **所属报告：** [公司 Agent 技术现状、需求与平台演进规划](../unified-agent-platform-selection-report)
> **资料快照：** 2026-08-24
> **附件性质：** 证据口径与外部来源索引；候选清单不构成 shortlist、采购或生产上线建议

---

## 证据状态

每项现状能力分别经过以下四个证据门，不以“代码存在”代替生产证明：

| 证据门 | 需要证明 | 无证据时 |
|--------|----------|----------|
| Implemented | 在指定源码版本中存在实现 | 记为未验证，不推断已经实现 |
| Deployed | 在指定环境和配置版本中已部署 | 记为未验证，不以源码代替部署证据 |
| Enforced | 不能通过旁路绕过 | 记为未验证，不以配置声明代替强制证据 |
| Verified | 已通过冻结的正向、负向和故障测试 | 记为未验证，不以 Demo 成功代替验证证据 |

每个证据门独立记录“通过、未通过或未验证”。内部证据至少记录源码或镜像摘要、部署环境、配置版本、验证日期、责任人和证据位置。对外候选至少记录项目版本或 commit、许可证或 Edition、部署形态、官方来源和核验日期。

## 主要官方资料

以下入口已在资料快照日复核。动态文档只支持当前定位判断；候选进入 shortlist 后，必须固定到具体版本或 commit，并重新核对许可证、Edition、部署形态和维护状态。

- Dify：[仓库](https://github.com/langgenius/dify)、[开源许可证](https://github.com/langgenius/dify/blob/main/LICENSE)、[Enterprise](https://dify.ai/pricing/dify-enterprise)
- Haystack：[开源框架](https://github.com/deepset-ai/haystack)、[Enterprise Platform](https://www.deepset.ai/haystack-platform)
- Langflow：[仓库](https://github.com/langflow-ai/langflow)、[生产 Runtime](https://docs.langflow.org/deployment-kubernetes-prod)、[认证与授权](https://docs.langflow.org/authentication-overview)
- LangChain / LangGraph：[LangChain 仓库](https://github.com/langchain-ai/langchain)、[LangGraph 概览](https://docs.langchain.com/oss/python/langgraph/overview)、[Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- Mastra：[仓库](https://github.com/mastra-ai/mastra)、[Core 许可证](https://github.com/mastra-ai/mastra/blob/main/LICENSE.md)、[`ee/` Enterprise License](https://github.com/mastra-ai/mastra/blob/main/ee/LICENSE)、[Studio](https://mastra.ai/studio)、[Workflows](https://mastra.ai/ai-workflows)、[MCP](https://mastra.ai/docs/agents/mcp-guide)
- PydanticAI：[概览](https://pydantic.dev/docs/ai/overview/)、[Durable execution](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/)
- Agno：[仓库](https://github.com/agno-agi/agno)、[AgentOS Runtime](https://docs.agno.com/agent-os/introduction)、[Security](https://docs.agno.com/agent-os/security/overview)、[Hosted Control Plane](https://docs.agno.com/agent-os/control-plane)、[开源 Agent UI](https://github.com/agno-agi/agent-ui)
- CrewAI：[仓库](https://github.com/crewAIInc/crewAI)、[Flows](https://docs.crewai.com/en/concepts/flows)、[AMP](https://docs.crewai.com/enterprise/introduction)
- AgentScope：[仓库](https://github.com/agentscope-ai/agentscope)、[文档](https://doc.agentscope.io/)
- Coze Studio：[仓库](https://github.com/coze-dev/coze-studio)、[FAQ](https://docs.coze.cn/guides_FAQ)
- Google ADK：[仓库](https://github.com/google/adk-python)、[文档](https://google.github.io/adk-docs/)
- OpenAI Agents SDK：[Python 文档](https://openai.github.io/openai-agents-python/)
- Claude Agent SDK：[概览](https://code.claude.com/docs/en/agent-sdk/overview)、[安全部署](https://code.claude.com/docs/en/agent-sdk/secure-deployment)
- Deep Agents：[概览](https://docs.langchain.com/oss/python/deepagents/overview)、[生产部署](https://docs.langchain.com/oss/python/deepagents/going-to-production)
- VoltAgent：[文档](https://voltagent.dev/docs/)、[认证](https://voltagent.dev/docs/api/authentication/)、[Sandbox](https://voltagent.dev/docs/workspaces/sandbox/)
- Vercel AI SDK：[Agent 文档](https://ai-sdk.dev/docs/agents/overview)、[许可证](https://github.com/vercel/ai/blob/main/LICENSE)
- DeepSeek Harness：[仓库](https://github.com/deepseek-ai/deepseek-harness)、[v0.1.1-rc.2 / `b150a55`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.2)、固定快照的 [Web Server](https://github.com/deepseek-ai/deepseek-harness/blob/b150a55/docs/subsystems/web-server.md)、[Sandbox](https://github.com/deepseek-ai/deepseek-harness/blob/b150a55/docs/subsystems/sandbox.md)和[凭据边界](https://github.com/deepseek-ai/deepseek-harness/blob/b150a55/packages/credentials/credentials-local/README.md)
- Pi：[仓库与权限说明](https://github.com/earendil-works/pi#permissions--containerization)
- OpenHands：[仓库](https://github.com/OpenHands/OpenHands)、[Agent Server](https://docs.openhands.dev/sdk/arch/agent-server)
- OpenCode：[仓库](https://github.com/anomalyco/opencode)、[安全边界](https://github.com/anomalyco/opencode/security)
- Microsoft Agent Framework：[C#、Python、Go 概览](https://learn.microsoft.com/en-us/agent-framework/overview/)、[Checkpoint](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints)
- AutoGen：[维护状态与继任说明](https://github.com/microsoft/autogen)
- SWE-agent / mini-swe-agent：[SWE-agent](https://github.com/SWE-agent/SWE-agent)、[mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent)
- Flowise：[归档与 EOL 公告](https://github.com/FlowiseAI/Flowise/discussions/6727)、[归档仓库](https://github.com/FlowiseAI/Flowise)
- LlamaIndex：[Python 仓库](https://github.com/run-llama/llama_index)、[已归档 TypeScript 仓库](https://github.com/run-llama/LlamaIndexTS)
- OWASP：[Agentic Applications Top 10](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
- NIST：[AI Risk Management Framework](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)

本索引是本报告材料的统一外部资料入口。候选项目的完整版本化证据表在形成 shortlist 后补充；项目名称只用于技术路线说明，不构成 shortlist 或采购建议。
