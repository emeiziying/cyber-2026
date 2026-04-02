# Skills 进阶模式

> 来源：对 [titanwings/colleague-skill](https://github.com/titanwings/colleague-skill)（3.2k stars）的研究总结
> 这个项目将 Skills 推到了一个新的高度，值得深入学习

---

## 模式一：Skill 作为可分发的"产品包"

### 普通做法
Skill 文件放在自己项目里，只有自己用。

### 进阶做法
把 Skill + 工具脚本 + 文档打包成独立仓库，用户 `git clone` 即可安装：

```bash
# 安装到个人全局
git clone https://github.com/your-org/your-skill ~/.claude/skills/your-skill

# 安装到项目
git clone https://github.com/your-org/your-skill .claude/skills/your-skill
```

**仓库结构：**
```
your-skill/
├── SKILL.md          # 主入口（主编排文件）
├── INSTALL.md        # 安装说明
├── prompts/          # 子 prompt 文件
│   ├── step1.md
│   └── step2.md
├── tools/            # 辅助脚本（Python/Shell）
└── README.md
```

**适用场景：**
- 团队通用工作流（代码审查标准、部署流程）
- 开源给社区使用的 AI 工具
- 跨项目共享的专业能力封装

---

## 模式二：Prompt 微服务化架构

### 普通做法
一个 Skill 文件写几百行，什么都往里塞。

### 进阶做法
把复杂 Skill 拆分成多个子 prompt 文件，主 SKILL.md 只做**编排**：

```
prompts/
├── intake.md           # 信息采集（只负责问问题）
├── analyzer.md         # 分析原材料（只负责分析）
├── builder.md          # 生成输出（只负责生成）
├── merger.md           # 增量合并（只负责合并）
└── correction.md       # 纠正处理（只负责修正）
```

**主 SKILL.md 编排示例：**
```markdown
# Feature Spec Generator

## Step 1: 收集需求
@prompts/intake.md

## Step 2: 分析现有代码
@prompts/analyzer.md

## Step 3: 生成 Spec 文档
@prompts/builder.md

如果用户说"不对"或"应该是"，执行：
@prompts/correction.md
```

**好处：**
- 每个子 prompt 专注一件事，更容易测试和优化
- 可以在不同 Skill 之间复用子 prompt
- 复杂流程变得可读和可维护

---

## 模式三：用行为触发器代替形容词

这是 colleague-skill 最值得学习的 Prompt 工程技巧，适用于任何需要定义 AI 角色或行为规范的场景。

### 对比

```markdown
❌ 形容词描述（模糊）
- 代码风格要简洁清晰
- 要注重安全性
- 回复要专业

✅ 行为触发器（精确）
- 函数体超过 50 行时，拆分为子函数并提取到独立文件
- 涉及用户输入的地方，必须通过 zod schema 校验，绝不相信原始输入
- 回复技术问题时，先给出结论，再说原因，最后给代码示例
```

**格式公式：**
```
在 [具体场景/触发条件] 时，[具体行为]
```

**实际应用到 CLAUDE.md：**
```markdown
## 代码规范（行为触发器版）

- 写新功能时，先问"有没有现成的工具函数可以复用"再动手
- PR 描述缺少测试说明时，提醒补充测试覆盖情况
- 看到 try-catch 只有 console.log 时，要求补充错误上报逻辑
- 发现超过 3 层嵌套的回调时，重构为 async/await
```

---

## 模式四：优先级规则显式化

当 Skill 有多个信息来源时，**在 Prompt 中明确声明优先级**，避免 AI 自行猜测。

```markdown
## 信息优先级（从高到低）

1. 用户在本次对话中明确指定的内容
2. 项目 CLAUDE.md 中的规则
3. 代码库中现有代码的风格（从实际代码推断）
4. 本 Skill 的默认规则

冲突时，高优先级来源的信息覆盖低优先级来源。
```

---

## 模式五：增量追加机制

### 普通做法
每次生成都重新覆盖文件。

### 进阶做法
设计**只追加、不覆盖**的知识库更新机制：

```markdown
## 知识库更新规则

收到新信息时：
1. 判断属于哪个文件（技术规范 → work.md，行为模式 → persona.md）
2. 检测与现有内容的关系：
   - 补充（新内容）→ 直接追加
   - 确认（重复内容）→ 忽略，避免冗余
   - 矛盾（与现有冲突）→ 保留两者，标注冲突，等待人工确认
3. 追加前展示变更 diff，用户确认后写入
4. 版本号 +0.1
```

**适用场景：**
- 长期维护的知识库 Skill
- 需要迭代积累的项目文档
- 任何生成后需要持续更新的内容

---

## 模式六：纠正学习闭环

在 Skill 中设计**用户反馈通道**，让 AI 输出可以被修正和持续优化。

```markdown
## 纠正处理

当用户说以下类型的话时，触发纠正流程：
"不对" / "不应该" / "他/她应该是" / "实际上" / "你理解错了"

纠正流程：
1. 提取三要素：[场景] + [错误行为] + [正确行为]
2. 如果表述模糊，用一句话向用户确认
3. 记录格式：`[场景: {描述}] 不应该 {错误}，应该 {正确}`
4. 展示记录内容，用户确认后追加到知识库
5. 当同一维度的纠正超过 10 条时，合并语义相近的规则
```

---

## 模式七："无依据不推断"原则

对于需要**高可信度**的内容生成（文档、档案、规范），在 Prompt 中显式禁止推断：

```markdown
## 重要约束

**只写有依据的内容，没有依据就标注缺失：**

✅ 正确：
> 代码审查关注点：异常处理和边界情况（来源：他在 3 次 CR 评论中明确提到）

✅ 正确：
> 技术栈：（原材料不足，建议提供更多代码样本）

❌ 错误：
> 他应该比较注重代码质量（无来源，纯推断）
```

---

## 综合应用：团队规范生成 Skill 设计思路

结合以上模式，可以设计一个"从零生成团队 CLAUDE.md"的 Skill：

```
/gen-team-rules

prompts/
├── intake.md        # 收集：技术栈、团队规模、主要痛点
├── analyzer.md      # 分析：扫描现有代码推断隐性规范
├── builder.md       # 生成：用行为触发器格式生成 CLAUDE.md
├── merger.md        # 合并：与已有规则文件合并，冲突上报
└── correction.md    # 纠正：处理"这条不对"类反馈
```

---

## 参考资源

- [titanwings/colleague-skill](https://github.com/titanwings/colleague-skill) — 本文主要灵感来源（3.2k stars）
- [AgentSkills 开放标准](https://github.com/AgentSkills) — Skill 打包分发规范
