# 热门 Skill Pack 汇总

> 本页汇总 2026 年社区中最受欢迎的 Claude Code Skill Pack，帮助团队快速找到可以直接使用或借鉴设计的现成工作流。

---

## 概览

随着 Claude Code Skills 生态的成熟，社区涌现出多个高质量的 Skill Pack。两个标杆项目的定位差异明显，可以互补使用：

| | Superpowers | gstack |
|-|-------------|--------|
| **核心理念** | TDD 优先，强制代码质量 | 角色专业化，覆盖完整交付周期 |
| **Stars（2026-04）** | 106,000 | 39,000 |
| **发布时间** | 2025 年 10 月起增长 | 2026 年 3 月发布 |
| **安装渠道** | Anthropic 官方插件市场 + GitHub | GitHub |
| **擅长阶段** | 实现循环（测试 → 代码 → 重构） | 规划和发布前后 |
| **Skill 数量** | ~10 个（精而深） | 23+（广而专） |
| **适合场景** | 代码质量要求高、习惯 TDD 的团队 | 需要完整软件交付工作流的团队 |

---

## Superpowers — TDD 优先的质量框架

**创建者：** Jesse Vincent（obra）  
**Stars：** 106,000（2026-04，增长仍在加速）  
**协议：** MIT  
**官方渠道：** [Anthropic Claude Code 插件市场](https://claude.com/plugins/superpowers) + [GitHub](https://github.com/obra/superpowers)

### 核心理念

Superpowers 解决的问题是：**AI 会走捷径**。

没有约束的 AI 倾向于：
- 直接实现功能，跳过需求澄清
- 不写测试，或在代码写完之后才补测试
- 遇到 bug 靠猜测修改，而非系统性排查

Superpowers 用"心理强制执行"原则阻止这些捷径——它明确告诉 AI：**在没有失败测试的情况下，不允许开始写实现代码**。

### 7 阶段工作流

每个阶段必须按顺序执行，不可跳过：

```
1. Brainstorm  → 苏格拉底式需求对话，澄清真实目标
2. Plan        → 将需求转化为具体技术方案
3. Test        → 先写测试（测试必须先失败才能继续）
4. Implement   → 让测试变绿（红绿循环，专注通过而不是追求完美）
5. Review      → 架构合理性和质量审查
6. Refactor    → 在测试保护下重构和优化
7. Document    → 更新文档，记录决策
```

### 核心 Skills

| Skill | 触发 | 作用 |
|-------|------|------|
| `/tdd` | 开始新功能时 | 触发完整 TDD 循环（3–7 阶段） |
| `/brainstorm` | 需求不清晰时 | 苏格拉底式追问，澄清真实问题 |
| `/debug` | 遇到 bug 时 | 四阶段 debug：现象 → 假设 → 验证 → 修复（禁止猜测式改代码） |
| `/review` | PR 完成时 | 代码质量、架构合理性审查 |
| `/architect` | 设计决策时 | 记录架构决策（ADR 格式） |

### 安装方式

```bash
# 通过 Claude Code 插件市场安装（推荐）
# 在 Claude Code 中执行：
/install superpowers

# 或手动 clone 到用户级命令目录
git clone https://github.com/obra/superpowers ~/.claude/commands/superpowers
```

### 使用示例

```
用 TDD 方式实现一个用户登录功能，包含邮箱格式校验和密码强度检查
/tdd
```

Superpowers 会引导 AI 先问清楚需求，写出失败的测试，再逐步实现让测试通过，最后重构优化——整个过程有明确的 checkpoint，不允许跳步。

---

## Superpowers vs gstack：如何选择和组合

### 设计哲学的本质差异

**Superpowers：** 关注"这段代码写对了吗？"——强制 TDD，保证每一行代码都有测试覆盖，有明确的实现质量标准。

**gstack：** 关注"整个开发流程是否到位？"——从产品方向（`/office-hours`）到部署（`/ship`）、复盘（`/retro`），覆盖编码前后的所有环节。

### 实际选择建议

**选 Superpowers，如果：**
- 团队的核心痛点是代码质量和测试覆盖率不足
- 团队有 TDD 经验或希望建立 TDD 文化
- 项目对正确性要求极高（金融、医疗等）

**选 gstack，如果：**
- 团队的核心痛点是缺乏完整的软件交付流程（规划、发布、复盘）
- 一人或小团队，需要扮演从 CEO 到 QA 的全部角色
- 已有代码质量保障，需要补完规划和发布环节

**组合使用（最成熟的模式）：**

```
规划阶段：  gstack /office-hours → /autoplan → /plan-eng-review
实现阶段：  Superpowers /brainstorm → /tdd（红绿循环）
发布阶段：  gstack /review → /qa → /cso → /ship → /retro
```

两者互不干涉——gstack 主导编码前和编码后，Superpowers 主导编码过程本身。

---

## TaskMaster AI — AI 驱动的任务拆解框架

**创建者：** Eyal Toledano（eyaltoledano）  
**Stars：** 50,000+（2026-04，持续增长）  
**协议：** MIT  
**官方渠道：** [GitHub](https://github.com/eyaltoledano/claude-task-master)

### 核心理念

TaskMaster 解决的问题是：**复杂需求难以直接交给 AI 一步完成**。

没有拆解的大任务会导致：
- AI 在中途迷失方向，反复询问需求
- 任务过长导致上下文窗口撑满，质量下降
- 没有可追踪的进度节点，不知道 AI 做到哪里

TaskMaster 的思路是**把需求文档转化为结构化任务树**，每个任务有明确的 ID、依赖关系、验收标准和状态。AI 每次只处理一个叶子任务，完成后更新状态并移动到下一个。

### 核心工作流

```
1. 初始化  → /init           解析 PRD 或需求文档，生成任务树（tasks.json）
2. 查看    → /list           列出所有任务及状态（待处理 / 进行中 / 完成）
3. 执行    → /next           AI 自动选择下一个可执行任务并开始
4. 展开    → /expand [id]    对复杂任务进行二次拆解，生成子任务
5. 更新    → /update [id]    人工调整某个任务的描述或优先级
6. 追踪    → /status         当前进度概览（完成比例、阻塞任务）
```

### 核心 Skills

| Skill | 触发 | 作用 |
|-------|------|------|
| `/init` | 项目启动时 | 解析需求文档，生成完整任务树 |
| `/next` | 每轮开始时 | 自动选择并执行下一个待处理任务 |
| `/expand [id]` | 任务过于复杂时 | 对指定任务进行二次拆解 |
| `/list` | 随时查看进度 | 展示当前任务树和各任务状态 |
| `/status` | 检查整体进展 | 汇总完成比例和阻塞情况 |

### 安装方式

```bash
# 通过 npm 全局安装
npm install -g task-master-ai

# 初始化当前项目
task-master init

# 或直接通过 npx 运行
npx task-master-ai init
```

安装后，TaskMaster 的 Skills 会自动挂载到 Claude Code 的命令目录下。

### 使用示例

```
我有一份用户认证模块的 PRD，帮我拆解成可执行任务
/init prd-auth.md
```

TaskMaster 会解析 PRD 文档，输出一棵结构化任务树。之后每次开始工作只需：

```
/next
```

AI 会自动选择优先级最高且依赖已满足的任务，执行完毕后更新状态，等待下一次 `/next`。

### 与 Superpowers / gstack 的区别

| | TaskMaster | Superpowers | gstack |
|-|------------|-------------|--------|
| **核心关注** | 需求拆解与进度追踪 | 代码实现质量 | 完整交付流程 |
| **切入点** | 项目规划初期 | 编码实现阶段 | 全流程 |
| **最适合** | 需求复杂、任务多的项目 | 代码质量要求高的团队 | 小团队全流程覆盖 |
| **可组合** | ✅ 与 Superpowers / gstack 互补 | ✅ | ✅ |

**推荐组合：**
```
TaskMaster /init → /next（确定当前任务）
→ Superpowers /brainstorm → /tdd（实现当前任务）
→ TaskMaster /update（更新任务状态）
→ 重复
```

---

## 其他值得关注的资源

### 社区精选列表

**[awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)**  
社区维护的 Claude Code Skills 精选列表，按功能分类（代码质量、测试、文档、安全……），持续更新。

**[claude-skills（alirezarezvani）](https://github.com/alirezarezvani/claude-skills)**  
220+ Skills 合集，覆盖工程、营销、产品、合规、C-Level 顾问等角色，适合需要跨职能 AI 能力的团队。

**[punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)**  
社区维护的 MCP Server 合集，与本站 MCP 模块的[热门开源项目](../../mcp/examples/popular-mcp-servers)页面交叉参考使用。

**[anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook)**  
Anthropic 官方示例仓库，包含 Claude API 的使用范例、Skill 设计参考和 Agent 模式实现，适合构建自定义 Skill Pack 时参考。

### 官方渠道

**[Anthropic Claude Code 插件市场](https://claude.com/plugins)**  
Anthropic 官方审核的高质量 Skill Pack 集合，Superpowers 已入选，持续有新项目提交。

---

## 与本站其他章节的关系

- [gstack 实战指南](./gstack-workflow) — 本站已有详细 gstack 说明，含完整角色体系和工作流
- [Skills & Hooks 进阶模式](../advanced-patterns) — 理解 Skill Pack 背后的设计模式
- [Harness Engineering](../../harness-engineering/) — 如何把 Skill Pack 整合进团队 Harness 的 Constraints Layer
