# 第四章：Rules — 驯化你的 AI 助手

> **适合人群：** 工程师
> **学习目标：** 通过项目规则文件让 AI 真正理解你的项目上下文，减少反复说明的成本

---

## 4.1 为什么需要 Rules？

**没有 Rules 时的痛点：**
```
你：帮我写一个 React 组件
AI：（生成了 class 组件 + CSS Modules 样式）
你：我们不用 class 组件，用函数组件
AI：（改好了，但用了 useState 而不是 Zustand）
你：我们用 Zustand 管理状态...
（每次开新对话都要重新说一遍）
```

**有了 Rules 之后：**
- AI 开始工作前就已经了解你的技术栈、代码风格、禁止行为
- 减少来回纠正，直接输出符合项目规范的代码
- 团队共享规则文件，保证 AI 辅助的一致性

---

## 4.2 Rules 文件的位置和优先级

### Claude Code (`CLAUDE.md`)

```
项目根目录/
├── CLAUDE.md              ← 项目级规则（提交到 git，团队共享）
├── src/
│   └── CLAUDE.md          ← 子目录级规则（覆盖父级）
└── ...

~/.claude/
└── CLAUDE.md              ← 全局规则（个人偏好，不提交）
```

**优先级：** 子目录规则 > 项目规则 > 全局规则

### Cursor (`.cursorrules`)
```
项目根目录/
└── .cursorrules           ← 项目规则（提交到 git）
```

---

## 4.3 一个好的 CLAUDE.md 应该包含什么？

### 必要内容
1. **项目背景** — 这是什么项目，主要做什么
2. **技术栈** — 框架、语言、主要依赖库
3. **代码规范** — 命名约定、文件结构、import 顺序
4. **禁止行为** — 明确不允许 AI 做的事
5. **常用命令** — 运行测试、构建、启动的命令

### 可选内容
6. **架构说明** — 关键目录的作用
7. **业务术语** — 项目特有的名词解释
8. **Review 重点** — 需要特别注意的安全/性能点

---

## 4.4 Rules 编写技巧

### 用否定句明确边界
```markdown
## 禁止行为
- 不要使用 `any` 类型（除非有显式注释说明原因）
- 不要直接修改 state，始终使用 setter 函数
- 不要在组件内写内联样式，使用 Tailwind className
- 不要使用 console.log（使用项目的 logger 工具）
```

### 提供示例比描述更有效
```markdown
## 接口返回格式
统一使用以下格式：
\`\`\`typescript
// 成功
{ data: T, error: null }
// 失败
{ data: null, error: { code: string, message: string } }
\`\`\`
```

### 说明"为什么"帮助 AI 做举一反三
```markdown
## 错误处理
所有 API 错误不要向用户暴露内部信息（安全考虑），
统一返回 "Something went wrong" + 错误 ID 供排查
```

---

## 4.5 Rules 的团队协作

**推荐工作流：**
1. 项目初始化时，由 Tech Lead 建立基础 `CLAUDE.md`
2. `CLAUDE.md` 提交到 git，随代码库演进
3. 个人偏好放在 `~/.claude/CLAUDE.md`（不提交）
4. 定期 Review：当 AI 反复犯同一类错误时，更新规则

**版本控制建议：**
```bash
# .gitignore 中不要排除 CLAUDE.md
# 应该像对待 .eslintrc 一样对待 CLAUDE.md
git add CLAUDE.md
git commit -m "chore: update AI rules for new auth module"
```

---

## 4.6 查看模板文件

本章附带以下可直接使用的模板：

- [`templates/CLAUDE.md.template`](./templates/CLAUDE.md.template) — 通用后端项目模板
- [`templates/frontend-CLAUDE.md.template`](./templates/frontend-CLAUDE.md.template) — 前端项目模板（React + TypeScript）

使用方式：
```bash
cp templates/CLAUDE.md.template 你的项目路径/CLAUDE.md
# 然后根据项目实际情况修改
```

### 配套示例

如果你想直接看一个已经落地的最小项目，可参考：

- [`../examples/minimal-agent-demo/CLAUDE.md`](../examples/minimal-agent-demo/CLAUDE.md) — 由模板裁剪后的项目级规则
- [`../examples/minimal-agent-demo/README.md`](../examples/minimal-agent-demo/README.md) — 这个规则文件在示例项目中的使用方式

---

## 完成检查清单

- [ ] 为自己的一个项目创建了 `CLAUDE.md`
- [ ] 规则文件包含：技术栈、代码规范、至少3条禁止行为
- [ ] 测试过规则的效果：AI 是否遵循了规则？
- [ ] 了解全局规则和项目规则的区别

---

**上一章 ←** [第三章：工具全景](../03-tools-overview/)
**下一章 →** [第五章：MCP](../05-mcp/)
