# Harness 设计演练：从混乱到稳定

**场景：** 一个 3 人前端团队，已使用 Claude Code 约两个月，Agent 产出质量不稳定，希望系统化地解决问题。

---

## 背景

团队成员：小陈（前端负责人）、小林（工程师）、小韩（工程师）

技术栈：React + TypeScript，组件库使用内部封装的 `@company/ui`，数据层通过 `src/services/` 下的 service 类访问，禁止组件直接调用 API。

**现状：**
- 小陈已经写了一个 `AGENTS.md`，约 30 行，包含项目简介和几条注意事项
- 三人都在用 Claude Code，但生成的代码风格不一致
- 最近合并了两个 PR，后来发现 Agent 直接在组件里写了 `fetch()` 调用，绕过了 service 层
- 每次 Code Review 都要提醒同一类问题

---

## 第一步：问题诊断

小陈把近三周的 Code Review 记录整理了一遍，发现高频问题集中在三类：

| 问题类型 | 出现次数 | Harness 层定位 |
|----------|----------|----------------|
| 组件直接调用 API，未走 service 层 | 6 次 | Context 缺失（规范未写入 AGENTS.md） |
| 使用了原生 HTML 元素，未用内部组件库 | 4 次 | Context 缺失（组件库约定未记录） |
| TypeScript 类型定义放在组件文件内，未集中到 `types/` | 3 次 | Constraints 缺失（无自动检查） |
| import 顺序不规范 | 2 次 | Constraints 缺失（eslint 规则未启用） |

诊断结论：**Context Layer 严重不足，Constraints Layer 基本空白，GC Layer 尚不需要（项目规模还小）。**

---

## 第二步：建设 Context Layer

小陈花了半天，先把 `AGENTS.md` 从 30 行扩展到约 80 行，补上高频约束和文档入口；再新增一份仓库内规则文档，承接细节。核心增量内容：

**AGENTS.md（新增高频约束与入口）**

```markdown
## 开发入口

- 先读 `docs/frontend-architecture.md`
- 内部组件库文档：`docs/ui-components.md` 或 Storybook（localhost:6006）
- Service 层示例：参考 `src/services/user-service.ts`
- 测试示例：参考 `src/components/UserCard/__tests__/UserCard.test.tsx`

## 高频规则

- 组件不得直接调用 fetch/axios，不得直接访问 localStorage
- UI 组件优先使用 `@company/ui`，不满足需求时再自定义
- 共享类型定义集中放在 `src/types/`
```

**仓库内详细规则文档（新增）**

```markdown
## 架构约定

### 数据访问层
- 所有 API 调用必须通过 `src/services/` 下的 service 类进行
- 组件不得直接调用 fetch/axios，不得直接访问 localStorage
- Service 类的方法应返回领域对象，不应暴露 HTTP 细节

### 组件规范
- UI 组件优先使用 `@company/ui`，确认不满足需求时才自定义
- 自定义组件放在 `src/components/`，页面级组件放在 `src/pages/`
- 每个组件文件只导出一个组件

### 类型定义
- 共享类型定义集中放在 `src/types/`
- 组件 props 类型定义可以放在组件文件内，但需命名为 `[ComponentName]Props`
- 避免使用 `any`，确实需要时添加注释说明原因
```

**验证方式：** 小林根据更新后的 `AGENTS.md` 入口和仓库内规则文档，让 Agent 重新实现上周出问题的那个组件，这次 Agent 自动走了 service 层，使用了 `@company/ui` 的 Button。

---

## 第三步：建设 Constraints Layer

Context 解决了"不知道该怎么做"的问题，但无法阻止 Agent 偶尔"犯懒"。小韩接手了 Constraints 建设。

### Hook 1：阻止组件直接调用 API

在 `.claude/settings.json` 中添加 PostToolUse Hook：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/scripts/check-no-direct-fetch.mjs\""
          }
        ]
      }
    ]
  }
}
```

`scripts/check-no-direct-fetch.mjs` 扫描刚修改的文件，检查 `src/components/` 和 `src/pages/` 下是否有 `fetch(` 或 `axios.` 调用，发现则输出错误信息并退出非零。这里使用 `$CLAUDE_PROJECT_DIR` 引用脚本，是为了避免 Claude 当前工作目录变化时命令失效。

Agent 看到错误输出后，会自动尝试修复（将直接调用移到 service 层）。

### Hook 2：类型定义位置检查

类似方式添加一个检查，确认新增的共享类型是否放在了正确路径。

### ESLint 集成

启用 `eslint-plugin-import` 的 `order` 规则，将 import 顺序问题在 CI 阶段拦截，无需 Agent 或人工关注。

**两周后的变化：**

| 指标 | 之前 | 之后 |
|------|------|------|
| 每个 PR 被 Review 指出的 Harness 违规数 | 平均 2.3 个 | 平均 0.2 个 |
| Agent 生成代码需要人工修改的比例 | ~40% | ~12% |
| Code Review 用时（不含业务逻辑讨论） | 平均 25 分钟 | 平均 10 分钟 |

---

## 第四步：错误日志机制

小陈先在仓库里新增 `docs/agent-known-issues.md`，作为 Agent 可读的主记录；同时在 Notion 建了一个周会视图，用于分派负责人和跟踪处理状态。仓库内主表如下：

| 日期 | 问题描述 | 已固化为 | 负责人 |
|------|----------|----------|--------|
| 2026-03 | 生成的 hook 没有清理副作用（useEffect 缺少 cleanup） | AGENTS.md 新增约定 | 小林 |
| 2026-03 | 在测试文件里 mock 了整个模块而非单个函数 | Skill 中加入测试规范约束 | 小韩 |
| 2026-04 | 翻译文案硬编码在组件里，未使用 i18n | AGENTS.md + Hook 检查 | 小陈 |

周会只负责分派和决定下一步；真正会影响 Agent 行为的结论，必须回写到仓库文档、Skill 或 Hook。这样错误日志既能被人讨论，也能被 Agent 直接利用。

---

## 最终 Harness 结构

```text
团队 Harness（2026-04）
│
├── Context Layer
│   ├── AGENTS.md（高频约束 + 文档入口）
│   ├── docs/frontend-architecture.md（架构约定 + 组件规范 + 类型约定）
│   ├── docs/agent-known-issues.md（错误模式与修复约束）
│   └── MCP：本地 Storybook 文档访问（只读）
│
├── Constraints Layer
│   ├── Hook: check-no-direct-fetch（PostToolUse）
│   ├── Hook: check-type-definition-location（PostToolUse）
│   ├── ESLint: import/order（CI）
│   └── PR 模板：包含 Harness 合规自检清单
│
└── GC Layer（计划中）
    └── 每两周：扫描 AGENTS.md 与实现的一致性
```

---

## 经验总结

**三条关键发现：**

1. **从错误反向推导 Context**。不要试图预先写一份"完美"的 AGENTS.md，把所有东西都塞进去；而是每次 Agent 出错就问："它不知道什么？" 高频规则写进 AGENTS.md，细节说明写进仓库文档。

2. **Hook 的粒度要适中**。粒度太细（每一行都检查）会让 Agent 陷入修复循环；粒度太粗（只检查构建失败）来不及拦截。经验值：检查那些"在 Code Review 中反复出现的问题"。

3. **错误日志是 Harness 的增长引擎**。没有错误日志，Harness 是静止的；有了错误日志，Harness 才能随着项目演进不断自我完善。前提是至少保留一份仓库内、可机读的版本。

**下一步计划：**
- 引入 GC Agent，定期扫描文档一致性
- 将 Harness 建设经验整理成团队入职材料
- 评估是否需要将 `check-no-direct-fetch` 逻辑迁移到 ESLint 插件（更标准，更快）
