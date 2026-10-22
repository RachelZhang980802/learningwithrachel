"use client";

import { DeepSeekExercises } from "./DeepSeekExercises";
import { deepSeekArticle } from "./inquire-technology-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "beef", pattern: "beef", label: "beef", pos: "n.", ipa: "/biːf/", definition: "A complaint or criticism about something.", zh: "抱怨；牢骚" },
  { key: "democratise", pattern: "democratis(?:e|es|ed|ing)", label: "democratise", pos: "v.", ipa: "/dɪˈmɑːkrətaɪz/", definition: "To make something available to more people or easier for them to take part in.", zh: "使民主化；使更多人能够参与" },
  { key: "sputnik", pattern: "sputnik", label: "Sputnik", pos: "n.", ipa: "/ˈspʊtnɪk/", definition: "A Soviet artificial satellite; here, a major technological event that provokes a strong response.", zh: "（苏联）人造地球卫星；引发关注的重大事件" },
  { key: "mayhem", pattern: "mayhem", label: "mayhem", pos: "n.", ipa: "/ˈmeɪhem/", definition: "A state of great confusion or disorder, often caused by a sudden event.", zh: "骚乱；混乱" },
  { key: "plummet", pattern: "plummet(?:s|ed|ing)?", label: "plummet", pos: "v.", ipa: "/ˈplʌmɪt/", definition: "To fall suddenly and quickly from a high level or position.", zh: "暴跌；速降" },
  { key: "supremacy", pattern: "supremacy", label: "supremacy", pos: "n.", ipa: "/suːˈpreməsi/", definition: "The position of having more power, authority, or status than others.", zh: "至高无上；最高权力；优势地位" },
  { key: "analogy", pattern: "analogy", label: "analogy", pos: "n.", ipa: "/əˈnælədʒi/", definition: "A comparison between things that share similar features.", zh: "类比；相似之处" },
  { key: "neurosis", pattern: "neuros(?:is|es)", label: "neurosis", pos: "n.", ipa: "/nʊˈroʊsɪs/", definition: "A mental condition involving excessive fear, anxiety, or worry.", zh: "神经症；过分的恐惧（或焦虑）" },
  { key: "hedge_fund", pattern: "hedge\\s+funds?", label: "hedge fund", pos: "n.", ipa: "/ˈhedʒ fʌnd/", definition: "An investment fund that uses pooled money and often takes high risks in seeking profit.", zh: "对冲基金" },
  { key: "prone", pattern: "prone", label: "prone", pos: "adj.", ipa: "/proʊn/", definition: "Likely to suffer from something or to do something bad.", zh: "易于遭受；有……倾向" },
  { key: "hallucination", pattern: "hallucinations?", label: "hallucination", pos: "n.", ipa: "/həˌluːsɪˈneɪʃən/", definition: "Something that seems to be seen or heard but is not really there.", zh: "幻觉；产生幻觉" },
  { key: "fraction", pattern: "fractions?", label: "fraction", pos: "n.", ipa: "/ˈfrækʃən/", definition: "A small part or amount of something.", zh: "小部分；少量" },
  { key: "tighten", pattern: "tighten(?:s|ed|ing)?", label: "tighten", pos: "v.", ipa: "/ˈtaɪtən/", definition: "To make something stricter, stronger, or more firmly controlled.", zh: "使更加严格；加强" },
  { key: "curtail", pattern: "curtail(?:s|ed|ing)?", label: "curtail", pos: "v.", ipa: "/kərˈteɪl/", definition: "To limit something or make it last for a shorter time.", zh: "限制；缩短；减缩" },
  { key: "cutting_edge", pattern: "cutting[-–]edge", label: "cutting-edge", pos: "adj.", ipa: "/ˌkʌtɪŋ ˈedʒ/", definition: "At the newest and most advanced stage of development.", zh: "最前沿的；最先进的" },
  { key: "paradoxically", pattern: "paradoxically", label: "paradoxically", pos: "adv.", ipa: "/ˌpærəˈdɑːksɪkli/", definition: "In a way that seems surprising or contradictory.", zh: "矛盾的是；似乎自相矛盾地" },
  { key: "spur", pattern: "spur(?:s|red|ring)?", label: "spur", pos: "v.", ipa: "/spɜːr/", definition: "To encourage someone to act or try harder.", zh: "鞭策；激励；刺激" },
  { key: "mystique", pattern: "mystique", label: "mystique", pos: "n.", ipa: "/mɪˈstiːk/", definition: "A quality of mystery or secrecy that makes someone or something seem attractive or special.", zh: "神秘性" },
  { key: "prophet", pattern: "prophets?", label: "prophet", pos: "n.", ipa: "/ˈprɑːfɪt/", definition: "A person believed to speak for God or to predict what will happen in the future.", zh: "先知；预言家" },
  { key: "endowed_with", pattern: "(?:be|been|is|are|was|were)\\s+endowed\\s+with", label: "be endowed with", pos: "v. phr.", ipa: "/bi ɪnˈdaʊd wɪð/", definition: "To naturally have a particular quality, ability, or feature.", zh: "天生赋有；生来具有" },
  { key: "cognitive", pattern: "cognitive", label: "cognitive", pos: "adj.", ipa: "/ˈkɑːɡnətɪv/", definition: "Connected with the mental processes of understanding, learning, and knowing.", zh: "认知的；感知的" },
  { key: "grasp", pattern: "grasp", label: "grasp", pos: "n.", ipa: "/ɡræsp/", definition: "The ability to get or achieve something; the ability to understand something.", zh: "能力所及；掌握" },
  { key: "radiologist", pattern: "radiologists?", label: "radiologist", pos: "n.", ipa: "/ˌreɪdiˈɑːlədʒɪst/", definition: "A doctor who is trained in radiology.", zh: "放射科医生" },
  { key: "pushback", pattern: "pushback", label: "pushback", pos: "n.", ipa: "/ˈpʊʃbæk/", definition: "Opposition or resistance to a plan, idea, or change.", zh: "反对；抵制；反弹" },
  { key: "materialise", pattern: "materialis(?:e|es|ed|ing)", label: "materialise", pos: "v.", ipa: "/məˈtɪriəlaɪz/", definition: "To happen or become real, especially as expected or planned.", zh: "实现；发生；成为现实" },
  { key: "hype", pattern: "hype", label: "hype", pos: "n.", ipa: "/haɪp/", definition: "Publicity or excitement that exaggerates how good or important something is.", zh: "大肆宣传；炒作" },
  { key: "inauguration", pattern: "inauguration", label: "inauguration", pos: "n.", ipa: "/ɪˌnɔːɡjəˈreɪʃən/", definition: "A formal ceremony marking the beginning of a public official’s or leader’s term.", zh: "就职典礼；就职仪式" },
  { key: "brute", pattern: "brute", label: "brute", pos: "adj.", ipa: "/bruːt/", definition: "Using physical strength rather than thought or intelligence.", zh: "蛮力的；粗暴的" },
  { key: "disruptive", pattern: "disruptive", label: "disruptive", pos: "adj.", ipa: "/dɪsˈrʌptɪv/", definition: "Causing major changes to the way something is usually done.", zh: "颠覆性的；造成重大变革的" },
  { key: "geek", pattern: "geeks?", label: "geek", pos: "n.", ipa: "/ɡiːk/", definition: "A person who is very interested in and knowledgeable about a particular subject.", zh: "极客；（对某领域）极感兴趣且知识丰富的人" },
  { key: "fete", pattern: "fet(?:e|es|ed|ing)", label: "fete", pos: "v.", ipa: "/feɪt/", definition: "To welcome, praise, or celebrate someone publicly.", zh: "盛宴款待；公开表彰" },
  { key: "tumult", pattern: "tumult", label: "tumult", pos: "n.", ipa: "/ˈtuːmʌlt/", definition: "A confused and noisy situation, often involving many people or strong excitement.", zh: "骚乱；骚动；混乱" },
  { key: "geopolitics", pattern: "geopolitics", label: "geopolitics", pos: "n.", ipa: "/ˌdʒiːoʊˈpɑːlətɪks/", definition: "The study of political relations between countries as influenced by geography.", zh: "地缘政治学" },
  { key: "distort", pattern: "distort(?:s|ed|ing)?", label: "distort", pos: "v.", ipa: "/dɪˈstɔːrt/", definition: "To change facts or ideas so that they are no longer correct or true.", zh: "歪曲；曲解" },
  { key: "subsume", pattern: "subsum(?:e|es|ed|ing)", label: "subsume", pos: "v.", ipa: "/səbˈsuːm/", definition: "To include something in a larger group instead of considering it separately.", zh: "将……归入（或纳入）" },
  { key: "provenance", pattern: "provenance", label: "provenance", pos: "n.", ipa: "/ˈprɑːvənəns/", definition: "The place that something originally came from; its origin.", zh: "原产地；来源；起源" },
  { key: "obscure", pattern: "obscur(?:e|es|ed|ing)", label: "obscure", pos: "v.", ipa: "/əbˈskjʊr/", definition: "To make something difficult to know, see, or understand.", zh: "掩盖；使费解" },
  { key: "bedevil", pattern: "bedevil(?:s|ed|ing)?|bedevill(?:ed|ing)", label: "bedevil", pos: "v.", ipa: "/bɪˈdevəl/", definition: "To cause someone or something many problems over a long period.", zh: "长期困扰" },
  { key: "assume", pattern: "assum(?:e|es|ed|ing)", label: "assume", pos: "v.", ipa: "/əˈsuːm/", definition: "To begin to have a particular quality or appearance.", zh: "呈现（外观、样子）；显露" }
];

export function DeepSeekVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={deepSeekArticle.paragraphs} terms={terms} idPrefix="deepseek-note" leadParagraph={deepSeekArticle.dek} /><DeepSeekExercises /></>;
}
