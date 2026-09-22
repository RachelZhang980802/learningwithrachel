"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

type NoteKey = "think" | "reveal" | "culture";
type KnowledgeKey = "latin" | "classics";
type University = {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  mark?: string;
  markAlt?: string;
  evidence?: string;
  evidenceAlt?: string;
  motto: string;
  translation: string;
  label: "Direct translation" | "Official English wording" | "Teaching gloss — not an official English translation";
  think: string;
  reveal: string;
  culture?: string;
};

const universities: University[] = [
  {
    id: "cambridge",
    name: "University of Cambridge",
    image: "/media/university-mottos-cambridge-campus.png",
    imageAlt: "Historic buildings of the University of Cambridge",
    mark: "/media/university-mottos-cambridge-seal.png",
    markAlt: "University of Cambridge seal",
    motto: "Hinc lucem et pocula sacra",
    translation: "From here, light and sacred draughts.",
    label: "Direct translation",
    think: "Do you know what “draughts” means in this phrase?",
    reveal: "“Draughts” here means drinks, or something that is drunk. In this motto, “sacred draughts” metaphorically refers to knowledge and spiritual nourishment.",
    culture: "Interestingly, an old Cambridge emblem shows the Alma Mater holding a light in one hand and a cup in the other.",
  },
  {
    id: "yale",
    name: "Yale University",
    image: "/media/university-mottos-yale-campus.png",
    imageAlt: "Yale University campus",
    mark: "/media/university-mottos-yale-crest.png",
    markAlt: "Yale University crest",
    motto: "Lux et Veritas",
    translation: "Light and Truth",
    label: "Direct translation",
    think: "Was Yale always called “Yale”?",
    reveal: "No. It was founded in 1701 as the “Collegiate School” and was renamed Yale College in 1718.",
    culture: "Interestingly, “Yale” was actually a person’s name. The college was named after Elihu Yale, whose donation included 417 books and the proceeds from the sale of nine bales of goods.",
  },
  {
    id: "harvard",
    name: "Harvard University",
    image: "/media/university-mottos-harvard-widener-user-v2.png",
    imageAlt: "Widener Memorial Library at Harvard University",
    mark: "/media/university-mottos-harvard-crest.png",
    markAlt: "Harvard Veritas shield",
    motto: "Veritas",
    translation: "Truth",
    label: "Direct translation",
    think: "When Harvard first adopted “Veritas,” was “truth” closer to modern academic truth or religious truth?",
    reveal: "In early Harvard, “Veritas” had a strongly Christian meaning. Harvard was founded in a Puritan society, and religious education was central to its early mission.",
    culture: "Interestingly, Harvard later adopted explicitly Christian mottos, including “In Christi Gloriam” and “Christo et Ecclesiae.” The simple “Veritas” — “Truth” that we associate with Harvard today became dominant much later.",
  },
  {
    id: "tsinghua",
    name: "Tsinghua University",
    image: "/media/university-mottos-tsinghua-campus.png",
    imageAlt: "Tsinghua University campus",
    mark: "/media/university-mottos-tsinghua-seal.png",
    markAlt: "Tsinghua University seal",
    motto: "自强不息 · 厚德载物",
    translation: "Self-discipline and Social Commitment",
    label: "Official English wording",
    think: "Do you know where Tsinghua’s motto, “自强不息，厚德载物,” comes from?",
    reveal: "It comes from two lines in the ancient Chinese classic The Book of Changes (I Ching): 天行健，君子以自强不息；地势坤，君子以厚德载物。 As Heaven moves with strength and vigor, a gentleman should constantly strive for self-improvement; as Earth is receptive and all-embracing, a gentleman should cultivate great virtue and embrace all things.",
    culture: "Interestingly, the motto became closely associated with Tsinghua after Liang Qichao gave a speech titled “The Gentleman” (《君子》) at Tsinghua in 1914. He used these two lines to encourage students to develop both personal strength and moral responsibility.",
  },
  {
    id: "sysu",
    name: "Sun Yat-sen University",
    image: "/media/university-mottos-sysu-campus.png",
    imageAlt: "Sun Yat-sen University campus",
    evidence: "/media/university-mottos-sysu-motto-inscription.png",
    evidenceAlt: "Sun Yat-sen University motto inscription supplied with the course materials",
    motto: "博学 · 审问 · 慎思 · 明辨 · 笃行",
    translation: "Learn broadly · Question closely · Reflect carefully · Discern clearly · Practise earnestly",
    label: "Teaching gloss — not an official English translation",
    think: "Did Sun Yat-sen create the university motto himself?",
    reveal: "Not exactly. Sun Yat-sen personally wrote the ten-character motto — “博学、审问、慎思、明辨、笃行” — for the founding ceremony of National Guangdong University in 1924, but the words originally come from The Doctrine of the Mean (《中庸》): “博学之，审问之，慎思之，明辨之，笃行之。”",
    culture: "Interestingly, although Sun Yat-sen wrote these words in 1924, they were not formally designated as the university’s official motto until 1991. The five steps form a complete learning process: learn broadly → inquire carefully → reflect deeply → discern clearly → put learning into practice.",
  },
  {
    id: "hunan",
    name: "Hunan Normal University",
    image: "/media/university-mottos-hunan-campus-motto.png",
    imageAlt: "Hunan Normal University campus or motto image supplied with the course materials",
    evidence: "/media/university-mottos-hunan-motto-inscription.png",
    evidenceAlt: "Hunan Normal University motto inscription supplied with the course materials",
    motto: "仁 · 爱 · 精 · 勤",
    translation: "Humanity · Care · Rigor · Diligence",
    label: "Teaching gloss — not an official English translation",
    think: "Do you know what was special about the predecessor of Hunan Normal University?",
    reveal: "Its predecessor, the National Teachers College (国立师范学院), founded in 1938, was China’s first national teachers college established as an independent institution. It was founded during the War of Resistance against Japanese Aggression.",
    culture: "Interestingly, the famous writer Qian Zhongshu (钱钟书) taught there and served as the first head of its English Department, while his father, Qian Jibo (钱基博), headed the Chinese Department. Father and son taught at the same college.",
  },
  {
    id: "cwnu",
    name: "China West Normal University",
    image: "/media/university-mottos-cwnu-campus-user.png",
    imageAlt: "Entrance of China West Normal University supplied with the course materials",
    mark: "/media/university-mottos-cwnu-seal.png",
    markAlt: "China West Normal University seal",
    motto: "勤奋 · 求实 · 敬业 · 创新",
    translation: "Diligence · Truth-seeking · Dedication · Innovation",
    label: "Teaching gloss — not an official English translation",
    think: "1. Why does normal mean “师范” here rather than “普通的”?\n2. How should we translate our university motto, “勤奋、求实、敬业、创新,” into English?",
    reveal: "1. In normal school, normal comes from the French école normale: a ‘model school’ for standard teacher training. Hence normal means ‘师范,’ not ‘ordinary.’\n2. Teaching translation:\n勤奋 Diligence · 求实 Truth-seeking\n敬业 Dedication · 创新 Innovation\nTeaching gloss; no official English wording has been confirmed.",
    culture: "The university traces its roots to the Private North Sichuan College of Agriculture and Industry (私立川北农工学院), founded in Santai in 1946 on the former campus of National Northeastern University, with the involvement of its Sichuan-born faculty and students. The institution moved to Nanchong in 1950 and, after several subsequent reorganizations and name changes, was renamed China West Normal University in 2003.",
  },
];

export function UniversityMottos() {
  const [selected, setSelected] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [openNote, setOpenNote] = useState<NoteKey | null>(null);
  const [knowledgeOpen, setKnowledgeOpen] = useState<KnowledgeKey | null>(null);
  const [introductionOpen, setIntroductionOpen] = useState(false);
  const university = universities[selected];

  const chooseUniversity = (index: number) => {
    setSelected(index);
    setFlipped(false);
    setOpenNote(null);
    setKnowledgeOpen(null);
  };
  const turnCard = () => { setFlipped((value) => !value); setOpenNote(null); };
  const toggleNote = (note: NoteKey) => setOpenNote((current) => current === note ? null : note);
  const openKnowledge = (entry: KnowledgeKey) => { setKnowledgeOpen(entry); setFlipped(false); setOpenNote(null); };

  return <section className="university-mottos archive-mottoes">
    <header className="archive-mottoes-header">
      <div><span>Reading Table</span><i aria-hidden="true"/><strong>University Mottoes</strong></div>
    </header>

    <div className={`archive-introduction ${introductionOpen ? "is-open" : ""}`}>
      <p className="archive-eyebrow">A SHORT INTRODUCTION</p>
      <button className="archive-introduction-note" type="button" aria-expanded={introductionOpen} onClick={() => setIntroductionOpen((value) => !value)}>
        <span>What is a university motto?</span><b>{introductionOpen ? "CLOSE" : "OPEN NOTE"}</b>
      </button>
      {introductionOpen && <div className="archive-introduction-reading">
        <p><strong>Motto:</strong><br/>A motto is a short sentence or phrase that expresses a rule for sensible behavior, especially a way of behaving in a particular situation <cite>(Collins Cobuild Dictionary, 2001)</cite>.</p>
        <p><strong>University Motto:</strong><br/>The school motto serves as the emblem of an institution, embodying its enduring educational aspirations. Every school should have its own unique motto, one that reflects its distinctive character. The motto represents the soul of the institution, encapsulating its humanistic spirit and standing as the core expression of its cultural identity. Although concise, the motto&apos;s meaning is profound and substantial, often accompanying and influencing students throughout their lives <cite><a href="https://xsg.tsinghua.edu.cn/info/1005/1150.htm" target="_blank" rel="noreferrer">(Tian 2019) [OL]</a></cite>.</p>
      </div>}
    </div>

    <div className="archive-reading-table">
      <div className="archive-card-column">
        <div className={`archive-card-shell ${flipped ? "is-flipped" : ""}`}>
          <article className="archive-card" tabIndex={0} role="button" aria-label={`${flipped ? "Turn back" : "Turn over"}: ${university.name}`} aria-pressed={flipped} onClick={turnCard} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); turnCard(); } }}>
            <div className="archive-card-face archive-card-front">
              <div className="archive-card-title">{university.mark && <img src={university.mark} alt={university.markAlt || ""}/>}<h3>{university.name}</h3></div>
              <img className="archive-campus-image" src={university.image} alt={university.imageAlt}/>
              <p className="archive-turn-affordance"><b>CLICK TO TURN OVER</b><span>Enter or Space also turns the card</span></p>
            </div>
            <div className="archive-card-face archive-card-back">
              <p className="archive-card-number">CARD {String(selected + 1).padStart(2,"0")}</p>
              <p className="archive-back-name">{university.name}</p>
              <div className="archive-motto-block">
                <span>MOTTO</span><h3>{university.motto}</h3>
                {university.id === "cambridge" ? <p>From here, light and sacred <button className="archive-draughts" type="button" onClick={(event) => { event.stopPropagation(); setOpenNote("think"); }}>draughts</button>.</p> : university.id !== "cwnu" ? <p>{university.translation}</p> : null}
                {university.id !== "cwnu" && <small>{university.label}</small>}
                {!openNote && university.evidence && <figure className="archive-motto-evidence" onClick={(event) => event.stopPropagation()}><img src={university.evidence} alt={university.evidenceAlt || "Motto inscription"}/><figcaption>Provided motto inscription</figcaption></figure>}
              </div>
              {openNote && <div className="archive-open-note" onClick={(event) => event.stopPropagation()}><b>{openNote.toUpperCase()}</b><p>{university[openNote] || "This note is not supplied for this card."}</p></div>}
              <p className="archive-back-hint">Click the empty paper area to turn back.</p>
            </div>
          </article>
        </div>
        <div className="archive-note-drawers" aria-label="Learning notes">
          {(["think","reveal","culture"] as NoteKey[]).map((note) => <button key={note} type="button" className={openNote === note ? "active" : ""} disabled={!flipped || (note === "culture" && !university.culture)} onClick={() => toggleNote(note)}>{note.toUpperCase()}</button>)}
        </div>
      </div>

      <aside className="archive-card-index" aria-label="University card index">
        <p>CARD INDEX</p>
        <ol>{universities.map((item,index) => <li key={item.id}>
          <button className={selected === index && !knowledgeOpen ? "active" : ""} type="button" onClick={() => chooseUniversity(index)}><span>{String(index + 1).padStart(2,"0")}</span>{item.name}</button>
          {index === 2 && <button className={`archive-knowledge-entry ${knowledgeOpen === "latin" ? "active" : ""}`} type="button" onClick={() => openKnowledge("latin")}>OPTIONAL ENTRY · WHY LATIN?</button>}
          {index === 4 && <button className={`archive-knowledge-entry ${knowledgeOpen === "classics" ? "active" : ""}`} type="button" onClick={() => openKnowledge("classics")}>KNOWLEDGE ENTRY · CHINESE CLASSICS</button>}
        </li>)}</ol>
        {knowledgeOpen === "latin" ? <LatinNote/> : knowledgeOpen === "classics" ? <ChineseClassicsNote/> : selected === universities.length - 1 && flipped && !openNote ? <blockquote className="archive-index-guide archive-final-reflection-inline"><b>FINAL REFLECTION</b><p>Choose one word from the motto. Describe one action that could make it visible in your study, work, or relationships.</p></blockquote> : <div className="archive-index-guide"><b>{flipped ? "OPEN A NOTE" : "TURN THE CARD"}</b><p>{flipped ? "Begin with THINK, then reveal the answer and open the cultural note." : "Use the image, crest and name as your first encounter."}</p></div>}
      </aside>
    </div>
  </section>;
}

function LatinNote() {
  return <section className="archive-knowledge-note">
    <b>WHY LATIN?</b>
    <h4>1. A common language of learning</h4><p>Latin was a major common language of education and scholarship in medieval and early modern Europe. Scholars from different regions could use it to study, teach, and communicate.</p>
    <h4>2. A university tradition</h4><p>Because early European universities developed within this Latin-speaking academic culture, Latin naturally became associated with mottos, seals, degrees, and ceremonies.</p>
    <h4>3. A symbol of tradition today</h4><p>Over time, Latin came to symbolize history, scholarship, authority, and prestige, even after it stopped being the everyday language of university teaching.</p>
  </section>;
}

function ChineseClassicsNote() {
  return <section className="archive-knowledge-note archive-classics-note">
    <b>CHINESE CLASSICS · 四书五经</b>
    <p className="archive-knowledge-lead">Two mottoes in this collection connect directly with China&apos;s classical learning tradition.</p>
    <h4>The Four Books · 四书</h4><p><em>The Great Learning</em>《大学》 · <em>The Doctrine of the Mean</em>《中庸》 · <em>The Analects</em>《论语》 · <em>Mencius</em>《孟子》</p>
    <h4>The Five Classics · 五经</h4><p><em>The Book of Songs</em>《诗经》 · <em>The Book of Documents</em>《尚书》 · <em>The Book of Rites</em>《礼记》 · <em>The Book of Changes</em>《周易》 · <em>The Spring and Autumn Annals</em>《春秋》</p>
    <p className="archive-knowledge-link"><strong>Tsinghua:</strong> “自强不息，厚德载物” draws on <em>The Book of Changes</em>.<br/><strong>Sun Yat-sen University:</strong> “博学、审问、慎思、明辨、笃行” comes from <em>The Doctrine of the Mean</em>.</p>
  </section>;
}
