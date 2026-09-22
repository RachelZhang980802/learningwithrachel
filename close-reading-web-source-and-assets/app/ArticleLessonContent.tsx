"use client";

import { Fragment, useId, useState, type ReactNode } from "react";
import { SentenceBadge, type NotebookPanel } from "./ArticleOneNotebook";
import { WordFileDesk, type WordFileCard } from "./WordFileDesk";
import type { VocabularyTarget } from "./ArticleVocabulary";
import { getLesson, paragraphSegments, vocabularyMatches, type Lesson, type LessonSentence, type PdfNote } from "./articleLessons";
import "./article-lessons.css";
import { grammarRole } from "./GrammarLegend";
import { StructureDiagram } from "./ClauseMemo";
import { ClauseEntry } from "./ClauseEntry";

export function LessonVocabularyText({ lesson, sentence, text, selectedRow, onSelect }: {
  lesson: Lesson; sentence: number; text: string; selectedRow?: number; onSelect: (target: VocabularyTarget) => void;
}) {
  const matches = vocabularyMatches(lesson, sentence, text);
  let cursor = 0;
  const parts = matches.map(match => {
    const preceding = text.slice(cursor, match.start);
    cursor = match.end;
    return <Fragment key={`${match.start}-${match.sourceRow}`}>{preceding}<button type="button"
      className={`vocabulary-highlight${selectedRow === match.sourceRow ? " is-selected" : ""}`}
      aria-pressed={selectedRow === undefined ? undefined : selectedRow === match.sourceRow}
      data-source-row={match.sourceRow} data-sentence={sentence}
      aria-label={`查看 ${match.word} 的词汇卡`}
      onClick={() => onSelect({ sentence, sourceRow: match.sourceRow })}>{text.slice(match.start, match.end)}</button></Fragment>;
  });
  return <>{parts}{text.slice(cursor)}</>;
}

export function LessonVocabularyParagraph({ articleId, paragraph, text, onSelect }: {
  articleId: string; paragraph: number; text: string; onSelect: (target: VocabularyTarget) => void;
}) {
  const lesson = getLesson(articleId);
  if (!lesson) return <>{text}</>;
  const segments = paragraphSegments(lesson, paragraph, text);
  if (!segments.length) return <>{text}</>;
  return <>{segments.map(segment => <LessonVocabularyText key={segment.sentence} lesson={lesson} {...segment} onSelect={onSelect}/>)}</>;
}

export function LessonVocabularyTitle({ articleId, text, onSelect }: {
  articleId: string; text: string; onSelect: (target: VocabularyTarget) => void;
}) {
  const lesson = getLesson(articleId);
  if (!lesson) return <>{text}</>;
  const matches = vocabularyMatches({ ...lesson, vocabulary: lesson.vocabulary.map(word => ({ ...word, occurrences: [0] })) }, 0, text);
  let cursor = 0;
  const parts = matches.map(match => {
    const preceding = text.slice(cursor, match.start);
    cursor = match.end;
    const word = lesson.vocabulary.find(word => word.sourceRow === match.sourceRow)!;
    return <Fragment key={match.start}>{preceding}<button type="button" className="vocabulary-highlight" data-source-row={word.sourceRow}
      aria-label={`查看标题词 ${word.word} 的词汇卡`} onClick={() => onSelect({ sentence: word.occurrences[0], sourceRow: word.sourceRow })}>{text.slice(match.start, match.end)}</button></Fragment>;
  });
  return <>{parts}{text.slice(cursor)}</>;
}

const Lines = ({ values }: { values: string[] }) => <p>{values.map((value, index) => <Fragment key={index}>{index > 0 && <br/>}{value}</Fragment>)}</p>;

export function LessonPdfNotes({ sentence, entry }: { sentence: LessonSentence; entry: PdfNote["entry"] }) {
  const notes = sentence.pdfNotes.filter(note => note.entry === entry);
  if (!notes.length) return null;
  return <section className="lesson-pdf-notes" aria-label="讲义补充与核对">
    <h3>From your notes · 讲义补充</h3>
    {notes.map((note, index) => <details key={`${note.title}-${index}`} className="lesson-pdf-note">
      <summary>{note.title}{note.disposition === "纠正" && <span className="lesson-note-correction">核对提示</span>}</summary>
      <p lang="zh-CN">{note.text}</p>
      <div className="lesson-note-sources">{note.pages.map(page => <a key={page} href={`/lesson-sources/article${note.articleId}.pdf#page=${page}`} target="_blank" rel="noopener noreferrer">PDF 第 {page} 页 ↗</a>)}
      {note.references?.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div>
    </details>)}
  </section>;
}

export function LessonWords({ lesson, sentence, initialSourceRow }: { lesson: Lesson; sentence: LessonSentence; initialSourceRow?: number }) {
  const entries = lesson.vocabulary.filter(word => word.occurrences.includes(sentence.id));
  const [selected, setSelected] = useState(() => Math.max(0, entries.findIndex(word => word.sourceRow === initialSourceRow)));
  const entry = entries[selected] ?? entries[0];
  const badge = <SentenceBadge sentence={sentence.id} entry={sentence.classification} compact/>;
  if (!entry) return <div className="word-workspace"><div className="word-context">{badge}{sentence.text}</div><div className="word-empty"><h2>Words</h2><p>本句没有词表中的目标词。{sentence.pdfNotes.some(note => note.entry === "words") ? "讲义中的相关表达整理在下方；也可以进入 Structure 查看句法。" : "可以进入 Structure 查看句法。"}</p></div><LessonPdfNotes sentence={sentence} entry="words"/></div>;
  const [english, ...chinese] = entry.definition.split(" — ");
  const cards: WordFileCard[] = [
    { id: "meaning", title: "Word & meaning", subtitle: "词义与发音", content: <section className="word-primary">
      <h2>{entry.word}</h2>{entry.titleOnly && <small>Title word · 标题词汇</small>}<div className="word-pronunciation"><span>{entry.partOfSpeech}</span><span>{entry.ipa}</span></div>
      <p className="word-definition"><span lang="en">{english}</span><br/><span lang="zh-CN">{chinese.join(" — ")}</span></p>
      <details className="word-other"><summary>Other meanings · 其他常用义项</summary>{entry.otherSenses.length ? <Lines values={entry.otherSenses}/> : <p>暂无需要另记的重要常用义项；优先掌握本页语境义与搭配。</p>}</details>
      <div className="lesson-dictionary-sources">{entry.sources.map(source => <a className="word-dictionary" href={source.url} key={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div>
      <small className="lesson-source-caption">核心释义据词典概括；语境提示结合本文。</small>
    </section> },
    { id: "collocations", title: "Collocations", subtitle: "搭配", content: <div className="word-related"><section><h3>Collocations · 搭配</h3><Lines values={entry.collocations}/></section></div> },
    { id: "compare", title: "Compare", subtitle: "近义辨析", content: <div className="word-related"><section><h3>Compare · 近义辨析</h3><Lines values={entry.compare}/></section></div> },
    { id: "usage", title: "Usage note", subtitle: "用法提醒", content: <div className="word-related"><section><h3>Word family · 词族</h3><Lines values={entry.family}/></section><section><h3>Usage note · 用法提醒</h3><p>{entry.usage}</p></section></div> },
    { id: "press", title: "In the press", subtitle: "外刊用法", content: <section className="word-press"><h3>In the press · 外刊用法</h3><p className="word-press-placeholder">外刊例句待补充。</p></section> },
  ];
  return <div className="word-workspace" data-source-row={entry.sourceRow}>
    <nav className="word-picker" aria-label="本句词条"><span>{entries.length} {entries.length === 1 ? "ENTRY" : "ENTRIES"}</span>{entries.map((word, index) => <button type="button" key={word.sourceRow} aria-pressed={index === selected} onClick={() => setSelected(index)}>{word.word}</button>)}</nav>
    <div className="word-context">{badge}<LessonVocabularyText lesson={lesson} sentence={sentence.id} text={entry.titleOnly ? lesson.title : sentence.text} selectedRow={entry.sourceRow} onSelect={({ sourceRow }) => setSelected(entries.findIndex(word => word.sourceRow === sourceRow))}/></div>
    <WordFileDesk key={entry.sourceRow} cards={cards} panelId={`word-file-panel-${lesson.articleId}-${entry.sourceRow}`}/>
    <LessonPdfNotes sentence={sentence} entry="words"/>
  </div>;
}

function clauseRole(label: string) {
  if (/主句|报告句|引语主干/.test(label)) return "main";
  if (/不定式|分词|非谓语|动名词|独立主格/.test(label)) return "nonfinite";
  if (/从句/.test(label)) return "subordinate";
  return "supplement";
}
function functionRole(label: string) {
  return grammarRole(label);
}

function lessonFunctionEnglish(label: string) {
  if (/形式主语/.test(label)) return "Formal subject";
  if (/真正主语/.test(label)) return "Postposed subject";
  if (/主语/.test(label)) return "Subject";
  if (/系动词/.test(label)) return "Linking verb";
  if (/谓语|助动词|情态动词|动词/.test(label)) return "Predicate";
  if (/宾语|对象|接收者/.test(label)) return "Object";
  if (/表语|补足|补语/.test(label)) return "Complement";
  if (/定语|修饰|同位|限定/.test(label)) return "Modifier";
  if (/状语|背景|条件|让步|方式|时间|地点|原因|伴随/.test(label)) return "Adverbial";
  if (/连词|连接|引导词|关系词|介词|标记|小品词/.test(label)) return "Linker / discourse marker";
  if (/从句|主句|引语/.test(label)) return "Clause";
  if (/不定式|分词|动名词|非谓语/.test(label)) return "Non-finite structure";
  return "Function";
}

function lessonClauseChinese(label: string) {
  if (/CONTENT CLAUSE/.test(label)) return "宾语从句";
  if (/EXPLANATORY MAIN CLAUSE/.test(label)) return "主句";
  return label;
}

function asPairs(rows: string[][]) {
  return rows.filter((row): row is [string, string] => typeof row[0] === "string" && typeof row[1] === "string");
}

function RevealCard({ title, subtitle, prompt, children }: { title: string; subtitle: string; prompt: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const answerId = useId();
  return <section className={`notebook-analysis-card${open ? " is-open" : ""}`}>
    {open ? <header><div><h2>{title}</h2><p>{subtitle}</p><span>{prompt}</span></div><button type="button" aria-expanded={open} aria-controls={answerId} onClick={() => setOpen(false)}>Back to prompt</button></header> : <ClauseEntry onOpen={() => setOpen(true)} controls={answerId}/>}
    <div id={answerId} hidden={!open}>{open && <div className="notebook-analysis-answer">{children}</div>}</div>
  </section>;
}

export function LessonStructure({ sentence }: { sentence: LessonSentence }) {
  return <div className="notebook-structure">
    <RevealCard title="CLAUSE ARCHITECTURE" subtitle="Main and Subordinate Units" prompt="先找主句，再判断哪些结构从属于它。">
      <StructureDiagram parts={asPairs(sentence.functions)} clauses={asPairs(sentence.clauses)} clauseChinese={lessonClauseChinese} functionEnglish={lessonFunctionEnglish} functionClass={functionRole}/>
      <p className="notebook-analysis-note">{sentence.note}</p>
      <LessonPdfNotes sentence={sentence} entry="grammar"/>
    </RevealCard>
  </div>;
}

const meaningTabs: { id: NotebookPanel; label: string }[] = [{ id: "meaning", label: "Meaning" }, { id: "voice", label: "Voice" }, { id: "context", label: "Context" }, { id: "translation", label: "Translate" }];
const practiceTabs: { id: NotebookPanel; label: string }[] = [{ id: "paraphrase", label: "Paraphrase" }, { id: "reuse", label: "Reuse" }];
const articleVoices: Record<string, string> = {
  "02": "议论与说明相结合。区分他人的建议、历史例证和作者的判断；提到裁员或提出疑问，不等于作者直接赞成征税。",
  "03": "第一人称回忆把少年的目光与成年后的理解叠在一起。动作、声音和幽默细节逐步显出祖父的复杂性，不能把童年的戏谑当作作者最终的评价。",
  "04": "叙述穿插 Matti 的内心独白。按外貌判断国籍的断言来自人物，结尾的反转让这些断言显得可笑；它们不是作者提供的国民性知识。",
  "05": "第三人称叙述贴近 Chie 的感受，以短对话、停顿和动作推进。礼貌措辞与 Akira 打破惯例的行动形成张力；理解比喻时须分清动作的执行者。",
  "06": "Franklin 以成年后的视角回忆少年求学，兼有自省、幽默和节制的自我评价。保留 perhaps、might、tolerable 等限定；人物关于职业或群体的概括不等于客观事实，旧式表达也不直接作为现代写作模板。",
  "07": "作者通过个人见闻比较城市生活的所得与代价，既谈便利与匿名，也承认群体联系的价值。数字、地域概括和演化叙述先按文章写作语境理解，不把例证夸成无例外的普遍规律。",
  "08": "这是一篇讨论食物与文化权力关系的评论。区分作者引述的标签、批评的刻板印象与作者自己的主张；理解文化尊重、历史处境和利益分配，避免把群体身份直接等同于个人行为。",
  "09": "作者以旅行经历、反问和自嘲回应必须像当地人旅行的压力。区分转述的流行建议、对其逻辑的质疑与作者认可的好奇和尊重，不把幽默夸张当作字面禁令。",
  "10": "Mark Twain 把河流比作可读的文字，交替呈现初见者的审美惊叹与领航者的实用判断。注意引号内的内心判断、带感叹的插语及设问，理解专业知识带来的获得与审美体验的变化。",
};

export function LessonReuse({ sentence }: { sentence: LessonSentence }) {
  const [revealed, setRevealed] = useState(false);
  const answerId = useId();
  const example = sentence.reuse;
  return <div className="student-reuse lesson-reuse">
    <p className="student-reuse-pattern" lang="en">{example.pattern}</p>
    {example.note && <p className="structure-review-note" lang="zh-CN">{example.note}</p>}
    <div className="student-reuse-practice">
      <button type="button" className="student-sentence-translation student-reuse-prompt" lang="zh-CN" aria-expanded={revealed} aria-controls={answerId} onClick={() => setRevealed(!revealed)}>{example.zh}</button>
      <p id={answerId} className="student-reuse-pattern student-reuse-answer" lang="en" hidden={!revealed}>{revealed ? example.en : null}</p>
    </div>
  </div>;
}

export function LessonActivities({ lesson, sentence, panel, onPanel }: { lesson: Lesson; sentence: LessonSentence; panel: NotebookPanel; onPanel: (panel: NotebookPanel) => void }) {
  const practice = panel === "paraphrase" || panel === "reuse";
  return <div className="student-existing-content lesson-activities">
    <nav className="student-subtabs" aria-label="Activities">{(practice ? practiceTabs : meaningTabs).map(tab => <button type="button" key={tab.id} aria-pressed={panel === tab.id} onClick={() => onPanel(tab.id)}>{tab.label}</button>)}</nav>
    {panel === "translation" ? <p className="student-sentence-translation" lang="zh-CN">{sentence.translation}</p>
      : panel === "meaning" ? <><p className="analysis-kicker">MEANING · 读懂本句</p><p className="student-sentence-translation" lang="zh-CN">{sentence.translation}</p><p className="notebook-analysis-note">{sentence.note}</p></>
      : panel === "voice" ? <><p className="analysis-kicker">VOICE &amp; EFFECT · 表达与语气</p><p>{articleVoices[lesson.articleId]}</p><div className="lesson-reading-cue"><span>{sentence.classification.label}</span><p>{sentence.note}</p></div></>
      : panel === "context" ? <><p className="analysis-kicker">CONTEXT · 放回原段</p><p>Para {String(sentence.paragraph).padStart(2, "0")} · 当前句加深显示</p><div className="lesson-context-paragraph">{lesson.sentences.filter(item => item.paragraph === sentence.paragraph).map(item => <p key={item.id} lang="en" aria-current={item.id === sentence.id ? "true" : undefined}><small>{String(item.id).padStart(2, "0")}</small>{item.text}</p>)}</div></>
      : panel === "paraphrase" ? <div className="student-paraphrase"><p className="student-paraphrase-sentence" lang="en">{sentence.paraphrase}</p><details className="student-paraphrase-comparison"><summary>改写核对 · 保留原句的意思与逻辑</summary><p lang="zh-CN">{sentence.translation}</p><p>{sentence.note}</p></details></div>
      : <LessonReuse key={`${lesson.articleId}-${sentence.id}`} sentence={sentence}/>}
    {(panel === "meaning" || panel === "voice" || panel === "context") && <LessonPdfNotes sentence={sentence} entry={panel}/>}
  </div>;
}
