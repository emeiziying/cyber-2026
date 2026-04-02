# 部门级 Skill 共享与多角色协作

## 这解决什么问题

团队里的 Skill 通常由研发创建、放在项目的特定目录里（如 `.claude/commands/`），只有会用终端的人能触发和更新。当部门里还有产品经理、设计师和管理者时，会出现三个断层：

1. **安装断层**——非研发不知道怎么 `git clone` 一个 Skill
2. **使用断层**——非研发不用 CLI，没有机会输入 `/command` 触发 Skill
3. **更新断层**——非研发积累了大量经验，但没有渠道沉淀回 Skill

如果只有研发能用和改 Skill，那部门的"赛博飞升"就只飞了一半——技术侧在进化，业务侧还在原地。

---

## 核心原则：按角色分层，而不是要求所有人学 CLI

不同角色参与 Skill 的方式应该不同：

| 参与层级 | 含义 | 适合角色 |
|---------|------|---------|
| **消费结果** | 不直接使用 Skill，但享受 Skill 带来的标准化产出 | 管理者、外部协作方 |
| **使用 Skill** | 通过自己熟悉的界面触发 Skill | 产品经理、设计师 |
| **维护 Skill** | 直接编辑 Skill 文件、审核更新 | 研发、Tech Lead |

**关键认知：** 非研发人员不需要学会维护 Skill 文件，但他们的经验必须有渠道进入 Skill。

---

## 第一层：让非研发人员用上 Skill

### 方式 A：转化为 Claude 网页端 / 桌面端的 Project 指令

把 Skill 内容复制到 Claude 网页端的 Project Instructions 中，非研发人员在熟悉的聊天界面里就能直接使用。

**操作步骤：**

1. 研发把 Skill 内容导出为纯文本
2. 在 Claude 网页端创建一个 Project（如"产品需求整理"）
3. 把 Skill 内容粘贴到 Project Instructions
4. 邀请非研发成员加入该 Project

**适合场景：** 产品经理的需求整理、设计师的文案生成、竞品分析等

**优点：** 零技术门槛，非研发人员立刻可用

**缺点：** 与 CLI 版 Skill 是两个副本，需要手动同步

### 方式 B：使用支持 Skill 的桌面端工具

多个 AI 工具已经提供了 Windows/Mac 桌面端，非研发人员可以直接通过图形界面使用 Skill，不需要学命令行。

**Windows 环境推荐工具对照：**

| 工具 | 安装方式 | Skill 加载方式 | 适合角色 |
|------|---------|---------------|---------|
| **Codex 桌面端** | Microsoft Store 安装 | 原生支持 Skills，可加载 `.agents/skills/` | 全员（研发 + 产品 + 设计） |
| **Claude Code 桌面端** | 官网下载 | `/command` 触发 `.claude/commands/` 或引用 `.agents/skills/` | 全员 |
| **Claude.ai 网页端** | 无需安装 | 通过 Project Instructions 预置 | 全员 |
| **Cursor** | 官网下载 | `.cursorrules` 引用 | 主要研发 |

**Codex 桌面端对非研发人员特别友好：**
- 图形界面操作，不需要终端
- 支持并行线程——同时跑多个任务（整理需求的同时做竞品分析）
- 内置变更审查界面——产品经理可以直接看 AI 改了什么，不需要学 git diff
- Windows 原生支持，从应用商店一键安装

**操作步骤：**

1. Tech Lead 创建一个"部门共享 Skill"仓库，Skill 统一放在 `.agents/skills/`
2. 非研发人员安装桌面端工具，打开仓库
3. 通过界面选择并触发 Skill
4. 写一份《快速使用手册》，只教三件事：安装工具、打开项目、选择 Skill

**适合场景：** 团队希望全员使用统一工具，且非研发人员不排斥安装桌面应用

### 方式 C：非研发人员不直接用 Skill，只消费标准化产出

有些 Skill 的价值不在于"谁触发"，而在于"输出格式统一"。比如：

- 研发用 `/fix-bug` 产出的修复说明，产品经理直接拿来写发布日志
- 研发用 `/review-code` 产出的结构化 review，设计师看"界面相关"部分确认交互一致性
- 研发用 `/gen-tests` 产出的测试覆盖报告，管理者看覆盖率和风险分布

**这种模式下，非研发不需要接触 Skill 本身，但他们是 Skill 产出的直接受益者。**

---

## 第二层：让非研发的经验能沉淀回 Skill

### 问题：经验在谁脑子里

| 角色 | 典型经验 | 如果不沉淀会怎样 |
|------|---------|----------------|
| 产品经理 | "AI 生成的需求文档总是漏掉权限边界" | 每次都要人工补，Skill 不知道这个规律 |
| 设计师 | "AI 生成的按钮文案语气太生硬，不符合品牌调性" | 每次都要手动改，同样的问题反复出现 |
| 管理者 | "AI 的风险评估总是漏掉合规维度" | 风险报告不完整，人工每次兜底 |

这些经验如果不写进 Skill，就永远只存在于个人脑子里——正是"赛博飞升"要解决的核心问题。

### 解决方案：建立 Skill 反馈通道

非研发人员不需要直接改 Skill 文件，但需要一个**低门槛的反馈入口**：

```
非研发发现问题 → 用固定格式提交反馈 → Tech Lead 审核 → 更新 Skill → 全员生效
```

### 反馈模板

给非研发人员一个简单的反馈格式（可以放在团队 wiki、飞书文档、或 GitHub Issue 模板里）：

```markdown
## Skill 改进反馈

**哪个 Skill（或哪类 AI 产出）：**
例：需求文档生成 / fix-bug 的修复说明 / 竞品分析

**发现了什么问题：**
例：生成的需求文档总是缺少"用户权限"维度的边界说明

**应该怎么改：**
例：在需求文档的"边界场景"部分，增加"不同权限等级的用户看到什么"

**出现过几次：**
例：最近 3 次需求评审都遇到了
```

### 处理流程

| 步骤 | 负责人 | 动作 |
|------|--------|------|
| 提交反馈 | 任何人 | 按模板填写，提交到约定渠道 |
| 评估可行性 | Tech Lead | 判断反馈是否具体可执行，是否适合写入 Skill |
| 转化为 Skill 更新 | 研发 | 把反馈转成 Skill 文件中的具体规则或检查步骤 |
| 验证 | 反馈提交者 | 下次使用时确认问题是否消失 |
| 关闭 | Tech Lead | 记录到更新日志 |

### 定期回顾机制

每两周在团队复盘中加一个固定环节（5 分钟）：

1. 上一周期收到了哪些 Skill 反馈？
2. 哪些已经更新进 Skill？效果如何？
3. 有没有新的重复问题值得沉淀？

---

## 第三层：部门级 Skill 仓库的组织方式

当 Skill 数量增多、使用者跨角色后，需要一个统一的管理结构。

### 为什么用 `.agents/skills/` 而不是 `.claude/commands/`

`.claude/commands/` 是 Claude Code 的专属目录，Skill 放在这里只有 Claude Code 能识别。如果团队未来还会用 Cursor、Copilot 或其他 AI 工具，这些 Skill 就无法复用。

推荐使用 **`.agents/skills/`** 作为统一存放目录：

- 工具无关——不绑定任何特定 AI 产品
- Skill 本质是 Markdown prompt，任何能读文件的 AI 工具都可以加载
- 各工具通过自己的配置映射到这个目录即可（Claude Code 可以用符号链接或在 Rules 中 `@.agents/skills/` 引用）

### 推荐目录结构

```
.agents/
├── skills/                           # 所有 Skill 的统一存放位置
│   ├── engineering/                  # 研发专用 Skill
│   │   ├── fix-bug.md
│   │   ├── gen-tests.md
│   │   ├── review-code.md
│   │   └── daily-report.md
│   ├── product/                      # 产品经理专用 Skill
│   │   ├── requirement-doc.md        # 需求文档生成
│   │   ├── feedback-clustering.md    # 用户反馈归类
│   │   └── competitor-analysis.md    # 竞品分析框架
│   ├── design/                       # 设计师专用 Skill
│   │   ├── copy-review.md            # 文案审核
│   │   ├── interaction-checklist.md  # 交互检查清单
│   │   └── state-inventory.md        # 状态枚举整理
│   └── shared/                       # 跨角色共享 Skill
│       ├── risk-assessment.md        # 风险评估
│       ├── meeting-summary.md        # 会议纪要
│       └── task-intake.md            # 任务入口标准化
├── rules/                            # 工具无关的项目规则（可选）
├── README.md                         # 使用说明和快速入门
├── CHANGELOG.md                      # 更新日志
└── feedback/                         # 反馈收集
    └── TEMPLATE.md                   # 反馈模板
```

### 如何让不同工具加载 `.agents/skills/`

| 工具 | 加载方式 |
|------|---------|
| Claude Code | 在 CLAUDE.md 中用 `@.agents/skills/shared/task-intake.md` 引用；或符号链接到 `.claude/commands/` |
| Cursor | 在 `.cursorrules` 或项目 Rules 中引用 `.agents/skills/` 下的文件 |
| 其他支持自定义 prompt 的工具 | 直接读取 Markdown 文件内容作为 system prompt |
| Claude 网页端 / 桌面端 | 复制 Skill 内容到 Project Instructions |

### 分发方式对照

| 方式 | 适合研发 | 适合非研发 | 同步成本 |
|------|---------|-----------|---------|
| `git clone` 到项目 | ✅ | ❌ | 低（git pull 更新） |
| 复制到 Claude Project Instructions | ❌ 不需要 | ✅ | 中（手动同步） |
| 共享文档库（飞书/Notion） | 可用 | ✅ | 中（需要维护两份） |
| 统一仓库 + 自动同步脚本 | ✅ | ✅ 通过脚本自动推送到 Claude Project | 低（一次搭建） |

### 最小起步方案

不要一开始就搭完整仓库。按以下顺序渐进：

1. **第 1 周：** 把现有项目里最实用的 3 个 Skill 复制到一个共享目录
2. **第 2 周：** 为产品经理创建 1 个专属 Skill（如需求文档生成），放到 Claude Project 里让他们试用
3. **第 3 周：** 建立反馈模板，开始收集非研发的改进建议
4. **第 4 周：** 回顾反馈，把有效经验更新进 Skill，评估是否需要更多角色专属 Skill

---

## 常见问题

### "非研发的反馈太模糊，没法直接写进 Skill"

这是正常的。非研发不需要给出精确的 Prompt 修改建议，他们只需要描述"什么不对"和"应该怎样"。转化为具体 Skill 规则是 Tech Lead 的工作。

### "维护两份（CLI 版 + Claude Project 版）太麻烦"

因为 Skill 统一存放在 `.agents/skills/`，CLI 工具和 Claude Project 读的是同一份源文件。如果团队有能力，可以写一个简单脚本，从 `.agents/skills/` 自动同步到 Claude Project。如果没有，优先维护 `.agents/skills/`，Claude Project 版允许滞后 1-2 周手动同步。

### "非研发人员根本不知道 Skill 是什么"

不需要教他们 Skill 的技术概念。只需要告诉他们："我们有一些预设的 AI 工作流，可以帮你做 XX。你在 Claude 里打开这个 Project 就能用。如果发现不好用，按这个模板告诉我们哪里不对。"

### "管理者需要看到 Skill 的投入产出"

在 CHANGELOG.md 中记录每次更新的来源和效果。每月汇总一次：收到多少反馈、更新了多少条规则、哪些重复问题消失了。这比"AI 节省了多少小时"更有说服力。
