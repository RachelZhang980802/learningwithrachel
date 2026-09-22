# Close Reading Archive — restoration guide

This package contains the complete portable source for the current Close Reading Archive website, including the interface code, illustration assets, cover art, full audio, and 40 sentence-level audio clips.

## Restore in a new ChatGPT conversation

Upload both files together:

- `Close-Reading-Archive-v19.zip`
- `Close-Reading-Archive-Restore-v19.json`

Then send this instruction:

> Please restore this website from the ZIP and JSON manifest. Create a new Sites project rather than reusing an old project ID. Preserve the current design, assets, audio, carousel, full-text reading page, fixed right-side Sentence Studio entry, paragraph-based sentence navigation, cat student-draw interaction, and sentence-analysis progressive disclosure. Install dependencies, verify the build, open a preview, and do not redesign anything unless I ask.

## Restore locally

Requirements: Node.js 22.13 or newer, Linux/macOS shell tools, and npm.

```bash
npm ci
npm run dev
```

For a production verification:

```bash
npm run build
```

## Important identity note

The original `.openai/hosting.json` is intentionally excluded because it contains the identity of the current hosted Site. A new conversation should create a new Site project and generate a fresh `.openai/hosting.json`. The file `.openai/hosting.example.json` is only a neutral reference.

## Primary editing locations

- `app/page.tsx` — content, interaction state, carousel, reading view, and Sentence Studio
- `app/globals.css` — the full editorial, ink-wash, paper, card, and animation design system
- `public/` — covers, Harvard illustration, cat assets, full audio, and sentence clips
- `tests/rendered-html.test.mjs` — rendered output verification

## Current experience preserved

- Ten-text elliptical library carousel with infinite cycling and active-card centering
- Article 01 full text: *I Become a Student* by Lincoln Steffens
- Fixed right-center handwritten `Sentence Studio` arrow on the full-text page
- Five paragraph ranges: 01–03, 04–16, 17–25, 26–36, 37–40
- Forty sentence pages with sentence audio
- Five analysis entries: Structure, Words, Meaning, Culture, and Craft
- Three practice entries: Paraphrase, Translation, and Pattern
- Animated cat student selector for numbers 1–50 with a seven-draw no-repeat window
- Harvard Widener Memorial Library ink-wash background with VERITAS banners
- Responsive, keyboard-accessible controls and reduced-motion support

