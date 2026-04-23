# Streets vexp Workflow

Use this doc for repo-specific `vexp` workflow guidance that goes beyond the short policy block in [`AGENTS.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/AGENTS.md).

Use [`README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/README.md) to decide when to open this doc.

## Current Repo State

`vexp` is configured in this repo through [`vexp.toml`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/vexp.toml), but the current source tree is still being created. Right now the repo mainly contains:

- the legacy prototype in [`index.html`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/index.html)
- project and workflow docs
- Beads metadata

Practical effect:

- `vexp` may have little or no useful indexed application code until the Next.js source tree exists
- raw file reads are still expected during this bootstrap phase

## Why This Doc Exists

`vexp` and Beads solve different problems:

- Beads track the work
- `vexp` helps with code search, impact analysis, and durable technical observations

Do not substitute one for the other.

## Default Workflow Once App Code Exists

1. Start with `run_pipeline` for code tasks when `vexp` has meaningful source to inspect.
2. Use narrower follow-up tools like skeleton or impact analysis when the next question is specific.
3. Read raw file text only when `vexp` still does not provide enough detail for a safe patch.

## Bootstrap-Phase Rule

Until Streets has real `app/`, `components/`, `hooks/`, and `lib/` code:

- prefer direct file reads
- treat sparse `vexp` output as expected, not as a failure
- keep `vexp` configuration in place so it is ready once the codebase exists

## Suggested Use After Scaffold Lands

`vexp` becomes useful once the TypeScript source tree exists, especially for:

- route ownership questions
- hook and `lib` blast-radius checks
- finding shared practice logic
- saving durable architectural observations during the migration

## Git Rule

If `.vexp/manifest.json` becomes part of the tracked workspace state for this repo, commit it with the related structural change. Do not commit transient local index files such as `.vexp/index.db`.
