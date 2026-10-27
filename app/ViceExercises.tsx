"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";

// Source: 阅读是一种恶习？.pdf, page 6; answers checked after rotating the answer block.
export function ViceExercises() {
  return <section className={styles.exercises} aria-labelledby="vice-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="vice-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="vice-vocabulary-title">
      <h3 id="vice-vocabulary-title">1. Vocabulary in Context</h3>
      <p><AnswerBlank answer={"agonize"} label="第 1 题第 1 空答案" />: to spend a long time thinking and worrying about a difficult situation or problem</p>
      <p><AnswerBlank answer={"edifying"} label="第 1 题第 2 空答案" />: likely to improve your mind or your character</p>
    </section>
    <section className={styles.question} aria-labelledby="vice-choice-title">
      <h3 id="vice-choice-title">2. Word Meaning in Context</h3>
      <p>Which of the following uses of the underlined word is CLOSEST in meaning to the one in the sentence "It would be better to describe reading not as a public duty but as a private pleasure, sometimes even a <u>vice</u>." <AnswerBlank answer={"B"} label="第 2 题答案" variant="choice" /></p>
      <ol className={styles.options} type="A">
        <li>The mechanic secured the metal pipe firmly in the <u>vice</u> before cutting it. <span className={styles.optionMeaning} lang="zh-CN">（虎钳；夹具）</span></li>
        <li>For him, staying up all night to read novels was not a virtue but a delightful <u>vice</u>. <span className={styles.optionMeaning} lang="zh-CN">（恶习）</span></li>
        <li>The <u>Vice</u> Chancellor presided over the university senate meeting. <span className={styles.optionMeaning} lang="zh-CN">（副校长）</span></li>
        <li>The police have smashed a <u>vice</u> ring in Chicago. <span className={styles.optionMeaning} lang="zh-CN">（不道德行为；罪行）</span></li>
      </ol>
    </section>
    <section className={styles.question} aria-labelledby="vice-translation-title">
      <h3 id="vice-translation-title">3. Translate into English</h3>
      <p lang="zh-CN">告诉某人应该热爱文学是因为阅读对社会有益，这就像告诉某人应该信仰上帝是因为宗教对社会有益一样。这是一种针对本应是个人激情的事物所提出的功利主义论点。</p>
      <AnswerBlank variant="translation" label="第 3 题参考译文" answer={"Telling someone to love literature because reading is good for society is like telling someone to believe in God because religion is good for society. It's a utilitarian argument for what should be a personal passion."} />
    </section>
  </section>;
}
