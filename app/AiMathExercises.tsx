"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function AiMathExercises() {
  return <section className={styles.exercises} aria-labelledby="ai-math-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="ai-math-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="ai-math-vocabulary-title">
      <h3 id="ai-math-vocabulary-title">1. 根据英文释义写出文中出现的对应单词（或词组）</h3>
      <p><AnswerBlank answer="ad hoc" label="第 1 题第 1 空答案" />: made or happening for a particular purpose or need, not planned in advance</p>
      <p><AnswerBlank answer="innumerate" label="第 1 题第 2 空答案" />: unable to understand and use basic numbers in calculations</p>
    </section>
    <section className={styles.question} aria-labelledby="ai-math-choice-title">
      <h3 id="ai-math-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined word is closest in meaning to the one in the sentence &quot;…one told me that he had been taught in high school that whenever he had a spreadsheet full of data (such as results from a lab experiment or information collected from a survey), he could write a quick bit of code to <u>parse</u> and analyze that data.&quot;? <AnswerBlank answer="C" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>We <u>parse</u> every moment for clues to why he took his life.</li>
        <li>These days, children aren&apos;t taught how to <u>parse</u> a sentence.</li>
        <li>Before version 3.0, a stream was converted to a string before being <u>parsed</u>.</li>
        <li>The economist <u>parses</u> how emotion, cognition, and perception shape business risk.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="ai-math-translation-title">
      <h3 id="ai-math-translation-title">3. 翻译：根据给定中文回译英文</h3>
      <p lang="zh-CN">单一技术技能已不足以应对市场中的不可预测结果，唯有掌握更广博的数学与语言知识方能适应变局。尽管某些行业的岗位可能消失，但我们始终需要能够理解人工智能的人。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="Technical skills won't be enough to deal with the unpredictable results in markets, so a broad-based knowledge of math and language will be the only way to adapt. And while jobs might disappear in one sector, we will always need humans who can make sense of A.I." />
    </section>
  </section>;
}
