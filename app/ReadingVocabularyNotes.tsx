"use client";

import { CaseAgainstTravelExercises } from "./CaseAgainstTravelExercises";

import { HanKangExercises } from "./HanKangExercises";

import { OrientalismExercises } from "./OrientalismExercises";

import { FoxEyeExercises } from "./FoxEyeExercises";

import { LiZiqiExercises } from "./LiZiqiExercises";

import { ViceExercises } from "./ViceExercises";

import { SlateExercises } from "./SlateExercises";

import { Fragment, useState, type MouseEvent, type ReactNode } from "react";
import type { VocabularyNoteTerm } from "./BrooksVocabularyNotes";
import { caseAgainstTravelTranslations, foxEyeTranslations, hanKangTranslations, liZiqiTranslations, orientalismTranslations, slateTranslations, tokyoTranslations, viceTranslations } from "./SupplementaryTranslations";

const slateTerms: VocabularyNoteTerm[] = [
  { key: "knack", pattern: "knack", label: "knack", pos: "n.", ipa: "/næk/", definition: "A special skill or ability that you have naturally or can learn.", zh: "窍门；本领" },
  { key: "whisk", pattern: "whisk(?:ed|ing)?", label: "whisk", pos: "v.", ipa: "/wɪsk/", definition: "To take someone or something quickly away from a place.", zh: "迅速带走；使迅速离开" },
  { key: "pinpoint", pattern: "pinpoint(?:ed|ing)?", label: "pinpoint", pos: "v.", ipa: "/ˈpɪnpɔɪnt/", definition: "To find and show the exact position of someone or something, or the exact time something happened.", zh: "明确指出；准确定位" },
  { key: "transport", pattern: "transport(?:ed|ing)?", label: "transport", pos: "v.", ipa: "/trænˈspɔːrt/", definition: "To make someone feel they are in a different place, time, or situation.", zh: "使产生身临其境的感觉" },
  { key: "rigorous", pattern: "rigorous(?:ly)?", label: "rigorous", pos: "adj.", ipa: "/ˈrɪɡərəs/", definition: "Done carefully and with a lot of attention to detail.", zh: "细致严谨的" },
  { key: "demanding", pattern: "demanding", label: "demanding", pos: "adj.", ipa: "/dɪˈmændɪŋ/", definition: "Needing a lot of skill, patience, effort, etc.", zh: "费力的；要求高的" },
  { key: "revel", pattern: "revel(?:ed|led|ing|ling)?", label: "revel", pos: "v.", ipa: "/ˈrevəl/", definition: "To spend time enjoying yourself in a noisy, enthusiastic way.", zh: "尽情享受；狂欢作乐" },
  { key: "dismay", pattern: "dismay(?:ed|ing)?", label: "dismay", pos: "n./v.", ipa: "/dɪsˈmeɪ/", definition: "A worried, sad feeling after receiving an unpleasant surprise.", zh: "沮丧；惊愕" },
  { key: "wrangle", pattern: "wrangl(?:e|ed|ing|es)", label: "wrangle", pos: "v.", ipa: "/ˈræŋɡəl/", definition: "To argue angrily, usually for a long time, about something.", zh: "争辩；争吵" },
  { key: "obfuscate", pattern: "obfuscat(?:e|es|ed|ing)", label: "obfuscate", pos: "v.", ipa: "/ˈɑːbfəskeɪt/", definition: "To make something less clear and more difficult to understand, usually deliberately.", zh: "混淆；使困惑" },
  { key: "illuminated", pattern: "illuminat(?:e|es|ed|ing)", label: "illuminate", pos: "v.", ipa: "/ɪˈluːməneɪt/", definition: "To light something up; figuratively, to make an idea or meaning clear.", zh: "照亮；阐明" },
  { key: "intolerably", pattern: "intolerabl(?:e|y)", label: "intolerably", pos: "adv.", ipa: "/ɪnˈtɑːlərəbli/", definition: "In a way that is so bad or difficult that you cannot tolerate it.", zh: "无法忍受地" },
  { key: "bemoan", pattern: "bemoan(?:s|ed|ing)?", label: "bemoan", pos: "v.", ipa: "/bɪˈmoʊn/", definition: "To complain or say that you are unhappy about something.", zh: "悲叹；抱怨" },
  { key: "idyll", pattern: "idylls?", label: "idyll", pos: "n.", ipa: "/ˈɪdəl/", definition: "A short poem or other piece of writing that describes a peaceful, happy scene.", zh: "田园诗；宁静美好的场景" },
  { key: "impassioned", pattern: "impassion(?:ed|s|ing)?", label: "impassioned", pos: "adj.", ipa: "/ɪmˈpæʃənd/", definition: "Showing strong feelings about something.", zh: "充满激情的" },
  { key: "cognizant", pattern: "cognizant", label: "cognizant", pos: "adj.", ipa: "/ˈkɑːɡnɪzənt/", definition: "(Formal) Having knowledge or understanding of something.", zh: "知道的；意识到的" },
  { key: "cacophonous", pattern: "cacophonous", label: "cacophonous", pos: "adj.", ipa: "/kəˈkɑːfənəs/", definition: "(Formal) Consisting of a mixture of loud, unpleasant sounds.", zh: "刺耳的；不和谐的" },
  { key: "indiscriminate", pattern: "indiscriminate(?:ly)?", label: "indiscriminate", pos: "adj.", ipa: "/ˌɪndɪˈskrɪmɪnət/", definition: "Acting without careful judgment.", zh: "不加区分的；不加选择的" },
  { key: "ad_hoc", pattern: "ad\\s+hoc", label: "ad hoc", pos: "adj.", ipa: "/ˌæd ˈhɑːk/", definition: "(From Latin) Arranged or happening when necessary and not planned in advance.", zh: "临时的；特别安排的" },
  { key: "groove", pattern: "get\\s+(?:her|your)\\s+groove\\s+back", label: "get your groove back", pos: "phr.", ipa: "", definition: "To start to be happy, confident, or successful again after a difficult period.", zh: "找回节奏；重拾步调" },
  { key: "apocalyptic", pattern: "apocalyptic", label: "apocalyptic", pos: "adj.", ipa: "/əˌpɑːkəˈlɪptɪk/", definition: "Like the end of the world.", zh: "像世界末日的；灾难性的" },
  { key: "nicoise", pattern: "niçoise", label: "niçoise", pos: "n.", ipa: "/niːˈswɑːz/", definition: "A traditional salad from Nice, usually prepared with tomatoes, olives, garlic, and anchovies.", zh: "尼斯沙拉" },
  { key: "garbage_in", pattern: "garbage\\s+in,\\s*garbage\\s+out", label: "garbage in, garbage out", pos: "idiom", ipa: "", definition: "Used to express the idea that wrong or poor-quality input produces wrong or poor-quality output.", zh: "垃圾进，垃圾出" }
];

const viceTerms: VocabularyNoteTerm[] = [
  { key: "vice", pattern: "vice", label: "vice", pos: "n.", ipa: "/vaɪs/", definition: "Bad or immoral behavior or habits; wickedness.", zh: "不良行为；恶习" },
  { key: "endangered", pattern: "endanger(?:ed|ing)?", label: "endangered", pos: "adj.", ipa: "/ɪnˈdeɪndʒərd/", definition: "(Especially of a species) At risk of no longer existing.", zh: "濒临灭绝的；濒危的" },
  { key: "steep", pattern: "steep(?:er|est)?", label: "steep", pos: "adj.", ipa: "/stiːp/", definition: "(Of a rise or fall in an amount) Sudden and very big.", zh: "（数量升降）突然的；急剧的" },
  { key: "agonize", pattern: "agoniz(?:e|es|ed|ing)|agonis(?:e|es|ed|ing)", label: "agonize", pos: "v.", ipa: "/ˈæɡənaɪz/", definition: "To spend a long time thinking and worrying about a difficult situation or problem.", zh: "苦苦思索；焦虑不已" },
  { key: "tactic", pattern: "tactics?", label: "tactic", pos: "n.", ipa: "/ˈtæktɪk/", definition: "A particular method used to achieve something.", zh: "策略；手段；招数" },
  { key: "cultivate", pattern: "cultivat(?:e|es|ed|ing)", label: "cultivate", pos: "v.", ipa: "/ˈkʌltɪveɪt/", definition: "To improve or develop something by careful attention, training, or study.", zh: "陶冶；培养；修习" },
  { key: "utilitarian", pattern: "utilitarian", label: "utilitarian", pos: "adj.", ipa: "/ˌjuːtɪlɪˈteriən/", definition: "Of or relating to utilitarianism; focused on practical usefulness.", zh: "功利主义的" },
  { key: "transgressive", pattern: "transgress(?:es|ed|ing|ive|ively)?", label: "transgress", pos: "v.", ipa: "/trænzˈɡres/", definition: "To go beyond the limits of what is morally or legally acceptable.", zh: "越轨；违背道德；违规" },
  { key: "virtuous", pattern: "virtuous", label: "virtuous", pos: "adj.", ipa: "/ˈvɜːrtʃuəs/", definition: "Behaving in a very good and moral way; showing high moral standards.", zh: "品行端正的；品德高尚的" },
  { key: "edifying", pattern: "edif(?:y|ies|ied|ying)", label: "edifying", pos: "adj.", ipa: "/ˈedɪfaɪɪŋ/", definition: "Likely to improve your mind or character.", zh: "启迪的；有教化作用的" },
  { key: "moralist", pattern: "moralists?", label: "moralist", pos: "n.", ipa: "/ˈmɔːrəlɪst/", definition: "A person with strong opinions about right and wrong who tries to control other people's moral behavior.", zh: "道德家；说教者；卫道士" },
  { key: "counterproductive", pattern: "counterproductive", label: "counterproductive", pos: "adj.", ipa: "/ˌkaʊntərprəˈdʌktɪv/", definition: "Having the opposite effect to the one that was intended.", zh: "产生相反效果的；事与愿违的" },
  { key: "transferable", pattern: "transferable", label: "transferable", pos: "adj.", ipa: "/trænsˈfɜːrəbəl/", definition: "Able to be moved from one place, person, or use to another.", zh: "可转移的；可迁移的" },
  { key: "antisocial", pattern: "antisocial", label: "antisocial", pos: "adj.", ipa: "/ˌæntiˈsoʊʃəl/", definition: "Often avoiding spending time with other people.", zh: "不爱交际的；厌恶社交的" },
  { key: "tune_out", pattern: "tun(?:e|es|ed|ing)\\s+out", label: "tune out", pos: "v. phr.", ipa: "/tuːn aʊt/", definition: "To ignore or not listen to someone or something.", zh: "不理会；置之不理" },
  { key: "chivalry", pattern: "chivalry", label: "chivalry", pos: "n.", ipa: "/ˈʃɪvəlri/", definition: "The system of values, such as loyalty and honor, that knights in the Middle Ages were expected to follow.", zh: "骑士制度；骑士精神" },
  { key: "woo", pattern: "woo(?:s|ed|ing|ings)?", label: "woo", pos: "v.", ipa: "/wuː/", definition: "To try to persuade a woman to love him and marry him.", zh: "追求（异性）；求爱" },
  { key: "embark_on", pattern: "embark(?:s|ed|ing)?\\s+on", label: "embark on", pos: "v. phr.", ipa: "/ɪmˈbɑːrk ɑːn/", definition: "To start doing something new or difficult.", zh: "从事；着手；开始" },
  { key: "pathetically", pattern: "pathetic(?:ally)?", label: "pathetically", pos: "adv.", ipa: "/pəˈθetɪkli/", definition: "In a way that causes sadness and sympathy, especially because someone is suffering.", zh: "令人怜悯地；可怜地" },
  { key: "adultery", pattern: "adultery", label: "adultery", pos: "n.", ipa: "/əˈdʌltəri/", definition: "Sex between a married person and someone who is not their husband or wife.", zh: "通奸" },
  { key: "felicity", pattern: "felicity", label: "felicity", pos: "n.", ipa: "/fəˈlɪsəti/", definition: "Great happiness.", zh: "幸福；十分快乐" },
  { key: "rapture", pattern: "rapture", label: "rapture", pos: "n.", ipa: "/ˈræptʃər/", definition: "A feeling of extreme pleasure and happiness.", zh: "狂喜；欢天喜地" },
  { key: "obscenity", pattern: "obscenity", label: "obscenity", pos: "n.", ipa: "/əbˈsenəti/", definition: "Obscene language or behavior.", zh: "淫秽的语言；下流的行为" },
  { key: "acquit", pattern: "acquit(?:s|ted|ting)?", label: "acquit", pos: "v.", ipa: "/əˈkwɪt/", definition: "To decide and state officially in court that somebody is not guilty of a crime.", zh: "宣判无罪" },
  { key: "censor", pattern: "censor(?:s|ed|ing)?", label: "censor", pos: "v.", ipa: "/ˈsensər/", definition: "To remove parts of a book, film, etc. that are considered offensive or politically dangerous.", zh: "删剪；审查" },
  { key: "extinct", pattern: "extinct", label: "extinct", pos: "adj.", ipa: "/ɪkˈstɪŋkt/", definition: "No longer existing.", zh: "不再存在的；已灭绝的" }
];

function ArticleWithVocabularyNotes({ paragraphs, terms, idPrefix, sectionHeadings = [], paragraphTranslations = [] }: { paragraphs: readonly string[]; terms: readonly VocabularyNoteTerm[]; idPrefix: string; sectionHeadings?: readonly string[]; paragraphTranslations?: readonly string[] }) {
  const [openNote, setOpenNote] = useState<{ id: string; term: VocabularyNoteTerm; left: number; top: number } | null>(null);
  const seen = new Set<string>();
  const pattern = new RegExp(terms.map((term) => `(?<${term.key}>\\b(?:${term.pattern})\\b)`).join("|"), "gi");

  function toggleNote(event: MouseEvent<HTMLButtonElement>, id: string, term: VocabularyNoteTerm) {
    if (openNote?.id === id) return setOpenNote(null);
    const button = event.currentTarget;
    const body = button.closest(".inquire-publication-body");
    if (!body) return;
    const wordRect = button.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let rightmost = wordRect.right;
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest(".taylor-vocabulary-note")) continue;
      range.selectNodeContents(node);
      for (const rect of Array.from(range.getClientRects())) rightmost = Math.max(rightmost, rect.right);
    }
    setOpenNote({ id, term, left: rightmost - bodyRect.left + 18, top: wordRect.top - bodyRect.top - 2 });
  }

  return <div className="inquire-publication-body">{paragraphs.map((paragraph, paragraphIndex) => {
    const nodes: ReactNode[] = [];
    let cursor = 0;
    for (const match of paragraph.matchAll(pattern)) {
      const start = match.index ?? 0;
      const key = Object.keys(match.groups ?? {}).find((name) => match.groups?.[name] !== undefined);
      const term = terms.find((item) => item.key === key);
      if (!term || start < cursor) continue;
      if (start > cursor) nodes.push(paragraph.slice(cursor, start));
      const surface = match[0];
      if (seen.has(term.key)) nodes.push(surface);
      else {
        seen.add(term.key);
        const id = `${idPrefix}-${paragraphIndex}-${start}`;
        nodes.push(<span className="taylor-vocabulary-anchor" key={id}><button type="button" className="taylor-vocabulary-highlight" aria-label={`Show vocabulary note for ${term.label}`} aria-expanded={openNote?.id === id} aria-controls={openNote?.id === id ? id : undefined} onClick={(event) => toggleNote(event, id, term)}>{surface}</button></span>);
      }
      cursor = start + surface.length;
    }
    if (cursor < paragraph.length) nodes.push(paragraph.slice(cursor));
    const content = nodes.map((node, index) => typeof node === "string" ? <Fragment key={index}>{node}</Fragment> : node);
    const translatedText = paragraphTranslations[paragraphIndex];
    return <Fragment key={paragraphIndex}>
      {sectionHeadings.includes(paragraph)
        ? <h2 className="inquire-publication-section-title">{content}</h2>
        : <p>{content}</p>}
      {translatedText && <details className="supplementary-translation">
        <summary aria-label="展开或收起本段中文翻译" title="点击 ☞ 查看本段中文翻译"><span aria-hidden="true">☞</span></summary>
        <p lang="zh-CN">{translatedText}</p>
      </details>}
    </Fragment>;
  })}{openNote && <span className="taylor-vocabulary-note" id={openNote.id} role="group" aria-label={`Vocabulary note for ${openNote.term.label}`} style={{ left: openNote.left, top: openNote.top, width: 286 }}>
    <span className="taylor-vocabulary-note-tape" aria-hidden="true" />
    <span className="taylor-vocabulary-note-heading"><strong>{openNote.term.label}</strong><span className="taylor-vocabulary-note-pos">{openNote.term.pos}</span>{openNote.term.ipa && <span>{openNote.term.ipa}</span>}</span>
    <button type="button" className="taylor-vocabulary-note-close" aria-label={`Close definition for ${openNote.term.label}`} onClick={() => setOpenNote(null)}>×</button>
    <span className="taylor-vocabulary-note-definition">{openNote.term.definition}</span>
    <span className="taylor-vocabulary-note-translation">{openNote.term.zh}</span>
  </span>}</div>;
}


const liZiqiTerms: VocabularyNoteTerm[] = [
  { key: "pastoral", pattern: "pastoral", label: "pastoral", pos: "adj.", ipa: "/ˈpæstərəl/", definition: "Showing country life or the countryside, especially in a romantic way.", zh: "田园的；乡村生活的；村野风情的" },
  { key: "idyllic", pattern: "idyllic", label: "idyllic", pos: "adj.", ipa: "/ɪˈdɪlɪk/", definition: "Extremely pleasant, simple, and peaceful, without difficulties or dangers.", zh: "安恬的；田园诗般的；质朴宜人的" },
  { key: "mountainous", pattern: "mountainous", label: "mountainous", pos: "adj.", ipa: "/ˈmaʊntənəs/", definition: "Having many mountains.", zh: "多山的" },
  { key: "beanstalk", pattern: "beanstalks?", label: "beanstalk", pos: "n.", ipa: "/ˈbiːnstɔːk/", definition: "The tall, fast-growing stem of a bean plant.", zh: "豆茎" },
  { key: "sickle", pattern: "sickle", label: "sickle", pos: "n.", ipa: "/ˈsɪkəl/", definition: "A tool with a curved blade and a short handle, used for cutting grass or crops.", zh: "镰刀" },
  { key: "wicker", pattern: "wicker", label: "wicker", pos: "n.", ipa: "/ˈwɪkər/", definition: "Thin sticks of wood twisted together to make baskets, furniture, etc.", zh: "柳条；枝条；编织材料" },
  { key: "shell", pattern: "shell(?:s|ed|ing)?", label: "shell", pos: "v.", ipa: "/ʃel/", definition: "To remove the shell or outer layer from nuts, peas, etc.", zh: "给……去壳" },
  { key: "serenely", pattern: "serenely", label: "serenely", pos: "adv.", ipa: "/səˈriːnli/", definition: "In a calm and peaceful way.", zh: "平静地；宁静地；安详地" },
  { key: "pulp", pattern: "pulp", label: "pulp", pos: "n.", ipa: "/pʌlp/", definition: "A soft wet substance made especially by pressing hard on something.", zh: "浆状物" },
  { key: "curdle", pattern: "curdl(?:e|es|ed|ing)", label: "curdle", pos: "v.", ipa: "/ˈkɜːrdəl/", definition: "To separate or cause something to separate into curds or lumps.", zh: "（使）结成凝乳；（使）凝结" },
  { key: "outtake", pattern: "outtakes?", label: "outtake", pos: "n.", ipa: "/ˈaʊtteɪk/", definition: "A piece of film that is not included in the final film, for example because it contains a mistake.", zh: "（电影的）不适用镜头；剪掉的镜头" },
  { key: "period_drama", pattern: "period\\s+drama", label: "period drama", pos: "n.", ipa: "", definition: "A television or film production set in a period in the past.", zh: "古装剧；时代剧；历史剧" },
  { key: "proprietor", pattern: "proprietors?", label: "proprietor", pos: "n.", ipa: "/prəˈpraɪətər/", definition: "The owner of a business, a hotel, etc.", zh: "业主；所有人" },
  { key: "thoroughgoing", pattern: "thoroughgoing", label: "thoroughgoing", pos: "adj.", ipa: "/ˌθɜːroʊˈɡoʊɪŋ/", definition: "Including every possible detail; very thorough or complete.", zh: "彻底的；全面的" },
  { key: "reside", pattern: "resid(?:e|es|ed|ing)", label: "reside", pos: "v.", ipa: "/rɪˈzaɪd/", definition: "To live in a particular place.", zh: "居住在；定居于" },
  { key: "otherworld", pattern: "otherworld(?:ly)?", label: "otherworld", pos: "n./adj.", ipa: "/ˈʌðərwɜːrld/", definition: "A spiritual world or afterlife; otherworldly means seeming to belong to such a world.", zh: "精神世界；来世；超凡脱俗的" },
  { key: "splice", pattern: "splic(?:e|es|ed|ing)", label: "splice", pos: "v.", ipa: "/splaɪs/", definition: "To join two pieces of rope, film, or tape together neatly at the ends.", zh: "绞接（绳子）；粘接（胶片、磁带等）" },
  { key: "stylized", pattern: "styliz(?:e|es|ed|ing)|stylis(?:e|es|ed|ing)", label: "stylized", pos: "adj.", ipa: "/ˈstaɪlaɪzd/", definition: "Drawn or written in a way that is not natural or realistic.", zh: "（绘画、写作等手法）非写实的" },
  { key: "frolic", pattern: "frolic(?:s|ked|king)?", label: "frolic", pos: "v.", ipa: "/ˈfrɑːlɪk/", definition: "To play and move around in a lively, happy way.", zh: "嬉戏；嬉闹" },
  { key: "wizened", pattern: "wizened", label: "wizened", pos: "adj.", ipa: "/ˈwɪzənd/", definition: "Looking smaller and having many folds and lines in the skin, because of being old.", zh: "（因年老）干瘪的；多皱的" },
  { key: "pad", pattern: "pads?", label: "pad", pos: "n.", ipa: "/pæd/", definition: "A large flat leaf of some water plants, especially the water lily.", zh: "（睡莲等的）浮叶" },
  { key: "waldenesque", pattern: "waldenesque", label: "Waldenesque", pos: "adj.", ipa: "/wɔːlˈdenesk/", definition: "Reminiscent of Walden, Henry David Thoreau's book about simple living in natural surroundings.", zh: "瓦尔登湖式的；归隐田园的" },
  { key: "vignette", pattern: "vignettes?", label: "vignette", pos: "n.", ipa: "/vɪnˈjet/", definition: "A short piece of writing or acting that clearly shows a particular person, situation, or idea.", zh: "短文；简介；花絮；表演片段；小品" },
  { key: "arcadian", pattern: "arcadian", label: "Arcadian", pos: "adj.", ipa: "/ɑːrˈkeɪdiən/", definition: "Of or connected with Arcadia, or with an ideal country life.", zh: "阿卡迪亚式的；世外桃源式的" },
  { key: "magnanimity", pattern: "magnanimity", label: "magnanimity", pos: "n.", ipa: "/ˌmæɡnəˈnɪməti/", definition: "Kind, generous, and forgiving behavior, especially toward an enemy or competitor.", zh: "善良、慷慨和宽容的行为" },
  { key: "enthused", pattern: "enthus(?:e|es|ed|ing)", label: "enthused", pos: "adj.", ipa: "/ɪnˈθuːzd/", definition: "Feeling or showing enthusiasm.", zh: "充满热情的" },
  { key: "gloss_over", pattern: "gloss(?:es|ed|ing)?\\s+over", label: "gloss over", pos: "v. phr.", ipa: "/ɡlɔːs ˈoʊvər/", definition: "To avoid talking about something unpleasant or embarrassing by not dealing with it in detail.", zh: "掩饰；掩盖；把……搪塞过去" },
  { key: "agrarian", pattern: "agrarian", label: "agrarian", pos: "adj.", ipa: "/əˈɡreriən/", definition: "Connected with farming and the use of land for farming.", zh: "农业的；土地的；耕地的" },
  { key: "prowess", pattern: "prowess", label: "prowess", pos: "n.", ipa: "/ˈpraʊəs/", definition: "Great skill at doing something.", zh: "非凡的技能；高超的技艺；造诣" },
  { key: "verve", pattern: "verve", label: "verve", pos: "n.", ipa: "/vɜːrv/", definition: "Energy, excitement, or enthusiasm.", zh: "精力；激情；热情；热忱" },
  { key: "taro", pattern: "taro", label: "taro", pos: "n.", ipa: "/ˈtɑːroʊ/", definition: "A tropical plant with a thick root that can be boiled and eaten.", zh: "芋头" },
  { key: "stoke", pattern: "stok(?:e|es|ed|ing)", label: "stoke", pos: "v.", ipa: "/stoʊk/", definition: "To add fuel to a fire.", zh: "给……添加（燃料）；往火里添柴" },
  { key: "cast_iron", pattern: "cast[- ]iron", label: "cast-iron", pos: "adj.", ipa: "/ˌkæst ˈaɪərn/", definition: "Made of cast iron.", zh: "铸铁制的；生铁做的" },
  { key: "celery", pattern: "celery", label: "celery", pos: "n.", ipa: "/ˈseləri/", definition: "A vegetable with long light-green stems that are often eaten raw.", zh: "芹菜" },
  { key: "squash", pattern: "squash", label: "squash", pos: "n.", ipa: "/skwɑːʃ/", definition: "A type of vegetable, such as a pumpkin, that has a usually hard skin and is eaten cooked.", zh: "南瓜属蔬菜" },
  { key: "terrier", pattern: "terrier", label: "terrier", pos: "n.", ipa: "/ˈteriər/", definition: "A small active type of dog originally used for hunting.", zh: "梗犬（一种活泼的小狗）" },
  { key: "quotidian", pattern: "quotidian", label: "quotidian", pos: "adj.", ipa: "/kwɑːˈtɪdiən/", definition: "Ordinary; typical of what happens every day.", zh: "寻常的；普通的；司空见惯的" },
  { key: "sublime", pattern: "sublime", label: "sublime", pos: "adj.", ipa: "/səˈblaɪm/", definition: "Of very high quality or great beauty.", zh: "崇高的；壮丽的；宏伟的；令人赞叹的" },
  { key: "portraiture", pattern: "portraiture", label: "portraiture", pos: "n.", ipa: "/ˈpɔːrtrətʃər/", definition: "The art or practice of making portraits.", zh: "画像技法；人像摄影法；肖像；画像" },
  { key: "fastidiously", pattern: "fastidiously", label: "fastidiously", pos: "adv.", ipa: "/fæˈstɪdiəsli/", definition: "In a way that shows care that every detail of something is correct.", zh: "一丝不苟地；严谨地" },
  { key: "till", pattern: "till(?:s|ed|ing)?", label: "till", pos: "v.", ipa: "/tɪl/", definition: "To prepare and use land for growing crops.", zh: "耕作；垦地" },
  { key: "mural", pattern: "murals?", label: "mural", pos: "n.", ipa: "/ˈmjʊrəl/", definition: "A large painting done on a wall, sometimes on an outside wall of a building.", zh: "壁画" }
];

const tokyoTerms: VocabularyNoteTerm[] = [
  { key: "razed", pattern: "raz(?:e|es|ed|ing)", label: "raze", pos: "v.", ipa: "/reɪz/", definition: "To completely destroy a building, town, or other structure.", zh: "夷平；彻底摧毁" },
  { key: "catastrophe", pattern: "catastroph(?:e|es|ic)", label: "catastrophe", pos: "n.", ipa: "/kəˈtæstrəfi/", definition: "A terrible event that causes a lot of destruction, suffering, or death.", zh: "灾难；大祸" },
  { key: "agitation", pattern: "agitation", label: "agitation", pos: "n.", ipa: "/ˌædʒɪˈteɪʃən/", definition: "A state of anxiety, nervousness, or upset that makes calm thought difficult.", zh: "焦虑；紧张不安" },
  { key: "leapfrog", pattern: "leapfrog(?:s|ged|ging)?", label: "leapfrog", pos: "v.", ipa: "/ˈliːpfrɒɡ/", definition: "To move ahead of others suddenly in progress or development.", zh: "越过；超越" },
  { key: "shrine", pattern: "shrines?", label: "shrine", pos: "n.", ipa: "/ʃraɪn/", definition: "A place of worship associated with a particular holy person or object.", zh: "圣殿；神龛" },
  { key: "conjure", pattern: "conjur(?:e|es|ed|ing)", label: "conjure", pos: "v.", ipa: "/ˈkʌndʒə/", definition: "To make something appear or happen unexpectedly, as if by magic.", zh: "使（某物）突然出现" },
  { key: "substantially", pattern: "substantially", label: "substantially", pos: "adv.", ipa: "/səbˈstænʃəli/", definition: "To a great or considerable extent; very much.", zh: "大量地；可观地" },
  { key: "scramble", pattern: "scrambl(?:e|es|ed|ing)", label: "scramble", pos: "v.", ipa: "/ˈskræmbəl/", definition: "To try to do something difficult very quickly.", zh: "匆忙做某事" },
  { key: "drain", pattern: "drain(?:s|ed|ing)?", label: "drain", pos: "v.", ipa: "/dreɪn/", definition: "To make someone feel very tired and without energy.", zh: "使疲劳；使精疲力尽" },
  { key: "crimson", pattern: "crimson", label: "crimson", pos: "adj./n.", ipa: "/ˈkrɪmzən/", definition: "Deep red in color.", zh: "绯红色（的）" }
];

const orientalismTerms: VocabularyNoteTerm[] = [
  { key: "orientalism", pattern: "orientalism", label: "Orientalism", pos: "n.", ipa: "/ˌɔːriˈentəlɪzəm/", definition: "Scholarship or learning in Asian subjects or languages; a style or manner associated with Asia or Asians.", zh: "东方学；东方主义" },
  { key: "behead", pattern: "behead(?:s|ed|ing)?", label: "behead", pos: "v.", ipa: "/bɪˈhed/", definition: "To cut off somebody’s head, especially as a punishment.", zh: "斩首；砍头" },
  { key: "monograph", pattern: "monograph(?:s)?", label: "monograph", pos: "n.", ipa: "/ˈmɑːnəɡræf/", definition: "A detailed written study of a single subject, usually in the form of a short book.", zh: "专论；专题文章；专著" },
  { key: "thesis", pattern: "thes(?:is|es)", label: "thesis", pos: "n.", ipa: "/ˈθiːsɪs/", definition: "A formal idea or opinion about something, discussed and supported with examples.", zh: "论点；论文" },
  { key: "modest", pattern: "modest", label: "modest", pos: "adj.", ipa: "/ˈmɑːdɪst/", definition: "Not very large, expensive, important, etc.", zh: "些许的；不太大的；不太重要的" },
  { key: "combatant", pattern: "combatants?", label: "combatant", pos: "n.", ipa: "/kəmˈbætənt/", definition: "A person or group involved in fighting in a war or battle.", zh: "参战者；战斗人员" },
  { key: "persian", pattern: "persians?", label: "Persian", pos: "n.", ipa: "/ˈpɜːrʒən/", definition: "A person from ancient Persia or modern Persia, now called Iran.", zh: "波斯人" },
  { key: "topical", pattern: "topical", label: "topical", pos: "adj.", ipa: "/ˈtɑːpɪkəl/", definition: "Connected with something happening or of interest at the present time.", zh: "有关时事的；当前关注的；热门话题的" },
  { key: "contemporary", pattern: "contemporary", label: "contemporary", pos: "adj.", ipa: "/kənˈtempəreri/", definition: "Belonging to the present time.", zh: "当代的" },
  { key: "sophisticated", pattern: "sophisticat(?:e|ed|ing|ion)", label: "sophisticated", pos: "adj.", ipa: "/səˈfɪstɪkeɪtɪd/", definition: "Having a lot of experience of life and good judgment about socially important things.", zh: "见多识广的；练达的；有鉴赏力的" },
  { key: "imperialize", pattern: "imperiali[sz](?:e|es|ed|ing|ation|ations)", label: "imperialize", pos: "v.", ipa: "/ɪmˈpɪriəlaɪz/", definition: "To subject a country or culture to imperial rule or influence.", zh: "使受帝国主义统治或影响；使帝国主义化" },
  { key: "imperial", pattern: "imperial", label: "imperial", pos: "adj.", ipa: "/ɪmˈpɪriəl/", definition: "Relating to an empire or to the person who rules it.", zh: "帝国的；皇帝的" },
  { key: "catastrophe", pattern: "catastroph(?:e|es|ic)", label: "catastrophe", pos: "n.", ipa: "/kəˈtæstrəfi/", definition: "A sudden event that causes many people to suffer, or that makes difficulties.", zh: "灾难；灾祸；横祸；不幸事件" },
  { key: "fateful", pattern: "fateful", label: "fateful", pos: "adj.", ipa: "/ˈfeɪtfəl/", definition: "Having an important, especially bad, effect on future events.", zh: "（对未来的发展）有重大影响的；灾难性的" },
  { key: "travesty", pattern: "travest(?:y|ies)", label: "travesty", pos: "n.", ipa: "/ˈtrævəsti/", definition: "Something extremely bad that is not what it is claimed to be.", zh: "歪曲；曲解；嘲弄" },
  { key: "combative", pattern: "combative", label: "combative", pos: "adj.", ipa: "/kəmˈbætɪv/", definition: "Ready and willing to fight or argue.", zh: "好斗的；好争论的" },
  { key: "unforgiving", pattern: "unforgiving", label: "unforgiving", pos: "adj.", ipa: "/ˌʌnfərˈɡɪvɪŋ/", definition: "Not willing to forgive people easily.", zh: "不原谅人的；不宽容的" },
  { key: "unrepentant", pattern: "unrepentant", label: "unrepentant", pos: "adj.", ipa: "/ˌʌnrɪˈpentənt/", definition: "Not ashamed of your behavior or beliefs, even though other people disapprove.", zh: "不悔改的；不悔悟的；顽固的" },
  { key: "manacle", pattern: "manacles?", label: "manacle", pos: "n.", ipa: "/ˈmænəkəl/", definition: "An iron ring on a chain that is put around the wrist or ankle of a prisoner; usually plural.", zh: "镣铐；手铐；脚镣" },
  { key: "disclosure", pattern: "disclos(?:e|es|ed|ing|ure|ures)", label: "disclosure", pos: "n.", ipa: "/dɪsˈkloʊʒər/", definition: "A secret that someone tells people, or the act of telling this secret.", zh: "透露的信息；公开；披露" },
  { key: "subtlety", pattern: "subtl(?:e|eties|ety)", label: "subtlety", pos: "n.", ipa: "/ˈsʌtəlti/", definition: "A thought, idea, or detail that is important but difficult to notice or understand.", zh: "（想法、观点、细节中的）微妙之处" },
  { key: "nuance", pattern: "nuances?", label: "nuance", pos: "n.", ipa: "/ˈnuːɑːns/", definition: "A very slight difference in meaning, sound, color, or feeling that is not usually obvious.", zh: "（意义、声音、颜色、感情等方面的）细微差别" },
  { key: "posture", pattern: "postur(?:e|es|ed|ing)", label: "posture", pos: "v./n.", ipa: "/ˈpɑːstʃər/", definition: "To pretend to be something you are not by saying or doing things to impress or trick people; a deliberately adopted attitude.", zh: "故作姿态；装样子；姿态" },
  { key: "dismay", pattern: "dismay", label: "dismay", pos: "n./v.", ipa: "/dɪsˈmeɪ/", definition: "The worry, disappointment, or unhappiness you feel when something unpleasant happens.", zh: "忧虑；失望；沮丧" },
  { key: "shabby", pattern: "shabb(?:y|ier|iest)", label: "shabby", pos: "adj.", ipa: "/ˈʃæbi/", definition: "Unfair and unkind; or in poor condition because something has been used a lot.", zh: "不公平的；不仁慈的；破旧的；破败的" },
  { key: "screed", pattern: "screeds?", label: "screed", pos: "n.", ipa: "/skriːd/", definition: "A very long, boring piece of writing used to show disapproval.", zh: "冗长的文章；长篇大论（含贬义）" },
  { key: "menace", pattern: "menaces?", label: "menace", pos: "n.", ipa: "/ˈmenɪs/", definition: "A threatening quality, feeling, or way of behaving.", zh: "威胁；恐吓" },
  { key: "polemicist", pattern: "polemicists?", label: "polemicist", pos: "n.", ipa: "/pəˈlemɪsɪst/", definition: "A person who makes skillful use of polemic; polemic is strongly argued speech or writing.", zh: "善于辩论的人；善辩者；有辩才的人" },
  { key: "impart", pattern: "impart(?:s|ed|ing)?", label: "impart", pos: "v.", ipa: "/ɪmˈpɑːrt/", definition: "To give information, knowledge, or wisdom to someone.", zh: "向某人传授（知识、智慧）；透露（信息）；告知" },
  { key: "vociferous", pattern: "vociferous", label: "vociferous", pos: "adj.", ipa: "/voʊˈsɪfərəs/", definition: "Expressing your opinions loudly and strongly.", zh: "（表达自己观点时）大声的；激昂的" },
  { key: "hybrid", pattern: "hybrid", label: "hybrid", pos: "adj./n.", ipa: "/ˈhaɪbrɪd/", definition: "Of mixed character or composed of mixed parts.", zh: "混合的；杂种的；混合体" },
  { key: "heterogeneous", pattern: "heterogeneous", label: "heterogeneous", pos: "adj.", ipa: "/ˌhetərəˈdʒiːniəs/", definition: "Consisting of parts or members that are very different from each other.", zh: "由全然不同的部分（成员）组成的；混杂的" },
  { key: "beggar_description", pattern: "beggar\\s+(?:any\\s+)?(?:simply\\s+delineated\\s+)?description", label: "beggar description", pos: "phr.", ipa: "", definition: "To be too extreme or shocking to describe or believe.", zh: "难以置信；无法形容" }
];

const hanKangTerms: VocabularyNoteTerm[] = [
  { key: "gripping", pattern: "gripping", label: "gripping", pos: "adj.", ipa: "/ˈɡrɪpɪŋ/", definition: "Exciting or interesting in a way that keeps your attention.", zh: "激动人心的；吸引人的；扣人心弦的" },
  { key: "atrocity", pattern: "atrocities", label: "atrocity", pos: "n.", ipa: "/əˈtrɑːsəti/", definition: "A cruel and violent act, especially in a war.", zh: "（尤指战争中的）残暴行为" },
  { key: "massacre", pattern: "massacres?", label: "massacre", pos: "n.", ipa: "/ˈmæsəkər/", definition: "The killing of a large number of people, especially in a cruel way.", zh: "屠杀；残杀" },
  { key: "enthrall", pattern: "enthrall(?:s|ed|ing)?", label: "enthrall", pos: "v.", ipa: "/ɪnˈθrɔːl/", definition: "If something enthralls you, it is so interesting or beautiful that it holds all your attention.", zh: "迷住；吸引住" },
  { key: "commend", pattern: "commend(?:s|ed|ing)?", label: "commend", pos: "v.", ipa: "/kəˈmend/", definition: "To praise somebody or something, especially publicly.", zh: "（尤指公开地）赞扬；称赞；表扬" },
  { key: "mutter", pattern: "mutter(?:s|ed|ing)?", label: "mutter", pos: "v.", ipa: "/ˈmʌtər/", definition: "To speak or say something in a quiet voice that is difficult to hear.", zh: "嘀咕；嘟囔" },
  { key: "chuck_it_down", pattern: "chuck(?:s|ed|ing)?\\s+it\\s+down", label: "chuck it down", pos: "phr.", ipa: "", definition: "To rain heavily.", zh: "倾盆大雨" },
  { key: "mundane", pattern: "mundane", label: "mundane", pos: "adj.", ipa: "/mʌnˈdeɪn/", definition: "Not interesting or exciting.", zh: "单调的；平凡的" },
  { key: "take_on", pattern: "take(?:s|n)?\\s+on", label: "take on", pos: "phr. v.", ipa: "", definition: "To begin to have a particular quality, appearance, etc.", zh: "呈现；具有（特征、外观等）" },
  { key: "sinister", pattern: "sinister", label: "sinister", pos: "adj.", ipa: "/ˈsɪnɪstər/", definition: "Seeming evil or dangerous; making you think something bad will happen.", zh: "邪恶的；阴险的；不祥的；有凶兆的" },
  { key: "corpse", pattern: "corpses?", label: "corpse", pos: "n.", ipa: "/kɔːrps/", definition: "A dead body, especially of a human.", zh: "尸体；（尤指人的）尸体" },
  { key: "hasten", pattern: "hasten(?:s|ed|ing)?", label: "hasten", pos: "v.", ipa: "/ˈheɪsən/", definition: "To make something happen sooner or more quickly.", zh: "促进；使加快" },
  { key: "uprising", pattern: "uprisings?", label: "uprising", pos: "n.", ipa: "/ˈʌpraɪzɪŋ/", definition: "A situation in which a group of people join together to fight those in power.", zh: "起义；暴动；造反" },
  { key: "imposition", pattern: "imposition", label: "imposition", pos: "n.", ipa: "/ˌɪmpəˈzɪʃən/", definition: "The introduction of something such as a rule, punishment, or tax.", zh: "（规章、惩罚、税种等的）实施" },
  { key: "martial_law", pattern: "martial\\s+law", label: "martial law", pos: "n.", ipa: "", definition: "A situation where the army controls an area instead of the police during a time of trouble.", zh: "军事管制；戒严" },
  { key: "protege", pattern: "protégé|protege", label: "protégé", pos: "n.", ipa: "/ˈprɑːtəʒeɪ/", definition: "A young person who is helped and guided by an older, more experienced person.", zh: "被保护者；门徒" },
  { key: "curate", pattern: "curat(?:e|es|ed|ing)", label: "curate", pos: "v.", ipa: "/kjʊˈreɪt/", definition: "To choose and organize art, music, objects, etc. for an exhibition, show, or collection.", zh: "策划组织（展览、表演、音乐会等）" },
  { key: "mutilate", pattern: "mutilat(?:e|es|ed|ing)", label: "mutilate", pos: "v.", ipa: "/ˈmjuːtɪleɪt/", definition: "To damage somebody’s body very severely, especially by cutting or tearing off part of it.", zh: "使残废；使残缺不全；毁伤" },
  { key: "bayonet", pattern: "bayonets?", label: "bayonet", pos: "n.", ipa: "/ˈbeɪənət/", definition: "A long, sharp knife fastened to the end of a rifle and used as a weapon in battle.", zh: "枪刺；刺刀" },
  { key: "fuss", pattern: "fuss", label: "fuss", pos: "n.", ipa: "/fʌs/", definition: "Unnecessary excitement, worry, or activity; a lot of unnecessary attention.", zh: "无谓的激动（或忧虑、活动）；大惊小怪" },
  { key: "solace", pattern: "solace", label: "solace", pos: "n.", ipa: "/ˈsɑːləs/", definition: "A feeling of emotional comfort when you are sad or disappointed; a person or thing that makes you feel better.", zh: "安慰；慰藉；给以安慰的人（或事物）" },
  { key: "conundrum", pattern: "conundrums?", label: "conundrum", pos: "n.", ipa: "/kəˈnʌndrəm/", definition: "A confusing problem or question that is very difficult to solve.", zh: "令人迷惑的难题；复杂难解的问题" },
  { key: "anglophone", pattern: "anglophone", label: "Anglophone", pos: "adj./n.", ipa: "/ˈæŋɡləfoʊn/", definition: "English-speaking, especially in countries where English is not the only language spoken.", zh: "讲英语的（尤指在英语非唯一语言的国家）" },
  { key: "fabular", pattern: "fabular", label: "fabular", pos: "adj.", ipa: "/ˈfæbjələr/", definition: "Of, relating to, or having the form of a fable.", zh: "寓言的" },
  { key: "head_on", pattern: "head[- ]on", label: "head-on", pos: "adv./adj.", ipa: "", definition: "By expressing strong views and dealing with something in a direct way.", zh: "正面反对地；迎头的" },
  { key: "mechanised", pattern: "mechanis(?:e|es|ed|ing)|mechaniz(?:e|es|ed|ing)", label: "mechanised", pos: "adj.", ipa: "/ˈmekənaɪzd/", definition: "Using machines, especially in place of human effort or manual work.", zh: "（军队）机械化的" },
  { key: "harrowing", pattern: "harrowing", label: "harrowing", pos: "adj.", ipa: "/ˈhæroʊɪŋ/", definition: "Very shocking or frightening and making you feel very upset.", zh: "令人肠断的；使人十分难过的；恐怖的" },
  { key: "lament", pattern: "lament(?:s|ed|ing)?", label: "lament", pos: "v.", ipa: "/ləˈment/", definition: "To feel or express great sadness or disappointment about somebody or something.", zh: "对……感到悲痛；痛惜；对……表示失望" },
  { key: "contextualisation", pattern: "contextuali[sz](?:e|es|ed|ing|ation|ations)", label: "contextualisation", pos: "n.", ipa: "/kənˌtekstʃuəlaɪˈzeɪʃən/", definition: "The process of considering something in relation to the situation in which it happens or exists.", zh: "将……置于背景中考虑；将……置于上下文中理解" },
  { key: "on_account_of", pattern: "on\\s+account\\s+of", label: "on account of", pos: "phr.", ipa: "", definition: "Because of somebody or something.", zh: "由于；因为" },
  { key: "granular", pattern: "granular", label: "granular", pos: "adj.", ipa: "/ˈɡrænjələr/", definition: "Consisting of small granules; looking or feeling like a collection of granules.", zh: "由颗粒构成的；含颗粒的；似颗粒状的" }
];

const caseAgainstTravelTerms: VocabularyNoteTerm[] = [
  { key: "uninformative", pattern: "uninformative", label: "uninformative", pos: "adj.", ipa: "/ˌʌnɪnˈfɔːrmətɪv/", definition: "Not giving enough information.", zh: "不详细的；信息不足的" },
  { key: "articulate", pattern: "articulate", label: "articulate", pos: "adj.", ipa: "/ɑːrˈtɪkjələt/", definition: "Good at expressing ideas or feelings clearly in words.", zh: "善于表达的" },
  { key: "denizen", pattern: "denizens?", label: "denizen", pos: "n.", ipa: "/ˈdenɪzən/", definition: "A person, animal, or plant that lives, grows, or is often found in a particular place.", zh: "（某地区的）居民、常客、动物或植物" },
  { key: "cachet", pattern: "cachet", label: "cachet", pos: "n.", ipa: "/kæˈʃeɪ/", definition: "The state of being respected or admired; prestige.", zh: "威信；声望" },
  { key: "divorce", pattern: "divorc(?:e|es|ed|ing)", label: "divorce", pos: "v.", ipa: "/dɪˈvɔːrs/", definition: "To separate a person, idea, or subject from something; to keep two things separate.", zh: "使分离；使脱离" },
  { key: "delusion", pattern: "delusions?", label: "delusion", pos: "n.", ipa: "/dɪˈluːʒən/", definition: "A false belief or opinion about yourself or your situation.", zh: "错觉；谬见；妄想" },
  { key: "falconry", pattern: "falconry", label: "falconry", pos: "n.", ipa: "/ˈfɔːlkənri/", definition: "The skill or sport of using falcons to hunt.", zh: "放鹰狩猎技巧；放鹰狩猎运动" },
  { key: "aspirational", pattern: "aspirational", label: "aspirational", pos: "adj.", ipa: "/ˌæspəˈreɪʃənəl/", definition: "Wanting very much to achieve success or improve your social status and standard of living.", zh: "渴望成功的；一心想提高社会地位和生活水平的" },
  { key: "locomotive", pattern: "locomotive", label: "locomotive", pos: "adj.", ipa: "/ˌloʊkəˈmoʊtɪv/", definition: "Connected with movement.", zh: "移动的；运动的" },
  { key: "far_flung", pattern: "far[- ]flung", label: "far-flung", pos: "adj.", ipa: "/ˌfɑːr ˈflʌŋ/", definition: "A long distance away.", zh: "遥远的" },
  { key: "recount", pattern: "recount(?:s|ed|ing)?", label: "recount", pos: "v.", ipa: "/rɪˈkaʊnt/", definition: "To tell or describe a story or event to people.", zh: "叙述；描述" },
  { key: "spectator", pattern: "spectators?", label: "spectator", pos: "n.", ipa: "/spekˈteɪtər/", definition: "A person who is watching an event, especially a sports event.", zh: "（尤指体育比赛的）观看者；观众" },
  { key: "imbue", pattern: "imbu(?:e|es|ed|ing)", label: "imbue", pos: "v.", ipa: "/ɪmˈbjuː/", definition: "To fill something with strong feelings, opinions, or values.", zh: "使充满；灌输；激发（强烈感情、想法或价值）" },
  { key: "aura", pattern: "aura", label: "aura", pos: "n.", ipa: "/ˈɔːrə/", definition: "A noticeable feeling or quality that seems to surround a person or place.", zh: "气氛；氛围；气质" },
  { key: "expanse", pattern: "expanse", label: "expanse", pos: "n.", ipa: "/ɪkˈspæns/", definition: "A very large area or amount of something.", zh: "广袤；辽阔；浩瀚" },
  { key: "obscure", pattern: "obscur(?:e|es|ed|ing)", label: "obscure", pos: "v.", ipa: "/əbˈskjʊr/", definition: "To prevent something from being seen or heard properly.", zh: "遮掩；遮蔽；使模糊不清" },
  { key: "annihilation", pattern: "annihilation", label: "annihilation", pos: "n.", ipa: "/əˌnaɪəˈleɪʃən/", definition: "Complete destruction or obliteration.", zh: "毁灭" }
];

const foxEyeTerms: VocabularyNoteTerm[] = [
  { key: "scroll", pattern: "scroll(?:s|ed|ing)?", label: "scroll", pos: "v.", ipa: "/skroʊl/", definition: "To move text on a computer screen up or down so you can read different parts of it.", zh: "（在屏幕上）滚动（文档、页面）" },
  { key: "influencer", pattern: "influencers?", label: "influencer", pos: "n.", ipa: "/ˈɪnfluənsər/", definition: "A person who has the power to affect the purchasing decisions of others, especially through social media.", zh: "具有影响力的人；网红" },
  { key: "fad", pattern: "fads?", label: "fad", pos: "n.", ipa: "/fæd/", definition: "Something that people are interested in for only a short period of time.", zh: "一时的风尚；短暂的狂热" },
  { key: "eyeliner", pattern: "eyeliner", label: "eyeliner", pos: "n.", ipa: "/ˈaɪlaɪnər/", definition: "Colored makeup that you put along the edges of your eyelids to make your eyes look bigger or more noticeable.", zh: "（化妆的）眼线；眼线液" },
  { key: "concealer", pattern: "concealer", label: "concealer", pos: "n.", ipa: "/kənˈsiːlər/", definition: "A skin-colored cream or powder used to cover spots, marks, or dark circles under the eyes.", zh: "遮瑕膏；遮瑕粉" },
  { key: "lash", pattern: "lashes?", label: "lash", pos: "n.", ipa: "/læʃ/", definition: "One of the hairs growing on the edge of the eyelids; usually plural.", zh: "睫毛" },
  { key: "emulate", pattern: "emulat(?:e|es|ed|ing)", label: "emulate", pos: "v.", ipa: "/ˈemjuleɪt/", definition: "To do something or behave in the same way as someone else, especially because you admire them.", zh: "（尤因仰慕而）效仿；模仿" },
  { key: "elongate", pattern: "elongat(?:e|es|ed|ing)", label: "elongate", pos: "v.", ipa: "/ˈiːlɔːŋɡeɪt/", definition: "To become longer, or make something longer than normal.", zh: "（使）拉长" },
  { key: "almond", pattern: "almond(?:s)?", label: "almond", pos: "n.", ipa: "/ˈɑːmənd/", definition: "A flat pale nut with brown skin that tastes sweet, or the tree that produces these nuts.", zh: "扁桃仁；扁桃树；杏仁" },
  { key: "tutorial", pattern: "tutorial", label: "tutorial", pos: "n.", ipa: "/tuːˈtɔːriəl/", definition: "A period of teaching involving discussion between a student and a tutor; also, a practical instructional guide.", zh: "个别辅导课；辅导教程" },
  { key: "showcase", pattern: "showcas(?:e|es|ed|ing)", label: "showcase", pos: "v.", ipa: "/ˈʃoʊkeɪs/", definition: "To present someone’s abilities or the good qualities of something in an attractive way.", zh: "展示（优点）；展现" },
  { key: "winged", pattern: "winged", label: "winged", pos: "adj.", ipa: "/wɪŋd/", definition: "Having wings.", zh: "有翅膀的；有翼的" },
  { key: "slanted", pattern: "slant(?:ed|ing)?", label: "slant", pos: "adj./v.", ipa: "/slænt/", definition: "Sloping in one direction; to slope or lean.", zh: "倾斜的；歪斜的" },
  { key: "round_up", pattern: "rounds?\s+up", label: "round up", pos: "phr. v.", ipa: "", definition: "To find and gather together people, animals, or things.", zh: "将……聚拢起来；使聚集" },
  { key: "laud", pattern: "laud(?:s|ed|ing)?", label: "laud", pos: "v.", ipa: "/lɔːd/", definition: "To praise someone or something.", zh: "称赞；赞美" },
  { key: "dermatologist", pattern: "dermatologists?", label: "dermatologist", pos: "n.", ipa: "/ˌdɜːrməˈtɑːlədʒɪst/", definition: "A doctor who studies and treats skin diseases.", zh: "皮肤病医生；皮肤病专家" },
  { key: "offensive", pattern: "offensive", label: "offensive", pos: "adj.", ipa: "/əˈfensɪv/", definition: "Rude in a way that causes you to feel upset, insulted, or annoyed.", zh: "冒犯的；得罪人的；无礼的" },
  { key: "slur", pattern: "slurs?", label: "slur", pos: "n.", ipa: "/slɜːr/", definition: "An unfair remark about somebody that may damage other people’s opinion of them.", zh: "诽谤；诋毁；污辱" },
  { key: "disregard", pattern: "disregard(?:s|ed|ing)?", label: "disregard", pos: "v.", ipa: "/ˌdɪsrɪˈɡɑːrd/", definition: "To ignore something or treat it as unimportant.", zh: "忽视；轻视；无视" },
  { key: "trigger", pattern: "triggers?", label: "trigger", pos: "v./n.", ipa: "/ˈtrɪɡər/", definition: "To make something happen suddenly; a cause or stimulus for a reaction.", zh: "引发；触发；诱因" },
  { key: "tease", pattern: "teas(?:e|es|ed|ing)", label: "tease", pos: "v.", ipa: "/tiːz/", definition: "To laugh at someone and make jokes about them in order to annoy or embarrass them.", zh: "取笑；戏弄；揶揄" },
  { key: "angular", pattern: "angular", label: "angular", pos: "adj.", ipa: "/ˈæŋɡjələr/", definition: "Having sharp and definite corners.", zh: "有尖角的" },
  { key: "accompanying", pattern: "accompany(?:ing|ies|ied)?", label: "accompanying", pos: "adj.", ipa: "/əˈkʌmpəniɪŋ/", definition: "Happening at the same time as something else.", zh: "伴随的" },
  { key: "appropriation", pattern: "appropriation", label: "appropriation", pos: "n.", ipa: "/əˌproʊpriˈeɪʃən/", definition: "The act of taking something that belongs to somebody else, especially without permission.", zh: "擅自调用；挪用；占用" },
  { key: "tug", pattern: "tug(?:s|ged|ging)?", label: "tug", pos: "v.", ipa: "/tʌɡ/", definition: "To pull with one or more short, quick pulls.", zh: "使劲拉；拽" },
  { key: "mimic", pattern: "mimic(?:s|ked|king)?", label: "mimic", pos: "v.", ipa: "/ˈmɪmɪk/", definition: "To copy the way someone speaks or behaves, especially in order to make people laugh.", zh: "模仿（某人的言行，尤指为了逗乐）" },
  { key: "intent", pattern: "intent", label: "intent", pos: "n.", ipa: "/ɪnˈtent/", definition: "What someone intends to do; an aim or purpose.", zh: "意图；意向；目的" }
];

export function SlateVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><ArticleWithVocabularyNotes paragraphs={paragraphs} terms={slateTerms} idPrefix="slate-note" paragraphTranslations={slateTranslations} /><SlateExercises /></>;
}

export function ViceVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><ArticleWithVocabularyNotes paragraphs={paragraphs} terms={viceTerms} idPrefix="vice-note" paragraphTranslations={viceTranslations} /><ViceExercises /></>;
}

export function LiZiqiVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><ArticleWithVocabularyNotes paragraphs={paragraphs} terms={liZiqiTerms} idPrefix="li-ziqi-note" paragraphTranslations={liZiqiTranslations} /><LiZiqiExercises /></>;
}

export function TokyoVocabularyArticleBody({ paragraphs, sectionHeadings }: { paragraphs: readonly string[]; sectionHeadings?: readonly string[] }) {
  return <ArticleWithVocabularyNotes paragraphs={paragraphs} terms={tokyoTerms} idPrefix="tokyo-note" sectionHeadings={sectionHeadings} paragraphTranslations={tokyoTranslations} />;
}

export function OrientalismVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><ArticleWithVocabularyNotes paragraphs={paragraphs} terms={orientalismTerms} idPrefix="orientalism-note" paragraphTranslations={orientalismTranslations} /><OrientalismExercises /></>;
}

export function HanKangVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><ArticleWithVocabularyNotes paragraphs={paragraphs} terms={hanKangTerms} idPrefix="han-kang-note" paragraphTranslations={["韩江的小说深受韩国大屠杀暴行影响，其黑暗而扣人心弦的叙事却能打动不同背景的读者。", ...hanKangTranslations]} /><HanKangExercises /></>;
}

export function CaseAgainstTravelVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><ArticleWithVocabularyNotes paragraphs={paragraphs} terms={caseAgainstTravelTerms} idPrefix="case-against-travel-note" paragraphTranslations={caseAgainstTravelTranslations} /><CaseAgainstTravelExercises /></>;
}

export function FoxEyeVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><ArticleWithVocabularyNotes paragraphs={paragraphs} terms={foxEyeTerms} idPrefix="fox-eye-note" paragraphTranslations={foxEyeTranslations} /><FoxEyeExercises /></>;
}
