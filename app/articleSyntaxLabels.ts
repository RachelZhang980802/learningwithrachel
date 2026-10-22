export const clauseLabels = {
  relative: "Relative clause", object: "Object clause", predicative: "Predicative clause",
  appositive: "Appositive clause", condition: "Conditional clause", time: "Time clause",
  reason: "Reason clause", purpose: "Purpose clause",
} as const;
export type ClauseKind = keyof typeof clauseLabels;
export const clauseChinese: Record<ClauseKind, string> = {
  relative: "定语从句", object: "宾语从句", predicative: "表语从句", appositive: "同位语从句",
  condition: "条件状语从句", time: "时间状语从句", reason: "原因状语从句", purpose: "目的状语从句",
};

/** Shared Text / Structure palette; preserve the confirmed note colors. */
export const syntaxColors = {
  main: "#ff2500", sub: "#feb72e", relative: "#e9a300", object: "#f3484e",
  predicative: "#00cb00", appositive: "#1515ee", condition: "#45abe5", time: "#68ab00",
  reason: "#ed00ed", purpose: "#ed00ed", parenthetical: "#3bbe0f", neutral: "#746958",
} as const;
