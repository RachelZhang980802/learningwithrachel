export type WritingSampleAnswer = {
  introduction: string;
  anchors: readonly [string, string];
  body: readonly {
    role?: "argument" | "concession";
    heading?: string;
    practiceElement: "point" | "explanation" | "example" | "evaluation" | "link";
    point: string;
    explanation: string;
    example: string;
    evaluation: string;
    link: string;
  }[];
  conclusion: string;
  readingConnection: string;
  sampleSource: { label: string; url: string };
};

// Original classroom model answers. Paragraph count and the use of counterarguments
// vary with each prompt; PEEEL is a planning guide rather than a sentence-by-sentence template.
// The linked sources are for comparison only; their wording is not reproduced.
export const writingSampleAnswers: readonly WritingSampleAnswer[] = [
  {
    introduction: "Some university courses demand so much practice that students have little room for unrelated subjects. Even so, I think most students benefit from a few well-chosen electives: they can deepen understanding of a major and help graduates see how it applies beyond the classroom.",
    anchors: ["Sharper judgement", "Wider application"],
    body: [
      {
        role: "concession",
        heading: "When core training must come first",
        practiceElement: "example",
        point: "Some students have good reason to give nearly all their time to their qualification.",
        explanation: "Medicine and engineering, for example, require supervised practice as well as study.",
        example: "A medical student cannot replace clinical placements with an elective in another subject.",
        evaluation: "Core study must come first, though not every degree makes the same demands.",
        link: "The question is whether students can add another subject without weakening that core."
      },
      {
        practiceElement: "point",
        point: "For students with room in their timetable, a few electives can make them more thoughtful in their main subject.",
        explanation: "A second field gives them new questions with which to test familiar ideas.",
        example: "Lincoln Steffens found that reading literature, philosophy and political economy deepened his interest in history. When accounts disagreed, he checked original documents.",
        evaluation: "Wider reading sent him back to history with sharper questions.",
        link: "The elective complemented his specialism."
      },
      {
        practiceElement: "evaluation",
        point: "A second field can also help graduates apply their expertise to unfamiliar problems.",
        explanation: "Many workplace problems cross subject boundaries and affect people as well as systems.",
        example: "An engineer who has studied urban planning may design flood protection that keeps a neighbourhood connected to its river.",
        evaluation: "That breadth is useful only after the graduate has mastered the core skills.",
        link: "A small number of electives can then widen how they use that knowledge."
      }
    ],
    conclusion: "A demanding qualification deserves sustained attention, and students should not take electives at the expense of essential training. But where their timetable allows, studying one or two other fields can make their specialist knowledge more useful and more thoughtful.",
    readingConnection: "The unit reading describes Lincoln Steffens’s interest in literature, philosophy and political economy, followed by his search through original documents when historical accounts conflicted. The essay uses that movement from wider reading to deeper work in one subject.",
    sampleSource: { label: "How to do IELTS · university subjects sample", url: "https://howtodoielts.com/ielts-cambridge-18-university-students-and-main-subjects/" }
  },
  {
    introduction: "Robots are appearing in ordinary homes as well as factories, taking on jobs that used to require people. On balance, I see this as positive: machines can take on dangerous or repetitive work, leaving people more time for tasks that need care and judgement, provided displaced workers are supported.",
    anchors: ["Safety", "Human time"],
    body: [
      {
        practiceElement: "example",
        point: "Robots are most useful when they take people out of dangerous workplaces.",
        explanation: "They can inspect leaks or handle heavy loads while workers supervise from a safer distance.",
        example: "At a chemical plant, a remote robot could examine a leaking pipe before a technician enters the area.",
        evaluation: "People still need to check the machine and manage the remaining risks.",
        link: "Fewer workers are exposed to immediate danger."
      },
      {
        practiceElement: "link",
        point: "Automation can free people for work that depends on care and judgement.",
        explanation: "Repetitive duties often leave little time for problem-solving or personal attention.",
        example: "If a trolley delivers supplies in a care home, staff may spend more time with residents.",
        evaluation: "The gain disappears if employers simply cut staff instead of redesigning the work.",
        link: "How the saved time is used matters as much as the machine."
      },
      {
        role: "concession",
        heading: "A real cost to address",
        practiceElement: "evaluation",
        point: "Yet routine jobs may disappear before workers can move into new roles.",
        explanation: "Higher productivity means little to someone who loses their shifts or income.",
        example: "A supermarket may serve customers faster after installing self-checkout machines, but need fewer cashiers.",
        evaluation: "Employers should offer retraining, with public support for people whose jobs vanish.",
        link: "Workers should share in the gains, not carry the cost alone."
      }
    ],
    conclusion: "Robots are a positive development when they reduce exposure to danger and allow people to focus on work that machines cannot do well. To make those gains fair, employers and governments should also help workers whose routine jobs disappear move into new roles.",
    readingConnection: "The unit reading asks who benefits when robots increase productivity and whether taxation can help workers through the transition. This answer recognises both the gains from automation and the need to share them fairly.",
    sampleSource: { label: "How to do IELTS · robots sample", url: "https://howtodoielts.com/ielts-writing-task-2-sample-answer-essay-robots-home/" }
  },
  {
    introduction: "When an older person needs nursing care in a residential home, the bill can continue for years and vary with the level of support required. I believe the government should pay for essential care, so access depends on medical need rather than family income; relatives can still offer practical help or pay for extras if they wish.",
    anchors: ["Equal access", "Family finances"],
    body: [
      {
        practiceElement: "explanation",
        point: "Essential care should depend on a resident’s medical needs, not on how much their relatives earn.",
        explanation: "Nursing support is required because of a person’s health; it should not depend on whether their children can afford a private bill.",
        example: "Two residents who both need daily help with medication and bathing should receive the same standard of care, even if one has no close relatives nearby.",
        evaluation: "Relatives may choose to pay for a larger room or other extras, but those choices should not decide whether someone receives basic nursing.",
        link: "Public funding is the fairest way to keep the standard of essential care consistent."
      },
      {
        practiceElement: "point",
        point: "Asking families to cover the full bill can also put an unreasonable strain on them.",
        explanation: "Care needs can change quickly, and a family may have no realistic way to budget for several years of professional support.",
        example: "A daughter may visit her father each week and speak up for his wishes while being unable to pay a nurse’s salary without risking her own household’s finances.",
        evaluation: "Relatives still have an important role as companions and advocates; paying the professional bill should not be confused with caring less.",
        link: "The state should cover necessary nursing so that families can support older relatives without taking on unmanageable debt."
      }
    ],
    conclusion: "The government should cover the nursing a resident needs. Families can still provide companionship and help with decisions, but a person’s access to care should not depend on whether their children can afford an unpredictable bill.",
    readingConnection: "Roommates presents an older family member as a person with agency within a caring relationship. This essay keeps that emphasis on dignity while considering how professional nursing should be funded.",
    sampleSource: { label: "Paramount IELTS · elderly care sample", url: "https://www.paramountielts.com/ielts-writing-task-2-who-should-pay-for-elderly-care/" }
  },
  {
    introduction: "A first meeting can leave a strong impression, but it gives us very little time to understand another person. I think quick judgements are usually harmful: they can turn unfamiliar mannerisms into unfair assumptions, and they are easily overturned by how someone behaves over time.",
    anchors: ["Fairness", "Reliable evidence"],
    body: [
      {
        practiceElement: "evaluation",
        point: "The trouble with a snap judgement is that it often treats manner as evidence of character.",
        explanation: "An accent, a quiet manner or a style of dress does not show whether someone is kind or dependable, yet observers may treat unfamiliar behaviour as a warning sign.",
        example: "At work, for instance, a colleague who says little in a meeting may be concentrating on expressing herself in a second language, rather than showing disinterest.",
        evaluation: "Caution is sensible when someone behaves threateningly, but that is a response to specific behaviour, not proof that first impressions reveal a person’s whole character.",
        link: "Keeping an early opinion open gives people a fair chance to show who they are."
      },
      {
        practiceElement: "example",
        point: "Repeated behaviour provides more reliable evidence of character than a first meeting does.",
        explanation: "People’s choices over time show whether they keep promises, share credit and respond responsibly when something goes wrong.",
        example: "A nervous job applicant may later prove dependable by meeting every deadline and helping colleagues, while a confident interviewee may repeatedly take credit for the team’s work.",
        evaluation: "No single action tells the whole story, but a consistent pattern is a sounder basis for trust than appearance or a polished introduction.",
        link: "Allowing time for that pattern to emerge leads to fairer decisions about work and friendship."
      }
    ],
    conclusion: "A first impression can alert us to an immediate risk, but it should not settle our view of someone’s character. In ordinary relationships, fairness and accuracy depend on watching what people do over time.",
    readingConnection: "Never Trust Appearances shows how a visitor builds a stereotype from someone’s clothes and manner. The essay applies the same warning to everyday encounters while recognising the need to respond to genuine safety concerns.",
    sampleSource: { label: "Simply IELTS · first impressions sample", url: "https://simplyielts.com/first-impressions-of-character-cambridge-ielts-18-writing-task-2/" }
  },
  {
    introduction: "Some people feel most comfortable with friends who see things as they do; others value friends who will disagree. I prefer the second kind of friendship, as long as the disagreement is kind: it can help us make better decisions and be more honest with one another.",
    anchors: ["Better judgement", "Honest trust"],
    body: [
      {
        practiceElement: "point",
        point: "A good friend may notice a risk we are too close to see.",
        explanation: "They know our circumstances and can ask what we may regret later.",
        example: "If I wanted to resign after one bad week, a friend asking about my savings might help more than one urging me to quit.",
        evaluation: "That advice helps only if it is offered with care, not as an attempt to control me.",
        link: "A friend can challenge me while leaving the decision mine."
      },
      {
        role: "concession",
        heading: "The comfort of agreement",
        practiceElement: "evaluation",
        point: "Friends who share our outlook can make us feel understood.",
        explanation: "At a difficult moment, we may need company before advice.",
        example: "After a disappointing result, a friend may simply listen rather than tell us what to do.",
        evaluation: "Agreement is comforting, but constant agreement can keep useful questions unasked.",
        link: "The best friendships can offer comfort and candour."
      },
      {
        practiceElement: "link",
        point: "Being able to disagree can make a friendship more honest.",
        explanation: "Neither person has to pretend to approve of every choice.",
        example: "A friend who praises my presentation but questions one claim gives me feedback I can use.",
        evaluation: "Disagreement need not become an argument if both people listen.",
        link: "That honesty makes praise more meaningful too."
      }
    ],
    conclusion: "Friends do not need to challenge every opinion, and agreement can be a comfort. Still, I value the friend who can tell me gently when I am wrong; that kind of honesty is more useful than automatic approval.",
    readingConnection: "Courage explores the difficulty and value of speaking honestly when social convention encourages silence. This essay applies that idea to disagreement between friends.",
    sampleSource: { label: "Simply IELTS · friendship sample", url: "https://simplyielts.com/friends-with-the-same-opinions-cambridge-ielts-14-writing-task-2/" }
  },
  {
    introduction: "Free online reading is likely to replace many routine purchases, especially newspapers. However, the prediction that nobody will buy printed books or papers is too sweeping: some readers still want a physical copy, and valuable writing will need funding in either format.",
    anchors: ["Funding good writing", "A distinct use"],
    body: [
      {
        role: "concession",
        heading: "What digital reading will replace",
        practiceElement: "evaluation",
        point: "For daily news, free online reading will probably replace many printed purchases.",
        explanation: "It is faster to search and cheaper to distribute.",
        example: "Few people will wait for tomorrow’s paper to check today’s weather.",
        evaluation: "This is a real change, but it concerns routine news rather than every kind of reading.",
        link: "That shift in daily news does not settle what will happen to books."
      },
      {
        practiceElement: "evaluation",
        point: "Free online access does not remove the need to pay for carefully produced books.",
        explanation: "Writers and editors still need to be paid, especially for specialist work.",
        example: "A student may read headlines for free but buy a textbook to annotate and keep.",
        evaluation: "An online subscription can fund the same writing, but a marked-up printed copy may remain useful long after a course ends.",
        link: "That gives printed books a market even as routine news moves online."
      },
      {
        practiceElement: "example",
        point: "Some books are still more enjoyable or useful on paper.",
        explanation: "Readers can share and mark a book without a battery or a screen.",
        example: "A parent may choose a picture book to read with a child, but check train times on a phone.",
        evaluation: "Digital is better for quick updates; paper suits slower, shared reading.",
        link: "Different uses leave room for both formats."
      }
    ],
    conclusion: "Digital reading will become the default for much daily news, and print sales may continue to fall. Yet books people want to keep, share or read away from a screen are unlikely to disappear altogether, so I disagree with the prediction in its absolute form.",
    readingConnection: "Franklin’s account describes his search for books and the learning he gained through sustained reading. It also helps distinguish simply accessing text from valuing a particular reading experience.",
    sampleSource: { label: "How to do IELTS · print and online sample", url: "https://howtodoielts.com/ielts-writing-task-2-sample-answer-essay-ielts-cambridge-15-printed-newspapers-reading-online/" }
  },
  {
    introduction: "The movement from villages to cities can bring better jobs and services, but it may also leave rural communities short of workers and support. Overall, I see it as positive for individuals when they have a genuine choice, though governments need to manage the effects on both places.",
    anchors: ["Employment", "Specialist services"],
    body: [
      {
        practiceElement: "explanation",
        point: "A city can offer jobs that do not exist in a small village.",
        explanation: "A larger labour market gives people more ways to train and earn a living.",
        example: "Someone from a farming village might train as an electrician and find steady work in a nearby city.",
        evaluation: "High rents can swallow the benefit, so housing and transport matter too.",
        link: "For that person, migration can be a genuine opportunity."
      },
      {
        practiceElement: "evaluation",
        point: "Cities can also bring specialist education and healthcare closer.",
        explanation: "Large institutions are easier to sustain where enough staff and patients live nearby.",
        example: "A student may move to train as a nurse, then work at a regional clinic.",
        evaluation: "Rural residents still need basic clinics and reliable transport.",
        link: "The gains in city services must be weighed against what rural residents lose."
      },
      {
        role: "concession",
        heading: "What rural communities can lose",
        practiceElement: "evaluation",
        point: "Those who stay may lose services as their communities shrink.",
        explanation: "Fewer residents can mean fewer staff and less demand for local shops and clinics.",
        example: "If a village loses its bus route, older residents who do not drive may be cut off.",
        evaluation: "This is serious, though reliable transport and essential local services can limit the damage.",
        link: "Opportunity should not depend on abandoning the countryside."
      }
    ],
    conclusion: "Moving to a city can widen a person’s choices, so I consider the trend positive when it is voluntary and cities can provide housing and transport. That judgement must also take account of the villages people leave: essential local services cannot simply disappear with their residents.",
    readingConnection: "Jared Diamond’s reading presents city life through trade-offs involving opportunity, services and social ties. This response weighs those gains against the pressures on both urban and rural communities.",
    sampleSource: { label: "How to do IELTS · rural migration sample", url: "https://howtodoielts.com/ielts-cambridge-18-rural-people-moving-to-cities/" }
  },
  {
    introduction: "A supermarket may now stock food from several continents, giving shoppers options that were once hard to find locally. I see this as broadly positive, as long as the convenience does not depend on unfair deals for growers or avoidable environmental damage.",
    anchors: ["Useful choice", "Producer income"],
    body: [
      {
        practiceElement: "point",
        point: "For shoppers, the most immediate gain is having more choice in one place.",
        explanation: "People can find familiar ingredients after moving abroad and try foods that are not grown locally, without travelling across a city to specialist shops.",
        example: "Someone who has moved abroad, for example, may find the lentils and spices for a familiar meal at the supermarket around the corner.",
        evaluation: "That convenience has a cost if every item is flown in or heavily wrapped, so retailers need to consider distance and packaging rather than treating variety as an unqualified good.",
        link: "When supply chains are responsible, international shelves can make everyday shopping more flexible and inclusive."
      },
      {
        practiceElement: "example",
        point: "Selling beyond the local market can also give some growers a steadier source of income.",
        explanation: "Farmers and cooperatives may find buyers beyond their local area, which can reduce their dependence on a small or unstable market.",
        example: "A coffee cooperative with a long-term supermarket contract may be able to plan its income and invest in better processing equipment.",
        evaluation: "This benefit depends on fair prices and clear contracts; otherwise retailers may gain most of the value while growers carry the risk.",
        link: "Transparent sourcing can make global food trade useful to producers as well as shoppers."
      }
    ],
    conclusion: "The wider choice is worthwhile when growers receive a fair return and retailers avoid needless transport and packaging. Without those safeguards, the extra variety can cost more than shoppers or producers realise.",
    readingConnection: "Rachel Kuo asks readers to distinguish cultural appreciation from exoticising or exploiting the people behind a cuisine. This essay carries that concern into supermarket sourcing and the treatment of producers.",
    sampleSource: { label: "IELTS Charlie · global food model essays", url: "https://ieltscharlie.com/ielts-model-essay-food-all-over-world/" }
  },
  {
    introduction: "Tourism can bring money and jobs to a destination, but visitors can also make housing scarce and put pressure on local landscapes. I believe the benefits can outweigh these costs when residents have a say in tourism growth, local people share its income, and visitor fees help protect the places being visited.",
    anchors: ["Local livelihoods", "Conservation"],
    body: [
      {
        practiceElement: "evaluation",
        point: "Tourist spending can support businesses beyond hotels.",
        explanation: "They also pay for meals, local transport and guides.",
        example: "Near a national park, a guesthouse may buy food from nearby farms and hire local guides.",
        evaluation: "The gain is smaller when work is seasonal or outside firms take most of the profit.",
        link: "Local hiring helps keep more of that money in the community."
      },
      {
        role: "concession",
        heading: "When tourism goes too far",
        practiceElement: "example",
        point: "Yet tourism causes real harm when visitor numbers exceed what a place can absorb.",
        explanation: "Crowds and holiday rentals can disrupt daily life and push up rents.",
        example: "In a coastal town, local workers may struggle to find long-term homes near their jobs.",
        evaluation: "Visitor limits and housing rules can reduce this pressure, though enforcement matters.",
        link: "Tourism is only worthwhile if residents can shape its scale."
      },
      {
        practiceElement: "link",
        point: "Where residents set the limits, visitor fees can help protect the places people come to see.",
        explanation: "Trails, wildlife and historic sites all need money for upkeep.",
        example: "A coastal reserve could cap daily visits and use ticket income to protect nesting areas.",
        evaluation: "The money must be accounted for, and visitor limits must be enforced.",
        link: "Well-managed visits can help preserve a destination."
      }
    ],
    conclusion: "On balance, I think tourism is worthwhile where residents share its income and can limit its effects. If visitors are allowed to overwhelm housing or a fragile site, the costs quickly outweigh the money they bring.",
    readingConnection: "Mari Uyehara questions the demand to travel ‘like a local’ and reminds readers that residents have ordinary lives. This response keeps residents’ needs central when weighing tourism’s effects.",
    sampleSource: { label: "IELTS Mentor · international tourism sample", url: "https://www.ielts-mentor.com/index.php/writing-sample/writing-task-2/2065-ielts-writing-task-2-sample-925-international-tourism-has-brought-enormous-benefit-to-many-places" }
  },
  {
    introduction: "Science can explain how a disease spreads or how a river changes, yet people still turn to novels, music and painting. The arts answer a different question: what those changes feel like to the people living through them, and what their choices may mean.",
    anchors: ["Lived experience", "Moral insight"],
    body: [
      {
        practiceElement: "example",
        point: "A story or painting can make an unfamiliar experience feel personal.",
        explanation: "Research can describe physical or social effects, while a poem, painting or story can show how those effects feel to a person living through them.",
        example: "In Life on the Mississippi, Mark Twain shows that a river pilot’s growing knowledge reveals dangers in the water but changes the beauty he once saw in it.",
        evaluation: "Charts are still the right tool for measuring depth and avoiding hazards; Twain’s point is not that art replaces such knowledge, but that a measurement cannot capture the pilot’s changed way of seeing the river.",
        link: "Art makes private experience available to others without replacing scientific or technical facts."
      },
      {
        practiceElement: "evaluation",
        point: "Art can also make us pause over choices that have no simple right answer.",
        explanation: "By placing an audience close to people with competing needs, art encourages us to weigh the consequences of a choice and consider what matters to those involved.",
        example: "A play about a family leaving home can lead its audience to consider safety alongside attachment to a place, rather than seeing migration only as a statistic.",
        evaluation: "Research can examine how people make these choices, but evidence alone cannot tell us which value should matter most in a particular life.",
        link: "The arts add a human perspective to questions that facts alone cannot settle."
      }
    ],
    conclusion: "Science helps us test explanations and solve practical problems; art gives us ways to imagine how those problems are lived and judged. Neither does the other’s work, which is why scientific progress has not made artists unnecessary.",
    readingConnection: "Twain’s account of piloting the Mississippi contrasts technical knowledge of the river with the loss of its former beauty. This response draws on that contrast while recognising the value of both ways of seeing.",
    sampleSource: { label: "IELTS Mentor · art and science sample", url: "https://www.ielts-mentor.com/writing-sample/writing-task-2/1490-ielts-writing-task-2-sample-465-what-can-arts-tell-us-about-life-that-science-cannot" }
  }
];
