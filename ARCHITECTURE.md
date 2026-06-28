# English Loot Architecture Lock

This document freezes the current production architecture direction for English Loot. Future work should keep the current source structure and migrate learning behavior gradually, one flow at a time.

## Core Decision

Keep the current structure for now.

Do not:

- Redesign UI.
- Move the whole project folder structure in one large refactor.
- Add libraries without approval.
- Change learning data or JSON schemas without approval.
- Refactor pages unless needed for small import cleanup.
- Create a large `engine.js` or `learningEngine.js` God file.

If `engine.js` or `learningEngine.js` is created later, it must be a small Facade only. Real logic must stay in focused modules.

## Source Layers

### `src/components`

UI components only.

Components may:

- Render UI.
- Receive props.
- Emit UI events through callbacks.

Components must not own:

- Learning algorithms.
- Scoring logic.
- Mastery math.
- Mistake taxonomy.
- Weighted selection.
- Progress storage implementation.
- Direct learning-progress `localStorage` access.

Current note:

- `src/components/AppLayout.jsx` directly uses `localStorage` for a sidebar collapsed UI preference. This is not learning progress storage, but future cleanup can move UI preferences behind a tiny preference adapter if desired.

### `src/pages`

Page-level UI and interaction only.

Pages may:

- Hold form state.
- Hold selected item state.
- Render route-level layouts.
- Call learning helpers or Facade functions.
- Call infrastructure/storage functions for persistence until a flow is migrated behind a Facade.

Pages must not own:

- Scoring algorithms.
- Mastery math.
- Spaced review decisions.
- Mistake taxonomy.
- Storage implementation details.
- Weighted item selection logic.

### `src/data`

Static learning content only.

Data files must not contain:

- Progress state.
- Functions.
- Runtime user data.
- Copied official or copyrighted test content.

### `src/utils/learning`

This is the current Learning Engine layer.

It contains focused learning logic modules:

- `itemKeys.js`
- `mastery.js`
- `selectors.js`
- `events.js`
- `scoringStrategies.js`
- `mistakeTaxonomy.js`
- Future `scheduler.js` if needed.

Rules:

- Keep helpers small and focused.
- Prefer pure functions.
- Do not merge all logic into one huge module.
- Add generic helpers gradually while preserving existing Word Loot behavior.

### `src/infrastructure`

Persistence and adapter layer.

Current file:

- `storageRepository.js`

Rules:

- Wrap or coordinate safe persistence helpers.
- Keep direct learning-progress storage access behind storage helpers or repository functions.
- Do not put learning algorithms here.

### `src/lib`

Compatibility exports only.

Rules:

- Do not add new business logic here.
- Existing imports may continue working.
- New code should prefer `src/utils/learning` for learning logic and `src/infrastructure` for persistence adapters.

## Production Direction

The intended flow is:

```text
UI pages/components
  -> learning helpers or thin Facade
  -> focused algorithm modules
  -> storageRepository
  -> safe storage helpers
```

Static content stays in `src/data`.

## Facade Rule

A future `engine.js` or `learningEngine.js` may coordinate a flow, but only as a small Facade.

Allowed Facade responsibilities:

- Accept UI input.
- Call scoring helpers.
- Call mastery helpers.
- Build event payloads.
- Call `storageRepository`.
- Return a small result object to the page.

Not allowed:

- Contain all scoring algorithms.
- Contain all mastery math.
- Contain all selectors.
- Contain all storage logic.
- Become the only place where learning behavior lives.

## Migration Rule

Move one flow at a time.

Recommended order:

1. Word Loot remains stable.
2. Listen & Type uses shared scoring and mastery helpers.
3. Real Talk can later use shared multiple-choice scoring.
4. Gamer Comms can later use shared multiple-choice scoring and gamer taxonomy.
5. Boss Test can later emit events and update mastery.
6. Daily Loot can later use due/weak selectors.

Each migration should preserve current UI and route behavior unless the user explicitly approves a behavior change.

## Import Rules

Use these preferred import directions:

- UI components import other UI components and plain helpers only when needed.
- Pages may import from `src/utils/learning` and `src/infrastructure`.
- Learning helpers must not import React.
- Learning helpers should not access `window` or `localStorage`.
- Infrastructure may import storage helpers.
- `src/lib` should re-export compatibility APIs, not create new business logic.

## Direct Storage Audit

Current page-level direct `localStorage` usage:

- None found in `src/pages`.

Current direct `localStorage` usage:

- `src/utils/storage.js`: allowed storage helper layer.
- `src/components/AppLayout.jsx`: existing sidebar collapsed UI preference. This should not be copied as a pattern for learning progress storage.
