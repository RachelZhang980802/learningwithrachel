"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: 美国退场后，中国会成为应对气候变化的领袖吗？.pdf, page 7; answers checked after rotating the answer block.
export function ChinaClimateExercises() {
  return <section className={styles.exercises} aria-labelledby="climate-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="climate-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="climate-vocabulary-title">
      <h3 id="climate-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer={"scrap"} label="第 1 题第 1 空答案" />: to cancel or get rid of sth. that is no longer practical or useful</p>
      <p><AnswerBlank answer={"volatile"} label="第 1 题第 2 空答案" />: (of a situation) likely to change suddenly; easily becoming dangerous</p>
    </section>
    <section className={styles.question} aria-labelledby="climate-choice-title">
      <h3 id="climate-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined word is closest in meaning to the one in the sentence "Officially, China has continued to encourage US <u>engagement</u> on climate. At the COP30 climate summit in Belem, the head of the Chinese delegation, Li Gao, expressed hope that the country would return to climate talks."? <AnswerBlank answer={"C"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The princess will continue to carry out royal <u>engagements</u>. <span className={styles.optionMeaning} lang="zh-CN">（官方活动；公务）</span></li>
        <li>The general tried to avoid an <u>engagement</u> with the enemy. <span className={styles.optionMeaning} lang="zh-CN">（交战；冲突）</span></li>
        <li>Many students pass without any real <u>engagement</u> in learning. <span className={styles.optionMeaning} lang="zh-CN">（参与；接触）</span></li>
        <li>Tony was stunned when Lisa suddenly broke off their <u>engagement</u>. <span className={styles.optionMeaning} lang="zh-CN">（订婚）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="climate-translation-title">
      <h3 id="climate-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">今年全球排放量创历史新高，极端天气在全球范围内加剧。科学家警告说，到 2030 年代初，全球气温很可能超过 1.5 摄氏度（2.7 华氏度）的极限，这可能会引发不可逆转的气候破坏。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"Global emissions hit record highs this year, with extreme weather escalating worldwide. Scientists now warn that by the early 2030s, the world is likely to surpass the 1.5-degree Celsius (2.7 Fahrenheit) limit, potentially triggering irreversible climate damage."} />
    </section>
  </section>;
}
