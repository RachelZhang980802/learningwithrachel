"use client";

import type { ReactNode } from "react";
import { ArticleOneRootExpansion } from "./ArticleOneRootExpansion";
import { InlineClozeQuestion, InlineStoryOrder } from "./Article01QuizInteractions";

type Section = "Analytical Reading" | "Pronunciation" | "Vocabulary" | "Grammar & discourse" | "Paraphrasing" | "Translation";
export type QuizExercise = Exercise;
export type QuizCategory = { id: string; label: string; color: string; exercises: QuizExercise[] };
type Exercise = { title: string; instruction?: string; prompt: ReactNode; answer: ReactNode; answerTranslation?: ReactNode; group?: 1 | 2 | 3; subgroup?: string; blankAnswerPage?: boolean; selfManagedAnswers?: boolean; inlineAnswer?: boolean };

function RootReferenceAnswer({ entries }: { entries: { word: string; text: string }[] }) {
  return <div className="root-explanation">
    <ArticleOneRootExpansion word={entries[0].word} />
  </div>;
}

const rootInstruction = "Read the following sentences. Interpret the meaning of the words in bold in context with the help of word roots in brackets.";

const rootExercises: Exercise[] = [
  { title: "Root 01 · stinct", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>1. My method was hit on by accident and some <mark><strong>instinct</strong></mark>. <span>(stinct: to stick or prick; figuratively, to urge)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "instinct", "text": ""}]} /> },
  { title: "Root 02 · scrib", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>2. With several courses <mark><strong>prescribed</strong></mark>, I concentrated on the one or two that interested me most and worked intensively on my favorites. <span>(scrib: to write)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "prescribe", "text": "to state officially what should be done in a particular situation. Interpreted from its word formation, it means to write beforehand a rule, etc."}]} /> },
  { title: "Root 03 · lect", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>3. Now I liked history; I had <mark><strong>neglected</strong></mark> it partly because I rebelled at the way it was taught, as positive knowledge unrelated to politics, art, life, or anything else. <span>(lect: to pick)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "neglect", "text": "to fail to look after someone or something properly. Interpreted from its word formation, it means not to look at something."}]} /> },
  { title: "Root 04 · pel", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>4. The librarian, <mark><strong>appealed</strong></mark> to, helped me search the bookshelves till the library closed, and then I called on Professor Jones for more references. <span>(pel: to drive; appeal: to call on)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "appeal", "text": ""}]} /> },
  { title: "Root 05 · spect / demo", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>5. In this course, American constitutional history, I hunted far enough to <mark><strong>suspect</strong></mark> that the Fathers of the Republic who wrote our sacred Constitution of the United States not only did not, but did not want to, establish a <mark><strong>democratic</strong></mark> government. <span>(spect: to look; demo: the people)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "suspect", "text": "to think that something is probably true, especially something bad. Interpreted from its word formation, it means to look with mistrust."}, {"word": "democratic", "text": "organized according to the principle that everyone has a right to be involved in making decisions. Interpreted from its word formation, it means all the citizen living under a particular city-state rule together."}]} /> },
  { title: "Root 06 · mis", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>6. I <mark><strong>promised</strong></mark> myself to write a true history of the making of the American Constitution. <span>(mis: to send)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "promise", "text": "to tell someone that you will definitely do or provide something or that something will happen in the future. Interpreted from its word formation, it means to send something or some message before it happens."}]} /> },
  { title: "Root 07 · cept", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>7. The history professors soon knew me as a student and seldom put a question to me <mark><strong>except</strong></mark> when the class didn&apos;t know the answer. Then Professor Jones would say, “Well, Steffens, tell them about it.” <span>(cept: to take)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "except", "text": "used to introduce the only person, thing, action, fact, or situation about which a statement is not true. Interpreted from its word formation, it means to take out the special examples or occasions."}]} /> },
];

const paraphrasingPairs: { original: ReactNode; answer: ReactNode }[] = [
  { original: <>The following personal experience I have to offer <mark><strong>illustrates</strong></mark> it and shows how to get around the faculty, the other students, and the whole college system of mind-fixing.</>, answer: <>The following personal experience I will provide <mark><strong>explains</strong></mark> it and shows how the teachers, the other students, and the whole college system could avoid having a fixed mind.</> },
  { original: <>I <mark><strong>proposed</strong></mark> in my junior and senior years to <mark><strong>specialize in</strong></mark> history, taking all the courses required and those also that I had failed.</>, answer: <>I <mark><strong>planned</strong></mark> to <mark><strong>focus on</strong></mark> history in my third and fourth year in college. That means I would take all the required courses and some previously failed ones.</> },
  { original: <>With this in mind I listened <mark><strong>attentively</strong></mark> to the first introductory talk of Professor William Cary Jones on American constitutional history.</>, answer: <>Remembering this, I listened <mark><strong>carefully</strong></mark> to Professor William Cary Jones’ first class on American constitutional history.</> },
  { original: <>He was astonished, invited me in, and began to <mark><strong>approve</strong></mark> my industry, which astonished me.</>, answer: <>He was astonished, invited me in, and began to <mark><strong>recognize</strong></mark> my hard work, which surprised me.</> },
  { original: <>History was not a science, but a field for research, a field for me, for any young man, to explore, to make discoveries in and write a scientific report about. I was <mark><strong>fascinated</strong></mark>.</>, answer: <>History was not a definite and unchanging knowledge, but a field for continuous research. I was <mark><strong>attracted</strong></mark> by the course.</> },
  { original: <>“I think we’re all going to be able to <mark><strong>concentrate</strong></mark> better after some relaxation,” Mary said. “And we shall hear your tales now.”</>, answer: <>“I think we’re all going to be able to <mark><strong>work more effectively</strong></mark> after some rest,” Mary said. “And we shall hear your tales now.”</> },
  { original: <>The <mark><strong>essential</strong></mark> quality of all these amazing works is the pursuit of beauty.</>, answer: <>The <mark><strong>most important</strong></mark> feature of all these amazing works is the pursuit for beauty.</> },
  { original: <>A large <mark><strong>proportion</strong></mark> of the material in what follows comes from Steffens&apos; autobiography.</>, answer: <>A <mark><strong>large part</strong></mark> of the following material comes from Steffens’ book about his own life.</> },
];

const paraphrasingTranslations = [
  "下面这个个人经历说明了这一点，也说明教师、其他学生和整套大学制度怎样避免思想僵化。",
  "我计划在大学三、四年级专攻历史，修读所有必修课以及以前不及格的课程。",
  "记住这一点后，我认真听了威廉·卡里·琼斯教授关于美国宪法史的第一堂课。",
  "他很惊讶，请我进去，并开始认可我的刻苦，这也让我吃惊。",
  "历史不是确定不变的知识，而是需要不断研究的领域；这门课深深吸引了我。",
  "玛丽说，休息之后大家会更有效地集中精力，然后就可以听你的故事了。",
  "这些杰出作品最重要的特征是对美的追求。",
  "下文的大部分材料来自斯蒂芬斯的自传。",
];
const paraphrasingExercises: Exercise[] = paraphrasingPairs.map((pair, index) => ({ title: `Paraphrasing · ${String(index + 1).padStart(2, "0")}/08`, instruction: "Paraphrase the following sentences, paying attention to the words or expressions in bold.", prompt: <blockquote className="quiz-question-card">{pair.original}</blockquote>, answer: <p>{pair.answer}</p>, answerTranslation: paraphrasingTranslations[index] }));

const trueFalseItems: { question: ReactNode; verdict: "T" | "F"; tip?: string }[] = [
  { question: <>At the very beginning, Steffens liked history because his <mark>memory was not bad</mark>.</>, verdict: "F", tip: "“Bad memory” is spotted in this sentence: Blessed as I was with a “bad memory,” I could not commit to anything that I did not understand and intellectually need. However, it means exactly the opposite to what is stated in the sentence." },
  { question: <>Steffens took many courses in history, amongst which was a course about <mark>American constitutional history</mark> given by Professor Jones.</>, verdict: "T" },
  { question: <>According to Steffens, <mark>Professor Jones’ class</mark> was boring but instructive.</>, verdict: "T" },
  { question: <>Steffens believed that history was <mark>scientific and definite</mark>.</>, verdict: "F", tip: "In the beginning of Para. 4, it writes: History was not a science, but a field for research, a field for me, for any young man, to explore, to make discoveries in and write a scientific report about." },
  { question: <>Steffens’ purpose was to criticize the <mark>American Constitution</mark>.</>, verdict: "F", tip: "The author’s purpose was to take his experience in American constitutional history course as an example to explain his critical learning method." },
];

const trueFalseTranslations = [
  "答案错误。这里的“记性不好”实际说明他无法死记自己不理解、在思想上也不需要的内容。",
  "答案正确。斯蒂芬斯修过多门历史课，其中包括琼斯教授讲授的美国宪法史。",
  "答案正确。斯蒂芬斯认为琼斯教授的课虽显得乏味，却很有启发性。",
  "答案错误。他认为历史不是确定不变的科学，而是一个需要不断探索和研究的领域。",
  "答案错误。他借美国宪法史课程说明自己的批判性学习方法，并非为了批评美国宪法。",
];
const trueFalseExercises: Exercise[] = trueFalseItems.map((item, index) => ({ group: 2, title: `True or false · ${String(index + 1).padStart(2, "0")}/05`, instruction: "Decide whether the following statements are true (T) or false (F) according to the text.", prompt: <blockquote className="quiz-question-card">{item.question}</blockquote>, answer: <p><strong>{item.verdict}</strong>{item.tip && <><br /><span className="answer-tip">Tip: {item.tip}</span></>}</p>, answerTranslation: trueFalseTranslations[index], inlineAnswer: true }));

const closeReadingItems: { question: ReactNode; answer: string }[] = [
  { question: <>Why was Steffens not interested in <mark>history before entering his junior year</mark>?</>, answer: "He was not interested in history before because his previous learning emphasized rote memory: This gave him little training on how to analyze and understand historical events." },
  { question: <>How did Professor Jones’ introductory class change <mark>Steffens’ learning</mark>?</>, answer: "In his introductory class, Professor Jones recommended some references to those who cared to dig deeper, and there began Steffens’ research." },
  { question: <>According to Para. 3, what did Steffens do when he came across <mark>conflicting viewpoints</mark> in his reading?</>, answer: "He read extensively to find his own answer." },
  { question: <>How did <mark>Professor Jones</mark> help Steffens in learning history?</>, answer: "He offered related references, discussed them with Steffens, and encouraged him when he came up with his own opinion." },
  { question: <>What was Steffens’ assumption about <mark>American constitutional history</mark>?</>, answer: "He suspected that the Fathers of the Republic who wrote the sacred Constitution of the United States not only did not, but did not want to, establish a democratic government." },
  { question: <>What <mark>learning method</mark> is described in Para. 4?</>, answer: "The method is, whenever in doubt or not sure about something, trying to resort to original documents or other clinching evidence, and always sorting out the essential differences of facts and opinions to form one’s own point." },
  { question: <>What does Steffens mean by stating <mark>“There was something for Youth to do”</mark> at the end of the text?</>, answer: "He thinks young people should explore things critically because many widely accepted opinions might be wrong." },
  { question: <>In Para. 1, Steffens states that <mark>“a degree is not worth so much as the capacity and the drive to learn.”</mark> Do you agree? Why or why not?</>, answer: "A degree is important for a graduate to find a job, but the capacity and the drive to learn is more important for anyone to succeed in many aspects of life. It is the ultimate goal and key to success." },
];

const closeReadingTranslations = [
  "他以前学历史只强调机械记忆，几乎没有训练他分析和理解历史事件，因此进入三年级前对历史不感兴趣。",
  "琼斯教授在导论课上向愿意深入钻研的学生推荐参考资料，斯蒂芬斯的研究由此开始。",
  "遇到相互冲突的观点时，他广泛阅读，努力形成自己的答案。",
  "琼斯教授提供相关资料，与他讨论，并在他形成自己的观点时给予鼓励。",
  "他怀疑起草美国宪法的共和国缔造者们并没有、也不想建立一个民主政府。",
  "这种方法是在怀疑或不确定时查找原始文献或确凿证据，分清事实与观点的本质差异，形成自己的见解。",
  "他的意思是年轻人应以批判眼光探索，因为许多被普遍接受的看法也可能是错的。",
  "学位对求职很重要，但学习的能力和动力对人生各方面的成功更重要；它们才是最终目标和成功关键。",
];
const closeReadingExercises: Exercise[] = closeReadingItems.map((item, index) => ({ group: 3, title: `Close reading · ${String(index + 1).padStart(2, "0")}/08`, instruction: "Answer the following questions.", prompt: <blockquote className="quiz-question-card">{item.question}</blockquote>, answer: <p>{item.answer}</p>, answerTranslation: closeReadingTranslations[index] }));

const prepositionItems = [
  { parts: ["1. In high school, I worked equally hard ", " Chinese, Math, English, Physics, and Chemistry; however, in college, I decided to concentrate ", " my favorite subjects."], answers: ["at", "on"], explanations: ["We say work hard at a subject.", "We say concentrate on a subject."] },
  { parts: ["2. David read the long play with great difficulty, and when he finished it, he immediately began to work ", " ways to act it out."], answers: ["on"], explanations: ["Work on means to spend time developing or improving something."] },
  { parts: ["3. Who were these two, Susan and Alfred, and how were they related ", " each other? I looked again at the front page of the invitation card."], answers: ["to"], explanations: ["The fixed expression is be related to somebody."] },
  { parts: ["4. These letters we've uncovered shed some light ", " how the late author's final book was meant to end."], answers: ["on"], explanations: ["Shed light on means to make something easier to understand."] },
  { parts: ["5. “It was not we who caused the crash,” my wife said, trying to ignore that man's vulgar manner, but it wasn't something I cared ", " ignore."], answers: ["to"], explanations: ["Care to do something means to be willing or wish to do it."] },
  { parts: ["6. Since his retirement, Crowe has differed ", " the President ", " several issues."], answers: ["from", "on"], explanations: ["Differ from somebody identifies the person whose view is different.", "On introduces the issue being discussed."] },
  { parts: ["7. “Mary,” said the father of the newborn baby, gently, “it is surprising how you and I disagree ", " the name of our child.”"], answers: ["on"], explanations: ["Disagree on introduces the topic or decision in dispute."] },
  { parts: ["8. I am pushing on hopelessly along the way with no sidewalk, no lamppost to lean on, no café at the corner, and no one to call ", " for help."], answers: ["on"], explanations: ["Call on somebody means to ask that person for help."] },
  { parts: ["9. Days rolled by, and life's activity went ", ", but her love did not return."], answers: ["on"], explanations: ["Go on means to continue."] },
];
const prepositionTranslations = [
  "高中时，我在语文、数学、英语、物理和化学各科都同样努力；但上大学后，我决定专注于自己喜欢的科目。",
  "戴维费力读完这部长剧后，马上开始研究把它演出来的方法。",
  "苏珊和阿尔弗雷德是谁？他们彼此是什么关系？我又看了看邀请函的首页。",
  "我们发现的这些信件使这位已故作家的最后一本书原本打算怎样结尾变得更清楚。",
  "妻子说车祸不是我们造成的，并尽量不理会那人的粗俗态度，但我不愿对此置之不理。",
  "退休后，克罗在几个问题上与总统意见不同。",
  "新生儿的父亲温柔地说，玛丽，真奇怪，我们竟在孩子的名字上意见不一。",
  "我绝望地继续赶路，没有人行道、路灯或街角咖啡馆，也没有可以求助的人。",
  "日子一天天过去，生活仍在继续，但她的爱没有回来。",
];

const prepositionExercises: Exercise[] = prepositionItems.map((item, index) => ({
  title: `Prepositions · ${String(index + 1).padStart(2, "0")}/09`,
  instruction: "Complete the following sentences with appropriate prepositions.",
  prompt: <InlineClozeQuestion parts={item.parts} answers={item.answers} explanations={item.explanations} translation={prepositionTranslations[index]} />,
  answer: null,
  selfManagedAnswers: true,
}));

const articleExercises: Exercise[] = [{
  title: "Articles",
  instruction: "Fill in the blanks with appropriate articles where necessary.",
  prompt: <InlineClozeQuestion
    parts={["It is possible to get an education at a university. Lincoln Steffens learned (1) ", " history in (2) ", " college. However, he found that he disagreed with (3) ", " some previous authorities on (4) ", " many facts. With (5) ", " help of Mr. Scott Smith, (6) ", " librarian, he searched (7) ", " bookshelves of (8) ", " college library, and figured out (9) ", " his own perspective on (10) ", " American constitutional history. After this, he dreamed for (11) ", " while of writing (12) ", " book about his ideas but soon gave up because someone else had written (13) ", " similar book. Even so, he found (14) ", " research process fun and productive."]}
    answers={["—", "—", "—", "—", "the", "the", "the", "the", "—", "—", "a", "a", "a", "the"]}
    explanations={["History is an uncountable subject name here, so no article is used.", "College is used without an article when referring to its institutional purpose.", "Some is already a determiner, so no article is used before it.", "Many already determines the plural noun facts.", "The fixed expression is with the help of.", "The context refers to the specific librarian, Mr. Scott Smith.", "The phrase of the college library makes bookshelves specific.", "The context refers to a particular college library.", "A possessive determiner such as his does not take an article.", "The name of the course subject is used without an article here.", "The fixed time expression is for a while.", "Book is a nonspecific singular countable noun here.", "Similar book is singular, countable, and nonspecific.", "The phrase refers to the specific research process already described."]}
    translation="大学里可以接受教育。斯蒂芬斯在大学学习历史，却发现自己在许多事实上与前人观点不同。在图书管理员斯科特·史密斯先生的帮助下，他查阅大学图书馆的书架，形成了自己对美国宪法史的看法。他一度梦想写书，后来发现已有类似著作而放弃，但仍觉得研究过程有趣而富有成果。"
  />,
  answer: null,
  selfManagedAnswers: true,
}];

const modifierItems = [
  { prompt: "The following personal experience I have to offer illustrates it.", answer: "MN" },
  { prompt: "I proposed in my junior and senior years to specialize in history, taking all the courses required and those also that I had failed.", answer: "MV" },
  { prompt: "Turning to the other authorities, I saw that they disagreed on the same facts and also on others.", answer: "MV" },
  { prompt: "As I went on from chapter to chapter, day after day, finding frequently essential differences of opinion and of fact, I saw more and more work to do.", answer: "MV" },
  { prompt: "Vanity wasn’t my ruling passion then.", answer: "MN" },
];

const modifierTranslations = ["MN：following 修饰名词 personal experience。", "MV：taking 修饰动词 proposed，说明伴随动作。", "MV：Turning 修饰 saw，说明先后或伴随动作。", "MV：finding 修饰 went on，说明伴随动作。", "MN：ruling 修饰名词 passion。"];
const modifierExercises: Exercise[] = modifierItems.map((item, index) => ({ title: `Present participle · ${String(index + 1).padStart(2, "0")}/05`, instruction: "Label each of the following -ing structures as an MN (to modify a noun) or an MV (to modify a verb).", prompt: <blockquote className="quiz-question-card">{item.prompt}</blockquote>, answer: <p>{item.answer}</p>, answerTranslation: modifierTranslations[index], inlineAnswer: true }));

const combineItems = [
  ["A big bird flew over. A bird flapped its wings.", <>A big bird flew over, <mark><strong>flapping</strong></mark> its wings.</>],
  ["He finally mounted the huge black horse. He was panting and his mouth was gaping.", <>He finally mounted the huge black horse, <mark><strong>panting</strong></mark> with his mouth gaping.</>],
  ["She has lived for nearly a century. She has experienced almost all the tragedies one can imagine.", <>She has lived for nearly a century, <mark><strong>having experienced</strong></mark> almost all the tragedies one can imagine.</>],
  ["The professor was seated at one of the tables. The professor was studying his menu.", <>The professor was seated at one of the tables, <mark><strong>studying</strong></mark> his menu.</>],
  ["To ride a bike to school is an eco-friendly habit. To ride a bike to school reduces air pollution on campus.", <>To ride a bike to school is an eco-friendly habit, <mark><strong>reducing</strong></mark> air pollution on campus.</>],
  ["“Are you English?” she asked curiously. She smiled politely.", <>“Are you English?” she asked curiously, <mark><strong>smiling</strong></mark> politely.</>],
] as const;

const combineTranslations = ["一只大鸟飞过，拍打着翅膀。", "他终于骑上那匹高大的黑马，喘着气，嘴巴张着。", "她活了将近一个世纪，几乎经历了人们能够想象的一切悲剧。", "教授坐在一张桌子旁，正在研究菜单。", "骑自行车上学是一种环保习惯，可以减少校园空气污染。", "“你是英国人吗？”她好奇地问道，礼貌地微笑着。"];
const combineExercises: Exercise[] = combineItems.map(([prompt, answer], index) => ({ title: `Combine with -ing · ${String(index + 1).padStart(2, "0")}/06`, instruction: "Combine the two sentences in each group, using a present participle.", prompt: <blockquote className="quiz-question-card">{prompt}</blockquote>, answer: <p>{answer}</p>, answerTranslation: combineTranslations[index], inlineAnswer: true }));

const translationPrompts = [
  "…the fact that a proportion, however small, of college students do get a start in interested, methodical study, proves my thesis, and the following personal experience I have to offer illustrates it and shows how to get around the faculty, the other students, and the whole college system of mind-fixing. (Para. 1)",
  "Blessed as I was with a “bad memory,” I could not commit to it anything that I did not understand and intellectually need. (Para. 2)",
  "But I had discovered in my readings of literature, philosophy, and political economy that history had light to throw upon unhistorical questions. (Para. 2)",
  "They only deepened the mystery, clearing up the historical question, but leaving the answer to be dug for and written. (Para. 3)",
  "In this course, American constitutional history, I hunted far enough to suspect that the Fathers of the Republic who wrote our sacred Constitution of the United States not only did not, but did not want to, establish a democratic government… (Para. 4)",
  "What I had was a quickening sense that I was learning a method of studying history and that every chapter of it, from the beginning of the world to the end, is crying out to be rewritten. (Para. 5)",
];
const translationAnswers = [
  "在大学里能够获得真正的教育。虽然不是经常如此，但的确有一部分大学生，即使比例很小，在大学里找到了自己的学术兴趣，并展开系统学习。这就证明了我的看法，大学的确是一个受教育的地方。下面我要讲的个人经历就是一个例证，而且可以告诉大家如何绕过教师、学生和大学教育系统，以避免思想僵化。",
  "好在我记性不好，记不住那些无法理解也并不需要的知识。",
  "我在阅读文学、哲学和政治经济学著作时发现，历史可以为许多非历史问题带来启发。",
  "这（些书）更加深了我的困惑，解释了许多历史性问题的同时，留下了更多问题有待挖掘与书写。",
  "在美国宪法史这门课上，我经过足够深入的探索，开始怀疑那些书写我们神圣的美国宪法的共和国缔造者们并没有，也不打算建立一个民主国家。",
  "我有一种强烈的感觉，感觉自己正在学习研究历史的方法。历史书上的一章一节，从天地之初到世界末日，无不呼喊着、渴望着被重新书写。",
];
const englishChineseExercises: Exercise[] = translationPrompts.map((prompt, index) => ({ title: `English → Chinese · ${String(index + 1).padStart(2, "0")}/06`, instruction: "Translate the following sentences into Chinese.", prompt: <blockquote className="quiz-question-card">{prompt}</blockquote>, answer: <p lang="zh-CN">{translationAnswers[index]}</p> }));

const exercises: Record<Section, Exercise[]> = {
  "Analytical Reading": [
    { group: 1, title: "Story outline", instruction: "Write down the correct order to complete the outline of the story.", prompt: <div className="quiz-question-card quiz-order-card"><p><strong>Main idea:</strong> Looking back to his college days, Lincoln Steffens suggests that one is only really able to learn when he/she is able to think critically.</p><InlineStoryOrder /><ol><li>A. Steffens took Professor Jones’ course on the history of American Constitution and read everything he could find on the subject.</li><li>B. By the end of the term, Steffens not only did well in Professor Jones’ class, but also increased his own understanding of history while developing his ability to think critically.</li><li>C. Through careful research in the library, Steffens found conflicting views on the history of American Constitution.</li><li>D. Steffens used to think history boring, but later developed his interest in the subject and planned to specialize in history in his junior and senior years.</li></ol></div>, answer: null, selfManagedAnswers: true },
    ...trueFalseExercises,
    ...closeReadingExercises,
  ],
  Pronunciation: [{ title: "Pronunciation video", instruction: "Read the 20 English vowel phonetic symbols fluently.", prompt: <section className="quiz-video-card"><video controls preload="metadata" aria-label="Article 01 pronunciation lesson"><source src="https://assets.negentropylearning.com.cn/media/article-01-pronunciation.mp4" type="video/mp4" />Your browser does not support video playback.</video></section>, answer: null, blankAnswerPage: true }],
  Vocabulary: [...rootExercises.map(item => ({ ...item, subgroup: "Word roots" })), ...prepositionExercises.map(item => ({ ...item, subgroup: "Prepositions" }))],
  "Grammar & discourse": [...articleExercises.map(item => ({ ...item, subgroup: "Articles" })), ...modifierExercises.map(item => ({ ...item, subgroup: "Present participles" })), ...combineExercises.map(item => ({ ...item, subgroup: "Combine with -ing" }))],
  Paraphrasing: paraphrasingExercises,
  Translation: [...englishChineseExercises, { title: "Chinese → English", instruction: "Translate the following passage, using the words and expressions in brackets.", prompt: <p lang="zh-CN" className="quiz-question-card">大学生活真棒！我学到的第一课就是不要轻易相信权威（authority）。面对不同（disagreeing）观点，需要阅读原始（original）资料，分析其本质（essential）差异，批判性地（critically）思考，形成自己的观点。此外，还可以经常找同学讨论，或者请（call on/appeal to）教授推荐相关的资料，使研究进一步深入（further/deepen）。这样的学习过程使我的观点更加坚实有力。</p>, answer: <p>College life is fantastic! The first lesson I learned in university is always feeling free to doubt authorities. To form my own opinion, I need to read original documents, analyze the essential differences between disagreeing opinions, and to think critically. To further my study, I could also discuss with classmates frequently, or call on the professors for related references. This learning process can make my points stronger and more solid.</p>, answerTranslation: "大学生活很精彩。大学里学到的第一课是敢于质疑权威；阅读原始材料，分析不同观点的本质差异，进行批判性思考，并通过同学讨论或请教授推荐资料来深化研究，最终使自己的观点更扎实有力。" }],
};



export const article01QuizCategories: QuizCategory[] = [
  { id: "analytical-reading", label: "Analytical Reading", color: "#c6d4c8", exercises: exercises["Analytical Reading"] },
  { id: "word-roots", label: "Word Roots", color: "#e4c4bc", exercises: rootExercises },
  { id: "paraphrasing", label: "Paraphrasing", color: "#ccd5de", exercises: paraphrasingExercises },
  { id: "prepositions", label: "Prepositions", color: "#d6cee1", exercises: prepositionExercises },
  { id: "articles", label: "Articles", color: "#e6d2bd", exercises: articleExercises },
  { id: "present-participle", label: "Present Participle", color: "#e6c5b1", exercises: [...modifierExercises, ...combineExercises] },
  { id: "translation", label: "Translation", color: "#cdc0b7", exercises: [...englishChineseExercises, exercises.Translation[6]] },
];
