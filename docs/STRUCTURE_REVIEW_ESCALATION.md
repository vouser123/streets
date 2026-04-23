# Structure Review Escalation

Use this doc when a structure-related guard fires for a specific file and the agent must pause implementation work for a focused structure review.

Use [`../README.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/README.md) for the live repo map.
Use [`NEXTJS_CODE_STRUCTURE.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/NEXTJS_CODE_STRUCTURE.md) for the repo's layer and split rules.
Use [`RESPONSIBILITY_FIRST_PLACEMENT.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/RESPONSIBILITY_FIRST_PLACEMENT.md) for the short ownership test.

## Purpose

This workflow exists to force a clean ownership review before more edits continue on the triggered file.

- The parent agent handles the trigger and the handoff.
- The bead stores the task record and operational context.
- The review should stay focused on ownership and maintainability, not on forcing a file under a cap.

## Parent-Agent Rule

When a structure-related guard fires for a specific file:

1. Pause work on that file.
2. Create or update a bead that names the target file and the reason review is needed.
3. Do not keep editing the target file until the structure review is complete.
4. Resume only after deciding whether the file should be split, left intact, or escalated for a human decision.

## Review Questions

1. What responsibilities does the target file currently own?
2. Do any of those responsibilities belong in a different layer or separate file?
3. What should remain in the original file?
4. If no meaningful extraction is justified, is the file structurally sound as-is?

## Output Expectations

Record the review in the bead with:

- responsibilities identified
- recommended extractions or divisions, if any
- what should remain in the original file
- keep-together notes, if any
- open questions, if any

## Streets-Specific Reminder

Because Streets is still being scaffolded, a structure warning may mean one of two things:

- the file is actually mixing concerns
- the repo needs a new shared owner because the concern is appearing for the first time

Do not solve that ambiguity by adding more code to the already-questionable file.
