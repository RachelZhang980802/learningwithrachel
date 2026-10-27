"use client";

import { LoveJointExercises } from "./LoveJointExercises";
import { loveJointArticle } from "./inquire-love-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "awry", pattern: "awry", label: "awry", pos: "adv.", ipa: "/əˈraɪ/", definition: "In a way that is wrong or not as planned.", zh: "出错；出岔子" },
  { key: "authentic", pattern: "authentic", label: "authentic", pos: "adj.", ipa: "/ɔːˈθentɪk/", definition: "Real and accurate; genuine rather than false or copied.", zh: "真实的；真正的" },
  { key: "asymmetrical", pattern: "asymmetrical", label: "asymmetrical", pos: "adj.", ipa: "/ˌeɪsɪˈmetrɪkəl/", definition: "Having two sides or parts that are not the same in size or shape.", zh: "不对称的" },
  { key: "perpetuate", pattern: "perpetuat(?:e|es|ed|ing)", label: "perpetuate", pos: "v.", ipa: "/pərˈpetʃueɪt/", definition: "To make something, especially a bad situation or belief, continue for a long time.", zh: "使永久化；使持续" },
  { key: "caricature", pattern: "caricatures?", label: "caricature", pos: "n.", ipa: "/ˈkærɪkətʃʊr/", definition: "A description that exaggerates certain features to make someone or something seem silly.", zh: "夸张的描述" },
  { key: "unhindered", pattern: "unhindered", label: "unhindered", pos: "adj.", ipa: "/ʌnˈhɪndərd/", definition: "Not stopped or prevented from progressing or taking place.", zh: "不受阻挡的；没有障碍的" },
  { key: "vice", pattern: "vices?", label: "vice", pos: "n.", ipa: "/vaɪs/", definition: "A behavior or quality that is considered evil or immoral.", zh: "恶行；堕落；邪恶" },
  { key: "narcissism", pattern: "narcissism", label: "narcissism", pos: "n.", ipa: "/ˈnɑːrsɪsɪzəm/", definition: "Too much admiration of yourself, especially your appearance or abilities.", zh: "自恋；自我陶醉" },
  { key: "devotion", pattern: "devotion", label: "devotion", pos: "n.", ipa: "/dɪˈvoʊʃən/", definition: "The act of giving a lot of time, energy, or loyalty to someone or something.", zh: "奉献；忠诚；热心" },
  { key: "abnegation", pattern: "abnegation", label: "abnegation", pos: "n.", ipa: "/ˌæbnɪˈɡeɪʃən/", definition: "The act of denying yourself something you want; the act of rejecting something.", zh: "克制；拒绝；放弃" },
  { key: "obliterate", pattern: "obliterat(?:e|es|ed|ing)", label: "obliterate", pos: "v.", ipa: "/əˈblɪtəreɪt/", definition: "To remove all signs of something by destroying or covering it completely.", zh: "毁掉；覆盖；清除" },
  { key: "accommodate", pattern: "accommodat(?:e|es|ed|ing)", label: "accommodate", pos: "v.", ipa: "/əˈkɑːmədeɪt/", definition: "To consider someone's opinion or needs and make adjustments for them.", zh: "考虑到；顾及" },
  { key: "equilibrium", pattern: "equilibrium", label: "equilibrium", pos: "n.", ipa: "/ˌiːkwɪˈlɪbriəm/", definition: "A state of balance, especially between different forces or influences.", zh: "平衡；均势" },
  { key: "reciprocity", pattern: "reciprocity", label: "reciprocity", pos: "n.", ipa: "/ˌresɪˈprɑːsəti/", definition: "A situation in which people or groups provide equal help or advantages to each other.", zh: "互惠；互助" },
  { key: "dynamic", pattern: "dynamics?", label: "dynamic", pos: "n.", ipa: "/daɪˈnæmɪk/", definition: "The way people or things behave and affect one another in a particular situation.", zh: "（人或事物）相互作用的方式；动态" },
  { key: "subordination", pattern: "subordination", label: "subordination", pos: "n.", ipa: "/səˌbɔːrdɪˈneɪʃən/", definition: "The act or condition of treating someone or something as less important or lower in rank.", zh: "附属；从属" },
  { key: "wrestle", pattern: "wrestl(?:e|es|ed|ing)", label: "wrestle", pos: "v.", ipa: "/ˈresəl/", definition: "To struggle to deal with something difficult or complicated.", zh: "努力对付；努力处理；全力解决" },
  { key: "attest", pattern: "attest(?:s|ed|ing)?", label: "attest", pos: "v.", ipa: "/əˈtest/", definition: "To show or prove that something is true.", zh: "证实" },
  { key: "articulate", pattern: "articulat(?:e|es|ed|ing)", label: "articulate", pos: "v.", ipa: "/ɑːrˈtɪkjəleɪt/", definition: "To express thoughts or feelings clearly in words.", zh: "明确表达；清楚说明" },
  { key: "divine", pattern: "divine", label: "divine", pos: "adj.", ipa: "/dɪˈvaɪn/", definition: "Coming from or connected with God or a god.", zh: "天赐的；上帝的；神的" },
  { key: "take_on", pattern: "take(?:s|n|ing)?\\s+on", label: "take on", pos: "v. phr.", ipa: "/teɪk ɑːn/", definition: "To begin to have a particular quality, appearance, or role.", zh: "呈现；具有（某种特征）" },
  { key: "tempting", pattern: "tempting", label: "tempting", pos: "adj.", ipa: "/ˈtemptɪŋ/", definition: "Attractive or appealing, and making someone want to do or have something.", zh: "吸引人的；诱人的" },
  { key: "outgrow", pattern: "outgrow|outgrew|outgrown|outgrows|outgrowing", label: "outgrow", pos: "v.", ipa: "/ˌaʊtˈɡroʊ/", definition: "To stop doing something or lose interest in it as you grow older.", zh: "因长大而放弃；逐渐不再感兴趣" },
  { key: "gaze", pattern: "gaze", label: "gaze", pos: "n.", ipa: "/ɡeɪz/", definition: "A long, steady look at someone or something.", zh: "凝视；注视" },
  { key: "misdirect", pattern: "misdirect(?:s|ed|ing)?", label: "misdirect", pos: "v.", ipa: "/ˌmɪsdɪˈrekt/", definition: "To use or direct something in an inappropriate or mistaken way.", zh: "误用；使方向错误" },
  { key: "wayward", pattern: "wayward", label: "wayward", pos: "adj.", ipa: "/ˈweɪwərd/", definition: "Difficult to control or predict.", zh: "难以控制的；任性的" },
  { key: "allure", pattern: "allure", label: "allure", pos: "n.", ipa: "/əˈlʊr/", definition: "The quality of being attractive, exciting, or tempting.", zh: "诱惑力；吸引力" },
  { key: "exigency", pattern: "exigenc(?:y|ies)", label: "exigency", pos: "n.", ipa: "/ˈeksɪdʒənsi/", definition: "An urgent need or demand that requires immediate attention.", zh: "急切需要；迫切要求" },
  { key: "tyrannical", pattern: "tyrannical", label: "tyrannical", pos: "adj.", ipa: "/tɪˈrænɪkəl/", definition: "Using power in a cruel or unfair way.", zh: "专横的；残暴的" },
  { key: "contingent", pattern: "contingent", label: "contingent", pos: "adj.", ipa: "/kənˈtɪndʒənt/", definition: "Depending on something that may or may not happen.", zh: "依情况而定的" },
  { key: "orbit", pattern: "orbit", label: "orbit", pos: "n.", ipa: "/ˈɔːrbɪt/", definition: "The curved path followed by an object around a planet, star, or moon.", zh: "轨道" },
  { key: "mutilation", pattern: "mutilation", label: "mutilation", pos: "n.", ipa: "/ˌmjuːtɪˈleɪʃən/", definition: "Severe damage to a person's body or to something's form or integrity.", zh: "切断；毁损；严重损坏" },
  { key: "will", pattern: "will", label: "will", pos: "v.", ipa: "/wɪl/", definition: "To deliberately choose or intend something; in the article, to will oneself free means to resolve to be free.", zh: "决意；凭意志促成" },
  { key: "conceive", pattern: "conceiv(?:e|es|ed|ing)", label: "conceive", pos: "v.", ipa: "/kənˈsiːv/", definition: "To form an idea, plan, or possibility in your mind.", zh: "构想；设想" },
];

export function LoveJointVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={loveJointArticle.paragraphs} terms={terms} idPrefix="love-joint-note" leadParagraph={loveJointArticle.dek} paragraphTranslations={loveJointArticle.paragraphTranslations} /><LoveJointExercises /></>;
}
