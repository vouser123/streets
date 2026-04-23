#!/usr/bin/env node

// scripts/run-biome-staged.mjs — run Biome on staged files and fail on lint or format blockers.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const biomeBin = path.join(repoRoot, "node_modules", "@biomejs", "biome", "bin", "biome");

function readGitLines(args) {
  const output = execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" });
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getStagedFiles() {
  return readGitLines(["diff", "--cached", "--name-only", "--diff-filter=ACMR"]);
}

function hasUnstagedChanges(file) {
  return readGitLines(["diff", "--name-only", "--", file]).length > 0;
}

function runBiome(args) {
  execFileSync(process.execPath, [biomeBin, ...args], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

const stagedFiles = getStagedFiles();
if (stagedFiles.length === 0) {
  process.exit(0);
}

if (!fs.existsSync(biomeBin)) {
  console.error("Biome is not installed. Run `npm install` before committing.");
  process.exit(1);
}

const partiallyStaged = stagedFiles.filter((file) => hasUnstagedChanges(file));
if (partiallyStaged.length > 0) {
  console.error(
    "Biome staged checks stopped because some staged files also have unstaged changes:",
  );
  for (const file of partiallyStaged) {
    console.error(`  - ${file}`);
  }
  process.exit(1);
}

runBiome([
  "format",
  "--write",
  "--files-ignore-unknown=true",
  "--no-errors-on-unmatched",
  ...stagedFiles,
]);
runBiome(["lint", "--files-ignore-unknown=true", "--no-errors-on-unmatched", ...stagedFiles]);
execFileSync("git", ["add", "--", ...stagedFiles], { cwd: repoRoot, stdio: "ignore" });
