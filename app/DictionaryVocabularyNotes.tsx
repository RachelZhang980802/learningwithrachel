"use client";

import { DictionaryExercises } from "./DictionaryExercises";
import { dictionaryArticle } from "./inquire-technology-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "restructure", pattern: "restructur(?:e|es|ed|ing)", label: "restructure", pos: "v.", ipa: "/ˌriːˈstrʌktʃər/", definition: "To change the basic organization or structure of something.", zh: "改组；重建；调整" },
  { key: "reign", pattern: "reign", label: "reign", pos: "n.", ipa: "/reɪn/", definition: "The period of time during which someone or something is especially powerful or important.", zh: "鼎盛时期；风靡时期" },
  { key: "etymology", pattern: "etymolog(?:y|ies)", label: "etymology", pos: "n.", ipa: "/ˌetɪˈmɑːlədʒi/", definition: "The origin and history of a particular word.", zh: "词源" },
  { key: "idiosyncratic", pattern: "idiosyncratic", label: "idiosyncratic", pos: "adj.", ipa: "/ˌɪdiəsɪŋˈkrætɪk/", definition: "Peculiar or individual; of or relating to a person’s distinctive way of doing things.", zh: "特殊的；独特的" },
  { key: "spell_check", pattern: "spell[-–]check(?:s|ed|ing)?", label: "spell-check", pos: "n.", ipa: "/ˈspeltʃek/", definition: "A check of spelling in a text file using a spellchecker.", zh: "（对文档的）拼写检查" },
  { key: "autocorrect", pattern: "autocorrect", label: "autocorrect", pos: "n.", ipa: "/ˌɔːtoʊkəˈrekt/", definition: "A software feature that automatically corrects spelling or grammar mistakes, or suggests corrections.", zh: "自动更正；自动纠错功能" },
  { key: "cinder_block", pattern: "cinder[- ]block", label: "cinder block", pos: "n.", ipa: "/ˈsɪndər blɑːk/", definition: "A light building block made of sand, coal ashes, and cement.", zh: "煤渣砌块；焦渣砖" },
  { key: "fail_safe", pattern: "fail[-–]safe", label: "fail-safe", pos: "adj.", ipa: "/ˈfeɪl seɪf/", definition: "Certain not to fail or designed to remain safe if something goes wrong.", zh: "万无一失的；故障安全的" },
  { key: "originality", pattern: "originality", label: "originality", pos: "n.", ipa: "/əˌrɪdʒəˈnæləti/", definition: "The quality of being new and interesting in a way that differs from what existed before.", zh: "独创性；创意；独特构思" },
  { key: "infinite", pattern: "infinite", label: "infinite", pos: "adj.", ipa: "/ˈɪnfɪnət/", definition: "Having no limits; endless.", zh: "无限的；无穷尽的" },
  { key: "debut", pattern: "debuts?", label: "debut", pos: "n.", ipa: "/ˈdeɪbjuː/", definition: "The first public appearance of a performer or sports player.", zh: "（演员、运动员等的）首次亮相；初次登台" },
  { key: "codify", pattern: "codif(?:y|ies|ied|ying)", label: "codify", pos: "v.", ipa: "/ˈkoʊdɪfaɪ/", definition: "To arrange laws, principles, or facts into a system or code.", zh: "将（法律、原则、事实等）编集成典；编纂" },
  { key: "connotation", pattern: "connotations?", label: "connotation", pos: "n.", ipa: "/ˌkɑːnəˈteɪʃən/", definition: "An idea suggested by a word in addition to its main meaning.", zh: "含义；隐含意义" },
  { key: "lexicographer", pattern: "lexicographers?", label: "lexicographer", pos: "n.", ipa: "/ˌleksɪˈkɑːɡrəfər/", definition: "A person who writes and edits dictionaries.", zh: "词典编纂者" },
  { key: "verify", pattern: "verif(?:y|ies|ied|ying)", label: "verify", pos: "v.", ipa: "/ˈverɪfaɪ/", definition: "To prove, show, find out, or state that something is true or correct.", zh: "证明；核实；查证" },
  { key: "colloquial", pattern: "colloquial", label: "colloquial", pos: "adj.", ipa: "/kəˈloʊkwiəl/", definition: "Used in conversation but not in formal speech or writing.", zh: "会话的；口语的" },
  { key: "ubiquitous", pattern: "ubiquitous", label: "ubiquitous", pos: "adj.", ipa: "/juːˈbɪkwɪtəs/", definition: "Seeming to be everywhere or very common.", zh: "似乎无所不在的；十分普遍的" },
  { key: "absent", pattern: "absent", label: "absent", pos: "adj.", ipa: "/ˈæbsənt/", definition: "Not present at all; not existing.", zh: "不存在的；没有的" },
  { key: "genial", pattern: "genial", label: "genial", pos: "adj.", ipa: "/ˈdʒiːniəl/", definition: "Friendly and cheerful.", zh: "友好的；亲切的；欢快的" },
  { key: "authoritative", pattern: "authoritative", label: "authoritative", pos: "adj.", ipa: "/əˈθɔːrətətɪv/", definition: "Able to be trusted and respected as true and correct.", zh: "权威性的" },
  { key: "vernacular", pattern: "vernacular", label: "vernacular", pos: "n.", ipa: "/vəˈnækjələr/", definition: "The language spoken by ordinary people in a particular country or region.", zh: "方言；本土语" },
  { key: "uniform", pattern: "uniform", label: "uniform", pos: "adj.", ipa: "/ˈjuːnɪfɔːrm/", definition: "Not varying; the same in all parts and at all times.", zh: "一致的；统一的；一律的" },
  { key: "arbitrarily", pattern: "arbitrarily", label: "arbitrarily", pos: "adv.", ipa: "/ˌɑːrbɪˈtrerəli/", definition: "In a way that does not seem based on a reason or plan and can seem unfair.", zh: "任意地；武断地；随心所欲地" },
  { key: "nonstandard", pattern: "nonstandard", label: "nonstandard", pos: "adj.", ipa: "/ˌnɑːnˈstændərd/", definition: "Not considered correct by most educated people.", zh: "非标准的；不规范的" },
  { key: "legitimize", pattern: "legitim(?:ize|izes|ized|izing|ise|ises|ised|ising)", label: "legitimize", pos: "v.", ipa: "/lɪˈdʒɪtəmaɪz/", definition: "To officially allow, approve, or make something seem acceptable or reasonable.", zh: "使（尤其是坏事）合法化；正式批准（或认可）；证明……为有理（或正当）" },
  { key: "contrasting", pattern: "contrasting", label: "contrasting", pos: "adj.", ipa: "/kənˈtræstɪŋ/", definition: "Very different in style, colour, or attitude.", zh: "（在式样、颜色或态度上）极不相同的；差异大的" },
  { key: "deliberate", pattern: "deliberate", label: "deliberate", pos: "adj.", ipa: "/dɪˈlɪbərət/", definition: "Done or decided after careful thought.", zh: "深思熟虑的；慎重的" },
  { key: "profusion", pattern: "profusion", label: "profusion", pos: "n.", ipa: "/prəˈfjuːʒən/", definition: "A very large quantity of something.", zh: "大量；众多" },
  { key: "for_the_sake", pattern: "for\\s+the\\s+sake\\s+of", label: "for the sake of", pos: "phr.", ipa: "/fər ðə seɪk əv/", definition: "In order to help someone or something, or because you like them or it.", zh: "为了某人（或某事）起见；因某人（或某事）的缘故" },
  { key: "catalyze", pattern: "catalyz(?:e|es|ed|ing)", label: "catalyze", pos: "v.", ipa: "/ˈkætəlaɪz/", definition: "To cause a process or situation to become active or develop more quickly.", zh: "促成；激发；引发" },
  { key: "stifle", pattern: "stifl(?:e|es|ed|ing)", label: "stifle", pos: "v.", ipa: "/ˈstaɪfəl/", definition: "To prevent something from happening or to prevent a feeling from being expressed.", zh: "压制；扼杀；阻止；抑制" },
  { key: "insincerity", pattern: "insincerity", label: "insincerity", pos: "n.", ipa: "/ˌɪnsɪnˈserəti/", definition: "The practice of pretending to feel something that you do not really feel, or not meaning what you say.", zh: "虚伪；虚情假意" },
  { key: "brag", pattern: "brags?", label: "brag", pos: "v.", ipa: "/bræɡ/", definition: "To talk too proudly about something you own or something you have done.", zh: "吹嘘；自吹自擂" },
  { key: "surrender_to", pattern: "surrender(?:s|ed|ing)?\\s+to", label: "surrender to", pos: "v. phr.", ipa: "/səˈrendər tuː/", definition: "To allow yourself to be controlled or influenced by something.", zh: "听任某事物摆布；屈服于某事物" },
  { key: "hands_off", pattern: "hands[-–]off", label: "hands-off", pos: "adj.", ipa: "/ˌhændz ˈɔːf/", definition: "Dealing with people or a situation by not becoming involved and allowing them to act as they choose.", zh: "不介入的；放手的" },
  { key: "derivative", pattern: "derivative", label: "derivative", pos: "adj.", ipa: "/dɪˈrɪvətɪv/", definition: "Copied from something else; lacking new or original ideas.", zh: "模仿他人的；缺乏独创性的" },
  { key: "leaf_through", pattern: "leaf(?:s|ed|ing)?\\s+through", label: "leaf through", pos: "v. phr.", ipa: "/liːf θruː/", definition: "To quickly turn over the pages of a book without reading them carefully.", zh: "匆匆翻阅；浏览" },
  { key: "cede", pattern: "cedes?", label: "cede", pos: "v.", ipa: "/siːd/", definition: "To give control of something to another person, group, or government.", zh: "放弃；割让；转让" },
  { key: "conviction", pattern: "conviction", label: "conviction", pos: "n.", ipa: "/kənˈvɪkʃən/", definition: "A firmly held belief or opinion.", zh: "坚定的信仰；深信的观点" },
  { key: "bestow", pattern: "bestows?", label: "bestow", pos: "v.", ipa: "/bɪˈstoʊ/", definition: "To give something to somebody, especially to show how much they are respected.", zh: "（将……）给予；授予；献给" },
  { key: "crucible", pattern: "crucible", label: "crucible", pos: "n.", ipa: "/ˈkruːsɪbəl/", definition: "A place or situation in which people or ideas are tested severely, often creating something new or exciting.", zh: "熔炉；严峻的考验；磨炼" },
  { key: "catalog", pattern: "catalog(?:s|ed|ing)?", label: "catalog", pos: "v.", ipa: "/ˈkætəlɔːɡ/", definition: "To list or describe something in an organized way.", zh: "把……编入目录；列举" },
  { key: "mechanized", pattern: "mechanized", label: "mechanized", pos: "adj.", ipa: "/ˈmekənaɪzd/", definition: "Using machines instead of people or animals to do work.", zh: "机械化的" },
  { key: "erode", pattern: "erod(?:e|es|ed|ing)", label: "erode", pos: "v.", ipa: "/ɪˈroʊd/", definition: "To gradually destroy or weaken something over a period of time.", zh: "逐渐毁坏；削弱；损害" }
];

export function DictionaryVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={dictionaryArticle.paragraphs} terms={terms} idPrefix="dictionary-note" leadParagraph={dictionaryArticle.dek} paragraphTranslations={dictionaryArticle.paragraphTranslations} /><DictionaryExercises /></>;
}
