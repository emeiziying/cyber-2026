# gstack 实战指南：用角色化 Skill Pack 组建虚拟工程团队

> **背景：** gstack 是 Y Combinator 总裁 Garry Tan 于 2026 年 3 月开源的 Claude Code Skill Pack，发布 11 天达到 39000 Stars。Garry Tan 团队使用此套件，60 天交付 60 万行生产代码，峰值每天 1–2 万行。

---

## gstack 是什么

gstack 把 Claude Code 从"什么都能做的万能助手"变成了一支**虚拟工程团队**。

它的核心思路很简单：与其让同一个 AI 用同一种模糊人格处理产品规划、代码实现、安全审查、发布部署……不如**给每类工作绑定一个专业角色**，让 AI 以该角色的视角、优先级和约束来思考和输出。

结果是：你得到的不是一个"会写代码的聊天机器人"，而是一个**可以按需召唤 CEO、工程师、设计师、QA、安全官的 Slash Command 菜单**。

---

## 角色体系

gstack 的 23+ 个 Skill 按角色分组：

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

## 完整工作流：从想法到上线

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

## 核心 Skill 详解

### `/office-hours` — YC 式产品批判

模拟 Y Combinator Office Hours 场景，强迫你用 60 秒阐明产品价值，AI 以 YC Partner 的视角追问：

- "这个功能解决的是真实用户问题还是你想象中的问题？"
- "为什么用户会为此付钱？"
- "三个月后你如何验证这个方向是对的？"

**适合时机：** 开始一个新功能前、对产品方向有疑虑时、复盘为什么某个功能没有预期效果时。

---

### `/review` — 资深工程师 PR 审查

以 Staff Engineer 的视角做代码审查，重点不是语法，而是：

- 架构合理性（这个改动会不会埋下长期技术债？）
- 边界条件覆盖（空值、并发、失败路径）
- 可维护性（六个月后的你能读懂这段代码吗？）

输出格式：分级别的问题清单（必须修复 / 建议优化 / 风格意见），附带具体修改建议。

---

### `/qa` — 浏览器自动化测试

结合无头 Chrome 做端到端功能验证：

1. 根据改动范围自动生成测试用例
2. 启动无头浏览器执行测试
3. 截图记录关键步骤
4. 生成测试报告（通过 / 失败 + 截图证据）

需要提前运行 `/setup-browser-cookies` 和 `/connect-chrome` 完成浏览器配置。

---

### `/ship` — 发布 Checklist 守门

在代码进入发布流程前，强制检查：

- 测试是否全部通过
- CHANGELOG 是否已更新
- 版本号是否与 package.json / 标签一致
- 数据库迁移脚本是否已就绪
- 监控告警是否配置

任意条件不满足时，`/ship` 拒绝继续并输出具体缺口。这个设计的核心价值：**把"工程师脑海中的发布记忆"变成可执行的自动化约束**。

---

### `/guard` + `/freeze` — 文件保护机制

`/guard`：标记敏感文件（如 `infra/`、`migrations/`、`.env.template`），Agent 在修改这些文件前会要求明确确认。

`/freeze`：临时锁定特定目录或文件，防止 Agent 在发布窗口期间意外修改核心配置。

`/unfreeze`：解除锁定。

这是 Harness Engineering 中"架构约束"层的直接实现——不依赖人工记忆，而是把边界编码进工作流。

---

## 与 Claude Code Skills 体系的关系

gstack 是 [Skills & Hooks 进阶模式](../advanced-patterns)中"**Skill 作为可分发产品包**"的完整现实案例：

- 每个 `/command` 对应一个独立的 `.md` 文件，定义角色、规则、输出格式、约束
- 整套 gstack 通过 `git clone` 一键安装，无需逐条配置
- 角色化 Skill 的设计模式（给 Skill 绑定角色身份）直接来自 gstack

**本地安装方式：**

```bash
# 安装到用户级命令目录（适用于所有项目）
git clone https://github.com/garrytan/gstack ~/.claude/commands/gstack

# 或安装到项目级命令目录
git clone https://github.com/garrytan/gstack .claude/commands/gstack
```

安装后即可在任意项目中使用 `/gstack/review`、`/gstack/ship` 等命令。

---

## 用 gstack 设计模式构建自己的 Skill Pack

gstack 未必要全盘采用——对大多数团队而言，更大的价值是把它当作**设计参考**：

| gstack 模式 | 你的团队可以借鉴的做法 |
|------------|----------------------|
| **角色化 Skill** | 为 `/review` Skill 明确定义"Reviewer 视角"和优先级，而非让 AI 自由发挥 |
| **多角度评审链** | 重要功能上线前强制走 `/plan-eng-review`，避免单视角盲区 |
| **发布 Checklist** | 用 `/ship` 类 Skill 替代人工记忆清单，减少发布遗漏 |
| **文件保护机制** | 用 `/guard` + `/freeze` 保护 infra 目录，防止 Agent 在不该动的时候动 |
| **复盘内化** | 用 `/retro` 触发复盘，将发现的问题固化为新的 Skill 约束 |

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

## 延伸资源

- [gstack GitHub 仓库](https://github.com/garrytan/gstack) — 源码、安装说明、Skill 定义文件
- [Skills & Hooks 进阶模式](../advanced-patterns) — gstack 背后的 Skill 设计模式
- [Skill 与 Hook 判断案例](./skill-hook-decision-cases) — 什么时候用 Skill，什么时候用 Hook
- [Harness Engineering](../../harness-engineering/) — 如何把 gstack 等 Skill Pack 整合进团队 Harness
