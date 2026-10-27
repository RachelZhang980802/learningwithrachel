"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

export function ColumbiaExercises() {
  return <section className={styles.exercises} aria-labelledby="columbia-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="columbia-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="columbia-vocabulary-title">
      <h3 id="columbia-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer="antisemitism" label="第 1 题第 1 空答案" />: hate that is felt towards Jewish people; unfair treatment of Jews</p>
      <p><AnswerBlank answer="stake" label="第 1 题第 2 空答案" />: a part or share in a business, plan, etc. that will bring you money or other benefits if it succeeds</p>
    </section>
    <section className={styles.question} aria-labelledby="columbia-choice-title">
      <h3 id="columbia-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence &quot;The administration has weaponized the fight against antisemitism as a means to another <u>end</u>: punishing and weakening universities.&quot;? <AnswerBlank answer="D" label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The candidates represent opposite <u>ends</u> of the political spectrum. <span className={styles.optionMeaning} lang="zh-CN">（结束；尽头）</span></li>
        <li>She works in the sales <u>end</u> of things. <span className={styles.optionMeaning} lang="zh-CN">（销售端）</span></li>
        <li>The doctors told her that the <u>end</u> was near. <span className={styles.optionMeaning} lang="zh-CN">（生命终点）</span></li>
        <li>There are several ways to achieve the same <u>end</u>. <span className={styles.optionMeaning} lang="zh-CN">（目的；结果）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="columbia-translation-title">
      <h3 id="columbia-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">公众舆论绝非凭空生成；社会科学研究早已证明，在缺乏平衡声音的情况下，单一视角的讨论往往会深刻影响公众意见。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer="Public opinion is not formed in a vacuum. The social science research is clear: In the absence of a countervailing message, a one-sided debate will powerfully shape public opinion." />
    </section>
  </section>;
}
