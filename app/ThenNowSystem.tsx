"use client";

import { useEffect, useState } from "react";

type ThenNowSystemProps = {
  onBackToPortrait: () => void;
  onReadText: () => void;
};

type ThenNowView = "system" | "minneapolis" | "today";

const systemNotes = [
  { number: 1, title: "BUSINESS INTERESTS", copy: "Corporations, contractors and illegal businesses sought profit, public contracts or protection.", from: "BUSINESS INTERESTS", exchange: "MONEY · BRIBES · POLITICAL SUPPORT", to: "POLITICIANS & CITY COUNCILS", arrow: "→" },
  { number: 2, title: "POLITICIANS & CITY COUNCILS", copy: "Political leaders exchanged public power for private support and personal gain.", from: "POLITICIANS & CITY COUNCILS", exchange: "APPOINTMENTS · CONTRACTS · FRANCHISES", to: "POLICE & MUNICIPAL INSTITUTIONS", arrow: "↓" },
  { number: 3, title: "POLICE & MUNICIPAL INSTITUTIONS", copy: "Public institutions enforced the arrangement through protection, selective policing and administrative power.", from: "POLICE & MUNICIPAL INSTITUTIONS", exchange: "PROTECTION · SELECTIVE ENFORCEMENT · ACCESS", to: "PRIVATE INTERESTS", arrow: "←" },
  { number: 4, title: "PRIVATE PROFIT", copy: "The profits created by the arrangement flowed back into the political machine and helped preserve its power.", from: "PRIVATE PROFIT", exchange: "MONEY & SUPPORT RETURN", to: "THE POLITICAL MACHINE", arrow: "↺" },
] as const;

const caseEvidence = [
  { number: 1, tab: "THE APPOINTMENT", title: "Who controlled the police?", from: "MAYOR A. A. ‘DOC’ AMES", exchange: "APPOINTED HIS BROTHER", to: "FRED W. AMES · CHIEF OF POLICE", copy: "Mayor Ames placed his brother Fred in charge of the police department. Control of public enforcement became the starting point of the scheme.", note: "public office → family appointment → police control" },
  { number: 2, tab: "THE ORGANIZATION", title: "How was the business organized?", from: "POLICE CONTROL", exchange: "SELECTED · DIRECTED · ORGANIZED", to: "COLLECTORS & PROTECTED OPERATORS", copy: "Trusted officers and intermediaries supervised gambling, swindling and protection payments. Police authority supplied the organization that ordinary crime lacked.", note: "the institution becomes part of the operation" },
  { number: 3, tab: "FOLLOW THE MONEY", title: "Who paid whom—and for what?", from: "ILLEGAL OPERATORS", exchange: "CASH · FEES · PAYOFFS", to: "POLICE COLLECTORS", copy: "Illegal businesses and swindlers paid for permission, protection or freedom from interference. The payments were not random: they followed an organized route.", note: "money enters the municipal system" },
  { number: 4, tab: "THE PROTECTION", title: "What did the payments buy?", from: "POLICE POWER", exchange: "WARNING · PROTECTION · SELECTIVE ENFORCEMENT", to: "ILLEGAL OPERATORS", copy: "Police power could warn operators, discourage complaints and apply the law selectively. Parts of the institution were being used to make crime profitable.", note: "public power flows back as private protection" },
  { number: 5, tab: "THE RETURN", title: "How did the arrangement preserve itself?", from: "ILLEGAL PROFIT", exchange: "PAYOFFS · POLITICAL SUPPORT", to: "THE AMES MACHINE", copy: "Protection enabled more illegal profit. Part of that money moved upward through the organization, helping the same political and police arrangement continue.", note: "profit → payoff → power → protection → more profit" },
  { number: 6, tab: "THE EXPOSURE", title: "How was the loop broken?", from: "TESTIMONY & RECORDS", exchange: "INVESTIGATION · GRAND JURY", to: "INDICTMENTS", copy: "In 1902, a grand jury led by Hovey C. Clarke gathered testimony and evidence that led to indictments against members of the Ames organization.", note: "follow the people · payments · protection · power" },
] as const;

export function ThenNowSystem({ onBackToPortrait, onReadText }: ThenNowSystemProps) {
  const [view, setView] = useState<ThenNowView>("system");
  const [started, setStarted] = useState(false);
  const [reviewedThrough, setReviewedThrough] = useState(0);
  const [openNotes, setOpenNotes] = useState<number[]>([]);
  const [loopClosed, setLoopClosed] = useState(false);
  const [caseOpened, setCaseOpened] = useState(false);
  const [openEvidence, setOpenEvidence] = useState<number | null>(null);
  const [reviewedEvidence, setReviewedEvidence] = useState(0);
  const [caseLoopClosed, setCaseLoopClosed] = useState(false);

  const allConnectionsVisible = openNotes.length === 4;
  const complete = loopClosed;
  const caseComplete = reviewedEvidence >= 6;

  const toggleNote = (noteNumber: number) => {
    if (noteNumber > Math.min(4, reviewedThrough + 1)) return;
    if (openNotes.includes(noteNumber)) setLoopClosed(false);
    setOpenNotes((current) => current.includes(noteNumber) ? current.filter((number) => number !== noteNumber) : [...current, noteNumber]);
    setReviewedThrough((current) => Math.max(current, noteNumber));
  };

  const toggleEvidence = (number: number) => {
    const unlockedThrough = caseLoopClosed ? Math.min(6, reviewedEvidence + 1) : Math.min(5, reviewedEvidence + 1);
    if (number > unlockedThrough) return;
    setOpenEvidence((current) => current === number ? null : number);
    setReviewedEvidence((current) => Math.max(current, number));
  };

  const openMinneapolis = () => {
    setView("minneapolis");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const openMinnesotaToday = () => {
    setView("today");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const returnFromCase = () => {
    setView(view === "today" ? "minneapolis" : "system");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  useEffect(() => {
    if (!allConnectionsVisible || loopClosed) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setLoopClosed(true), reducedMotion ? 0 : 760);
    return () => window.clearTimeout(timer);
  }, [allConnectionsVisible, loopClosed]);

  useEffect(() => {
    if (reviewedEvidence < 5 || caseLoopClosed) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setCaseLoopClosed(true), reducedMotion ? 0 : 720);
    return () => window.clearTimeout(timer);
  }, [reviewedEvidence, caseLoopClosed]);

  const activeEvidence = openEvidence ? caseEvidence[openEvidence - 1] : null;

  return (
    <section className={`then-now-system ${view !== "system" ? "is-case-view" : ""}`} aria-labelledby="then-now-title">
      <nav className="then-now-topbar" aria-label="Then and Now navigation">
        <button type="button" onClick={view === "system" ? onBackToPortrait : returnFromCase}>{view === "today" ? "← The Case" : view === "minneapolis" ? "← The System" : "← A Life Portrait"}</button>
        <p>THEN &amp; NOW · {view === "today" ? "03" : view === "minneapolis" ? "02" : "01"} / 03</p>
        <button type="button" onClick={onReadText}>Skip <span aria-hidden="true">→</span> Read the text</button>
      </nav>

      <header className="then-now-header">
        <p>{view === "today" ? "MINNESOTA TODAY" : view === "minneapolis" ? "THE CASE · MINNEAPOLIS" : "THEN & NOW"}</p>
        <h1 id="then-now-title"><em>The Shame of the Cities</em></h1>
        <h2>{view === "today" ? "Contemporary reporting and public records" : view === "minneapolis" ? "What happens when policing becomes a business?" : "How does corruption become a system?"}</h2>
        <figure className={`then-now-cat ${reviewedThrough || reviewedEvidence ? "is-alert" : ""}`} aria-label="The first article’s doctoral-cap cat">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/cat-blackwhite-extended-doctoral.png?v=1" alt="The gray-and-white tabby cat wearing its doctoral cap" width="1007" height="1504" />
        </figure>
      </header>

      {view === "system" ? (
        <SystemCanvas started={started} setStarted={setStarted} reviewedThrough={reviewedThrough} openNotes={openNotes} toggleNote={toggleNote} allConnectionsVisible={allConnectionsVisible} complete={complete} onOpenCase={openMinneapolis} />
      ) : view === "minneapolis" ? (
        <section className="then-now-canvas minneapolis-case-canvas" aria-live="polite">
          {!caseOpened ? (
            <button type="button" className="minneapolis-case-folder" onClick={() => setCaseOpened(true)}>
              <span>CASE FILE · 1901–1902</span>
              <strong>MINNEAPOLIS</strong>
              <em>When policing becomes a business</em>
              <figure className="minneapolis-case-map" aria-label="Map showing Minneapolis in Minnesota">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/minneapolis-location-map.png?v=1" alt="Map of the continental United States with Minneapolis marked in Minnesota" width="1484" height="1060" />
              </figure>
              <small>click to break the seal</small>
            </button>
          ) : (
            <div className="minneapolis-case-file">
              <header className="minneapolis-case-opening">
                <p>What happens when the institution meant to stop crime begins to organize—and profit from it?</p>
                <span>Open the evidence tabs in order. Click an open tab again to close it.</span>
              </header>

              <div className="minneapolis-evidence-workspace">
                <nav className="minneapolis-evidence-tabs" aria-label="Minneapolis case evidence">
                  {caseEvidence.map((evidence) => {
                    const unlocked = evidence.number <= Math.min(6, reviewedEvidence + 1) && (evidence.number < 6 || caseLoopClosed);
                    const active = openEvidence === evidence.number;
                    const reviewed = evidence.number <= reviewedEvidence;
                    return (
                      <button type="button" key={evidence.number} className={`${active ? "is-active" : ""} ${reviewed ? "is-reviewed" : ""}`} onClick={() => toggleEvidence(evidence.number)} disabled={!unlocked} aria-expanded={active} aria-controls={`minneapolis-evidence-${evidence.number}`}>
                        <span>0{evidence.number}</span><strong>{evidence.tab}</strong><small>{active ? "close file" : reviewed ? "reopen file" : unlocked ? "open file" : "sealed"}</small>
                      </button>
                    );
                  })}
                </nav>

                <section className={`minneapolis-evidence-paper ${activeEvidence ? "is-visible" : ""}`} aria-live="polite">
                  {activeEvidence ? (
                    <article id={`minneapolis-evidence-${activeEvidence.number}`}>
                      <span>EVIDENCE 0{activeEvidence.number}</span>
                      <h3>{activeEvidence.title}</h3>
                      <div className="minneapolis-primary-flow" aria-label={`${activeEvidence.from} gives ${activeEvidence.exchange} to ${activeEvidence.to}`}>
                        <b>{activeEvidence.from}</b>
                        <div><small>WHO GIVES WHAT TO WHOM?</small><strong>{activeEvidence.exchange}</strong><i aria-hidden="true">→</i></div>
                        <b>{activeEvidence.to}</b>
                      </div>
                      <p>{activeEvidence.copy}</p>
                      <em>{activeEvidence.note}</em>
                    </article>
                  ) : <p className="minneapolis-evidence-rest">Choose an unlocked evidence tab to place it on the desk.</p>}
                </section>
              </div>

              {caseLoopClosed && (
                <section className="minneapolis-loop-result">
                  <div className="minneapolis-loop-line" aria-label="Illegal operations feed money to the Ames machine, which returns police protection to illegal operations">
                    <span>ILLEGAL OPERATIONS</span><b>money &amp; payoffs →</b><span>THE AMES MACHINE</span><b>police protection →</b><span>MORE ILLEGAL PROFIT</span><b className="return-line">↺ money returns</b>
                  </div>
                  <div className="minneapolis-case-stamp">CRIME AS A<br />MUNICIPAL BUSINESS</div>
                  <p>This was not a collection of isolated crimes. Public authority, police protection and illegal profit had been organized into a system that fed itself.</p>
                  <em>The institution meant to enforce the law had become part of the transaction.</em>
                </section>
              )}

              {caseComplete && <section className="minneapolis-case-ending"><p>Steffens followed the same trail: people, payments, protection and power.</p><button type="button" onClick={openMinnesotaToday}>NEXT FILE · MINNESOTA TODAY <span aria-hidden="true">→</span></button></section>}
            </div>
          )}
        </section>
      ) : (
        <section className="then-now-canvas minnesota-today-canvas" aria-label="Minnesota Today sources">
          <div className="minnesota-today-images">
            <a href="https://www.startribune.com/nuway-kickbacks/601381135" target="_blank" rel="noreferrer" aria-label="Open Minnesota Star Tribune reporting on Nuway kickbacks">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/minnesota-today-nuway.png?v=1" alt="Minnesota Star Tribune report on a Medicaid kickback settlement" width="1974" height="904" />
              <span>Open reporting · Minnesota Star Tribune ↗</span>
            </a>
            <a href="https://en.wikipedia.org/wiki/2020s_Minnesota_fraud_scandals" target="_blank" rel="noreferrer" aria-label="Open overview of 2020s Minnesota fraud scandals">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/minnesota-today-fraud-scandals.png?v=1" alt="Overview page for 2020s Minnesota fraud scandals" width="1874" height="1338" />
              <span>Open overview · 2020s Minnesota fraud scandals ↗</span>
            </a>
          </div>
        </section>
      )}

      <footer className="then-now-source">
        <a href="https://www.gutenberg.org/files/54710/54710-h/54710-h.htm" target="_blank" rel="noreferrer">Source · Lincoln Steffens, <em>The Shame of the Cities</em> (1904)</a>
        {view === "minneapolis" && <a href="https://www.mnhs.org/mnopedia/search/index/person/ames-albert-alonzo-doc-1842-1911" target="_blank" rel="noreferrer">Historical context · Minnesota Historical Society</a>}
      </footer>
    </section>
  );
}

type SystemCanvasProps = {
  started: boolean;
  setStarted: (value: boolean) => void;
  reviewedThrough: number;
  openNotes: number[];
  toggleNote: (number: number) => void;
  allConnectionsVisible: boolean;
  complete: boolean;
  onOpenCase: () => void;
};

function SystemCanvas({ started, setStarted, reviewedThrough, openNotes, toggleNote, allConnectionsVisible, complete, onOpenCase }: SystemCanvasProps) {
  return (
    <section className="then-now-canvas" aria-live="polite">
      {!started ? (
        <article className="then-now-opening-note">
          <p>Steffens did not investigate corruption as a series of isolated crimes. He followed the network that allowed corruption to become normal.</p>
          <button type="button" onClick={() => setStarted(true)}>Follow the money <span aria-hidden="true">↓</span></button>
        </article>
      ) : (
        <>
          <div className={`then-now-note-network ${allConnectionsVisible ? "is-loop-closed" : ""} ${complete ? "is-complete" : ""}`}>
            {systemNotes.map((note) => {
              const isOpen = openNotes.includes(note.number);
              const unlocked = note.number <= Math.min(4, reviewedThrough + 1);
              return (
                <div className={`then-now-node-group node-${note.number} ${isOpen ? "is-open" : ""} ${unlocked ? "is-unlocked" : "is-locked"}`} key={note.number}>
                  <button type="button" className="then-now-note" onClick={() => toggleNote(note.number)} disabled={!unlocked} aria-expanded={isOpen} aria-label={`${note.title}. ${isOpen ? "Hide explanation and exchange" : "Show explanation and exchange"}`}>
                    <span>NOTE 0{note.number}</span><strong>{note.title}</strong><span className="then-now-note-action">{isOpen ? "click to close" : unlocked ? "click to open" : "follow the previous arrow first"}</span>
                    <span className={`then-now-note-detail ${isOpen ? "is-visible" : ""}`} aria-hidden={!isOpen}><span><span className="then-now-note-copy">{note.copy}</span></span></span>
                  </button>
                  <div className={`then-now-connector connector-${note.number} ${isOpen ? "is-visible" : ""}`} aria-hidden={!isOpen}>
                    <span className="then-now-flow-from">FROM {note.from}</span><strong>{note.exchange}</strong><span className="then-now-flow-to">TO {note.to}</span><b aria-hidden="true">{note.arrow}</b>
                  </div>
                </div>
              );
            })}
            {complete && <div className="then-now-system-result"><p className="then-now-loop-realization">This is not a chain.<br /><strong>It feeds itself.</strong></p><div className="then-now-corruption-stamp">INSTITUTIONALIZED<br />CORRUPTION</div></div>}
          </div>

          {complete && (
            <>
              <section className="then-now-system-summary"><p className="then-now-conclusion">Corruption became part of the way the city operated—not merely an occasional crime committed by an individual.</p><p className="then-now-margin-note">Public indifference allows the system to continue.</p></section>
              <section className="then-now-case-question"><h3>What did this system look like in Minneapolis?</h3><button type="button" onClick={onOpenCase}>OPEN CASE FILE · MINNEAPOLIS <span aria-hidden="true">→</span></button></section>
            </>
          )}
        </>
      )}
    </section>
  );
}
