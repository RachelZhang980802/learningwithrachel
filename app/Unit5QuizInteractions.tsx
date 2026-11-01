"use client";

import { Fragment, isValidElement, useState, type ReactNode } from "react";
import "./unit5-quiz-interactions.css";

export function Unit5SentenceReveal({ prompt, answer, translation }: { prompt: ReactNode; answer: ReactNode; translation?: string }) {
  const [open, setOpen] = useState(false);
  const sourceChinese = isValidElement<{ lang?: string }>(prompt) && prompt.props.lang === "zh-CN" ? prompt : null;
  return <button type="button" className="quiz-question-card u5-sentence-reveal" aria-expanded={open} onClick={() => setOpen(value => !value)}>
    <span className="u5-sentence-prompt">{prompt}</span>
    {open && <>
      <span className="u5-inline-answer"> — {answer}</span>
      {(translation || sourceChinese) && <span className="u5-chinese-note" lang="zh-CN">{translation || sourceChinese}</span>}
    </>}
  </button>;
}

const timelineTimes = [
  "Before World War I,",
  "When Apple was in elementary school,",
  "During Apple’s college days,",
  "In the late 1960s,",
  "Later, after Apple finished his studies,",
  "When Apple was depressed,",
  "About two years later,",
  "At the age of 107,",
];

const timelineEvents = [
  "he and his grandfather shared a house and thereafter he taught his grandfather some knowledge such as electricity.",
  "Apple studied for Ph.D. preliminary exams at the University of Michigan, where he had his grandfather joining him as his roommate.",
  "Apple’s grandfather came to the U.S. from Lithuania.",
  "he married, fathered kids, and settled in Houston, Texas, while his grandfather moved again and joined him.",
  "his grandfather took care of the troubled family, taking out the garbage, playing with the children, and mowing the lawn.",
  "he and his grandfather were temporarily separated, and he had college roommates about his age.",
  "Apple regained faith in life.",
  "Apple’s grandfather passed away.",
];

const timelineMatches = ["C", "A", "F", "B", "D", "E", "G", "H"];
const timelineTranslations = [
  "第一次世界大战前，阿普尔的祖父从立陶宛来到美国。",
  "阿普尔上小学时，他和祖父住在一起，后来还教祖父电学等知识。",
  "阿普尔上大学期间，他和祖父暂时分开，与年龄相仿的大学同学合住。",
  "20世纪60年代末，阿普尔在密歇根大学准备博士资格考试，祖父搬来和他做室友。",
  "后来，阿普尔完成学业、结婚生子并在得克萨斯州休斯敦安顿下来，祖父再次搬来与他同住。",
  "阿普尔陷入抑郁时，祖父照料这个困顿的家庭：倒垃圾、陪孩子玩、修剪草坪。",
  "大约两年后，阿普尔重新找回了生活的信心。",
  "祖父107岁时去世。",
];

export function Unit5TimelineMatch() {
  const [opened, setOpened] = useState<Record<number, boolean>>({});
  return <div className="quiz-question-card u5-timeline-grid">
    <ol className="u5-timeline-times">{timelineTimes.map((time, index) => <li key={time}>
      <button type="button" aria-expanded={!!opened[index]} onClick={() => setOpened(previous => ({ ...previous, [index]: !previous[index] }))}>
        <span>{time}</span>{opened[index] && <><strong className="u5-match-answer"> → {timelineMatches[index]}</strong><span className="u5-chinese-note" lang="zh-CN">{timelineTranslations[index]}</span></>}
      </button>
    </li>)}</ol>
    <ol className="u5-timeline-events" type="A">{timelineEvents.map(event => <li key={event}>{event}</li>)}</ol>
  </div>;
}

export function Unit5PrefixQuestion({ words, prefix, meaning, meaningChinese, example, translation }: { words: string; prefix: string; meaning: string; meaningChinese: string; example: string; translation: string }) {
  const [meaningOpen, setMeaningOpen] = useState(false);
  const [exampleOpen, setExampleOpen] = useState(false);
  return <blockquote className="quiz-question-card u5-prefix-question">
    <strong>{words}</strong>
    <span>{prefix}: <button type="button" className="u5-inline-blank" aria-expanded={meaningOpen} onClick={() => setMeaningOpen(value => !value)}>{meaningOpen ? <span className="u5-inline-answer">{meaning}</span> : <span aria-hidden="true">&nbsp;</span>}</button></span>
    {meaningOpen && <span className="u5-chinese-note" lang="zh-CN">{meaningChinese}</span>}
    <span>Sentence: <button type="button" className="u5-sentence-blank" aria-expanded={exampleOpen} onClick={() => setExampleOpen(value => !value)}>{exampleOpen ? <span className="u5-inline-answer">{example}</span> : <span aria-hidden="true">&nbsp;</span>}</button></span>
    {exampleOpen && <span className="u5-chinese-note" lang="zh-CN">{translation}</span>}
  </blockquote>;
}

export function Unit5BlankSentence({ sentence, answer, translation, wordBank }: { sentence: string; answer: string; translation: string; wordBank?: string }) {
  const [open, setOpen] = useState(false);
  const [before, after] = sentence.split("________");
  return <blockquote className="quiz-question-card u5-blank-question">
    {wordBank && <p className="u5-word-bank">{wordBank}</p>}
    <span>{before}<button type="button" className="u5-inline-blank" aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? <span className="u5-inline-answer">{answer}</span> : <span aria-hidden="true">&nbsp;</span>}</button>{after}</span>
    {open && <span className="u5-chinese-note" lang="zh-CN">{translation}</span>}
  </blockquote>;
}

type FlashbackSentence = { parts: string[]; answers?: string[]; translation: string; paragraph?: boolean };

const flashbackSentences: FlashbackSentence[] = [
  { parts: ["That morning, when Joe refused to take the regular way to campus and insisted on taking a detour again, I suddenly realized the reason behind it:"], translation: "那天早晨，乔拒绝走平常去校园的路，坚持再次绕道，我突然明白了其中的原因：" },
  { parts: ["There was a hospital on the regular way to campus."], translation: "平常去校园的路上有一家医院。" },
  { parts: ["It was in 1969."], translation: "那是在1969年。", paragraph: true },
  { parts: ["Joe had spent the entire month of July in hospital, at his grandma’s bedside."], translation: "乔整个七月都守在医院祖母的病床边。" },
  { parts: ["Her long fingers had felt like bones bundled in thin silk, and they offered no resistance when he (1) ", " (squeeze) them."], answers: ["squeezed"], translation: "她修长的手指摸起来像包在薄绸里的骨头；当他握住它们时，它们毫无抵抗。" },
  { parts: ["When at last he (2) ", " (feel) some slight pressure, almost indiscernible, he watched her face."], answers: ["felt"], translation: "终于，当他感觉到一丝几乎无法察觉的压力时，他注视着她的脸。" },
  { parts: ["She opened her eyes and (3) ", " (meet) his gaze for just a moment before the muscles of her face (4) ", " (contract), as if in pain."], answers: ["met", "contracted"], translation: "她睁开眼睛，与他对视了一瞬，随后面部肌肉仿佛因疼痛而收缩。" },
  { parts: ["Her eyes clamped shut in a last grimace, and each inhalation came several seconds after the last."], translation: "她最后痛苦地闭紧双眼，每一次吸气都比上一次迟了好几秒。" },
  { parts: ["Joe (5) ", " (watch) a vein below her ear pulse like the heart of a frightened bird."], answers: ["watched"], translation: "乔看着她耳下的一根血管跳动，像一只受惊小鸟的心脏。" },
  { parts: ["Even when her breathing (6) ", " (stop), the pulse (7) ", " (beat) on for a second or two more."], answers: ["stopped", "beat"], translation: "即使她停止了呼吸，脉搏仍又跳动了一两秒。" },
  { parts: ["He watched until it went still and all the lines on her face (8) ", " (smooth) away, and then he (9) ", " (lay) her hand, still loose in his, atop the crisp, white sheet."], answers: ["smoothed", "laid"], translation: "他一直看着，直到脉搏静止、她脸上的皱纹全都舒展开来；随后，他把她仍松放在自己手中的手搁在挺括的白床单上。" },
  { parts: ["It (10) ", " (be) time, he thought now, to get past all that."], answers: ["was"], translation: "他现在想，是时候走出这一切了。" },
];

export function Unit5FlashbackPassage() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [translations, setTranslations] = useState<Record<number, boolean>>({});
  return <div className="quiz-question-card u5-flashback-passage">{flashbackSentences.map((sentence, sentenceIndex) => <div key={sentence.parts.join("_")} className={`u5-flashback-sentence${sentence.paragraph ? " starts-paragraph" : ""}`} role="button" tabIndex={0} aria-expanded={!!translations[sentenceIndex]} onClick={() => setTranslations(previous => ({ ...previous, [sentenceIndex]: !previous[sentenceIndex] }))} onKeyDown={event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setTranslations(previous => ({ ...previous, [sentenceIndex]: !previous[sentenceIndex] }));
    }
  }}>
    <span>{sentence.parts.map((part, answerIndex) => <Fragment key={answerIndex}>{part}{sentence.answers?.[answerIndex] && <button type="button" className="u5-inline-blank" aria-expanded={!!answers[`${sentenceIndex}-${answerIndex}`]} onClick={event => {
      event.stopPropagation();
      const key = `${sentenceIndex}-${answerIndex}`;
      const next = !answers[key];
      const anotherOpen = Object.entries(answers).some(([candidate, value]) => candidate.startsWith(`${sentenceIndex}-`) && candidate !== key && value);
      setAnswers(previous => ({ ...previous, [key]: next }));
      setTranslations(previous => ({ ...previous, [sentenceIndex]: next || anotherOpen }));
    }}>{answers[`${sentenceIndex}-${answerIndex}`] ? <span className="u5-inline-answer">{sentence.answers[answerIndex]}</span> : <span aria-hidden="true">&nbsp;</span>}</button>}</Fragment>)}</span>
    {translations[sentenceIndex] && <span className="u5-chinese-note" lang="zh-CN">{sentence.translation}</span>}
  </div>)}</div>;
}
