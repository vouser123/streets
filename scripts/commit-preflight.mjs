#!/usr/bin/env node

// scripts/commit-preflight.mjs — report likely commit blockers before running git commit.

import { execFileSync } from "node:child_process";

const repoRoot = process.cwd();

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

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = { message: "", trailers: [], verbose: false, help: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--verbose" || arg === "-v") {
      parsed.verbose = true;
      continue;
    }
    if (arg === "--message") {
      parsed.message = args[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (arg === "--trailer") {
      parsed.trailers.push(args[index + 1] ?? "");
      index += 1;
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`Usage:
  npm run commit:preflight -- --message "Your title (om-xxxx)" --trailer "Co-Authored-By: Codex <codex@openai.com>"
  npm run commit:preflight -- --message "Your title (om-xxxx)" --verbose

Options:
  --message <title>     Commit title to validate before git commit
  --trailer <text>      Commit trailer to validate before git commit (repeatable)
  --verbose, -v         Show the full preflight report, including passing sections
  --help, -h            Show this help text`);
}

function runCommand(command, args) {
  try {
    const stdout = execFileSync(command, args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { ok: true, stdout: stdout.trim(), stderr: "" };
  } catch (error) {
    return {
      ok: false,
      stdout: (error.stdout ?? "").toString().trim(),
      stderr: (error.stderr ?? "").toString().trim(),
    };
  }
}

function summarizeOutput(output) {
  const combined = [output.stdout, output.stderr].filter(Boolean).join("\n").trim();
  return combined ? combined.split(/\r?\n/) : [];
}

function checkReadmeGuard() {
  const result = runCommand(process.execPath, ["scripts/check-readme-update.mjs"]);
  return {
    name: "README guard",
    ok: result.ok,
    details: result.ok ? ["README guard would pass."] : summarizeOutput(result),
  };
}

function checkDocsReadmeGuard() {
  const result = runCommand(process.execPath, ["scripts/check-docs-readme-update.mjs"]);
  return {
    name: "Docs README guard",
    ok: result.ok,
    details: result.ok ? ["Docs README guard would pass."] : summarizeOutput(result),
  };
}

function checkStructure() {
  const result = runCommand(process.execPath, ["scripts/check-structure.mjs", "--staged"]);
  return {
    name: "Structure check",
    ok: result.ok,
    details: result.ok ? ["Structure check would pass."] : summarizeOutput(result),
  };
}

function checkBiome(stagedFiles) {
  const result = runCommand(process.execPath, ["scripts/run-biome-staged.mjs"]);
  return {
    name: "Biome staged checks",
    ok: result.ok,
    details: result.ok
      ? [
          `Biome staged checks would pass for ${stagedFiles.length} staged file${
            stagedFiles.length === 1 ? "" : "s"
          }.`,
        ]
      : summarizeOutput(result),
  };
}

function checkGitleaks() {
  const result = runCommand("powershell", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    "scripts/run-gitleaks-staged.ps1",
  ]);
  return {
    name: "Gitleaks snapshot scan",
    ok: result.ok,
    details: result.ok ? ["Secret scan would pass."] : summarizeOutput(result),
  };
}

function checkCommitMessage({ message, trailers }) {
  if (!message) {
    return {
      name: "Commit message requirements",
      ok: false,
      details: [
        "No commit message title was provided to preflight.",
        'Pass --message "Your title (om-xxxx)" to validate the Beads ID in advance.',
      ],
    };
  }

  const details = [];
  const beadPattern = /\((om-[a-z0-9][a-z0-9.-]*)(,\s*om-[a-z0-9][a-z0-9.-]*)*\)/i;
  if (!beadPattern.test(message)) {
    details.push(
      'Commit title is missing a Streets Beads ID in parentheses. Example: "Set up repo tooling (om-1dp)".',
    );
  }

  const trailerPattern = /^Co-Authored-By: .*<(codex@openai\.com|noreply@anthropic\.com)>$/i;
  const hasRecognizedTrailer =
    process.env.STREETS_AI_TRAILER_OK === "1" ||
    trailers.some((trailer) => trailerPattern.test(trailer.trim()));
  if (!hasRecognizedTrailer) {
    details.push(
      'No recognized AI trailer was provided. Add --trailer "Co-Authored-By: Codex <codex@openai.com>" or set STREETS_AI_TRAILER_OK=1 for the commit only when no agent attribution should be recorded.',
    );
  }

  return {
    name: "Commit message requirements",
    ok: details.length === 0,
    details:
      details.length === 0
        ? ["Commit title and supplied trailer(s) satisfy the current requirements."]
        : details,
  };
}

function formatSection(result) {
  const status = result.ok ? "PASS" : "FAIL";
  return [`[${status}] ${result.name}`, ...result.details.map((detail) => `  ${detail}`)].join(
    "\n",
  );
}

const args = parseArgs(process.argv);
if (args.help) {
  printHelp();
  process.exit(0);
}

const stagedFiles = getStagedFiles();
const results = [
  {
    name: "Staged files",
    ok: stagedFiles.length > 0,
    details: stagedFiles.length > 0 ? stagedFiles.map((file) => `- ${file}`) : ["No staged files."],
  },
];

if (stagedFiles.length > 0) {
  results.push(checkReadmeGuard());
  results.push(checkDocsReadmeGuard());
  results.push(checkBiome(stagedFiles));
  results.push(checkStructure());
  results.push(checkGitleaks());
}

results.push(checkCommitMessage(args));

const failed = results.filter((result) => !result.ok);

if (failed.length === 0) {
  if (args.verbose) {
    console.log("Commit preflight report");
    console.log("");
    for (const result of results) {
      console.log(formatSection(result));
      console.log("");
    }
    console.log(
      "Preflight passed. The current staged snapshot and supplied commit message look ready for git commit.",
    );
    process.exit(0);
  }

  console.log(
    `Preflight passed. ${stagedFiles.length} staged file${stagedFiles.length === 1 ? "" : "s"}; README, docs README, Biome, structure, secret scan, and commit message checks all passed.`,
  );
  process.exit(0);
}

console.log("Commit preflight report");
console.log("");
for (const result of failed) {
  console.log(formatSection(result));
  console.log("");
}
console.error(
  "Preflight found blockers. Fix the failed sections above, then rerun this command before git commit.",
);
process.exit(1);
