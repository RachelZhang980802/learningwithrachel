// Five text-dependent prompts for readings that did not come with a question set.
// The sequence moves from retrieval through interpretation to a supported judgment.
export type NarrativeBloomQuestion = {
  level: string;
  question: string;
  answer: string;
};

export const narrativeBloomQuestions: Readonly<Record<string, readonly NarrativeBloomQuestion[]>> = {
  fat: [
    { level: "Remember", question: "Who is listening as the waitress tells this story?", answer: "Her friend Rita listens while they sit over coffee and cigarettes." },
    { level: "Understand", question: "Which details complicate the narrator’s first description of the customer as simply ‘fat’?", answer: "She also notices his neat clothes, polite speech, repeated thanks, and kindness when she spills his water." },
    { level: "Apply", question: "Which exchange would you cite to show that the waitress begins to resist the others’ mockery?", answer: "When Leander says, ‘God, he’s fat!’, she replies, ‘He can’t help it, I say, so shut up.’ Her response resists his ridicule." },
    { level: "Analyze", question: "How does the narrator’s feeling about her own body near the end connect to her encounter with the man?", answer: "After the encounter, she puts a hand on her middle and imagines being fat; later she feels enormous beside Rudy. The text links her new bodily awareness to the man, without fully explaining it." },
    { level: "Evaluate", question: "Does ‘My life is going to change’ tell us exactly what will happen? What evidence supports your reading?", answer: "No. She says she feels depressed, withholds the rest from Rita, and ends with a feeling that change is coming. The story leaves the nature of that change open." },
  ],
  flowers: [
    { level: "Remember", question: "How old is Myop, and what is she collecting in the woods?", answer: "She is ten and gathers flowers, leaves, and other plants." },
    { level: "Understand", question: "How does the mood of the woods change as Myop moves farther from home?", answer: "The warm, playful morning gives way to unfamiliar, gloomy ground and damp, close silence in the cove." },
    { level: "Apply", question: "Which detail shows that the dead man’s death was an act of violence rather than an ordinary accident?", answer: "Myop sees the rotted remains of a noose near the wild rose. Together with the body, it points to a hanging." },
    { level: "Analyze", question: "Why is the wild rose placed beside the noose?", answer: "Myop first treats the rose as another flower for her bundle; noticing the noose at its root makes beauty and violence occupy the same spot, forcing a new understanding of the place." },
    { level: "Evaluate", question: "What does ‘And the summer was over’ mean beyond the season? Use an earlier detail.", answer: "It can mark the end of Myop’s carefree innocence: earlier she moves through the fields singing and collecting flowers, but the discovery of the body and noose changes what she knows." },
  ],
  "days-wait": [
    { level: "Remember", question: "What temperature does the doctor report for Schatz?", answer: "The doctor reports 102 degrees on a Fahrenheit thermometer." },
    { level: "Understand", question: "Why does Schatz believe he is going to die?", answer: "He has heard that a temperature of 44 degrees is fatal, but he mistakes the doctor’s Fahrenheit reading for a Celsius reading." },
    { level: "Apply", question: "Which action shows that Schatz worries about other people even while frightened?", answer: "He refuses to let anyone enter his room because he does not want them to catch what he has." },
    { level: "Analyze", question: "How does the father’s ordinary account of the day differ from Schatz’s experience?", answer: "The father reads and goes hunting because the doctor says the illness is manageable; Schatz lies awake, silently waiting for what he thinks is certain death." },
    { level: "Evaluate", question: "Why does Schatz cry easily the next day? What does the final paragraph support?", answer: "After the father explains the two temperature scales, Schatz’s rigid self-control relaxes. The text suggests a release of fear and strain, rather than a worsening fever." },
  ],
  "short-story": [
    { level: "Remember", question: "Where do the soldier and Luz pray before he returns to the front?", answer: "They pray in the Duomo in Padua." },
    { level: "Understand", question: "Why do they feel married even though they have no legal marriage?", answer: "They pray together and commit to each other, but lack time for the banns and do not have their birth certificates." },
    { level: "Apply", question: "Which event first shows a gap between the couple’s plans and what they are willing to do?", answer: "After the armistice Luz insists on waiting in Italy until he has a good job, while he wants her to come to America at once; they quarrel at the station." },
    { level: "Analyze", question: "How do distance and delayed letters affect the story’s account of their relationship?", answer: "He receives Luz’s letters in a batch only after the armistice. Their devotion in the letters sits beside separation, changing plans, and the later relationship with the major." },
    { level: "Evaluate", question: "How does the final paragraph qualify the hopeful promises made earlier?", answer: "The major never marries Luz, and the soldier’s later sexual encounter ends in illness. These blunt facts undercut the couple’s earlier expectation of a secure future together." },
  ],
  "cop-anthem": [
    { level: "Remember", question: "Where does Soapy hope to spend the winter?", answer: "He wants three months on Blackwell’s Island, in jail, with food and shelter." },
    { level: "Understand", question: "Why does Soapy prefer arrest to charitable lodging?", answer: "The story says he values personal independence and dislikes the humiliating questions and obligations attached to charity." },
    { level: "Apply", question: "Name one attempt Soapy makes to be arrested that does not work.", answer: "For example, he eats at a restaurant without paying, breaks a window, or behaves noisily in public; none of these attempts brings the arrest he wants." },
    { level: "Analyze", question: "What changes when Soapy hears the church anthem?", answer: "The music recalls an earlier life and prompts him to imagine working and rebuilding it, replacing his plan to spend the winter in jail." },
    { level: "Evaluate", question: "Why is the magistrate’s final sentence ironic?", answer: "Soapy is sentenced to the Island only after he has resolved to change his life, whereas his deliberate attempts to be arrested had failed." },
  ],
  trifles: [
    { level: "Remember", question: "Where do the investigators search for clues to John Wright’s death?", answer: "They search the Wright farmhouse, especially its kitchen and rooms upstairs; the women remain with the household things in the kitchen." },
    { level: "Understand", question: "Why do the men dismiss the kitchen objects?", answer: "They regard preserves, sewing, and other domestic details as unimportant ‘trifles’ rather than evidence about the crime." },
    { level: "Apply", question: "Which two household clues would support an inference that Minnie was distressed?", answer: "The uneven stitching and damaged birdcage are two such clues; the dead bird found later gives the cage greater significance." },
    { level: "Analyze", question: "How does the dead bird connect Minnie’s past to the crime?", answer: "Mrs. Hale remembers Minnie as birdlike before marriage. The bird’s broken neck suggests the loss of the singing life associated with her, and helps the women understand her situation." },
    { level: "Evaluate", question: "What choice do the women make at the end, and what evidence makes that choice morally difficult?", answer: "They conceal the dead bird. It may protect a woman whose isolation the men ignore, but it also withholds evidence in a murder investigation; the play leaves readers to weigh both facts." },
  ],
};
