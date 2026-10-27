"use client";

import { GaslightExercises } from "./GaslightExercises";
import { gaslightArticle } from "./inquire-love-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

function term(key: string, pattern: string, label: string, pos: string, zh: string, definition: string): VocabularyNoteTerm {
  return { key, pattern, label, pos, ipa: "", zh, definition };
}

const terms: VocabularyNoteTerm[] = [
  term("big_deal", "mak(?:e|es|ing)\\s+(?:such\\s+)?a\\s+big\\s+deal\\s+out\\s+of", "make a big deal out of something", "v. phr.", "把某事小题大做", "To become too upset about something or make it seem more important than it is."),
  term("overreact", "overreact(?:s|ed|ing)?", "overreact", "v.", "反应过激；反应过火", "To react too strongly, especially to something unpleasant."),
  term("slip", "slip(?:s|ped|ping)?", "slip", "v.", "下降；退步；变差", "To fall to a lower level or become worse."),
  term("undermine", "undermin(?:e|es|ed|ing)", "undermine", "v.", "逐渐削弱（信心、权威等）；使逐步减少效力", "To gradually make someone's confidence or authority weaker."),
  term("trespass", "trespass(?:es|ed|ing)?\\s+on", "trespass on something", "v. phr.", "干涉；妨碍；插手", "To become involved in something that is not your concern."),
  term("gatekeeper", "gatekeepers?", "gatekeeper", "n.", "看门人；门卫", "A person who controls access to a place, opportunity, or resource."),
  term("precarious", "precarious", "precarious", "adj.", "不稳定的；不安全的；危险的", "Unstable or uncertain, and likely to become worse."),
  term("vulnerable", "vulnerable", "vulnerable", "adj.", "脆弱的；易受伤害的", "Easily hurt physically or emotionally."),
  term("manipulate", "manipulat(?:e|es|ed|ing)", "manipulate", "v.", "（暗中）控制；操纵；影响", "To control or influence someone, often in a dishonest way."),
  term("manipulation", "manipulation", "manipulation", "n.", "操作；操纵；控制", "The act of controlling or influencing someone, often unfairly."),
  term("antagonistic", "antagonistic", "antagonistic", "adj.", "对立情绪的；对抗的；敌对的", "Showing or feeling opposition or hostility."),
  term("rigid", "rigid", "rigid", "adj.", "顽固的；不通融的", "Unwilling to change ideas or behavior."),
  term("entitle", "entitl(?:e|es)", "entitle", "v.", "使有权利；使有资格", "To give someone the official right to do or have something."),
  term("entitled", "entitled", "entitled", "adj.", "有资格的", "Having the right to do or receive something."),
  term("sibling", "siblings?", "sibling", "n.", "兄弟；姐妹", "A brother or sister."),
  term("dysfunctional", "dysfunctional", "dysfunctional", "adj.", "机能失调的；功能障碍的", "Not working normally or properly."),
  term("derive_from", "deriv(?:e|es|ed|ing)\\s+from", "derive from something", "v. phr.", "从……衍生出；起源于；来自", "To come or develop from something."),
  term("flicker", "flicker(?:s|ed)?", "flicker", "v.", "闪烁；闪现；忽隐忽现；摇曳", "To shine or burn with an unsteady light."),
  term("flickering", "flickering", "flickering", "adj.", "闪烁的；摇曳的", "Shining or burning with an unsteady light."),
  term("masterclass", "masterclasses?", "masterclass", "n.", "大师课（由名家给优秀生讲授的课）", "A lesson given by an expert to highly skilled students."),
  term("predatory", "predatory", "predatory", "adj.", "掠夺性的；弱肉强食的；损人利己的", "Trying to gain something by exploiting another person's weakness."),
  term("captivate", "captivat(?:e|es|ed|ing)", "captivate", "v.", "迷住；使着迷", "To keep someone's attention by being interesting or attractive."),
  term("vernacular", "vernacular", "vernacular", "n.", "本国语；本地语；土话；方言", "The ordinary language spoken by people in a particular place."),
  term("deflection", "deflection", "deflection", "n.", "突然转向；偏斜；偏离", "A sudden change in direction, or the act of causing one."),
  term("coercive", "coercive", "coercive", "adj.", "强制的；胁迫的", "Using threats or force to make someone do something."),
  term("ubiquitous", "ubiquitous", "ubiquitous", "adj.", "似乎无所不在的；十分普遍的", "Seeming to be everywhere or very common."),
  term("groom", "groom(?:s|ed|ing)?", "groom", "v./n.", "培养；训练；培养过程", "To prepare or train someone for a role; grooming can also describe a gradual process of manipulation."),
  term("endgame", "endgame", "endgame", "n.", "（战争、争论、竞赛等的）最后阶段", "The final stage of a process, campaign, or conflict."),
  term("conceptualize", "conceptuali[sz](?:e|es|ed|ing)", "conceptualize", "v.", "形成概念；使概念化", "To form an idea or model of something."),
  term("conceptualisation", "conceptuali[sz]ations?", "conceptualisation", "n.", "概念化", "The process of forming an idea or concept."),
  term("inherent", "inherent", "inherent", "adj.", "固有的；内在的", "A basic or permanent part of someone or something."),
  term("capitulate", "capitulat(?:e|es|ed|ing)", "capitulate", "v.", "屈服；屈从", "To accept something you have opposed for a long time."),
  term("capitulation", "capitulation", "capitulation", "n.", "屈服", "The act of giving in or surrendering."),
  term("acutely", "acutely", "acutely", "adv.", "强烈地；深深地", "In a very strong or intense way."),
  term("cult", "cults?", "cult", "n.", "（有极端宗教信仰的）异教团体", "A small group with extreme beliefs, often outside established religion."),
  term("espouse", "espous(?:e|es|ed|ing)", "espouse", "v.", "支持；拥护；赞成（信仰、政策等）", "To give support to a belief, policy, or cause."),
  term("tenet", "tenets?", "tenet", "n.", "原则；信条；教义", "A formal principle or belief of a theory or group."),
  term("issue", "issu(?:e|es|ed|ing)", "issue", "v.", "宣布；公布；发出", "To make something known or officially available."),
  term("menacing", "menacing", "menacing", "adj.", "威胁的；恐吓的；危险的", "Seeming likely to cause harm or danger."),
  term("compensatory", "compensatory", "compensatory", "adj.", "弥补性质的；补偿性质的", "Intended to reduce the bad effects of something."),
  term("project_onto", "project\\w*\\s+(?:their|your|my|our|someone's|somebody's|the)\\s+(?:own\\s+)?\\w+\\s+onto\\s+(?:their|your|my|our|the|a|someone|somebody)\\s+\\w+", "project something onto someone", "v. phr.", "（不自觉地）把自己的感受或问题投射到别人身上", "To imagine that someone else has your own feelings or problems."),
  term("project", "project(?:s|ed|ing)?", "project", "v.", "投射；放映；投影", "To make light or an image fall onto a surface or screen."),
  term("magnify", "magnif(?:y|ies|ied|ying)", "magnify", "v.", "（问题）加重；放大", "To make something seem or become larger or more serious."),
  term("resolve", "resolve", "resolve", "n.", "决心；坚定的信念", "Strong determination to achieve something."),
  term("romantic", "romantic", "romantic", "adj.", "浪漫的；爱情的；情爱的", "Connected with love or a romantic relationship."),
  term("romanticisation", "romanticis(?:e|es|ed|ing|ation|ations)|romanticiz(?:e|es|ed|ing|ation|ations)", "romanticisation", "n.", "浪漫化", "The act of presenting something as more appealing or ideal than it really is."),
  term("facilitate", "facilitat(?:e|es|ed|ing)", "facilitate", "v.", "促进；促使；使便利", "To make an action or process possible or easier."),
  term("disorganized", "disorgani[sz]ed", "disorganized", "adj.", "计划不周的；缺乏组织的；杂乱无章的", "Badly planned or unable to organize things well."),
  term("play_on", "play\\s+(?:on|upon)", "play on/upon something", "v. phr.", "利用（情感等）", "To take advantage of someone's feelings or fears."),
  term("egalitarian", "egalitarian", "egalitarian", "adj.", "主张人人平等的；平等主义的", "Believing that everyone should have equal rights and opportunities."),
];

export function GaslightVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={gaslightArticle.paragraphs} paragraphTranslations={gaslightArticle.paragraphTranslations} terms={terms} idPrefix="gaslight-note" leadParagraph={gaslightArticle.dek} sectionHeadings={gaslightArticle.sectionHeadings} /><GaslightExercises /></>;
}
