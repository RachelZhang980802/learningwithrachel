export type WritingSampleAnswer = {
  introduction: string;
  anchors: readonly [string, string];
  context: {
    heading: string;
    point: string;
    explanation: string;
    example: string;
    link: string;
  };
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

// Original model responses. Each essay presents a considered context or other
// view before developing two distinct, keyword-led PEEL arguments. The sources document comparable public samples;
// their wording is not reproduced here.
export const writingSampleAnswers: readonly WritingSampleAnswer[] = [
  {
    introduction: "University students must decide whether to devote all their time to their main subject or explore other disciplines. Concentration is essential when a degree requires extensive practical training. Nevertheless, I favour a small number of carefully chosen electives: they can improve students’ judgement within their major and their adaptability beyond it without compromising core training.",
    anchors: ["Judgement", "Adaptability"],
    context: {
      heading: "The case for exclusive focus",
      point: "The case for exclusive focus is strongest when gaps in a student's training could harm others.",
      explanation: "In medicine and engineering, knowledge builds sequentially, and a weakness in the basics can have consequences far beyond an examination. Required laboratories and placements also leave little flexibility.",
      example: "A medical student, for example, cannot replace supervised clinical hours with courses chosen merely for personal interest.",
      link: "Core requirements must therefore come first; an elective is worthwhile only if it fits around them."
    },
    body: [
      {
        point: "Within that boundary, carefully chosen electives can sharpen judgement in the major itself.",
        explanation: "Another discipline can reveal questions that a standard course leaves unasked and encourage students to test apparently settled claims against different evidence.",
        example: "Lincoln Steffens, for instance, found that reading literature, philosophy and political economy gave history a relevance he had not seen in class. When historical accounts then conflicted, he sought original documents instead of memorising one authority's version.",
        link: "The broader reading led him deeper into his chosen subject, showing how breadth can strengthen rather than dilute specialist study."
      },
      {
        point: "That habit of looking beyond one set of assumptions can also build adaptability when graduates apply their expertise.",
        explanation: "Real problems rarely follow departmental boundaries: a sound technical solution may still need to respond to social needs or a changing brief.",
        example: "A civil engineering graduate who has studied urban planning, for example, may adjust a proposed flood barrier so that it protects homes without cutting a neighbourhood off from the river.",
        link: "The elective has not replaced engineering knowledge; it has helped the graduate use that knowledge more effectively in a new setting."
      }
    ],
    conclusion: "Students should not sacrifice mastery of their main subject, especially where professional safety is at stake. Once essential training is protected, however, selective breadth can help them question evidence within their field and apply what they know when real problems cross disciplinary lines.",
    readingConnection: "Steffens specialised in history, but his earlier reading in literature, philosophy and political economy made its questions matter to him. Conflicting historical accounts then drove him to consult original documents. The essay uses that movement from breadth to deeper specialist inquiry.",
    sampleSource: { label: "How to do IELTS · university subjects sample", url: "https://howtodoielts.com/ielts-cambridge-18-university-students-and-main-subjects/" }
  },
  {
    introduction: "Robots now perform more tasks in homes and workplaces, from cleaning floors to moving industrial goods. Their spread can displace workers, but I consider it positive overall for two reasons: it can reduce human exposure to danger and give people more time for work that requires care and judgement.",
    anchors: ["Safety", "Human time"],
    context: {
      heading: "The cost of displacement",
      point: "The fear of lost jobs is legitimate.",
      explanation: "A machine can replace a routine position faster than its former occupant can learn a new trade, and the owner may capture most of the savings.",
      example: "A warehouse employee whose packing station is automated cannot simply become a robot technician the following week.",
      link: "This is why retraining and temporary income support must accompany adoption; otherwise the gains are unevenly shared."
    },
    body: [
      {
        point: "The clearest benefit of robots is greater safety.",
        explanation: "Machines can lift heavy loads, enter contaminated spaces and repeat hazardous movements without suffering injuries. People still set standards and inspect results, but fewer need to stand where an accident is most likely.",
        example: "In a chemical plant, a remotely controlled unit could check a leaking pipe while trained staff make decisions from a protected room.",
        link: "Preventing even a small number of serious injuries is a stronger reason to use automation than simply increasing output."
      },
      {
        point: "Automation can also return human time to tasks that need human attention.",
        explanation: "Routine work takes hours without always using a person's ability to interpret a problem or respond to another person. If employers redesign jobs thoughtfully, staff can spend more of the day on those harder tasks.",
        example: "A care worker whose trolley delivers supplies automatically could spend the saved minutes listening to residents; at home, a cleaning device could help someone with limited mobility remain independent.",
        link: "The value lies in what people can do with the released time, so employers should measure improved service as well as reduced labour costs."
      }
    ],
    conclusion: "Overall, robotics is a positive development when it makes work safer and frees people for tasks machines cannot perform well. Its benefits will be convincing only if workers who lose routine jobs receive a genuine route into new ones.",
    readingConnection: "The unit reading asks who gains when robots raise productivity and whether taxation can help workers through the transition. The essay carries that trade-off into the answer.",
    sampleSource: { label: "How to do IELTS · robots sample", url: "https://howtodoielts.com/ielts-writing-task-2-sample-answer-essay-robots-home/" }
  },
  {
    introduction: "In Britain, some older people live in residential homes where professional nurses care for them. Although families may wish to help, I believe the government should pay for necessary nursing care. Public funding protects equal access and prevents a medical crisis from becoming a financial crisis for relatives.",
    anchors: ["Equal access", "Financial protection"],
    context: {
      heading: "Why family payment appeals",
      point: "The argument for family payment is understandable.",
      explanation: "Relatives often know the resident best and may feel a duty to give something back after years of care. Some families can also afford to contribute.",
      example: "An adult child might willingly pay for a larger room or extra outings for a parent.",
      link: "Such voluntary help is welcome, but it cannot form the basis of a system that must serve older people with very different family circumstances."
    },
    body: [
      {
        point: "Government payment is needed to secure equal access.",
        explanation: "Nursing is a specialist service required because of a person's health, not a luxury chosen by their children. A resident with no relatives should receive the same essential care as one from a prosperous family.",
        example: "If two people require daily help with medication and bathing, it would be unjust for one to receive less because her son earns little.",
        link: "Funding basic care collectively makes need, rather than a relative's income, the deciding factor."
      },
      {
        point: "Public funding also provides financial protection to families.",
        explanation: "The need for residential nursing can arise suddenly and continue for years; its cost is difficult to predict or save for. Requiring adult children to cover the whole bill could force them to sacrifice their own housing or their children's education.",
        example: "A daughter may visit her father every week and advocate for his wishes while lacking the income to pay a nurse's salary.",
        link: "The state should carry the essential bill, leaving relatives free to offer companionship and optional support without risking their own security."
      }
    ],
    conclusion: "The government should therefore pay for necessary residential nursing in Britain. Families remain important as visitors, advocates and voluntary contributors, but professional care should be available on equal terms without exposing them to unpredictable debts.",
    readingConnection: "Roommates presents an older family member with agency and a relationship of mutual care. The essay preserves that sense of independence while addressing who pays for professional nursing.",
    sampleSource: { label: "Paramount IELTS · elderly care sample", url: "https://www.paramountielts.com/ielts-writing-task-2-who-should-pay-for-elderly-care/" }
  },
  {
    introduction: "People often decide within minutes whether they like a new acquaintance. Such impressions may help in an urgent situation, yet I regard quick judgements of character as mostly harmful. They can turn stereotypes into verdicts, whereas a reliable opinion requires evidence from a person's behaviour over time.",
    anchors: ["Fairness", "Reliable evidence"],
    context: {
      heading: "The appeal of first impressions",
      point: "A quick impression can serve a limited purpose.",
      explanation: "When someone behaves aggressively, caution is reasonable before there is time for a fuller assessment. First meetings also give clues about how a person chooses to present themselves.",
      example: "A passenger may avoid sharing a taxi with someone who repeatedly ignores a clear refusal.",
      link: "But a decision about immediate safety differs from deciding whether a stranger is kind, honest or worth knowing."
    },
    body: [
      {
        point: "Quick judgements can undermine fairness.",
        explanation: "An accent, a plain coat or a hesitant greeting says little about someone's moral character. Yet observers often treat familiar social signals as evidence, rewarding people who resemble themselves and excluding those who do not.",
        example: "A new colleague who pauses before speaking may be called unfriendly when she is simply finding the right words in a second language.",
        link: "Keeping the first impression provisional gives that colleague a fair chance to be known."
      },
      {
        point: "Reliable evidence of character emerges through repeated conduct.",
        explanation: "How a person keeps promises, shares credit and responds when something goes wrong reveals habits that a polished introduction cannot show. Revising an early opinion as new evidence appears is sensible rather than naive.",
        example: "An impressive interviewee may take credit for a team's work, while a nervous applicant may quietly help others and meet every deadline.",
        link: "Waiting for a pattern of behaviour leads to sounder choices about trust and friendship than treating one encounter as a final test."
      }
    ],
    conclusion: "A first impression can warn us when immediate caution is needed. In ordinary relationships, however, quick judgements are more likely to be unfair and inaccurate; character should be assessed through what people do repeatedly.",
    readingConnection: "Never Trust Appearances shows how a visitor constructs a stereotype from clothes and manner. The essay applies that warning to ordinary encounters while allowing for genuine safety concerns.",
    sampleSource: { label: "Simply IELTS · first impressions sample", url: "https://simplyielts.com/first-impressions-of-character-cambridge-ielts-18-writing-task-2/" }
  },
  {
    introduction: "Some people want friends who agree with them, while others value friends who sometimes take another view. Agreement can make companionship comfortable, but I prefer the latter. Thoughtful disagreement can improve judgement and, when expressed with respect, build a more honest form of trust.",
    anchors: ["Judgement", "Honest trust"],
    context: {
      heading: "Why agreement feels valuable",
      point: "Friends who share opinions can provide ease and reassurance.",
      explanation: "A person under stress may need sympathetic company rather than another argument, and common values often make it easier to understand each other's choices.",
      example: "Two friends who both place family first may immediately understand why one cancels dinner to care for a parent.",
      link: "This emotional security is real, but it does not require friends to approve of every decision."
    },
    body: [
      {
        point: "A friend who disagrees can improve judgement.",
        explanation: "Someone who knows us well can see a weak assumption that we miss ourselves. Their questions force us to test a plan before its costs become difficult to reverse.",
        example: "If I wanted to resign after one bad week at work, a friend who asked about my savings and future options would help me more than one who simply applauded.",
        link: "The useful disagreement concerns a decision and its consequences, not the friend's desire to win an argument."
      },
      {
        point: "Respectful disagreement can also create honest trust.",
        explanation: "If friends know that they may differ without being rejected, they need not pretend to share every belief. A candid response becomes more credible because approval is no longer automatic.",
        example: "A friend who says she enjoyed my presentation but found one claim unconvincing offers praise I can believe and criticism I can use.",
        link: "Provided both people listen and avoid personal attacks, disagreement makes room for honesty within the relationship."
      }
    ],
    conclusion: "Shared opinions can make a friendship comfortable, and that explains their appeal. I would nevertheless choose friends who can disagree kindly, since they help me think better and make our trust depend on honesty rather than constant agreement.",
    readingConnection: "Courage depicts the difficulty and value of speaking honestly when convention favours silence. The essay translates that idea into the context of friendship.",
    sampleSource: { label: "Simply IELTS · friendship sample", url: "https://simplyielts.com/friends-with-the-same-opinions-cambridge-ielts-14-writing-task-2/" }
  },
  {
    introduction: "It has been predicted that free online reading will end the sale of printed books and newspapers. I disagree with this absolute claim. Digital access will certainly grow, but quality publishing still needs funding, and physical editions continue to meet needs that a screen does not.",
    anchors: ["Funding", "Physical use"],
    context: {
      heading: "Why digital reading will grow",
      point: "The attraction of online reading is undeniable.",
      explanation: "A phone holds many titles, allows instant search and delivers breaking news without a trip to a shop. Open websites also give readers access to material they might never encounter in print.",
      example: "A commuter can check several newspapers on the way to work without carrying any of them.",
      link: "These advantages explain falling demand for some printed products, but not the prediction that every printed sale will disappear."
    },
    body: [
      {
        point: "The prediction overlooks the funding required for valuable writing.",
        explanation: "Research, reporting and editing take time. Advertising supports some websites, yet it cannot reliably pay for every specialist book or investigation; subscriptions, institutional purchases and sales remain important.",
        example: "A student may read free headlines each morning but still buy a carefully edited textbook whose production required expert authors and fact-checking.",
        link: "If the work itself is not always free, the claim that all desirable reading will be available online without payment cannot hold."
      },
      {
        point: "Printed publications also retain a distinct physical use.",
        explanation: "They can be lent, annotated, displayed and read without a battery or notifications. Readers may prefer those properties for long study sessions or for sharing a story aloud, even while using screens for quick information.",
        example: "A parent might buy a picture book to turn pages with a child while checking the day's train times on a phone.",
        link: "These different purposes make a smaller print market plausible, but they make a world with no print buyers implausible."
      }
    ],
    conclusion: "Online reading is likely to take a larger share of people's attention. Nevertheless, I strongly disagree that nobody will purchase print: good writing has costs, and a physical book or newspaper can serve readers in ways a free webpage cannot.",
    readingConnection: "Franklin's account of seeking out books and learning through sustained reading informs the distinction between access to text and the value readers attach to particular editions.",
    sampleSource: { label: "How to do IELTS · print and online sample", url: "https://howtodoielts.com/ielts-writing-task-2-sample-answer-essay-ielts-cambridge-15-printed-newspapers-reading-online/" }
  },
  {
    introduction: "As people leave rural areas for cities, the countryside loses residents and urban populations grow. This can strain both places, yet I consider the trend positive overall when managed well. It can widen employment choices and give more people access to specialist services; governments must still plan for those who move and those who remain.",
    anchors: ["Employment", "Specialist services"],
    context: {
      heading: "The pressure on both places",
      point: "Migration can impose real costs on cities and villages.",
      explanation: "Rapid arrivals may outpace housing and transport, while a village with fewer families can struggle to keep its school or bus route.",
      example: "A worker may secure a higher-paid city job yet spend hours commuting from an overcrowded district, while her parents lose their local clinic.",
      link: "These problems call for planning, not a presumption that people should be denied the chance to move."
    },
    body: [
      {
        point: "The strongest benefit of migration is broader employment.",
        explanation: "A small rural economy may offer only a few occupations, whereas a city brings employers, training institutions and customers into one area. Workers can find a position that matches their skills and change direction if a local industry declines.",
        example: "A young person from a farming village might train as an electrician in the city, earn a stable income and later take contracts in nearby towns.",
        link: "That mobility can improve a household's prospects without making rural work less valuable."
      },
      {
        point: "Cities can also improve access to specialist services.",
        explanation: "Hospitals, colleges and technical programmes need enough users and staff to operate well. A city can bring those resources within reach of people who previously faced long journeys for treatment or study.",
        example: "A student who moves for nursing training may gain access to a teaching hospital and then serve patients in a regional clinic.",
        link: "To make this benefit durable, governments should add housing and transport capacity while retaining essential services for rural residents."
      }
    ],
    conclusion: "The movement to cities is positive overall because it can expand work and access to specialised care and education. Its gains depend on practical planning: cities must absorb newcomers, and the countryside must remain a viable place for those who stay.",
    readingConnection: "Jared Diamond's reading treats city life as a set of trade-offs involving opportunity, services and social ties. The essay follows that balanced approach.",
    sampleSource: { label: "How to do IELTS · rural migration sample", url: "https://howtodoielts.com/ielts-cambridge-18-rural-people-moving-to-cities/" }
  },
  {
    introduction: "Supermarkets now stock foods grown and made in many parts of the world. Transport and packaging create legitimate concerns, but I regard this as a positive development overall. It offers households greater choice and gives producers access to customers beyond their local markets, provided retailers buy responsibly.",
    anchors: ["Choice", "Producer income"],
    context: {
      heading: "The environmental objection",
      point: "The environmental criticism of imported food deserves attention.",
      explanation: "Refrigeration, air freight and disposable packaging can increase emissions, and a distant supply chain may be harder for shoppers to examine.",
      example: "Flying delicate fruit across the world for a short selling season could consume resources out of proportion to its value.",
      link: "Supermarkets should therefore favour transparent sourcing and efficient transport, but these costs do not make every imported product harmful."
    },
    body: [
      {
        point: "International shelves give households more meaningful choice.",
        explanation: "They let families cook dishes from their own traditions after migration and allow other shoppers to encounter ingredients beyond the local harvest. The point is access to foods people actually use, not novelty for its own sake.",
        example: "A family living abroad may find the lentils and spices needed for a familiar meal in an ordinary supermarket rather than travelling across a city.",
        link: "Such availability makes daily life more flexible and can help culinary traditions continue across borders."
      },
      {
        point: "Wider markets can also increase producer income.",
        explanation: "A farmer or cooperative may find buyers when local demand is too small or prices are unstable. Yet this benefit depends on contracts that leave growers a reasonable share rather than allowing powerful retailers to capture all the value.",
        example: "A coffee cooperative might use a long-term supermarket agreement to pay its members predictably and invest in processing equipment.",
        link: "Fair contracts and clear information about origin turn an international supply chain into an opportunity for producers as well as shoppers."
      }
    ],
    conclusion: "Selling food from around the world is positive when it expands useful choice and pays producers fairly. The environmental costs require scrutiny, so supermarkets should make sourcing and transport decisions visible rather than treating variety alone as proof of success.",
    readingConnection: "Rachel Kuo asks readers to distinguish cultural appreciation from exoticising or exploiting the people behind a cuisine. The essay applies that concern to global supermarket trade.",
    sampleSource: { label: "IELTS Charlie · global food model essays", url: "https://ieltscharlie.com/ielts-model-essay-food-all-over-world/" }
  },
  {
    introduction: "International tourism brings visitors and revenue to many places, yet it can crowd neighbourhoods and damage fragile landscapes. I believe its advantages generally outweigh its disadvantages when destinations govern it carefully. The strongest gains are local livelihoods and resources for conservation, neither of which should be purchased at residents' expense.",
    anchors: ["Local livelihoods", "Conservation resources"],
    context: {
      heading: "Costs residents can feel",
      point: "Tourism has costs that visitor spending alone can conceal.",
      explanation: "Short-term rentals can reduce local housing, crowds can overwhelm buses, and unmanaged visits can wear down beaches or historic streets.",
      example: "A resident priced out of her neighbourhood gains little from a record number of hotel bookings.",
      link: "Destinations should set limits on rentals and visitor numbers before assessing whether the industry's gains outweigh those losses."
    },
    body: [
      {
        point: "Tourism can sustain local livelihoods.",
        explanation: "Visitors need accommodation, meals, transport and guides, so spending can reach businesses beyond a single hotel. When these firms hire residents and buy local goods, the value circulates through the community.",
        example: "A town near a national park might employ local guides while guesthouses purchase food from nearby farms.",
        link: "That income can be especially valuable where few other industries offer steady work, provided residents share in the returns."
      },
      {
        point: "Visitor revenue can also provide conservation resources.",
        explanation: "Maintaining trails, restoring historic buildings and collecting waste cost money. Entry fees and a modest visitor levy can fund this work without requiring residents alone to meet the bill.",
        example: "A coastal reserve could limit daily entry and use ticket income to repair paths and protect nesting areas.",
        link: "This makes tourism more defensible only if spending is transparent and visitor limits are enforced; otherwise the site itself may be damaged."
      }
    ],
    conclusion: "I therefore judge international tourism's advantages to be greater, but only under local control. Jobs and conservation funding are substantial benefits; housing pressure and environmental harm can overturn that judgement if authorities ignore residents or abandon sensible limits.",
    readingConnection: "Mari Uyehara questions the demand to travel 'like a local' and reminds readers that residents have ordinary lives. The essay uses that perspective when weighing tourism's effects.",
    sampleSource: { label: "IELTS Mentor · international tourism sample", url: "https://www.ielts-mentor.com/index.php/writing-sample/writing-task-2/2065-ielts-writing-task-2-sample-925-international-tourism-has-brought-enormous-benefit-to-many-places" }
  },
  {
    introduction: "Scientific research explains many mechanisms of life, yet people still turn to music, painting and literature. The arts can show what an experience feels like from within and let us consider the values at stake in a human choice. These insights are different from, and compatible with, scientific knowledge.",
    anchors: ["Lived experience", "Moral insight"],
    context: {
      heading: "What science explains",
      point: "Science offers explanations the arts cannot replace.",
      explanation: "It can test a treatment, measure a river's current or establish how memory works. Technology can then apply those findings and distribute information widely.",
      example: "A pilot needs a chart of a river's depth before steering a boat through a narrow channel.",
      link: "Yet an accurate chart tells us little about what that same river means to someone who grew up beside it."
    },
    body: [
      {
        point: "Art can reveal lived experience from the inside.",
        explanation: "Research can describe the bodily effects of grief, but a poem can convey how an ordinary room feels altered after a death. Form, rhythm and image allow readers to recognise conflicting emotions that a measurement cannot itself express.",
        example: "A painting of a familiar river may evoke a person's childhood, while a navigation chart records the current and the depth.",
        link: "The artwork makes a private experience shareable without disputing the chart's practical accuracy."
      },
      {
        point: "Art can also generate moral insight.",
        explanation: "A story places readers among people with competing obligations and makes them follow the consequences of a decision. Scientific evidence may describe those consequences, but it cannot determine by itself what loyalty, fairness or belonging should mean to the people involved.",
        example: "A play about a family leaving its home can make an audience weigh safety against attachment to a place, rather than seeing migration only as a statistic.",
        link: "By inviting that judgement without supplying an easy verdict, art helps people think about how they ought to live."
      }
    ],
    conclusion: "Science remains essential for testing claims and solving practical problems. The arts reveal other dimensions of life: the texture of personal experience and the moral weight of choices. People continue to value artists because those questions cannot be settled by technical progress alone.",
    readingConnection: "Twain describes how a pilot's expert knowledge of a river can reveal danger while altering the beauty he once saw. The essay develops that distinction without suggesting scientific knowledge has no value.",
    sampleSource: { label: "IELTS Mentor · art and science sample", url: "https://www.ielts-mentor.com/writing-sample/writing-task-2/1490-ielts-writing-task-2-sample-465-what-can-arts-tell-us-about-life-that-science-cannot" }
  }
];
