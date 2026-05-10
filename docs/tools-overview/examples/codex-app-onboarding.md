# Codex App 全员上手指南

这篇教程面向部门全员，默认读者在中国大陆网络环境中使用 Codex App。研发人员可以快速跳过 Git 基础；非研发人员只需要知道：**Codex 最适合打开一个 Git 仓库目录来工作**，这样修改能被追踪、回滚和审查。

读完后，每个人至少要能完成三件事：

- 准备可用的网络、账号和订阅路径
- 打开个人私有仓库目录
- 用 Plan 模式让 Codex 先说明计划，再安全执行

---

## 速览：完整上手路径

下面给出一次完整路径的鸟瞰，**详细操作见后续小节**。普通同事第一次使用可以按下面顺序走：

1. **网络与节点**：安装团队推荐的网络客户端，导入订阅，选择可访问 `chatgpt.com` 和 `github.com` 的节点
2. **账号**：注册 Gmail；iOS 用户准备可用的 Apple ID
3. **订阅**：用 Gmail 登录 ChatGPT，并通过 App Store 或 Google Play 内购完成订阅
4. **仓库**：研发使用公司私有化 GitLab 仓库；非研发当前没有公司 GitLab 账号，先注册个人 GitHub / GitLab.com 账号，创建私有仓库后 clone 到本机
5. **打开 Codex**：在 Codex App 中打开仓库根目录，先发只读检查提示词，不要立刻修改文件
6. **Plan 模式与执行**：需要修改时先用 Plan 模式拿到计划，确认后再让 Codex 执行；个人仓库由本人确认 diff，涉及公司项目或共享仓库时再找研发同事确认

第一次只建议完成“打开仓库 + 只读理解项目 + 生成计划”。如果要练习提交，只在个人私有仓库里操作，不推送到公司仓库。

---

## 使用前准备

### 网络客户端

在中国大陆网络环境中，需要先准备稳定、合规的跨境网络访问能力，确保能访问 OpenAI、GitHub、Google 和 Apple 相关服务。部门可以统一提供 VPN 订阅链接和推荐客户端。

| 设备 | 推荐客户端 | 获取方式 |
|------|------------|----------|
| Mac | Shadowrocket | App Store 搜索或打开官方 App Store 页面 |
| Windows | v2rayN | GitHub Releases 下载正式版本 |

最小流程：

1. 安装推荐的网络客户端
2. 导入团队统一提供的订阅链接
3. 更新订阅，确认能看到节点列表
4. 选择延迟低、稳定、可访问 OpenAI 和 GitHub 的节点
5. 打开 `chatgpt.com`、`github.com` 和 Codex App 做登录验证

注意：

- 只导入可信订阅链接，不转发给无关人员
- 不在来历不明客户端里输入公司账号、GitHub Token 或 ChatGPT 密码
- 节点速度再快，如果频繁触发 OpenAI 或 GitHub 账号风控，也不要作为团队默认节点

参考入口：

- [Shadowrocket App Store 页面](https://apps.apple.com/us/app/shadowrocket/id932747118?platform=mac)
- [v2rayN GitHub Releases](https://github.com/2dust/v2rayN/releases)

### Gmail、ChatGPT 和订阅自购

目前无法统一采购，默认每个人自行注册 Gmail、ChatGPT，并通过 App Store 或 Google Play 购买订阅。

注册 Gmail：

1. 打开 [Google 账号注册页](https://accounts.google.com/signup)
2. 填写姓名、出生日期、用户名和密码
3. 按页面要求完成手机号或辅助邮箱验证
4. 记录好恢复邮箱和恢复手机号，后续找回账号会用到

注册 Apple ID：

1. iPhone 用户可以在 App Store 或系统设置里创建 Apple ID
2. 也可以打开 [Apple Account 创建说明](https://support.apple.com/en-ca/108647) 按官方步骤操作
3. 如使用美区 App Store，确认账号地区、礼品卡兑换和订阅归属一致
4. 开启双重认证，不要和他人共用 Apple ID

注册 ChatGPT 并订阅：

1. 打开 `chatgpt.com` 或 ChatGPT 手机 App
2. 使用 Gmail 注册或登录 ChatGPT
3. 如要求手机号验证，优先使用本人长期可用手机号
4. 在 ChatGPT App 内通过 App Store 或 Google Play 订阅
5. 订阅完成后回到 ChatGPT，确认账号页面能看到当前计划

准备材料：

- Gmail 邮箱
- ChatGPT 账号
- iOS 用户准备可用 Apple ID
- Android 用户准备可用 Google Play 付款方式
- 如使用美区 App Store，准备正规渠道购买的 Apple Gift Card

账号安全底线：

- 不使用共享邮箱、临时邮箱或不受控第三方账号
- 不把密码、恢复码、验证码、SSH 私钥发给同事或 AI
- 手机号验证优先使用本人长期可用手机号
- 第三方接码、共享号码或一次性邮箱服务存在账号风控、隐私和合规风险，不作为团队标准流程

### 订阅购买路径

国内银行卡通常无法直接完成 `chatgpt.com` 网页订阅。本文默认每个人通过移动端内购完成订阅。

| 路径 | 说明 |
|------|------|
| iOS App Store | 在 ChatGPT iOS App 内升级，账单由 Apple 管理 |
| Android Google Play | 在 ChatGPT Android App 内升级或管理，账单由 Google 管理 |

如需使用美区 App Store，可优先从 [Apple Gift Card 美区官网](https://www.apple.com/us/shop/goto/giftcards) 或大型正规零售渠道购买礼品卡，并保留订单凭证。礼品卡暂定自行购买，能否报销以后续政策为准；不要购买明显低价、来源不明、无法开具凭证的礼品卡。

订阅后注意两件事：

- 不要在 App Store、Google Play 和 `chatgpt.com` 之间重复订阅同一个账号
- 保留礼品卡、内购订单或 Google Play 账单截图，便于后续核对费用或报销政策变化时使用

### 订阅档位怎么选

价格、Codex 用量倍率和限制会随官方调整，以 [ChatGPT Pricing 页](https://chatgpt.com/pricing)、[Codex Pricing 页](https://developers.openai.com/codex/pricing) 和 [Codex Rate Card](https://help.openai.com/en/articles/20001106-codex-rate-card) 为准。截至 2026-05-10，个人自购的主流档位可以这样理解：

| 档位 | 月费 | 适合谁 | Codex 用量 |
|------|------|--------|------------|
| Plus | $20 | 非研发、轻量用户、初学者 | 基础额度，适合文档、小改动和低频使用 |
| Pro $100 | $100 | 高频研发、测试同事、工具维护同事 | 2026-04-09 新增的中间档，标准约为 Plus 的 5×，2026-05-31 前临时提升到 10× |
| Pro $200 | $200 | 重度研发、长任务、并行任务 | 约为 Plus 的 20×，更适合持续使用和重型任务（2026-05-31 前 5 小时窗口临时 25×）|

补充几点容易混淆的现状：

- 2026-04-02 起 Codex 计费从"按消息数"切换到"按 API token"，Plus / Pro / Business / 新 Enterprise 都已统一到这套规则
- 触达额度上限后，Plus 和 Pro 用户可以购买 Credits 继续使用，不必为偶尔的高峰升级整个档位
- 团队 / 企业档（Business、Enterprise）涉及统一采购、计费和管理后台，目前不在个人自购路径里讨论，等公司有统一采购方案再单独更新本页

推广初期不建议全员直接买高档位。轻量用户先用 Plus；高频研发、测试同事和工具维护同事再评估 Pro $100，确认任务密度跑满后再考虑 Pro $200。

---

## Git 和仓库基础

非研发人员不需要一开始就会完整 Git 命令，但要知道几个词：

| 概念 | 简单理解 |
|------|----------|
| Git | 项目的版本管理工具，像“时间机器” |
| 仓库 | 被 Git 管理的项目目录 |
| GitHub / GitLab | 托管仓库的平台 |
| 分支 | 安全尝试修改的一条临时工作线 |
| 提交 | 把一组修改保存成可追踪版本 |
| Pull Request / Merge Request | 请求别人审核并合并修改 |
| worktree | 同一个仓库的另一份工作目录，用来并行做任务 |

### 为什么 Codex 要打开仓库目录

不要长期让 Codex 在桌面临时文件夹、下载目录或压缩包解压目录里工作。这些目录通常没有历史记录，改错后难回滚，也不方便审查。

推荐打开仓库根目录。一个仓库根目录通常有：

- `.git`
- `README.md`
- `AGENTS.md`
- 项目目录，例如 `docs/`、`src/`、`package.json`

如果不确定当前目录是不是仓库，可以问 Codex：

```text
请先只检查当前目录，不要修改任何文件。
告诉我这里是不是 Git 仓库，仓库根目录在哪里，
以及我应该在 Codex App 里打开哪个目录作为项目。
```

### 注册个人账号和私有仓库

公司已有私有化部署的 GitLab，目前主要给研发人员使用；非研发暂时没有公司 GitLab 账号。练习时，默认非研发使用个人 GitHub / GitLab.com 账号和个人私有仓库；研发人员也可以使用自己已有权限的公司 GitLab 仓库。

关键不是平台名字，而是这个仓库能被 clone 到本机，并且 Codex App 能打开仓库根目录。非研发的个人私有仓库可以记录自己的 PRD 草案、工作日志、周报、学习材料和练习任务，但不要上传公司敏感资料或受控项目代码。

最小流程：

1. 非研发优先打开 [GitHub 注册说明](https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github) 创建个人 GitHub 账号，或打开 [GitLab.com 注册页](https://gitlab.com/users/sign_up) 创建个人 GitLab.com 账号
2. 研发人员如果已有公司私有化 GitLab 权限，可以使用公司 GitLab 地址、SSO 或管理员分配的账号登录
3. 开启多因素认证
4. 创建一个 private repository / private project，例如 `codex-practice`
5. 把仓库 clone 到本机固定目录，例如 `~/Projects/codex-practice`
6. 在仓库里放一个 `README.md` 或练习文档
7. 用 Codex App 打开这个仓库根目录

如果不会 clone，可以先让 Codex 解释命令，但不要让它处理密码、Token 或私钥内容。

### GitHub 账号与 SSH Key

如果只是让 Codex 在本机只读浏览项目文件，暂时不一定需要 SSH Key；如果要从本机向远程仓库提交、推送或拉取私有仓库，就需要配置。

关键规则：

- 公钥可以配置到 GitHub / GitLab
- 私钥只留在自己电脑
- `.pub` 结尾的是公钥
- 不带 `.pub` 的通常是私钥，不能分享，不能粘给 AI

可以让 Codex 先检查：

```text
请帮我检查本机是否已经配置了 GitHub SSH Key。
要求：
1. 先只读检查，不要生成或覆盖任何文件。
2. 告诉我哪些文件是公钥，哪些是私钥。
3. 如果需要生成新的 SSH Key，先给出命令和原因，等我确认后再执行。
4. 不要输出或复制任何私钥内容。
```

验证连接常用命令：

```bash
ssh -T git@github.com
```

如果使用公司私有 GitLab，把域名换成公司 GitLab 地址，由熟悉 GitLab 的研发同事确认。

### 让 Codex 帮你检查 Git

第一次打开仓库后，可以先发：

```text
我是非研发人员，不熟悉 Git。
请帮我检查这个项目的 Git 状态和远程仓库连接情况。
要求：
1. 先不要修改文件。
2. 先不要提交、推送或删除任何内容。
3. 用中文解释当前目录是不是仓库、当前分支是什么、是否连接了远程仓库。
4. 如果缺少配置，请列出需要我确认的信息。
```

安全边界：

- 任何删除、重置历史、强制推送都要先确认
- 不确定命令含义时，让 Codex 先解释再执行
- 个人私有仓库里的工作内容由本人确认；涉及公司 GitLab、共享仓库或不理解的提交/推送，再找研发同事确认

---

## Codex App 怎么用

Codex App 是桌面端工作台，可以同时处理多个项目线程，并内置 Git、worktree、Review、终端、浏览器和自动化能力。

| 功能 | 作用 |
|------|------|
| 项目 | 你选择给 Codex 打开的本地项目文件夹 |
| 线程 | 围绕一个任务展开的对话和执行过程 |
| Local | 直接在当前项目目录里工作 |
| Worktree | 创建隔离目录，避免影响当前本地目录 |
| 终端 | 运行检查、测试、构建等命令 |
| 内置浏览器 | 预览页面、查看效果、标注问题 |
| Review | 查看 diff、评论、暂存、提交 |
| Automations | 定时任务或稍后唤醒线程继续工作 |
| Skills / Plugins | 复用团队说明、工作流或外部工具 |

### 按角色看能做什么

| 角色 | 典型任务 | 用法 |
|------|----------|------|
| 产品经理 | 整理需求、补验收标准、生成 PRD 草案、整理日志或周报、对比页面与需求差异 | 让 Codex 读取需求文档、页面和历史材料，先输出计划，再生成文档 |
| 开发人员 | 理解代码库、定位 bug、实现小功能、补测试、处理 Review 评论 | 在 Git 仓库中用 Local 或 Worktree，按计划修改、运行检查、展示 diff |
| 测试人员 | 设计测试用例、补回归清单、分析缺陷日志、生成验收报告 | 提供需求、接口说明、缺陷描述和日志，让 Codex 输出测试点和风险路径 |
| 研发辅助者 | 统一教程、沉淀规则、检查练习材料、维护 `AGENTS.md` 示例 | 把可复用规则写进示例仓库，让 Codex 进入项目后先读到约束 |

第一次使用建议只做只读任务：

```text
请阅读这个项目，不要修改文件。
用中文告诉我：
1. 这个项目是做什么的。
2. 主要目录分别放什么。
3. 如果我要改一篇文档，应该从哪里开始。
```

### Plan 模式

Plan 模式适合复杂任务、高风险改动、跨角色协作和非研发表达需求时使用。它的作用是：先把目标、范围、风险和验收标准说清楚，再决定是否执行。

```text
请先进入计划模式，不要修改文件。
目标：我想完成……
背景：这个项目用于……
范围：只能考虑……
不能做：不要修改……
验收标准：完成后应该能看到……

请先检查项目现状，再给出可执行计划。
如果有不确定的信息，先问我，不要猜。
```

合格计划至少要说清楚：改什么、不改什么、为什么这样改、怎么检查、哪些地方需要人工确认。

### 分支和 worktree

研发会更常用分支和 worktree，非研发只要知道它们是为了降低风险：

- 分支：这次修改的临时工作线，方便审核后再合并
- worktree：同一个仓库的另一份工作目录，适合让 Codex 并行做任务

可以这样要求 Codex：

```text
请用安全方式处理这个任务。
如果需要修改文件，请先告诉我是否应该新建分支或 worktree。
我不熟悉 Git，请不要直接提交或推送，先让我确认。
```

---

## 额度和 AGENTS.md

### 额度怎么看

Codex 的额度不是“还能聊多少句”，而是受模型、任务大小、代码库复杂度、上下文长度和运行位置影响。

可以这样理解：

- 5 小时额度：短周期使用窗口
- 周额度：更长周期的总量约束
- Local messages：本机项目里的消息和任务
- Cloud tasks：云端任务
- Code reviews：代码审查任务

查看入口：

- Codex usage dashboard
- Codex CLI 的 `/status`
- ChatGPT 计划或账单页面

节省额度的方法：任务拆小、范围说清、先读相关目录、不需要时不用最强模型、少开并行长任务。

### AGENTS.md 是什么

`AGENTS.md` 是写给 Codex 的项目说明书。它告诉 Codex 项目背景、常用命令、目录规则、文档风格、禁止行为和提交前检查。

没有 `AGENTS.md` 时，每个人都要反复解释项目规则；有了它，Codex 打开仓库时就能读取同一套约束。

生成草案可以这样问：

```text
请为这个仓库生成 AGENTS.md 草案。
要求：
1. 先阅读 README、配置文件和 docs 目录。
2. 用中文总结项目背景、技术栈、常用命令、目录结构、内容规范和禁止行为。
3. 不要编造不存在的命令。
4. 生成前先列出你准备引用的事实来源。
```

当目录结构、常用命令、验收标准、禁改区域或高频错误发生变化时，就应该更新 `AGENTS.md`。

---

## 常见问题

| 问题 | 处理方式 |
|------|----------|
| ChatGPT 打不开 | 先切换团队推荐节点，再检查 `chatgpt.com` 和 `github.com` 是否都能打开 |
| Codex App 登录失败 | 确认网络节点可用、ChatGPT 账号正常、订阅未过期 |
| 找不到仓库目录 | 先创建个人私有仓库并 clone 到本地；不要随手打开桌面或下载目录 |
| Codex 说不是 Git 仓库 | 先停止修改，让 Codex 只读检查仓库根目录；如果是公司仓库，再找研发同事确认目录 |
| SSH 连接失败 | 不要反复重试私钥；个人 GitHub / GitLab.com 账号按平台提示检查公钥，公司 GitLab 再找研发同事确认 |
| Codex 要提交或推送 | 个人私有仓库先让 Codex 总结 diff 和提交信息，由本人确认；涉及公司 GitLab、共享仓库或不理解的 Git 操作时再找研发同事 |
| 额度快用完 | 缩小任务范围，关闭并行长任务，优先让 Codex 处理最明确的一个问题 |
| 计划看不懂 | 要求 Codex 用非技术语言重写，并列出“需要人工确认”的点 |

---

## 第一周清单

下表的角色与"按角色看能做什么"保持一致；"全员通用"是所有角色都必须达到的安全和登录底线。

| 角色 | 要完成的事 |
|------|------------|
| 全员通用 | 能登录 ChatGPT 和 Codex App，能打开个人私有仓库目录，知道密码、Token、验证码和私钥不能发给 AI |
| 产品经理 / 测试人员等非研发 | 能用个人私有仓库记录 PRD、测试用例、日志、周报等工作内容，能让 Codex 先只读检查项目，能用 Plan 模式表达需求 |
| 开发人员 | 能指导同事创建私有仓库，确认 SSH、远程仓库和权限配置，说明分支或 worktree 的使用边界 |
| 研发辅助者 | 准备网络、个人自购订阅、私有仓库练习和 `AGENTS.md` 示例说明 |

---

## 延伸阅读

- [工具全景](../) — 理解 Codex 在团队工具组合中的位置
- [Vibe Coding](../../vibe-coding/) — 学习如何和 AI 进行对话式协作
- [Rules](../../rules/) — 学习如何把项目约束写成 AI 可执行规则
- [Harness Engineering](../../harness-engineering/) — 理解为什么高自治工具需要配套环境、约束和验证
- [Codex App 官方文档](https://developers.openai.com/codex/app)
- [Codex App 功能说明](https://developers.openai.com/codex/app/features)
- [Codex Worktrees](https://developers.openai.com/codex/app/worktrees)
- [Codex AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [Codex Pricing](https://developers.openai.com/codex/pricing)
