# Scripts Guide

Use this file for the current workflow for Streets local scripts.

Like the rest of this repo, this guide is written for AI-agent workflow rather than end-user documentation.

Use [`../README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/README.md) for the live repo map.
Use [`NEXTJS_CODE_STRUCTURE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_CODE_STRUCTURE.md) for the architecture rules that the structure guard enforces.

## Commit Preflight Script

Use `npm run commit:preflight -- ...` after staging and before `git commit` when you want one report for the repo's current commit blockers.

Usage pattern:

```bash
npm run commit:preflight -- --message "Your title (om-xxxx)" --trailer "Co-Authored-By: Codex <codex@openai.com>"
npm run commit:preflight -- --message "Your title (om-xxxx)" --verbose
npm run commit:preflight -- --help
```

What it checks right now:

- staged-file selection
- root README guard
- docs README guard
- Biome staged checks
- structure check
- Gitleaks staged snapshot scan
- commit message bead ID and AI trailer requirements

Notes:

- Use at least one Streets Beads ID such as `(om-1dp)` in the commit title.
- Recognized agent emails are `codex@openai.com` and `noreply@anthropic.com`.
- Default output is quiet. Passing runs print one summary line. Failing runs print only the blocking sections.
- Use `--verbose` when you want the full report including passing sections.
- This script is the combined manual report. The pre-commit hook separately runs the README guard, docs README guard, and structure guard on commit when Node is available.
 - This script is the combined manual report. The pre-commit hook separately runs Biome, README, docs README, structure, and secret scan checks on commit when the required runtimes are available.

## Quality And Guardrail Scripts

- `npm run biome:check`
  - Full repo Biome check.
- `npm run biome:lint`
  - Full repo lint pass.
- `npm run biome:format`
  - Writes formatting changes across the repo.
- `npm run biome:staged`
  - Formats and lints the staged snapshot, then re-stages the changes.
- `npm run structure:check`
  - Runs the staged-file structure guard directly.
  - Use it when you want a manual read on structure issues before a commit attempt.
- `npm run a11y:screen-reader`
  - Runs axe WCAG checks plus Streets-specific screen-reader focus-stop contracts against a running local app.
  - Start the dev server first with `npm run dev -- --port 3000`, or set `STREETS_A11Y_BASE_URL` to another local URL.
  - This checks DOM/accessibility contracts such as one focusable control owning one complete spoken name; it does not replace final VoiceOver or TalkBack traversal for mobile-critical flows.
- `node scripts/check-readme-update.mjs`
  - Checks whether staged repo-shape files should also stage `README.md`.
- `node scripts/check-docs-readme-update.mjs`
  - Checks whether staged docs changes should also stage `docs/README.md`.
- `scripts/run-gitleaks-staged.ps1`
  - Exports the staged snapshot and scans it with Gitleaks using the repo's strict config.

## What This Means For You

These scripts are the repo-readiness guardrails for Streets. They help keep the repo map, docs index, and TypeScript structure rules aligned as the app is built out.
