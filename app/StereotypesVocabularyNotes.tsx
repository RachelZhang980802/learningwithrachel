"use client";

import { stereotypesArticle } from "./inquire-stereotype-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "stereotype", pattern: "stereotypes?", label: "stereotype", pos: "n.", ipa: "/ˈsteriətaɪp/", definition: "A fixed, oversimplified idea or image of a particular type of person or thing.", zh: "模式化的思想；老一套；刻板看法；（尤指）对……有成见" },
  { key: "aggressive", pattern: "aggressive", label: "aggressive", pos: "adj.", ipa: "/əˈɡresɪv/", definition: "Ready to attack or argue; forceful in pursuing what you want.", zh: "好斗的；挑衅的" },
  { key: "stubborn", pattern: "stubborn", label: "stubborn", pos: "adj.", ipa: "/ˈstʌbərn/", definition: "Unwilling to change your opinion or course of action.", zh: "（人）固执的；倔强的" },
  { key: "materialistic", pattern: "materialistic", label: "materialistic", pos: "adj.", ipa: "/məˌtɪriəˈlɪstɪk/", definition: "Too concerned with money and possessions rather than other values.", zh: "物质享乐主义的；贪图享乐的" },
  { key: "meek", pattern: "meek", label: "meek", pos: "adj.", ipa: "/miːk/", definition: "Quiet, gentle, and not wanting to argue or express strong opinions.", zh: "温顺的；谦恭的" },
  { key: "industrious", pattern: "industrious", label: "industrious", pos: "adj.", ipa: "/ɪnˈdʌstriəs/", definition: "Working hard and steadily.", zh: "勤劳的；勤奋的" },
  { key: "characterization", pattern: "characterizations?", label: "characterization", pos: "n.", ipa: "/ˌkærəktərəˈzeɪʃən/", definition: "A description of the qualities or features of someone or something.", zh: "描述；特性描述" },
  { key: "humble", pattern: "humble", label: "humble", pos: "adj.", ipa: "/ˈhʌmbəl/", definition: "Not proud or arrogant; modest.", zh: "谦虚的；谦卑的" },
  { key: "mistreatment", pattern: "mistreatment", label: "mistreatment", pos: "n.", ipa: "/ˌmɪsˈtriːtmənt/", definition: "The act of treating a person or group unfairly or cruelly.", zh: "虐待；不公正对待" },
  { key: "incarceration_camp", pattern: "incarceration\\s+camps?", label: "incarceration camp", pos: "n. phr.", ipa: "/ɪnˌkɑːrsəˈreɪʃən kæmp/", definition: "A place where people are confined or imprisoned, often without a normal trial.", zh: "监禁营；拘禁营" },
  { key: "compliant", pattern: "compliant", label: "compliant", pos: "adj.", ipa: "/kəmˈplaɪənt/", definition: "Willing to obey rules or do what other people want.", zh: "服从的；顺从的" },
  { key: "thriving", pattern: "thriv(?:e|es|ed|ing)", label: "thriving", pos: "adj.", ipa: "/ˈθraɪvɪŋ/", definition: "Growing, developing, or succeeding well.", zh: "欣欣向荣的；繁华的；兴旺的" },
  { key: "patriotic", pattern: "patriotic", label: "patriotic", pos: "adj.", ipa: "/ˌpeɪtriˈɑːtɪk/", definition: "Showing love for or strong support of your country.", zh: "爱国的；有爱国心的" },
  { key: "propaganda", pattern: "propaganda", label: "propaganda", pos: "n.", ipa: "/ˌprɑːpəˈɡændə/", definition: "Information, often biased or misleading, used to influence people's opinions.", zh: "宣传；鼓吹" },
  { key: "persuade", pattern: "persuad(?:e|es|ed|ing)", label: "persuade", pos: "v.", ipa: "/pərˈsweɪd/", definition: "To make someone do or believe something by giving them reasons or arguments.", zh: "说服；劝说" },
  { key: "coin", pattern: "coin(?:s|ed|ing)?", label: "coin", pos: "v.", ipa: "/kɔɪn/", definition: "To invent a new word or phrase.", zh: "创造（新词等）； coined 为 coin 的过去式和过去分词" },
  { key: "obedient", pattern: "obedient", label: "obedient", pos: "adj.", ipa: "/əˈbiːdiənt/", definition: "Doing what you are told or expected to do.", zh: "服从的；顺从的" },
  { key: "rhetoric", pattern: "rhetoric", label: "rhetoric", pos: "n.", ipa: "/ˈretərɪk/", definition: "Language designed to persuade or impress, sometimes without sincere meaning.", zh: "花言巧语；浮夸之词；修辞；修辞学" },
  { key: "fabricated", pattern: "fabricat(?:e|es|ed|ing)", label: "fabricated", pos: "adj.", ipa: "/ˈfæbrɪkeɪtɪd/", definition: "Invented or made up rather than true.", zh: "虚构的" },
  { key: "inferior", pattern: "inferior", label: "inferior", pos: "adj.", ipa: "/ɪnˈfɪriər/", definition: "Lower in quality, rank, or status than someone or something else.", zh: "较差的；（地位或成就）低于他人者" },
  { key: "wedge", pattern: "wedges?", label: "wedge", pos: "n.", ipa: "/wedʒ/", definition: "Something that separates people or groups and causes disagreement between them.", zh: "楔子；三角木；楔形物" },
  { key: "oppression", pattern: "oppression", label: "oppression", pos: "n.", ipa: "/əˈpreʃən/", definition: "Cruel or unfair treatment and control of people.", zh: "压迫；压制；压迫手段；郁闷；压抑" },
  { key: "marginalize", pattern: "marginaliz(?:e|es|ed|ing)|marginalis(?:e|es|ed|ing)", label: "marginalize", pos: "v.", ipa: "/ˈmɑːrdʒɪnəlaɪz/", definition: "To make a person or group seem unimportant or powerless.", zh: "使边缘化；忽略；排斥" },
  { key: "hierarchy", pattern: "hierarch(?:y|ies)", label: "hierarchy", pos: "n.", ipa: "/ˈhaɪərɑːrki/", definition: "A system in which people or things are ranked one above another.", zh: "等级制度；统治集团；等级体系" },
  { key: "status_quo", pattern: "status\\s+quo", label: "status quo", pos: "n.", ipa: "/ˌsteɪtəs ˈkwoʊ/", definition: "The existing situation or state of affairs.", zh: "现状；维持现状" },
  { key: "portrait", pattern: "portraits?", label: "portrait", pos: "n.", ipa: "/ˈpɔːrtrət/", definition: "A description or representation of a person, group, or situation.", zh: "肖像；照片；雕像；描绘；描述" },
  { key: "umbrella", pattern: "umbrellas?", label: "umbrella", pos: "n.", ipa: "/ʌmˈbrelə/", definition: "Something that includes or covers a range of different things.", zh: "综合体；总体" },
  { key: "one_dimensional", pattern: "one-dimensional", label: "one-dimensional", pos: "adj.", ipa: "/ˌwʌn daɪˈmenʃənəl/", definition: "Showing only one side of a person or thing; lacking complexity.", zh: "肤浅的；单面的；幻想的" },
  { key: "hinder", pattern: "hinder(?:s|ed|ing)?", label: "hinder", pos: "v.", ipa: "/ˈhɪndər/", definition: "To make it difficult for someone or something to succeed or make progress.", zh: "阻碍；妨碍" },
  { key: "triumph", pattern: "triumphs?", label: "triumph", pos: "n.", ipa: "/ˈtraɪʌmf/", definition: "A great success or victory; a feeling of great joy about it.", zh: "巨大成功；重大胜利；（胜利或成功的）喜悦；狂喜" },
  { key: "coalition", pattern: "coalitions?", label: "coalition", pos: "n.", ipa: "/ˌkoʊəˈlɪʃən/", definition: "A group or alliance formed to work toward a shared goal.", zh: "联合；结盟" },
  { key: "eliminate", pattern: "eliminat(?:e|es|ed|ing)", label: "eliminate", pos: "v.", ipa: "/ɪˈlɪməneɪt/", definition: "To remove or get rid of something completely.", zh: "剔除；根除" },
];

export function StereotypesVocabularyArticleBody() {
  return <VocabularyArticleBody paragraphs={stereotypesArticle.paragraphs} terms={terms} idPrefix="stereotypes-note" paragraphTranslations={stereotypesArticle.paragraphTranslations} />;
}
