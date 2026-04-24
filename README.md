# Streets

## Repo Shape

Streets is being rebuilt from a single-file browser prototype into a Next.js App Router app in TypeScript for Vercel.

Use this README as the live repo map and ownership guide. Use [`docs/NEXTJS_REBUILD_PLAN.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_REBUILD_PLAN.md) for the approved rebuild scope, and use [`docs/NEXTJS_CODE_STRUCTURE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_CODE_STRUCTURE.md) for placement and split rules.

## Current Repo Map

Current top-level files and folders that matter:

```text
streets/
|- app/           Next.js App Router routes and route-local page hosts
|- components/    Shared render-only React UI pieces
|- hooks/         Shared React state and browser-effect owners
|- lib/           Pure timing, replay, storage, and cue helpers
|- public/        Static assets, including the preserved legacy prototype
|- styles/        Global app tokens and reset styling
|- docs/          Repo workflow docs and rebuild planning docs
|- scripts/       Repo guard and workflow scripts
|- pages/         Empty Next.js compatibility directory
|- index.html     Legacy prototype source baseline kept in repo root
|- RESEARCH.md    Legacy research and implementation notes for the prototype
|- .beads/        Beads issue tracking data and git hooks
|- .vexp/         Local vexp workspace state
|- vexp.toml      vexp configuration
|- AGENTS.md      Repo operating rules for agents
|- CLAUDE.md      Minimal pointer file
```

### Current Ownership Notes

- [`app/layout.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/layout.tsx): Root App Router shell for the rebuild. Owns shared metadata and viewport configuration only.
- [`app/page.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/page.tsx) + [`app/HomePage.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/HomePage.tsx): Landing redirect entry and client host that route first-run users into `Timing Setup` before practice.
- [`app/practice/page.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/practice/page.tsx) + [`app/practice/PracticePage.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/practice/PracticePage.tsx): Primary practice route. Owns the one-large-button training flow, replay summary, and mode selection.
- [`app/timing/page.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/timing/page.tsx) + [`app/timing/TimingSetupPage.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/timing/TimingSetupPage.tsx): Timing Setup route. Owns clear time, full street time, and tolerance without modal interaction.
- [`app/calibration/page.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/calibration/page.tsx) + [`app/calibration/CalibrationPage.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/calibration/CalibrationPage.tsx): Calibration route. Owns sound choice, cue output mode, and visual cue setup, including descriptive sound options and preview actions.
- [`app/exemplars/page.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/exemplars/page.tsx) + [`app/exemplars/ExemplarsPage.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/exemplars/ExemplarsPage.tsx): Exemplar playback route. Keeps example timing separate from calibration.
- [`app/preferences/page.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/preferences/page.tsx) + [`app/preferences/PreferencesPage.tsx`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/app/preferences/PreferencesPage.tsx): Preferences route. Owns app-wide theme and accessibility toggles while leaving text sizing to device and browser accessibility settings.
- [`components/`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/components): Shared render-only UI pieces such as task navigation, cue banner, visual cue surface, and the large practice button.
- [`hooks/`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/hooks): Shared hook owners for audio readiness, speech, route focus, persistence, cue playback, and practice session state.
- [`lib/`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/lib): Pure TypeScript helpers for timing, replay planning, labels, storage, defaults, and cue pattern definitions.
- [`lib/web-audio-tone.ts`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/lib/web-audio-tone.ts): Low-level Web Audio tone scheduling helper used by browser cue playback hooks.
- [`public/legacy-prototype.html`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/public/legacy-prototype.html): Preserved browser-served copy of the legacy prototype for side-by-side comparison while the rebuild is in progress.
- [`index.html`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/index.html): Legacy prototype source baseline kept in repo root as the behavior reference.
- [`RESEARCH.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/RESEARCH.md): Legacy research notes captured during prototype development.
- [`docs/README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/README.md): Docs index for this repo.
- [`docs/NEXTJS_REBUILD_PLAN.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_REBUILD_PLAN.md): Approved rebuild plan and task-first route structure.
- [`docs/NEXTJS_CODE_STRUCTURE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_CODE_STRUCTURE.md): TypeScript App Router structure rules for this repo.
- [`docs/RESPONSIBILITY_FIRST_PLACEMENT.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/RESPONSIBILITY_FIRST_PLACEMENT.md): Fast ownership test before editing or creating a file.
- [`docs/BEADS_WORKFLOW.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_WORKFLOW.md): Required bead lifecycle.
- [`docs/BEADS_QUICKREF.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_QUICKREF.md): Short bead command reference for this repo.
- [`docs/BEADS_ISSUE_TEMPLATE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_ISSUE_TEMPLATE.md): Template guidance for creating and refining Streets beads.
- [`docs/VEXP_WORKFLOW.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/VEXP_WORKFLOW.md): Repo-specific `vexp` usage guidance, including the current bootstrap-phase limitations.
- [`docs/SCRIPTS_GUIDE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/SCRIPTS_GUIDE.md): Local script usage for commit preflight and repo guards.
- [`scripts/commit-preflight.mjs`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/scripts/commit-preflight.mjs): Agent-facing preflight report for staged commit blockers.
- [`scripts/check-readme-update.mjs`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/scripts/check-readme-update.mjs): README update reminder guard for repo-shape changes.
- [`scripts/check-docs-readme-update.mjs`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/scripts/check-docs-readme-update.mjs): Docs index reminder guard for `docs/` changes.
- [`scripts/check-structure.mjs`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/scripts/check-structure.mjs): Staged-file structure guard for the machine-checkable parts of the TypeScript Next.js structure rules.
- [`scripts/run-biome-staged.mjs`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/scripts/run-biome-staged.mjs): Pre-commit Biome helper that formats and lints the staged snapshot, then re-stages the changes.
- [`scripts/run-gitleaks-staged.ps1`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/scripts/run-gitleaks-staged.ps1): Pre-commit secret scan helper that exports the current Git index snapshot and scans it with the repo-pinned Gitleaks config.
- [`biome.json`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/biome.json): Repo formatter and linter config for Streets.
- [`.gitleaks-strict.toml`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/.gitleaks-strict.toml): Repo secret scanning rules for staged snapshot scans.
- [`.beads/hooks/pre-commit`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/.beads/hooks/pre-commit): Repo pre-commit hook. It runs the Beads hook first, then runs the README guard, docs README guard, and structure guard when Node is available.
- [`package.json`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/package.json): Repo scripts and app package manifest for Next.js, React, TypeScript, Biome, and Vitest.

## Current State

- The task-first Next.js App Router source tree now exists under `app/`, `components/`, `hooks/`, `lib/`, `styles/`, and `public/`.
- The rebuild is mobile-first and avoids modal settings flows for timing, calibration, exemplars, and preferences.
- The legacy prototype remains available in parallel at [`public/legacy-prototype.html`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/public/legacy-prototype.html) for comparison.
- `vexp` is configured and now has meaningful indexed app code for the rebuild.
- The repo now has both manual and automatic guardrails:
  - `npm run commit:preflight` for the combined report
  - `.beads/hooks/pre-commit` for Biome, README, docs README, structure, and secret checks before commit

## Canonical Docs

- [`AGENTS.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/AGENTS.md): Repo operating rules
- [`docs/README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/README.md): Docs index
- [`docs/NEXTJS_REBUILD_PLAN.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_REBUILD_PLAN.md): Product and migration plan
- [`docs/NEXTJS_CODE_STRUCTURE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_CODE_STRUCTURE.md): File placement and layering rules
- [`docs/RESPONSIBILITY_FIRST_PLACEMENT.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/RESPONSIBILITY_FIRST_PLACEMENT.md): Pre-edit ownership test
- [`docs/SCRIPTS_GUIDE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/SCRIPTS_GUIDE.md): Repo script usage

## README Maintenance Rules

Update this README in the same change when any of these happen:

- A shared repo file is added, removed, renamed, or given a different responsibility
- The Next.js source tree is added or reorganized in a way another agent will need to understand quickly
- The legacy prototype changes role, location, or replacement status
- Repo scripts or workflow guards change
- The docs set changes enough that the ownership map or pointer list would be outdated

### How To Write Entries

- Keep it factual. Document what exists now, not planned future structure.
- Prefer short entries that explain what a file does, when to use it, and any important ownership boundary.
- Update the relevant existing section instead of leaving stale file names behind.
