import { article01ReadingLesson } from "./article01Structure";
import { vocabularyMatches as article01VocabularyMatches } from "./ArticleVocabulary";
import { getLesson, vocabularyMatches as lessonVocabularyMatches } from "./articleLessons";
import type { NotebookPanel } from "./ArticleOneNotebook";

const noWordsPanels: readonly NotebookPanel[] = ["structure", "translation", "paraphrase", "reuse"];
const simpleWithWordsPanels: readonly NotebookPanel[] = ["words", "structure", "translation"];
const article01FullPanels: readonly NotebookPanel[] = ["words", "structure", "translation", "paraphrase", "reuse"];

/** Show Words only when the sentence has a real word card, including title words. */
export function notebookPanelsForSentence(articleId: string, sentenceId: number): readonly NotebookPanel[] | undefined {
  if (articleId === "01") {
    const sentence = article01ReadingLesson.sentences[sentenceId - 1];
    if (!sentence) return undefined;
    const hasWords = article01VocabularyMatches(sentence.text, sentenceId).length > 0;
    if (!hasWords) return noWordsPanels;
    return sentence.classification.studyLevel === "simple" ? simpleWithWordsPanels : article01FullPanels;
  }

  const lesson = getLesson(articleId);
  const sentence = lesson?.sentences[sentenceId - 1];
  if (!lesson || !sentence) return undefined;
  const hasWords = lessonVocabularyMatches(lesson, sentence.id, sentence.text).length > 0
    || lesson.vocabulary.some(word => word.titleOnly && word.occurrences.includes(sentence.id));
  if (!hasWords) return noWordsPanels;
  return sentence.classification.studyLevel === "simple" ? simpleWithWordsPanels : undefined;
}
