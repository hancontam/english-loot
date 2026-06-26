# English Loot Roadmap

Status values:
- Not started
- Planned
- In progress
- Done
- Blocked

## Loop 0: Freeze Current UI

Status: Done

Goal:
Confirm current UI direction and prevent accidental redesign.

Scope:
- Document UI tokens.
- Document logo sizing rules.
- Document image sizing, radius, and object-fit rules.
- Audit color usage.
- Audit current shell, sidebar, typography, cards, icons, mascot, logo, and image usage.
- Do not implement new app behavior.
- Do not invent a logo or add a sidebar logo image.

Acceptance criteria:
- UI tokens are documented.
- Logo sizing rules are documented.
- Image sizing, radius, and object-fit rules are documented.
- Components use consistent colors.
- No random color usage.
- Current image/logo usage is audited.
- Mascot assets are not stretched or distorted.
- No unrelated redesign in future loops.

Audit notes:
- Current sidebar uses a text brand only; no logo image exists yet.
- `MascotBubble` is the only current component rendering an image asset.
- `MascotBubble` uses a `64px` by `64px` mascot image with `object-contain`, which preserves the 3D animal asset aspect ratio.
- `MascotBubble` uses a circular `40px` radius intentionally; circular avatar/mascot bubbles are allowed.
- No code change was needed for image/logo usage during this loop.

Files likely involved:
- `AGENTS.md`
- `ROADMAP.md`
- `LOOP.md`
- `tailwind.config.js`
- `src/styles.css`
- `src/components/*`
- `src/pages/*`

## Loop 1: Storage Core

Status: Not started

Goal:
Create a clean localStorage layer.

Scope:
- Support `streak`.
- Support `exp`.
- Support `level`.
- Support `knownWords`.
- Support `hardWords`.
- Support `mistakes`.
- Support `bossScores`.
- Support `dailyLootHistory`.

Acceptance criteria:
- Storage helpers exist.
- Default progress works.
- Read and write functions are safe.
- No UI overhaul.

Files likely involved:
- `src/lib/storage.js`
- `src/pages/MistakeBookPage.jsx`
- `src/components/ProgressBadge.jsx`

## Loop 2: Daily Loot Logic

Status: Not started

Goal:
Generate today's learning set.

Scope:
- 10 TOEIC words.
- 5 Real Talk phrases.
- 5 Gamer Comms.
- 1 listening challenge.
- Stable loot for the same day.
- Weighted selection using known and hard items.

Acceptance criteria:
- Same day returns same loot.
- New day can generate new loot.
- Known items appear less often.
- Hard items appear more often.
- Daily Loot page displays real selected items.

Files likely involved:
- `src/lib/storage.js`
- `src/lib/dailyLoot.js`
- `src/pages/DailyLootPage.jsx`
- `src/data/words.json`
- `src/data/phrases.json`
- `src/data/gamerTerms.json`
- `src/data/listeningItems.json`

## Loop 3: Word Loot Interaction

Status: Not started

Goal:
Make Word Loot usable.

Scope:
- Play audio.
- Reveal meaning.
- Mark Known.
- Mark Hard.
- Next random card.
- Save progress.

Acceptance criteria:
- User actions update localStorage.
- Known words appear less often.
- Hard words appear more often.
- Build passes.

Files likely involved:
- `src/pages/WordLootPage.jsx`
- `src/components/AudioButton.jsx`
- `src/lib/storage.js`
- `src/data/words.json`

## Loop 4: Real Talk Practice

Status: Not started

Goal:
Practice common phrases and reduced speech.

Scope:
- Phrase card.
- Full form.
- Meaning.
- Example.
- Listen button.
- Mini quiz.

Acceptance criteria:
- User can learn phrases like `nvm`, `wanna`, `gonna`, `lemme`, and `gimme`.
- Wrong answers can save to mistakes.

Files likely involved:
- `src/pages/RealTalkPage.jsx`
- `src/components/AudioButton.jsx`
- `src/lib/storage.js`
- `src/data/phrases.json`

## Loop 5: Gamer Comms Practice

Status: Not started

Goal:
Practice Valorant and chat English.

Scope:
- Term card.
- Game example.
- Vietnamese meaning.
- Mini quiz.

Acceptance criteria:
- Terms like `nt`, `gg`, `rotate`, `peek`, `hold`, `flank`, `trade`, and `save` work.
- Wrong answers can save to mistakes.

Files likely involved:
- `src/pages/GamerCommsPage.jsx`
- `src/lib/storage.js`
- `src/data/gamerTerms.json`

## Loop 6: Listen & Type

Status: Not started

Goal:
User listens and types what they hear.

Scope:
- Read sentence with Web Speech API.
- User types answer.
- Compare answer to target.
- Highlight missing or wrong words.
- Save listening mistakes.

Acceptance criteria:
- Comparison works.
- Mistake Book receives wrong answers.
- UI remains readable and clean.

Files likely involved:
- `src/pages/ListenTypePage.jsx`
- `src/components/AudioButton.jsx`
- `src/lib/storage.js`
- `src/data/listeningItems.json`

## Loop 7: Mistake Book

Status: Not started

Goal:
Show saved mistakes.

Scope:
- Group by listening, vocabulary, phrase, grammar.
- Retry mistake.
- Remove mistake.
- Clear mistakes with confirmation.

Acceptance criteria:
- Mistakes persist.
- User can retry.
- User can remove mistake.

Files likely involved:
- `src/pages/MistakeBookPage.jsx`
- `src/lib/storage.js`

## Loop 8: Boss Test

Status: Not started

Goal:
Weekly mini test.

Scope:
- 20 mixed questions.
- 5 TOEIC vocabulary questions.
- 5 Listen & Type questions.
- 5 Real Talk questions.
- 5 Gamer Comms questions.
- Score.
- Save best score.

Acceptance criteria:
- Test runs from existing JSON.
- Score is saved.
- Wrong answers go to Mistake Book.

Files likely involved:
- `src/pages/BossTestPage.jsx`
- `src/lib/storage.js`
- `src/data/words.json`
- `src/data/phrases.json`
- `src/data/gamerTerms.json`
- `src/data/listeningItems.json`

## Loop 9: Video Farm

Status: Not started

Goal:
Show recommended listening sources.

Scope:
- Filter by level.
- Filter by topic.
- Open link.
- Source label.

Acceptance criteria:
- Videos display from JSON.
- Filters work.
- No backend.

Files likely involved:
- `src/pages/VideoFarmPage.jsx`
- `src/data/videos.json`

## Loop 10: Polish

Status: Not started

Goal:
Final MVP polish.

Scope:
- Responsive layout.
- Empty states.
- Mascot usage.
- Small animations only if approved.
- Accessibility pass.
- Build pass.

Acceptance criteria:
- App feels stable.
- No console errors.
- No broken navigation.
- UI direction preserved.

Files likely involved:
- `src/components/*`
- `src/pages/*`
- `src/styles.css`
- `tailwind.config.js`
