export type GrammarExercise = { id: string; label: string; source: "supp" | "main"; pages: number[]; keyPages: number[] };
export type GrammarTopic = { id: string; title: string; english: string; source: string; units: number[]; exercises: GrammarExercise[] };
export type GrammarArticle = { id: string; unit: number; title: string; topics: GrammarTopic[] };

const supp = (n: number, pages: number[], keys: number[]): GrammarExercise => ({ id: `s${n}`, label: `Exercise ${n}`, source: "supp", pages, keyPages: keys });
const main = (u: number, n: number, pages: number[], keys: number[]): GrammarExercise => ({ id: `m${u}-${n}`, label: `Exercise ${u}.${n}`, source: "main", pages, keyPages: keys });
const group = (start: number, pages: number[][], key: (n: number) => number[]) => pages.map((page, i) => supp(start + i, page, key(start + i)));
const articlePractice = group(122, [[83],[83,84],[84],[85],[86],[86],[87]], () => [117]);
const prepositionPractice = group(150, [[102],[102],[103],[103],[104]], () => [119]);
const pastPractice = group(29, [[19],[20],[20],[21],[21]], () => [109]);
const gerundPractice = group(111, [[70],[71],[71],[72,73],[74],[74],[75],[75]], () => [116]);
const simplePresentPractice = group(1, [[1],[1],[2]], () => [107]);
const modalPractice = group(50, [[31],[32],[33],[33],[34],[34],[35],[35],[35,36],[36],[37],[37],[37],[38],[38],[39],[39],[40],[40]], n => n === 64 ? [111,112] : [n <= 64 ? 111 : 112]);
const prepositionUnits = [129,130,131,132,133,134,135,136];

export const grammarArticles: GrammarArticle[] = [
  { id: "01", unit: 1, title: "I Become a Student", topics: [
    { id: "articles", title: "冠词", english: "Articles · a / an, the, zero article", source: "主教材 Units 71–78；补充练习 Exercises 122–128", units: [71,72,73,74,75,76,77,78], exercises: articlePractice },
    { id: "present-participle", title: "现在分词作修饰语", english: "Present participle as a modifier", source: "主教材 Units 68、97；对应 Exercises 68.1–68.4、97.1、97.3", units: [68,97], exercises: [main(97,1,[206],[370]),main(97,3,[206],[370]),...[1,2,3,4].map(n => main(68,n,[148],n===4?[363,364]:[363]))] },
    { id: "prepositions", title: "介词搭配", english: "Prepositions and fixed patterns", source: "主教材 Units 129–136；补充练习 Exercises 150–154", units: prepositionUnits, exercises: prepositionPractice },
  ] },
  { id: "02", unit: 4, title: "Should the Robots Be Taxed?", topics: [
    { id: "subject-verb-concord", title: "Subject–Verb Concord", english: "Subject–verb concord", source: "Grammar in Use: Units 79 and 84 · Exercises 79.1–79.3 and 84.1–84.4", units: [79,84], exercises: [1,2,3].map(n => main(79,n,[170],[366])).concat([1,2,3,4].map(n => main(84,n,[180],[367]))) },
  ] },
  { id: "03", unit: 5, title: "Roommates", topics: [
    { id: "past-flashback", title: "Past Tenses in Flashbacks", english: "Past tenses in flashbacks", source: "Grammar in Use: Units 5 and 15–16 · Supplementary Exercises 29–33", units: [5,15,16], exercises: pastPractice },
    { id: "gerund", title: "Gerunds", english: "Gerunds and -ing forms", source: "Grammar in Use: Units 53, 60, 62–63 · Supplementary Exercises 111–118", units: [53,60,62,63], exercises: gerundPractice },
  ] },
  { id: "04", unit: 7, title: "Never Trust Appearances", topics: [
    { id: "simple-present", title: "Simple Present", english: "Simple present tense", source: "Grammar in Use: Unit 2 · Supplementary Exercises 1–3", units: [2], exercises: simplePresentPractice },
    { id: "wh-infinitive", title: "Wh-word + Infinitive", english: "Wh-word + infinitive", source: "Grammar in Use: Unit 54, Section D and Exercise 54.5 · Supplementary Exercise 115, item 7", units: [54], exercises: [main(54,5,[120],[360,361]),{ ...supp(115,[74],[116]), label: "Exercise 115 · Item 7" }] },
  ] },
  { id: "05", unit: 9, title: "Courage", topics: [
    { id: "modals", title: "Modal Auxiliary Verbs", english: "Modal auxiliary verbs", source: "Grammar in Use: Units 26–37 · Supplementary Exercises 50–68", units: [26,27,28,29,30,31,32,33,34,35,36,37], exercises: modalPractice },
    { id: "prepositions", title: "Prepositions", english: "Prepositions in context", source: "Grammar in Use: Units 129–136 · Supplementary Exercises 150–154", units: prepositionUnits, exercises: prepositionPractice },
  ] },
];

export const getGrammarArticle = (id: string) => grammarArticles.find(article => article.id === id);
export const grammarPageImage = (kind: "supp" | "main", page: number, key = false) => `/grammar-pages/${kind}${key ? "-key" : ""}-${String(page).padStart(3, "0")}.webp`;
