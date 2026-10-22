"use client";
import { useRef, useState } from "react";
import { GrammarAnalysisReader } from "./GrammarAnalysisReader";
import { ConcordExercises } from "./ConcordExercises";
import pages from "./concordAnalysisPages.json";
import units from "./concordExerciseUnits.json";

export function ConcordDeeperAnalysis() {
  const [open, setOpen] = useState(false);
  const entry = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={entry} className="articles-analysis-entry" type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>Deeper Analysis <span aria-hidden="true">↗</span></button>
    {open && <GrammarAnalysisReader returnFocus={entry.current} onClose={() => setOpen(false)} pages={pages} category="Subject-Verb Concord" eyebrow="06 Subject-Verb Concord · Units 40–42" assetRoot="/concord-analysis" className="concord-reader" exercises={(selected, style) => units.map(unit => <ConcordExercises key={unit.unit} unit={unit} hidden={unit.unit !== selected} style={style} />)} />}
  </>;
}
