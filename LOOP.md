# English Loot Simple Pipeline

Use this pipeline for English Loot work.

Do not overcomplicate the loop.
Stop and wait after reporting.

## Stage 1: Understand

- Read the user request.
- Read relevant project files.
- Identify the real goal.
- If the request is unclear, ask before coding.

## Stage 2: Plan

- Make a short plan.
- List files that may change.
- List the expected result.
- Keep the plan practical and short.

## Stage 3: Build

- Implement the approved request.
- Fix the root cause, not only the visible symptom.
- If a bug comes from a shared component, fix the shared component.
- Do not redesign unrelated UI.
- Do not change unrelated logic.

## Stage 4: Check

- Run `npm run build` when code changes.
- If it is a UI change, tell the user what to check in the browser.

## Stage 5: Report

- Report changed files.
- Report what changed.
- Report build result.
- Report any remaining risk.
- Give 2 or 3 next-step options.
- Stop and wait.

## Approval Rules

Do not ask for approval for tiny obvious fixes inside the approved request.

Ask for approval before:
- Adding a library.
- Changing architecture.
- Changing data structure.
- Redesigning UI.
- Adding backend.
- Adding login.
- Touching unrelated features.

## Hard Restrictions

- No backend unless approved.
- No login unless approved.
- No database unless approved.
- No new UI library unless approved.
- No redesign unless approved.
- Preserve the approved English Loot UI direction.

## Output Format After Work

```md
Step Completed

Short summary.

Changed Files

List changed files.

Verification

Command run and result.

What To Check

What the user should check.

Next Step Options

1. Continue with the next natural step.
2. Polish or test the current step.
3. Stop for review or custom feedback.
```
