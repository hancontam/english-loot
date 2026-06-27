# English Loot Content Source Map

## Purpose

This document maps approved learning references to English Loot content direction. It is a planning document only. It does not add app data, copy source content, or change any JSON schema.

English Loot content should feel TOEIC-relevant, practical for Vietnamese learners, and still fun enough for Real Talk, chat, and gamer English.

## Approved Source List

1. Uploaded PDF: `C:\Users\HIT\Downloads\600_tu_vung_toeic_co_dich_tieng_viet.pdf`
2. Ms Hoa TOEIC 250-500 roadmap: `https://www.anhngumshoa.com/tin-tuc/lo-trinh-luyen-thi-toeic-hoc-toeic-dat-band-diem-muc-tieu-250-500-34805.html`
3. Ms Hoa TOEIC Listening: `https://www.anhngumshoa.com/tin-tuc/toeic-listening-37628.html`
4. Ms Hoa TOEIC Reading: `https://www.anhngumshoa.com/tin-tuc/toeic-reading-37630.html`
5. Ms Hoa TOEIC online test: `https://www.anhngumshoa.com/tin-tuc/thi-thu-toeic-online-mien-phi-37347.html`
6. Tatoeba: planned source direction for short Listen & Type sentence discovery.
7. Valorant Wiki, Mobalytics Valorant terms, and Red Bull Valorant terms: reference direction for Gamer Comms.
8. Merriam-Webster texting abbreviations and BBC Learning English: reference direction for Real Talk and clean chat slang.
9. Urban Dictionary: secondary slang check only, never a copied definition source.
10. YouTube public pages and video IDs: planned metadata direction for Video Farm.

## What Each Source Is Used For

### Uploaded TOEIC Vocabulary PDF

Use for:

- TOEIC vocabulary topic clustering.
- Bilingual meaning style reference.
- Selecting practical domains such as business, office, finance, travel, hospitality, shopping, health, and media.
- Checking whether a word feels TOEIC-relevant.

Do not use for:

- Copying the full word list into `words.json`.
- Copying source definitions or examples.
- Claiming English Loot has an official TOEIC vocabulary list.

### Ms Hoa TOEIC 250-500 Roadmap

Use for:

- Beginner-to-intermediate learning flow.
- Balancing Reading and Listening.
- Planning daily practice for a Vietnamese learner aiming around TOEIC 250-500 first.
- Reinforcing the learning habit of listening, checking, and reviewing mistakes.

Do not use for:

- Copying article sections into app lessons.
- Copying downloadable materials.
- Reusing course wording as app content.

### Ms Hoa TOEIC Listening

Use for:

- Listening practice direction for TOEIC Parts 1-4.
- Understanding common listening traps.
- Designing short listening items that train keywords, detail listening, speaker intent, and distractor awareness.
- Mapping Listen & Type items to TOEIC-style listening situations.

Do not use for:

- Copying sample questions.
- Copying images, audio, transcripts, or answer options.
- Reproducing full TOEIC practice tasks.

### Ms Hoa TOEIC Reading

Use for:

- Reading direction for TOEIC Parts 5-7.
- Planning vocabulary, grammar-in-context, collocation, skimming, scanning, and context clues.
- Designing short original sentence-completion and mini passage tasks later.

Do not use for:

- Copying example passages.
- Copying answer choices.
- Turning English Loot into a heavy grammar course.

### Ms Hoa TOEIC Online Test

Use for:

- Benchmark mindset.
- Boss Test direction.
- Mistake analysis flow after tests.
- Awareness that TOEIC Listening & Reading has 7 parts and timed pressure.

Do not use for:

- Copying test questions.
- Copying scoring claims into English Loot.
- Claiming English Loot Boss Test is an official TOEIC test.

### Tatoeba

Use for:

- Planning future short Listen & Type sentence discovery.
- Finding sentence length and everyday pattern inspiration.
- Future attribution and license-aware sentence sourcing, if approved.

Do not use for now:

- Fetching thousands of sentences.
- Using Tatoeba audio.
- Adding Tatoeba data without attribution and license fields.
- Replacing Web Speech API audio in the current MVP.

Current rule:

- Keep Web Speech API as the main audio method.
- If Tatoeba is used later, store attribution and license fields in an approved schema change.

### Gamer Comms References

Use for:

- Validating common Valorant and team-chat terms.
- Understanding clean, useful comms like `rotate`, `peek`, `hold`, `flank`, `trade`, `save`, `eco`, `full buy`, `plant`, and `defuse`.
- Planning original short examples for Vietnamese learners.

Approved reference direction:

- Valorant Wiki terminology.
- Mobalytics Valorant terms.
- Red Bull Valorant terms.
- r/VALORANT only for community validation, not copied content.

Do not use for:

- Copying community posts, comments, guides, or definitions.
- Adding toxic chat, slurs, insults, or offensive terms.
- Treating Reddit language as authoritative learning content.

### Real Talk And Chat Slang References

Use for:

- Clean abbreviations and casual English used in chat.
- Reduced speech and learner-friendly real-life phrases.
- Keeping examples practical for Vietnamese learners.

Approved reference direction:

- Merriam-Webster texting abbreviations.
- BBC Learning English.
- Urban Dictionary only as a secondary slang check.

Do not use for:

- Copying Urban Dictionary definitions.
- Copying full article text.
- Adding offensive, vulgar, or confusing slang as core MVP content.

### Video Farm YouTube ID Policy

Use for:

- Static `videos.json` metadata.
- YouTube video IDs, channel links, source names, levels, and topics.
- Outbound links or later embed IDs only.

Do not use for:

- YouTube API integration yet.
- Downloading, rehosting, or scraping videos.
- Copying transcripts, captions, descriptions, or comments.
- Storing copyrighted video content inside the app.

## What Must Not Be Copied

- Official or copyrighted TOEIC test questions.
- Full word lists from books, PDFs, or websites.
- Full article content from reference sites.
- Source example sentences, passages, answer choices, or explanations.
- Images, audio, downloadable files, or practice tests from the sources.
- Any wording that implies English Loot data is official ETS/IIBC/TOEIC content.

Safe wording:

- `TOEIC-style curated vocabulary`
- `Original examples inspired by common TOEIC topics`
- `Based on reputable learning references and TOEIC-style topic mapping`

Unsafe wording:

- `Official TOEIC vocabulary`
- `ETS vocabulary list`
- `Real TOEIC test questions`
- `Copied from TOEIC exam`

## TOEIC Vocabulary Topic Map

Use this topic map to grow `src/data/words.json` while keeping the existing schema.

### Work And Office

- contracts and agreements
- business planning
- meetings and conferences
- office procedures
- correspondence
- office technology
- computers and software
- reports, documents, and files

Good for:

- Word Loot
- Listen & Type office sentences
- Boss Test Part 5-style vocabulary questions

### Hiring And Workplace

- job advertising
- recruitment
- applying and interviewing
- hiring and training
- salaries and benefits
- personnel
- performance and promotion

Good for:

- TOEIC workplace vocabulary
- realistic work English sentences
- short reading contexts

### Commerce And Customer Service

- shopping
- ordering supplies
- shipping and delivery
- invoices
- payments
- warranties
- customer requests
- product issues

Good for:

- practical TOEIC vocabulary
- email/request style examples
- listening items with short service conversations

### Finance And Business Operations

- banking
- investments
- taxes
- financial statements
- budgets
- board meetings
- product development
- renting and leasing

Good for:

- level 600-700 words later
- Boss Test challenge items
- reading practice with business context

### Travel And Hospitality

- general travel
- airlines
- trains
- hotels
- car rentals
- restaurants
- ordering lunch
- events

Good for:

- beginner-friendly TOEIC topics
- listening announcements
- reservation and schedule sentences

### Media, Culture, And Public Places

- movies
- theater
- music
- museums
- media
- public notices
- entertainment events

Good for:

- Video Farm tags
- short reading notices
- Part 4-style announcements later

### Health And Services

- doctor office
- dentist office
- hospitals
- pharmacy
- appointments
- instructions and requests

Good for:

- practical daily English
- TOEIC service contexts
- listening and reading notices

## Listening Practice Map

Use this map for `src/data/listeningItems.json` later. Keep the current schema unless a future loop approves a schema change.

### TOEIC-Style Listening

- Part 1 direction: short descriptive sentences about people, objects, actions, and places.
- Part 2 direction: short question-response patterns.
- Part 3 direction: short workplace or service conversations.
- Part 4 direction: short announcements, messages, schedules, and notices.

English Loot MVP format:

- Keep each item short enough for Web Speech API.
- Include `sentence`, `normalForm`, `meaning`, `type`, and `level`.
- Use original sentences only.
- Prefer one listening skill per item:
  - keyword recognition
  - date/time/number recognition
  - request or purpose
  - workplace context
  - reduced speech

### Real-Life And Reduced Speech

Keep reduced speech because it matches the product goal:

- `wanna`
- `gonna`
- `lemme`
- `gimme`
- `how bout you`
- casual chat phrases

Rules:

- `sentence` may contain the reduced form.
- `normalForm` should show the full form.
- `meaning` must be natural Vietnamese with accents.
- Do not overstuff one item with many reduced forms.

### Gamer Listening

Use short comm-style lines:

- rotate
- peek
- hold
- flank
- trade
- save
- eco
- full buy
- plant
- defuse
- nt
- gg
- wp
- mb

Rules:

- Keep examples short.
- Make Vietnamese translation natural for a Vietnamese gamer.
- Avoid toxic chat.

## Reading Practice Map

English Loot is not a heavy grammar course. Reading practice should be light, TOEIC-style, and mostly context-based.

### Part 5-Style Direction

Use for:

- Word Loot traps.
- Boss Test vocabulary questions.
- Later sentence-completion mini tasks.

Focus:

- word form
- collocation
- meaning in context
- common business verbs and nouns
- prepositions only when useful

Do not:

- Copy TOEIC Part 5 questions.
- Add long grammar lectures.

### Part 6-Style Direction

Future direction only:

- short email/message paragraphs
- one missing word or phrase
- context clues before and after blank

MVP rule:

- Do not change schema yet.
- Use this later only if a future reading dataset is approved.

### Part 7-Style Direction

Future direction only:

- short notices
- simple emails
- schedules
- advertisements
- service messages

MVP rule:

- Keep examples original and compact.
- Avoid copying sample passages from references.

## Video Farm Source Direction

Use `src/data/videos.json` as a curated link and metadata list, not copied article or video content.

Recommended source categories:

- TOEIC beginner roadmap sources.
- TOEIC Listening strategy sources.
- TOEIC Reading strategy sources.
- Online test or benchmark sources.
- English listening channels already allowed by project policy.
- Developer English and gaming English channels already allowed by project policy.

Video Farm item quality rules:

- Link only to public pages/channels/videos.
- Store only safe metadata such as title, source, level, topic, URL, and later an approved YouTube video ID field if the schema changes.
- Keep title short.
- Use a clear `level`.
- Use a practical `topic`.
- Prefer clear speech, subtitles, learner-friendly videos, and clean Valorant comms/highlights.
- Do not use YouTube API yet.
- Do not embed or download source videos.
- Do not rehost videos.
- Do not scrape or copy transcripts.
- Do not copy full descriptions.

## Recommended Content Loops

### Content Loop 1: `words.json`

Goal:

- Create 100 TOEIC-style curated words.

Direction:

- Use the TOEIC vocabulary topic map above.
- Balance common beginner words and intermediate TOEIC words.
- Include traps that are useful but not unfair.
- Keep existing schema:

```json
{
  "id": "w001",
  "word": "postpone",
  "meaning": "hoãn",
  "example": "The meeting has been postponed until Friday.",
  "translation": "Cuộc họp đã được hoãn đến thứ Sáu.",
  "topic": "office",
  "level": 600,
  "traps": ["propose", "prepare", "postpone"]
}
```

Rules:

- Do not copy the PDF word list.
- Write original examples.
- Use proper Vietnamese accents.
- Avoid duplicate words.

### Content Loop 2: `listeningItems.json`

Goal:

- Expand listening practice with TOEIC-style, real-life, reduced speech, and gamer items.

Direction:

- Add short original sentences.
- Keep Web Speech API readability.
- Include `normalForm` for reduced speech.
- Add natural Vietnamese meaning.

Rules:

- Do not copy transcripts or official sample audio.
- Keep one sentence per item.
- Keep existing schema.

### Content Loop 3: `phrases.json`

Goal:

- Expand Real Talk with common chat, casual phrases, and reduced speech.

Direction:

- Include phrases like `btw`, `idk`, `tbh`, `ngl`, `rn`, `brb`, `wanna`, `gonna`, `lemme`, `gimme`.
- Use developer/student contexts when possible.
- Keep Vietnamese meanings natural.

Rules:

- Do not make meanings too literal.
- Keep examples short and original.
- Keep existing schema.

### Content Loop 4: `gamerTerms.json`

Goal:

- Expand Gamer Comms with practical Valorant and team-chat terms.

Direction:

- Include round calls, economy calls, map movement, teamwork, and polite chat.
- Keep examples short enough for voice comms.

Rules:

- Avoid toxic or insulting content.
- Keep Vietnamese gamer translation natural.
- Keep existing schema.

### Content Loop 5: `videos.json`

Goal:

- Curate useful learning resources for Video Farm.

Direction:

- Include TOEIC roadmap/listening/reading references.
- Keep BBC/developer/gaming listening sources from current product direction.
- Add source labels clearly.

Rules:

- Link to the source, do not copy content.
- Keep item titles short.
- Keep existing schema.

## Data Quality Rules

- Vietnamese must have proper accents.
- Fix mojibake before expanding content.
- Examples must be original and short.
- Translations must sound natural in Vietnamese.
- Avoid duplicate words, phrases, terms, and listening sentences.
- Keep existing JSON schemas unless a future loop explicitly approves schema changes.
- Use stable IDs.
- Keep TOEIC examples professional and everyday, not overly academic.
- Keep Real Talk casual but clean.
- Keep Gamer Comms useful and non-toxic.
- Do not claim any generated dataset is official ETS vocabulary.
- Do not copy official or copyrighted test questions.
- Do not copy full copyrighted word lists.

## Current Data Notes

Current source files:

- `src/data/words.json`
- `src/data/phrases.json`
- `src/data/gamerTerms.json`
- `src/data/listeningItems.json`
- `src/data/videos.json`

Observed issue:

- Some current Vietnamese text is mojibake/corrupted, for example `hoÃ£n` instead of `hoãn`.

Future content work should fix encoding before adding larger datasets, but this loop does not edit data.
