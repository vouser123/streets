# Streets Agent Playbook

Use this doc when `AGENTS.md` points you here for workflow detail. `AGENTS.md` remains the policy surface; this file holds the longer operational guidance that is only needed when applicable.

Use [`../README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/README.md) for the live repo map.
Use [`README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/README.md) to choose other repo docs.

## Session Start

Recommended startup order:

1. Read [`docs/README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/README.md).
2. Read [`README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/README.md).
3. Run `bd prime`.
4. Open the specific docs needed for the task at hand.

## Pre-Coding Layer Check

Before writing code to an existing file, ask: `What layer does this belong in?`

| Layer | Only contains | Must not contain |
|-------|---------------|------------------|
| `app/**/page.tsx` | Server entry wiring, metadata or viewport, and the handoff to a route client host | Hooks, client state, feature UI, browser APIs |
| `app/**/*Page.tsx` | Route-level client orchestration and shared hook wiring | Mixed business logic, duplicated shaping, large feature workspaces |
| `components/` | JSX and presentation logic; all data arrives via props | Business logic, browser-service orchestration, persistence logic |
| `hooks/` | State and effects for one concern | JSX, unrelated side effects, broad mixed workflows |
| `lib/` | Pure functions for one domain | React imports, hooks, side effects |

Before writing to a route file:

1. Identify what the code does.
2. If it is not pure wiring or orchestration, stop.
3. Move the concern into a component, hook, or `lib` file first.
4. Then wire it into the route host.

## Legacy Comparison Workflow

Use this when a rebuild slice should preserve prototype behavior.

1. Read the current source in this repo.
2. Read the corresponding reference behavior in [`index.html`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/index.html).
3. Compare behavior, not just markup.
4. Record intentional differences in a bead note when they matter.

Focus on:

- options and defaults
- route ownership
- timing and replay semantics
- cue behavior
- accessibility flow

## Beads Detail

For exact lifecycle rules, open [`docs/BEADS_WORKFLOW.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_WORKFLOW.md).

Short version:

- claim the bead before doing real work
- create discovered work immediately when scope expands
- close completed beads promptly
- stage and commit only files you changed
