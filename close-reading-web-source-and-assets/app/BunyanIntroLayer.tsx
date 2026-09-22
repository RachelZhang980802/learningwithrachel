type BunyanLayer = 6 | 7 | 8 | 9 | 10;

type BunyanIntroLayerProps = {
  layer: BunyanLayer;
  bookNoteOpen: boolean;
  onToggleBookNote: () => void;
  sceneStep: 0 | 1 | 2;
  onAdvanceScene: () => void;
  meaningRevealed: boolean;
  onRevealMeaning: () => void;
};

export function BunyanIntroLayer({
  layer,
  bookNoteOpen,
  onToggleBookNote,
  sceneStep,
  onAdvanceScene,
  meaningRevealed,
  onRevealMeaning,
}: BunyanIntroLayerProps) {
  if (layer === 6) {
    return (
      <div className="muck-rake-layer-content bunyan-author-layer">
        <p className="layer-eyebrow">STEP 02 · JOHN BUNYAN · 01</p>
        <div className="bunyan-author-file">
          <span className="bunyan-file-label">an old storyteller</span>
          <h2>John Bunyan</h2>
          <p>1628–1688</p>
          <small>English writer · allegorical storyteller</small>
        </div>
        <p className="bunyan-bridge-note">
          Long before the word described a journalist, Bunyan imagined a man who never stopped looking down.
        </p>
      </div>
    );
  }

  if (layer === 7) {
    return (
      <div className="muck-rake-layer-content bunyan-book-layer">
        <p className="layer-eyebrow">STEP 02 · JOHN BUNYAN · 02</p>
        <div className="bunyan-book-spread">
          <div className="bunyan-book-cover" aria-label="The Pilgrim's Progress by John Bunyan">
            <span>John Bunyan</span>
            <strong>The Pilgrim’s<br />Progress</strong>
            <small>PART II</small>
          </div>
          <div className="bunyan-book-copy">
            <p>In Part II of his book, Bunyan places a strange figure inside the Interpreter’s room.</p>
            <button
              type="button"
              className="bunyan-keyword"
              aria-expanded={bookNoteOpen}
              aria-controls="bunyan-allegory-note"
              onClick={onToggleBookNote}
            >
              allegory
            </button>
            {bookNoteOpen && (
              <aside id="bunyan-allegory-note" className="bunyan-allegory-note">
                <strong>allegory</strong>
                <span>a story in which people and objects carry a deeper meaning</span>
                <small lang="zh-CN">寓言式叙事：人物和物件指向更深层的含义</small>
              </aside>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (layer === 8) {
    return (
      <div className="muck-rake-layer-content bunyan-scene-layer">
        <p className="layer-eyebrow">STEP 02 · JOHN BUNYAN · 03</p>
        <figure className="bunyan-scene-paper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/bunyan-man-with-muck-rake.webp"
            alt="A man looking downward while raking straw and dust as a celestial crown is offered above him"
            width="1536"
            height="1024"
          />
        </figure>
        <div className="bunyan-scene-discovery" aria-live="polite">
          {sceneStep === 0 && (
            <button type="button" onClick={onAdvanceScene}>
              Where are his eyes? <span aria-hidden="true">→</span>
            </button>
          )}
          {sceneStep >= 1 && (
            <p className="bunyan-scene-note note-down">
              <span>He can look no way but</span> <strong>downwards.</strong>
            </p>
          )}
          {sceneStep === 1 && (
            <button type="button" onClick={onAdvanceScene}>
              Now look above him <span aria-hidden="true">↑</span>
            </button>
          )}
          {sceneStep === 2 && (
            <p className="bunyan-scene-note note-up">
              A <strong>celestial crown</strong> is offered—but he does not look up.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (layer === 9) {
    return (
      <div className="muck-rake-layer-content bunyan-words-layer">
        <p className="layer-eyebrow">STEP 02 · JOHN BUNYAN · 04</p>
        <blockquote>
          “a man that could look no way but downwards, with a muck-rake in his hand.”
          <cite>John Bunyan, <em>The Pilgrim’s Progress</em>, Part II</cite>
        </blockquote>
        {!meaningRevealed ? (
          <button type="button" className="bunyan-meaning-trigger" onClick={onRevealMeaning}>
            Read beneath the surface <span aria-hidden="true">↓</span>
          </button>
        ) : (
          <aside className="bunyan-meaning-note" aria-live="polite">
            <p>The muck-rake shows a mind fixed only on earthly dirt.</p>
            <small>The crown represents something higher that the man refuses even to notice.</small>
          </aside>
        )}
      </div>
    );
  }

  return (
    <div className="muck-rake-layer-content bunyan-question-layer">
      <p className="layer-eyebrow">STEP 02 · JOHN BUNYAN · 05</p>
      <span className="bunyan-symbol-word">muck-rake</span>
      <p className="bunyan-symbol-shift">tool <span aria-hidden="true">→</span> symbol</p>
      <h2>Bunyan turns the rake into a warning about seeing only what is dirty and low.</h2>
      <p className="bunyan-next-question">Who will borrow this image and give it a new public meaning?</p>
      <p className="question-ending">To be continued</p>
    </div>
  );
}
