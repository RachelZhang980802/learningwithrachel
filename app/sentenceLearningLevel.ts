export type SentenceLearningLevel = "simple" | "long";

// Preserve grammar taxonomy in the source data while giving the notebook a
// learning path that also treats reduced clauses and structurally dense
// single-clause sentences as long/difficult.
const longLearningSentenceIds: Record<string, ReadonlySet<number>> = {
  "01": new Set([1, 10, 12, 25, 27, 32, 33, 36, 40]),
  "02": new Set([7, 33]),
  "03": new Set([18, 22, 46, 56]),
  "04": new Set([6, 10, 11, 16, 25, 41, 66]),
  "05": new Set([1, 10, 20, 32, 36, 37, 44, 50, 53, 54, 74, 80]),
  "06": new Set([2, 8, 10, 21, 26, 28, 36, 41, 47]),
  "07": new Set([1, 2, 6, 7, 9, 11, 14, 39, 45]),
  "08": new Set([15, 28, 33]),
  "09": new Set([5, 13, 14, 15, 16, 21, 22, 30, 32, 33, 45, 46, 50]),
  "10": new Set([15]),
};

export function getSentenceLearningLevel(articleId: string, sentenceId: number, syntaxType: string): SentenceLearningLevel {
  return syntaxType === "simple" && !longLearningSentenceIds[articleId]?.has(sentenceId) ? "simple" : "long";
}
