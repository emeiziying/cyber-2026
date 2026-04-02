# Cyber 2026

该仓库存放 Cyber 2026 文档站源文件，站点内容围绕“赛博飞升方法论”组织。

## 本地开发

```bash
pnpm install
pnpm docs:dev
```

常用命令：

- `pnpm docs:dev`：启动本地文档站
- `pnpm docs:build`：构建静态站点
- `pnpm docs:preview`：本地预览构建产物

## 站点结构

- [`docs/`](./docs/)：站点正文内容
- [`resources/`](./resources/)：模板、配置、PPT 和脚本的权威源目录
- [`examples/`](./examples/)：可运行的示例项目源码
- [`docs/public/downloads/`](./docs/public/downloads/)：构建前自动同步的下载资源目录
- [`.vitepress/config.mts`](./.vitepress/config.mts)：VitePress 站点配置

## 阅读入口

- 站点首页入口见 [`docs/index.md`](./docs/index.md)
- 开始阅读页见 [`docs/intro/index.md`](./docs/intro/index.md)
- 内容地图页见 [`docs/project-overview/index.md`](./docs/project-overview/index.md)

## 清理原则

- `docs/` 是正文唯一来源
- `resources/` 是模板、配置、PPT 和脚本的唯一源目录
- `examples/` 保留可运行的示例项目源码
- `docs/public/downloads/` 是站点消费的生成目录，不手工维护
