"use client";

import { Fragment, useId, useRef, useState, type ReactNode } from "react";
import { SentenceBadge, type NotebookPanel } from "./ArticleOneNotebook";
import { WordFileDesk, type WordFileCard } from "./WordFileDesk";
import type { VocabularyTarget } from "./ArticleVocabulary";
import { getLesson, paragraphSegments, vocabularyMatches, type Lesson, type LessonSentence, type PdfNote } from "./articleLessons";
import "./article-lessons.css";
import { grammarRole } from "./GrammarLegend";
import { StructureDiagram } from "./ClauseMemo";
import { ClauseEntry } from "./ClauseEntry";
import { MeaningExamples, splitMeaningLine } from "./MeaningExamples";
import { CollocationLines } from "./CollocationLines";
import { WordFamilyReminder } from "./WordFamilyReminder";
import { toMediaUrl } from "./mediaUrl";
import { article02PdfVocabulary } from "./article02PdfVocabulary";
import { article03to05PdfVocabulary } from "./article03to05PdfVocabulary";
import { article06to08PdfVocabulary } from "./article06to08PdfVocabulary";
import { article09PdfVocabulary } from "./article09PdfVocabulary";
import { article10PdfVocabulary } from "./article10PdfVocabulary";
import curatedWords from "./article02to05CuratedVocabulary.json";
import article06CuratedWords from "./article06CuratedVocabulary.json";
import article07CuratedWords from "./article07CuratedVocabulary.json";
import article08CuratedWords from "./article08CuratedVocabulary.json";
import article09CuratedWords from "./article09CuratedVocabulary.json";
import article10CuratedWords from "./article10CuratedVocabulary.json";
import localAudio from "../public/audio/article-01-words-native/article-02-05-manifest.json";
import article06LocalAudio from "../public/audio/article-01-words-native/article-06-manifest.json";
import article07LocalAudio from "../public/audio/article-01-words-native/article-07-manifest.json";
import article08LocalAudio from "../public/audio/article-01-words-native/article-08-manifest.json";
import article09LocalAudio from "../public/audio/article-01-words-native/article-09-manifest.json";
import article10LocalAudio from "../public/audio/article-01-words-native/article-10-manifest.json";

export function LessonVocabularyText({ lesson, sentence, text, selectedRow, onSelect, renderWord }: {
  lesson: Lesson; sentence: number; text: string; selectedRow?: number; onSelect: (target: VocabularyTarget) => void; renderWord?: (text: string) => ReactNode;
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
      onClick={() => onSelect({ sentence, sourceRow: match.sourceRow })}>{renderWord ? renderWord(text.slice(match.start, match.end)) : text.slice(match.start, match.end)}</button></Fragment>;
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

function LessonWordAudio({ word, localFile }: { word: string; localFile?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const lookupWord = word.replace(/\b(sth|sb)\.?/gi, "").replace(/[“”‘’]/g, "").trim();
  const dictionaryAudio = localFile ?? `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(lookupWord)}&type=2`;
  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    audio.currentTime = 0;
    try { await audio.play(); } catch { setPlaying(false); }
  };
  return <><button type="button" className="word-speak" onClick={play} aria-label={`${playing ? "暂停" : "播放"} ${word} 的美式发音`} aria-pressed={playing} title={`播放 ${word} 的${localFile ? "本机生成" : "词典"}美式发音`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></svg></button><audio ref={audioRef} preload="none" src={dictionaryAudio} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}/></>;
}

function LessonWordFamilyGame({ values }: { values: string[] }) {
  const [revealed, setRevealed] = useState(false);
  return <section className="word-family-game">
    <div className="word-family-heading"><h3>Word family · 词族</h3><button type="button" aria-pressed={revealed} onClick={() => setRevealed(value => !value)}>{revealed ? "Hide answers" : "Reveal answers"}</button></div>
    <p className="word-family-prompt">Fill in the related word before checking the answer.</p>
    <ol>{values.map((value, index) => <li key={index}>{revealed ? value : value.replace(/^([A-Za-z][A-Za-z-]*)/, "＿＿＿＿＿＿")}</li>)}</ol>
  </section>;
}

function LessonParaphraseText({ original, paraphrase }: { original: string; paraphrase: string }) {
  const originalWords = new Set((original.toLowerCase().match(/[a-z]+(?:['-][a-z]+)*/g) ?? []));
  return <>{paraphrase.split(/(\s+)/).map((part, index) => {
    const word = part.toLowerCase().replace(/[^a-z'-]/g, "");
    return word && !originalWords.has(word) ? <mark key={index}>{part}</mark> : <Fragment key={index}>{part}</Fragment>;
  })}</>;
}

export function LessonPdfNotes({ sentence, entry }: { sentence: LessonSentence; entry: PdfNote["entry"] }) {
  const notes = sentence.pdfNotes.filter(note => note.entry === entry);
  if (!notes.length) return null;
  return <section className="lesson-pdf-notes" aria-label="讲义补充与核对">
    <h3>From your notes · 讲义补充</h3>
    {notes.map((note, index) => <details key={`${note.title}-${index}`} className="lesson-pdf-note">
      <summary>{note.title}{note.disposition === "纠正" && <span className="lesson-note-correction">核对提示</span>}</summary>
      <p lang="zh-CN">{note.text}</p>
      <div className="lesson-note-sources">{note.pages.map(page => <a key={page} href={toMediaUrl(`/lesson-sources/article${note.articleId}.pdf#page=${page}`)} target="_blank" rel="noopener noreferrer">PDF 第 {page} 页 ↗</a>)}
      {note.references?.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div>
    </details>)}
  </section>;
}

type CuratedWord = {
  english: string;
  chinese: string;
  collocations: string[];
  compare: string[];
  usage: string;
  ipa: string;
  partOfSpeech: string;
  image?: string;
  oxfordExcerptProvided: boolean;
  articleExample: string;
  dictionaryExample?: { english: string; chinese: string; source: string } | null;
  otherMeanings: { english: string; chinese: string; exampleEnglish?: string; exampleChinese?: string }[];
  otherMeaningsStatus: "present" | "none_in_excerpt" | "missing_source";
  sourceCaveat?: string;
  contextBySentence?: Record<string, Partial<Pick<CuratedWord, "english" | "chinese" | "collocations" | "compare" | "usage" | "dictionaryExample" | "otherMeanings" | "sourceCaveat">>>;
};

function PendingPdfWords({ lesson, sentence, initialSourceRow }: { lesson: Lesson; sentence: LessonSentence; initialSourceRow?: number }) {
  const pdfWords = lesson.articleId === "02" ? article02PdfVocabulary : lesson.articleId === "09" ? article09PdfVocabulary : lesson.articleId === "10" ? article10PdfVocabulary : (article03to05PdfVocabulary[lesson.articleId] ?? article06to08PdfVocabulary[lesson.articleId] ?? []);
  const entries = pdfWords.filter(word => word.occurrences.includes(sentence.id));
  const [selected, setSelected] = useState(() => Math.max(0, entries.findIndex(word => word.sourceRow === initialSourceRow)));
  const entry = entries[selected] ?? entries[0];
  const badge = <SentenceBadge sentence={sentence.id} entry={sentence.classification} compact/>;
  if (!entry) return <div className="word-workspace"><div className="word-context">{badge}{sentence.text}</div><div className="word-empty"><h2>Words</h2><p>{["09", "10"].includes(lesson.articleId) ? "这句没有已标记的词语。" : "这句没有讲义中明确解释的生词。"}</p></div></div>;
  const baseCurated = ({ ...curatedWords, ...article06CuratedWords, ...article07CuratedWords, ...article08CuratedWords, ...article09CuratedWords, ...article10CuratedWords } as Record<string, Record<string, CuratedWord>>)[lesson.articleId]?.[String(entry.sourceRow)];
  const contextual = baseCurated?.contextBySentence?.[String(sentence.id)];
  const curated = baseCurated && contextual ? { ...baseCurated, ...contextual } : baseCurated;
  const recording = ({ ...localAudio, ...article06LocalAudio, ...article07LocalAudio, ...article08LocalAudio, ...article09LocalAudio, ...article10LocalAudio } as Record<string, Record<string, { file: string }>>)[lesson.articleId]?.[String(entry.sourceRow)];
  const pending = (heading: string) => <div className="word-related"><section><h3>{heading}</h3><p className="study-pending">{["06", "07"].includes(lesson.articleId) ? "已收到你提供的词典资料，正在逐词核对整理。" : "等待你提供词典资料后整理。"}</p></section></div>;
  const cards: WordFileCard[] = [
    { id: "meaning", title: "Word & meaning", subtitle: "词义与发音", content: curated ? <section className="word-primary">
      <h2>{entry.word}</h2>{lesson.vocabulary.find(word => word.sourceRow === entry.sourceRow)?.titleOnly && <small>Title word · 标题词汇</small>}
      <div className="word-pronunciation">{curated.partOfSpeech && <span>{curated.partOfSpeech}</span>}{curated.ipa && <span>{curated.ipa}</span>}<LessonWordAudio word={entry.word} localFile={recording?.file}/></div>
      <section className="word-context-meaning">
        <h3>Meaning in context · 语境词义</h3>
        <p className="word-definition word-definition-en" lang="en">{curated.english}</p>
        <p className="word-definition word-definition-zh" lang="zh-CN">{curated.chinese}</p>
        {curated.dictionaryExample && <details className="word-context-example">
          <summary>Oxford example · 牛津例句</summary>
          <div className="word-context-example-answer">
            <p lang="en">{curated.dictionaryExample.english}</p>
            <p lang="zh-CN">{curated.dictionaryExample.chinese}</p>
            <small>{curated.dictionaryExample.source}</small>
          </div>
        </details>}
      </section>
      {curated.image && <a className="word-picture" href={curated.image} target="_blank" rel="noopener noreferrer" aria-label={`查看 ${entry.word} 原图`}><img src={curated.image} alt={`${entry.word} · 词汇配图`} loading="lazy"/><span>↗ 查看原图</span></a>}
      {curated.otherMeanings.length > 0 && <section className="word-other"><h3>Other meanings · 其他义项</h3><MeaningExamples word={entry.word} items={curated.otherMeanings} useCatalog={false}/></section>}
      {curated.sourceCaveat ? <p className="study-pending">{curated.sourceCaveat}</p> : !curated.oxfordExcerptProvided && <p className="study-pending">此短语所在行未单独附词典原文；释义按文章语境整理，不能标为牛津词典已核实。</p>}
      {curated.otherMeaningsStatus === "missing_source" && <p className="study-pending">其他义项尚无可核对的词典原文。</p>}
    </section> : <section className="word-primary"><h2>{entry.word}</h2><section className="word-context-meaning"><h3>Meaning in context · 语境词义</h3><p className="word-definition study-pending">{lesson.articleId === "06" ? "词义和音标正在依据已提供的词典资料核对；图片待补充。" : "词义、音标和图片待你提供。"}</p></section><p className="study-pending">{["09", "10"].includes(lesson.articleId) ? `讲义第 ${entry.pdfPages.join("、")} 页的原文词语；词义待核对。` : `已在讲义第 ${entry.pdfPages.join("、")} 页找到对应讲解。`}</p></section> },
    { id: "collocations", title: "Collocations", subtitle: "搭配", content: curated ? <div className="word-related"><section><h3>Collocations · 搭配</h3><CollocationLines values={curated.collocations}/></section></div> : pending("Collocations · 搭配") },
    { id: "compare", title: "Compare", subtitle: "近义辨析", content: curated ? <div className="word-related"><section><h3>Compare · 近义辨析</h3><Lines values={curated.compare}/></section></div> : pending("Compare · 近义辨析") },
    { id: "usage", title: "Usage note", subtitle: "用法提醒", content: curated ? <div className="word-related"><section><h3>Usage note · 用法提醒</h3><p>{curated.usage}</p></section></div> : pending("Usage note · 用法提醒") },
    { id: "press", title: "In the press", subtitle: "外刊用法", content: <section className="word-press"><h3>In the press · 外刊用法</h3><p className="word-press-placeholder">外刊例句待补充。</p></section> },
  ];
  return <div className="word-workspace" data-source-row={entry.sourceRow}>
    <nav className="word-picker" aria-label="本句词条"><span>{entries.length} {entries.length === 1 ? "ENTRY" : "ENTRIES"}</span>{entries.map((word, index) => <button type="button" key={word.sourceRow} aria-pressed={index === selected} onClick={() => setSelected(index)}>{word.word}</button>)}</nav>
    <div className="word-context">{badge}<LessonVocabularyText lesson={lesson} sentence={sentence.id} text={lesson.vocabulary.find(word => word.sourceRow === entry.sourceRow)?.titleOnly ? lesson.title : sentence.text} selectedRow={entry.sourceRow} onSelect={({ sourceRow }) => setSelected(entries.findIndex(word => word.sourceRow === sourceRow))}/></div>
    <WordFileDesk key={entry.sourceRow} cards={cards} panelId={`word-file-panel-${lesson.articleId}-${entry.sourceRow}`}/>
  </div>;
}

export function LessonWords({ lesson, sentence, initialSourceRow }: { lesson: Lesson; sentence: LessonSentence; initialSourceRow?: number }) {
  if (["02", "03", "04", "05", "06", "07", "08", "09", "10"].includes(lesson.articleId)) return <PendingPdfWords lesson={lesson} sentence={sentence} initialSourceRow={initialSourceRow}/>;
  return <PopulatedLessonWords lesson={lesson} sentence={sentence} initialSourceRow={initialSourceRow}/>;
}

function PopulatedLessonWords({ lesson, sentence, initialSourceRow }: { lesson: Lesson; sentence: LessonSentence; initialSourceRow?: number }) {
  const entries = lesson.vocabulary.filter(word => word.occurrences.includes(sentence.id));
  const [selected, setSelected] = useState(() => Math.max(0, entries.findIndex(word => word.sourceRow === initialSourceRow)));
  const entry = entries[selected] ?? entries[0];
  const badge = <SentenceBadge sentence={sentence.id} entry={sentence.classification} compact/>;
  if (!entry) return <div className="word-workspace"><div className="word-context">{badge}{sentence.text}</div><div className="word-empty"><h2>Words</h2><p>本句没有词表中的目标词。{sentence.pdfNotes.some(note => note.entry === "words") ? "讲义中的相关表达整理在下方；也可以进入 Structure 查看句法。" : "可以进入 Structure 查看句法。"}</p></div><LessonPdfNotes sentence={sentence} entry="words"/></div>;
  const [english, ...chinese] = entry.definition.split(" — ");
  const contextChinese = chinese.join(" — ") || "语境释义见词典条目。";
  const otherExamples = entry.otherSenses.map((sense) => {
    const parsed = splitMeaningLine(sense);
    return parsed;
  });
  const cards: WordFileCard[] = [
    { id: "meaning", title: "Word & meaning", subtitle: "词义与发音", content: <section className="word-primary">
      <h2>{entry.word}</h2>{entry.titleOnly && <small>Title word · 标题词汇</small>}<div className="word-pronunciation"><span>{entry.partOfSpeech}</span><span>{entry.ipa}</span><LessonWordAudio word={entry.word}/></div>
      <section className="word-context-meaning"><h3>Meaning in context · 语境词义</h3><p className="word-definition word-definition-en" lang="en">{english}</p><p className="word-definition word-definition-zh" lang="zh-CN">{contextChinese}</p></section>
      {otherExamples.length > 0 && <section className="word-other"><h3>Other meanings · 其他义项</h3><MeaningExamples word={entry.word} items={otherExamples}/></section>}
      <div className="lesson-dictionary-sources">{entry.sources.map(source => <a className="word-dictionary" href={source.url} key={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div>
    </section> },
    { id: "collocations", title: "Collocations", subtitle: "搭配", content: <div className="word-related"><section><h3>Collocations · 搭配</h3><CollocationLines values={entry.collocations}/></section></div> },
    { id: "compare", title: "Compare", subtitle: "近义辨析", content: <div className="word-related"><section><h3>Compare · 近义辨析</h3><Lines values={entry.compare}/></section></div> },
    { id: "usage", title: "Usage note", subtitle: "用法提醒", content: <div className="word-related"><LessonWordFamilyGame values={entry.family}/><WordFamilyReminder values={entry.family}/><section><h3>Usage note · 用法提醒</h3><p>{entry.usage}</p></section></div> },
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
      <StructureDiagram englishOnly={sentence.structureEnglishOnly} nodes={sentence.structureNodes} parts={asPairs(sentence.functions)} clauses={asPairs(sentence.clauses)} clauseChinese={lessonClauseChinese} functionEnglish={lessonFunctionEnglish} functionClass={functionRole}/>
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
    <nav className="student-subtabs" aria-label="Activities">{(practice ? practiceTabs : [{ id: "translation" as const, label: "Translation" }]).map(tab => <button type="button" key={tab.id} aria-pressed={panel === tab.id} onClick={() => onPanel(tab.id)}>{tab.label}</button>)}</nav>
    {panel === "translation" ? <p className="student-sentence-translation" lang="zh-CN">{sentence.translation}</p>
      : panel === "meaning" ? <><p className="analysis-kicker">MEANING · 读懂本句</p><p className="student-sentence-translation" lang="zh-CN">{sentence.translation}</p><p className="notebook-analysis-note">{sentence.note}</p></>
      : panel === "voice" ? <><p className="analysis-kicker">VOICE &amp; EFFECT · 表达与语气</p><p>{articleVoices[lesson.articleId]}</p><div className="lesson-reading-cue"><span>{sentence.classification.label}</span><p>{sentence.note}</p></div></>
      : panel === "context" ? <><p className="analysis-kicker">CONTEXT · 放回原段</p><p>Para {String(sentence.paragraph).padStart(2, "0")} · 当前句加深显示</p><div className="lesson-context-paragraph">{lesson.sentences.filter(item => item.paragraph === sentence.paragraph).map(item => <p key={item.id} lang="en" aria-current={item.id === sentence.id ? "true" : undefined}><small>{String(item.id).padStart(2, "0")}</small>{item.text}</p>)}</div></>
      : panel === "paraphrase" ? <div className="student-paraphrase"><p className="student-paraphrase-sentence" lang="en"><LessonParaphraseText original={sentence.text} paraphrase={sentence.paraphrase}/></p><section className="student-paraphrase-comparison"><h3>改写思路 · 高亮为重点重组的表达</h3><p className="student-paraphrase-note" lang="zh-CN">{sentence.note}</p></section></div>
      : <LessonReuse key={`${lesson.articleId}-${sentence.id}`} sentence={sentence}/>}
    {(panel === "meaning" || panel === "voice" || panel === "context") && <LessonPdfNotes sentence={sentence} entry={panel}/>}
  </div>;
}
