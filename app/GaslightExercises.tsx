"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function GaslightExercises() {
  return <section className={styles.exercises} aria-labelledby="gaslight-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="gaslight-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="gaslight-vocabulary-title">
      <h3 id="gaslight-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer="antagonistic" label="第 1 题第 1 空答案" />: (<em>formal</em>) showing or feeling opposition</p>
      <p><AnswerBlank answer="coercive" label="第 1 题第 2 空答案" />: (<em>formal</em>) using threats or orders to make someone do something they do not want to do</p>
      <p><AnswerBlank answer="egalitarian" label="第 1 题第 3 空答案" />: based on, or holding, the belief that everyone is equal and should have the same rights and opportunities</p>
    </section>
    <section className={styles.question} aria-labelledby="gaslight-choice-title">
      <h3 id="gaslight-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;I work with survivors of relationships with high-conflict, antagonistic, <u>rigid</u>, entitled, dysregulated people.&quot;? <AnswerBlank answer="D" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>She sat upright, her body <u>rigid</u> with fear.</li>
        <li>These plates are fairly <u>rigid</u>.</li>
        <li>I heard a noise and woke up <u>rigid</u> with terror.</li>
        <li>His <u>rigid</u> adherence to the rules made him unpopular.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="gaslight-translation-title">
      <h3 id="gaslight-translation-title">3. 翻译：根据给定中文回译英文</h3>
      <p lang="zh-CN">操纵“煤气灯”的人把他们自己的不安全感投射到受害者身上，并放大受害者已有的不安全感。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="Gaslighters project their own insecurity onto their victims and magnify any insecurity that their victims already have." />
    </section>
  </section>;
}
