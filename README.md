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
- [`docs/public/downloads/`](./docs/public/downloads/)：手工维护并直接提交的下载资源目录
- [`.vitepress/config.mts`](./.vitepress/config.mts)：VitePress 站点配置

## 阅读入口

- 站点首页入口见 [`docs/index.md`](./docs/index.md)
- 开始阅读页见 [`docs/intro/index.md`](./docs/intro/index.md)
- 内容地图页见 [`docs/project-overview/index.md`](./docs/project-overview/index.md)

## 清理原则

- `docs/` 是正文唯一来源
- `docs/public/downloads/` 是站点直接发布的静态目录，手工维护并直接提交
