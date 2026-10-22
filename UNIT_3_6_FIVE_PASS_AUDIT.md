# Unit 3–6 theory: five-pass check

This audit covers only the source ranges the user selected. The site is a guided web lesson with the original pages embedded in order; it is not a pixel-for-pixel recreation of the entire decks.

| Unit | Source | Selected pages | Total |
| --- | --- | --- | ---: |
| 3 | *Growth and Maturity* PPTX | 1–20, 22–28, 29–34, 36–37 | 35 |
| 4 | *Truth and Interpretation* PDF | 1–56, 100–106 | 63 |
| 5 | *Dream and Faith* PPTX | 1–18, 22–33, 161–175, 177–186 | 55 |
| 6 | *Conflict and Harmony* PPTX | 1–19, 66–77 | 31 |

1. **Scope and page order.** Compared every selected number against the source files, page-label map, lesson placement, and WebP filenames. All 184 selected pages are present once. The 12 opening pages (pages 1–3 of each unit) sit in the cover, contents, and objectives; the remaining 172 sit in 11 chapter readers.
2. **Source fidelity.** Re-rendered every selected page from the source PDF or a fresh PPTX-to-PDF conversion and compared it with the web image. All 184 matches had low image differences (unit means: 2.44, 2.39, 2.35, and 2.42 on a 0–255 color scale). Re-read the XML text of all 121 selected PPTX slides against the extracted text shown in the web lesson; no nonblank text runs were omitted. The converted image of Unit 3 page 13 loses the Chinese poem, so the poem is restored from the PPTX text beside the image.
3. **Teaching logic and answers.** Checked the sections against source sequence and source examples. Corrected the Unit 4 page 34 point-of-view explanation; treated pages 53–56 as source answer-key slides instead of hiding their already-printed answers; corrected *Hoot* and *Magic Treehouse* labels; corrected the precise understatement on Unit 5 page 177. A page-gap mark now signals omitted, unselected pages. Unit 5 page 18 explicitly identifies its transition to unselected case-analysis pages.
4. **Interaction.** Tested all four unit tab sets, all 11 page readers, all 172 page buttons, previous/next controls, progress indicators, image alt text, and all 172 reader-image URLs in the browser. No failures remained.
5. **Visual and responsive layout.** Checked 20 unit-section views across 320, 390, 768, 1127, and 1440 pixel widths. No horizontal overflow or clipped reader images remained. Inspected all four covers and mobile chapter readers. Fixed the page-strip position after resize, enlarged the Unit 5 cover image, and cropped the stray mark from the Unit 4 cover asset.

The original slide/page image is linked for enlargement on every selected page. PPTX pages also offer extracted text where present. The web headings and study cues are editorial navigation and explanation; they do not replace the source page.

## 2026-10-20 recheck against Unit 1's actual web reconstruction

The earlier five-pass check established **coverage**, not a complete web replica. Unit 1's cover, objectives, contents, and concept pages use native web layout and source-specific art. Comparing that standard exposed the main gap in Units 3–6: their content was dominated by summary rows and full-slide screenshots.

The new pass changes each unit's cover and knowledge-page treatment to match its own source motif and presents extracted lesson text as readable HTML in the selected-page sequence. The original page is now inside an optional comparison disclosure; it no longer competes with the web lesson. The original Unit 3 and Unit 6 illustration assets were extracted directly from the PPTX files. Unit 4 text came from its supplied PDF. Five key definition/process pages received source-shaped native compositions. Source wording was preserved in the page transcripts; minor objective-page typos were corrected in the web version. Generic summary-card grids were removed from chapter pages so the selected source lesson begins immediately.

Checks run on this change: all 184 selected page images and all 184 text-map entries exist; desktop screenshots were inspected for four covers, four objective panels, four skill panels, and representative content pages; all four covers and objectives were checked at 390px with no horizontal overflow; the production build completed. The repository's existing `tests/rendered-html.test.mjs` does not run against this build because it imports the old `dist/server/index.js` output, while vinext now builds into `.output`.

**Status:** The site now follows Unit 1's native-content direction, but the 184 selected slides are not yet individually hand-composed to the same level. Pages whose instructional meaning depends on a source diagram or image still rely on the linked original. Do not call this a finished one-to-one recreation until those pages are reviewed and rebuilt individually.

The status above records the earlier native-layout direction. A later user request changed the presentation method: selected teaching images are now shown directly in the lesson, rather than hidden behind an “Original page” comparison control. The cover remains navigable web content; objectives, contents, and chapter pages show the source images inline. Text transcripts remain available below the images.

### Follow-up verification after the full-width lesson revision

1. The source inventory still contains all 184 selected pages, all 184 page images, and all 184 transcript-map entries. Pages 1–3 of each unit are represented by the cover, contents, and objectives; the other 172 pages are in the chapter readers.
2. At a 1127px viewport, all 172 chapter pages were opened via their page buttons. Each active page was visible, its button state matched, and its source image existed. Extracted source text was compared line by line to the rendered HTML. Two apparent omissions (Unit 5 p22 and Unit 6 p67) were page titles already displayed in the page heading, rather than lost body content.
3. The same 172 page-button transitions were checked at 390px. No horizontal document overflow or lesson-panel overflow was detected at either width.
4. The four native composition samples (Unit 3 p30, Unit 4 p17, Unit 5 p11, Unit 6 p13) were visually inspected at desktop width, and Unit 6 p13 was inspected again at 390px. The previously cramped Unit 6 notes now have the full content width.
5. The Vinext production build completed after these changes. The existing rendered-HTML test runner still targets a previous build-output path and remains a separate repository issue.

### Direct-image follow-up

- Removed every “Original page” / “Compare with original page” UI control and the original-title-page link. The 172 chapter images and eight contents/objectives images now appear directly in their panels; the four unit covers retain their web navigation and source-inspired artwork.
- Kept an expandable text version below each page image for readability and accessibility. Unit 3 page 13 overlays the original Chinese poem where the converted picture had a missing-glyph symbol.
- Rechecked all 172 chapter-page transitions at 1127px and 390px: correct active button, visible inline image, and no horizontal overflow in either viewport (344 transitions, zero reported layout/control issues). Confirmed all four contents and objectives panels have inline images and zero old comparison controls. The production build passed.
