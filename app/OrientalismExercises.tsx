"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: 讲义JY210510丨但汉松 - 萨义德的《东方主义》如何看待西方对他者的思想偏见.pdf, page 6; answers checked after rotating the answer block.
export function OrientalismExercises() {
  return <section className={styles.exercises} aria-labelledby="orientalism-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="orientalism-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="orientalism-vocabulary-title">
      <h3 id="orientalism-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer={"sophisticated"} label="第 1 题第 1 空答案" />: having a lot of experience of life, and good judgment about socially important things such as art, fashion, etc.</p>
      <p><AnswerBlank answer={"travesty"} label="第 1 题第 2 空答案" />: [usually singular] used in order to say that something is extremely bad and is not what it is claimed to be</p>
      <p><AnswerBlank answer={"unrepentant"} label="第 1 题第 3 空答案" />: not ashamed of your behaviour or beliefs, even though other people disapprove</p>
    </section>
    <section className={styles.question} aria-labelledby="orientalism-choice-title">
      <h3 id="orientalism-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence "Next to the suicide bombings, the air strikes, and the beheadings, a closely argued 300-page monograph devoted to a radical post-colonial thesis might seem to suggest a <u>modest</u> literary intervention."? <AnswerBlank answer={"A"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The research was carried out on a <u>modest</u> scale.</li>
        <li>She's very <u>modest</u> about her success.</li>
        <li>He was always <u>modest</u> about his role in the Everest expedition.</li>
        <li>She was a <u>modest</u> girl, always keeping covered, even in summer.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="orientalism-translation-title">
      <h3 id="orientalism-translation-title">3. 翻译：根据给定中文回译英文</h3>
      <p lang="zh-CN">一个伟大的进步就是使人们意识到文化是混杂的和异质的，文化和文明间是相互关联和相互依存的，以至于无法简单地描述它们的个性。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"One of the great advances is the realization that cultures are hybrid and heterogeneous, and that cultures and civilizations are so interrelated and interdependent as to beggar any simply delineated description of their individuality."} />
    </section>
  </section>;
}
