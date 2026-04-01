# 第九章：团队工作流与质量控制

> **适合人群：** 工程师 + Reviewer + Tech Lead
> **学习目标：** 把个人的 AI 使用经验沉淀成团队可执行的协作流程、Review 标准和测试义务

---

## 9.1 从“个人提效”到“团队协作”

个人使用 AI 时，只要自己觉得顺手就够了。

但团队协作时，至少要回答这些问题：

- 谁来定义任务上下文？
- 谁来验收 AI 生成的结果？
- 哪些类型的改动必须补测试？
- 规则、Skills、Hooks 由谁维护？

如果这些问题没有答案，AI 用得越多，协作噪音就越大。

---

## 9.2 任务入口要标准化

团队不应该把“给 AI 提需求”完全个人化。

建议所有中等以上复杂度任务都先整理成统一任务单，至少包含：

- 目标
- 范围
- 明确不做什么
- 技术约束
- 验收标准
- 参考文件 / 现有实现

模板见：
- [`templates/task-intake.md.template`](./templates/task-intake.md.template)

---

## 9.3 推荐团队工作流

一个实用的团队工作流可以是：

1. **任务整理**：先写任务单，不直接开写
2. **AI 执行**：让 AI 实现或分析
3. **自检**：执行测试、检查 diff、补风险说明
4. **PR Review**：按统一检查项审核
5. **合并 / 回滚准备**：高风险任务明确回滚方式
6. **复盘**：把反复出现的问题沉淀回 `CLAUDE.md` 或 Skills

重点不是每一步都复杂，而是每一步都可重复。

---

## 9.4 Code Review 需要新约定

AI 代码 Review 不能只看“代码像不像人写的”，而要重点看：

- 需求是否被正确理解
- 是否有隐藏的边界条件遗漏
- 是否为了“看起来完整”而臆造逻辑
- 是否补充了足够的测试和说明

建议团队统一一份 Review 清单，而不是每个 Reviewer 各看各的。

模板见：
- [`templates/pr-review-checklist.md.template`](./templates/pr-review-checklist.md.template)

---

## 9.5 测试不是可选项

AI 加速后，测试义务应该更明确，而不是更松。

**最低建议：**
- 修 bug：必须补回归测试
- 新功能：至少覆盖 happy path + 一个失败路径
- 重构：没有行为变更时也要跑回归测试
- 高风险模块：优先补集成或端到端验证

如果团队没有提前约定，AI 最容易“把代码写完，但把验证省掉”。

---

## 9.6 规则、Skills、Hooks 要有维护责任人

这些文件一旦进入团队流程，就不能靠“谁顺手谁改”。

建议明确：

- `CLAUDE.md` 的维护人
- 项目级 Skills 的维护人
- MCP / Hook 配置的审批人
- 更新频率和触发条件

**推荐触发条件：**
- AI 反复犯同一类错误
- Review 里连续出现同类问题
- 项目技术栈或目录结构发生变化

---

## 9.7 每个迭代都做一次轻量复盘

复盘不需要很重，但至少要回答：

- 本迭代 AI 最省时间的场景是什么？
- 最容易出错的场景是什么？
- 哪条规则该补进 `CLAUDE.md`？
- 哪个 Skill 该拆分或重写？

没有复盘，团队经验就会一直停留在聊天记录里。

---

## 9.8 模板文件

- [`templates/task-intake.md.template`](./templates/task-intake.md.template) — AI 任务入口模板
- [`templates/pr-review-checklist.md.template`](./templates/pr-review-checklist.md.template) — PR Review 清单模板

---

## 完成检查清单

- [ ] 团队有统一的 AI 任务入口模板
- [ ] Review 使用固定检查项，而不是完全凭经验
- [ ] 修 bug 时默认要求回归测试
- [ ] `CLAUDE.md`、Skills、Hooks 已有明确维护责任人

---

**上一章 ←** [第八章：生产落地与治理](../08-production-governance/)
**下一章 →** [附录：真实案例库](../appendix-case-studies/)
