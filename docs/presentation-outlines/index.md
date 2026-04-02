# 分享与培训

这一页收口部门培训用的分享源文件、默认交付物和生成辅助脚本。默认按固定约定使用，避免混淆“看哪个文件”“改哪个文件”“直接用哪个文件”。

## 内容源文件

- [`30min-cross-functional-ai-workshop.md`](./30min-cross-functional-ai-workshop.md) — 面向产品、设计、研发和少量管理者的 30 分钟综合课大纲；课程结构、页序和口播逻辑统一在这里维护

## 默认交付物

- <a href="/downloads/presentation-outlines/30min-cross-functional-ai-workshop-visual.pptx" download><code>30min-cross-functional-ai-workshop-visual.pptx</code></a> — 默认对外分享成品；如需快速复用，优先直接使用这一份

## 生成辅助脚本

- <a href="/downloads/presentation-outlines/generate_cross_functional_ai_workshop_visual_ppt.py" download><code>generate_cross_functional_ai_workshop_visual_ppt.py</code></a> — 根据源大纲生成视觉版 PPT 的辅助脚本

基础版导出文件和基础版生成脚本保留为内部开发辅助，不作为主导航默认入口。

## 使用建议

- 混合部门场景优先保留“统一案例”
- 非研发听众占多数时，压缩研发页口播时间
- 如需拆成系列课，可把产品、设计、研发三页分别扩展成单独专场
- 如需改内容，先修改 `30min-cross-functional-ai-workshop.md`，再重新生成或手工调整视觉版 PPT
