"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: 如何在数字时代捍卫我们的深层阅读能力.pdf, page 6; answers checked after rotating the answer block.
export function SlateExercises() {
  return <section className={styles.exercises} aria-labelledby="slate-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="slate-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="slate-vocabulary-title">
      <h3 id="slate-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer={"rigorous"} label="第 1 题第 1 空答案" />: done carefully and with a lot of attention to detail</p>
      <p><AnswerBlank answer={"illuminated"} label="第 1 题第 2 空答案" />: lit with bright lights</p>
    </section>
    <section className={styles.question} aria-labelledby="slate-choice-title">
      <h3 id="slate-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence "At some time impossible to pinpoint, I had begun to read more to be informed than to be immersed, much less to be <u>transported</u>."? <AnswerBlank answer={"A"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The film <u>transports</u> you back to the New York of the 1950s.</li>
        <li>Such heavy items are expensive to <u>transport</u> by plane.</li>
        <li>The company will arrange <u>transport</u> from the airport.</li>
        <li>The women were <u>transported</u> to a nearby hospital for treatment.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="slate-translation-title">
      <h3 id="slate-translation-title">3. 根据给定中文回译英文</h3>
      <p lang="zh-CN">就像选择去健身房而不是躺沙发，或者吃尼斯沙拉，而不是油炸食品一样。你会选择不那么诱人的选项，因为从长远来看，它会让你感觉更好。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"Like hitting the gym instead of the couch or having the salade niçoise instead of fries, you pick the less tempting option because in the long run it will make you feel better."} />
    </section>
  </section>;
}
