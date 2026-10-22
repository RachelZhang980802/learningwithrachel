"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: 诺贝尔文学奖迎来首位韩国作家(1).pdf, page 6; answers checked after rotating the answer block.
export function HanKangExercises() {
  return <section className={styles.exercises} aria-labelledby="han-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="han-exercises-title">Exercises <span>课后练习</span></h2>
    </header>
    <section className={styles.question} aria-labelledby="han-vocabulary-title">
      <h3 id="han-vocabulary-title">1. 根据英文释义写出文中出现的对应单词</h3>
      <p><AnswerBlank answer={"sinister"} label="第 1 题第 1 空答案" />: seeming evil or dangerous; making you think sth. bad will happen</p>
      <p><AnswerBlank answer={"fuss"} label="第 1 题第 2 空答案" />: unnecessary excitement, worry or activity</p>
    </section>
    <section className={styles.question} aria-labelledby="han-choice-title">
      <h3 id="han-choice-title">2. 一词多义</h3>
      <p>Which of the following underlined words is closest in meaning to the one in the sentence "Much of the work of this year's winner of the Nobel Prize for Literature – who was commended on Thursday by the Swedish Academy for her "intense poetic prose that confronts historical traumas and exposes the fragility of human life" – is <u>informed</u> by one of the greatest atrocities of modern history: the massacre that occurred in her birthplace, Gwangju, in 1980."? <AnswerBlank answer={"A"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The concept of the Rose continued to <u>inform</u> the poet's work.</li>
        <li>They would <u>inform</u> him of any progress they had made.</li>
        <li>We need time to <u>inform</u> ourselves thoroughly of the problem.</li>
        <li>Thousands of American citizens have <u>informed</u> on these organized crime syndicates.</li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="han-translation-title">
      <h3 id="han-translation-title">3. 根据给定中文回译英文</h3>
      <p lang="zh-CN">她的作品的确为过去几十年韩国的变迁提供了新的视角解读。然而，她的成功主要来自于作品中所呈现的普遍情感共鸣：无论读者来自何种背景，都能在她细腻描绘的悲伤与恐惧中产生共鸣。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"Her work certainly offers a rich new contextualisation of what has been going on in her homeland in recent decades. But it succeeds on account of its vivid universality: readers from all backgrounds can respond to her granular depictions of what it's like to experience grief and fear."} />
    </section>
  </section>;
}
