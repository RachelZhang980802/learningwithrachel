import audioManifest from "../public/audio/article-05/manifest.json";
import { toMediaUrl } from "./mediaUrl";

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
  lineArtSrc: "https://assets.negentropylearning.com.cn/media/article05-courage-lineart.png",
  catSrc: "https://assets.negentropylearning.com.cn/media/article05-courage-cat.png",
  paragraphs: 32,
  sentences: audioManifest.sentences.map((sentence) => ({
    ...sentence,
    audioSrc: toMediaUrl(`/media${sentence.audioSrc}`),
  })) as Article05Sentence[],
} as const;
