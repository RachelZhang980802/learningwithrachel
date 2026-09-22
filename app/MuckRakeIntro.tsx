"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ThenNowSystem } from "./ThenNowSystem";
import { UniversityMottos } from "./UniversityMottos";
import { AmericanConstitution } from "./AmericanConstitution";

type MuckRakeIntroProps = {
  onBack: () => void;
  onReadText: () => void;
};

type MeaningLayer = 1 | 2 | 3;
type ModernStage = "roosevelt" | "roosevelt-explained" | "cartoon" | "question" | "answer" | "summary";
type SteffensTopic = "portrait" | "investigation" | "then-now";
type ModuleTab = "steffens" | "mottos" | "constitution";

export function MuckRakeIntro({ onBack, onReadText }: MuckRakeIntroProps) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [steffensTopic, setSteffensTopic] = useState<SteffensTopic>("portrait");
  const [moduleTab, setModuleTab] = useState<ModuleTab>("steffens");
  const [openMeaning, setOpenMeaning] = useState<MeaningLayer | null>(null);
  const [objectRevealed, setObjectRevealed] = useState(false);
  const [metaphorExplained, setMetaphorExplained] = useState(false);
  const [modernStage, setModernStage] = useState<ModernStage>("roosevelt");
  const [rooseveltQuestionsOpen, setRooseveltQuestionsOpen] = useState(false);
  const [farmerHint, setFarmerHint] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const portraitScrollPosition = useRef(0);

  useEffect(() => {
    if (!archiveOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (zoomImage?.includes("cartoon")) {
        setZoomImage(null);
        setModernStage("question");
      }
      else if (zoomImage) setZoomImage(null);
      else setOpenMeaning(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [archiveOpen, zoomImage]);

  const toggleMeaning = (layer: MeaningLayer) => {
    setOpenMeaning((current) => current === layer ? null : layer);
  };

  const closeCartoon = () => {
    setZoomImage(null);
    setModernStage("question");
  };

  const openInvestigation = () => {
    setModuleTab("steffens");
    setSteffensTopic("investigation");
    setOpenMeaning(null);
  };

  const openThenNow = () => {
    setModuleTab("steffens");
    portraitScrollPosition.current = window.scrollY;
    setSteffensTopic("then-now");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    });
  };

  const returnToPortrait = () => {
    setModuleTab("steffens");
    setSteffensTopic("portrait");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.scrollTo({ top: portraitScrollPosition.current, behavior: "auto" }));
    });
  };

  if (!archiveOpen) {
    return (
      <main className="muck-rake-intro muck-rake-cover-only">
        <button
          type="button"
          className="muck-rake-cover-trigger"
          onClick={() => setArchiveOpen(true)}
          aria-label="Open the Lincoln Steffens introduction"
        >
          <span>Open the investigation</span>
        </button>
      </main>
    );
  }

  return (
    <main className="muck-rake-intro muck-rake-archive-open">
      <nav className="muck-rake-intro-nav" aria-label="Introduction navigation">
        <button type="button" onClick={onBack}>← Library</button>
        <button type="button" className="skip-introduction" onClick={onReadText}>
          Skip introduction <span aria-hidden="true">→</span> Read the text
        </button>
      </nav>

      <section className="muck-rake-activity" aria-labelledby={steffensTopic === "portrait" ? "steffens-life-portrait-title" : "muck-rake-investigation-title"}>
        <nav className="muck-rake-module-nav" aria-label="Author introduction sections">
          <div className="muck-rake-module-links">
            <button type="button" className={moduleTab === "steffens" ? "is-active" : ""} aria-current={moduleTab === "steffens" ? "page" : undefined} onClick={() => setModuleTab("steffens")}>About Lincoln Steffens</button>
            <button type="button" className={moduleTab === "mottos" ? "is-active" : ""} aria-current={moduleTab === "mottos" ? "page" : undefined} onClick={() => setModuleTab("mottos")}>University Mottoes</button>
            <button type="button" className={moduleTab === "constitution" ? "is-active" : ""} aria-current={moduleTab === "constitution" ? "page" : undefined} onClick={() => setModuleTab("constitution")}>American Constitution</button>
          </div>
          <figure className={`muck-rake-nav-cat ${openMeaning ? "is-curious" : ""}`} aria-label="The first article’s gray-and-white tabby cat">
            <img
              src="/media/cat-blackwhite-extended-doctoral.png?v=1"
              alt="The gray-and-white tabby cat from the first article, wearing its doctoral cap"
              width="1007"
              height="1504"
            />
          </figure>
        </nav>

        {moduleTab === "steffens" && <nav className="muck-rake-subnav" aria-label="Lincoln Steffens introduction topics">
          <button
            type="button"
            className={steffensTopic === "portrait" ? "is-active" : ""}
            aria-current={steffensTopic === "portrait" ? "page" : undefined}
            onClick={() => setSteffensTopic("portrait")}
          >
            A Life Portrait
          </button>
          <button
            type="button"
            className={steffensTopic === "investigation" ? "is-active" : ""}
            aria-current={steffensTopic === "investigation" ? "page" : undefined}
            onClick={openInvestigation}
          >
            Investigation of “Muck-rake”
          </button>
          <button
            type="button"
            className={steffensTopic === "then-now" ? "is-active" : ""}
            aria-current={steffensTopic === "then-now" ? "page" : undefined}
            onClick={openThenNow}
          >
            Then and Now
          </button>
        </nav>}

        {moduleTab === "mottos" ? <UniversityMottos /> : moduleTab === "constitution" ? <AmericanConstitution /> : steffensTopic === "then-now" ? <ThenNowSystem onBackToPortrait={returnToPortrait} onReadText={onReadText} /> : steffensTopic === "portrait" ? (
          <LifePortrait onOpenInvestigation={openInvestigation} onOpenThenNow={openThenNow} />
        ) : (
        <section className="muck-rake-investigation-paper">
          <header className="muck-rake-investigation-heading">
            <p>ABOUT LINCOLN STEFFENS · WORD FILE</p>
            <h1 id="muck-rake-investigation-title">What does <em>muck-rake</em> mean?</h1>
            <span>Open each clue, then click the evidence to continue.</span>
          </header>

          <div className="muck-rake-meaning-list">
            <MeaningItem
              id={1}
              eyebrow="01 · THE OBJECT"
              title="muck + rake"
              expanded={openMeaning === 1}
              onToggle={() => toggleMeaning(1)}
            >
              <div className="muck-rake-meaning-copy literal-meaning">
                <div className="muck-rake-word-parts" aria-label="The meanings of muck and rake">
                  <div><strong>muck</strong><span>dirt · filth · waste</span><small>污物、淤泥、肮脏的东西</small></div>
                  <b aria-hidden="true">+</b>
                  <div><strong>rake</strong><span>a tool used to gather or clear material</span><small>耙子；用耙子聚拢或清理东西</small></div>
                </div>
                <p className="muck-rake-result"><span>muck</span> + <span>rake</span> → <strong>muck-rake</strong></p>
                <button
                  type="button"
                  className="muck-rake-definition muck-rake-evidence-trigger"
                  onClick={() => setObjectRevealed((value) => !value)}
                  aria-expanded={objectRevealed}
                  aria-controls="muck-rake-object-image"
                >
                  A tool for gathering or scraping up dirt. <span aria-hidden="true">{objectRevealed ? "−" : "+"}</span>
                </button>
                <figure id="muck-rake-object-image" className="muck-rake-object-evidence" hidden={!objectRevealed}>
                  <img src="/media/muck-rake-object-cutout.png" alt="A complete hand-drawn rake with a wooden handle and metal tines" width="1402" height="1122" />
                </figure>
              </div>
            </MeaningItem>

            <MeaningItem
              id={2}
              eyebrow="02 · THE METAPHOR"
              title="the Man with the Muck-rake"
              expanded={openMeaning === 2}
              onToggle={() => toggleMeaning(2)}
            >
              <div className="muck-rake-meaning-copy metaphor-meaning">
                <button
                  type="button"
                  className="muck-rake-image-evidence bunyan-evidence"
                  onClick={() => setMetaphorExplained(true)}
                  aria-expanded={metaphorExplained}
                  aria-controls="bunyan-metaphor-explanation"
                >
                  <img src="/media/bunyan-man-with-muck-rake.png" alt="The Man with the Muck-rake and a quotation from The Pilgrim's Progress" width="600" height="370" />
                  <span>{metaphorExplained ? "The clue is open" : "Click the image to read the clue"}</span>
                </button>
                <div id="bunyan-metaphor-explanation" className="muck-rake-click-reveal" hidden={!metaphorExplained}>
                  <p>In John Bunyan’s <em>The Pilgrim’s Progress</em>, the man keeps his eyes fixed on the ground, raking through dirt.</p>
                  <p>Even when something more valuable is offered to him, he does not look up.</p>
                  <div className="muck-rake-symbol-shift"><span>physical dirt</span><b aria-hidden="true">→</b><span>what is low, base, or corrupt</span></div>
                  <p className="muck-rake-definition">The problem is not simply the muck. It is seeing nothing but muck.</p>
                  <p className="muck-rake-definition">The muck-rake here functions as an allegorical symbol of worldly obsession. The man’s downward gaze represents spiritual blindness: absorbed in trivial earthly concerns, he becomes incapable of recognizing higher moral and spiritual values.</p>
                </div>
              </div>
            </MeaningItem>

            <MeaningItem
              id={3}
              eyebrow="03 · THE MODERN WORD"
              title="muckraker"
              expanded={openMeaning === 3}
              onToggle={() => toggleMeaning(3)}
            >
              <div className="muck-rake-meaning-copy modern-meaning">
                {(modernStage === "roosevelt" || modernStage === "roosevelt-explained") && (
                  <div className="modern-evidence-step">
                    <button
                      type="button"
                      className="muck-rake-image-evidence roosevelt-evidence"
                      onClick={() => setModernStage("roosevelt-explained")}
                      aria-expanded={modernStage === "roosevelt-explained"}
                    >
                      <img src="/roosevelt-muck-rake-quotation.png" alt="Theodore Roosevelt and his quotation about the men with the muck-rake" width="651" height="307" />
                      <span>{modernStage === "roosevelt" ? "Click the quotation to examine Roosevelt’s warning" : "Roosevelt’s clue is open"}</span>
                    </button>
                    {modernStage === "roosevelt-explained" && (
                      <div className="muck-rake-click-reveal">
                        <div className="muck-rake-guiding-questions" role="group" aria-label="Questions about Roosevelt’s warning">
                          <button type="button" onClick={() => setRooseveltQuestionsOpen((value) => !value)} aria-expanded={rooseveltQuestionsOpen}>
                            <span>Why might these people be “indispensable”?</span>
                            <span aria-hidden="true">{rooseveltQuestionsOpen ? "−" : "+"}</span>
                          </button>
                          <button type="button" onClick={() => setRooseveltQuestionsOpen((value) => !value)} aria-expanded={rooseveltQuestionsOpen}>
                            <span>What kind of “muck” are they uncovering?</span>
                            <span aria-hidden="true">{rooseveltQuestionsOpen ? "−" : "+"}</span>
                          </button>
                        </div>
                        {rooseveltQuestionsOpen && <p className="muck-rake-roosevelt-answer">Roosevelt valued muckrakers when they exposed genuine corruption, but criticized them when their constant search for scandal became sensational, one-sided, and destructive.</p>}
                        <button type="button" className="muck-rake-inline-next" onClick={() => setModernStage("cartoon")}>Follow the word <span aria-hidden="true">→</span></button>
                      </div>
                    )}
                  </div>
                )}

                {modernStage === "cartoon" && (
                  <div className="modern-evidence-step">
                    <button type="button" className="muck-rake-image-evidence cartoon-evidence" onClick={() => setZoomImage("/media/muckrakers-corruption-cartoon.png")}>
                      <img src="/media/muckrakers-corruption-cartoon.png" alt="A color cartoon showing muckrakers confronting corruption" width="1024" height="699" />
                      <span>Read the picture first. Click to look closely.</span>
                    </button>
                  </div>
                )}

                {modernStage === "question" && (
                  <div className="muck-rake-inference-step">
                    <p>These people are not gathering ordinary dirt. What are they trying to uncover?</p>
                    <h3>The cartoon calls them “muckrakers.”<br />What real-world job investigates hidden wrongdoing and reports it to the public?</h3>
                    <div className="muck-rake-choice-row">
                      <button type="button" onClick={() => setFarmerHint(true)}>a farmer</button>
                      <button type="button" onClick={() => setModernStage("answer")}>a journalist</button>
                    </div>
                    {farmerHint && <p className="muck-rake-farmer-hint">Look again. Are they gathering ordinary dirt—or exposing corruption?</p>}
                    <button type="button" className="muck-rake-inline-back" onClick={() => setModernStage("cartoon")}>← Look at the cartoon again</button>
                  </div>
                )}

                {modernStage === "answer" && (
                  <div className="muck-rake-answer-step">
                    <p className="muck-rake-definition">They investigate hidden problems and report what they find to the public.</p>
                    <div className="muck-rake-symbol-shift"><span>muck-rake</span><b aria-hidden="true">→</b><strong>muckraker</strong><b aria-hidden="true">→</b><span>investigative journalist</span></div>
                    <p>A muckraker is a journalist who investigates and exposes corruption, abuse, or wrongdoing.</p>
                    <button type="button" className="muck-rake-inline-next" onClick={() => setModernStage("summary")}>See the whole story <span aria-hidden="true">→</span></button>
                  </div>
                )}

                {modernStage === "summary" && (
                  <div className="muck-rake-summary-step">
                    <p className="muck-rake-summary-label">SUMMARY · FROM TOOL TO PUBLIC WATCHDOG</p>
                    <button type="button" className="muck-rake-image-evidence timeline-evidence" onClick={() => setZoomImage("/media/century-of-muckraking-timeline.png")}>
                      <img src="/media/century-of-muckraking-timeline.png" alt="A Century of Muckraking timeline showing key moments from 1903 to 2000" width="1000" height="599" />
                      <span>Click the timeline to look closely</span>
                    </button>
                    <p className="muck-rake-summary-sentence">A literal rake became a metaphor, then a name for journalism that exposes wrongdoing in public life.</p>
                  </div>
                )}
              </div>
            </MeaningItem>
          </div>
        </section>
        )}

        <footer className="muck-rake-archive-footer">
          <button type="button" onClick={onReadText}>Read the text <span aria-hidden="true">→</span></button>
        </footer>
      </section>

      {zoomImage && (
        <div className="muck-rake-image-modal" role="dialog" aria-modal="true" aria-label="Enlarged evidence image" onClick={zoomImage.includes("cartoon") ? closeCartoon : () => setZoomImage(null)}>
          <button type="button" className="muck-rake-modal-close" onClick={zoomImage.includes("cartoon") ? closeCartoon : () => setZoomImage(null)} aria-label="Close enlarged image">×</button>
          <img src={zoomImage} alt="Enlarged historical evidence" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </main>
  );
}

function LifePortrait({ onOpenInvestigation, onOpenThenNow }: { onOpenInvestigation: () => void; onOpenThenNow: () => void }) {
  return (
    <section className="steffens-life-portrait" aria-labelledby="steffens-life-portrait-title">
      <header className="steffens-school-history">
        <span className="steffens-school-mark" role="img" aria-label="University archive">🏛︎</span>
        <p>SCHOOL HISTORY</p>
        <h1 id="steffens-life-portrait-title">Lincoln Steffens</h1>
      </header>

      <section className="steffens-need-to-know" aria-labelledby="steffens-need-title">
        <h2 id="steffens-need-title"><span aria-hidden="true">01</span> WHAT YOU NEED TO KNOW</h2>
        <ul>
          <li>Early life and career</li>
          <li>
            <button type="button" onClick={onOpenInvestigation}>
              a muckraker <span aria-hidden="true">→</span>
            </button>
          </li>
          <li>Investigative publications and other works</li>
          <li>Campaigns for the McNamara brothers and the Russian Revolution</li>
          <li>Autobiography and later life</li>
        </ul>
      </section>

      <section className="steffens-fact-file" aria-labelledby="steffens-fact-file-title">
        <div className="steffens-fact-file-heading">
          <h2 id="steffens-fact-file-title"><span aria-hidden="true">02</span> FACT FILE</h2>
          <p>Let’s know more about Lincoln Steffens.</p>
        </div>
        <div className="steffens-fact-file-grid">
          <figure>
            <img
              src="/media-local/lincoln-steffens-news-background.webp"
              alt="A pencil portrait of Lincoln Steffens"
              width="1254"
              height="1254"
            />
            <figcaption>Lincoln Steffens · 1866–1936</figcaption>
          </figure>
          <div className="steffens-fact-copy">
            <p>Lincoln Steffens was an American investigative journalist and one of the best-known muckrakers of the Progressive Era.</p>
            <p>
              He specialised in investigating corruption in government, which he detailed in articles later collected in his famous work,{" "}
              <button type="button" className="steffens-case-file-link" onClick={onOpenThenNow} aria-label="Open the Then and Now case file for The Shame of the Cities">
                <em>The Shame of the Cities</em>
                <span>open the case file →</span>
              </button>
              .
            </p>
            <p>He also reported on the Mexican and Russian Revolutions. Later in life, he turned to autobiography; his account became a bestseller.</p>
          </div>
        </div>
      </section>
    </section>
  );
}

function MeaningItem({ id, eyebrow, title, expanded, onToggle, children }: {
  id: MeaningLayer;
  eyebrow: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <article className={`muck-rake-meaning-item ${expanded ? "is-open" : ""}`}>
      <button
        type="button"
        className="muck-rake-meaning-trigger"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`muck-rake-meaning-${id}`}
      >
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        <b aria-hidden="true">{expanded ? "−" : "+"}</b>
      </button>
      <div id={`muck-rake-meaning-${id}`} className="muck-rake-meaning-panel" hidden={!expanded}>{children}</div>
    </article>
  );
}
