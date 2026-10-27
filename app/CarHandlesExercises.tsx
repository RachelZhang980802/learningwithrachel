"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function CarHandlesExercises() {
  return <section className={styles.exercises} aria-labelledby="car-handles-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="car-handles-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="car-handles-vocabulary-title">
      <h3 id="car-handles-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer="contend" label="第 1 题第 1 空答案" />: to argue or state that something is true</p>
      <p><AnswerBlank answer="foist" label="第 1 题第 2 空答案" />: to force someone to accept something they do not want</p>
    </section>
    <section className={styles.question} aria-labelledby="car-handles-choice-title">
      <h3 id="car-handles-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;Today, it feels like what we actually expect is to be harassed, <u>put out</u> and given a screen in our face to shut us up.&quot;? <AnswerBlank answer="B" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>These pills should <u>put him out</u> for a few hours. <span className={styles.optionMeaning} lang="zh-CN">（使他昏迷）</span></li>
        <li>He looked really put out. <span className={styles.optionMeaning} lang="zh-CN">（使恼火；使不快）</span></li>
        <li>The factory <u>puts out</u> 500 new cars a week. <span className={styles.optionMeaning} lang="zh-CN">（生产；制造）</span></li>
        <li>Have you <u>put out</u> clean towels for the guests? <span className={styles.optionMeaning} lang="zh-CN">（铺开）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="car-handles-translation-title">
      <h3 id="car-handles-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">如果必须解决一系列越来越复杂的文字游戏才能解锁你的车，你会放弃走路上班吗？</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="What if you had to solve a series of increasingly complex word games in order to unlock your car? Would you just give up and walk to work?" />
    </section>
  </section>;
}
