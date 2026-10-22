"use client";

import { diversityArticle } from "./inquire-stereotype-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "sibling", pattern: "siblings?", label: "sibling", pos: "n.", ipa: "/ˈsɪblɪŋ/", definition: "A brother or sister.", zh: "兄弟姐妹；兄；弟；姐；妹" },
  { key: "wear_off", pattern: "wore\\s+off", label: "wear off", pos: "v. phr.", ipa: "/wer ɔːf/", definition: "To gradually disappear or become weaker.", zh: "逐渐消失" },
  { key: "immigrant", pattern: "immigrants?", label: "immigrant", pos: "n.", ipa: "/ˈɪmɪɡrənt/", definition: "A person who moves to another country to live there permanently.", zh: "移民；移民者；外来移民；侨民；入境移民" },
  { key: "ponder", pattern: "ponder(?:s|ed|ing)?", label: "ponder", pos: "v.", ipa: "/ˈpɑːndər/", definition: "To think carefully about something, especially before making a decision.", zh: "思考；沉思；琢磨；考虑" },
  { key: "argentina", pattern: "Argentina", label: "Argentina", pos: "n.", ipa: "/ˌɑːrdʒənˈtiːnə/", definition: "A country in South America.", zh: "阿根廷；阿根廷共和国；女子名" },
  { key: "peanut", pattern: "peanuts?", label: "peanut", pos: "n.", ipa: "/ˈpiːnʌt/", definition: "An edible seed that grows underground in a shell; a groundnut.", zh: "花生；很少的钱" },
  { key: "fluent", pattern: "fluent", label: "fluent", pos: "adj.", ipa: "/ˈfluːənt/", definition: "Able to speak or write a language easily, accurately, and smoothly.", zh: "（尤指外语）流利的；文字流畅的；流利的；通畅的；流畅熟练的" },
  { key: "obsolete", pattern: "obsolete", label: "obsolete", pos: "adj.", ipa: "/ˌɑːbsəˈliːt/", definition: "No longer used because something newer or better exists.", zh: "淘汰的；废弃的；过时的" },
  { key: "commonality", pattern: "commonalit(?:y|ies)", label: "commonality", pos: "n.", ipa: "/ˌkɑːməˈnæləti/", definition: "A feature or quality shared by two or more people or things.", zh: "共同特征；共性" },
  { key: "overlap", pattern: "overlaps?|overlapping", label: "overlap", pos: "v.", ipa: "/ˌoʊvərˈlæp/", definition: "To partly cover the same area, time, or subject, or to have features in common.", zh: "重叠；（物体或时间上）部分重叠；交叠；部分重叠" },
  { key: "conflict", pattern: "conflicts?", label: "conflict", pos: "n.", ipa: "/ˈkɑːnflɪkt/", definition: "A serious disagreement or argument; a state of opposition between people or groups.", zh: "冲突；争执；争论；（军事）冲突；战斗；抵触；矛盾；不一致" },
  { key: "embrace", pattern: "embrac(?:e|es|ed|ing)", label: "embrace", pos: "v.", ipa: "/ɪmˈbreɪs/", definition: "To accept an idea, change, or situation willingly; to include or contain.", zh: "拥抱；欣然接受；乐意采纳（思想、建议等）；信奉（宗教、信仰等）；包括；包含" },
  { key: "reinvent", pattern: "reinvent(?:s|ed|ing)?", label: "reinvent", pos: "v.", ipa: "/ˌriːɪnˈvent/", definition: "To change something so much that it seems new, or to create a new version of yourself.", zh: "以新形象示人；以新形式出现" },
  { key: "confess", pattern: "confess(?:es|ed|ing)?", label: "confess", pos: "v.", ipa: "/kənˈfes/", definition: "To admit that you have done something wrong or that you feel something embarrassing.", zh: "承认（自己感到羞愧或尴尬的事）；供认；坦白（错误或罪行）；忏悔（罪过）；承认；告罪；告解；聆听（某人的）忏悔" },
  { key: "toddler", pattern: "toddlers?", label: "toddler", pos: "n.", ipa: "/ˈtɑːdlər/", definition: "A young child who is just learning to walk.", zh: "蹒跚学步的孩子；学步的儿童；刚学会走路的孩子" },
  { key: "obscure", pattern: "obscure", label: "obscure", pos: "adj.", ipa: "/əbˈskjʊr/", definition: "Not well known or easy to understand.", zh: "模糊的；晦涩的；无名的；鲜为人知的；费解的；难以理解的" },
  { key: "entrepreneurial", pattern: "entrepreneurial", label: "entrepreneurial", pos: "adj.", ipa: "/ˌɑːntrəprəˈnɜːriəl/", definition: "Having the qualities or skills needed to start and run a business.", zh: "创业的；具有企业家素质的；富于企业家精神的" },
  { key: "skewed", pattern: "skewed", label: "skewed", pos: "adj.", ipa: "/skjuːd/", definition: "Biased or distorted so that it is inaccurate or unfair.", zh: "歪曲的；有偏颇的；不准确的；偏向（或偏重）……的；偏的；斜的；歪的" },
  { key: "permutation", pattern: "permutations?", label: "permutation", pos: "n.", ipa: "/ˌpɜːrmjuˈteɪʃən/", definition: "One of the different ways in which a set of things can be arranged or combined.", zh: "排列（方式）；组合（方式）；置换" },
  { key: "multiplicity", pattern: "multiplicity", label: "multiplicity", pos: "n.", ipa: "/ˌmʌltɪˈplɪsəti/", definition: "A large number or wide variety of things.", zh: "多种多样；多样性" },
  { key: "narrative", pattern: "narratives?", label: "narrative", pos: "n.", ipa: "/ˈnærətɪv/", definition: "A spoken or written account of connected events; a story or description.", zh: "叙述的；叙事体的；叙述；（尤指小说中的）描述；讲故事；叙事技巧" },
  { key: "alienate", pattern: "alienat(?:e|es|ed|ing)", label: "alienate", pos: "v.", ipa: "/ˈeɪliəneɪt/", definition: "To make someone feel isolated or unfriendly toward a person or group.", zh: "使疏远；使不友好；离间；使（与某群体）格格不入" },
  { key: "tremendous", pattern: "tremendous", label: "tremendous", pos: "adj.", ipa: "/trəˈmendəs/", definition: "Very great in amount, size, or degree; extremely good or impressive.", zh: "巨大的；极大的；极好的；精彩的；了不起的" },
];

export function DiversityVocabularyArticleBody() {
  return <VocabularyArticleBody paragraphs={diversityArticle.paragraphs} terms={terms} idPrefix="diversity-note" />;
}
