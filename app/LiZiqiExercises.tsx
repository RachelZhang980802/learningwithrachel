"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: 《纽约客》论李子柒的田园美学.pdf, page 6; answers checked after rotating the answer block.
export function LiZiqiExercises() {
  return <section className={styles.exercises} aria-labelledby="liziqi-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="liziqi-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="liziqi-vocabulary-title">
      <h3 id="liziqi-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer={"verve"} label="第 1 题第 1 空答案" />: energy, excitement or enthusiasm</p>
      <p><AnswerBlank answer={"quotidian"} label="第 1 题第 2 空答案" />: ordinary; typical of what happens every day</p>
    </section>
    <section className={styles.question} aria-labelledby="liziqi-choice-title">
      <h3 id="liziqi-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence "she <u>stokes</u> the fire underneath a large cast-iron wok"? <AnswerBlank answer={"C"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The government's policies <u>stoked</u> inflation fears. <span className={styles.optionMeaning} lang="zh-CN">（加剧恐惧）</span></li>
        <li>His passionate speech <u>stoked</u> the crowd's enthusiasm. <span className={styles.optionMeaning} lang="zh-CN">（激起热情）</span></li>
        <li>The farmer <u>stoked</u> the furnace with more coal. <span className={styles.optionMeaning} lang="zh-CN">（添柴；生火）</span></li>
        <li>These rumors only served to <u>stoke</u> tensions in the region. <span className={styles.optionMeaning} lang="zh-CN">（加剧紧张局势）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="liziqi-translation-title">
      <h3 id="liziqi-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">她所营造的田园生活美学同样在全球范围内大受欢迎， 尤其是在疫情期间。梭罗所称的“简单、独立、宽容、信任”在她的生活中得到完美诠释，唤起了人们逃离病态社会的渴望。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"Her Arcadian aesthetic proved just as popular with a global audience, specifically during the pandemic, when Li's life of \"simplicity, independence, magnanimity, and trust,\" as Thoreau put it, tapped into a desire to escape a sick society."} />
    </section>
  </section>;
}
