#!/usr/bin/env node

// scripts/check-structure.mjs — enforce staged-file structure rules from docs/NEXTJS_CODE_STRUCTURE.md.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const fileCaps = [
  { pattern: /^app\/.+\/page\.tsx$/, cap: 80, label: "app/**/page.tsx" },
  { pattern: /^app\/.+Page\.tsx$/, cap: 500, label: "app/**/*Page.tsx" },
  { pattern: /^app\/layout\.tsx$/, cap: 120, label: "app/layout.tsx" },
  {
    pattern: /^app\/.+\.(ts|tsx)$/,
    cap: 300,
    label: "app-local helper",
    exclude: [
      /^app\/.+\/page\.tsx$/,
      /^app\/.+Page\.tsx$/,
      /^app\/layout\.tsx$/,
      /^app\/.+\/route\.ts$/,
    ],
  },
  { pattern: /^components\/.+\.tsx$/, cap: 300, label: "components/*.tsx" },
  { pattern: /^hooks\/use.+\.ts$/, cap: 150, label: "hooks/use*.ts" },
  { pattern: /^lib\/.+\.ts$/, cap: 450, label: "lib/*.ts" },
  { pattern: /^.+\.module\.css$/, cap: 500, label: "*.module.css" },
  { pattern: /^styles\/globals\.css$/, cap: 100, label: "styles/globals.css" },
];

function gitLines(args) {
  const output = execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" });
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getTargetFiles() {
  const explicitArgs = process.argv.slice(2).filter((arg) => arg !== "--staged");
  if (explicitArgs.length > 0) {
    return explicitArgs;
  }
  return gitLines(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]);
}

function getCapInfo(relPath) {
  return (
    fileCaps.find((entry) => {
      if (!entry.pattern.test(relPath)) return false;
      if (entry.exclude?.some((pattern) => pattern.test(relPath))) return false;
      return true;
    }) ?? null
  );
}

function readFile(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function relImportTarget(relPath, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }
  return path.normalize(path.join(path.dirname(relPath), specifier)).replaceAll("\\", "/");
}

function parseImports(source) {
  const imports = [];
  const importRegex = /import\s+(?:type\s+)?(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/g;
  for (let match = importRegex.exec(source); match !== null; match = importRegex.exec(source)) {
    imports.push(match[1]);
  }
  return imports;
}

function hasRequiredHeader(relPath, source) {
  if (!/^(components|hooks|lib)\/.+\.(ts|tsx)$/.test(relPath)) {
    return true;
  }
  const firstLine = source.split(/\r?\n/, 1)[0] ?? "";
  return /^\/\/\s+\S.+\s+—\s+\S.+$/.test(firstLine);
}

function checkComponentImports(relPath, imports) {
  const errors = [];
  for (const specifier of imports) {
    const target = relImportTarget(relPath, specifier) ?? specifier;
    if (
      target.startsWith("hooks/") ||
      target.includes("/hooks/") ||
      target.startsWith("lib/") ||
      target.includes("/lib/")
    ) {
      errors.push(`${relPath}: components must not import hooks or lib files (${specifier}).`);
    }
  }
  return errors;
}

function checkHookImports(relPath, imports) {
  const errors = [];
  for (const specifier of imports) {
    const target = relImportTarget(relPath, specifier) ?? specifier;
    if (target.startsWith("components/") || target.includes("/components/")) {
      errors.push(`${relPath}: hooks must not import components (${specifier}).`);
    }
  }
  return errors;
}

function checkLibImports(relPath, imports) {
  const errors = [];
  for (const specifier of imports) {
    const target = relImportTarget(relPath, specifier) ?? specifier;
    if (
      specifier === "react" ||
      specifier.startsWith("react/") ||
      target.startsWith("components/") ||
      target.includes("/components/") ||
      target.startsWith("hooks/") ||
      target.includes("/hooks/")
    ) {
      errors.push(
        `${relPath}: lib files must not import React, components, or hooks (${specifier}).`,
      );
    }
  }
  return errors;
}

function checkThinAppPage(relPath, source, imports) {
  if (!/^app\/.+\/page\.tsx$/.test(relPath) && relPath !== "app/page.tsx") {
    return [];
  }

  const errors = [];
  const forbiddenPatterns = [
    /['"]use client['"]/,
    /\buseState\s*\(/,
    /\buseEffect\s*\(/,
    /\buseRef\s*\(/,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) {
      errors.push(`${relPath}: app/**/page.tsx must stay a thin server route entry.`);
    }
  }

  for (const specifier of imports) {
    const target = relImportTarget(relPath, specifier) ?? specifier;
    if (
      target.startsWith("components/") ||
      target.includes("/components/") ||
      target.startsWith("hooks/") ||
      target.includes("/hooks/") ||
      target.startsWith("lib/") ||
      target.includes("/lib/")
    ) {
      errors.push(
        `${relPath}: app/**/page.tsx may not import components, hooks, or lib directly (${specifier}).`,
      );
    }
  }

  return errors;
}

function checkFile(relPath) {
  const absolutePath = path.join(repoRoot, relPath);
  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
    return [];
  }

  const errors = [];
  const source = readFile(relPath);
  const lineCount = source.split(/\r?\n/).length;
  const cap = getCapInfo(relPath);
  if (cap && lineCount > cap.cap) {
    errors.push(`${relPath}: ${lineCount} lines exceeds the ${cap.cap}-line cap for ${cap.label}.`);
  }

  if (!hasRequiredHeader(relPath, source)) {
    errors.push(
      `${relPath}: missing required one-line file header comment ("// path — domain ownership").`,
    );
  }

  if (/\.(ts|tsx)$/.test(relPath)) {
    const imports = parseImports(source);
    if (relPath.startsWith("components/")) {
      errors.push(...checkComponentImports(relPath, imports));
    }
    if (relPath.startsWith("hooks/")) {
      errors.push(...checkHookImports(relPath, imports));
    }
    if (relPath.startsWith("lib/")) {
      errors.push(...checkLibImports(relPath, imports));
    }
    errors.push(...checkThinAppPage(relPath, source, imports));
  }

  return errors;
}

const files = getTargetFiles();
if (files.length === 0) {
  process.exit(0);
}

const errors = files.flatMap(checkFile);
if (errors.length === 0) {
  process.exit(0);
}

console.error("Structure check failed:");
for (const error of errors) {
  console.error(`  - ${error}`);
}
console.error("");
console.error("These rules come from docs/NEXTJS_CODE_STRUCTURE.md.");
process.exit(1);
