export type RootLesson = {
  root: string;
  meaning: string;
  formation: string;
  context: string;
  examples: { word: string; parts: string; sense: string }[];
  note?: string;
};

// Transparent examples for each root. Formations are learning aids,
// while the context line gives the meaning of the word in Steffens's sentence.
export const rootLessons: Record<string, RootLesson> = {
  stinct: {
    root: "stinct / stingu", meaning: "to stick or prick with a point; figuratively, to urge",
    formation: "in- [intensive] + stingu [to prick] → to impel from within → instinct",
    context: "Steffens found his method partly by intuition, without first planning every step.",
    examples: [
      { word: "instinct", parts: "in- [intensive] + stingu [prick or urge]", sense: "an inborn impulse · 本能；直觉" },
      { word: "instinctive", parts: "instinct + -ive [having the quality of]", sense: "done without conscious planning · 本能的；不经思考的" },
    ],
    note: "Here ‘stick’ means ‘pierce with a point,’ as in ‘stick a finger with a pin’; it does not mean ‘attach with glue.’ The two examples above follow the meaning used in this sentence.",
  },
  scrib: {
    root: "scrib / script", meaning: "to write",
    formation: "pre- [before] + scrib [write] → write down instructions beforehand → prescribed",
    context: "The college had already set which courses students had to take.",
    examples: [
      { word: "prescribe", parts: "pre- [before] + scrib [write]", sense: "to lay down a rule in advance · 规定；开处方" },
      { word: "describe", parts: "de- [down] + scrib [write]", sense: "to put something into words · 描述" },
      { word: "subscribe", parts: "sub- [under] + scrib [write]", sense: "originally, to sign below; now, to sign up · 署名；订阅" },
      { word: "manuscript", parts: "manu- [by hand] + script [written]", sense: "a text written by hand or an author's draft · 手稿" },
      { word: "transcript", parts: "trans- [across] + script [written]", sense: "a written record of speech or results · 文字记录；成绩单" },
    ],
  },
  lect: {
    root: "lect / leg", meaning: "to pick, gather, or read",
    formation: "neg- [not] + lect [pick up] → fail to take notice of → neglected",
    context: "Steffens had given history too little attention because he disliked the way it was taught.",
    examples: [
      { word: "neglect", parts: "neg- [not] + lect [pick up]", sense: "to fail to give proper attention · 忽视" },
      { word: "select", parts: "se- [apart] + lect [pick]", sense: "to pick out from a group · 挑选" },
      { word: "collect", parts: "col- [together] + lect [gather]", sense: "to gather together · 收集" },
      { word: "elect", parts: "e- [out] + lect [pick]", sense: "to choose by voting · 选举" },
      { word: "lecture", parts: "lect [read] + -ure [act]", sense: "a formal talk, originally a reading · 讲座；授课" },
    ],
  },
  peal: {
    root: "pel / puls (appeal)", meaning: "to drive or push; appellare developed the sense ‘call on’",
    formation: "ap- [toward] + pel [drive] → call on someone → appealed to",
    context: "Steffens asked the librarian to help him find references.",
    examples: [
      { word: "appeal", parts: "ap- [toward] + pel [drive]", sense: "to make an earnest request · 请求；呼吁" },
      { word: "compel", parts: "com- [together] + pel [drive]", sense: "to force someone to act · 迫使" },
      { word: "repel", parts: "re- [back] + pel [drive]", sense: "to drive back · 击退" },
      { word: "expel", parts: "ex- [out] + pel [drive]", sense: "to drive out · 驱逐" },
      { word: "propel", parts: "pro- [forward] + pel [drive]", sense: "to push forward · 推进" },
    ],
    note: "The spelling peal in the textbook is not a general-purpose English root; compare the Latin-related pel/puls family.",
  },
  spect: {
    root: "spect / spec", meaning: "to look",
    formation: "sus- [from sub-, under] + spect [look] → look at with doubt → suspect",
    context: "After reading several accounts, he began to doubt the accepted story of the Constitution.",
    examples: [
      { word: "suspect", parts: "sus- [under] + spect [look]", sense: "to think something may be true · 怀疑" },
      { word: "inspect", parts: "in- [into] + spect [look]", sense: "to examine closely · 检查" },
      { word: "respect", parts: "re- [back/again] + spect [look]", sense: "to regard with consideration · 尊重" },
      { word: "spectator", parts: "spect [look] + -ator [person]", sense: "someone who watches · 观众" },
      { word: "perspective", parts: "per- [through] + spect [look]", sense: "a way of seeing something · 视角" },
    ],
  },
  demo: {
    root: "demo / dem", meaning: "the people",
    formation: "demo [people] + -cracy [rule] + -ic [relating to] → rule by the people → democratic",
    context: "Steffens questioned whether the founders actually intended government by the people.",
    examples: [
      { word: "democracy", parts: "demo [people] + -cracy [rule]", sense: "government by the people · 民主政体" },
      { word: "democratic", parts: "democracy + -ic [relating to]", sense: "based on democratic principles · 民主的" },
      { word: "democrat", parts: "demo [people] + -crat [supporter of rule]", sense: "a supporter of democracy · 民主主义者" },
      { word: "demographic", parts: "demo [people] + -graphic [describing]", sense: "relating to population groups · 人口统计的" },
      { word: "epidemic", parts: "epi- [among] + dem [people]", sense: "a disease spreading among people · 流行病" },
    ],
    note: "The demo- in demonstrate has a different origin; do not group it with democracy.",
  },
  mis: {
    root: "mit / miss (shown as mis)", meaning: "to send or let go",
    formation: "pro- [forward] + mis [send] → give one's word about the future → promised",
    context: "Steffens resolved to write a truthful history of the Constitution.",
    examples: [
      { word: "promise", parts: "pro- [forward] + mis [send]", sense: "to give one's word about a future act · 承诺" },
      { word: "mission", parts: "miss [send] + -ion [act]", sense: "an assignment or purpose · 使命；任务" },
      { word: "submit", parts: "sub- [under] + mit [send]", sense: "to hand in for consideration · 提交" },
      { word: "transmit", parts: "trans- [across] + mit [send]", sense: "to send across · 传送" },
      { word: "permit", parts: "per- [through] + mit [let go]", sense: "to allow · 允许" },
    ],
    note: "This is the Latin mit/miss family, not the English mis- prefix meaning ‘wrongly’.",
  },
  cept: {
    root: "cept / ceive", meaning: "to take or receive",
    formation: "ex- [out] + cept [take] → take out from a general rule → except",
    context: "The professors rarely asked him questions, apart from times when the class had no answer.",
    examples: [
      { word: "except", parts: "ex- [out] + cept [take]", sense: "excluding a case · 除了" },
      { word: "accept", parts: "ac- [to] + cept [take]", sense: "to receive willingly · 接受" },
      { word: "receive", parts: "re- [back] + ceive [take]", sense: "to get something · 收到" },
      { word: "intercept", parts: "inter- [between] + cept [take]", sense: "to stop and seize on the way · 截获" },
      { word: "concept", parts: "con- [together] + cept [take]", sense: "an idea formed by grasping things together · 概念" },
    ],
  },
};
