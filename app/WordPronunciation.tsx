"use client";
import { useRef, useState } from "react";
import recordings from "../public/audio/article-01-words-native/manifest.json";
const nativeRecordings = recordings as Record<string, { file: string; source: string }>;
export function WordPronunciation({ word, sourceRow }: { word: string; sourceRow: number }) {
  const recording = [28, 29, 32].includes(sourceRow) ? undefined : nativeRecordings[String(sourceRow)];
  const recordedWord = ({ 7: "get", 15: "hit", 40: "call", 54: "clinch", 57: "quicken" } as Record<number, string>)[sourceRow] ?? word.trim();
  const lookupWord = recordedWord.replace(/\b(sth|sb)\.?/gi, "").replace(/[“”‘’]/g, "").trim();
  const audioSrc = recording?.file ?? `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(lookupWord)}&type=2`;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  async function play() { const audio=audioRef.current; if(!audio)return; audio.currentTime=0; try{await audio.play()}catch{setPlaying(false)} }
  return <><button type="button" className="word-speak" onClick={play} aria-label={`${playing ? "重新播放" : "播放"} ${recordedWord} 的词典美式发音`} aria-pressed={playing} title={`${recording ? "剑桥词典" : "有道词典"} · ${recordedWord} · 美式发音`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></svg></button><audio ref={audioRef} preload="none" src={audioSrc} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)}/></>;
}
