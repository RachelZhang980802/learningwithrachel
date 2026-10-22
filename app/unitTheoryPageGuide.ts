// Page labels were checked against the rendered source pages, including image-only pages.
// These are navigation labels, not replacements for the original lesson content.
const pageTitleLists: Record<number, string> = {
  3: `1|Growth and Maturity
2|Table of Content
3|Teaching Objectives
4|Pre-Exploration
5|The Haunted House · first impression
6|The Haunted House · description
7|The Remote Castle · expectation
8|The Remote Castle · passage
9|Wuthering Heights · place and people
10|Wuthering Heights · wind and landscape
11|Windmill and Sunflower · association
12|The Mill on the Floss · sound and river
13|Windmill and Sunflower · Chinese poem
14|The Night Cityscape · association
15|Night Bazaar · silence
16|Night Café · quiet
17|Sunrise Over Hills · association
18|Sunrise Over Hills · passage
19|Rainy Days · association
20|Rainy Days · passage
22|Future Stories / Past Stories
23|Present Stories / War Stories
24|Sea Stories / Outer Space Stories
25|Island Stories / Antarctic Stories
26|City Stories / Imaginary Stories
27|Hogwarts · an invented place
28|Middle-earth · a mapped world
29|Learning the Skills
30|What Is Setting?
31|Develop Setting · the lay of the land
32|Develop Setting · weather
33|Develop Setting · sensory detail
34|Setting and Sensory Detail
36|Transference · emotional meaning
37|Develop Setting · concrete detail`,
  4: `1|Truth and Interpretation
2|Table of Contents
3|Learning Objectives
4|Pre-Exploration
5|Different Position, Different POV
6|George Eliot · several points of view
7|Rapunzel · the familiar story
8|Rapunzel · third person
9|Rapunzel · the prince in first person
10|Rapunzel · the girl in first person
11|Rapunzel · second person
12|Lolita · background
13|Lolita · the perpetrator's perspective
14|Lolita · film still and claim
15|Lolita · the victim's perspective
16|Learning the Skills
17|What Is Point of View?
18|Types of Point of View
19|First Person · definition
20|First Person · narrator roles
21|Jane Eyre · a central character
22|Benjamin Franklin · autobiography
23|Heart of Darkness · a witness
24|The Great Gatsby · a minor participant
25|The Tell-Tale Heart · unreliable voice
26|Reliable or Unreliable Narrator?
27|First Person · function and limit
28|Second Person · definition
29|Second Person · addressee types
30|Bright Lights, Big City
31|Human Acts
32|The Egg
33|If on a winter's night a traveler
34|The Catcher in the Rye · direct address
35|Second Person · effects and risks
36|Third Person · definition
37|Third Person · three kinds
38|Omniscient · definition
39|Tom Sawyer · omniscient example
40|Omniscient · function
41|Omniscient · what a narrator can do
42|Objective · definition
43|Objective · function
44|Hills Like White Elephants
45|Limited · definition
46|Limited · function
47|The Odd Woman · limited example
48|War and Peace · wider access
49|Compare the five POV types
50|Three ways to narrate one event
51|Compare the narrators' knowledge
52|Objective, limited, omniscient
53|Practice 1 · Harry Potter
54|Practice 2 · Magic Treehouse
55|Practice 3 · Hoot, Chapter Two
56|Practice 4 · Two Bad Ants
100|Language Study
101|How to Write Like Hemingway
102|Precise Word Choice
103|Iceberg Principle · omission
104|Iceberg Principle · what to leave out
105|Iceberg Principle · reader inference
106|Narrative Tenses`,
  5: `1|Dream and Faith
2|Table of Contents
3|Learning Objectives
4|Pre-Class Exploration
5|Father and Son · the sequence
6|E. O. Plauen · the cartoonist
7|Father and Son · an interpretation
8|Bierce · Hare and Tortoise
9|Bierce · a changed moral
10|Learning the Skills
11|What Is Theme? · definition
12|What Is Theme? · central idea
13|Theme, topic, main idea, summary
14|Why Theme Matters
15|Common Topics
16|Implicit and Explicit Themes
17|Theme and Point of View
18|Harry Potter · rescue scene
22|How to Develop Themes
23|Step 1 · find the truth
24|Frida Kahlo · personal truth
25|Step 2 · turn truth into a misbelief
26|A character's self-belief
27|Step 3 · locate the origin
28|Sources of a misbelief
29|Step 4 · look for patterns
30|Patterns in repeated scenes
31|Step 5 · tell the truth
32|A moment of recognition
33|What Is Your Epiphany?
161|Language Study
162|Alliteration · first definition
163|Alliteration · speech sounds
164|Alliteration · details
165|Alliteration in brand names
166|Alliteration in slogans
167|Shakespeare's Sonnet 30
168|Alliteration · literary example
169|Understatement · first definition
170|Understatement · irony
171|Understatement · effects
172|Understatement · illustrated example
173|Onomatopoeia · first definition
174|Onomatopoeia · echoic words
175|Onomatopoeia · sound-word poster
177|Soapy's ambitions · understatement
178|Activity 7 · identify devices (1–8)
179|Activity 7 · identify devices (9–15)
180|Activity 10 · use figurative devices
181|Your Narrative · theme prompt
182|Figuratively Express “I Love You”
183|Literary expressions of love · 1
184|Literary expressions of love · 2
185|Literary expressions of love · 3
186|Literary expressions of love · 4`,
  6: `1|Conflict and Harmony
2|Contents
3|Learning Objectives
4|Pre-Class Exploration
5|Father and Son · cartoon sequence
6|Father and Son · narrative retelling
7|One Sentence, One Story · 1–3
8|One Sentence, One Story · 4–6
9|One Sentence, One Story · 7–9
10|One Sentence, One Story · 10–12
11|One Sentence, One Story · 13–15
12|Learning the Skills
13|What Is Plot?
14|Five Elements of Plot
15|Basic Plot Structure · diagram
16|The Role of Conflict
17|Internal and External Conflict
18|How to Create Conflict
19|Goal + Complication = Conflict
66|Language Study
67|Cohesion in Narrative
68|Six Cohesive Devices
69|Reference · examples
70|Substitution · examples
71|Lexis · examples
72|Ellipsis · examples
73|Cohesive Nouns · examples
74|Conjunction · examples
75|Cohesive Devices · combined passage
76|Unity · one main idea
77|Topic Sentence · example`
};

export const unitTheoryPageTitles: Record<number, Record<number, string>> = Object.fromEntries(
  Object.entries(pageTitleLists).map(([unit, list]) => [Number(unit), Object.fromEntries(
    list.split("\n").map((line) => {
      const separator = line.indexOf("|");
      return [Number(line.slice(0, separator)), line.slice(separator + 1)];
    }),
  )]),
);

// Short editorial reading cues. The original page image remains the source of record.
export const unitTheoryPageCues: Record<number, Record<number, string>> = {
  3: {
    5: "Compare the pictured building with the mood you expect before reading the passage.",
    6: "The dark oak, desolation, and suggested curse make atmosphere part of the place.",
    8: "The orange trees, absence of snow, and furnished rooms complicate the idea of an isolated castle.",
    10: "Wind-bent trees and thorns make the force of the weather visible.",
    12: "Listen to the rush of water and the mill; the noise heightens the sense of peace.",
    13: "The PPTX contains the poem 《入若耶溪》 on this page, although it is missing from the converted page image. Its cicadas and birdsong deepen the stillness.",
    15: "The almost closed bazaar is seen through a narrator whose original purpose is fading from mind.",
    16: "Quiet matters differently to the deaf old man than it does to other café guests.",
    18: "The rising sun changes temperature and what the narrator can do in the valley.",
    20: "Rain, pools, waves, and the sheltering cat all belong to the same lived scene.",
    27: "An invented setting becomes convincing when its locations relate to one another.",
    28: "The map makes an imagined world spatially legible.",
    30: "Setting includes place, historical time, and social circumstances—not scenery alone.",
    31: "The Salinas Valley example locates landforms and follows the river's course.",
    32: "Weather is shown through what people wear and feel, not only a weather label.",
    33: "Several senses combine into one remembered experience on the boat.",
    34: "Select sensory details through the perceiving character's point of view.",
    36: "The slide extends the psychological term ‘transference’ to emotional meaning carried by a place or object.",
    37: "Specific furnishings and the snowy view create the room's character."
  },
  4: {
    8: "The outside narrator describes both Rapunzel and the prince.",
    9: "The prince's first-person account gives his own effort and desire.",
    10: "Rapunzel's first-person account reveals pain and frustration omitted from his version.",
    11: "Second person places the addressee inside the same event.",
    13: "The perpetrator's framing claims the child caused the abuse; read it as an unreliable self-justification.",
    14: "The film still repeats the perpetrator's claim. The next page deliberately changes perspective.",
    15: "The victim perspective restores the child's vulnerability and identity beyond the name imposed by Humbert.",
    20: "First-person narrators can occupy different roles: central character, author, witness, or minor participant.",
    25: "Poe's narrator insists on sanity while describing a murder; his claim invites doubt.",
    26: "Ask what the narrator knows, omits, or has a reason to distort.",
    34: "Salinger's first-person voice addresses ‘you’; direct address alone does not make the whole passage a second-person narrative.",
    38: "Omniscience means access beyond any single character's mind or location.",
    42: "An objective narrator does not directly report private thoughts or feelings.",
    45: "A limited narrator stays close to one character's perception or a small number of characters.",
    49: "Compare narrator position, pronouns, and access to thought separately.",
    50: "The same window-breaking event is told with different levels of access to emotion.",
    51: "Which narrator can know the mother’s thoughts, and which only reports what can be observed?",
    52: "The slide labels objective, limited, and omniscient versions of one event.",
    53: "Source answer: third-person omniscient. The excerpt compares how the Dursleys feel with how Harry feels.",
    54: "Source answer: third-person limited. Jack’s hope is reported; Annie’s private thoughts are not.",
    55: "Source answer: third-person limited. Roy’s preferences and wishes are available; his parents are observed from outside.",
    56: "Source answer: third-person omniscient. The passage reports the queen’s judgment and the other ants’ response.",
    102: "Use simple, direct, concrete words; avoid unnecessary adjectives and adverbs.",
    103: "The iceberg metaphor separates what the prose states from what readers infer.",
    104: "Omission only works when the writer knows what has been left out.",
    105: "The reader fills emotional gaps left by plain surface description.",
    106: "The diagram compares past, present, and future tense forms."
  },
  5: {
    5: "The father's anger changes when he sees the torn clothing.",
    7: "The slide interprets care, rather than discipline alone, as the larger idea.",
    8: "Bierce changes the familiar race's outcome: the hare wins and returns to encourage the tortoise.",
    9: "A changed plot changes the moral the story can support.",
    13: "A topic such as love is a subject; a theme makes a claim about it.",
    16: "An implicit theme emerges from action and dialogue; an explicit one is stated.",
    17: "Point of view changes whose interpretation of the theme a reader receives.",
    18: "This page introduces a Harry Potter case. Its following analysis pages 19–21 are outside the selected range, so the lesson resumes at page 22.",
    22: "Indirect development is usually stronger when theme grows through plot and character.",
    23: "Begin with a truth the writer cares about.",
    25: "Give the protagonist a misbelief that opposes that truth.",
    27: "Show what experience formed the misbelief.",
    29: "A repeated pattern can make the belief feel earned rather than arbitrary.",
    31: "The epiphany is the moment the character recognizes or acts on the truth.",
    33: "This is an open writing prompt, not a model answer.",
    163: "Alliteration repeats speech sounds, not necessarily the same letter.",
    165: "Brand names use repeated sounds for memorability.",
    167: "Read Sonnet 30 aloud to hear repeated initial sounds.",
    168: "The slide uses a Soapy passage to practice identifying repeated sounds.",
    169: "Understatement presents a serious or large matter as smaller than it is.",
    172: "The sentence calls an extraordinary judgment an ‘understatement.’",
    175: "These printed sound words imitate or evoke the sounds they name.",
    177: "The understatement is ‘not of the highest’: a mild judgment of Soapy's desperate wish for winter shelter in prison.",
    178: "The slide supplies device labels for examples 1–8; read the sentence before checking its red label.",
    179: "The slide supplies device labels for examples 9–15.",
    180: "The exercise builds one short scene using alliteration, hyperbole, simile, onomatopoeia, and metaphor.",
    181: "Apply the theme lesson to your own narrative.",
    182: "The next four pages offer literary expressions of love, not one prescribed formula."
  },
  6: {
    5: "Track the broken window, disappearance, worry, and reunion in the cartoon sequence.",
    6: "The prose retelling makes the change in the father's feelings explicit.",
    7: "Each tiny example implies a conflict or reversal beyond the few words shown.",
    8: "One sentence can leave the cause of a changed relationship or action unstated.",
    9: "The reader supplies the missing events between the short clauses.",
    13: "Plot links events by dramatic and emotional significance, not chronology alone.",
    14: "The five elements form a sequence: exposition, rising action, climax, falling action, resolution.",
    15: "Use the diagram to locate an inciting incident, stakes, turning point, and aftermath.",
    16: "The main conflict joins a character's objective with an obstacle and raises a dramatic question.",
    17: "The chart separates inner struggle from conflict with external forces.",
    18: "A desire or dilemma becomes plot material when something resists it.",
    19: "The slide summarizes its conflict formula as goal plus complication.",
    67: "Cohesion links ideas with grammar and vocabulary; unity keeps them about one main idea.",
    68: "The six device names become examples on the following pages.",
    69: "Reference points back to an earlier person or thing using words such as pronouns.",
    70: "Substitution replaces an earlier word or phrase without repeating it exactly.",
    71: "Lexical links connect related words, including synonyms and categories.",
    72: "Ellipsis omits recoverable words.",
    73: "A cohesive noun names an event or idea introduced in the previous sentence.",
    74: "Conjunctions make relationships such as sequence, cause, and addition explicit.",
    75: "This passage combines several cohesive devices; the labels identify each link.",
    76: "Every supporting sentence should relate to the paragraph's main idea.",
    77: "The topic sentence announces a claim that the following sentences support."
  }
};
