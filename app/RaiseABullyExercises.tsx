"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function RaiseABullyExercises() {
  return <section className={styles.exercises} aria-labelledby="raise-a-bully-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="raise-a-bully-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="raise-a-bully-vocabulary-title">
      <h3 id="raise-a-bully-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer="meditate" label="第 1 题第 1 空答案" />: to think deeply about sth.</p>
      <p><AnswerBlank answer="curtail" label="第 1 题第 2 空答案" />: to limit sth. or make it last for a shorter time</p>
    </section>
    <section className={styles.question} aria-labelledby="raise-a-bully-choice-title">
      <h3 id="raise-a-bully-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined word is closest in meaning to the one in the sentence &quot;Since the Jan. 14 death of Phoebe Prince, the 15-year-old in South Hadley, Mass., who <u>committed</u> suicide after being bullied by fellow students …&quot;? <AnswerBlank answer="B" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>I wouldn&apos;t want to <u>commit</u> these comments to paper. <span className={styles.optionMeaning} lang="zh-CN">（写下；记录）</span></li>
        <li>There are unconfirmed reports he tried to <u>commit</u> suicide. <span className={styles.optionMeaning} lang="zh-CN">（自杀）</span></li>
        <li>The two men were <u>committed</u> for trial at Bristol Crown Court. <span className={styles.optionMeaning} lang="zh-CN">（提交审判）</span></li>
        <li>Both sides <u>committed</u> themselves to settle the dispute peacefully. <span className={styles.optionMeaning} lang="zh-CN">（承诺；保证）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="raise-a-bully-translation-title">
      <h3 id="raise-a-bully-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">没有同理心，我们就不会有凝聚力强的社会，不会有信任，也就没有理由不去杀人、欺骗、偷窃或撒谎。往好里说，我们只会出于自身利益行事；往坏里说，我们会变成一群反社会者。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="Without empathy, we would have no cohesive society, no trust and no reason not to murder, cheat, steal or lie. At best, we would act only out of self-interest; at worst, we would be a collection of sociopaths." />
    </section>
  </section>;
}
