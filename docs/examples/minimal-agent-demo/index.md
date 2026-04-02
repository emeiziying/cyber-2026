# Minimal Agent Demo

这是一个零依赖的最小 Node.js 示例项目，用来演示 Rules、MCP 和 Skills & Hooks 这三部分内容如何真正落到项目目录中。

## 这个示例覆盖什么

- `CLAUDE.md`：项目级规则文件
- `.claude/settings.json`：项目级 MCP / Hook 配置入口
- `.claude/commands/*.md`：项目级 Skill 示例
- `src/` + `test/`：一个可运行、可测试的最小后端代码结构

## 目录结构

```text
minimal-agent-demo/
├── .claude/
│   ├── commands/
│   └── settings.json
├── src/
│   ├── repositories/
│   ├── services/
│   ├── utils/
│   └── server.js
├── test/
├── CLAUDE.md
└── package.json
```

## 运行方式

```bash
npm test
npm start
```

默认会启动一个最小 Notes API：

- `GET /health`
- `GET /api/notes?search=keyword`
- `POST /api/notes`

请求体示例：

```json
{
  "title": "Read chapter 4",
  "content": "Convert repo conventions into CLAUDE.md"
}
```

## 如何对照主线学习

- 对照 [Rules](/rules/) 查看 <a href="/downloads/examples/minimal-agent-demo/CLAUDE.md"><code>CLAUDE.md</code></a>
- 对照 [MCP](/mcp/) 查看 <a href="/downloads/examples/minimal-agent-demo/.claude/settings.json"><code>.claude/settings.json</code></a>
- 对照 [Skills & Hooks](/skills-hooks/) 查看 <a href="/downloads/examples/minimal-agent-demo/.claude/commands/fix-bug.md"><code>fix-bug.md</code></a>、<a href="/downloads/examples/minimal-agent-demo/.claude/commands/gen-tests.md"><code>gen-tests.md</code></a>、<a href="/downloads/examples/minimal-agent-demo/.claude/commands/review-code.md"><code>review-code.md</code></a>

## 使用建议

1. 先运行 `npm test`，确认示例项目本身可用
2. 再阅读 `CLAUDE.md`，看规则如何映射到 `src/` 和 `test/` 目录
3. 最后查看 `.claude/settings.json` 和 3 个命令文件，理解项目级 AI 配置应该放在哪些位置
