import type { ReactNode } from "react";
import type { QuizCategory, QuizExercise } from "./article01QuizData";
import { Unit4FillBlanks, Unit4ReadingOutline, Unit4VerbChoices } from "./Unit4QuizInteractions";

type Row = { prompt: ReactNode; answer: ReactNode; title?: string; instruction?: string };
const make = (title: string, prompt: ReactNode, answer: ReactNode, instruction?: string): QuizExercise => ({ title, prompt, answer, instruction });
const inline = (title: string, prompt: ReactNode, instruction: string): QuizExercise => ({ title, prompt, instruction, answer: null, selfManagedAnswers: true });
const block = (content: ReactNode) => <blockquote className="quiz-question-card">{content}</blockquote>;
const rowSet = (prefix: string, rows: Row[], instruction: string): QuizExercise[] =>
  rows.map((row, index) => make(row.title || (prefix + " · " + String(index + 1).padStart(2, "0")), block(row.prompt), row.answer, row.instruction || instruction));
const tfSet = (rows: Array<[string, string]>) => rowSet("True or false", rows.map(([prompt, answer]) => ({ prompt: <>{prompt}</>, answer: <p>{answer}</p> })), "Decide whether the statement is true or false according to the text.");
const folderColors = ["#c6d4c8", "#e4c4bc", "#ccd5de", "#d6cee1", "#e6d2bd", "#e6c5b1", "#cdc0b7"] as const;
const folder = (id: string, label: string, colorIndex: number, exercises: QuizExercise[]): QuizCategory => ({
  id,
  label,
  color: folderColors[colorIndex],
  exercises,
});

type UnitData = {
  analytical: QuizExercise[];
  vocabulary: QuizExercise[];
  paraphrasing: QuizExercise[];
  prepositions: QuizExercise[];
  grammar: QuizExercise[];
  translation: QuizExercise[];
};

const unit4: UnitData = {
  analytical: [
    inline("Reading outline", <Unit4ReadingOutline />, "The following outline presents an overview of the text. Fill in the blanks to complete the outline."),
    ...tfSet([
      ["The draft report submitted to the European Parliament suggests that only robot owners should establish a basic income, or a guaranteed welfare program.", "False. The report suggests taxing owners or contributing to social security if advanced robots replace workers; it also mentions a basic-income or welfare program."],
      ["Robots, in Kumar Sachidanandam’s opinion, are tools that replace humans in doing work.", "True. He describes robots as tools that can make work easier, faster, better, or cheaper."],
      ["A lot of weavers lost jobs because of the appearance of factories, which resulted in the breakup of countless families.", "False. The passage says workers lost jobs; it does not say factories broke up families."],
      ["Having more kids in a family was a sign of prosperity when muscle power was strength.", "True."],
      ["According to Bill Gates, spare human capacity will bring about more unemployment.", "False. Gates says spare capacity has been put to better use in education and research."],
      ["Sachidanandam thinks that robots are both job destroyers and job creators.", "True. Automation can eliminate jobs and create different kinds of jobs."],
    ]),
    ...rowSet("Close reading", [
      { prompt: "How is the idea of universal income and taxing robots being received?", answer: <p>This idea is gaining ground./This idea is developing successfully.</p> },
      { prompt: "What point does Sachidanandam intend to illustrate with the example of textile factory workers and handloom weavers?", answer: <p>The example illustrates that machines make a lot of people lose jobs but their children learn new skills to stay relevant.</p> },
      { prompt: "In Para. 4, Sachidanandam writes, “But there will always be a lag and some population will be left behind.” Who will be left behind?", answer: <p>People who don’t learn new knowledge and skills.</p> },
      { prompt: "What, according to Sachidanandam, are the side effects of automation?", answer: <p>A lower birth rate, more single people, lower marriage rates, more married couples with no kids, etc.</p> },
      { prompt: "Why does Sachidanandam think that an older population may not be as bad as we think?", answer: <p>Because in the resource-constrained world which our future generation will live in, conservation of resources will take place.</p> },
      { prompt: "As a writing technique, a rebuttal generally attempts to weaken counter-arguments by showing that they are unacceptable, insignificant, or even absurd. In Para. 7, Sachidanandam first lays out Bill Gates’ point and then proves it wrong. Could you find another example of rebuttal in Para. 8?", answer: <p>In Para. 8, the author lays out Bill Gates’ first point that robots don’t get paid and hence result in lower taxes for the government. Then he proves that Bill Gates is wrong because: 1) the use of robots also leads to higher profits for corporations, which pay higher taxes; 2) there is a cost to making robots and investing in such technologies, which creates a different kind of jobs, different levels of salaries and different taxes.</p> },
      { prompt: "How does Sachidanandam comfort those who complain about the fast speed of the changes brought about by robots?", answer: <p>The author reminds the complainers of the speed at which the horses were replaced by the railroads, cars and trucks; the speed at which passenger ships were replaced by airlines. He emphasizes that these were huge job destroyers and also job creators of the other type.</p> },
      { prompt: "In your opinion, what should we do to meet the challenge of robots?", answer: <p>Policy makers should try to help existing workers acquire new skills. And the future generations must be prepared for a workplace populated by robots that will continue to develop and take on new tasks.</p> },
    ], "Answer the following questions."),
  ],
  vocabulary: [
    ...rowSet("Context clues", [
      { prompt: <>I felt sick as our ship was sailing along the <mark>________ river</mark>, which was shaded by tall trees on both sides.</>, answer: <p><strong>tortuous</strong> — winding and twisting; full of turns.</p> },
      { prompt: <>He seems perfectly <mark>________</mark> except for the wild statements he keeps making.</>, answer: <p><strong>lucid</strong> — clear and easy to understand.</p> },
      { prompt: <>The birds have to be protected from foxes and other <mark>________</mark>.</>, answer: <p><strong>predators</strong> — animals that hunt and feed on other animals.</p> },
      { prompt: <>To make the <mark>________ soup</mark> more tasty, she put some spices in it.</>, answer: <p><strong>bland</strong> — tasteless or lacking a strong flavor.</p> },
      { prompt: <>A lack of qualified teachers will have <mark>________ effects</mark> on education in rural areas.</>, answer: <p><strong>adverse</strong> — harmful or unfavorable.</p> },
    ], "Complete each sentence with a word from this bank and use the context clues: tortuous · lucid · predators · bland · adverse."),
    ...rowSet("Word bank", [
      { prompt: <>Thousands of people signed on the initiative <mark>________</mark> all products made of animals’ furs.</>, answer: <p><strong>boycotting</strong></p> },
      { prompt: <>It is required that all applications be <mark>________</mark> by Tuesday.</>, answer: <p><strong>submitted</strong></p> },
      { prompt: <>The economic gap between the two parts of the country was <mark>________</mark>.</>, answer: <p><strong>narrowed</strong></p> },
      { prompt: <>Over the past five years, he has <mark>________</mark> from a small boy into a responsible man.</>, answer: <p><strong>transformed</strong></p> },
      { prompt: <>My tutor recommended that I <mark>________</mark> my point further in my essay.</>, answer: <p><strong>amplify</strong></p> },
      { prompt: <>The movie star’s popularity has <mark>________</mark> to an all-time low in recent weeks.</>, answer: <p><strong>plummeted</strong></p> },
      { prompt: <>The audience repeatedly <mark>________</mark> the President’s news conference, calling him a liar and a fascist.</>, answer: <p><strong>disrupted</strong></p> },
      { prompt: <>Human employment opportunities are now <mark>________</mark> by the use of robots.</>, answer: <p><strong>constrained</strong></p> },
    ], "Complete the sentence with a word from the bank; change its form where necessary. Bank: submit · boycott · transform · narrow · plummet · constrain · amplify · disrupt."),
  ],
  paraphrasing: rowSet("Replace the bold phrase", [
    { prompt: <>The news of Wilbur’s escape <mark>spread rapidly</mark> among the animals on the farm.</>, answer: <p>The news of Wilbur’s escape <strong>went viral</strong> among the animals on the farm.</p> },
    { prompt: <>Artificial intelligence is <mark>developing quickly</mark> in the field of Internet.</>, answer: <p>Artificial intelligence is <strong>gaining ground</strong> in the field of the Internet.</p> },
    { prompt: <>Despite our financial difficulties, we <mark>donated</mark> $2,000 to the disaster relief fund last year.</>, answer: <p>Despite our financial difficulties, we <strong>contributed</strong> $2,000 to the disaster relief fund last year.</p> },
    { prompt: <>If we give up the chance, <mark>many other countries will develop much faster than us</mark>.</>, answer: <p>If we give up the chance, we will be <strong>left behind by many other countries</strong>.</p> },
    { prompt: <>The old man <mark>experienced</mark> a very difficult time after his wife died.</>, answer: <p>The old man <strong>went through</strong> a very difficult time after his wife died.</p> },
    { prompt: <>As an English major, you will be able to <mark>make good use of</mark> the language in various new jobs.</>, answer: <p>As an English major, you will be able to <strong>put the language to good use</strong> in various new jobs.</p> },
    { prompt: <>Funding <mark>will be distributed more toward</mark> compulsory education this year.</>, answer: <p>Funding will be <strong>skewed toward</strong> compulsory education this year.</p> },
  ], "Replace the bold part with a word or expression from the text. Make changes where necessary."),
  prepositions: [],
  grammar: [
    inline("Subject–verb concord · choose the verb", <Unit4VerbChoices />, "Choose an appropriate verb form from the brackets, giving two answers where possible."),
    inline("Subject–verb concord · complete the passage", <Unit4FillBlanks prefix="u4-concord-passage" content={<div className="quiz-question-card"><p>Can AI be smarter than a person? Answering that question often (1) ______ (depend) on the definition of AI. But it might make more sense, instead, to focus on defining what we mean by “smart.”</p><p>In the 1950s, in terms of the categories of creative thought, the psychologist J. P. Guilford said there (2) ______ (be) convergent thinking and divergent thinking. Convergent thinking, which Guilford defined as the ability to answer questions correctly, (3) ______ (be) predominantly a display of memory and logic. Divergent thinking, the ability to generate many potential answers from a single problem or question, (4) ______ (show) a flair for curiosity, an ability to think “outside the box.”</p><p>When most people think of AI’s relative strengths over humans, they think of its convergent intelligence. With superior memory capacity and processing power, computers (5) ______ (outperform) people at rules-based games, complex calculations, and data storage. What computers lack, some might say, (6) ______ (be) any form of imagination, or rule-breaking curiosity—that is, divergence. But what if that common view is wrong? What if AI’s real comparative advantage over humans (7) ______ (be) precisely its divergent intelligence—its creative potential?</p></div>} answers={["depends", "were", "is", "shows", "outperform", "is", "is"].map(answer => ({ answer }))} />, "Fill in the blanks with the appropriate form of the words in brackets."),
  ],
  translation: [
    ...rowSet("English → Chinese", [
      { prompt: "This idea of universal income and taxing robots is gaining ground. (Para. 2)", answer: <p lang="zh-CN">这种关于基本收入和向机器人征税的设想正在普及。</p> },
      { prompt: "The establishment of a basic income, or guaranteed welfare program, is also suggested as a protection against human unemployment. (Para. 2)", answer: <p lang="zh-CN">本报告也建议建立一个基本收入或福利保障计划，以此来应对人类失业问题。</p> },
      { prompt: "During each of these stages, there were a lot of people who lost their jobs and the next generation learned new skills to stay relevant. (Para. 3)", answer: <p lang="zh-CN">在每一个阶段都有很多人失业，而他们的下一代学会了新的技能，从而可以与时俱进。</p> },
      { prompt: "Now that the factories are getting closed and replaced with robots, factory workers’ kids might become knowledge workers. (Para. 4)", answer: <p lang="zh-CN">现在工厂正被机器人取代而面临关闭，工人的孩子们可能就会成为知识型工人。</p> },
      { prompt: "But what we fail to see is that, this also leads to higher profits for corporations, which pay higher taxes. (Para. 8)", answer: <p lang="zh-CN">但我们没有意识到的是，企业利润也随之增加，企业需要缴纳的税款也增加了。</p> },
    ], "Translate the sentence into Chinese, then compare with the Chinese reference answer."),
    make("Chinese → English", <p lang="zh-CN" className="quiz-question-card">是否应该对机器人收税？比尔·盖茨支持这一观点。一份提交给（submit to）欧洲议会的报告也指出，机器人的主人应该交税或者向社保捐助（contribute to）。另一种观点则认为机器人使我们的生活变得更加轻松。而且，尽管自动化（automation）带来了一些副作用（side effect），但它提高了公司利润，从而为政府增加了税收。与此同时，机器人既是工作的破坏者，也是新行业里工作的创造者。</p>, <p>Should the robots be taxed? Bill Gates suggests that robots should be taxed. A report submitted to the European Parliament also states that robots’ owners should pay taxes or contribute to social security. However, some people hold that robots are tools that make our life easier. Moreover, despite the side effects automation brings about, it creates higher profits for corporations, which pay higher taxes for the government. Meanwhile, robots are both job destroyers and creators in new industry.</p>, "Translate the passage into English using the words and expressions in brackets."),
  ],
};

const unit5: UnitData = {
  analytical: [
    make("Match the events", <ol><li>Before World War I</li><li>When Apple was in elementary school</li><li>During Apple’s college days</li><li>In the late 1960s</li><li>Later, after Apple finished his studies</li><li>When Apple was depressed</li><li>About two years later</li><li>At the age of 107</li></ol>, <ol><li>C</li><li>A</li><li>F</li><li>B</li><li>D</li><li>E</li><li>G</li><li>H</li></ol>, "Match each time expression with the event: A. Apple and his grandfather shared a house, and Apple taught his grandfather things such as electricity; B. Grandfather joined him as a roommate at the University of Michigan; C. Grandfather came to the U.S. from Lithuania; D. Grandfather moved to Houston; E. Grandfather cared for the family; F. Apple and Grandfather were temporarily separated while Apple had college roommates; G. Apple regained faith in life; H. Grandfather passed away."),
    ...tfSet([
      ["Apple was still a boy three years ago when he shared a house with his grandfather.", "False. He says that until three years ago, relative to his grandfather, he was still a boy; his grandfather had died."],
      ["Apple grabbed the lawn mower from his grandfather’s hand and, with it, his energy.", "False. He could take the mower but could not take away his grandfather’s extraordinary energy."],
      ["Apple’s grandfather suffered a lot when he was young, which made him bitter even when he recalled those experiences years later.", "True. His angry sleep-talking reveals the painful experiences and old hatred he carried."],
      ["As an immigrant, Apple’s grandfather received poor education, and Apple became his teacher as he worked at a primary school.", "False. “The emissary of elementary school” describes how Apple felt about teaching him; it does not mean Apple worked at a primary school."],
      ["Apple’s grandfather had no sympathy for Apple’s ill wife, and he didn’t understand Apple’s depression either.", "False. He did not fully understand the illness or Apple’s depression, but he actively helped care for the family."],
      ["Apple’s grandfather was a man of action, and he instilled a sense of hope in his grandson.", "True. His steady daily actions helped Apple recover his faith in life."],
    ]),
    ...rowSet("Close reading", [
      { prompt: "What is Apple’s understanding of himself “in the cycle of life” after the death of his grandfather?", answer: <p>Apple realizes that growing up and becoming a caregiver came late for him. He had long been a child in relation to his grandfather, who remained energetic and caring until the end of his life.</p> },
      { prompt: "Apple says his grandfather was not “a gentle old soul.” How does the text support this?", answer: <p>He argued in the synagogue, shouted at bakery coworkers, loved strife, and exploded in angry sleep-talk about his enemies.</p> },
      { prompt: "What does Apple mean by “Our only serious problem was what he called my laziness”? What does it tell us about their relationship?", answer: <p>Apple was studying for Ph.D. exams on a couch, but his grandfather thought he was being lazy. It shows a generational gap and their different ideas about work, alongside their closeness.</p> },
      { prompt: "How does the grandfather’s image in the first paragraphs differ from the image in the latter half?", answer: <p>At first he seems fiery, combative, and loud. Later he appears patient, devoted, and quietly caring, especially when Apple’s family faces illness and depression.</p> },
      { prompt: "What writing technique makes the grandfather a round character?", answer: <p>Contrast. The author sets the grandfather’s anger against his tenderness, and his forceful temperament against his calm, practical response to family tragedy.</p> },
      { prompt: "What effect does the use of flashbacks achieve?", answer: <p>Flashbacks gradually reveal the grandfather’s history and personality, keep his memory alive, and make the reader curious about how the past shaped him.</p> },
      { prompt: "What does the title “Roommates” mean? Could it be replaced by “Grandfather”?", answer: <p>The title stresses that the grandfather was Apple’s companion throughout life, sharing a home and teaching him how to live and recover. “Grandfather” would lose this sense of companionship and the unusual closeness between them.</p> },
      { prompt: "How does the story help you understand family love? What is your view of young people wanting to live far from their families?", answer: <p>Open-ended. A model response: Love can be expressed through steady care and action across generations. Young people may need independence, while still maintaining meaningful ties and mutual support with family.</p> },
    ], "Answer the reading question, then compare your response with the teacher’s model."),
  ],
  vocabulary: [
    ...rowSet("Verb-forming prefix", [
      { prompt: <>What does the prefix <mark>be-</mark> mean? Use one word from <em>befriend, becloud, belittle, benumb</em> in a sentence.</>, answer: <p><strong>Meaning:</strong> to make or cause to be. <strong>Model:</strong> They befriended me when I first arrived in London as a student.</p> },
      { prompt: <>What does <mark>en-/em-</mark> mean? Use one word from <em>enlarge, endanger, embody, empower</em>.</>, answer: <p><strong>Meaning:</strong> to put into or cause to become. <strong>Model:</strong> A good way to enlarge your vocabulary is to read a daily newspaper.</p> },
      { prompt: <>What does <mark>un-</mark> mean? Use one word from <em>unload, uncover, undress, unveil</em>.</>, answer: <p><strong>Meaning:</strong> to reverse or do the opposite. <strong>Model:</strong> The driver unloaded some boxes from the back of the truck.</p> },
      { prompt: <>What does <mark>up-</mark> mean? Use one word from <em>update, upscale, uplift, upgrade</em>.</>, answer: <p><strong>Meaning:</strong> to increase or improve. <strong>Model:</strong> Can you update me on what’s been happening?</p> },
      { prompt: <>What does <mark>out-</mark> mean? Use one word from <em>outnumber, outweigh, outsmart, outgrow</em>.</>, answer: <p><strong>Meaning:</strong> to surpass or exceed. <strong>Model:</strong> Flats outnumber houses in this area.</p> },
    ], "Explain the verb-forming prefix, then write a sentence using a word from the group."),
    ...rowSet("Word bank", [
      { prompt: <>Please <mark>________</mark> us of your decision and we will act accordingly.</>, answer: <p><strong>inform</strong></p> },
      { prompt: <>We’ve decided to change the design based on our <mark>________</mark> findings.</>, answer: <p><strong>preliminary</strong></p> },
      { prompt: <>Shopping malls, schools, and hospitals have <mark>________</mark> up across the city in recent years.</>, answer: <p><strong>sprouted</strong></p> },
      { prompt: <>The kids stopped for a split second, slightly alarmed by the sudden <mark>________</mark> of noise.</>, answer: <p><strong>outburst</strong></p> },
      { prompt: <>He is desperate to <mark>________</mark> us that he believes in the rightness of his actions.</>, answer: <p><strong>convince</strong></p> },
      { prompt: <>He is the last member of a(n) <mark>________</mark> tradition and a legend by himself.</>, answer: <p><strong>glorious</strong></p> },
      { prompt: <>She knew that the girls used to <mark>________</mark> her and laugh at her behind her back.</>, answer: <p><strong>imitate</strong></p> },
      { prompt: <>You cannot build a skyscraper without a(n) <mark>________</mark> foundation, strong steel, and good building materials.</>, answer: <p><strong>solid</strong></p> },
    ], "Complete the sentence with a word from the bank; change its form where necessary. Bank: inform · preliminary · sprout · outburst · convince · solid · glorious · imitate."),
  ],
  paraphrasing: rowSet("Replace the bold phrase", [
    { prompt: <>In some industries, women’s earnings are still low <mark>compared with</mark> men’s.</>, answer: <p>In some industries, women’s earnings are still low <strong>in relation to</strong> men’s.</p> },
    { prompt: <>The lions spend much of the day sleeping, conserving <mark>physical strength</mark> for hunting.</>, answer: <p>The lions spend much of the day sleeping, conserving <strong>energy</strong> for hunting.</p> },
    { prompt: <>As a new employee, she had difficulty in doing even the most <mark>basic</mark> tasks.</>, answer: <p>As a new employee, she had difficulty in doing even the most <strong>elementary</strong> tasks.</p> },
    { prompt: <>The patterns look very similar, but there are <mark>slight</mark> differences between them.</>, answer: <p>The patterns look very similar, but there are <strong>subtle</strong> differences between them.</p> },
    { prompt: <>Some tribes still <mark>live in</mark> remote mountains and jungles of the country.</>, answer: <p>Some tribes still <strong>inhabit</strong> remote mountains and jungles of the country.</p> },
    { prompt: <>The department has created a <mark>pleasant</mark> atmosphere for research.</>, answer: <p>The department has created a <strong>congenial</strong> atmosphere for research.</p> },
    { prompt: <>Your application form should <mark>emphasize</mark> your skills and achievements.</>, answer: <p>Your application form should <strong>underline</strong> your skills and achievements.</p> },
    { prompt: <>At sixteen she <mark>suffered from</mark> typhoid fever, which took her a long time to get over.</>, answer: <p>At sixteen she was <strong>stricken with</strong> typhoid fever, which took her a long time to get over.</p> },
  ], "Replace the bold phrase with a word or expression from the text. Make changes where necessary."),
  prepositions: [],
  grammar: [
    make("Past tense in flashbacks · complete the passage", <p>That morning, when Joe refused to take the regular way to campus and insisted on taking a detour again, I suddenly realized why: There was a hospital on the regular way. It was in 1969. Joe had spent the entire month of July in hospital, at his grandma’s bedside. Her long fingers had felt like bones bundled in thin silk, and they offered no resistance when he (1) ______ (squeeze) them. When at last he (2) ______ (feel) some slight pressure, he watched her face. She opened her eyes and (3) ______ (meet) his gaze before her face muscles (4) ______ (contract). Joe (5) ______ (watch) a vein below her ear pulse like the heart of a frightened bird. Even when her breathing (6) ______ (stop), the pulse (7) ______ (beat) on. He watched it until it went still and all the lines on her face (8) ______ (smooth) away, and then he (9) ______ (lay) her hand atop the sheet. It (10) ______ (be) time, he thought, to get past all that.</p>, <ol><li>squeezed</li><li>felt</li><li>met</li><li>contracted</li><li>watched</li><li>stopped</li><li>beat</li><li>smoothed</li><li>laid</li><li>was</li></ol>, "Fill in the blanks with the appropriate form of the words in brackets."),
    ...rowSet("Rewrite with a gerund", [
      { prompt: "Diana admitted that she felt hurt by what I had said.", answer: <p>Diana admitted <strong>feeling hurt</strong> by what I had said.</p> },
      { prompt: "I regret that I have wasted a lot of time.", answer: <p>I regret <strong>having wasted</strong> a lot of time.</p> },
      { prompt: "He insisted that he shouldn’t accept the present.", answer: <p>He insisted on <strong>not accepting</strong> the present.</p> },
      { prompt: "Do you mind if we use your dictionary?", answer: <p>Do you mind <strong>our using</strong> your dictionary?</p> },
      { prompt: "We were late, so Father suggested that we should take a taxi.", answer: <p>We were late, so Father suggested <strong>taking</strong> a taxi.</p> },
      { prompt: "I recall that we passed several boring hours in the California desert under dense, unbroken clouds before giving up.", answer: <p>I recall <strong>our passing</strong> several boring hours in the California desert under dense, unbroken clouds before giving up.</p> },
      { prompt: "She could imagine that the dark-robed figures moved silently along the stone corridors.", answer: <p>She could imagine dark-robed figures <strong>moving</strong> silently along the stone corridors.</p> },
    ], "Rewrite the sentence using a gerund."),
  ],
  translation: [
    ...rowSet("English → Chinese", [
      { prompt: "I usually wrestled the mower from his grip, but his extraordinary energy I took for granted. (Para. 1)", answer: <p lang="zh-CN">我常常费力夺走他紧握着的割草机，但是夺不走我已经习以为常的他旺盛的精力。</p> },
      { prompt: "Cushioned by his puffs of breath, visions of destruction crowded our room. (Para. 4)", answer: <p lang="zh-CN">恐怖的往事一幕幕涌进我们的房间，伴随着祖父的呼吸声才稍有缓和。</p> },
      { prompt: "My solid life cracked in a matter of months, when my wife was stricken with a terrible neurologic disease. (Para. 9)", answer: <p lang="zh-CN">当我的妻子患上可怕的神经性疾病，几个月间，我平静安稳的生活分崩离析。</p> },
      { prompt: "I could not scream out my anger as my grandfather did in his sleep. Instead, I turned it against myself, and it settled in my bones as depression. (Para. 9)", answer: <p lang="zh-CN">我不能像祖父那样，在睡梦中大声发泄我的愤怒。相反，我把愤怒转向自己，抑郁沉积入骨。</p> },
      { prompt: "Although by then he must have been wearing the shadow of death as an undershirt, the aroma of life stayed in his nostrils. (Para. 10)", answer: <p lang="zh-CN">尽管那时，他一定已经笼罩在死亡的阴影之下，他的鼻息依然充满生命的芬芳。</p> },
    ], "Translate into Chinese, then compare with the Chinese reference answer."),
    make("Chinese → English", <p lang="zh-CN" className="quiz-question-card">我的祖父是一位犹太移民。祖父 64 岁那年，我出生了，从此我们的生命就紧密连结在一起。我们成了室友，直到我上大学，我们才短暂分离。研究生期间，我拥有了自己的公寓，祖父于是又和我住在一起。等我完成学业、结婚、生子、安顿（settle）下来后，祖父再次成为我的室友。我决定照顾他的晚年，但灾难来袭，我的妻子患上重病（stricken with），我的世界分崩离析（crack），自己也深陷抑郁（depression）。年届 103 岁的祖父默默地照顾这个家庭。两年之后，我终于重拾对生活的信心。祖父劳作不休，直至生命终结，而我也对自己在生命循环中的意义有了更深刻的理解。</p>, <p>My grandfather was a Jewish immigrant. At my birth he was 64, and there had been a special bond between us from that moment on. We had been roommates and were never separated until I went to college. In graduate school I had my own apartment, and my old roommate joined me. After I finished my studies, married, had children, and settled down, Grandfather joined us and we became roommates again. I intended to help him in the last years of his life. But tragedy struck: my wife was stricken with a serious illness, my world cracked, and I sank into depression. At 103, Grandfather quietly took care of the family. Two years later, I regained faith in life. My grandfather worked until he died, and I came to understand more deeply what my place in the cycle of life meant.</p>, "Translate the passage into English using the words and expressions in brackets."),
  ],
};

const unit7: UnitData = {
  analytical: [
    make("Text outline", <p>Complete the outline: I · paragraphs 1–2: “As usual, James Saxon travels by train in his corner seat”; II · paragraphs 3–7; III · paragraphs 8–13.</p>, <ol><li>II · Matti observes James and assumes he is a typical Englishman.</li><li>III · What Matti learns about James is far from what he imagined.</li></ol>, "Fill in the missing paragraph range and main ideas."),
    ...tfSet([
      ["James always reaches the station at fourteen minutes past five by the station clock so as to catch the 5:24 train.", "False. He arrives at ten past five."],
      ["Matti decides James is a typical Englishman because he has an umbrella, a bowler hat, and a moustache.", "False. Matti doubts that James is typical: he wears no hat, is clean-shaven, and has other features that contradict the stereotype."],
      ["James’s clothes are very smart, and his trousers are well pressed.", "False. His clothes are old-fashioned and far from smart."],
      ["James has a Rolls-Royce and a private aeroplane, but he prefers travelling by train.", "True."],
      ["James takes no interest in cricket because his father and mother are both Finns.", "True. James jokes that his Finnish parents may explain his lack of interest in cricket."],
      ["Finns are reserved and usually spend their leisure time digging, weeding, mowing the lawn, or painting the tool shed.", "False. Matti’s imagined descriptions are stereotypes; these details are what James says he expects Matti to do."],
    ]),
    ...rowSet("Close reading", [
      { prompt: "What is the traffic like in a provincial town during rush hour?", answer: <p>It is not very busy, though plenty of people are moving about.</p> },
      { prompt: "Why does James want to catch the 5:24 train when there is an earlier one at 5:14?", answer: <p>He wants his usual corner seat, where he can read his newspaper and ignore the hurried crowds.</p> },
      { prompt: "How is Matti’s attention attracted to James?", answer: <p>The train is packed. Matti and James sit face to face in the corner seats, and James is the only person Matti can see clearly.</p> },
      { prompt: "What evidence first makes Matti decide that James is probably a typical Englishman?", answer: <p>James carries a neatly rolled umbrella, seems reserved, and shows little interest in the people around him.</p> },
      { prompt: "What contributes to Matti’s assumption that James is a poorly-paid clerk or workman?", answer: <p>James wears an old but well-brushed suit, dull old-fashioned shoes, and carries an old briefcase.</p> },
      { prompt: "How is James different from Matti’s assumption?", answer: <p>James is wealthy, owns about two million pounds’ worth of property, controls 42 local factories, is a bachelor in a luxury flat, and is a naturalized British citizen born to Finnish parents.</p> },
      { prompt: "Matti is Finnish. Why doesn’t he find anything Finnish in James?", answer: <p>He judges James through national stereotypes and expects Finns to look and behave in a narrow, predictable way.</p> },
      { prompt: "How do stereotypes influence Matti’s assumptions? What can help challenge stereotypes in cross-cultural communication?", answer: <p>He interprets each detail as proof of a national character instead of learning about James as an individual. Curiosity, direct communication, and checking assumptions against evidence can help challenge stereotypes.</p> },
    ], "Answer the reading question, then compare your response with the teacher’s model."),
  ],
  vocabulary: [
    ...rowSet("Adjective-forming suffix", [
      { prompt: "I don’t think I’m ______ of your success. (envy)", answer: <p><strong>envious</strong></p> },
      { prompt: "Can you show me how to find some books on ______ management? (industry)", answer: <p><strong>industrial</strong></p> },
      { prompt: "He’s been in a lot of trouble—the list is ______. (end)", answer: <p><strong>endless</strong></p> },
      { prompt: "Further building can continue when money is made ______. (avail)", answer: <p><strong>available</strong></p> },
      { prompt: "When you come to Spain we’ll play ______ music, sing, and dance. (Spain)", answer: <p><strong>Spanish</strong></p> },
      { prompt: "This has been my worst time for injuries since I started as a(n) ______ player. (profession)", answer: <p><strong>professional</strong></p> },
      { prompt: "For the more ______ tourists, there are trips into the mountains with a local guide. (adventure)", answer: <p><strong>adventurous</strong></p> },
      { prompt: "This job is so boring. I wish I could do something more ______. (create)", answer: <p><strong>creative</strong></p> },
      { prompt: "These fish are highly ______ in color and pattern. (vary)", answer: <p><strong>variable</strong></p> },
      { prompt: "Many people love Los Angeles for its warm ______ weather. (sun)", answer: <p><strong>sunny</strong></p> },
    ], "Fill in each blank with the adjective form of the word in brackets."),
    ...rowSet("Word bank", [
      { prompt: "That shy, ______ young man had turned into a confident adult.", answer: <p><strong>reserved</strong></p> },
      { prompt: "His eyes were an astonishing blue and his ______ was reddish from a life spent mostly at sea.", answer: <p><strong>complexion</strong></p> },
      { prompt: "If there is time and he has any energy left, Bill will also do some ______.", answer: <p><strong>gardening</strong></p> },
      { prompt: "Often the results are wrong, inadequate, untrustworthy, ______, and self-serving.", answer: <p><strong>unreliable</strong></p> },
      { prompt: "Jane’s black hair was ______ down the middle.", answer: <p><strong>parted</strong></p> },
      { prompt: "A large number of the telegraph lines were going in all directions, as ______ as the vines that grapes grow on.", answer: <p><strong>crooked</strong></p> },
      { prompt: "She was a real beauty, with dark eyes and ______ skin.", answer: <p><strong>fair</strong></p> },
      { prompt: "All the children’s relatives and friends were ______ into the tiny theater.", answer: <p><strong>packed</strong></p> },
      { prompt: "Khan is a(n) ______ U.S. citizen who emigrated from Pakistan for college at the age of 16.", answer: <p><strong>naturalized</strong></p> },
      { prompt: "Her skin was drawn tight over her sunken face, her cheeks sucked deep into her mouth, her eyes ______.", answer: <p><strong>bulging</strong></p> },
    ], "Complete each sentence with a word from the bank; change its form where necessary. Bank: reserve · fair · parting · crooked · bulge · pack · complexion · naturalise · garden · unreliable."),
  ],
  paraphrasing: rowSet("Replace the bold phrase", [
    { prompt: "Service is frequent, with trains running every 7 minutes at <mark>the time of day when the traffic is heavy</mark>.", answer: <p>Service is frequent, with trains running every 7 minutes at <strong>rush hour</strong>.</p> },
    { prompt: "Doctors <mark>tried every means</mark> to save him, but he died just before dawn <mark>in spite of their efforts</mark>.", answer: <p>Doctors <strong>tried in vain</strong> to save him. He died just before dawn.</p> },
    { prompt: "We believe this <mark>will be very likely</mark> to change in the coming decades.", answer: <p>We believe this <strong>may well</strong> change in the coming decades.</p> },
    { prompt: "He was <mark>really concentrating on</mark> eating, and his blond, straight hair fell forward over his forehead.", answer: <p>He was <strong>absorbed in</strong> eating, and his blond, straight hair fell forward over his forehead.</p> },
    { prompt: "He is <mark>not unusually intelligent</mark>, but he works twice as hard as others.", answer: <p>He is of <strong>average intelligence</strong>, but he works twice as hard as others.</p> },
    { prompt: "The salesclerk was <mark>not in the least</mark> helpful.", answer: <p>The salesclerk was <strong>anything but</strong> helpful.</p> },
    { prompt: "Sorry, I’m not feeling well today. I don’t <mark>have a desire for</mark> going out tonight.", answer: <p>Sorry, I’m not feeling well today. I don’t <strong>feel like</strong> going out tonight.</p> },
  ], "Replace the bold phrase with a word or expression from the text. Make changes where necessary."),
  prepositions: [],
  grammar: [
    make("Simple present tense · complete the story", <p>Joshua must be old but nobody ever (1) ______ (think) of what his age might be. He (2) ______ (be) so very much alive. He (3) ______ (go) to the city every day and (4) ______ (come) back early every afternoon. As he so seldom (5) ______ (talk) about himself, nobody (6) ______ (know) exactly what he (7) ______ (do) except that it (8) ______ (have) to do with books and small print.<br /><br />It (9) ______ (be) a bright summer day in 1947. My father, a fat, funny man with beautiful eyes, is trying to decide which of his eight children he will take with him to the county fair. My mother, of course, will not go. She (10) ______ (knock out) from getting most of us ready: I (11) ______ (hold) my neck stiff against the pressure of her fingers as she hastily (12) ______ (complete) the braiding of my hair…</p>, <ol><li>thinks</li><li>is</li><li>goes</li><li>comes</li><li>talks</li><li>knows</li><li>does</li><li>has</li><li>is</li><li>is knocked out</li><li>hold</li><li>completes</li></ol>, "Fill in the blanks with the appropriate form of the words or expressions in brackets."),
    ...rowSet("Wh-word + infinitive", [
      { prompt: "The general manager hasn’t decided whether he should take him on.", answer: <p>The general manager hasn’t decided <strong>whether to take</strong> him on.</p> },
      { prompt: "The teacher didn’t know who she would blame as it happened while she was out.", answer: <p>The teacher didn’t know <strong>who to blame</strong> as it happened while she was out.</p> },
      { prompt: "Do you remember when you’ll switch off the machine?", answer: <p>Do you remember <strong>when to switch off</strong> the machine?</p> },
      { prompt: "I was shocked to hear that, and for a moment, I wondered what I could say to him.", answer: <p>I was shocked to hear that, and for a moment, I wondered <strong>what to say</strong> to him.</p> },
      { prompt: "The moment I got into the room, somebody came to me and asked where he could sit.", answer: <p>The moment I got into the room, somebody came to me and asked <strong>where to sit</strong>.</p> },
    ], "Rewrite the sentence using a wh-word followed by an infinitive."),
  ],
  translation: [
    ...rowSet("English → Chinese", [
      { prompt: "Thousands of people are packed tightly in trains, the men’s faces buried in their evening papers while women try in vain to knit. (Para. 1)", answer: <p lang="zh-CN">成千上万的人挤在火车里，男人们的脸埋在晚报里，女人们则在徒劳地编织。</p> },
      { prompt: "But he is only of average height and his hair is not fair, but as dark as that of an Italian, and curly, with almost no parting. (Para. 5)", answer: <p lang="zh-CN">但他只是中等身材，头发不是浅色的，而是和意大利人的发色一样黑，是卷发，而且几乎没有分缝。</p> },
      { prompt: "He keeps far too many things in his pockets, so his suit looks badly out of shape. (Para. 6)", answer: <p lang="zh-CN">他口袋里装的东西太多了，所以他的西装看起来变形严重。</p> },
      { prompt: "Near it there stands another car, a magnificent Rolls-Royce, and a handsome, uniformed chauffeur is holding the door open while James Saxon steps in. (Para. 8)", answer: <p lang="zh-CN">车旁边停着另一辆车，一辆豪华的劳斯莱斯。当詹姆斯·萨克森走进车里时，一位帅气的、穿着制服的司机为他把门打开。</p> },
      { prompt: "He is a bachelor who lives in a fourth-storey luxury flat, so if he feels like it, he can go off to the Riviera for a month or two. (Para. 11)", answer: <p lang="zh-CN">他是个单身汉，住在四层豪华公寓里。所以，如果他愿意，他可以去里维埃拉住一两个月。</p> },
    ], "Translate the sentence into Chinese, then compare with the Chinese reference answer."),
    make("Chinese → English", <p lang="zh-CN" className="quiz-question-card">马蒂是一位 18 岁的芬兰人，他第一次乘火车去英国。慢车非常拥挤（packed），既没有头等舱包厢（compartment），也没有预留的（reserved）座位。马蒂注意到了坐在角落里的詹姆斯·萨克森，詹姆斯埋头读着报纸上的体育新闻。根据他对詹姆斯的外貌、穿着和举止的观察，马蒂判断詹姆斯应该是一位典型的英国人，并据此猜测（make assumptions）詹姆斯的职业、家庭和生活习惯。可最后他了解到的事实却与他的想象大相径庭。马蒂从这一经历中学到了一个教训：决不要以貌取人。</p>, <p>Matti is an 18-year-old Finn, and this is his first trip to England by train. The slow train is packed, with no first-class compartments or reserved seats. Matti notices James Saxon, who is reading the sports news in the corner seat. From James’s appearance, clothes, and behavior, Matti assumes that he is a typical Englishman and guesses at his job, family, and lifestyle. The facts he later learns are completely different from what he imagined. Matti learns a lesson from the experience: Never trust appearances.</p>, "Translate the passage into English using the words and expressions in brackets."),
  ],
};

const unit9: UnitData = {
  analytical: [
    make("Chie’s changing attitude", <ol><li>When Chie was told somebody visited on that rainy night, she ______.</li><li>When Chie saw Akira at the entry, she felt ______.</li><li>When Akira told Chie he had received word of a position in America, Chie ______.</li><li>After Akira expressed his determination to ask for Naomi’s hand, Chie felt ______.</li></ol>, <ol><li>was surprised and a bit annoyed</li><li>herself starting to like him</li><li>congratulated him, but was filled with maternal amusement</li><li>his “ambition” of marrying the Fuji heir was an impossible goal</li></ol>, "Complete the sentences to describe Chie’s shifting attitudes toward Akira."),
    ...tfSet([
      ["Akira went to make a proposal without his parents’ consent.", "False. The text does not say whether Akira had his parents’ consent."],
      ["The maid opened the door quickly for Akira as she already knew him.", "False. The maid did not know Akira; she had heard the knock."],
      ["When Naomi heard the name Akira Shinoda, she felt excited.", "False. She drew in a soft breath; the key describes her as surprised."],
      ["Although Chie liked Akira in one sense, she still rejected his proposal.", "True. She felt herself starting to like him, yet dismissed his hopes as preposterous."],
      ["Chie disagreed with the proposal because she thought both Akira and Naomi were too young to marry.", "False. The key reason was her belief that Akira did not deserve the Fuji heir."],
      ["Naomi was determined to marry Akira despite her mother’s disapproval.", "True. She says, “I mean to have him.”"],
    ]),
    ...rowSet("Close reading", [
      { prompt: "Why is “tradition” mentioned in paragraph 1?", answer: <p>It foreshadows the difficulty Akira faces by proposing directly instead of following the customary arrangement through a go-between.</p> },
      { prompt: "In paragraph 10, Akira “straightened and stole a deferential peek at her face.” Why did he peek at Chie’s face?", answer: <p>He was nervous and wanted to see how Chie was reacting to his proposal.</p> },
      { prompt: "Why did Akira’s message about an opportunity to be a dentist in the U.S. fill Chie with maternal amusement?", answer: <p>Chie viewed him as a child speaking earnestly and formally about something she thought unimportant.</p> },
      { prompt: "“Suddenly Chie felt the dampness of the night.” What effect does this description have?", answer: <p>It brings the cold, gloomy atmosphere of the night into focus and reflects Chie’s sudden uneasiness and depression.</p> },
      { prompt: "What personality of Naomi is best illustrated in paragraphs 28–32?", answer: <p>Naomi’s courage and determination are clearest when she states directly that she means to marry Akira.</p> },
      { prompt: "How does Lydia Minatoya use dialogue and description to portray the main characters?", answer: <p>For example, paragraph 8 describes Akira’s appearance and behavior to show his politeness; the dialogue in paragraph 21 reveals his courage and resolve.</p> },
      { prompt: "What marriage traditions appear in the text? Do you know other cultures with similar traditions?", answer: <p>Traditionally, a go-between could arrange for two people to meet and marry. Customs vary across cultures; in some communities families or matchmakers play an important role, while courtship and consent practices differ. Open-ended research response.</p> },
    ], "Answer the reading question, then compare your response with the teacher’s model."),
  ],
  vocabulary: [
    make("Loanwords · sort by field", <p>Sort these words into food, politics, the arts, and animals: <em>coup, cuisine, mosquito, guerrilla, spaghetti, embargo, hamburger, soprano, bonsai, cobra, mammoth, poodle, easel, majesty, design, tofu, parade, parasite, fry, guitar</em>.</p>, <ul><li><strong>Food:</strong> cuisine, spaghetti, hamburger, tofu, fry</li><li><strong>Politics:</strong> coup, guerrilla, embargo, parade, majesty</li><li><strong>The arts:</strong> soprano, bonsai, easel, design, guitar</li><li><strong>Animals:</strong> mosquito, cobra, mammoth, poodle, parasite</li></ul>, "Look up the origins and original meanings, then sort each loanword into a field."),
    ...rowSet("Word bank", [
      { prompt: "Mr. Thompson ______ the desk angrily with his fist.", answer: <p><strong>pounded</strong></p> },
      { prompt: "No student is allowed to leave school without the head teacher’s ______.", answer: <p><strong>consent</strong></p> },
      { prompt: "The ring of the doorbell ______ the sleeping cat.", answer: <p><strong>startled</strong></p> },
      { prompt: "Professor Lin was annoyed, as Katie’s being late caused ______ to the lecture.", answer: <p><strong>disruption</strong></p> },
      { prompt: "Traditionally, Asian women were required to be ______ to men.", answer: <p><strong>deferential</strong></p> },
      { prompt: "Her eyes ______ with excitement at the news that she had been accepted to Harvard University.", answer: <p><strong>glistened</strong></p> },
      { prompt: "He ______ the bottom of the sheet under the mattress.", answer: <p><strong>tucked</strong></p> },
      { prompt: "Tim fell in love with Lisa as she has an ______ appearance and personality.", answer: <p><strong>endearing</strong></p> },
      { prompt: "Mary ______ away when she heard the voice of her ex-boyfriend.", answer: <p><strong>scuttled</strong></p> },
      { prompt: "The idea of building a school within a month is totally ______.", answer: <p><strong>preposterous</strong></p> },
    ], "Complete each sentence with a word from the bank; change its form where necessary. Bank: pound · scuttle · tuck · glisten · disruption · deferential · endearing · consent · startle · preposterous."),
  ],
  paraphrasing: rowSet("Replace the bold phrase", [
    { prompt: "My grandmother is eighty years old, but she is <mark>open to</mark> new ideas.", answer: <p>My grandmother is eighty years old, but she is <strong>receptive to</strong> new ideas.</p> },
    { prompt: "His parents left him when he was only two years old, and he was taken good care of by a <mark>motherly</mark> woman.", answer: <p>His parents left him when he was only two years old, and he was taken good care of by a <strong>maternal</strong> woman.</p> },
    { prompt: "Her face <mark>turned red</mark> the first time she received a love letter from him.", answer: <p>She <strong>blushed</strong> the first time she received a love letter from him.</p> },
    { prompt: "The day after he met Betty, he <mark>proposed to her</mark>.", answer: <p>The day after he met Betty, he <strong>asked for her hand</strong>.</p> },
    { prompt: "Talking loudly on the phone is a sign of <mark>impoliteness</mark>.", answer: <p>Talking loudly on the phone is a sign of <strong>unseemliness</strong>.</p> },
    { prompt: "I think traffic jams <mark>are attributed to</mark> the fact that people rely too much on automobiles.", answer: <p>I think traffic jams <strong>come down to</strong> the fact that people rely too much on automobiles.</p> },
    { prompt: "The wedding was going smoothly when Jade rushed in <mark>suddenly</mark> and said “I object!”", answer: <p>The wedding was going smoothly when Jade rushed in <strong>abruptly</strong> and said “I object!”</p> },
    { prompt: "Masked robbers broke in and <mark>took away</mark> $1,000,000.", answer: <p>Masked robbers broke in and <strong>made off with</strong> $1,000,000.</p> },
  ], "Replace the bold phrase with a word or expression from the text. Make changes where necessary."),
  prepositions: rowSet("Prepositions", [
    { prompt: "Lying in bed, I could hear somebody pounding ______ the door while a cold rain beat ______ the shuttered window.", answer: <p><strong>on; on</strong></p> },
    { prompt: "A slow, kind smile spread ______ my grandfather’s face as he stood outside, his trousers tucked ______ the boots.", answer: <p><strong>over / on; in / inside</strong></p> },
    { prompt: "Asking ______ the consent of her parents is not a matter ______ life and death, the young man said to himself.", answer: <p><strong>for; of</strong></p> },
    { prompt: "The little girl stole a deferential peek ______ the guest from ______ the curtain.", answer: <p><strong>at; behind</strong></p> },
    { prompt: "His hat, shining ______ a crown, filled the kids ______ admiration.", answer: <p><strong>like; with</strong></p> },
    { prompt: "On my first day at school, I was viewed ______ a monster. But ______ my mom’s mind, I was an angel.", answer: <p><strong>as; in</strong></p> },
    { prompt: "We should not judge a school only ______ the results ______ exams.", answer: <p><strong>by; of</strong></p> },
    { prompt: "Looking ______ his eyes, I came to realize what he meant ______ me.", answer: <p><strong>into; to</strong></p> },
  ], "Fill in each blank with an appropriate preposition."),
  grammar: [
    make("Modal auxiliary verbs · choose", <ol><li>Mrs. Brown has been working so hard that she (may, can) be ill at any time.</li><li>I didn’t hear the ring of the doorbell. I (can, must) have been asleep.</li><li>“When can I have my photos? I need them tomorrow morning.” “They (will, might) be ready by 12:00, I’m sure.”</li><li>She was with me last Sunday night. She (can, must) not be the criminal.</li><li>Sixth-graders (should, may) have no problem doing the multiplication test.</li><li>You (mustn’t, may not) enter a private house without permission.</li><li>I hate going out on such a cold morning, but I (have to, must) get up early for school.</li><li>She (will, would) have caught the first bus if she had left earlier.</li></ol>, <ol><li>can</li><li>must</li><li>will</li><li>can</li><li>should</li><li>mustn’t</li><li>have to</li><li>would</li></ol>, "Choose one modal auxiliary verb from the brackets to complete each sentence."),
    make("Modal auxiliary verbs · complete the dialogue", <ol><li><strong>Jane:</strong> ______ you like to play basketball with us? <br /><strong>Cathy:</strong> Yes, I’d love to. But I’m afraid I have no time.</li><li><strong>Coach:</strong> The basketball match starts at 7:30. All of you ______ arrive at 7:00. <br /><strong>Players:</strong> Yes, sir!</li><li><strong>Students:</strong> ______ we play basketball during the break? <br /><strong>Teacher:</strong> Yes, you can.</li><li><strong>Peter:</strong> Philip, would you like to see a movie after class? <br /><strong>Philip:</strong> I’d love to. But I ______ play basketball, otherwise the coach will kill me.</li><li><strong>Son:</strong> Must I play basketball for a whole afternoon, dad? <br /><strong>Father:</strong> No, you ______. It’s hot outside.</li></ol>, <ol><li>Would</li><li>must</li><li>Could</li><li>have to</li><li>needn’t / don’t have to</li></ol>, "Fill in the blanks with appropriate modal auxiliary verbs."),
  ],
  translation: [
    ...rowSet("English → Chinese", [
      { prompt: "Had he followed form—had he asked his mother to speak to his father to approach a go-between—would Chie have been more receptive? (Para. 1)", answer: <p lang="zh-CN">如果他按规矩来——让母亲去跟父亲说，请个人说媒——知惠会不会更容易接受他呢？</p> },
      { prompt: "In the glistening surface of the courtyard’s rain-drenched paving stones, she saw his reflection like a dark double. (Para. 8)", answer: <p lang="zh-CN">她看到庭院里的铺路石浸在雨水里，悠悠地泛着光，倒映出和明本人一样的影子。</p> },
      { prompt: "Akira’s message, delivered like a formal speech, filled her with maternal amusement. (Para. 15)", answer: <p lang="zh-CN">明一本正经的说辞倒是把作为母亲的她给逗乐了。</p> },
      { prompt: "If you give your consent, I become Naomi’s yoshi…Without your consent, I must go to America, to secure a new home for my bride. (Para. 21)", answer: <p lang="zh-CN">如果您同意，我愿意入赘富士家……如果您不同意，我们就去美国，我会在那里为我的新娘布置出一处安乐窝。</p> },
      { prompt: "He thinks he can marry the Fuji heir and take her to America all in the snap of his fingers! (Para. 26)", answer: <p lang="zh-CN">他竟然口口声声说想迎娶富士家的继承人，还想把人带到美国去，好像这是件轻松得不能再轻松的事。</p> },
    ], "Translate into Chinese, then compare with the Chinese reference answer."),
    make("Chinese → English", <p lang="zh-CN" className="quiz-question-card">在一个冬日雨夜，明鼓足了勇气去富士家提亲（make a proposal）。看到女仆递进来的名片，知惠本不愿起身。直美认出了名片上的名字，倒吸了一口气。知惠走到门廊，见到了身材修长的明。明温柔而坚定地表达了想娶（ask for one’s hand）直美的愿望，以及只要知惠同意（give one’s consent），他可以入赘富士家。知惠拿着名片，扫了一眼门外，没作答。明鞠躬，转身离去。知惠认为明自不量力，自以为可以轻而易举地（in the snap of one’s fingers）娶到富士家的继承人，直美却鼓起勇气，勇敢地说：“我打算（mean to）嫁给他。”</p>, <p>On a rainy winter night, Akira plucked up the courage to go to the Fuji family to make a proposal. When the maid brought in his card, Chie did not want to get up. Naomi recognized the name and caught her breath. Chie walked to the entry and saw slender Akira. He gently but firmly expressed his wish to ask for Naomi’s hand, and said that he was willing to live with the Fuji family if Chie gave her consent. Chie took the card and glanced beyond him without answering. Akira bowed and left. Chie thought Akira was overconfident in believing he could marry the Fuji heir in the snap of his fingers, but Naomi plucked up her courage and said, “I mean to have him.”</p>, "Translate the passage into English using the expressions in brackets."),
  ],
};

// The source units teach different language points. Each folder names only the
// exercise type it contains; the colors keep the seven-layer paper design.
const unit4VocabularyAnswers = [
  { answer: "tortuous", note: "winding and twisting; full of turns." },
  { answer: "lucid", note: "clear and easy to understand." },
  { answer: "predators", note: "animals that hunt and feed on other animals." },
  { answer: "bland", note: "tasteless or lacking a strong flavor." },
  { answer: "adverse", note: "harmful or unfavorable." },
  ...["boycotting", "submitted", "narrowed", "transformed", "amplify", "plummeted", "disrupted", "constrained"].map(answer => ({ answer })),
];

const unit4Categories: QuizCategory[] = [
  folder("u4-reading-outline", "Reading Outline", 0, unit4.analytical.slice(0, 1)),
  folder("u4-true-false", "True or False", 1, unit4.analytical.slice(1, 7)),
  folder("u4-close-reading", "Close Reading", 2, unit4.analytical.slice(7)),
  folder("u4-vocabulary", "Vocabulary", 3, unit4.vocabulary.map((exercise, index) => ({
    ...exercise,
    prompt: <Unit4FillBlanks content={exercise.prompt} answers={[unit4VocabularyAnswers[index]]} prefix={`u4-vocabulary-${index + 1}`} />,
    answer: null,
    selfManagedAnswers: true,
  }))),
  folder("u4-paraphrasing", "Paraphrasing", 4, unit4.paraphrasing),
  folder("u4-subject-verb-concord", "Subject-Verb Concord", 5, unit4.grammar),
  folder("u4-translation", "Translation", 6, unit4.translation),
];

const unit5Categories: QuizCategory[] = [
  folder("u5-analytical-reading", "Analytical Reading", 0, unit5.analytical),
  folder("u5-verb-forming-prefixes", "Verb-Forming Prefixes", 1, unit5.vocabulary.slice(0, 5)),
  folder("u5-word-bank", "Word Bank", 2, unit5.vocabulary.slice(5)),
  folder("u5-paraphrasing", "Paraphrasing", 3, unit5.paraphrasing),
  folder("u5-past-tense-flashbacks", "Past Tense in Flashbacks", 4, unit5.grammar.slice(0, 1)),
  folder("u5-gerunds", "Gerunds", 5, unit5.grammar.slice(1)),
  folder("u5-translation", "Translation", 6, unit5.translation),
];

const unit7Categories: QuizCategory[] = [
  folder("u7-analytical-reading", "Analytical Reading", 0, unit7.analytical),
  folder("u7-adjective-forming-suffixes", "Adjective-Forming Suffixes", 1, unit7.vocabulary.slice(0, 10)),
  folder("u7-word-bank", "Word Bank", 2, unit7.vocabulary.slice(10)),
  folder("u7-paraphrasing", "Paraphrasing", 3, unit7.paraphrasing),
  folder("u7-simple-present", "Simple Present Tense", 4, unit7.grammar.slice(0, 1)),
  folder("u7-wh-infinitive", "Wh-word + Infinitive", 5, unit7.grammar.slice(1)),
  folder("u7-translation", "Translation", 6, unit7.translation),
];

const unit9Categories: QuizCategory[] = [
  folder("u9-analytical-reading", "Analytical Reading", 0, unit9.analytical),
  folder("u9-loanwords", "Loanwords", 1, unit9.vocabulary.slice(0, 1)),
  folder("u9-word-bank", "Word Bank", 2, unit9.vocabulary.slice(1)),
  folder("u9-paraphrasing", "Paraphrasing", 3, unit9.paraphrasing),
  folder("u9-prepositions", "Prepositions", 4, unit9.prepositions),
  folder("u9-modal-auxiliaries", "Modal Auxiliary Verbs", 5, unit9.grammar),
  folder("u9-translation", "Translation", 6, unit9.translation),
];

export const articles02to05QuizData = [
  { articleNumber: "02", unitLabel: "UNIT 4 · GO, ROBOTS!", articleTitle: "Should the Robots Be Taxed?", categories: unit4Categories },
  { articleNumber: "03", unitLabel: "UNIT 5 · FAMILY TIES", articleTitle: "Roommates", categories: unit5Categories },
  { articleNumber: "04", unitLabel: "UNIT 7 · NATIONAL STEREOTYPES", articleTitle: "Never Trust Appearances", categories: unit7Categories },
  { articleNumber: "05", unitLabel: "UNIT 9 · WISDOM OF LOVE", articleTitle: "Courage", categories: unit9Categories },
] as const;
