export type ClozeGap = { root: string; answer: string };
export type ClozeStage = { title: string; cue: string; parts: string[] };
export type ClozeExercise = { title: string; sourceTitle: string; gaps: ClozeGap[]; stages: ClozeStage[] };

type Draft = { title: string; sourceTitle: string; stages: { title: string; cue: string; passage: string }[] };
const draft: Record<string, Draft> = {
  "02": {
    title: "A tax on tools, or on change?", sourceTitle: "Should the Robots Be Taxed?",
    stages: [
      { title: "The proposal", cue: "What problem does the robot tax claim to solve?", passage: "When Bill Gates's suggestion went [[go viral:viral]], a European [[commission:commission]] was already considering how to respond to robots. The fear was that [[automation:automation]] would bring widespread [[unemployment:unemployment]]. A tax might fund a [[universal:universal]] basic income, but the author asks whether the machine itself is the right target." },
      { title: "A historical test", cue: "What happened when machines entered textile work?", passage: "In the [[textile:textile]] trade, a [[handloom:handloom]] worker once set the pace at home. Factory [[machinery:machinery]] made cloth faster, while many [[weaver:weavers]] struggled to adapt. Their wages could [[plummet:plummet]] even though society as a whole gained cheaper goods. That history makes the cost of transition impossible to ignore." },
      { title: "The hidden effects", cue: "Why is counting lost jobs insufficient?", passage: "The industrial shift had [[side effect:side effects]] far beyond employment: family size and ideas of [[prosperity:prosperity]] changed. Today, resources may become more [[constrain:constrained]] even as output rises. Higher output [[per capita:per capita]] can conceal gains [[skew:skewed]] toward a few groups. The distribution of benefits matters as much as their total." },
      { title: "The author's position", cue: "Who should pay, and what does adjustment require?", passage: "Productive robots can raise profits for [[corporation:corporations]], which already pay tax. The political [[flashpoint:flashpoint]] is the pain of change, not the tool alone. New inventions may [[disrupt:disrupt]] old jobs and create different ones; finding a new [[equilibrium:equilibrium]] takes time. Policy therefore needs [[empathy:empathy]] for workers who cannot move overnight." },
    ],
  },
  "03": {
    title: "What a roommate can teach", sourceTitle: "Roommates",
    stages: [
      { title: "The unlikely roommate", cue: "How did the boy first understand his grandfather?", passage: "For much of his childhood, the narrator [[take sb./sth. for granted:took for granted]] his grandfather's presence in their shared room. His grandfather enjoyed [[strife:strife]], arguing even in the [[synagogue:synagogue]]. The boy [[voluntarily:voluntarily]] tried to teach him what he had learned at school, speaking as though age had made the older man ignorant. Their relationship was more [[subtle:subtle]] than either understood." },
      { title: "A life carried into sleep", cue: "What survived from the grandfather's past?", passage: "Before emigrating from [[Lithuania:Lithuania]], the grandfather had lived through a troubled world. At night, his dreams filled the room with angry [[outburst:outbursts]] and [[curse:curses]] in two languages. He imagined diseases such as [[cholera:cholera]] emptying enemy villages. The child's ears heard noise; later he recognized a long history of fear in those [[staccato:staccato]] sounds." },
      { title: "A change in perspective", cue: "What did the narrator think he had outgrown?", passage: "At university the narrator replaced his old roommate with students who seemed more [[congenial:congenial]]. While preparing for [[preliminary:preliminary]] exams, he wanted serious work; his grandfather [[mockingly:mockingly]] copied the way he marked a newspaper. Their habits were different [[ideologically:ideologically]] as well as by age. Only later did the narrator see the [[irony:irony]] in his own sense of superiority." },
      { title: "Help without a speech", cue: "How did the grandfather help in the crisis?", passage: "When the narrator's wife was [[stricken:stricken]] with a [[neurologic:neurologic]] illness, his life fell apart. The old man offered little sympathy, but he cared for the children and [[mow:mowed]] the [[lawn:lawn]]. After a long period of [[melancholy:melancholy]], the narrator began to join him in the ordinary work of living. The person he had expected to support had quietly supported him." },
    ],
  },
  "04": {
    title: "The passenger and the prejudice", sourceTitle: "Never Trust Appearances",
    stages: [
      { title: "A stranger on the train", cue: "What does Matti notice first?", passage: "During [[rush hour:rush hour]], Matti boards a train from a [[provincial:provincial]] town. With no reserved [[compartment:compartments]], he sits opposite a stranger. Matti studies the man's dark hair, serious expression and [[moustache:moustache]], then treats these details as evidence about his character. His quick [[frown:frown]] at the stranger reveals more about Matti than about the man." },
      { title: "A story invented from objects", cue: "How does appearance become a false biography?", passage: "The stranger's clothes are [[anything but:anything but]] fashionable, and his old [[briefcase:briefcase]] is so [[bulge:bulging]] that its [[zip:zip]] barely closes. Matti imagines a poorly paid clerk with a large family. Yet each supposed clue has another possible explanation. He sees the [[initials:initials]] on the case, yet cannot know what they stand for." },
      { title: "The reversal", cue: "Which facts overturn Matti's theory?", passage: "At the station a uniformed [[chauffeur:chauffeur]] opens a [[magnificent:magnificent]] Rolls-Royce for the stranger. The man is Sir James Saxon, a wealthy [[bachelor:bachelor]] who lives in a luxury flat. He even prefers ordinary train travel to his private aircraft. Matti's neat account of a miserable worker now looks [[crooked:crooked]]: the facts never supported it. His [[overactive:overactive]] imagination had concealed his ignorance." },
      { title: "The final joke", cue: "What else had Matti assumed too quickly?", passage: "Sir James is the son of [[Finn:Finns]], though he has an English name. He is a [[naturalise:naturalised]] Briton, and Matti had guessed neither his origin nor his wealth. Geoffrey pauses to [[unlock:unlock]] the car, then invites Matti to help paint the [[tool shed:tool shed]]. Even a person's [[complexion:complexion]] tells little about their background. Matti remembers what his teachers said about his imagination; he has mistaken a story for a fact." },
    ],
  },
  "05": {
    title: "A request in the rain", sourceTitle: "Courage",
    stages: [
      { title: "An unexpected visit", cue: "Why is Akira's arrival unsettling?", passage: "Akira comes without a [[go-between:go-between]], ignoring the usual path toward marriage. Rain [[pound:pounds]] outside while Chie stays by a warm [[brazier:brazier]]. Even the [[maid:maid]] knows that this late caller is unusual. Chie is not immediately [[receptive:receptive]], but she agrees to hear him." },
      { title: "A careful first impression", cue: "What makes Chie listen?", passage: "Akira's [[dental:dental]] college card explains who he is, though not why he has arrived. His voice is [[refined:refined]] and his manners [[deferential:deferential]]. After a quick [[peek:peek]] at Chie's face, he speaks plainly rather than hiding behind ceremony. She notices a sudden [[intake:intake]] of breath from Naomi, which suggests the visitor's name already means something to her daughter." },
      { title: "The proposal", cue: "How does Akira explain his choice?", passage: "Akira asks Chie not to reject his [[candidacy:candidacy]] because of the [[unseemliness:unseemliness]] of his visit. The decision, he says, will [[come down to sth.:come down to]] [[parental:parental]] approval whether he uses a formal intermediary or speaks himself. If Chie gives her [[consent:consent]], he will join Naomi's family; otherwise, he plans to find a home for them in America. His directness carries both risk and respect." },
      { title: "Naomi's answer", cue: "Whose choice closes the scene?", passage: "Akira sees he has [[startle:startled]] Chie; [[abruptly:abruptly]], his voice softens and he apologizes. Chie expects Naomi to laugh at the apparently [[preposterous:preposterous]] idea of marrying so soon. Instead, the young [[heir:heir]] looks her mother in the eye. Her quiet declaration makes the story's courage shared: she, too, is ready to choose. Chie's earlier [[maternal:maternal]] assumptions about a child must now make room for an adult." },
    ],
  },
  "06": {
    title: "How Franklin learned to write", sourceTitle: "Reading",
    stages: [
      { title: "An appetite for books", cue: "What made reading possible for the young Franklin?", passage: "As a child Franklin [[lay out sth.:laid out]] his spare money on books. His [[bookish:bookish]] [[inclination:inclination]] mattered more than the size of his collection. Apprenticed to a printer, he could borrow volumes and [[sit up:sat up]] reading at night, returning them early [[lest:lest]] their owners miss them. Access came from effort as well as opportunity." },
      { title: "Learning a trade", cue: "What did apprenticeship offer and constrain?", passage: "His father arranged an [[indenture:indenture]] with his brother, so Franklin became an [[apprentice:apprentice]] in the printing trade. He learned practical [[proficiency:proficiency]] while reading whatever came into the shop. Later he wrote a [[ballad:ballad]] about a recent disaster and discovered that public excitement could sell poor verse. His father warned him against becoming a [[wretched:wretched]] poet." },
      { title: "A flaw in debate", cue: "Why did he change the way he argued?", passage: "Religious [[dispute:disputes]] had made Franklin eager to [[confute:confute]] other people's claims. That habit turned him [[disputatious:disputatious]] and often [[disagreeable:disagreeable]] in conversation. A friend observed that fluent words could overpower a weaker speaker without proving the stronger case. Franklin began to value clarity and [[propriety:propriety]] over the pleasure of winning." },
      { title: "A method for prose", cue: "How did imitation become independent practice?", passage: "He studied good [[prose:prose]], made notes from an essay, and later tried to [[recollect:recollect]] its argument without the original. He sometimes [[jumble:jumbled]] the notes before putting them back in order, then compared his version with the model and [[amend:amended]] its faults. This repeated [[endeavor:endeavor]] taught him to build a clear sequence of ideas rather than merely copy phrases." },
    ],
  },
  "07": {
    title: "The price of living together", sourceTitle: "What We Gain or Lose in Cities",
    stages: [
      { title: "A new human setting", cue: "What changed when people gathered in cities?", passage: "For most of human [[evolution:evolution]], people lived in small groups at low population [[density:density]]. Now a large [[fraction:fraction]] of humanity lives in cities with millions of [[inhabitant:inhabitants]]. That concentration brings services and opportunity, but every gain involves a [[trade-off:trade-off]]. The question is which losses a community will accept." },
      { title: "Freedom and shared rules", cue: "Why do dense places regulate private behaviour?", passage: "Singapore is [[wedge:wedged]] between powerful neighbours and must protect scarce resources. Household [[sensor:sensors]] can [[transmit:transmit]] information about water use, even each toilet [[flush:flush]]. Many Americans would [[bristle:bristle]] at such close oversight. Yet leaving everyone completely free can shift pollution and other costs onto neighbours." },
      { title: "Different histories", cue: "Why are urban rules not universal?", passage: "In Germany, a densely settled place may allow fewer activities than a U.S. suburb considers [[permissible:permissible]]. In a looser system, [[excavate:excavated]] soil and [[spray:sprayed]] [[pesticide:pesticides]] may drift onto another property. These arrangements grew from different histories over many [[millennium:millennia]]. A rule that seems natural in one country may look like an intrusion in another." },
      { title: "Belonging and escape", cue: "What does anonymity give as well as take?", passage: "Village life offers [[communal:communal]] ties, but neighbours may watch every choice. The lonely city [[dweller:dweller]] can [[romanticize:romanticize]] that closeness while forgetting its pressure. Urban [[anonymity:anonymity]] can give someone space to read alone, even as it weakens lifelong bonds. The author's final question asks what [[compromise:compromise]] each reader would make for safety, freedom and privacy." },
    ],
  },
  "08": {
    title: "Food, power and context", sourceTitle: "The Guide to Being a Foodie Without Being Culturally Appropriative",
    stages: [
      { title: "The uneasy trend", cue: "Why does a fashionable dish cause frustration?", passage: "The writer enjoys food but distrusts the way some media turn an unfamiliar meal into a [[spectacle:spectacle]]. A dish once mocked as [[stinky:stinky]] may suddenly be sold as [[hip:hip]] when a fashionable restaurant serves it. Calling ingredients [[exotic:exotic]] can make ordinary family food seem strange. The writer's [[suspicion:suspicion]] comes from that change in who gets praise and profit." },
      { title: "Enjoyment and power", cue: "When does appreciation become appropriation?", passage: "Eating another culture's food is not itself [[appropriative:appropriative]]. The problem grows when powerful outsiders [[fetishize:fetishize]] a cuisine while the people who made it face [[oppress:oppression]]. If a country is [[reduce sth. to sth.:reduced]] to a few menu items, its history disappears. The term [[ethnic:ethnic]] can also be applied selectively, making some cuisines seem normal and others permanently foreign." },
      { title: "The authenticity trap", cue: "Why is 'authentic' not a simple test?", passage: "A search for an [[immersive:immersive]] meal may begin with [[preconceived:preconceived]] ideas of what a culture should look like. Such ideas can [[stem from sth.:stem from]] stories shaped by [[colonization:colonization]] rather than by the cooks themselves. Spam in parts of Asia and the Pacific, for instance, has a history; dismissing it as inauthentic misses that history. Food changes through migration, so a single fixed [[narrative:narrative]] is rarely enough." },
      { title: "A better question", cue: "Who benefits when a local dish becomes a luxury?", passage: "Some businesses [[repurpose:repurpose]] inexpensive community food for wealthy diners. When a staple is repackaged, the original community may be priced out by [[gentrification:gentrification]]. It matters who can still afford the [[ingredient:ingredients]] and who receives the profit. The writer asks readers to examine their own [[perception:perceptions]] and the power behind what they consume. Respect means seeing the people and conditions attached to a dish, not just its [[authentic:authentic]] flavour." },
    ],
  },
  "09": {
    title: "The freedom to be a visitor", sourceTitle: "Stop Telling Me to Travel like a Local, Okay?",
    stages: [
      { title: "The travel slogan", cue: "What does 'like a local' promise?", passage: "Travel advice often offers the inside [[scoop:scoop]] in a [[condensed:condensed]] guide. It tells visitors to avoid tourist traps and behave like residents. The author finds that [[directive:directive]] [[paradoxical:paradoxical]]: a brief holiday cannot reproduce an ordinary life. The slogan becomes a [[farce:farce]] if taken literally." },
      { title: "Ordinary local life", cue: "What do residents actually spend time doing?", passage: "Locals are at work, doing [[laundry:laundry]] and other [[chore:chores]]. They are not forever [[stroll:strolling]] through their own museums or eating long tasting menus. Much of their week is [[humdrum:humdrum]], as life is everywhere. A traveller's pleasure comes partly from escaping that routine, including its [[inane:inane]] little errands." },
      { title: "Useful outsiderhood", cue: "What can a visitor learn by admitting ignorance?", passage: "A visitor may [[gawk:gawk]] at unfamiliar streets and still be curious rather than rude. On a market tour, an expert can explain details the tourist cannot [[intuit:intuit]] alone. The writer's own [[ineptitude:ineptitude]] has sometimes invited generous [[hospitality:hospitality]] from locals. A good encounter begins with questions, not a performance of belonging. Being openly [[naive:naive]] can be a useful starting point." },
      { title: "Tourism at home", cue: "How does the argument return to everyday life?", passage: "Without worrying about fitting in, travellers can [[embrace:embrace]] museums, tours and muddy walks with [[gratitude:gratitude]]. The author suggests treating familiar places with the same attention: a local museum may be more rewarding than another evening spent [[cruise:cruising]] through social media. Curiosity need not end when a [[sojourn:sojourn]] ends. The real danger is [[apathy:apathy]], not looking like a tourist." },
    ],
  },
  "10": {
    title: "The river read twice", sourceTitle: "Two Ways of Seeing a River",
    stages: [
      { title: "A language on the water", cue: "What can the trained pilot read?", passage: "To a pilot, the river becomes a book that rewards careful [[perusal:perusal]]. No stretch is [[void of something:void of]] meaning. A [[faint:faint]] [[dimple:dimple]] on the surface can be an [[italicize:italicized]] warning rather than a pretty mark. The passenger sees a picture; the pilot reads instructions that may save a boat." },
      { title: "The earlier vision", cue: "How did the river look before training?", passage: "At first, a [[majestic:majestic]] [[expanse:expanse]] at sunset held Twain spellbound. A floating [[log:log]] looked like a dark accent in the light, and the colours seemed to [[bewitch:bewitch]] him. He could admire the scene's [[splendor:splendor]] because he had not yet learned what each feature signalled. Beauty required no professional decoding." },
      { title: "A new reading", cue: "What does the same scene mean to a pilot?", passage: "After training, the floating log becomes a sign of changing water. A [[conspicuous:conspicuous]] streak may point to a [[reef:reef]], while a pale [[shoal:shoal]] can threaten the boat. The pilot uses these details to [[compass:compass]] a safe course. The sunset still colours the river, but its practical messages now take priority over its [[romance:romance]]." },
      { title: "What expertise costs", cue: "Why does Twain compare pilots with doctors?", passage: "The [[acquisition:acquisition]] of skill has given the pilot knowledge and taken away wonder. A doctor likewise notices a patient's [[ruddy:ruddy]] cheek as a possible sign of hidden [[decay:decay]]. Professional attention can turn visible charm into evidence of an [[unwholesome:unwholesome]] condition. Twain does not reject expertise; he asks whether its price is the loss of a certain [[glory:glory]]." },
    ],
  },
};

const marker = /\[\[([^:\]]+):([^\]]+)\]\]/g;
export const articleClozeExercises: Record<string, ClozeExercise> = Object.fromEntries(
  Object.entries(draft).map(([articleId, item]) => {
    const gaps: ClozeGap[] = [];
    const stages: ClozeStage[] = item.stages.map(({ title, cue, passage }) => {
      const parts: string[] = [];
      let cursor = 0;
      for (const match of passage.matchAll(marker)) {
        parts.push(passage.slice(cursor, match.index));
        gaps.push({ root: match[1], answer: match[2] });
        cursor = match.index + match[0].length;
      }
      parts.push(passage.slice(cursor));
      return { title, cue, parts };
    });
    return [articleId, { title: item.title, sourceTitle: item.sourceTitle, gaps, stages }];
  }),
);
