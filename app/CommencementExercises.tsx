"use client";

import { useState, type ReactNode } from "react";
import styles from "./CommencementExercises.module.css";

export function AnswerBlank({ answer, label, variant = "word" }: { answer: ReactNode; label: string; variant?: "word" | "choice" | "translation" }) {
  const [revealed, setRevealed] = useState(false);
  return <button
    type="button"
    className={`${styles.blank} ${styles[variant]}`}
    aria-label={`${revealed ? "隐藏" : "显示"}${label}`}
    aria-expanded={revealed}
    data-editable-skip
    onClick={(event) => {
      const next = !revealed;
      setRevealed(next);
      if (variant === "choice") {
        const group = event.currentTarget.closest("[data-choice-question]") ?? event.currentTarget.closest("section");
        group?.setAttribute("data-choice-answer-revealed", String(next));
      }
    }}
  ><span aria-live="polite">{revealed ? answer : <span aria-hidden="true">{variant === "choice" ? "（　）" : "\u00a0"}</span>}</span></button>;
}

export function CommencementExercises() {
  return <section className={styles.exercises} aria-labelledby="commencement-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="commencement-exercises-title">Exercises</h2>
    </header>
    <section className={styles.question} aria-labelledby="commencement-vocabulary-title">
      <h3 id="commencement-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer="drop names" label="第 1 题第 1 空答案" />: to mention famous people you know or have met in order to impress others</p>
      <p><AnswerBlank answer="vicissitude" label="第 1 题第 2 空答案" />: one of the many changes and problems in a situation or in your life, that you have to deal with</p>
    </section>
    <section className={styles.question} aria-labelledby="commencement-choice-title">
      <h3 id="commencement-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;Don&apos;t see this as a void; see it as a permission <u>slip</u>.&quot;? <AnswerBlank answer="A" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>He checked the betting <u>slip</u> before the horse race. <span className={styles.optionMeaning} lang="zh-CN">（赛马下注单）</span></li>
        <li>There were a few <u>slips</u> in the translation. <span className={styles.optionMeaning} lang="zh-CN">（错误；疏漏）</span></li>
        <li>You will need a half <u>slip</u> for that dress. <span className={styles.optionMeaning} lang="zh-CN">（衬裙）</span></li>
        <li>One <u>slip</u> and you could fall to your death. <span className={styles.optionMeaning} lang="zh-CN">（失足；差错）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="commencement-translation-title">
      <h3 id="commencement-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">该理论认为，接触天才之作具有拓展意识的力量。若你常与天才（之作）为伴，你的思想终将比只接触平庸之物时更为宽广深邃。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="This theory is based on the idea that exposure to genius has the power to expand your consciousness. If you spend a lot of time with genius, your mind will end up bigger and broader than if you spend your time only with run-of-the-mill stuff." />
    </section>
  </section>;
}
