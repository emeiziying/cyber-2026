import {promises as fs} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');

const ignoreDirPatterns = ['docs/public/downloads'];
const markdownFiles = [];

async function walk(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replaceAll('\\', '/');
    if (ignoreDirPatterns.some((p) => rel.startsWith(p))) continue;
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      markdownFiles.push(full);
    }
  }
}

function collectLinks(content) {
  const links = [];
  const mdRegex = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const htmlRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/g;
  let m;
  while ((m = mdRegex.exec(content)) !== null) links.push(m[1]);
  while ((m = htmlRegex.exec(content)) !== null) links.push(m[1]);
  return links;
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function resolveDocPath(rawLink, fileDir) {
  const link = rawLink.split('#')[0].split('?')[0];
  if (!link) return null;
  if (/^(https?:|mailto:|tel:|javascript:)/.test(link)) return null;

  if (link.startsWith('/downloads/')) return null;

  const candidates = [];
  if (link.startsWith('/')) {
    const noSlash = link.slice(1);
    if (!noSlash) return null;
    candidates.push(path.join(docsRoot, `${noSlash}.md`));
    candidates.push(path.join(docsRoot, noSlash, 'index.md'));
  } else {
    candidates.push(path.resolve(fileDir, `${link}.md`));
    candidates.push(path.resolve(fileDir, link, 'index.md'));
    if (link.endsWith('.md')) candidates.push(path.resolve(fileDir, link));
  }

  for (const c of candidates) {
    if (await exists(c)) return c;
  }
  return {missing: true, checked: candidates.map((p) => path.relative(root, p))};
}

await walk(docsRoot);

const errors = [];
for (const file of markdownFiles) {
  const content = await fs.readFile(file, 'utf8');
  const links = collectLinks(content);
  const dir = path.dirname(file);

  for (const link of links) {
    const resolved = await resolveDocPath(link, dir);
    if (resolved && resolved.missing) {
      errors.push({
        file: path.relative(root, file),
        link,
        checked: resolved.checked,
      });
    }
  }
}

if (errors.length > 0) {
  console.error(`发现 ${errors.length} 个无效内部链接：`);
  for (const err of errors) {
    console.error(`- ${err.file} -> ${err.link}`);
    console.error(`  checked: ${err.checked.join(', ')}`);
  }
  process.exit(1);
}

console.log(`链接检查通过，共扫描 ${markdownFiles.length} 个文档文件。`);
