"use client";

import { Children, Fragment, cloneElement, isValidElement, useState, type ReactNode, type ReactElement } from "react";
import "./unit4-quiz-interactions.css";

type Answer = { answer: string; note?: string };

const vocabularyContext = [
  { sentence: <>Lions are called <strong>predators</strong> because they hunt other animals for food.</>, translation: "狮子被称为捕食者，因为它们捕猎其他动物作为食物。" },
  { sentence: <>His <strong>lucid</strong> lectures, along with his clearly presented explanations, made him a popular professor.</>, translation: "他讲课清晰易懂，解释也条理分明，因此成为一位受欢迎的教授。" },
  { sentence: <>The <strong>adverse</strong> effects of this drug, including dizziness, nausea, and headaches, have caused it to be withdrawn from the market.</>, translation: "这种药物会引起眩晕、恶心和头痛等不良反应，因此已被撤出市场。" },
  { sentence: <>The food was <strong>bland</strong>. In fact, everyone called it tasteless.</>, translation: "这道食物味道清淡；事实上，大家都说它淡而无味。" },
  { sentence: <>The mountain pass was a <strong>tortuous</strong> road, winding and twisting like a snake around the trees of the mountainside.</>, translation: "这条山口道路蜿蜒曲折，像蛇一样盘绕在山坡的树木之间。" },
];

export function Unit4VocabularyContext() {
  const [opened, setOpened] = useState<Record<number, boolean>>({});
  return <div className="u4-context-source"><ol>{vocabularyContext.map((row, index) => <li key={index}>
    <button type="button" className="u4-context-sentence" aria-expanded={!!opened[index]} onClick={() => setOpened(previous => ({ ...previous, [index]: !previous[index] }))}>
      <span>{row.sentence}</span>
      {opened[index] && <span className="u4-context-translation" lang="zh-CN">{row.translation}</span>}
    </button>
  </li>)}</ol></div>;
}

export function Unit4TrueFalse({ statement, verdict, explanation, translation }: { statement: ReactNode; verdict: "T" | "F"; explanation?: string; translation: string }) {
  const [open, setOpen] = useState(false);
  return <button type="button" className="quiz-question-card u4-click-answer-statement" aria-expanded={open} onClick={() => setOpen(value => !value)}>
    <span>{statement}</span>
    {open && <><span className="u4-inline-answer u4-statement-answer"> — <strong>{verdict}</strong>{explanation && <> <span className="u4-statement-explanation">(Tip: {explanation})</span></>}</span><span className="u4-answer-note" lang="zh-CN">{translation}</span></>}
  </button>;
}

export function Unit4FillBlanks({ content, answers, prefix }: { content: ReactNode; answers: Answer[]; prefix: string }) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  let blankIndex = 0;
  const replace = (node: ReactNode): ReactNode => Children.map(node, child => {
    if (typeof child === "string") return child.split(/(_{3,})/g).map((part, i) => {
      if (!/^_{3,}$/.test(part)) return <Fragment key={i}>{part}</Fragment>;
      const index = blankIndex++;
      const id = `${prefix}-${index + 1}`;
      const value = answers[index];
      if (!value) return part;
      const open = !!opened[id];
      return <button key={id} type="button" className="u4-inline-blank" data-u4-answer={id} aria-expanded={open} aria-label={open ? `${id}：答案 ${value.answer}，再次点击可收起` : `${id}：点击显示答案`} onClick={() => setOpened(prev => ({ ...prev, [id]: !prev[id] }))}>{open ? <span className="u4-inline-answer">{value.answer}</span> : <span aria-hidden="true">&nbsp;</span>}</button>;
    });
    if (!isValidElement<{ children?: ReactNode }>(child)) return child;
    const firstAnswer = blankIndex;
    const children = replace(child.props.children);
    const lastAnswer = blankIndex;
    // Old marked blanks included neighbouring nouns; only the answer location is interactive.
    if (child.type === "mark") return <Fragment key={child.key}>{children}</Fragment>;
    const notes = child.type === "li" ? answers.slice(firstAnswer, lastAnswer).map((value, offset) => {
      const index = firstAnswer + offset;
      return value.note && opened[`${prefix}-${index + 1}`] ? <span className="u4-answer-note" data-u4-note={`${prefix}-${index + 1}`} key={index} lang="zh-CN">{value.note}</span> : null;
    }) : null;
    return cloneElement(child as ReactElement<{ children?: ReactNode }>, {}, <>{children}{notes}</>);
  });
  return <div className="u4-inline-exercise">{replace(content)}</div>;
}

type ConcordSentence = { text: string; answer?: string; translation: string };

const concordSentences: ConcordSentence[] = [
  { text: "Can AI be smarter than a person?", translation: "人工智能能比人更聪明吗？" },
  { text: "Answering that question often (1) ______ (depend) on the definition of AI.", answer: "depends", translation: "回答这个问题往往取决于如何定义人工智能。" },
  { text: "But it might make more sense, instead, to focus on defining what we mean by “smart.”", translation: "不过，把重点放在界定我们所说的“聪明”究竟是什么，或许更有意义。" },
  { text: "In the 1950s, in terms of the categories of creative thought, the psychologist J. P. Guilford said there (2) ______ (be) convergent thinking and divergent thinking.", answer: "were", translation: "20世纪50年代，心理学家 J. P. 吉尔福德从创造性思维的分类角度提出，思维分为聚合思维和发散思维。" },
  { text: "Convergent thinking, which Guilford defined as the ability to answer questions correctly, (3) ______ (be) predominantly a display of memory and logic.", answer: "is", translation: "吉尔福德把聚合思维定义为正确回答问题的能力，它主要体现记忆力和逻辑能力。" },
  { text: "Divergent thinking, the ability to generate many potential answers from a single problem or question, (4) ______ (show) a flair for curiosity, an ability to think “outside the box.”", answer: "shows", translation: "发散思维是从一个问题中产生许多可能答案的能力，它体现了好奇心以及跳出常规思考的能力。" },
  { text: "When most people think of AI’s relative strengths over humans, they think of its convergent intelligence.", translation: "大多数人想到人工智能相对于人类的优势时，想到的是它的聚合智能。" },
  { text: "With superior memory capacity and processing power, computers (5) ______ (outperform) people at rules-based games, complex calculations, and data storage.", answer: "outperform", translation: "凭借更强的记忆容量和处理能力，计算机在规则型游戏、复杂计算和数据存储方面胜过人类。" },
  { text: "What computers lack, some might say, (6) ______ (be) any form of imagination, or rule-breaking curiosity—that is, divergence.", answer: "is", translation: "有人或许会说，计算机缺少的是任何形式的想象力或打破规则的好奇心，也就是发散思维。" },
  { text: "But what if that common view is wrong?", translation: "但是，如果这种普遍看法是错误的呢？" },
  { text: "What if AI’s real comparative advantage over humans (7) ______ (be) precisely its divergent intelligence—its creative potential?", answer: "is", translation: "如果人工智能相对于人类的真正比较优势恰恰是它的发散智能，也就是它的创造潜力，那又会怎样呢？" },
];

function renderConcordSentence(row: ConcordSentence, answerOpen: boolean, onAnswer: () => void) {
  const parts = row.text.split("______");
  if (parts.length === 1) return row.text;
  return <>{parts[0]}<button type="button" className="u4-inline-blank" aria-expanded={answerOpen} onClick={event => { event.stopPropagation(); onAnswer(); }}>{answerOpen ? <span className="u4-inline-answer">{row.answer}</span> : <span aria-hidden="true">&nbsp;</span>}</button>{parts[1]}</>;
}

export function Unit4ConcordPassage() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [translations, setTranslations] = useState<Record<number, boolean>>({});
  return <div className="quiz-question-card u4-concord-passage">{concordSentences.map((row, index) => <div className="u4-concord-sentence" key={row.text} role="button" tabIndex={0} aria-expanded={!!translations[index]} onClick={() => setTranslations(previous => ({ ...previous, [index]: !previous[index] }))} onKeyDown={event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setTranslations(previous => ({ ...previous, [index]: !previous[index] }));
    }
  }}>
    <span className="u4-concord-copy">{renderConcordSentence(row, !!answers[index], () => {
      const next = !answers[index];
      setAnswers(previous => ({ ...previous, [index]: next }));
      setTranslations(previous => ({ ...previous, [index]: next }));
    })}</span>
    {translations[index] && <span className="u4-sentence-translation" lang="zh-CN">{row.translation}</span>}
  </div>)}</div>;
}

const outline = [
  { part: "I", paras: "1–2", answer: "The idea of taxing robots is spreading.", translation: "向机器人征税的设想正在传播并日益得到支持。" },
  { part: "II", paras: "3–4", answer: "By citing the example of textile factories, the author points out that robots, the same as other tools, make people lose jobs and the next generation learn new skills to stay relevant.", translation: "作者以纺织厂为例指出，机器人和其他工具一样会使一些人失业，同时促使下一代学习新技能以跟上时代。" },
  { part: "III", paras: "5–7", answer: "Automation has brought about some side effects and challenges.", translation: "自动化带来了一些副作用和挑战。" },
  { part: "IV", paras: "8–9", answer: "The author refutes Bill Gates’ argument that robots should be taxed and gives some solutions to lower taxes and robots replacing human workers.", translation: "作者反驳了盖茨关于向机器人征税的主张，并提出应对税收下降和机器人取代人类劳动的办法。" },
  { part: "V", paras: "10", answer: "The author concludes that automation, though painful, is inevitable.", translation: "作者总结说，自动化虽会带来痛苦，却不可避免。" },
];

export function Unit4ReadingOutline() {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  return <table className="u4-outline-table" aria-label="Reading outline: parts, paragraphs and main ideas">
    <colgroup><col className="u4-outline-part" /><col className="u4-outline-paras" /><col /></colgroup>
    <thead><tr><th scope="col">Part</th><th scope="col">Para(s).</th><th scope="col">Main idea</th></tr></thead>
    <tbody>{outline.map((row, index) => <tr key={row.part}>
      <th scope="row">{row.part}</th><td>{row.paras}</td><td>{index === 0 ? <>{row.answer}<span className="u4-answer-note" lang="zh-CN">{row.translation}</span></> : <button type="button" className="u4-outline-blank" data-u4-answer={`outline-${row.part}`} aria-expanded={!!opened[row.part]} aria-label={opened[row.part] ? `Part ${row.part}: answer visible` : `Part ${row.part}: reveal main idea`} onClick={() => setOpened(prev => ({ ...prev, [row.part]: !prev[row.part] }))}>{opened[row.part] ? <><span className="u4-inline-answer">{row.answer}</span><span className="u4-answer-note" lang="zh-CN">{row.translation}</span></> : <span className="u4-outline-line" aria-hidden="true">&nbsp;</span>}</button>}</td>
    </tr>)}</tbody>
  </table>;
}

const verbChoices: Array<{ sentence: string; answer: string; translation: string; explanation?: string }> = [
  { sentence: "The fact that she is still alive (consoles, console) me.", answer: "consoles", translation: "她仍然活着这一事实使我感到安慰。" },
  { sentence: "Whether he likes it or not (is, are) not our concern.", answer: "is", translation: "他是否喜欢并不是我们关心的事。" },
  { sentence: "There (is, are) a girl reading a book in the sun.", answer: "is", translation: "阳光下有一个女孩正在看书。" },
  { sentence: "There (is, are) things we cannot possess in the world.", answer: "are", translation: "世上有些东西是我们无法拥有的。" },
  { sentence: "There (is, are) a bird and three ducks in the yard.", answer: "is", translation: "院子里有一只鸟和三只鸭子。" },
  { sentence: "There are a lot of people who (has, have) lost their jobs.", answer: "have", translation: "有许多人已经失去了工作。" },
  {
    sentence: "Jane is one of those girls who (doesn’t, don’t) care much about looks.",
    answer: "doesn’t / don’t",
    translation: "简是那些不太在意外表的女孩之一；doesn’t 和 don’t 都可成立，正式语法通常更倾向 don’t。",
    explanation: "两个答案都可以。用 doesn’t 时，把 who 从句理解为说明 Jane（one）；用 don’t 时，who 的先行词按 those girls 理解，因此用复数。正式语法通常更倾向 don’t。",
  },
  { sentence: "Honesty is the only one of her qualities that (interests, interest) me.", answer: "interests", translation: "诚实是她所有品质中唯一使我感兴趣的一项。" },
];
export function Unit4VerbChoices() {
  const [opened, setOpened] = useState<Record<number, boolean>>({});
  return <ol className="u4-verb-choices">{verbChoices.map((row, index) => <li key={row.sentence}><span className="u4-choice-number" aria-hidden="true">{index + 1}.</span><button type="button" className="u4-choice-sentence" data-u4-answer={`concord-choice-${index + 1}`} aria-expanded={!!opened[index]} onClick={() => setOpened(prev => ({ ...prev, [index]: !prev[index] }))}>{row.sentence}{opened[index] && <><span className="u4-inline-answer u4-choice-answer"> — {row.answer}</span><span className="u4-answer-note" lang="zh-CN">{row.translation}</span>{row.explanation && <span className="u4-choice-explanation" lang="zh-CN">{row.explanation}</span>}</>}</button></li>)}</ol>;
}
