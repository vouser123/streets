# Beads Workflow

Canonical bead lifecycle for Streets.

Use this file for the required order of operations when working in this repo.
Use [`BEADS_QUICKREF.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_QUICKREF.md) for the short command reference.

## Why This Matters

Beads are the durable workflow record for Streets. Chat context is not durable enough to carry active work across sessions.

If a bead is not claimed, updated, or closed correctly:

- another agent can repeat the same work
- discovered follow-up can be lost
- the repo can look idle even when meaningful work already happened

## Repo-Specific Notes

- Streets bead IDs currently use the `om-` prefix.
- Use Beads for all implementation, migration, setup, and verification tracking in this repo.
- Do not use markdown task lists or ad hoc TODO files as a replacement for Beads.

## Required Lifecycle

1. Identify the bead you are working.
2. Claim it before doing scoped work.
3. Do the scoped work.
4. Add notes while the bead remains open.
5. Create discovered follow-up beads immediately when new scoped work appears.
6. Close the bead when its scoped work is complete.
7. Include the bead ID in the commit message for related code changes.

```bash
bd update <id> --claim
# ...do work...
bd note <id> "Short progress or verification note"
# if new scoped work is discovered:
bd create --title="..." --description="..." --type=task --priority=2
# when the scoped work is complete:
bd close <id> --reason "Completed"
git commit -m "Describe the change (<id>)"
```

## Hard Rules

- Claim the bead before writing code or running scoped verification.
- Close completed beads before the related commit whenever practical.
- If a bead stays open, leave a clear note describing the exact remaining scope.
- Create separate beads for discovered follow-up instead of quietly expanding the current bead.
- Do not assume a commit closes a bead automatically.

## Type Guidance

- `feature`: additive user-facing or architectural capability
- `task`: implementation slice, setup, refactor, or investigation
- `bug`: broken behavior or regression that needs repair
- `chore`: low-risk maintenance work
- `epic`: parent container for related child beads

## Session Close Reminder

Before ending a work session:

1. Review claimed or in-progress beads.
2. Close completed ones.
3. Add notes to any bead staying open.
4. Commit.
5. Push git changes.
6. Run `bd dolt push`.

Work is not complete until both the git and Beads state are pushed.
