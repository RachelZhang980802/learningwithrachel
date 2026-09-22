"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { articleStudioConfigs } from "./article04StudioConfig";
import { article05StudioConfig } from "./article05StudioConfig";
import { articleStudioConfigs0610 } from "./article06to10StudioConfig";
import { fullArticleParagraphs } from "./suppliedArticles";
import { MuckRakeIntro } from "./MuckRakeIntro";
import { article01StructureData } from "./article01StructureData";
import { StructureDiagram } from "./ClauseMemo";
import { ClauseEntry } from "./ClauseEntry";
import { VocabularyParagraph, type VocabularyTarget } from "./ArticleVocabulary";
import { ArticleOneWords } from "./ArticleOneWords";
import { LessonVocabularyParagraph, LessonVocabularyTitle, LessonWords, LessonStructure, LessonActivities } from "./ArticleLessonContent";
import { getLesson } from "./articleLessons";
import { GrammarLegend, grammarRole } from "./GrammarLegend";
import { PendingWordWorkspace } from "./WordFileDesk";
import { ArticleOneParaphrase } from "./ArticleOneParaphrase";
import { ArticleOneReuse } from "./ArticleOneReuse";
import { article01Translations } from "./article01Translations";
import { ArticleOneNotebook, SentenceBadge } from "./ArticleOneNotebook";
import { ArticleOneQuiz } from "./ArticleOneQuiz";
import { TextImageLetterHero } from "./TextImageLetterHero";
import { isNarrativeCourseHash, NarrativeWritingCourse } from "./NarrativeWritingCourse";
import { XiumiArticleShelf } from "./XiumiArticleShelf";

type View = "library" | "guide" | "index" | "about" | "reading";
type Section = "home" | "reading" | "writing" | "culture";
type WritingTrack = "narrative" | "expository";

type Article = {
  number: string;
  title: string;
  author: string;
  theme: string;
  image: string;
};


const articles: Article[] = [
  { number: "01", title: "I Become a Student", author: "Lincoln Steffens", theme: "Education", image: "/media/covers/01-student.webp" },
  { number: "02", title: "Should the Robots Be Taxed?", author: "Kumar Sachidanandam", theme: "Technology", image: "/media/covers/02-taxed.webp" },
  { number: "03", title: "Roommates", author: "Max Apple", theme: "Family Bonds", image: "/media/covers/03-roommates.webp" },
  { number: "04", title: "Never Trust Appearances", author: "Author forthcoming", theme: "Stereotypes", image: "/media/covers/04-appearances.webp" },
  { number: "05", title: "Courage", author: "Lydia Minatoya", theme: "Love", image: "/media/covers/05-courage.webp" },
  { number: "06", title: "Reading", author: "Benjamin Franklin", theme: "Discovery", image: "/media/covers/06-reading.webp" },
  { number: "07", title: "What We Gain or Lose in Cities", author: "Jared Diamond", theme: "Urbanization", image: "/media/covers/07-cities.webp" },
  { number: "08", title: "The Guide to Being a Foodie Without Being Culturally Appropriative", author: "Rachel Kuo", theme: "Culture", image: "/media/covers/08-foodie.webp" },
  { number: "09", title: "Stop Telling Me to Travel like a Local, Okay?", author: "Mari Uyehara", theme: "Travel", image: "/media/covers/09-travel.webp" },
  { number: "10", title: "Two Ways of Seeing a River", author: "Mark Twain", theme: "Perspective", image: "/media/covers/10-river.webp" },
];

const steffensParagraphs = [
  `It is possible to get an education at a university. It has been done; not often, but the fact that a proportion, however small, of college students do get a start in interested, methodical study, proves my thesis, and the following personal experience I have to offer illustrates it and shows how to get around the faculty, the other students, and the whole college system of mind-fixing. My method might lose a boy his degree, but a degree is not worth so much as the capacity and the drive to learn.`,
  `My method was hit on by accident and some instinct. I specialized. With several courses prescribed, I concentrated on the one or two that interested me most and worked intensively on my favorites. In my first two years, for example, I worked at English and political economy and read philosophy. At the beginning of my junior year I had several cinches in history. Now I liked history; I had neglected it partly because I rebelled at the way it was taught, as positive knowledge unrelated to politics, art, life, or anything else. The professors gave us chapters out of a few books to read and be quizzed on. Blessed as I was with a "bad memory," I could not commit to it anything that I did not understand and intellectually need. The bare record of the story of man, with names, dates, and irrelative events, bored me. But I had discovered in my readings of literature, philosophy, and political economy that history had light to throw upon unhistorical questions. So I proposed in my junior and senior years to specialize in history, taking all the courses required and those also that I had failed. With this in mind I listened attentively to the first introductory talk of Professor William Cary Jones on American constitutional history. He was a dull lecturer, but I noticed that, after telling us what pages of what books we must be prepared in, he listed off some other references "for those that may care to dig deeper."`,
  `When the rest of the class rushed out into the sunshine, I went up to the professor and, to his surprise, asked for this memorandum. He gave it to me. Up in the library I ran through the required chapters in the two different books, and they differed on several points. Turning to the other authorities, I saw that they disagreed on the same facts and also on others. The librarian, appealed to, helped me search the bookshelves till the library closed, and then I called on Professor Jones for more references. He was astonished, invited me in, and began to approve my industry, which astonished me. I was not trying to be a good boy; I was better than that: I was a curious boy. He lent me a couple of his books, and I went off to my club to read them. They only deepened the mystery, clearing up the historical question, but leaving the answer to be dug for and written.`,
  `The historians did not know! History was not a science, but a field for research, a field for me, for any young man, to explore, to make discoveries in and write a scientific report about. I was fascinated. As I went on from chapter to chapter, day after day, finding frequently essential differences of opinion and of fact, I saw more and more work to do. In this course, American constitutional history, I hunted far enough to suspect that the Fathers of the Republic who wrote our sacred Constitution of the United States not only did not, but did not want to, establish a democratic government, and I dreamed for a while—as I used as a child to play I was Napoleon or a trapper—I promised myself to write a true history of the making of the American Constitution. I did not do it; that chapter has been done or well begun since by two men: Smith of the University of Washington and Beard of Columbia. I found other events, men, and eras waiting for students. In all my other courses, in ancient, in European, and in modern history, the disagreeing authorities carried me back to the need of a fresh search for the original documents or other clinching evidence. Of course I did well in my classes. The history professors soon knew me as a student and seldom put a question to me except when the class didn't know the answer. Then Professor Jones would say, "Well, Steffens, tell them about it."`,
  `Fine. But vanity wasn't my ruling passion then. What I had was a quickening sense that I was learning a method of studying history and that every chapter of it, from the beginning of the world to the end, is crying out to be rewritten. There was something for Youth to do.`,
];
const splitStudioSentences = (paragraph: string, includeTerminalColons = false) =>
  paragraph.replaceAll("Ph.D.", "Ph§D§").match(includeTerminalColons ? /[^.!?:]+(?:[.!?]+(?:["”])?|:)/g : /[^.!?]+[.!?]+(?:["”])?/g)
    ?.map((sentence) => sentence.replace(/§/g, ".").replace(/\s+/g, " ").trim()) ?? [];

const studioSentences = steffensParagraphs.flatMap((paragraph) => splitStudioSentences(paragraph));

const robotsParagraphs = [
  `A video of Bill Gates suggesting that robots should be taxed is going viral in the news and social media.`,
  `This idea of universal income and taxing robots is gaining ground. Sometime in June, a draft report was submitted to the European Parliament that states:\n\nIf advanced robots start replacing human workers in large numbers, the report recommends the European Commission force their owners to pay taxes or contribute to social security. The establishment of a basic income, or guaranteed welfare program, is also suggested as a protection against human unemployment.`,
  `I see robots as tools that make a job easier or do things much faster or much better or much cheaper. Throughout human history, we have used various forms of tools, from stone to metal to water to air to wood to coal to oil, and to electricity to achieve transformations in our lives. During each of these stages, there were a lot of people who lost their jobs and the next generation learned new skills to stay relevant. A case in point is below:\n\nTextile factories organized workers' lives much differently from craft production. Handloom weavers worked at their own pace, with their own tools, and within their own cottages. Factories set hours of work, and the machinery within them shaped the pace of work. Factories brought workers together within one building to work on machinery that they did not own. Factories also increased the division of labor. They narrowed the number and scope of tasks. They included children and women within a common production process.`,
  `While weavers lost their jobs, their kids and families got their jobs in factories and in other firms. Now that the factories are getting closed and replaced with robots, factory workers' kids might become knowledge workers. But there will always be a lag and some population will be left behind.`,
  `The side effect of automation was the number of families and kids in our families. When muscle power was strength, the number of kids in a family, and the number of men in particular, was a sign of prosperity. However, as we went through this progress, the birth rate plummeted and it is worth watching other social trends like more single people, lower marriage rates, more married couples with no kids, etc.`,
  `The world is also seeing another trend! It is getting older. But an older population may not be as bad as we think. One theory is that our future generation will live in a resource-constrained world and therefore learn to conserve resources.`,
  `As Bill Gates argues, spare human capacity has already been put to better use to provide education and research leading to even better knowledge, health care and wealth for all of us. However, this has not been uniform as the per capita income growth has been skewed toward developed nations.`,
  `The biggest argument Bill Gates makes is on the taxes. As machines are replacing human workers, these robots don't get paid and this leads to the lower taxes for the government. But what we fail to see is that, this also leads to higher profits for corporations, which pay higher taxes. Also, there is a cost to making robots and investing in such technologies. This creates a different kind of job, different levels of salaries and different taxes, maybe in a different part of the country or in different parts of the world altogether. Now, that's a flashpoint. But this too shall pass. We have seen the era of boycotting machine-made fabric and automobiles when they were seen as a threat at some point. Today, they have become an essential part of our lives.`,
  `I hear people complaining about the speed at which these changes happen and that we are unable to provide jobs or create newer skills. But, think of the speed at which horses were replaced by rail roads, cars and trucks; the speed at which passenger ships were replaced by airlines. They must have been pretty dramatic changes in those days! These were huge job destroyers and also job creators of the other type. In all cases, those who lost their jobs did not find work in the new industry. It was a new breed of skills that found these jobs. But it took some time. These are very visible today because of the speed at which information travels today, amplifying these causes and effects.`,
  `In summary, I would argue that we have always been automating. I see the world as a system and when the system gets disrupted, it takes a while to get to the equilibrium and that is painful. We are going through that painful phase now and it needs empathy, compassion and social responsibility.`,
];
const robotStudioSentences = robotsParagraphs.flatMap((paragraph) => splitStudioSentences(paragraph, true));

const roommatesParagraphs = fullArticleParagraphs[2];
const roommatesStudioSentences = roommatesParagraphs.flatMap((paragraph) => splitStudioSentences(paragraph));
const suppliedAudio: Record<number, string> = {
  2: "/media/audio-roommates.mp3",
  3: "/media/audio-never-trust-appearances.mp3",
  4: "/media/audio-courage.mp3",
  5: "/media/audio-reading-benjamin-franklin.mp3",
  6: "/media/audio-cities-jared-diamond.mp3",
  7: "/media/audio-foodie-rachel-kuo.mp3",
  8: "/media/audio-travel-mari-uyehara.mp3",
  9: "/media/audio-river-mark-twain.mp3",
};
const courageParagraphs = [
  "Akira came directly, breaking all tradition. Was that it? Had he followed form—had he asked his mother to speak to his father to approach a go-between—would Chie have been more receptive?",
  "He came on a winter's eve. He pounded on the door while a cold rain beat on the shuttered veranda, so at first Chie thought him only the wind. The maid knew better. Chie heard her soft scuttling footsteps, the creak of the door. Then the maid brought a calling card to the drawing room, for Chie.",
  "Chie was reluctant to go to her guest; perhaps she was feeling too cozy. She and Naomi were reading at a low table set atop a charcoal brazier. A thick quilt spread over the sides of the table so their legs were tucked inside with the heat.",
  "\"Who is it at this hour, in this weather?\" Chie questioned as she picked the name card off the maid's lacquer tray.",
  "\"Shinoda, Akira. Kobe Dental College,\" she read.",
  "Naomi recognized the name. Chie heard a soft intake of air.",
  "\"I think you should go,\" said Naomi.",
  "Akira was waiting in the entry. He was in his early twenties, slim and serious, wearing the black military-style uniform of a student. As he bowed—his hands hanging straight down, a black cap in one, a yellow oil-paper umbrella in the other—Chie glanced beyond him. In the glistening surface of the courtyard's rain-drenched paving stones, she saw his reflection like a dark double.",
  "\"Madame,\" said Akira, \"forgive my disruption, but I come with a matter of urgency.\"",
  "His voice was soft, refined. He straightened and stole a deferential peek at her face.",
  "In the dim light his eyes shone with sincerity. Chie felt herself starting to like him.",
  "\"Come inside, get out of this nasty night. Surely your business can wait for a moment or two.\"",
  "\"I don't want to trouble you. Normally I would approach you more properly but I've received word of a position. I've an opportunity to go to America, as dentist for Seattle's Japanese community.\"",
  "\"Congratulations,\" Chie said with amusement. \"That is an opportunity, I'm sure. But how am I involved?\"",
  "Even noting Naomi's breathless reaction to the name card, Chie had no idea. Akira's message, delivered like a formal speech, filled her with maternal amusement. You know how children speak so earnestly, so hurriedly, so endearingly about things that have no importance in an adult's mind? That's how she viewed him, as a child.",
  "It was how she viewed Naomi. Even though Naomi was eighteen and training endlessly in the arts needed to make a good marriage, Chie had made no effort to find her a husband.",
  "Akira blushed.",
  "\"Depending on your response, I may stay in Japan. I've come to ask for Naomi's hand.\"",
  "Suddenly Chie felt the dampness of the night.",
  "\"Does Naomi know anything of your…ambitions?\"",
  "\"We have an understanding. Please don't judge my candidacy by the unseemliness of this proposal. I ask directly because the use of a go-between takes much time. Either method comes down to the same thing: a matter of parental approval. If you give your consent, I become Naomi's yoshi. We'll live in the House of Fuji. Without your consent, I must go to America, to secure a new home for my bride.\"",
  "Eager to make his point, he'd been looking her full in the face. Abruptly, his voice turned gentle. \"I see I've startled you. My humble apologies. I'll take no more of your evening. My address is on my card. If you don't wish to contact me, I'll reapproach you in two weeks' time. Until then, good night.\"",
  "He bowed and left. Taking her ease, with effortless grace, like a cat making off with a fish.",
  "\"Mother?\" Chie heard Naomi's low voice and turned from the door. \"He has asked you?\"",
  "The sight of Naomi's clear eyes, her dark brows gave Chie strength. Maybe his hopes were preposterous.",
  "\"Where did you meet such a fellow? Imagine! He thinks he can marry the Fuji heir and take her to America all in the snap of his fingers!\"",
  "Chie waited for Naomi's ripe laughter.",
  "Naomi was silent. She stood a full half minute looking straight into Chie's eyes. Finally, she spoke. \"I met him at my literary meeting.\"",
  "Naomi turned to go back into the house, then stopped.",
  "\"Mother.\"",
  "\"Yes?\"",
  "\"I mean to have him.\"",
];

function relativePosition(index: number, active: number) {
  let distance = index - active;
  const half = articles.length / 2;
  if (distance > half) distance -= articles.length;
  if (distance < -half) distance += articles.length;
  return distance;
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return <span aria-hidden="true">{direction === "left" ? "←" : "→"}</span>;
}

function Header({ view, onNavigate, onHome }: { view: View; onNavigate: (view: View) => void; onHome?: () => void }) {
  return (
    <header className="site-header">
      <button className="wordmark" onClick={onHome ?? (() => onNavigate("library"))} aria-label="Learning with Rachel home">
        <span className="ink-mark" aria-hidden="true">
          <img src="/media/brand/fat-cat-wordmark.png" alt="" />
        </span>
        <span className="brand-name">NegentropyLearning</span>
      </button>
      <nav aria-label="Global navigation">
        <button onClick={onHome ?? (() => onNavigate("library"))}>Home</button>
        {(["library", "guide", "index", "about"] as View[]).map((item) => (
          <button key={item} className={view === item ? "is-current" : ""} onClick={() => onNavigate(item)}>
            {item === "guide" ? "Inquire Lab" : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>
    </header>
  );
}

const primarySections: Array<{ id: Section; label: string }> = [
  { id: "home", label: "Home" },
  { id: "reading", label: "Reading" },
  { id: "writing", label: "Writing" },
  { id: "culture", label: "Culture" },
];

function PrimaryNavigation({ current, onNavigate }: { current: Section; onNavigate: (section: Section) => void }) {
  return (
    <nav className="learning-primary-nav" aria-label="Primary navigation">
      {primarySections.map((item) => (
        <button
          key={item.id}
          type="button"
          className={current === item.id ? "is-current" : ""}
          onClick={() => onNavigate(item.id)}
          aria-current={current === item.id ? "page" : undefined}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

const homeCourses = [
  {
    id: "narrative",
    title: ["Narrative", "Writing"],
    image: "/home/narrative-writing.jpg",
    paper: "#bcc6ad",
    ink: "#233b55",
  },
  {
    id: "expository",
    title: ["Expository", "Writing"],
    image: "/home/expository-writing.jpg",
    paper: "#dfaaa1",
    ink: "#4c3036",
  },
  {
    id: "integrated",
    title: ["Integrated", "English"],
    image: "/home/integrated-english.jpg",
    paper: "#e8c97b",
    ink: "#3c3b34",
  },
  {
    id: "culture",
    title: ["Western", "Culture"],
    image: "/home/western-culture.png",
    paper: "#bdcbd7",
    ink: "#26394c",
  },
] as const;

function HomeLanding({
  onNavigate,
  onOpenWriting,
}: {
  onNavigate: (section: Section) => void;
  onOpenWriting: (track: WritingTrack) => void;
}) {
  const openCourse = (course: (typeof homeCourses)[number]) => {
    if (course.id === "narrative" || course.id === "expository") {
      onOpenWriting(course.id);
      return;
    }
    onNavigate(course.id === "integrated" ? "reading" : "culture");
  };

  return (
    <main className="learning-home">
      <PrimaryNavigation current="home" onNavigate={onNavigate} />
      <section className="learning-home-hero" aria-labelledby="learning-home-title">
        <h1 id="learning-home-title" className="learning-brand-title">Learning with Rachel</h1>
        <div className="learning-course-grid" aria-label="Learning paths">
          {homeCourses.map((course, index) => (
            <button
              key={course.id}
              type="button"
              className="learning-course-card"
              style={{ "--card-paper": course.paper, "--card-ink": course.ink, "--card-index": index } as CSSProperties}
              onClick={() => openCourse(course)}
              aria-label={`Open ${course.title.join(" ")}`}
            >
              <span className="learning-course-image">
                <img src={course.image} alt="" draggable="false" />
              </span>
              <span className="learning-course-meta">
                <span className="learning-card-dots" aria-hidden="true" />
                <strong className="learning-course-title">
                  <span>{course.title[0]}</span>
                  <span>{course.title[1]}</span>
                </strong>
                <span className="learning-barcode" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>
      <UniversityFooter />
    </main>
  );
}

function LearningSectionPage({
  section,
  writingTrack,
  onNavigate,
}: {
  section: "writing" | "culture";
  writingTrack: WritingTrack;
  onNavigate: (section: Section) => void;
}) {
  const isWriting = section === "writing";
  const title = isWriting
    ? writingTrack === "narrative" ? "Narrative Writing" : "Expository Writing"
    : "Western Culture";

  return (
    <main className="learning-secondary">
      <PrimaryNavigation current={section} onNavigate={onNavigate} />
      <section className="learning-secondary-panel" aria-labelledby="learning-section-title">
        <p>{isWriting ? "WRITING STUDIO" : "CULTURE ARCHIVE"}</p>
        <h1 id="learning-section-title">{title}</h1>
        <span>Learning with Rachel</span>
        <button type="button" className="learning-secondary-back" onClick={() => onNavigate("home")}>← Back home</button>
      </section>
    </main>
  );
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<View>("library");
  const [section, setSection] = useState<Section>("home");
  const [writingTrack, setWritingTrack] = useState<WritingTrack>("narrative");
  const [firstIntroOpen, setFirstIntroOpen] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const saved = Number(sessionStorage.getItem("close-reading-active"));
    if (Number.isInteger(saved) && saved >= 0 && saved < articles.length) setActive(saved);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("close-reading-active", String(active));
  }, [active]);

  useEffect(() => {
    if (section !== "reading" || view !== "library") return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setActive((value) => (value - 1 + articles.length) % articles.length);
      if (event.key === "ArrowRight") setActive((value) => (value + 1) % articles.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [section, view]);

  useEffect(() => {
    const restoreSectionFromHistory = () => {
      if (isNarrativeCourseHash(window.location.hash)) {
        setWritingTrack("narrative");
        setSection("writing");
        return;
      }
      if (section === "writing" && writingTrack === "narrative") setSection("home");
    };

    restoreSectionFromHistory();
    window.addEventListener("popstate", restoreSectionFromHistory);
    return () => window.removeEventListener("popstate", restoreSectionFromHistory);
  }, [section, writingTrack]);

  const navigate = (destination: View) => {
    setView(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSection = (destination: Section) => {
    if (destination === "writing" && writingTrack === "narrative" && !isNarrativeCourseHash(window.location.hash)) {
      const base = `${window.location.pathname}${window.location.search}`;
      window.history.pushState({ learningSection: "writing", writingTrack: "narrative" }, "", `${base}#cover`);
    }
    if (destination === "reading") {
      setView("library");
      setFirstIntroOpen(false);
    }
    setSection(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openWriting = (track: WritingTrack) => {
    setWritingTrack(track);
    if (track === "narrative") {
      if (!isNarrativeCourseHash(window.location.hash)) {
        const base = `${window.location.pathname}${window.location.search}`;
        window.history.pushState({ learningSection: "writing", writingTrack: "narrative" }, "", `${base}#cover`);
      }
      setSection("writing");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const base = `${window.location.pathname}${window.location.search}`;
    window.history.pushState({ learningSection: "writing", writingTrack: "expository" }, "", base);
    setSection("writing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openReading = (index: number) => {
    setActive(index);
    setFirstIntroOpen(false);
    navigate("reading");
  };

  const changeReadingArticle = (index: number) => {
    setActive(index);
    setFirstIntroOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (section === "home") {
    return <HomeLanding onNavigate={openSection} onOpenWriting={openWriting} />;
  }

  if (section === "writing" && writingTrack === "narrative") {
    return <NarrativeWritingCourse onHome={() => openSection("home")} />;
  }

  if (section === "writing" || section === "culture") {
    return <LearningSectionPage section={section} writingTrack={writingTrack} onNavigate={openSection} />;
  }

  if (view === "reading") {
    return <ReadingPage article={articles[active]} index={active} showMuckRakeIntro={firstIntroOpen} onOpenMuckRakeIntro={() => setFirstIntroOpen(true)} onDismissMuckRakeIntro={() => setFirstIntroOpen(false)} onBack={() => navigate("library")} onPrevious={active > 0 ? () => changeReadingArticle(active - 1) : undefined} onNext={active < articles.length - 1 ? () => changeReadingArticle(active + 1) : undefined} />;
  }

  if (view === "guide") {
    return <InquireLab onNavigate={navigate} onHome={() => openSection("home")} />;
  }

  if (view !== "library") {
    return <SimplePage view={view} onNavigate={navigate} onRead={openReading} onHome={() => openSection("home")} />;
  }

  const previous = () => setActive((value) => (value - 1 + articles.length) % articles.length);
  const next = () => setActive((value) => (value + 1) % articles.length);
  const current = articles[active];

  return (
    <main className="library-page">
      <div className="library-embroidery" aria-hidden="true">
        <img className="library-embroidery-flower library-embroidery-flower-left" src="/media/library-background/embroidery-left.png" alt="" draggable={false} />
        <img className="library-embroidery-flower library-embroidery-flower-right" src="/media/library-background/embroidery-right.png" alt="" draggable={false} />
      </div>
      <Header view={view} onNavigate={navigate} onHome={() => openSection("home")} />

      <section className="hero" aria-labelledby="library-title">
        <TextImageLetterHero lines={["Read", "between the lines"]} />
        <p className="hero-copy">A quiet archive for close attention.<br />Begin with the text; reveal only what you need.</p>
      </section>

      <section className="carousel-section" aria-roledescription="carousel" aria-label="Ten close-reading texts">
        <div
          className="carousel-shell"
          onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const delta = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(delta) > 48) delta > 0 ? previous() : next();
            touchStart.current = null;
          }}
        >
          <svg className="clip-defs" width="0" height="0" aria-hidden="true">
            <defs>
              <clipPath id="continuousArc" clipPathUnits="objectBoundingBox">
                <path d="M0,0 C0.18,0.18 0.82,0.18 1,0 L1,1 C0.82,0.82 0.18,0.82 0,1 Z" />
              </clipPath>
            </defs>
          </svg>
          <div className="arc-window">
            {articles.map((article, index) => {
              const position = relativePosition(index, active);
              const visible = Math.abs(position) <= 3;
              return (
                <button
                  key={article.number}
                  className={`cover-card ${position === 0 ? "is-active" : ""}`}
                  style={{ "--offset": position, "--depth": Math.abs(position) } as CSSProperties}
                  onClick={() => position === 0 ? openReading(index) : setActive(index)}
                  tabIndex={visible ? 0 : -1}
                  aria-label={position === 0 ? `Enter ${article.title}` : `Bring ${article.title} to the center`}
                  aria-hidden={!visible}
                >
                  <img src={article.image} alt="" draggable="false" />
                  <span className="wash" aria-hidden="true" />
                  <span className="cover-number">{article.number}</span>
                  <span className="cover-copy">
                    <strong>{article.title}</strong>
                    <em>{article.author}</em>
                    {position === 0 && <small>ENTER TEXT ↗</small>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="carousel-meta" aria-live="polite">
          <div className="article-caption">
            <span>{current.number} / 10</span>
            <p>{current.theme}</p>
          </div>
          <div className="carousel-controls">
            <button onClick={previous} aria-label="Previous text"><Arrow direction="left" /></button>
            <button onClick={next} aria-label="Next text"><Arrow direction="right" /></button>
          </div>
          <div className="number-index" aria-label="Jump to a text">
            {articles.map((article, index) => (
              <button key={article.number} className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`Text ${article.number}: ${article.title}`}>
                {article.number}
              </button>
            ))}
          </div>
        </div>
      </section>
      <XiumiArticleShelf />

      <UniversityFooter />
    </main>
  );
}

const inquirySets = [
  [
    { en: "What if I were the valedictorian four years from now?", zh: "四年后如果我是毕业生代表，会怎样呢？", resources: [{ title: "NYU's 2022 Commencement Speaker Taylor Swift", source: "YouTube", url: "https://www.youtube.com/watch?v=_at_RdsZoc4" }, { title: "A Commencement Address Too Honest to Deliver in Person", source: "The Atlantic", url: "https://www.theatlantic.com/ideas/archive/2020/05/commencement-address-too-honest-have-been-delivered-person/611572/" }] },
    { en: "Is learning better guided by critical reasoning or by traditional authority?", zh: "学习更应由批判性思考，还是由传统权威来引导？", resources: [{ title: "Why Individualism Fails to Create Individuals", source: "The Hedgehog Review", url: "https://hedgehogreview.com/web-features/thr/posts/why-individualism-fails-to-create-individuals" }] },
    { en: "What kind of person do you hope your university will shape you into?", zh: "你希望大学把你塑造成怎样的人？", resources: [{ title: "Why Harvard Decided to Challenge Donald Trump", source: "The New Yorker", url: "https://www.newyorker.com/news/the-lede/why-harvard-decided-to-challenge-donald-trump" }, { title: "First They Came for Columbia", source: "The Crimson", url: "https://www.thecrimson.com/article/2025/3/14/enos-levitsky-harvard-columbia-trump/" }] },
  ],
  [
    { en: "What do you know about DeepSeek?", zh: "你对 DeepSeek 了解多少？", resources: [{ title: "The Real Reason the Tech Bros Fear DeepSeek", source: "The Guardian", url: "https://www.theguardian.com/commentisfree/2025/feb/02/deepseek-ai-veil-of-mystique-tech-bros-fear" }] },
    { en: "When does technological invention become a problem rather than progress? Is innovation always a force for good?", zh: "技术发明何时不再代表进步？创新总是向善的吗？", resources: [{ title: "Gulliver's Travels", source: "Jonathan Swift" }, { title: "What Is Up with Car Door Handles These Days?", source: "The Guardian", url: "https://www.theguardian.com/commentisfree/2025/apr/05/tech-car-driving-government" }] },
    { en: "How can we adapt to the age of AI?", zh: "在人工智能时代，我们如何自处？", resources: [{ title: "A.I. Killed the Math Brain", source: "The Straits Times", url: "https://www.straitstimes.com/opinion/ai-killed-the-maths-brain" }, { title: "Don't Throw Your Dictionary Away", source: "The New York Times", url: "https://www.nytimes.com/2025/07/20/opinion/dictionary-ai-spelling-writing.html" }] },
  ],
  [
    { en: "Which film or book about family bonds has stayed with you most?", zh: "哪一部关于亲情或家庭纽带的电影、书籍最让你难忘？", resources: [{ title: "Modern Family", source: "TV series" }] },
    { en: "Have you ever seen or experienced the pressures of being a parentified child?", zh: "你是否见过或经历过“被迫早熟的孩子”所承受的压力？", resources: [{ title: "The Parentified Child", source: "Aeon", url: "https://aeon.co/essays/how-can-adults-undo-the-harm-of-being-parentified-as-children" }] },
    { en: "How can families nurture empathy instead of bullying?", zh: "家庭如何培养同理心，而不是助长霸凌？", resources: [{ title: "How Not to Raise a Bully: The Early Roots of Empathy", source: "TIME", url: "https://time.com/archive/6934307/how-not-to-raise-a-bully-the-early-roots-of-empathy/" }] },
  ],
  [
    { en: "What are your thoughts on gender stereotypes?", zh: "你如何看待性别刻板印象？", resources: [{ title: "JD Vance Isn't the First Man to Resent Cat Ladies — They've Always Been Politicized", source: "HuffPost", url: "https://www.huffpost.com/entry/jd-vance-cat-lady-symbol-meaning_l_66a7f022e4b07ad170d02010" }] },
    { en: "Can stereotypes ever be helpful?", zh: "刻板印象可能有益吗？", resources: [{ title: "Can Stereotypes Ever Be Good?", source: "TED Talk", url: "https://www.youtube.com/watch?v=aFXmyNUaXFo" }] },
    { en: "How can we respond when others stereotype us?", zh: "当他人用刻板印象看待我们时，我们该如何回应？", resources: [{ title: "The Power of Diversity Within Yourself", source: "TED Talk", url: "https://www.youtube.com/watch?v=ovKqmRyOGcg" }] },
  ],
  [
    { en: "What does a healthy relationship look like?", zh: "健康的亲密关系是什么样的？", resources: [{ title: "Love Is a Joint Project", source: "Aeon", url: "https://aeon.co/essays/simone-de-beauvoirs-authentic-love-is-a-project-of-equals" }] },
    { en: "What are the signs of an unhealthy relationship?", zh: "不健康的亲密关系有哪些信号？", resources: [{ title: "The Difference Between Healthy and Unhealthy Love", source: "YouTube", url: "https://www.youtube.com/watch?v=ON4iy8hq2hM" }, { title: "Turn Off the Gaslight", source: "Aeon", url: "https://aeon.co/essays/what-gaslighting-does-in-exploiting-trust-therapy-can-repair" }] },
    { en: "What is your favorite film about love, and why?", zh: "你最喜欢哪部关于爱的电影？为什么？", resources: [{ title: "Love Actually", source: "Film" }] },
  ],
] as const;

const commencementArticle = {
  title: "A Commencement Address Too Honest to Deliver in Person",
  byline: "By David Brooks, The Atlantic, Published May 13, 2020",
  dek: "I couldn’t say these things during a traditional ceremony, but these aren’t traditional times.",
  paragraphs: [
    "You bastards stood me up! You invited me to give this commencement address months ago. You never told me it was canceled. The speech I was intending to give fully lives up to the extremely mediocre norms of this genre. You invited me because I’m a person who has achieved some career success. You wanted me to open with some heartwarming jokes, and to drop the names of some obscure bands to prove that I’m hip to youth culture. Then you wanted me to conclude with inspiring stories about how moments of failure taught me valuable life lessons—especially about the need to give generously to your college’s alumni association.",
    "But since you didn’t show up, I’m going to give a different talk. First, here’s what I can’t say to you in front of your parents. Your parents are proud of you, and a little surprised that you’ve made it to graduation. They are eager for you to launch yourself off into a successful life. Screw that. The next few years are going to be a terrible time to start a career. So don’t do it. Put off launching your career until 2023. You happened to have graduated into a global emergency that has interrupted everything. That whole career-track thing you’ve been worrying about? Fundamentally interrupted. Don’t see this as a void; see it as a permission slip.",
    "Now let me tell you what I can’t tell you in front of the faculty and administrators. Graduation day is a good day to step back and reflect on all the things you’ve learned during college. It’s also a good day to step back and reflect on all the ways your college failed you. The biggest way most colleges fail is this: They don’t plant the intellectual and moral seeds students are going to need later, when they get hit by the vicissitudes of life. If you didn’t study Jane Austen while you were here, you probably lack the capacity to think clearly about making a marriage decision. If you didn’t read George Eliot, then you missed a master class on how to judge people’s character. If you didn’t read Nietzsche, you are probably unprepared to handle the complexities of atheism—and if you didn’t read Augustine and Kierkegaard, you’re probably unprepared to handle the complexities of faith. The list goes on. If you didn’t read de Tocqueville, you probably don’t understand your own country. If you didn’t study Gibbon, you probably lack the vocabulary to describe the rise and fall of cultures and nations.",
    "The wisdom of the ages is your inheritance; it can make your life easier. These resources often fail to get shared because universities are too careerist, or because faculty members are more interested in their academic specialties or politics than in teaching undergraduates, or because of a host of other reasons. But to get through life, you’re going to want to draw on that accumulated wisdom. Today is a good day to figure out where your college left gaps, and to start filling them.",
    "Finally, students, let me say the thing I can’t say to you in front of yourselves. It’s about your diet. No, I don’t mean your physical diet. I’m talking about your mental diet. What are you putting into your mind? My worry is that, especially now that you’re out of college, you won’t put enough really excellent stuff into your brain. I’m talking about what you might call the “theory of maximum taste.” This theory is based on the idea that exposure to genius has the power to expand your consciousness. If you spend a lot of time with genius, your mind will end up bigger and broader than if you spend your time only with run-of-the-mill stuff.",
    "In college, you get assigned hard things. You’re taught to look at paintings and think about science in challenging ways. After college, most of us resolve to keep doing this kind of thing, but we’re busy and our brains are tired at the end of the day. Months and years go by. We get caught up in stuff, settle for consuming Twitter and, frankly, journalism. Our maximum taste shrinks. Have you ever noticed that 70 percent of the people you know are more boring at 30 than they were at 20? Here’s what I can’t say to you in front of your face: I’m worried about the future of your maximum taste. People in my and earlier generations, at least those lucky enough to get a college education, got some exposure to the classics, which lit a fire that gets rekindled every time we sit down to read something really excellent. I worry that it’s possible to grow up now not even aware that those upper registers of human feeling and thought exist."
  ]
};

function UniversityFooter() {
  return <footer className="library-footer">
    <div className="library-footer-identity">
      <span><strong>CHINA WEST NORMAL</strong><em>UNIVERSITY</em></span>
      <img src="/media/china-west-normal-university-seal-transparent.png" alt="China West Normal University seal" />
    </div>
    <small>© 2026 China West Normal University</small>
  </footer>;
}

function InquireLab({ onNavigate, onHome }: { onNavigate: (view: View) => void; onHome: () => void }) {
  const [selected, setSelected] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(0);
  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const questions = inquirySets[selected] ?? [];
  const activeQuestion = selectedQuestion === null ? null : questions[selectedQuestion];
  const selectedResourceData = selectedResource === null ? undefined : activeQuestion?.resources[selectedResource];
  const opensPublication = Boolean(selectedResourceData && !["YouTube", "TED Talk", "TV series", "Film"].includes(selectedResourceData.source));
  const isCommencementArticle = selected === 0 && selectedQuestion === 0 && selectedResource === 1;
  const resourceImages: Record<string, string> = {
    "0-0-0": "/media/inquire-taylor.png", "0-0-1": "/media/inquire-clock.png", "0-1-0": "/media/inquire-individualism.png", "0-2-0": "/media/inquire-harvard.png", "0-2-1": "/media/inquire-columbia.png",
    "1-0-0": "/media/inquire-deepseek.png", "1-1-0": "/media/inquire-gulliver.png", "1-1-1": "/media/inquire-cybertruck.png", "1-2-0": "/media/inquire-ai.png", "1-2-1": "/media/inquire-dictionary.png",
    "2-0-0": "/media/inquire-modern-family.png", "2-1-0": "/media/inquire-parentified.png", "2-2-0": "/media/inquire-bully.png",
    "3-0-0": "/media/inquire-catlady.png", "3-1-0": "/media/inquire-stereotypes.png", "3-2-0": "https://i.ytimg.com/vi/ovKqmRyOGcg/maxresdefault.jpg",
    "4-0-0": "/media/inquire-love-joint.png", "4-1-0": "/media/inquire-healthy-love.png", "4-1-1": "/media/inquire-gaslight.png", "4-2-0": "/media/inquire-love-actually.png",
  };

  return (
    <main className="inquire-page">
      <Header view="guide" onNavigate={onNavigate} onHome={onHome} />
      <section className="inquire-picker" aria-labelledby="inquire-picker-title">
        <div className="inquire-picker-label">
          <p className="eyebrow" id="inquire-picker-title">SUPPLEMENTARY READING</p>
          <span>{activeQuestion ? "Resources for the selected question." : "Choose a discussion question to reveal resources."}</span>
        </div>
        <div className="inquire-materials" aria-live="polite" aria-label="Supplementary reading resources">
          {activeQuestion?.resources.map((resource, index) => {
            const image = selectedQuestion === null ? undefined : resourceImages[`${selected}-${selectedQuestion}-${index}`];
            const thumbnail = image ? <img className="inquire-resource-image" src={image} alt="" /> : <span className="inquire-resource-image is-placeholder" aria-hidden="true" />;
            return <button type="button" className={`inquire-external-card${selectedResource === index ? " is-selected" : ""}`} aria-pressed={selectedResource === index} onClick={() => setSelectedResource(index)} key={resource.title}>{thumbnail}<span>EXTERNAL {String(index + 1).padStart(2, "0")}</span><strong>{resource.title}</strong><em>{resource.source}</em></button>;
          })}
          {activeQuestion && !activeQuestion.resources.length && <p className="inquire-empty-materials">No supplementary reading has been assigned to this question yet.</p>}
          {!activeQuestion && <p className="inquire-empty-materials">Select a question on the right to reveal its supplementary readings.</p>}
        </div>
      </section>

      <section className="inquire-workspace" aria-label="Inquire Lab workspace">
        <aside className="inquire-path" aria-label="Archive articles">
          <p className="eyebrow">THE READING PATH</p>
          <ol>
            {articles.map((article, index) => <li key={article.number} className={selected === index ? "is-current" : ""}><button onClick={() => { setSelected(index); setSelectedQuestion(null); setSelectedResource(null); }}><span>{article.number}</span><strong>{article.theme}</strong><em>{article.title}</em></button></li>)}
          </ol>
        </aside>

        <aside className={`inquire-prompts${opensPublication ? " is-reading-publication" : ""}`} aria-labelledby="prompt-title">
          {opensPublication ? (
            <article className="inquire-publication">
              {isCommencementArticle ? <>
                <p className="eyebrow">EXTERNAL READING · THE ATLANTIC</p>
                <h1><a href={selectedResourceData?.url} target="_blank" rel="noreferrer">{commencementArticle.title}</a></h1>
                <p className="inquire-publication-byline">{commencementArticle.byline}</p>
                <p className="inquire-publication-dek">{commencementArticle.dek}</p>
                <div className="inquire-publication-body">{commencementArticle.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              </> : <>
                <p className="eyebrow">EXTERNAL READING</p>
                <h1>{selectedResourceData?.url ? <a href={selectedResourceData.url} target="_blank" rel="noreferrer">{selectedResourceData.title}</a> : selectedResourceData?.title}</h1>
                <p className="inquire-publication-byline">{selectedResourceData?.source}</p>
              </>}
            </article>
          ) : <>
            <p className="eyebrow" id="prompt-title">GUIDING QUESTIONS</p>
            {questions.map((question, index) => <button className={`inquire-question${selectedQuestion === index ? " is-selected" : ""}`} key={question.en} onClick={() => { setSelectedQuestion(index); setSelectedResource(null); }}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{question.en}</h2><p className="inquire-question-translation">{question.zh}</p></div></button>)}
            <div className="inquire-upload-note">
              <p className="eyebrow">HOW IT WORKS</p>
              <p>Choose an archive article, then a discussion question. Its linked external readings will appear above.</p>
            </div>
          </>}
        </aside>
      </section>
      <UniversityFooter />
    </main>
  );
}

function SimplePage({ view, onNavigate, onRead, onHome }: { view: Exclude<View, "library" | "reading">; onNavigate: (view: View) => void; onRead: (index: number) => void; onHome: () => void }) {
  const content = useMemo(() => ({
    guide: { kicker: "HOW TO READ", title: "Read first.\nAsk second.", body: ["Choose a text", "Read without analysis", "Follow the margins", "Reveal what you need", "Go deeper"] },
    index: { kicker: "ALL TEN TEXTS", title: "The index.", body: [] },
    about: { kicker: "ABOUT THE ARCHIVE", title: "Attention is\na form of inquiry.", body: ["This archive treats close reading as a sequence of choices. The page begins quietly; vocabulary, syntax, rhetoric, and context appear only when the reader asks."] },
  }[view]), [view]);

  return (
    <main className="simple-page">
      <Header view={view} onNavigate={onNavigate} onHome={onHome} />
      <section className="simple-intro">
        <p className="eyebrow">{content.kicker}</p>
        <h1>{content.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
      </section>
      {view === "index" ? (
        <ol className="article-index">
          {articles.map((article, index) => (
            <li key={article.number}>
              <button onClick={() => onRead(index)}>
                <span>{article.number}</span><strong>{article.title}</strong><em>{article.author}</em><b>↗</b>
              </button>
            </li>
          ))}
        </ol>
      ) : view === "guide" ? (
        <ol className="guide-list">
          {content.body.map((item, index) => <li key={item}><span>0{index + 1}</span><strong>{item}</strong><p>{["Explore the curved library and bring one text to the center.", "Let the language arrive before the explanation.", "Handwritten prompts mark places worth noticing.", "Open vocabulary, syntax, rhetoric, or context one at a time.", "Technical analysis waits until you explicitly request it."][index]}</p></li>)}
        </ol>
      ) : <p className="about-copy">{content.body[0]}</p>}
      <UniversityFooter />
    </main>
  );
}

function ReadingPage({ article, index, showMuckRakeIntro, onOpenMuckRakeIntro, onDismissMuckRakeIntro, onBack, onPrevious, onNext }: { article: Article; index: number; showMuckRakeIntro: boolean; onOpenMuckRakeIntro: () => void; onDismissMuckRakeIntro: () => void; onBack: () => void; onPrevious?: () => void; onNext?: () => void }) {
  const [panel, setPanel] = useState<"education" | "syntax" | "irony" | "why" | null>(null);
  const [syntaxLevel, setSyntaxLevel] = useState(1);
  const [notesOpen, setNotesOpen] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [vocabularyTarget, setVocabularyTarget] = useState<VocabularyTarget | undefined>();
  const navigation = (active: "text" | "analysis" | "quizzes" | "notes") => <nav className="reading-nav" aria-label="Article navigation">
    <button onClick={onBack}>← Library</button>
    <a className={`reading-nav-tab${active === "text" ? " is-active" : ""}`} href="#text" aria-current={active === "text" ? "location" : undefined} onClick={() => { setAnalysisMode(false); setQuizOpen(false); setNotesOpen(false); }}>Text</a>
    <button className={`reading-nav-tab${active === "analysis" ? " is-active" : ""}`} onClick={() => { setQuizOpen(false); setAnalysisMode(true); setNotesOpen(false); }}>Analysis</button>
    <button className={`reading-nav-tab${active === "quizzes" ? " is-active" : ""}`} onClick={() => { setAnalysisMode(false); setQuizOpen(true); setNotesOpen(false); }}>Quizzes</button>
    <button className={`reading-nav-tab${active === "notes" ? " is-active" : ""}`} aria-pressed={active === "notes"} onClick={() => { setAnalysisMode(false); setQuizOpen(false); setNotesOpen(value => !value); }}>Translation</button>
    <span className="reading-nav-count">{article.number} / 10</span>
    {onPrevious && <button className="reading-nav-previous" onClick={onPrevious} aria-label="Previous article">← Previous</button>}
    {onNext && <button onClick={onNext} aria-label="Next article">Next →</button>}
  </nav>;
  if (analysisMode && index <= 9) {
    return <div className="article-learning-shell">{navigation("analysis")}<SentenceStudio key={article.number} articleId={article.number} initialVocabulary={vocabularyTarget} onExit={() => { setAnalysisMode(false); setVocabularyTarget(undefined); }} /></div>;
  }

  if (quizOpen) {
    return <div className="article-learning-shell">{navigation("quizzes")}{index === 0 ? <ArticleOneQuiz /> : <QuizWorkspace article={article} onExit={() => setQuizOpen(false)} />}</div>;
  }

  if (index === 0 && showMuckRakeIntro) {
    return <MuckRakeIntro onBack={onBack} onReadText={onDismissMuckRakeIntro} />;
  }

  return (
    <main className="reading-page">
      {navigation(notesOpen ? "notes" : "text")}
      <header className="article-header">
        <p className="eyebrow">TEXT {article.number} · {article.theme}</p>
        <h1>{index >= 5 && getLesson(article.number) ? <LessonVocabularyTitle articleId={article.number} text={article.title} onSelect={(target) => { setVocabularyTarget(target); setAnalysisMode(true); window.scrollTo(0, 0); }}/> : article.title}</h1>
        {index === 0 ? (
          <button
            type="button"
            className="article-author-intro-trigger"
            onClick={onOpenMuckRakeIntro}
            aria-label="Open the Lincoln Steffens author introduction"
          >
            {article.author}
          </button>
        ) : <p>{article.author}</p>}
      </header>

      {index >= 2 && index <= 9 ? (
        <article id="text" className="reading-column"><div className="audio-dock"><span>LISTEN TO THE READING</span><audio controls preload="metadata" src={suppliedAudio[index]} /></div><p className="chapter-label">THE ORIGINAL TEXT · READ FIRST</p><div className="original-text">{fullArticleParagraphs[index].map((paragraph, paragraphIndex) => <p className="prose" key={paragraphIndex}><span className="paragraph-number">{String(paragraphIndex + 1).padStart(2, "0")}</span>{getLesson(article.number) ? <LessonVocabularyParagraph articleId={article.number} paragraph={paragraphIndex + 1} text={paragraph} onSelect={(target) => { setVocabularyTarget(target); setAnalysisMode(true); window.scrollTo(0, 0); }}/> : paragraph}</p>)}</div></article>
      ) : index > 9 ? (
        <section className="placeholder-text"><span className="ink-orbit" aria-hidden="true" /><p>The complete text has not yet been supplied.</p><small>This place is held without invented commentary.</small></section>
      ) : index === 1 ? (
        <article id="text" className="reading-column">
          <div className="audio-dock"><span>LISTEN TO THE READING</span><audio controls preload="metadata" src="/media/audio-should-the-robots-be-taxed.mp3" /></div>
          <p className="chapter-label">THE ORIGINAL TEXT · READ FIRST</p>
          <div className="original-text">{robotsParagraphs.map((paragraph, paragraphIndex) => <p className="prose" key={paragraphIndex}><span className="paragraph-number">{String(paragraphIndex + 1).padStart(2, "0")}</span><LessonVocabularyParagraph articleId="02" paragraph={paragraphIndex + 1} text={paragraph} onSelect={(target) => { setVocabularyTarget(target); setAnalysisMode(true); window.scrollTo(0, 0); }}/></p>)}</div>
        </article>
      ) : (
        <article id="text" className="reading-column">
          <div className="audio-dock"><span>LISTEN TO THE READING</span><audio controls preload="metadata" src="/media/audio-i-become-a-student.mp3" /></div>
          <p className="chapter-label">THE ORIGINAL TEXT · READ FIRST</p>
          <div className="original-text">
            {steffensParagraphs.map((paragraph, paragraphIndex) => <p className="prose" key={paragraphIndex}><span className="paragraph-number">0{paragraphIndex + 1}</span><VocabularyParagraph text={paragraph} sentenceStart={1 + steffensParagraphs.slice(0, paragraphIndex).reduce((total, part) => total + splitStudioSentences(part).length, 0)} onSelect={(target) => { setVocabularyTarget(target); setAnalysisMode(true); window.scrollTo(0, 0); }}/></p>)}
          </div>
          {analysisMode && <section className="sentence-atlas" aria-label="Sentence analysis cards">
            <p className="chapter-label">SENTENCE ATLAS · SELECT A CARD</p>
            <div className="sentence-grid">
              {["It is possible to get an education at a university.", "It has been done; not often, but the fact that a proportion, however small, of college students do get a start in interested, methodical study, proves my thesis.", "My method was hit on by accident and some instinct.", "I specialized.", "The historians did not know!", "History was not a science, but a field for research, a field for me.", "I was fascinated.", "There was something for Youth to do."].map((sentence, sentenceIndex) => <div className={`sentence-card ${sentenceIndex === 0 ? "featured" : ""}`} key={sentence}><span className="card-index">SENTENCE {String(sentenceIndex + 1).padStart(2, "0")}</span><p>{sentence}</p><div className="card-actions">{sentenceIndex === 0 ? <><button onClick={() => setPanel(panel === "syntax" ? null : "syntax")}>syntax?</button><button onClick={() => setPanel(panel === "education" ? null : "education")}>word?</button><button onClick={() => setPanel(panel === "irony" ? null : "irony")}>rhetoric?</button></> : <button>open a note ↗</button>}</div></div>)}
            </div>
          </section>}
          {analysisMode && <div className="annotated-sentence">
            <p>It is possible to get an education at a university.</p>
            <div className="annotation-triggers" aria-label="Annotations for this sentence">
              <button aria-expanded={panel === "why"} onClick={() => setPanel(panel === "why" ? null : "why")}>↖ why “it”?</button>
              <button aria-expanded={panel === "education"} onClick={() => setPanel(panel === "education" ? null : "education")}>education? ↗</button>
              <button aria-expanded={panel === "syntax"} onClick={() => { setPanel(panel === "syntax" ? null : "syntax"); setSyntaxLevel(1); }}>syntax? ↘</button>
              <button aria-expanded={panel === "irony"} onClick={() => setPanel(panel === "irony" ? null : "irony")}>irony? ↘</button>
            </div>
          </div>}

          {panel && <AnnotationReveal panel={panel} syntaxLevel={syntaxLevel} setSyntaxLevel={setSyntaxLevel} />}

        </article>
      )}

      {notesOpen && <aside className="notes-panel" aria-label="Revealed notes"><button onClick={() => setNotesOpen(false)} aria-label="Close notes">×</button><p className="eyebrow">YOUR NOTES</p><h2>What you noticed</h2>{panel ? <p><strong>{panel}</strong><br />Sentence 01 · revealed</p> : <p>Nothing revealed yet.<br /><small>Open a marginal note and it will appear here.</small></p>}</aside>}
    </main>
  );
}

type QuizLane = "Vocabulary" | "Structure" | "Reading";

const quizQuestions: Record<QuizLane, { eyebrow: string; prompt: string; options: string[]; answer: number; explanation: string }> = {
  Vocabulary: {
    eyebrow: "VOCABULARY · 01 / 08",
    prompt: "In the sentence “I was a curious boy,” what does curious emphasize?",
    options: ["A desire to find out and understand", "A habit of behaving well", "A strange or unusual appearance", "A talent for memorising facts"],
    answer: 0,
    explanation: "Here curious means “eager to know.” The contrast with a good boy shows that curiosity, rather than obedience, drives the speaker."
  },
  Structure: {
    eyebrow: "STRUCTURE · 01 / 08",
    prompt: "What is the role of “a field for research” in “History was not a science, but a field for research”?",
    options: ["The second predicative complement after but", "The direct object of was", "An adverbial of purpose", "A relative clause"],
    answer: 0,
    explanation: "It is the second predicative complement. The copula was is omitted after but: History was not a science, but [was] a field for research."
  },
  Reading: {
    eyebrow: "READING · 01 / 08",
    prompt: "Why does the narrator turn to other authorities?",
    options: ["The assigned books differ on important points", "He wants to avoid reading the required chapters", "The librarian refuses to help him", "The professor has cancelled the course"],
    answer: 0,
    explanation: "After quickly reading the assigned chapters, he notices that the books differ on several points and seeks further authorities."
  }
};

function QuizWorkspace({ article, onExit }: { article: Article; onExit: () => void }) {
  const [lane, setLane] = useState<QuizLane>("Vocabulary");
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const question = quizQuestions[lane];
  const chooseLane = (next: QuizLane) => { setLane(next); setSelected(null); setChecked(false); };
  const correct = selected === question.answer;

  return <main className="quiz-workspace">
    <header className="quiz-topbar">
      <button onClick={onExit}>← Full text</button>
      <span>QUIZZES</span>
      <b>TEXT {article.number}</b>
    </header>
    <section className="quiz-shell" aria-label="Quiz practice">
      <aside className="quiz-sidebar">
        <p className="quiz-kicker">PRACTICE DESK</p>
        <h1>{article.title}</h1>
        <p>Choose a practice lane. Each set keeps vocabulary, sentence structure, and reading inference separate.</p>
        <nav aria-label="Quiz categories">
          {(Object.keys(quizQuestions) as QuizLane[]).map((item, index) => <button key={item} aria-pressed={lane === item} onClick={() => chooseLane(item)}><span>0{index + 1}</span>{item}<small>8 questions</small></button>)}
        </nav>
        <div className="quiz-progress"><span>SESSION</span><strong>00 / 24</strong><i aria-hidden="true"><b /></i><small>Answers are checked one at a time.</small></div>
      </aside>
      <section className="quiz-paper">
        <div className="quiz-paper-heading"><p>{question.eyebrow}</p><span>▣</span></div>
        <h2>{question.prompt}</h2>
        <div className="quiz-options" role="radiogroup" aria-label="Answer choices">
          {question.options.map((option, index) => <button key={option} role="radio" aria-checked={selected === index} className={`${selected === index ? "is-selected" : ""}${checked && index === question.answer ? " is-correct" : ""}${checked && selected === index && !correct ? " is-incorrect" : ""}`} onClick={() => { if (!checked) setSelected(index); }}><b>{String.fromCharCode(65 + index)}</b><span>{option.replace(/^[A-D] /, "")}</span></button>)}
        </div>
        {checked ? <aside className={`quiz-feedback${correct ? " is-correct" : ""}`}><b>{correct ? "Correct" : "Review the clue"}</b><p>{question.explanation}</p><button onClick={() => { setSelected(null); setChecked(false); }}>Try another</button></aside> : <button className="quiz-check" disabled={selected === null} onClick={() => setChecked(true)}>Check answer →</button>}
      </section>
    </section>
  </main>;
}

type StudioPanel = "words" | "structure" | "meaning" | "voice" | "context" | "translation" | "paraphrase" | "reuse";
type StudioPanelItem = { id: StudioPanel; number: string; label: string };

const article01VocabularySentences = new Set([2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 25, 28, 29, 30, 32, 33, 38, 39]);
const article01FullPanels: readonly StudioPanel[] = ["words", "structure", "translation", "paraphrase"];
const article01StructurePracticePanels: readonly StudioPanel[] = ["structure", "paraphrase"];
const article01FrontOnlySentence = 37;

function article01PanelsForSentence(sentence: number): readonly StudioPanel[] {
  if (sentence === article01FrontOnlySentence) return [];
  return article01VocabularySentences.has(sentence) ? article01FullPanels : article01StructurePracticePanels;
}

function primaryStudioPanel(panel: StudioPanel): StudioPanel {
  if (["meaning", "translation", "voice", "context"].includes(panel)) return "translation";
  if (panel === "reuse") return "paraphrase";
  return panel;
}

const analysisPanels: StudioPanelItem[] = [
  { id: "words", number: "01", label: "Words" },
  { id: "structure", number: "02", label: "Structure" },
  { id: "meaning", number: "03", label: "Meaning" },
  { id: "voice", number: "04", label: "Voice" },
  { id: "context", number: "05", label: "Context" },
];

const practicePanels: StudioPanelItem[] = [
  { id: "translation", number: "A", label: "Translate" },
  { id: "paraphrase", number: "B", label: "Paraphrase" },
  { id: "reuse", number: "C", label: "Reuse" },
];

const studioPanels = [...analysisPanels, ...practicePanels];
const learningPanels: StudioPanelItem[] = [
  { id: "words", number: "01", label: "Words" },
  { id: "structure", number: "02", label: "Structure" },
  { id: "meaning", number: "03", label: "Meaning" },
  { id: "paraphrase", number: "04", label: "Practice" },
];

function clauseClass(label: string) {
  if (/MAIN/.test(label)) return "main";
  if (/INFINITIVE|PARTICIPIAL|GERUND|NON-FINITE|WITH-PHRASE/.test(label)) return "nonfinite";
  if (/PHRASE|MODIFIER|APPOSITIVE|COMMENT|VOCATIVE|FRAGMENT/.test(label)) return "supplement";
  return "subordinate";
}

function clauseChinese(label: string) {
  const labels: Record<string, string> = {
    "MAIN CLAUSE": "主句",
    "COORDINATE MAIN CLAUSE": "并列主句",
    "EXPLANATORY MAIN CLAUSE": "主句",
    "RELATIVE CLAUSE": "定语从句",
    "NON-RESTRICTIVE RELATIVE CLAUSE": "非限制性定语从句",
    "CONTENT CLAUSE": "宾语从句",
    "NOUN CONTENT CLAUSE": "名词内容从句（同位语从句）",
    "INTERROGATIVE CONTENT CLAUSE": "间接疑问内容从句",
    "FUSED RELATIVE SUBJECT": "主语从句／融合关系结构",
    "TIME CLAUSE": "时间状语从句",
    "REASON CLAUSE": "原因状语从句",
    "AS FRONTING CLAUSE": "表语前置的 as 从句",
    "CONCESSIVE AS-CLAUSE WITH FRONTED PREDICATIVE COMPLEMENT": "让步状语从句·前置表语（分词）",
    "EMBEDDED WH-INTERROGATIVE CLAUSE": "嵌入式 wh-疑问从句",
    "ELLIPTICAL CONCESSIVE CLAUSE": "省略式让步从句",
    "INFINITIVE COMPLEMENT": "不定式补语",
    "INFINITIVE MODIFIER": "不定式后置修饰语",
    "POSTPONED INFINITIVE SUBJECT": "后置不定式·真正主语",
    "PURPOSE INFINITIVE": "目的不定式",
    "FOR-INFINITIVE MODIFIER": "带逻辑主语的不定式后置修饰语",
    "PASSIVE INFINITIVE COMPLEMENT": "被动不定式补语",
    "INTERROGATIVE INFINITIVE CLAUSE": "疑问不定式结构",
    "SUPPLEMENTARY PARTICIPIAL CLAUSE": "补充性分词结构",
    "PARTICIPIAL MODIFIER": "分词后置定语",
    "PARTICIPIAL OBJECT COMPLEMENT": "分词宾语补足语",
    "NON-FINITE TIME CLAUSE": "非限定时间结构",
    "GERUND COMPLEMENT": "动名词补语",
    "BACKGROUND WITH-PHRASE": "with 复合结构·背景状语",
    "ADVERBIAL PHRASE": "状语短语",
    "APPOSITIVE NOUN PHRASE": "同位名词短语",
    "ADJECTIVAL MODIFIER": "形容词后置修饰语",
    "PREPOSITIONAL MODIFIER": "介词结构",
    "EXCEPTION ADVERBIAL": "例外状语",
    "PARENTHETICAL COMPARISON": "插入性比较从句",
    "ELLIPTICAL COMMENT": "省略式补充语",
    "DIRECT-SPEECH IMPERATIVE": "直接引语·祈使句",
    "VOCATIVE": "称呼语",
    "DISCOURSE FRAGMENT": "独立评语／片段",
  };
  return labels[label] ?? label;
}

function functionClass(label: string) {
  return grammarRole(label);
}

function functionLabelEnglish(label: string) {
  if (/形式主语/.test(label)) return "Formal subject";
  if (/真正主语/.test(label)) return "Postposed subject";
  if (/真正宾语/.test(label)) return "Object";
  if (/主语/.test(label)) return "Subject";
  if (/谓语|系动词|助动词|情态动词|中心动词/.test(label)) return "Predicate";
  if (/宾语/.test(label)) return "Object";
  if (/表语|补足|补语|介词补/.test(label)) return "Complement";
  if (/定语|修饰|同位|限定/.test(label)) return "Modifier";
  if (/状语|频率|背景|目的|地点|时间|原因|让步|伴随/.test(label)) return "Adverbial";
  if (/连词|连接|引导词|转折|关联|话语|礼貌|称呼|告别|回应|介词/.test(label)) return "Linker / discourse marker";
  if (/从句|引语|主句|组合|句子|片段|分句/.test(label)) return "Clause";
  if (/不定式|分词|动名词|非谓语/.test(label)) return "Non-finite structure";
  return "Function";
}

function findStructureEntry<T extends { key: string }>(entries: readonly T[], sentence: string) {
  return entries.find((entry) => sentence === entry.key);
}

function SentenceStructure({ sentence, articleId, existingFunctions, notebook = false }: { sentence: string; articleId: string; existingFunctions?: ReactNode; notebook?: boolean }) {
  const [clausesOpen, setClausesOpen] = useState(false);
  const [functionsOpen, setFunctionsOpen] = useState(false);
  useEffect(() => { setClausesOpen(false); setFunctionsOpen(false); }, [sentence]);
  const clauseEntry = articleId === "01" ? findStructureEntry(article01StructureData.clauses, sentence) : undefined;
  const functionEntry = articleId === "01" ? findStructureEntry(article01StructureData.functions, sentence) : undefined;
  const reviewNote = articleId === "01" ? findStructureEntry(article01StructureData.reviewNotes, sentence)?.note : undefined;
  const clauses = clauseEntry?.rows;
  const functions = functionEntry?.parts;

  if (notebook) return <div className="notebook-structure">
    <section className={`notebook-analysis-card${clausesOpen ? " is-open" : ""}`}>
      <div className="notebook-analysis-card-inner">
        <div className="notebook-analysis-card-face notebook-analysis-card-front" aria-hidden={clausesOpen}>
          <ClauseEntry onOpen={() => setClausesOpen(true)} disabled={clausesOpen}/>
        </div>
        <div className="notebook-analysis-card-face notebook-analysis-card-back" aria-hidden={!clausesOpen}>
          <header><div><h2>CLAUSE ARCHITECTURE</h2><p>Main and Subordinate Units</p></div><button type="button" aria-expanded={clausesOpen} tabIndex={clausesOpen ? 0 : -1} onClick={() => setClausesOpen(false)}>Back to prompt</button></header>
          <div className="notebook-analysis-answer">
            <StructureDiagram parts={functions ?? []} clauses={clauses ?? []} clauseChinese={clauseChinese} functionEnglish={functionLabelEnglish} functionClass={functionClass} />
            {reviewNote && <aside className="notebook-analysis-note"><strong className="analysis-note-heading">Grammar note · 句法批注</strong>{reviewNote}</aside>}
          </div>
        </div>
      </div>
    </section>
  </div>;

  return <div className="lexi-structure">
    <section className={`lexi-module clause-module ${clausesOpen ? "is-open" : ""}`}>
      {!clausesOpen ? <div className="lexi-turn">
        <p className="lexi-step">STEP 1 · CLAUSE ARCHITECTURE · 分句层级</p>
        <h2>Main and Subordinate Units <span>· 主句与从属结构</span></h2>
        <p>{notebook ? "先找主句，再判断哪些结构从属于它。" : "Identify the clause boundaries and dependency relations."}</p>
        <button aria-expanded={false} onClick={() => setClausesOpen(true)}>{notebook ? "点击翻面查看 · 主从结构" : "Reveal sentence analysis →"}</button>
      </div> : <>
        <header className="clause-module-head">
          <div><p className="lexi-step">STEP 1 · CLAUSE ARCHITECTURE · 分句层级</p><h2>Main and Subordinate Units <span>· 主句与从属结构</span></h2><small>Identify the clause boundaries and dependency relations.</small></div>
          <div className="lexi-legend clause-legend"><i className="main">Main · 主句</i><i className="subordinate">Subordinate · 从句</i><i className="nonfinite">Non-finite · 非限定</i><i className="supplement">Supplement · 补充</i></div>
        </header>
        <div className="clause-units">{clauses ? clauses.map(([label, text], index) => <div className={`clause-unit ${clauseClass(label)}`} key={`${label}-${index}`}><em>{String(index + 1).padStart(2, "0")}</em><b>{label}<small>{clauseChinese(label)}</small></b><span>{text}</span></div>) : <p className="study-pending">本句分句讲解待补充。</p>}</div>
        {reviewNote && <p className="structure-review-note">{reviewNote}</p>}
        <button className="return-turn" aria-expanded={true} onClick={() => setClausesOpen(false)}>{notebook ? "翻回题面 · 主从结构" : "CLAUSE MODEL · Click again to return"}</button>
      </>}
    </section>

    <section className={`lexi-module functions-module ${functionsOpen ? "is-open" : ""}`}>
      {!functionsOpen ? <div className="lexi-turn">
        <h2>Grammatical Functions <span>· 句法成分</span></h2>
        <p>{notebook ? "试着标出主语、谓语、补足语、修饰语和连接成分。" : "Mark the subject, predicate, complements, modifiers, and links before opening the model."}</p>
        <button aria-expanded={false} onClick={() => setFunctionsOpen(true)}>{notebook ? "点击翻面查看 · 句法成分" : "Reveal Grammatical Functions →"}</button>
      </div> : <div className="functions-answer">
        <h2>Grammatical Functions <span>· 句法成分</span></h2>
        <p className="analysis-purpose">STEP 2 · Read from left to right; each label sits directly above the words it analyses · 按原文顺序阅读，标签与对应词块上下对齐</p>
        <GrammarLegend/>
        {functions ? <div className="function-model"><div className="function-line"><b>COMPLETE SENTENCE · 完整句子</b><div>{functions.map(([label, text], index) => <span className={`function-unit ${functionClass(label)}`} key={`${label}-${index}`}><small>{label}</small><strong>{text}</strong></span>)}</div></div></div> : existingFunctions ?? <p className="study-pending">本句成分讲解待补充。</p>}
        {reviewNote && <p className="structure-review-note">{reviewNote}</p>}
        <button className="return-turn" aria-expanded={true} onClick={() => setFunctionsOpen(false)}>{notebook ? "翻回题面 · 句法成分" : "← Return"}</button>
      </div>}
    </section>
  </div>;
}

function AnalysisContent({ panel, depth, setDepth }: { panel: StudioPanel; depth: number; setDepth: (depth: number) => void }) {
  if (panel === "structure") {
    return (
      <>
        <p className="analysis-kicker">02 · CLAUSE ARCHITECTURE</p>
        {depth === 1 && <>
          <h2>Begin with four working parts.</h2>
          <dl className="function-list">
            <div><dt>It</dt><dd>formal / anticipatory subject</dd></div>
            <div><dt>is</dt><dd>copular verb</dd></div>
            <div><dt>possible</dt><dd>predicative complement</dd></div>
            <div><dt>to get an education at a university</dt><dd>logical content</dd></div>
          </dl>
          <button className="deeper-link" onClick={() => setDepth(2)}>Explore the structure →</button>
        </>}
        {depth === 2 && <>
          <h2>One sentence, two clause layers.</h2>
          <p className="marked-sentence">It is possible <mark>[to get an education at a university]</mark>.</p>
          <div className="clause-key"><span>outer clause / sentence frame</span><span>non-finite infinitival structure · 非限定不定式结构</span></div>
          <p className="ink-equation">clause <b>≠</b> independent sentence</p>
          <button className="deeper-link" onClick={() => setDepth(3)}>Inside the infinitival clause →</button>
        </>}
        {depth === 3 && <>
          <h2>Inside the infinitival clause.</h2>
          <div className="part-strips">
            <span><b>to</b><small>infinitival marker</small></span>
            <span><b>get</b><small>non-finite verb</small></span>
            <span><b>an education</b><small>object</small></span>
            <span><b>at a university</b><small>adverbial / adjunct</small></span>
          </div>
          <button className="deeper-link" onClick={() => setDepth(2)}>← Back to clause architecture</button>
        </>}
      </>
    );
  }
  if (panel === "words") return <><p className="analysis-kicker">01 · WORDS IN CONTEXT</p><h2>“Get an education” is not a credential.</h2><p>In this essay, the phrase gradually means developing the curiosity, method, capacity, and drive to keep learning—not simply attending a university.</p><p className="ink-equation">go to university <b>≠</b> get a degree <b>≠</b> get an education</p></>;
  if (panel === "meaning") return <><p className="analysis-kicker">03 · PROPOSITION</p><h2>Education is presented as a possibility, not a guarantee.</h2><p>The sentence makes a deliberately modest claim: a university can be the place where real education happens, but the institution alone does not ensure it.</p></>;
  if (panel === "voice") return <><p className="analysis-kicker">04 · VOICE &amp; EFFECT</p><h2>The next sentence activates the irony.</h2><div className="context-pair"><span>It is <em>possible</em> to get an education at a university.</span><b>↓</b><span>It has been done; <em>not often</em>…</span></div><p>The sentence is not automatically ironic in isolation. The dry follow-up turns the weak word “possible” into understatement—and then into deadpan criticism.</p></>;
  if (panel === "context") return <><p className="analysis-kicker">05 · EDUCATIONAL CONTEXT</p><h2>University attendance and education are not treated as synonyms.</h2><p>Steffens frames college as an institution that may provide access to learning without guaranteeing intellectual curiosity. The opening prepares the essay&apos;s central opposition: credentials and prescribed study on one side, independent inquiry on the other.</p><p className="context-note">Context is included here because it changes how we read the apparently ordinary word <em>university</em>—not simply to add background facts.</p></>;
  if (panel === "translation") return <><p className="analysis-kicker">A · TRANSLATE</p><h2>在大学里真正获得教育，是有可能的。</h2><p>译文保留了 <em>possible</em> 的克制语气，并用“真正”提示这里的 education 不只是上大学或取得文凭。</p></>;
  if (panel === "paraphrase") return <><p className="analysis-kicker">B · PARAPHRASE</p><h2>A university can give someone a genuine education, but that result is not guaranteed.</h2><p>The paraphrase makes the implication explicit while preserving the contrast between institutional attendance and actual learning.</p></>;
  return <><p className="analysis-kicker">C · REUSE</p><h2>It + be + adjective + to-infinitive</h2><div className="before-after-note"><span>To get an education at a university is possible.</span><b>→</b><span>It is possible to get an education at a university.</span></div><p>English often uses anticipatory <em>it</em> to move longer information to the end. This is <strong>extraposition</strong>, supported by the <strong>end-weight principle</strong>.</p></>;
}

function RobotAnalysisContent({ panel }: { panel: StudioPanel }) {
  if (panel === "words") return <><h2>go viral</h2><p className="word-definition">The phrase means that Gates&apos;s proposal is spreading rapidly through news and social media, becoming part of a wider public debate.</p><p className="word-muted">“Going viral” describes circulation, not illness.</p></>;
  if (panel === "structure") return <><p className="structure-review-note">A long noun phrase carries the claim.</p><div className="function-model"><div className="function-line"><b>SENTENCE PARTS · 句子词块</b><div>{[
    ["subject", "head of the subject noun phrase", "A video"],
    ["modifier", "postmodifier identifying the video", "of Bill Gates suggesting…"],
    ["predicate", "present progressive verb phrase", "is going viral"],
    ["adverbial", "adverbial of sphere / channel", "in the news and social media"],
  ].map(([role, label, text]) => <span className={`function-unit ${role}`} key={role}><small>{label}</small><strong>{text}</strong></span>)}</div></div></div></>;
  if (panel === "meaning") return <><p className="analysis-kicker">03 · PROPOSITION</p><h2>The debate arrives before the argument.</h2><p>The opening does not yet judge robot taxation. It first establishes that the proposal is circulating widely and is therefore worth examining.</p></>;
  if (panel === "voice") return <><p className="analysis-kicker">04 · VOICE &amp; EFFECT</p><h2>A topical, report-like opening.</h2><p>The sentence names a recognizable public figure, a controversial proposal, and its rapid spread. That compact news frame creates immediacy while postponing the writer&apos;s own position.</p></>;
  if (panel === "context") return <><p className="analysis-kicker">05 · DEBATE CONTEXT</p><h2>Automation links work, taxation, and social protection.</h2><p>The opening prepares the essay&apos;s central question: when machines replace paid labor, how should governments respond to changes in employment and tax revenue?</p></>;
  if (panel === "translation") return <><p className="student-sentence-translation" lang="zh-CN">比尔·盖茨建议对机器人征税的一段视频，正在新闻和社交媒体上迅速传播。</p><p className="student-paraphrase-note">“迅速传播”保留了 <em>going viral</em> 的网络语境，也避免把它误解为字面意义上的“病毒式感染”。</p></>;
  if (panel === "paraphrase") return <div className="student-paraphrase"><p className="student-paraphrase-sentence" lang="en">A video in which Bill Gates proposes a robot tax is spreading rapidly across news outlets and social platforms.</p><details className="student-paraphrase-comparison"><summary>改写思路</summary><p className="student-paraphrase-note">The paraphrase makes the relationship between the video and Gates&apos;s proposal explicit.</p></details></div>;
  return <div className="student-reuse"><p className="student-reuse-pattern">A/An + noun + of + noun + -ing…</p><div className="before-after-note"><span>Bill Gates suggests taxing robots in a video.</span><b>→</b><span>A video of Bill Gates suggesting that robots should be taxed…</span></div><p className="student-paraphrase-note">This pattern packages an event inside a noun phrase so it can function as the sentence subject.</p></div>;
}

function PendingStudyContent({ panel }: { panel: StudioPanel }) {
  if (panel === "translation") return <p className="student-sentence-translation study-pending">本句译文待补充。</p>;
  if (panel === "paraphrase") return <div className="student-paraphrase"><p className="student-paraphrase-sentence study-pending">本句改写待补充。</p><details className="student-paraphrase-comparison"><summary>改写思路</summary><p className="student-paraphrase-note study-pending">改写说明待补充。</p></details></div>;
  if (panel === "reuse") return <div className="student-reuse"><p className="student-reuse-pattern study-pending">句式待整理。</p><div className="student-reuse-practice"><p className="student-sentence-translation study-pending">仿写练习待补充。</p></div></div>;
  const titles: Partial<Record<StudioPanel, string>> = { meaning: "Meaning · 句意", voice: "Voice · 表达效果", context: "Context · 语境" };
  return <section className="study-note"><h2>{titles[panel]}</h2><p className="study-pending">本句讲解待补充。</p></section>;
}

function SentenceStudio({ onExit, articleId, initialVocabulary }: { onExit: () => void; articleId: string; initialVocabulary?: VocabularyTarget }) {
  const isRobots = articleId === "02";
  const isRoommates = articleId === "03";
  const isAppearances = articleId === "04";
  const isCourage = articleId === "05";
  const isSetup = articleId >= "06" && articleId <= "10";
  const appearancesConfig = isAppearances ? articleStudioConfigs["04"] : null;
  const courageConfig = isCourage ? article05StudioConfig : null;
  const setupConfig = isSetup ? articleStudioConfigs0610[articleId] : null;
  const paragraphs = isRobots ? robotsParagraphs : isRoommates ? roommatesParagraphs : isAppearances ? fullArticleParagraphs[3] : isCourage ? fullArticleParagraphs[4] : setupConfig ? fullArticleParagraphs[Number(articleId) - 1] : steffensParagraphs;
  const sentences = isRobots ? robotStudioSentences : isRoommates ? roommatesStudioSentences : isAppearances ? appearancesConfig!.sentences.map((sentence) => sentence.text) : isCourage ? courageConfig!.sentences.map((sentence) => sentence.text) : setupConfig ? setupConfig.sentences.map((sentence) => sentence.text) : studioSentences;
  const [selected, setSelected] = useState(initialVocabulary ? initialVocabulary.sentence - 1 : 0);
  const isStudent = articleId === "01";
  const [canvasOpen, setCanvasOpen] = useState(true);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [catThinking, setCatThinking] = useState(false);
  const [activePanel, setActivePanel] = useState<StudioPanel | null>(initialVocabulary ? "words" : null);
  const [structureDepth, setStructureDepth] = useState(1);
  const catTimer = useRef<number | null>(null);
  const protectedDraws = useRef<number[]>([]);
  const sentenceBoardRef = useRef<HTMLDivElement | null>(null);
  const paragraphRanges = useMemo(() => {
    const counts = isAppearances || isCourage || isSetup
      ? paragraphs.map((_, paragraphIndex) => (isAppearances ? appearancesConfig!.sentences : isCourage ? courageConfig!.sentences : setupConfig!.sentences).filter((sentence) => sentence.paragraphId === `a${articleId}-p${String(paragraphIndex + 1).padStart(2, "0")}`).length)
      : paragraphs.map((paragraph) => splitStudioSentences(paragraph, isRobots).length);
    return counts.map((count, paragraphIndex) => {
      const start = counts.slice(0, paragraphIndex).reduce((total, item) => total + item, 0);
      return { start, end: start + count - 1 };
    });
  }, [appearancesConfig, courageConfig, isAppearances, isCourage, isRobots, isSetup, articleId, paragraphs, setupConfig]);
  const activeParagraph = paragraphRanges.findIndex(({ start, end }) => selected >= start && selected <= end);
  const chooseSentence = (index: number) => { setSelected(index); setActivePanel(null); setStructureDepth(1); };
  const stepAnalysisSentence = (direction: -1 | 1) => {
    const next = selected + direction;
    if (next < 0 || next >= sentences.length) return;
    setSelected(next);
    setStructureDepth(1);
    window.requestAnimationFrame(() => {
      sentenceBoardRef.current?.querySelector(".student-detail-paper")?.scrollIntoView({ block: "start" });
    });
  };
  const draw = () => {
    const recentSeven = protectedDraws.current.slice(-7);
    const available = Array.from({ length: 50 }, (_, index) => index + 1).filter((number) => !recentSeven.includes(number));
    const next = available[Math.floor(Math.random() * available.length)];
    protectedDraws.current = [...recentSeven, next];
    setStudentId(next);
    setHistory((items) => [...items, next]);
    if (catTimer.current) window.clearTimeout(catTimer.current);
    setCatThinking(false);
    window.requestAnimationFrame(() => setCatThinking(true));
    catTimer.current = window.setTimeout(() => setCatThinking(false), 720);
  };
  useEffect(() => () => {
    if (catTimer.current) window.clearTimeout(catTimer.current);
  }, []);
  useEffect(() => {
    if (isStudent && (activePanel === "meaning" || activePanel === "voice" || activePanel === "context")) setActivePanel("translation");
  }, [activePanel, isStudent]);
  const togglePanel = (panel: StudioPanel) => {
    setActivePanel((current) => current === panel ? null : panel);
    if (panel === "structure") setStructureDepth(1);
  };
  const toggleCanvas = () => {
    setCanvasOpen((current) => {
      if (current) setActivePanel(null);
      return !current;
    });
  };
  const analysisReady = selected === 0 && (isStudent || isRobots);
  const currentAppearanceSentence = isAppearances ? appearancesConfig!.sentences[selected] : null;
  const currentCourageSentence = isCourage ? courageConfig!.sentences[selected] : null;
  const currentSetupSentence = isSetup ? setupConfig!.sentences[selected] : null;
  const article01SentenceNumber = selected + 1;
  const article01AvailablePanels = article01PanelsForSentence(article01SentenceNumber);
  const article01FrontOnly = article01SentenceNumber === article01FrontOnlySentence;
  const article01ActivePanel = activePanel === null || article01AvailablePanels.includes(primaryStudioPanel(activePanel)) ? activePanel : null;

  useEffect(() => {
    if (!isStudent || activePanel === null) return;
    const primaryPanel = primaryStudioPanel(activePanel);
    if (!article01AvailablePanels.includes(primaryPanel)) {
      setActivePanel(null);
    } else if (primaryPanel === "translation" && activePanel !== "translation") {
      setActivePanel("translation");
    }
  }, [activePanel, article01AvailablePanels, isStudent]);

  if (isStudent) return <ArticleOneNotebook sentences={sentences} selected={selected} paragraph={activeParagraph} ranges={paragraphRanges} panel={article01ActivePanel} onPanel={setActivePanel} onSelect={chooseSentence} onStep={stepAnalysisSentence} onExit={onExit} showClassificationBadge suppressClassificationLabel availablePanels={article01AvailablePanels} frontOnly={article01FrontOnly}>
    {article01ActivePanel === "words" ? <ArticleOneWords key={selected} initialSourceRow={initialVocabulary?.sentence === selected + 1 ? initialVocabulary.sourceRow : undefined} sentence={selected + 1} text={sentences[selected]} contextAdornment={<SentenceBadge sentence={selected + 1} compact hideClassificationLabel/>}/>
      : article01ActivePanel === "structure" ? <SentenceStructure key={`01-${selected}`} sentence={sentences[selected]} articleId="01" notebook/>
      : article01ActivePanel && <div className="student-existing-content">
        <nav className="student-subtabs" aria-label="Activities">{(["meaning", "translation", "voice", "context"].includes(article01ActivePanel) ? studioPanels.filter((item) => item.id === "translation") : practicePanels.filter((item) => item.id !== "translation")).map((item) => <button key={item.id} aria-pressed={item.id === article01ActivePanel} onClick={() => setActivePanel(item.id)}>{item.label}</button>)}</nav>
        {article01ActivePanel === "translation" ? <p className="student-sentence-translation" lang="zh-CN">{article01Translations[sentences[selected]]}</p>
          : article01ActivePanel === "paraphrase" ? <ArticleOneParaphrase key={selected} sentence={sentences[selected]}/>
          : article01ActivePanel === "reuse" ? <ArticleOneReuse key={selected} sentence={sentences[selected]}/>
          : analysisReady ? <AnalysisContent panel={article01ActivePanel} depth={structureDepth} setDepth={setStructureDepth}/>
          : <PendingStudyContent panel={article01ActivePanel}/>} 
      </div>}
  </ArticleOneNotebook>;

  const lesson = getLesson(articleId);
  if (lesson) {
    const sentence = lesson.sentences[selected];
    return <ArticleOneNotebook sentences={sentences} selected={selected} paragraph={activeParagraph} ranges={paragraphRanges} panel={activePanel} onPanel={setActivePanel} onSelect={chooseSentence} onStep={stepAnalysisSentence} onExit={onExit} articleId={articleId} title={lesson.title} audioSrc={sentence.audioSrc} catSrc={lesson.catSrc} sentenceClassification={sentence.classification}>
      {activePanel === "words" ? <LessonWords key={`${articleId}-${selected}`} lesson={lesson} sentence={sentence} initialSourceRow={initialVocabulary?.sentence === sentence.id ? initialVocabulary.sourceRow : undefined}/>
        : activePanel === "structure" ? <LessonStructure key={`${articleId}-${selected}`} sentence={sentence}/>
        : activePanel && <LessonActivities key={`${articleId}-${selected}`} lesson={lesson} sentence={sentence} panel={activePanel} onPanel={setActivePanel}/>}
    </ArticleOneNotebook>;
  }

  return (
    <main className="sentence-studio student-workspace-v2 student-studio" data-article-id={articleId}>
      <header className="studio-top">
        <button onClick={onExit}>← Full text</button>
        <span>SENTENCE STUDIO</span>
        <b>{String(selected + 1).padStart(2, "0")} / {sentences.length}</b>
      </header>

      <section className="studio-navigation">
        <nav className="paragraph-tabs" aria-label="Paragraph navigation">
          {paragraphRanges.map(({ start, end }, paragraphIndex) => <button className={paragraphIndex === activeParagraph ? "active" : ""} onClick={() => chooseSentence(start)} key={paragraphIndex}><span>Para {String(paragraphIndex + 1).padStart(2, "0")}</span><small>{String(start + 1).padStart(2, "0")}–{String(end + 1).padStart(2, "0")}</small></button>)}
        </nav>
        <nav className="sentence-nav" aria-label={`Paragraph ${activeParagraph + 1} sentence navigation`}>
          <span className="sentence-nav-label">SENTENCES</span>
          {paragraphRanges[activeParagraph] && sentences.slice(paragraphRanges[activeParagraph].start, paragraphRanges[activeParagraph].end + 1).map((_, localIndex) => {
            const sentenceIndex = paragraphRanges[activeParagraph].start + localIndex;
            return <button className={sentenceIndex === selected ? "active" : ""} onClick={() => chooseSentence(sentenceIndex)} key={sentenceIndex}>{String(sentenceIndex + 1).padStart(2, "0")}</button>;
          })}
        </nav>
      </section>

      <section className="archive-canvas">
        <button
          className={`archive-ink-gate ${isRobots ? "robot-ink-gate" : isRoommates ? "roommates-ink-gate" : isAppearances ? "appearances-ink-gate" : isCourage ? "courage-ink-gate" : ""} ${canvasOpen ? "is-open" : ""}`}
          style={isAppearances ? { backgroundImage: `url("${appearancesConfig!.lineArtSrc}")` } : isCourage ? { backgroundImage: `url("${courageConfig!.lineArtSrc}")` } : isSetup ? { backgroundImage: `url("${setupConfig!.lineArtSrc}")` } : undefined}
          onClick={toggleCanvas}
          aria-label={canvasOpen ? "Hide the sentence card" : "Open the sentence card"}
          aria-expanded={canvasOpen}
        />

        {canvasOpen && <div ref={sentenceBoardRef} className="sentence-board">
          <section className="cat-surgeon-stage" aria-label={isRobots ? "Who will debug today's sentence?" : isAppearances ? "Who will look twice at today's sentence?" : isCourage ? "Who will face today's sentence with courage?" : isSetup ? "Who will accompany today's sentence?" : "Who will be today's sentence surgeon?"}>
            <div className="surgeon-question" aria-hidden="true">
              <span>{isRobots ? "who will debug today&apos;s" : isRoommates ? "who will remember today&apos;s" : isAppearances ? "who will look twice at today's" : isCourage ? "who will meet today&apos;s" : isSetup ? "who will accompany today&apos;s" : "who will be today&apos;s"}</span>
              <strong>{isRobots ? "robot sentence?" : isRoommates ? "roommate story?" : isAppearances ? "first impression?" : isCourage ? "brave sentence?" : isSetup ? "new sentence?" : "sentence surgeon?"}</strong>
            </div>
            <button
              className={`cat-draw-button ${catThinking ? "is-thinking" : ""}`}
              onClick={draw}
              aria-label="点击小猫抽取学号"
            >
              <img src={isAppearances ? appearancesConfig!.catSrc : isCourage ? courageConfig!.catSrc : isSetup ? setupConfig!.catSrc : isRobots ? "/media/cat-robot-dream-mascot.png?v=1" : isRoommates ? "/media/cat-roommates-mascot.png?v=1" : "/media/cat-blackwhite-extended-doctoral.png?v=1"} alt={isAppearances ? "Gray-and-white tabby cat holding a worn leather briefcase and gripping the sentence card" : isCourage ? "Gray-and-white tabby cat holding a small yellow oil-paper umbrella beside the sentence card" : isSetup ? "Gray-and-white tabby cat in a theme-specific reading pose beside the sentence card" : isRobots ? "Black-and-white illustrated cat with subtle retro robot-dream details gripping the sentence card" : isRoommates ? "Light line-art cat in a knitted cardigan and reading glasses holding a small book" : "Black-and-white illustrated cat wearing a doctoral cap and gripping the sentence card"} />
            </button>
            <button className={`student-number-bubble ${studentId ? "has-number" : ""}`} onClick={() => setStudentId(null)} disabled={!studentId} aria-label={studentId ? "Clear the current student number" : "No student drawn yet; tap the cat to draw"}>
              <span><strong>{studentId ? String(studentId).padStart(2, "0") : "?"}</strong> / 50</span>
              <em>{studentId ? "tap to clear" : "tap the cat"}</em>
            </button>
            {history.length > 0 && <div className="cat-draw-memory">
              <span>last seven · <b aria-label={`Last seven draws: ${history.slice(-7).join(", ")}`}>{history.slice(-7).map((item) => String(item).padStart(2, "0")).join(" · ")}</b></span>
              <button onClick={() => { setHistory([]); setStudentId(null); }}>clear history</button>
            </div>}
          </section>
          {activePanel ? <article className="student-detail-paper" aria-label="Sentence learning card">
            <button type="button" className="sentence-step sentence-step-prev" aria-label="上一句" title="上一句" disabled={selected === 0} onClick={() => stepAnalysisSentence(-1)}>‹</button>
            <button type="button" className="sentence-step sentence-step-next" aria-label="下一句" title="下一句" disabled={selected === sentences.length - 1} onClick={() => stepAnalysisSentence(1)}>›</button>
            <header className="student-detail-header"><button onClick={() => setActivePanel(null)}>← 返回句子</button><span>SENTENCE {String(selected + 1).padStart(2, "0")} · PARA {String(activeParagraph + 1).padStart(2, "0")}</span></header>
            <nav className="student-detail-tabs" aria-label="Learning categories">
              {learningPanels.map((item) => <button key={item.id} aria-pressed={item.id === activePanel || (item.id === "meaning" && ["translation", "voice", "context"].includes(activePanel)) || (item.id === "paraphrase" && activePanel === "reuse")} onClick={() => setActivePanel(item.id)}>{item.label}</button>)}
            </nav>
            {activePanel !== "words" && <div className="word-context">{sentences[selected]}</div>}
            {activePanel === "words" ? (isStudent ? <ArticleOneWords key={selected} initialSourceRow={initialVocabulary?.sentence === selected + 1 ? initialVocabulary.sourceRow : undefined} sentence={selected + 1} text={sentences[selected]}/> : <PendingWordWorkspace key={`${articleId}-${selected}`} text={sentences[selected]} word={isRobots && analysisReady ? "go viral" : undefined} meaning={isRobots && analysisReady ? <RobotAnalysisContent panel="words"/> : undefined}/>) : activePanel === "structure" ? <SentenceStructure key={`${articleId}-${selected}`} sentence={sentences[selected]} articleId={articleId} existingFunctions={isRobots && analysisReady ? <RobotAnalysisContent panel="structure"/> : undefined}/> : <div className="student-existing-content">
              <nav className="student-subtabs" aria-label="Activities">{(["meaning", "translation", "voice", "context"].includes(activePanel) ? studioPanels.filter((item) => ["meaning", "translation", "voice", "context"].includes(item.id)) : practicePanels.filter((item) => item.id !== "translation")).map((item) => <button key={item.id} aria-pressed={item.id === activePanel} onClick={() => setActivePanel(item.id)}>{item.label}</button>)}</nav>
              {isStudent && activePanel === "translation" ? <p className="student-sentence-translation" lang="zh-CN">{article01Translations[sentences[selected]]}</p>
                : isStudent && activePanel === "paraphrase" ? <ArticleOneParaphrase key={selected} sentence={sentences[selected]}/>
                : isStudent && activePanel === "reuse" ? <ArticleOneReuse key={selected} sentence={sentences[selected]}/>
                : analysisReady ? (isRobots ? <RobotAnalysisContent panel={activePanel}/> : <AnalysisContent panel={activePanel} depth={structureDepth} setDepth={setStructureDepth}/>)
                : <PendingStudyContent panel={activePanel}/>}
            </div>}
          </article> : <article className="sentence-paper" data-sentence-id={currentAppearanceSentence?.sentenceId ?? currentCourageSentence?.sentenceId ?? currentSetupSentence?.sentenceId ?? `${articleId}-${selected + 1}`}>
            <span className="paper-index">SENTENCE {String(selected + 1).padStart(2, "0")} · PARA {String(activeParagraph + 1).padStart(2, "0")}</span>
            <div className="sentence-audio">
              <span>LISTEN · {String(selected + 1).padStart(2, "0")}</span>
              <audio key={currentAppearanceSentence?.sentenceId ?? currentCourageSentence?.sentenceId ?? currentSetupSentence?.sentenceId ?? selected} controls preload="metadata" src={isAppearances ? currentAppearanceSentence!.audioSrc : isCourage ? currentCourageSentence!.audioSrc : isSetup ? currentSetupSentence!.audioSrc ?? undefined : isRobots ? `/media/audio-robots-sentences/robot-sentence-${String(selected + 1).padStart(2, "0")}.mp3?v=20260827-robots` : isRoommates ? `/media/audio-roommates-sentences-v6/roommates-sentence-${String(selected + 1).padStart(2, "0")}.mp3?v=20260828-forced-alignment` : `/media/audio-sentences/sentence-${String(selected + 1).padStart(2, "0")}.mp3?v=20260827-audiofix`} />
            </div>
            <p>{sentences[selected]}</p>
            <nav className="analysis-tabs" aria-label="Sentence analysis categories">
              {learningPanels.map((item) => <button key={item.id} className={activePanel === item.id ? "active" : ""} aria-expanded={activePanel === item.id} onClick={() => togglePanel(item.id)}><small>{item.number}</small><span>{item.label}</span></button>)}
            </nav>
            <div className="student-entry-hint">☞ 点击入口，切换到对应学习卡片</div>
          </article>}
        </div>}

        {canvasOpen && !activePanel && <p className="canvas-prompt">Begin with a note. Practise only when you are ready.</p>}
      </section>
    </main>
  );
}

function AnnotationReveal({ panel, syntaxLevel, setSyntaxLevel }: { panel: "education" | "syntax" | "irony" | "why"; syntaxLevel: number; setSyntaxLevel: (level: number) => void }) {
  if (panel === "education") return <section className="annotation-reveal"><p className="reveal-label">VOCABULARY</p><h2>“Get an education”</h2><p>Here, education gradually means more than attending university or obtaining a credential.</p><div className="contrast">go to university <b>≠</b> get a degree <b>≠</b> get an education</div><button>Explore usage →</button></section>;
  if (panel === "irony") return <section className="annotation-reveal"><p className="reveal-label">RHETORIC</p><h2>The context turns the key.</h2><div className="irony-pair"><span>It is <i>possible</i> to get an education at a university.</span><b>↓</b><span>It has been done; <i>not often</i>…</span></div><p>The irony is activated by the next sentence. An expected certainty becomes a rare possibility: understatement with a deadpan edge.</p></section>;
  if (panel === "why") return <section className="annotation-reveal"><p className="reveal-label">WHY THIS STRUCTURE?</p><h2>The heavy idea arrives last.</h2><div className="before-after"><span>To get an education at a university <b>is possible.</b></span><i>→</i><span><b>It is possible</b> to get an education at a university.</span></div><p>English often places longer information near the end: <strong>extraposition</strong> and the <strong>end-weight principle</strong>.</p></section>;
  return <section className="annotation-reveal syntax-reveal"><p className="reveal-label">SYNTAX · LEVEL {syntaxLevel}</p>{syntaxLevel === 1 && <><h2>A simple overview</h2><dl><div><dt>It</dt><dd>formal / anticipatory subject</dd></div><div><dt>is</dt><dd>copular verb</dd></div><div><dt>possible</dt><dd>predicative complement</dd></div><div><dt>to get an education at a university</dt><dd>logical content</dd></div></dl><button onClick={() => setSyntaxLevel(2)}>Explore the structure →</button></>}{syntaxLevel === 2 && <><h2>Clause architecture</h2><p className="architecture">It is possible <mark>[to get an education at a university]</mark>.</p><div className="clause-note"><span>sentence / outer clause</span><span>non-finite infinitival clause</span></div><p className="equation">clause <b>≠</b> independent sentence</p><button onClick={() => setSyntaxLevel(3)}>Inside the infinitival clause →</button></>}{syntaxLevel === 3 && <><h2>Inside the clause</h2><div className="syntax-parts"><span><b>to</b><small>infinitival marker</small></span><span><b>get</b><small>non-finite verb</small></span><span><b>an education</b><small>object</small></span><span><b>at a university</b><small>adverbial / adjunct</small></span></div><button onClick={() => setSyntaxLevel(2)}>← Clause architecture</button></>}</section>;
}
