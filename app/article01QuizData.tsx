"use client";

import type { ReactNode } from "react";
import { ArticleOneRootExpansion } from "./ArticleOneRootExpansion";

type Section = "Analytical Reading" | "Pronunciation" | "Vocabulary" | "Grammar & discourse" | "Paraphrasing" | "Translation";
export type QuizExercise = Exercise;
export type QuizCategory = { id: string; label: string; color: string; exercises: QuizExercise[] };
type Exercise = { title: string; instruction?: string; prompt: ReactNode; answer: ReactNode; group?: 1 | 2 | 3; subgroup?: string; blankAnswerPage?: boolean; selfManagedAnswers?: boolean };

// Verbatim reference answers: Unit 1 teacher's book, PDF page 18, Vocabulary 1.
// Keep the textbook's wording (including "all the citizen"); do not replace it with etymology notes.
function RootReferenceAnswer({ entries }: { entries: { word: string; text: string }[] }) {
  return <div className="root-explanation">
    <p className="root-source">Teacher’s book · Unit 1 · p. 18 · Vocabulary 1</p>
    {entries.map(({ word, text }) => <p key={word}><strong>{word}:</strong> {text}</p>)}
    <ArticleOneRootExpansion word={entries[0].word} />
  </div>;
}

const rootInstruction = "Read the following sentences. Interpret the meaning of the words in bold in context with the help of word roots in brackets.";

const rootExercises: Exercise[] = [
  { title: "Root 01 · stinct", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>1. My method was hit on by accident and some <mark><strong>instinct</strong></mark>. <span>(stinct: to stick)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "instinct", "text": "a natural quality that makes people and animals tend to behave in a particular way using the knowledge and abilities that they were born with rather than thought or training. Interpreted from its word formation, it means to stick to one’s inner quality, not outside influence."}]} /> },
  { title: "Root 02 · scrib", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>2. With several courses <mark><strong>prescribed</strong></mark>, I concentrated on the one or two that interested me most and worked intensively on my favorites. <span>(scrib: to write)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "prescribe", "text": "to state officially what should be done in a particular situation. Interpreted from its word formation, it means to write beforehand a rule, etc."}]} /> },
  { title: "Root 03 · lect", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>3. Now I liked history; I had <mark><strong>neglected</strong></mark> it partly because I rebelled at the way it was taught, as positive knowledge unrelated to politics, art, life, or anything else. <span>(lect: to pick)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "neglect", "text": "to fail to look after someone or something properly. Interpreted from its word formation, it means not to look at something."}]} /> },
  { title: "Root 04 · peal", instruction: rootInstruction, prompt: <div className="root-lesson"><blockquote>4. The librarian, <mark><strong>appealed</strong></mark> to, helped me search the bookshelves till the library closed, and then I called on Professor Jones for more references. <span>(peal: to drive)</span></blockquote></div>, answer: <RootReferenceAnswer entries={[{"word": "appeal", "text": "to request, to ask for something urgently. Interpreted from its word formation, it means to be driven by an urgent need to do something."}]} /> },
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
  ["Lincoln Steffens learned ___ history.", "—", "Academic subjects are normally used without an article."],
  ["He learned history in ___ college.", "—", "College is used without an article when referring to its institutional purpose."],
  ["He disagreed with ___ some previous authorities.", "—", "Some is already a determiner; no article is used before it."],
  ["He disagreed with authorities on ___ many facts.", "—", "Many already determines the plural noun."],
  ["With ___ help of Mr. Scott Smith, he searched the library.", "the", "The fixed phrase is ‘with the help of’."],
  ["Mr. Scott Smith, ___ librarian, helped him.", "the", "The context refers to a specific librarian."],
  ["He searched ___ bookshelves of the college library.", "the", "The of-phrase makes the bookshelves specific."],
  ["He searched the bookshelves of ___ college library.", "the", "The context refers to a particular college library."],
  ["He figured out ___ his own perspective.", "—", "A possessive determiner does not take an article."],
  ["He formed his own perspective on ___ American constitutional history.", "—", "The name of the course subject is used without an article here."],
  ["He dreamed for ___ while of writing a book.", "a", "The fixed time expression is ‘for a while’."],
  ["He dreamed of writing ___ book about his ideas.", "a", "This is a nonspecific singular countable noun."],
  ["Someone else had written ___ similar book.", "a", "Similar book is singular, countable, and nonspecific."],
  ["He found ___ research process fun and productive.", "the", "The phrase refers to the specific research process described."],
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
  "They only deepened the mystery, clearing up the historical question, but leaving the answer to be dug for and written. (Para. 3)",
  "In this course, American constitutional history, I hunted far enough to suspect that the Fathers of the Republic who wrote our sacred Constitution of the United States not only did not, but did not want to, establish a democratic government.",
  "What I had was a quickening sense that I was learning a method of studying history. Every chapter of history, from the beginning of the earth to the end of the world, cried out to be rewritten.",
];
const translationAnswers = [
  "虽然比例很小，但的确有一部分大学生在大学里找到了自己的学术兴趣，并展开系统学习。这证明大学的确是一个受教育的地方。下面我要讲的个人经历就是一个例证，也说明如何绕过教师、其他学生和整个大学教育系统，以避免思想僵化。",
  "好在我记性不好，记不住那些我无法理解、在求知上也并不需要的知识。",
  "我在阅读文学、哲学和政治经济学著作时发现，历史可以为许多非历史问题带来启发。",
  "它们只是加深了这个谜团：厘清了那个历史问题，却留下答案有待发掘和写出。",
  "在美国宪法史这门课上，我经过足够深入的探索，开始怀疑那些书写我们神圣的美国宪法的共和国缔造者们并没有、也不打算建立一个民主国家。",
  "我有一种愈发强烈的感觉：自己正在学习研究历史的方法。历史书上的每一章，从世界之初到世界末日，都呼喊着、渴望着被重新书写。",
];
const englishChineseExercises: Exercise[] = translationPrompts.map((prompt, index) => ({ title: `English → Chinese · ${String(index + 1).padStart(2, "0")}/06`, instruction: "Translate into Chinese, then compare with the Chinese reference answer.", prompt: <blockquote className="quiz-question-card">{prompt}</blockquote>, answer: <p lang="zh-CN">{translationAnswers[index]}</p> }));

const exercises: Record<Section, Exercise[]> = {
  "Analytical Reading": [
    { group: 1, title: "Story outline", instruction: "Put the events in order, then check the model sequence.", prompt: <div className="quiz-question-card quiz-order-card"><p>Looking back to his college days, Lincoln Steffens suggests that one is only really able to learn when he/she is able to <mark>think critically</mark>.</p><ol><li>A. Steffens took Professor Jones’ course on the history of American Constitution and read everything he could find on the subject.</li><li>B. By the end of the term, Steffens not only did well in Professor Jones’ class, but also increased his own understanding of history while developing his ability to think critically.</li><li>C. Library research exposed conflicting accounts.</li><li>D. Steffens used to think history boring, but later developed his interest in the subject and planned to specialize in history in his junior and senior years.</li></ol></div>, answer: <p><strong>D → A → C → B.</strong><br />He first became interested, then pursued Jones’s course, discovered disagreement among authorities, and developed a method of independent inquiry.</p> },
    ...trueFalseExercises,
    ...closeReadingExercises,
  ],
  Pronunciation: [{ title: "Pronunciation video", instruction: "Read the 20 English vowel phonetic symbols fluently.", prompt: <section className="quiz-video-card"><video controls preload="metadata" aria-label="Article 01 pronunciation lesson"><source src="https://assets.negentropylearning.com.cn/media/article-01-pronunciation.mp4" type="video/mp4" />Your browser does not support video playback.</video></section>, answer: null, blankAnswerPage: true }],
  Vocabulary: [...rootExercises.map(item => ({ ...item, subgroup: "Word roots" })), ...prepositionExercises.map(item => ({ ...item, subgroup: "Prepositions" }))],
  "Grammar & discourse": [...articleExercises.map(item => ({ ...item, subgroup: "Articles" })), ...modifierExercises.map(item => ({ ...item, subgroup: "Present participles" })), ...combineExercises.map(item => ({ ...item, subgroup: "Combine with -ing" }))],
  Paraphrasing: paraphrasingExercises,
  Translation: [...englishChineseExercises, { title: "Chinese → English", instruction: "Translate this paragraph, then reveal the textbook model.", prompt: <p lang="zh-CN" className="quiz-question-card">大学生活真棒！我学到的第一课就是不要轻易相信权威（authority）。面对不同（disagreeing）观点，需要阅读原始（original）资料，分析其本质（essential）差异，批判性地（critically）思考，形成自己的观点。此外，还可以经常找同学讨论，或者请（call on/appeal to）教授推荐相关的资料，使研究进一步深入（further/deepen）。这样的学习过程使我的观点更加坚实有力。</p>, answer: <p>College life is fantastic! The first lesson I learned in university is always feeling free to doubt authorities. To form my own opinion, I need to read original documents, analyze the essential differences between disagreeing opinions, and to think critically. To further my study, I could also discuss with classmates frequently, or call on the professors for related references. This learning process can make my points stronger and more solid.</p> }],
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
