import { rootLessons } from "./article01RootLessons";

const rootsByWord: Record<string, string[]> = {
  instinct: ["stinct"], prescribe: ["scrib"], neglect: ["lect"], appeal: ["peal"],
  suspect: ["spect", "demo"], promise: ["mis"], except: ["cept"],
};

export function ArticleOneRootExpansion({ word }: { word: string }) {
  const lessons = (rootsByWord[word] ?? []).map(key => rootLessons[key]);
  if (!lessons.length) return null;
  return <div className="root-expansion" data-editable-skip="true">
    {lessons.map(lesson => <section className="root-expansion-family" key={lesson.root}>
        <h3>{lesson.root}<span>Word-root meaning</span></h3>
        <p className="root-expansion-meaning">{lesson.meaning}</p>
        <p className="root-expansion-formation">{lesson.formation}</p>
        <p className="root-expansion-context"><strong>In this sentence:</strong> {lesson.context}</p>
        <h4>Clear examples</h4>
        <ol className="root-expansion-words">
          {lesson.examples.map(item => <li key={item.word}>
            <strong lang="en">{item.word}</strong><span>{item.parts} → {item.sense}</span>
          </li>)}
        </ol>
        {lesson.note && <p className="root-expansion-note">{lesson.note}</p>}
      </section>)}
  </div>;
}
