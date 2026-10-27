"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function GaslightExercises() {
  return <section className={styles.exercises} aria-labelledby="gaslight-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="gaslight-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="gaslight-vocabulary-title">
      <h3 id="gaslight-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer="antagonistic" label="第 1 题第 1 空答案" />: (<em>formal</em>) showing or feeling opposition</p>
      <p><AnswerBlank answer="coercive" label="第 1 题第 2 空答案" />: (<em>formal</em>) using threats or orders to make someone do something they do not want to do</p>
      <p><AnswerBlank answer="egalitarian" label="第 1 题第 3 空答案" />: based on, or holding, the belief that everyone is equal and should have the same rights and opportunities</p>
    </section>
    <section className={styles.question} aria-labelledby="gaslight-choice-title">
      <h3 id="gaslight-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;I work with survivors of relationships with high-conflict, antagonistic, <u>rigid</u>, entitled, dysregulated people.&quot;? <AnswerBlank answer="D" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>She sat upright, her body <u>rigid</u> with fear. <span className={styles.optionMeaning} lang="zh-CN">（僵硬的）</span></li>
        <li>These plates are fairly <u>rigid</u>. <span className={styles.optionMeaning} lang="zh-CN">（牢固的；不易弯曲的）</span></li>
        <li>I heard a noise and woke up <u>rigid</u> with terror. <span className={styles.optionMeaning} lang="zh-CN">（吓呆的）</span></li>
        <li>His <u>rigid</u> adherence to the rules made him unpopular. <span className={styles.optionMeaning} lang="zh-CN">（严格的；死板的）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="gaslight-translation-title">
      <h3 id="gaslight-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">操纵“煤气灯”的人把他们自己的不安全感投射到受害者身上，并放大受害者已有的不安全感。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="Gaslighters project their own insecurity onto their victims and magnify any insecurity that their victims already have." />
    </section>
  </section>;
}
