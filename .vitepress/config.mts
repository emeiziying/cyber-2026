import {defineConfig} from 'vitepress';

export default defineConfig({
  title: 'Cyber 2026',
  description: '赛博飞升方法论',
  lang: 'zh-CN',
  cleanUrls: true,
  srcDir: 'docs',
  srcExclude: ['public/downloads/**/*.md'],
  themeConfig: {
    nav: [
      {text: '开始阅读', link: '/intro/'},
      {text: '学习主线', link: '/paradigm-shift/'},
      {text: '案例与演练', link: '/appendix-case-studies/'},
      {text: '分享与培训', link: '/presentation-outlines/'},
    ],
    sidebar: [
      {
        text: '导读',
        items: [
          {text: '开始阅读', link: '/intro/'},
        ],
      },
      {
        text: '学习主线',
        items: [
          {
            text: '认知与协作方式',
            items: [
              {
                text: '范式转变',
                link: '/paradigm-shift/',
                items: [
                  {
                    text: '角色影响场景',
                    link: '/paradigm-shift/examples/role-impact-scenarios',
                  },
                ],
              },
              {
                text: 'Vibe Coding',
                link: '/vibe-coding/',
                items: [
                  {text: '完整会话示例', link: '/vibe-coding/examples/full-session'},
                ],
              },
              {
                text: '工具全景',
                link: '/tools-overview/',
                items: [
                  {text: '团队画像案例', link: '/tools-overview/examples/team-profiles'},
                  {text: 'OpenClaw 实战指南', link: '/tools-overview/examples/openclaw-guide'},
                ],
              },
            ],
          },
          {
            text: '能力构建',
            items: [
              {
                text: 'Rules',
                link: '/rules/',
                items: [
                  {text: 'Rules 冲突案例', link: '/rules/examples/rules-conflict-case'},
                ],
              },
              {
                text: 'MCP',
                link: '/mcp/',
                items: [
                  {text: 'MCP 只读接入演练', link: '/mcp/examples/mcp-readonly-rollout'},
                ],
              },
              {
                text: 'Skills & Hooks',
                link: '/skills-hooks/',
                items: [
                  {text: '进阶模式', link: '/skills-hooks/advanced-patterns'},
                  {
                    text: 'Skill 与 Hook 判断案例',
                    link: '/skills-hooks/examples/skill-hook-decision-cases',
                  },
                  {
                    text: '部门级 Skill 共享',
                    link: '/skills-hooks/examples/dept-skill-sharing',
                  },
                ],
              },
              {
                text: 'Agent 开发',
                link: '/agent-development/',
                items: [
                  {
                    text: 'Review Agent 演练',
                    link: '/agent-development/examples/review-agent-walkthrough',
                  },
                ],
              },
              {
                text: 'Harness Engineering',
                link: '/harness-engineering/',
                items: [
                  {
                    text: 'Harness 设计演练',
                    link: '/harness-engineering/examples/harness-design-case',
                  },
                ],
              },
            ],
          },
          {
            text: '治理与团队化',
            items: [
              {
                text: '生产落地与治理',
                link: '/production-governance/',
                items: [
                  {
                    text: '发布风险复盘案例',
                    link: '/production-governance/examples/release-risk-review',
                  },
                ],
              },
              {
                text: '团队工作流与质量控制',
                link: '/team-workflow/',
                items: [
                  {text: '工作流样例', link: '/team-workflow/examples/workflow-sample'},
                ],
              },
            ],
          },
        ],
      },
      {
        text: '案例与演练',
        items: [
          {text: '附录：案例与延伸阅读', link: '/appendix-case-studies/'},
          {
            text: '跨角色 AI 手册',
            link: '/appendix-case-studies/cross-functional-ai-handbook',
          },
          {
            text: '实战案例：修复搜索 bug',
            link: '/appendix-case-studies/examples/fix-search-bug-case',
          },
          {text: 'Minimal Agent Demo', link: '/examples/minimal-agent-demo/'},
        ],
      },
      {
        text: '资料与分享',
        items: [
          {text: '分享与培训', link: '/presentation-outlines/'},
          {
            text: '30 分钟 Workshop',
            link: '/presentation-outlines/30min-cross-functional-ai-workshop',
          },
          {text: '下载资源', link: '/downloads/'},
        ],
      },
    ],
    outline: {
      level: [2, 3],
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
  },
});
