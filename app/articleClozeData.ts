export type ClozeGap = { root: string; answer: string };
export type ClozeStage = { title: string; cue: string; parts: string[] };
export type ClozeExercise = { title: string; sourceTitle: string; gaps: ClozeGap[]; stages: ClozeStage[] };

type Draft = { title: string; sourceTitle: string; stages: { title: string; cue: string; passage: string }[] };

// Each stage tests five distinct entries from the article's highlighted vocabulary.
// The first part of a marker is the bank entry. The second part fits the sentence.
const draft: Record<string, Draft> = {
  "02": {
    title: "A tax on tools, or on change?", sourceTitle: "Should the Robots Be Taxed?",
    stages: [
      {
        title: "The proposal",
        cue: "Why do people want to tax robot owners?",
        passage: "Within days, Bill Gates's video proposing a robot tax had [[go viral:gone viral]], reaching a huge audience through social media. The tax proposal has steadily [[gain ground:gained ground]] in public debate, winning wider support. One policy [[recommend:recommendation]] in a draft report was to make robot owners pay taxes or contribute to social security if robots replaced many workers. Another proposal was to make a basic payment [[universal income:universally]] available, so everyone would qualify regardless of employment status. The concern was that fully [[automation:automated]] production lines could run on their own, doing work previously done by people.",
      },
      {
        title: "From cottages to factories",
        cue: "What does the history of textile work help the author explain?",
        passage: "From stone implements to electricity, new tools have [[transformation:transformed]] whole societies into fundamentally different ones. Before the textile factories, [[weaver:weaving]] at home let artisans set their own pace on handlooms. Inside the factories, workers used several [[machinery:machines]] owned by the firm, and this equipment set their pace. The work was [[division of labor:divided]] among employees, with each person doing a narrower range of tasks. Some older skills lost their [[stay relevant:relevance]] as employers stopped needing them. The next generation learned new ones.",
      },
      {
        title: "Jobs, families and income",
        cue: "Who has time to adjust, and who shares the gains?",
        passage: "The author suggests that some factory workers' children might become knowledge workers. In earlier transitions, job creation often [[lag:lagged]] behind job losses, so some workers had to wait or were left behind. The author also points to several unintended [[side effect:side effects]] of industrial change, including shifts in family size and marriage rates. He points to [[plummet:plummeting]] birth rates, with the number of births falling sharply. He speculates that scarce resources might encourage more [[conserve:conservation]], or careful use of what's available. Meanwhile, developed countries saw more of the growth in income per person, [[skew:skewing]] the gains in their favour.",
      },
      {
        title: "Tax, speed and the transition",
        cue: "How does the author answer the objections?",
        passage: "Gates argues that robots earn no taxable wages. The author replies that higher profits can mean more company tax. He points out that some consumers once [[boycott:boycotted]] machine-made fabric and automobiles, refusing to buy them. On some routes, passenger travel changed [[dramatic:dramatically]] when flying replaced sea crossings. A journey that once took days now took hours. Faster reporting has [[amplify:amplified]] the impact of such changes, making their effects seem even greater. Finding a new equilibrium after a [[disrupt:disruption]] to the way people earn a living takes time. The author asks readers to [[empathy:empathize]] with people who are left behind by imagining what the change feels like to them.",
      },
    ],
  },
  "03": {
    title: "What a roommate can teach", sourceTitle: "Roommates",
    stages: [
      {
        title: "The grandson's first view",
        cue: "What seemed ordinary to the boy?",
        passage: "The narrator looks back on [[come late to:coming late to]] an understanding of his place in the cycle of life. It took him well into adulthood to get there. For years, his close [[in relation to:relationship]] with his grandfather shaped how he saw himself. In his grandfather's company, he still felt like a boy. Long after his old friends died, the grandfather kept [[insist on:insisting on]] cutting the grass himself, declining any help. The boy had never thought his grandfather's strength remarkable. He remembers [[take for granted:taking it for granted]] because he had come to expect it as a matter of course. His grandfather loved an argument and followed distant conflicts by [[turn up:turning up]] the volume on the television.",
      },
      {
        title: "The voices of the night",
        cue: "What changed in the narrator's understanding of his grandfather's dreams?",
        passage: "Once he could read, the boy [[voluntarily:volunteered]] to teach his grandfather about things like electricity. At night, the boy heard sudden [[explode:explosions]] of anger. Still asleep, his grandfather would go from a murmur to a shout. The grandson looks back at what he had [[make of:made of]] those angry cries as a boy, when he was too young to understand them. The feelings behind them [[stretch back:stretched back]] some seventy years into his grandfather's past. When [[recall:recalling]] those sounds years later, he hears them again in his mind as the music of his childhood.",
      },
      {
        title: "Roommates again",
        cue: "Why did the two end up together as adults?",
        passage: "After [[inhabit:inhabiting]] the same community for more than half a century, the grandfather was a stranger there again. His old friends had died. He joined his grandson at university, where he could enjoy his grandson's [[companion:companionship]] despite a sixty-year age gap. When the narrator marked his books on the couch, the grandfather marked a newspaper in [[imitate:imitation]] of him. He was never [[convince:convinced]] that lying on a couch reading counted as work. When the narrator moved to Texas, his grandfather [[reluctant:reluctantly]] joined him there after hesitating over another move.",
      },
      {
        title: "The roles reverse",
        cue: "What does the grandfather do when the family needs help?",
        passage: "After [[established:establishing]] himself in his career, the narrator expected to look after his grandfather. [[irony:Ironically]], he was the one who ended up needing help. By the time family life began to revolve around the hospital, his wife had already [[be stricken with:been stricken with]] a serious disease. He became so [[depression:depressed]] that he stopped seeing friends, lost interest in work and could barely get off the couch. His grandfather helped with the children and kept [[mow:mowing]] the lawn. The narrator eventually joined him in the work of daily life.",
      },
    ],
  },
  "04": {
    title: "The passenger and the prejudice", sourceTitle: "Never Trust Appearances",
    stages: [
      {
        title: "A stranger on the train",
        cue: "What does Matti observe before he starts making guesses?",
        passage: "At rush hour, people [[move about:moved about]] on the busy streets of the provincial town, hurrying from one place to another. The trains grew crowded as passengers kept [[pack:packing]] into the carriages. On board, many men [[bury one's face in:buried their faces in]] their newspapers, hidden from view behind the pages. Saxon paid little attention to others because of his [[absorbed:absorption]] in the sports news. Taking a later train helped him get his usual corner seat. Matti studied him and made guesses about how an Englishman [[typical:typically]] dressed, imagining what most English men wore.",
      },
      {
        title: "From clues to guesses",
        cue: "Which details does Matti use to invent the stranger's story?",
        passage: "Matti expected an Englishman to have a moustache, but this man had [[shave:shaved]] so closely that there was no trace of facial hair. The man listened to others and said little. Matti mistook that quiet [[reserved:reserve]] for a national trait. He had expected hair much [[fair:fairer]] than the dark curls he saw. When the stranger [[frown:frowned]], drawing his eyebrows together, Matti assumed he looked worried. The sharp creases in the trousers showed that they had been [[press:pressed]] with an iron.",
      },
      {
        title: "A car at the station",
        cue: "What finally makes Matti question his assumptions?",
        passage: "So much had been crammed into Saxon's briefcase that its sides had [[bulge:bulged]] out and the fastener would not close. The letters J. S. on the case were the owner's [[initial:initials]], the first letters of his two names. Matti guessed that his name was John Smith. At the station, Matti found his ticket. After he had [[give sth up:given it up]] to the ticket collector, he looked for Geoffrey's car. Beside a Rolls-Royce stood a man in a driver's [[uniformed:uniform]], dressed for his job. The stranger from the train was being [[chauffeur:chauffeured]] away, with a driver at the wheel.",
      },
      {
        title: "What Geoffrey knows",
        cue: "Which facts overturn Matti's guesses about wealth, marriage and nationality?",
        passage: "Matti had imagined that Saxon's wife and children lived in [[miserable:misery]]. Matti was surprised by Saxon's [[bachelor:bachelorhood]], the fact that he had never married. Saxon lived in a luxury flat on one of the building's upper [[storey:storeys]]. Saxon was of [[Finn:Finnish]] descent, with both parents from Finland. His original name was Jussi Saksalainen. He gained British citizenship through [[naturalise:naturalisation]], the legal process that made him a British subject.",
      },
    ],
  },
  "05": {
    title: "A request in the rain", sourceTitle: "Courage",
    stages: [
      {
        title: "Breaking with custom",
        cue: "Why is Akira's visit so unusual?",
        passage: "Akira bypassed the usual [[form:formalities]] that families observed when a marriage was proposed. Without anyone to speak on his behalf, he [[approach:approached]] Chie himself at her home. In such matters, [[go-between:go-betweens]] were normally asked to carry messages between the two sides. Even before deciding whether to grant permission, Chie had to be open to hearing Akira out. The opening question asks how a matchmaker might have affected her [[receptive:receptivity]] to his request. Before Chie met him, the maid brought her one of his [[calling card:calling cards]], with his name and address on it.",
      },
      {
        title: "An unexpected opportunity",
        cue: "Why does he speak now, and how does Chie hear him?",
        passage: "Akira apologized for [[disruption:disrupting]] Chie's quiet evening. He said his business was too [[urgency:urgent]] to wait another day. He addressed her [[deferential:deferentially]], speaking with the respect expected of a guest asking an elder for a favour. He had come after [[receive word:receiving word]] of a position as a dentist in Seattle. Chie was initially [[amusement:amused]] by his solemn manner. She smiled as a mother might at a child who was taking himself too seriously.",
      },
      {
        title: "The marriage proposal",
        cue: "What decision is Akira asking Chie to make?",
        passage: "Akira finally revealed that he was [[ask for sb's hand:asking for Naomi's hand]] in marriage. He worried that asking directly might be considered [[unseemliness:unseemly]] conduct for a suitor. It broke the rules of proper etiquette even though he spoke politely. Whether he spoke himself or sent a messenger, the decision [[come down to:came down to]] whether Chie would give her approval. He said he would join Naomi's family as a yoshi once Chie had [[consent:consented]] to the marriage. She was the one who could give him permission. Otherwise, he spoke of going to America and [[secure:securing]] a new home for his bride.",
      },
      {
        title: "Naomi speaks",
        cue: "What does Naomi's answer show about her own intentions?",
        passage: "By then Akira felt he had [[make one's point:made his point]] about why the choice of messenger did not matter. His change of tone was [[abruptly:abrupt]]. His voice softened in an instant as he apologized. Chie knew that Naomi stood to [[heir:inherit]] the Fuji household as the family's successor. The idea of taking her away at a moment's notice struck Chie as [[preposterous:preposterously]] unrealistic. It sounded absurd enough that she expected Naomi to laugh. After a long silence, Naomi told her mother what she planned to do. She [[mean to do:meant to]] make Akira her husband.",
      },
    ],
  },
  "06": {
    title: "How Franklin learned to write", sourceTitle: "Reading",
    stages: [
      {
        title: "Books and the printing trade",
        cue: "How did work in the printing shop give Franklin more to read?",
        passage: "Buying books was Franklin's main [[lay out sth.:outlay]] as a boy, taking nearly all the money he had. He was [[inclination:inclined]] to spend any spare time reading. At twelve he began an [[apprentice:apprenticeship]] with his brother, training to become a printer. He soon became [[proficiency:proficient]] in printing, mastering the work well enough to be useful to his brother. Through the people he met in the book trade, volumes he could not previously borrow became [[have access to:accessible]] to him.",
      },
      {
        title: "From verse to argument",
        cue: "What did Franklin learn about the limits of verbal skill?",
        passage: "Young Franklin had [[take a fancy to:taken a fancy to]] poetry, and this new interest led him to write ballads. He printed the ballads and sold them around town. His father [[ridicule:ridiculed]] his ambitions as a poet, making jokes at his expense. Franklin later credited prose writing with [[advancement:advancing]] his career. In debates with John Collins, each wanted to show the other was wrong. Each hoped he had conclusively [[confute:confuted]] the other's argument by pointing to evidence that ruled it out. Looking back, Franklin saw that people who constantly contradicted others could behave [[disagreeable:disagreeably]] in company and make conversation unpleasant.",
      },
      {
        title: "Feedback on his letters",
        cue: "How did his father distinguish fine speaking from clear writing?",
        passage: "Collins's [[eloquent:eloquence]], his ability to speak fluently and persuasively, often gave him the upper hand. They remained [[antagonist:antagonists]] when they exchanged letters, each taking the opposite side. When his father found their letters, he [[remark:remarked]] on Franklin's good spelling and punctuation. Even so, he said Franklin had [[fall short in:fallen short in]] elegance and organization. His reasoning also needed to be more [[perspicuity:perspicuous]], so readers could follow each step on the first reading.",
      },
      {
        title: "Learning by reconstruction",
        cue: "How did Franklin use The Spectator to build his own writing skills?",
        passage: "After making brief notes from The Spectator, Franklin tried to rewrite the essays from his own [[recollect:recollection]] of the ideas, without reopening the book. Turning prose into verse made him find [[rhyme:rhyming]] words with the same ending sounds. He practised organizing his ideas by deliberately [[jumble:jumbling]] the notes into a confused order and then sorting them out. Comparing his work with the original, he made [[amend:amendments]] to correct faults. He hoped that with practice he might learn to write [[tolerable:tolerably]] well, even if he never became an outstanding writer.",
      },
    ],
  },
  "07": {
    title: "The price of living together", sourceTitle: "What We Gain or Lose in Cities",
    stages: [
      {
        title: "From small groups to cities",
        cue: "Why are the benefits of urban life tied to its costs?",
        passage: "For much of human history, people lived in small bands. The wide [[scatter:scattering]] of these groups across the landscape meant that few people lived close together. Towns and cities today are [[density:densely]] populated, with many people living close together. Some of the largest cities are now [[inhabitant:inhabited]] by tens of millions of people who make their permanent homes there. Living close together can be [[benefit:beneficial]] to residents, especially when it gives them easier access to schools and clinics. Residents sometimes find themselves [[trade-off:trading off]] personal freedom against gains in safety. An increase in one comes at a cost to the other.",
      },
      {
        title: "Freedom and shared rules",
        cue: "Why do residents accept rules that people elsewhere might resist?",
        passage: "In Singapore, close [[monitor:monitoring]] allows the government to check what residents do over time. Sensors can track how much water each household [[consumption:consumes]]. The bargain is that tighter oversight comes with better health and security. Rules in some German cities [[restriction:restrict]] homeowners to certain types of roof tile and limit which trees they may cut down. The author imagines Americans [[bristle:bristling]] at such rules, taking offence at the limits. In Los Angeles, homeowners are [[permissible:permitted]] to build in almost any style, since the rules give them more freedom.",
      },
      {
        title: "History and social ties",
        cue: "How do older ways of living shape present choices?",
        passage: "Earlier ways of living have left cultural [[legacy:legacies]], patterns passed down through generations that still shape each region. Traditional Chinese farmers worked [[communal:communally]], sharing the work across households. In the United States, frontier households far from their neighbours often achieved [[self-sufficient:self-sufficiency]], providing what they needed for themselves. Traditionally, many New Guinea villagers [[live out one's life:lived out their lives]] in the places where they were born, surrounded by old friends. Those who moved to cities often felt [[isolation:isolated]] among strangers, with no family or old friends nearby to talk to.",
      },
      {
        title: "Belonging and privacy",
        cue: "What does the author ask city dwellers to weigh?",
        passage: "The author warns against [[romanticize:romanticizing]] village life by remembering its warmth and leaving its pressures out of the picture. With others watching every choice, villagers can feel socially [[suffocating:suffocated]], with no room to breathe. One woman appreciated being [[anonymity:anonymous]] in a busy city café. She could read the paper without anyone knowing who she was. Pockets and opaque bags let people keep their purchases [[conceal:concealed]] from neighbours so they would not become the subject of gossip. Would the promise of greater safety justify [[compromise:compromising]] on privacy?",
      },
    ],
  },
  "08": {
    title: "Food, power and context", sourceTitle: "The Guide to Being a Foodie Without Being Culturally Appropriative",
    stages: [
      {
        title: "Family food in the spotlight",
        cue: "What happens when familiar family food becomes a trend?",
        passage: "People who take a keen interest in food often call themselves [[foodie:foodies]]. The author shares their interest, but questions the [[exotic:exoticism]] of presenting an everyday ingredient as fascinating simply because it comes from somewhere the audience considers foreign. By [[make a spectacle out of:making a spectacle out of]] a familiar family dish for a television audience, a cooking show turns an ordinary meal into a public display. Some chefs have [[fusion:fused]] techniques and ingredients from different Asian cuisines to create hybrid dishes. The author asks what happens when dishes are culturally [[appropriation:appropriated]] by more powerful groups that claim the food as their own.",
      },
      {
        title: "Power and representation",
        cue: "When does enjoying a dish become an exercise of power?",
        passage: "A powerful group may enjoy another community's food without experiencing the [[oppress:oppression]] faced by the people who make it. It can end up [[fetishize:fetishizing]] a single dish, so fixated on it that it overlooks the rest of the cuisine. A company might then oversee the [[commercialize:commercialization]] of the dish, turning it into a product to market and sell for profit. A menu can erase a country's differences by [[reduce sth. to sth.:reducing]] its culture to a single dish. When writers lump distinct communities together under one label, they make the region's food look [[homogenize:homogeneous]], as though every community cooked in the same way.",
      },
      {
        title: "In search of the real thing",
        cue: "Why is it misleading to look for one pure version of a cuisine?",
        passage: "A diner asks whether the dish was cooked [[authenticity:authentically]], in a way that counts as genuine in the community where it originated. A meal [[perception:perceived]] as genuine by a visitor may be understood differently by a local cook. A visitor's picture of the cuisine often [[stem from sth.:stems from]] stories heard long before the trip. Such diners arrive with [[preconceived:preconceptions]], judgments already made about the food before they have even seen or tasted it. Some supposedly traditional tastes have [[colonization:colonial]] roots, shaped by periods of outside rule. One example is the spread of Spam in parts of Asia and the Pacific.",
      },
      {
        title: "Who still has access?",
        cue: "What can happen when a community's food becomes a luxury product?",
        passage: "The author asks who gets the money when an outside business [[profit off:profits off]] a community's recipes. With each sale, the business can keep the proceeds even though the cooking traditions came from elsewhere. Foods that were once household [[staple:staples]], eaten day after day, can end up on luxury menus. As prices rise, the food becomes increasingly [[be inaccessible to:inaccessible]] to local families who can no longer afford it. A market becomes [[gentrification:gentrified]] when it starts serving wealthier shoppers and poor residents are priced out. Without affordable ingredients, [[sustain:sustaining]] a cooking tradition over time becomes harder.",
      },
    ],
  },
  "09": {
    title: "The freedom to be a visitor", sourceTitle: "Stop Telling Me to Travel like a Local, Okay?",
    stages: [
      {
        title: "The travel slogan",
        cue: "What does “travel like a local” promise?",
        passage: "The author sees visitors like herself as cultural [[interloper:interlopers]], outsiders passing through a place. The very same advice [[recur:recurs]] in one travel guide after another. Readers are [[directive:directed]] to behave like the people who live there. The advice contains a [[paradoxical myth:paradox]]. It asks visitors to go somewhere new, then to behave as if they have lived there all along. Treating the slogan as literal advice makes it look [[farce:farcical]], so absurd that it is laughable.",
      },
      {
        title: "Ordinary local life",
        cue: "How do residents spend their days?",
        passage: "Residents fold laundry and do other household [[chore:chores]] that take up their time. On crowded trains they are [[commute:commuters]] travelling from home to work. They hurry past buildings that visitors have [[gawk at:gawked at]], staring openly in awe. Locals may save their expensive meals for short [[sojourn:sojourns]] away from home, when they stay in one place for a few days as visitors. A tourist who [[stroll on:strolls on]] the waterfront can walk at a leisurely pace. Locals may be hurrying along the same path to run errands.",
      },
      {
        title: "What visitors can learn",
        cue: "Why can asking for help improve a trip?",
        passage: "The author admits to being [[ignorance:ignorant]] of many customs in an unfamiliar place. An expert can explain practices that a visitor could not understand by [[intuit:intuition]] alone, however strong their first impressions are. Some of the author's best experiences have [[arise from:arisen from]] ordinary requests for help. The people who invited her into their home in Kyoto were [[hospitality:hospitable]] towards a stranger, welcoming her as their guest. She accepted their kindness [[gratitude:gratefully]], aware of how much they had done for her.",
      },
      {
        title: "Paying attention at home",
        cue: "How can the pleasures of tourism change life at home?",
        passage: "A different jacket will hardly make a visitor someone who [[fit in:fits in]] with local residents. Respecting what is [[custom:customary]] at a religious site is a separate matter, such as following the usual dress code. Back in her own town, the author recommends [[embrace:embracing]] the chance to explore a museum she has never visited. She could have [[cruise:cruised]] through social media posts on the couch instead. Assuming familiar sights will always be there can make residents [[apathy:apathetic]] about seeing them, so they lose interest in going.",
      },
    ],
  },
  "10": {
    title: "The river read twice", sourceTitle: "Two Ways of Seeing a River",
    stages: [
      {
        title: "Learning to read the water",
        cue: "What makes the river like a book for the pilot?",
        passage: "To passengers who cannot read the river, its marks are like texts in [[dead language:dead languages]] that no one speaks anymore. The pilot becomes [[absorbing:absorbed]] in reading the water, giving every mark his full attention. He has [[perusal:perused]] the water closely, reading its surface as though it were a page. A tiny hollow leaves part of the surface [[dimple:dimpled]], as if it had been gently pressed in. To the pilot, that mark is like a warning written in [[italicize:italics]], with slanted lettering that makes it stand out.",
      },
      {
        title: "The earlier vision",
        cue: "What did Twain notice before learning to pilot a boat?",
        passage: "After [[acquisition:acquiring]] the skills of a pilot, Twain found that he could no longer see the river as he had at first. He recalls the [[expanse:expansive]] view at sunset. Open water stretched across his whole field of vision. The setting sun [[tint:tinted]] the water nearest him a deep, even red. Farther off, the colour gave way to gold. A dark log floated [[conspicuous:conspicuously]], standing out clearly against the gold. The shifting light seemed to be [[bewitch:bewitching]] him, as if it had put him under a spell.",
      },
      {
        title: "The same scene read for danger",
        cue: "How does knowledge change the meaning of the details?",
        passage: "As a trained pilot, Twain recognizes that slanting marks may warn of [[reef:reefs]], rocky ridges near the water's surface. Boiling rings can signal a shifting sandbank and show that the river's [[channel:channels]], the routes a boat follows, may be changing. Lines in smooth water tell him where a stretch has [[shoal up:shoaled up]] and grown dangerously shallow. A thin silver line [[streak:streaked]] the dark water lengthwise beside the forest. To him, such a mark can betray one of the submerged [[snag:snags]], tree trunks or branches that can catch a steamboat.",
      },
      {
        title: "The cost of knowing",
        cue: "Why does the pilot compare himself with a doctor?",
        passage: "Once Twain had to look for hazards, he found it harder to go on [[romance:romanticizing]] the river as a place of pure beauty. Much of what had once charmed him now meant danger. A doctor's patient looks [[ruddy flush:flushed]] in the face. The doctor wonders whether the warmth and reddening are symptoms. Onlookers may dismiss such marks as [[trifling:trifles]], small details that seem unimportant. For the doctor, the face is like a field in which illness has [[sown thick with:sown]] signs the way a farmer scatters seeds. He may suspect that something inside the body is [[decay:decaying]], gradually breaking down out of sight. Twain asks what professionals lose when they learn to see this way.",
      },
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
