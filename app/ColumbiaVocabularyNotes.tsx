"use client";

import { ColumbiaExercises } from "./ColumbiaExercises";
import { columbiaArticle } from "./inquire-feature-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "authoritarian", pattern: "authoritarian(?:ism)?", label: "authoritarian", pos: "adj.", ipa: "/əˌθɔːrəˈteriən/", definition: "Believing people should obey authority and accept strong state control, even when it is unfair.", zh: "威权主义的；专制的" },
  { key: "autocrat", pattern: "autocrats?", label: "autocrat", pos: "n.", ipa: "/ˈɔːtəkræt/", definition: "A ruler who has complete power over a country or organization.", zh: "独裁者；专制统治者" },
  { key: "devastating", pattern: "devastating", label: "devastating", pos: "adj.", ipa: "/ˈdevəsteɪtɪŋ/", definition: "Causing a great deal of damage or destruction.", zh: "破坏性极大的；毁灭性的" },
  { key: "grant", pattern: "grants?", label: "grant", pos: "n.", ipa: "/ɡrænt/", definition: "Money given by a government or organization for a particular purpose.", zh: "（政府、机构的）拨款" },
  { key: "politicize", pattern: "politiciz(?:e|es|ed|ing)", label: "politicize", pos: "v.", ipa: "/pəˈlɪtɪsaɪz/", definition: "To make something political or more strongly connected with political issues.", zh: "使政治化；使具有政治性" },
  { key: "allegation", pattern: "allegations?", label: "allegation", pos: "n.", ipa: "/ˌæləˈɡeɪʃən/", definition: "A public statement that someone has done something wrong, made without proof.", zh: "（无证据的）说法；指控" },
  { key: "antisemitism", pattern: "antisemitism", label: "antisemitism", pos: "n.", ipa: "/ˌæntiˈsemɪtɪzəm/", definition: "Hostility, prejudice, or unfair treatment directed toward Jewish people.", zh: "反犹太主义；对犹太人的偏见" },
  { key: "administration", pattern: "administrations?", label: "administration", pos: "n.", ipa: "/ədˌmɪnɪˈstreɪʃən/", definition: "The government of a country, especially the United States.", zh: "（尤指美国的）政府；行政当局" },
  { key: "pledge", pattern: "pledges?d?", label: "pledge", pos: "v.", ipa: "/pledʒ/", definition: "To make a formal or serious promise to do something.", zh: "保证给予（或做）；正式承诺" },
  { key: "dissent", pattern: "dissent", label: "dissent", pos: "n.", ipa: "/dɪˈsent/", definition: "An opinion that differs from one officially accepted or commonly held.", zh: "（与官方的）不同意见；异议" },
  { key: "allergic", pattern: "(?:be|is|are|was|were|being)\\s+allergic\\s+to", label: "be allergic to", pos: "adj. phr.", ipa: "/bi əˈlɜːrdʒɪk tuː/", definition: "To have a strong dislike or negative reaction to someone or something.", zh: "对……十分反感；厌恶" },
  { key: "invariably", pattern: "invariably", label: "invariably", pos: "adv.", ipa: "/ɪnˈveriəbli/", definition: "Always or almost always; in every case.", zh: "始终如一地；一贯地" },
  { key: "silence", pattern: "silenc(?:e|es|ed|ing)|silent", label: "silence / silent", pos: "n./adj.", ipa: "/ˈsaɪləns/ · /ˈsaɪlənt/", definition: "A lack of public response; not speaking or making a response.", zh: "沉默；不发声的" },
  { key: "ring", pattern: "rings?", label: "ring", pos: "v.", ipa: "/rɪŋ/", definition: "To seem to have a particular quality or character when heard or considered.", zh: "听上去；听起来（具有某种品质）" },
  { key: "hollow", pattern: "hollow", label: "hollow", pos: "adj.", ipa: "/ˈhɑːloʊ/", definition: "Having no real meaning, worth, or sincere feeling.", zh: "（语言、事件或人）虚假的；无价值的" },
  { key: "weaponize", pattern: "weaponiz(?:e|es|ed|ing)", label: "weaponize", pos: "v.", ipa: "/ˈwepənaɪz/", definition: "To use something as a weapon or make it suitable for harming someone or something.", zh: "使适合作武器；使武器化" },
  { key: "lie_low", pattern: "(?:lie|lies|lay|lying)\\s+low", label: "lie low", pos: "v. phr.", ipa: "/laɪ loʊ/", definition: "To avoid attracting attention or making yourself noticeable.", zh: "尽量不引起注意；不露面" },
  { key: "mitigate", pattern: "mitigat(?:e|es|ed|ing)", label: "mitigate", pos: "v.", ipa: "/ˈmɪtɪɡeɪt/", definition: "To make something less harmful, serious, or painful.", zh: "减轻；缓和" },
  { key: "denounce", pattern: "denounc(?:e|es|ed|ing)", label: "denounce", pos: "v.", ipa: "/dɪˈnaʊns/", definition: "To publicly criticize or condemn someone or something as wrong.", zh: "谴责；指责；痛斥" },
  { key: "on_the_line", pattern: "on\\s+the\\s+line", label: "on the line", pos: "idiom", ipa: "/ɑːn ðə laɪn/", definition: "At risk of being lost, harmed, or put in danger.", zh: "处于风险中；有危险" },
  { key: "mounting", pattern: "mounting", label: "mounting", pos: "adj.", ipa: "/ˈmaʊntɪŋ/", definition: "Increasing in amount, strength, or importance, often causing concern.", zh: "上升的；增长的" },
  { key: "objectionable", pattern: "objectionable", label: "objectionable", pos: "adj.", ipa: "/əbˈdʒekʃənəbəl/", definition: "Unpleasant or offensive and likely to cause disapproval.", zh: "令人不快的；令人反感的" },
  { key: "concession", pattern: "concessions?", label: "concession", pos: "n.", ipa: "/kənˈseʃən/", definition: "Something that is allowed or given up to end an argument or make a situation less difficult.", zh: "让步；妥协" },
  { key: "undermine", pattern: "undermin(?:e|es|ed|ing)", label: "undermine", pos: "v.", ipa: "/ˌʌndərˈmaɪn/", definition: "To gradually make someone’s confidence, authority, or effectiveness weaker.", zh: "逐渐削弱；暗中损害" },
  { key: "confront", pattern: "confront(?:s|ed|ing)?", label: "confront", pos: "v.", ipa: "/kənˈfrʌnt/", definition: "To face someone or a difficult situation directly.", zh: "面对；对抗；与……对峙" },
  { key: "odds", pattern: "odds", label: "odds", pos: "n. pl.", ipa: "/ɑːdz/", definition: "The likelihood or probability that something will happen.", zh: "可能性；概率；几率" },
  { key: "cede", pattern: "ced(?:e|es|ed|ing)", label: "cede", pos: "v.", ipa: "/siːd/", definition: "To give control, power, or a right to someone else, often unwillingly.", zh: "割让；让给；转让" },
  { key: "countervailing", pattern: "countervailing", label: "countervailing", pos: "adj.", ipa: "/ˌkaʊntərˈveɪlɪŋ/", definition: "Having an equal but opposite effect.", zh: "抵消的；抗衡的" },
  { key: "counter_argument", pattern: "counter[- ]argument", label: "counter-argument", pos: "n.", ipa: "/ˈkaʊntər ˌɑːrɡjəmənt/", definition: "An argument or set of reasons put forward to oppose another argument.", zh: "反论据；反驳理由" },
  { key: "vigorous", pattern: "vigorous", label: "vigorous", pos: "adj.", ipa: "/ˈvɪɡərəs/", definition: "Very active, determined, or full of energy.", zh: "充满活力的；强有力的" },
  { key: "rally", pattern: "rall(?:y|ies|ied|ying)", label: "rally", pos: "v.", ipa: "/ˈræli/", definition: "To come together or bring people together to support a person or cause.", zh: "召集；集合；团结起来支持" },
  { key: "existential", pattern: "existential", label: "existential", pos: "adj.", ipa: "/ˌeɡzɪˈstenʃəl/", definition: "Relating to existence, especially human existence and its meaning or survival.", zh: "有关（生死）存在的；关乎存亡的" },
  { key: "fabric", pattern: "fabric", label: "fabric", pos: "n.", ipa: "/ˈfæbrɪk/", definition: "The basic structure of a society, organization, or system.", zh: "（社会、机构等的）结构" },
  { key: "stake", pattern: "stake", label: "stake", pos: "n.", ipa: "/steɪk/", definition: "An important interest or share in the success of a plan or organization.", zh: "重大利益；利害关系" },
  { key: "stakeholder", pattern: "stakeholders?", label: "stakeholder", pos: "n.", ipa: "/ˈsteɪkˌhoʊldər/", definition: "A person or group with an interest in an organization, project, or system.", zh: "参与人；利益相关者" },
  { key: "stature", pattern: "stature", label: "stature", pos: "n.", ipa: "/ˈstætʃər/", definition: "The importance and respect a person or institution has because of their abilities or achievements.", zh: "声望；地位" },
  { key: "mobilize", pattern: "mobiliz(?:e|es|ed|ing)", label: "mobilize", pos: "v.", ipa: "/ˈmoʊbəlaɪz/", definition: "To organize people or resources to work together toward a particular aim.", zh: "组织；鼓动；动员" },
  { key: "pastor", pattern: "pastor", label: "pastor", pos: "n.", ipa: "/ˈpæstər/", definition: "A minister in charge of a Christian church or group.", zh: "（尤指基督教的）牧师" },
  { key: "holocaust", pattern: "holocaust", label: "the Holocaust", pos: "n.", ipa: "/ˈhɑːləˌkɔːst/", definition: "The mass murder of millions of Jewish people and others by the Nazis during World War II.", zh: "大屠杀（尤指纳粹对犹太人的种族灭绝）" },
  { key: "come_for", pattern: "(?:come|comes|came)\\s+for", label: "come for", pos: "v. phr.", ipa: "/kʌm fɔːr/", definition: "To target or attack someone, or try to take something from them.", zh: "冲向；攻击；针对" }
];

const firstTheyCame = [
  "They came first for the Communists,",
  "and I didn't speak up",
  "because I wasn't a Communist.",
  "Then they came for the Jews,",
  "and I didn't speak up",
  "because I wasn't a Jew.",
  "Then they came for the trade unionists,",
  "and I didn't speak up",
  "because I wasn't a trade unionist.",
  "Then they came for the Catholics,",
  "and I didn't speak up",
  "because I was a Protestant.",
  "Then they came for me,",
  "and by that time,",
  "there was no one left to speak up.",
].join("\n");

export function ColumbiaVocabularyArticleBody() {
  const poemParagraphIndex = columbiaArticle.paragraphs.findIndex(paragraph => paragraph.includes("Martin Niemoller’s poem"));
  return <>
    <VocabularyArticleBody paragraphs={columbiaArticle.paragraphs} terms={terms} idPrefix="columbia-note" leadParagraph={columbiaArticle.dek} paragraphTranslations={columbiaArticle.paragraphTranslations} afterParagraph={index => index === poemParagraphIndex ? <details className="columbia-poem-note">
      <summary aria-label="Read First They Came" title="Read First They Came"><span aria-hidden="true">©️</span></summary>
      <div className="columbia-poem-note-content"><h3>First They Came</h3><p>{firstTheyCame}</p></div>
    </details> : null} />
    <ColumbiaExercises />
  </>;
}
