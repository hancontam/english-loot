# English Loot

English Loot is a lightweight English learning web app for Vietnamese student developers who want a more playful daily practice loop.

Instead of feeling like a boring TOEIC drill app, English Loot mixes TOEIC-style vocabulary, real-life English, gamer/chat English, reduced speech, listening practice, mistakes review, and a weekly boss test.

## Features

- **Daily Loot**: generates a stable daily learning set from the local content pool.
- **Word Loot**: practice TOEIC-style vocabulary with audio, meaning reveal, known/hard marking, and weighted review.
- **Real Talk**: learn common phrases, chat shortcuts, and reduced speech in context.
- **Gamer Comms**: practice Valorant and voice-chat English with short quiz checks.
- **Listen & Type**: hear English sentences with the Web Speech API, type what you hear, and compare word by word.
- **Mistake Book**: review saved mistakes from listening, phrase, gamer, and boss-test practice.
- **Boss Test**: run a mixed 20-question check and save scores locally.
- **Video Farm**: browse listening resources from static JSON data.
- **Local progress**: saves streak, EXP, level, known words, hard words, mistakes, boss scores, and daily loot history in `localStorage`.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Static JSON data
- `localStorage`
- Web Speech API

There is no backend, login, or database in the MVP.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite is configured to serve on `127.0.0.1`.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Roadmap Status

Current MVP loops are marked done:

- Loop 0: UI direction freeze
- Loop 1: Storage core
- Loop 2: Daily Loot logic
- Loop 3: Word Loot interaction
- Loop 4: Real Talk practice
- Loop 5: Gamer Comms practice
- Loop 6: Listen & Type
- Loop 7: Mistake Book
- Loop 8: Boss Test
- Loop 9: Video Farm
- Loop 10: Polish

## Content Source Policy

English Loot uses original app data inspired by reputable English learning and TOEIC-style references.

The dataset should not claim to be official ETS vocabulary, copy official TOEIC questions, or reproduce full copyrighted word lists. Use wording like:

- `TOEIC-style curated vocabulary`
- `Based on official TOEIC sample topics and reputable learning references`

Approved reference categories include official TOEIC sample materials, Oxford/Cambridge level and dictionary references, BBC Learning English, common texting abbreviation references, and Valorant/gaming glossary references.

## Current Limitations

- Static JSON data only.
- No backend sync across devices.
- No account system or login.
- No database.
- Web Speech API voice quality depends on the browser and operating system.
- Cute animal logo assets are large and may create Vite asset-size warnings.
- Content pool is still small and intended as MVP seed data.

## Credits

Designed by @hancontam.
