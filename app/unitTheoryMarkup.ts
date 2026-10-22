// Theory pages for the user-selected source pages in Units Three through Six.
// The guided readers show each selected slide or PDF page inline in teaching order.
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

const sourceImageText: Record<number, { title: string; items: { label: string; text: string }[] }> = {
  165: { title: "Brand-name examples shown on the slide", items: [
    { label: "PayPal", text: "" }, { label: "lululemon", text: "" },
    { label: "KitKat", text: "" }, { label: "Coca-Cola", text: "" }
  ] },
  175: { title: "Sound words shown on the slide", items: [
    { label: "BOOM!", text: "" }, { label: "WOW!", text: "" }, { label: "OMG", text: "" }, { label: "OOOPS!", text: "" },
    { label: "SPLAT!", text: "" }, { label: "ZAP!", text: "" }, { label: "POP!", text: "" }, { label: "WHAM!", text: "" },
    { label: "CRASH!", text: "" }, { label: "POW!", text: "" }, { label: "SMASH!", text: "" }, { label: "POOF!", text: "" },
    { label: "BANG!", text: "" }, { label: "WTF?!", text: "" }, { label: "HAHA!", text: "" }, { label: "YEAH!", text: "" }
  ] },
  178: { title: "Activity 7 · examples 1–8", items: [
    { label: "1 · Hyperbole", text: "Because he wanted to fall into their clutches, they seemed to regard him as a king who could do no wrong." },
    { label: "2 · Metaphor", text: "Arrest seemed but a rosy dream." },
    { label: "3 · Hyperbole", text: "I went out and caught that boy and shook him until his freckles rattled." },
    { label: "4 · Personification", text: "A dead leaf fell in Soapy’s lap. That was Jack Frost’s card." },
    { label: "5 · Metaphor", text: "Days, weeks, and months went by, and still that little cloud of unforgotten cowardice hung above the camp." },
    { label: "6 · Alliteration", text: "… one of the deputies and two of the valorous volunteers—waited, concealed by beer barrels…" },
    { label: "7 · Personification", text: "The city marshal was resolved. He had decided that Calliope Catesby should no more wake the echoes of Quicksand." },
    { label: "8 · Metaphor", text: "She began to talk in Spanish, a mournful stream of melancholy music." }
  ] },
  179: { title: "Activity 7 · examples 9–15", items: [
    { label: "9 · Understatement", text: "It was considered an improper act to shoot the bride and groom at a wedding." },
    { label: "10 · Personification", text: "For there drifted out to Soapy’s ears sweet music that caught and held him transfixed against the convolutions of the iron fence." },
    { label: "11 · Onomatopoeia", text: "There was a confused hum of wheels below, and the sedative buzz of an electric fan." },
    { label: "12 · Simile", text: "Light as a cork, he was kept bobbing along by the human tide." },
    { label: "13 · Personification", text: "… luck would again run against him." },
    { label: "14 · Metaphor", text: "A man gets in a groove in New York. It takes the West to put a razor-edge on him." },
    { label: "15 · Onomatopoeia", text: "… birds twittered sleepily under the roof." }
  ] },
  180: { title: "Activity 10 · sample revisions", items: [
    { label: "1 · Alliteration", text: "Tanysha sat up late in her bedroom silently and studiously trying to study." },
    { label: "2 · Hyperbole", text: "She was such a great student that anything less than a 100++ would send her sobbing from the room." },
    { label: "3 · Simile", text: "Tomorrow’s math test was as important to Tanysha as a candidate’s final election speech is in the presidential election." },
    { label: "4 · Onomatopoeia", text: "With a squeak of bedsprings and the crunch of crumpled paper, Tanysha lay back on her bed for a minute." },
    { label: "5 · Metaphor", text: "She started daydreaming about going to the ivory tower learning to become a disease fighter one day." }
  ] }
};

const slideText = (unit: TheoryUnit, page: number) => {
  if (unit.number === 6 && page === 14) return `<div class="theory-slide-clarity"><h4>Five Elements of Plot</h4><dl><div><dt>Exposition</dt><dd>It refers to the introduction of a story, the background information needed to properly understand the story (p.139–140).</dd></div><div><dt>Rising action</dt><dd>It refers to the events leading up to the climax (p.140).</dd></div><div><dt>Climax</dt><dd>It is the most exciting part of the story. This is where the rising action reaches its peak (p.140).</dd></div><div><dt>Falling action</dt><dd>It deals with the events occurring right after the climax (p.140).</dd></div><div><dt>Resolution / Denouement</dt><dd>It is the end of the falling action and the conclusion to the story (p.140).</dd></div></dl></div>`;
  if (unit.number === 5 && sourceImageText[page]) {
    const { title, items } = sourceImageText[page];
    return `<div class="theory-slide-clarity theory-slide-clarity--examples"><h4>${escapeHtml(title)}</h4><dl>${items.map(({ label, text }) => `<div><dt>${escapeHtml(label)}</dt>${text ? `<dd>${escapeHtml(text)}</dd>` : ""}</div>`).join("")}</dl></div>`;
  }
  const transcript = sourceText(unit, page)?.replace(/\u00a0/g, " ").trim();
  return transcript ? `<details class="theory-slide-transcript"><summary>Read this page as text</summary><p>${escapeHtml(transcript)}</p></details>` : "";
};

const slideImage = (unit: TheoryUnit, page: number, title: string) => {
  const image = pageImage(unit, page);
  const poem = unit.number === 3 && page === 13
    ? `<div class="theory-slide-poem" aria-hidden="true">${(sourceText(unit, page) || "").split("\n").slice(1).map(escapeHtml).join("<br>")}</div>`
    : "";
  const fiveElements = unit.number === 6 && page === 14
    ? `<div class="theory-slide-repair theory-slide-repair--u6-elements" aria-hidden="true"><span class="theory-element--exposition"><b>Exposition</b>Introduces the story and the background needed to understand it.</span><span class="theory-element--rising"><b>Rising action</b>Events leading up to the climax.</span><span class="theory-element--climax"><b>Climax</b>The most exciting part of the story, when rising action reaches its peak.</span><span class="theory-element--falling"><b>Falling action</b>Events right after the climax.</span><span class="theory-element--resolution"><b>Resolution</b>The end of the falling action and the story’s conclusion.</span></div>`
    : "";
  const repair = unit.number === 5 && page === 3
    ? `<div class="theory-slide-repair theory-slide-repair--u5-objectives"><h4>Learning Objectives</h4><p><mark>1) Identify and analyze</mark> themes</p></div>`
    : unit.number === 5 && page === 2
      ? `<div class="theory-slide-repair theory-slide-repair--u5-contents"><strong>05</strong><span>Self-Evaluation</span></div>`
      : unit.number === 3 && page === 3
        ? `<div class="theory-slide-repair theory-slide-repair--u3-objectives"><strong>05</strong><span>${escapeHtml((sourceText(unit, page) || "").split("\n").at(-1) || "")}</span></div>`
        : unit.number === 5 && page === 22
          ? `<div class="theory-slide-repair theory-slide-repair--u5-develop-heading" aria-hidden="true">How to Develop Themes?</div><div class="theory-slide-repair theory-slide-repair--u5-develop-sub" aria-hidden="true"><strong>2) Indirect Telling</strong> [Themes work best when they are subtle in most cases (p.116)]:</div>`
          : "";
  const zoomable = Boolean(poem || repair || fiveElements);
  return `<figure class="theory-inline-slide"><a href="${image}" target="_blank" rel="noopener noreferrer" aria-label="Enlarge Unit ${unit.number}, page ${page}"${zoomable ? ' data-theory-zoom="true"' : ""}><img src="${image}" alt="Unit ${unit.number}, page ${page}: ${escapeHtml(title)}" loading="lazy" decoding="async" />${poem}${repair}${fiveElements}</a>${zoomable ? '<button type="button" class="theory-slide-close" aria-label="Close enlarged page">Close ×</button>' : ""}<figcaption>Click or tap the page to enlarge it.</figcaption></figure>`;
};

const pageReader = (unit: TheoryUnit, section: Section) => {
  const pages = expandPageRanges(section.pages);
  const pageButtons = pages.map((page, index) => `${index && page > pages[index - 1] + 1 ? '<span class="theory-page-gap" aria-label="Unselected source pages omitted">···</span>' : ""}<button type="button" data-theory-page-button="${page}" aria-pressed="${index === 0}" aria-label="Show source page ${page}">${page}</button>`).join("");
  const pagePanels = pages.map((page, index) => {
    const title = unitTheoryPageTitles[unit.number]?.[page] || `Source page ${page}`;
    return `<article class="theory-page" data-theory-page="${page}"${index ? " hidden" : ""}><header><span>Unit ${unit.number} · page ${page}</span><h3>${escapeHtml(title)}</h3></header>${slideImage(unit, page, title)}${slideText(unit, page)}</article>`;
  }).join("");
  return `<div class="theory-lesson-reader" data-theory-reader><div class="theory-reader-intro"><div><p>SOURCE-LED WEB LESSON</p><h2>${escapeHtml(section.label)}</h2></div><span>${pages.length} selected pages · ${section.pages}</span></div><div class="theory-page-strip" aria-label="Source pages in this section">${pageButtons}</div><div class="theory-reader-pages">${pagePanels}</div><div class="theory-reader-controls"><button type="button" data-theory-page-prev disabled>← Previous</button><span data-theory-page-progress>1 / ${pages.length}</span><button type="button" data-theory-page-next${pages.length === 1 ? " disabled" : ""}>Next →</button></div></div>`;
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
    ...unit.sections.map(({ key, label }) => ({ key, label }))
  ];
  const tabButtons = tabs.map(({ key, label }, i) => `<button type="button" role="tab" id="${prefix}-tab-${key}" aria-controls="${prefix}-panel-${key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-theory-tab="${key}">${label}</button>`).join("");
  const panel = (key: string, inner: string, pages: string) => `<section class="theory-panel" id="${prefix}-panel-${key}" role="tabpanel" aria-labelledby="${prefix}-tab-${key}" data-theory-panel="${key}" data-source-pages="${pages}"${key === "objectives" ? "" : " hidden"}>${inner}</section>`;
  const objectivePanel = panel("objectives", `<p class="theory-kicker">Unit ${unit.word} · page 3</p><h1 id="${prefix}-knowledge-title">${unit.number === 3 ? "Teaching Objectives" : "Learning Objectives"}</h1>${slideImage(unit, 3, "Learning Objectives")}${slideText(unit, 3)}`, "3");
  const contentPanel = panel("contents", `<p class="theory-kicker">Unit ${unit.word} · page 2</p><h1>Table of Contents</h1>${slideImage(unit, 2, "Table of Contents")}${slideText(unit, 2)}<nav class="theory-section-links" aria-label="Open a lesson section"><button type="button" data-theory-open-tab="exploration">Pre-exploration</button><button type="button" data-theory-open-tab="skills">Learning the Skills</button>${unit.sections.some(s => s.key === "language") ? '<button type="button" data-theory-open-tab="language">Language Study</button>' : ""}</nav>`, "2");
  const sectionPanels = unit.sections.map(section => panel(section.key, `<p class="theory-kicker">Unit ${unit.word} · pages ${section.pages}</p><h1>${section.title}</h1><p class="theory-lead">${section.intro}</p>${pageReader(unit, section)}`, section.pages)).join("");
  return `<section class="slide theory-unit-cover theory-unit--${unit.number}" id="${prefix}" aria-labelledby="${prefix}-title"><div class="theory-cover-inner"><div class="theory-cover-copy"><p class="theory-overline">Unit ${unit.word} · Narrative Writing</p><h1 id="${prefix}-title">${unit.title}</h1><p class="theory-focus">Writing Critically I: Narrative Writing</p><div class="theory-cover-actions"><a class="theory-primary-link" href="#${prefix}-knowledge">Start unit <span aria-hidden="true">→</span></a><div><a href="#${prefix}-knowledge">View theoretical knowledge</a><a href="#reading" data-reading-target="${unit.reading}">View readings</a></div></div></div>${coverArtwork(unit)}</div></section>
    <section class="slide theory-unit-knowledge theory-unit--${unit.number}" id="${prefix}-knowledge" aria-labelledby="${prefix}-knowledge-title"><a class="theory-back" href="#${prefix}">← Back to unit</a><div class="theory-shell" data-theory-unit="${unit.number}"><div class="theory-tabs" role="tablist" aria-label="Unit ${unit.word} theory sections">${tabButtons}</div>${objectivePanel}${contentPanel}${sectionPanels}</div></section>`;
};

export const unitTheoryMarkup = units.map(content).join("\n");
