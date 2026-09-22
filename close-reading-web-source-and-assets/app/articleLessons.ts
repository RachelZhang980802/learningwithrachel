import data from "./article02to05Lessons.json";
import laterData from "./article06to10Lessons.json";
import type { SentenceClassification } from "./ArticleOneNotebook";

export type PdfNote = {
  entry: "words" | "grammar" | "meaning" | "voice" | "context";
  title: string; text: string; pages: number[]; articleId: string;
  disposition: string;
  references?: { label: string; url: string }[];
};
export type LessonSentence = {
  id: number; text: string; paragraph: number; audioSrc: string; translation: string;
  classification: SentenceClassification; clauses: string[][]; functions: string[][]; note: string;
  paragraphStart: number; paragraphEnd: number; paraphrase: string;
  reuse: { pattern: string; zh: string; en: string; note?: string };
  pdfNotes: PdfNote[];
};
export type LessonWord = {
  sourceRow: number; word: string; forms: string[]; ipa: string; partOfSpeech: string;
  definition: string; collocations: string[]; compare: string[]; family: string[]; usage: string;
  sources: { label: string; url: string }[]; occurrences: number[];
  titleOnly?: boolean;
  otherSenses: string[]; otherSensesReviewed: boolean;
};
export type Lesson = { articleId: string; title: string; catSrc: string; sentences: LessonSentence[]; vocabulary: LessonWord[] };
// The enrichment builder validates every entry, destination, ID and required field.
export const articleLessons = { ...data, ...laterData } as Record<string, Lesson>;
export const getLesson = (articleId: string): Lesson | undefined => articleLessons[articleId];
const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Match actual source forms; keep original spelling, punctuation and character offsets. */
export function vocabularyMatches(lesson: Lesson, sentence: number, text: string) {
  const candidates = lesson.vocabulary.filter(word => word.occurrences.includes(sentence)).flatMap(word =>
    word.forms.flatMap(form => [...text.matchAll(new RegExp(`\\b${escapeRegex(form)}\\b`, "gi"))].map(match => ({
      start: match.index!, end: match.index! + match[0].length, sourceRow: word.sourceRow, word: word.word,
    }))));
  candidates.sort((a, b) => a.start - b.start || b.end - a.end);
  return candidates.filter((match, index) => !candidates.slice(0, index).some(previous => previous.start <= match.start && previous.end > match.start));
}

/** Use the verified sentence-to-paragraph alignment without re-splitting dialogue. */
export function paragraphSegments(lesson: Lesson, paragraph: number, text: string) {
  const sentences = lesson.sentences.filter(sentence => sentence.paragraph === paragraph);
  let cursor = 0;
  return sentences.map((sentence, index) => {
    const end = index === sentences.length - 1 ? text.length : sentence.paragraphEnd;
    const segment = { sentence: sentence.id, text: text.slice(cursor, end) };
    cursor = end;
    return segment;
  });
}
