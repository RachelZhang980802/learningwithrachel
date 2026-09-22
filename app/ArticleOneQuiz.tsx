"use client";

import { useState, type ReactNode } from "react";

type Section = "Analytical Reading" | "Pronunciation" | "Vocabulary" | "Grammar & discourse" | "Paraphrasing" | "Translation";
type Exercise = { title: string; instruction?: string; prompt: ReactNode; answer: ReactNode; group?: 1 | 2 | 3; subgroup?: string; blankAnswerPage?: boolean };

const sourceLink = (word: string) => `https://www.etymonline.com/word/${word}`;

function RootAnswer({ word, sourceWord = word, build, english, chinese, examples }: { word: string; sourceWord?: string; build?: ReactNode; english: string; chinese: string; examples: string[] }) {
  return <div className="root-explanation">
    {build}
    <p><strong>{word}</strong> — {english}</p>
    <p lang="zh-CN">{chinese}</p>
    <div className="root-examples">
      <b>More examples / 更多例词：</b>
      <ul>{examples.map(example => <li key={example}>{example}</li>)}</ul>
    </div>
    <a className="root-source" href={sourceLink(sourceWord)} target="_blank" rel="noreferrer">English etymology source: Online Etymology Dictionary ↗</a>
  </div>;
}

const rootInstruction = "Read the following sentence. Interpret the meaning of the word in bold in context with the help of the word root in brackets.";

const rootExercises: Exercise[] = [
  { title: "Root 01 · -stinct-", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>1. My method was hit on by accident and some <mark><strong>instinct</strong></mark>. <span>(stinct: to stick)</span></blockquote></div>, answer: <RootAnswer word="instinct" build={<div className="root-build"><span>in-<small>into · 向内</small></span><i>＋</i><span>-stinct-<small>prick / goad · 刺、驱使</small></span></div>} english="It comes through Latin instinctus, ‘impulse or prompting,’ from a verb meaning ‘to incite or impel.’ The older root carries the idea ‘to prick, stick, or pierce.’" chinese="像受到内在力量的刺激或推动，因此在句中表示“本能、直觉”。" examples={["instinctive = instinct（本能）+ -ive（具有……性质的）→ 本能的", "distinct = dis-（分开）+ -stinct-（刺出标记）→ 区别清楚的", "extinct = ex-（出去）+ -stinct-（刺、驱使）→ 火被驱出，熄灭的；灭绝的"]} /> },
  { title: "Root 02 · scrib / script", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>2. With several courses <mark><strong>prescribed</strong></mark>, I concentrated on the one or two that interested me most and worked intensively on my favorites. <span>(scrib: to write)</span></blockquote></div>, answer: <RootAnswer word="prescribed" sourceWord="prescribe" build={<div className="root-build"><span>pre-<small>before · 预先</small></span><i>＋</i><span>scrib<small>write · 写</small></span><i>＋</i><span>-ed<small>past participle · 过去分词</small></span></div>} english="Latin praescribere meant ‘to write before’ and then ‘to determine in advance or set down as a rule.’ Here the courses had been officially required in advance." chinese="课程被预先写入规定，因此 prescribed courses 指“规定的课程、必修课”。" examples={["describe = de-（向下、彻底）+ scrib（写）→ 写下来说明，描述", "inscribe = in-（在……上）+ scrib（写）→ 题写；铭刻", "manuscript = manu-（手）+ script（写）→ 手稿", "subscribe = sub-（下面）+ scrib（写）→ 在下方签名；订阅", "transcribe = trans-（转移）+ scrib（写）→ 转录；抄写"]} /> },
  { title: "Root 03 · lect", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>3. Now I liked history; I had <mark><strong>neglected</strong></mark> it partly because I rebelled at the way it was taught, as positive knowledge unrelated to politics, art, life, or anything else. <span>(lect: to pick)</span></blockquote></div>, answer: <RootAnswer word="neglected" sourceWord="neglect" build={<div className="root-build"><span>neg-<small>not · 不</small></span><i>＋</i><span>lect<small>pick / choose · 挑选</small></span></div>} english="The word developed from the idea of not choosing or not gathering something up, and therefore failing to give it proper attention." chinese="没有把某事“挑出来关注”，所以在句中表示“忽视、疏于学习”。" examples={["select = se-（分开）+ lect（挑选）→ 选择", "elect = e-/ex-（从……中）+ lect（挑选）→ 选出；选举", "collect = col-/com-（一起）+ lect（挑选、收集）→ 收集", "recollect = re-（再次）+ collect（收集）→ 把记忆重新收拢，回忆"]} /> },
  { title: "Root 04 · peal / pel", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>4. The librarian, <mark><strong>appealed</strong></mark> to, helped me search the bookshelves till the library closed, and then I called on Professor Jones for more references. <span>(peal: to drive)</span></blockquote></div>, answer: <RootAnswer word="appealed to" sourceWord="appeal" build={<div className="root-build"><span>appeal to<small>call upon · 求助于</small></span><i>→</i><span>ask urgently<small>恳请对方行动</small></span></div>} english="In this context, appeal to means to make an earnest request for help. The textbook’s ‘peal: to drive’ cue is a memory aid; the recorded history passes through Latin appellare, ‘to address or call upon.’" chinese="作者向图书管理员求助，请他协助查找资料。" examples={["compel = com-（共同、加强）+ pel（驱使）→ 迫使", "impel = im-/in-（向内、进入）+ pel（驱使）→ 推动", "repel = re-（向后）+ pel（驱使）→ 击退", "propel = pro-（向前）+ pel（驱使）→ 推进"]} /> },
  { title: "Roots 05–06 · spect / demo", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>5. In this course, American constitutional history, I hunted far enough to <mark><strong>suspect</strong></mark> that the Fathers of the Republic who wrote our sacred Constitution of the United States not only did not, but did not want to, establish a <mark><strong>democratic</strong></mark> government. <span>(spect: to look; demo: the people)</span></blockquote></div>, answer: <div className="root-explanation"><div className="root-build"><span>sus- + spect<small>look secretly · 暗中看</small></span><i>＋</i><span>demo- + -cracy<small>people + rule · 人民统治</small></span></div><RootAnswer word="suspect" english="Latin suspicere could mean ‘to look at secretly or askance,’ which developed into ‘to mistrust’ or ‘to imagine as possible.’" chinese="从暗处或带怀疑地看，因此在句中表示“怀疑、推测”。" examples={["inspect = in-（向内）+ spect（看）→ 仔细查看；检查", "respect = re-（回、再次）+ spect（看）→ 回头看重；尊重", "prospect = pro-（向前）+ spect（看）→ 向前看到的景象；前景", "spectator = spect（看）+ -ator（做……的人）→ 观众"]} /><RootAnswer word="democratic" english="Greek demokratia joins demos, ‘the people,’ and kratos, ‘rule or power.’ Democratic therefore means relating to government by the people." chinese="由“人民＋统治”构成，在句中表示“民主的”。" examples={["democracy = demo（人民）+ -cracy（统治）→ 民主", "democrat = demo（人民）+ -crat（统治者、拥护者）→ 民主主义者", "demography = demo（人口）+ -graphy（记录、研究）→ 人口统计学", "demotic = dem（人民）+ -otic（……的）→ 民众的"]} /></div> },
  { title: "Root 07 · mit / miss", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>6. I <mark><strong>promised</strong></mark> myself to write a true history of the making of the American Constitution. <span>(mis: to send)</span></blockquote></div>, answer: <RootAnswer word="promised" sourceWord="promise" build={<div className="root-build"><span>pro-<small>forward / before · 向前</small></span><i>＋</i><span>mis / mit<small>send · 送出</small></span></div>} english="Latin promittere meant ‘to send forth’ and also ‘to assure beforehand.’ A promise is therefore a commitment sent forward into the future." chinese="预先送出承诺，因此表示“答应、许诺”。" examples={["admit = ad-（向）+ mit（送）→ 准许进入；承认", "commit = com-（一起、完全）+ mit（送）→ 托付；投入", "dismiss = dis-（分开、离开）+ miss（送）→ 遣散；解散", "permit = per-（通过）+ mit（送）→ 允许通过", "submit = sub-（在下）+ mit（送）→ 向上递交；提交", "transmit = trans-（跨越）+ mit（送）→ 传送"]} /> },
  { title: "Root 08 · cept", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>7. The history professors soon knew me as a student and seldom put a question to me <mark><strong>except</strong></mark> when the class didn&apos;t know the answer. Then Professor Jones would say, “Well, Steffens, tell them about it.” <span>(cept: to take)</span></blockquote></div>, answer: <RootAnswer word="except" build={<div className="root-build"><span>ex-<small>out · 向外</small></span><i>＋</i><span>cept<small>take · 拿、取</small></span></div>} english="The Latin source combines ex-, ‘out,’ with capere, ‘to take.’ Something excepted is taken out of the general group or rule." chinese="从整体中“取出去”，所以表示“除……之外”。" examples={["accept = ac-/ad-（向）+ cept（拿、取）→ 接受", "intercept = inter-（在……之间）+ cept（取）→ 中途截取；拦截", "reception = re-（回来）+ cept（接取）+ -ion（名词）→ 接待；接收", "recipient = re-（回来）+ cip/cept（取）+ -ent（人）→ 接收者"]} /> },
];

const paraphrasingPairs: { original: ReactNode; answer: ReactNode }[] = [
  { original: <>The following personal experience I have to offer <mark><strong>illustrates</strong></mark> it and shows how to get around the faculty, the other students, and the whole college system of mind-fixing.</>, answer: <>The following personal experience I will provide <mark><strong>explains</strong></mark> it and shows how the teachers, the other students, and the whole college system could avoid having a fixed mind.</> },
  { original: <>I <mark><strong>proposed</strong></mark> in my junior and senior years to <mark><strong>specialize in</strong></mark> history, taking all the courses required and those also that I had failed.</>, answer: <>I <mark><strong>planned</strong></mark> to <mark><strong>focus on</strong></mark> history in my third and fourth year in college. That means I would take all the required courses and some previously failed ones.</> },
  { original: <>With this in mind I listened <mark><strong>attentively</strong></mark> to the first introductory talk of Professor William Cary Jones on American constitutional history.</>, answer: <>Remembering this, I listened <mark><strong>carefully</strong></mark> to Professor William Cary Jones’ first class on American constitutional history.</> },
  { original: <>He was astonished, invited me in, and began to <mark><strong>approve</strong></mark> my industry, which astonished me.</>, answer: <>He was astonished, invited me in, and began to <mark><strong>recognize</strong></mark> my hard work, which surprised me.</> },
  { original: <>History was not a science, but a field for research, a field for me, for any young man, to explore, to make discoveries in and write a scientific report about. I was <mark><strong>fascinated</strong></mark>.</>, answer: <>History was not a definite and unchanging knowledge, but a field for continuous research. I was <mark><strong>attracted</strong></mark> by the course.</> },
  { original: <>“I think we’re all going to be able to <mark><strong>concentrate</strong></mark> better after some relaxation,” Mary said. “And we shall hear your tales now.”</>, answer: <>“I think we’re all going to be able to <mark><strong>work more effectively</strong></mark> after some rest,” Mary said. “And we shall hear your tales now.”</> },
  { original: <>The <mark><strong>essential</strong></mark> quality of all these amazing works is the pursuit of beauty.</>, answer: <>The <mark><strong>most important</strong></mark> feature of all these amazing works is the pursuit of beauty.</> },
  { original: <>A large <mark><strong>proportion</strong></mark> of the material in what follows comes from Steffens&apos; autobiography.</>, answer: <>A <mark><strong>large part</strong></mark> of the following material comes from Steffens’ book about his own life.</> },
];

const paraphrasingExercises: Exercise[] = paraphrasingPairs.map((pair, index) => ({ title: `Paraphrasing · ${String(index + 1).padStart(2, "0")}/08`, instruction: "Paraphrase the highlighted word or expression without changing the original meaning.", prompt: <blockquote className="quiz-question-card">{pair.original}</blockquote>, answer: <p>{pair.answer}</p> }));

const trueFalseItems: { question: ReactNode; verdict: "True." | "False."; tip: string }[] = [
  { question: <>At first, Steffens liked history because he had a <mark>good memory</mark>.</>, verdict: "False.", tip: "“Bad memory” is spotted in this sentence: Blessed as I was with a “bad memory,” I could not commit to anything that I did not understand and intellectually need. However, it means exactly the opposite to what is stated in the sentence." },
  { question: <>Steffens took many courses in history, amongst which was a course about <mark>American constitutional history</mark> given by Professor Jones.</>, verdict: "True.", tip: "This was the course that started his deeper inquiry." },
  { question: <>According to Steffens, <mark>Professor Jones’ class</mark> was boring but instructive.</>, verdict: "True.", tip: "The introductory talk led him toward further reading and research." },
  { question: <>Steffens believed that history is <mark>scientific and definite</mark>.</>, verdict: "False.", tip: "In the beginning of Para. 4, it writes: History was not a science, but a field for research, a field for me, for any young man, to explore, to make discoveries in and write a scientific report about." },
  { question: <>Steffens’ purpose was to criticize the <mark>American Constitution</mark>.</>, verdict: "False.", tip: "The author’s purpose was to take his experience in American constitutional history course as an example to explain his critical learning method." },
];

const trueFalseExercises: Exercise[] = trueFalseItems.map((item, index) => ({ group: 2, title: `True or false · ${String(index + 1).padStart(2, "0")}/05`, instruction: "Decide whether the statement is true or false, then reveal the textual clue.", prompt: <blockquote className="quiz-question-card">{item.question}</blockquote>, answer: <p><strong>{item.verdict}</strong><br /><span className="answer-tip">Tip: {item.tip}</span></p> }));

const closeReadingItems: { question: ReactNode; answer: string }[] = [
  { question: <>Why was Steffens not interested in <mark>history before his junior year</mark>?</>, answer: "He was not interested in history before because his previous learning emphasized rote memory: This gave him little training on how to analyze and understand historical events." },
  { question: <>How did Professor Jones’s introductory class change his <mark>way of learning</mark>?</>, answer: "In his introductory class, Professor Jones recommended some references to those who cared to dig deeper, and there began Steffens’ research." },
  { question: <>In Para. 3, what did Steffens do when he came across <mark>conflicting viewpoints</mark> in his reading?</>, answer: "He read extensively and searched for original evidence so that he could form his own answer." },
  { question: <>How did <mark>Professor Jones</mark> help Steffens in learning history?</>, answer: "He offered related references, discussed them with Steffens, and encouraged him when he came up with his own opinion." },
  { question: <>What is Steffens’ assumption about <mark>American constitutional history</mark>?</>, answer: "He suspected that the Fathers of the Republic who wrote the sacred Constitution of the United States not only did not, but did not want to, establish a democratic government." },
  { question: <>What <mark>learning method</mark> is described in Para. 4?</>, answer: "The method is, whenever in doubt or not sure about something, trying to resort to original documents or other clinching evidence, and always sorting out the essential differences of facts and opinions to form one’s own point." },
  { question: <>What does <mark>“There was something for Youth to do”</mark> mean?</>, answer: "Young people still had historical questions to investigate because accepted accounts could be incomplete or wrong." },
  { question: <>In Para. 1, Steffens states that <mark>“a degree is not worth so much as the capacity and the drive to learn.”</mark> Do you agree? Why or why not?</>, answer: "A degree is important for a graduate to find a job, but the capacity and the drive to learn is more important for anyone to succeed in many aspects of life. It is the ultimate goal and key to success." },
];

const closeReadingExercises: Exercise[] = closeReadingItems.map((item, index) => ({ group: 3, title: `Close reading · ${String(index + 1).padStart(2, "0")}/08`, instruction: "Answer this textbook question, then compare your response with the answer key.", prompt: <blockquote className="quiz-question-card">{item.question}</blockquote>, answer: <p>{item.answer}</p> }));

const prepositionItems = [
  { prompt: <>1. In high school, I worked equally hard <mark>1) ___</mark> Chinese, Math, English, Physics, and Chemistry; however, in college, I decided to concentrate <mark>2) ___</mark> my favorite subjects.</>, answer: <><strong>at; on</strong><br />We say <em>work hard at a subject</em> and <em>concentrate on a subject</em>.</> },
  { prompt: <>2. David read the long play with great difficulty, and when he finished it, he immediately began to work <mark>3) ___</mark> ways to act it out.</>, answer: <><strong>on</strong><br /><em>Work on</em> means to spend time developing or improving something.</> },
  { prompt: <>3. Who were these two, Susan and Alfred, and how were they related <mark>4) ___</mark> each other? I looked again at the front page of the invitation card.</>, answer: <><strong>to</strong><br />The fixed expression is <em>be related to somebody</em>.</> },
  { prompt: <>4. These letters we&apos;ve uncovered shed some light <mark>5) ___</mark> how the late author&apos;s final book was meant to end.</>, answer: <><strong>on</strong><br /><em>Shed light on</em> means to make something easier to understand.</> },
  { prompt: <>5. “It was not we who caused the crash,” my wife said, trying to ignore that man&apos;s vulgar manner, but it wasn&apos;t something I cared <mark>6) ___</mark> ignore.</>, answer: <><strong>to</strong><br /><em>Care to do something</em> means to be willing or wish to do it.</> },
  { prompt: <>6. Since his retirement, Crowe has differed <mark>7) ___</mark> the President <mark>8) ___</mark> several issues.</>, answer: <><strong>from; on</strong><br /><em>Differ from somebody</em> marks the person whose view is different; <em>on</em> introduces the issue.</> },
  { prompt: <>7. “Mary,” said the father of the newborn baby, gently, “it is surprising how you and I disagree <mark>9) ___</mark> the name of our child.”</>, answer: <><strong>on</strong><br /><em>Disagree on</em> introduces the topic or decision in dispute.</> },
  { prompt: <>8. I am pushing on hopelessly along the way with no sidewalk, no lamppost to lean on, no café at the corner, and no one to call <mark>10) ___</mark> for help.</>, answer: <><strong>on</strong><br /><em>Call on somebody</em> means to ask that person for help.</> },
  { prompt: <>9. Days rolled by, and life&apos;s activity went <mark>11) ___</mark>, but her love did not return.</>, answer: <><strong>on</strong><br /><em>Go on</em> means to continue.</> },
];

const prepositionExercises: Exercise[] = prepositionItems.map((item, index) => ({ title: `Prepositions · ${String(index + 1).padStart(2, "0")}/09`, instruction: "Fill in the blank or blanks with the correct preposition.", prompt: <blockquote className="quiz-question-card">{item.prompt}</blockquote>, answer: <p>{item.answer}</p> }));

const articleItems = [
  ["Lincoln Steffens learned ___ history.", "—", "Names of academic subjects are normally used without an article."],
  ["He studied history in ___ college.", "—", "College is used without an article when it refers to its institutional purpose."],
  ["He compared his reading with ___ previous authorities.", "—", "The plural noun is used generally, so no article is needed."],
  ["They disagreed on ___ many facts.", "—", "Many already determines the plural noun."],
  ["With ___ help of Mr. Scott Smith, he searched the shelves.", "the", "The fixed phrase is ‘with the help of’."],
  ["Mr. Scott Smith, ___ librarian, helped him.", "the", "The title identifies the specific librarian already known in the context."],
  ["He searched ___ bookshelves of the library.", "the", "The of-phrase makes the bookshelves specific."],
  ["He worked in ___ college library.", "the", "The passage refers to a particular college library."],
  ["He formed ___ his own perspective.", "—", "A possessive determiner such as ‘his’ does not take an article before it."],
  ["He studied ___ American constitutional history.", "—", "The name of the field or course subject is used without an article here."],
  ["He dreamed for ___ while of writing a history.", "a", "The fixed time expression is ‘for a while’."],
  ["He planned to write ___ book.", "a", "This is the first mention of one nonspecific countable book."],
  ["Someone had already written ___ similar book.", "a", "Similar book is singular, countable, and nonspecific."],
  ["He still found ___ research process productive.", "the", "The phrase refers to the specific research process described in the passage."],
] as const;

const articleExercises: Exercise[] = articleItems.map(([prompt, answer, explanation], index) => ({ title: `Articles · ${String(index + 1).padStart(2, "0")}/14`, instruction: "Use a, the, or — (no article).", prompt: <blockquote className="quiz-question-card">{prompt}</blockquote>, answer: <p><strong>{answer}</strong><br />{explanation}</p> }));

const modifierItems = [
  { prompt: "The following personal experience I have to offer illustrates it.", answer: "MN — ‘following’ modifies the noun phrase ‘personal experience’." },
  { prompt: "I proposed in my junior and senior years to specialize in history, taking all the courses required and those also that I had failed.", answer: "MV — ‘taking ...’ adds an accompanying action to the main clause." },
  { prompt: "Turning to the other authorities, I saw that they disagreed on the same facts and also on others.", answer: "MV — ‘Turning ...’ modifies the action and gives its circumstance." },
  { prompt: "As I went on from chapter to chapter, day after day, finding frequently essential differences of opinion and of fact, I saw more and more work to do.", answer: "MV — ‘finding ...’ accompanies and explains the action in the main clause." },
  { prompt: "Vanity wasn’t my ruling passion then.", answer: "MN — ‘ruling’ modifies the noun ‘passion’." },
];

const modifierExercises: Exercise[] = modifierItems.map((item, index) => ({ title: `Present participle · ${String(index + 1).padStart(2, "0")}/05`, instruction: "Decide whether the -ing form modifies a noun (MN) or the main verb/clause (MV).", prompt: <blockquote className="quiz-question-card">{item.prompt}</blockquote>, answer: <p>{item.answer}</p> }));

const combineItems = [
  ["A big bird flew over. It flapped its wings.", <>A big bird flew over, <mark><strong>flapping</strong></mark> its wings.</>],
  ["He mounted the huge black horse. He was panting with his mouth gaping.", <>He finally mounted the huge black horse, <mark><strong>panting</strong></mark> with his mouth gaping.</>],
  ["She has lived for nearly a century. She has experienced almost all tragedies.", <>She has lived for nearly a century, <mark><strong>having experienced</strong></mark> almost all the tragedies one can imagine.</>],
  ["The professor was seated at one table. He studied his menu.", <>The professor was seated at one of the tables, <mark><strong>studying</strong></mark> his menu.</>],
  ["Riding a bike to school is eco-friendly. It reduces air pollution.", <>To ride a bike to school is an eco-friendly habit, <mark><strong>reducing</strong></mark> air pollution on campus.</>],
  ["“Are you English?” she asked curiously. She smiled politely.", <>“Are you English?” she asked curiously, <mark><strong>smiling</strong></mark> politely.</>],
] as const;

const combineExercises: Exercise[] = combineItems.map(([prompt, answer], index) => ({ title: `Combine with -ing · ${String(index + 1).padStart(2, "0")}/06`, instruction: "Rewrite the pair as one sentence with an -ing structure.", prompt: <blockquote className="quiz-question-card">{prompt}</blockquote>, answer: <p>{answer}</p> }));

const translationPrompts = [
  "…the fact that a proportion, however small, of college students do get a start in interested, methodical study, proves my thesis, and the following personal experience I have to offer illustrates it and shows how to get around the faculty, the other students, and the whole college system of mind-fixing. (Para. 1)",
  "Blessed as I was with a \"bad memory,\" I could not commit to it anything that I did not understand and intellectually need. (Para. 2)",
  "But I had discovered in my readings of literature, philosophy, and political economy that history had light to throw upon unhistorical questions. (Para. 2)",
  "They only deepened the mystery, explaining many historical questions while leaving more answers to be dug for and written.",
  "In this course, American constitutional history, I hunted far enough to suspect that the Fathers of the Republic who wrote our sacred Constitution of the United States not only did not, but did not want to, establish a democratic government.",
  "What I had was a quickening sense that I was learning a method of studying history. Every chapter of history, from the beginning of the earth to the end of the world, cried out to be rewritten.",
];
const translationAnswers = [
  "在大学里能够获得真正的教育。虽然不是经常如此，但的确有一部分大学生，即使比例很小，在大学里找到了自己的学术兴趣，并展开系统学习。这就证明了我的看法，大学的确是一个受教育的地方。下面我要讲的个人经历就是一个例证，而且可以告诉大家如何绕过教师、学生和大学教育系统，以避免思想僵化。",
  "好在我记性不好，记不住那些无法理解也并不需要的知识。",
  "我在阅读文学、哲学和政治经济学著作时发现，历史可以为许多非历史问题带来启发。",
  "这（些书）更加深了我的困惑，解释了许多历史性问题的同时，留下了更多问题有待挖掘与书写。",
  "在美国宪法史这门课上，我经过足够深入的探索，开始怀疑那些书写我们神圣的美国宪法的共和国缔造者们并没有，也不打算建立一个民主国家。",
  "我有一种强烈的感觉，感觉自己正在学习研究历史的方法。历史书上的一章一节，从天地之初到世界末日，无不呼喊着、渴望着被重新书写。",
];
const englishChineseExercises: Exercise[] = translationPrompts.map((prompt, index) => ({ title: `English → Chinese · ${String(index + 1).padStart(2, "0")}/06`, instruction: "Translate this excerpt, then compare it with the textbook answer.", prompt: <blockquote className="quiz-question-card">{prompt}</blockquote>, answer: <p lang="zh-CN">{translationAnswers[index]}</p> }));

const exercises: Record<Section, Exercise[]> = {
  "Analytical Reading": [
    { group: 1, title: "Story outline", instruction: "Put the events in order, then check the model sequence.", prompt: <div className="quiz-question-card quiz-order-card"><p>Looking back to his college days, Lincoln Steffens suggests that one is only really able to learn when he/she is able to <mark>think critically</mark>.</p><ol><li>A. Steffens took Professor Jones’ course on the history of American Constitution and read everything he could find on the subject.</li><li>B. By the end of the term, Steffens not only did well in Professor Jones’ class, but also increased his own understanding of history while developing his ability to think critically.</li><li>C. Library research exposed conflicting accounts.</li><li>D. Steffens used to think history boring, but later developed his interest in the subject and planned to specialize in history in his junior and senior years.</li></ol></div>, answer: <p><strong>D → A → C → B.</strong><br />He first became interested, then pursued Jones’s course, discovered disagreement among authorities, and developed a method of independent inquiry.</p> },
    ...trueFalseExercises,
    ...closeReadingExercises,
  ],
  Pronunciation: [{ title: "Pronunciation video", instruction: "Read the 20 English vowel phonetic symbols fluently.", prompt: <section className="quiz-video-card"><video controls preload="metadata" aria-label="Article 01 pronunciation lesson"><source src="/media/article-01-pronunciation.mp4" type="video/mp4" />Your browser does not support video playback.</video></section>, answer: null, blankAnswerPage: true }],
  Vocabulary: [...rootExercises.map(item => ({ ...item, subgroup: "Word roots" })), ...prepositionExercises.map(item => ({ ...item, subgroup: "Prepositions" }))],
  "Grammar & discourse": [...articleExercises.map(item => ({ ...item, subgroup: "Articles" })), ...modifierExercises.map(item => ({ ...item, subgroup: "Present participles" })), ...combineExercises.map(item => ({ ...item, subgroup: "Combine with -ing" }))],
  Paraphrasing: paraphrasingExercises,
  Translation: [...englishChineseExercises, { title: "Chinese → English", instruction: "Translate this paragraph, then reveal the textbook model.", prompt: <p lang="zh-CN" className="quiz-question-card">大学生活真棒！我学到的第一课就是不要轻易相信权威（authority）。面对不同（disagreeing）观点，需要阅读原始（original）资料，分析其本质（essential）差异，批判性地（critically）思考，形成自己的观点。此外，还可以经常找同学讨论，或者请（call on/appeal to）教授推荐相关的资料，使研究进一步深入（further/deepen）。这样的学习过程使我的观点更加坚实有力。</p>, answer: <p>College life is fantastic! The first lesson I learned in university is always feeling free to doubt authorities. To form my own opinion, I need to read original documents, analyze the essential differences between disagreeing opinions, and to think critically. To further my study, I could also discuss with classmates frequently, or call on the professors for related references. This learning process can make my points stronger and more solid.</p> }],
};

const sectionTabs: { id: Section; label: string }[] = [
  { id: "Analytical Reading", label: "Analytical Reading" }, { id: "Pronunciation", label: "Pronunciation" }, { id: "Vocabulary", label: "Vocabulary" }, { id: "Grammar & discourse", label: "Grammar & Discourse" }, { id: "Paraphrasing", label: "Paraphrasing" }, { id: "Translation", label: "Translation" },
];
const analyticalGroups = [{ group: 1 as const, label: "01", title: "Story outline" }, { group: 2 as const, label: "02", title: "True or false" }, { group: 3 as const, label: "03", title: "Close reading" }];

export function ArticleOneQuiz() {
  const [section, setSection] = useState<Section>("Analytical Reading");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const choose = (next: Section) => { setSection(next); setIndex(0); setRevealed(false); };
  const item = exercises[section][index];
  const groupIndices = section === "Analytical Reading"
    ? exercises[section].map((entry, entryIndex) => entry.group === item.group ? entryIndex : -1).filter(entryIndex => entryIndex >= 0)
    : item.subgroup
      ? exercises[section].map((entry, entryIndex) => entry.subgroup === item.subgroup ? entryIndex : -1).filter(entryIndex => entryIndex >= 0)
      : exercises[section].map((_, entryIndex) => entryIndex);
  const groupStart = groupIndices[0] ?? 0;
  const groupEnd = groupIndices.at(-1) ?? exercises[section].length - 1;
  const jump = (target: number) => { setIndex(target); setRevealed(false); };
  const jumpGroup = (group: 1 | 2 | 3) => jump(exercises["Analytical Reading"].findIndex(entry => entry.group === group));
  const jumpVocabulary = (subgroup: "Word roots" | "Prepositions") => jump(exercises.Vocabulary.findIndex(entry => entry.subgroup === subgroup));
  const move = (delta: number) => { setIndex(current => Math.min(Math.max(groupStart, current + delta), groupEnd)); setRevealed(false); };
  const canMoveNext = index < groupEnd;
  const showInlineNext = canMoveNext && (
    (section === "Analytical Reading" && (item.group === 2 || item.group === 3)) ||
    section === "Vocabulary" ||
    section === "Paraphrasing" ||
    section === "Translation" ||
    (section === "Grammar & discourse" && item.subgroup === "Articles")
  );

  return <main className="article-one-quiz">
    <nav className="quiz-section-nav" aria-label="Practice categories">{sectionTabs.map(tab => <button key={tab.id} className={section === tab.id ? "is-active" : ""} onClick={() => choose(tab.id)}>{tab.label}</button>)}</nav>
    <section className="quiz-open-book" aria-live="polite">
      <article className="quiz-page quiz-question-page">
        <header className={`quiz-folio-bar${section === "Vocabulary" ? " is-vocabulary" : ""}`}>
          <span>{section.toUpperCase()}</span>
          {section === "Vocabulary" && <nav className="quiz-subsection-switcher" aria-label="Vocabulary sections"><button type="button" className={item.subgroup === "Word roots" ? "is-active" : ""} onClick={() => jumpVocabulary("Word roots")}>Word roots</button><button type="button" className={item.subgroup === "Prepositions" ? "is-active" : ""} onClick={() => jumpVocabulary("Prepositions")}>Prepositions</button></nav>}
          <nav className="quiz-question-numbers" aria-label={`${section} questions`}>{section === "Analytical Reading" ? analyticalGroups.map(group => <button key={group.group} type="button" className={item.group === group.group ? "is-active" : ""} aria-label={group.title} aria-pressed={item.group === group.group} onClick={() => jumpGroup(group.group)}>{group.label}</button>) : groupIndices.map((entryIndex, localIndex) => <button key={entryIndex} type="button" className={entryIndex === index ? "is-active" : ""} aria-label={`Question ${localIndex + 1}`} aria-pressed={entryIndex === index} onClick={() => jump(entryIndex)}>{String(localIndex + 1).padStart(2, "0")}</button>)}</nav>
        </header>
        <h2>{item.title}</h2>{item.instruction && <p className="quiz-instruction">{item.instruction}</p>}
        {!item.blankAnswerPage && <div className={`quiz-prompt${showInlineNext ? " has-inline-next" : ""}`}><div className="quiz-prompt-content">{item.prompt}</div>{showInlineNext && <button className="quiz-inline-next" onClick={() => move(1)}>Next question →</button>}</div>}
        <img className="quiz-cat" src="/quiz-reader-cat-cutout.png?v=transparent-1" alt="戴学士帽的小猫趴在写有 Good Readers Go Further 的旧书上，旁边有枝叶" />
        <footer><button disabled={index === groupStart} onClick={() => move(-1)}>← Previous</button><button disabled={index === groupEnd} onClick={() => move(1)}>Next →</button></footer>
      </article>
      {item.blankAnswerPage ? <article className="quiz-page quiz-answer-page quiz-answer-page-blank" aria-label="Pronunciation video page"><div className="quiz-right-media">{item.prompt}</div></article> : <article className={`quiz-page quiz-answer-page${revealed ? " is-revealed" : ""}`}>
        <p className="quiz-folio">ANSWER KEY</p><h2>{revealed ? "Model answer" : "Think first"}</h2>
        {revealed ? <div className="quiz-answer">{item.answer}</div> : <div className="quiz-answer-cover"><p>Use the clues, notes, and original text before opening this page.</p><span aria-hidden="true">✦</span></div>}
        <button className="quiz-reveal" onClick={() => setRevealed(value => !value)}>{revealed ? "Hide answer" : "Reveal answer"}</button>
        <footer><button disabled={index === groupStart} onClick={() => move(-1)}>← Previous</button><button disabled={index === groupEnd} onClick={() => move(1)}>Next →</button></footer>
      </article>}
    </section>
  </main>;
}
