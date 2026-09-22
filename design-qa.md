# Design QA — New Yorker reading practice

## Source visual truth

- Layout reference: user-supplied New Yorker page, `/Users/mac/Downloads/IMG_3852.jpg`.
- Article image: user-supplied George Washington portrait, `public/media/george-washington-portrait.png`.

## Visual comparison

- The article uses an editorial masthead, serif display title, fine rule, portrait-led left column, and balanced multi-column body text to follow the supplied magazine reference.
- The supplied six paragraphs remain in one continuous reading page. The article container has no fixed height or internal clipping, so its lower text remains visible.
- The portrait is the supplied Washington image, not the New Yorker reference page.
- Body copy uses Georgia at a larger desktop size, the portrait is offset downward to sit around the midpoint of the article body, and five permanently visible paper-note questions follow the yellow reading prompt.

## Functional checks

- The `The Three-Fifths Compromise` trigger still opens this reading page.
- `← BACK TO PREAMBLE` returns to the original reading exercise.
- The yellow reading prompt and its answer remain visible without an expand action.
- All five questions and their A–D options are static content; no question requires an expand action.
- Each question note is independently clickable. It permanently reveals only its supplied correct answer with a visible check: D, B, C, A, and B respectively.

## Final result

passed
