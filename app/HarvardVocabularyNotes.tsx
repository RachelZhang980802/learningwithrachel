"use client";

import { HarvardExercises } from "./HarvardExercises";
import { harvardArticle } from "./inquire-feature-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "acquiesce", pattern: "acquiesc(?:e|es|ed|ing)", label: "acquiesce", pos: "v.", ipa: "/ˌækwiˈes/", definition: "To accept or allow something to happen, even though you do not really agree with it.", zh: "默许；默认；勉强同意" },
  { key: "thrillingly", pattern: "thrillingly", label: "thrillingly", pos: "adv.", ipa: "/ˈθrɪlɪŋli/", definition: "In a way that is very exciting and pleasurable.", zh: "令人激动地；令人兴奋地" },
  { key: "understate", pattern: "understat(?:e|es|ed|ing)", label: "understate", pos: "v.", ipa: "/ˌʌndərˈsteɪt/", definition: "To describe something as less important, serious, or difficult than it really is.", zh: "淡化；轻描淡写" },
  { key: "accede_to", pattern: "acced(?:e|es|ed|ing)\\s+to", label: "accede to", pos: "v. phr.", ipa: "/ækˈsiːd tuː/", definition: "To agree to a demand or proposal, especially after first disagreeing with it.", zh: "同意；答应；应允" },
  { key: "relinquish", pattern: "relinquish(?:es|ed|ing)?", label: "relinquish", pos: "v.", ipa: "/rɪˈlɪŋkwɪʃ/", definition: "To give up a position, power, right, or possession, often unwillingly.", zh: "放弃；交出（权力、职位等）" },
  { key: "stunning", pattern: "stunning", label: "stunning", pos: "adj.", ipa: "/ˈstʌnɪŋ/", definition: "Very surprising or shocking.", zh: "令人震惊的" },
  { key: "submission", pattern: "submission", label: "submission", pos: "n.", ipa: "/səbˈmɪʃən/", definition: "The state of accepting another person’s control or authority.", zh: "屈服；顺从" },
  { key: "recruitment", pattern: "recruitment", label: "recruitment", pos: "n.", ipa: "/rɪˈkruːtmənt/", definition: "The process of finding and attracting people to join an organization or group.", zh: "招募；征募" },
  { key: "condition", pattern: "condition(?:s|ed|ing)?", label: "condition", pos: "v.", ipa: "/kənˈdɪʃən/", definition: "To control or decide the way something can happen or exist by setting a requirement.", zh: "使以……为条件" },
  { key: "jeopardize", pattern: "jeopardiz(?:e|es|ed|ing)", label: "jeopardize", pos: "v.", ipa: "/ˈdʒepərdaɪz/", definition: "To risk damaging or losing something important.", zh: "危及；使处于危险境地" },
  { key: "nonstarter", pattern: "non[- ]starter", label: "non-starter", pos: "n.", ipa: "/ˌnɑːnˈstɑːrtər/", definition: "A plan, idea, or proposal that has no chance of success or acceptance.", zh: "不可行的事物；无望成功的方案" },
  { key: "anguished", pattern: "anguished", label: "anguished", pos: "adj.", ipa: "/ˈæŋɡwɪʃt/", definition: "Showing severe mental or emotional pain, difficulty, or unhappiness.", zh: "极度痛苦的；苦恼的" },
  { key: "nonbinding", pattern: "nonbinding", label: "nonbinding", pos: "adj.", ipa: "/ˌnɑːnˈbaɪndɪŋ/", definition: "Not legally or officially required to be obeyed.", zh: "不具约束力的" },
  { key: "adjudicate", pattern: "adjudicat(?:e|es|ed|ing)", label: "adjudicate", pos: "v.", ipa: "/əˈdʒuːdɪkeɪt/", definition: "To officially decide who is right in a disagreement and what should be done.", zh: "裁决；判决" },
  { key: "noncompliance", pattern: "noncompliance", label: "noncompliance", pos: "n.", ipa: "/ˌnɑːnkəmˈplaɪəns/", definition: "Failure or refusal to obey a rule, law, or request.", zh: "不服从；不遵守" },
  { key: "resolution", pattern: "resolution", label: "resolution", pos: "n.", ipa: "/ˌrezəˈluːʃən/", definition: "A formal decision or statement agreed on by a group of people.", zh: "决议；正式决定" },
  { key: "flagrant", pattern: "flagrant", label: "flagrant", pos: "adj.", ipa: "/ˈfleɪɡrənt/", definition: "Shockingly noticeable because it openly shows disrespect for rules or standards.", zh: "公然的；明目张胆的" },
  { key: "comply_with", pattern: "comply\\s+with", label: "comply with", pos: "v. phr.", ipa: "/kəmˈplaɪ wɪð/", definition: "To do what you are required or asked to do.", zh: "遵守；依从" }
];

export function HarvardVocabularyArticleBody({ dek }: { dek: string }) {
  return <><VocabularyArticleBody paragraphs={harvardArticle.paragraphs} terms={terms} idPrefix="harvard-note" leadParagraph={dek} paragraphTranslations={harvardArticle.paragraphTranslations} /><HarvardExercises /></>;
}
