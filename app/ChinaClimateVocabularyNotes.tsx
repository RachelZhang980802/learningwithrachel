"use client";

import { ChinaClimateExercises } from "./ChinaClimateExercises";

import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";
import { chinaClimateLeaderArticle } from "./inquire-china-climate-article";

const climateTerms: readonly VocabularyNoteTerm[] = [
  { key: "step_back", pattern: "step\\s+back\\s+from", label: "step back from", pos: "v. phr.", ipa: "/stɛp bæk frəm/", definition: "To reduce or pause one's involvement in an activity or situation.", zh: "从……中抽身；减少对……的参与" },
  { key: "swear_in", pattern: "was\\s+sworn\\s+in", label: "swear somebody in (was sworn in)", pos: "v. phr.", ipa: "/sweər ɪn/", definition: "To formally introduce a new official or leader at a special ceremony where they promise to perform their duties.", zh: "使某人宣誓就职" },
  { key: "reverse", pattern: "revers(?:e|es|ed|ing)", label: "reverse", pos: "v.", ipa: "/rɪˈvɜːrs/", definition: "To change a previous decision, law, or action so that the opposite is done.", zh: "撤销；推翻；使逆转" },
  { key: "scrap", pattern: "scrap(?:s|ped|ping)?", label: "scrap", pos: "v.", ipa: "/skræp/", definition: "To cancel or get rid of something that is no longer practical or useful.", zh: "放弃；废除；抛弃" },
  { key: "retreat", pattern: "retreat(?:s|ed|ing)?", label: "retreat", pos: "n. / v.", ipa: "/rɪˈtriːt/", definition: "A change away from a position or course of action, often because it has become difficult.", zh: "退却；退缩；改变立场" },
  { key: "void", pattern: "void", label: "void", pos: "n.", ipa: "/vɔɪd/", definition: "An empty space or a situation in which something important is missing.", zh: "空白；缺口" },
  { key: "mantle", pattern: "mantle", label: "mantle", pos: "n.", ipa: "/ˈmæntəl/", definition: "An important role or responsibility, especially one passed from one person or group to another.", zh: "重要职责；（接过的）角色" },
  { key: "laggard", pattern: "laggard", label: "laggard", pos: "n.", ipa: "/ˈlæɡərd/", definition: "A person, group, or country that moves or develops more slowly than others.", zh: "落后者；发展迟缓者" },
  { key: "prowess", pattern: "prowess", label: "prowess", pos: "n.", ipa: "/ˈpraʊəs/", definition: "Great skill or ability in a particular activity or field.", zh: "高超技能；卓越能力" },
  { key: "overtake", pattern: "overtak(?:e|es|en|ing)", label: "overtake", pos: "v.", ipa: "/ˌoʊvərˈteɪk/", definition: "To become greater in number, amount, or importance than something else.", zh: "超过；超越" },
  { key: "volatile", pattern: "volatile", label: "volatile", pos: "adj.", ipa: "/ˈvɑːlətəl/", definition: "Likely to change suddenly, and therefore difficult to depend on or control.", zh: "易变的；不稳定的" },
  { key: "irreversible", pattern: "irreversible", label: "irreversible", pos: "adj.", ipa: "/ˌɪrɪˈvɜːrsəbəl/", definition: "Impossible to change back to the way something was before.", zh: "不可逆的；无法挽回的" },
  { key: "well_below", pattern: "well\\s+below", label: "well below", pos: "phr.", ipa: "/wel bɪˈloʊ/", definition: "Significantly lower than a particular level, standard, or expectation.", zh: "远低于；大大低于" },
  { key: "fall_short", pattern: "fall\\s+well\\s+short\\s+of", label: "fall well short of", pos: "v. phr.", ipa: "/fɔːl wel ʃɔːrt əv/", definition: "To be significantly less than a goal, standard, or requirement.", zh: "远未达到；远不及" },
  { key: "step_up", pattern: "step(?:s|ped|ping)?\\s+up", label: "step up", pos: "v. phr.", ipa: "/stɛp ʌp/", definition: "To take action or accept a responsibility, especially when it is needed.", zh: "采取行动；挺身承担" },
  { key: "engagement", pattern: "engagement", label: "engagement", pos: "n.", ipa: "/ɪnˈɡeɪdʒmənt/", definition: "Involvement or active participation in an activity or issue.", zh: "参与；投入" },
];

export function ChinaClimateVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={chinaClimateLeaderArticle.paragraphs} terms={climateTerms} idPrefix="china-climate-note" sectionHeadings={chinaClimateLeaderArticle.sectionHeadings} /><ChinaClimateExercises /></>;
}
