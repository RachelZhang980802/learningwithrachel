import { withArticle02Structure } from "./article02Structure";
import { withArticle03Structure } from "./article03Structure";
import { withArticle04Structure } from "./article04Structure";
import { withArticle05Structure } from "./article05Structure";
import { withArticle06Structure } from "./article06Structure";
import { withArticle07Structure } from "./article07Structure";
import data from "./article02to05Lessons.json";
import { withArticle08Structure } from "./article08Structure";
import { withArticle10Structure } from "./article10Structure";
import { withArticle09Structure } from "./article09Structure";
import type { StructureNode } from "./structureDiagram";
import laterData from "./article06to10Lessons.json";
import { article02PdfVocabulary } from "./article02PdfVocabulary";
import { article03to05PdfVocabulary } from "./article03to05PdfVocabulary";
import { article06to08PdfVocabulary } from "./article06to08PdfVocabulary";
import { article09PdfVocabulary } from "./article09PdfVocabulary";
import { article10PdfVocabulary } from "./article10PdfVocabulary";
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
  structureNodes?: StructureNode[];
  structureEnglishOnly?: boolean;
  structureClassification?: SentenceClassification;
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
articleLessons["09"] = { ...articleLessons["09"], sentences: articleLessons["09"].sentences.map(withArticle09Structure) };
articleLessons["10"] = { ...articleLessons["10"], sentences: articleLessons["10"].sentences.map(withArticle10Structure) };
articleLessons["08"] = { ...articleLessons["08"], sentences: articleLessons["08"].sentences.map(withArticle08Structure) };
articleLessons["07"] = { ...articleLessons["07"], sentences: articleLessons["07"].sentences.map(withArticle07Structure) };
articleLessons["06"] = { ...articleLessons["06"], sentences: articleLessons["06"].sentences.map(withArticle06Structure) };
articleLessons["05"] = { ...articleLessons["05"], sentences: articleLessons["05"].sentences.map(withArticle05Structure) };
articleLessons["04"] = { ...articleLessons["04"], sentences: articleLessons["04"].sentences.map(withArticle04Structure) };
articleLessons["03"] = { ...articleLessons["03"], sentences: articleLessons["03"].sentences.map(withArticle03Structure) };
articleLessons["02"] = { ...articleLessons["02"], sentences: articleLessons["02"].sentences.map(withArticle02Structure) };
export const getLesson = (articleId: string): Lesson | undefined => articleLessons[articleId];
const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Match actual source forms; keep original spelling, punctuation and character offsets. */
export function vocabularyMatches(lesson: Lesson, sentence: number, text: string) {
  const words = sentence === 0 ? lesson.vocabulary : lesson.articleId === "02" ? article02PdfVocabulary : lesson.articleId === "09" ? article09PdfVocabulary : lesson.articleId === "10" ? article10PdfVocabulary : (article03to05PdfVocabulary[lesson.articleId] ?? article06to08PdfVocabulary[lesson.articleId] ?? lesson.vocabulary);
  const candidates = words.filter(word => word.occurrences.includes(sentence)).flatMap(word =>
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
