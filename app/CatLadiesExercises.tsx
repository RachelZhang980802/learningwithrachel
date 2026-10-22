"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function CatLadiesExercises() {
  return <section className={styles.exercises} aria-labelledby="cat-ladies-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="cat-ladies-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="cat-ladies-vocabulary-title">
      <h3 id="cat-ladies-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer="resent" label="第 1 题第 1 空答案" />: to feel bitter or angry about sth., especially because you feel it is unfair</p>
      <p><AnswerBlank answer="admonish" label="第 1 题第 2 空答案" />: to tell someone severely that they have done something wrong</p>
    </section>
    <section className={styles.question} aria-labelledby="cat-ladies-choice-title">
      <h3 id="cat-ladies-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;One voting bloc JD Vance seems completely disinterested in trying to <u>court</u> this election season&quot;? <AnswerBlank answer="A" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The government is <u>courting</u> investors from around the globe.</li>
        <li>As a politician he has often <u>courted</u> controversy.</li>
        <li>He was <u>courting</u> his college sweetheart.</li>
        <li>He has never <u>courted</u> popularity.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="cat-ladies-translation-title">
      <h3 id="cat-ladies-translation-title">3. 根据给定中文回译英文</h3>
      <p lang="zh-CN">万斯对无子女女性及其宠物猫的奇怪偏见，源于一个多世纪前的刻板印象：未婚的、类似纪录片《灰色花园》中描绘的老处女，与她们的猫相依为命，鲜少与外界接触。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={'Vance\'s weird pet peeves about childless women and their cats plays on a century-old trope: Unmarried, "Grey Gardens"-esque spinsters living with their cats and very little human contact.'} />
    </section>
  </section>;
}
