import article06Manifest from "../public/audio/article-06-batch-v3/manifest.json";
import article07Manifest from "../public/audio/article-07-aligned-v4/manifest.json";
import article08Manifest from "../public/audio/article-08-aligned-v4/manifest.json";
import article09Manifest from "../public/audio/article-09-aligned-v4/manifest.json";
import article10Manifest from "../public/audio/article-10-aligned-v4/manifest.json";

export type SetupSentence = {
  sentenceId: string;
  paragraphId: string;
  text: string;
  audioSrc: string | null;
  startTime: number;
  endTime: number;
  verified: boolean;
  needsReview: boolean;
};

export type SetupArticleConfig = {
  articleId: string;
  lineArtSrc: string;
  catSrc: string;
  paragraphs: number;
  sentences: SetupSentence[];
};

const withMediaAudio = (sentences: SetupSentence[]): SetupSentence[] =>
  sentences.map((sentence) => ({
    ...sentence,
    audioSrc: sentence.audioSrc ? `/media${sentence.audioSrc}` : null,
  }));

export const articleStudioConfigs0610: Record<string, SetupArticleConfig> = {
  "06": { articleId: "06", lineArtSrc: "/media/article-themes/article06-reading-lineart.png", catSrc: "/media/article-themes/article06-reading-cat-v3.png", paragraphs: 5, sentences: withMediaAudio(article06Manifest.sentences as SetupSentence[]) },
  "07": { articleId: "07", lineArtSrc: "/media/article-themes/article07-cities-lineart.png", catSrc: "/media/article-themes/article07-cities-cat.png", paragraphs: 12, sentences: withMediaAudio(article07Manifest.sentences as SetupSentence[]) },
  "08": { articleId: "08", lineArtSrc: "/media/article-themes/article08-food-lineart.png", catSrc: "/media/article-themes/article08-food-cat.png", paragraphs: 20, sentences: withMediaAudio(article08Manifest.sentences as SetupSentence[]) },
  "09": { articleId: "09", lineArtSrc: "/media/article-themes/article09-travel-lineart.png", catSrc: "/media/article-themes/article09-travel-cat-final.png", paragraphs: 10, sentences: withMediaAudio(article09Manifest.sentences as SetupSentence[]) },
  "10": { articleId: "10", lineArtSrc: "/media/article-themes/article10-river-lineart.png", catSrc: "/media/article-themes/article10-river-cat-v3-alpha.png", paragraphs: 4, sentences: withMediaAudio(article10Manifest.sentences as SetupSentence[]) },
};
