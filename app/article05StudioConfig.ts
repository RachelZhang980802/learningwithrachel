import audioManifest from "../public/audio/article-05/manifest.json";

export type Article05Sentence = {
  sentenceId: string;
  paragraphId: string;
  text: string;
  audioSrc: string;
  startTime: number;
  endTime: number;
  verified: boolean;
  needsReview: boolean;
};

export const article05StudioConfig = {
  articleId: "05",
  lineArtSrc: "/media/article05-courage-lineart.png",
  catSrc: "/media/article05-courage-cat.png",
  paragraphs: 32,
  sentences: audioManifest.sentences.map((sentence) => ({
    ...sentence,
    audioSrc: `/media${sentence.audioSrc}`,
  })) as Article05Sentence[],
} as const;
