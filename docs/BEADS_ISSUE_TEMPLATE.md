# Beads Issue Template

Use this guide when creating or rewriting a Streets bead.

## What A Good Streets Bead Includes

- A clear title
- Why the work exists
- What should be changed, verified, or produced
- The correct type
- A realistic priority
- Dependencies when the work must wait on another bead

## Recommended Structure

### Title

Keep it short and action-oriented.

Good:

- `Scaffold Next.js TypeScript app shell and route structure`
- `Port browser media and persistence hooks into Streets`
- `Implement practice route replay evaluation`

Avoid vague titles like:

- `Fix app`
- `Work on Streets`
- `Next.js changes`

### Description

Use two parts:

1. Why this work exists
2. What the bead should accomplish

Template:

```text
Why: <why this work matters>
What: <what should be implemented, changed, or verified>
```

### Type Guidance

- `feature` for a meaningful new capability or migration stream
- `task` for an implementation slice, setup, or investigation
- `bug` for a defect or regression
- `chore` for lower-risk maintenance
- `epic` for a parent container

### Priority Guidance

- `0` critical blocker
- `1` important near-term work
- `2` normal planned work
- `3` lower-priority follow-up
- `4` backlog

## Example

```bash
bd create --title="Implement calibration route and cue preview controls" --description="Why: calibration is a distinct task area in the new information architecture and should not stay mixed with exemplars or preferences. What: add the calibration route, cue selection controls, and preview interactions backed by the shared browser media hooks." --type=task --priority=1
```
