# Minimal Agent Demo — AI 助手规则

## 项目背景

这是一个最小 Node.js Notes API，用来演示 Rules、MCP、Skills 在真实项目中的目录位置和协作方式。

---

## 技术栈

- **语言：** JavaScript（ES Modules）
- **运行时：** Node.js 22+
- **框架：** Node.js 内置 `http`
- **数据存储：** 进程内内存存储
- **测试：** Node.js 内置 `node:test`

---

## 常用命令

```bash
# 启动服务
npm start

# 开发模式
npm run dev

# 运行测试
npm test
```

---

## 目录结构

```text
src/
├── repositories/   # 数据访问层，仅处理存储读写
├── services/       # 业务逻辑层，做校验和业务规则
├── utils/          # 通用响应封装
└── server.js       # HTTP 路由入口

test/
└── *.test.js       # 业务逻辑测试
```

---

## 行为规范

### 代码质量

- 在新增 API 逻辑时，先判断职责属于 `server`、`services` 还是 `repositories`，不要把业务逻辑直接塞进路由层
- 在修改响应结构时，统一通过 `src/utils/response.js` 返回 `{ data, error }` 结构
- 在引入新模块前，先搜索 `src/` 是否已有可复用实现，避免在示例项目里制造重复逻辑

### 错误处理

- 处理用户输入时，先在 `services` 层做校验，再进入 repository
- 业务校验失败时，返回 4xx 错误和明确的 `code`
- 未预期异常时，对外只返回通用错误信息 `Something went wrong`

### 测试

- 修改 `src/services` 逻辑时，同步更新 `test/` 下的回归测试
- 新增分支判断时，至少覆盖正常流程、空值和过滤/搜索类边界条件

---

## 禁止行为

- 不要在 `repositories` 层做参数校验
- 不要在 `server.js` 中直接操作内存存储
- 不要返回与 `{ data, error }` 不一致的 API 响应结构
- 不要在没有测试覆盖的情况下改动 `src/services`
