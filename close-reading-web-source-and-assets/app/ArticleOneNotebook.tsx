"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import classification from "../public/sentence-badges/article01-classification.json";
import "./article-one-notebook.css";

export type NotebookPanel = "words" | "structure" | "meaning" | "voice" | "context" | "translation" | "paraphrase" | "reuse";
const tabs: { id: NotebookPanel; label: string; icon: string }[] = [
  { id: "words", label: "Words", icon: "leaf" },
  { id: "structure", label: "Structure", icon: "hierarchy" },
  { id: "translation", label: "Meaning", icon: "lightbulb" },
  { id: "paraphrase", label: "Practice", icon: "pencil" },
];
function category(panel: NotebookPanel | null) {
  if (panel && ["meaning", "translation", "voice", "context"].includes(panel)) return "translation";
  if (panel === "reuse") return "paraphrase";
  return panel;
}
function Icon({ name }: { name: string }) {
  return <img className="notebook-icon" src={`/sentence-studio/icons/${name}.svg`} alt="" aria-hidden="true" width="24" height="24"/>;
}

export type SentenceClassification = { type: string; badge: string; label: string; priorityLabel: string; reason: string; note: string };
export function SentenceBadge({ sentence, compact = false, entry: suppliedEntry, hideClassificationLabel = false }: { sentence: number; compact?: boolean; entry?: SentenceClassification; hideClassificationLabel?: boolean }) {
  const entry = suppliedEntry ?? classification.sentences[sentence - 1];
  if (!entry) return null;
  return <div className={`notebook-badge${compact ? " is-compact" : ""}`} data-sentence-type={entry.type}>
    <img src={`/sentence-badges/${entry.badge}-cat.png`} alt="" width={compact ? 76 : 154} height={compact ? 45 : 86}/>
    {!hideClassificationLabel && <details>
      <summary>{entry.label}<span> · {entry.priorityLabel}</span></summary>
      <div><p>{entry.reason}</p><p>{entry.note}</p><small>{classification.convention}</small></div>
    </details>}
  </div>;
}

function SentencePlayer({ sentence, hidden, audioSrc }: { sentence: number; hidden: boolean; audioSrc?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => { if (hidden) audio.current?.pause(); }, [hidden]);
  const play = async () => {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) { player.pause(); return; }
    setError(false);
    try { await player.play(); } catch { setError(true); }
  };
  return <div className="notebook-player">
    <audio ref={audio} preload="metadata" src={audioSrc ?? `/media/audio-sentences/sentence-${String(sentence).padStart(2, "0")}.mp3?v=20260827-audiofix`}
      onLoadedMetadata={() => setDuration(Number.isFinite(audio.current?.duration) ? audio.current!.duration : 0)}
      onTimeUpdate={() => setPosition(audio.current?.currentTime ?? 0)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError(true)}/>
    <button className="notebook-play" type="button" onClick={play} aria-label={playing ? "暂停原句音频" : "播放原句音频"}><Icon name={playing ? "player-pause" : "player-play"}/></button>
    <span>LISTEN</span>
    <input type="range" min="0" max={duration || 1} step="0.1" value={Math.min(position, duration || 1)} disabled={!duration} aria-label="原句音频进度" aria-valuetext={`${Math.floor(position)} / ${Math.floor(duration)} 秒`} onChange={event => { if (audio.current) { audio.current.currentTime = Number(event.target.value); setPosition(Number(event.target.value)); } }}/>
    {error && <p role="status">音频暂时无法播放，请再试一次。</p>}
  </div>;
}

/** Shared notebook frame; article-specific content and original audio remain separate. */
export function ArticleOneNotebook({ sentences, selected, paragraph, ranges, panel, onPanel, onSelect, onStep, onExit, children, articleId = "01", title = "I Become a Student", audioSrc, catSrc = "/sentence-studio/draw-cat.png", sentenceClassification, showClassificationBadge = true, suppressClassificationLabel = false }: {
  sentences: string[]; selected: number; paragraph: number; ranges: { start: number; end: number }[];
  panel: NotebookPanel | null; onPanel: (panel: NotebookPanel | null) => void;
  onSelect: (index: number) => void; onStep: (direction: -1 | 1) => void; onExit: () => void; children: ReactNode;
  articleId?: string; title?: string; audioSrc?: string; catSrc?: string; sentenceClassification?: SentenceClassification; showClassificationBadge?: boolean; suppressClassificationLabel?: boolean;
}) {
  const [drawn, setDrawn] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [catDragging, setCatDragging] = useState(false);
  const [catSaved, setCatSaved] = useState(false);
  const recent = useRef<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jumpMenu = useRef<HTMLDetailsElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const catDrag = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);
  const suppressCatClick = useRef(false);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(`close-reading-cat-position-v1:${articleId}`) || "null");
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) setCatPosition({ x: saved.x, y: saved.y });
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }
  }, [articleId]);
  const draw = () => {
    if (timer.current) return;
    const pool = Array.from({ length: 50 }, (_, i) => i + 1).filter(number => !recent.current.includes(number));
    const number = pool[Math.floor(Math.random() * pool.length)];
    setDrawing(true);
    timer.current = setTimeout(() => {
      recent.current = [...recent.current, number].slice(-7);
      setHistory([...recent.current]); setDrawn(number); setDrawing(false); timer.current = null;
    }, 480);
  };
  const clearDraws = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; recent.current = []; setHistory([]); setDrawn(null); setDrawing(false); };
  const beginCatDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    catDrag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: catPosition.x, originY: catPosition.y, moved: false };
    setCatDragging(true);
  };
  const moveCat = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = catDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const nextX = Math.max(-180, Math.min(180, drag.originX + event.clientX - drag.startX));
    const nextY = Math.max(-170, Math.min(170, drag.originY + event.clientY - drag.startY));
    if (Math.abs(nextX - drag.originX) > 3 || Math.abs(nextY - drag.originY) > 3) drag.moved = true;
    setCatPosition({ x: nextX, y: nextY });
  };
  const finishCatDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = catDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      const finalPosition = {
        x: Math.max(-180, Math.min(180, drag.originX + event.clientX - drag.startX)),
        y: Math.max(-170, Math.min(170, drag.originY + event.clientY - drag.startY)),
      };
      setCatPosition(finalPosition);
      suppressCatClick.current = true;
      try { window.localStorage.setItem(`close-reading-cat-position-v1:${articleId}`, JSON.stringify(finalPosition)); } catch {
        // Storage can be unavailable in private browsing contexts.
      }
      setCatSaved(true);
      window.setTimeout(() => setCatSaved(false), 1600);
    }
    catDrag.current = null;
    setCatDragging(false);
  };
  const resetCatPosition = () => {
    const defaultPosition = { x: 0, y: 0 };
    setCatPosition(defaultPosition);
    try { window.localStorage.removeItem(`close-reading-cat-position-v1:${articleId}`); } catch {
      // Storage can be unavailable in private browsing contexts.
    }
    setCatSaved(true);
    window.setTimeout(() => setCatSaved(false), 1600);
  };
  const clickCat = () => {
    if (suppressCatClick.current) { suppressCatClick.current = false; return; }
    draw();
  };
  const move = (direction: -1 | 1) => { onStep(direction); top.current?.scrollIntoView({ block: "start" }); };
  const isBack = panel !== null;
  const isArticle01 = articleId === "01";
  return <main className="student-workspace-v2 article-one-notebook" data-article-id={articleId}>
    <header className="notebook-top">
      <button className="notebook-exit" type="button" onClick={onExit}><Icon name="arrow-left"/>{isArticle01 ? "Full Text" : "全文"}</button>
      <span>Article {articleId} · {title}</span>
      <details className="notebook-jump" ref={jumpMenu}>
        <summary>{String(selected + 1).padStart(2, "0")} / {sentences.length} · PARA {String(paragraph + 1).padStart(2, "0")}<Icon name="chevron-down"/></summary>
        <nav aria-label={`${sentences.length} 句导航`}>{ranges.map(({ start, end }, index) => <div key={index}><b>Para {String(index + 1).padStart(2, "0")}</b><div>{sentences.slice(start, end + 1).map((text, offset) => <button type="button" key={start + offset} aria-current={selected === start + offset ? "true" : undefined} title={text} onClick={() => { onSelect(start + offset); if (jumpMenu.current) jumpMenu.current.open = false; }}>{String(start + offset + 1).padStart(2, "0")}</button>)}</div></div>)}</nav>
      </details>
    </header>
    <div className="notebook-folder" ref={top}>
      <nav className="notebook-tabs" aria-label="句子学习入口">{tabs.map(tab => {
        const label = isArticle01 && tab.id === "translation" ? "Notes" : tab.label;
        return <button type="button" key={tab.id} className={`notebook-tab notebook-tab-${label.toLowerCase()}`} aria-pressed={category(panel) === tab.id} onClick={() => onPanel(tab.id)}><span>{label}</span><Icon name={tab.icon}/></button>;
      })}</nav>
      <article className={`notebook-sheet ${isBack ? "is-back" : "is-front"}`} data-sentence-id={`${articleId}-${selected + 1}`} aria-label={`第 ${selected + 1} 句${isBack ? "讲解" : "原句"}`}>
        <div className={`notebook-face ${isBack ? "notebook-back" : "notebook-front"}`} key={isBack ? "back" : "front"}>
          {!isBack ? <>
            <div className="notebook-sentence-group">
            {showClassificationBadge && <SentenceBadge sentence={selected + 1} entry={sentenceClassification} hideClassificationLabel={suppressClassificationLabel}/>} 
            <blockquote className={`notebook-original${sentences[selected].length > 440 ? " is-long" : ""}`} lang="en">{sentences[selected]}</blockquote>
            </div>
            <SentencePlayer key={`${articleId}-${selected}`} sentence={selected + 1} hidden={isBack} audioSrc={audioSrc}/>
            <div className="notebook-draw-row">
              <section className={`notebook-draw${drawing ? " is-drawing" : ""}`} aria-label="抽学号">
                <button type="button" className={`notebook-draw-cat${catDragging ? " is-cat-dragging" : ""}`} onClick={clickCat} onPointerDown={beginCatDrag} onPointerMove={moveCat} onPointerUp={finishCatDrag} onPointerCancel={finishCatDrag} disabled={drawing} aria-label="拖动小猫调整位置，松开后自动保存；点击小猫抽取学号" style={{ "--cat-offset-x": `${catPosition.x}px`, "--cat-offset-y": `${catPosition.y}px` } as CSSProperties}><img src={catSrc} alt={articleId === "01" ? "戴博士帽的小猫，双爪扶着卡片上沿" : `第 ${Number(articleId)} 篇的主题小猫`} width="84" height="84"/></button>
                <div className="notebook-draw-main"><div><span>{isArticle01 ? "Student ID" : "本次学号"}</span><output aria-live="polite" aria-atomic="true">{drawing ? "··" : drawn === null ? "—" : String(drawn).padStart(2, "0")}</output></div><button type="button" onClick={draw} disabled={drawing}>{drawing ? (isArticle01 ? "Drawing" : "抽取中") : drawn === null ? (isArticle01 ? "Draw student ID" : "抽取学号") : (isArticle01 ? "Again" : "再抽一次")}<Icon name="refresh"/></button></div>
                <div className="notebook-draw-bottom"><small>{isArticle01 ? "The first seven times" : "01–50 · 最近7次不重复"}</small><button type="button" className="notebook-cat-reset" onClick={resetCatPosition}>{isArticle01 ? "Reset" : "Reset cat"}</button><details><summary>{isArticle01 ? "Record" : "记录"}</summary><div className="notebook-draw-history"><p>{history.length ? history.map(n => String(n).padStart(2, "0")).join(" · ") : (isArticle01 ? "No draws yet" : "还没有抽号记录")}</p><button type="button" onClick={clearDraws} disabled={!history.length && !drawing}>{isArticle01 ? "Clear history" : "清空记录"}</button></div></details></div>
                {catSaved && <small className="notebook-cat-saved" role="status">位置已保存</small>}
              </section>
            </div>
          </> : <>
            <header className="notebook-back-header"><button type="button" onClick={() => onPanel(null)}><Icon name="arrow-left"/>Back</button><span>{tabs.find(tab => tab.id === category(panel))?.label}</span></header>
            {panel !== "words" && <div className="notebook-context">{showClassificationBadge && <SentenceBadge sentence={selected + 1} entry={sentenceClassification} compact hideClassificationLabel={suppressClassificationLabel}/>}<p lang="en">{sentences[selected]}</p></div>}
            <div className="notebook-content">{children}</div>
          </>}
        </div>
        <footer className="notebook-footer"><button type="button" onClick={() => move(-1)} disabled={selected === 0}><Icon name="arrow-left"/>{isArticle01 ? "Previous" : "上一句"}</button><p>{isBack ? (isArticle01 ? "Think first, then tap the card to reveal" : "先思考，再点击卡片揭晓") : (isArticle01 ? "Flip and learn more" : "选择左侧入口，翻面学习")}</p><button type="button" onClick={() => move(1)} disabled={selected === sentences.length - 1}>{isArticle01 ? "Next" : "下一句"}<Icon name="arrow-right"/></button></footer>
      </article>
    </div>
  </main>;
}
