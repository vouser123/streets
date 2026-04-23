import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const readmePath = "README.md";
const gitPrefix = execFileSync("git", ["rev-parse", "--show-prefix"], {
  cwd: repoRoot,
  encoding: "utf8",
})
  .trim()
  .replace(/\\/g, "/");

const sharedTriggerPatterns = [
  /^AGENTS\.md$/,
  /^CLAUDE\.md$/,
  /^package\.json$/,
  /^scripts\/.+/,
  /^app\/.+/,
  /^components\/.+/,
  /^hooks\/.+/,
  /^lib\/.+/,
  /^public\/.+/,
  /^styles\/.+/,
];

function getStagedFiles() {
  const output = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((file) => file.replace(/\\/g, "/"))
    .map((file) => (gitPrefix && file.startsWith(gitPrefix) ? file.slice(gitPrefix.length) : file));
}

function matchesSharedTrigger(file) {
  return sharedTriggerPatterns.some((pattern) => pattern.test(file));
}

function printFailure(sharedFiles) {
  console.error("README review required before commit.");
  console.error("");
  console.error("You staged repo-shape or ownership files that can change the agent map:");
  for (const file of sharedFiles) {
    console.error(`  - ${file}`);
  }
  console.error("");
  console.error(`Stage ${readmePath} if the repo map or ownership guidance changed.`);
  console.error("If README.md remains accurate without edits, retry with:");
  console.error('  $env:STREETS_README_OK="1"; git commit ...');
  console.error("");
  console.error(`See ${path.join(repoRoot, readmePath)} and ${path.join(repoRoot, "AGENTS.md")}.`);
}

const stagedFiles = getStagedFiles();
const sharedFiles = stagedFiles.filter(matchesSharedTrigger);

if (sharedFiles.length === 0) {
  process.exit(0);
}

if (stagedFiles.includes(readmePath) || process.env.STREETS_README_OK === "1") {
  process.exit(0);
}

printFailure(sharedFiles);
process.exit(1);
