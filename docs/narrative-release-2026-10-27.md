# Narrative course release — 2026-10-27

The six units now open a source-based HTML reader directly from Narrative Writing → Units. The selected 248 source pages retain original illustrations, page colors, and teaching content. Text is native HTML; image-only passages have been recovered into readable HTML. Long passages and Chinese explanations reflow within their own source regions, and separate meaning panels never cover the slide.

- Unit page counts: 22 / 42 / 35 / 63 / 55 / 31. Exact source ranges are in `THEORY_PAGE_LAYOUT_REFERENCE.md` and `app/unitDeckSources.json`.
- Text interactions: click for Chinese; optional Recall English; keyboard Enter/Space and Escape; physical source-page selection and zoom. The Unit 2 Characters and Unit 3 Settings resources remain available.
- Storybook: 98 source pages and 142 original writing examples. Examples and Chinese occupy the corresponding writing box or speech bubble. The 16 pages without a genuine writing area use a separate example drawer above the page. Long examples scroll within their own box.
- Layout repair: original text-box overruns, CJK fixed line-height inheritance, image-text OCR baselines, lingering source ink, and fast-page-turn stale illustrations have been corrected.
- Glossary audit: all 1,920 readable English-only blocks have Chinese, with no invalid entries or source/context mismatches. Original Chinese and mixed bilingual blocks are counted separately.

## Verification

The production build was run locally with the same static-file plus Node arrangement as ECS. All 248 source pages were checked at 1147px and 679px, including loaded art, preserved text IDs, page changes, a substantive Chinese meaning per page where applicable, and document/flow bounds. 375px zoom, recall, and keyboard behavior also passed. Visual reviews covered all selected pages; Unit 1/2 additionally passed 298 real mouse clicks. TypeScript and the Alibaba Node build passed. See `unit-deck-production-qa.json` and `unit-deck-glossary-audit.json`.

The storybook production build also passed all 98 pages and 142 examples at 679px, plus 17 complex pages and 57 examples at 375px. Real mouse clicks and keyboard activation switched English/Chinese correctly. Examples remained inside their assigned writing regions, with no original-text overlap, page overflow, browser errors, or failed resources. See `storybook-production-qa.json`.

## Deployment resources

The legacy `/narrative-course/` redirect now excludes the generated `decks/`, `storybook/`, `theory/native/`, and `theory/unit-3/html/` directories. These assets are shipped with the application instead of being redirected to the older R2 release. The 193 existing narrative media redirects remain unchanged. The packager verifies the required generated resources before producing the archive.

## Implementation

- `app/UnitDeckViewer.tsx`, `app/unit-deck-*.css`: reader and targeted layout repairs.
- `public/narrative-course/decks/`: source art, extracted fonts, and per-unit HTML data; manifest version invalidates stale browser data.
- `app/unitDeckGlossary*.json`: exact text and contextual explanations.
- `app/StoryBook.tsx`, `app/storybookLayout.ts`, `app/storybookCreative.ts`, `app/storybookTranslations.ts`: bounded examples and language toggling.

Historic theory components and their resources remain in the repository but do not replace the current unit reader. Avoid re-enabling the previous image-only lessons. Source-conversion scripts require the original local PPT/PDF files and extraction tools; the committed generated data are sufficient to build and deploy the website.

## Live deployment

Application source commit: `7243be3baa0be3368b83240bd2a5e7da1df98f90`. ECS release: `/opt/learningwithrachel/releases/20261026T170619Z` (UTC directory name; 2026-10-27 in Shanghai). Previous release `/opt/learningwithrachel/releases/20261024T093958Z` is retained for rollback.

Both production hostnames report `narrative-2026-10-27`. Public checks passed all 1,492 required resources with exact HTTP 200 and correct MIME, all six unit readers at their first/last selected pages, a narrow Chinese layout, Greece's inline favicon, four complex storybook pages with 14 examples, and both Characters/Settings reference readers. Browser errors, failed requests, and failed resources: zero. Reports are saved as `narrative-live-*-qa.json`.

The server's existing hidden-file rule originally blocked Vinext's legitimate `/.rsc` prefetch endpoint. Exact-path proxy rules now permit that endpoint while preserving the other dotfile protections, and the deployment templates carry the same change. The server MIME map now includes `font/woff2`. Nginx configuration backups were retained and `nginx -t` passed before reload. The earlier incomplete package was rolled back before the complete release was installed.
