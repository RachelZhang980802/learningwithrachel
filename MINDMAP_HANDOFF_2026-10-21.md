# Mindmap integration handoff — 2026-10-21

## Scope and preview

Preview: http://127.0.0.1:5173/?open=reading&article=01&panel=mindmap#text

Received sources cover articles 01–09: 11 current diagram views and 988 HTML text nodes. Articles 04 and 07 each combine their former three views into one continuous map. Article 10 (Two Ways of Seeing a River) was authored from the article on 2026-10-22 at the user’s request; see the final checkpoint below. Do not treat image filename prefixes as article IDs.

## Rendering and fidelity — revised to native HTML at user request

- **Default: 文字重建.** The former original-image/click-overlay mode has been removed from the UI and runtime. Every diagram uses visible HTML text buttons; line art and frames are inline SVG elements. The original-comparison mode, source-download links and 22 full-source website assets were removed in the latest refinement. There is only the interactive reconstruction.
- Text PDFs: all original font subsets are extracted with their Unicode ranges, rather than substituting one incomplete subset or a system font. Text positions and baselines follow the PDF; 480 matched spans now also use individual glyph advances, avoiding whole-line stretching. The text-free vector decorations are loaded as inline SVG.
- Image/scanned sources: broad frames and colored regions are reconstructed with SVG shapes. Connectors are traced or authored as SVG paths. The complete original bitmap is never the native-view background. Only 13 individual illustrations are retained as small raster crops. OCR glyph ink measurements calibrate font height and baseline separately from the larger OCR line box.
- XMind: all 103 topics plus 3 boundary captions, 5 boundaries, 2 cross-relations, and 1 summary bracket remain; braces are SVG and text is HTML. All 106 text nodes now use positions measured from the saved source preview and explicit source line breaks. Font styles, single-child braces, root colors, boundaries and both curved relationships have been refined. The final smaller branch retains its separate regular-font treatment. No node bounding boxes overlap.
- Search, selected-node paragraph inspection, section collapse/expand, panning, zoom and minimap work on the native elements. Collapsed sections hide their HTML nodes and contained SVG elements. Section layout is deliberately fixed to preserve source positions.
- Cropped source images stay cropped. Missing content outside the source was not invented. Original spelling/logic issues are preserved and explained separately. Exact pixel identity across all screenshot fonts and XMind layout is not claimed.

## Article-to-source mapping

| Article | Title | Sources |
|---|---|---|
| 01 | I Become a Student | 01-Unit 1-I Become A Study by Lincoln Steffens .pdf |
| 02 | Should the Robots Be Taxed? | 02-Unit 4.pdf |
| 03 | Roommates | 03-Unit 5-My Roommate-Max Apple .pdf |
| 04 | Never Trust Appearances | 04-Unit 7-Never Trust Appearance.pdf |
| 05 | Courage | 05-Unit 9-Courage.png |
| 06 | Reading | 06-Unit 1-Xmind-Benjamin Franklin-Reading.pdf; 06-2.JPG; 06-1.JPG |
| 07 | What We Gain or Lose in Cities | 02-Unit 3-What We Gain or Lose in Cities.xmind; 07-1-IMG_4289.JPG; 07-2-IMG_4290.JPG |
| 08 | The Guide to Being a Foodie Without Being Culturally Appropriative | 08-1-IMG_4291.JPG |
| 09 | Stop Telling Me to Travel like a Local, Okay? | 09-Unit 8-Stop Telling Me to Travel like a Local, Okay? — Mari Uyehara.pdf |
| 10 | Two Ways of Seeing a River | Authored from the four article paragraphs; 41 editable nodes |

Source files were found under `/Users/rachel/Downloads/cwnu课程课件/综合英语/MindmapsforBook1and2/`. Local originals remain in that folder for future verification. Full original copies have been deleted from `public/mindmaps/assets/`; only extracted fonts, text-free line art and individual illustration crops remain in the website.

## Five refinement rounds

1. Matched each supplied source by article content, extracted PDF/XMind text, inspected the source diagrams and images, established article paragraph references.
2. Implemented isolated viewer, source artwork and native HTML nodes, corrected OCR and missing embedded-font characters; inspected initial visual renders.
3. Added and tested search, zoom, panning, section collapse, source switching, original comparison, selected text, and integration with article navigation.
4. Refined OCR baselines/masks and checked diagram claims against full article paragraphs. Corrected review references and documented source omissions/misreadings. Repeated all-view browser checks.
5. Added minimap navigation, mobile section drawer, compact title/toolbar, exact-source interactive display and separate text reconstruction; reran final browser checks across 15 maps plus the missing-source page.

## Logic issues surfaced in the review UI

- Courage: the cat/fish line describes Akira leaving and taking Chie’s ease, not Chie relaxing and leaving.
- Never Trust Appearances: “billionaire” conflicts with the reported two million pounds.
- Reading: distinguish Collins’s verbal fluency from reasoning strength; the notorious drowning event is not a public reaction to Franklin’s poems.
- Cities: the source diagram omits the concluding question in paragraph 12.
- Other review notes preserve source ambiguity and distinguish direct textual evidence from interpretation. Clicking Pxx displays the full matching paragraph.

## Coexistence with concurrent work

New files: `app/ArticleMindmap.tsx` and `public/mindmaps/`. Shared `app/page.tsx` has only the import, direct panel query effect, renamed navigation button, and early Mindmap render branch. Do not overwrite the shared page from a historical snapshot. Vocabulary, audio, quiz, and analysis files were not edited by this task. No dependencies, storage schema, or network API were added.

Article identity is the existing two-digit `article.number`. The iframe remounts on ID change, preventing one article’s map from appearing under another. Next/Previous keeps the Mindmap panel open; Text/Analysis switches back to existing functionality.

The map JSON contains copies of article paragraph text used for comparison. If article text or paragraph boundaries change in another task, refresh these paragraph snapshots and recheck references. Current integration tests cover the current local version, not future edits.

## Verification

- PDF character completeness checks passed for all 5 text PDFs; all 103 XMind topics exactly match the source strings.
- Source assets, unique IDs, positive dimensions, section/check paragraph ranges validated.
- Latest browser checks cover 15 diagram scenes and article 10 pending state; asset loads, node counts, visible HTML, absence of whole-image backgrounds and original-source controls, collapse/expand, zoom, search, inspector, paragraph text, drag, minimap, mobile layout/drawer, Next navigation, and existing Text/audio/Analysis access.
- Isolated TypeScript check for ArticleMindmap and browser bundle of app/page.tsx passed. No full application production build was claimed.
- Audit JSON files are saved beside this document under `mindmap-audit/`.

## Native reconstruction follow-up verification

The user rejected full-source artwork with click overlays. This follow-up replaces that approach, not just the default label. Native-view checks explicitly assert visible HTML text, no whole-image scene background, SVG shapes for image-derived maps, and native mode selected on opening. All 15 maps plus the pending tenth article passed with no browser page errors. At that earlier checkpoint, original comparison was still present. The latest checkpoint removes it and rechecks paragraph views, search, collapse/expand, zoom, drag, minimap, mobile navigation and existing app integration.

`mindmap-audit/native-browser-results.json` records the follow-up checks. The last visual corrections target the Cities Part 3 braces and Franklin image node backgrounds. Previous five-round records describe the earlier implementation and are retained as history; they do not supersede this native-rendering requirement.

## Further source-layout refinement and original removal

- XMind now follows the source preview coordinates, fixed line breaks and source hierarchy typography. Single-child braces, the two-color root brace, boundary regions and the two long curved relations were refined. All 103 topic strings remain identical to the source.
- Five text PDFs now have exact per-character positioning in 480 matched text spans. Image-derived text uses actual font ink height instead of a minimum that shrank short glyphs.
- Original comparison and source-download controls were removed. All 22 full-source website copies were deleted; local supplied files are preserved. The website renders 992 HTML text nodes across 15 views.
- This refinement changed only the Mindmap module and its documentation/audits. `app/page.tsx` is byte-for-byte identical to the snapshot at the start of this turn.
- All 15 views and the pending tenth article passed browser checks with no page errors. The final scene screenshots were visually reviewed. These checks establish native rendering and functionality, not mathematical pixel identity with every source font.
- Latest evidence: `mindmap-audit/layout-browser-results.json`, `layout-source-audit.json`, `glyph-position-audit.json`, `layout-integrity.json`, and `removed-web-originals.json`. Earlier round reports are historical.

## Plain-canvas correction

The map now renders directly on a white viewport. The scene tile, shadow and full-page PDF SVG fills were removed. Large colored source regions in the image-derived maps and XMind boundary fills are transparent while their strokes and native nodes remain. The long XMind opens focused on its readable introduction rather than at a 14% whole-page scale; the full-map fit control remains available. At the plain-canvas checkpoint, all 15 former scenes plus article 10 passed browser checks with no page errors. Article 07 was combined in the next checkpoint. Evidence: `mindmap-audit/plain-canvas-browser-results.json`.

## Article 07 unified canvas

The XMind overview, the Freedom & Community Interests detail map, and the Social Ties & Anonymity detail map now form one continuous HTML/SVG canvas. One source tab replaces three separate tabs. There are 274 interactive text nodes and nine focusable/collapsible sections across the three parts; search, node inspection, zoom, pan, minimap and article paragraph references work across the combined view. The two detailed maps retain their original local structure and illustrations. The canvas stays white and without a page tile.

All 13 current diagram views plus the pending article 10 page passed isolated browser checks, including mobile layout. The integrated article 07 reading page loaded all 274 nodes without a browser error. This change is limited to `public/mindmaps/`; shared reading, vocabulary and audio files were not edited. Evidence: `mindmap-audit/merged-07-browser-results.json`.

## Article 04 branches connected to the first map

The three reconstructed PDF pages for *Never Trust Appearances* now form one connected HTML/SVG tree. The first page supplies the only root and the three chapter blocks. Page 2 details branch directly from its pink Part 2 block; page 3 details branch from Part 3. Duplicate headings from pages 2 and 3 are hidden/removed, leaving 62 distinct clickable text nodes. Source-detail text positions, connectors and small illustrations remain native HTML/SVG assets on a white canvas. The new pink branch connectors are `flowLinks` in `public/mindmaps/data/04.json`; the later page artworks are clipped left of their detailed subtrees to eliminate disconnected duplicate titles.

The direct map and integrated reading page each load one scene and one source tab with no browser errors. Search found the page-3 “A Real Billionaire” node; all 11 active scenes plus the pending article-10 view passed browser checks. Main-app integration was checked at `?open=reading&article=04&panel=mindmap&rev=connected-04-3#text`. This change touched only `public/mindmaps/`, `app/ArticleMindmap.tsx`, and this handoff; shared `app/page.tsx` was not changed.

## Article 04 elongated orange-green stem

The first map's orange and green central bracket is now stretched vertically through Part 1, Part 2, and Part 3. The three chapter title blocks share this one stem, and the page-2/page-3 detail branches sit directly to their right. Earlier long pink links and duplicate page titles have been removed; the source-detail nodes and individual illustration crops remain interactive. The main stem, title blocks, and short joins are native SVG, with 62 distinct HTML text nodes. The direct map is `/mindmaps/index.html?article=04&rev=bracket-04-4`; the integrated reading page uses the same revision. Browser checks passed for 11 active scenes and article 10's pending view, with no page errors. Shared `app/page.tsx` was not changed.

## Editable node interaction

Every existing native text node in all supplied maps now uses the same interaction: single click selects it and opens the close-reading pane; double click opens a text editor at the node. Enter or Save commits, Shift+Enter adds a line, Escape or Cancel discards. Clicking outside commits. The original node artwork stays in place, and edited text participates in search and node inspection. An edited node can be reset through “恢复原稿文字” in the inspector. Edits are stored in same-origin browser `localStorage`, scoped by two-digit article ID and stable node ID; they persist through refresh and article navigation on that browser. No database/API schema or shared reading page was modified. A new environment/device will not have those browser-local edits unless they are separately transferred.

The edit implementation is in `public/mindmaps/app.js` and `style.css`; `app/ArticleMindmap.tsx` and `public/mindmaps/index.html` carry revision `editable-nodes-05-2`. Browser checks covered article 04 selection/edit/reload/search/reset, article 07 XMind edit/reset, article 01 PDF edit cancellation, the integrated article 04 reading page, and all 11 current map scenes plus article 10 pending, with no page errors.

## Article 04 OCR typography correction

The original scanned PDF page 1 was rendered and compared with the native map after a user reported scrambled text. The “Men reading evening papers” and “Women Knitting” OCR boxes had overlapping hit areas and overestimated glyph heights. Their font ink heights/baselines and clickable boxes were corrected to match the two separate source lines. Dark glyph-like vector remnants from the PDF artwork were also removed from all three article-04 parts; they had been drawn on top of the editable HTML text and caused visible double lettering. Colored connectors and individual illustrations remain. A browser geometry audit now finds no overlapping native text spans for article 04, and clicking “Men reading evening papers” selects that exact node. Revision `text-clean-04-6` was checked in both the direct map and integrated reading page; all 11 active scenes and article 10 pending state passed browser checks. Node editing, reload persistence, search, and restore were rerun successfully.

## Article 10 authored from the original text — 2026-10-22

The user authorized creating the missing map in the style of articles 01–09, without a supplied diagram. Article 10 now contains one native HTML/SVG map, 41 editable nodes and three sections: Reading the river (P1), Two readings of one sunset (P2–3), and The cost of expertise (P4). The middle branch aligns seven images with their practical navigation meanings. The doctor analogy and final question remain interpretive and open-ended rather than asserting that all professional learning destroys beauty.

The four paragraph snapshots are regenerated from the current lesson sentences and verified for exact equality. Three Chinese close-reading notes explain the extended metaphor, the seven paired details, and the limits of the doctor analogy. The map uses the existing editing, search, paragraph inspection, collapse, pan, zoom and minimap functionality. No full-image diagram background was added.

Changes: `public/mindmaps/data/10.json`, article 10's scene count in `catalog.json`, an optional book summary in `app.js`, and asset revision `river-10-1` in the iframe and map HTML. Articles 01–09 JSON hashes are unchanged. This work does not modify the reading/grammar/vocabulary data or main page logic.

Validation: Chrome and WebKit each passed 41-node rendering, zero text overlaps, search, exact P2/P3 reference text, section collapse/expand, editing/save/reload/restore, zoom, drag, minimap, mobile drawer/search, integrated Mindmap and return-to-Text. Chrome additionally loaded each preceding article's first scene and checked its expected node count. There were no browser page errors. `npm run typecheck` passed. Desktop and mobile screenshots were inspected; the overview has dedicated blank space to avoid covering the final branch.

Evidence: `mindmap-audit/article10-browser-results.json` and `mindmap-audit/article10-preview.png`. Preview: http://127.0.0.1:5173/?open=reading&article=10&panel=mindmap#text
