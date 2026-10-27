"use client";

import { AnswerBlank } from "./CommencementExercises";
import styles from "./CommencementExercises.module.css";
import grouped from "./LoveJointExercises.module.css";

export function LoveJointExercises() {
  return <section className={styles.exercises} aria-labelledby="love-joint-exercises-title">
    <hr className={styles.divider} />
    <header className={styles.header}>
      <h2 id="love-joint-exercises-title">Exercises </h2>
    </header>
    <section className={styles.question} aria-labelledby="love-joint-vocabulary-title">
      <h3 id="love-joint-vocabulary-title">1. Vocabulary in Context</h3>
      <p>（1）<AnswerBlank answer="devotion" label="第 1 题第 1 空答案" />: the action of spending a lot of time or energy on something</p>
      <p>（2）<AnswerBlank answer="reciprocity" label="第 1 题第 2 空答案" />: a situation in which two people, countries, etc. provide the same help or advantages to each other</p>
      <p>（3）<AnswerBlank answer="outgrow" label="第 1 题第 3 空答案" />: to stop doing something or lose interest in something as you become older</p>
      <p>（4）<AnswerBlank answer="conceive" label="第 1 题第 4 空答案" />: to form an idea, a plan, etc. in your mind</p>
    </section>
    <section className={styles.question} aria-labelledby="love-joint-choice-title">
      <h3 id="love-joint-choice-title">2. Word Meaning in Context</h3>
      <div className={grouped.item} data-choice-question>
        <p>（1）Which of the following underlined words is closest in meaning to the one in the sentence &quot;Beauvoir discusses the <u>dynamics</u> that threaten this equilibrium: dynamics in which one person sees him or herself as inferior or superior.&quot; <AnswerBlank answer="C" label="第 2 题第 1 小题答案" variant="choice" /></p>
        <ol className={styles.options} type="A">
          <li>You&apos;ll hear less bass and <u>dynamic</u> range on more compressed grooves. <span className={styles.optionMeaning} lang="zh-CN">（动态范围）</span></li>
          <li>Shelly is an incredibly <u>dynamic</u> lecturer. <span className={styles.optionMeaning} lang="zh-CN">（精力充沛的）</span></li>
          <li>Group <u>dynamics</u> describe the interactions, attitudes, and behaviors between a set of people who are working together. <span className={styles.optionMeaning} lang="zh-CN">（群体互动模式）</span></li>
          <li>Among the hardest patterns we&apos;ve tried to understand is the concept of turbulent flow in fluid <u>dynamics</u>. <span className={styles.optionMeaning} lang="zh-CN">（流体动力学）</span></li>
        </ol>
      </div>
      <div className={grouped.item} data-choice-question>
        <p>（2）Which of the following underlined words is closest in meaning to the one in the sentence &quot;It was inconsistent, she argued, to value one&apos;s own freedom without valuing the freedoms of others: as she put it in <em>The Ethics of Ambiguity</em> (1947): &apos;To <u>will</u> oneself free is also to will others free.&apos;&quot; <AnswerBlank answer="B" label="第 2 题第 2 小题答案" variant="choice" /></p>
        <ol className={styles.options} type="A">
          <li>If it&apos;s made of wood it <u>will</u> float. <span className={styles.optionMeaning} lang="zh-CN">（将会）</span></li>
          <li>She <u>willed</u> her eyes to stay open. <span className={styles.optionMeaning} lang="zh-CN">（用意志使；努力让）</span></li>
          <li><u>Will</u> you be quiet! <span className={styles.optionMeaning} lang="zh-CN">（用于祈使句，表示请求）</span></li>
          <li>Joe had <u>willed</u> everything he possessed to them. <span className={styles.optionMeaning} lang="zh-CN">（立遗嘱将财产留给）</span></li>
        </ol>
      </div>
    </section>
    <section className={styles.question} aria-labelledby="love-joint-translation-title">
      <h3 id="love-joint-translation-title">3. Translate into English</h3>
      <div className={grouped.item}>
        <p lang="zh-CN">（1）在《第二性》（1949）中，波伏娃认为文化导致男人和女人有着不对称的期望，结果导致了“爱”经常感觉像是一个相互冲突的欲望的战场，或是他们失望的墓地。</p>
        <AnswerBlank variant="translation" label="第 3 题第 1 小题参考译文" answer={<>In <em>The Second Sex</em> (1949), Beauvoir argued that culture led men and women to have asymmetrical expectations, with the result that &apos;love&apos; frequently felt like a battlefield of conflicting desires or a graveyard for their disappointments.</>} />
      </div>
      <div className={grouped.item}>
        <p lang="zh-CN">（2）波伏娃认为，如果双方都把爱情看作是一个共同的项目，如果双方都同时想到对方和自己，他们就能成功地在自恋和奉献之间找到合适的平衡点。</p>
        <AnswerBlank variant="translation" label="第 3 题第 2 小题参考译文" answer="If both partners conceived of love as a joint project, if both thought 'simultaneously of the other and self', Beauvoir argued, they could succeed at 'finding the appropriate mean' between narcissism and devotion." />
      </div>
    </section>
  </section>;
}
