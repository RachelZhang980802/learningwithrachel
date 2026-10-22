"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function CrawfordExercises() {
  return <section className={styles.exercises} aria-labelledby="crawford-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="crawford-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="crawford-vocabulary-title">
      <h3 id="crawford-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer="epistemic" label="第 1 题第 1 空答案" />: relating to knowledge</p>
      <p><AnswerBlank answer="intransigent" label="第 1 题第 2 空答案" />: unwilling to change their opinions or behaviour in a way that would be helpful to others</p>
    </section>
    <section className={styles.question} aria-labelledby="crawford-choice-title">
      <h3 id="crawford-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;Independence of mind requires sustained <u>submission</u> to authority.&quot;? <AnswerBlank answer="B" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The deadline for the <u>submission</u> of proposals is May 1st.</li>
        <li>Napoleon threatened to starve the country into <u>submission</u>.</li>
        <li>The judge upheld the defendant&apos;s <u>submission</u> and quashed his conviction.</li>
        <li>It is important, in my <u>submission</u>, that a wider view of the matter be taken.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="crawford-translation-title">
      <h3 id="crawford-translation-title">3. 根据给定中文回译英文</h3>
      <p lang="zh-CN">没有什么真正崇高的标准可以用来评判我的品格和能力。这种态度实际上是通过抹平现实中的层次结构，保护了脆弱的自我形象。这似乎是完全民主教育的结果，而其直接后果便是能力水平的持续退化。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="There is nothing truly higher that stands in judgment of my own character and capacities. This is to collapse the vertical dimension of reality in order to protect a fragile self-image. This seems to be the upshot of a thoroughly democratic education, and we witness its fruits in the steady erosion of competence." />
    </section>
  </section>;
}
