# Anthropic 官方 Skills 速查

> **定位：** 这一页列举 [anthropics/skills](https://github.com/anthropics/skills) 仓库中的官方 Skill，帮助你快速了解每个 Skill 能做什么，在需要时直接安装使用，而不用逐个翻阅源码。
>
> 这些 Skill 由 Anthropic 维护，可在 Claude Code、Claude.ai 等多个宿主中加载。

---

## 一览表

| Skill | 一句话说明 | 典型场景 |
|-------|-----------|---------|
| **pdf** | PDF 读取、文字提取、合并拆分、表单填写、水印、加密 | 从合同中提取表格、合并多份报告、填写表单字段 |
| **docx** | Word 文档创建与编辑（含批注、修订、目录） | 生成项目文档、在现有合同上加批注和修订 |
| **pptx** | PowerPoint 演示文稿创建与编辑 | 用数据自动生成汇报 PPT、按品牌模板批量出幻灯片 |
| **xlsx** | Excel 电子表格创建与编辑（含公式、格式、财务模型） | 构建财务模型、格式化数据报表、自动补公式 |
| **frontend-design** | 生成高质量前端界面，避免"AI 味"的通用设计 | 快速产出落地页、组件原型、海报 |
| **mcp-builder** | 引导开发 MCP Server 的完整流程 | 为内部 API 构建 MCP 接入层 |
| **webapp-testing** | 用 Playwright 自动化测试本地 Web 应用 | 端到端回归测试、截图比对 |
| **brand-guidelines** | 将 Anthropic 品牌规范应用到视觉产出 | 保持配色、字体、排版风格一致 |
| **skill-creator** | 引导创建、测试、迭代新 Skill | 团队想自建 Skill 时的脚手架 |
| **claude-api** | 使用 Claude API / Anthropic SDK 构建应用 | 快速搭建调用 Claude 的后端服务 |
| **doc-coauthoring** | 多人协作式文档写作 | 团队共同起草长文档 |
| **canvas-design** | Canvas 画布设计与可视化 | 绘制图表、信息图、数据可视化 |
| **algorithmic-art** | 算法艺术生成 | 用代码创作生成式艺术作品 |
| **internal-comms** | 企业内部沟通文案 | 撰写全员邮件、公告、变更通知 |
| **theme-factory** | 主题与样式系统生成 | 批量生成配色方案、设计令牌 |
| **web-artifacts-builder** | 构建可交互的 Web 组件 | 快速产出可嵌入的交互式演示 |
| **slack-gif-creator** | 制作 Slack 自定义 GIF 表情 | 团队文化建设、趣味沟通 |

---

## 重点 Skill 详解

### pdf —— PDF 全流程处理

覆盖 PDF 文件的读取、文字与表格提取、合并、拆分、旋转、水印、加密解密、表单填写、图片提取和 OCR 扫描件识别。

**技术实现：**
- 基础操作（合并、拆分、旋转、元数据）使用 `pypdf`
- 文字与表格提取使用 `pdfplumber`，可将表格直接导出为 pandas DataFrame
- 新建 PDF 使用 `reportlab`，支持多页文档和 XML 标记（下标、上标）
- 扫描件 OCR 使用 `pytesseract` + `pdf2image`
- 命令行工具 `pdftotext`、`qpdf`、`pdftk` 可用于快速批处理

**注意事项：** reportlab 内置字体不支持 Unicode 下标/上标字符，需要用 XML 标签（`<sub>`、`<super>`）代替。

---

### docx —— Word 文档创建与编辑

`.docx` 本质是 ZIP 压缩的 XML 文件集合。这个 Skill 同时支持从零新建和编辑现有文档。

**新建文档（使用 docx-js + Node.js）：**
- 页面尺寸默认 A4，美式信纸需显式设置为 12,240 × 15,840 DXA
- 列表必须用 `LevelFormat.BULLET` 配置，禁止手动插入项目符号字符
- 表格需要同时设置 `columnWidths` 数组和单元格 `width`，且只能用 `WidthType.DXA`
- 目录依赖 `HeadingLevel`，不支持自定义样式
- 换行用独立 Paragraph，禁止 `\n`

**编辑现有文档（三步流程）：**
1. `unpack.py` 解压 → 2. 直接编辑 XML → 3. `pack.py` 重新打包

支持修订标记（`<w:ins>` / `<w:del>`）、批注（`comment.py`）、智能引号等高级编辑场景。

---

### pptx —— PowerPoint 演示文稿

支持创建、编辑、读取和分析演示文稿。创建时使用 `pptxgenjs`，编辑时通过解包 XML 操作。

**设计原则：**
- 配色要贴合主题，主色占 60–70%，避免均匀分配
- 每张幻灯片必须包含图表、图标或形状，禁止纯文字幻灯片
- 标题 36–44pt，正文 14–16pt
- 交替使用双栏、网格、图标文字、半出血图片等版式，禁止连续重复同一版式
- 正文段落左对齐，不要居中

**质量检查流程：** 生成 → 转为图片（`pdftoppm`）→ 逐页目视检查重叠、溢出、对比度 → 修复 → 重新验证。

---

### xlsx —— Excel 电子表格

处理电子表格的打开、读取、编辑、创建和格式转换，特别擅长财务模型场景。

**核心规则：** 所有计算必须使用 Excel 公式，禁止在 Python 中算好后硬编码数值——否则交付的表格失去动态计算能力。

**财务模型配色规范（行业惯例）：**
- 蓝色文字 = 硬编码输入 / 可调参数
- 黑色文字 = 公式计算结果
- 绿色文字 = 同工作簿跨表引用
- 红色文字 = 外部文件引用
- 黄色底色 = 需要关注的关键假设

**数字格式要求：** 年份显示为文本（"2024" 而非 "2,024"）、零值显示为 "-"、负数用括号 `(123)` 而非负号、倍数格式 `0.0x`。

**技术实现：** 数据操作用 `pandas`，公式和格式用 `openpyxl`。保存后必须运行 `recalc.py` 重新计算并验证公式错误。

---

### frontend-design —— 高质量前端界面生成

帮助开发者构建有辨识度的、生产级的前端界面，刻意避免"AI 生成感"的通用设计。

**设计流程：** 编码前先确定美学方向（极简、极繁、复古、有机、奢华……），明确受众和技术约束。

**核心标准：**
- 字体选择要有个性，避免 Arial、Inter 等泛用字体
- 版式追求意外感——不对称、重叠、大留白，而非预设网格
- 动效集中在高影响力时刻（交错揭示、滚动触发），而非碎片化微交互
- 纹理、渐变、氛围效果要贴合整体美学方向

**明确禁止：** 泛用字体、紫色渐变配色、千篇一律的卡片布局——这些是典型的"AI 生成味"标志。

---

### mcp-builder —— MCP Server 开发指南

引导开发者完成 MCP Server 的完整开发流程：调研 → 实现 → 测试 → 评估。

- 支持 TypeScript（推荐）和 Python 两种语言
- 涵盖工具命名、API 覆盖策略、错误处理、上下文管理等设计实践
- 内置评估框架，用真实任务测试 LLM 能否有效使用你开发的 MCP Server

与本站 [MCP 模块](../../mcp/) 互补：MCP 模块讲"怎么选和接入 MCP"，这个 Skill 讲"怎么从零开发一个 MCP Server"。

---

### skill-creator —— Skill 开发脚手架

帮助你创建、测试、迭代自定义 Skill 的完整工具链。

**核心能力：**
- **编写引导：** 从意图定义到 SKILL.md 编写的完整流程
- **测试评估：** 并行启动有/无 Skill 的对照运行，采集耗时和 token 数据，对输出打分
- **可视化审查：** 生成浏览器端对比查看器，支持逐条反馈
- **迭代优化：** 分析反馈模式，识别泛化不足或提示不清晰的问题，重跑验证

适合团队开始自建 Skill 时作为起点，而不是从空白 `.md` 文件摸索。

---

## 怎么安装

官方 Skill 的安装方式取决于你使用的宿主环境：

- **Claude Code：** 先执行 `/plugin marketplace add anthropics/skills` 注册官方插件市场，再安装 `document-skills` 或 `example-skills`；也可以直接用 `/plugin install document-skills@anthropic-agent-skills` 或 `/plugin install example-skills@anthropic-agent-skills`
- **Claude.ai：** 付费版已内置这些示例 Skill；使用方式和自定义 Skill 上传入口以官方说明为准
- **Claude API：** 可以直接使用 Anthropic 提供的预置 Skill，也可以上传自定义 Skill
- **详细安装说明：** 以 [anthropics/skills 仓库 README](https://github.com/anthropics/skills) 为准

---

## 延伸资源

- [anthropics/skills GitHub 仓库](https://github.com/anthropics/skills) — 源码与安装说明
- [工作流选型](./skill-pack-selection) — gstack / superpowers / GSD 这类外部工作流体系怎么判断
- [如何制作 Skills](../advanced-patterns) — 从官方入口和最小骨架开始做第一个 Skill
- [Skill 与 Hook 判断案例](./skill-hook-decision-cases) — 什么时候用 Skill，什么时候用 Hook
