// Theory pages for the user-selected source pages in Units Three through Six.
// The guided readers show each selected slide or PDF page inline in teaching order.
import unitThreeNativeSlides from "./unitThreeNativeSlides.json";
import unitThreeReadingPages from "./unitThreeReadingPages.json";
import unitTheoryNativeSlides from "./unitTheoryNativeSlides.json";
import "./unit-three-native.css";
import "./unit-theory-native.css";
import { unitTheoryPageTitles } from "./unitTheoryPageGuide";
import { unitTheoryTranscripts } from "./unitTheoryTranscripts";
import { unitFourTheoryTranscripts } from "./unitFourTheoryTranscripts";
type Section = { key: string; label: string; pages: string; title: string; intro: string; cards: { title: string; body: string; pages: string }[] };
type TheoryUnit = {
  number: number; word: string; slug: string; title: string; focus: string; image: string; imageAlt: string; reading: string;
  objectives: string[]; sections: Section[]; sourceGroups: { label: string; from: number; to: number }[];
};

const units: TheoryUnit[] = [
  {
    number: 3, word: "Three", slug: "three", title: "Growth and Maturity", focus: "Setting",
    image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-03.png",
    imageAlt: "A girl in a white dress seated on a garden swing", reading: "egg",
    objectives: [
      "To understand the importance of setting in narrative writing.",
      "To write various types of setting in a story.",
      "To use sensory words to create atmosphere.",
      "To synthesize several settings within one piece of narration.",
      "To understand the feeling of growth and the relationship between children and adults."
    ],
    sourceGroups: [{ label: "Opening and pre-exploration", from: 1, to: 20 }, { label: "Kinds of story setting", from: 22, to: 28 }, { label: "Learning the skills", from: 29, to: 34 }, { label: "Transference and concrete detail", from: 36, to: 37 }],
    sections: [
      { key: "exploration", label: "Pre-exploration", pages: "4–20, 22–28", title: "What does a place make us feel?", intro: "The deck moves from haunted houses and remote buildings to fields, night streets, sunrise, rain, and imagined worlds. Compare the atmosphere of each place before writing one of your own.", cards: [
        { title: "Dark houses and exposed landscapes", body: "Hawthorne’s haunted house uses dark oak, desolation, and a suggested curse. The castle in Beauty and the Beast mixes isolation with splendor; Wuthering Heights uses wind-bent trees and thorns to make its harsh climate visible.", pages: "5–10" },
        { title: "Sound and quiet", body: "The mill and river passage combines rushing water with a feeling of peace. The Chinese poem pairs cicada noise and birdsong with deeper stillness. The night-bazaar and night-café passages show how darkness, silence, and small sounds change a scene’s emotional effect.", pages: "11–16" },
        { title: "Weather changes perception", body: "Sunrise brings light and heat to a river valley. In the rainy scene, pools, waves, wet tables, and a cat seeking shelter give the weather a physical presence.", pages: "17–20" },
        { title: "Time changes a setting", body: "Compare future, past, present, and wartime stories. Time is more than a date: it shapes what characters expect, fear, and can do.", pages: "22–23" },
        { title: "Place changes possibility", body: "Sea, outer space, islands, Antarctica, and cities place different limits and opportunities before characters. Choose details that make those conditions felt.", pages: "24–26" },
        { title: "Imagined worlds need rules", body: "Hogwarts and Middle-earth show how invented places can feel specific and coherent through named spaces, geography, and consistent detail.", pages: "27–28" }
      ] },
      { key: "skills", label: "Learning the Skills", pages: "29–34, 36–37", title: "Make setting part of the story", intro: "Setting includes locale, historical time, and social circumstances. It may act as a backdrop or become integral to characters and plot.", cards: [
        { title: "The lay of the land", body: "Describe topography and geography when they matter to the action. The Salinas Valley example locates a long, narrow valley between mountains and follows its river toward Monterey Bay.", pages: "30–31" },
        { title: "Weather conditions", body: "Let the reader know what the weather is doing. The slides show damp coats, windblown hair, cold hands, lingering March light, and air that still feels like winter.", pages: "32" },
        { title: "Sensory details through a point of view", body: "Use sight, sound, touch, taste, and smell selectively. The boat memory combines blue water, salt on the lips, wave sounds, the mother’s scent, and rocking motion; the lesson asks writers to choose details that also reveal the perceiving character.", pages: "33–34" },
        { title: "Transference and concrete detail", body: "The deck describes transference as giving a person, place, or thing emotional meaning. In writing, carefully chosen objects and sensations can carry an inner state. Its living-room example builds an atmosphere from a worn sofa, books, a piano, curtains, trees, and snow.", pages: "36–37" }
      ] }
    ]
  },
  {
    number: 4, word: "Four", slug: "four", title: "Truth and Interpretation", focus: "Point of View",
    image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-04.png",
    imageAlt: "A person lying in a beam of light on a field", reading: "short-story",
    objectives: [
      "Define point of view and get familiarized with different types of POV.",
      "Evaluate the functions of different types of POV and how they function in various rhetorical situations.",
      "Investigate the same issue from different perspectives.",
      "Understand why people think differently about the same issue.",
      "Use appropriate words and sentences in narrative writing."
    ],
    sourceGroups: [{ label: "Opening and perspective exercise", from: 1, to: 16 }, { label: "Narrative point of view", from: 17, to: 56 }, { label: "Language study", from: 100, to: 106 }],
    sections: [
      { key: "exploration", label: "Pre-exploration", pages: "4–15", title: "One event, several perspectives", intro: "The Rapunzel exercise rewrites the same event in third, first, and second person. The later pages ask readers to notice how a perpetrator’s account can hide a victim’s experience.", cards: [
        { title: "Rapunzel and the prince", body: "The third-person scene describes both figures from outside. First-person versions give the prince’s struggle to climb and Rapunzel’s painful experience of his grip. The second-person version addresses “you” as Rapunzel. The event stays recognizable while access to thoughts and sensations changes.", pages: "7–11" },
        { title: "A perspective is not the whole truth", body: "The Lolita pages contrast Humbert Humbert’s framing of Dolores with the child’s vulnerability. The teaching point is to ask whose interpretation controls a story and whose experience is obscured.", pages: "12–15" }
      ] },
      { key: "skills", label: "Learning the Skills", pages: "16–56", title: "Who tells the story—and what can they know?", intro: "Point of view governs who narrates, how events are presented, and what the reader can see or infer.", cards: [
        { title: "First person · I / we", body: "A narrator may be the central character, the author in autobiography, a witness, or a minor participant. This voice can give close access to personal experience, but its knowledge is limited. The slides use Jane Eyre, Benjamin Franklin, Marlow, Nick Carraway, and Poe’s narrator to test what a first-person account can and cannot reliably tell us.", pages: "18–27" },
        { title: "Second person · you", body: "The narrator addresses someone as “you”: the self, a character, or the reader. Examples include Bright Lights, Big City, Human Acts, If on a winter’s night a traveler, and a short imagined afterlife scene. Page 34 uses a first-person narrator who addresses “you”; the address alone does not change the whole viewpoint.", pages: "28–35" },
        { title: "Third person · omniscient", body: "An outside narrator can move across minds, times, and places and may interpret events or offer judgments. This broad access supplies more information and authorial freedom.", pages: "36–41, 48" },
        { title: "Third person · objective", body: "The narrator reports observable action and dialogue without revealing thoughts directly. Readers infer motives from what characters say and do. The slides connect this to Hemingway’s Hills Like White Elephants.", pages: "42–44" },
        { title: "Third person · limited", body: "The account stays within one character’s—or only a few characters’—perceptions, thoughts, and memories. The deck contrasts this with omniscience through The Odd Woman.", pages: "45–47" },
        { title: "Compare the same event", body: "Page 49 places the three third-person forms side by side. Pages 50–52 retell a window scene objectively, through one mind, and with access to several minds. Ask what each narrator can know before naming the viewpoint.", pages: "49–52" },
        { title: "Check the four viewpoint examples", body: "Pages 53–56 are answer-key slides: the viewpoint labels are already highlighted on each original page. Compare each label with the narrator’s access to characters’ thoughts.", pages: "53–56" }
      ] },
      { key: "language", label: "Language Study", pages: "100–106", title: "Hemingway: precise language and omission", intro: "The selected language pages pair succinct word choice with the iceberg principle, then introduce a diagram of narrative tenses.", cards: [
        { title: "Precise word choice", body: "Choose simple, direct, concrete words. The deck describes Hemingway’s diction as clear and conversational, with few flowery adjectives or excessive adverbs.", pages: "101–102" },
        { title: "The iceberg principle", body: "The slides describe a style in which surface action is stated plainly while much emotional or thematic meaning remains unstated. Readers infer more than the sentence explicitly explains.", pages: "103–105" },
        { title: "Narrative tenses", body: "The final selected page maps past, present, and future forms. Use the source diagram to compare simple, continuous, perfect, and perfect continuous forms.", pages: "106" }
      ] }
    ]
  },
  {
    number: 5, word: "Five", slug: "five", title: "Dream and Faith", focus: "Theme & Figurative Language",
    image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-05.png",
    imageAlt: "An illustrated figure reaching toward a star", reading: "early-autumn",
    objectives: [
      "Identify and analyze themes.",
      "Present and develop themes.",
      "Appreciate and apply some commonly used examples of figurative language.",
      "Understand the power of dream and faith."
    ],
    sourceGroups: [{ label: "Opening and theme basics", from: 1, to: 18 }, { label: "Developing a theme", from: 22, to: 33 }, { label: "Figurative language", from: 161, to: 175 }, { label: "Practice and literary examples", from: 177, to: 186 }],
    sections: [
      { key: "exploration", label: "Pre-exploration", pages: "4–9", title: "Find the idea beneath the event", intro: "The opening compares stories and images whose actions invite a larger interpretation. What belief about people does each example suggest?", cards: [
        { title: "Father and Son", body: "In the cartoon sequence, a father begins to discipline his son, then notices torn clothes and mends them. The deck reads this change as care that can overcome anger.", pages: "5–7" },
        { title: "Bierce’s Hare and Tortoise", body: "This reversal has the hare finish first and return to encourage the tortoise. The deck draws attention to humility, kindness, and the limits of persistence without attention to circumstance.", pages: "8–9" },
      ] },
      { key: "skills", label: "Learning the Skills", pages: "10–18, 22–33", title: "Turn a topic into a theme", intro: "A topic names an area of concern; a theme expresses a broader idea about it. The selected slides distinguish theme from topic, summary, or a one-word moral.", cards: [
        { title: "What is theme?", body: "The deck defines theme as the central or underlying meaning of a narrative: a general insight about human life connected to the story’s events. Its topic list includes love, loyalty, sacrifice, justice, oppression, conflict, redemption, and coming of age.", pages: "11–15" },
        { title: "Explicit and implicit", body: "An explicit theme is stated openly. An implicit theme emerges through plot, character action, dialogue, and point of view. The slides advise subtle development rather than preaching.", pages: "16–17, 22" },
        { title: "1 · Find the truth", body: "Start with a truth, moral insight, or revelation that matters to you. Page 24 illustrates the idea before the next step.", pages: "23–24" },
        { title: "2 · Give the protagonist a misbelief", body: "Turn that truth on its head. The opposing lie can grow from a character’s desires, fears, or misconceptions.", pages: "25–26" },
        { title: "3 · Give the misbelief a history", body: "Ask what past experience produced this belief. The visual example on page 28 points to repeated harm and shame.", pages: "27–28" },
        { title: "4 · Let the pattern recur", body: "Show the protagonist acting on the misbelief more than once. The pattern makes its cost visible to the reader.", pages: "29–30" },
        { title: "5 · Make the truth felt", body: "Lead the protagonist to an epiphany that confronts the misbelief. The final prompt asks what recent realization you could write from.", pages: "31–33" }
      ] },
      { key: "language", label: "Language Study", pages: "161–175, 177–186", title: "Figurative language in sound and scale", intro: "The selected pages focus on alliteration, understatement, and onomatopoeia, then ask readers to identify devices and write figuratively.", cards: [
        { title: "Alliteration", body: "Nearby words repeat an initial speech sound, usually a consonant, for rhythm, emphasis, mood, or memorability. The slides stress that the sound matters more than the spelling and use names, slogans, and Shakespeare’s Sonnet 30 as examples.", pages: "162–168" },
        { title: "Understatement", body: "A situation is deliberately described as less serious or important than it is. The difference can create irony, humor, politeness, or modesty; the slides include “You are the finest … person I have ever known, but even that is an understatement.”", pages: "169–172" },
        { title: "Onomatopoeia", body: "Words imitate or evoke the sounds they name: “boom,” “tick tock,” and “ding dong” are the deck’s examples. A later illustrated page supplies more sound words for practice.", pages: "173–175" },
        { title: "Understatement in the story", body: "Soapy’s winter wish is described as “not of the highest,” a comically mild phrase for his desperate need for shelter. The formal “hibernatorial ambitions” adds to the ironic tone.", pages: "177" },
        { title: "Identify the device", body: "The answer slides label examples of hyperbole, metaphor, personification, alliteration, onomatopoeia, understatement, and simile. Check each phrase against its label.", pages: "178–179" },
        { title: "Write with figurative language", body: "The Tanysha passage combines several devices around a math test. The next prompt asks for your narrative theme; the final pages invite figurative ways to express love.", pages: "180–186" }
      ] }
    ]
  },
  {
    number: 6, word: "Six", slug: "six", title: "Conflict and Harmony", focus: "Plot & Cohesion",
    image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-06.png",
    imageAlt: "A group of friends sharing a close embrace", reading: "trifles",
    objectives: [
      "Understand the plot structure.",
      "Use a plot diagram to plan for a plot and present the plot structure.",
      "Understand the importance and the role of conflicts.",
      "Understand and apply cohesive devices in narrative writing.",
      "Explore human nature from the plot, especially conflicts."
    ],
    sourceGroups: [{ label: "Opening and short stories", from: 1, to: 12 }, { label: "Plot and conflict", from: 13, to: 19 }, { label: "Cohesion and unity", from: 66, to: 77 }],
    sections: [
      { key: "exploration", label: "Pre-class Exploration", pages: "4–11", title: "How little can a story say?", intro: "The unit opens with a Father and Son sequence and a set of very short stories. Notice the desire, obstacle, surprise, or reversal each one implies.", cards: [
        { title: "Father and Son", body: "After a football breaks the window, the son runs away. The angry father becomes worried when the boy does not return, and their reunion changes the meaning of the earlier conflict.", pages: "5–6" },
        { title: "One Sentence, One Story", body: "The slides place compact examples beside 1984, The Old Man and the Sea, and other images. A few words can suggest a larger sequence and make the reader infer the missing action.", pages: "7–11" }
      ] },
      { key: "skills", label: "Learning the Skills", pages: "12–19", title: "Order events for dramatic meaning", intro: "Plot is a meaningful arrangement of events and thoughts, not merely a chronological list. Conflict connects an objective to an obstacle and generates uncertainty.", cards: [
        { title: "Five elements of plot", body: "Exposition introduces the situation; rising action builds the conflict; climax reaches a turning point; falling action follows its consequences; resolution or denouement closes the action. The diagram on page 15 visualizes this sequence.", pages: "13–15" },
        { title: "The main conflict", body: "The protagonist’s goal and chief obstacle shape a dramatic question that the climax answers. Rival characters can oppose one another without either being a villain. Suspense comes from uncertainty about what a character will do.", pages: "16" },
        { title: "Kinds of conflict", body: "The selected pages distinguish internal and external conflict and show person versus self, destiny, society, nature, technology, other people, and the supernatural. Desires, dilemmas, and situational obstacles can generate conflict. A conflict should grow from a character’s motivation and remain difficult enough to matter.", pages: "17–19" }
      ] },
      { key: "language", label: "Language Study", pages: "66–77", title: "Make the narrative hold together", intro: "Cohesion is the grammatical and lexical “glue” connecting ideas. Unity means every supporting sentence contributes to one main idea.", cards: [
        { title: "The six links", body: "The overview names reference, substitution, lexis, ellipsis, cohesive nouns, and conjunctions. Each connects a sentence to something the reader already knows.", pages: "67–68" },
        { title: "Reference and substitution", body: "Reference points back with a determiner or pronoun. Substitution uses a replacement word or phrase to avoid repeating the same wording.", pages: "69–70" },
        { title: "Lexis and ellipsis", body: "Lexical cohesion joins related words and categories. Ellipsis leaves out wording that context makes recoverable.", pages: "71–72" },
        { title: "Cohesive nouns and conjunctions", body: "A cohesive noun names an earlier idea; a conjunction marks a relation such as sequence, cause, addition, or contrast.", pages: "73–74" },
        { title: "Combine links; keep one main idea", body: "Page 75 combines devices in context. Pages 76–77 shift to unity: every supporting sentence in a paragraph must serve its main idea.", pages: "75–77" }
      ] }
    ]
  }
];

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character] || character);

const expandPageRanges = (ranges: string) => Array.from(ranges.matchAll(/(\d+)(?:\s*[–-]\s*(\d+))?/g)).flatMap((match) => {
  const first = Number(match[1]);
  const last = Number(match[2] || first);
  return Array.from({ length: last - first + 1 }, (_, index) => first + index);
});

const pageImage = (unit: TheoryUnit, page: number) => `/narrative-course/theory/unit-${unit.number}/page-${String(page).padStart(3, "0")}.webp`;

const sourceText = (unit: TheoryUnit, page: number) => unit.number === 4
  ? unitFourTheoryTranscripts[page]
  : unitTheoryTranscripts[unit.number]?.[page];

const slideImage = (unit: TheoryUnit, page: number, _title: string) => unit.number === 3
  ? (unitThreeNativeSlides as Record<string, string>)[String(page)] ?? ""
  : (unitTheoryNativeSlides as Record<string, Record<string, string>>)[String(unit.number)]?.[String(page)] ?? "";

type ReadingItem = { type: "text" | "quote"; text: string; translation?: string };

const readablePage = (unit: TheoryUnit, page: number) => {
  if (unit.number === 3) {
    const items = (unitThreeReadingPages as Record<string, ReadingItem[]>)[String(page)] || [];
    return items.map(({ type, text, translation }) => type === "quote"
      ? `<details class="theory-reading-quote"><summary lang="en">${escapeHtml(text)}</summary><span lang="zh-CN">${escapeHtml(translation || "")}</span></details>`
      : `<p>${escapeHtml(text)}</p>`).join("");
  }
  const source = sourceText(unit, page)?.replace(/\u00a0/g, " ").trim() || "";
  const paragraphs = source.split(/\n\s*\n/).map(block => block.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim()).filter(Boolean);
  return paragraphs.map(block => `<p>${escapeHtml(block)}</p>`).join("");
};

const pageArtwork = (unit: TheoryUnit, page: number, original: string) => {
  if (unit.number === 3) {
    const images = [...original.matchAll(/<img[^>]+src="([^"]+\.(?:png|jpe?g|webp))"/gi)].map(match => match[1]);
    const distinct = [...new Set(images)].slice(0, 2);
    return distinct.length ? `<figure class="theory-page-art" aria-label="Original source illustrations">${distinct.map(src => `<img src="${escapeHtml(src)}" alt="" loading="lazy" />`).join("")}</figure>` : "";
  }
  const art = original.match(/data-src="([^"]+\.svg)"/)?.[1];
  return art ? `<figure class="theory-page-art theory-page-art--slide"><object type="image/svg+xml" data="${escapeHtml(art)}" aria-label="Source illustration"></object></figure>` : "";
};

const topicOverview = (section: Section) => `<div class="theory-topic-overview" aria-label="Topics in ${escapeHtml(section.label)}"><h2>Explore this section</h2><div class="theory-card-grid">${section.cards.map(card => `<article class="theory-card"><span class="theory-page-ref">Pages ${escapeHtml(card.pages)}</span><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.body)}</p><button type="button" data-theory-jump-page="${expandPageRanges(card.pages)[0]}">Read this topic <span aria-hidden="true">→</span></button></article>`).join("")}</div></div>`;

const pageReader = (unit: TheoryUnit, section: Section) => {
  const pages = expandPageRanges(section.pages);
  const pageButtons = pages.map((page, index) => `${index && page > pages[index - 1] + 1 ? '<span class="theory-page-gap" aria-label="Unselected source pages omitted">···</span>' : ""}<button type="button" data-theory-page-button="${page}" aria-pressed="${index === 0}" aria-label="Show source page ${page}">${page}</button>`).join("");
  const pagePanels = pages.map((page, index) => {
    const title = unitTheoryPageTitles[unit.number]?.[page] || `Source page ${page}`;
    const reading = readablePage(unit, page);
    const original = slideImage(unit, page, title);
    return `<article class="theory-page" data-theory-page="${page}"${index ? " hidden" : ""}><header><span>Unit ${unit.number} · page ${page}</span><h3>${escapeHtml(title)}</h3></header>${reading ? `<div class="theory-page-composition"><div class="theory-page-reading">${reading}</div>${pageArtwork(unit, page, original)}</div>` : ""}<details class="theory-original-layout"${reading ? "" : " open"}><summary>View original page layout</summary><div class="theory-original-content">${original}</div></details></article>`;
  }).join("");
  return `<div class="theory-lesson-reader" data-theory-reader><div class="theory-reader-intro"><div><p>READ &amp; EXPLORE</p><h2>${escapeHtml(section.label)}</h2></div><span>${pages.length} selected pages · ${section.pages}</span></div><div class="theory-page-strip" aria-label="Source pages in this section">${pageButtons}</div><div class="theory-reader-pages">${pagePanels}</div><div class="theory-reader-controls"><button type="button" data-theory-page-prev disabled>← Previous</button><span data-theory-page-progress>1 / ${pages.length}</span><button type="button" data-theory-page-next${pages.length === 1 ? " disabled" : ""}>Next →</button></div></div>`;
};

const coverArtwork = (unit: TheoryUnit) => {
  const art = "/narrative-course/theory/source-art";
  if (unit.number === 3) return `<div class="theory-cover-art theory-cover-art--students" aria-hidden="true"><img src="${art}/unit-3-image7.png" alt="" /><img src="${art}/unit-3-image3.png" alt="" /><img src="${art}/unit-3-image5.png" alt="" /></div>`;
  if (unit.number === 4) return `<div class="theory-cover-art theory-cover-art--books" aria-hidden="true"><img src="${pageImage(unit, 1)}" alt="" /></div>`;
  if (unit.number === 5) return `<div class="theory-cover-art theory-cover-art--sticky" aria-hidden="true"><span>✦</span><span>☺</span><span>✦</span></div>`;
  return `<div class="theory-cover-art theory-cover-art--notebook" aria-hidden="true"><img src="${art}/unit-6-image2.png" alt="" /><img src="${art}/unit-6-image3.png" alt="" /></div>`;
};

const content = (unit: TheoryUnit) => {
  const prefix = `unit-${unit.slug}`;
  const tabs = [
    { key: "objectives", label: "Learning Objectives" },
    { key: "contents", label: "Contents" },
    ...unit.sections.map(({ key, label }) => ({ key, label })),
    ...(unit.number === 3 ? [{ key: "settings", label: "Setting Description" }] : [])
  ];
  const tabButtons = tabs.map(({ key, label }, i) => `<button type="button" role="tab" id="${prefix}-tab-${key}" aria-controls="${prefix}-panel-${key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-theory-tab="${key}">${label}</button>`).join("");
  const panel = (key: string, inner: string, pages: string) => `<section class="theory-panel" id="${prefix}-panel-${key}" role="tabpanel" aria-labelledby="${prefix}-tab-${key}" data-theory-panel="${key}" data-source-pages="${pages}"${key === "objectives" ? "" : " hidden"}>${inner}</section>`;
  const objectivePanel = panel("objectives", `<p class="theory-kicker">Unit ${unit.word} · page 3</p><h1 id="${prefix}-knowledge-title">${unit.number === 3 ? "Teaching Objectives" : "Learning Objectives"}</h1><div class="theory-ornament"><span></span>✦<span></span></div><div class="theory-objective-layout"><ol class="theory-objectives">${unit.objectives.map(objective => `<li>${escapeHtml(objective)}</li>`).join("")}</ol><img class="theory-objective-image" src="${unit.image}" alt="${escapeHtml(unit.imageAlt)}" loading="lazy" /></div><p class="theory-source-note">Based on the original lesson, page 3.</p><details class="theory-original-layout"><summary>View original page layout</summary><div class="theory-original-content">${slideImage(unit, 3, "Learning Objectives")}</div></details>`, "3");
  const contentPanel = panel("contents", `<p class="theory-kicker">Unit ${unit.word} · page 2</p><h1>Table of Contents</h1><ol class="theory-contents">${unit.sections.map(section => `<li><button type="button" data-theory-open-tab="${section.key}">${escapeHtml(section.label)}</button><span>p. ${escapeHtml(section.pages)}</span></li>`).join("")}</ol><p class="theory-source-note">Choose a section to read its topics and source pages.</p><details class="theory-original-layout"><summary>View original page layout</summary><div class="theory-original-content">${slideImage(unit, 2, "Table of Contents")}</div></details>`, "2");
  const sectionPanels = unit.sections.map(section => panel(section.key, `<p class="theory-kicker">Unit ${unit.word} · pages ${section.pages}</p><h1>${section.title}</h1><p class="theory-lead">${section.intro}</p>${topicOverview(section)}${pageReader(unit, section)}`, section.pages)).join("");
  return `<section class="slide theory-unit-cover theory-unit--${unit.number}" id="${prefix}" aria-labelledby="${prefix}-title"><div class="theory-cover-inner"><div class="theory-cover-copy"><p class="theory-overline">Unit ${unit.word} · Narrative Writing</p><h1 id="${prefix}-title">${unit.title}</h1><p class="theory-focus">Writing Critically I: Narrative Writing</p><div class="theory-cover-actions"><a class="theory-primary-link" href="#${prefix}-knowledge">Start unit <span aria-hidden="true">→</span></a><div><a href="#${prefix}-knowledge">View theoretical knowledge</a><a href="#reading" data-reading-target="${unit.reading}">View readings</a></div></div></div>${coverArtwork(unit)}</div></section>
    <section class="slide theory-unit-knowledge theory-unit--${unit.number}" id="${prefix}-knowledge" aria-labelledby="${prefix}-knowledge-title"><a class="theory-back" href="#${prefix}">← Back to unit</a><div class="theory-shell" data-theory-unit="${unit.number}"><div class="theory-tabs" role="tablist" aria-label="Unit ${unit.word} theory sections">${tabButtons}</div>${objectivePanel}${contentPanel}${sectionPanels}${unit.number === 3 ? panel("settings", `<p class="theory-kicker">Descriptosaurus · PDF pp. 46–180</p><div id="setting-reference-slot"></div>`, "46–180") : ""}</div></section>`;
};

export const unitTheoryMarkup = units.map(content).join("\n");
