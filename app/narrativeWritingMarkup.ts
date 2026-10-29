import { renderNoteHighlights } from "./narrativeNoteHighlights";
import { literaryConcepts } from "./literaryConcepts";
import { afterTwentyStoryParagraphs } from "./afterTwentyStoryText";
import { copAnthemStoryParagraphs } from "./copAnthemStoryText";
import { daysWaitStoryParagraphs } from "./daysWaitStoryText";
import { earlyAutumnStoryParagraphs } from "./earlyAutumnStoryText";
import { eggStoryParagraphs } from "./eggStoryText";
import { fatStoryParagraphs } from "./fatStoryText";
import { flowersStoryParagraphs } from "./flowersStoryText";
import { lastLeafStoryParagraphs } from "./lastLeafStoryText";
import { necklaceStoryParagraphs } from "./necklaceStoryText";
import { necklaceTestQuestions } from "./necklaceTestQuestions";
import { storyHourStoryParagraphs } from "./storyHourStoryText";
import { triflesStoryParagraphs } from "./triflesStoryText";
import { unitTwoMarkup } from "./unitTwoMarkup";
import { unitTheoryMarkup } from "./unitTheoryMarkup";
import { veryShortStoryParagraphs } from "./veryShortStoryText";
import { narrativeAuthorBios } from "./narrativeAuthorBios";
import { narrativeParagraphTranslations } from "./narrativeParagraphTranslations";
import { narrativeBloomQuestions } from "./narrativeBloomQuestions";

function escapeStoryText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

type ReadingTestQuestion = { question: string; options?: readonly string[]; answer: string | null; level?: string };

function renderReadingTestNotes(title: string, questionsData: readonly ReadingTestQuestion[]) {
  const questions = questionsData.map((item, index) => {
    const number = String(index + 1).padStart(2, "0");
    const options = item.options?.map((option, optionIndex) => "<li><strong>" + String.fromCharCode(65 + optionIndex) + ".</strong> " + escapeStoryText(option) + "</li>").join("") ?? "";
    const optionList = options ? "<ol type=\"A\">" + options + "</ol>" : "";
    const level = item.level ? "<span class=\"reading-test-level\">" + escapeStoryText(item.level) + "</span>" : "";
    const answer = item.answer ? "<details class=\"reading-test-answer\"><summary>Reveal answer</summary><p><strong>" + escapeStoryText(item.answer) + "</strong></p></details>" : "<p class=\"reading-test-answer-missing\">Answer key not supplied</p>";
    return "<li><details class=\"reading-test-note\"><summary><span class=\"reading-test-number\">Q" + number + "</span><span>" + level + escapeStoryText(item.question) + "</span></summary><div class=\"reading-test-note-content\">" + optionList + answer + "</div></details></li>";
  }).join("");
  return "<aside class=\"reading-test-notes\" aria-label=\"" + escapeStoryText(title) + " reading questions\"><header class=\"reading-test-notes-heading\"><p>TEST NOTES</p><h2>Check your reading</h2><span>" + questionsData.length + " questions</span></header><ol class=\"reading-test-note-list\">" + questions + "</ol></aside>";
}

function renderNecklaceTestNotes() {
  return renderReadingTestNotes("The Necklace", necklaceTestQuestions);
}

function renderReadingAuthorBio(author: string) {
  const biography = narrativeAuthorBios[author];
  const note = biography
    ? `<details class="reading-author-note"><summary aria-label="Read author biography: ${escapeStoryText(author)}"><span class="reading-author-pin" aria-hidden="true">✦</span><span class="reading-author-name">By ${escapeStoryText(author)}</span></summary><div class="reading-author-biography" lang="en">${biography}</div></details>`
    : "";
  return note ? `<span class="reading-author-group">${note}</span>` : `<span class="reading-author-name">By ${escapeStoryText(author)}</span>`;
}

function renderStoryParagraphs(paragraphs: readonly string[], story = "", insertions: Readonly<Record<number, string>> = {}) {
  const isPlay = paragraphs[0]?.trim() === "CHARACTERS";
  let openingAssigned = false;

  return paragraphs
    .map((paragraph, paragraphIndex) => {
      const text = paragraph.trim();
      if (text === "* * *") return `<p class="reading-full-text-divider">* * *</p>`;
      if (text === "CHARACTERS") return `<h3 class="reading-full-text-section-title">CHARACTERS</h3>`;
      if (text === "CURTAIN") return `<p class="reading-full-text-curtain">CURTAIN</p>`;

      const classes: string[] = [];
      if (text.startsWith("[")) classes.push("reading-full-text-stage-direction");
      if (/^[A-Z][A-Z .’'-]+:/.test(text)) classes.push("reading-full-text-script-line");
      if (!isPlay && !openingAssigned && classes.length === 0) {
        classes.push("reading-full-text-opening");
        openingAssigned = true;
      }

      const className = classes.length ? ` class="${classes.join(" ")}"` : "";
      const insertion = (insertions[paragraphIndex] ?? "").replaceAll(
        '<details class="reading-analysis-note',
        `<details data-note-anchor-index="${paragraphIndex}" class="reading-analysis-note`,
      );
      // The Necklace is rendered from a legacy id (`necklace`), while its
      // translation map uses the stable reading id. Normalize before lookup so
      // the per-paragraph controls are actually emitted for this story.
      const translationStory = story === "necklace" ? "reading-necklace" : story;
      const storyTranslations = narrativeParagraphTranslations[translationStory];
      const translation = story === "reading-trifles"
        ? paragraphIndex === 69
          ? "【她迅速关上通往楼上的门。】"
          : storyTranslations?.[paragraphIndex >= 70 ? paragraphIndex - 1 : paragraphIndex]
        : storyTranslations?.[paragraphIndex];
      const translationControl = translation
        ? `<details class="reading-paragraph-translation"><summary aria-label="Show Chinese translation for paragraph ${paragraphIndex + 1}">☃︎</summary><p lang="zh-CN">${translation}</p></details>`
        : "";
      return `${insertion}<p${className} data-reading-story="${story}" data-reading-paragraph-index="${paragraphIndex}">${renderNoteHighlights(story, paragraphIndex, paragraph)}</p>${translationControl}`;
    })
    .join("\n");
}

function renderFatThinkingSpark(number: number, label: string, question: string, answer: string) {
  const numberLabel = String(number).padStart(2, "0");
  return `<details class="reading-analysis-note reading-analysis-note--thinking-spark"><summary><span>Q${numberLabel} · ${question}</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>${label}</h3>${answer}</div></details>`;
}

const fatReadingNotes: Readonly<Record<number, string>> = {
  0: renderFatThinkingSpark(1, "Point of View", "What is the point of view of the narration?", `<p>The story is told in the first person by a waitress who recounts the events to her friend Rita. The narration is closely focalized through the waitress, so readers experience the fat man and the other characters through her observations and thoughts.</p><p>The narration may sound objective because the language is restrained and matter-of-fact. However, the perspective is still subjective: the narrator selects and describes what she notices, and her feelings gradually become more apparent. Her reliability can be questioned, but the story does not establish that she is definitely unreliable.</p>`),
  7: renderFatThinkingSpark(2, "The Pronoun ‘We’", "Why does the man refer to himself as “we”?", `<p>The man’s use of “we” may suggest that he sees a division between his ordinary self and the self represented by his body or appetite. One possible interpretation is that his “normal self” observes a self that does not meet social expectations.</p><p>In this reading, the plural pronoun acts as a psychological defense. It may help him distance himself from the shame and discomfort of being watched and judged. It can also be read as a quiet linguistic rebellion against the social discipline imposed on people whose bodies are treated as unacceptable. The unusual pronoun creates a sense of defamiliarization and invites readers to consider who is included in “we.”</p>`),
  12: renderFatThinkingSpark(3, "Othering", "How do the other characters perceive or respond to the man?", `<p>Several characters respond to the fat man with ridicule or detachment. They label him and discuss him as though he were an object of spectacle. Their comments enact a form of social othering: they define what is “normal” by excluding him.</p><p>The narrator initially participates in this gaze by repeatedly focusing on his size. Yet her response changes as the story progresses. She becomes more sympathetic and eventually tells Leander, “He can’t help it, so shut up.” Her growing identification with the fat man reveals the human cost of stigmatization. Carver presents this shift with restraint, allowing readers to infer its significance.</p>`),
  17: renderFatThinkingSpark(4, "The Fat Man", "What personal characteristics does the man show?", `<p>The man is extremely overweight and has notably large fingers, but he is neatly dressed. He is polite, gentle, and deferential, repeatedly saying “please” and “thank you.” He is considerate of the waitress and asks whether he is making her late. When she spills his water, he responds kindly: “It’s all right. Don’t worry about it.”</p><p>His explanations about eating—such as “we don’t eat like this all the time”—may suggest that he is aware of how others perceive him and feels self-conscious. The story implies this possibility without directly stating what he feels.</p>`),
  15: renderFatThinkingSpark(5, "The Narrator", "What personal characteristics does the narrator show?", `<p>The narrator is observant, emotionally restrained, and self-controlled in her work. She notices the man’s appearance and behavior closely, but she is also curious about him. As the evening continues, she becomes more conscious of her own responses and increasingly uncomfortable with the way others ridicule him.</p><p>Her defense of the man suggests empathy and a developing moral awareness. She does not explain this change directly; instead, Carver lets it emerge through her words and actions.</p>`),
  31: renderFatThinkingSpark(6, "Rudy", "What personal characteristics does Rudy show?", `<p>Rudy appears coarse, mocking, and emotionally shallow. He jokes about the fat man, calling him a “fat man from the circus,” and later tells a story about children nicknamed “Fat” and “Wobbly.” His casual laughter suggests that he does not reflect on the harm caused by turning people’s bodies into entertainment.</p><p>Rudy functions as a foil to the narrator’s growing empathy. His coarse humor exposes the everyday cruelty that the story presents through understatement.</p>`),
  55: renderFatThinkingSpark(7, "Joanne’s Comment", "Why does Joanne say, “Better watch out, Rudy”?", `<p>Joanne’s comment is a teasing response to Rudy’s claim that he is getting jealous. The exchange has a humorous, familiar tone. It may also hint at some fragility or tension in their relationship, though the story does not explain this moment further.</p>`),
  69: renderFatThinkingSpark(8, "The Relationship", "What can we infer about the relationship between the narrator and Rudy?", `<p>The narrator and Rudy share a domestic routine and physical intimacy. At the same time, their relationship appears emotionally detached: they spend time together, but their interactions show little communication or tenderness.</p><p>This contrast between physical closeness and emotional distance helps frame the narrator’s unease at the end of the story.</p>`),
  70: renderFatThinkingSpark(9, "A Change in Attitude", "Has the narrator’s attitude toward Rudy changed?", `<p>The narrator’s attitude seems to shift subtly but significantly. At first, she accepts their familiar routines. When Rudy joins in mocking the fat man, however, she responds sharply: “He can’t help it, so shut up.” This moment signals a move from passive acceptance toward resistance.</p><p>Later, during her sexual encounter with Rudy, she suddenly feels that she is fat and that Rudy is “a tiny thing and hardly there at all.” The experience suggests growing alienation and emotional distance. Her changed attitude is conveyed indirectly, through her perception of her own body and of Rudy.</p>`),
  72: renderFatThinkingSpark(10, "The Narrator’s Depression", "Why does the narrator feel depressed? What has changed?", `<p>The story does not give a single explicit explanation for the narrator’s depression. One possible interpretation is that she recognizes a connection between her experience and the fat man’s.</p><p>During sex with Rudy, the narrator suddenly feels enormous, while Rudy seems tiny and almost absent. This moment may suggest a loss of agency: the fat man is defined by the public gaze, while the narrator becomes acutely aware of her body in relation to Rudy. In both cases, the body can be read as a site where another person’s gaze or actions shape one’s sense of self.</p><p>The characters’ namelessness may deepen this interpretation. The waitress is known only as “I,” and the man is called “the fat man.” They are visible to others but not fully recognized as individuals. Their namelessness can suggest social powerlessness: they are looked at, spoken about, or used, but are not fully heard.</p><p>From this perspective, the narrator’s depression reflects a sudden awareness of a shared condition of objectification and voicelessness. The story can also be read through the intersections of gender, class, and the politics of the body. These are interpretive possibilities rather than explicit explanations supplied by the narrator.</p>`),
  75: renderFatThinkingSpark(11, "August", "Why might the story end with “It is August”?", `<p>August can be read as a season of paradox: it holds the fullness of summer while also approaching autumn. In a symbolic reading, it suggests a cycle of ripeness, decline, and possible renewal.</p><p>The narrator’s outward life has not yet changed, but her encounter with the fat man seems to awaken a new awareness. This awareness may be like a seed of change. In Carver’s minimalist style, transformation does not appear as a clear action or explanation; it begins as a felt possibility.</p><p>Thus, August may function both as a specific time of year and as a metaphor for a change that is beginning but has not yet taken shape. The story leaves the nature of that change open.</p>`),
  64: renderFatThinkingSpark(12, "Narrative Strands", "How many narrative strands are there?", `<p>The story can be understood as having three main narrative strands:</p><ul><li><strong>The frame narrative:</strong> the narrator speaks to Rita in the present.</li><li><strong>The restaurant episode:</strong> the narrator recounts her encounter with the fat man.</li><li><strong>The domestic aftermath:</strong> the narrator returns home with Rudy and reflects on her life.</li></ul><p>An optional fourth strand is the narrator’s inner reflection and anticipation of change. This runs through the other strands rather than forming a fully separate storyline.</p>`),
  76: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Minimalism</h3><p>Minimalist writing pares language down through selective detail and omission. Rather than explaining every feeling or cause, the story invites readers to infer meaning from dialogue, gestures, pauses, and repeated details.</p><p>In “Fat,” the restrained narration leaves questions unresolved, including the meaning of “we,” the narrator’s bodily identification with the man, and the change she anticipates in August. Brief, abrupt moments slow the reading and can create tension, isolation, or sudden awareness. The story’s understatement gives these emotional shifts force while leaving room for readers to interpret them.</p></div></details>`,
};

const afterTwentyTestQuestions: readonly ReadingTestQuestion[] = [
  { question: "Why does the stranger say he is lurking in the doorway of the hardware store?", options: ["He wants to smoke his cigar out of the wind", "He is waiting for the store to open", "He has an appointment made 20 years ago", "He has been living in the store for 20 years"], answer: "C" },
  { question: "What does the narrator suggest about the stranger’s character after he lights his cigar?", options: ["He is clearly a criminal who cannot be trusted", "His appearance suggests a shady past that conflicts with his apparent loyalty", "His intelligent eyes prove that he is entirely innocent of any wrongdoing", "He is pretending to be someone else entirely"], answer: "B" },
  { question: "Why does the stranger believe that Jimmy will meet him at the agreed spot?", options: ["Because he thinks Jimmy is the truest and most loyal man in the world", "Because they have been writing to each other regularly for 20 years", "Because Jimmy owes him money from long ago", "Because he recently received a telegram from Jimmy confirming it"], answer: "A" },
  { question: "What detail makes Bob suspicious about the man who claims to be Jimmy?", options: ["He calls Bob by the wrong name", "He is wearing different clothes than Jimmy used to", "He doesn’t remember their childhood experiences", "He is taller than Bob remembers him being"], answer: "D" },
  { question: "What does the tall man reveal after Bob recognizes that he is not really Jimmy?", options: ["He has come in Jimmy’s place because Jimmy is dead", "He is a plainclothes police officer arresting Bob", "He is an old acquaintance from Chicago", "He is another criminal tricking Bob"], answer: "B" },
  { question: "What theme is emphasized when Jimmy’s choice is revealed at the end of the story?", options: ["The importance of second chances", "The triumph of personal ambition", "The conflict between loyalty and responsibility", "The dangers of city life"], answer: "C" },
];

function renderAnalysisNote(category: string, heading: string, body: string) {
  const front = category === "literary-device" ? "Literary Devices" : heading.split(" · ", 1)[0];
  return `<details class="reading-analysis-note reading-analysis-note--${category}"><summary><span>${front}</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>${heading}</h3>${body}</div></details>`;
}

const afterTwentyNotes: Readonly<Record<number, string>> = {
  0: renderAnalysisNote("setting", "Setting · New York City", `<p>The story unfolds on a cold, rainy night on a New York street. The closed restaurant marks how the city—and the friends’ lives—have changed over twenty years.</p>`),
  4: renderAnalysisNote("literary-device", "Symbolism · Big Joe Brady’s Restaurant", `<p>The restaurant stands for the friends’ shared past and their promise. By the time they return, it has disappeared; their friendship belongs to the past too.</p>`),
  5: renderAnalysisNote("literary-device", "Foreshadowing · Bob’s appearance", `<p>Bob’s pale face, scar, and unusually large diamond hint that there is more to his claimed success than he admits. These details gain meaning when his wanted status is revealed.</p>`),
  10: renderAnalysisNote("indirect", "Characterization · Jimmy and Bob", `<p>Jimmy’s steady police work and discreet handling of the arrest show discipline and lingering loyalty. Bob’s scar, diamond, and account of making a fortune hint at criminal success, while his long wait shows faithfulness to the old promise.</p>`),
  18: renderAnalysisNote("pov", "Point of View · Third-Person Limited", `<p>The third-person narration observes the policeman and then stays chiefly with Bob’s wait and reunion. It withholds Jimmy’s recognition of Bob until the final note, allowing the surprise to unfold with Bob’s discovery.</p>`),
  22: renderAnalysisNote("literary-device", "Foreshadowing · The false Jimmy", `<p>Bob notices that “Jimmy” seems two or three inches taller. The man’s explanation and his later mention of a city-department job hint that he is a substitute police officer.</p>`),
  28: renderAnalysisNote("literary-device", "Situational Irony · The reunion", `<p>Bob expects to reunite with his loyal childhood friend, but Jimmy recognizes him as a wanted criminal and arranges his arrest. The promised meeting happens, yet the friends’ changed lives make their old relationship impossible.</p>`),
  29: renderAnalysisNote("theme", "Theme · Time and identity", `<p>Twenty years have changed the friends beyond the identities they remember: Jimmy became a police officer, while Bob became a wanted man. Even their reunion cannot restore the friendship they once had.</p>`),
  31: renderAnalysisNote("plot", "Plot · Promise and reversal", `<p>Two friends promise to meet again; twenty years later, Bob arrives as a wanted man. Jimmy recognizes him, sends another officer to arrest him, and explains his choice in a note.</p><p class="reading-plot-chain">Promise → Reunion → Recognition → Arrest</p>`),
  32: renderAnalysisNote("theme", "Theme · Loyalty and duty", `<p>The story explores the conflict between personal loyalty and professional responsibility. Jimmy upholds his duty as a police officer but avoids arresting Bob himself, leaving readers to judge whether this preserves friendship or evades responsibility.</p>`),
};

const lastLeafTestQuestions: readonly ReadingTestQuestion[] = [
  {question:"Which aspect of life in Greenwich Village does O. Henry highlight as a challenge for its residents?",options:["The competition among artists for gallery space","The difficulty in gaining recognition in the artistic community","The high cost of rent despite the bohemian lifestyle","The poor living conditions and related health risks"],answer:"D"},
  {question:"How do Sue and Johnsy come to live together?",options:["They were assigned the same studio by a local art council","They met in a restaurant and bonded over their shared artistic tastes","They were relatives who decided to collaborate artistically","They were recommended to each other by a mutual acquaintance"],answer:"B"},
  {question:"What does the doctor’s attitude toward Johnsy’s depression reveal about the societal views of the time?",options:["Professional success for women was valued over personal issues","Women’s issues were generally disregarded by the medical profession","Women were expected to care more about romantic issues than artistic ambitions","Women were encouraged to be independent and pursue careers"],answer:"C"},
  {question:"What metaphor does Johnsy use to express her resignation to dying?",options:["She describes herself as going sailing down like a falling leaf","She likens herself to a ship sinking into the ocean","She compares herself to a bird ready to fly away","She envisions herself as a candle flame flickering out"],answer:"A"},
  {question:"What underlying theme does Behrman’s behavior toward Johnsy and Sue illustrate in the story?",options:["The impact of professional success on personal character","The harsh realities of the artist’s life in Greenwich Village","The persistence of human compassion despite personal hardships","The importance of artistic recognition over personal relationships"],answer:"C"},
  {question:"How does Johnsy’s view toward her bond with Sue change as she prepares for death?",options:["She feels more connected to Sue because her illness has brought them together","She believes severing ties will make her death easier for both of them","She becomes resentful of Sue for not understanding her feelings","She becomes indifferent to Sue and realizes she never really liked her"],answer:"B"},
  {question:"How does Johnsy’s view on life change after observing the survival of the last leaf after a night of wind?",options:["She regains her will to live, seeing her desire to die as wrong","She loses all hope, believing the leaf’s survival is just a cruel joke","She becomes indifferent, waiting for nature to take its course","She decides to leave the city, hoping to find peace elsewhere"],answer:"A"},
  {question:"What ultimately leads to Behrman’s death?",options:["His long-term illness exacerbated by old age","A sudden and unexpected accident","Being neglected by those he cared for","Catching pneumonia while out in the storm painting the leaf"],answer:"D"},
  {question:"How does Sue interpret Behrman’s act of painting the leaf?",options:["As a desperate but failed attempt to become a successful artist","As a foolish sacrifice that ultimately had no real impact","As his greatest work and a combination of artistic skill with selfless love","As a misunderstood gesture that Johnsy fails to appreciate"],answer:"C"},
];

const lastLeafNotes: Readonly<Record<number, string>> = {
  0: renderAnalysisNote("setting", "Setting · Greenwich Village", `<p>Set in New York City’s Greenwich Village in the early 1900s, the story places the artists in a poor neighborhood where cold weather and illness threaten their fragile lives.</p>`),
  1: renderAnalysisNote("literary-device", "Personification and Metaphor · Pneumonia", `<p>Pneumonia is an “unseen stranger” who “stalked” the district and touched people with “his icy fingers.” The metaphor and human actions make the disease feel like a menacing intruder.</p>`),
  10: renderAnalysisNote("literary-device", "Personification · Autumn", `<p>“The cold breath of autumn” gives the season a human quality as it strips the ivy vine of its leaves.</p>`),
  13: renderAnalysisNote("literary-device", "Symbolism · The last leaf", `<p>Johnsy treats the falling leaves as a measure of her own life. Behrman’s painted leaf survives the storm and gives her a reason to hope; its symbolic power becomes an act of care.</p>`),
  15: renderAnalysisNote("literary-device", "Simile · Johnsy and the leaf", `<p>Johnsy imagines herself going “just like one of those poor, tired leaves.” The comparison makes her feel as fragile and detached from life as the leaves she watches fall.</p>`),
  8: renderAnalysisNote("pov", "Point of View · Third-Person Limited", `<p>The third-person narration follows Sue’s efforts to care for Johnsy, while Johnsy’s despair emerges through her words and actions. Behrman’s secret remains hidden until Sue explains the leaf at the end.</p>`),
  17: renderAnalysisNote("indirect", "Characterization · Johnsy, Sue, and Behrman", `<p>Johnsy’s fixation on the leaves shows her despair; Sue’s steady nursing shows practical devotion. Behrman’s gruffness masks his affection, revealed when he risks his life to paint the leaf.</p>`) + renderAnalysisNote("literary-device", "Metaphor · Behrman as a guard dog", `<p>Behrman regards himself as a “guard dog” to the two young artists. The metaphor presents his rough protectiveness as loyal care.</p>`),
  30: renderAnalysisNote("plot", "Plot · The turning point", `<p><strong>Exposition:</strong> Pneumonia threatens Johnsy in New York. <strong>Rising action:</strong> She counts the falling leaves and Behrman hears of her belief. <strong>Climax:</strong> After the storm, the last leaf appears to survive. <strong>Falling action:</strong> Johnsy regains her will to live. <strong>Resolution:</strong> Sue reveals Behrman’s painted masterpiece and sacrifice.</p><p class="reading-plot-chain">Despair → Painted Leaf → Renewed Hope → Sacrifice Revealed</p>`),
  38: renderAnalysisNote("literary-device", "Situational Irony · The masterpiece", `<p>Behrman has spent decades hoping to paint a masterpiece. His greatest work is not a celebrated canvas but a leaf painted on a wall; it saves Johnsy, while he dies from the storm.</p>`) + renderAnalysisNote("theme", "Theme · Hope, friendship, and sacrifice", `<p>Johnsy’s recovery follows the return of hope, while Behrman’s final act turns his long-awaited masterpiece into a gift that saves another life. The story links art with friendship and selfless care.</p>`),
};

const eggTestQuestions: readonly ReadingTestQuestion[] = [
  {question:"The author describes his mother as",options:["knowledgeable","responsible","imaginative","aspiring"],answer:""},
  {question:"What is paragraph 5 intended to show?",options:["The specific steps of chicken raising","The difficulties of chicken raising","The excitement of the family","The expectations of the family"],answer:""},
  {question:"What does “our upward journey” in paragraph 6 indicate?",options:["Their worries","Their struggle","Their ambition","Their resourcefulness"],answer:""},
  {question:"What is the relation between the two italicized sentences in paragraph 7?",options:["Temporal","Causal","Illustrative","Additive"],answer:""},
  {question:"Which sentence in paragraphs 8 and 9 indicates the author’s sense of hope?",options:["‘I wanted to see the wonders of the world.’","‘I had at that time already begun to read books…’","‘I walked the entire eight miles…’","‘…a book concerning our flight from the chicken farm into town.’"],answer:""},
];

const eggQANotes: Readonly<Record<number, string>> = {
  10: renderFatThinkingSpark(1,"The Father’s Ambition","Why did the narrator’s father treasure the dead, deformed chickens?",`<p>He imagined that a rare five-legged hen or two-headed rooster could make him famous and wealthy at county fairs. He treated deformity as a possible route to success.</p>`),
  4: renderFatThinkingSpark(2,"The Narrator’s Outlook","What is the narrator’s outlook on life?",`<p>The narrator describes himself as gloomy and inclined to see life’s darker side. He connects this outlook to a childhood marked by failure and death on the chicken farm.</p>`),
  26: renderFatThinkingSpark(3,"The Egg’s Meaning","What does the egg symbolize by the end of the story?",`<p>The egg represents the unresolved, absurd cycle of life and disappointment that dominates the family’s experience. The narrator’s final question suggests that this problem still has a hold on him.</p>`),
  5: renderFatThinkingSpark(4,"The Egg as a Motif","How does the egg unify the narrative?",`<p>The egg connects the chicken farm’s cycle of life and death, the father’s ambition and failed tricks, and the family’s later restaurant life. It returns at the ending as the narrator’s unanswered question.</p>`),
  0: renderFatThinkingSpark(5,"The Father Before Marriage","How would you describe the father before he married?",`<p>He was cheerful, sociable, and content with a modest life. He worked as a farmhand, kept a horse, visited town on Saturdays, and had no ambition to rise in the world.</p>`),
  6: renderFatThinkingSpark(6,"Childhood on the Farm","What was the narrator’s childhood on the chicken farm like?",`<p>It was shaped by exhausting work, repeated failures, animal deaths, and disappointment. The narrator says those experiences helped make him gloomy and pessimistic.</p>`),
  9: renderFatThinkingSpark(7,"The Chickens and the Family","What does the fate of the chickens imply about the family?",`<p>The chickens begin full of promise but are repeatedly defeated by disease, accident, or weakness. Their fate mirrors the family’s pattern of ambitious hopes followed by disappointment and little social progress.</p>`),
};

const daysWaitNotes: Readonly<Record<number, string>> = {
  0: renderAnalysisNote("setting", "Setting · The house and cold fields", `<p>The story stays mostly in the boy’s bedroom and the small house, then briefly moves outdoors to the frozen fields. The cold, quiet setting echoes Schatz’s fear and the long wait.</p>`),
  15: renderAnalysisNote("pov", "Point of View · First Person", `<p>Schatz’s father narrates in the first person. Readers know what he sees and thinks, but the boy’s private fear is revealed only through his words and actions.</p>`),
  22: renderAnalysisNote("indirect", "Characterization · Schatz and his father", `<p>Schatz lies still, politely tries to spare his father, and silently prepares for death. His father shows care through medicine, reading, and a calm explanation, though he initially misses the boy’s misunderstanding.</p>`),
  45: renderAnalysisNote("plot", "Plot · The misunderstanding", `<p>Schatz hears that his fever is 102°F but thinks of the Celsius scale used at his school in France, where boys told him 44°C is fatal. His father explains the two scales; the next day, Schatz finally releases the fear he had held in.</p><p class="reading-plot-chain">Fever → Misunderstanding → A day of fear → Explanation → Release</p>`),
  52: renderAnalysisNote("theme", "Theme · Courage and communication", `<p>Schatz tries to face death with stoic bravery, while his father responds with calm care. Their silence about what Schatz believes creates a painful gap. The story also questions a model of masculinity that equates courage with concealing fear.</p>`),
  40: renderAnalysisNote("literary-device", "Literary Technique · Iceberg Principle", `<p>Hemingway leaves feelings unstated and lets readers infer them from brief dialogue, posture, and small actions. Schatz’s fear becomes clear through what he says and how he behaves, rather than through a long explanation.</p>`),
};

const veryShortNotes: Readonly<Record<number, string>> = {
  0: renderFatThinkingSpark(1,"Setting · Time and Place","Where does the story take place?",`<p>It begins in a hospital in Padua, Italy, during World War I. Later scenes move through Italy and the United States, especially Chicago.</p>`) + renderFatThinkingSpark(2,"Setting · Historical Situation","When is the story set?",`<p>The story takes place during and immediately after World War I.</p>`) + renderFatThinkingSpark(3,"Characters · Luz and the Soldier","How are Luz and the soldier characterized?",`<p>The soldier is a wounded young American volunteer who is idealistic and serious about love. Luz is a competent, caring nurse who is well liked by her patients, but later makes a practical choice influenced by status and security.</p>`) + renderFatThinkingSpark(15,"Naming","Why is Luz the only character with a name?",`<p>Leaving the soldier, the major, and the sales girl unnamed makes them feel like roles rather than fully individualized characters. This broadens the episode beyond one couple and leaves the soldier especially anonymous and replaceable.</p>`) + renderFatThinkingSpark(16,"Title","Why is the story titled “A Very Short Story”?",`<p>The title describes the text’s brevity and suggests that a relationship that feels profound to the characters becomes only a brief episode in the larger course of war and life. Its understatement carries a cool, ironic tone.</p>`),
  1: renderFatThinkingSpark(4,"Exposition · Their Meeting","How do Luz and the soldier meet?",`<p>They meet in the Padua hospital, where Luz is nursing the soldier as he recovers from his war wounds.</p>`) + renderFatThinkingSpark(13,"Luz’s Name","What does “Luz” mean, and why is it significant?",`<p>“Luz” means “light” in Spanish. Luz briefly brings comfort to the wounded soldier, but that light is temporary; the name makes the loss of the relationship more ironic.</p>`),
  2: renderFatThinkingSpark(5,"Rising Action · Their Early Love","How is their relationship presented at first?",`<p>Their wartime relationship seems intense and devoted. They share daily life in the hospital and believe their love can continue after the war.</p>`) + renderFatThinkingSpark(10,"Why They Plan to Marry","Why do Luz and the soldier want to marry?",`<p>They believe their love is genuine and want marriage to make their wartime bond lasting and publicly recognized.</p>`),
  3: renderFatThinkingSpark(6,"The Soldier’s Plan","What is the soldier expected to do after returning to the United States?",`<p>He is expected to find a steady job so Luz can join him and they can marry.</p>`) + renderFatThinkingSpark(7,"The Soldier’s View of the Relationship","What does the soldier’s view reveal about him and the relationship?",`<p>He believes love and hard work will lead naturally to marriage. The plan also makes the relationship vulnerable because it depends on distance, time, and a future job he cannot guarantee.</p>`),
  4: renderFatThinkingSpark(8,"“Boy and Girl Affair”","What does Luz mean when she calls their relationship a “boy and girl affair”?",`<p>She describes their love as immature and contrasts the soldier with the older, higher-ranking major, whose status and prospects appear more adult and secure.</p>`) + renderFatThinkingSpark(9,"The Major’s Title","Why does the story emphasize the title “Major”?",`<p>His rank signals status and prospects. It helps explain Luz’s shift from wartime romance toward a more practical, status-based choice, which breaks the engagement.</p>`) + renderFatThinkingSpark(11,"“Expected, Absolutely and Unexpectedly”","Why is Luz’s expectation of marriage described as “absolutely unexpectedly”?",`<p>The phrase is ironic: Luz feels certain she will marry in the spring, but that confidence seems misplaced in light of the relationship’s delays and her decision to leave the soldier.</p>`) + renderFatThinkingSpark(14,"Foreshadowing","Which details foreshadow the relationship’s failure?",`<p>They cannot arrange the marriage documents, part after an unresolved quarrel, and depend on delayed letters and a future job. The lonely, rainy setting at Pordonone and Luz’s unfamiliarity with Italians also precede her relationship with the major.</p>`),
  5: renderFatThinkingSpark(12,"Tone","What is the tone of the story?",`<p>The tone is detached, understated, and quietly ironic. Plain, report-like sentences describe painful events without overt sentiment.</p>`) + renderFatThinkingSpark(17,"The Ending","How does the story end, and why leave the soldier in that condition?",`<p>The soldier ends up in Chicago, contracts gonorrhea, and receives no reconciliation or closure. The harsh ending refuses a comforting romantic resolution and emphasizes the cruelty and instability of war and love.</p>`) + renderFatThinkingSpark(18,"Understatement","How does understatement shape the story?",`<p>Hemingway’s short, direct sentences withhold emotional explanation. Readers must infer the pain and irony, which makes the ending more forceful.</p>`) + renderAnalysisNote("literary-device","Intertextual Analysis · <em>A Farewell to Arms</em>",`<p>The PDF links the story to Hemingway’s later novel through their shared source in his wartime relationship with nurse Agnes von Kurowsky. The novel revises that autobiographical material into a longer, more elegiac treatment of fragile love, war, and loss.</p>`),
};

const copAnthemNotes: Readonly<Record<number, string>> = {
  0: renderAnalysisNote("setting","Setting · New York and the Island",`<p>In early-20th-century New York, Soapy’s winter home is a park bench. Blackwell’s Island prison seems safer than the street, exposing how poverty turns basic shelter into a desperate need.</p>`),
  1: renderAnalysisNote("literary-device","Metaphor and Personification · Jack Frost’s Card",`<p>The dead leaf becomes Jack Frost’s “card,” a metaphor for winter’s warning. Jack Frost is personified as a visitor who hands his calling card to the North Wind, imagined as a footman in the mansion of the outdoors.</p>`),
  2: renderAnalysisNote("literary-device","Metaphor · The Committee of Ways and Means",`<p>Soapy’s plan to survive winter is described as becoming a “Committee of Ways and Means.” The mock-formal metaphor makes his private struggle sound like official business.</p>`),
  3: renderAnalysisNote("literary-device","Understatement · “Not of the highest”",`<p>Calling Soapy’s desperate wish to escape homelessness “not of the highest” deliberately understates his need. The formal phrasing makes the hardship darkly comic.</p>`),
  4: renderAnalysisNote("literary-device","Alliteration · “Board and bed”",`<p>“Board and bed and congenial company, safe from Boreas and bluecoats” repeats the b sound. The rhythm turns Soapy’s wish for prison into a comic, almost attractive package.</p>`),
  5: renderAnalysisNote("literary-device","Allusion · Caesar and Brutus",`<p>Soapy compares charity’s hidden demands to Caesar’s trusted friend Brutus: apparent help carries a painful price. A charitable bed requires a bath and a loaf of bread brings personal questioning, so Soapy sees prison as less humiliating.</p>`),
  14: renderAnalysisNote("literary-device","Dramatic Irony · The broken window",`<p>Readers know Soapy broke the window on purpose to be arrested. The policeman assumes a real criminal would run, so he chases someone else while Soapy is left free.</p>`),
  17: renderAnalysisNote("literary-device","Simile · The waiter’s voice and eye",`<p>The waiter’s voice is “like butter cakes” and his eye “like the cherry in a Manhattan cocktail.” The comparisons make his voice seem sweet and smooth while his eye appears bright and watchful.</p>`),
  18: renderAnalysisNote("literary-device","Simile and Metaphor · Rejected arrest",`<p>Soapy rises “as a carpenter’s rule opens,” making his awkward recovery comic. Calling arrest a “rosy dream” reverses its usual meaning: prison is the shelter he hopes to reach.</p>`),
  25: renderAnalysisNote("literary-device","Metaphor · Ivy and oak",`<p>The young woman plays “the clinging ivy” to Soapy’s “oak.” The metaphor turns their unwanted pairing into an image of a vine wrapped around a sturdy tree, adding comic force to his failed plan.</p>`),
  27: renderAnalysisNote("literary-device","Hyperbole · The welkin",`<p>Soapy “disturbed the welkin”: his shouting is exaggerated as if it shook the sky. The overstatement makes his desperate attempt to attract a policeman comic.</p>`),
  30: renderAnalysisNote("literary-device","Allusion and Hyperbole · Arcadia",`<p>Soapy calls the Island “an unattainable Arcadia,” alluding to an idealized Greek paradise. Describing prison as a distant utopia is deliberate exaggeration that shows how badly he wants shelter.</p>`),
  40: renderAnalysisNote("pov","Point of View · Third-Person Limited",`<p>The third-person narrator stays close to Soapy’s thoughts. Readers understand his plans, frustration, and sudden resolve, even when other characters misread what he is doing.</p>`),
  41: renderAnalysisNote("literary-device","Onomatopoeia · Sparrows",`<p>The sparrows “twittered sleepily.” “Twittered” faintly echoes their chirping and reinforces the quiet mood before the ironic arrest.</p>`),
  43: renderAnalysisNote("indirect","Characterization · Soapy",`<p>Soapy’s schemes show resourcefulness and persistence, while his educated, ironic thoughts reveal intelligence beneath his shabby appearance. The anthem awakens a genuine wish to work and regain self-respect.</p>`),
  48: renderAnalysisNote("literary-device","Situational Irony · The arrest",`<p>Soapy wants prison all day, but every deliberate attempt fails. Once he sincerely resolves to change, he is arrested for loitering and sentenced to the Island.</p>`) + renderAnalysisNote("plot","Plot · Failed schemes and reversal",`<h3>Exposition</h3><p>On a cold New York winter night, Soapy seeks shelter on Blackwell’s Island.</p><h3>Rising Action</h3><p>His planned offenses repeatedly fail to get him arrested.</p><h3>Climax</h3><p>An anthem outside a church awakens his wish to reform.</p><h3>Falling Action and Resolution</h3><p>As he turns toward a new life, a policeman arrests him for loitering; he is sentenced to three months on the Island.</p><p class="reading-plot-chain">Need for shelter → Failed schemes → New resolve → Arrest</p>`) + renderAnalysisNote("theme","Themes · Poverty, justice, and belonging",`<p><strong>Poverty and crime:</strong> Indifference toward the poor can deepen the conditions that push them toward petty crime.</p><p><strong>The American Dream:</strong> A promise of opportunity rings hollow when a person lacks the means to improve his circumstances.</p><p><strong>Power and stereotypes:</strong> Appearance and social status shape who is trusted and who faces consequences.</p><p><strong>Home and community:</strong> Soapy’s search for shelter is also a search for a place where he belongs.</p><p><strong>Arbitrary justice:</strong> The law arrests him only after he sincerely decides to change, exposing the system’s cruel timing.</p>`),
};

const earlyAutumnTestQuestions: readonly ReadingTestQuestion[] = [
  {question:"Where did Mary and Bill meet again after many years?",options:["Fifth Avenue","Central Park West","Washington Square","Columbia University"],answer:""},
  {question:"What time of day is it when Mary and Bill meet?",options:["Late afternoon","Night","Morning","Evening"],answer:""},
  {question:"What is the setting when Mary and Bill meet?",options:["A restaurant","A hospital","A park","A school"],answer:""},
  {question:"What caused Mary and Bill to stop speaking to each other?",options:["A financial issue","A misunderstanding about their relationship","A disagreement about their future","A trivial matter"],answer:""},
  {question:"What is Bill’s profession now?",options:["Teacher","Doctor","Lawyer","Engineer"],answer:""},
  {question:"Where does Mary work now?",options:["Columbia University","Central Park West","Washington Square","Fifth Avenue"],answer:""},
  {question:"How many children does Bill have?",options:["One","Two","Four","Three"],answer:""},
  {question:"What emotion does Mary feel as she enters the bus?",options:["Sadness","Anger","Fear","Happiness"],answer:""},
  {question:"Where did Mary forget to give Bill her address?",options:["In the Square","At the bus stop","In the park","On the bus"],answer:""},
  {question:"What did Mary forget to tell Bill about her youngest son?",options:["His name","His age","His favorite toy","His school"],answer:""},
  {question:"What is the closest meaning of “impulsively” in “Impulsively, she married a man she thought she loved”?",options:["With care","Deliberately","Responsibly","Without thinking"],answer:""},
  {question:"What does Mary’s response to Bill calling her “well” reveal?",options:["She wants to know how Bill is doing","She wants to move on from the relationship","She no longer wants to speak to Bill","She wishes their relationship could return to what it was"],answer:""},
  {question:"How do the final details about the address and her youngest son relate to the story as a whole?",options:["Bill has had a profound impact on Mary’s life","Mary did not truly want to meet Bill","Mary and Bill had an affair","Mary meant a lot to Bill"],answer:""},
  {question:"Select the two statements that best capture themes in the story.",options:["Don’t try to hug people you haven’t seen in a while","The consequences of decisions can lead to regret","Think before you act","Life has a way of catching up to you"],answer:""},
  {question:"What is ironic about the statement “She lost sight of Bill”?",options:["She can no longer see Bill physically and no longer knows who he has become","Trees obstruct her view","The audience knows Mary was blinded by impulsiveness","Bill avoids her because he is bitter about their breakup"],answer:""},
];

const flowersNotes: Readonly<Record<number, string>> = {
  0: renderAnalysisNote("setting", "Setting · Harvest season and sharecropping", `<p>The opening joins an abundant harvest with Myop’s family’s sharecropper cabin. The golden sensory detail makes the landscape feel generous, while the economic condition quietly locates the family within a system of labor and unequal ownership.</p>`),
  4: renderAnalysisNote("setting", "Setting · The gloomy cove", `<p>The movement from familiar paths into a “gloomy” cove changes the story’s atmosphere before Myop understands what she has found. Dampness, close silence, and unfamiliar ground turn the woods from a child’s playground into a place carrying a buried history.</p>`),
  5: renderAnalysisNote("plot", "Plot · The discovery", `<p>Myop first encounters the body through physical contact, then sees the “naked grin.” The sequence delays recognition by a beat: the child’s unafraid attempt to free her heel gives way to a sudden perception that changes the story’s direction.</p>`),
  6: renderAnalysisNote("indirect", "Characterization · Myop’s changing awareness", `<p>Myop studies the remains with “interest,” a response consistent with her earlier curiosity about the woods. Walker keeps the focal attention close to the child’s observations; the restrained description lets readers register the violence and historical weight that Myop may not yet be able to name.</p>`),
  7: renderAnalysisNote("literary-device", "Symbolism · The rose and the noose", `<p>The living rose grows beside the remains of the noose, joining beauty and violence in one place. The rope has blended “benignly into the soil,” a quiet image of how racial violence can be absorbed into a landscape and obscured from ordinary view.</p>`),
  8: renderAnalysisNote("theme", "Theme · The end of innocence", `<p>The final sentence, “And the summer was over,” gives no explicit moral or explanation. Its seasonal language makes Myop’s discovery feel like an irreversible threshold: her childhood world has not physically changed, but what she can know about it has.</p>`),
};

const earlyAutumnNotes: Readonly<Record<number, string>> = {
  0: renderAnalysisNote("plot", "Plot · Compressed backstory", `<p>The first paragraph condenses a relationship, a misunderstanding, a marriage, and Bill’s departure into a few sentences. The phrase “something not very important” reduces the apparent cause of a separation whose consequences endure for years, setting up the story’s contrast between small moments and lasting distance.</p>`),
  3: renderAnalysisNote("indirect", "Characterization · Recognition and age", `<p>Bill recognizes Mary only after she names him, and the narration immediately adds that she looks old to him. The brief asymmetry frames their reunion through his first perception, while later details reveal Mary’s sharper awareness of the past and its unfinished emotional claims.</p>`),
  13: renderAnalysisNote("setting", "Setting · Washington Square at dusk", `<p>The crowded public park and the falling temperature place the former lovers’ meeting amid strangers and impending night. The external scene narrows their brief opportunity to speak and echoes the emotional chill of a relationship they never resolved.</p>`),
  17: renderAnalysisNote("pov", "Point of View · Close access to Mary", `<p>The third-person narrator moves close to Mary’s thoughts, including the words she wants to say and her fear of opening her mouth. Bill’s feelings remain less accessible, so readers experience the missed reunion chiefly through Mary’s awareness and regret.</p>`),
  26: renderAnalysisNote("theme", "Theme · Words left unsaid", `<p>Mary remembers that she forgot to give Bill her address, ask for his, and mention her son’s name. The three omissions widen the gap between the life she has built and the relationship she briefly hoped to reopen; the story leaves the significance of the shared name unresolved.</p>`),
};

const storyHourTestQuestions: readonly ReadingTestQuestion[] = [
  {question:"Why does Josephine tell Louise about her husband’s death as calmly as possible?",options:["Josephine is afraid of showing her emotions","Josephine does not want to worsen Louise’s weak heart","Richards told Josephine to speak calmly","Josephine does not want Richards to overhear what she is saying"],answer:""},
  {question:"How does Louise’s heart condition relate to nineteenth-century expectations of women?",options:["It contrasts with the expectation that women should be strong and independent","It supports the expectation that women should be career-oriented","It challenges the expectation that women should be emotional and nurturing","It reinforces the expectation that women should be passive and delicate"],answer:""},
  {question:"After Louise’s crying subsides, what does she do?",options:["She allows Josephine and Richards to comfort her","She goes outside to get some fresh air","She locks herself in her bedroom and sits by an open window","She immediately starts planning her husband’s funeral"],answer:""},
  {question:"What does Louise’s desire to be alone with her grief indicate?",options:["Her inability to handle her emotions","Her inclination toward freedom and independence","Her desire for protection from trauma","Her need for social support during difficult times"],answer:""},
  {question:"What does Louise initially experience while looking out the window?",options:["The sights and sounds of spring and a new feeling she cannot describe","The comfort of a crowd gathering to mourn her husband’s death","A storm approaching that seems to symbolize her bleak future","People going about their lives in the streets and a sense of isolation"],answer:""},
  {question:"After resisting her growing feelings, what word does Louise finally utter?",options:["Alone","Brently","Why","Free"],answer:""},
  {question:"What does Louise consider a small price to pay for her newfound freedom?",options:["Feeling grief at her husband’s death","Having to find a new home","Losing her social status","Being ostracized by her friends and family"],answer:""},
  {question:"Why does Louise come to feel joy after her husband’s death?",options:["She realizes she always disliked Brently as a person","She knows she can find someone even wealthier to marry","She will now be independent and free","She can devote herself to helping her sister"],answer:""},
  {question:"What does Louise realize about marriage in general?",options:["It is only good when founded on true love","It takes good communication work for it to be successful","It is important to maintain for the good of society","It causes people to impose themselves on each other"],answer:""},
  {question:"What do Josephine’s attempts to protect Louise suggest?",options:["The importance of emotional support for an individual’s wellbeing","That nineteenth-century society equated comforting women with helping them","That Josephine felt personally jealous of Louise’s independence","That nineteenth-century society was supportive of women’s emotional wellbeing"],answer:""},
  {question:"How does Louise appear when she finally opens the door to her sister?",options:["Distraught and heartbroken","Defeated and submissive","Angry and resentful","Triumphant and radiant"],answer:""},
];

const storyHourNotes: Readonly<Record<number, string>> = {
  0: renderAnalysisNote("literary-device", "Foreshadowing · Heart trouble", `<p>The opening mention of Louise’s heart trouble quietly prepares readers for the fatal ending, although it does not explain what will cause her death.</p>`),
  2: renderAnalysisNote("literary-device", "Foreshadowing · Louise’s response", `<p>Louise understands the news at once rather than becoming paralyzed by it. This difference hints that her feelings may become more complicated than the others expect.</p>`) + renderAnalysisNote("literary-device", "Metaphor · A storm of grief", `<p>“The storm of grief” makes Louise’s tears seem as intense as a storm. It also precedes the spring images outside her window, marking a shift in mood.</p>`),
  3: renderAnalysisNote("literary-device", "Personification · Exhaustion", `<p>Her exhaustion “haunted her body” and seemed to reach into her soul. These humanlike actions make fatigue feel like a force pressing on both body and mind.</p>`),
  5: renderAnalysisNote("literary-device", "Simile · Grief and exhaustion", `<p>Louise continues to sob “as a child who has cried itself to sleep.” The comparison emphasizes her physical and emotional exhaustion.</p>`),
  7: renderAnalysisNote("pov", "Point of View · A shift toward Louise", `<p>The narration first presents Louise from the outside, through other people’s concern. As she sits by the window, readers move closer to her thoughts. The shift lets us experience her awakening without the narrator announcing its meaning for her.</p>`),
  8: renderAnalysisNote("literary-device", "Metaphor · Freedom as a force", `<p>The new feeling seems to approach and possess Louise, and she tries to “beat it back” with her will. This frames her desire for freedom as a force she both fears and cannot resist.</p>`) + renderAnalysisNote("literary-device", "Metaphor · Joy takes hold", `<p>“A monstrous joy” seems to “hold” Louise as her blood courses through her body. The language makes her inner awakening feel physical and powerful.</p>`),
  14: renderAnalysisNote("literary-device", "Simile · “A goddess of Victory”", `<p>Louise carries herself “unwittingly like a goddess of Victory.” The simile makes her return from the room feel triumphant and shows how fully she believes a new life is beginning.</p>`),
  17: renderAnalysisNote("literary-device", "Situational and Dramatic Irony · The ending", `<p>The doctors call Louise’s death “the joy that kills,” but readers know that her husband’s return has ended the freedom she had just imagined. The outcome reverses the doctors’ explanation and the family’s expectations.</p>`),
};

const triflesNotes: Readonly<Record<number, string>> = {
  1: renderAnalysisNote("setting", "Setting · The kitchen as pressure", `<p>The neglected kitchen makes Minnie’s restricted, lonely life visible. Domestic objects become evidence, so the setting also functions as a record of the conditions the investigators overlook.</p>`),
  35: renderAnalysisNote("theme", "Theme · What society dismisses", `<p>The men treat domestic details as irrelevant “trifles,” yet those details reveal Minnie Wright’s isolation and the motive behind the crime. The play turns their dismissal into a critique of whose knowledge counts.</p>`),
  61: renderAnalysisNote("plot", "Plot · Clues hidden in ordinary things", `<p>The evidence emerges through a chain of household details: unfinished work, spoiled preserves, uneven stitching, and the damaged birdcage. Each clue helps the women reconstruct what happened while the men search for a conventional motive.</p>`),
  122: renderAnalysisNote("literary-device", "Simile · John Wright as a raw wind", `<p>Mrs. Hale compares John Wright to “a raw wind that gets to the bone.” The image conveys the emotional coldness of a marriage that left Minnie isolated.</p>`),
  127: renderAnalysisNote("literary-device", "Symbolism · Minnie as a bird", `<p>Mrs. Hale remembers Minnie as “kind of like a bird”—sweet, pretty, and timid. The caged bird reflects Minnie’s confinement; its death echoes the loss of her voice and freedom.</p>`),
  179: renderAnalysisNote("theme", "Theme · “Knot it”", `<p>Mrs. Hale’s final word turns the men’s joke about quilting into a quiet declaration that the women will conceal the evidence. Their choice protects Minnie, while leaving the audience to weigh solidarity against the law.</p>`),
};

function renderFullTextArticle({
  id,
  title,
  deck,
  author,
  kicker = "FICTION",
  label = "Short fiction",
  paragraphs,
  testQuestions = [],
  analysisNotes = {},
}: {
  id: string;
  title: string;
  deck: string;
  author: string;
  kicker?: string;
  label?: string;
  paragraphs: readonly string[];
  testQuestions?: readonly ReadingTestQuestion[];
  analysisNotes?: Readonly<Record<number, string>>;
}) {
  const articleContent = addDefinitionsAndExamples(`
          <header class="reading-full-text-header">
            <p class="reading-full-text-kicker">${escapeStoryText(kicker)} · FULL TEXT</p>
            <h2 id="${id}-text-title">${escapeStoryText(title)}</h2>
            <p class="reading-full-text-deck">${escapeStoryText(deck)}</p>
            <div class="reading-full-text-byline">${renderReadingAuthorBio(author)}<span>${escapeStoryText(label)}</span></div>
          </header>
          ${testQuestions.length ? renderReadingTestNotes(title, testQuestions) : ""}
          <div class="reading-full-text-body">
            ${renderStoryParagraphs(paragraphs, id, analysisNotes)}
          </div>
          <footer>THE END</footer>`);

  return `
        <article class="reading-full-text${testQuestions.length ? " reading-full-text--has-test-notes" : ""}" aria-labelledby="${id}-text-title">
          ${articleContent}
        </article>`;
}

const narrativeNoteDefinitions: Readonly<Record<string, string>> = {
  ...Object.fromEntries(literaryConcepts.map((concept) => [concept.name.toLowerCase(), concept.exact_definition])),
  symbolism: literaryConcepts.find((concept) => concept.concept_id === "symbol")!.exact_definition,
  foreshadowing: "Foreshadowing refers to the use of clues or hints to suggest what will happen later in the story. It is a way for authors to create anticipation and build suspense by hinting at future events or outcomes.",
};

const ironyFormDefinitions: Readonly<Record<string, string>> = {
  dramatic: "Dramatic irony is a storytelling and literary device where the audience or reader knows crucial information that the characters inside the narrative do not. This gap in knowledge creates a contrast between what characters believe and what is actually true.",
  situational: "Situational irony happens when the actual result of an event is the exact opposite of what you reasonably expect to happen.",
};

function literaryConceptDefinition(id: string) {
  return literaryConcepts.find((concept) => concept.concept_id === id)?.exact_definition ?? "";
}

function normalizeDefinitionLabels(markup: string) {
  // Keep the concept name in the authoritative definition itself, but don't
  // repeat it in the label immediately before that definition.
  return markup.replace(
    /<strong>Definition\s*[·:—-]\s*(?:Allusion|Alliteration|Analogy|Characterization|Conflict|Hyperbole|Irony|Metaphor|Onomatopoeia|Personification|Plot|Point of View|Setting|Simile|Symbol(?:ism)?|Theme|Understatement)<\/strong>/gi,
    "<strong>Definition</strong>",
  );
}

function addDefinitionsAndExamples(markup: string) {
  const sourceDetails: Record<string, { author: string; title: string }> = {
    necklace: { author: "Guy de Maupassant", title: "The Necklace" },
    fat: { author: "Raymond Carver", title: "Fat" },
    aftertwenty: { author: "O. Henry", title: "After Twenty Years" },
    lastleaf: { author: "O. Henry", title: "The Last Leaf" },
    flowers: { author: "Alice Walker", title: "The Flowers" },
    egg: { author: "Sherwood Anderson", title: "The Egg" },
    dayswait: { author: "Ernest Hemingway", title: "A Day’s Wait" },
    shortstory: { author: "Ernest Hemingway", title: "A Very Short Story" },
    copanthem: { author: "O. Henry", title: "The Cop and the Anthem" },
    earlyautumn: { author: "Langston Hughes", title: "Early Autumn" },
    storyhour: { author: "Kate Chopin", title: "The Story of an Hour" },
    trifles: { author: "Susan Glaspell", title: "Trifles" },
  };

  return normalizeDefinitionLabels(markup.replace(/(<details\b[^>]*class="reading-analysis-note(?: reading-analysis-note--[\w-]+)*"[^>]*>[\s\S]*?<div class="reading-analysis-note-content">)([\s\S]*?)(<\/div>\s*<\/details>)/g, (whole, open, originalContent, close, offset: number) => {
    const heading = originalContent.match(/<h3>([\s\S]*?)<\/h3>/)?.[1]?.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").trim() ?? "";
    const summary = open.match(/<summary>\s*<span>([\s\S]*?)<\/span>/)?.[1]?.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").trim() ?? "";
    const classes = open.match(/class="([^"]+)"/)?.[1] ?? "";
    const classConcept = /(?:^|\s)reading-analysis-note--pov(?:\s|$)/.test(classes) ? "point of view" : "";
    const normalized = `${summary} ${heading} ${classConcept}`.toLowerCase();
    const terms = Object.keys(narrativeNoteDefinitions)
      .sort((a, b) => b.length - a.length)
      .filter((key) => normalized.includes(key) && !(key === "symbol" && normalized.includes("symbolism")));
    if (!terms.length) return open + originalContent + close;

    const followingParagraph = markup.slice(offset + whole.length).match(/^\s*(?:<details\b[^>]*class="[^"]*\breading-analysis-note\b[^"]*"[^>]*>[\s\S]*?<\/details>\s*)*<p\b[^>]*data-reading-story="([^"]+)"[^>]*data-reading-paragraph-index="(\d+)"[^>]*>([\s\S]*?)<\/p>/);
    const definitionBlock = originalContent.includes('class="reading-note-definition"')
      ? ""
      : `<div class="reading-note-definition">${terms.flatMap((term) => {
        const definitions = [`<p><strong>Definition</strong> ${narrativeNoteDefinitions[term]}</p>`];
        if (term === "irony") {
          for (const [form, definition] of Object.entries(ironyFormDefinitions)) {
            const namesForm = form === "situational"
              ? /\bsituational\b[\s\S]*\birony\b/.test(normalized)
              : /\bdramatic\b[\s\S]*\birony\b/.test(normalized);
            if (namesForm) definitions.push(`<p><strong>Form-specific definition</strong> ${definition}</p>`);
          }
        }
        return definitions;
      }).join("")}</div>`;

    let content = originalContent;
    if (definitionBlock) {
      content = /<h3>[\s\S]*?<\/h3>/.test(content)
        ? content.replace(/(<h3>[\s\S]*?<\/h3>)/, `$1${definitionBlock}`)
        : definitionBlock + content;
    }

    if (followingParagraph) {
      const [, story, paragraphNumber, quotation] = followingParagraph;
      const source = sourceDetails[story.replace(/^reading-/, "").replaceAll("-", "")];
      const citation = source
        ? `${source.author}, <em>${source.title}</em>, paragraph ${Number(paragraphNumber) + 1} in this edition.`
        : `Paragraph ${Number(paragraphNumber) + 1} in this edition.`;
      const quotationBlock = `<section class="reading-note-section reading-note-quotation"><h4>Original Quotation</h4><blockquote>${quotation}</blockquote><p class="reading-note-source">${citation}</p></section>`;
      if (!content.includes("reading-note-quotation")) content = content.replace(/(<div class="reading-note-definition">[\s\S]*?<\/div>)/, `$1${quotationBlock}`);
    }
    return open + content + close;
  }));
}

export const narrativeWritingMarkup = addDefinitionsAndExamples(String.raw`
    <header class="site-nav" aria-label="Primary navigation">
      <nav class="nav-pill">
        <span id="narrative-home-slot"></span>
        <span id="narrative-home-action-slot"></span>
        <a href="#intro" data-nav-link="intro">Course Introduction</a>
        <a href="#objectives" data-nav-link="objectives">Objectives</a>
        <a href="#instructor" data-nav-link="instructor">Instructor</a>
        <a href="#units" data-nav-link="units">Units</a>
        <a href="#assessment" data-nav-link="assessment">Assessment</a>
        <a href="#reading" data-nav-link="reading">Reading</a>
      </nav>
    </header>

    <main>
      <section class="slide cover-slide" id="cover" aria-labelledby="cover-title">
        <div class="cover-content">
          <div class="brand-mark" aria-label="Narrative Writing">
            <span></span><span></span><span></span><span></span>
          </div>
          <p class="brand-caption">Narrative Writing</p>
          <h1 id="cover-title" class="cover-title cover-title--interactive" data-interactive-title="Write What Matters" aria-label="Write What Matters">Write What Matters</h1>
          <p class="cover-meta">2026–2027-1 Narrative Writing</p>
          <p class="cover-meta">Zhang Rongrong | Rachel | 2026.9.17</p>
          <a class="black-button" href="#intro">Course introduction</a>
        </div>
        <div class="cover-books-wrap" role="group" aria-label="Six narrative writing unit books">
          <div class="cover-book" style="--book-x: 0.933333%; --book-width: 15.933333%"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/cover-book-01.png" width="239" height="426" alt="01 — Life and Value" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 16.933333%; --book-width: 18.066667%"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/cover-book-02.png" width="271" height="426" alt="02 — Empathy and Justice" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 35%; --book-width: 8.933333%"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/cover-book-03.png" width="134" height="426" alt="03 — Growth and Maturity" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 43.933333%; --book-width: 22.2%"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/cover-book-04.png" width="333" height="426" alt="04 — Truth and Interpretation" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 66.133333%; --book-width: 16.466667%"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/cover-book-05.png" width="247" height="426" alt="05 — Dream and Faith" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 82.6%; --book-width: 17.4%"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/cover-book-06.png" width="261" height="426" alt="06 — Conflict and Harmony" draggable="false" /></div>
        </div>
      </section>

      <section class="slide intro-slide" id="intro" data-nav="intro" aria-labelledby="intro-title">
        <div class="slide-header">
          <div>
            <h2>Narrative Writing</h2>
            <p>COURSE INTRODUCTION</p>
          </div>
        </div>
        <div class="intro-grid">
          <div class="intro-title-block">
            <p class="section-kicker">COURSE INTRODUCTION</p>
            <h1 id="intro-title">Why learn<br />this course?</h1>
            <div class="narrative-card" aria-label="The narrative arc">
              <p>01 / THE NARRATIVE ARC</p>
              <div class="narrative-letter">N<span class="narrative-arc"></span></div>
              <small>Read life closely.<br />Write with attention.</small>
            </div>
            <p class="aside-note">Narrative writing starts<br />with what you notice.</p>
          </div>
          <article class="yellow-note">
            <p>Through this course, students will develop an appreciation for effective narrative writing, mastering key techniques in storytelling. You’ll draw upon your existing experience with Chinese narrative writing while enhancing your command of English vocabulary and grammar. By learning to keenly observe and reflect on life, students will ultimately acquire the skills to tell vivid and engaging stories in English.</p>
            <div class="note-rule"></div>
            <div class="three-words"><span><i class="dot coral"></i>OBSERVE</span><span><i class="dot blue"></i>REFLECT</span><span><i class="dot green"></i>TELL</span></div>
          </article>
        </div>
      </section>

      <section class="slide objective-slide objective-1" id="objectives" data-nav="objectives" aria-labelledby="objective-1-title">
        <div class="slide-header">
          <div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div>
        </div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 01 / 05</p></div>
          <h1 id="objective-1-title">1) Master 8,000–10,000 words, use<br class="desktop-only" /> 2,000 common expressions and write a<br class="desktop-only" /> 200-word narrative essay within 30 minutes<br class="desktop-only" /> with clear organization and correct grammar.</h1>
        </div>
        <div class="objective-art art-clock"><span class="mini-tag">8K–10K</span><span class="art-line"></span><span class="clock-face">◷</span><b>30′</b></div>
        <div class="slide-footer"><span><i class="dot coral"></i>VOCABULARY · EXPRESSION · GRAMMAR</span><strong>01 / 05</strong></div>
      </section>

      <section class="slide objective-slide objective-2" data-nav="objectives" aria-labelledby="objective-2-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div></div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 02 / 05</p></div>
          <h1 id="objective-2-title">2) Understand narrative writing basics<br class="desktop-only" /> [five elements], use grammar and<br class="desktop-only" /> sentence connections correctly, and write<br class="desktop-only" /> coherent, well-structured sentences and<br class="desktop-only" /> paragraphs with clear detail and unity.</h1>
        </div>
        <div class="objective-art art-steps"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span></div>
        <div class="slide-footer"><span><i class="dot yellow"></i>FIVE ELEMENTS · GRAMMAR · CONNECTION</span><strong>02 / 05</strong></div>
      </section>

      <section class="slide objective-slide objective-3" data-nav="objectives" aria-labelledby="objective-3-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div></div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 03 / 05</p></div>
          <h1 id="objective-3-title">3) Use varied sentence structures and<br class="desktop-only" /> rhetorical techniques to write expressively,<br class="desktop-only" /> while developing peer collaboration, reading,<br class="desktop-only" /> and presentation skills.</h1>
        </div>
        <div class="objective-art art-dialogue"><span class="speech one">—</span><span class="speech two">—</span><span class="blue-thread"></span><span class="pink-arrow">➜</span></div>
        <div class="slide-footer"><span><i class="dot blue"></i>RHETORIC · READING · PRESENTATION</span><strong>03 / 05</strong></div>
      </section>

      <section class="slide objective-slide objective-4" data-nav="objectives" aria-labelledby="objective-4-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div></div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 04 / 05</p></div>
          <h1 id="objective-4-title">4) Cultivate self-directed learning,<br class="desktop-only" /> problem-solving abilities, and reflective habits,<br class="desktop-only" /> with a focus on planning, monitoring, and<br class="desktop-only" /> reflecting on the learning process.</h1>
        </div>
        <div class="objective-art art-check"><span>✓</span><b>＋</b><i>◉</i></div>
        <div class="slide-footer"><span><i class="dot green"></i>PLANNING · MONITORING · REFLECTION</span><strong>04 / 05</strong></div>
      </section>

      <section class="slide objective-slide objective-5" data-nav="objectives" aria-labelledby="objective-5-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div></div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 05 / 05</p></div>
          <h1 id="objective-5-title">5) Balance language skills with critical<br class="desktop-only" /> thinking and innovation, fostering teamwork,<br class="desktop-only" /> reflection, evaluation, and communication<br class="desktop-only" /> skills through collaborative learning.</h1>
        </div>
        <div class="objective-art art-collab"><i></i><i></i><i></i><b>★</b></div>
        <div class="slide-footer"><span><i class="dot pink"></i>THINKING · INNOVATION · COLLABORATION</span><strong>05 / 05</strong></div>
      </section>

      <section class="slide instructor-slide" id="instructor" data-nav="instructor" aria-labelledby="instructor-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>TEACHER INTRODUCTION</p></div></div>
        <div class="instructor-top">
          <div>
            <h1 id="instructor-title">Zhang Rongrong</h1>
            <p class="chinese-name">张榕榕 <span>·</span> Rachel</p>
            <p class="role-line">Narrative Writing · Course Instructor</p>
          </div>
          <figure class="instructor-photo"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/instructor.png" alt="Zhang Rongrong standing beside a lake" /><figcaption>Zhang Rongrong · Rachel</figcaption></figure>
        </div>
        <div class="rule"></div>
        <p class="section-kicker">HIGHLIGHTS</p>
        <div class="highlight-block">
          <h3><span class="bar coral"></span>01 / RESEARCH</h3>
          <p class="highlight-stat"><span>1 book review</span> · <span>3 research articles</span> · <span>1 NSSFC project</span></p>
          <ul class="highlight-list">
            <li><b>a.</b> Published 1 book review in <strong>Patterns of Prejudice</strong> indexed in <strong>SSCI and A&amp;HCI.</strong></li>
            <li><b>b.</b> Published 3 research articles in international and national journals, e.g. <strong>China-US Journal of Humanities.</strong></li>
            <li><b>c.</b> Participated in 1 project funded by the <strong>National Social Science Fund of China (NSSFC)</strong>, focusing on <strong>Pulitzer-winning poetry.</strong></li>
          </ul>
        </div>
        <div class="rule"></div>
        <div class="teaching-block">
          <h3><span class="bar blue"></span>02 / TEACHING</h3>
          <div class="teaching-grid">
            <div><h4>Second Prize · 2025</h4><p>FLTRP Star Teacher Contest<br /><span>Special Track: Curriculum Ideology &amp; Politics Case</span></p></div>
            <div><h4>Third Prize · 2025</h4><p>The Third Teaching Skills Competition for Newly Appointed Faculty,<br /><span>China West Normal University.</span></p></div>
          </div>
          <div class="contact-chip"><span>WAYS OF CONTACT</span><b>15620501207</b></div>
        </div>
      </section>

      <section class="slide units-slide" id="units" data-nav="units" aria-labelledby="units-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>LEARNING UNITS</p></div></div>
        <div class="units-heading"><h1 id="units-title">Six units to know<br />Narrative Writing</h1><p>A writing skill and a language focus<br />in every unit.</p></div>
        <div class="unit-grid">
          <a class="unit-card coral-card" href="#unit-one"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-01.png" alt="A garden dinner beneath trees and string lights" /><div><b>01</b><h3>Life and Value</h3><p>Overview</p></div></a>
          <a class="unit-card yellow-card" href="#unit-two"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-02.png" alt="Blue figures reaching toward one another in a crowd" /><div><b>02</b><h3>Empathy and<br />Justice</h3><p>Characterization</p></div></a>
          <a class="unit-card blue-card" href="#unit-three"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-03.png" alt="A girl in a white dress seated on a garden swing" /><div><b>03</b><h3>Growth and<br />Maturity</h3><p>Setting</p></div></a>
          <a class="unit-card green-card" href="#unit-four"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-04.png" alt="A person lying in a beam of light on a field" /><div><b>04</b><h3>Truth and<br />Interpretation</h3><p>Point of View</p></div></a>
          <a class="unit-card pink-card" href="#unit-five"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-05.png" alt="An illustrated figure reaching toward a star" /><div><b>05</b><h3>Dream and Faith</h3><p>Theme</p></div></a>
          <a class="unit-card light-blue-card" href="#unit-six"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-06.png" alt="A group of friends sharing a close embrace" /><div><b>06</b><h3>Conflict and<br />Harmony</h3><p>Plot</p></div></a>
        </div>
      </section>

      <section class="slide unit-one-slide" id="unit-one" aria-labelledby="unit-one-title">
        <div class="unit-one-frame" aria-hidden="true"></div>
        <div class="unit-one-corner unit-one-corner--top" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="unit-one-corner unit-one-corner--bottom" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="unit-one-copy">
          <p class="unit-one-kicker">Unit One</p>
          <h1 id="unit-one-title">Life and Value</h1>
          <p class="unit-one-subtitle">Writing Critically I: Narrative Writing</p>
          <div class="unit-one-ornament" aria-hidden="true"><span></span><b>✦</b><span></span></div>
          <div class="unit-one-actions">
            <a class="unit-one-start" href="#reading-necklace">Start unit <span aria-hidden="true">→</span></a>
            <div class="unit-one-resource-links">
              <a class="unit-one-list" href="#unit-one-knowledge">View theoretical knowledge</a>
              <a class="unit-one-list" href="#reading">View readings</a>
            </div>
          </div>
        </div>
        <div class="unit-one-illustration" aria-hidden="true"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-one-watercolor-scroll.png" width="1024" height="1536" alt="" /></div>
      </section>

      <section class="slide unit-one-knowledge-slide" id="unit-one-knowledge" aria-labelledby="unit-one-knowledge-title">
        <div class="unit-one-frame" aria-hidden="true"></div>
        <a class="unit-one-knowledge-back" href="#unit-one">← Back to unit</a>
        <div class="unit-one-knowledge-shell">
          <div class="unit-one-knowledge-tabs" role="tablist" aria-label="Unit One knowledge sections">
            <button type="button" role="tab" id="unit-one-tab-objectives" aria-controls="unit-one-panel-objectives" aria-selected="true" data-unit-one-knowledge-tab="objectives">Learning Objectives</button>
            <button type="button" role="tab" id="unit-one-tab-content" aria-controls="unit-one-panel-content" aria-selected="false" data-unit-one-knowledge-tab="content">Content</button>
            <button type="button" role="tab" id="unit-one-tab-basics" aria-controls="unit-one-panel-basics" aria-selected="false" data-unit-one-knowledge-tab="basics">Narrative Basics</button>
            <button type="button" role="tab" id="unit-one-tab-elements" aria-controls="unit-one-panel-elements" aria-selected="false" data-unit-one-knowledge-tab="elements">Narrative Elements</button>
            <button type="button" role="tab" id="unit-one-tab-language" aria-controls="unit-one-panel-language" aria-selected="false" data-unit-one-knowledge-tab="language">Language &amp; Detail</button>
          </div>

          <section class="unit-one-knowledge-panel unit-one-objectives-panel" id="unit-one-panel-objectives" role="tabpanel" aria-labelledby="unit-one-tab-objectives" data-unit-one-knowledge-panel="objectives">
            <p class="unit-one-knowledge-kicker">Unit One</p>
            <h1 id="unit-one-knowledge-title">Learning Objectives</h1>
            <div class="unit-one-knowledge-ornament" aria-hidden="true"><span></span><b>✦</b><span></span></div>
            <p class="unit-one-objectives-intro">In this unit, you will learn to</p>
            <ul class="unit-one-objectives-list">
              <li><strong>identify</strong> the genre of narrative texts</li>
              <li><strong>grasp</strong> the elements of narrative writing</li>
              <li><strong>write</strong> narrative texts using time order</li>
              <li><strong>describe</strong> details with concrete language in narrative writing</li>
              <li><strong>rethink</strong> the meaning of life and reflect on the values you hold</li>
            </ul>
          </section>

          <section class="unit-one-knowledge-panel" id="unit-one-panel-content" role="tabpanel" aria-labelledby="unit-one-tab-content" data-unit-one-knowledge-panel="content" hidden>
            <p class="unit-one-knowledge-kicker">Unit One · Learning map</p>
            <h1>Table of contents</h1>
            <ol class="unit-one-content-list">
              <li>What Is Narrative Writing?</li><li>Narrative Subgenres</li><li>Basic Structure of a Narrative</li><li>Characterization</li><li>Setting</li><li>Plot</li><li>Point of View</li><li>Theme</li><li>Time Expressions</li><li>Concrete Details</li>
            </ol>
          </section>

          <section class="unit-one-knowledge-panel" id="unit-one-panel-basics" role="tabpanel" aria-labelledby="unit-one-tab-basics" data-unit-one-knowledge-panel="basics" hidden>
            <p class="unit-one-knowledge-kicker">Build the foundation</p><h1>Narrative Basics</h1>
            <div class="unit-one-basics-shell">
              <div class="unit-one-basics-tabs" role="tablist" aria-label="Narrative basics topics">
                <button type="button" role="tab" id="unit-one-basics-tab-definition" aria-controls="unit-one-basics-panel-definition" aria-selected="true" data-unit-one-basics-tab="definition">Definition</button>
                <button type="button" role="tab" id="unit-one-basics-tab-subgenres" aria-controls="unit-one-basics-panel-subgenres" aria-selected="false" data-unit-one-basics-tab="subgenres">Subgenres</button>
                <button type="button" role="tab" id="unit-one-basics-tab-structure" aria-controls="unit-one-basics-panel-structure" aria-selected="false" data-unit-one-basics-tab="structure">Basic Structure</button>
              </div>

              <section class="unit-one-basics-page unit-one-basics-page--definition" id="unit-one-basics-panel-definition" role="tabpanel" aria-labelledby="unit-one-basics-tab-definition" data-unit-one-basics-panel="definition">
                <div class="unit-one-basics-page-heading"><p>What is</p><h2>NARRATIVE?</h2></div>
                <div class="unit-one-definition-grid">
                  <div class="unit-one-definition-intro"><span aria-hidden="true">“</span><p>Stories help us notice how experiences, ideas, and perspectives are shaped.</p></div>
                  <ol class="unit-one-definition-list">
                    <li><strong>Story / Storytelling</strong><span>Any story is a narrative.</span></li>
                    <li><strong>Creative writing and spoken accounts</strong><span>Narratives may be written or told aloud.</span></li>
                    <li><strong>Fiction and non-fiction</strong><span>They can be made up or realistic accounts.</span></li>
                    <li><strong>A sequence with meaning</strong><span>A narrative connects events, characters, and themes to engage an audience.</span></li>
                  </ol>
                </div>
                <div class="unit-one-definition-terms">
                  <p>The <mark>Narrator</mark> narrates the <mark>narration</mark> of the <mark>narrative</mark>.</p>
                  <div>
                    <article><h3>The speaker</h3><span>The narrator: the voice that tells the story.</span></article>
                    <article><h3>The words</h3><span>The narration: the language, rhythm, and choices used to tell it.</span></article>
                    <article><h3>The story</h3><span>The narrative: the connected events that the reader experiences.</span></article>
                  </div>
                </div>
              </section>

              <section class="unit-one-basics-page unit-one-basics-page--subgenres" id="unit-one-basics-panel-subgenres" role="tabpanel" aria-labelledby="unit-one-basics-tab-subgenres" data-unit-one-basics-panel="subgenres" hidden>
                <div class="unit-one-mini-genres-heading"><h2>Mini-genres of Narratives</h2><p>Narrative genres are flexible categories rather than mutually exclusive labels.</p></div>
                <p class="unit-one-mini-genres-question">Question: Which genres have you read? And what do you like about it?</p>
                <div class="unit-one-mini-genre-picker" role="tablist" aria-label="Narrative mini-genres">
                  <button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="true" data-mini-genre="adventures">Adventures</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="science-fiction">Science fiction</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="romance">Romance</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="fantasies">Fantasies</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="multicultural">Multicultural Narratives</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="animal-stories">Animal stories</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="historical">Historical Narratives</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="folklore">Folklore</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="fables">Fables</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="humorous">Humorous Narratives</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="mysteries">Mysteries</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="biographies">Biographies / Autobiographies</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="realistic">Realistic Narratives</button>
                </div>
                <section class="unit-one-mini-genre-stage" id="unit-one-mini-genre-stage" role="tabpanel" aria-label="Selected mini-genre" data-mini-genre-stage="adventures">
                  <div class="unit-one-mini-genre-stage-copy"><p data-mini-genre-title>Adventures</p><span data-mini-genre-summary>Stories of exploration, journeys, risk, and discovery.</span></div>
                  <div class="unit-one-mini-genre-original" data-mini-genre-media><figure><img data-mini-genre-image src="https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/adventures.png" alt="Treasure Island and Robinson Crusoe covers" loading="lazy" /></figure><div class="unit-one-mini-genre-credits"><article><b data-mini-genre-book-title="one">Treasure Island</b><span data-mini-genre-book-author="one">Robert Louis Stevenson</span></article><article><b data-mini-genre-book-title="two">Robinson Crusoe</b><span data-mini-genre-book-author="two">Daniel Defoe</span></article></div></div>
                </section>
                <section class="unit-one-folklore-pages" data-mini-genre-folklore-pages hidden aria-label="Folklore examples"><figure><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/folklore-musical.png" alt="Folklore page exploring Taylor Swift's storytelling" loading="lazy" /><figcaption>Folklore in contemporary songwriting</figcaption></figure><figure><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/folklore-writing.png" alt="Folklore page about imagery, characters, and perspective" loading="lazy" /><figcaption>Folklore in narrative writing</figcaption></figure></section>
              </section>

              <section class="unit-one-basics-page unit-one-basics-page--structure" id="unit-one-basics-panel-structure" role="tabpanel" aria-labelledby="unit-one-basics-tab-structure" data-unit-one-basics-panel="structure" hidden>
                <header class="unit-one-basics-page-heading"><p>Basic structure</p><h2>A Narrative Arc</h2></header>
                <p class="unit-one-structure-quote">A narrative moves through a <mark>beginning</mark>, a <mark>development</mark>, and an <mark>ending</mark>.</p>
                <div class="unit-one-structure-grid">
                  <article><h3>Beginning</h3><p>Introduce the setting, characters, and situation.</p></article>
                  <article><h3>Development</h3><p>Build events and a challenge that changes the situation.</p></article>
                  <article><h3>Ending</h3><p>Resolve the action and leave a final impression.</p></article>
                </div>
                <p class="unit-one-structure-notes">Text structure: Beginning → Middle → Ending<br />Plot structure: Exposition → Rising Action → Climax → Falling Action → Resolution</p>
              </section>
            </div>
          </section>

          <section class="unit-one-knowledge-panel" id="unit-one-panel-elements" role="tabpanel" aria-labelledby="unit-one-tab-elements" data-unit-one-knowledge-panel="elements" hidden>
            <p class="unit-one-knowledge-kicker">Read the story closely</p><h1>Narrative Elements</h1>
            <div class="unit-one-elements-entry-grid" role="tablist" aria-label="Narrative elements">
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="true" data-unit-one-element="characterization"><span>01</span><b>Characterization</b><small>How a character is revealed</small></button>
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="false" data-unit-one-element="setting"><span>02</span><b>Setting</b><small>Where and when a story happens</small></button>
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="false" data-unit-one-element="plot"><span>03</span><b>Plot</b><small>The connected sequence of events</small></button>
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="false" data-unit-one-element="point-of-view"><span>04</span><b>Point of View</b><small>The lens through which we read</small></button>
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="false" data-unit-one-element="theme"><span>05</span><b>Theme</b><small>The idea a story explores</small></button>
            </div>
            <section class="unit-one-element-stage" id="unit-one-element-stage" role="tabpanel" aria-label="Selected narrative element"><p data-unit-one-element-number>01</p><h2 data-unit-one-element-title>Characterization</h2><span data-unit-one-element-description>Notice what characters say, do, think, and how they change.</span>
              <div class="unit-one-element-details">
                <section data-unit-one-element-detail="characterization"><article><h3>Core content</h3><p>Characters have emotions, motivations, and intentions. Main characters are usually more fully developed than supporting characters.</p><p>Characters can be revealed through <b>appearance, action, dialogue,</b> and <b>monologue</b>.</p></article><article><h3>Direct and indirect characterization</h3><p><b>Direct:</b> the narrator tells readers what a character is like.</p><p><b>Indirect:</b> readers infer personality through speech, thoughts, actions, appearance, body language, and reactions from others.</p></article><article><h3>Goal, motivation, and conflict</h3><p><b>Goal</b> — what does the character want?<br /><b>Motivation</b> — why do they want it?<br /><b>Conflict</b> — what prevents them from getting it?</p><p><b>Traits → Wants → Choices → Actions → Change</b></p></article></section>
                <section data-unit-one-element-detail="setting" hidden><article><h3>Core content</h3><p>Setting refers to <b>time, place,</b> and <b>situation</b>. It can establish mood, atmosphere, and characters’ feelings.</p></article><article><h3>Types of setting</h3><p><b>Backdrop setting:</b> provides a general background but is not essential to the story.</p><p><b>Integral setting:</b> is essential to the characters, conflict, or meaning of the story.</p></article><article><h3>Functions and questions</h3><p>Setting can influence how characters think, speak, and behave; what conflicts arise; how the plot develops; and what themes emerge.</p><p><b>Ask:</b><br />Where and when does the story take place?<br />What mood does it create?<br />How does it affect the characters, conflict, or theme?</p></article></section>
                <section data-unit-one-element-detail="plot" hidden><article><h3>Core content</h3><p>Plot is the sequence of events involving characters in conflict. It often develops from a character’s goal: a character wants something → an obstacle appears → conflict develops → the character acts → consequences follow.</p></article><article><h3>Plot arc</h3><p><b>Exposition</b> introduces characters, setting, situation, and initial conflict.<br /><b>Rising action</b> builds complication and tension.<br /><b>Climax</b> is the turning point of greatest tension.<br /><b>Falling action</b> unfolds the consequences.<br /><b>Resolution</b> reaches a conclusion or new state.</p></article><article><h3>Goal and plot devices</h3><p><b>Goal → Obstacle → Conflict → Choice → Consequence</b></p><p><b>Flashback:</b> a return to an earlier event.<br /><b>Foreshadowing:</b> a hint of what may happen later.<br /><b>Revelation:</b> a discovery that changes understanding.</p></article></section>
                <section data-unit-one-element-detail="point-of-view" hidden><article><h3>Core content</h3><p>Point of view determines <b>what the reader sees, knows, and understands.</b></p><p><b>First-person:</b> the narrator uses “I” and participates in the story.</p><p><b>Objective:</b> the narrator reports observable actions and dialogue; readers infer thoughts and feelings.</p></article><article><h3>Third-person points of view</h3><p><b>Omniscient:</b> the narrator can reveal the experiences of multiple characters.</p><p><b>Limited:</b> the narrator mainly follows one character’s perspective.</p><p><b>Second-person:</b> the narrator uses “you,” placing the reader or an implied character inside the narrative.</p></article><article><h3>Understanding POV</h3><p>Point of view controls access to information, thoughts, distance from characters, and what is revealed or withheld.</p><p><b>Ask:</b><br />Who tells the story?<br />Who sees the events?<br />Whose thoughts can we access?<br />What does the narrator know or withhold?</p></article></section>
                <section data-unit-one-element-detail="theme" hidden><article><h3>Core content</h3><p>Theme is <b>the underlying meaning or central idea explored by a story.</b> Themes often concern society, human nature, emotions, relationships, and values.</p></article><article><h3>Explicit and implicit theme</h3><p><b>Explicit:</b> stated directly — “Slow and steady wins the race.”</p><p><b>Implicit:</b> suggested through character, action, dialogue, conflict, choices, consequences, and resolution.</p></article><article><h3>Theme, moral, and topic</h3><p><b>Theme:</b> a central idea, issue, or question explored throughout a story.<br /><b>Moral:</b> a lesson about how people should or should not behave.</p><p><b>Topic</b> is what a story is about; <b>theme</b> is what the story says or asks about that topic.</p><p>Example: <b>Topic:</b> appearance. <b>Theme:</b> appearances can distort how people judge value and social status.</p></article></section>
              </div>
            </section>
          </section>

          <section class="unit-one-knowledge-panel" id="unit-one-panel-language" role="tabpanel" aria-labelledby="unit-one-tab-language" data-unit-one-knowledge-panel="language" hidden>
            <p class="unit-one-knowledge-kicker">Make the scene vivid</p><h1>Language &amp; Detail</h1>
            <ol class="unit-one-content-list unit-one-content-list--short" start="9"><li>Time Expressions</li><li>Concrete Details</li></ol>
          </section>
        </div>
        <img class="unit-one-knowledge-decor unit-one-knowledge-decor--candles" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-one-knowledge-decor.png" width="1536" height="1024" alt="" aria-hidden="true" loading="lazy" />
        <img class="unit-one-knowledge-decor unit-one-knowledge-decor--quill" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-one-knowledge-decor.png" width="1536" height="1024" alt="" aria-hidden="true" loading="lazy" />
      </section>

      ${unitTwoMarkup}
      ${unitTheoryMarkup}

      <section class="slide assessment-slide" id="assessment" data-nav="assessment" aria-labelledby="assessment-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE ASSESSMENT</p></div></div>
        <div class="assessment-heading"><div><p class="section-kicker accent-kicker">GRADING CRITERIA</p><h1 id="assessment-title">How your work<br />is assessed.</h1></div><p>Four assessed<br />components.</p></div>
        <div class="assessment-grid">
          <article class="assessment-card attendance"><p>01 / ATTENDANCE</p><h3>Attendance</h3><strong>10%</strong><span class="grid-icon"></span></article>
          <article class="assessment-card presentation"><p>02 / PRESENTATION</p><h3>Presentation</h3><strong>10%</strong><span class="screen-icon"></span></article>
          <article class="assessment-card assignment"><p>03 / ASSIGNMENT</p><h3>Assignment</h3><strong>15%</strong><span class="assignment-detail">X-mind 5%<br /><b>+ <a href="#writing-storybook">Writing 10%</a></b></span></article>
          <article class="assessment-card interaction"><p>04 / INTERACTION</p><h3>Interaction</h3><strong>5%</strong><span class="chat-icon"></span></article>
        </div>
      </section>

      <section class="slide storybook-slide" id="writing-storybook" aria-label="Write Your Own Story Book"><a class="storybook-back" href="#assessment">← Writing 10%</a><div id="storybook-slot"></div></section>

      <section class="slide presentation-slide" data-nav="assessment" aria-labelledby="presentation-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>PRESENTATION</p></div></div>
        <div class="presentation-heading"><h1 id="presentation-title">From Songs to<br />Narrative Writing</h1><div><h2>Presentation 10%</h2><p>Discussion and presentation<br />through texts, scenes and songs.</p></div></div>
        <div class="song-grid">
          <article class="song-card"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/song-01.png" alt="The Life of a Show Girl" /><h3>Characterization &amp;<br />Dialogues</h3><p>The Life of a Show Girl</p><span>01</span></article>
          <article class="song-card"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/song-02.png" alt="All Too Well" /><h3>Setting &amp; Sensory<br />Details</h3><p>All Too Well</p><span>02</span></article>
          <article class="song-card"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/song-03.png" alt="Betty, August, Cardigan" /><h3>Perspectives</h3><p>Betty · August · Cardigan</p><span>03</span></article>
          <article class="song-card"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/song-04.png" alt="Epiphany" /><h3>Theme</h3><p>Epiphany</p><span>04</span></article>
          <article class="song-card"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/song-05.png" alt="no body, no crime" /><h3>Plot &amp; Chekhov’s Gun</h3><p>no body, no crime</p><span>05</span></article>
        </div>
      </section>

      <section class="slide writing-slide" data-nav="assessment" aria-labelledby="writing-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>WRITING PRACTICE</p></div></div>
        <div class="writing-heading"><div><p class="section-kicker">Writing practice</p><h1 id="writing-title">Continue the story.<br />Make it your own.</h1></div><div><h2>Assignment 15%</h2><p>X-mind 5% <b>+</b> <span><a href="#writing-storybook">Writing 10%</a></span></p></div></div>
        <div class="writing-grid">
          <a class="writing-card coral-card" href="#practice"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/write-01.png" alt="The Necklace" /><b>Unit 1</b><h3>The Necklace</h3><p>Continuation writing</p></a>
          <a class="writing-card yellow-card" href="#practice"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/write-02.png" alt="After Twenty Years" /><b>Unit 2</b><h3>After Twenty Years</h3><p>Continuation writing</p></a>
          <a class="writing-card blue-card" href="#practice"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/write-03.png" alt="The Egg" /><b>Unit 3</b><h3>The Egg</h3><p>Continuation writing</p></a>
          <a class="writing-card green-card" href="#practice"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/write-04.png" alt="A Very Short Story" /><b>Unit 4</b><h3>A Very Short Story</h3><p>Continuation writing</p></a>
          <a class="writing-card pink-card" href="#practice"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/write-05.png" alt="Early Autumn" /><b>Unit 5</b><h3>Early Autumn</h3><p>Continuation writing</p></a>
        </div>
      </section>

      <section class="slide reading-slide" id="reading" data-nav="reading" aria-labelledby="reading-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>Supplementary reading</p></div></div>
        <div class="reading-heading"><h1 id="reading-title">Twelve texts.<br />Six units.</h1><div class="reading-heading-copy"><h2>Each reading appears with its<br />original source image.</h2><p><strong>5%</strong><span>Interaction for supplementary<br />and textbook reading</span></p></div></div>
        <div class="reading-grid">
          <a class="reading-card" id="reading-necklace" href="#reading-necklace" aria-label="Open The Necklace reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-01.png" alt="The Necklace" /><div><b class="unit-coral">Unit 1</b><h3>The Necklace</h3><p>Guy de Maupassant</p></div></a>
          <a class="reading-card" id="reading-fat" href="#reading-fat" aria-label="Open Fat reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-02.png" alt="Fat" /><div><b class="unit-yellow">Unit 1</b><h3>Fat</h3><p>Raymond Carver</p></div></a>
          <a class="reading-card" id="reading-after-twenty" href="#reading-after-twenty" aria-label="Open After Twenty Years reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-03.png" alt="After Twenty Years" /><div><b class="unit-blue">Unit 2</b><h3>After Twenty Years</h3><p>O. Henry</p></div></a>
          <a class="reading-card" id="reading-last-leaf" href="#reading-last-leaf" aria-label="Open The Last Leaf reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-04.png" alt="The Last Leaf" /><div><b class="unit-green">Unit 2</b><h3>The Last Leaf</h3><p>O. Henry</p></div></a>
          <a class="reading-card" id="reading-flowers" href="#reading-flowers" aria-label="Open The Flowers reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-05.png" alt="The Flowers" /><div><b class="unit-pink">Unit 3</b><h3>The Flowers</h3><p>Alice Walker</p></div></a>
          <a class="reading-card" id="reading-egg" href="#reading-egg" aria-label="Open The Egg reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-06.png" alt="The Egg" /><div><b class="unit-light-blue">Unit 3</b><h3>The Egg</h3><p>Sherwood Anderson</p></div></a>
          <a class="reading-card" id="reading-days-wait" href="#reading-days-wait" aria-label="Open A Day’s Wait reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-07.png" alt="A Day’s Wait" /><div><b class="unit-coral">Unit 4</b><h3>A Day’s Wait</h3><p>Ernest Hemingway</p></div></a>
          <a class="reading-card" id="reading-short-story" href="#reading-short-story" aria-label="Open A Very Short Story reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-08.png" alt="A Very Short Story" /><div><b class="unit-yellow">Unit 4</b><h3>A Very Short Story</h3><p>Ernest Hemingway</p></div></a>
          <a class="reading-card" id="reading-cop-anthem" href="#reading-cop-anthem" aria-label="Open The Cop and the Anthem reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-09.png" alt="The Cop and the Anthem" /><div><b class="unit-blue">Unit 5</b><h3>The Cop and the Anthem</h3><p>O. Henry</p></div></a>
          <a class="reading-card" id="reading-early-autumn" href="#reading-early-autumn" aria-label="Open Early Autumn reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-10.png" alt="Early Autumn" /><div><b class="unit-green">Unit 5</b><h3>Early Autumn</h3><p>Langston Hughes</p></div></a>
          <a class="reading-card" id="reading-story-hour" href="#reading-story-hour" aria-label="Open The Story of an Hour reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-11.png" alt="The Story of an Hour" /><div><b class="unit-pink">Unit 6</b><h3>The Story of an Hour</h3><p>Kate Chopin</p></div></a>
          <a class="reading-card" id="reading-trifles" href="#reading-trifles" aria-label="Open Trifles reading introduction"><img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/read-12.png" alt="Trifles" /><div><b class="unit-light-blue">Unit 6</b><h3>Trifles</h3><p>Susan Glaspell</p></div></a>
        </div>
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes" id="reading-detail-necklace" aria-labelledby="reading-detail-necklace-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="necklace" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-necklace.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit One Narrative Writing</p>
          <h1 id="reading-detail-necklace-title">The Necklace</h1>
          <p>Madame Mathilde Loisel dreams of elegance, admiration, and a life beyond her modest circumstances. When she borrows a dazzling necklace for a high-society evening, it seems as if her dream has finally come true. But one glamorous night can carry a cost no one expects.</p>
          <p>Guy de Maupassant</p>
        </article>
        <article class="reading-full-text" aria-labelledby="reading-necklace-text-title">
          <header class="reading-full-text-header">
            <p class="reading-full-text-kicker">FICTION · FULL TEXT</p>
            <h2 id="reading-necklace-text-title">The Necklace</h2>
            <p class="reading-full-text-deck">Madame Mathilde Loisel dreams of elegance, admiration, and a life beyond her modest circumstances.</p>
            <div class="reading-full-text-byline">${renderReadingAuthorBio("Guy de Maupassant")}<span>Short fiction</span></div>
          </header>
          ${renderNecklaceTestNotes()}
          <details class="reading-analysis-note" data-note-anchor-index="0">
            <summary><span>Characterization</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary>
            <div class="reading-analysis-note-content">
              <h3>Direct Characterization</h3>
              <div class="reading-note-definition"><p><strong>Definition</strong> ${literaryConceptDefinition("characterization")}</p><p><strong>Textual example</strong> “pretty and charming” and her dissatisfaction with her ordinary circumstances.</p></div>
              <p><strong>Analysis:</strong> The narrator states Mathilde’s beauty directly, then contrasts it with her unhappiness. This establishes the gap between her outward appeal and the life she believes she deserves.</p>
            </div>
          </details>
          <div class="reading-full-text-body">
          ${addDefinitionsAndExamples(renderStoryParagraphs(necklaceStoryParagraphs, "necklace", {
              2: `<details class="reading-analysis-note reading-analysis-note--indirect reading-analysis-note--mathilde"><summary><span>Characterization</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Indirect Characterization</h3><p><strong>Desires and thoughts:</strong> Mathilde imagines luxurious rooms, elegant dinners, expensive clothes, and high society. These reveal her social ambition and dissatisfaction with her life.</p></div></details>`,
              88: `<details class="reading-analysis-note reading-analysis-note--indirect reading-analysis-note--loisel"><summary><span>Characterization</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Indirect Characterization</h3><p><strong>Contrast:</strong> M. Loisel is characterized mainly through action. He gives up his savings, searches for the necklace, sacrifices his inheritance, borrows money, and works extra jobs. His generosity and sense of responsibility contrast with Mathilde's dissatisfaction and social ambition.</p></div></details>`,
              56: `<details class="reading-analysis-note reading-analysis-note--setting"><summary><span>Setting</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><p>The story is set in Paris, where differences in wealth and social status are highly visible.</p><p>More importantly, Maupassant uses contrasting spaces to reflect Mathilde's changing relationship with reality:</p><ul><li><strong>The Loisel apartment</strong> → ordinary middle-class reality</li><li><strong>Mme. Forestier's home and jewelry box</strong> → access to the world Mathilde desires</li><li><strong>The ballroom</strong> → luxury, admiration, social performance</li><li><strong>The dark streets and shabby carriage</strong> → sudden return to reality</li><li><strong>The garret and marketplace</strong> → real poverty after years of debt</li></ul><p>The movement of setting follows a larger pattern:</p><p class="reading-setting-pattern">Ordinary Reality → Glamorous Illusion → Harsh Reality</p><p>The ballroom allows Mathilde to look wealthy for one night; the streets immediately expose how temporary that appearance is. The name Rue des Martyrs also anticipates the suffering that follows.</p><p>Setting is therefore not merely a backdrop. It makes Mathilde's social rise and fall physically visible.</p></div></details>`,
              0: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Personification · “a slip of fate”</h3><div class="reading-note-definition"><p><strong>Definition</strong> ${literaryConceptDefinition("personification")}</p><p><strong>Textual example</strong> “as if by a slip of fate”</p></div><p>This wording frames Mathilde’s birth into a clerk’s family as an accident. It reflects her belief that her social circumstances prevent her from living the life she imagines.</p></div></details>`,
               3: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Allusion · The Sphinx</h3><p>The phrase “sphinxlike smile” alludes to the mythical Sphinx, suggesting a mysterious, unreadable expression. It adds elegance to Mathilde’s fantasy of high society and shows how far that fantasy is from her ordinary life. It also reflects the sophisticated image she hopes to imitate.</p></div></details>`,
              42: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Symbolism · The Necklace</h3><p>The necklace looks like a diamond but is made of paste and worth at most 500 francs. To Mathilde, it represents the wealth and status she longs for. Her choice reflects her habit of judging value by appearance; the final revelation reinforces the story’s contrast between appearance and reality.</p></div></details>`,
              45: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Symbolism · The Mirror</h3><p>The mirror symbolizes vanity, self-image, and fixation on outward appearance. Mathilde’s joy as she admires herself wearing the necklace shows how strongly her sense of worth depends on how she looks. Her fascination with her reflection also recalls Narcissus and suggests the danger of excessive self-absorption.</p><p>A reflection reveals only the surface, not the reality behind it. When Mathilde later looks in the glass and discovers the necklace is gone, her temporary illusion of wealth and status disappears with it.</p></div></details>`,
              50: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Dramatic Irony · The Ball</h3><p>Readers know Mathilde is displaying borrowed luxury while the guests see only an elegant, wealthy-looking woman. The gap between her appearance and her real circumstances reinforces appearance versus reality.</p></div></details>`,
              51: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Metaphor · Pleasure and Misery</h3><p>“Intoxicated by pleasure” compares Mathilde’s joy to drunkenness, showing how the ball’s excitement overwhelms her. Later, “the black misery … about to fall upon him” pictures hardship as darkness descending.</p></div></details>`,
              83: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Foreshadowing · The Jeweler’s Case</h3><p>The jeweler says he supplied the case, not the necklace. This inconsistency quietly invites doubt about the necklace’s origin. It hints at the final revelation without proving the truth before Mathilde learns it.</p></div></details>`,
              101: `<details class="reading-analysis-note reading-analysis-note--pov"><summary><span>Point of View</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Third-Person Narration, Closely Aligned with Mathilde</h3><ul><li>The narration gives us access to Mathilde’s dissatisfaction, fantasies, desires, and emotional response to the ball.</li><li>We see the necklace as she sees it, while the narrator withholds its true value.</li><li>The reader shares Mathilde’s mistake: both mistake appearance for reality.</li><li>The final revelation changes both Mathilde’s understanding and ours.</li></ul></div></details>`,
              121: `<details class="reading-analysis-note reading-analysis-note--literary-device"><summary><span>Literary Devices</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><h3>Situational Irony · The Revelation</h3><p>After ten years of hardship replacing a “diamond” necklace, Mathilde learns the original was paste worth at most 500 francs. The real value sharply reverses what she and the reader expected.</p></div></details><details class="reading-analysis-note reading-analysis-note--theme"><summary><span>Theme</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><p>A theme expresses a universal truth, so it should be written as a complete idea rather than as a topic.</p><p>For <em>The Necklace</em>:</p><p><strong>Topic:</strong> Appearance vs. Reality</p><p><strong>Theme / Universal Truth:</strong> When people judge happiness, worth, and social status by appearances, they may overlook what is truly valuable and suffer lasting consequences.</p></div></details>`,
              105: `<details class="reading-analysis-note reading-analysis-note--plot"><summary><span>Plot</span><span class="reading-analysis-note-toggle" aria-hidden="true"></span></summary><div class="reading-analysis-note-content"><p>The plot of <em>The Necklace</em> follows a chain of cause and effect:</p><p class="reading-plot-chain">Desire → Opportunity → Loss → Concealment → Sacrifice → Revelation</p><h3>Exposition</h3><p>Mathilde is beautiful but deeply dissatisfied with her ordinary middle-class life. She longs for wealth, admiration, and a higher social status.</p><h3>Rising Action</h3><p>An invitation to a ministerial ball gives Mathilde the opportunity she desires. She gets a dress, borrows a necklace, enjoys one night of admiration, and then discovers that the necklace is missing.</p><h3>Complication</h3><p>Rather than tell Mme. Forestier the truth, Mathilde and her husband secretly replace the necklace. They buy one priced at 36,000 francs, although the jeweler says it is worth 40,000 francs.</p><h3>Consequences</h3><p>The Loisels spend ten years in poverty repaying their debt. The hardship changes Mathilde’s appearance and way of life.</p><h3>Climax / Final Revelation</h3><p>When Mathilde finally tells Mme. Forestier what happened, Forestier reveals that the original necklace was imitation jewelry, worth at most 500 francs.</p><h3>Cause and Effect</h3><p>The necklace is lost by accident, but Mathilde’s choice to hide the loss and replace it turns a misfortune into ten years of poverty. The final revelation shows how appearances—and the assumptions people make about them—shape the tragedy.</p></div></details>`,
          }))}
          </div>
          <footer>THE END</footer>
        </article>
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-fat" aria-labelledby="reading-detail-fat-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="fat" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-fat.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit One Narrative Writing</p>
          <h1 id="reading-detail-fat-title">Fat</h1>
          <p>A waitress recounts a story to her friend, about “the fattest person I have ever seen.”</p>
          <p>Raymond Carver</p>
        </article>
        <article class="reading-full-text reading-full-text--has-test-notes" aria-labelledby="reading-fat-text-title">
          <header class="reading-full-text-header">
            <p class="reading-full-text-kicker">FICTION · FULL TEXT</p>
            <h2 id="reading-fat-text-title">Fat</h2>
            <p class="reading-full-text-deck">A waitress recounts a story to her friend about “the fattest person I have ever seen.”</p>
            <div class="reading-full-text-byline">${renderReadingAuthorBio("Raymond Carver")}<span>Short fiction</span></div>
          </header>
          ${renderReadingTestNotes("Fat", narrativeBloomQuestions.fat)}
          <div class="reading-full-text-body">
            ${renderStoryParagraphs(fatStoryParagraphs, "fat", fatReadingNotes)}
          </div>
          <footer>THE END</footer>
        </article>
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-after-twenty" aria-labelledby="reading-detail-after-twenty-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="after-twenty" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-after-twenty.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Two Narrative Writing</p>
          <h1 id="reading-detail-after-twenty-title">After Twenty Years</h1>
          <p>Two old friends have made a promise to meet at a certain New York City corner after 20 years of separation.</p>
          <p>O. Henry</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-after-twenty",
          title: "After Twenty Years",
          deck: "Two old friends return to a New York City corner to honor a promise made twenty years earlier.",
          author: "O. Henry",
          paragraphs: afterTwentyStoryParagraphs,
          testQuestions: afterTwentyTestQuestions,
          analysisNotes: afterTwentyNotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-last-leaf" aria-labelledby="reading-detail-last-leaf-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="last-leaf" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-last-leaf.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Two Narrative Writing</p>
          <h1 id="reading-detail-last-leaf-title">The Last Leaf</h1>
          <p>In the winding alleys of Greenwich Village, two young artists—Sue from Maine and Johnsy from California—share more than a studio. They share dreams, laughter, and, one fateful winter, a fight for life.</p>
          <p>O. Henry</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-last-leaf",
          title: "The Last Leaf",
          deck: "In Greenwich Village, friendship and art become a young woman’s fragile reason to live.",
          author: "O. Henry",
          paragraphs: lastLeafStoryParagraphs,
          testQuestions: lastLeafTestQuestions,
          analysisNotes: lastLeafNotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-flowers" aria-labelledby="reading-detail-flowers-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="flowers" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-flowers.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Three Narrative Writing</p>
          <h1 id="reading-detail-flowers-title">The Flowers</h1>
          <p>It is not until she notices something else on the ground that we are told her summer was over.</p>
          <p>Alice Walker</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-flowers",
          title: "The Flowers",
          deck: "It is not until she notices something else on the ground that we are told her summer was over.",
          author: "Alice Walker",
          paragraphs: flowersStoryParagraphs,
          testQuestions: narrativeBloomQuestions.flowers,
          analysisNotes: flowersNotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-egg" aria-labelledby="reading-detail-egg-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="egg" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-egg.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Three Narrative Writing</p>
          <h1 id="reading-detail-egg-title">The Egg</h1>
          <p>Published two years after the innovative, influential 1919 masterpiece Winesburg, Ohio, this collection of short stories solidified the author's reputation as a major American writer.</p>
          <p>Sherwood Anderson</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-egg",
          title: "The Egg",
          deck: "A son remembers his parents’ ambition, a failed chicken farm, and the strange object that came to define their lives.",
          author: "Sherwood Anderson",
          paragraphs: eggStoryParagraphs,
          testQuestions: eggTestQuestions,
          analysisNotes: eggQANotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-days-wait" aria-labelledby="reading-detail-days-wait-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="days-wait" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-days-wait.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Four Narrative Writing</p>
          <h1 id="reading-detail-days-wait-title">A Day’s Wait</h1>
          <p>When the boy gets a fever, a doctor prescribes three medicines and tells the boy’s father that his temperature is 102 degrees.</p>
          <p>Ernest Hemingway</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-days-wait",
          title: "A Day’s Wait",
          deck: "A boy with a fever quietly waits for death after confusing Fahrenheit with Celsius.",
          author: "Ernest Hemingway",
          paragraphs: daysWaitStoryParagraphs,
          testQuestions: narrativeBloomQuestions["days-wait"],
          analysisNotes: daysWaitNotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-short-story" aria-labelledby="reading-detail-short-story-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="short-story" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-short-story.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Four Narrative Writing</p>
          <h1 id="reading-detail-short-story-title">A Very Short Story</h1>
          <p>In the story, a soldier and a nurse named “Luz” fall in love as she tends to him over the course of three months in a hospital in Padua.</p>
          <p>Ernest Hemingway</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-short-story",
          title: "A Very Short Story",
          deck: "A soldier and a nurse fall in love in wartime, then discover how distance changes what they imagined together.",
          author: "Ernest Hemingway",
          paragraphs: veryShortStoryParagraphs,
          testQuestions: narrativeBloomQuestions["short-story"],
          analysisNotes: veryShortNotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-cop-anthem" aria-labelledby="reading-detail-cop-anthem-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="cop-anthem" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-cop-anthem.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Five Narrative Writing</p>
          <h1 id="reading-detail-cop-anthem-title">The Cop and the Anthem</h1>
          <p>Soapy is a homeless guy who prefers the warm cell to the cold night under the New York sky. He does everything he can think of in order to draw the attention of the police. However without any success. Until he hears a magical organ anthem.</p>
          <p>O. Henry</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-cop-anthem",
          title: "The Cop and the Anthem",
          deck: "Soapy tries every way he can imagine to be arrested before winter, until music awakens a different resolve.",
          author: "O. Henry",
          paragraphs: copAnthemStoryParagraphs,
          testQuestions: narrativeBloomQuestions["cop-anthem"],
          analysisNotes: copAnthemNotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-early-autumn" aria-labelledby="reading-detail-early-autumn-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="early-autumn" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-early-autumn.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Five Narrative Writing</p>
          <h1 id="reading-detail-early-autumn-title">Early Autumn</h1>
          <p>Two former lovers, Bill and Mary, cross paths in Washington Square in New York.</p>
          <p>Langston Hughes</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-early-autumn",
          title: "Early Autumn",
          deck: "Two former lovers meet by chance in Washington Square and confront the distance that time has placed between them.",
          author: "Langston Hughes",
          paragraphs: earlyAutumnStoryParagraphs,
          testQuestions: earlyAutumnTestQuestions,
          analysisNotes: earlyAutumnNotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-story-hour" aria-labelledby="reading-detail-story-hour-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="story-hour" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-story-hour.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Six Narrative Writing</p>
          <h1 id="reading-detail-story-hour-title">The Story of an Hour</h1>
          <p>Mrs. Mallard, a woman living in the patriarchal late 1800s married to a man named Brently Mallard, is imprisoned in the same place she calls home.</p>
          <p>Kate Chopin</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-story-hour",
          title: "The Story of an Hour",
          deck: "Mrs. Mallard, a woman living in the patriarchal late 1800s married to a man named Brently Mallard, is imprisoned in the same place she calls home.",
          author: "Kate Chopin",
          paragraphs: storyHourStoryParagraphs,
          testQuestions: storyHourTestQuestions,
          analysisNotes: storyHourNotes,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text reading-detail-slide--with-test-notes reading-detail-slide--with-analysis-notes" id="reading-detail-trifles" aria-labelledby="reading-detail-trifles-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="trifles" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="https://assets.negentropylearning.com.cn/narrative-writing/assets/reading-detail-trifles.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Six Narrative Writing</p>
          <h1 id="reading-detail-trifles-title">Trifles</h1>
          <p>Glaspell’s gripping narrative centers on two women who, through keen observation and intuition, piece together the hidden story behind the crime while the men dismiss crucial evidence as mere trifles.</p>
          <p>Susan Glaspell</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-trifles",
          title: "Trifles",
          deck: "Two women notice the domestic details that reveal a hidden story while the men around them dismiss those clues as insignificant.",
          author: "Susan Glaspell",
          kicker: "DRAMA",
          label: "One-act play",
          paragraphs: triflesStoryParagraphs,
          testQuestions: narrativeBloomQuestions.trifles,
          analysisNotes: triflesNotes,
        })}
      </section>

      <section class="slide info-slide" id="other-information" aria-labelledby="info-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>OTHER INFORMATION</p></div></div>
        <div class="info-heading"><h1 id="info-title">This course requires<br />two student coordinators.</h1><div class="coordinator-badge"><strong>02</strong><span>COORDINATORS</span></div></div>
        <div class="rule"></div>
        <p class="class-code-label"><span class="blue-bar"></span>Xuexitong class codes</p>
        <p class="class-code-caption">Join the class with the code that matches your section.</p>
        <div class="class-codes">
          <div class="class-code coral-line"><p>CLASS 9</p><strong>61948866</strong><span>Xuexitong class code</span></div>
          <div class="class-code blue-line"><p>CLASS 11</p><strong>24281156</strong><span>Xuexitong class code</span></div>
        </div>
        <div class="info-footer"><span>09&nbsp;&nbsp; Class 9</span><span>11&nbsp;&nbsp; Class 11</span></div>
      </section>

      <section class="slide practice-slide" id="practice" aria-labelledby="practice-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>CONTINUATION WRITING · PRACTICE 02</p></div></div>
        <div class="practice-grid">
          <div class="poem-panel"><p class="section-kicker accent-kicker">READ THE POEM</p><h1 id="practice-title">The crab is peeling my shell.<br />The notebook is writing me.<br />The sky is raining me down<br />on maple leaves and snowflakes.<br /><strong>And you are thinking of me.</strong></h1><div class="poem-footer">LET THE IMAGE BECOME A MEMORY.</div></div>
          <article class="task-card"><p class="section-kicker blue-kicker">YOUR TASK</p><h2>Write a 150-word<br />narrative in English.</h2><p>about the feelings<br />this poem evokes in you.</p><ol><li>Begin with a moment, a place, or a memory.</li><li>Use images and details to show the feeling.</li><li>End with a thought of someone who matters.</li></ol><span class="word-count">150 words</span><div class="task-footer">WRITE FROM THE FEELING</div></article>
        </div>
      </section>

      <section class="slide sample-slide" aria-labelledby="sample-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>MICROFICTION · WRITING SAMPLE</p></div></div>
        <div class="sample-heading"><p class="section-kicker accent-kicker">A QUIET NIGHT</p><h1 id="sample-title">At night, the city<br />looked almost tender.</h1></div>
        <div class="sample-columns">
          <div><p>Thousands of windows burned above the streets, each holding a life I could not enter. Traffic lights trembled across the pavement—red, then green, then red again.</p><p class="sample-emphasis">Someone was waiting for dinner.<br />Someone was leaving a lamp on<br />for a late return.<br /><span>Someone, somewhere, was expected.</span></p><p>I walked home beneath them, my phone cold in my hand, and told myself that being alone was only temporary.</p></div>
          <div><p>You had not replied because you were busy.<br />You had forgotten because the day had been long.<br />You had said nothing because perhaps the feeling itself was too difficult to name.</p><p class="sample-blue">I became very good at<br />translating silence into hope.</p><p>At every red light, I checked my phone.<br />At every vibration, my heart answered before I did.</p><p class="sample-end">It was never you.</p></div>
        </div>
      </section>
    </main>

    <div class="lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <button class="lightbox-close" type="button" aria-label="Close image">×</button>
      <div class="lightbox-inner"><img src="" alt="" /><div><h2 id="lightbox-title"></h2><p></p></div></div>
    </div>
`);
