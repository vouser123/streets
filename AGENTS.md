# Agent Instructions

This file governs agent behavior for work in this repo.

## Canonical References

- `docs/README.md` - docs index; open this first to decide which repo doc is relevant
- `README.md` - live repo map and file ownership
- `docs/NEXTJS_REBUILD_PLAN.md` - approved rebuild scope and product structure
- `docs/NEXTJS_CODE_STRUCTURE.md` - open when editing file placement, layering, or split boundaries
- `docs/RESPONSIBILITY_FIRST_PLACEMENT.md` - open when deciding whether an edit belongs in the current file or should move to a new/shared file
- `docs/AGENT_PLAYBOOK.md` - longer workflow detail; open when the short rule in AGENTS is not enough
- `docs/IMPLEMENTATION_PATTERNS.md` - open when you need the approved shared pattern for a change
- `docs/TESTING_CHECKLISTS.md` - open when validating behavior changes
- `docs/STRUCTURE_REVIEW_ESCALATION.md` - open when a structure-related guard fires for a specific file
- `docs/SCRIPTS_GUIDE.md` - open when you need the current usage for local helper scripts such as commit preflight or structure checks
- `docs/VEXP_WORKFLOW.md` - open when you need the Streets-specific `vexp` workflow and the current bootstrap-phase limitations
- `docs/BEADS_WORKFLOW.md` - open for the required bead lifecycle
- `docs/BEADS_ISSUE_TEMPLATE.md` - open when creating or reshaping a bead

## Pre-Coding Layer Check

Before writing any code to an existing file, ask:

1. What layer does this belong in?
2. Does the change belong in this file, a different file, or a new file?

Apply the responsibility-first placement test before writing code, not after a guard script fails.

## Structure Guard Escalation

If a structure-related guard fires for a specific file, pause work on that file and use the escalation workflow in `docs/STRUCTURE_REVIEW_ESCALATION.md`.

## README And Docs Discipline

- Update `README.md` in the same change whenever repo structure, ownership, or shared scripts change in a way another agent would need to know.
- Update `docs/README.md` in the same change whenever active docs are added, removed, renamed, or repurposed.
- If guidance conflicts within this repo, `AGENTS.md` is the operational source of truth.

## Non-Interactive Shell Commands

**ALWAYS use non-interactive flags** with file operations to avoid hanging on confirmation prompts.

Shell commands like `cp`, `mv`, and `rm` may be aliased to include `-i` (interactive) mode on some systems, causing the agent to hang indefinitely waiting for y/n input.

**Use these forms instead:**
```bash
# Force overwrite without prompting
cp -f source dest           # NOT: cp source dest
mv -f source dest           # NOT: mv source dest
rm -f file                  # NOT: rm file

# For recursive operations
rm -rf directory            # NOT: rm -r directory
cp -rf source dest          # NOT: cp -r source dest
```

**Other commands that may prompt:**
- `scp` - use `-o BatchMode=yes` for non-interactive
- `ssh` - use `-o BatchMode=yes` to fail instead of prompting
- `apt-get` - use `-y` flag
- `brew` - use `HOMEBREW_NO_AUTO_UPDATE=1` env var

## Commit Preflight

Before retrying a failed commit, run:

`npm run commit:preflight -- --message "Your title (om-xxxx)" --trailer "Co-Authored-By: Agent Name <recognized-agent-email>"`

Use at least one Streets Beads ID in the commit title. Recognized agent emails for the trailer are `codex@openai.com` and `noreply@anthropic.com`. If no agent attribution should be recorded for that commit, use the one-time `STREETS_AI_TRAILER_OK` override instead.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->

## vexp

`vexp` is configured in this repo, but the current source tree is still being created.

- During the current bootstrap phase, sparse `vexp` results are expected because there are not yet many source files to index.
- Use `docs/VEXP_WORKFLOW.md` for the repo-specific rules and bootstrap-phase fallback guidance.
- Once the Next.js app tree exists, prefer `vexp` for code search and impact analysis before broad raw reads.
