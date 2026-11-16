import { Fragment, type ReactNode } from "react";
import { vocabularyMatches as article01Matches } from "./ArticleVocabulary";
import { vocabularyMatches, type Lesson, type LessonSentence } from "./articleLessons";

type ReadingWord = { start: number; end: number; sourceRow: number; word: string };

export function readingWordMatches(lesson: Lesson, sentence: number, text: string): ReadingWord[] {
  return lesson.articleId === "01" ? article01Matches(text, sentence) : vocabularyMatches(lesson, sentence, text);
}

export function titleWordMatches(lesson: Lesson, text: string) {
  return vocabularyMatches({ ...lesson, vocabulary: lesson.vocabulary.map(word => ({ ...word, occurrences: [0] })) }, 0, text);
}

export function readingWordId(articleId: string, sentence: number, word: ReadingWord) {
  return `text-word-${articleId}-${sentence}-${word.sourceRow}-${word.start}`;
}

export function readingWordHref(articleId: string, id: string) {
  return `/?article=${articleId}&open=reading#${id}`;
}

export function ReadingWordRuns({ text, matches, renderWord }: {
  text: string; matches: ReadingWord[]; renderWord: (match: ReadingWord, form: string) => ReactNode;
}) {
  let cursor = 0;
  return <>{matches.map(match => {
    const preceding = text.slice(cursor, match.start);
    cursor = match.end;
    return <Fragment key={match.start}>{preceding}{renderWord(match, text.slice(match.start, match.end))}</Fragment>;
  })}{text.slice(cursor)}</>;
}

export function AnalysisReadingWords({ lesson, sentence, onJump }: {
  lesson: Lesson; sentence: LessonSentence; onJump: (id: string) => void;
}) {
  return <ReadingWordRuns text={sentence.text} matches={readingWordMatches(lesson, sentence.id, sentence.text)}
    renderWord={(word, form) => <ReadingWordLink articleId={lesson.articleId} sentence={sentence.id} word={word} form={form} onJump={onJump}/>}/>;
}

export function AnalysisTitleWords({ lesson, sentence, onJump }: {
  lesson: Lesson; sentence: LessonSentence; onJump: (id: string) => void;
}) {
  const titleRows = lesson.vocabulary.filter(word => word.titleOnly && word.occurrences.includes(sentence.id));
  if (!titleRows.length) return null;
  const words = titleWordMatches(lesson, lesson.title).filter(match => titleRows.some(word => word.sourceRow === match.sourceRow));
  if (!words.length) return null;
  return <p className="notebook-title-vocabulary">
    <span>Title vocabulary</span>{" "}
    {words.map(word => <ReadingWordLink key={word.start} articleId={lesson.articleId} sentence={0}
      word={word} form={lesson.title.slice(word.start, word.end)} onJump={onJump}/>)}
  </p>;
}

function ReadingWordLink({ articleId, sentence, word, form, onJump }: {
  articleId: string; sentence: number; word: ReadingWord; form: string; onJump: (id: string) => void;
}) {
  const id = readingWordId(articleId, sentence, word);
  return <a className="vocabulary-highlight notebook-vocabulary-link" href={readingWordHref(articleId, id)}
    aria-label={`${form} · 在 Text 中查看原文`} onClick={event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      onJump(id);
    }}>{form}</a>;
}
