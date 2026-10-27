"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function CatLadiesExercises() {
  return <section className={styles.exercises} aria-labelledby="cat-ladies-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="cat-ladies-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="cat-ladies-vocabulary-title">
      <h3 id="cat-ladies-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer="resent" label="第 1 题第 1 空答案" />: to feel bitter or angry about sth., especially because you feel it is unfair</p>
      <p><AnswerBlank answer="admonish" label="第 1 题第 2 空答案" />: to tell someone severely that they have done something wrong</p>
    </section>
    <section className={styles.question} aria-labelledby="cat-ladies-choice-title">
      <h3 id="cat-ladies-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;One voting bloc JD Vance seems completely disinterested in trying to <u>court</u> this election season&quot;? <AnswerBlank answer="A" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The government is <u>courting</u> investors from around the globe. <span className={styles.optionMeaning} lang="zh-CN">（争取；吸引）</span></li>
        <li>As a politician he has often <u>courted</u> controversy. <span className={styles.optionMeaning} lang="zh-CN">（招致；引起）</span></li>
        <li>He was <u>courting</u> his college sweetheart. <span className={styles.optionMeaning} lang="zh-CN">（追求；求爱）</span></li>
        <li>He has never <u>courted</u> popularity. <span className={styles.optionMeaning} lang="zh-CN">（博取；讨好）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="cat-ladies-translation-title">
      <h3 id="cat-ladies-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">万斯对无子女女性及其宠物猫的奇怪偏见，源于一个多世纪前的刻板印象：未婚的、类似纪录片《灰色花园》中描绘的老处女，与她们的猫相依为命，鲜少与外界接触。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={'Vance\'s weird pet peeves about childless women and their cats plays on a century-old trope: Unmarried, "Grey Gardens"-esque spinsters living with their cats and very little human contact.'} />
    </section>
  </section>;
}
