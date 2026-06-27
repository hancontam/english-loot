# English Loot Agent Rules

## Project Goal

English Loot is a fun English learning web app for a Vietnamese student developer.

The app combines:
- TOEIC vocabulary.
- Real Talk phrases.
- Gamer and Valorant English.
- Chat abbreviations.
- Reduced speech such as `wanna`, `gonna`, `lemme`, `gimme`, and `how bout you`.
- Listening practice.
- Mistake Book.
- Daily Loot.
- Weekly Boss Test.

## Tech Stack

- React Vite.
- Tailwind CSS.
- React Router.
- Static JSON data.
- localStorage.
- Web Speech API.
- No backend for MVP.
- No login.
- No database.

## Content Source Policy

Use approved sources as references only. Create original English Loot app data inspired by reputable topics, meanings, formats, and learning methods.

Before adding or revising learning data, browse or verify the relevant approved sources when network access is available.

TOEIC source of truth:
- ETS TOEIC Preparation Materials.
- ETS TOEIC Listening & Reading Examinee Handbook.
- IIBC TOEIC Listening & Reading Sample Questions.
- TOEIC Taiwan sample questions.

Use TOEIC sources for:
- Common TOEIC topics.
- TOEIC-style sentence length.
- Question style and trap patterns.
- Listening and reading format awareness.

Do not:
- Copy official TOEIC test questions.
- Reproduce ETS/IIBC/TOEIC sample questions.
- Claim any generated dataset is official ETS vocabulary.
- Label data as `Official TOEIC vocabulary`.

Use this wording instead:
- `TOEIC-style curated vocabulary`.
- `Based on official TOEIC sample topics and reputable learning references`.

TOEIC vocabulary references:
- Barron's 600 Essential Words for the TOEIC.
- Oxford Tactics for TOEIC Listening and Reading Test.

Use these books only for topic and difficulty inspiration. Do not copy full copyrighted word lists or original examples into the app.

Level and dictionary checks:
- Oxford 3000 / Oxford 5000.
- Cambridge Dictionary.

Use these for:
- A1 to B2 level checking.
- Part of speech checks.
- Meaning and pronunciation checks.
- Natural example style.
- Keeping app vocabulary practical for TOEIC and real life English.

Real Talk and chat abbreviations:
- Merriam-Webster common texting abbreviations.
- BBC Learning English.

Use these for common items such as:
- `nvm`
- `brb`
- `btw`
- `idk`
- `tbh`
- `ngl`
- `rn`
- `afk`

Gamer / Valorant English:
- Red Bull Valorant terms glossary.
- Valorant Wiki Terminology.
- Mobalytics Valorant Terms.

Use these for terms such as:
- `rotate`
- `peek`
- `hold`
- `flank`
- `trade`
- `save`
- `eco`
- `full buy`
- `plant`
- `defuse`
- `nt`
- `gg`
- `wp`
- `mb`

Dataset rules:
- Keep existing JSON schemas unchanged unless the user approves a schema change.
- Write original examples, translations, quiz options, and listening sentences.
- Verify meanings and usage before adding items.
- Keep TOEIC content TOEIC-style, not copied from official or copyrighted materials.

## Locked UI Direction

Preserve the approved UI direction.

Style:
- Clean iOS-style dashboard.
- Soft, airy, premium, minimal.
- White and light gray surfaces.
- Large rounded app shell.
- Left sidebar.
- Right content area.
- Subtle borders.
- Almost no shadow.
- No dark mode.
- No cyberpunk.
- No neon.
- No colorful SaaS template.

Typography:
- Use Open Sans.
- Body text: 16px and 14px.
- Body weight: 400 and 500 only.
- Title: 18px, weight 500.
- Do not use huge headings.
- Do not replace Open Sans.

Colors:
- Primary text: `#181818`
- Secondary text: `#6A6A6A`
- Background: `#F7F7F5`
- Card: `#FFFFFF`
- Border: `#ECEAE7`
- Selected item background: `#F1F0ED`

Spacing:
- Use the 4px rule only.
- Allowed values: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`.

Radius:
- Small controls: `8px` or `12px`.
- Cards: `20px` or `24px`.
- Large shell: `32px` or `40px`.
- Pills: `40px`.
- Circular mascot/avatar bubbles may use `40px` radius when the circular shape is intentional.

Icons:
- Use clean SVG icons only.
- 18px icon size.
- 1.5px stroke.
- 24px bound.
- Do not mix icon styles.
- Do not introduce icon libraries unless approved.

Mascot:
- Use assets from `src/assets/Cute_Animal_3D_Icons`.
- Mascot is only for visual accent.
- Use it in hero, reward, streak, or empty state.
- Do not overuse it.

Logo and image rules:
- Sidebar logo/icon size must follow the 4px grid.
- Small logo/icon: `32px` by `32px`.
- Default app logo: `40px` by `40px`.
- Large hero logo or mascot mark: `64px` by `64px`.
- If a logo or brand mark uses an image, it must have consistent width and height, proper rounded corners, no stretching, and `object-fit: contain` or `object-fit: cover` depending on usage.
- All images must have rounded corners unless the user explicitly asks for sharp square corners.
- Small thumbnail radius: `12px`.
- Card image radius: `16px` or `20px`.
- Hero/mascot image container radius: `24px` or `32px`.
- Full large visual inside app shell radius: `32px`.
- Circular avatar or mascot bubbles are an allowed exception and may use `40px` radius.
- Keep image aspect ratios correct.
- Use `object-fit: contain` for mascot and 3D icons.
- Use `object-fit: cover` for normal card thumbnails only when cropping is acceptable.
- Do not stretch mascot assets.
- Do not distort 3D animal icons.
- If image ratio is unclear, stop and ask before choosing.
- If an asset looks distorted, do not use it; use a placeholder with the correct size and radius instead.

## Hard Restrictions

Do not:
- Add backend.
- Add login.
- Add database.
- Add payment.
- Install new agent tools.
- Clone external vibe coding repos.
- Introduce new UI libraries unless approved.
- Redesign UI unless the user asks.
- Change data structures unless the current loop explicitly requires it.
- Edit unrelated files.
- Implement more than one roadmap item per loop.
- Continue to the next loop without approval.
- Rebuild the app from scratch.

Ask for approval before:
- Adding a library.
- Changing architecture.
- Changing data structure.
- Redesigning UI.
- Adding backend.
- Adding login.
- Touching unrelated features.

Do not ask for approval for tiny obvious fixes inside an already approved request.

Natural language commands are valid.
The user does not need to reply with `1`, `2`, or `3` exactly.

Accept commands such as:
- `continue`
- `go next`
- `approved`
- `do it`
- `build it`
- `looks good, continue`
- `fix it`
- `polish this`
- `stop`
- Custom feedback from the user

When the user says `continue` or `go next`, proceed with the next natural step from the current roadmap or current task.

When the user says `approved`, `do it`, or `build it`, implement the plan that was just proposed.

When the user gives custom feedback, follow the feedback and keep the change inside the current scope.

## Simple Pipeline Workflow

Use this workflow for project work.

### Stage 1: Understand

- Read the user request.
- Read relevant project files.
- Identify the real goal.
- If the request is unclear, ask before coding.

### Stage 2: Plan

- Make a short plan.
- List files that may change.
- List the expected result.
- Keep the plan practical and short.

### Stage 3: Build

- Implement the approved request.
- Fix the root cause, not only the visible symptom.
- If a bug comes from a shared component, fix the shared component.
- Do not redesign unrelated UI.
- Do not change unrelated logic.

### Stage 4: Check

- Run `npm run build` when code changes.
- If it is a UI change, tell the user what to check in the browser.

### Stage 5: Report

- Report changed files.
- Report what changed.
- Report build result.
- Report any remaining risk.
- Give 2 or 3 next-step options.
- Stop and wait.

## Decision Mode

If anything is unclear, stop and ask a specific question before coding. Ask only questions that affect the result.

## Build Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Output Format After Work

Use this format after work:

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

The numbers are suggestions, not mandatory commands. Natural language replies are accepted.
