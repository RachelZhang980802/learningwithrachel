"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function HarvardExercises() {
  return <section className={styles.exercises} aria-labelledby="harvard-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="harvard-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="harvard-vocabulary-title">
      <h3 id="harvard-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer="acquiesce" label="第 1 题第 1 空答案" />: to do what sb. else wants, or allow sth. to happen, even though you do not really agree with it</p>
      <p><AnswerBlank answer="understate" label="第 1 题第 2 空答案" />: to describe sth. in a way that makes it seem less important, serious, or difficult than it really is</p>
    </section>
    <section className={styles.question} aria-labelledby="harvard-choice-title">
      <h3 id="harvard-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;The Heritage Foundation, which produced Project 2025, published Project Esther, &apos;a blueprint to <u>counter</u> antisemitism&apos;&quot;? <AnswerBlank answer="B" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The diplomat tried to <u>counter</u> the ambassador&apos;s accusations with solid evidence. <span className={styles.optionMeaning} lang="zh-CN">（反驳；回应）</span></li>
        <li>The government introduced new policies to <u>counter</u> the rise in unemployment. <span className={styles.optionMeaning} lang="zh-CN">（对抗；应对）</span></li>
        <li>Butler has <u>countered</u> with a lawsuit against the firm. <span className={styles.optionMeaning} lang="zh-CN">（提出反诉）</span></li>
        <li>Such arguments are not easily <u>countered</u>. <span className={styles.optionMeaning} lang="zh-CN">（反驳；驳斥）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="harvard-translation-title">
      <h3 id="harvard-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">许多学生希望学校通过终止校园军事招募来表示抗议，但联邦法律将资金接收与允许军方进入挂钩。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="Many students wanted the school to protest by ending military recruitment on campus, but a federal law conditioned the receipt of funding on military access." />
    </section>
  </section>;
}
