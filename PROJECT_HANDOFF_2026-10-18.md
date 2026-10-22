# Project handoff — 2026-10-18

## Actual working copy

- Repository: `/Users/rachel/Downloads/网页设计/learningwithrachel`
- Local preview: `http://127.0.0.1:5173/?article=06&open=reading#text`
- The older Documents path is stale/missing. Keep all project files under Downloads.
- Preserve all existing tracked and untracked files. Do not clean, reset, or delete earlier work.

## Current unfinished task

Complete the new Inquire Lab resource beside **The Power of Diversity Within Yourself**:

- Card title: **Why We Have Too Few Women Leaders?**
- YouTube URL: `https://www.youtube.com/watch?v=18uDutylDa4`
- Exact user image already copied to:
  `public/inquire-assets/women-leaders-original.png`
- The full transcript is in the preceding chat. It must be added without timestamps and without `(Laughter)`, `(Applause)`, or `(Cheers)` stage directions.
- Keep the same publication layout used by the other Inquire Lab readings.
- Clicking the card opens the transcript page. Clicking its title opens the YouTube URL.

### Work already completed for this task

`app/page.tsx` already contains:

- import of `womenLeadersArticle`
- a second resource in Stereotypes question 03
- URL `https://www.youtube.com/watch?v=18uDutylDa4`
- mapping for `selected === 3`, `selectedQuestion === 2`, `selectedResource === 1`
- image mapping `"3-2-1": "/inquire-assets/women-leaders-original.png"`

`app/inquire-stereotype-articles.ts` already contains a `womenLeadersArticle` skeleton with metadata and `paragraphs: []`. Fill that array with the cleaned transcript. Do not recreate the card or copy the image again.

## Inquire Lab article implementation

- Main UI: `app/page.tsx`
- General feature articles: `app/inquire-feature-articles.ts`
- Technology articles: `app/inquire-technology-articles.ts`
- Family articles: `app/inquire-family-articles.ts`
- Stereotypes articles: `app/inquire-stereotype-articles.ts`
- Shared publication CSS: `app/globals.css`

The generic feature article renderer already links the article title to `selectedResourceData.url` and uses the New Yorker style publication layout.

## Completed recent work

- Added complete article content for:
  - Why Individualism Fails to Create Individuals
  - Why Harvard Decided to Challenge Donald Trump
  - First They Came for Columbia
  - DeepSeek Has Ripped Away AI’s Veil of Mystique
  - What Is Up with Car Door Handles These Days?
  - The Parentified Child
  - How Not to Raise a Bully
  - JD Vance Isn't the First Man to Resent Cat Ladies — They've Always Been Politicized
  - Can Stereotypes Ever Be Good?
  - The Power of Diversity Within Yourself
- Taylor Swift transcript is present with purple vocabulary highlights.
- Three quoted paragraphs in the Individualism article are italic, indented, and spaced using `inquire-publication-quote`.
- Family card thumbnails use the exact user images:
  - `public/inquire-assets/parentified-original.png`
  - `public/inquire-assets/bully-original.png`
- `What Is Up with Car Door Handles These Days?` was expanded with the full body supplied by the user.

## User preferences that persist

- Preserve existing content; never replace the whole site or delete earlier material.
- Use exact supplied images when available. Do not regenerate them.
- In reading pages, keep the paper background and existing navigation unchanged.
- Use the publication typography already established in Inquire Lab.
- Only alter the selected region when the user points to a specific browser element.
- For transcripts, remove timestamps and nonverbal stage cues, then organize the English into readable paragraphs.
- Do not add Chinese to English source texts unless explicitly requested.
- Keep existing highlights and audio placement unchanged when changing typography.
- Make article titles clickable when the user supplies a source/video URL.

## Verification

The repository's `npm run build` wrapper requires GNU `timeout`, which is unavailable on this Mac. Use:

```bash
NITRO_PRESET=vercel /usr/local/bin/node node_modules/vinext/dist/cli.js build
```

The last completed build passed before the unfinished women leaders transcript was started.

## Avoiding the repeated stream error

This chat triggered `regurg plugin blocked the output stream` because long transcripts were repeatedly present in the conversation. In the new chat:

- write long text directly to files in small patches
- do not echo transcripts in commentary or final responses
- redirect verbose build logs and report only the exit result
- keep progress messages and the final answer short
