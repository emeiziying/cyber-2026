# gstack 实战指南：用角色化 Skill Pack 组建虚拟工程团队

> **背景：** [gstack](https://github.com/garrytan/gstack) 是 Garry Tan 开源的角色化 Skill Pack。仓库 README 把它描述为一套把 coding agent 变成"虚拟工程团队"的工作流，并给出了产品、工程、设计、QA、安全、发布等多种角色命令。

---

## gstack 是什么

gstack 把 coding agent 从"什么都能做的万能助手"变成了一支**虚拟工程团队**。

它的核心思路很简单：与其让同一个 AI 用同一种模糊人格处理产品规划、代码实现、安全审查、发布部署……不如**给每类工作绑定一个专业角色**，让 AI 以该角色的视角、优先级和约束来思考和输出。

结果是：你得到的不是一个"会写代码的聊天机器人"，而是一个**可以按需召唤 CEO、工程师、设计师、QA、安全官的 Slash Command 菜单**。

仓库 README 目前也明确提到：gstack 不只支持 Claude Code，还支持 Codex、Cursor、OpenCode 等多种 host。因此更准确的说法是，它是一套**以角色化 Slash Command 为核心、可安装到多个 coding agent 的 Skill 系统**。

---

## 核心机制

gstack 最核心的不是某一个命令，而是下面三件事：

- **角色化命令**：不同命令绑定不同专家身份，而不是让同一个 Agent 永远用同一种模糊人格工作
- **显式人工编排**：用户自己决定什么时候拉 CEO、设计师、Reviewer、QA 或安全官进场
- **多视角评审链**：同一个需求可以先后经过产品、工程、设计、测试和发布视角

按仓库 README 的描述，gstack 把能力拆成多个 specialist / power tools。下面是最容易理解的一组角色化归类：

| 角色 | Skill 命令 | 职责 |
|------|-----------|------|
| **CEO / YC Advisor** | `/office-hours`、`/plan-ceo-review`、`/autoplan` | 产品方向批判、目标对齐、自动规划 |
| **工程架构师** | `/plan-eng-review`、`/investigate`、`/benchmark` | 技术方案评审、问题排查、性能测试 |
| **设计师** | `/plan-design-review`、`/design-consultation`、`/design-shotgun`、`/design-html` | 交互设计评审、界面草稿生成 |
| **Code Reviewer** | `/review`、`/careful`、`/guard` | PR 审查、高风险代码防护 |
| **QA 工程师** | `/qa`、`/qa-only`、`/browse`、`/connect-chrome`、`/setup-browser-cookies` | 功能测试、浏览器自动化、端到端验证 |
| **Release Manager** | `/ship`、`/land-and-deploy`、`/canary`、`/document-release`、`/setup-deploy` | 发布流程、灰度上线、发布文档 |
| **安全官（CSO）** | `/cso` | 安全合规审查 |
| **效能工具** | `/retro`、`/learn`、`/freeze`、`/unfreeze`、`/gstack-upgrade`、`/codex` | 复盘、学习、版本锁定 |

---

## 典型工作流

以一个功能从规划到发布的完整周期为例：

```
阶段一：规划与评审
┌─────────────────────────────────────────────────────┐
│  /office-hours         CEO 视角批判产品价值           │
│  /autoplan             自动将目标拆解为任务计划        │
│  /plan-ceo-review      CEO + 产品策略对齐检查         │
│  /plan-eng-review      工程架构评审，识别设计缺陷       │
│  /plan-design-review   设计视角评审                   │
└─────────────────────────────────────────────────────┘
           ↓ 计划通过，开始开发
阶段二：开发与审查
┌─────────────────────────────────────────────────────┐
│  /guard                保护敏感文件，防止 Agent 越权   │
│  /review               PR 代码审查（Reviewer 角色）    │
│  /careful              高风险改动特别审查              │
└─────────────────────────────────────────────────────┘
           ↓ 代码审查通过
阶段三：测试与安全
┌─────────────────────────────────────────────────────┐
│  /qa                   端到端功能测试 + 浏览器自动化    │
│  /browse               无头浏览器验证界面              │
│  /cso                  安全合规检查                   │
└─────────────────────────────────────────────────────┘
           ↓ 测试通过
阶段四：发布
┌─────────────────────────────────────────────────────┐
│  /ship                 执行发布 Checklist             │
│  /land-and-deploy      部署执行                       │
│  /canary               灰度流量验证                   │
│  /document-release     生成发布文档                   │
│  /retro                发布复盘                       │
└─────────────────────────────────────────────────────┘
```

不需要每次都走完全部流程。日常开发中最常用的是：**`/review` → `/qa` → `/ship`** 这三步核心链路。

---

几个最能体现 gstack 风格的命令是：

- `/office-hours`：先从产品价值和问题定义入手，而不是一上来就写代码
- `/review`：用 Reviewer 视角检查结构、边界、长期维护性
- `/qa`：给 Agent 接浏览器能力，做真实交互验证
- `/ship`：把发布前检查做成明确的守门步骤
- `/guard` + `/freeze`：把边界和敏感文件保护写进工作流，而不是靠人工记忆

---

## 适合谁

**直接使用 gstack：**
- 独立开发者，希望一人扮演从产品到运维的全部角色
- 小团队，想要立即获得 battle-tested 的软件交付工作流
- 学习如何设计 Skill Pack 的团队（gstack 是极佳的参考实现）

**以 gstack 为灵感、构建自己的 Skill Pack：**
- 有特定业务场景的团队（gstack 是通用场景，不含业务特定约束和规范）
- 已有部分 Skills，想参考 gstack 补全发布和 QA 环节
- 企业团队，需要在 gstack 基础上加入合规层或私有化部署约束

**不适合直接使用：**
- 团队已有成熟的发布流水线和 Code Review 流程（直接套 gstack 会产生流程冲突）
- 项目有强合规要求（gstack 是通用开源工具，不含行业合规配置）

---

## 对 Skills & Hooks 的启发

gstack 可以看作 [如何制作 Skills](../advanced-patterns) 里“**从本地 Skill 升级为团队共享资产**”这一步的现实案例：

- 每个 `/command` 对应一个独立的 `.md` 文件，定义角色、规则、输出格式、约束
- 整套能力可以通过仓库分发和 `setup` 安装到宿主工具中，而不是要求团队成员手工逐条复制
- 角色化 Skill 的设计模式，说明 Skill 不一定只是"小命令"，也可以是带强人格和工作边界的专业角色

更值得借鉴的，不是原样复制全部命令，而是它背后的设计模式：

| gstack 模式 | 你的团队可以借鉴的做法 |
|------------|----------------------|
| **角色化 Skill** | 为 `/review` Skill 明确定义"Reviewer 视角"和优先级，而非让 AI 自由发挥 |
| **多角度评审链** | 重要功能上线前强制走 `/plan-eng-review`，避免单视角盲区 |
| **发布 Checklist** | 用 `/ship` 类 Skill 替代人工记忆清单，减少发布遗漏 |
| **文件保护机制** | 用 `/guard` + `/freeze` 保护 infra 目录，防止 Agent 在不该动的时候动 |
| **复盘内化** | 用 `/retro` 触发复盘，将发现的问题固化为新的 Skill 约束 |

安装命令、host 兼容性和最新 Skill 列表，建议直接以官方 README 为准；这篇页面重点是解释它的**结构价值**，不是替代官方安装文档。

---

## 最小引入方式

不要一上来就把 gstack 的整套角色菜单全搬进团队。

更稳的引入顺序通常是：

1. 先借一个**单角色视角 Skill**，例如把 `/review` 这类能力改造成你们自己的 Reviewer 视角
2. 再补一个**守门型 Skill**，例如发布前检查或 QA 验证，看看团队是否真的愿意按这个入口工作
3. 最后才考虑把多角色评审链串起来，让产品、工程、设计、测试视角接力出现

如果你们现在还没有稳定的发布节奏、测试入口或评审习惯，就先吸收它的角色化设计思想，不要急着复制完整命令集。

### 不要照搬什么

- 不要把开源仓库里的全部角色原样当成你们的团队角色
- 不要在团队还不习惯显式人工编排时，一次引入十几个命令
- 不要先上完整发布 / 灰度 / 复盘链路，再回头补团队自己的约束和边界

gstack 最值得先借的，是“不同视角要有不同工作边界”这件事，而不是命令数量。

---

## 延伸资源

- [gstack GitHub 仓库](https://github.com/garrytan/gstack) — 源码、安装说明、Skill 定义文件
- [工作流选型](./skill-pack-selection) — 如果你现在要在 gstack、superpowers 和 GSD 之间做判断
- [superpowers 实战指南](./superpowers-workflow) — 另一种更强调自动触发、TDD 和计划驱动的工作流
- [GSD 实战指南](./gsd-workflow) — 更强调上下文工程和规格稳定的另一条路线
- [如何制作 Skills](../advanced-patterns) — 先把本地 Skill 做稳，再理解 gstack 这类共享资产形态
- [Skill 与 Hook 判断案例](./skill-hook-decision-cases) — 什么时候用 Skill，什么时候用 Hook
- [Harness Engineering](../../harness-engineering/) — 如何把 gstack 等 Skill Pack 整合进团队 Harness
