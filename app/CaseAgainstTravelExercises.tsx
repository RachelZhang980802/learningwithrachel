"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: 0703 旅行真的能让我们抵达远方吗？.pdf, page 5; answers checked after rotating the answer block.
export function CaseAgainstTravelExercises() {
  return <section className={styles.exercises} aria-labelledby="travel-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="travel-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="travel-vocabulary-title">
      <h3 id="travel-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer={"cachet"} label="第 1 题第 1 空答案" />: the state of being respected or admired; prestige</p>
      <p><AnswerBlank answer={"far-flung"} label="第 1 题第 2 空答案" />: a long distance away</p>
    </section>
    <section className={styles.question} aria-labelledby="travel-choice-title">
      <h3 id="travel-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined word is closest in meaning to the one in the sentence "What is mysterious is why we imbue it with a vast significance, an aura of <u>virtue</u>."? <AnswerBlank answer={"B"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The article stuck in my mind by <u>virtue</u> of one detail. <span className={styles.optionMeaning} lang="zh-CN">（由于；因为）</span></li>
        <li>Women have often been used as symbols of <u>virtue</u>. <span className={styles.optionMeaning} lang="zh-CN">（美德；道德）</span></li>
        <li>The movie makes a <u>virtue</u> out of its economy. <span className={styles.optionMeaning} lang="zh-CN">（优点；好处）</span></li>
        <li>Adam Smith believed in the <u>virtues</u> of free trade. <span className={styles.optionMeaning} lang="zh-CN">（价值；益处）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="travel-translation-title">
      <h3 id="travel-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">旅行将时间分割成旅行之前和旅行之后，使我们无法看清必然到来的死亡。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"Travel splits this expanse of time into the chunk that happens before the trip, and the chunk that happens after it, obscuring from view the certainty of annihilation."} />
    </section>
  </section>;
}
