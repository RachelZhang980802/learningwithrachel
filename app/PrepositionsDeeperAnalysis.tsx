"use client";
import { useState, useRef } from "react";
import { GrammarAnalysisReader } from "./GrammarAnalysisReader";
import { PrepositionExercises } from "./PrepositionExercises";
import pages from "./prepositionsAnalysisPages.json";
import units from "./prepositionExerciseUnits.json";
export function PrepositionsDeeperAnalysis() {
  const [open, setOpen] = useState(false);
  const entry = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={entry} className="articles-analysis-entry" type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>Deeper Analysis <span aria-hidden="true">↗</span></button>
    {open && <GrammarAnalysisReader returnFocus={entry.current} onClose={() => setOpen(false)} pages={pages} category="Prepositions" eyebrow="04 Prepositions · Units 88–94" assetRoot="/prepositions-analysis" className="prepositions-reader" exercises={(selected, style) => units.map(unit => <PrepositionExercises key={unit.unit} unit={unit} hidden={unit.unit !== selected} style={style} />)} />}
  </>;
}
