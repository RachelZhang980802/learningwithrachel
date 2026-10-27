"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: H1B 签证暴涨 10 万美元，对留学移民美国意味着什么？.pdf, page 8; answers checked after rotating the answer block.
export function H1BVisaExercises() {
  return <section className={styles.exercises} aria-labelledby="h1b-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="h1b-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="h1b-vocabulary-title">
      <h3 id="h1b-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer={"deportation"} label="第 1 题第 1 空答案" />: the act of forcing sb. to leave a country, usually because they have broken the law or because they have no legal right to be there</p>
      <p><AnswerBlank answer={"initiative"} label="第 1 题第 2 空答案" />: an important new plan or process to achieve a particular aim or to solve a particular problem</p>
    </section>
    <section className={styles.question} aria-labelledby="h1b-choice-title">
      <h3 id="h1b-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence "Donald Trump has turned to overhauling the H-1B visa program, a cornerstone of the employment-based immigration system that allows US companies to hire college-educated foreign workers for specialized <u>occupations</u>."? <AnswerBlank answer={"D"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>Before becoming a politician, his main <u>occupation</u> was farming. <span className={styles.optionMeaning} lang="zh-CN">（职业；工作）</span></li>
        <li>The building's <u>occupation</u> by protesters lasted for three days. <span className={styles.optionMeaning} lang="zh-CN">（占领；占据）</span></li>
        <li>The continuous <u>occupation</u> of the territory by foreign forces led to a period of instability. <span className={styles.optionMeaning} lang="zh-CN">（军事占领）</span></li>
        <li>The police asked for the man's name and <u>occupation</u> before letting him go. <span className={styles.optionMeaning} lang="zh-CN">（职业；岗位）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="h1b-translation-title">
      <h3 id="h1b-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">这些签证是临时性的，最长可持续 6 年，但如果公司已为工人申请基于就业的绿卡以获得美国永久居留权，则可以无限期延长。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"The visas are temporary, lasting as long as six years, but can be extended indefinitely if a company has sponsored a worker's employment-based green card application for permanent residency in the US."} />
    </section>
  </section>;
}
