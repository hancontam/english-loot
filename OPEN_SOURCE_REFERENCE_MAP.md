# English Loot Open Source Reference Map

This document records open-source references that can guide English Loot architecture and learning behavior. These projects are references only. Do not clone, copy code, copy data, or add dependencies from them unless the license and implementation plan are reviewed and approved first.

## Purpose

English Loot should become a useful learning app, not only a random quiz app. Open-source learning tools can reduce guesswork around review history, spaced repetition, local-first practice, and learning data structure.

The current direction stays unchanged:

- No backend.
- No login.
- No database.
- No new libraries unless approved.
- Static JSON content.
- localStorage through storage helpers.
- TOEIC-style curated vocabulary, not official TOEIC or ETS vocabulary.

## Approved Reference Repos

### 1. Anki

Source: https://github.com/ankitects/anki

Useful for:

- Deck, card, note, and review-session mental model.
- Review history ideas: each answer becomes a learning event.
- Spaced repetition behavior: easy, hard, due, interval, and review queue concepts.
- Separating content from review state.

Do not copy:

- Code.
- Scheduler implementation.
- Database schema.
- Card templates.
- UI patterns.
- Add-on architecture.
- Documentation text.

English Loot direction:

- Treat each learnable item as a card-like item with its own mastery state.
- Store review history in `activityLog`.
- Keep static content in `src/data`.
- Keep user progress separate in localStorage.

### 2. Open Spaced Repetition / FSRS

Source: https://github.com/open-spaced-repetition

Useful for:

- Scheduling concepts such as difficulty, stability, retrievability, interval, and review outcomes.
- Future algorithm direction if English Loot outgrows the simple scheduler.
- Vocabulary for learning-engine design.

Do not copy:

- FSRS code.
- Parameters.
- Algorithm implementation.
- Any package or dependency without approval.

English Loot direction:

- Phase 1 should stay simple and local.
- Use a beginner-friendly mastery score first.
- Keep the data model flexible enough to later map mastery fields to FSRS-like fields if approved.

### 3. awesome-fsrs

Source: https://github.com/open-spaced-repetition/awesome-fsrs

Useful for:

- Finding future FSRS libraries, examples, and language ports.
- Comparing implementation options if English Loot needs a stronger scheduler later.
- Understanding the ecosystem before adding a dependency.

Do not copy:

- Example code.
- Library choices without review.
- Third-party data.
- Any implementation before license and maintenance are checked.

English Loot direction:

- Do not add FSRS now.
- Use this only as a future research index.
- Keep the current scheduler small until real usage shows the simple model is not enough.

### 4. Skola

Source: https://github.com/h16nning/skola

Useful for:

- Local-first flashcard PWA reference.
- Lightweight practice flow ideas.
- Offline-friendly learning UX.
- Keeping practice focused and simple.

Do not copy:

- UI.
- Code.
- Assets.
- Data model.
- App structure.

English Loot direction:

- Keep practice flows short and calm.
- Keep localStorage reliable.
- Prefer small, fast interactions over heavy feature screens.

## What Must Not Be Copied

Do not copy from any referenced project:

- Source code.
- UI design.
- Assets.
- Database schema.
- Card templates.
- Example datasets.
- Documentation text.
- Scheduler implementation.
- Algorithms or parameters without explicit review.
- Dependencies without approval.

References are allowed only for architecture decisions, terminology, and implementation direction.

## Recommended English Loot Source Structure

Keep the app source clear and small:

```text
src/
  data/
    words.json
    phrases.json
    gamerTerms.json
    listeningItems.json
    videos.json
  utils/
    storage.js
    learning/
      itemKeys.js
      mastery.js
      scheduler.js
      selectors.js
      mistakeTaxonomy.js
      scoringStrategies.js
      events.js
  pages/
    WordLootPage.jsx
    ListenTypePage.jsx
    DailyLootPage.jsx
```

Implementation guidance:

- `src/data` stores content only.
- `storage.js` stays the localStorage repository layer.
- Learning math should move into pure helper functions.
- Pages should call helpers and render UI, not own the learning algorithm.
- Add `src/utils/learning` only when implementation starts. Do not create it only for planning.

## Current Project Fit

The current storage foundation already supports learning-engine fields:

- `schemaVersion`
- `itemMastery`
- `activityLog`
- `dailyStats`

The current Word Loot implementation can be improved by moving selection and mastery math out of `WordLootPage.jsx` into pure helpers later. This matches the reference direction without needing external code.

## Recommended Implementation Order

### Phase 1: Word Loot data, 50 clean TOEIC-style words

Goal:

- Use 50 clean TOEIC-style curated words.
- Keep the existing `words.json` schema.
- Keep Vietnamese meanings and translations with proper accents.
- Avoid duplicate words and rare academic terms.

Reference influence:

- Anki: content is separate from review progress.
- Skola: keep the first vertical slice small and usable.

### Phase 2: Word Loot mastery only

Goal:

- Track item-level mastery for Word Loot.
- Keep old `knownWords` and `hardWords` compatibility.
- Known increases mastery.
- Hard decreases mastery.
- Store review events in `activityLog`.

Reference influence:

- Anki: every answer should be review history.
- FSRS: mastery fields should be flexible enough for future scheduling improvements.

### Phase 3: Weak/due selector for Word Loot

Goal:

- Prefer weak, hard, new, or due words.
- Avoid pure random selection.
- Keep the algorithm simple and explainable.

Reference influence:

- Anki: review queues should care about due items.
- FSRS: future scheduler can replace the simple due calculation later.

### Phase 4: Mistake taxonomy for Word Loot and Listen & Type

Goal:

- Classify mistakes instead of only storing raw wrong answers.
- Start with a small taxonomy:
  - vocabulary meaning
  - spelling
  - listening misheard word
  - reduced speech
  - grammar pattern
  - distractor/trap confusion

Reference influence:

- Anki: review history shows what happened.
- Learning Engine plan: mistakes should affect future practice.

### Phase 5: Daily Loot uses due/weak items

Goal:

- Generate Daily Loot from learning signals.
- Mix new items with weak and due items.
- Keep daily workload small.

Reference influence:

- Anki: review queue and due items.
- Skola: lightweight local-first daily practice.

## Coding Rules

- Keep pages thin.
- Put learning math in pure helper functions.
- Keep storage behind storage helpers.
- Keep localStorage backward compatible.
- Sanitize malformed localStorage data.
- Do not change JSON schema unless approved.
- Do not add libraries unless approved.
- Do not copy open-source code.
- Build after each code or data change with `npm run build`.
- Documentation-only changes do not require a build unless requested.

## Risk Notes

- A simple scheduler may feel too basic after more real usage.
- localStorage can be cleared by the browser, so progress is not permanent across devices.
- Future FSRS-style scheduling needs careful license, package, and UX review.
- Moving learning math out of pages should be done gradually to avoid breaking the current MVP.
