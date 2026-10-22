"use client";

import { useId, useState, type CSSProperties } from "react";
import "./unit44-exercises.css";

const words = ["unpaid bill", "DIY shop", "MP3 player", "Euro", "MiG fighter plane", "Olympic medal", "AGM", "U-turn", "heirloom", "NASA space launch", "UN decision", "SOS message", "F grade", "hero"];
const wordAnswers = ["an", "a", "an", "a", "a", "an", "an", "a", "an", "a", "a", "an", "an", "a"];
const corrections = [
  { before: "I usually go to the gym four times ", word: "one", after: " week.", answer: "a" },
  { before: "There’s more than one way to solve the problem." },
  { before: "I phoned the council to complain, but just got passed on from ", word: "a", after: " person to another.", answer: "one" },
  { before: "The rate of pay is really good here. You can earn over £20 ", word: "one", after: " hour.", answer: "an" },
  { before: "Maybe we could go skiing one winter." },
  { before: "The apples are 90 cents ", word: "one", after: " kilo.", answer: "a" },
  { before: "Are you hungry? Would you like ", word: "one", after: " piece of cake?", answer: "a", note: "‘one’ would imply ‘one and no more’; ‘a’ is more likely if this is a more general invitation to ‘have some cake’" },
  { before: "The rules say that there is only one vote per member.", note: "‘one’ implies ‘one and only one’" },
  { before: "You can get seven hours of recording on one disc.", note: "both ‘one’ and ‘a’ are possible" },
  { before: "A: What would Moritz like for his birthday?\nB: Why don’t you ask Leah? She’s ", word: "one", after: " good friend of his and will have some ideas.", answer: "a" },
  { before: "There’s ", word: "one", after: " pen on the floor. Is it yours?", answer: "a", note: "‘one’ would emphasise the number and seems less likely than ‘a’ in this context" },
  { before: "The library books are due back in one month.", note: "both ‘one’ and ‘a’ are possible" },
  { before: "Do you want some of my chips? There are too many here for ", word: "a", after: " person.", answer: "one" },
  { before: "I’m going to London for ", word: "one", after: " day or two.", answer: "a" },
  { before: "Either I’ll work late tonight or I’ll come in early tomorrow, but the report’s got to be finished by lunchtime ", word: "a", after: " way or another.", answer: "one" },
  { before: "It will take more than one morning to finish the decorating.", note: "both ‘one’ and ‘a’ are possible" },
];
const sentences = [
  ["If you wait ", " second I’ll get my coat and come too.", "one / a"],
  ["I want to see the river ", " last time before I leave.", "one"],
  ["The President is visiting the city ", " day in November.", "one"],
  ["It was announced that the plane would be approximately ", " hour late.", "one / an"],
  ["I could hear the sound of ", " helicopter in the distance.", "a"],
  ["I’d just like to say ", " thing before I go.", "one"],
  ["Misaki’s baby is ", " year old already.", "one / a"],
  ["Dinner should be ready in ", " hour or so.", "an"],
  ["Hugo came over ", " evening last week.", "one"],
  ["I’ve painted ", " wall already and I’ll do the other tomorrow.", "one"],
  ["I’d like to make ", " point here, Carlos, if I may.", "one / a"],
  ["", " large number of people had gathered in the square.", "A"],
];

export function Unit44Exercises({ hidden, style }: { hidden: boolean; style: CSSProperties }) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const prefix = useId();
  const toggle = (key: string) => setOpened(current => ({ ...current, [key]: !current[key] }));
  const blank = (key: string, answer: string, number: number, exercise: string) => <button type="button" className="u44-blank" data-answer-key={key} aria-expanded={!!opened[key]} aria-label={`${exercise}, item ${number}: ${opened[key] ? "hide" : "reveal"} answer`} onClick={() => toggle(key)}>{opened[key] ? <span className="u44-answer">{answer}</span> : <span aria-hidden="true">&nbsp;</span>}</button>;

  return <article id="unit44-exercises" hidden={hidden} style={style} className="u44-page" aria-labelledby={`${prefix}-title`}>
    <header className="u44-header"><h2 id={`${prefix}-title`}>Exercises</h2><div className="u44-unit">Unit<strong>44</strong></div></header>
    <section className="u44-section" aria-labelledby={`${prefix}-441`}>
      <h3 id={`${prefix}-441`}><span className="u44-badge">44.1</span><span>Write <b>a</b> or <b>an</b> in the spaces. <span className="u44-ref">A</span></span></h3>
      <ol className="u44-words">{words.map((word, i) => <li key={word}><span className="u44-number">{i + 1}</span><span>{blank(`44.1-${i + 1}`, wordAnswers[i], i + 1, "44.1")} {word}{i === 4 && opened['44.1-5'] && <span className="u44-note"> (‘MiG’ is said /mɪg/)</span>}</span></li>)}</ol>
    </section>
    <section className="u44-section" aria-labelledby={`${prefix}-442`}>
      <h3 id={`${prefix}-442`}><span className="u44-badge">44.2</span><span>If necessary, correct <b>a / an</b> or <b>one</b> in these sentences, or write <b>✓</b>. In which sentences are <b>a / an</b> and <b>one</b> both possible? <span className="u44-ref">B &amp; C</span></span></h3>
      <ol className="u44-corrections">{corrections.map((item, i) => { const key = `44.2-${i + 1}`; return <li key={key}><span className="u44-number">{i + 1}</span><button type="button" className="u44-sentence" data-answer-key={key} aria-expanded={!!opened[key]} onClick={() => toggle(key)}>
        <span>{item.before}{item.word && (opened[key] ? <><del>{item.word}</del>{" "}<ins className="u44-answer">{item.answer}</ins></> : item.word)}{item.after}</span>
        {opened[key] && <span className="u44-answer-detail">{!item.word && <strong className="u44-answer"> ✓</strong>}{item.note && <span className="u44-note"> ({item.note})</span>}</span>}
      </button></li>; })}</ol>
    </section>
    <section className="u44-section" aria-labelledby={`${prefix}-443`}>
      <h3 id={`${prefix}-443`}><span className="u44-badge">44.3</span><span>Which is more appropriate, <b>a / an</b> or <b>one</b>? If both <b>a / an</b> and <b>one</b> are possible, write them both. <span className="u44-ref">B &amp; C</span></span></h3>
      <ol>{sentences.map(([before, after, answer], i) => <li key={i}><span className="u44-number">{i + 1}</span><span>{before}{blank(`44.3-${i + 1}`, answer, i + 1, "44.3")}{after}</span></li>)}</ol>
    </section>
    <figure className="u44-crowd"><svg viewBox="100 1670 1260 250" role="img" aria-label="The original illustration of a large crowd gathered in the square"><image href="/articles-analysis/exercises-44.jpg" width="1482" height="2052" /></svg></figure>
    <footer className="u44-footer"><span>➜ Additional exercise 10 (page 246)</span><strong>89</strong></footer>
  </article>;
}
