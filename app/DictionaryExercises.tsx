"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function DictionaryExercises() {
  return <section className={styles.exercises} aria-labelledby="dictionary-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="dictionary-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="dictionary-vocabulary-title">
      <h3 id="dictionary-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer="connotation" label="第 1 题第 1 空答案" />: an idea suggested by a word in addition to its main meaning</p>
      <p><AnswerBlank answer="stifle" label="第 1 题第 2 空答案" />: to prevent something from happening; to prevent a feeling from being expressed</p>
    </section>
    <section className={styles.question} aria-labelledby="dictionary-choice-title">
      <h3 id="dictionary-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;Smartphone messaging <u>conventions</u> routinely seep into follow-ups from artists and lawyers alike.&quot;? <AnswerBlank answer="D" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The UN <u>Convention</u> on Climate Change guides global emissions cuts.</li>
        <li>We go to the weeklong annual teachers&apos; <u>convention</u> every summer.</li>
        <li>The director&apos;s use of the usual romantic <u>conventions</u> made the film boring and predictable.</li>
        <li><u>Convention</u> demands that a club member should resign in such a situation.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="dictionary-translation-title">
      <h3 id="dictionary-translation-title">3. 根据给定中文回译英文</h3>
      <p lang="zh-CN">摒弃词典而拥抱机械化的写作方式，不仅会削弱我们的自我表达能力，同样会损害我们构建集体认同的能力。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="Abandoning dictionaries and embracing mechanized writing would erode our capacity for collective identity quite as much as the ability to express ourselves." />
    </section>
  </section>;
}
