const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

function withBlanks(text, counter) {
  const fragment = document.createDocumentFragment();
  const marker = /\[\[([^\]]+)\]\]/g;
  let cursor = 0;
  for (const match of text.matchAll(marker)) {
    fragment.append(document.createTextNode(text.slice(cursor, match.index)));
    const answer = match[1];
    const index = counter.value++;
    const blank = make("button", "worksheet-blank", "\u00a0");
    blank.type = "button";
    blank.setAttribute("aria-label", `Reveal answer for blank ${index}`);
    blank.setAttribute("aria-pressed", "false");
    blank.addEventListener("click", () => {
      const reveal = blank.getAttribute("aria-pressed") !== "true";
      blank.setAttribute("aria-pressed", String(reveal));
      blank.setAttribute("aria-label", reveal ? `Hide answer: ${answer}` : `Reveal answer for blank ${index}`);
      blank.textContent = reveal ? answer : "\u00a0";
    });
    fragment.append(blank);
    cursor = match.index + match[0].length;
  }
  fragment.append(document.createTextNode(text.slice(cursor)));
  return fragment;
}

function textNode(tag, className, text, counter) {
  const element = make(tag, className);
  element.append(withBlanks(text, counter));
  return element;
}

function stageHeading(part, title, range) {
  const heading = make("header", "flow-stage-heading");
  heading.append(make("span", "flow-stage-part", part), make("h3", null, title), make("span", "flow-stage-range", range));
  return heading;
}

function arrow(direction = "down") {
  const connector = make("div", `flow-arrow flow-arrow-${direction}`);
  connector.setAttribute("aria-hidden", "true");
  connector.textContent = direction === "right" ? "→" : "↓";
  return connector;
}

export function renderWorksheet01(host) {
  host.replaceChildren();
  const counter = { value: 1 };
  const paper = make("article", "worksheet-flow");
  const header = make("header", "flow-header");
  header.append(
    make("span", "flow-eyebrow", "TEXT 01 · REASONING PATH"),
    make("h2", null, "I Become a Student"),
    make("p", null, "Follow the argument from its claim through the research process. Click any blank line to reveal its missing link."),
  );
  paper.append(header);

  const introduction = make("section", "flow-stage flow-introduction");
  introduction.append(stageHeading("PART ONE", "The claim", "PARA. 1"));
  const claim = make("div", "flow-claim");
  const topic = make("div", "flow-node flow-topic");
  topic.append(make("span", "flow-node-label", "TOPIC"), make("strong", null, "University education"));
  const thesis = make("div", "flow-node flow-thesis");
  thesis.append(
    make("span", "flow-node-label", "THESIS"),
    textNode("p", null, "A real education is possible, though rare, when students develop the [[capacity and drive to learn]], pursue [[methodical, independent study]], and resist institutional [[mind-fixing]].", counter),
  );
  claim.append(topic, arrow("right"), thesis);
  introduction.append(claim);
  paper.append(introduction, arrow());

  const method = make("section", "flow-stage flow-method");
  method.append(stageHeading("PART TWO", "The method", "PARA. 2–4"));
  const choice = make("div", "flow-node flow-choice");
  choice.append(make("span", "flow-node-label", "THE LEARNER'S CHOICE"), textNode("strong", null, "[[Interest-driven specialization]] with deep independent study", counter));
  method.append(choice, arrow());
  const engine = make("div", "flow-engine");
  const engineHeading = make("div", "flow-engine-heading");
  engineHeading.append(make("span", null, "HOW THE METHOD WORKS"), make("p", null, "Study habits supply the tools; conflicting sources turn them into inquiry."));
  engine.append(engineHeading);
  const lanes = make("div", "flow-lanes");
  const habits = make("div", "flow-habits");
  habits.append(make("h4", null, "Study inputs"));
  for (const [index, item] of [
    "Extensive independent reading",
    "[[Selective memorization]] grounded in understanding",
    "Interdisciplinary critical thinking",
  ].entries()) {
    const card = make("div", "flow-habit");
    card.append(make("span", "flow-habit-index", `0${index + 1}`), textNode("p", null, item, counter));
    habits.append(card);
  }
  const research = make("div", "flow-research");
  research.append(make("h4", null, "Inquiry sequence"));
  const steps = [
    ["Start with references", "Read the assigned books, then seek other authoritative references and ask professors for more."],
    ["Notice a contradiction", "Compare the accounts and identify [[conflicting claims]] about the same events."],
    ["Check beyond the first books", "Consult librarians, professors and other authorities for [[triangulation]]."],
    ["Frame a problem", "Use [[independent judgement]] to decide what still needs explaining."],
    ["Return to evidence", "Go back to the [[primary sources]] instead of treating any textbook as final."],
    ["Write what the evidence supports", "Develop a [[working hypothesis]] from the gaps and write scientific papers."],
  ];
  for (const [index, [title, detail]] of steps.entries()) {
    const step = make("div", "flow-research-step");
    step.append(make("span", "flow-step-index", String(index + 1).padStart(2, "0")));
    const content = make("div", "flow-step-copy");
    content.append(make("strong", null, title), textNode("p", null, detail, counter));
    step.append(content);
    research.append(step);
  }
  lanes.append(habits, arrow("right"), research);
  engine.append(lanes);
  method.append(engine);
  paper.append(method, arrow());

  const conclusion = make("section", "flow-stage flow-conclusion");
  conclusion.append(stageHeading("PART THREE", "What the method leads to", "PARA. 5"));
  const outcomes = make("div", "flow-outcomes");
  const value = make("div", "flow-node flow-value");
  value.append(make("span", "flow-node-label", "VALUE RECAP"), textNode("p", null, "[[Method]], not vanity, and the capacity and drive to learn matter more than a degree.", counter));
  const call = make("div", "flow-node flow-call");
  call.append(make("span", "flow-node-label", "CALL TO YOUTH"), textNode("p", null, "History calls for [[revision]]; young learners can take up the work.", counter));
  outcomes.append(value, arrow("right"), call);
  conclusion.append(outcomes);
  paper.append(conclusion);
  host.append(paper);
}
