"use client";

import { CrawfordExercises } from "./CrawfordExercises";
import { individualismArticle } from "./inquire-feature-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "nest", pattern: "nest(?:ed|ing|s)?", label: "nest", pos: "v.", ipa: "/nest/", definition: "To fit one thing inside another, or to form a set of things contained within each other.", zh: "嵌套；套在里面" },
  { key: "elaborate", pattern: "elaborat(?:e|es|ed|ing)", label: "elaborate", pos: "v.", ipa: "/ɪˈlæbəreɪt/", definition: "To explain or describe something in more detail.", zh: "详细说明；详尽阐述" },
  { key: "stand_on_feet", pattern: "stand\\s+on\\s+(?:my|your|his|her|their|our)\\s+own\\s+two\\s+feet", label: "stand on your own two feet", pos: "v. phr.", ipa: "/stænd ɑːn jʊr oʊn tuː fiːt/", definition: "To be able to live or act independently without help from others.", zh: "自立；自食其力" },
  { key: "intransigent", pattern: "intransigent", label: "intransigent", pos: "adj.", ipa: "/ɪnˈtrænsɪdʒənt/", definition: "Unwilling to change one’s opinions or reach an agreement.", zh: "不妥协的；不愿合作的" },
  { key: "protestant", pattern: "protestant", label: "Protestant", pos: "adj.", ipa: "/ˈprɑːtɪstənt/", definition: "Belonging to or connected with the part of Western Christianity that separated from the Roman Catholic Church.", zh: "新教的；新教徒的" },
  { key: "skepticism", pattern: "skepticism", label: "skepticism", pos: "n.", ipa: "/ˈskeptɪsɪzəm/", definition: "An attitude of doubt about whether something is true or will happen.", zh: "怀疑态度；怀疑主义" },
  { key: "contemporary", pattern: "contemporar(?:y|ies)", label: "contemporary", pos: "n.", ipa: "/kənˈtempəreri/", definition: "A person living or existing at the same time as another.", zh: "同时代的人；同辈" },
  { key: "conformist", pattern: "conformists?", label: "conformist", pos: "n.", ipa: "/kənˈfɔːrmɪst/", definition: "A person who behaves or thinks like most people and avoids being different.", zh: "随波逐流者；循规蹈矩的人" },
  { key: "interference", pattern: "interference", label: "interference", pos: "n.", ipa: "/ˌɪntərˈfɪrəns/", definition: "Involvement in a situation that should not really involve you, often causing annoyance.", zh: "干涉；干预；介入" },
  { key: "workings", pattern: "workings", label: "workings", pos: "n.", ipa: "/ˈwɜːrkɪŋz/", definition: "The way a machine, system, organization, or process operates.", zh: "运作方式；工作原理" },
  { key: "resentment", pattern: "ressentiment", label: "ressentiment (resentment)", pos: "n.", ipa: "/rɪˈsentmənt/", definition: "A lasting feeling of bitterness or anger caused by perceived unfair treatment.", zh: "怨恨；愤懑" },
  { key: "coveted", pattern: "coveted", label: "coveted", pos: "adj.", ipa: "/ˈkʌvɪtɪd/", definition: "Wanted very much by many people.", zh: "令人向往的；梦寐以求的" },
  { key: "upshot", pattern: "upshot", label: "the upshot", pos: "n.", ipa: "/ˈʌpʃɑːt/", definition: "The final result or outcome of a series of events.", zh: "结果；结局" },
  { key: "authoritative", pattern: "authoritative", label: "authoritative", pos: "adj.", ipa: "/əˈθɔːrəteɪtɪv/", definition: "Able to be trusted as accurate, reliable, and deserving of respect.", zh: "权威性的；可信赖的" },
  { key: "riches", pattern: "riches", label: "riches", pos: "n.", ipa: "/ˈrɪtʃɪz/", definition: "A large amount of valuable or beneficial things; wealth or resources.", zh: "财富；宝贵资源" },
  { key: "thicket", pattern: "thicket", label: "thicket", pos: "n.", ipa: "/ˈθɪkɪt/", definition: "A dense group of bushes or trees; figuratively, a confusing mass of things.", zh: "灌木丛；错综复杂的一团" },
  { key: "obscurity", pattern: "obscurity", label: "obscurity", pos: "n.", ipa: "/əbˈskjʊrəti/", definition: "The state of being difficult to understand, see, or know about.", zh: "费解；晦涩；默默无闻" },
  { key: "creed", pattern: "creed", label: "creed", pos: "n.", ipa: "/kriːd/", definition: "A set of principles or beliefs, especially religious or political ones.", zh: "信念；原则；信条" },
  { key: "tacitly", pattern: "tacitly", label: "tacitly", pos: "adv.", ipa: "/ˈtæsɪtli/", definition: "In a way that is understood or accepted without being said directly.", zh: "默许地；不言而喻地" },
  { key: "posit", pattern: "posit(?:s|ed|ing)?", label: "posit", pos: "v.", ipa: "/ˈpɑːzɪt/", definition: "To suggest or assume that something is true as a basis for reasoning.", zh: "假设；认定；提出" },
  { key: "epistemic", pattern: "epistemic", label: "epistemic", pos: "adj.", ipa: "/ˌepɪˈstiːmɪk/", definition: "Relating to knowledge or to how we know things.", zh: "知识的；认识论的" },
  { key: "hierarchical", pattern: "hierarchical", label: "hierarchical", pos: "adj.", ipa: "/ˌhaɪəˈrɑːrkɪkəl/", definition: "Arranged in levels, with some people or things ranked above others.", zh: "按等级划分的；等级制的" },
  { key: "fraught", pattern: "fraught", label: "fraught", pos: "adj.", ipa: "/frɔːt/", definition: "Filled with or likely to cause difficulty, worry, or stress.", zh: "充满（困难或压力）的；令人担忧的" },
  { key: "paradoxical", pattern: "paradoxical", label: "paradoxical", pos: "adj.", ipa: "/ˌpærəˈdɑːksɪkəl/", definition: "Seemingly contradictory but possibly expressing a truth.", zh: "看似荒谬的；自相矛盾的" },
  { key: "mob_rule", pattern: "mob\\s+rule", label: "mob rule", pos: "n.", ipa: "/ˈmɑːb ruːl/", definition: "Control of a political situation by a crowd, often through violence or intimidation.", zh: "暴民统治" },
  { key: "aristocratic", pattern: "aristocratic", label: "aristocratic", pos: "adj.", ipa: "/ˌærɪstəˈkrætɪk/", definition: "Belonging or relating to the aristocracy or its privileged social class.", zh: "贵族的；贵族阶层的" },
  { key: "ethos", pattern: "ethos", label: "ethos", pos: "n.", ipa: "/ˈiːθɑːs/", definition: "The moral ideas and attitudes that belong to a particular group or person.", zh: "（群体或社会的）道德思想；道德观" },
  { key: "apprenticeship", pattern: "apprenticeship", label: "apprenticeship", pos: "n.", ipa: "/əˈprentɪsʃɪp/", definition: "A period of learning a skill by working with and being taught by an experienced person.", zh: "学徒期；学徒工作" },
  { key: "conviviality", pattern: "conviviality", label: "conviviality", pos: "n.", ipa: "/kənˌvɪviˈæləti/", definition: "The quality of being cheerful, friendly, and sociable.", zh: "欢快友好的气氛或性格" },
  { key: "deference", pattern: "deference", label: "deference", pos: "n.", ipa: "/ˈdefərəns/", definition: "Respectful behavior that shows regard for another person’s authority or judgment.", zh: "尊重；遵从；听从" },
  { key: "mimic", pattern: "mimic(?:s|ked|king)?", label: "mimic", pos: "v.", ipa: "/ˈmɪmɪk/", definition: "To copy the way someone or something behaves, speaks, or moves.", zh: "模仿" }
];

export function CrawfordVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={individualismArticle.paragraphs} terms={terms} idPrefix="crawford-note" /><CrawfordExercises /></>;
}
