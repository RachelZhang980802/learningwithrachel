"use client";

import { Fragment, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { LessonVocabularyParagraph, LessonVocabularyText } from "./ArticleLessonContent";
import { getLesson, vocabularyMatches, type Lesson } from "./articleLessons";
import { VocabularyText, VocabularyParagraph, vocabularyMatches as article01VocabularyMatches, type VocabularyTarget } from "./ArticleVocabulary";
import { article01Annotations, article01SyntaxKey, article01ReadingLesson } from "./article01Structure";
import sourceAnnotations from "./article09Syntax.json";
import { article02Annotations, article02SyntaxKey } from "./article02Structure";
import { article03Annotations, article03SyntaxKey } from "./article03Structure";
import { article04Annotations, article04SyntaxKey } from "./article04Structure";
import { article05Annotations, article05SyntaxKey } from "./article05Structure";
import { article06Annotations, article06SyntaxKey } from "./article06Structure";
import { article07Annotations, article07SyntaxKey } from "./article07Structure";
import { article08Annotations, article08SyntaxKey } from "./article08Structure";
import { article10Annotations, article10SyntaxKey } from "./article10Structure";
import { clauseLabels, syntaxColors } from "./articleSyntaxLabels";
import "./article-syntax-reading.css";
import { useSyntaxLabelLayout } from "./useSyntaxLabelLayout";

const emptyExpansion = new Set<number>();

type Annotation = {
  text: string;
  predicates: { start: number; end: number; role: string; text: string }[];
  clauses: { start: number; end: number; anchorEnd: number; kind: string; text: string }[];
  notes: string[];
  parenthesis?: { start: number; end: number };
};
const annotations = sourceAnnotations as Record<string, Annotation>;
function ReadingVocabularyText({ opening = false, ...props }: Parameters<typeof LessonVocabularyText>[0] & { opening?: boolean }) {
  const Text = props.lesson.articleId === "01" ? VocabularyText : LessonVocabularyText;
  if (!opening) return <Text {...props}/>;
  const matches = props.lesson.articleId === "01"
    ? article01VocabularyMatches(props.text, props.sentence)
    : vocabularyMatches(props.lesson, props.sentence, props.text);
  const first = matches.find(match => match.start === 0);
  if (!first) return <Text {...props}/>;
  // A native button is an atomic inline box, so the paragraph's ::first-letter
  // cannot reach its text. Keep the opening word inline and keyboard operable.
  const select = () => props.onSelect({ sentence: props.sentence, sourceRow: first.sourceRow });
  const word = props.text.slice(0, first.end);
  return <><span className="vocabulary-highlight syntax-opening-word" role="button" tabIndex={0}
    data-source-row={first.sourceRow} data-sentence={props.sentence}
    aria-label={props.lesson.articleId === "01" ? `查看词汇 ${first.word.trim()}` : `查看 ${first.word} 的词汇卡`}
    onClick={select} onKeyDown={event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); }
    }}>{props.renderWord ? props.renderWord(word) : word}</span><Text {...props} text={props.text.slice(first.end)}/></>;
}

function AnnotatedSentence({ lesson, sentence, annotation, onSelect, labels, colors, opening = false }: {
  opening?: boolean;
  labels: Record<string, string>; colors?: Record<string, string>;
  lesson: Lesson; sentence: number; annotation: Annotation; onSelect: (target: VocabularyTarget) => void;
}) {
  const { text, predicates, clauses, parenthesis } = annotation;
  const vocabulary = lesson.articleId === "01" ? article01VocabularyMatches(text, sentence) : vocabularyMatches(lesson, sentence, text);
  const cuts = new Set([0, text.length]);
  for (const span of [...predicates, ...clauses, ...vocabulary]) { cuts.add(span.start); cuts.add(span.end); }
  for (const clause of clauses) cuts.add(clause.anchorEnd);
  if (parenthesis) { cuts.add(parenthesis.start); cuts.add(parenthesis.end); }
  // Keep each vocabulary button whole, even when a grammar span overlaps it.
  const positions = [...cuts].filter(position => !vocabulary.some(word => word.start < position && position < word.end)).sort((a, b) => a - b);
  return <>{positions.slice(0, -1).map((start, index) => {
    const end = positions[index + 1];
    const word = vocabulary.find(word => word.start === start);
    const predicate = predicates.find(span => span.start < end && span.end > start);
    const clause = clauses.find(clause => clause.start === start);
    const wordCuts = [...new Set([start, end, ...predicates.flatMap(span => [span.start, span.end]).filter(position => position > start && position < end)])].sort((a, b) => a - b);
    let content: ReactNode = word
      ? <ReadingVocabularyText opening={opening && start === 0} lesson={lesson} sentence={sentence} text={text.slice(start, end)} onSelect={onSelect} renderWord={() => <>{wordCuts.slice(0, -1).map((from, wordIndex) => {
          const to = wordCuts[wordIndex + 1];
          const verb = predicates.find(span => span.start <= from && to <= span.end);
          return verb ? <span key={from} className={`syntax-predicate syntax-${verb.role} syntax-vocabulary-overlap`} title={verb.role === "main" ? "Main clause predicate" : "Subordinate clause predicate"}>{text.slice(from, to)}</span> : <Fragment key={from}>{text.slice(from, to)}</Fragment>;
        })}</>}/>
      : text.slice(start, end);
    if (predicate && !word) content = <span className={`syntax-predicate syntax-${predicate.role}`} title={predicate.role === "main" ? "Main clause predicate" : "Subordinate clause predicate"}>{content}</span>;
    if (clause) content = <span data-anchor-start={clause.start} data-anchor-end={clause.anchorEnd} data-anchor-text={text.slice(clause.start, clause.anchorEnd)} className={`syntax-clause syntax-${clause.kind}`} style={colors ? { "--syntax-clause": colors[clause.kind] } as CSSProperties : undefined} title={`${labels[clause.kind]}: ${clause.text}`}>{content}<span className="syntax-label" data-editable-skip="true">{labels[clause.kind]}</span></span>;
    return <Fragment key={start}>{parenthesis?.start === start && <span className="syntax-parenthesis" aria-label="插入语开始" data-editable-skip="true">(</span>}{content}{parenthesis?.end === end && <span className="syntax-parenthesis" aria-label="插入语结束" data-editable-skip="true">)</span>}</Fragment>;
  })}</>;
}

export function ArticleSyntaxReading({ paragraphs, onSelect, articleId = "09" }: {
  articleId?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10"; paragraphs: string[]; onSelect: (target: VocabularyTarget) => void;
}) {
  const lesson = articleId === "01" ? article01ReadingLesson : getLesson(articleId)!;
  const syntaxKey = articleId === "01" ? article01SyntaxKey : articleId === "02" ? article02SyntaxKey : articleId === "03" ? article03SyntaxKey : articleId === "04" ? article04SyntaxKey : articleId === "05" ? article05SyntaxKey : articleId === "06" ? article06SyntaxKey : articleId === "07" ? article07SyntaxKey : articleId === "08" ? article08SyntaxKey : articleId === "10" ? article10SyntaxKey : undefined;
  const annotatedSource = articleId === "01" ? article01Annotations : articleId === "02" ? article02Annotations : articleId === "03" ? article03Annotations : articleId === "04" ? article04Annotations : articleId === "05" ? article05Annotations : articleId === "06" ? article06Annotations : articleId === "07" ? article07Annotations : articleId === "08" ? article08Annotations : articleId === "10" ? article10Annotations : undefined;
  const labels: Record<string, string> = syntaxKey ? Object.fromEntries(Object.entries(syntaxKey).filter(([kind]) => kind !== "main").map(([kind, value]) => [kind, value.label])) : clauseLabels;
  const colors: Record<string, string> = syntaxKey ? Object.fromEntries(Object.entries(syntaxKey).map(([kind, value]) => [kind, value.color])) : syntaxColors;
  const source: Record<string, Annotation> = annotatedSource ? Object.fromEntries(Object.entries(annotatedSource).map(([id, a]) => [id, { ...a, clauses: a.clauses.filter(c => c.kind !== "main") }])) : annotations;
  const [expansion, setExpansion] = useState({ articleId, sentences: new Set<number>() });
  const expanded = expansion.articleId === articleId ? expansion.sentences : emptyExpansion;
  const readingRef = useRef<HTMLDivElement>(null);
  useSyntaxLabelLayout(readingRef, articleId, expanded);
  function toggle(sentence: number) {
    setExpansion(previous => {
      const next = new Set(previous.articleId === articleId ? previous.sentences : []);
      if (next.has(sentence)) next.delete(sentence); else next.add(sentence);
      return { articleId, sentences: next };
    });
  }
  return <div className="syntax-reading" data-article={articleId} ref={readingRef}>
    <div className="syntax-reading-guide" data-editable-skip="true">
      <div className="syntax-legend" role="group" aria-label="Syntax color key" lang="en">
        <div className="syntax-legend-items"><span><i className="syntax-main" aria-hidden="true"/>Main clause predicate</span><span><i className="syntax-sub" aria-hidden="true"/>Subordinate clause predicate</span>
          {Object.entries(labels).map(([kind, label]) => <span className={`syntax-${kind}`} key={kind}><i aria-hidden="true" style={colors ? { borderColor: colors[kind] } : undefined}/>{label}</span>)}
        </div>
      </div>
    </div>
    <div className="original-text syntax-original-text">
      {paragraphs.map((paragraph, paragraphIndex) => {
        const sentences = lesson.sentences.filter(sentence => sentence.paragraph === paragraphIndex + 1);
        // Fail safely if the source paragraph is edited: never apply stale character offsets.
        // Article 02 includes blank lines before quotations within its numbered paragraphs.
        const aligned = sentences.map(sentence => sentence.text).join(" ") === (articleId === "02" ? paragraph.replace(/\s+/g, " ") : paragraph);
        return <div className="prose syntax-paragraph" key={paragraphIndex}>
          <span className="paragraph-number">{String(paragraphIndex + 1).padStart(2, "0")}</span>
          <div className="syntax-sentences">{aligned ? sentences.map((sentence, index) => {
            const annotation = source[String(sentence.id)];
            const valid = annotation?.text === sentence.text;
            const open = valid && expanded.has(sentence.id);
            const id = `syntax-${articleId}-${sentence.id}`;
            return <div className={`syntax-sentence${open ? " is-annotated" : ""}`} data-sentence-id={sentence.id} key={sentence.id}>
              <button className="syntax-number" type="button" aria-expanded={open} aria-controls={id} disabled={!valid} aria-label={`第${paragraphIndex + 1}段第${index + 1}句：${open ? "收起" : "显示"}句法标记`} onClick={() => toggle(sentence.id)} data-editable-skip="true">[{index + 1}]</button>
              <div id={id} className="syntax-sentence-content">
                <p className={`syntax-copy${paragraphIndex === 0 && index === 0 ? " syntax-opening-copy" : ""}`} lang="en">{open ? <AnnotatedSentence opening={paragraphIndex === 0 && index === 0} lesson={lesson} sentence={sentence.id} annotation={annotation} onSelect={onSelect} labels={labels} colors={colors}/> : <ReadingVocabularyText opening={paragraphIndex === 0 && index === 0} lesson={lesson} sentence={sentence.id} text={sentence.text} onSelect={onSelect}/>}</p>
                {open && annotation.notes.length > 0 && <div className="syntax-notes" lang="zh-CN" data-editable-skip="true">{annotation.notes.map(note => <p key={note}>{note}</p>)}</div>}
              </div>
            </div>;
          }) : <p className={`syntax-copy${paragraphIndex === 0 ? " syntax-opening-copy" : ""}`}>{articleId === "01" ? <VocabularyParagraph text={paragraph} sentenceStart={lesson.sentences.find(s => s.paragraph === paragraphIndex + 1)?.id ?? 1} onSelect={onSelect}/> : <LessonVocabularyParagraph articleId={articleId} paragraph={paragraphIndex + 1} text={paragraph} onSelect={onSelect}/>}</p>}</div>
        </div>;
      })}
    </div>
  </div>;
}
