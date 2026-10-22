"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function DeepSeekExercises() {
  return <section className={styles.exercises} aria-labelledby="deepseek-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="deepseek-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="deepseek-vocabulary-title">
      <h3 id="deepseek-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer="hype" label="第 1 题第 1 空答案" />: attempts to make people think something is good or important by talking about it a lot on television, the radio etc.</p>
      <p><AnswerBlank answer="fete" label="第 1 题第 2 空答案" />: to welcome, praise or entertain somebody publicly</p>
    </section>
    <section className={styles.question} aria-labelledby="deepseek-choice-title">
      <h3 id="deepseek-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;Particularly at a time of threatened trade wars and threats to democracy, our capacity to navigate between the hype and the fear <u>assumes</u> new importance.&quot;? <AnswerBlank answer="C" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>He <u>assumed</u> power in a bloody coup in 1990.</li>
        <li>The theory <u>assumes</u> that both labour and capital are mobile.</li>
        <li>The problem is beginning to <u>assume</u> massive proportions.</li>
        <li>I didn&apos;t see your car, so I <u>assumed</u> you&apos;d gone out.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="deepseek-translation-title">
      <h3 id="deepseek-translation-title">3. 根据给定中文回译英文</h3>
      <p lang="zh-CN">倘若这款产品出自美国高校极客之手，它很可能也会受到赞誉，但不会像过去两周那样引发全球性的动荡。恐慌表象之下，实为对其中国起源与所有权的恐惧。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="Had DeepSeek been created by geeks at a US university, it would most likely have been feted but without the global tumult of the past two weeks. Beneath the panic lies fear of DeepSeek's Chinese origins and ownership." />
    </section>
  </section>;
}
