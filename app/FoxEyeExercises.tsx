"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: 0110 但汉松 - 风靡欧美的高级狐狸眼妆如何让亚裔深感不安.pdf, page 6; answers checked after rotating the answer block.
export function FoxEyeExercises() {
  return <section className={styles.exercises} aria-labelledby="fox-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="fox-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="fox-vocabulary-title">
      <h3 id="fox-vocabulary-title">1. 根据英文释义写出文中出现的对应单词（或词组）</h3>
      <p><AnswerBlank answer={"tutorial"} label="第 1 题第 1 空答案" />: a period of teaching in a university that involves discussion between an individual student or a small group of students and a tutor</p>
      <p><AnswerBlank answer={"angular"} label="第 1 题第 2 空答案" />: having sharp and definite corners</p>
    </section>
    <section className={styles.question} aria-labelledby="fox-choice-title">
      <h3 id="fox-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence "Even when the <u>intent</u> is not to offend, disregarding the perspective of others and their emotional triggers that stem from cultural discrimination creates a divide" <AnswerBlank answer={"B"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li><u>Intent</u> upon her work, she didn't notice the cold.</li>
        <li>She denies possessing the drug with <u>intent</u> to supply.</li>
        <li>She was <u>intent</u> on pursuing a career in business.</li>
        <li>The two items are, to all <u>intents</u> and purposes, identical.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="fox-translation-title">
      <h3 id="fox-translation-title">3. 翻译：根据给定中文回译英文</h3>
      <p lang="zh-CN">眼线笔常被用来拉长内外眼角，遮瑕膏可以缩小眉毛的弧度，营造出直眉的感觉。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"Eyeliner is often used to elongate the outer and inner corners of the eyes, while concealer can minimize the eyebrow's arch to create a straight-brow look."} />
    </section>
  </section>;
}
