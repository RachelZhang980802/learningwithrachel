"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState, type CSSProperties } from "react";
import "./author-profile.css";
import { authorBooks } from "./authorBooks";

type AuthorProfile = {
  articleId: string;
  articleTitle: string;
  theme: string;
  name: string[];
  role: string;
  lifespan: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  accent: string;
  quote: string;
  quoteSource: string;
  biography: string[];
  works: string;
  recognition: string;
};

const authorProfiles: AuthorProfile[] = [
  {
    articleId: "02",
    articleTitle: "Should the Robots Be Taxed?",
    theme: "Technology",
    name: ["KUMAR", "SACHIDANANDAM"],
    role: "Innovation strategist · technology essayist",
    lifespan: "CONTEMPORARY WRITER",
    image: "/media/authors/kumar-sachidanandam.jpeg",
    imageAlt: "Kumar Sachidanandam wearing a mixed-reality headset",
    imagePosition: "center center",
    accent: "#9a6a37",
    quote: "“We have always been automating.”",
    quoteSource: "SHOULD THE ROBOTS BE TAXED? · 2017",
    biography: [
      "Kumar Sachidanandam is an Indian technologist, innovation strategist, and entrepreneurship mentor. His career has combined software engineering with the practical work of building innovation programs: he held leadership roles at Microsoft and Cognizant, where he helped teams turn ideas into prototypes, and later co-founded Ydealogy Ventures.",
      "Should the Robots Be Taxed? began as a public essay in February 2017, responding to the renewed debate over automation and taxation. Its method is characteristic of Sachidanandam’s technology writing: define the system, compare the new disruption with earlier technological shifts, acknowledge the pain of transition, and then test a policy claim against the wider economic chain.",
      "For students, the key feature is his systems thinking. The argument moves through cause and effect rather than technical jargon, and its historical analogies—machines, railways, cars, and airlines—make an abstract policy question concrete. The final appeal to empathy and social responsibility keeps the essay centered on people as well as technology."
    ],
    works: "Public essays on artificial intelligence, software product engineering, innovation, and entrepreneurship, including “Should the Robots Be Taxed?” and articles on building machine-learning applications.",
    recognition: "His professional honors include Microsoft’s Evangelist of the Year and Gold Star awards, along with worldwide instructor awards; he also led managed-innovation initiatives at Cognizant."
  },
  {
    articleId: "03",
    articleTitle: "Roommates",
    theme: "Family Ties",
    name: ["MAX", "APPLE"],
    role: "Fiction writer · memoirist · teacher",
    lifespan: "BORN 1941",
    image: "/media/authors/max-apple.jpg",
    imageAlt: "Max Apple speaking in a classroom",
    imagePosition: "center center",
    accent: "#896347",
    quote: "“The aroma of life stayed in his nostrils.”",
    quoteSource: "ROOMMATES: MY GRANDFATHER’S STORY · 1994",
    biography: [
      "Max Apple is an American fiction writer, memoirist, screenwriter, and longtime teacher of creative writing. Raised in Michigan in a working-class family, he credits his grandmother’s storytelling with teaching him that a good story could carry an entire world. He earned his doctorate at the University of Michigan, taught at Rice University for twenty-nine years, and later joined the University of Pennsylvania.",
      "Apple first became known for comic, surreal fiction about American consumer culture. His stories often place celebrities, brand names, sports, politics, and family life in improbable combinations. Beneath the satire is a precise ear for spoken language and a sympathy for characters trying to remain human inside large cultural systems.",
      "Roommates grew from Apple’s years living with his grandfather, Rocky, who was ninety-five when Apple returned to graduate school. The memoir joins family history to the losses and changes of twentieth-century America. Its humor never cancels grief; instead, ordinary routines, stubborn energy, and remembered speech make love visible across generations."
    ],
    works: "The Oranging of America; Zip; Free Agents; The Propheteers; Roommates: My Grandfather’s Story; I Love Gootie: My Grandmother’s Story; and The Jew of Home Depot. He also wrote the screenplays for Roommates and The Air Up There.",
    recognition: "Recipient of fellowships from the John Simon Guggenheim Memorial Foundation and the National Endowment for the Humanities."
  },
  {
    articleId: "05",
    articleTitle: "Courage",
    theme: "Family Ties",
    name: ["LYDIA", "MINATOYA"],
    role: "Writer · psychologist · educator",
    lifespan: "BORN 1950",
    image: "/media/authors/lydia-minatoya.jpg",
    imageAlt: "Portrait of Lydia Minatoya",
    imagePosition: "center center",
    accent: "#8f5d4d",
    quote: "“There’s a reason why I tell this story.”",
    quoteSource: "TALKING TO HIGH MONKS IN THE SNOW",
    biography: [
      "Lydia Yuri Minatoya is a Japanese American writer, psychologist, and educator. Born in Albany, New York, she grew up negotiating the distance between her family’s Japanese inheritance and the America around her. After earning a doctorate in psychology, she taught in the United States, Japan, and China; those crossings became central to her writing.",
      "Her memoir Talking to High Monks in the Snow follows a search for cultural identity through family memory and travel in Asia. The novel The Strangeness of Beauty turns to three generations of Japanese women whose lives cross the United States and Japan before and during the Second World War. Both books treat identity as something lived through place, language, family obligation, and historical pressure.",
      "Minatoya’s prose is lyrical, reflective, and attentive to gesture. In Courage, bravery is not reduced to spectacle: it appears through a character’s decision, through what family members remember, and through the emotional cost of acting against custom. Students should watch how a small domestic scene opens onto questions of gender, tradition, migration, and moral choice."
    ],
    works: "Talking to High Monks in the Snow: An Asian-American Odyssey and The Strangeness of Beauty, along with short stories and essays on Japanese American identity and cross-cultural experience.",
    recognition: "Talking to High Monks in the Snow received the Pacific Northwest Booksellers Award and other honors; The Strangeness of Beauty received major award nominations, including the National Book Award and PEN/Hemingway Award."
  },
  {
    articleId: "06",
    articleTitle: "Reading",
    theme: "The Pleasure of Reading",
    name: ["BENJAMIN", "FRANKLIN"],
    role: "Printer · writer · scientist · statesman",
    lifespan: "1706 — 1790",
    image: "/media/authors/benjamin-franklin.jpg",
    imageAlt: "Painted portrait of Benjamin Franklin",
    imagePosition: "center 28%",
    accent: "#99723e",
    quote: "“He that can have patience can have what he will.”",
    quoteSource: "POOR RICHARD’S ALMANACK",
    biography: [
      "Benjamin Franklin was a printer, publisher, essayist, scientist, inventor, diplomat, and political founder of the United States. With little formal schooling after childhood, he educated himself through voracious reading and the discipline of the printing trade. He published the Pennsylvania Gazette, created Poor Richard’s Almanack, and helped establish libraries and other civic institutions.",
      "Franklin’s best-known literary work, The Autobiography, presents a life as a sequence of experiments in conduct. Its plain style, practical detail, self-correction, and famous account of thirteen virtues helped shape the American tradition of self-making. Poor Richard’s brief maxims compress observation into memorable, sometimes teasing advice about time, labor, thrift, and judgment.",
      "Reading belongs to that practical tradition. Franklin treats books as instruments for independent thought and social improvement, yet his life also asks readers to examine contradiction: the advocate of liberty once held enslaved people and only later became an abolitionist. Studying him well means reading both the force of his ideas and the limits of his historical choices."
    ],
    works: "Poor Richard’s Almanack, The Autobiography of Benjamin Franklin, the Silence Dogood essays, scientific papers on electricity, political pamphlets, speeches, and extensive correspondence.",
    recognition: "Awarded the Royal Society’s Copley Medal in 1753 for experiments and observations on electricity; elected a Fellow of the Royal Society in 1756."
  },
  {
    articleId: "07",
    articleTitle: "What We Gain or Lose in Cities",
    theme: "Life in the City",
    name: ["JARED", "DIAMOND"],
    role: "Geographer · physiologist · public scholar",
    lifespan: "BORN 1937",
    image: "/media/authors/jared-diamond.jpeg",
    imageAlt: "Portrait of Jared Diamond",
    imagePosition: "center 38%",
    accent: "#6f7659",
    quote: "“Urban life involves trade-offs.”",
    quoteSource: "WHAT WE GAIN OR LOSE IN CITIES",
    biography: [
      "Jared Diamond is an American geographer, physiologist, evolutionary biologist, and public writer. Trained first in physiology, he also carried out long-term fieldwork on New Guinea birds and later became known for comparing societies across geography, ecology, history, and public health. He spent most of his academic career at UCLA.",
      "Diamond writes large-scale explanatory nonfiction. His signature move is to connect evidence from fields that are usually kept apart, then use comparison to ask why societies develop differently or respond differently to crisis. This breadth makes his books accessible and provocative, while also inviting readers to test whether a broad model has simplified local histories or human agency.",
      "What We Gain or Lose in Cities applies that comparative method to ordinary urban life. Instead of treating the city as wholly good or bad, it weighs anonymity, specialization, opportunity, inequality, social support, and environmental cost. Students should notice the structure of paired gains and losses and the way examples carry the argument."
    ],
    works: "The Third Chimpanzee; Why Is Sex Fun?; Guns, Germs, and Steel; Collapse; The World Until Yesterday; and Upheaval.",
    recognition: "Guns, Germs, and Steel won the 1998 Pulitzer Prize for General Nonfiction. Diamond has also received the U.S. National Medal of Science and the Tyler Prize for Environmental Achievement, and was elected to the National Academy of Sciences."
  },
  {
    articleId: "08",
    articleTitle: "The Guide to Being a Foodie Without Being Culturally Appropriative",
    theme: "Food for Thought",
    name: ["RACHEL", "KUO"],
    role: "Scholar · writer · movement educator",
    lifespan: "CONTEMPORARY WRITER",
    image: "/media/authors/rachel-kuo.jpeg",
    imageAlt: "Portrait of Rachel Kuo",
    imagePosition: "center 35%",
    accent: "#b17b39",
    quote: "“You don’t have to give up delicious foods from other cultures to avoid appropriation.”",
    quoteSource: "EVERYDAY FEMINISM · 2015",
    biography: [
      "Rachel Kuo is a scholar and writer whose work examines race, social movements, and digital technology. Trained in journalism and media studies, she combines archival research, interviews, and fieldwork with experience in grassroots organizing. She is also a co-founder of the Asian American Feminist Collective.",
      "The essay used in this course first appeared in Everyday Feminism in 2015. It asks readers to look beyond individual taste and “authenticity” to the unequal histories that shape who can profit from a cuisine, whose food is mocked or made fashionable, and whether the communities that created it retain access to it.",
      "Kuo’s writing is explanatory and movement-centered. Everyday examples lead to structural questions about race, class, labor, colonization, and gentrification. For students, the most useful habit is her shift from intention to relationship: enjoying another culture’s food is only the beginning; the deeper task is to learn who made it, how power works around it, and how respect can become material support."
    ],
    works: "Movement Media: In Pursuit of Solidarity; the co-edited collection We Are Each Other’s Liberation; and essays and research on race, feminism, digital media, and political organizing.",
    recognition: "Her research has received support from the National Endowment for the Humanities and the Social Science Research Council."
  },
  {
    articleId: "09",
    articleTitle: "Stop Telling Me to Travel like a Local, Okay?",
    theme: "The Art of Travel",
    name: ["MARI", "UYEHARA"],
    role: "Food writer · travel writer · editor",
    lifespan: "CONTEMPORARY WRITER",
    image: "/media/authors/mari-uyehara.webp",
    imageAlt: "Portrait of Mari Uyehara",
    imagePosition: "center 24%",
    accent: "#765b4f",
    quote: "“You simply cannot travel like a local. It is a contradiction in terms.”",
    quoteSource: "BON APPÉTIT · 2019",
    biography: [
      "Mari Uyehara is an American food and travel writer based in Brooklyn. She has worked as a senior editor at Saveur, Time Out New York, and Martha Stewart Living Radio, and has contributed to publications including Bon Appétit, Epicurious, TASTE, The Wall Street Journal, and The Boston Globe.",
      "Her essays mix reported knowledge with a clear first-person presence. Food is never only flavor: it carries migration, labor, regional history, class, and the institutions that decide what receives prestige. Her best work can be comic and skeptical in one paragraph, then turn toward hospitality, memory, or injustice in the next.",
      "Stop Telling Me to Travel like a Local, Okay? dismantles a fashionable slogan by following its logic. Locals are living ordinary lives; travelers are visitors. Uyehara argues that honest curiosity, preparation, gratitude, and willingness to ask for help are more respectful than pretending to belong. The essay’s wit makes its ethical point memorable without turning travel into a moral performance."
    ],
    works: "Award-winning essays and criticism on American food culture, restaurants, travel, immigrant histories, and the relationship between cuisine and national identity.",
    recognition: "Winner of a 2019 James Beard Media Award for her TASTE column on American food."
  },
  {
    articleId: "10",
    articleTitle: "Two Ways of Seeing a River",
    theme: "Lessons Learned from Nature",
    name: ["MARK", "TWAIN"],
    role: "Novelist · humorist · journalist · lecturer",
    lifespan: "1835 — 1910",
    image: "/media/authors/mark-twain.jpeg",
    imageAlt: "Studio portrait of Mark Twain",
    imagePosition: "center 22%",
    accent: "#806a54",
    quote: "“All the grace, the beauty, the poetry had gone out of the majestic river!”",
    quoteSource: "LIFE ON THE MISSISSIPPI · 1883",
    biography: [
      "Mark Twain was the pen name of Samuel Langhorne Clemens, an American novelist, humorist, journalist, and lecturer. He grew up beside the Mississippi River in Hannibal, Missouri, worked as a printer and riverboat pilot, and later reported from the American West. The pilot’s call “mark twain,” meaning two fathoms of safe water, became his literary name.",
      "Twain’s writing joins vernacular speech, comic timing, tall-tale exaggeration, and sharp social criticism. He used narrators whose limited knowledge allows readers to see hypocrisy more clearly than the speaker does. Race, class, technology, imperialism, and the distance between public ideals and private conduct recur throughout his work.",
      "Two Ways of Seeing a River comes from Life on the Mississippi. It contrasts the novice’s enchanted view with the trained pilot’s diagnostic eye. The gain is professional knowledge; the loss is wonder. Its repeated images and changing meanings make the passage a model of reflective prose—and a warning that expertise can reveal danger while narrowing perception."
    ],
    works: "The Adventures of Tom Sawyer; Adventures of Huckleberry Finn; The Prince and the Pauper; A Connecticut Yankee in King Arthur’s Court; The Innocents Abroad; Roughing It; and Life on the Mississippi.",
    recognition: "Twain’s lasting distinction is literary rather than prize-based: his experiments with American speech and satire made him one of the central figures in United States literature."
  }
];

const profileIds = new Set(authorProfiles.map((profile) => profile.articleId));

export function hasAuthorProfile(articleId: string) {
  return profileIds.has(articleId);
}

type AuthorProfilePageProps = {
  articleId: string;
  onBackToText: () => void;
};

export function AuthorProfilePage({ articleId, onBackToText }: AuthorProfilePageProps) {
  const initialIndex = Math.max(0, authorProfiles.findIndex((profile) => profile.articleId === articleId));
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const profile = authorProfiles[activeIndex];
  const books = authorBooks[profile.articleId] ?? [];
  const style = useMemo(() => ({
    "--author-accent": profile.accent,
    "--author-portrait": `url("${profile.image}")`,
    "--author-portrait-position": profile.imagePosition
  } as CSSProperties), [profile]);

  const goToProfile = (nextIndex: number) => {
    setActiveIndex(nextIndex);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  return (
    <main className="author-profile-page" data-article={profile.articleId} style={style}>
      <div className="author-profile-backdrop" aria-hidden="true" />
      <section className="author-profile-spread" aria-label={`Author introduction: ${profile.name.join(" ")}`}>
        <div className={`author-profile-media${books.length ? " has-books" : ""}`}>
          <figure className="author-profile-portrait">
            <img src={profile.image} alt={profile.imageAlt} />
          </figure>
          {books.length > 0 && (
            <ul className="author-profile-books" aria-label={`Selected books by ${profile.name.join(" ")}`}>
              {books.map((book) => (
                <li key={book.image}>
                  <a href={book.source} target="_blank" rel="noreferrer" aria-label={`${book.title} — book details (opens in a new tab)`}>
                    <img src={book.image} alt={`${book.title} — book cover`} width={100} height={150} loading="lazy" />
                    <span>{book.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <article className="author-profile-paper">
          <nav className="author-profile-nav" aria-label="Author profile navigation">
            <button type="button" onClick={onBackToText}>← BACK TO TEXT</button>
            <div>
              <button type="button" disabled={activeIndex === 0} onClick={() => goToProfile(activeIndex - 1)}>← PREV</button>
              <span aria-hidden="true">|</span>
              <button type="button" disabled={activeIndex === authorProfiles.length - 1} onClick={() => goToProfile(activeIndex + 1)}>NEXT →</button>
            </div>
          </nav>

          <div key={profile.articleId} className="author-profile-scroll" tabIndex={0} role="region" aria-label={`About ${profile.name.join(" ")}`}>
            <header className="author-profile-heading">
              <p className="author-profile-role">{profile.role}</p>
              <h1>{profile.name.map((line) => <span key={line}>{line}</span>)}</h1>
              <p className="author-profile-years">{profile.lifespan}</p>
              <i aria-hidden="true" />
            </header>

            <blockquote className="author-profile-quote">
              <p>{profile.quote}</p>
              <cite>{profile.quoteSource}</cite>
            </blockquote>

            <div className="author-profile-biography">
              {profile.biography.map((paragraph, paragraphIndex) => (
                <p className={paragraphIndex === 0 ? "is-opening" : undefined} key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="author-profile-notes">
              <div>
                <dt>KEY WORKS</dt>
                <dd>{profile.works}</dd>
              </div>
              <div>
                <dt>HONORS &amp; LEGACY</dt>
                <dd>{profile.recognition}</dd>
              </div>
            </dl>

          </div>
        </article>
      </section>
    </main>
  );
}
