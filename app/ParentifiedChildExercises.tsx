"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function ParentifiedChildExercises() {
  return <section className={styles.exercises} aria-labelledby="parentified-child-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="parentified-child-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="parentified-child-vocabulary-title">
      <h3 id="parentified-child-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer="circumscribe" label="第 1 题第 1 空答案" />: to limit power, rights, or abilities</p>
      <p><AnswerBlank answer="cower" label="第 1 题第 2 空答案" />: to bend low and / or move backwards because you are frightened</p>
    </section>
    <section className={styles.question} aria-labelledby="parentified-child-choice-title">
      <h3 id="parentified-child-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined word is closest in meaning to the one in the sentence &quot;To <u>undo</u> parentification, you need to understand what happened, how it&apos;s impacting you, and allow yourself to experience the validity of your narrative.&quot;? <AnswerBlank answer="C" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>I <u>undid</u> the package and took out the books. <span className={styles.optionMeaning} lang="zh-CN">（打开；拆开）</span></li>
        <li>The team was <u>undone</u> by the speed and strength of their opponents. <span className={styles.optionMeaning} lang="zh-CN">（压倒；击垮）</span></li>
        <li>It&apos;s not too late to try and <u>undo</u> some of the damage . <span className={styles.optionMeaning} lang="zh-CN">（撤销；弥补）</span></li>
        <li>If you want to repair the wheels you just <u>undo</u> the four nuts. <span className={styles.optionMeaning} lang="zh-CN">（拧松；卸下）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="parentified-child-translation-title">
      <h3 id="parentified-child-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">当亲职化的成年人继续在多年的痛苦记忆中跋涉，并意识到他们为何仍然感到受伤时，愤怒和不公正的感觉会充斥着心灵，至少最初是如此。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="As parentified adults continue to wade through years of painful memories and realise why they still hurt, feelings of anger and injustice become dominant, at least at first." />
    </section>
  </section>;
}
