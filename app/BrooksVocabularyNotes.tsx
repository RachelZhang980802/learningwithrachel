"use client";

import { Fragment, useState, type MouseEvent, type ReactNode } from "react";
import { CommencementExercises } from "./CommencementExercises";

export type VocabularyNoteTerm = {
  key: string;
  pattern: string;
  label: string;
  pos: string;
  ipa: string;
  definition: string;
  zh: string;
};

const brooksTerms: VocabularyNoteTerm[] = [
  { key: "commencement", pattern: "commencement", label: "commencement", pos: "n.", ipa: "/kəˈmɛnsmənt/", definition: "A ceremony at which students receive their academic degrees or diplomas.", zh: "学位授予典礼；毕业典礼" },
  { key: "bastard", pattern: "bastards?", label: "bastard", pos: "n.", ipa: "/ˈbæstərd/", definition: "An insulting word for a person considered unpleasant, rude, or cruel.", zh: "混蛋；恶棍（侮辱性用语）" },
  { key: "stand_up", pattern: "stood\\s+me\\s+up", label: "stand somebody up", pos: "v. phr.", ipa: "/stænd ˈsʌmbədi ʌp/", definition: "To deliberately fail to meet someone as arranged, especially for a date.", zh: "故意失约；放某人鸽子" },
  { key: "mediocre", pattern: "mediocre", label: "mediocre", pos: "adj.", ipa: "/ˌmiːdiˈoʊkər/", definition: "Not very good; only of average quality.", zh: "平庸的；普通的" },
  { key: "genre", pattern: "genre", label: "genre", pos: "n.", ipa: "/ˈʒɑːnrə/", definition: "A particular type or style of literature, art, film, or music.", zh: "（文学、艺术、电影或音乐的）体裁；类型" },
  { key: "drop_names", pattern: "drop\\s+the\\s+names", label: "drop names", pos: "v. phr.", ipa: "/drɑːp ˈneɪmz/", definition: "To mention famous or important people you know to impress others.", zh: "提及名人以抬高身份" },
  { key: "obscure", pattern: "obscure", label: "obscure", pos: "adj.", ipa: "/əbˈskjʊr/", definition: "Not well known or not easily noticed.", zh: "无名的；鲜为人知的" },
  { key: "hip_to", pattern: "(?:I['’]m|be|get(?:ting|s)?|got)\\s+hip\\s+to", label: "be/get hip to", pos: "v. phr.", ipa: "/ˈhɪp tuː/", definition: "To understand, know about, or be aware of something.", zh: "了解；熟悉" },
  { key: "screw_that", pattern: "screw\\s+that", label: "screw that", pos: "phr.", ipa: "/skruː ðæt/", definition: "An informal expression used to reject or dismiss an idea with irritation.", zh: "去他的；别理那一套（口语）" },
  { key: "put_off", pattern: "put\\s+off", label: "put off", pos: "v. phr.", ipa: "/pʊt ɔːf/", definition: "To change something to a later time or date; to postpone it.", zh: "推迟；延迟" },
  { key: "void", pattern: "void", label: "void", pos: "n.", ipa: "/vɔɪd/", definition: "An empty space or a feeling that something important is missing.", zh: "空白；空虚" },
  { key: "administrator", pattern: "administrators?", label: "administrator", pos: "n.", ipa: "/ədˈmɪnɪstreɪtər/", definition: "A person responsible for managing an organization or its office work.", zh: "管理人员；行政人员" },
  { key: "fail", pattern: "fail(?:s|ed|ing)?", label: "fail", pos: "v.", ipa: "/feɪl/", definition: "To let someone down by not doing what is expected or needed.", zh: "有负于；使失望" },
  { key: "vicissitude", pattern: "vicissitudes?", label: "vicissitude", pos: "n.", ipa: "/vɪˈsɪsɪtuːd/", definition: "A change or difficulty that happens during the course of life.", zh: "变迁；人生沉浮" },
  { key: "atheism", pattern: "atheism", label: "atheism", pos: "n.", ipa: "/ˈeɪθiɪzəm/", definition: "The belief that there is no God or no gods.", zh: "无神论" },
  { key: "inheritance", pattern: "inheritance", label: "inheritance", pos: "n.", ipa: "/ɪnˈherɪtəns/", definition: "Something valuable or important passed down from the past.", zh: "遗产；传承" },
  { key: "careerist", pattern: "careerist", label: "careerist", pos: "adj.", ipa: "/kəˈrɪərɪst/", definition: "Too focused on career success, often at the expense of other concerns.", zh: "事业至上的；一心追求事业成功的（含贬义）" },
  { key: "specialty", pattern: "specialt(?:y|ies)", label: "specialty", pos: "n.", ipa: "/ˈspeʃəlti/", definition: "A subject or area in which someone has special knowledge or skill.", zh: "专业领域；专长" },
  { key: "host", pattern: "host", label: "host", pos: "n.", ipa: "/hoʊst/", definition: "A large number or variety of people or things.", zh: "大量；许多" },
  { key: "draw_on", pattern: "draw\\s+on", label: "draw on", pos: "v. phr.", ipa: "/drɔː ɑːn/", definition: "To use a supply of knowledge, experience, or resources that is available to you.", zh: "凭借；利用；动用" },
  { key: "diet", pattern: "diet", label: "diet", pos: "n.", ipa: "/ˈdaɪət/", definition: "The things a person regularly takes in; here, the ideas and media a mind is exposed to.", zh: "（持续接触的）内容；精神食粮" },
  { key: "run_of_the_mill", pattern: "run-of-the-mill", label: "run-of-the-mill", pos: "adj.", ipa: "/ˌrʌn əv ðə ˈmɪl/", definition: "Ordinary and not especially interesting, special, or high in quality.", zh: "平凡的；普通的；乏味的" },
  { key: "resolve", pattern: "resolve", label: "resolve", pos: "v.", ipa: "/rɪˈzɑːlv/", definition: "To make a firm decision to do something.", zh: "决心；决定" },
  { key: "rekindle", pattern: "rekindl(?:e|es|ed|ing)", label: "rekindle", pos: "v.", ipa: "/ˌriːˈkɪndəl/", definition: "To make a feeling, interest, or relationship become active again.", zh: "重新唤起；使复苏" },
  { key: "register", pattern: "registers?", label: "register", pos: "n.", ipa: "/ˈredʒɪstər/", definition: "A particular range or level of feeling, thought, or expression.", zh: "（情感或思想的）层次；范围" }
];

export function VocabularyArticleBody({ paragraphs, terms, idPrefix, leadParagraph, sectionHeadings = [], paragraphClassNames = [], paragraphTranslations = [], afterParagraph }: { paragraphs: readonly string[]; terms: readonly VocabularyNoteTerm[]; idPrefix: string; leadParagraph?: string; sectionHeadings?: readonly string[]; paragraphClassNames?: readonly (string | undefined)[]; paragraphTranslations?: readonly string[]; afterParagraph?: (index: number) => ReactNode }) {
  const termsByKey = Object.fromEntries(terms.map((term) => [term.key, term])) as Record<string, VocabularyNoteTerm>;
  const termPattern = new RegExp(terms.map((term) => `(?<${term.key}>\\b(?:${term.pattern})\\b)`).join("|"), "gi");
  const seenTerms = new Set<string>();
  const [openNote, setOpenNote] = useState<{ id: string; term: VocabularyNoteTerm; left: number; top: number } | null>(null);

  function toggleNote(event: MouseEvent<HTMLButtonElement>, id: string, term: VocabularyNoteTerm) {
    if (openNote?.id === id) {
      setOpenNote(null);
      return;
    }
    const button = event.currentTarget;
    const body = button.closest(".inquire-publication-body");
    const paragraph = button.closest("p");
    if (!body || !paragraph) return;

    const bodyRect = body.getBoundingClientRect();
    const wordRect = button.getBoundingClientRect();
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let rightmostTextEdge = wordRect.right;
    let textNode: Node | null;
    while ((textNode = walker.nextNode())) {
      if (textNode.parentElement?.closest(".taylor-vocabulary-note")) continue;
      range.selectNodeContents(textNode);
      for (const rect of Array.from(range.getClientRects())) rightmostTextEdge = Math.max(rightmostTextEdge, rect.right);
    }
    setOpenNote({
      id,
      term,
      left: rightmostTextEdge - bodyRect.left + 18,
      top: wordRect.top - bodyRect.top - 2
    });
  }

  function renderParagraph(paragraph: string, paragraphIndex: number | string, className?: string) {
    if (sectionHeadings.includes(paragraph)) return <h2 className="inquire-publication-section-title" key={paragraphIndex}>{paragraph}</h2>;
    const matches = Array.from(paragraph.matchAll(termPattern));
    const nodes: ReactNode[] = [];
    let cursor = 0;
    for (const match of matches) {
      const surface = match[0];
      const start = match.index ?? 0;
      const key = Object.keys(match.groups ?? {}).find((group) => match.groups?.[group] !== undefined);
      const term = key ? termsByKey[key] : undefined;
      if (!term || start < cursor) continue;
      if (start > cursor) nodes.push(paragraph.slice(cursor, start));
      if (seenTerms.has(term.key)) {
        nodes.push(surface);
        cursor = start + surface.length;
        continue;
      }
      seenTerms.add(term.key);
      const id = `${idPrefix}-${paragraphIndex}-${start}`;
      nodes.push(<span className="taylor-vocabulary-anchor" key={id}>
        <button type="button" className="taylor-vocabulary-highlight" aria-label={`Show vocabulary note for ${term.label}`} aria-expanded={openNote?.id === id} aria-controls={openNote?.id === id ? id : undefined} onClick={(event) => toggleNote(event, id, term)}>{surface}</button>
      </span>);
      cursor = start + surface.length;
    }
    if (cursor < paragraph.length) nodes.push(paragraph.slice(cursor));
    const translation = typeof paragraphIndex === "number" ? paragraphTranslations[paragraphIndex] : undefined;
    return <Fragment key={paragraphIndex}>
      <p className={className}>{nodes.map((node, index) => typeof node === "string" ? <Fragment key={index}>{node}</Fragment> : node)}</p>
      {typeof paragraphIndex === "number" && afterParagraph?.(paragraphIndex)}
      {translation && <details className="supplementary-translation">
        <summary aria-label="展开或收起本段中文翻译" title="点击 ☞ 查看本段中文翻译"><span aria-hidden="true">☞</span></summary>
        <p lang="zh-CN">{translation}</p>
      </details>}
    </Fragment>;
  }

  return <div className="inquire-publication-body">{leadParagraph && renderParagraph(leadParagraph, "lead", "inquire-publication-dek")}{paragraphs.map((paragraph, paragraphIndex) => renderParagraph(paragraph, paragraphIndex, paragraphClassNames[paragraphIndex]))}{openNote && <span className="taylor-vocabulary-note" id={openNote.id} role="group" aria-label={`Vocabulary note for ${openNote.term.label}`} style={{ left: openNote.left, top: openNote.top, width: 286 }}>
    <span className="taylor-vocabulary-note-tape" aria-hidden="true" />
    <span className="taylor-vocabulary-note-heading"><strong>{openNote.term.label}</strong><span className="taylor-vocabulary-note-pos">{openNote.term.pos}</span>{openNote.term.ipa && <span>{openNote.term.ipa}</span>}</span>
    <button type="button" className="taylor-vocabulary-note-close" aria-label={`Close definition for ${openNote.term.label}`} onClick={() => setOpenNote(null)}>×</button>
    <span className="taylor-vocabulary-note-definition">{openNote.term.definition}</span>
    <span className="taylor-vocabulary-note-translation">{openNote.term.zh}</span>
  </span>}</div>;
}

const commencementParagraphTranslations = [
  "你们这群混蛋，居然放了我的鸽子！几个月前你们邀请我来发表毕业典礼演讲，却从没告诉我典礼取消了。我原本准备的演讲，完全符合这种场合平庸得不能再平庸的套路。你们邀请我，是因为我在事业上算是有所成就。你们想让我先讲几个暖心的笑话，再提几支鲜为人知的乐队，好证明我懂年轻人的文化。最后，你们希望我用励志故事收尾，讲讲失败如何教会我宝贵的人生道理——尤其是要慷慨解囊，捐助母校的校友会。",
  "既然你们没来，我就换个话题。先说说我不能当着你们父母的面讲的话。你们的父母为你们骄傲，也有点惊讶你们居然顺利毕业了。他们迫不及待地想看你们开启成功的人生。去他的吧。未来几年并不是开启职业生涯的好时候，所以先别急着工作。把职业起步推迟到 2023 年吧。你们恰好在全球危机期间毕业，一切都被打乱了。你们一直担心的那条职业发展路线，已经彻底中断。别把这看成一片虚无，把它当作一张许可：你们可以暂时不按原计划前进。",
  "现在说说我不能当着教职员工和行政人员讲的话。毕业这一天适合停下来，回想大学里学到的东西；也适合想想大学有哪些地方辜负了你们。许多大学最大的失职在于：它们没有播下思想和道德的种子，而这些种子是你们日后遭遇人生起伏时需要的。如果你们在校时没读简·奥斯汀，可能就缺少认真思考婚姻选择的能力；没读乔治·艾略特，就错过了一堂判断人物品格的大师课；没读尼采，可能还没准备好面对无神论的复杂性；没读奥古斯丁和克尔凯郭尔，也可能还没准备好面对信仰的复杂性。这样的例子还很多：没读托克维尔，你们可能不了解自己的国家；没读吉本，你们可能缺少描述文化与国家兴衰的词汇。",
  "先贤的智慧是你们继承的遗产，能让人生更从容。这些资源常常没能传到学生手中，原因可能是大学过于看重职业发展，也可能是教师更关心自己的学术专长或政治议题，而不是教本科生；当然，还有许多其他原因。但要走过人生，你们会需要借助这份积累下来的智慧。今天正适合找出大学留下了哪些空缺，然后开始把它们补上。",
  "最后，同学们，让我说说那句我不能当着你们本人讲的话：它关乎你们的“饮食”。我说的不是身体摄入的食物，而是精神食粮。你们在往脑子里装些什么？我担心的是，尤其是离开大学以后，你们不会再给大脑补充足够优秀的内容。我把这称为“品味上限理论”：接触天才作品能够拓展意识。若你们常与天才的思想为伴，头脑就会比只接触平庸之作时更加开阔、丰盈。",
  "在大学里，你们会被布置有难度的材料，也会被教着用更有挑战性的方式欣赏绘画、思考科学。毕业后，我们大多数人都打算继续做这些事，可是日子忙碌，到了晚上大脑也疲惫不堪。几个月、几年就这样过去，我们忙着处理各种琐事，最后满足于刷推特，说实话，也包括读新闻。我们的品味上限渐渐降低。你们有没有发现，认识的人里，到了三十岁比二十岁时更无趣的，大概占了七成？我不能当着你们的面说的是：我担心你们未来的品味会停滞甚至萎缩。我这一代以及更早的一些人，至少是有幸接受过大学教育的人，曾接触过经典；经典点燃了一把火，每当我们坐下来读真正优秀的作品，它就会重新燃起。我担心的是，如今人们长大后，甚至可能不知道人类情感与思想还有那些更高远的层次。"
];

export function BrooksVocabularyArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return <><VocabularyArticleBody paragraphs={paragraphs} terms={brooksTerms} idPrefix="brooks-note" paragraphTranslations={commencementParagraphTranslations} /><CommencementExercises /></>;
}
