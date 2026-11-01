"use client";

import { Fragment, useState } from "react";
import "./unit45-quiz-interactions.css";

export function UnitQuizMultiBlank({ parts, answers, translation, wordBank }: { parts: string[]; answers: string[]; translation: string; wordBank?: string }) {
  const [opened, setOpened] = useState<Record<number, boolean>>({});
  return <blockquote className="quiz-question-card u45-multi-blank">
    {wordBank && <p className="u45-word-bank">{wordBank}</p>}
    <span>{parts.map((part, index) => <Fragment key={index}>{part}{answers[index] && <button type="button" className="u45-inline-blank" aria-expanded={!!opened[index]} onClick={() => setOpened(previous => ({ ...previous, [index]: !previous[index] }))}>{opened[index] ? <span className="u45-inline-answer">{answers[index]}</span> : <span aria-hidden="true">&nbsp;</span>}</button>}</Fragment>)}</span>
    {Object.values(opened).some(Boolean) && <span className="u45-chinese-note" lang="zh-CN">{translation}</span>}
  </blockquote>;
}

const outlineRows = [
  { part: "I", paras: "1-2", idea: "As usual, James Saxon travels by train in his corner seat.", translation: "和往常一样，詹姆斯·萨克森坐在火车角落的座位上出行。" },
  { part: "II", paras: "3-7", idea: "Matti observes James and assumes that he is a typical Englishman.", translation: "马蒂观察詹姆斯，并断定他是典型的英国人。" },
  { part: "III", paras: "8-13", idea: "What Matti learns about James is far from what he has imagined.", translation: "马蒂后来了解到的詹姆斯与他的想象相去甚远。" },
];

export function Unit7TextOutline() {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  return <div className="quiz-question-card"><table className="u45-outline-table"><thead><tr><th>Part</th><th>Para(s).</th><th>Main idea</th></tr></thead><tbody>{outlineRows.map((row, index) => <tr key={row.part}><th>{row.part}</th><td>{index === 0 ? row.paras : <button type="button" className="u45-table-blank" aria-expanded={!!opened[`${row.part}-paras`]} onClick={() => setOpened(previous => ({ ...previous, [`${row.part}-paras`]: !previous[`${row.part}-paras`] }))}>{opened[`${row.part}-paras`] ? <span className="u45-inline-answer">{row.paras}</span> : <span aria-hidden="true">&nbsp;</span>}</button>}</td><td>{index === 0 ? row.idea : <><button type="button" className="u45-table-blank u45-table-idea" aria-expanded={!!opened[`${row.part}-idea`]} onClick={() => setOpened(previous => ({ ...previous, [`${row.part}-idea`]: !previous[`${row.part}-idea`] }))}>{opened[`${row.part}-idea`] ? <span className="u45-inline-answer">{row.idea}</span> : <span aria-hidden="true">&nbsp;</span>}</button>{opened[`${row.part}-idea`] && <span className="u45-chinese-note" lang="zh-CN">{row.translation}</span>}</>}</td></tr>)}</tbody></table></div>;
}

type PassageRow = { parts: string[]; answers?: string[]; translation: string; paragraph?: boolean };

const unit7Story: PassageRow[] = [
  { parts: ["1. Joshua must be old but nobody ever (1) ", " (think) of what his age might be."], answers: ["thinks"], translation: "约书亚一定年纪很大了，但从来没有人想过他究竟多大。" },
  { parts: ["He (2) ", " (be) so very much alive."], answers: ["is"], translation: "他总是那么充满活力。" },
  { parts: ["He (3) ", " (go) to the city every day and (4) ", " (come) back early every afternoon."], answers: ["goes", "comes"], translation: "他每天进城，每天下午很早就回来。" },
  { parts: ["As he so seldom (5) ", " (talk) about himself, nobody (6) ", " (know) exactly what he (7) ", " (do) except that it (8) ", " (have) to do with books and small print."], answers: ["talks", "knows", "does", "has"], translation: "由于他很少谈论自己，谁也不确切知道他做什么，只知道这份工作与书籍和小字印刷有关。" },
  { parts: ["2. It (9) ", " (be) a bright summer day in 1947."], answers: ["is"], translation: "那是1947年一个阳光明媚的夏日。", paragraph: true },
  { parts: ["My father, a fat, funny man with beautiful eyes, is trying to decide which of his eight children he will take with him to the county fair."], translation: "我的父亲身材胖胖、风趣幽默，长着一双漂亮的眼睛；他正考虑要带八个孩子中的哪一个去县里的集市。" },
  { parts: ["My mother, of course, will not go."], translation: "母亲当然不会去。" },
  { parts: ["She (10) ", " (knock out) from getting most of us ready:"], answers: ["is knocked out"], translation: "为了给我们大多数人做好准备，她已经累坏了。" },
  { parts: ["I (11) ", " (hold) my neck stiff against the pressure of her fingers as she hastily (12) ", " (complete) the braiding of my hair…"], answers: ["hold", "completes"], translation: "她匆忙给我编完辫子时，我挺直脖子抵住她手指的压力……" },
];

function InteractivePassage({ rows }: { rows: PassageRow[] }) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [translations, setTranslations] = useState<Record<number, boolean>>({});
  return <div className="quiz-question-card u45-passage">{rows.map((row, rowIndex) => <div key={row.parts.join("_")} className={`u45-passage-row${row.paragraph ? " starts-paragraph" : ""}`} role="button" tabIndex={0} aria-expanded={!!translations[rowIndex]} onClick={() => setTranslations(previous => ({ ...previous, [rowIndex]: !previous[rowIndex] }))} onKeyDown={event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setTranslations(previous => ({ ...previous, [rowIndex]: !previous[rowIndex] }));
    }
  }}><span>{row.parts.map((part, answerIndex) => <Fragment key={answerIndex}>{part}{row.answers?.[answerIndex] && <button type="button" className="u45-inline-blank" aria-expanded={!!answers[`${rowIndex}-${answerIndex}`]} onClick={event => {
    event.stopPropagation();
    const key = `${rowIndex}-${answerIndex}`;
    const next = !answers[key];
    const anotherOpen = Object.entries(answers).some(([candidate, value]) => candidate.startsWith(`${rowIndex}-`) && candidate !== key && value);
    setAnswers(previous => ({ ...previous, [key]: next }));
    setTranslations(previous => ({ ...previous, [rowIndex]: next || anotherOpen }));
  }}>{answers[`${rowIndex}-${answerIndex}`] ? <span className="u45-inline-answer">{row.answers[answerIndex]}</span> : <span aria-hidden="true">&nbsp;</span>}</button>}</Fragment>)}</span>{translations[rowIndex] && <span className="u45-chinese-note" lang="zh-CN">{row.translation}</span>}</div>)}</div>;
}

export function Unit7PresentStory() { return <InteractivePassage rows={unit7Story} />; }

const attitudeRows = [
  { parts: ["A. When Chie was told that somebody visited on that rainy night, she ", "."], answers: ["was surprised and a bit annoyed"], translation: "知惠得知那个雨夜有人来访时，既惊讶又有些恼火。" },
  { parts: ["B. When Chie saw Akira at the entry, she felt ", "."], answers: ["herself starting to like him"], translation: "知惠在门口见到明时，觉得自己开始喜欢上他了。" },
  { parts: ["C. When Akira told Chie that he had received word of a position in America, Chie ", "."], answers: ["congratulated him, but was filled with maternal amusement"], translation: "明告诉知惠自己收到了美国职位的消息时，知惠向他道贺，却又觉得他像个孩子，感到一种母亲般的好笑。" },
  { parts: ["D. After Akira expressed his determination to ask for Naomi’s hand, Chie felt ", "."], answers: ["his “ambition” of marrying the Fuji heir an impossible goal"], translation: "明表明一定要向直美求婚后，知惠认为他迎娶富士家继承人的“雄心”根本不可能实现。" },
];

export function Unit9Attitudes() { return <div className="u45-question-stack">{attitudeRows.map(row => <UnitQuizMultiBlank key={row.parts[0]} {...row} />)}</div>; }

const loanwordRows = [
  { label: "food", answer: "cuisine, spaghetti, hamburger, tofu, fry", translation: "食物类：cuisine 菜肴，spaghetti 意大利面，hamburger 汉堡，tofu 豆腐，fry 油炸食品。" },
  { label: "politics", answer: "coup, guerrilla, embargo, parade, majesty", translation: "政治类：coup 政变，guerrilla 游击队员，embargo 禁运，parade 游行或阅兵，majesty 君王或陛下。" },
  { label: "the arts", answer: "soprano, bonsai, easel, design, guitar", translation: "艺术类：soprano 女高音，bonsai 盆景，easel 画架，design 设计，guitar 吉他。" },
  { label: "animals", answer: "mosquito, cobra, mammoth, poodle, parasite", translation: "动物类：mosquito 蚊子，cobra 眼镜蛇，mammoth 猛犸象，poodle 贵宾犬，parasite 寄生虫。" },
];
const loanwordBank = "coup · cuisine · mosquito · guerrilla · spaghetti · embargo · hamburger · soprano · bonsai · cobra · mammoth · poodle · easel · majesty · design · tofu · parade · parasite · fry · guitar";

export function Unit9Loanwords() {
  const [opened, setOpened] = useState<Record<number, boolean>>({});
  return <div className="quiz-question-card u45-loanwords"><p className="u45-word-bank">{loanwordBank}</p>{loanwordRows.map((row, index) => <p key={row.label}><strong>{row.label}:</strong> <button type="button" className="u45-wide-blank" aria-expanded={!!opened[index]} onClick={() => setOpened(previous => ({ ...previous, [index]: !previous[index] }))}>{opened[index] ? <span className="u45-inline-answer">{row.answer}</span> : <span aria-hidden="true">&nbsp;</span>}</button>{opened[index] && <span className="u45-chinese-note" lang="zh-CN">{row.translation}</span>}</p>)}</div>;
}

const modalChoices = [
  { prompt: "1. Mrs. Brown has been working so hard that she (may, can) be ill at any time.", answer: "can", translation: "布朗太太一直工作得非常辛苦，随时都可能病倒。" },
  { prompt: "2. I didn’t hear the ring of the doorbell. I (can, must) have been asleep.", answer: "must", translation: "我没有听到门铃声，当时一定睡着了。" },
  { prompt: "3. A: When can I have my photos? I need them tomorrow morning. B: They (will, might) be ready by 12:00, I’m sure.", answer: "will", translation: "A：我什么时候能拿到照片？明早就需要。B：我确定十二点前会准备好。" },
  { prompt: "4. She was with me last Sunday night. She (can, must) not be the criminal.", answer: "can", translation: "上周日晚上她和我在一起，所以她不可能是罪犯。" },
  { prompt: "5. Sixth-graders (should, may) have no problem doing the multiplication test.", answer: "should", translation: "六年级学生做这套乘法测试应该没有问题。" },
  { prompt: "6. You (mustn’t, may not) enter a private house without permission.", answer: "mustn’t", translation: "未经允许，你不得进入私人住宅。" },
  { prompt: "7. I hate going out on such a cold morning, but I (have to, must) get up early for school.", answer: "have to", translation: "我讨厌在这么冷的早晨出门，但为了上学我不得不早起。" },
  { prompt: "8. She (will, would) have caught the first bus if she had left earlier.", answer: "would", translation: "如果她早点出发，本来就能赶上第一班公共汽车。" },
];

export function Unit9ModalChoices() {
  const [opened, setOpened] = useState<Record<number, boolean>>({});
  return <div className="quiz-question-card u45-sentence-list">{modalChoices.map((row, index) => <button type="button" key={row.prompt} aria-expanded={!!opened[index]} onClick={() => setOpened(previous => ({ ...previous, [index]: !previous[index] }))}><span>{row.prompt}</span>{opened[index] && <><strong className="u45-inline-answer"> — {row.answer}</strong><span className="u45-chinese-note" lang="zh-CN">{row.translation}</span></>}</button>)}</div>;
}

const modalDialogues = [
  { parts: ["1. Jane: ", " you like to play basketball with us? Cathy: Yes, I’d love to. But I’m afraid I have no time."], answers: ["Would"], translation: "简：你愿意和我们一起打篮球吗？凯茜：很愿意，但恐怕我没有时间。" },
  { parts: ["2. Coach: The basketball match starts at 7:30. All of you ", " arrive at 7:00. All players: Yes, sir!"], answers: ["must"], translation: "教练：篮球赛七点半开始，你们所有人必须七点到。全体队员：是，教练！" },
  { parts: ["3. Students: ", " we play basketball during the break? Teacher: Yes, you can."], answers: ["Could"], translation: "学生：我们课间可以打篮球吗？老师：可以。" },
  { parts: ["4. Peter: Philip, would you like to see a movie after class? Philip: I’d love to. But I ", " play basketball, otherwise the coach will kill me."], answers: ["have to"], translation: "彼得：菲利普，下课后想去看电影吗？菲利普：很想去，但我得打篮球，否则教练会杀了我。" },
  { parts: ["5. Son: Must I play basketball for a whole afternoon, dad? Father: No, you ", ". It’s hot outside."], answers: ["needn’t/don’t have to"], translation: "儿子：爸爸，我必须打一下午篮球吗？父亲：不必，外面很热。" },
];

export function Unit9ModalDialogues() { return <div className="u45-question-stack">{modalDialogues.map(row => <UnitQuizMultiBlank key={row.parts[0]} {...row} />)}</div>; }
