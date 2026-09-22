import { afterTwentyStoryParagraphs } from "./afterTwentyStoryText";
import { copAnthemStoryParagraphs } from "./copAnthemStoryText";
import { daysWaitStoryParagraphs } from "./daysWaitStoryText";
import { earlyAutumnStoryParagraphs } from "./earlyAutumnStoryText";
import { eggStoryParagraphs } from "./eggStoryText";
import { fatStoryParagraphs } from "./fatStoryText";
import { flowersStoryParagraphs } from "./flowersStoryText";
import { lastLeafStoryParagraphs } from "./lastLeafStoryText";
import { necklaceStoryParagraphs } from "./necklaceStoryText";
import { storyHourStoryParagraphs } from "./storyHourStoryText";
import { triflesStoryParagraphs } from "./triflesStoryText";
import { veryShortStoryParagraphs } from "./veryShortStoryText";

function escapeStoryText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderStoryParagraphs(paragraphs: readonly string[]) {
  const isPlay = paragraphs[0]?.trim() === "CHARACTERS";
  let openingAssigned = false;

  return paragraphs
    .map((paragraph) => {
      const text = paragraph.trim();
      if (text === "* * *") return `<p class="reading-full-text-divider">* * *</p>`;
      if (text === "CHARACTERS") return `<h3 class="reading-full-text-section-title">CHARACTERS</h3>`;
      if (text === "CURTAIN") return `<p class="reading-full-text-curtain">CURTAIN</p>`;

      const classes: string[] = [];
      if (text.startsWith("[")) classes.push("reading-full-text-stage-direction");
      if (/^[A-Z][A-Z .’'-]+:/.test(text)) classes.push("reading-full-text-script-line");
      if (!isPlay && !openingAssigned && classes.length === 0) {
        classes.push("reading-full-text-opening");
        openingAssigned = true;
      }

      const className = classes.length ? ` class="${classes.join(" ")}"` : "";
      return `<p${className}>${escapeStoryText(paragraph)}</p>`;
    })
    .join("\n");
}

function renderFullTextArticle({
  id,
  title,
  deck,
  author,
  kicker = "FICTION",
  label = "Short fiction",
  paragraphs,
}: {
  id: string;
  title: string;
  deck: string;
  author: string;
  kicker?: string;
  label?: string;
  paragraphs: readonly string[];
}) {
  const articleContent = `
          <header class="reading-full-text-header">
            <p class="reading-full-text-kicker">${escapeStoryText(kicker)} · FULL TEXT</p>
            <h2 id="${id}-text-title">${escapeStoryText(title)}</h2>
            <p class="reading-full-text-deck">${escapeStoryText(deck)}</p>
            <div class="reading-full-text-byline"><span>By ${escapeStoryText(author)}</span><span>${escapeStoryText(label)}</span></div>
          </header>
          <div class="reading-full-text-body">
            ${renderStoryParagraphs(paragraphs)}
          </div>
          <footer>THE END</footer>`;

  return `
        <article class="reading-full-text" aria-labelledby="${id}-text-title">
          ${articleContent}
        </article>`;
}

export const narrativeWritingMarkup = String.raw`
    <header class="site-nav" aria-label="Primary navigation">
      <nav class="nav-pill">
        <a href="#intro" data-nav-link="intro">Course Introduction</a>
        <a href="#objectives" data-nav-link="objectives">Objectives</a>
        <a href="#instructor" data-nav-link="instructor">Instructor</a>
        <a href="#units" data-nav-link="units">Units</a>
        <a href="#assessment" data-nav-link="assessment">Assessment</a>
        <a href="#reading" data-nav-link="reading">Reading</a>
      </nav>
    </header>

    <main>
      <section class="slide cover-slide" id="cover" aria-labelledby="cover-title">
        <div class="cover-content">
          <div class="brand-mark" aria-label="Narrative Writing">
            <span></span><span></span><span></span><span></span>
          </div>
          <p class="brand-caption">Narrative Writing</p>
          <h1 id="cover-title" class="cover-title cover-title--interactive" data-interactive-title="Write What Matters" aria-label="Write What Matters">Write What Matters</h1>
          <p class="cover-meta">2026–2027-1 Narrative Writing</p>
          <p class="cover-meta">Zhang Rongrong | Rachel | 2026.9.17</p>
          <a class="black-button" href="#intro">Course introduction</a>
        </div>
        <div class="cover-books-wrap" role="group" aria-label="Six narrative writing unit books">
          <div class="cover-book" style="--book-x: 0.933333%; --book-width: 15.933333%"><img src="/narrative-writing/assets/cover-book-01.png" width="239" height="426" alt="01 — Life and Value" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 16.933333%; --book-width: 18.066667%"><img src="/narrative-writing/assets/cover-book-02.png" width="271" height="426" alt="02 — Empathy and Justice" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 35%; --book-width: 8.933333%"><img src="/narrative-writing/assets/cover-book-03.png" width="134" height="426" alt="03 — Growth and Maturity" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 43.933333%; --book-width: 22.2%"><img src="/narrative-writing/assets/cover-book-04.png" width="333" height="426" alt="04 — Truth and Interpretation" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 66.133333%; --book-width: 16.466667%"><img src="/narrative-writing/assets/cover-book-05.png" width="247" height="426" alt="05 — Dream and Faith" draggable="false" /></div>
          <div class="cover-book" style="--book-x: 82.6%; --book-width: 17.4%"><img src="/narrative-writing/assets/cover-book-06.png" width="261" height="426" alt="06 — Conflict and Harmony" draggable="false" /></div>
        </div>
      </section>

      <section class="slide intro-slide" id="intro" data-nav="intro" aria-labelledby="intro-title">
        <div class="slide-header">
          <div>
            <h2>Narrative Writing</h2>
            <p>COURSE INTRODUCTION</p>
          </div>
        </div>
        <div class="intro-grid">
          <div class="intro-title-block">
            <p class="section-kicker">COURSE INTRODUCTION</p>
            <h1 id="intro-title">Why learn<br />this course?</h1>
            <div class="narrative-card" aria-label="The narrative arc">
              <p>01 / THE NARRATIVE ARC</p>
              <div class="narrative-letter">N<span class="narrative-arc"></span></div>
              <small>Read life closely.<br />Write with attention.</small>
            </div>
            <p class="aside-note">Narrative writing starts<br />with what you notice.</p>
          </div>
          <article class="yellow-note">
            <p>Through this course, students will develop an appreciation for effective narrative writing, mastering key techniques in storytelling. You’ll draw upon your existing experience with Chinese narrative writing while enhancing your command of English vocabulary and grammar. By learning to keenly observe and reflect on life, students will ultimately acquire the skills to tell vivid and engaging stories in English.</p>
            <div class="note-rule"></div>
            <div class="three-words"><span><i class="dot coral"></i>OBSERVE</span><span><i class="dot blue"></i>REFLECT</span><span><i class="dot green"></i>TELL</span></div>
          </article>
        </div>
      </section>

      <section class="slide objective-slide objective-1" id="objectives" data-nav="objectives" aria-labelledby="objective-1-title">
        <div class="slide-header">
          <div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div>
        </div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 01 / 05</p></div>
          <h1 id="objective-1-title">1) Master 8,000–10,000 words, use<br class="desktop-only" /> 2,000 common expressions and write a<br class="desktop-only" /> 200-word narrative essay within 30 minutes<br class="desktop-only" /> with clear organization and correct grammar.</h1>
        </div>
        <div class="objective-art art-clock"><span class="mini-tag">8K–10K</span><span class="art-line"></span><span class="clock-face">◷</span><b>30′</b></div>
        <div class="slide-footer"><span><i class="dot coral"></i>VOCABULARY · EXPRESSION · GRAMMAR</span><strong>01 / 05</strong></div>
      </section>

      <section class="slide objective-slide objective-2" data-nav="objectives" aria-labelledby="objective-2-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div></div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 02 / 05</p></div>
          <h1 id="objective-2-title">2) Understand narrative writing basics<br class="desktop-only" /> [five elements], use grammar and<br class="desktop-only" /> sentence connections correctly, and write<br class="desktop-only" /> coherent, well-structured sentences and<br class="desktop-only" /> paragraphs with clear detail and unity.</h1>
        </div>
        <div class="objective-art art-steps"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span></div>
        <div class="slide-footer"><span><i class="dot yellow"></i>FIVE ELEMENTS · GRAMMAR · CONNECTION</span><strong>02 / 05</strong></div>
      </section>

      <section class="slide objective-slide objective-3" data-nav="objectives" aria-labelledby="objective-3-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div></div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 03 / 05</p></div>
          <h1 id="objective-3-title">3) Use varied sentence structures and<br class="desktop-only" /> rhetorical techniques to write expressively,<br class="desktop-only" /> while developing peer collaboration, reading,<br class="desktop-only" /> and presentation skills.</h1>
        </div>
        <div class="objective-art art-dialogue"><span class="speech one">—</span><span class="speech two">—</span><span class="blue-thread"></span><span class="pink-arrow">➜</span></div>
        <div class="slide-footer"><span><i class="dot blue"></i>RHETORIC · READING · PRESENTATION</span><strong>03 / 05</strong></div>
      </section>

      <section class="slide objective-slide objective-4" data-nav="objectives" aria-labelledby="objective-4-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div></div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 04 / 05</p></div>
          <h1 id="objective-4-title">4) Cultivate self-directed learning,<br class="desktop-only" /> problem-solving abilities, and reflective habits,<br class="desktop-only" /> with a focus on planning, monitoring, and<br class="desktop-only" /> reflecting on the learning process.</h1>
        </div>
        <div class="objective-art art-check"><span>✓</span><b>＋</b><i>◉</i></div>
        <div class="slide-footer"><span><i class="dot green"></i>PLANNING · MONITORING · REFLECTION</span><strong>04 / 05</strong></div>
      </section>

      <section class="slide objective-slide objective-5" data-nav="objectives" aria-labelledby="objective-5-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE OBJECTIVES</p></div></div>
        <div class="objective-content">
          <div class="objective-label"><span></span><p>OBJECTIVE 05 / 05</p></div>
          <h1 id="objective-5-title">5) Balance language skills with critical<br class="desktop-only" /> thinking and innovation, fostering teamwork,<br class="desktop-only" /> reflection, evaluation, and communication<br class="desktop-only" /> skills through collaborative learning.</h1>
        </div>
        <div class="objective-art art-collab"><i></i><i></i><i></i><b>★</b></div>
        <div class="slide-footer"><span><i class="dot pink"></i>THINKING · INNOVATION · COLLABORATION</span><strong>05 / 05</strong></div>
      </section>

      <section class="slide instructor-slide" id="instructor" data-nav="instructor" aria-labelledby="instructor-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>TEACHER INTRODUCTION</p></div></div>
        <div class="instructor-top">
          <div>
            <h1 id="instructor-title">Zhang Rongrong</h1>
            <p class="chinese-name">张榕榕 <span>·</span> Rachel</p>
            <p class="role-line">Narrative Writing · Course Instructor</p>
          </div>
          <figure class="instructor-photo"><img src="/narrative-writing/assets/instructor.png" alt="Zhang Rongrong standing beside a lake" /><figcaption>Zhang Rongrong · Rachel</figcaption></figure>
        </div>
        <div class="rule"></div>
        <p class="section-kicker">HIGHLIGHTS</p>
        <div class="highlight-block">
          <h3><span class="bar coral"></span>01 / RESEARCH</h3>
          <p class="highlight-stat"><span>1 book review</span> · <span>3 research articles</span> · <span>1 NSSFC project</span></p>
          <ul class="highlight-list">
            <li><b>a.</b> Published 1 book review in <strong>Patterns of Prejudice</strong> indexed in <strong>SSCI and A&amp;HCI.</strong></li>
            <li><b>b.</b> Published 3 research articles in international and national journals, e.g. <strong>China-US Journal of Humanities.</strong></li>
            <li><b>c.</b> Participated in 1 project funded by the <strong>National Social Science Fund of China (NSSFC)</strong>, focusing on <strong>Pulitzer-winning poetry.</strong></li>
          </ul>
        </div>
        <div class="rule"></div>
        <div class="teaching-block">
          <h3><span class="bar blue"></span>02 / TEACHING</h3>
          <div class="teaching-grid">
            <div><h4>Second Prize · 2025</h4><p>FLTRP Star Teacher Contest<br /><span>Special Track: Curriculum Ideology &amp; Politics Case</span></p></div>
            <div><h4>Third Prize · 2025</h4><p>The Third Teaching Skills Competition for Newly Appointed Faculty,<br /><span>China West Normal University.</span></p></div>
          </div>
          <div class="contact-chip"><span>WAYS OF CONTACT</span><b>15620501207</b></div>
        </div>
      </section>

      <section class="slide units-slide" id="units" data-nav="units" aria-labelledby="units-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>LEARNING UNITS</p></div></div>
        <div class="units-heading"><h1 id="units-title">Six units to know<br />Narrative Writing</h1><p>A writing skill and a language focus<br />in every unit.</p></div>
        <div class="unit-grid">
          <a class="unit-card coral-card" href="#unit-one"><img src="/narrative-writing/assets/unit-custom-01.png" alt="A garden dinner beneath trees and string lights" /><div><b>01</b><h3>Life and Value</h3><p>Overview</p></div></a>
          <a class="unit-card yellow-card" href="#reading" data-reading-target="after-twenty"><img src="/narrative-writing/assets/unit-custom-02.png" alt="Blue figures reaching toward one another in a crowd" /><div><b>02</b><h3>Empathy and<br />Justice</h3><p>Characterization</p></div></a>
          <a class="unit-card blue-card" href="#reading" data-reading-target="egg"><img src="/narrative-writing/assets/unit-custom-03.png" alt="A girl in a white dress seated on a garden swing" /><div><b>03</b><h3>Growth and<br />Maturity</h3><p>Setting</p></div></a>
          <a class="unit-card green-card" href="#reading" data-reading-target="short-story"><img src="/narrative-writing/assets/unit-custom-04.png" alt="A person lying in a beam of light on a field" /><div><b>04</b><h3>Truth and<br />Interpretation</h3><p>Point of View</p></div></a>
          <a class="unit-card pink-card" href="#reading" data-reading-target="early-autumn"><img src="/narrative-writing/assets/unit-custom-05.png" alt="An illustrated figure reaching toward a star" /><div><b>05</b><h3>Dream and Faith</h3><p>Theme</p></div></a>
          <a class="unit-card light-blue-card" href="#reading" data-reading-target="trifles"><img src="/narrative-writing/assets/unit-custom-06.png" alt="A group of friends sharing a close embrace" /><div><b>06</b><h3>Conflict and<br />Harmony</h3><p>Plot</p></div></a>
        </div>
      </section>

      <section class="slide unit-one-slide" id="unit-one" aria-labelledby="unit-one-title">
        <div class="unit-one-frame" aria-hidden="true"></div>
        <div class="unit-one-corner unit-one-corner--top" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="unit-one-corner unit-one-corner--bottom" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="unit-one-copy">
          <p class="unit-one-kicker">Unit One</p>
          <h1 id="unit-one-title">Life and Value</h1>
          <p class="unit-one-subtitle">Writing Critically I: Narrative Writing</p>
          <div class="unit-one-ornament" aria-hidden="true"><span></span><b>✦</b><span></span></div>
          <div class="unit-one-actions">
            <a class="unit-one-start" href="#reading-necklace">Start unit <span aria-hidden="true">→</span></a>
            <div class="unit-one-resource-links">
              <a class="unit-one-list" href="#unit-one-knowledge">View theoretical knowledge</a>
              <a class="unit-one-list" href="#reading">View readings</a>
            </div>
          </div>
        </div>
        <div class="unit-one-illustration" aria-hidden="true"><img src="/narrative-writing/assets/unit-one-watercolor-scroll.png" width="1024" height="1536" alt="" /></div>
      </section>

      <section class="slide unit-one-knowledge-slide" id="unit-one-knowledge" aria-labelledby="unit-one-knowledge-title">
        <div class="unit-one-frame" aria-hidden="true"></div>
        <a class="unit-one-knowledge-back" href="#unit-one">← Back to unit</a>
        <div class="unit-one-knowledge-shell">
          <div class="unit-one-knowledge-tabs" role="tablist" aria-label="Unit One knowledge sections">
            <button type="button" role="tab" id="unit-one-tab-objectives" aria-controls="unit-one-panel-objectives" aria-selected="true" data-unit-one-knowledge-tab="objectives">Learning Objectives</button>
            <button type="button" role="tab" id="unit-one-tab-content" aria-controls="unit-one-panel-content" aria-selected="false" data-unit-one-knowledge-tab="content">Content</button>
            <button type="button" role="tab" id="unit-one-tab-basics" aria-controls="unit-one-panel-basics" aria-selected="false" data-unit-one-knowledge-tab="basics">Narrative Basics</button>
            <button type="button" role="tab" id="unit-one-tab-elements" aria-controls="unit-one-panel-elements" aria-selected="false" data-unit-one-knowledge-tab="elements">Narrative Elements</button>
            <button type="button" role="tab" id="unit-one-tab-language" aria-controls="unit-one-panel-language" aria-selected="false" data-unit-one-knowledge-tab="language">Language &amp; Detail</button>
          </div>

          <section class="unit-one-knowledge-panel unit-one-objectives-panel" id="unit-one-panel-objectives" role="tabpanel" aria-labelledby="unit-one-tab-objectives" data-unit-one-knowledge-panel="objectives">
            <p class="unit-one-knowledge-kicker">Unit One</p>
            <h1 id="unit-one-knowledge-title">Learning Objectives</h1>
            <div class="unit-one-knowledge-ornament" aria-hidden="true"><span></span><b>✦</b><span></span></div>
            <p class="unit-one-objectives-intro">In this unit, you will learn to</p>
            <ul class="unit-one-objectives-list">
              <li><strong>identify</strong> the genre of narrative texts</li>
              <li><strong>grasp</strong> the elements of narrative writing</li>
              <li><strong>write</strong> narrative texts using time order</li>
              <li><strong>describe</strong> details with concrete language in narrative writing</li>
              <li><strong>rethink</strong> the meaning of life and reflect on the values you hold</li>
            </ul>
          </section>

          <section class="unit-one-knowledge-panel" id="unit-one-panel-content" role="tabpanel" aria-labelledby="unit-one-tab-content" data-unit-one-knowledge-panel="content" hidden>
            <p class="unit-one-knowledge-kicker">Unit One · Learning map</p>
            <h1>Table of contents</h1>
            <ol class="unit-one-content-list">
              <li>What Is Narrative Writing?</li><li>Narrative Subgenres</li><li>Basic Structure of a Narrative</li><li>Characterization</li><li>Setting</li><li>Plot</li><li>Point of View</li><li>Theme</li><li>Time Expressions</li><li>Concrete Details</li>
            </ol>
          </section>

          <section class="unit-one-knowledge-panel" id="unit-one-panel-basics" role="tabpanel" aria-labelledby="unit-one-tab-basics" data-unit-one-knowledge-panel="basics" hidden>
            <p class="unit-one-knowledge-kicker">Build the foundation</p><h1>Narrative Basics</h1>
            <div class="unit-one-basics-shell">
              <div class="unit-one-basics-tabs" role="tablist" aria-label="Narrative basics topics">
                <button type="button" role="tab" id="unit-one-basics-tab-definition" aria-controls="unit-one-basics-panel-definition" aria-selected="true" data-unit-one-basics-tab="definition">Definition</button>
                <button type="button" role="tab" id="unit-one-basics-tab-subgenres" aria-controls="unit-one-basics-panel-subgenres" aria-selected="false" data-unit-one-basics-tab="subgenres">Subgenres</button>
                <button type="button" role="tab" id="unit-one-basics-tab-structure" aria-controls="unit-one-basics-panel-structure" aria-selected="false" data-unit-one-basics-tab="structure">Basic Structure</button>
              </div>

              <section class="unit-one-basics-page unit-one-basics-page--definition" id="unit-one-basics-panel-definition" role="tabpanel" aria-labelledby="unit-one-basics-tab-definition" data-unit-one-basics-panel="definition">
                <div class="unit-one-basics-page-heading"><p>What is</p><h2>NARRATIVE?</h2></div>
                <div class="unit-one-definition-grid">
                  <div class="unit-one-definition-intro"><span aria-hidden="true">“</span><p>Stories help us notice how experiences, ideas, and perspectives are shaped.</p></div>
                  <ol class="unit-one-definition-list">
                    <li><strong>Story / Storytelling</strong><span>Any story is a narrative.</span></li>
                    <li><strong>Creative writing and spoken accounts</strong><span>Narratives may be written or told aloud.</span></li>
                    <li><strong>Fiction and non-fiction</strong><span>They can be made up or realistic accounts.</span></li>
                    <li><strong>A sequence with meaning</strong><span>A narrative connects events, characters, and themes to engage an audience.</span></li>
                  </ol>
                </div>
                <div class="unit-one-definition-terms">
                  <p>The <mark>Narrator</mark> narrates the <mark>narration</mark> of the <mark>narrative</mark>.</p>
                  <div>
                    <article><h3>The speaker</h3><span>The narrator: the voice that tells the story.</span></article>
                    <article><h3>The words</h3><span>The narration: the language, rhythm, and choices used to tell it.</span></article>
                    <article><h3>The story</h3><span>The narrative: the connected events that the reader experiences.</span></article>
                  </div>
                </div>
              </section>

              <section class="unit-one-basics-page unit-one-basics-page--subgenres" id="unit-one-basics-panel-subgenres" role="tabpanel" aria-labelledby="unit-one-basics-tab-subgenres" data-unit-one-basics-panel="subgenres" hidden>
                <div class="unit-one-mini-genres-heading"><h2>Mini-genres of Narratives</h2><p>Narrative genres are flexible categories rather than mutually exclusive labels.</p></div>
                <p class="unit-one-mini-genres-question">Question: Which genres have you read? And what do you like about it?</p>
                <div class="unit-one-mini-genre-picker" role="tablist" aria-label="Narrative mini-genres">
                  <button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="true" data-mini-genre="adventures">Adventures</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="science-fiction">Science fiction</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="romance">Romance</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="fantasies">Fantasies</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="multicultural">Multicultural Narratives</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="animal-stories">Animal stories</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="historical">Historical Narratives</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="folklore">Folklore</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="fables">Fables</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="humorous">Humorous Narratives</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="mysteries">Mysteries</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="biographies">Biographies / Autobiographies</button><button type="button" role="tab" aria-controls="unit-one-mini-genre-stage" aria-selected="false" data-mini-genre="realistic">Realistic Narratives</button>
                </div>
                <section class="unit-one-mini-genre-stage" id="unit-one-mini-genre-stage" role="tabpanel" aria-label="Selected mini-genre" data-mini-genre-stage="adventures">
                  <div class="unit-one-mini-genre-stage-copy"><p data-mini-genre-title>Adventures</p><span data-mini-genre-summary>Stories of exploration, journeys, risk, and discovery.</span></div>
                  <div class="unit-one-mini-genre-original" data-mini-genre-media><figure><img data-mini-genre-image src="/narrative-writing/assets/mini-genres/adventures.png" alt="Treasure Island and Robinson Crusoe covers" loading="lazy" /></figure><div class="unit-one-mini-genre-credits"><article><b data-mini-genre-book-title="one">Treasure Island</b><span data-mini-genre-book-author="one">Robert Louis Stevenson</span></article><article><b data-mini-genre-book-title="two">Robinson Crusoe</b><span data-mini-genre-book-author="two">Daniel Defoe</span></article></div></div>
                </section>
                <section class="unit-one-folklore-pages" data-mini-genre-folklore-pages hidden aria-label="Folklore examples"><figure><img src="/narrative-writing/assets/mini-genres/folklore-musical.png" alt="Folklore page exploring Taylor Swift's storytelling" loading="lazy" /><figcaption>Folklore in contemporary songwriting</figcaption></figure><figure><img src="/narrative-writing/assets/mini-genres/folklore-writing.png" alt="Folklore page about imagery, characters, and perspective" loading="lazy" /><figcaption>Folklore in narrative writing</figcaption></figure></section>
              </section>

              <section class="unit-one-basics-page unit-one-basics-page--structure" id="unit-one-basics-panel-structure" role="tabpanel" aria-labelledby="unit-one-basics-tab-structure" data-unit-one-basics-panel="structure" hidden>
                <header class="unit-one-basics-page-heading"><p>Basic structure</p><h2>A Narrative Arc</h2></header>
                <p class="unit-one-structure-quote">A narrative moves through a <mark>beginning</mark>, a <mark>development</mark>, and an <mark>ending</mark>.</p>
                <div class="unit-one-structure-grid">
                  <article><h3>Beginning</h3><p>Introduce the setting, characters, and situation.</p></article>
                  <article><h3>Development</h3><p>Build events and a challenge that changes the situation.</p></article>
                  <article><h3>Ending</h3><p>Resolve the action and leave a final impression.</p></article>
                </div>
                <p class="unit-one-structure-notes">Text structure: Beginning → Middle → Ending<br />Plot structure: Exposition → Rising Action → Climax → Falling Action → Resolution</p>
              </section>
            </div>
          </section>

          <section class="unit-one-knowledge-panel" id="unit-one-panel-elements" role="tabpanel" aria-labelledby="unit-one-tab-elements" data-unit-one-knowledge-panel="elements" hidden>
            <p class="unit-one-knowledge-kicker">Read the story closely</p><h1>Narrative Elements</h1>
            <div class="unit-one-elements-entry-grid" role="tablist" aria-label="Narrative elements">
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="true" data-unit-one-element="characterization"><span>01</span><b>Characterization</b><small>How a character is revealed</small></button>
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="false" data-unit-one-element="setting"><span>02</span><b>Setting</b><small>Where and when a story happens</small></button>
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="false" data-unit-one-element="plot"><span>03</span><b>Plot</b><small>The connected sequence of events</small></button>
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="false" data-unit-one-element="point-of-view"><span>04</span><b>Point of View</b><small>The lens through which we read</small></button>
              <button type="button" role="tab" aria-controls="unit-one-element-stage" aria-selected="false" data-unit-one-element="theme"><span>05</span><b>Theme</b><small>The idea a story explores</small></button>
            </div>
            <section class="unit-one-element-stage" id="unit-one-element-stage" role="tabpanel" aria-label="Selected narrative element"><p data-unit-one-element-number>01</p><h2 data-unit-one-element-title>Characterization</h2><span data-unit-one-element-description>Notice what characters say, do, think, and how they change.</span>
              <div class="unit-one-element-details">
                <section data-unit-one-element-detail="characterization"><article><h3>Core content</h3><p>Characters have emotions, motivations, and intentions. Main characters are usually more fully developed than supporting characters.</p><p>Characters can be revealed through <b>appearance, action, dialogue,</b> and <b>monologue</b>.</p></article><article><h3>Direct and indirect characterization</h3><p><b>Direct:</b> the narrator tells readers what a character is like.</p><p><b>Indirect:</b> readers infer personality through speech, thoughts, actions, appearance, body language, and reactions from others.</p></article><article><h3>Goal, motivation, and conflict</h3><p><b>Goal</b> — what does the character want?<br /><b>Motivation</b> — why do they want it?<br /><b>Conflict</b> — what prevents them from getting it?</p><p><b>Traits → Wants → Choices → Actions → Change</b></p></article></section>
                <section data-unit-one-element-detail="setting" hidden><article><h3>Core content</h3><p>Setting refers to <b>time, place,</b> and <b>situation</b>. It can establish mood, atmosphere, and characters’ feelings.</p></article><article><h3>Types of setting</h3><p><b>Backdrop setting:</b> provides a general background but is not essential to the story.</p><p><b>Integral setting:</b> is essential to the characters, conflict, or meaning of the story.</p></article><article><h3>Functions and questions</h3><p>Setting can influence how characters think, speak, and behave; what conflicts arise; how the plot develops; and what themes emerge.</p><p><b>Ask:</b><br />Where and when does the story take place?<br />What mood does it create?<br />How does it affect the characters, conflict, or theme?</p></article></section>
                <section data-unit-one-element-detail="plot" hidden><article><h3>Core content</h3><p>Plot is the sequence of events involving characters in conflict. It often develops from a character’s goal: a character wants something → an obstacle appears → conflict develops → the character acts → consequences follow.</p></article><article><h3>Plot arc</h3><p><b>Exposition</b> introduces characters, setting, situation, and initial conflict.<br /><b>Rising action</b> builds complication and tension.<br /><b>Climax</b> is the turning point of greatest tension.<br /><b>Falling action</b> unfolds the consequences.<br /><b>Resolution</b> reaches a conclusion or new state.</p></article><article><h3>Goal and plot devices</h3><p><b>Goal → Obstacle → Conflict → Choice → Consequence</b></p><p><b>Flashback:</b> a return to an earlier event.<br /><b>Foreshadowing:</b> a hint of what may happen later.<br /><b>Revelation:</b> a discovery that changes understanding.</p></article></section>
                <section data-unit-one-element-detail="point-of-view" hidden><article><h3>Core content</h3><p>Point of view determines <b>what the reader sees, knows, and understands.</b></p><p><b>First-person:</b> the narrator uses “I” and participates in the story.</p><p><b>Objective:</b> the narrator reports observable actions and dialogue; readers infer thoughts and feelings.</p></article><article><h3>Third-person points of view</h3><p><b>Omniscient:</b> the narrator can reveal the experiences of multiple characters.</p><p><b>Limited:</b> the narrator mainly follows one character’s perspective.</p><p><b>Second-person:</b> the narrator uses “you,” placing the reader or an implied character inside the narrative.</p></article><article><h3>Understanding POV</h3><p>Point of view controls access to information, thoughts, distance from characters, and what is revealed or withheld.</p><p><b>Ask:</b><br />Who tells the story?<br />Who sees the events?<br />Whose thoughts can we access?<br />What does the narrator know or withhold?</p></article></section>
                <section data-unit-one-element-detail="theme" hidden><article><h3>Core content</h3><p>Theme is <b>the underlying meaning or central idea explored by a story.</b> Themes often concern society, human nature, emotions, relationships, and values.</p></article><article><h3>Explicit and implicit theme</h3><p><b>Explicit:</b> stated directly — “Slow and steady wins the race.”</p><p><b>Implicit:</b> suggested through character, action, dialogue, conflict, choices, consequences, and resolution.</p></article><article><h3>Theme, moral, and topic</h3><p><b>Theme:</b> a central idea, issue, or question explored throughout a story.<br /><b>Moral:</b> a lesson about how people should or should not behave.</p><p><b>Topic</b> is what a story is about; <b>theme</b> is what the story says or asks about that topic.</p><p>Example: <b>Topic:</b> appearance. <b>Theme:</b> appearances can distort how people judge value and social status.</p></article></section>
              </div>
            </section>
          </section>

          <section class="unit-one-knowledge-panel" id="unit-one-panel-language" role="tabpanel" aria-labelledby="unit-one-tab-language" data-unit-one-knowledge-panel="language" hidden>
            <p class="unit-one-knowledge-kicker">Make the scene vivid</p><h1>Language &amp; Detail</h1>
            <ol class="unit-one-content-list unit-one-content-list--short" start="9"><li>Time Expressions</li><li>Concrete Details</li></ol>
          </section>
        </div>
        <img class="unit-one-knowledge-decor unit-one-knowledge-decor--candles" src="/narrative-writing/assets/unit-one-knowledge-decor.png" width="1536" height="1024" alt="" aria-hidden="true" loading="lazy" />
        <img class="unit-one-knowledge-decor unit-one-knowledge-decor--quill" src="/narrative-writing/assets/unit-one-knowledge-decor.png" width="1536" height="1024" alt="" aria-hidden="true" loading="lazy" />
      </section>

      <section class="slide assessment-slide" id="assessment" data-nav="assessment" aria-labelledby="assessment-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>COURSE ASSESSMENT</p></div></div>
        <div class="assessment-heading"><div><p class="section-kicker accent-kicker">GRADING CRITERIA</p><h1 id="assessment-title">How your work<br />is assessed.</h1></div><p>Four assessed<br />components.</p></div>
        <div class="assessment-grid">
          <article class="assessment-card attendance"><p>01 / ATTENDANCE</p><h3>Attendance</h3><strong>10%</strong><span class="grid-icon"></span></article>
          <article class="assessment-card presentation"><p>02 / PRESENTATION</p><h3>Presentation</h3><strong>10%</strong><span class="screen-icon"></span></article>
          <article class="assessment-card assignment"><p>03 / ASSIGNMENT</p><h3>Assignment</h3><strong>15%</strong><span class="assignment-detail">X-mind 5%<br /><b>+ Writing 10%</b></span></article>
          <article class="assessment-card interaction"><p>04 / INTERACTION</p><h3>Interaction</h3><strong>5%</strong><span class="chat-icon"></span></article>
        </div>
      </section>

      <section class="slide presentation-slide" data-nav="assessment" aria-labelledby="presentation-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>PRESENTATION</p></div></div>
        <div class="presentation-heading"><h1 id="presentation-title">From Songs to<br />Narrative Writing</h1><div><h2>Presentation 10%</h2><p>Discussion and presentation<br />through texts, scenes and songs.</p></div></div>
        <div class="song-grid">
          <article class="song-card"><img src="/narrative-writing/assets/song-01.png" alt="The Life of a Show Girl" /><h3>Characterization &amp;<br />Dialogues</h3><p>The Life of a Show Girl</p><span>01</span></article>
          <article class="song-card"><img src="/narrative-writing/assets/song-02.png" alt="All Too Well" /><h3>Setting &amp; Sensory<br />Details</h3><p>All Too Well</p><span>02</span></article>
          <article class="song-card"><img src="/narrative-writing/assets/song-03.png" alt="Betty, August, Cardigan" /><h3>Perspectives</h3><p>Betty · August · Cardigan</p><span>03</span></article>
          <article class="song-card"><img src="/narrative-writing/assets/song-04.png" alt="Epiphany" /><h3>Theme</h3><p>Epiphany</p><span>04</span></article>
          <article class="song-card"><img src="/narrative-writing/assets/song-05.png" alt="no body, no crime" /><h3>Plot &amp; Chekhov’s Gun</h3><p>no body, no crime</p><span>05</span></article>
        </div>
      </section>

      <section class="slide writing-slide" data-nav="assessment" aria-labelledby="writing-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>WRITING PRACTICE</p></div></div>
        <div class="writing-heading"><div><p class="section-kicker">Writing practice</p><h1 id="writing-title">Continue the story.<br />Make it your own.</h1></div><div><h2>Assignment 15%</h2><p>X-mind 5% <b>+</b> <span>Writing 10%</span></p></div></div>
        <div class="writing-grid">
          <a class="writing-card coral-card" href="#practice"><img src="/narrative-writing/assets/write-01.png" alt="The Necklace" /><b>Unit 1</b><h3>The Necklace</h3><p>Continuation writing</p></a>
          <a class="writing-card yellow-card" href="#practice"><img src="/narrative-writing/assets/write-02.png" alt="After Twenty Years" /><b>Unit 2</b><h3>After Twenty Years</h3><p>Continuation writing</p></a>
          <a class="writing-card blue-card" href="#practice"><img src="/narrative-writing/assets/write-03.png" alt="The Egg" /><b>Unit 3</b><h3>The Egg</h3><p>Continuation writing</p></a>
          <a class="writing-card green-card" href="#practice"><img src="/narrative-writing/assets/write-04.png" alt="A Very Short Story" /><b>Unit 4</b><h3>A Very Short Story</h3><p>Continuation writing</p></a>
          <a class="writing-card pink-card" href="#practice"><img src="/narrative-writing/assets/write-05.png" alt="Early Autumn" /><b>Unit 5</b><h3>Early Autumn</h3><p>Continuation writing</p></a>
        </div>
      </section>

      <section class="slide reading-slide" id="reading" data-nav="reading" aria-labelledby="reading-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>Supplementary reading</p></div></div>
        <div class="reading-heading"><h1 id="reading-title">Twelve texts.<br />Six units.</h1><div class="reading-heading-copy"><h2>Each reading appears with its<br />original source image.</h2><p><strong>5%</strong><span>Interaction for supplementary<br />and textbook reading</span></p></div></div>
        <div class="reading-grid">
          <a class="reading-card" id="reading-necklace" href="#reading-necklace" aria-label="Open The Necklace reading introduction"><img src="/narrative-writing/assets/read-01.png" alt="The Necklace" /><div><b class="unit-coral">Unit 1</b><h3>The Necklace</h3><p>Guy de Maupassant</p></div></a>
          <a class="reading-card" id="reading-fat" href="#reading-fat" aria-label="Open Fat reading introduction"><img src="/narrative-writing/assets/read-02.png" alt="Fat" /><div><b class="unit-yellow">Unit 1</b><h3>Fat</h3><p>Raymond Carver</p></div></a>
          <a class="reading-card" id="reading-after-twenty" href="#reading-after-twenty" aria-label="Open After Twenty Years reading introduction"><img src="/narrative-writing/assets/read-03.png" alt="After Twenty Years" /><div><b class="unit-blue">Unit 2</b><h3>After Twenty Years</h3><p>O. Henry</p></div></a>
          <a class="reading-card" id="reading-last-leaf" href="#reading-last-leaf" aria-label="Open The Last Leaf reading introduction"><img src="/narrative-writing/assets/read-04.png" alt="The Last Leaf" /><div><b class="unit-green">Unit 2</b><h3>The Last Leaf</h3><p>O. Henry</p></div></a>
          <a class="reading-card" id="reading-flowers" href="#reading-flowers" aria-label="Open The Flowers reading introduction"><img src="/narrative-writing/assets/read-05.png" alt="The Flowers" /><div><b class="unit-pink">Unit 3</b><h3>The Flowers</h3><p>Alice Walker</p></div></a>
          <a class="reading-card" id="reading-egg" href="#reading-egg" aria-label="Open The Egg reading introduction"><img src="/narrative-writing/assets/read-06.png" alt="The Egg" /><div><b class="unit-light-blue">Unit 3</b><h3>The Egg</h3><p>Sherwood Anderson</p></div></a>
          <a class="reading-card" id="reading-days-wait" href="#reading-days-wait" aria-label="Open A Day’s Wait reading introduction"><img src="/narrative-writing/assets/read-07.png" alt="A Day’s Wait" /><div><b class="unit-coral">Unit 4</b><h3>A Day’s Wait</h3><p>Ernest Hemingway</p></div></a>
          <a class="reading-card" id="reading-short-story" href="#reading-short-story" aria-label="Open A Very Short Story reading introduction"><img src="/narrative-writing/assets/read-08.png" alt="A Very Short Story" /><div><b class="unit-yellow">Unit 4</b><h3>A Very Short Story</h3><p>Ernest Hemingway</p></div></a>
          <a class="reading-card" id="reading-cop-anthem" href="#reading-cop-anthem" aria-label="Open The Cop and the Anthem reading introduction"><img src="/narrative-writing/assets/read-09.png" alt="The Cop and the Anthem" /><div><b class="unit-blue">Unit 5</b><h3>The Cop and the Anthem</h3><p>O. Henry</p></div></a>
          <a class="reading-card" id="reading-early-autumn" href="#reading-early-autumn" aria-label="Open Early Autumn reading introduction"><img src="/narrative-writing/assets/read-10.png" alt="Early Autumn" /><div><b class="unit-green">Unit 5</b><h3>Early Autumn</h3><p>Langston Hughes</p></div></a>
          <a class="reading-card" id="reading-story-hour" href="#reading-story-hour" aria-label="Open The Story of an Hour reading introduction"><img src="/narrative-writing/assets/read-11.png" alt="The Story of an Hour" /><div><b class="unit-pink">Unit 6</b><h3>The Story of an Hour</h3><p>Kate Chopin</p></div></a>
          <a class="reading-card" id="reading-trifles" href="#reading-trifles" aria-label="Open Trifles reading introduction"><img src="/narrative-writing/assets/read-12.png" alt="Trifles" /><div><b class="unit-light-blue">Unit 6</b><h3>Trifles</h3><p>Susan Glaspell</p></div></a>
        </div>
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-necklace" aria-labelledby="reading-detail-necklace-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="necklace" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-necklace.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit One Narrative Writing</p>
          <h1 id="reading-detail-necklace-title">The Necklace</h1>
          <p>Madame Mathilde Loisel dreams of elegance, admiration, and a life beyond her modest circumstances. When she borrows a dazzling necklace for a high-society evening, it seems as if her dream has finally come true. But one glamorous night can carry a cost no one expects.</p>
          <p>Guy de Maupassant</p>
        </article>
        <article class="reading-full-text" aria-labelledby="reading-necklace-text-title">
          <header class="reading-full-text-header">
            <p class="reading-full-text-kicker">FICTION · FULL TEXT</p>
            <h2 id="reading-necklace-text-title">The Necklace</h2>
            <p class="reading-full-text-deck">Madame Mathilde Loisel dreams of elegance, admiration, and a life beyond her modest circumstances.</p>
            <div class="reading-full-text-byline"><span>By Guy de Maupassant</span><span>Short fiction</span></div>
          </header>
          <div class="reading-full-text-body">
            ${renderStoryParagraphs(necklaceStoryParagraphs)}
          </div>
          <footer>THE END</footer>
        </article>
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-fat" aria-labelledby="reading-detail-fat-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="fat" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-fat.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit One Narrative Writing</p>
          <h1 id="reading-detail-fat-title">Fat</h1>
          <p>A waitress recounts a story to her friend, about “the fattest person I have ever seen.”</p>
          <p>Raymond Carver</p>
        </article>
        <article class="reading-full-text" aria-labelledby="reading-fat-text-title">
          <header class="reading-full-text-header">
            <p class="reading-full-text-kicker">FICTION · FULL TEXT</p>
            <h2 id="reading-fat-text-title">Fat</h2>
            <p class="reading-full-text-deck">A waitress recounts a story to her friend about “the fattest person I have ever seen.”</p>
            <div class="reading-full-text-byline"><span>By Raymond Carver</span><span>Short fiction</span></div>
          </header>
          <div class="reading-full-text-body">
            ${renderStoryParagraphs(fatStoryParagraphs)}
          </div>
          <footer>THE END</footer>
        </article>
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-after-twenty" aria-labelledby="reading-detail-after-twenty-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="after-twenty" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-after-twenty.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Two Narrative Writing</p>
          <h1 id="reading-detail-after-twenty-title">After Twenty Years</h1>
          <p>Two old friends have made a promise to meet at a certain New York City corner after 20 years of separation.</p>
          <p>O. Henry</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-after-twenty",
          title: "After Twenty Years",
          deck: "Two old friends return to a New York City corner to honor a promise made twenty years earlier.",
          author: "O. Henry",
          paragraphs: afterTwentyStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-last-leaf" aria-labelledby="reading-detail-last-leaf-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="last-leaf" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-last-leaf.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Two Narrative Writing</p>
          <h1 id="reading-detail-last-leaf-title">The Last Leaf</h1>
          <p>In the winding alleys of Greenwich Village, two young artists—Sue from Maine and Johnsy from California—share more than a studio. They share dreams, laughter, and, one fateful winter, a fight for life.</p>
          <p>O. Henry</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-last-leaf",
          title: "The Last Leaf",
          deck: "In Greenwich Village, friendship and art become a young woman’s fragile reason to live.",
          author: "O. Henry",
          paragraphs: lastLeafStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-flowers" aria-labelledby="reading-detail-flowers-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="flowers" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-flowers.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Three Narrative Writing</p>
          <h1 id="reading-detail-flowers-title">The Flowers</h1>
          <p>It is not until she notices something else on the ground that we are told her summer was over.</p>
          <p>Alice Walker</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-flowers",
          title: "The Flowers",
          deck: "It is not until she notices something else on the ground that we are told her summer was over.",
          author: "Alice Walker",
          paragraphs: flowersStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-egg" aria-labelledby="reading-detail-egg-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="egg" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-egg.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Three Narrative Writing</p>
          <h1 id="reading-detail-egg-title">The Egg</h1>
          <p>Published two years after the innovative, influential 1919 masterpiece Winesburg, Ohio, this collection of short stories solidified the author's reputation as a major American writer.</p>
          <p>Sherwood Anderson</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-egg",
          title: "The Egg",
          deck: "A son remembers his parents’ ambition, a failed chicken farm, and the strange object that came to define their lives.",
          author: "Sherwood Anderson",
          paragraphs: eggStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-days-wait" aria-labelledby="reading-detail-days-wait-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="days-wait" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-days-wait.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Four Narrative Writing</p>
          <h1 id="reading-detail-days-wait-title">A Day’s Wait</h1>
          <p>When the boy gets a fever, a doctor prescribes three medicines and tells the boy’s father that his temperature is 102 degrees.</p>
          <p>Ernest Hemingway</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-days-wait",
          title: "A Day’s Wait",
          deck: "A boy with a fever quietly waits for death after confusing Fahrenheit with Celsius.",
          author: "Ernest Hemingway",
          paragraphs: daysWaitStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-short-story" aria-labelledby="reading-detail-short-story-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="short-story" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-short-story.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Four Narrative Writing</p>
          <h1 id="reading-detail-short-story-title">A Very Short Story</h1>
          <p>In the story, a soldier and a nurse named “Luz” fall in love as she tends to him over the course of three months in a hospital in Padua.</p>
          <p>Ernest Hemingway</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-short-story",
          title: "A Very Short Story",
          deck: "A soldier and a nurse fall in love in wartime, then discover how distance changes what they imagined together.",
          author: "Ernest Hemingway",
          paragraphs: veryShortStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-cop-anthem" aria-labelledby="reading-detail-cop-anthem-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="cop-anthem" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-cop-anthem.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Five Narrative Writing</p>
          <h1 id="reading-detail-cop-anthem-title">The Cop and the Anthem</h1>
          <p>Soapy is a homeless guy who prefers the warm cell to the cold night under the New York sky. He does everything he can think of in order to draw the attention of the police. However without any success. Until he hears a magical organ anthem.</p>
          <p>O. Henry</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-cop-anthem",
          title: "The Cop and the Anthem",
          deck: "Soapy tries every way he can imagine to be arrested before winter, until music awakens a different resolve.",
          author: "O. Henry",
          paragraphs: copAnthemStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-early-autumn" aria-labelledby="reading-detail-early-autumn-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="early-autumn" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-early-autumn.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Five Narrative Writing</p>
          <h1 id="reading-detail-early-autumn-title">Early Autumn</h1>
          <p>Two former lovers, Bill and Mary, cross paths in Washington Square in New York.</p>
          <p>Langston Hughes</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-early-autumn",
          title: "Early Autumn",
          deck: "Two former lovers meet by chance in Washington Square and confront the distance that time has placed between them.",
          author: "Langston Hughes",
          paragraphs: earlyAutumnStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-story-hour" aria-labelledby="reading-detail-story-hour-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="story-hour" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-story-hour.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Six Narrative Writing</p>
          <h1 id="reading-detail-story-hour-title">The Story of an Hour</h1>
          <p>Mrs. Mallard, a woman living in the patriarchal late 1800s married to a man named Brently Mallard, is imprisoned in the same place she calls home.</p>
          <p>Kate Chopin</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-story-hour",
          title: "The Story of an Hour",
          deck: "Mrs. Mallard, a woman living in the patriarchal late 1800s married to a man named Brently Mallard, is imprisoned in the same place she calls home.",
          author: "Kate Chopin",
          paragraphs: storyHourStoryParagraphs,
        })}
      </section>

      <section class="slide reading-detail-slide reading-detail-slide--with-text" id="reading-detail-trifles" aria-labelledby="reading-detail-trifles-title">
        <a class="reading-detail-back" href="#reading" data-reading-target="trifles" aria-label="Back to supplementary reading">← Reading list</a>
        <img class="reading-detail-visual" src="/narrative-writing/assets/reading-detail-trifles.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <article class="reading-detail-accessible">
          <p>Unit Six Narrative Writing</p>
          <h1 id="reading-detail-trifles-title">Trifles</h1>
          <p>Glaspell’s gripping narrative centers on two women who, through keen observation and intuition, piece together the hidden story behind the crime while the men dismiss crucial evidence as mere trifles.</p>
          <p>Susan Glaspell</p>
        </article>
        ${renderFullTextArticle({
          id: "reading-trifles",
          title: "Trifles",
          deck: "Two women notice the domestic details that reveal a hidden story while the men around them dismiss those clues as insignificant.",
          author: "Susan Glaspell",
          kicker: "DRAMA",
          label: "One-act play",
          paragraphs: triflesStoryParagraphs,
        })}
      </section>

      <section class="slide info-slide" id="other-information" aria-labelledby="info-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>OTHER INFORMATION</p></div></div>
        <div class="info-heading"><h1 id="info-title">This course requires<br />two student coordinators.</h1><div class="coordinator-badge"><strong>02</strong><span>COORDINATORS</span></div></div>
        <div class="rule"></div>
        <p class="class-code-label"><span class="blue-bar"></span>Xuexitong class codes</p>
        <p class="class-code-caption">Join the class with the code that matches your section.</p>
        <div class="class-codes">
          <div class="class-code coral-line"><p>CLASS 9</p><strong>61948866</strong><span>Xuexitong class code</span></div>
          <div class="class-code blue-line"><p>CLASS 11</p><strong>24281156</strong><span>Xuexitong class code</span></div>
        </div>
        <div class="info-footer"><span>09&nbsp;&nbsp; Class 9</span><span>11&nbsp;&nbsp; Class 11</span></div>
      </section>

      <section class="slide practice-slide" id="practice" aria-labelledby="practice-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>CONTINUATION WRITING · PRACTICE 02</p></div></div>
        <div class="practice-grid">
          <div class="poem-panel"><p class="section-kicker accent-kicker">READ THE POEM</p><h1 id="practice-title">The crab is peeling my shell.<br />The notebook is writing me.<br />The sky is raining me down<br />on maple leaves and snowflakes.<br /><strong>And you are thinking of me.</strong></h1><div class="poem-footer">LET THE IMAGE BECOME A MEMORY.</div></div>
          <article class="task-card"><p class="section-kicker blue-kicker">YOUR TASK</p><h2>Write a 150-word<br />narrative in English.</h2><p>about the feelings<br />this poem evokes in you.</p><ol><li>Begin with a moment, a place, or a memory.</li><li>Use images and details to show the feeling.</li><li>End with a thought of someone who matters.</li></ol><span class="word-count">150 words</span><div class="task-footer">WRITE FROM THE FEELING</div></article>
        </div>
      </section>

      <section class="slide sample-slide" aria-labelledby="sample-title">
        <div class="slide-header"><div><h2>Narrative Writing</h2><p>MICROFICTION · WRITING SAMPLE</p></div></div>
        <div class="sample-heading"><p class="section-kicker accent-kicker">A QUIET NIGHT</p><h1 id="sample-title">At night, the city<br />looked almost tender.</h1></div>
        <div class="sample-columns">
          <div><p>Thousands of windows burned above the streets, each holding a life I could not enter. Traffic lights trembled across the pavement—red, then green, then red again.</p><p class="sample-emphasis">Someone was waiting for dinner.<br />Someone was leaving a lamp on<br />for a late return.<br /><span>Someone, somewhere, was expected.</span></p><p>I walked home beneath them, my phone cold in my hand, and told myself that being alone was only temporary.</p></div>
          <div><p>You had not replied because you were busy.<br />You had forgotten because the day had been long.<br />You had said nothing because perhaps the feeling itself was too difficult to name.</p><p class="sample-blue">I became very good at<br />translating silence into hope.</p><p>At every red light, I checked my phone.<br />At every vibration, my heart answered before I did.</p><p class="sample-end">It was never you.</p></div>
        </div>
      </section>
    </main>

    <div class="lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <button class="lightbox-close" type="button" aria-label="Close image">×</button>
      <div class="lightbox-inner"><img src="" alt="" /><div><h2 id="lightbox-title"></h2><p></p></div></div>
    </div>
`;
