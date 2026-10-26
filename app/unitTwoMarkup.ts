// Unit Two theory content follows the user-selected slides of the 170-page course deck.
// The slide references below make the source-to-page mapping reviewable.
export const unitTwoMarkup = String.raw`
      <section class="slide unit-two-cover" id="unit-two" aria-labelledby="unit-two-title">
        <div class="unit-two-frame" aria-hidden="true"></div>
        <div class="unit-two-cover-card">
          <div class="unit-two-cover-copy">
            <p class="unit-two-overline">Unit Two · Narrative Writing</p>
            <h1 id="unit-two-title">Empathy and<br />Justice</h1>
            <p class="unit-two-cover-subtitle">Writing Critically I: Narrative Writing</p>
            <div class="unit-two-cover-actions">
              <a class="unit-two-primary-link" href="#unit-two-knowledge">Start unit <span aria-hidden="true">→</span></a>
              <div class="unit-two-cover-more">
                <a href="#unit-two-knowledge">View theoretical knowledge</a>
                <a href="#reading" data-reading-target="after-twenty">View readings</a>
              </div>
            </div>
          </div>
          <img src="https://assets.negentropylearning.com.cn/narrative-writing/assets/unit-custom-02.png" alt="Illustration of people reaching toward one another" />
        </div>
      </section>

      <section class="slide unit-two-knowledge" id="unit-two-knowledge" aria-labelledby="unit-two-knowledge-title">
        <div class="unit-two-frame" aria-hidden="true"></div>
        <a class="unit-two-back" href="#unit-two">← Back to unit</a>
        <div class="unit-two-shell">
          <div class="unit-two-tabs" role="tablist" aria-label="Unit Two theory sections">
            <button type="button" role="tab" id="unit-two-tab-objectives" aria-controls="unit-two-panel-objectives" aria-selected="true" data-unit-two-tab="objectives">Learning Objectives</button>
            <button type="button" role="tab" id="unit-two-tab-content" aria-controls="unit-two-panel-content" aria-selected="false" data-unit-two-tab="content">Content</button>
            <button type="button" role="tab" id="unit-two-tab-exploration" aria-controls="unit-two-panel-exploration" aria-selected="false" data-unit-two-tab="exploration">Pre-class Exploration</button>
            <button type="button" role="tab" id="unit-two-tab-skills" aria-controls="unit-two-panel-skills" aria-selected="false" data-unit-two-tab="skills">Learning the Skills</button>
            <button type="button" role="tab" id="unit-two-tab-language" aria-controls="unit-two-panel-language" aria-selected="false" data-unit-two-tab="language">Language Study</button>
          </div>

          <section class="unit-two-panel" id="unit-two-panel-objectives" role="tabpanel" aria-labelledby="unit-two-tab-objectives" data-unit-two-panel="objectives" data-source-slides="1-2">
            <p class="unit-two-kicker">Unit Two · slides 1–2</p>
            <h1 id="unit-two-knowledge-title">Learning Objectives</h1>
            <div class="unit-two-rule" aria-hidden="true"><span></span>✦<span></span></div>
            <p class="unit-two-intro">In this unit, you will learn to</p>
            <ol class="unit-two-objectives" type="a">
              <li>know what <strong>characters</strong> are and how to develop <strong>round characters</strong></li>
              <li>balance <strong>showing and telling</strong> in developing characters</li>
              <li>use <strong>concrete language</strong> to create round characters</li>
              <li>get familiar with <strong>figures of speech</strong>, such as simile, metaphor, and personification</li>
              <li>exercise <strong>empathy and fair-mindedness</strong></li>
            </ol>
          </section>

          <section class="unit-two-panel" id="unit-two-panel-content" role="tabpanel" aria-labelledby="unit-two-tab-content" data-unit-two-panel="content" data-source-slides="3" hidden>
            <p class="unit-two-kicker">Unit Two · slide 3</p>
            <h1>Table of Contents</h1>
            <ol class="unit-two-contents">
              <li><button type="button" data-unit-two-open-tab="exploration">Pre-class Exploration</button></li>
              <li><button type="button" data-unit-two-open-tab="skills">Learning the Skills</button></li>
              <li><span>Case Analysis</span></li>
              <li><button type="button" data-unit-two-open-tab="language">Language Study</button></li>
              <li><span>Self-Evaluation</span></li>
            </ol>
            <p class="unit-two-content-note">The requested pages cover sections 01, 02, and 04. Case Analysis and Self-Evaluation are listed here because they appear in the source table of contents.</p>
          </section>

          <section class="unit-two-panel" id="unit-two-panel-exploration" role="tabpanel" aria-labelledby="unit-two-tab-exploration" data-unit-two-panel="exploration" data-source-slides="4-9" hidden>
            <p class="unit-two-kicker">01 · slides 4–9</p>
            <h1>Pre-class Exploration</h1>
            <div class="unit-two-learning-flow">
              <article class="unit-two-spotlight">
                <p class="unit-two-step">01 · Notice a character</p>
                <h2>Which character appeals to you? And why?</h2>
                <p>Begin with a character you know, then identify the visible details and actions that shape your impression.</p>
              </article>
              <article class="unit-two-reading-example">
                <div><p class="unit-two-step">02 · Appearance · slide 6</p><h2>What does Harry Potter look like?</h2></div>
                <blockquote>“Harry had a thin face, knobbly knees, black hair and bright-green eyes. He wore round glasses held together with a lot of Sellotape because of all the times Dudley had punched him on the nose. The only thing Harry liked about his own appearance was a very thin scar on his forehead which was shaped like a bolt of lightning. He had had it as long as he could remember and the first question he could ever remember asking his Aunt Petunia was how he had got it.”</blockquote>
              </article>
              <article class="unit-two-reading-example">
                <div><p class="unit-two-step">03 · Action and emotion · slide 7</p><h2>What do speech and reaction reveal?</h2></div>
                <blockquote>“I DON’T CARE!” Harry yelled at them, snatching up a lunascope and throwing it into the fireplace. “I’VE HAD ENOUGH, I’VE SEEN ENOUGH, I WANT OUT, I WANT IT TO END, I DON'T CARE ANYMORE!”<br /><br />“You do care,” said Dumbledore. He had not flinched or made a single move to stop Harry demolishing his office. His expression was calm, almost detached. “You care so much you feel as though you will bleed to death with the pain of it.”</blockquote>
              </article>
              <article class="unit-two-observation" data-source-pdf="Descriptosaurus" data-source-pages="184-366">
                <div id="character-reference-slot"></div>
              </article>
            </div>
          </section>

          <section class="unit-two-panel" id="unit-two-panel-skills" role="tabpanel" aria-labelledby="unit-two-tab-skills" data-unit-two-panel="skills" data-source-slides="10-16,19-21,23-27,35-43" hidden>
            <p class="unit-two-kicker">02 · Characterization and dialogue</p>
            <h1>Learning the Skills</h1>
            <div class="unit-two-subtabs" role="tablist" aria-label="Unit Two writing skills">
              <button type="button" role="tab" id="unit-two-skill-tab-characters" aria-controls="unit-two-skill-characters" aria-selected="true" data-unit-two-skill-tab="characters">Characters</button>
              <button type="button" role="tab" id="unit-two-skill-tab-dialogue" aria-controls="unit-two-skill-dialogue" aria-selected="false" data-unit-two-skill-tab="dialogue">Dialogue</button>
              <button type="button" role="tab" id="unit-two-skill-tab-showing" aria-controls="unit-two-skill-showing" aria-selected="false" data-unit-two-skill-tab="showing">Showing &amp; Detail</button>
            </div>

            <div class="unit-two-skill-panel" id="unit-two-skill-characters" role="tabpanel" aria-labelledby="unit-two-skill-tab-characters" data-unit-two-skill-panel="characters" data-source-slides="10-16">
              <div class="unit-two-section-head"><span>Slides 10–16</span><h2>Creating characters readers care about</h2></div>
              <blockquote class="unit-two-large-quote">Characters are central to narrative writing. We want characters who live, breathe, and act in believable ways—and whom readers find worth caring about. They have strengths, weaknesses, and specific personalities. <cite>Slide 11, p. 31</cite></blockquote>
              <div class="unit-two-two-col">
                <article><h3>How readers know a character</h3><p>Readers infer moral, intellectual, and emotional qualities from what people say, how they say it, and what they do: <strong>dialogue and action</strong>.</p><p>A character may remain stable, change gradually, or change after a crisis. The slide gives Prospero and Micawber as stable examples, Emma as gradual change, and King Lear and Pip as crisis-related change.</p><small>Slide 12 · A Glossary of Literary Terms (2014), p. 91</small></article>
                <article><h3>Character types</h3><p><strong>Protagonist:</strong> the main character. <strong>Antagonist:</strong> a character or force opposing the protagonist; a supporting character is not necessarily an antagonist.</p><p><strong>Round:</strong> complex in temperament and motivation, with the capacity to surprise. <strong>Flat:</strong> organized around a single idea or quality and describable briefly.</p><small>Slide 13 · round/flat descriptions from Aspects of the Novel</small></article>
              </div>
              <article class="unit-two-four-questions"><h3>Four questions for developing a character</h3><ol><li>What does the character <b>look like</b>? Consider appearance, living environment, and personality.</li><li>What does the character <b>say</b>? Listen to dialogue, manner, tone, syntax, and subtext.</li><li>What does the character <b>do</b>? Choose actions and behaviour that reveal character.</li><li>What does the character <b>think or feel</b>? Show inner thoughts, intentions, and motivations.</li></ol><small>Slide 14</small></article>
              <div class="unit-two-two-col unit-two-name-examples">
                <article><h3>Albus Dumbledore</h3><p>The slide connects <em>Albus</em> to Latin <em>alba</em> (“white”) and <em>Dumbledore</em> to an Old English word for “bumblebee.” It reads white as a sign of purity and the bee as an image of hard work. The name is used as an example of characterization through connotation.</p><small>Slide 15</small></article>
                <article><h3>Sirius Black</h3><p>The slide links <em>Sirius</em> to the Dog Star in Canis Major, mentions Sirius A and the star’s ancient associations, and connects the name to the character’s ability to transform into a dog. <em>Black</em> suggests a darker nature that others may wrongly assume. The name can therefore shape and misdirect readers’ expectations.</p><small>Slide 16</small></article>
              </div>
            </div>

            <div class="unit-two-skill-panel" id="unit-two-skill-dialogue" role="tabpanel" aria-labelledby="unit-two-skill-tab-dialogue" data-unit-two-skill-panel="dialogue" data-source-slides="19-21,23-27" hidden>
              <div class="unit-two-section-head"><span>Slides 19–21, 23–27</span><h2>Dialogue that does more than one thing</h2></div>
              <div class="unit-two-two-col">
                <article><h3>What makes dialogue useful?</h3><ol><li>Add to readers’ knowledge of the situation.</li><li>Move the plot forward.</li><li>Reveal character.</li><li>Dramatize relationships.</li><li>Build suspense.</li></ol><small>Slide 19</small></article>
                <article><h3>Keep each voice true, specific, distinct</h3><p>Consider age, home, situation, listener, gesture, mood, and what the speaker wants. Gestures, silence, surroundings, and grammar also shape an exchange.</p><small>Slide 20</small></article>
              </div>
              <blockquote class="unit-two-large-quote">“Often the most forceful dialogue can be achieved by not having the characters say what they mean. People in extreme emotional states—whether of fear, pain, anger, or love—are at their least articulate.” <cite>Slide 21</cite></blockquote>
              <div class="unit-two-dialogue-modes">
                <article><span>01</span><h3>Summary</h3><p>Condenses a longer conversation into narrative.</p><blockquote>They differed on the issue of the holiday and couldn’t seem to find a common ground.</blockquote><small>Slides 23–24</small></article>
                <article><span>02</span><h3>Indirect</h3><p>Reports the exchange without direct quotation while retaining its feel.</p><blockquote>She had an idea: why not some Caribbean island over Christmas? Well, but his mother expected them for turkey.</blockquote><small>Slides 23, 25</small></article>
                <article><span>03</span><h3>Direct</h3><p>Quotes the speakers when the exchange may lead to discovery, decision, or dramatic action.</p><blockquote>“But I thought you hardly knew her, Mr. Morning.”<br />He picked up a pencil and began to doodle on a notebook page. “Did I tell you that?”<br />“Yes, you did.”<br />“It’s true. I didn’t know her well.”<br />“What is it you’re after, then? Who was this person you’re investigating?”<br />“I would like to know that too.”</blockquote><small>Slides 23, 26 · Siri Hustvedt, “Mr. Morning”</small></article>
              </div>
              <article class="unit-two-spotlight"><p class="unit-two-step">Sloane’s law · slide 27</p><h3>Dialogue should do more than one thing at a time</h3><p>While characters speak, an exchange can also characterize, provide exposition, set a scene, advance action, foreshadow, or remind readers of something important.</p></article>
            </div>

            <div class="unit-two-skill-panel" id="unit-two-skill-showing" role="tabpanel" aria-labelledby="unit-two-skill-tab-showing" data-unit-two-skill-panel="showing" data-source-slides="35-43" hidden>
              <div class="unit-two-section-head"><span>Slides 35–43</span><h2>Balancing telling, showing, and significant detail</h2></div>
              <div class="unit-two-two-col">
                <article><h3>Telling · direct</h3><p>The narrator describes a character’s motives and qualities, often evaluating them for the reader. Telling can set the scene, prepare for a later event, or supply information awkward to dramatize.</p><small>Slides 35, 41 · A Glossary of Literary Terms (2014), p. 94</small></article>
                <article><h3>Showing · indirect / dramatizing</h3><p>The writer presents speech, action, thought, feeling, and response. Readers infer motives and qualities from these details. Events that significantly change the situation usually benefit from this “eyewitness” mode.</p><small>Slides 37, 41 · A Glossary of Literary Terms (2014), p. 94</small></article>
              </div>
              <blockquote class="unit-two-large-quote">“Don’t tell me the moon is shining. Show me the glint of light on broken glass.” <cite>Anton Chekhov · slide 36</cite></blockquote>
              <details class="unit-two-excerpt"><summary>Read the Thomas Mann passage · slide 38</summary><blockquote>I stood enchanted, straining my ears and breathing in the delightful atmosphere and the mixed fragrance of chocolate and smoked fish and earthy truffles…I spoke into the silence, saying: “Good day” in quite a loud voice; I can still remember how my strained, unnatural tones died away in the stillness. No one answered. And my mouth literally began to water like a spring. One quick, noiseless step and I was beside one of the laden tables. I made one rapturous grab into the nearest glass urn, filled as it chanced with chocolate creams, slipped a fistful into my coat pocket, then reached the door, and in the next second was safely round the corner.</blockquote><cite>Thomas Mann, <em>Confessions of Felix Krull, Confidence Man</em></cite></details>
              <article class="unit-two-senses"><h3>Read through the senses</h3><p>The PPT points to visual details from the wider passage—room, ceiling, rows of food, and glass bottles—then identifies smell (chocolate, fish, truffles), sound (“Good day” and the stillness), anticipated taste (his mouth watering), and touch (his grab and the fistful in his pocket).</p><p>Such selected perceptions let readers visualize a scene and infer emotion rather than receiving a label for how to feel. The PPT calls this a “well-organized absence of information.”</p><small>Slides 39–40</small></article>
              <div class="unit-two-two-col">
                <article><h3>Concrete details</h3><p>A detail is concrete when it appeals to one of the five senses.</p><h3>Significant details</h3><p>A detail matters when it also conveys an idea or judgment, suggests character change, or develops the plot.</p><small>Slides 42–43</small></article>
                <article><h3>Chekhov’s gun</h3><p>“If a pistol is placed on a mantel in the first act, it must go off in the last.” Ask which details in <em>After Twenty Years</em> are essential to its later developments.</p><small>Slide 43</small></article>
              </div>
            </div>
          </section>

          <section class="unit-two-panel" id="unit-two-panel-language" role="tabpanel" aria-labelledby="unit-two-tab-language" data-unit-two-panel="language" data-source-slides="110-118" hidden>
            <p class="unit-two-kicker">04 · slides 110–118</p>
            <h1>Language Study</h1>
            <div class="unit-two-subtabs" role="tablist" aria-label="Unit Two language topics">
              <button type="button" role="tab" id="unit-two-language-tab-comparison" aria-controls="unit-two-language-comparison" aria-selected="true" data-unit-two-language-tab="comparison">Literary Terms</button>
              <button type="button" role="tab" id="unit-two-language-tab-topic-one" aria-controls="unit-two-language-topic-one" aria-selected="false" data-unit-two-language-tab="topic-one">Topic 1</button>
              <button type="button" role="tab" id="unit-two-language-tab-topic-two" aria-controls="unit-two-language-topic-two" aria-selected="false" data-unit-two-language-tab="topic-two">Topic 2</button>
              <button type="button" role="tab" id="unit-two-language-tab-topic-three" aria-controls="unit-two-language-topic-three" aria-selected="false" data-unit-two-language-tab="topic-three">Topic 3</button>
            </div>
            <div class="unit-two-language-panel" id="unit-two-language-comparison" role="tabpanel" aria-labelledby="unit-two-language-tab-comparison" data-unit-two-language-panel="comparison" data-source-slides="110-111">
              <div class="unit-two-section-head"><span>Slide 111</span><h2>Pathetic Fallacy versus Personification</h2></div>
              <div class="unit-two-comparison">
                <article><h3>Pathetic fallacy</h3><p>Attributes human qualities to nature or inanimate parts of the natural world.</p><p>A type of personification, often used to reflect the story’s actions or emotions through nature.</p></article>
                <article><h3>Personification</h3><p>Attributes human qualities to nonhuman things or presents an abstract quality in human form.</p><p>The broader term, often used to create vivid imagery.</p></article>
              </div>
            </div>
            <div class="unit-two-language-panel" id="unit-two-language-topic-one" role="tabpanel" aria-labelledby="unit-two-language-tab-topic-one" data-unit-two-language-panel="topic-one" data-source-slides="112-113" hidden>
              <div class="unit-two-section-head"><span>Topic 1 · slides 112–113</span><h2>The unspoken response</h2></div>
              <p class="unit-two-prompt">Two characters have an escalating disagreement. One says exactly and fully what she or he means. The other is unable or unwilling to speak freely. Give us the thoughts of the second character so that we understand the non-response.</p>
              <details class="unit-two-excerpt"><summary>Read the example · slide 113</summary>
                <p>My throat tightened. I stared at the lines of the wooden floor beneath us, tracing their uneven grain.</p>
                <p>I opened my mouth, but nothing came. Not even the smallest breath of what I needed to say. She didn’t know—how could she?—the weight of the silence I carried. The things I couldn’t speak, the things that had no name. The language she used, the precise and measured way she laid out her pain, it was foreign to me. Each time she spoke, it felt like a demand I could never meet. I wanted to answer, to explain why I couldn’t meet her eyes, why the space between us had become so vast, but—</p>
                <p>Her words rang in my head, overlapping with my own thoughts, drowning them. How could I tell her that I wasn’t withholding out of cruelty or spite? That this silence wasn’t a weapon, wasn’t a wall meant to push her away, but rather something that wrapped itself tightly around me, suffocating any chance of an honest response? The truth lived somewhere deep within me, too tangled in fear to surface.</p>
              </details>
            </div>
            <div class="unit-two-language-panel" id="unit-two-language-topic-two" role="tabpanel" aria-labelledby="unit-two-language-tab-topic-two" data-unit-two-language-panel="topic-two" data-source-slides="114-115" hidden>
              <div class="unit-two-section-head"><span>Topic 2 · slides 114–115</span><h2>A challenge at the family table</h2></div>
              <p class="unit-two-prompt">Everyone’s family has an outlier—a black sheep, an embarrassment, a sponger, a felon, a know-it-all. Let such a character hold forth at a family gathering. Who challenges her/him? How? Give the thoughts of the challenger if you choose.</p>
              <details class="unit-two-excerpt"><summary>Read the example · slide 115</summary>
                <p>The family dinner dragged on, and Charlie, as always, dominated the conversation with his wild tales. He leaned back, laughing, recounting yet another story of how he'd "put his boss in his place." The room was filled with forced smiles, nods, and uneasy silence.</p>
                <p>Across the table, Sarah had had enough. She put down her fork. “Charlie, how many jobs have you lost this year?”</p>
                <p>Charlie blinked, caught off guard. “That’s not the point—”</p>
                <p>“No,” Sarah said quietly, “it is the point. When are you going to stop pretending it’s always someone else’s fault?”</p>
                <p>The room froze. Charlie said nothing. Sarah had finally spoken the truth everyone else had been too afraid to say.</p>
              </details>
            </div>
            <div class="unit-two-language-panel" id="unit-two-language-topic-three" role="tabpanel" aria-labelledby="unit-two-language-tab-topic-three" data-unit-two-language-panel="topic-three" data-source-slides="116-118" hidden>
              <div class="unit-two-section-head"><span>Topic 3 · slides 116–118</span><h2>“I’m sorry, but . . .”</h2></div>
              <p class="unit-two-prompt">Write an exchange that begins with the words, “I’m sorry, but . . .” What comes after the “but”? What does the other character say in response? Let them carry on for a while. And a while after that. Keep them talking.</p>
              <details class="unit-two-excerpt"><summary>Read the example · slides 117–118</summary>
                <p>“I’m sorry, but the leaves are falling again,” she said, her voice soft, almost lost in the wind that rustled through the dry, brittle branches above.</p>
                <p>He looked at her, hands deep in his coat pockets, eyes squinting against the amber light of late afternoon. “They fall every year. What do you expect them to do—hold on forever?”</p>
                <p>“No, I don’t expect that,” she said, her gaze following the lazy drift of a red-brown leaf. “I just… I thought this year might be different. I thought maybe things wouldn’t slip away so easily.”</p>
                <p>He sighed, the weight of her words settling like the coming dusk. “Nothing stays the same. Not the leaves, not us.”</p>
                <p>“I know,” she replied, her breath fogging in the cold air. “But it feels like everything’s falling at once this time. More than the leaves. More than just the season.”</p>
                <p>He kicked at the ground, stirring a pile of them, the crunch loud in the silence between them. “It’s just change. You get used to it.”</p>
                <p>“Do you?” she asked, her voice barely more than a whisper. “Do you get used to watching everything drift away? Because I don’t think I can.”</p>
                <p>He didn’t answer at first, just stood there, the fading light casting long shadows between them. “I’m not sure you’re supposed to get used to it. Maybe that’s the point.”</p>
                <p>She turned to him, her eyes dark with unshed tears. “Then what do you do? If you don’t get used to it, if things just keep slipping away, what do you hold on to?”</p>
                <p>He finally looked at her, and his voice softened, as though the wind might carry it away too. “Maybe you hold on to the fact that it’s not about keeping everything. It’s about seeing it when it’s there. Knowing that it’s there, even if only for a moment.”</p>
                <p>She bit her lip, fighting the quiver that wanted to rise. “But what if I need more than a moment?”</p>
                <p>He smiled, a sad smile, the kind you give when you’ve lived through too many seasons. “Then you’ve got to learn to make those moments last longer in your heart than they do on the branch.”</p>
                <p>They stood there, the world around them slowly letting go, but for a while—just a while—they held on to the words that fell between them like the leaves that kept tumbling from the trees.</p>
              </details>
            </div>
          </section>
        </div>
      </section>
`;
