# Streets Docs

Use this file as the docs index for the Streets rebuild.

These docs are for implementation and maintenance workflow inside this repo. They are not user-facing product documentation.

## Active Docs

- [`NEXTJS_REBUILD_PLAN.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_REBUILD_PLAN.md)
  - Open when: you need the approved rebuild scope and product structure.
  - Answers: "What are we building and how is the app organized?"
- [`NEXTJS_CODE_STRUCTURE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_CODE_STRUCTURE.md)
  - Open when: you are adding, splitting, or reorganizing Next.js files.
  - Answers: "How should TypeScript Next.js code be structured in this repo?"
- [`RESPONSIBILITY_FIRST_PLACEMENT.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/RESPONSIBILITY_FIRST_PLACEMENT.md)
  - Open when: you need the fast ownership test before editing a file.
  - Answers: "Is this the right owner for this change?"
- [`AGENT_PLAYBOOK.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/AGENT_PLAYBOOK.md)
  - Open when: you need the longer workflow detail behind `AGENTS.md`.
  - Answers: "What is the detailed startup and layer-check workflow for this repo?"
- [`IMPLEMENTATION_PATTERNS.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/IMPLEMENTATION_PATTERNS.md)
  - Open when: you need the approved shared pattern for how to build a Streets feature.
  - Answers: "Which shared pattern should I use here?"
- [`TESTING_CHECKLISTS.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/TESTING_CHECKLISTS.md)
  - Open when: you are validating a behavior change or migration slice.
  - Answers: "How should I verify this safely?"
- [`STRUCTURE_REVIEW_ESCALATION.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/STRUCTURE_REVIEW_ESCALATION.md)
  - Open when: a structure-related guard fires and the file needs a focused ownership review.
  - Answers: "How should a structure warning be escalated in this repo?"
- [`BEADS_WORKFLOW.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_WORKFLOW.md)
  - Open when: you need the required bead lifecycle and closure order for this repo.
  - Answers: "What order should I use for claiming, updating, and closing Streets beads?"
- [`BEADS_QUICKREF.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_QUICKREF.md)
  - Open when: you need the short command reference and repo-specific bead notes.
  - Answers: "What are the fast `bd` commands and repo conventions here?"
- [`BEADS_OPERATIONS.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_OPERATIONS.md)
  - Open when: you need the longer Beads command reference or the source doc for the generated quickref.
  - Answers: "What are the Beads command patterns and how is the quick reference generated?"
- [`BEADS_ISSUE_TEMPLATE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_ISSUE_TEMPLATE.md)
  - Open when: you are creating or reshaping a bead.
  - Answers: "What should a good Streets bead include?"
- [`VEXP_WORKFLOW.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/VEXP_WORKFLOW.md)
  - Open when: you are using `vexp` for code search, impact analysis, or saved observations.
  - Answers: "How should `vexp` be used in this repo, especially while the codebase is still being scaffolded?"
- [`SCRIPTS_GUIDE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/SCRIPTS_GUIDE.md)
  - Open when: you need the current usage for commit preflight or repo guard scripts.
  - Answers: "How do I run the Streets repo scripts and what do they check?"

## Notes

- The TypeScript Next.js structure rules in this repo are adapted from the `pttracker` docs and translated to `.ts` and `.tsx` conventions.
- The current legacy prototype remains in [`index.html`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/index.html) until the Next.js rebuild fully replaces it.
- Streets bead IDs currently use the `om-` prefix.
- `vexp` is configured in this repo, but until the Next.js source tree exists there may be little or no indexed code to search.
