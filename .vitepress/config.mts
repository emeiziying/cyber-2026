import {defineConfig} from 'vitepress';

export default defineConfig({
  title: 'Cyber 2026',
  description: '赛博飞升方法论',
  lang: 'zh-CN',
  cleanUrls: true,
  srcDir: 'docs',
  srcExclude: ['public/downloads/**/*.md'],
  markdown: {
    config(md) {
      md.core.ruler.push('preserve-blockquote-softbreaks', (state) => {
        let blockquoteDepth = 0;

        for (const token of state.tokens) {
          if (token.type === 'blockquote_open') {
            blockquoteDepth += 1;
            continue;
          }

          if (token.type === 'blockquote_close') {
            blockquoteDepth = Math.max(0, blockquoteDepth - 1);
            continue;
          }

          if (blockquoteDepth === 0 || token.type !== 'inline' || !token.children) {
            continue;
          }

          // Authors often use consecutive `>` lines as multi-line quoted prompts or meta blocks.
          for (const child of token.children) {
            if (child.type === 'softbreak') {
              child.type = 'hardbreak';
            }
          }
        }
      });
    },
  },
  themeConfig: {
    nav: [
      {text: '开始阅读', link: '/intro/'},
      {text: '学习主线', link: '/paradigm-shift/'},
    ],
    sidebar: [
      {
        text: '导读',
        items: [
          {text: '开始阅读', link: '/intro/'},
          {text: '快速启动指南', link: '/intro/quick-start'},
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
                  {text: '可视化 AI 编排平台', link: '/tools-overview/examples/low-code-ai-platforms'},
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
                  {text: 'MCP 热门开源项目', link: '/mcp/examples/popular-mcp-servers'},
                ],
              },
              {
                text: 'Skills & Hooks',
                link: '/skills-hooks/',
                items: [
                  {
                    text: '核心方法',
                    items: [
                      {text: '进阶模式', link: '/skills-hooks/advanced-patterns'},
                      {
                        text: 'Skill 与 Hook 判断案例',
                        link: '/skills-hooks/examples/skill-hook-decision-cases',
                      },
                    ],
                  },
                  {
                    text: '组织实践',
                    items: [
                      {
                        text: '部门级 Skill 共享',
                        link: '/skills-hooks/examples/dept-skill-sharing',
                      },
                    ],
                  },
                  {
                    text: 'Skill Pack 案例',
                    items: [
                      {
                        text: '官方 Skills 速查',
                        link: '/skills-hooks/examples/official-skills-catalog',
                      },
                      {
                        text: 'Skill Pack 选型',
                        link: '/skills-hooks/examples/skill-pack-selection',
                      },
                      {
                        text: 'gstack 实战指南',
                        link: '/skills-hooks/examples/gstack-workflow',
                      },
                      {
                        text: 'superpowers 实战指南',
                        link: '/skills-hooks/examples/superpowers-workflow',
                      },
                      {
                        text: 'GSD 实战指南',
                        link: '/skills-hooks/examples/gsd-workflow',
                      },
                    ],
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
