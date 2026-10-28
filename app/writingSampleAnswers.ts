export type WritingSampleAnswer = {
  introduction: string;
  anchors: readonly [string, string];
  body: readonly {
    point: string;
    explanation: string;
    example: string;
    link: string;
  }[];
  conclusion: string;
  readingConnection: string;
  sampleSource: { label: string; url: string };
};

// Original model responses. Each essay is arranged as introduction, two PEEL
// paragraphs, and conclusion. The sources document comparable public samples;
// their wording is not reproduced here.
export const writingSampleAnswers: readonly WritingSampleAnswer[] = [
  {
    introduction: "University students must choose how much time to spend beyond their major. Technical degrees need protected time for core competence: a qualification is worthless if practical skills are weak. Nevertheless, I favour a limited number of well-chosen electives, because they sharpen judgement and adaptability without displacing essential training.",
    anchors: ["Protect core mastery", "Build broader judgement"],
    body: [
      {
        point: "The case for exclusive focus is strongest in courses with extensive practical or professional requirements.",
        explanation: "Medical and engineering students must develop knowledge systematically; superficial familiarity with many subjects cannot substitute for safe clinical decisions or sound structural calculations. Extra modules can also increase costs and leave too little time for practice.",
        example: "A trainee surgeon who neglects anatomy to take several unrelated electives would be making a poor academic choice, however interesting those electives might be.",
        link: "This is why breadth should be limited by the genuine demands of the qualification, rather than treated as an equal claim on every student's timetable."
      },
      {
        point: "Even so, carefully chosen courses beyond a major can sharpen judgement and make graduates more adaptable.",
        explanation: "Different disciplines ask different questions and test evidence in different ways. Encountering those methods helps students recognise assumptions within their own field and apply specialist knowledge to problems that cross disciplinary boundaries.",
        example: "A student of economics who also studies history might question whether a policy that works in a model would be accepted by the communities it affects. Likewise, an engineer who takes a communication course may explain a design more clearly to the public.",
        link: "The wider perspective therefore supports, rather than weakens, serious study of the main subject when the electives are selected with care. Universities can protect this balance by making a small number of well-chosen electives available without reducing required teaching hours."
      }
    ],
    conclusion: "In short, a degree should retain a rigorous centre, especially where professional competence is at stake. Yet allowing room for relevant study beyond that centre produces graduates who can think across boundaries and respond to unfamiliar challenges.",
    readingConnection: "Steffens follows questions across history, literature and economics while learning to check competing sources. The essay draws on that link between depth and breadth.",
    sampleSource: { label: "How to do IELTS · university subjects sample", url: "https://howtodoielts.com/ielts-cambridge-18-university-students-and-main-subjects/" }
  },
  {
    introduction: "Robots are increasingly performing routine work at home and on the job. I see this as a positive development chiefly because they remove dangerous and repetitive tasks, freeing people for work that needs judgement. That benefit can last, however, only if employers and governments support workers displaced by automation. My view therefore rests on better work and a fair transition.",
    anchors: ["Remove hazardous work", "Share automation gains"],
    body: [
      {
        point: "Robots can improve daily life by taking over tasks that are dangerous, exhausting or needlessly repetitive.",
        explanation: "A machine can operate in unsafe conditions or perform the same physical movement consistently, while a person can concentrate on supervision, problem solving and human contact. In homes, automation can also give people with limited mobility more independence.",
        example: "For instance, a warehouse robot could move heavy goods while staff inspect deliveries and resolve mistakes; at home, a simple device could help an older resident clean without risking a fall.",
        link: "These gains are substantial because the technology changes the quality of work as well as its speed."
      },
      {
        point: "The principal danger is that workers may bear the costs of automation long before its benefits are shared.",
        explanation: "A displaced employee cannot necessarily move straight into a new role, especially when training requires time and money. If firms keep all productivity gains, automation may deepen inequality even as output rises.",
        example: "Suppose a factory replaces packing jobs with machines: a funded training programme and temporary income support would give employees a realistic route into maintenance or other local work.",
        link: "Policies that share the gains, including well-designed taxation and retraining, make technological progress socially sustainable. The goal should be new opportunities for affected workers, not simply more machines producing goods with fewer employees."
      }
    ],
    conclusion: "Overall, robots' capacity to protect people and release their time makes this a positive trend. The judgement remains conditional: employers and governments should ensure that those displaced are supported rather than expected to absorb the transition alone. Measuring success by human well-being as well as output would keep that responsibility visible.",
    readingConnection: "The unit reading asks who gains when robots raise productivity and whether taxation can help workers through the transition. The essay carries that trade-off into the answer.",
    sampleSource: { label: "How to do IELTS · robots sample", url: "https://howtodoielts.com/ielts-writing-task-2-sample-answer-essay-robots-home/" }
  },
  {
    introduction: "Residential nursing care can be too expensive for many older people and their relatives. The government should guarantee necessary care regardless of family income, since medical need must not become a lottery of access. Relatives should contribute companionship and advocacy, but should not be compelled to pay the full bill. These distinct responsibilities provide both security and personal connection.",
    anchors: ["Guarantee essential care", "Keep family ties"],
    body: [
      {
        point: "The state should provide a reliable minimum of residential care for those who need it.",
        explanation: "Nursing is a specialised service, and a sudden illness can create bills that even a prudent family could not reasonably have saved for. Older citizens have also contributed to society through work, taxation and unpaid care; they should not lose access to treatment because their children happen to earn less.",
        example: "If two residents have the same medical needs but one has wealthy adult children and the other has none, the quality of their basic nursing care should not depend on that accident of family circumstance.",
        link: "Public funding therefore protects equal access to an essential service while allowing fees for optional extras to be assessed separately."
      },
      {
        point: "Relatives nonetheless have an important role that cannot be measured only in money.",
        explanation: "They know an older person's preferences, can check whether a care home listens to them and can maintain relationships that professional staff cannot replace. Making relatives legally responsible for the full bill, however, risks hardship and may overlook estrangement or the older person's own wishes.",
        example: "A daughter who visits her father each week and helps him decide how to spend his time may support his independence more meaningfully than one who pays a fee but never asks what he wants.",
        link: "Family participation should therefore complement publicly guaranteed care, with voluntary financial help available where circumstances permit."
      }
    ],
    conclusion: "The government should carry primary responsibility for necessary residential nursing, financed collectively and assessed according to need. Families can offer companionship, advocacy and optional support, but an older person's security should never depend entirely on their relatives' finances.",
    readingConnection: "Roommates presents an older family member with agency and a relationship of mutual care. The essay preserves that sense of independence while addressing who pays for professional nursing.",
    sampleSource: { label: "Paramount IELTS · elderly care sample", url: "https://www.paramountielts.com/ielts-writing-task-2-who-should-pay-for-elderly-care/" }
  },
  {
    introduction: "First impressions are unavoidable, but treating them as final judgements of character is usually a mistake. Quick verdicts often mistake stereotypes for evidence, while genuine trust is better grounded in repeated conduct. A rapid assessment may be necessary for immediate safety, but it should remain provisional in ordinary relationships.",
    anchors: ["Resist stereotypes", "Trust repeated conduct"],
    body: [
      {
        point: "An instant assessment can reveal more about the observer's expectations than about the person observed.",
        explanation: "Dress, accent and manner may reflect culture, circumstances or simple nervousness rather than honesty or kindness. Although a rapid response can be sensible when there is an immediate safety concern, everyday social judgements rarely have that urgency.",
        example: "A quiet new colleague may be labelled unfriendly at an introduction, when in fact she is concentrating on understanding a second language and later proves exceptionally helpful.",
        link: "Allowing such an impression to harden into a fixed opinion risks unfair treatment from the start. It can also create a self-fulfilling pattern: the person who feels excluded may become more reserved, seeming to confirm an inaccurate initial assessment."
      },
      {
        point: "Reliable judgements of character need evidence gathered across different situations.",
        explanation: "A person's choices under pressure, willingness to keep promises and treatment of others reveal patterns that a short meeting cannot. Taking time to revise a judgement is also a sign of discernment, not naivety.",
        example: "Someone who speaks confidently at an interview may still fail to support a teammate, whereas an awkward applicant may consistently share credit and meet deadlines once employed.",
        link: "Repeated behaviour gives a much stronger basis for deciding whom to like or trust than an attractive or uncomfortable first encounter. This approach still permits caution; it simply asks us to separate what we have observed from what we have inferred."
      }
    ],
    conclusion: "First impressions are useful as tentative observations, particularly when personal safety is at stake. In ordinary relationships, however, it is better to keep them provisional and let subsequent conduct, rather than appearances, determine a person's reputation.",
    readingConnection: "Never Trust Appearances shows how a visitor constructs a stereotype from clothes and manner. The essay applies that warning to ordinary encounters while allowing for genuine safety concerns.",
    sampleSource: { label: "Simply IELTS · first impressions sample", url: "https://simplyielts.com/first-impressions-of-character-cambridge-ielts-18-writing-task-2/" }
  },
  {
    introduction: "Some people prefer friends who agree with them, whereas others welcome friends who challenge them. Shared values can make friendship emotionally secure, so the appeal of agreement is understandable. Yet I prefer friends who sometimes disagree: respectful challenge can improve decisions and strengthen trust. Its value lies in how differences are expressed, not in constant opposition.",
    anchors: ["Security through agreement", "Growth through disagreement"],
    body: [
      {
        point: "Friends who think alike can offer immediate understanding and emotional security.",
        explanation: "Shared values reduce the need to explain every decision and can make time together relaxing, particularly when someone is facing stress elsewhere. Disagreement over fundamental principles can also be exhausting if it repeatedly becomes a personal attack.",
        example: "Two friends who both value family time may understand why one declines an evening invitation to care for a relative, without demanding a lengthy defence.",
        link: "Thus, common ground is a useful foundation for trust, even though it need not extend to every opinion."
      },
      {
        point: "Friends who sometimes disagree can offer a more valuable form of support: a candid alternative perspective.",
        explanation: "A loyal friend need not endorse an unwise choice. When criticism is specific and delivered with care, it exposes blind spots while showing enough respect to take the other person's decisions seriously.",
        example: "If I planned to leave a secure job after one difficult week, a friend who asked about my savings and longer-term goals would help me more than one who simply praised the impulse.",
        link: "Constructive disagreement therefore combines loyalty with judgement and can deepen, rather than threaten, the relationship. The key is that the friend challenges an action or assumption without treating a difference of opinion as a reason to withdraw affection."
      }
    ],
    conclusion: "Friendships need a basis of mutual respect, and shared beliefs often supply it. Nevertheless, I would choose friends who can disagree thoughtfully: their honesty helps both people grow while preserving the trust that makes the disagreement possible. Such friendships also make room for personal change, because neither person must defend every view they have ever held.",
    readingConnection: "Courage depicts the difficulty and value of speaking honestly when convention favours silence. The essay translates that idea into the context of friendship.",
    sampleSource: { label: "Simply IELTS · friendship sample", url: "https://simplyielts.com/friends-with-the-same-opinions-cambridge-ielts-14-writing-task-2/" }
  },
  {
    introduction: "The prediction that nobody will buy printed books or newspapers because all reading will be free online is too absolute. I disagree on two grounds: free online access cannot finance every valuable publication, and print still serves purposes that screens do not replace. Digital reading will grow, but neither publishing costs nor readers' varied habits support the word 'nobody'.",
    anchors: ["Fund quality writing", "Preserve print choices"],
    body: [
      {
        point: "The assumption that everything worth reading will be online for free overlooks how publishing is funded.",
        explanation: "Investigative reporting, careful editing and specialist books require sustained labour. Advertising or subscriptions may pay for some of that work, but neither model makes every work universally free. Authors and publishers also have reasons to sell reliable editions directly.",
        example: "A student might read breaking headlines on an open website yet pay for a thoroughly edited textbook or a newspaper investigation available only to subscribers.",
        link: "As long as readers value dependable work, some will continue to pay for publications regardless of the device on which they read them."
      },
      {
        point: "Printed materials also offer an experience that many readers will continue to choose deliberately.",
        explanation: "A physical page can be annotated, shared, kept for years and read without a battery or notifications. These advantages may matter particularly in education, libraries and long-form leisure reading, even if digital formats remain more convenient for search and travel.",
        example: "A parent may buy a picture book to read with a child, while the same household uses a phone for the latest transport updates; the two habits answer different needs.",
        link: "A shift toward digital reading therefore predicts a smaller print market, not the disappearance of all print purchases. The claim that every reader will make the same choice ignores how differently people read for news, study and pleasure."
      }
    ],
    conclusion: "Online reading will continue to expand, and some printed newspapers may struggle. Still, the claim that no one will buy print and all desirable reading will be free ignores both the economics of quality writing and the enduring uses of a physical book.",
    readingConnection: "Franklin's account of seeking out books and learning through sustained reading informs the distinction between access to text and the value readers attach to particular editions.",
    sampleSource: { label: "How to do IELTS · print and online sample", url: "https://howtodoielts.com/ielts-writing-task-2-sample-answer-essay-ielts-cambridge-15-printed-newspapers-reading-online/" }
  },
  {
    introduction: "The movement from the countryside to cities is reshaping many countries. I regard it as broadly positive because cities can expand access to jobs and essential services. The outcome becomes positive in practice only when housing and transport keep pace and rural services remain viable. Opportunity and planning, rather than urban population growth alone, are therefore the two tests.",
    anchors: ["Expand urban opportunity", "Plan liveable growth"],
    body: [
      {
        point: "For many rural residents, a city offers opportunities unavailable in a small local economy.",
        explanation: "A dense labour market brings employers, training institutions and specialist services together. Young people can change careers without leaving their region entirely, while hospitals and colleges can serve larger populations.",
        example: "A graduate from a farming village might find an apprenticeship in a city hospital and later send income home or return with skills that support a regional clinic.",
        link: "Such mobility can improve household prospects and national productivity, provided rural residents remain free to choose where they live."
      },
      {
        point: "Urban growth becomes harmful when the population expands faster than public services.",
        explanation: "Crowded housing, long commutes and strained water systems can erase the benefits of higher wages. At the same time, a shrinking countryside may lose shops and schools, making life harder for those who stay.",
        example: "If a city adds new jobs but builds neither affordable flats nor reliable buses, workers may spend much of their extra income and time travelling from distant suburbs.",
        link: "Planning compact housing and transport, alongside maintaining essential rural services, is therefore part of making migration a genuine improvement. Governments can also connect smaller towns to urban employment through regional transport and digital infrastructure, reducing the pressure to move."
      }
    ],
    conclusion: "Rural-to-urban migration is broadly beneficial when people gain realistic access to work, education and care. Its success should be judged by whether cities remain liveable and rural areas remain viable, rather than by the number of new urban residents alone. A successful policy would also give those who remain in the countryside access to decent services and economic choices.",
    readingConnection: "Jared Diamond's reading treats city life as a set of trade-offs involving opportunity, services and social ties. The essay follows that balanced approach.",
    sampleSource: { label: "How to do IELTS · rural migration sample", url: "https://howtodoielts.com/ielts-cambridge-18-rural-people-moving-to-cities/" }
  },
  {
    introduction: "Supermarkets increasingly sell food produced around the world. On balance, I regard this as positive: global trade broadens consumer choice and can raise producer income. Yet those gains are worthwhile only if retailers pay fairly, source responsibly and recognise the communities behind what they sell. My judgement depends on who benefits and what the supply chain costs.",
    anchors: ["Widen food access", "Pay producers fairly"],
    body: [
      {
        point: "International sourcing can enrich diets and connect producers with customers far beyond their home region.",
        explanation: "Imported foods may make varied ingredients available throughout the year, allowing families to try unfamiliar dishes and communities to maintain culinary traditions after migration. A stable export market can also provide income where domestic demand is limited.",
        example: "A family preparing a traditional meal abroad may find its essential spices in an ordinary supermarket, while a small farming cooperative can potentially reach buyers in several countries.",
        link: "These are meaningful benefits because they concern both everyday choice and the livelihoods associated with that choice."
      },
      {
        point: "However, international availability is beneficial only if its environmental and social costs are taken seriously.",
        explanation: "Transport, packaging and cold storage can consume resources, and powerful retailers may leave growers with little of the final price. Marketing can also present a cuisine as a novelty while erasing the communities that developed it.",
        example: "A supermarket could disclose where a product comes from, pay suppliers transparently and favour seasonal shipments where possible, instead of advertising an imported dish as a newly discovered trend.",
        link: "Responsible purchasing and honest attribution allow global food trade to broaden choice without treating producers or cultures as disposable. Consumers may not be able to verify every supply chain, so supermarkets must make the relevant information easy to find and act on."
      }
    ],
    conclusion: "Selling food from many regions is positive overall, but variety alone is a thin measure of success. Retailers and consumers should also consider fair returns, accurate cultural credit and the environmental cost of bringing that food to the shelf.",
    readingConnection: "Rachel Kuo asks readers to distinguish cultural appreciation from exoticising or exploiting the people behind a cuisine. The essay applies that concern to global supermarket trade.",
    sampleSource: { label: "IELTS Charlie · global food model essays", url: "https://ieltscharlie.com/ielts-model-essay-food-all-over-world/" }
  },
  {
    introduction: "International tourism can create jobs, but it can also burden residents and fragile environments. I believe its advantages can outweigh its disadvantages because tourism can sustain local livelihoods and public amenities. Yet those gains depend on limits that protect residents and nature from overcrowding. Without local benefit and effective regulation, the same visitor numbers could become a liability.",
    anchors: ["Keep gains local", "Protect residents and nature"],
    body: [
      {
        point: "Tourism can create a diverse source of income for places with few other industries.",
        explanation: "Visitors spend money on accommodation, transport, food and guides, which can support small businesses as well as public revenue. This can help maintain historic sites and paths that residents themselves also use.",
        example: "A town near a national park might employ local guides and use entrance fees to repair trails, while nearby cafés and guesthouses purchase goods from surrounding farms.",
        link: "When the economic gains circulate locally, tourism can strengthen rather than merely occupy a destination."
      },
      {
        point: "The drawbacks are serious where visitor demand displaces everyday life or damages the environment.",
        explanation: "Short-term rentals can reduce housing supply, large crowds can strain water and waste systems, and sensitive habitats may be harmed. A tourist should also remember that a resident's ordinary day is not an attraction staged for visitors.",
        example: "A coastal city could restrict holiday lets in residential streets, cap access to a vulnerable beach and direct a visitor levy toward waste collection and local housing.",
        link: "These measures do not remove every cost, but they make the industry's benefits more likely to exceed its harms. Their effectiveness should be reviewed with residents, whose experience of crowded streets and rising rents is as relevant as visitor spending figures."
      }
    ],
    conclusion: "Tourism's advantages can outweigh its disadvantages, but only where communities have a say in how it grows. Revenue, housing and environmental protection must be considered together; visitor numbers by themselves are a poor measure of success. A smaller flow of visitors who stay longer and support local businesses may be better than mass tourism that leaves little behind.",
    readingConnection: "Mari Uyehara questions the demand to travel 'like a local' and reminds readers that residents have ordinary lives. The essay uses that perspective when weighing tourism's effects.",
    sampleSource: { label: "IELTS Mentor · international tourism sample", url: "https://www.ielts-mentor.com/index.php/writing-sample/writing-task-2/2065-ielts-writing-task-2-sample-925-international-tourism-has-brought-enormous-benefit-to-many-places" }
  },
  {
    introduction: "Science and technology can explain how the world works, but they cannot exhaust what it feels like to live in it. Art offers two forms of understanding that measurements alone cannot supply: it communicates the felt experience of living through an event, and it invites reflection on the values behind people's choices. These strengths complement scientific explanation.",
    anchors: ["Convey lived experience", "Explore moral choices"],
    body: [
      {
        point: "Art can communicate the felt quality of an experience that scientific description measures from the outside.",
        explanation: "Research may identify the physical effects of grief or map the colours of a river at sunset. A poem, painting or piece of music can place an audience inside one person's perception of that loss or scene, making its emotional contradictions intelligible.",
        example: "A painting of a familiar river may show why it represents childhood to one observer, whereas a navigation chart tells a boat pilot where the current becomes dangerous. Both are informative, but they answer different questions.",
        link: "Art therefore adds a first-person dimension that data, however accurate, cannot supply by itself."
      },
      {
        point: "The arts also help people examine values rather than merely identify facts.",
        explanation: "A novel can present conflicting motives without giving readers a simple correct answer; in following its characters, they must weigh loyalty, responsibility and regret. Technology may distribute such stories widely, but the ethical reflection comes from the imaginative work itself.",
        example: "A play about a family deciding whether to leave home can make an audience feel the pull of security against belonging in a way that a table of migration figures cannot.",
        link: "By opening several defensible perspectives, art develops empathy and judgement alongside the explanatory power of science. This does not make every artwork morally wise; it gives people a space in which to question their assumptions and compare possible responses."
      }
    ],
    conclusion: "Science is indispensable for understanding mechanisms and testing claims. Art offers another kind of knowledge: it makes private experience shareable and gives us room to consider what the evidence means for the lives we choose to lead.",
    readingConnection: "Twain describes how a pilot's expert knowledge of a river can reveal danger while altering the beauty he once saw. The essay develops that distinction without suggesting scientific knowledge has no value.",
    sampleSource: { label: "IELTS Mentor · art and science sample", url: "https://www.ielts-mentor.com/writing-sample/writing-task-2/1490-ielts-writing-task-2-sample-465-what-can-arts-tell-us-about-life-that-science-cannot" }
  }
];
