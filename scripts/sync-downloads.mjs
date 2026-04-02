import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const downloadsRoot = path.join(repoRoot, 'docs', 'public', 'downloads');

const copies = [
  ['resources/rules/templates', 'rules/templates'],
  ['resources/mcp/templates', 'mcp/templates'],
  ['resources/skills-hooks/templates', 'skills-hooks/templates'],
  ['resources/production-governance/templates', 'production-governance/templates'],
  ['resources/team-workflow/templates', 'team-workflow/templates'],
  ['resources/appendix-case-studies/templates', 'appendix-case-studies/templates'],
  [
    'resources/presentation-outlines/30min-cross-functional-ai-workshop-visual.pptx',
    'presentation-outlines/30min-cross-functional-ai-workshop-visual.pptx',
  ],
  [
    'resources/presentation-outlines/30min-cross-functional-ai-workshop.pptx',
    'presentation-outlines/30min-cross-functional-ai-workshop.pptx',
  ],
  [
    'resources/presentation-outlines/generate_cross_functional_ai_workshop_ppt.py',
    'presentation-outlines/generate_cross_functional_ai_workshop_ppt.py',
  ],
  [
    'resources/presentation-outlines/generate_cross_functional_ai_workshop_visual_ppt.py',
    'presentation-outlines/generate_cross_functional_ai_workshop_visual_ppt.py',
  ],
  ['examples/minimal-agent-demo/CLAUDE.md', 'examples/minimal-agent-demo/CLAUDE.md'],
  ['examples/minimal-agent-demo/.claude', 'examples/minimal-agent-demo/.claude'],
];

fs.rmSync(downloadsRoot, {
  recursive: true,
  force: true,
  maxRetries: 10,
  retryDelay: 50,
});

for (const [sourcePath, destinationPath] of copies) {
  const source = path.join(repoRoot, sourcePath);
  const destination = path.join(downloadsRoot, destinationPath);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing download source: ${sourcePath}`);
  }

  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.cpSync(source, destination, {recursive: true});
}

console.log(`Synced downloads to ${path.relative(repoRoot, downloadsRoot)}`);
