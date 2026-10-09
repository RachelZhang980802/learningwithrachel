"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { article01QuizCategories, type QuizCategory } from "./article01QuizData";
import { QuizPaperBackdrop, QuizFolderTint } from "./QuizPaperMaterial";
import { toMediaUrl } from "./mediaUrl";

type ArticleOneQuizProps = {
  onBack: () => void;
  footer: ReactNode;
  categories?: QuizCategory[];
  unitLabel?: string;
  articleTitle?: string;
};

const TAB_LAYOUT = [
  { center: 626 / 1234, width: 458, labelWidth: 300, labelTop: 15, rise: 40 },
  { center: 251.5 / 1215, width: 379, labelWidth: 172, labelTop: 9, rise: 34 },
  { center: 877.5 / 1194, width: 327, labelWidth: 189, labelTop: 9, rise: 47 },
  { center: 423.5 / 1180, width: 329, labelWidth: 169, labelTop: 9, rise: 44 },
  { center: 996.5 / 1183, width: 299, labelWidth: 117, labelTop: 11, rise: 34 },
  { center: 576 / 1137, width: 340, labelWidth: 242, labelTop: 12, rise: 37 },
  { center: 189 / 1122, width: 326, labelWidth: 161, labelTop: 9, rise: 48 },
];

const FOLDER_POSE = [
  { tilt: ".22deg", x: "0px" },
  { tilt: ".48deg", x: "-1px" },
  { tilt: "-.2deg", x: "1px" },
  { tilt: ".08deg", x: "0px" },
  { tilt: "-.2deg", x: "0px" },
  { tilt: "-.35deg", x: "0px" },
  { tilt: "-.45deg", x: "0px" },
];

const STACK_INSETS = [
  { left: 0, right: 0 },
  { left: .81, right: .73 },
  { left: 1.94, right: 1.30 },
  { left: 1.94, right: 2.43 },
  { left: 2.03, right: 2.11 },
  { left: 4.70, right: 3.16 },
  { left: 3.40, right: 5.67 },
];

const STACK_TOPS = [251, 204, 178, 124, 90, 44, 0];
type FolderTabLayout = { left: number; width: number; labelWidth: number; labelTop: number; rise: number };

const imageLabels = new Set(article01QuizCategories.map((category) => category.id));

function layoutForCategory(category: QuizCategory, categoryIndex: number, folderWidth: number, scale: number): FolderTabLayout {
  const base = TAB_LAYOUT[categoryIndex % TAB_LAYOUT.length];
  const labelWidth = imageLabels.has(category.id)
    ? base.labelWidth
    : Math.min(400, Math.max(150, Math.round(category.label.length * 16)));
  const width = Math.min(folderWidth - 20 * scale, Math.max(base.width, labelWidth + (imageLabels.has(category.id) ? 78 : 110)) * scale);
  return {
    width,
    labelWidth: Math.min(labelWidth * scale, width - 50 * scale),
    labelTop: base.labelTop * scale,
    rise: base.rise * scale,
    left: Math.max(10 * scale, Math.min(folderWidth - width - 10 * scale, base.center * folderWidth - width / 2)),
  };
}

const folderOutline = (tab: FolderTabLayout, width: number, height: number, scale: number) => {
  const l = tab.left;
  const r = l + tab.width;
  const y = tab.rise;
  const s = scale;
  const lc = Math.min(36 * s, l);
  const rc = Math.min(36 * s, width - r);
  // The shoulder is measured in paper-sized pixels, independently of body height.
  // Short straight slopes and small corner rounds match the physical folders.
  return [
    `M 0 ${y + 31*s} Q 0 ${y + 22*s} ${lc * 8/36} ${y + 20*s}`,
    `Q ${lc * 17/36} ${y + 18*s} ${lc * 21/36} ${y + 9*s} Q ${lc * 25/36} ${y} ${lc} ${y}`,
    `L ${l} ${y} Q ${l + 9*s} ${y} ${l + 14*s} ${y - 8*s}`,
    `L ${l + 31*s} ${8*s} Q ${l + 36*s} 0 ${l + 47*s} 0`,
    `L ${r - 47*s} 0 Q ${r - 36*s} 0 ${r - 31*s} ${8*s}`,
    `L ${r - 14*s} ${y - 8*s} Q ${r - 9*s} ${y} ${r} ${y}`,
    `L ${width - rc} ${y} Q ${width - rc * 25/36} ${y} ${width - rc * 21/36} ${y + 9*s}`,
    `Q ${width - rc * 17/36} ${y + 18*s} ${width - rc * 8/36} ${y + 20*s} Q ${width} ${y + 22*s} ${width} ${y + 31*s}`,
    `L ${width} ${height} L 0 ${height} Z`,
  ].join(" ");
};

export function ArticleOneQuiz({ onBack, footer, categories = article01QuizCategories, unitLabel = "UNIT 1 · A FRESH START", articleTitle = "I Become a Student" }: ArticleOneQuizProps) {
  const [order, setOrder] = useState(() => categories.map((category) => category.id));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  const orderRef = useRef(order);
  const expandedRef = useRef(expandedId);
  const scrollersRef = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollPositionsRef = useRef<Record<string, number>>({});
  const restoringRef = useRef<string | null>(null);
  const pageRef = useRef<HTMLElement | null>(null);
  const [viewport, setViewport] = useState({ width: 1536, height: 1024 });
  const mobile = viewport.width <= 760;
  const designScale = mobile
    ? Math.max(.5, Math.min(viewport.width / 768, viewport.height / 1024))
    : Math.min(viewport.width / 1536, viewport.height / 1024);
  const stageTop = mobile ? Math.max(122, 190 * designScale) : 190 * designScale;
  const footerHeight = Math.max(mobile ? 94 : 88, 164 * designScale);
  const stageWidth = mobile ? viewport.width - 24 : viewport.width * .8034;
  const stageHeight = viewport.height - stageTop - footerHeight;

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const measure = () => setViewport({ width: page.clientWidth, height: page.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!expandedId) return;
    const scrollArea = scrollersRef.current[expandedId];
    if (!scrollArea) return;
    const savedPosition = scrollPositionsRef.current[expandedId] ?? 0;
    if (savedPosition === 0) return;
    restoringRef.current = expandedId;
    const restore = () => {
      scrollArea.scrollTop = savedPosition;
      restoringRef.current = null;
    };
    const timer = window.setTimeout(restore, 510);
    return () => {
      window.clearTimeout(timer);
      restoringRef.current = null;
    };
  }, [expandedId]);

  const originalOrder = order.every((id, index) => id === categories[index]?.id);

  useEffect(() => {
    if (!expandedId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        expandedRef.current = null;
        setExpandedId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expandedId]);

  const selectCategory = (categoryId: string) => {
    const currentOrder = orderRef.current;
    if (categoryId === currentOrder[0]) {
      const nextExpanded = expandedRef.current === categoryId ? null : categoryId;
      expandedRef.current = nextExpanded;
      setExpandedId(nextExpanded);
      return;
    }
    expandedRef.current = null;
    setExpandedId(null);
    const previousFront = currentOrder[0];
    const nextOrder = [categoryId, ...currentOrder.filter((id) => id !== categoryId && id !== previousFront), previousFront];
    orderRef.current = nextOrder;
    setOrder(nextOrder);
  };

  const toggleAnswer = (answerId: string) => {
    setExpandedAnswers((current) => ({ ...current, [answerId]: !current[answerId] }));
  };

  return (
    <main ref={pageRef} className={`integrated-quiz-page${expandedId ? " has-expanded-folder" : ""}`} style={{
      "--quiz-unit": `${designScale}px`,
      "--quiz-stage-top": `${stageTop}px`,
      "--quiz-footer-height": `${footerHeight}px`,
    } as CSSProperties}>
      <QuizPaperBackdrop scale={designScale} />
      <header className="integrated-quiz-header">
        <button className="integrated-quiz-back" type="button" aria-label="Back" onClick={onBack}>
          <svg aria-hidden="true" viewBox="0 0 46 24"><path d="M43 12H4m0 0L15 2M4 12l11 10" /></svg>
          <span className="integrated-quiz-back-label" aria-hidden="true"><img src="https://assets.negentropylearning.com.cn/quiz-label-back.png" alt="" /></span>
        </button>
        <div className="integrated-quiz-wordmark" aria-hidden="true" />
      </header>

      {expandedId && <div className="integrated-quiz-dimmer" aria-hidden="true" />}

      <section className={`integrated-quiz-stage${expandedId ? " is-expanded" : ""}`} aria-label={`${unitLabel} practice folders`}>
        {order.map((categoryId, depth) => {
          const category = categories.find((item) => item.id === categoryId)!;
          const active = depth === 0;
          const expanded = expandedId === category.id;
          const pose = FOLDER_POSE[categories.indexOf(category) % FOLDER_POSE.length];
          const inset = STACK_INSETS[Math.min(depth, STACK_INSETS.length - 1)];
          const stackTop = mobile ? (6 - depth) * Math.max(32, 42 * designScale) : (originalOrder ? STACK_TOPS[depth] : (6 - depth) * 46) * designScale;
          const folderWidth = expanded ? (mobile ? stageWidth : viewport.width * .8534) : stageWidth * (1 - (inset.left + inset.right) / 100);
          const folderHeight = expanded ? viewport.height * .8 : stageHeight - stackTop + 18 * designScale;
          const tab = layoutForCategory(category, categories.indexOf(category), folderWidth, designScale);
          const outlinePath = folderOutline(tab, folderWidth, folderHeight, designScale);
          const folderStyle = {
            "--folder-color": category.color,
            "--folder-top": `${stackTop}px`,
            "--folder-angle": pose.tilt,
            "--folder-nudge-x": pose.x,
            "--folder-inset-left": `${inset.left}%`,
            "--folder-inset-right": `${inset.right}%`,
            "--tab-left": `${tab.left}px`,
            "--tab-width": `${tab.width}px`,
            "--tab-rise": `${tab.rise}px`,
            "--label-image-width": `${tab.labelWidth}px`,
            "--label-image-top": `${tab.labelTop}px`,
            "--label-offset-x": `${(imageLabels.has(category.id) ? [-8, -23, 0, -8, 0, 0, 0][categories.indexOf(category)] : 0) * designScale}px`,
            "--label-font-size": `${Math.max(mobile ? 21 : 22, (category.label.length > 22 ? 39 : 44) * designScale)}px`,
            zIndex: expanded ? 90 : 30 - depth,
          } as CSSProperties;

          return (
            <article
              key={category.id}
              className={`integrated-quiz-folder${active ? " is-front" : ""}${expanded ? " is-expanded" : ""}`}
              style={folderStyle}
              data-category={category.id}
              aria-label={category.label}
            >
              <svg className="integrated-quiz-folder-shape" viewBox={`0 0 ${folderWidth} ${folderHeight}`} preserveAspectRatio="none" aria-hidden="true">
                <QuizFolderTint id={`paper-tint-${category.id}`} color={category.color} />
                <defs>
                  <linearGradient id={`paper-light-${category.id}`} x1="0" y1="0" x2="0" y2={90 * designScale} gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#fff9ee" stopOpacity=".16" />
                    <stop offset="1" stopColor="#fff9ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="integrated-quiz-folder-fill" d={outlinePath} />
                <path className="integrated-quiz-folder-texture" d={outlinePath} fill="url(#quiz-reference-fiber)" filter={`url(#paper-tint-${category.id})`} />
                <path d={outlinePath} fill={`url(#paper-light-${category.id})`} />
                <path className="integrated-quiz-folder-edge" d={outlinePath} />
              </svg>
              <button
                className="integrated-quiz-folder-tab"
                type="button"
                aria-current={active ? "page" : undefined}
                aria-pressed={expanded}
                aria-label={active ? (expanded ? `Collapse ${category.label}` : `Read ${category.label}`) : `Move ${category.label} to the front`}
                onClick={() => selectCategory(category.id)}
              >
                <span className={`integrated-quiz-folder-tab-label${imageLabels.has(category.id) ? "" : " is-text"}`} aria-hidden="true">
                  {imageLabels.has(category.id) ? <img src={toMediaUrl(`/quiz-label-${category.id}.png`)} alt="" /> : category.label}
                </span>
              </button>
              <div className={`integrated-quiz-folder-content${expanded ? " is-visible" : ""}`} aria-hidden={!expanded} inert={!expanded}>
                <div
                  className="integrated-quiz-question-list"
                  ref={(node) => { scrollersRef.current[category.id] = node; }}
                  tabIndex={expanded ? 0 : -1}
                  aria-label={`${category.label} questions`}
                  onScroll={(event) => {
                    if (expandedRef.current === category.id && restoringRef.current !== category.id) {
                      scrollPositionsRef.current[category.id] = event.currentTarget.scrollTop;
                    }
                  }}
                >
                  {expanded && <nav className="integrated-quiz-expanded-nav" aria-label="Switch practice folder">
                    <span>FOLDERS</span>
                    {order.map((id) => {
                      const item = categories.find((candidate) => candidate.id === id)!;
                      return <button key={id} type="button" aria-current={id === category.id ? "page" : undefined} onClick={() => selectCategory(id)}>{item.label}</button>;
                    })}
                    <button className="integrated-quiz-collapse" type="button" onClick={() => { expandedRef.current = null; setExpandedId(null); }}>Return to stack <span aria-hidden="true">↘</span></button>
                  </nav>}
                  <div className="integrated-quiz-section-heading">
                    <span>{unitLabel.toUpperCase()} · {articleTitle.toUpperCase()}</span>
                    <span>{category.exercises.length} {category.exercises.length === 1 ? "QUESTION" : "QUESTIONS"}</span>
                  </div>
                  {category.exercises.length === 0 ? (
                    <p className="integrated-quiz-empty">No exercises for this category were included in the supplied Unit {unitLabel.match(/\d+/)?.[0] ?? ""} pages.</p>
                  ) : category.exercises.map((exercise, index) => {
                    const answerId = `${category.id}-answer-${index}`;
                    const open = Boolean(expandedAnswers[answerId]);
                    return (
                      <section
                        className={`integrated-quiz-question${open ? " is-open" : ""}${exercise.answer ? " has-answer" : ""}`}
                        key={answerId}
                        onClick={(event) => {
                          if (!exercise.answer || !(event.target instanceof Element)) return;
                          if (!event.target.closest(".integrated-quiz-question-title, .integrated-quiz-instruction, .integrated-quiz-prompt")) return;
                          if (event.target.closest("a, button, input, select, textarea")) return;
                          if (window.getSelection()?.toString()) return;
                          toggleAnswer(answerId);
                        }}
                      >
                        <div className="integrated-quiz-question-title"><span>{String(index + 1).padStart(2, "0")}</span><h2>{exercise.title}</h2></div>
                        {exercise.instruction && <p className="integrated-quiz-instruction">{exercise.instruction}</p>}
                        <div className="integrated-quiz-prompt">{exercise.prompt}</div>
                        {exercise.answer ? <>
                          <button className="integrated-quiz-answer-toggle" type="button" aria-expanded={open} aria-controls={answerId} onClick={() => toggleAnswer(answerId)}>
                            {open ? "Hide answer" : "Show answer"}<span aria-hidden="true">{open ? "−" : "+"}</span>
                          </button>
                          <div className="integrated-quiz-answer-motion" data-open={open}>
                            <div className="integrated-quiz-answer-clip"><div className="integrated-quiz-answer" id={answerId} aria-hidden={!open}><p className="integrated-quiz-answer-label">ANSWER</p>{exercise.answer}</div></div>
                          </div>
                        </> : <p className="integrated-quiz-no-answer">No answer key is supplied for this activity.</p>}
                      </section>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {footer}
    </main>
  );
}
