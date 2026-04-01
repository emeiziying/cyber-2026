# 第七章：从工具使用到 Agent 开发

> **适合人群：** 工程师（有一定 AI 工具使用经验）
> **学习目标：** 理解 Agent 架构，能构建简单的自定义 Agent，了解 Multi-Agent 模式

---

## 7.1 Agent vs Copilot：本质区别

```
Copilot 模式（被动响应）：
  用户输入 → AI 生成代码 → 用户接受/修改 → 用户执行
  （人类是执行者）

Agent 模式（自主执行）：
  用户描述目标 → AI 规划步骤 → AI 自主调用工具 → AI 验证结果 → 返回最终成果
  （AI 是执行者，人类是决策者）
```

**关键特征：**
- **工具调用循环（ReAct 循环）：** Think → Act → Observe → Think...
- **自主决策：** AI 自己决定下一步做什么
- **多步骤任务：** 能完成需要多个操作的复杂任务

---

## 7.2 Agent 的工作原理

```
用户目标
    ↓
┌─────────────────────────────────────┐
│              Agent Loop              │
│                                     │
│  1. Think: 分析当前状态，规划下一步  │
│     ↓                               │
│  2. Act: 调用工具（读文件/执行命令/  │
│          调用 API...）               │
│     ↓                               │
│  3. Observe: 观察工具返回结果        │
│     ↓                               │
│  4. 判断：目标达成了吗？             │
│     ├── 是 → 返回结果               │
│     └── 否 → 回到 Step 1            │
└─────────────────────────────────────┘
```

---

## 7.3 Claude Agent SDK 基础

Anthropic 提供了官方的 Agent SDK，可以用于构建自定义 Agent：

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// 定义工具
const tools = [
  {
    name: "read_file",
    description: "读取文件内容",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "文件路径" }
      },
      required: ["path"]
    }
  }
];

// Agent 循环
async function runAgent(userMessage: string) {
  const messages = [{ role: "user", content: userMessage }];

  while (true) {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      tools,
      messages
    });

    // 任务完成
    if (response.stop_reason === "end_turn") {
      return response.content;
    }

    // 处理工具调用
    if (response.stop_reason === "tool_use") {
      const toolResults = await executeTools(response.content);
      messages.push(
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults }
      );
    }
  }
}
```

---

## 7.4 Claude Code 的 Sub-Agent 机制

Claude Code 内置了 Agent 工具，可以在会话中启动子 Agent 处理并行任务：

```
你：帮我分析这个项目，找出：
    1. 所有没有测试的 service 文件
    2. 所有有安全漏洞风险的 API 接口
    3. 依赖库中有已知漏洞的包

AI：我会启动三个并行的子 Agent 分别处理这三个任务...
    [Agent 1: 扫描测试覆盖率]
    [Agent 2: 分析 API 安全]
    [Agent 3: 检查依赖漏洞]
```

**优势：**
- 并行执行，速度更快
- 每个子 Agent 专注单一任务，结果更精确
- 主 Agent 负责整合结果

---

## 7.5 实战：构建代码审查 Agent

下面是一个完整的代码审查 Agent 思路，可以作为学习项目：

**功能目标：**
1. 接收 PR 编号作为输入
2. 自动读取 PR 的变更内容
3. 按照团队规范执行代码审查
4. 将 Review 结果以评论形式发布到 PR

**工具依赖：**
- GitHub MCP（读取 PR + 发布评论）
- 文件系统工具（读取项目规则）

**Prompt 设计：**
```
你是一个专业的代码审查 Agent。

工具：
- github_get_pr: 获取 PR 的变更内容
- github_add_review_comment: 在具体代码行添加评论
- github_submit_review: 提交 Review（Approve/Request Changes）

任务：
1. 用 github_get_pr 获取 PR #{number} 的所有变更
2. 逐一分析每个文件的变更
3. 对发现的问题用 github_add_review_comment 添加行级评论
4. 最终用 github_submit_review 提交总体评审意见

审查重点：{从 CLAUDE.md 读取的项目规则}
```

---

## 7.6 Multi-Agent 架构模式

```
                    ┌─────────────┐
                    │  主 Agent   │ ← 接收用户目标，拆解任务
                    └──────┬──────┘
                           │ 分配子任务
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ 研究 Agent  │  │ 代码 Agent  │  │ 测试 Agent  │
   │（搜索文档） │  │（写实现）   │  │（写测试）   │
   └─────────────┘  └─────────────┘  └─────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           ↓ 汇总结果
                    ┌─────────────┐
                    │  主 Agent   │ → 返回最终结果给用户
                    └─────────────┘
```

**适用场景：**
- 代码库全量迁移（不同语言版本）
- 大规模文档生成
- 全项目安全审计

---

## 7.7 Agent 的安全与边界控制

**重要原则：**

1. **人类在回路（Human in the Loop）**
   - 高风险操作（删除、部署、外部 API 调用）前需要用户确认
   - 使用 `--dangerously-skip-permissions` 前要充分评估风险

2. **沙箱化执行**
   - 使用 worktree 隔离模式运行 Agent
   - 不要在生产环境运行未经测试的 Agent

3. **操作审计**
   - 记录 Agent 执行的所有操作（用 Hooks 实现）
   - 重要操作有回滚方案

4. **权限最小化**
   - Agent 使用的 MCP Token 只给必要权限
   - 文件系统访问限制在项目目录内

---

## 7.8 学习路径推荐

```
Level 1: 使用现有 Agent（Claude Code）完成复杂任务
    ↓
Level 2: 通过 Skill + Hook 定制 Claude Code 行为
    ↓
Level 3: 用 Claude API + SDK 构建简单的 Agent 脚本
    ↓
Level 4: 设计 Multi-Agent 系统解决团队特定问题
    ↓
Level 5: 构建团队 Agent 平台，支持多人协作
```

---

## 完成检查清单

- [ ] 能解释 Agent 的 ReAct 循环（Think-Act-Observe）
- [ ] 用 Claude Code 完成过一个 Agent 模式的多步骤任务
- [ ] 了解 Claude Agent SDK 的基本使用方式
- [ ] 知道 Multi-Agent 架构的适用场景
- [ ] 了解 Agent 安全控制的关键原则

---

**上一章 ←** [第六章：Skills & Hooks](../06-skills-hooks/)
**下一章 →** [第八章：生产落地与治理](../08-production-governance/)

---

## 进一步学习

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [Anthropic SDK 文档](https://docs.anthropic.com/en/api)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [SWE-bench 基准测试](https://www.swebench.com)（了解 AI 编码能力现状）
