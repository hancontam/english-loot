# English Loot Loop Protocol

This file defines the required human-in-the-loop workflow for English Loot.

The agent must stop after every loop.
The agent must not continue without user approval.

## 1. Plan

Before coding, the agent must:
- Read `AGENTS.md`, `ROADMAP.md`, and `LOOP.md`.
- Read the relevant source files.
- Identify the current state.
- Select only one roadmap loop or one approved substep.
- List files that may change.
- List risks.
- List acceptance criteria.

The agent must not code during the planning stage.

## 2. Approve

After planning, the agent must stop and ask the user to approve the plan.

The agent must not implement until the user approves.

## 3. Act

After approval, the agent may implement only the approved scope.

Rules:
- Do not add extra features.
- Do not redesign unrelated UI.
- Do not edit unrelated files.
- Do not change data structures unless the approved loop requires it.
- Do not move to another roadmap item.

## 4. Verify

After acting, the agent must run relevant checks.

Minimum verification:
- `npm run build`

For UI changes:
- Tell the user what to check visually in the browser.
- Use the in-app browser for a smoke check when appropriate.

## 5. Report

The agent must report:
- Changed files.
- What was implemented.
- Verification result.
- Any limitation or known issue.

## 6. Options

The agent must give exactly three next-step options:

1. Continue with the next natural substep.
2. Improve, test, or polish the current step.
3. Stop for manual review or accept custom feedback.

## 7. Wait

After giving options, the agent must stop and wait.

The agent must not continue automatically.

## Required Output Format

```md
### Step Completed

Shortly state what was completed.

### Changed Files

List only files that changed.

### Verification

State what command was run and result.
If not run, explain why.

### What To Check

Tell the user what to check in the browser or code.

### Next Step Options

1. Continue with the next natural substep.
2. Improve, test, or polish the current step.
3. Stop for manual review or accept custom feedback.
```
