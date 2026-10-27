"use client";

import { RaiseABullyExercises } from "./RaiseABullyExercises";
import { raiseABullyArticle } from "./inquire-family-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "empathy", pattern: "empathy", label: "empathy", pos: "n.", ipa: "/ˈempəθi/", definition: "The ability to understand another person’s feelings, experience, and point of view.", zh: "同理心；共情" },
  { key: "commit", pattern: "committ(?:ed|ing)?", label: "commit", pos: "v.", ipa: "/kəˈmɪt/", definition: "To kill yourself deliberately; to carry out a crime or other act.", zh: "进行（自杀等）；犯（罪等）" },
  { key: "onlooker", pattern: "onlookers?", label: "onlooker", pos: "n.", ipa: "/ˈɑːnlʊkər/", definition: "A person who watches something happening but is not involved in it.", zh: "旁观者" },
  { key: "meditate", pattern: "meditat(?:e|es|ed|ing)", label: "meditate", pos: "v.", ipa: "/ˈmedɪteɪt/", definition: "To think deeply about something.", zh: "思考；沉思" },
  { key: "curtail", pattern: "curtail(?:s|ed|ing)?", label: "curtail", pos: "v.", ipa: "/kərˈteɪl/", definition: "To limit something or make it last for a shorter time.", zh: "减缩；限制" },
  { key: "heap", pattern: "heap(?:s|ed|ing)?", label: "heap", pos: "v.", ipa: "/hiːp/", definition: "To put a lot of something in a pile, or give someone a lot of praise or criticism.", zh: "堆积；堆放；对……大加赞扬（或指责等）" },
  { key: "put_yourself_in_shoes", pattern: "put\\s+(?:yourself|ourselves|himself|herself|themselves)\\s+in\\s+(?:another\\s+)?person['’]s\\s+shoes", label: "put yourself in sb.’s shoes", pos: "v. phr.", ipa: "/pʊt jərˈself ɪn ˈsʌmbədiz ʃuːz/", definition: "To be in or imagine that you are in another person’s situation, especially a difficult one.", zh: "设身处地地想象自己处在别人境中的感受" },
  { key: "sociopath", pattern: "sociopaths?", label: "sociopath", pos: "n.", ipa: "/ˈsoʊsiəpæθ/", definition: "A person with a personality disorder that leads them to behave aggressively or unpleasantly toward others.", zh: "反社会的人" },
  { key: "innate", pattern: "innate", label: "innate", pos: "adj.", ipa: "/ɪˈneɪt/", definition: "A quality or feeling that you have when you are born.", zh: "先天的；固有的" },
  { key: "stirring", pattern: "stirrings?", label: "stirring", pos: "n.", ipa: "/ˈstɜːrɪŋ/", definition: "The beginning of a feeling, idea, or development.", zh: "（感情、想法或发展的）开始" },
  { key: "unsolicited", pattern: "unsolicited", label: "unsolicited", pos: "adj.", ipa: "/ˌʌnsəˈlɪsɪtɪd/", definition: "Not asked for and sometimes not wanted.", zh: "未被请求的；主动提供的" },
  { key: "hinder", pattern: "hinder(?:s|ed|ing)?", label: "hinder", pos: "v.", ipa: "/ˈhɪndər/", definition: "To make it difficult for someone to do something or for something to happen.", zh: "阻碍；妨碍" },
  { key: "enlist", pattern: "enlist(?:s|ed|ing)?", label: "enlist", pos: "v.", ipa: "/ɪnˈlɪst/", definition: "To join the armed forces, or to persuade someone to help you.", zh: "（使）参军；（使）入伍；争取帮助" },
  { key: "boot_camp", pattern: "boot\\s+camp", label: "boot camp", pos: "n.", ipa: "/ˈbuːt kæmp/", definition: "A camp where people who have just joined the army, navy, or marines are trained.", zh: "新兵训练营" },
  { key: "deviousness", pattern: "deviousness", label: "deviousness", pos: "n.", ipa: "/ˈdiːviəsnəs/", definition: "Dishonest or indirect behaviour used to trick people in order to get something.", zh: "（为达到目的而采取的）不诚实行为；狡诈" },
  { key: "cunning", pattern: "cunning", label: "cunning", pos: "n.", ipa: "/ˈkʌnɪŋ/", definition: "The ability to achieve something by cleverly tricking or cheating other people.", zh: "狡猾；诡诈" },
  { key: "outreach", pattern: "outreach", label: "outreach", pos: "n.", ipa: "/ˈaʊtriːtʃ/", definition: "The activity of an organization that provides a service or advice to people in the community.", zh: "外展服务；扩大范围的服务" },
  { key: "sergeant", pattern: "sergeant", label: "sergeant", pos: "n.", ipa: "/ˈsɑːrdʒənt/", definition: "A non-commissioned officer of middle rank in the army, marines, or air force.", zh: "中士" },
  { key: "intuit", pattern: "intuit(?:s|ed|ing)?", label: "intuit", pos: "v.", ipa: "/ɪnˈtuːɪt/", definition: "To know that something is true based on your feelings rather than facts.", zh: "从直觉知道" },
  { key: "psychopathic", pattern: "psychopathic", label: "psychopathic", pos: "adj.", ipa: "/ˌsaɪkoʊˈpæθɪk/", definition: "Suffering from or caused by a serious personality disorder that can involve a lack of concern for others.", zh: "精神病的；反社会人格障碍的" },
  { key: "victimize", pattern: "victimiz(?:e|es|ed|ing)|victimis(?:e|es|ed|ing)", label: "victimize", pos: "v.", ipa: "/ˈvɪktɪmaɪz/", definition: "To treat someone unfairly because you do not like them, their opinions, or something they have done.", zh: "使受害；迫害" },
  { key: "rotating", pattern: "rotating", label: "rotating", pos: "adj.", ipa: "/ˈroʊteɪtɪŋ/", definition: "Of a job or position for which the person who does it changes regularly.", zh: "（工作）轮换的；轮值的" },
  { key: "traumatize", pattern: "traumatiz(?:e|es|ed|ing)|traumatis(?:e|es|ed|ing)", label: "traumatize", pos: "v.", ipa: "/ˈtrɔːmətaɪz/", definition: "To shock and upset someone so much that they cannot think normally or continue with their normal life.", zh: "（使）受精神创伤" },
  { key: "deficit", pattern: "deficit", label: "deficit", pos: "n.", ipa: "/ˈdefɪsɪt/", definition: "A lack or shortage; a deficiency.", zh: "缺乏；缺陷" },
];

export function RaiseABullyVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={raiseABullyArticle.paragraphs} terms={terms} idPrefix="raise-a-bully-note" sectionHeadings={raiseABullyArticle.sectionHeadings} paragraphTranslations={raiseABullyArticle.paragraphTranslations} /><RaiseABullyExercises /></>;
}
