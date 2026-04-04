# Skills & Hooks

> **适合人群：** 工程师
> **学习目标：** 知道什么时候该用 Skill，什么时候该用 Hook，并能为真实项目设计可维护的最小自动化规范

---

## 6.1 本章解决什么问题

当团队已经开始稳定使用 AI 后，新的低效会出现：

- 同一种 bug 修复说明要反复说
- 同一种 review 格式每次都要重复要求
- 每次会话开始都要人工提醒环境信息
- 明明某些危险操作应该自动阻止，却还要靠人工盯

本章解决的是：如何把这些重复动作封装成**可复用、可共享、可维护**的工作流能力。

---

## 6.2 为什么这件事重要

Rules 解决的是“AI 应该知道什么”，而 Skills 和 Hooks 解决的是“AI 应该怎样稳定地做一类事情”。

如果没有这层封装，团队会出现两个问题：

- 高质量做法只存在于少数人的聊天记录里
- 每个人都在手写一套相似但不一致的操作流程

Skills 与 Hooks 的价值，是把“会用”变成“可重复”。

这一章讲的是**什么时候该封装、怎样封装得稳定**，不承诺这些 Skill / Hook 要放在这里。当前提供的模板只是教学骨架；真实专项 Skill / Hook 更适合进入具体项目仓或专门资产仓维护。

---

## 6.3 核心概念与边界

### Skill 是什么

Skill 更像一个“带说明的斜杠命令”。  
它适合把**用户主动发起的复杂流程**封装起来，比如：

- 修 bug
- 生成测试
- 做 code review
- 产出日报

### Hook 是什么

Hook 更像“在事件发生时自动执行的一段守门逻辑”。  
它适合处理**无需用户每次主动提醒的自动化动作**，比如：

- 会话开始时自动加载环境信息
- 调工具前阻止危险命令
- 调工具后记录修改日志

### 一个快速判断

| 如果你想解决的是… | 更适合 |
|-------------------|--------|
| 用户反复主动发起的复杂任务 | Skill |
| 某类事件每次都该自动触发 | Hook |
| 结果要有固定输出格式 | Skill |
| 某个危险行为必须被拦截 | Hook |

### 边界说明

本套方法论在这一部分提供的是：

- 判断 Skill / Hook 是否值得存在的方法
- 结构化编写 Skill / Hook 的教学模板
- 一个最小演示项目，帮助理解目录组织和命名方式

本套方法论**不**在这里沉淀真实业务专项 Skill / Hook。这一部分的目标是教你把这类资产设计对，而不是把所有资产都放在这里。

---

## 6.4 一个最小场景与反例

### 正例：把“修 bug”封装成 Skill

如果团队每次修 bug 都希望 AI 按固定顺序做：

1. 先理解问题
2. 搜索相关代码
3. 实现最小修复
4. 补回归测试
5. 用固定格式总结根因和修改点

这就很适合做成 `/fix-bug` Skill。

### 正例：把“禁止在 main 分支直接写文件”做成 Hook

这个约束不需要用户每次主动说一次，所以更适合放在 Hook 里自动拦截。

### 反例：用 Skill 做本该自动触发的守门逻辑

如果你把“危险命令检查”做成 Skill，就意味着用户必须记得每次主动调用；这种约束一旦依赖人为记忆，就很容易失效。

---

## 6.5 实操方法：从最小可用自动化开始

### 第一步：先找高频、固定格式、容易验证的任务

最适合第一批封装成 Skill 的通常是：

- bug 修复
- 测试生成
- 代码 review
- 周报 / 日报

### 第二步：让 Skill 文件结构足够稳定

一个实用 Skill 至少应包含：

- 适用场景说明
- 输入参数如何使用
- 推荐执行步骤
- 输出格式
- 明确的限制条件

### 第三步：只给 Hook 做“自动且必要”的事

第一批 Hook 最适合做：

- SessionStart：补环境上下文
- PreToolCall：做风险拦截
- PostToolCall：做审计或记录

### 第四步：先在一个最小项目里跑通

不要一上来就在复杂业务项目里设计十几个 Skill 和 Hook。  
先用一个最小项目验证：

- 命名是否清晰
- 输入输出是否稳定
- 是否真的节省重复操作

这里的最小项目用于教学演示结构，不是生产级专项资产的默认落点。

---

## 6.6 常见反模式

| 反模式 | 为什么会出问题 |
|--------|----------------|
| 一个 Skill 写几百行，什么都想管 | 很难维护，也很难复用 |
| Hook 做太多业务判断 | 自动化逻辑变得不可预测 |
| Skill 名字太抽象 | 团队不知道什么时候该调用 |
| 把临时一次性流程沉淀成永久 Skill | 只会制造噪音资产 |

如果一个 Skill 很少被调用，或者团队根本说不清它何时适用，通常说明它不该存在。

---

## 6.7 最小落地路径

推荐的最小路径是：

1. 先做 1 个最常用的 Skill
2. 再做 1 个真正能拦住风险的 Hook
3. 跑 1-2 个迭代观察效果
4. 根据重复问题再扩充，而不是一开始就铺满

这比一开始就堆很多命令更稳，因为团队能更快判断哪些封装是真正有价值的。

---

## 6.8 常见误区 / 风险提醒

| 误区 | 更稳妥的做法 |
|------|--------------|
| “Skill 越多越专业” | 保留真正高频且稳定的那一小批 |
| “Hook 能自动做就都自动做” | 自动化只适合确定性高、风险可控的环节 |
| “先写个大而全的总 Skill” | 从一个最常用、最容易验证的流程开始 |
| “有了 Skill / Hook 就不需要 Rules” | Rules 定义边界，Skill / Hook 只是执行方式 |

**风险提醒：**  
Skill 和 Hook 最容易变成“看起来很多、实际没人用”的原因，是封装对象不稳定、命名不清楚、没有维护责任人。

---

## 6.9 最小练习

从下面两类里各选一个，做最小实践：

1. 选一个你每周至少做两次的操作，写成 Skill 草稿
2. 选一个你希望永远不要靠人工记住的安全提醒，写成 Hook 规则草稿

写完后问自己两个问题：

- 团队其他人看到名字，能不能知道什么时候用？
- 如果以后项目变了，这个封装还能不能维护？

---

## 6.10 与前后章节的关系

- 上一章解决”AI 怎样连接外部工具”
- 本章解决”高频工作流怎样被封装成稳定能力”
- 下一章会继续讲：当这些封装还不够时，什么时候应该进一步自己构建 Agent
- [Agent 开发](../agent-development/) 之后，[Harness Engineering](../harness-engineering/) 会把所有这些层整合成一套可维护的团队工程体系

可以把这一章理解成从“会用工具”到“开始编排工具和流程”的过渡层。

---

## 6.11 延伸阅读 / 模板 / 示例

- <a href="/downloads/skills-hooks/templates/commands/fix-bug.md" download><code>fix-bug.md</code></a> — bug 修复 Skill 教学模板
- <a href="/downloads/skills-hooks/templates/commands/gen-tests.md" download><code>gen-tests.md</code></a> — 生成测试 Skill 教学模板
- <a href="/downloads/skills-hooks/templates/commands/review-code.md" download><code>review-code.md</code></a> — 代码审查 Skill 教学模板
- <a href="/downloads/skills-hooks/templates/settings-with-hooks.json" download><code>settings-with-hooks.json</code></a> — 带 Hook 的教学配置示例
- [进阶模式](./advanced-patterns) — Skill 进阶设计模式
- [Skill 与 Hook 判断案例](./examples/skill-hook-decision-cases) — Skill / Hook 选择示例
- [gstack 实战指南](./examples/gstack-workflow) — YC CEO 开源的角色化 Skill Pack，60 天 60 万行代码的完整工作流
- [热门 Skill Pack](./examples/popular-skill-packs) — Superpowers（106k Stars）与 gstack 的对比选型，及社区精选 Skill 资源
- <a href="/downloads/examples/minimal-agent-demo/.claude/commands/fix-bug.md" download><code>Minimal Agent Demo 的 fix-bug Skill</code></a> — 项目级 Skill 演示
- <a href="/downloads/examples/minimal-agent-demo/.claude/commands/gen-tests.md" download><code>Minimal Agent Demo 的 gen-tests Skill</code></a> — 项目级 Skill 演示
- <a href="/downloads/examples/minimal-agent-demo/.claude/commands/review-code.md" download><code>Minimal Agent Demo 的 review-code Skill</code></a> — 项目级 Skill 演示

---

## 完成检查清单

- [ ] 能区分什么情况更适合 Skill，什么情况更适合 Hook
- [ ] 为项目写过至少一个最小 Skill
- [ ] 为项目设计过至少一个风险拦截类 Hook
- [ ] 知道为什么 Skill / Hook 不应一开始就大而全

---

**上一章 ←** [MCP](../mcp/)
**下一章 →** [Agent 开发](../agent-development/)
