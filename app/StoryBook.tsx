"use client";

import { useEffect, useRef, useState } from "react";
import pages from "./storybookPages.json";
import { creativeSamples } from "./storybookCreative";
import { storybookWritingBoxes, type WritingBox as Box } from "./storybookLayout";
import { storybookTranslations, storybookPromptTranslations, storybookComicTranslations } from "./storybookTranslations";
import "./storybook.css";

type BookPage = (typeof pages)[number];
type Prompt = { trigger: string; title: string; body: string; box: Box };
type Example = { title: string; body: string; zh: string; titleZh: string; box?: Box; short?: boolean };

const pagePrompts: Record<number, Prompt[]> = {
  5: [
    { trigger: "Featuring fabulous", title: "Written by", body: "Nell Vale, with Pip the fox.", box: { x: 27, y: 60, w: 55, h: 4 } },
    { trigger: "If found", title: "If found", body: "Please return to Nell Vale, Bellweather Clock Shop. Ask for the girl with the red bootlace.", box: { x: 27, y: 71, w: 55, h: 5 } },
  ],
  14: [
    { trigger: "Beginning", title: "Beginning", body: "Wednesday goes missing.", box: { x: 28, y: 63, w: 61, h: 4 } },
    { trigger: "Build-up", title: "Build-up", body: "Nell finds the missing day locked in a jar in the clock tower.", box: { x: 28, y: 69, w: 61, h: 4 } },
    { trigger: "Problem", title: "Problem", body: "Grandfather hid Wednesday because he feared Nell would leave.", box: { x: 28, y: 75, w: 61, h: 4 } },
    { trigger: "Resolution", title: "Resolution", body: "Nell asks him to open the jar with her.", box: { x: 28, y: 82, w: 61, h: 4 } },
    { trigger: "End", title: "End", body: "The church clock strikes Wednesday. Grandfather tells her the goodbye he had been avoiding.", box: { x: 28, y: 88, w: 61, h: 4 } },
  ],
  22: [
    { trigger: "Five classes", title: "Five classes", body: "Art: blue paint on my sleeve. History: an old river map. Science: a seed splitting open. Music: the piano's missing key. Lunch: orange cake saved by Mara.", box: { x: 6, y: 9, w: 33, h: 12 } },
    { trigger: "Thursday", title: "Thursday", body: "After class, Mara and I found a drawing of our clock tower in a book printed a hundred years ago. Someone had written 'Nell Vale' beneath it. She turned the page over. There was a date in pencil: 1894.", box: { x: 7, y: 32, w: 82, h: 54 } },
  ],
  86: [
    { trigger: "__blank_3", title: "3", body: "His raffle ticket wins the prize.", box: { x: 28, y: 84, w: 15, h: 6 } },
    { trigger: "__blank_4", title: "4", body: "Then the ticket slips from his pocket.", box: { x: 40, y: 67, w: 15, h: 6 } },
    { trigger: "__blank_5", title: "5", body: "A puppy chews it into scraps.", box: { x: 52, y: 84, w: 14, h: 6 } },
    { trigger: "__blank_6", title: "6", body: "He tapes the number back together.", box: { x: 66, y: 67, w: 15, h: 6 } },
    { trigger: "__blank_7", title: "7", body: "He gives the prize to the shelter.", box: { x: 76, y: 84, w: 13, h: 6 } },
  ],
  12: [
    { trigger: "Once upon a time", title: "The hero", body: "Nell Vale was eleven, curious, and much better at fixing clocks than keeping secrets.", box: { x: 35, y: 26, w: 57, h: 8 } },
    { trigger: "Who lived", title: "The place", body: "She lived above her grandfather's clock shop in Bellweather, where every roof leaned toward the tower.", box: { x: 35, y: 42, w: 57, h: 9 } },
    { trigger: "One day", title: "The spark", body: "One Tuesday, a silver bell rang inside the kitchen wall. By morning, Wednesday had disappeared.", box: { x: 35, y: 59, w: 57, h: 9 } },
    { trigger: "And so", title: "The choice", body: "Nell followed the sound. She hoped to bring tomorrow home before anyone noticed it was gone.", box: { x: 35, y: 78, w: 57, h: 9 } },
  ],
  13: [
    { trigger: "However", title: "The problem", body: "Grandfather locked Wednesday in a jar because he feared Nell would leave Bellweather.", box: { x: 10, y: 17, w: 57, h: 10 } },
    { trigger: "Then", title: "The attempt", body: "Nell brought Mara and Pip to the tower and asked Grandfather to open it with her.", box: { x: 10, y: 37, w: 57, h: 10 } },
    { trigger: "Eventually", title: "The turning point", body: "Together they turned the old key. The jar cracked, and Wednesday returned.", box: { x: 10, y: 57, w: 57, h: 10 } },
    { trigger: "In the end", title: "The ending", body: "The church clock struck Wednesday. Grandfather told Nell he was leaving for a job in the next town, then asked her to visit.", box: { x: 10, y: 77, w: 57, h: 10 } },
  ],
  16: [
    { trigger: "Who or what", title: "Who?", body: "Nell Vale, eleven, apprentice clock-mender.", box: { x: 42, y: 32, w: 45, h: 8 } },
    { trigger: "Appearance", title: "Looks", body: "Ink-smudged sleeves, dark curls, one bright red bootlace.", box: { x: 60, y: 52, w: 28, h: 8 } },
    { trigger: "Strengths", title: "Strengths", body: "Patient and observant; afraid of deep water and lonely goodbyes.", box: { x: 5, y: 61, w: 21, h: 8 } },
    { trigger: "Name", title: "Name", body: "Nell Vale", box: { x: 36, y: 63, w: 19, h: 5 } },
    { trigger: "Personality", title: "Nature", body: "Kind, stubborn, funny when she forgets to be shy.", box: { x: 66, y: 71, w: 23, h: 8 } },
    { trigger: "Likes and dislikes", title: "Likes", body: "Warm bread, old maps, Pip. Dislikes unfair rules.", box: { x: 5, y: 83, w: 25, h: 8 } },
    { trigger: "Goals and ambitions", title: "Goal", body: "To bring tomorrow back without losing her friends.", box: { x: 42, y: 88, w: 40, h: 6 } },
  ],
  21: [
    { trigger: "Tuesday:", title: "Tuesday", body: "Pip followed me into the library and hid under a table. Mr Ward saw his tail but asked only whether my 'friend' had a library card.", box: { x: 10, y: 17, w: 62, h: 27 } },
    { trigger: "Wednesday:", title: "Wednesday", body: "The clocks slipped back to Tuesday during our spelling test. I was the only one who noticed. Then Mara arrived, soaked from the train and carrying a torch. I had never been so glad to see anyone.", box: { x: 10, y: 57, w: 62, h: 28 } },
  ],
  23: [
    { trigger: "Friday:", title: "Friday", body: "I showed Mara the drawing of our clock tower. She turned it over and found a date: 1894. Neither of us spoke for a moment.", box: { x: 11, y: 20, w: 60, h: 27 } },
    { trigger: "The weekend:", title: "The weekend", body: "We climbed the tower with Pip. Behind the clock face, Grandfather's old key opened a narrow door. Inside was a child's coat and a bundle of letters tied with blue thread.", box: { x: 11, y: 62, w: 42, h: 25 } },
    { trigger: "My new best", title: "Friends", body: "Mara reads the whole letter before asking questions. Pip sits on the page when he thinks we should stop.", box: { x: 62, y: 78, w: 26, h: 10 } },
  ],
  84: [
    { trigger: "List them here", title: "Possible titles", body: "The Missing Wednesday · The Clockmaker's Daughter · A Fox at School · The Girl with the Blue Thread · The Seventh Island · Clover at the Old Fence · The Last Train to Larkspur. Nell crosses out two, then writes a question mark beside the last one.", box: { x: 12, y: 36, w: 74, h: 16 } },
    { trigger: "The adventures", title: "The talking dog", body: "A Bark Across the Map", box: { x: 34, y: 71, w: 54, h: 7 } },
    { trigger: "A boy who has", title: "The dinosaur", body: "The Boy Who Fed His Homework to a Dinosaur", box: { x: 34, y: 80, w: 54, h: 7 } },
    { trigger: "A princess who dreams", title: "The astronaut", body: "The Princess Who Borrowed a Telescope", box: { x: 34, y: 89, w: 54, h: 6 } },
  ],
  94: [
    { trigger: "Try writing a micro", title: "A key", body: "Nell found a key in the library return slot. The next day, a woman came back for it. She had been trying to open the shed where her father's tools were kept.", box: { x: 36, y: 34, w: 49, h: 22 } },
    { trigger: "Use a snippet of conversation", title: "A glove", body: "'Is this yours?' asked the baker. The fox looked at the glove, then at the acorns spilling from it. 'It was,' he said.", box: { x: 42, y: 70, w: 43, h: 20 } },
  ],
  95: [
    { trigger: "Imagine going", title: "The journey", body: "Mara boarded the last train. The conductor checked her ticket twice; no destination was printed on it.", box: { x: 41, y: 11, w: 40, h: 15 } },
    { trigger: "Use a saying", title: "Pigs might fly", body: "When pigs learned to fly, the airport shut its doors. The cleaner knew a service ladder to the roof.", box: { x: 42, y: 39, w: 44, h: 18 } },
    { trigger: "Think of an intriguing", title: "The mirror", body: "Nell bought a cracked mirror at a jumble sale. Each morning, it showed one chair pulled away from the table.", box: { x: 41, y: 70, w: 38, h: 18 } },
  ],
};

const comicBubbles: Record<number, Array<{ text: string; box: Box }>> = {
  40: [
    { text: "Kit, your parrot took my compass!", box: { x: 51, y: 8, w: 35, h: 5 } },
    { text: "The X is moving!", box: { x: 11, y: 46, w: 20, h: 13 } },
    { text: "So is the treasure.", box: { x: 53, y: 42, w: 14, h: 3.5 } },
    { text: "That island wasn't there yesterday.", box: { x: 43, y: 72, w: 39, h: 5 } },
    { text: "Neither was this boat. Keep sailing!", box: { x: 45, y: 85, w: 38, h: 7 } },
  ],
  41: [
    { text: "Those clouds look hungry.", box: { x: 24, y: 10, w: 26, h: 12 } },
    { text: "Clouds don't have teeth... do they?", box: { x: 47, y: 33, w: 38, h: 8 } },
    { text: "Hold on to the mast!", box: { x: 13, y: 58, w: 16, h: 12 } },
    { text: "Hold on to the parrot!", box: { x: 70, y: 63, w: 17, h: 12 } },
    { text: "Nobody asked the parrot!", box: { x: 74, y: 85, w: 15, h: 6 } },
  ],
  42: [
    { text: "I can see the island again!", box: { x: 14, y: 10, w: 25, h: 14 } },
    { text: "And I can see the fins!", box: { x: 58, y: 13, w: 26, h: 13 } },
    { text: "Maybe they're showing us the way.", box: { x: 13, y: 51, w: 26, h: 16 } },
    { text: "Then we'd better thank them!", box: { x: 63, y: 62, w: 24, h: 12 } },
  ],
  43: [
    { text: "Follow that dolphin to shore!", box: { x: 37, y: 6, w: 48, h: 10 } },
    { text: "The dotted line ends under the palm tree!", box: { x: 38, y: 34, w: 46, h: 12 } },
    { text: "Seeds? A treasure that grows!", box: { x: 39, y: 69, w: 45, h: 12 } },
  ],
};

function sourceTriggerIndex(page: BookPage): number {
  if (page.cover) return -1;
  const trigger = creativeSamples[page.page].trigger;
  if (trigger) {
    const match = page.lines.findIndex(line => line.text.toLowerCase().includes(trigger.toLowerCase()));
    if (match >= 0) return match;
  }
  return page.lines.findIndex(line => /[a-z]{3}/i.test(line.text) && line.y < 78);
}

export function StoryBook() {
  const [index, setIndex] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [openExamples, setOpenExamples] = useState<number[]>([]);
  const [chineseExamples, setChineseExamples] = useState<number[]>([]);
  const page = pages[index] as BookPage;
  const sample = creativeSamples[page.page];
  const translation = storybookTranslations[page.page];
  const stage = useRef<HTMLDivElement>(null);
  const isComic = Boolean(comicBubbles[page.page]);
  const prompts = pagePrompts[page.page];
  const examples: Example[] = isComic
    ? comicBubbles[page.page].map((bubble, i) => ({ title: "", titleZh: "", body: bubble.text, zh: storybookComicTranslations[page.page][i], box: bubble.box, short: true }))
    : prompts
      ? prompts.map((prompt, i) => ({ ...prompt, titleZh: "", zh: storybookPromptTranslations[page.page][i], short: true }))
      : [{ title: sample.title, titleZh: translation.title, body: sample.body, zh: translation.body, box: storybookWritingBoxes[page.page] }];
  const selectedTrigger = sourceTriggerIndex(page);
  const externalExample = !examples[0].box;
  const toggleExample = (i: number) => setOpenExamples(current => current.includes(i) ? current.filter(item => item !== i) : [...current, i]);
  const toggleAll = () => setOpenExamples(current => current.length ? [] : examples.map((_, i) => i));
  const toggleLanguage = (i: number) => setChineseExamples(current => current.includes(i) ? current.filter(item => item !== i) : [...current, i]);
  const move = (next: number) => {
    if (next < 0 || next >= pages.length) return;
    setIndex(next);
    setOpenExamples([]);
    setChineseExamples([]);
    stage.current?.scrollIntoView({ block: "start", behavior: "auto" });
  };

  useEffect(() => {
    const prefetch = new Image();
    prefetch.src = pages[Math.min(index + 1, pages.length - 1)].art;
  }, [index]);

  const renderExample = (example: Example, i: number) => {
    if (!openExamples.includes(i)) return null;
    const chinese = chineseExamples.includes(i);
    const box = example.box;
    return <div key={`${page.page}-${i}`} id={`storybook-example-${page.page}-${i}`}
      className={`storybook-example ${box ? "storybook-example--inset" : "storybook-example--drawer"} ${example.short ? "storybook-example--short" : ""} ${isComic ? "storybook-example--comic" : ""}`}
      data-writing-box={box ? JSON.stringify(box) : undefined}
      style={box ? { left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` } : undefined}
      tabIndex={0} aria-label={`${sample.title}: writing area ${i + 1}`}>
      <button type="button" className="storybook-example-text" lang={chinese ? "zh-CN" : "en"}
        aria-label={chinese ? "返回英文范例" : "点击英文查看中文释义"} aria-pressed={chinese}
        onClick={() => toggleLanguage(i)}>
        {!example.short && <strong>{chinese ? example.titleZh : example.title}</strong>}
        <span>{chinese ? example.zh : example.body}</span>
      </button>
    </div>;
  };

  return <div className="storybook" ref={stage}>
    <nav className="storybook-nav" aria-label="Book pages">
      <button type="button" onClick={() => move(index - 1)} disabled={index === 0}>← Previous</button>
      <label><span>Write Your Own Story Book</span><select aria-label="Choose a book page" value={index} onChange={event => move(Number(event.target.value))}>
        {pages.map((item, i) => <option key={item.page} value={i}>Page {item.page} / {pages.length}</option>)}
      </select></label>
      <button type="button" onClick={() => move(index + 1)} disabled={index === pages.length - 1}>Next →</button>
    </nav>
    <div className="storybook-mode">
      <button type="button" className="storybook-examples-toggle" aria-expanded={openExamples.length > 0}
        onClick={() => { setShowOriginal(false); toggleAll(); }}>
        {openExamples.length ? "Hide writing examples" : "Show writing examples"}
      </button>
      <button type="button" aria-pressed={showOriginal} onClick={() => setShowOriginal(value => !value)}>{showOriginal ? "Read HTML page" : "Compare original page"}</button>
    </div>
    {!showOriginal && externalExample && openExamples.length > 0 && <aside className="storybook-example-drawer" aria-label="Original writing example">{examples.map(renderExample)}</aside>}
    <article className="storybook-sheet" aria-label={`Book page ${page.page}`} style={{ aspectRatio: `${page.width} / ${page.height}` }}>
      <img className="storybook-art" src={showOriginal ? `/narrative-course/storybook/original/page-${String(page.page).padStart(3, "0")}.webp` : page.art} alt={showOriginal ? `Original printed page ${page.page}` : ""} aria-hidden={!showOriginal} />
      {!showOriginal && <div className={`storybook-html ${page.cover ? "storybook-html--cover" : ""}`} lang="en">
        {page.lines.map((line, lineIndex) => {
          const style = { left: `${line.x}%`, top: `${line.y}%`, width: `${Math.min(99 - line.x, Math.max(line.w + 1, line.w * 1.1))}%`, fontSize: `${Math.min(5.5, Math.max(0.85, Math.min(1.5 * Math.sqrt(line.h), line.w / Math.max(1, line.text.length * 0.48))))}cqw`, color: line.color };
          const promptIndex = prompts
            ? prompts.findIndex(prompt => line.text.toLowerCase().includes(prompt.trigger.toLowerCase()))
            : lineIndex === selectedTrigger ? 0 : -1;
          return promptIndex >= 0 ? <button className="storybook-line storybook-line--trigger" type="button"
            aria-expanded={openExamples.includes(promptIndex)} aria-controls={`storybook-example-${page.page}-${promptIndex}`}
            aria-label={`Read the writing example for ${prompts?.[promptIndex]?.title ?? sample.title}`}
            key={`${page.page}-${lineIndex}`} style={style}
            onClick={() => isComic ? toggleAll() : toggleExample(promptIndex)}>{line.text}</button>
            : <span className="storybook-line" key={`${page.page}-${lineIndex}`} style={style}>{line.text}</span>;
        })}
        {!externalExample && examples.map(renderExample)}
      </div>}
    </article>
    <p className="storybook-credit">Louie Stowell · <cite>Write Your Own Story Book</cite> · Usborne Books (2011) · {page.page} / {pages.length}</p>
  </div>;
}
