# BOE 前端 Skill Pack 指南：这套 skills 分别做什么，如何协作

> **背景：** [frontend/skills](http://10.197.220.84:3000/frontend/skills) 这套仓库不是单个 Skill 的集合页，而是一条前端交付链路的拆分结果。它把需求规划、页面交付、单测、浏览器回归、缺陷回归、代码评审、发版前验证和评估资产放进同一套结构里，适合拿来回答一个更实际的问题：当团队准备把前端交付做成分阶段协作时，这些 skills 分别负责什么，应该怎样接起来看。

---

## 这套 skills 解决什么问题

很多团队已经开始把前端工作拆成更细的 AI 协作环节，但拆开之后会马上遇到另一类问题：

- 需求整理、页面实现、测试、评审各自都能做，却没有统一入口
- 上游阶段说过的话没有沉淀成下游可消费的工件
- 需求一变更，大家不知道该回退到哪个阶段
- 想补单测或跑回归时，不知道该直接进入哪个 skill

`frontend/skills` 这套仓库解决的不是“一个 Skill 能不能更强”，而是“当一条前端交付链路被拆成多个 skill 后，怎样让它们各自边界清楚、交接明确、顺序可恢复”。

如果你把它当成一套前端 Skill Pack 来看，更容易理解它的价值：

- 它不是只给你一个总 prompt
- 它也不是只提供一个页面生成器
- 它更像一份把前端交付拆成阶段能力的目录和协作约定

---

## 先看全景：8 个 skills 分别做什么

| Skill | 一句话定位 | 什么时候先看 |
|-------|-----------|--------------|
| `boe-frontend-sop` | 总控入口，负责阶段路由、交接包和退出条件 | 你还没决定这次请求该先走规划、修 bug、验证还是发版前检查 |
| `frontend-requirement-planning` | 把产品语言整理成前端可执行的规划包 | 你手上还是模糊需求，想先收敛范围、验收和测试义务 |
| `boe-naive-admin` | 面向 Vue 3 + Naive UI + `@boe/naive-admin` 的页面 / 模块交付 | 你已经知道要做什么页面，接下来要落成后台实现 |
| `frontend-unit-test` | 补 repo-native 单测 / 组件测试 | 你已经有代码或修复点，想补代码级回归 |
| `playwright-crud-smoke` | 做登录态 CRUD / 后台页面的浏览器层回归验证 | 你需要真实交互验证，而不是只看代码层测试 |
| `frontend-bug-regression` | 把 bug 变成可复现、可验收的回归卡片 | 你的入口是故障、回归、失败验证，而不是新功能 |
| `frontend-code-review` | 按 BOE 规范做正式前端评审 | 代码已经基本完成，准备进入合并前审查 |
| `frontend-release` | 处理构建、环境、CI/CD 和发版前验证 | 你关心的是 release readiness，而不是页面实现本身 |

把这张表看完后，读者应该先建立一个判断：这套 skills 不是“8 个功能差不多的工具”，而是对应 8 个不同阶段或职责。

---

## 它们如何协作

### 主链路怎么接

最常见的主链路可以先粗看成这样：

```text
原始请求
  ↓
boe-frontend-sop（判断当前入口）
  ↓
frontend-requirement-planning / frontend-bug-regression
  ↓
boe-naive-admin
  ↓
frontend-unit-test / playwright-crud-smoke
  ↓
frontend-code-review
  ↓
frontend-release
```

这条链路不是要求每次都走满，而是告诉你：如果把整套 skills 当成一条交付流水线来看，规划、交付、验证、评审和发版前检查分别有人负责。

其中 `boe-frontend-sop` 的角色更像编排入口：

- 负责先判断这次请求属于哪一种入口类型
- 负责决定当前应该由哪个阶段接手
- 负责检查交接是否具备继续往下走的条件

它本身不是页面生成 Skill，也不是测试 Skill。

### 5 个共享交接包

这套 skills 的稳定性，很大一部分来自显式交接包，而不是聊天上下文。

| 交接包 | 作用 |
|--------|------|
| `RequirementBrief` | 固定范围、约束、依赖和未知项 |
| `TaskBreakdown` | 把需求拆成可执行任务，并标明阶段归属 |
| `PageDeliveryBrief` | 固定页面 recipe、路由、API、权限和文件包 |
| `TestObligation` | 固定单测 / E2E 是否必需、回归重点和环境前提 |
| `BugRegressionCard` | 固定 bug 的症状、复现、修复验收和补测层 |

如果你只记一件事，可以先记这一点：这套 Skill Pack 并不要求每个 skill 都知道全部上下文，它要求关键上下文被写成共享工件。

### 常见场景先看哪条链路

| 场景 | 先进入哪个 skill | 后续通常怎么接 |
|------|------------------|----------------|
| 新功能 | `boe-frontend-sop` 或 `frontend-requirement-planning` | 规划 → 页面交付 → 测试 → review → release |
| 增量改动 | `boe-frontend-sop` 或从稳定 brief 直接进 `boe-naive-admin` | 交付 → 必要测试 → review |
| bug 修复 | `frontend-bug-regression` | 缺陷卡片 → 修复 → 回归补测 → review |
| 纯回归验证 | `playwright-crud-smoke` | 直接验证；失败时再回到 bug 回归链路 |

这一层最值得借鉴的，不是某个具体路由词，而是“先按入口类型分类，再决定当前 owner”这套思路。

---

## 如果你只需要其中一段能力，应该先看哪个

不是每个人都需要一次把整套 skills 全看完。更常见的读法是按当前问题进入：

- 只想做需求整理：先看 `frontend-requirement-planning`
- 只想做页面交付：先看 `boe-naive-admin`
- 只想补单测：先看 `frontend-unit-test`
- 只想跑浏览器回归：先看 `playwright-crud-smoke`
- 只想处理 bug 回归：先看 `frontend-bug-regression`
- 只想做代码审查：先看 `frontend-code-review`
- 只关心发版前验证：先看 `frontend-release`
- 还没判断现在该先做什么：先看 `boe-frontend-sop`

如果你是第一次接触这套仓库，更稳的顺序通常是：

1. 先看总览，知道 8 个 skills 的分工
2. 再看与你当前任务最接近的那个 skill
3. 最后才回头理解整套交接包和评估资产

---

## 仓库里还有什么配套资产

这套仓库不只有 `skills/` 目录。对读者来说，至少还要知道下面几层配套资产：

### README 是总入口

仓库根目录 `README.md` 负责说明：

- 这套 skills 一共包含哪些能力
- 它们之间通过什么交接包协作
- `evaluation/` 目录是做什么的
- 基本安装与接入方式在哪里看

如果你只想快速理解全貌，先读 README 比逐个翻 `SKILL.md` 更高效。

### `skills/<skill-name>/` 是每个 skill 的本体

每个 skill 都是一个独立目录，常见结构大致是：

```text
skills/<skill-name>/
├── SKILL.md
├── references/
├── assets/templates/
├── scripts/
└── agents/
```

这代表它不是单文件 prompt，而是一套由入口、参考资料、模板和适配层组成的能力包。

### `evaluation/` 是评估资产，不是正文附录

仓库根目录的 `evaluation/` 用来回答另一类问题：这套前端 skills 到底能不能把原型稳定转成规范化交付。

如果你只看页面交付，很容易忽略这一层；但从 Skill Pack 设计角度看，评估资产说明这套仓库不只关心“有没有技能”，还关心“技能链路是否可靠”。

### 校验脚本是配套治理的一部分

仓库里还提供了 `scripts/validate_skills.py` 和评估相关脚本，用来检查：

- Skill 目录结构是否完整
- `SKILL.md` 的 frontmatter 和引用是否一致
- README 的 skill 列表是否和实际目录同步
- 某些跨 skill 契约是否保持对齐

这说明它不只是“把几个 Skill 放在一起”，而是在用脚本维护整套能力包的一致性。

安装和宿主接入细节，直接以仓库 README 为准即可；这页的重点是帮你读懂这套 skills 的结构，不重复安装说明。

---

## 延伸阅读

- [frontend/skills 仓库](http://10.197.220.84:3000/frontend/skills) — README、skills 列表、交接包契约和评估资产入口
- [如何制作 Skills](../advanced-patterns) — 如果你想把某类高频前端工作也做成 Skill，先看最小骨架怎么写
- [部门级 Skill 共享](./dept-skill-sharing) — 当这类技能集需要跨角色共享时，怎样组织维护和反馈
- [Skills & Hooks](../) — 回到主章理解 Skill、Hook 和最小自动化路径的关系
- [团队工作流与质量控制](../../team-workflow/) — 看团队层面的协作、验收和质量控制怎么接上来
- [Harness Engineering](../../harness-engineering/) — 看这类 Skill Pack 如何进一步接入更完整的工程体系
- [工作流选型](./skill-pack-selection) — 如果你是在选主工作流，而不是看内部技能集，再去看这一页
