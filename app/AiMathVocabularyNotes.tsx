"use client";

import { AiMathExercises } from "./AiMathExercises";
import { aiMathArticle } from "./inquire-technology-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "panic", pattern: "panic", label: "panic", pos: "n.", ipa: "/ˈpænɪk/", definition: "A sudden strong feeling of fear that prevents reasonable thought or action.", zh: "恐慌；惊慌" },
  { key: "pass_for", pattern: "pass(?:es|ed|ing)?\\s+for", label: "pass for", pos: "v. phr.", ipa: "/pæs fɔːr/", definition: "To be accepted or treated as something, often when it is not really that thing.", zh: "足以冒充；可被看作" },
  { key: "diminish", pattern: "diminish(?:es|ed|ing)?", label: "diminish", pos: "v.", ipa: "/dɪˈmɪnɪʃ/", definition: "To reduce or become smaller in size, importance, or value.", zh: "减少；削弱；降低" },
  { key: "undermine", pattern: "undermin(?:e|es|ed|ing)", label: "undermine", pos: "v.", ipa: "/ˌʌndərˈmaɪn/", definition: "To make someone less confident or powerful, or make something weaker, often gradually.", zh: "暗中破坏；逐渐削弱" },
  { key: "parse", pattern: "pars(?:e|es|ed|ing)", label: "parse", pos: "v.", ipa: "/pɑːrs/", definition: "To examine computer data and change it into a form that can be easily read or understood.", zh: "（计算机）解析" },
  { key: "numeracy", pattern: "numeracy", label: "numeracy", pos: "n.", ipa: "/ˈnuːmərəsi/", definition: "The ability to understand and work with numbers.", zh: "识数；计算能力；量化素养" },
  { key: "literacy", pattern: "literacy", label: "literacy", pos: "n.", ipa: "/ˈlɪtərəsi/", definition: "The ability to read and write.", zh: "读写能力；识字" },
  { key: "ad_hoc", pattern: "ad\\s+hoc", label: "ad hoc", pos: "adj.", ipa: "/ˌæd ˈhɑːk/", definition: "Made or happening for a particular purpose or need, rather than planned in advance.", zh: "临时的；特别安排的；即兴的" },
  { key: "grunt_work", pattern: "grunt\\s+work", label: "grunt work", pos: "n.", ipa: "/ˈɡrʌnt wɜːrk/", definition: "Hard, boring work that requires effort but little skill or recognition.", zh: "苦差事；枯燥乏味的工作" },
  { key: "riddled_with", pattern: "riddled\\s+with\\s+irreversible\\s+errors", label: "be riddled with sth.", pos: "v. phr.", ipa: "/bi ˈrɪdəld wɪð/", definition: "To be full of something, especially something bad or unpleasant.", zh: "充满（不好的东西）" },
  { key: "streamline", pattern: "streamlin(?:e|es|ed|ing)", label: "streamline", pos: "v.", ipa: "/ˈstriːmlaɪn/", definition: "To improve a business, process, or organization by making it more modern or simple.", zh: "优化；精简" },
  { key: "drudgery", pattern: "drudgery", label: "drudgery", pos: "n.", ipa: "/ˈdrʌdʒəri/", definition: "Hard, boring work that is unpleasant or repetitive.", zh: "苦工；乏味的苦差事" },
  { key: "writing_on_wall", pattern: "the\\s+writing\\s+on\\s+the\\s+wall", label: "the writing on the wall", pos: "idiom", ipa: "/ðə ˈraɪtɪŋ ɑːn ðə wɔːl/", definition: "Clear signs that something will fail or no longer exist.", zh: "不祥之兆；败局已定的迹象" },
  { key: "pipeline", pattern: "pipeline", label: "pipeline", pos: "n.", ipa: "/ˈpaɪplaɪn/", definition: "A system for supplying something, or a system through which a process develops.", zh: "（持续的）渠道；输送线" },
  { key: "innumerate", pattern: "innumerate", label: "innumerate", pos: "adj.", ipa: "/ɪˈnuːmərət/", definition: "Unable to understand and use basic numbers in calculations.", zh: "不懂数学的；数盲的" },
  { key: "exacerbate", pattern: "exacerbat(?:e|es|ed|ing)", label: "exacerbate", pos: "v.", ipa: "/ɪɡˈzæsərbeɪt/", definition: "To make something that is already bad even worse.", zh: "使加剧；使恶化" },
  { key: "broad_based", pattern: "broad[-–]based", label: "broad-based", pos: "adj.", ipa: "/ˌbrɔːd ˈbeɪst/", definition: "Involving a wide range of people, things, or ideas.", zh: "基础广泛的；全面的" },
  { key: "quixotic", pattern: "quixotic", label: "quixotic", pos: "adj.", ipa: "/kwɪkˈsɑːtɪk/", definition: "Having brave, romantic ideas that are foolish or impractical.", zh: "堂吉诃德式的；过分理想化的" },
  { key: "liberal_arts", pattern: "liberal\\s+arts", label: "liberal arts", pos: "n.", ipa: "/ˌlɪbərəl ˈɑːrts/", definition: "Subjects such as history, languages, and literature that develop general knowledge and thinking skills.", zh: "博雅教育；通识教育" }
];

export function AiMathVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={aiMathArticle.paragraphs} terms={terms} idPrefix="ai-math-note" /><AiMathExercises /></>;
}
