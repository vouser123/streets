# Beads Operations

Detailed Beads command and usage notes for Streets.

Use [`BEADS_WORKFLOW.md`](C:/Users/cindi/OneDrive/Documents/GitHub/streets/docs/BEADS_WORKFLOW.md) for lifecycle rules and required order of operations.
Use this file for the longer command reference and the generated quick reference source.

Repo note: Streets bead IDs currently use the `om-` prefix.

<!-- QUICKREF:BEGIN -->
### Core Commands

```bash
bd ready
bd show <id>
bd update <id> --claim
bd note <id> "Progress note"
bd close <id> --reason "Completed"
bd list --status=open
bd list --status=in_progress
bd dolt push
```
<!-- QUICKREF:END -->

<!-- QUICKREF:BEGIN -->
### Safe Creation Patterns

```bash
bd create --title="Short title" --description="Why this work exists and what it should do" --type=task --priority=2
bd create --title="Follow-up title" --description="New scoped work discovered during another bead" --type=task --priority=2
```
<!-- QUICKREF:END -->

<!-- QUICKREF:BEGIN -->
### Safe Update Patterns

```bash
bd update <id> --title="Updated title"
bd update <id> --description="Updated description"
bd update <id> --claim
bd note <id> "What changed, what was checked, or what remains"
```
<!-- QUICKREF:END -->

<!-- QUICKREF:BEGIN -->
### Dependency Patterns

Use dependency links when one bead should wait for another.

```bash
bd dep add <issue-id> <depends-on-id>
```

Examples:

```bash
bd dep add om-xbj om-ndj
bd dep add om-1dp om-d27
```
<!-- QUICKREF:END -->

## Practical Rules

- Use `bd update`, not `bd edit`.
- Claim the bead before doing the work.
- If the bead remains open, add a note with the exact remaining scope.
- Close the bead when its own scope is done, even if the parent bead is still open.
- Push Beads state with `bd dolt push` before ending the session.
