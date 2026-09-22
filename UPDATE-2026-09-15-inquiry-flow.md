# Inquire Lab interaction update

## What changed

- The first five internal readings now show the theme before the article title: Education, Technology, Family Bonds, Stereotypes, and Love.
- Selecting an internal reading reveals its English discussion questions, with a smaller gray Chinese translation underneath each question.
- Selecting a question reveals only its matching supplementary external readings in the top strip.
- Changing the internal reading clears the selected question and its external readings, so the learning order remains clear.
- Removed the central article-preview area; discussion questions now occupy the full space beside the archive list.
- Removed the archive panel's internal scrollbar so all ten internal readings flow directly on the page.
- Restyled the selected discussion question as a brick-red card with warm, high-contrast type.
- Centered the supplementary-reading cards at the compact initial-design size.
- Replaced the Taylor Swift resource URL with `https://www.youtube.com/watch?v=_at_RdsZoc4`.
- Corrected the Guardian car-door article URL to `tech-car-driving-government`.
- Moved the healthy/unhealthy-love video and gaslighting resource from Love question 01 to question 02; question 01 now retains the joint-project reading.
- Realigned the Inquire Lab layout to the supplied reading-page reference: a horizontal material rail, visual reading path at left, and a single merged guiding-question field in the center.
- Reworked the supplementary-reading rail to match the supplied compact reference: thumbnail at left, title/source at right, vertical dividers, and a red top line on the first resource.
- Removed the generated interpretation artwork from resource cards. The rail now preserves the compact original layout and uses a direct source thumbnail only when one is available.
- Added the supplied TED links for the two Stereotypes questions and their direct video thumbnails.
- Added Modern Family to the Family Bonds first question and Love Actually to the Love third question.
- Copied the nine supplied original images into the project and assigned them directly to their matching Taylor Swift, clock, Technology, Family Bonds, and Stereotypes resource cards. Removed the generated substitute artwork.
- Render resource thumbnails as direct `<img>` elements rather than CSS background images, so the original files remain visible and inspectable in every matching card.
- Select the first Education question by default, so the first matched original-image pair is visible immediately after refresh; each other image remains with its matching question.
- Added and directly mapped the remaining supplied original images: Love Is a Joint Project, healthy/unhealthy love, gaslighting, Love Actually, Gulliver, Columbia, Harvard, individualism, Modern Family, and stereotype material.
- Spaced the material rail, centers a single resource card, and makes the red card state appear only on hover. Reduced resource and reading-path typography while keeping the cards at a consistent height.
- Refined the hover treatment to a top red strip only, and set each reading-path row to a fixed height with two-line subtitle clamping.
- Restored a compact, centered supplementary-reading rail and made resource cards non-navigating; future source links can use their own dedicated control.
- Clicking a resource now selects it in place and shows the requested black vertical marker plus red top strip. Matched Inquire Lab navigation dimensions to Library and narrowed the reading-path column.
- Replaced the Library footer with a black Harvard-inspired university identity area using the supplied China West Normal University seal and university name above it.
- Removed an incorrectly copied screenshot from the footer; the supplied transparent seal file is still required before adding the final emblem.
- Created a transparent-background version of the supplied university seal and placed it beneath the university name in the Library footer.
- Unified Inquire Lab's navigation, resource-selection strip, and selected-question accents in a darker wine-red tone.

## Files

- `app/page.tsx`
- `app/globals.css`
- `public/media/inquire-taylor.png`
- `public/media/inquire-clock.png`
- `public/media/inquire-deepseek.png`
- `public/media/inquire-cybertruck.png`
- `public/media/inquire-ai.png`
- `public/media/inquire-dictionary.png`
- `public/media/inquire-parentified.png`
- `public/media/inquire-bully.png`
- `public/media/inquire-catlady.png`

## Verification

- `vinext build` completed successfully after the latest layout and selected-card changes.
- Browser checks confirmed that all ten archive choices are present without an internal archive scrollbar.
- Browser checks confirmed that selecting an English question reveals its matched external resources above.
- `vinext build` completed successfully after the resource-background additions and Guardian URL correction.
- `vinext build` completed successfully after the Family Bonds, Stereotypes, and Love-resource updates.
- `vinext build` completed successfully after replacing generated artwork with the supplied original files.
- `vinext build` completed successfully after changing resource thumbnails to direct original-image elements.
- `vinext build` completed successfully after the material-rail spacing, hover, and typography update.
- `vinext build` completed successfully after refining the hover strip and fixed reading-path row heights.
- `vinext build` completed successfully after compacting and centering the non-navigating resource cards.
- `vinext build` completed successfully after adding the click marker pair and aligning navigation and reading-path proportions.
- `vinext build` completed successfully after adding the transparent university seal to the Library footer.
- `vinext build` completed successfully after applying the deep wine-red Inquire Lab accents.
- `vinext build` completed successfully after the reference-layout realignment; browser verification confirmed the reading path, merged guiding questions, and selected resource cards.
- `vinext build` completed successfully after the supplementary rail was converted to the compact thumbnail-and-text reference style.

## Final Inquire Lab alignment pass
- Restored the full shared Library frosted navigation surface on Inquire Lab, including the rounded border, translucent layers, shadow, and nav hover treatment.
- Moved the reading-path rail downward to meet the question content rather than sitting above its visual baseline.
- Widened supplementary resource cards, enabled wrapping where space is limited, and allow every title to show on up to two lines rather than truncating it.
- Changed the footer lockup to a two-line `CHINA WEST NORMAL / UNIVERSITY` treatment above the transparent school seal.

## Final Inquire Lab alignment pass
- Restored the full shared Library frosted navigation surface on Inquire Lab, including the rounded border, translucent layers, shadow, and nav hover treatment.
- Moved the reading-path rail downward to meet the question content rather than sitting above its visual baseline.
- Widened supplementary resource cards, enabled wrapping where space is limited, and allow every title to show on up to two lines rather than truncating it.
- Changed the footer lockup to a two-line `CHINA WEST NORMAL / UNIVERSITY` treatment above the transparent school seal.

## Inquiry completion and shared footer
- Removed the forced lower whitespace from the question column; the “How it works” note now follows the question list directly.
- Made the ten-text reading path an independently scrollable side rail and changed its active circle from green to warm brown.
- Reused the university footer on Inquire Lab, Index, and About. The short simple pages now carry the footer at the bottom of the viewport.

## External periodical reading mode
- Selecting a written periodical resource now replaces the question column with its reading view; video, television, and film resources retain the questions.
- Added the supplied loose-leaf background, anchored from the side-rail divider across the periodical reading area.
- Added the supplied text for External 02, “A Commencement Address Too Honest to Deliver in Person,” with title, byline, deck, and body copy.

## Periodical paper alignment
- Repositioned the loose-leaf texture so its inner spine is centered on the existing side-rail divider.
- Cropped the blank top area of the supplied paper texture and moved the periodical heading upward.

## Continuous periodical paper
- Replaced the repeating loose-leaf background with one continuous sheet stretched across the full article height, eliminating the horizontal join in the middle of the reading area.

## Periodical type and source links
- Set all typography within the periodical reading view in Georgia and increased the article body size for sustained reading.
- Made each periodical title an external source link; it opens the corresponding original article in a new tab.

## Shared horizontal measure
- Aligned the Inquire Lab resource rail and reading workspace to the same outer width and left/right edges as the navigation bar.

## Full-workspace paper background
- Moved the continuous loose-leaf background from the right content column to the full Inquire workspace, so it covers every vertical segment and reaches the right edge.
- Positioned the paper spine at the side-rail divider rather than creating a separate texture boundary within the reading column.

## Full-width paper tone
- Removed the opaque light wash from the publication container so the loose-leaf paper tone remains visible continuously through the right edge shared with the navigation.

## Full paper image coverage
- Extended the supplied loose-leaf image itself across the entire right reading area, replacing the plain white fallback while retaining the spine's rail alignment.

## Cleaned source image and rail transition
- Replaced the periodical background with a cleaned version that removes the Xiaohongshu logo and watermark.
- Kept the reading-path header, Education, and Technology entries on the archive's dotted ground; the loose-leaf treatment now begins after “Should the Robots Be Taxed?”.

## Paper-free archive rail
- Removed the loose-leaf background from the entire left side of the workspace divider; the archive rail now stays on the dotted archive ground throughout.

## Dotted fill for uncovered workspace areas
- Filled every area outside the loose-leaf image with the same warm dotted archive ground, eliminating remaining plain white gaps.

## Binding-gutter cleanup
- Covered the source image's white binding gutter with the archive's dotted ground, while retaining the vertical rail divider.
