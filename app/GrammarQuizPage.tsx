"use client";

import Link from "next/link";
import { GrammarQuestionText } from "./GrammarExerciseText";
import { type GrammarArticle } from "./grammarStudyData";

export function GrammarQuizPage({ article }: { article: GrammarArticle }) {
  return <main className="grammar-study grammar-quiz-page">
    <header className="grammar-study-hero"><nav aria-label="Grammar quiz navigation"><Link href={`/grammar/${article.id}`}>← Deeper Analysis</Link><span>UNIT {article.unit} · TEXT {article.id}</span></nav><p className="grammar-study-eyebrow">COMPLETE PRACTICE · {article.title.toUpperCase()}</p><h1>Supplementary Quizzes</h1><p>Select an underlined blank to reveal its PDF answer and a brief note below it. Each answer opens independently.</p></header>
    <div className="grammar-quiz-content">{article.topics.map((topic) => <section id={topic.id} className="grammar-quiz-topic" key={topic.id}><div className="grammar-quiz-topic-header"><div><p>{topic.english}</p><h2>{topic.title}</h2></div><span>{topic.exercises.length} EXERCISES</span></div><p className="grammar-study-source">{topic.source}</p>
      <div className="grammar-quiz-grid">{topic.exercises.map((exercise) => <article className="grammar-exercise" key={exercise.id}><div className="grammar-exercise-heading"><span>{exercise.source === "supp" ? "SUPPLEMENTARY EXERCISES" : "GRAMMAR IN USE"}</span><h3>{exercise.label}</h3><p>PDF page {exercise.pages.map(page => page + (exercise.source === "supp" ? 5 : -11)).join(", ")}</p></div>
        <div className="grammar-exercise-question"><GrammarQuestionText exercise={exercise} /></div>
      </article>)}</div>
    </section>)}</div>
  </main>;
}
