"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

type NoteKey = "think" | "reading" | "discuss" | "source";
type University = {
  id: string; name: string; image: string; imageAlt: string; mark?: string; markAlt?: string; evidence?: string; evidenceAlt?: string;
  motto: string; translation: string;
  label: "Direct translation" | "Official English wording" | "Teaching gloss — not an official English translation";
  think: string; reading: string; discuss: string; source: string;
};

const universities: University[] = [
  { id:"cambridge", name:"University of Cambridge", image:"/media/university-mottos-cambridge-campus.png", imageAlt:"Historic buildings of the University of Cambridge", mark:"/university-mottos-cambridge-seal.png", markAlt:"University of Cambridge seal", motto:"Hinc lucem et pocula sacra", translation:"From here, light and sacred draughts.", label:"Direct translation", think:"Why might knowledge be imagined as both light and something we drink?", reading:"One classroom reading is that light suggests understanding, while “sacred draughts” imagines learning as nourishment received from a scholarly community.", discuss:"Which image—light or nourishment—better describes your own experience of learning? Why?", source:"课程提供材料" },
  { id:"yale", name:"Yale University", image:"/media/university-mottos-yale-campus.png", imageAlt:"Yale University campus", mark:"/university-mottos-yale-crest.png", markAlt:"Yale University crest", motto:"Lux et Veritas", translation:"Light and Truth", label:"Direct translation", think:"What does “light” add to the idea of truth?", reading:"For learning purposes, light can be read as the process of discovery and understanding, while truth names the ideal being pursued.", discuss:"Can the search for truth ever be complete, or is it always an ongoing practice?", source:"课程提供材料" },
  { id:"harvard", name:"Harvard University", image:"/media/university-mottos-harvard-widener-user-v2.png", imageAlt:"Widener Memorial Library at Harvard University", mark:"/university-mottos-harvard-crest.png", markAlt:"Harvard Veritas shield", motto:"Veritas", translation:"Truth", label:"Direct translation", think:"How can a single word function as a university motto?", reading:"One classroom reading is that a single word leaves room for many academic practices—questioning, checking evidence, revising claims—to gather around one intellectual ideal.", discuss:"When truth and loyalty come into conflict, which should guide a university community?", source:"课程提供材料" },
  { id:"tsinghua", name:"Tsinghua University", image:"/media/university-mottos-tsinghua-campus.png", imageAlt:"Tsinghua University campus", mark:"/media/university-mottos-tsinghua-seal.png", markAlt:"Tsinghua University seal", motto:"自强不息 · 厚德载物", translation:"Self-discipline and Social Commitment", label:"Official English wording", think:"Why might self-development be placed beside responsibility for others?", reading:"One classroom reading is that education concerns both personal growth and the capacity to carry responsibilities within a wider community.", discuss:"What responsibility, if any, does a university graduate have beyond personal success?", source:"课程提供材料" },
  { id:"sysu", name:"Sun Yat-sen University", image:"/media/university-mottos-sysu-campus.png", imageAlt:"Sun Yat-sen University campus", evidence:"/university-mottos-sysu-motto-inscription.png", evidenceAlt:"Sun Yat-sen University motto inscription supplied with the course materials", motto:"博学 · 审问 · 慎思 · 明辨 · 笃行", translation:"Learn broadly · Question closely · Reflect carefully · Discern clearly · Practise earnestly", label:"Teaching gloss — not an official English translation", think:"Why does the sequence end with action rather than knowledge?", reading:"For learning purposes, the sequence can be read as a movement from gathering knowledge to questioning, reflection, judgment and finally responsible practice.", discuss:"Which step in this sequence is most often neglected in your own learning?", source:"课程提供材料" },
  { id:"hunan", name:"Hunan Normal University", image:"/media/university-mottos-hunan-campus-motto.png", imageAlt:"Hunan Normal University campus or motto image supplied with the course materials", evidence:"/university-mottos-hunan-motto-inscription.png", evidenceAlt:"Hunan Normal University motto inscription supplied with the course materials", motto:"仁 · 爱 · 精 · 勤", translation:"Humanity · Care · Rigor · Diligence", label:"Teaching gloss — not an official English translation", think:"What changes when care and humanity are placed beside rigor and diligence?", reading:"One classroom reading is that intellectual discipline and sustained effort need not be separated from care for other people.", discuss:"Can rigor become harmful without care? Can care remain effective without rigor?", source:"课程提供材料" },
  { id:"cwnu", name:"China West Normal University", image:"/media/university-mottos-cwnu-campus-user.png", imageAlt:"Entrance of China West Normal University supplied with the course materials", mark:"/media/university-mottos-cwnu-seal.png", markAlt:"China West Normal University seal", motto:"勤奋 · 求实 · 敬业 · 创新", translation:"Diligence · Truth-seeking · Dedication · Innovation", label:"Teaching gloss — not an official English translation", think:"How might these four words become visible in ordinary student life?", reading:"For learning purposes, the motto can be read as connecting sustained effort, attention to evidence, responsible commitment and the courage to find better ways forward.", discuss:"Choose one word from the motto. Describe one action that could make it visible in your study, work, or relationships.", source:"课程提供材料" },
];

export function UniversityMottos() {
  const [selected, setSelected] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [openNote, setOpenNote] = useState<NoteKey | null>(null);
  const [latinOpen, setLatinOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const university = universities[selected];

  const chooseUniversity = (index: number) => { setSelected(index); setFlipped(false); setOpenNote(null); setLatinOpen(false); };
  const turnCard = () => { setFlipped((value) => !value); setOpenNote(null); };
  const toggleNote = (note: NoteKey) => setOpenNote((current) => current === note ? null : note);

  return <section className="university-mottos archive-mottoes">
    <header className="archive-mottoes-header">
      <div><span>Reading Table</span><i aria-hidden="true"/><strong>University Mottoes</strong></div>
      <button className="archive-edit-entry" type="button" onClick={() => setEditing((value) => !value)} aria-pressed={editing}>{editing ? "退出编辑" : "编辑页面"}</button>
    </header>
    {editing && <div className="archive-edit-notice" role="status">视觉编辑入口已保留。退出编辑即可继续翻阅卡片。</div>}

    <div className="archive-introduction">
      <p className="archive-eyebrow">A SHORT INTRODUCTION</p>
      <h2>What is a university motto?</h2>
      <p>A university motto is a short phrase that can express a guiding ideal, value or educational aspiration. Not every university must have one, and a motto does not tell us everything about an institution.</p>
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
              <div className="archive-motto-block"><span>MOTTO</span><h3>{university.motto}</h3><p>{university.translation}</p><small>{university.label}</small>{university.evidence && <figure className="archive-motto-evidence" onClick={(event) => event.stopPropagation()}><img src={university.evidence} alt={university.evidenceAlt || "Motto inscription"}/><figcaption>Provided motto inscription</figcaption></figure>}</div>
              {openNote && <div className="archive-open-note" onClick={(event) => event.stopPropagation()}><b>{openNote === "reading" ? "READING NOTE" : openNote.toUpperCase()}</b><p>{university[openNote]}</p></div>}
              <p className="archive-back-hint">Click the empty paper area to turn back.</p>
            </div>
          </article>
        </div>
        <div className="archive-note-drawers" aria-label="Learning notes">
          {(["think","reading","discuss","source"] as NoteKey[]).map((note) => <button key={note} type="button" className={openNote === note ? "active" : ""} disabled={!flipped} onClick={() => toggleNote(note)}>{note === "reading" ? "READING NOTE" : note.toUpperCase()}</button>)}
        </div>
      </div>

      <aside className="archive-card-index" aria-label="University card index">
        <p>CARD INDEX</p>
        <ol>{universities.map((item,index) => <li key={item.id}>
          <button className={selected === index && !latinOpen ? "active" : ""} type="button" onClick={() => chooseUniversity(index)}><span>{String(index + 1).padStart(2,"0")}</span>{item.name}</button>
          {index === 2 && <button className={`archive-latin-entry ${latinOpen ? "active" : ""}`} type="button" onClick={() => { setLatinOpen(true); setFlipped(false); setOpenNote(null); }}>OPTIONAL ENTRY · WHY LATIN?</button>}
        </li>)}</ol>
        {latinOpen ? <section className="archive-latin-note"><b>WHY LATIN?</b><h4>Historical function</h4><p>Latin functioned for centuries as an international language of scholarship, religion, and administration across much of Europe.</p><h4>Classroom reading</h4><p>Latin can allow compact, memorable formulations. Contemporary readers may also experience it as formal or distant; this is a possible response, not a universal meaning.</p></section> : <div className="archive-index-guide"><b>{flipped ? "OPEN A NOTE" : "TURN THE CARD"}</b><p>{flipped ? "The question comes before its reading note. Discussion remains open." : "Use the image, crest and name as your first encounter."}</p></div>}
      </aside>
    </div>

    {selected === universities.length - 1 && flipped && <blockquote className="archive-final-reflection"><span>FINAL REFLECTION</span><p>Choose one word from the motto. Describe one action that could make it visible in your study, work, or relationships.</p></blockquote>}
  </section>;
}
