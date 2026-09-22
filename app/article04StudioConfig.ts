import audioManifest from "../public/audio/article-04/manifest.json";

export type Article04Sentence = {
  sentenceId: string;
  paragraphId: string;
  text: string;
  audioSrc: string;
  startTime: number;
  endTime: number;
  verified: boolean;
  needsReview: boolean;
};

export const articleStudioConfigs = {
  "04": {
    articleId: "04",
    lineArtSrc: "/media/article04-appearances-lineart.png",
    catSrc: "/media/article04-appearances-cat.png",
    paragraphs: 13,
    sentences: audioManifest.sentences.map((sentence) => ({
      ...sentence,
      audioSrc: `/media${sentence.audioSrc}`,
    })) as Article04Sentence[],
  },
} as const;
