import audioManifest from "../public/audio/article-04/manifest.json";
import { toMediaUrl } from "./mediaUrl";

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
    lineArtSrc: "https://assets.negentropylearning.com.cn/media/article04-appearances-lineart.png",
    catSrc: "https://assets.negentropylearning.com.cn/media/article04-appearances-cat.png",
    paragraphs: 13,
    sentences: audioManifest.sentences.map((sentence) => ({
      ...sentence,
      audioSrc: toMediaUrl(`/media${sentence.audioSrc}`),
    })) as Article04Sentence[],
  },
} as const;
