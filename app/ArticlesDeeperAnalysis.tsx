"use client";

import { useState, useRef } from "react";
import pages from "./articlesAnalysisPages.json";
import { Unit44Exercises } from "./Unit44Exercises";
import { ArticleGrammarExercises } from "./ArticleGrammarExercises";
import { articleGrammarExercises } from "./grammarExerciseUnits";
import "./articles-deeper-analysis.css";

import { GrammarAnalysisReader } from "./GrammarAnalysisReader";

export function ArticlesDeeperAnalysis() {
  const [open, setOpen] = useState(false);
  const entry = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={entry} className="articles-analysis-entry" type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>Deeper Analysis <span aria-hidden="true">↗</span></button>
    {open && <GrammarAnalysisReader returnFocus={entry.current} onClose={() => setOpen(false)} pages={pages} category="Articles" eyebrow="05 Articles · Units 44–47" assetRoot="/articles-analysis" exercises={(selected, style) => <>
      <Unit44Exercises hidden={selected !== 44} style={style} />
      {articleGrammarExercises.map(unit => <ArticleGrammarExercises key={unit.unit} unit={unit} hidden={selected !== unit.unit} style={style} />)}
    </>} />}
  </>;
}
