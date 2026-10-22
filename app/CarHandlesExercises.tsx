"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function CarHandlesExercises() {
  return <section className={styles.exercises} aria-labelledby="car-handles-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="car-handles-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="car-handles-vocabulary-title">
      <h3 id="car-handles-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer="contend" label="第 1 题第 1 空答案" />: to argue or state that something is true</p>
      <p><AnswerBlank answer="foist" label="第 1 题第 2 空答案" />: to force someone to accept something they do not want</p>
    </section>
    <section className={styles.question} aria-labelledby="car-handles-choice-title">
      <h3 id="car-handles-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;Today, it feels like what we actually expect is to be harassed, <u>put out</u> and given a screen in our face to shut us up.&quot;? <AnswerBlank answer="B" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>These pills should <u>put him out</u> for a few hours.</li>
        <li>He looked really put out.</li>
        <li>The factory <u>puts out</u> 500 new cars a week.</li>
        <li>Have you <u>put out</u> clean towels for the guests?</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="car-handles-translation-title">
      <h3 id="car-handles-translation-title">3. 根据给定中文回译英文</h3>
      <p lang="zh-CN">如果必须解决一系列越来越复杂的文字游戏才能解锁你的车，你会放弃走路上班吗？</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="What if you had to solve a series of increasingly complex word games in order to unlock your car? Would you just give up and walk to work?" />
    </section>
  </section>;
}
