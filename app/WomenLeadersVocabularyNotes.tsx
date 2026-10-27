"use client";

import { womenLeadersArticle } from "./inquire-stereotype-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "groundbreaking", pattern: "groundbreaking", label: "groundbreaking", pos: "adj.", ipa: "/ˈɡraʊndˌbreɪkɪŋ/", definition: "New and important; introducing a major change in how something is done or understood.", zh: "开创性的；突破性的" },
  { key: "underrepresented", pattern: "underrepresented", label: "underrepresented", pos: "adj.", ipa: "/ˌʌndərˌreprɪˈzentɪd/", definition: "Not represented in a group or activity in numbers that are proportionate to the population.", zh: "代表性不足的；比例过低的" },
  { key: "disparity", pattern: "disparit(?:y|ies)", label: "disparity", pos: "n.", ipa: "/dɪˈspærəti/", definition: "A noticeable difference or inequality between people or things.", zh: "差距；不平等；悬殊" },
  { key: "glacially", pattern: "glacially", label: "glacially", pos: "adv.", ipa: "/ˈɡleɪʃəli/", definition: "Extremely slowly; at a very slow pace.", zh: "极其缓慢地；冰川般地" },
  { key: "anecdote", pattern: "anecdotes?", label: "anecdote", pos: "n.", ipa: "/ˈænɪkdoʊt/", definition: "A short, often amusing or interesting story about a real person or event.", zh: "轶事；趣闻；短故事" },
  { key: "systematically", pattern: "systematically", label: "systematically", pos: "adv.", ipa: "/ˌsɪstəˈmætɪkli/", definition: "In an organized way, following a system or plan.", zh: "系统地；有计划地；有条理地" },
  { key: "compelling", pattern: "compelling", label: "compelling", pos: "adj.", ipa: "/kəmˈpelɪŋ/", definition: "Very convincing or interesting, and therefore difficult to ignore.", zh: "令人信服的；引人注目的；强有力的" },
  { key: "impostor_syndrome", pattern: "impost(?:o|e)r\\s+syndrome", label: "impostor syndrome", pos: "n.", ipa: "/ɪmˈpɑːstər ˌsɪndroʊm/", definition: "A persistent feeling of being a fraud despite evidence of one's success or ability.", zh: "冒名顶替综合征；骗子综合征" },
  { key: "pivotal", pattern: "pivotal", label: "pivotal", pos: "adj.", ipa: "/ˈpɪvətəl/", definition: "Extremely important because other things depend on it.", zh: "关键的；重要的；核心的" },
  { key: "preemptive", pattern: "preemptive", label: "preemptive", pos: "adj.", ipa: "/priˈemptɪv/", definition: "Done before someone else can act, or in order to prevent something.", zh: "先发制人的；预防性的" },
  { key: "exemplify", pattern: "exemplif(?:y|ies|ied|ying)", label: "exemplify", pos: "v.", ipa: "/ɪɡˈzemplɪfaɪ/", definition: "To be a typical example of something, or to illustrate it.", zh: "例证；作为……的典型例子" },
  { key: "capital", pattern: "capital", label: "capital", pos: "n.", ipa: "/ˈkæpɪtəl/", definition: "Money, property, or other resources used to create wealth or support an activity.", zh: "资本；资产；财富" },
  { key: "disproportionate", pattern: "disproportionate", label: "disproportionate", pos: "adj.", ipa: "/ˌdɪsprəˈpɔːrʃənət/", definition: "Too large or too small in comparison with something else.", zh: "不成比例的；不均衡的；不相称的" },
  { key: "equitably", pattern: "equitably", label: "equitably", pos: "adv.", ipa: "/ˈekwɪtəbli/", definition: "In a fair and impartial way.", zh: "公平地；公正地" },
  { key: "stigma", pattern: "stigmas?", label: "stigma", pos: "n.", ipa: "/ˈstɪɡmə/", definition: "A strong feeling of disapproval attached to a person or situation by society.", zh: "污名；耻辱；社会歧视" },
  { key: "prerequisite", pattern: "prerequisites?", label: "prerequisite", pos: "n.", ipa: "/ˌpriːˈrekwəzɪt/", definition: "Something that must exist or happen before something else is possible.", zh: "先决条件；前提；必要条件" },
  { key: "pervasive", pattern: "pervasive", label: "pervasive", pos: "adj.", ipa: "/pərˈveɪsɪv/", definition: "Present or noticeable throughout something; widespread.", zh: "普遍的；渗透的；弥漫的" },
  { key: "conundrum", pattern: "conundrums?", label: "conundrum", pos: "n.", ipa: "/kəˈnʌndrəm/", definition: "A difficult problem or question that seems to have no clear answer.", zh: "难题；谜题；困境" },
  { key: "internalize", pattern: "internaliz(?:e|es|ed|ing)|internalis(?:e|es|ed|ing)", label: "internalize", pos: "v.", ipa: "/ɪnˈtɜːrnəlaɪz/", definition: "To accept an idea or attitude so that it becomes part of your way of thinking.", zh: "内化；内在化；使内在化" },
  { key: "catch_22", pattern: "catch[- ]22", label: "catch-22", pos: "n.", ipa: "/ˌkætʃ twentiˈtuː/", definition: "A difficult situation in which you cannot succeed because you need something that you cannot get without first succeeding.", zh: "两难困境；进退两难的局面" },
  { key: "incremental", pattern: "incremental", label: "incremental", pos: "adj.", ipa: "/ˌɪŋkrəˈmentəl/", definition: "Increasing or developing gradually, in a series of small steps.", zh: "渐进的；逐步的；增量的" },
  { key: "intersecting", pattern: "intersect(?:s|ed|ing)?", label: "intersecting", pos: "adj.", ipa: "/ˌɪntərˈsektɪŋ/", definition: "Crossing or meeting at a point; having an effect on one another.", zh: "交叉的；相交的；交叉影响的" },
  { key: "cascading", pattern: "cascad(?:e|es|ed|ing)", label: "cascading", pos: "adj.", ipa: "/kæˈskeɪdɪŋ/", definition: "Happening in a series, with each event causing or affecting the next.", zh: "级联的；连锁的；层叠的" },
  { key: "sobering", pattern: "sobering", label: "sobering", pos: "adj.", ipa: "/ˈsoʊbərɪŋ/", definition: "Making you realize the seriousness of a situation.", zh: "令人清醒的；令人警醒的" },
  { key: "assertively", pattern: "assertively", label: "assertively", pos: "adv.", ipa: "/əˈsɜːrtɪvli/", definition: "In a confident and direct way that makes your views clear.", zh: "果断地；坚定地；坚决地" },
  { key: "systemic", pattern: "systemic", label: "systemic", pos: "adj.", ipa: "/sɪˈstemɪk/", definition: "Relating to a whole system, especially its structure or organization.", zh: "系统性的；制度性的；结构性的" },
  { key: "intersectionality", pattern: "intersectionality", label: "intersectionality", pos: "n.", ipa: "/ˌɪntərsekʃəˈnæləti/", definition: "The interaction of social identities and systems of discrimination, such as race, class, and gender.", zh: "交叉性；交叉理论" },
  { key: "marginalized", pattern: "marginaliz(?:e|es|ed|ing)|marginalis(?:e|es|ed|ing)", label: "marginalized", pos: "adj.", ipa: "/ˈmɑːrdʒɪnəlaɪzd/", definition: "Treated as unimportant or pushed to the edge of society or a group.", zh: "边缘化的；被排斥的" },
  { key: "tailored", pattern: "tailor(?:s|ed|ing)?", label: "tailored", pos: "adj.", ipa: "/ˈteɪlərd/", definition: "Made or adapted for a particular person, purpose, or situation.", zh: "量身定制的；专门设计的" },
  { key: "innovative", pattern: "innovative", label: "innovative", pos: "adj.", ipa: "/ˈɪnəveɪtɪv/", definition: "Using new ideas or methods; original and creative.", zh: "创新的；革新的" },
  { key: "sponsorship", pattern: "sponsorship", label: "sponsorship", pos: "n.", ipa: "/ˈspɑːnsərʃɪp/", definition: "Support or advocacy that helps someone advance, especially professionally.", zh: "赞助；支持；倡导" },
  { key: "reconceptualized", pattern: "reconceptualiz(?:e|es|ed|ing)|reconceptualis(?:e|es|ed|ing)", label: "reconceptualized", pos: "v.", ipa: "/ˌriːkənˈseptʃuəlaɪzd/", definition: "Formed a new understanding or way of thinking about something.", zh: "重新概念化；重新构想" },
  { key: "comprehensive", pattern: "comprehensive", label: "comprehensive", pos: "adj.", ipa: "/ˌkɑːmprɪˈhensɪv/", definition: "Including many details or aspects; complete and broad in scope.", zh: "全面的；综合的；广泛的" },
  { key: "nuanced", pattern: "nuanced", label: "nuanced", pos: "adj.", ipa: "/ˈnuːɑːnst/", definition: "Showing or involving subtle differences and careful distinctions.", zh: "细微的；微妙的；有细致差别的" },
  { key: "catalyzing", pattern: "catalyz(?:e|es|ed|ing)|catalys(?:e|es|ed|ing)", label: "catalyzing", pos: "v.", ipa: "/ˈkætəlaɪzɪŋ/", definition: "Causing or accelerating a change or process.", zh: "催化；促进；加速" },
];

export function WomenLeadersVocabularyArticleBody() {
  return <VocabularyArticleBody
    paragraphs={womenLeadersArticle.paragraphs}
    terms={terms}
    idPrefix="women-leaders-note"
    leadParagraph={womenLeadersArticle.dek}
    paragraphTranslations={womenLeadersArticle.paragraphTranslations}
  />;
}
