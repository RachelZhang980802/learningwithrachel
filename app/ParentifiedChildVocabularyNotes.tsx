"use client";

import { ParentifiedChildExercises } from "./ParentifiedChildExercises";
import { parentifiedChildArticle } from "./inquire-family-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "tend_to", pattern: "tend(?:s|ed|ing)?\\s+to", label: "tend to", pos: "v. phr.", ipa: "/tend tuː/", definition: "To deal with the problems or needs of a person or thing.", zh: "照料；照顾；关心" },
  { key: "shade", pattern: "shades?", label: "shade", pos: "n.", ipa: "/ʃeɪd/", definition: "A type or variation of something.", zh: "种类；差别" },
  { key: "pervasive", pattern: "pervasive", label: "pervasive", pos: "adj.", ipa: "/pərˈveɪsɪv/", definition: "Present or noticeable in every part of a thing or place.", zh: "弥漫的；遍布的" },
  { key: "discord", pattern: "discord", label: "discord", pos: "n.", ipa: "/ˈdɪskɔːrd/", definition: "A state of not agreeing or sharing opinions.", zh: "看法不一致；缺乏共识" },
  { key: "channel", pattern: "channel(?:s|ed|ing|led|ling)?", label: "channel", pos: "v.", ipa: "/ˈtʃænəl/", definition: "To direct something into a particular place or situation.", zh: "把……导入；引导" },
  { key: "decimate", pattern: "decimat(?:e|es|ed|ing)", label: "decimate", pos: "v.", ipa: "/ˈdesɪmeɪt/", definition: "To destroy a very large number of people or things in a group.", zh: "大批杀死；大量毁灭" },
  { key: "inconceivable", pattern: "inconceivable", label: "inconceivable", pos: "adj.", ipa: "/ˌɪnkənˈsiːvəbl/", definition: "Impossible to imagine or think of.", zh: "不能想象的；不可思议的" },
  { key: "misstep", pattern: "missteps?", label: "misstep", pos: "n.", ipa: "/ˌmɪsˈstep/", definition: "A mistake, especially one caused by not understanding a situation correctly.", zh: "（尤指判断上的）错误；失策" },
  { key: "indefinitely", pattern: "indefinitely", label: "indefinitely", pos: "adv.", ipa: "/ɪnˈdefənətli/", definition: "To an unlimited or unspecified degree or extent.", zh: "（程度）无限地；不确定地" },
  { key: "reciprocity", pattern: "reciprocity", label: "reciprocity", pos: "n.", ipa: "/ˌresɪˈprɑːsəti/", definition: "A situation in which people or groups provide the same help or advantages to each other.", zh: "互惠；互助；互换" },
  { key: "incur", pattern: "incur(?:s|red|ring)?", label: "incur", pos: "v.", ipa: "/ɪnˈkɜːr/", definition: "To experience or bring something unpleasant upon yourself as a result of your actions.", zh: "招致；遭受" },
  { key: "mediate", pattern: "mediat(?:e|es|ed|ing)", label: "mediate", pos: "v.", ipa: "/ˈmiːdieɪt/", definition: "To talk to two people or groups in order to help them agree or find a solution.", zh: "调解；调停；斡旋" },
  { key: "fit_the_bill", pattern: "fit(?:s|ting)?\\s+the\\s+bill", label: "fit the bill", pos: "v. phr.", ipa: "/fɪt ðə bɪl/", definition: "To have the qualities that someone needs or has asked for.", zh: "满足要求；适合需要" },
  { key: "weigh_down", pattern: "weigh(?:s|ed|ing)?\\s+down", label: "weigh down", pos: "v. phr.", ipa: "/weɪ daʊn/", definition: "To make someone feel worried, sad, or unable to move forward easily.", zh: "使疲惫不堪；使苦恼；使焦虑" },
  { key: "conscientiousness", pattern: "conscientiousness", label: "conscientiousness", pos: "n.", ipa: "/ˌkɑːnʃiˈenʃəsnəs/", definition: "The trait of being painstaking and careful.", zh: "尽责性" },
  { key: "impoverished", pattern: "impoverished", label: "impoverished", pos: "adj.", ipa: "/ɪmˈpɑːvərɪʃt/", definition: "Poor in quality because something is missing.", zh: "贫乏的；贫瘠的" },
  { key: "run_on", pattern: "run(?:s|ning)?\\s+on", label: "run on", pos: "v. phr.", ipa: "/rʌn ɑːn/", definition: "If a machine runs on a particular type or supply of power, it uses that power to work.", zh: "靠（某种动力）运转" },
  { key: "persona", pattern: "persona", label: "persona", pos: "n.", ipa: "/pərˈsoʊnə/", definition: "The particular type of character a person seems to have, often different from their real or private character.", zh: "（与本人真实品格不一致的）表面形象；外在性格" },
  { key: "foreground", pattern: "foreground(?:s|ed|ing)?", label: "foreground", pos: "v.", ipa: "/ˈfɔːɡraʊnd/", definition: "To give the most importance to a particular subject.", zh: "强调；突出（某事物的重要性）" },
  { key: "psychopathology", pattern: "psychopatholog(?:y|ies)", label: "psychopathology", pos: "n.", ipa: "/ˌsaɪkoʊpəˈθɑːlədʒi/", definition: "Features of people’s mental health considered collectively.", zh: "心理（不）健康状况" },
  { key: "masochistic", pattern: "masochistic", label: "masochistic", pos: "adj.", ipa: "/ˌmæsəˈkɪstɪk/", definition: "Describes behaviour that seems to seek situations causing suffering or great difficulty.", zh: "受虐狂的；自虐的" },
  { key: "break_away_from", pattern: "(?:break(?:s|ing)?|broken)\\s+away\\s+from", label: "break away from", pos: "v. phr.", ipa: "/breɪk əˈweɪ frəm/", definition: "To free yourself from something or someone that restricts or controls you.", zh: "摆脱束缚或控制" },
  { key: "compliant", pattern: "compliant", label: "compliant", pos: "adj.", ipa: "/kəmˈplaɪənt/", definition: "Willing to do what other people want you to do.", zh: "顺从的" }
];

export function ParentifiedChildVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={parentifiedChildArticle.paragraphs} terms={terms} idPrefix="parentified-child-note" /><ParentifiedChildExercises /></>;
}
