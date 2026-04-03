import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, 'docs');
const publicRoot = path.join(docsRoot, 'public');

const markdownFiles = collectMarkdownFiles(docsRoot);
const issues = [];

for (const file of markdownFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const maskedContent = maskFencedCodeBlocks(content);

  for (const reference of extractReferences(maskedContent)) {
    const target = normalizeTarget(reference.target);

    if (!shouldCheck(target)) {
      continue;
    }

    if (!linkExists(file, target)) {
      issues.push({
        file: path.relative(repoRoot, file),
        line: getLineNumber(content, reference.index),
        target
      });
    }
  }
}

if (issues.length > 0) {
  console.error('Broken documentation links detected:\n');

  for (const issue of issues) {
    console.error(`- ${issue.file}:${issue.line} -> ${issue.target}`);
  }

  process.exit(1);
}

console.log(`Checked ${markdownFiles.length} Markdown files, no broken local links found.`);

function collectMarkdownFiles(rootDir) {
  const results = [];

  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const entryPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(entryPath);
    }
  }

  return results;
}

function maskFencedCodeBlocks(content) {
  return content.replace(/```[\s\S]*?```/g, (match) => match.replace(/[^\n]/g, ' '));
}

function extractReferences(content) {
  const references = [];
  const markdownLinkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;
  const htmlHrefPattern = /<a\b[^>]*\bhref="([^"]+)"[^>]*>/g;

  for (const pattern of [markdownLinkPattern, htmlHrefPattern]) {
    let match;

    while ((match = pattern.exec(content)) !== null) {
      references.push({
        index: match.index,
        target: extractLinkTarget(match[1])
      });
    }
  }

  return references;
}

function extractLinkTarget(rawTarget) {
  const trimmed = rawTarget.trim();

  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return trimmed.slice(1, -1);
  }

  const firstWhitespaceIndex = trimmed.search(/\s/);
  return firstWhitespaceIndex === -1 ? trimmed : trimmed.slice(0, firstWhitespaceIndex);
}

function normalizeTarget(target) {
  return target.split('#')[0].split('?')[0];
}

function shouldCheck(target) {
  if (!target || target === '#') {
    return false;
  }

  return !/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(target);
}

function linkExists(sourceFile, target) {
  if (target.startsWith('/downloads/')) {
    return fs.existsSync(path.join(publicRoot, target.slice(1)));
  }

  if (target === '/') {
    return fs.existsSync(path.join(docsRoot, 'index.md'));
  }

  if (target.startsWith('/')) {
    return hasMatchingCandidate(resolveSitePathCandidates(target));
  }

  return hasMatchingCandidate(resolveRelativePathCandidates(sourceFile, target));
}

function resolveSitePathCandidates(target) {
  const relativeTarget = target.slice(1);
  const basePath = path.join(docsRoot, relativeTarget);
  const candidates = [];

  if (path.extname(relativeTarget)) {
    candidates.push(basePath);
    candidates.push(path.join(publicRoot, relativeTarget));
    return candidates;
  }

  candidates.push(`${basePath}.md`);
  candidates.push(path.join(basePath, 'index.md'));
  return candidates;
}

function resolveRelativePathCandidates(sourceFile, target) {
  const basePath = path.resolve(path.dirname(sourceFile), target);
  const candidates = [basePath];

  if (!path.extname(basePath)) {
    candidates.push(`${basePath}.md`);
    candidates.push(path.join(basePath, 'index.md'));
  }

  return candidates;
}

function hasMatchingCandidate(candidates) {
  return candidates.some((candidate) => fs.existsSync(candidate));
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}
