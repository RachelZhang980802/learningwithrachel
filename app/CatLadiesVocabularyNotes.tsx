"use client";

import { CatLadiesExercises } from "./CatLadiesExercises";
import { catLadiesArticle } from "./inquire-stereotype-articles";
import { VocabularyArticleBody, type VocabularyNoteTerm } from "./BrooksVocabularyNotes";

const terms: VocabularyNoteTerm[] = [
  { key: "resent", pattern: "resent(?:s|ed|ing)?", label: "resent", pos: "v.", ipa: "/rɪˈzent/", definition: "To feel bitter or angry about something, especially because you feel it is unfair.", zh: "憎恨；感到气愤；愤愤不平" },
  { key: "bloc", pattern: "blocs?", label: "bloc", pos: "n.", ipa: "/blɑːk/", definition: "A group of countries or people with similar political aims and interests.", zh: "（政治目标或利益相近的国家组成的）阵营" },
  { key: "court", pattern: "court(?:s|ed|ing)?", label: "court", pos: "v.", ipa: "/kɔːrt/", definition: "To try to please someone in order to get something you want, especially their support.", zh: "讨好；争取（支持）" },
  { key: "substance", pattern: "substance", label: "substance", pos: "n.", ipa: "/ˈsʌbstəns/", definition: "The most important or main part of something.", zh: "主旨；要点；实质；基本内容" },
  { key: "alienate", pattern: "alienat(?:e|es|ed|ing)", label: "alienate", pos: "v.", ipa: "/ˈeɪliəneɪt/", definition: "To make someone less friendly toward you.", zh: "使疏远；使不友好" },
  { key: "pet_peeve", pattern: "pet\\s+peeves?", label: "pet peeve", pos: "n. phr.", ipa: "/ˌpet ˈpiːv/", definition: "Something that annoys a person very much.", zh: "特别烦人的事；非常恼人的问题" },
  { key: "trope", pattern: "tropes?", label: "trope", pos: "n.", ipa: "/troʊp/", definition: "A significant or recurrent theme; a motif.", zh: "重要（或频频出现）的主题；主线" },
  { key: "esque", pattern: "esque", label: "-esque", pos: "suffix", ipa: "/esk/", definition: "In the style or manner of.", zh: "风格（或样式）的" },
  { key: "spinster", pattern: "spinsters?", label: "spinster", pos: "n.", ipa: "/ˈspɪnstər/", definition: "An unmarried woman, traditionally especially an older woman.", zh: "未婚女性；（旧时用语）老处女；老姑娘" },
  { key: "suffrage", pattern: "suffrage", label: "suffrage", pos: "n.", ipa: "/ˈsʌfrɪdʒ/", definition: "The right to vote in political elections.", zh: "选举权；投票权" },
  { key: "docile", pattern: "docile", label: "docile", pos: "adj.", ipa: "/ˈdoʊsaɪl/", definition: "Quiet and easy to control.", zh: "驯服的；易驾驭的；易控制的" },
  { key: "comical", pattern: "comical", label: "comical", pos: "adj.", ipa: "/ˈkɑːmɪkəl/", definition: "Funny or amusing because something is strange or unusual.", zh: "可笑的；滑稽的；有趣的" },
  { key: "cast_a_ballot", pattern: "cast(?:s|ing|ed)?\\s+a\\s+ballot", label: "cast a ballot", pos: "v. phr.", ipa: "/kæst ə ˈbælət/", definition: "To vote in an election.", zh: "投票" },
  { key: "surly", pattern: "surly", label: "surly", pos: "adj.", ipa: "/ˈsɜːrli/", definition: "Bad-tempered and rude.", zh: "脾气坏的；乖戾的；态度粗暴的" },
  { key: "bedraggled", pattern: "bedraggled", label: "bedraggled", pos: "adj.", ipa: "/bɪˈdræɡəld/", definition: "Made wet, dirty, or untidy by rain, mud, or similar conditions.", zh: "弄湿弄脏的；不整洁的" },
  { key: "stand_in", pattern: "stand[- ]in", label: "stand-in", pos: "n.", ipa: "/ˈstænd ɪn/", definition: "A person who takes the place of another; a substitute.", zh: "替代者；替身" },
  { key: "frumpy", pattern: "frumpy", label: "frumpy", pos: "adj.", ipa: "/ˈfrʌmpi/", definition: "(Of a person or clothes) dull and not fashionable.", zh: "（穿衣服）傻里傻气的；不时髦的" },
  { key: "disparage", pattern: "disparag(?:e|es|ed|ing)", label: "disparage", pos: "v.", ipa: "/dɪˈspærɪdʒ/", definition: "To suggest that someone or something is not important or valuable.", zh: "贬低；轻视" },
  { key: "emasculate", pattern: "emasculat(?:e|es|ed|ing)", label: "emasculate", pos: "v.", ipa: "/ɪˈmæskjəleɪt/", definition: "To make a man feel that he has lost his male role or qualities.", zh: "（使男人）柔弱；使丧失男子气概" },
  { key: "put_upon", pattern: "put[- ]upon", label: "put-upon", pos: "adj.", ipa: "/ˌpʊt əˈpɑːn/", definition: "Treated unfairly or expected to do too much.", zh: "吃亏的；被占便宜的" },
  { key: "drive_home", pattern: "driv(?:e|es|ing|en)\\s+home", label: "drive home", pos: "v. phr.", ipa: "/draɪv hoʊm/", definition: "To make someone understand or accept something by stating it forcefully or repeatedly.", zh: "把……讲透彻；阐明；使充分理解" },
  { key: "malign", pattern: "malign(?:s|ed|ing)?", label: "malign", pos: "v.", ipa: "/məˈlaɪn/", definition: "To say bad things about someone publicly.", zh: "（公开地）诽谤；毁谤；中伤" },
  { key: "superstition", pattern: "superstitions?", label: "superstition", pos: "n.", ipa: "/ˌsuːpərˈstɪʃən/", definition: "A belief that events happen in a way that cannot be explained by reason or science, often involving luck.", zh: "迷信；迷信观念" },
  { key: "witchcraft", pattern: "witchcraft", label: "witchcraft", pos: "n.", ipa: "/ˈwɪtʃkræft/", definition: "The use of magic powers, especially evil ones.", zh: "巫术；（尤指）妖术、魔法" },
  { key: "menopausal", pattern: "menopausal", label: "menopausal", pos: "adj.", ipa: "/ˌmenəˈpɔːzəl/", definition: "Relating to or going through menopause.", zh: "更年期的；与更年期有关的" },
  { key: "drain", pattern: "drains?", label: "drain", pos: "n.", ipa: "/dreɪn/", definition: "Something that uses up a particular resource.", zh: "负担；消耗资源的东西" },
  { key: "attachment", pattern: "attachment", label: "attachment", pos: "n.", ipa: "/əˈtætʃmənt/", definition: "A strong feeling of affection for someone or something.", zh: "依恋；爱慕" },
  { key: "admonish", pattern: "admonish(?:es|ed|ing)?", label: "admonish", pos: "v.", ipa: "/ədˈmɑːnɪʃ/", definition: "To tell someone severely that they have done something wrong.", zh: "责备；警告；告诫" },
  { key: "stigmatize", pattern: "stigmatiz(?:e|es|ed|ing)|stigmatise(?:s|d|ing)?", label: "stigmatize", pos: "v.", ipa: "/ˈstɪɡmətaɪz/", definition: "To describe or regard someone or something as worthy of disgrace or disapproval.", zh: "指责；把……污名化" },
  { key: "speak_to", pattern: "speak(?:s|ing)?\\s+to", label: "speak to", pos: "v. phr.", ipa: "/spiːk tuː/", definition: "To provide evidence that something exists or is true; to show or indicate.", zh: "证明；说明" },
  { key: "endorse", pattern: "endorse(?:s|d|ing)?", label: "endorse", pos: "v.", ipa: "/ɪnˈdɔːrs/", definition: "To say publicly that you support a person, statement, or course of action.", zh: "（公开）赞同；支持；认可" },
];

export function CatLadiesVocabularyArticleBody() {
  return <><VocabularyArticleBody paragraphs={catLadiesArticle.paragraphs} terms={terms} idPrefix="cat-ladies-note" /><CatLadiesExercises /></>;
}
