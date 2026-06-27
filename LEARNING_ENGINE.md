# English Loot Learning Engine

## Current Problem

English Loot already has a useful MVP, but the learning behavior is still mostly page-local:

- Word Loot uses `knownWords` and `hardWords` as simple lists.
- Daily Loot weights known and hard items, but it does not yet understand review due dates, repeated mistakes, weak skill areas, or recent practice quality.
- Real Talk, Gamer Comms, and Listen & Type pick mostly random items.
- Mistake Book stores wrong answers, but mistakes do not yet feed a full mastery model.
- Boss Test gives a score and saves wrong answers, but it does not update item-level mastery.
- `EXP`, `level`, and `streak` exist in storage, but they are not yet based on learning signals.

The goal of the learning engine is to make the app feel like a daily training loop, not a random quiz collection.

## Proposed Architecture

Use a small local-first engine built from plain JavaScript modules. Keep the React pages thin: pages render UI, call engine functions, and save returned progress.

### Required Patterns

Repository Pattern:

- Hide `localStorage` behind a progress repository.
- Pages should not know storage keys or migration details.
- Future module shape:
  - `progressRepository.read()`
  - `progressRepository.write(progress)`
  - `progressRepository.update(updater)`
  - `progressRepository.reset()`

Strategy Pattern:

- Different quiz types need different scoring.
- Use strategy objects/functions by practice mode:
  - `multipleChoiceStrategy`
  - `typedExactStrategy`
  - `listenTypeStrategy`
  - `selfMarkKnownStrategy`
  - `bossTestStrategy`

Event Log Pattern:

- Every meaningful learning action becomes an event.
- The event log becomes the source for streak, EXP, review history, mistake trends, and analytics.
- Store a bounded log in localStorage, for example last `1000` events.

Pure Helper Functions:

- Keep calculations deterministic and easy to test.
- Helpers should not read/write localStorage directly.
- Examples:
  - `calculateMastery(record, event)`
  - `scheduleNextReview(record, event, now)`
  - `classifyMistake(event)`
  - `selectDailyLoot(candidates, progress, date)`
  - `scoreAnswer(strategy, payload)`
  - `applyLearningEvent(progress, event)`

## Data Model

Do not replace current progress immediately. Use an additive migration so old MVP progress still works.

Current storage key:

`englishLootProgress`

Current fields:

```js
{
  streak: 0,
  exp: 0,
  level: 1,
  knownWords: [],
  hardWords: [],
  mistakes: [],
  bossScores: [],
  dailyLootHistory: []
}
```

Proposed additive fields:

```js
{
  schemaVersion: 2,
  streak: 0,
  exp: 0,
  level: 1,
  knownWords: [],
  hardWords: [],
  mistakes: [],
  bossScores: [],
  dailyLootHistory: [],
  itemMastery: {
    "word:w001": {
      domain: "word",
      itemId: "w001",
      mastery: 42,
      exposureCount: 3,
      correctCount: 1,
      wrongCount: 2,
      currentCorrectStreak: 0,
      lastSeenAt: "2026-06-27T10:00:00.000Z",
      nextReviewAt: "2026-06-28T10:00:00.000Z",
      intervalDays: 1,
      ease: 2.2,
      lastResult: "wrong",
      mistakeCategories: ["meaning_confusion"]
    }
  },
  activityLog: [
    {
      id: "event-...",
      createdAt: "2026-06-27T10:00:00.000Z",
      page: "word-loot",
      domain: "word",
      itemId: "w001",
      eventType: "quiz_answered",
      result: "wrong",
      score: 0,
      userAnswer: "prepare",
      targetAnswer: "postpone",
      mistakeCategories: ["trap_word_confusion"]
    }
  ],
  dailyStats: {
    "2026-06-27": {
      events: 12,
      correct: 8,
      wrong: 4,
      expEarned: 36,
      completedLootItems: 9
    }
  }
}
```

Item key format:

```js
`${domain}:${itemId}`
```

Domains:

- `word`
- `phrase`
- `gamer`
- `listening`
- `boss-word`
- `boss-real-talk`
- `boss-gamer-comms`
- `boss-listening`

The static JSON schemas can stay unchanged at first because all current datasets already have stable `id` fields.

## Mastery Score

Each item gets a `mastery` score from `0` to `100`.

Suggested bands:

- `0-19`: new or very weak
- `20-39`: weak
- `40-59`: learning
- `60-79`: familiar
- `80-100`: strong

Initial mastery:

- New item: `20`
- Existing `knownWords`: `70`
- Existing `hardWords`: `25`
- Existing mistakes: lower matching item mastery by `10-20`

Mastery update rules:

| Signal | Change |
| --- | --- |
| Correct first try | `+10` |
| Correct after reveal/retry | `+5` |
| User marks Known | `+8` |
| User marks Hard | `-8` and marks item due soon |
| Wrong multiple choice | `-10` |
| Wrong listening typed answer | `-12` |
| Boss Test correct | `+12` |
| Boss Test wrong | `-15` |
| Repeated same mistake | extra `-5` |

Clamp mastery:

```js
Math.max(0, Math.min(100, nextMastery))
```

Mastery should rise slowly and fall quickly enough that repeated mistakes become visible in Daily Loot.

## Spaced Review Scheduling

Each item should have:

- `lastSeenAt`
- `nextReviewAt`
- `intervalDays`
- `ease`

Simple review algorithm:

```js
if wrong:
  intervalDays = 1
  ease = max(1.3, ease - 0.2)
  nextReviewAt = tomorrow

if correct and mastery < 40:
  intervalDays = 1

if correct and mastery >= 40 && mastery < 60:
  intervalDays = 3

if correct and mastery >= 60 && mastery < 80:
  intervalDays = 7

if correct and mastery >= 80:
  intervalDays = min(30, round(intervalDays * ease))
  ease = min(2.8, ease + 0.05)
```

Hard items:

- Always due within `1` day.
- Do not disappear until the learner answers correctly multiple times.

Known items:

- Still reviewed occasionally.
- Reduced frequency, not removed forever.

## Mistake Taxonomy

Current mistakes have:

- `type`
- `target`
- `userAnswer`
- `sourceId`
- `createdAt`

Add `mistakeCategories` later without breaking old records.

Recommended categories:

Vocabulary:

- `meaning_confusion`: chose the wrong Vietnamese meaning.
- `trap_word_confusion`: confused with similar-looking/sounding word.
- `part_of_speech`: wrong usage class.
- `context_mismatch`: knows word but missed context.

Listening:

- `missing_word`: skipped a word.
- `extra_word`: typed extra word.
- `word_order`: right words, wrong order.
- `reduced_speech`: missed forms like `wanna`, `gonna`, `lemme`.
- `sound_confusion`: heard the wrong sound/word.
- `punctuation_normalization`: harmless punctuation/case difference.

Real Talk:

- `full_form_confusion`: wrong expanded form.
- `meaning_confusion`: wrong meaning.
- `register_confusion`: too formal/informal for context.
- `reduced_speech`: missed casual pronunciation/form.

Gamer Comms:

- `meaning_confusion`: wrong comm meaning.
- `timing_context`: term used at wrong game moment.
- `acronym_confusion`: confused `nt`, `mb`, `wp`, etc.
- `valorant_term_confusion`: confused game-specific term.

Boss Test:

- Use the underlying domain category plus `boss_pressure`.

Mistake records should keep enough text for Mistake Book, but item-level mastery should use `domain` and `itemId` when available.

## Quiz Scoring Strategies

Use Strategy Pattern so each practice type can score fairly.

### Multiple Choice Strategy

Used by:

- Real Talk mini quiz
- Gamer Comms mini quiz
- Boss word/phrase/gamer questions

Result:

```js
{
  isCorrect: answer === target,
  score: isCorrect ? 1 : 0,
  confidence: "normal",
  mistakeCategories: [...]
}
```

### Typed Exact Strategy

Used by:

- Boss typed answers
- Mistake retry

Normalize:

- lower case
- trim
- collapse spaces
- remove punctuation when appropriate

### Listen & Type Strategy

Used by:

- Listen & Type page
- Boss listening questions

Return:

```js
{
  isCorrect,
  score: 0..1,
  wordAccuracy,
  rows,
  mistakeCategories
}
```

Scoring:

- Exact normalized match: `1`
- Mostly correct, minor punctuation/case only: `0.95`
- Word-level accuracy: `correctWords / max(targetWords.length, answerWords.length)`
- Save mistake if score `< 0.9`

### Self-Mark Strategy

Used by:

- Word Loot Known/Hard buttons

Rules:

- `Known` is a positive signal, but weaker than a quiz answer.
- `Hard` is a weakness signal, not a failure.

### Boss Test Strategy

Used by:

- Boss Test

Rules:

- Score visible result as current simple `correct / total`.
- Also emit one learning event per question.
- Boss wrong answers should have higher impact than casual practice wrong answers.

## EXP and Streak Rules

EXP should reward effort and good review behavior, not just clicking.

Suggested EXP:

| Event | EXP |
| --- | --- |
| Reveal item meaning | `+1` max once per item/day |
| Listen to item | `+1` max once per item/day |
| Correct mini quiz | `+5` |
| Correct Listen & Type | `+8` |
| Correct due review | `+8` |
| Mark Known | `+3` |
| Mark Hard | `+2` because it is honest learning |
| Fix previous mistake | `+10` |
| Complete Daily Loot target | `+20` |
| Boss Test submit | `+10` |
| Boss Test >= 80% | extra `+20` |

No EXP farming:

- Same item action should not give repeat EXP forever in the same day.
- Use `activityLog` and `dailyStats` to cap repeated low-signal actions.

Level rule:

```js
level = Math.floor(totalExp / 100) + 1
```

Streak rule:

- A valid streak day requires at least one meaningful learning event:
  - correct quiz
  - listening check
  - mark known/hard
  - mistake retry
  - boss test submit
- Opening the app alone does not count.
- Streak increases when today has a valid event and yesterday had a valid event.
- Streak resets to `1` after a missed day with a new valid event.

## Daily Loot Rules

Daily Loot should combine:

- due reviews
- weak items
- fresh items
- balanced categories
- a small amount of variety

Priority order:

1. Items due today or overdue.
2. Items with recent mistakes.
3. Hard items.
4. Low mastery items.
5. New items.
6. Strong items for occasional maintenance.

Suggested mix:

Words target `10`:

- `4` due/weak
- `3` new or low exposure
- `2` topic-balanced
- `1` strong maintenance

Real Talk target `5`:

- `2` reduced speech or recent mistakes
- `2` new/context practice
- `1` review

Gamer Comms target `5`:

- `2` recent mistakes or low mastery
- `2` match-context terms
- `1` review

Listen & Type target `1`:

- Prefer listening items with due review or listening mistakes.
- If none, pick a reduced speech or work English sentence.

Selection score:

```js
score =
  dueWeight +
  weaknessWeight +
  mistakeWeight +
  noveltyWeight +
  categoryBalanceWeight +
  seededRandomNoise
```

Use seeded randomness by date so today's loot stays stable:

```js
seed = `${dateKey}:${domain}:${userProgressFingerprint}`
```

The fingerprint can be simple at first:

- count of mistakes
- count of mastery records
- count of hard words

This keeps Daily Loot stable enough while still reacting when progress changes meaningfully.

## How Current Pages Should Use the Engine

### Daily Loot

Current:

- Calls `generateDailyLoot()` with static JSON and progress.

Future:

- Calls `learningEngine.generateDailyLoot({ data, progress, date })`.
- Shows selected due/weak/new mix.
- Uses `dailyLootHistory` to mark completion.

### Word Loot

Current:

- Weighted random based on `knownWords` and `hardWords`.
- Known/Hard updates lists.

Future:

- `Known` emits `self_mark_known`.
- `Hard` emits `self_mark_hard`.
- Reveal/listen can emit small learning events.
- Next card should prefer due/weak word items, not purely random.

### Real Talk

Current:

- Random phrase.
- Wrong mini quiz saves mistake.

Future:

- Mini quiz uses `multipleChoiceStrategy`.
- Correct and wrong answers emit learning events.
- Phrase selection uses mastery and review due dates.

### Gamer Comms

Current:

- Random term.
- Wrong mini quiz saves mistake.

Future:

- Same as Real Talk, with gamer-specific mistake categories.
- Selection should prefer weak terms and match-context variety.

### Listen & Type

Current:

- Random sentence.
- Exact normalized comparison.
- Wrong answer saves mistake.

Future:

- Uses `listenTypeStrategy`.
- Saves word-level mistake categories.
- Updates mastery based on partial score.
- Reduced speech mistakes should be tagged clearly.

### Mistake Book

Current:

- Groups mistakes by type.
- Retry checks exact normalized answer.

Future:

- Retry emits `mistake_retry_correct` or `mistake_retry_wrong`.
- Correct retry can reduce mistake severity and increase mastery.
- Mistake Book can show category labels later.

### Boss Test

Current:

- Builds 20 fixed-cycle questions from static JSON.
- Saves boss score.
- Wrong answers go to Mistake Book.

Future:

- Uses `bossTestStrategy`.
- Emits one event per question.
- Updates item mastery strongly.
- Boss question generation should include weak/due items plus mixed categories.

### Video Farm

Current:

- Static filtered resource list.

Future:

- Can recommend topics based on weakness:
  - listening weakness -> listening resources
  - gamer comms weakness -> gaming English resources
  - reduced speech weakness -> Real Talk/BBC resources

## Implementation Phases

### Phase 1: Storage Repository and Migration

- Create `progressRepository`.
- Add `schemaVersion`.
- Add safe migration from current progress to v2.
- Keep old fields for backward compatibility.
- Add `itemMastery`, `activityLog`, and `dailyStats`.

### Phase 2: Pure Engine Helpers

- Add item key helpers.
- Add scoring strategies.
- Add mastery calculation.
- Add spaced review scheduling.
- Add mistake classification.
- Add event application.
- Unit-test helpers with simple input/output cases if test setup exists later.

### Phase 3: Connect Practice Pages

- Word Loot emits known/hard/reveal/listen events.
- Real Talk and Gamer Comms use multiple-choice scoring strategy.
- Listen & Type uses listen-type strategy.
- Mistake Book retry emits events.

### Phase 4: Daily Loot Based on Weakness

- Replace current weighted generator with due/weak/new/maintenance selection.
- Keep same displayed page structure.
- Preserve deterministic daily result.

### Phase 5: EXP, Streak, and Progress Display

- Derive EXP and streak from learning events.
- Update ProgressBadge with real values.
- Add daily caps to prevent farming.

### Phase 6: Boss Test Upgrade

- Generate Boss Test from weak/due/mixed items.
- Apply stronger mastery updates.
- Save detailed score breakdown.

### Phase 7: Mistake Book Upgrade

- Show mistake categories.
- Show due review state.
- Allow filtering by weakness type.
- Allow "fixed" state after successful retry.

## Risks

localStorage size:

- Event logs can grow.
- Keep only latest `1000` events or compress older stats into `dailyStats`.

Migration bugs:

- Must preserve existing `knownWords`, `hardWords`, `mistakes`, and `bossScores`.
- Broken localStorage should still fall back safely.

Overcomplicated scoring:

- Keep first version simple.
- Prefer transparent rules over hidden complex formulas.

Randomness feeling unfair:

- Daily Loot must be deterministic for the day.
- Practice pages can still have light randomness, but due/weak items should be favored.

Partial listening scoring:

- Be careful not to punish harmless punctuation.
- Reduced speech should compare against both `sentence` and `normalForm` where useful.

User trust:

- Do not label generated datasets as official TOEIC data.
- Keep explanations beginner-friendly.

No backend:

- Progress remains device/browser-specific.
- Clearing browser data resets learning history.

No schema change yet:

- This document proposes the v2 schema.
- Implementation should happen in small approved phases.
