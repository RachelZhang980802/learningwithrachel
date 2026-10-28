"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./narrative-writing.css";
import "./unit-two-knowledge.css";
import "./unit-theory.css";
import { narrativeWritingMarkup } from "./narrativeWritingMarkup";
import { toMediaUrl } from "./mediaUrl";
import { UniversityFooter } from "./UniversityFooter";
import { CharacterReference } from "./CharacterReference";
import { SettingReference } from "./SettingReference";
import { StoryBook } from "./StoryBook";
import { UnitDeckViewer } from "./UnitDeckViewer";
import { initUnitThreeQuotes } from "./unitThreeInteractions";
import { initUnitTheoryArt } from "./unitTheoryArt";

type NarrativeView =
  | "cover"
  | "intro"
  | "objectives"
  | "instructor"
  | "units"
  | "unit-one"
  | "unit-one-knowledge"
  | "unit-two"
  | "unit-two-knowledge"
  | "unit-three"
  | "unit-three-knowledge"
  | "unit-four"
  | "unit-four-knowledge"
  | "unit-five"
  | "unit-five-knowledge"
  | "unit-six"
  | "unit-six-knowledge"
  | "assessment"
  | "writing-storybook"
  | "reading"
  | "reading-necklace"
  | "reading-fat"
  | "reading-after-twenty"
  | "reading-last-leaf"
  | "reading-flowers"
  | "reading-egg"
  | "reading-days-wait"
  | "reading-short-story"
  | "reading-cop-anthem"
  | "reading-early-autumn"
  | "reading-story-hour"
  | "reading-trifles"
  | "info"
  | "practice"
  | "sample";

const viewHashes: Partial<Record<NarrativeView, string>> = {
  intro: "#intro",
  objectives: "#objectives",
  instructor: "#instructor",
  units: "#units",
  "unit-one": "#unit-one",
  "unit-one-knowledge": "#unit-one-knowledge",
  "unit-two": "#unit-two",
  "unit-two-knowledge": "#unit-two-knowledge",
  "unit-three": "#unit-three",
  "unit-three-knowledge": "#unit-three-knowledge",
  "unit-four": "#unit-four",
  "unit-four-knowledge": "#unit-four-knowledge",
  "unit-five": "#unit-five",
  "unit-five-knowledge": "#unit-five-knowledge",
  "unit-six": "#unit-six",
  "unit-six-knowledge": "#unit-six-knowledge",
  assessment: "#assessment",
  "writing-storybook": "#writing-storybook",
  reading: "#reading",
  "reading-necklace": "#reading-necklace",
  "reading-fat": "#reading-fat",
  "reading-after-twenty": "#reading-after-twenty",
  "reading-last-leaf": "#reading-last-leaf",
  "reading-flowers": "#reading-flowers",
  "reading-egg": "#reading-egg",
  "reading-days-wait": "#reading-days-wait",
  "reading-short-story": "#reading-short-story",
  "reading-cop-anthem": "#reading-cop-anthem",
  "reading-early-autumn": "#reading-early-autumn",
  "reading-story-hour": "#reading-story-hour",
  "reading-trifles": "#reading-trifles",
  info: "#other-information",
  practice: "#practice",
  sample: "#sample",
};

const flowerStickerFiles = [
  "01-W.webp",
  "02-r.webp",
  "03-i.webp",
  "04-t.webp",
  "05-e.webp",
  "06-W.webp",
  "07-h.webp",
  "08-a.webp",
  "09-t.webp",
  "10-M.webp",
  "11-a.webp",
  "12-t.webp",
  "13-t.webp",
  "14-e.webp",
  "15-r.webp",
  "16-s.webp",
] as const;

const flowerAngles = [-8, 6, -4, 9, -6, 5, -7, 4, -5, 8, -3, 6, -8, 5, -4, 7] as const;
const tallLowercase = new Set(["h", "i", "t"]);

const NarrativeMarkup = memo(function NarrativeMarkup() {
  return <div className="narrative-legacy" dangerouslySetInnerHTML={{ __html: narrativeWritingMarkup }} />;
});

function routeForHash(hash = ""): NarrativeView | null {
  const value = hash.toLowerCase();
  if (!value || value === "#cover") return "cover";
  if (value === "#intro") return "intro";
  if (value === "#objectives") return "objectives";
  if (value === "#instructor") return "instructor";
  if (value === "#units") return "units";
  if (value === "#unit-one") return "unit-one";
  if (value === "#unit-one-knowledge") return "unit-one-knowledge";
  if (value === "#unit-two") return "unit-two";
  if (value === "#unit-two-knowledge") return "unit-two-knowledge";
  if (value === "#unit-three") return "unit-three";
  if (value === "#unit-three-knowledge") return "unit-three-knowledge";
  if (value === "#unit-four") return "unit-four";
  if (value === "#unit-four-knowledge") return "unit-four-knowledge";
  if (value === "#unit-five") return "unit-five";
  if (value === "#unit-five-knowledge") return "unit-five-knowledge";
  if (value === "#unit-six") return "unit-six";
  if (value === "#unit-six-knowledge") return "unit-six-knowledge";
  if (value === "#assessment") return "assessment";
  if (value === "#writing-storybook") return "writing-storybook";
  if (value === "#reading-necklace") return "reading-necklace";
  if (value === "#reading-fat") return "reading-fat";
  if (value === "#reading-after-twenty") return "reading-after-twenty";
  if (value === "#reading-last-leaf") return "reading-last-leaf";
  if (value === "#reading-flowers") return "reading-flowers";
  if (value === "#reading-egg") return "reading-egg";
  if (value === "#reading-days-wait") return "reading-days-wait";
  if (value === "#reading-short-story") return "reading-short-story";
  if (value === "#reading-cop-anthem") return "reading-cop-anthem";
  if (value === "#reading-early-autumn") return "reading-early-autumn";
  if (value === "#reading-story-hour") return "reading-story-hour";
  if (value === "#reading-trifles") return "reading-trifles";
  if (value === "#reading" || value.startsWith("#reading-")) return "reading";
  if (value === "#other-information") return "info";
  if (value === "#practice") return "practice";
  if (value === "#sample") return "sample";
  return null;
}

export function isNarrativeCourseHash(hash = "") {
  return /^#(?:cover|intro|objectives|instructor|units|unit-(?:one|two|three|four|five|six)(?:-knowledge)?|assessment|writing-storybook|reading(?:-.+)?|other-information|practice|sample)$/i.test(hash);
}

export function NarrativeWritingCourse({ onHome }: { onHome: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [characterSlot, setCharacterSlot] = useState<HTMLElement | null>(null);
  const [settingSlot, setSettingSlot] = useState<HTMLElement | null>(null);
  const [storybookSlot, setStorybookSlot] = useState<HTMLElement | null>(null);
  const [homeSlot, setHomeSlot] = useState<HTMLElement | null>(null);
  const [homeActionSlot, setHomeActionSlot] = useState<HTMLElement | null>(null);
  const [route, setRoute] = useState<{ view: NarrativeView; focusId: string | null; revision: number }>({
    view: "cover",
    focusId: null,
    revision: 0,
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const activeSlides = new Set<HTMLElement>();
    if (route.view === "objectives" || route.view === "assessment") {
      root.querySelectorAll<HTMLElement>(`main > [data-nav="${route.view}"]`).forEach((slide) => activeSlides.add(slide));
    } else {
      const selectorByView: Record<Exclude<NarrativeView, "objectives" | "assessment">, string> = {
        cover: "#cover",
        intro: "#intro",
        instructor: "#instructor",
        units: "#units",
        "unit-one": "#unit-one",
        "unit-one-knowledge": "#unit-one-knowledge",
        "unit-two": "#unit-two",
        "unit-two-knowledge": "#unit-two-knowledge",
        "unit-three": "#unit-three",
        "unit-three-knowledge": "#unit-three-knowledge",
        "unit-four": "#unit-four",
        "unit-four-knowledge": "#unit-four-knowledge",
        "unit-five": "#unit-five",
        "unit-five-knowledge": "#unit-five-knowledge",
        "unit-six": "#unit-six",
        "unit-six-knowledge": "#unit-six-knowledge",
        "writing-storybook": "#writing-storybook",
        reading: "#reading",
        "reading-necklace": "#reading-detail-necklace",
        "reading-fat": "#reading-detail-fat",
        "reading-after-twenty": "#reading-detail-after-twenty",
        "reading-last-leaf": "#reading-detail-last-leaf",
        "reading-flowers": "#reading-detail-flowers",
        "reading-egg": "#reading-detail-egg",
        "reading-days-wait": "#reading-detail-days-wait",
        "reading-short-story": "#reading-detail-short-story",
        "reading-cop-anthem": "#reading-detail-cop-anthem",
        "reading-early-autumn": "#reading-detail-early-autumn",
        "reading-story-hour": "#reading-detail-story-hour",
        "reading-trifles": "#reading-detail-trifles",
        info: "#other-information",
        practice: "#practice",
        sample: ".sample-slide",
      };
      const slide = root.querySelector<HTMLElement>(selectorByView[route.view]);
      if (slide) activeSlides.add(slide);
    }

    root.querySelectorAll<HTMLElement>("main > .slide").forEach((slide) => {
      slide.classList.toggle("view-hidden", !activeSlides.has(slide));
    });
    root.querySelectorAll<HTMLAnchorElement>("[data-nav-link]").forEach((link) => {
      const active = link.dataset.navLink === route.view || (route.view.startsWith("unit-") && link.dataset.navLink === "units");
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    if (!route.focusId) return;
    const target = root.querySelector<HTMLElement>(`#${CSS.escape(route.focusId)}`);
    if (!target) return;
    target.classList.add("focused");
    target.focus({ preventScroll: true });
    const timer = window.setTimeout(() => target.classList.remove("focused"), 1200);
    return () => window.clearTimeout(timer);
  }, [route]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanup: Array<() => void> = [];
    const timers = new Set<number>();
    const later = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };
    const clearLater = (timer: number | undefined) => {
      if (timer === undefined) return;
      window.clearTimeout(timer);
      timers.delete(timer);
    };

    const showView = (
      key: NarrativeView,
      { historyMode = "push", focusId = null }: { historyMode?: "push" | "none"; focusId?: string | null } = {},
    ) => {
      setRoute((current) => ({ view: key, focusId, revision: current.revision + 1 }));

      if (historyMode === "push") {
        const nextHash = key === "cover" ? "" : viewHashes[key] || "#cover";
        const base = `${window.location.pathname}${window.location.search}`;
        window.history.pushState({ narrativeView: key }, "", nextHash ? `${base}${nextHash}` : base);
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      const handleClick = (event: MouseEvent) => {
        const href = link.getAttribute("href") || "";
        const key = routeForHash(href);
        if (!key) return;
        event.preventDefault();
        const focusId = link.dataset.readingTarget ? `reading-${link.dataset.readingTarget}` : null;
        showView(key, { focusId });
      };
      link.addEventListener("click", handleClick);
      cleanup.push(() => link.removeEventListener("click", handleClick));
    });

    root.querySelectorAll<HTMLAnchorElement>(".theory-inline-slide a[data-theory-zoom]").forEach((link) => {
      const figure = link.closest<HTMLElement>(".theory-inline-slide");
      const closeButton = figure?.querySelector<HTMLButtonElement>(".theory-slide-close");
      if (!figure || !closeButton) return;
      const close = () => {
        if (!figure.classList.contains("is-enlarged")) return;
        figure.classList.remove("is-enlarged");
        link.focus();
      };
      const open = (event: MouseEvent) => {
        event.preventDefault();
        figure.classList.add("is-enlarged");
        closeButton.focus();
      };
      const clickBackdrop = (event: MouseEvent) => { if (event.target === figure) close(); };
      const escape = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
      link.addEventListener("click", open);
      closeButton.addEventListener("click", close);
      figure.addEventListener("click", clickBackdrop);
      document.addEventListener("keydown", escape);
      cleanup.push(() => {
        figure.classList.remove("is-enlarged");
        link.removeEventListener("click", open);
        closeButton.removeEventListener("click", close);
        figure.removeEventListener("click", clickBackdrop);
        document.removeEventListener("keydown", escape);
      });
    });

    const knowledgeTabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-unit-one-knowledge-tab]"));
    const knowledgePanels = Array.from(root.querySelectorAll<HTMLElement>("[data-unit-one-knowledge-panel]"));
    const selectKnowledgeTab = (tabName: string) => {
      knowledgeTabs.forEach((tab) => {
        const selected = tab.dataset.unitOneKnowledgeTab === tabName;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      knowledgePanels.forEach((panel) => {
        panel.hidden = panel.dataset.unitOneKnowledgePanel !== tabName;
      });
    };

    knowledgeTabs.forEach((tab, index) => {
      const handleClick = () => selectKnowledgeTab(tab.dataset.unitOneKnowledgeTab || "objectives");
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!knowledgeTabs.length) return;
        const movement = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? knowledgeTabs.length - 1 : (index + movement + knowledgeTabs.length) % knowledgeTabs.length;
        if (!movement && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        const nextTab = knowledgeTabs[nextIndex];
        selectKnowledgeTab(nextTab.dataset.unitOneKnowledgeTab || "objectives");
        nextTab.focus();
      };
      tab.addEventListener("click", handleClick);
      tab.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => {
        tab.removeEventListener("click", handleClick);
        tab.removeEventListener("keydown", handleKeyDown);
      });
    });
    if (knowledgeTabs.length) selectKnowledgeTab("objectives");

    const wireUnitTwoTabs = (tabAttribute: string, panelAttribute: string, first: string, scrollToTop = false) => {
      const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>(`[${tabAttribute}]`));
      const panels = Array.from(root.querySelectorAll<HTMLElement>(`[${panelAttribute}]`));
      const select = (name: string, scroll = false) => {
        tabs.forEach((tab) => {
          const selected = tab.getAttribute(tabAttribute) === name;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
        });
        panels.forEach((panel) => { panel.hidden = panel.getAttribute(panelAttribute) !== name; });
        if (scroll && scrollToTop) window.scrollTo({ top: 0, behavior: "auto" });
      };
      tabs.forEach((tab, index) => {
        const handleClick = () => select(tab.getAttribute(tabAttribute) || first, true);
        const handleKeyDown = (event: KeyboardEvent) => {
          const movement = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
          if (!movement && event.key !== "Home" && event.key !== "End") return;
          event.preventDefault();
          const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + movement + tabs.length) % tabs.length;
          const nextTab = tabs[nextIndex];
          select(nextTab.getAttribute(tabAttribute) || first, true);
          nextTab.focus();
        };
        tab.addEventListener("click", handleClick);
        tab.addEventListener("keydown", handleKeyDown);
        cleanup.push(() => { tab.removeEventListener("click", handleClick); tab.removeEventListener("keydown", handleKeyDown); });
      });
      if (tabs.length) select(first);
      return select;
    };
    const selectUnitTwoTab = wireUnitTwoTabs("data-unit-two-tab", "data-unit-two-panel", "objectives", true);
    wireUnitTwoTabs("data-unit-two-skill-tab", "data-unit-two-skill-panel", "characters");
    wireUnitTwoTabs("data-unit-two-language-tab", "data-unit-two-language-panel", "comparison");
    root.querySelectorAll<HTMLButtonElement>("[data-unit-two-open-tab]").forEach((button) => {
      const handleClick = () => selectUnitTwoTab(button.dataset.unitTwoOpenTab || "objectives", true);
      button.addEventListener("click", handleClick);
      cleanup.push(() => button.removeEventListener("click", handleClick));
    });

    root.querySelectorAll<HTMLElement>("[data-theory-unit]").forEach((shell) => {
      const tabs = Array.from(shell.querySelectorAll<HTMLButtonElement>("[data-theory-tab]"));
      const panels = Array.from(shell.querySelectorAll<HTMLElement>("[data-theory-panel]"));
      const alignReaderPage = (reader: HTMLElement) => {
        const strip = reader.querySelector<HTMLElement>(".theory-page-strip");
        const button = reader.querySelector<HTMLButtonElement>('[data-theory-page-button][aria-pressed="true"]');
        if (!strip || !button || !strip.clientWidth) return;
        const offset = button.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
        strip.scrollLeft = offset - strip.clientWidth / 2 + button.clientWidth / 2;
      };
      const select = (name: string, scroll = false) => {
        tabs.forEach((tab) => {
          const selected = tab.dataset.theoryTab === name;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
        });
        panels.forEach((panel) => { panel.hidden = panel.dataset.theoryPanel !== name; });
        const activePanel = panels.find((panel) => panel.dataset.theoryPanel === name);
        activePanel?.querySelectorAll<HTMLElement>("[data-theory-reader]").forEach(alignReaderPage);
        if (scroll) window.scrollTo({ top: 0, behavior: "auto" });
      };
      tabs.forEach((tab, index) => {
        const handleClick = () => select(tab.dataset.theoryTab || "objectives", true);
        const handleKeyDown = (event: KeyboardEvent) => {
          const move = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
          if (!move && event.key !== "Home" && event.key !== "End") return;
          event.preventDefault();
          const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + move + tabs.length) % tabs.length;
          const next = tabs[nextIndex];
          select(next.dataset.theoryTab || "objectives", true);
          next.focus();
        };
        tab.addEventListener("click", handleClick);
        tab.addEventListener("keydown", handleKeyDown);
        cleanup.push(() => { tab.removeEventListener("click", handleClick); tab.removeEventListener("keydown", handleKeyDown); });
      });
      shell.querySelectorAll<HTMLButtonElement>("[data-theory-open-tab]").forEach((button) => {
        const handleClick = () => select(button.dataset.theoryOpenTab || "objectives", true);
        button.addEventListener("click", handleClick);
        cleanup.push(() => button.removeEventListener("click", handleClick));
      });
      shell.querySelectorAll<HTMLElement>("[data-theory-reader]").forEach((reader) => {
        const pages = Array.from(reader.querySelectorAll<HTMLElement>("[data-theory-page]"));
        const pageButtons = Array.from(reader.querySelectorAll<HTMLButtonElement>("[data-theory-page-button]"));
        const previous = reader.querySelector<HTMLButtonElement>("[data-theory-page-prev]");
        const next = reader.querySelector<HTMLButtonElement>("[data-theory-page-next]");
        const progress = reader.querySelector<HTMLElement>("[data-theory-page-progress]");
        let current = 0;
        const showPage = (index: number, scroll = false) => {
          if (index < 0 || index >= pages.length) return;
          current = index;
          pages.forEach((page, pageIndex) => { page.hidden = pageIndex !== current; });
          pageButtons.forEach((button, pageIndex) => {
            const selected = pageIndex === current;
            button.setAttribute("aria-pressed", String(selected));
          });
          alignReaderPage(reader);
          if (previous) previous.disabled = current === 0;
          if (next) next.disabled = current === pages.length - 1;
          if (progress) progress.textContent = `${current + 1} / ${pages.length}`;
          if (scroll) reader.scrollIntoView({ block: "start", behavior: "smooth" });
        };
        pageButtons.forEach((button, index) => {
          const handleClick = () => showPage(index);
          button.addEventListener("click", handleClick);
          cleanup.push(() => button.removeEventListener("click", handleClick));
        });
        reader.closest("[data-theory-panel]")?.querySelectorAll<HTMLButtonElement>("[data-theory-jump-page]").forEach((button) => {
          const handleClick = () => {
            const index = pages.findIndex((page) => page.dataset.theoryPage === button.dataset.theoryJumpPage);
            if (index >= 0) showPage(index, true);
          };
          button.addEventListener("click", handleClick);
          cleanup.push(() => button.removeEventListener("click", handleClick));
        });
        const handlePrevious = () => showPage(current - 1, true);
        const handleNext = () => showPage(current + 1, true);
        previous?.addEventListener("click", handlePrevious);
        next?.addEventListener("click", handleNext);
        cleanup.push(() => {
          previous?.removeEventListener("click", handlePrevious);
          next?.removeEventListener("click", handleNext);
        });
        showPage(0);
      });
      const handleResize = () => {
        const activePanel = panels.find((panel) => !panel.hidden);
        activePanel?.querySelectorAll<HTMLElement>("[data-theory-reader]").forEach(alignReaderPage);
      };
      window.addEventListener("resize", handleResize);
      cleanup.push(() => window.removeEventListener("resize", handleResize));
      select("objectives");
    });

    const basicsTabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-unit-one-basics-tab]"));
    const basicsPanels = Array.from(root.querySelectorAll<HTMLElement>("[data-unit-one-basics-panel]"));
    const selectBasicsTab = (tabName: string) => {
      basicsTabs.forEach((tab) => {
        const selected = tab.dataset.unitOneBasicsTab === tabName;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      basicsPanels.forEach((panel) => {
        panel.hidden = panel.dataset.unitOneBasicsPanel !== tabName;
      });
    };

    basicsTabs.forEach((tab, index) => {
      const handleClick = () => selectBasicsTab(tab.dataset.unitOneBasicsTab || "definition");
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!basicsTabs.length) return;
        const movement = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? basicsTabs.length - 1 : (index + movement + basicsTabs.length) % basicsTabs.length;
        if (!movement && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        const nextTab = basicsTabs[nextIndex];
        selectBasicsTab(nextTab.dataset.unitOneBasicsTab || "definition");
        nextTab.focus();
      };
      tab.addEventListener("click", handleClick);
      tab.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => {
        tab.removeEventListener("click", handleClick);
        tab.removeEventListener("keydown", handleKeyDown);
      });
    });
    if (basicsTabs.length) selectBasicsTab("definition");

    type MiniGenre = { title: string; summary: string; image: string; first: [string, string]; second: [string, string] };
    const miniGenreData: Record<string, MiniGenre> = {
      adventures: { title: "Adventures", summary: "Stories of exploration, journeys, risk, and discovery.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/adventures.png", first: ["Treasure Island", "Robert Louis Stevenson"], second: ["Robinson Crusoe", "Daniel Defoe"] },
      "science-fiction": { title: "Science fiction", summary: "Stories that imagine science, technology, and possible futures.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/science-fiction.png", first: ["The Time Machine", "H. G. Wells"], second: ["The Three-Body Problem", "Liu Cixin"] },
      romance: { title: "Romance", summary: "Stories that explore love, relationships, and emotional connection.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/romance.png", first: ["Jane Eyre", "Charlotte Brontë"], second: ["Pride and Prejudice", "Jane Austen"] },
      fantasies: { title: "Fantasies", summary: "Stories shaped by magic, imagined worlds, and extraordinary quests.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/fantasies.png", first: ["The Hobbit", "J. R. R. Tolkien"], second: ["Harry Potter and the Sorcerer’s Stone", "J. K. Rowling"] },
      multicultural: { title: "Multicultural Narratives", summary: "Stories that bring different cultures, identities, and traditions into view.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/multicultural.png", first: ["The Joy Luck Club", "Amy Tan"], second: ["Things Fall Apart", "Chinua Achebe"] },
      "animal-stories": { title: "Animal stories", summary: "Stories where animals guide the action, perspective, or emotional journey.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/animal-stories.png", first: ["Black Beauty", "Anna Sewell"], second: ["Charlotte’s Web", "E. B. White"] },
      historical: { title: "Historical Narratives", summary: "Stories set in or shaped by moments from the past.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/historical.png", first: ["A Tale of Two Cities", "Charles Dickens"], second: ["War and Peace", "Leo Tolstoy"] },
      folklore: { title: "Folklore", summary: "Traditional stories and cultural expressions passed through generations.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/folklore-fairy-tales.png", first: ["Rapunzel", "Brothers Grimm"], second: ["Cinderella", "Charles Perrault"] },
      fables: { title: "Fables", summary: "Short stories, often with animals, that offer a lesson or moral.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/fables.png", first: ["Aesop’s Fables", "Aesop"], second: ["The Hare and the Tortoise", "Aesop"] },
      humorous: { title: "Humorous Narratives", summary: "Stories that use wit, surprise, and amusing situations to entertain.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/humorous.png", first: ["The Adventures of Huckleberry Finn", "Mark Twain"], second: ["The Adventures of Tom Sawyer", "Mark Twain"] },
      mysteries: { title: "Mysteries", summary: "Stories driven by questions, clues, and the search for an answer.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/mysteries.png", first: ["Sherlock Holmes", "Arthur Conan Doyle"], second: ["Murder on the Orient Express", "Agatha Christie"] },
      biographies: { title: "Biographies / Autobiographies", summary: "Narratives about a person’s life, written by another person or by themselves.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/biographies.png", first: ["Steve Jobs", "Walter Isaacson"], second: ["The Story of My Life", "Helen Keller"] },
      realistic: { title: "Realistic Narratives", summary: "Stories grounded in believable characters, settings, and everyday conflicts.", image: "https://assets.negentropylearning.com.cn/narrative-writing/assets/mini-genres/realistic.png", first: ["The Catcher in the Rye", "J. D. Salinger"], second: ["Little Men", "Louisa May Alcott"] },
    };
    const miniGenreButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-mini-genre]"));
    const miniGenreStage = root.querySelector<HTMLElement>("[data-mini-genre-stage]");
    const miniGenreTitle = root.querySelector<HTMLElement>("[data-mini-genre-title]");
    const miniGenreSummary = root.querySelector<HTMLElement>("[data-mini-genre-summary]");
    const miniGenreMedia = root.querySelector<HTMLElement>("[data-mini-genre-media]");
    const miniGenreImage = root.querySelector<HTMLImageElement>("[data-mini-genre-image]");
    const miniGenreBookTitles = Array.from(root.querySelectorAll<HTMLElement>("[data-mini-genre-book-title]"));
    const miniGenreBookAuthors = Array.from(root.querySelectorAll<HTMLElement>("[data-mini-genre-book-author]"));
    const folklorePages = root.querySelector<HTMLElement>("[data-mini-genre-folklore-pages]");
    const selectMiniGenre = (genreKey: string) => {
      const genre = miniGenreData[genreKey] || miniGenreData.adventures;
      miniGenreButtons.forEach((button) => {
        const selected = button.dataset.miniGenre === genreKey;
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      if (miniGenreStage) miniGenreStage.dataset.miniGenreStage = genreKey;
      if (miniGenreTitle) miniGenreTitle.textContent = genre.title;
      if (miniGenreSummary) miniGenreSummary.textContent = genre.summary;
      const books = [genre.first, genre.second];
      if (miniGenreImage && genre.image) { miniGenreImage.src = genre.image; miniGenreImage.alt = `${books[0][0]} and ${books[1][0]} covers`; }
      miniGenreBookTitles.forEach((title, index) => { title.textContent = books[index][0]; });
      miniGenreBookAuthors.forEach((author, index) => { author.textContent = books[index][1]; });
      if (miniGenreMedia) miniGenreMedia.hidden = !genre.image;
      if (folklorePages) folklorePages.hidden = genreKey !== "folklore";
    };
    miniGenreButtons.forEach((button, index) => {
      const handleClick = () => selectMiniGenre(button.dataset.miniGenre || "adventures");
      const handleKeyDown = (event: KeyboardEvent) => {
        const movement = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
        const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? miniGenreButtons.length - 1 : (index + movement + miniGenreButtons.length) % miniGenreButtons.length;
        if (!movement && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        const nextButton = miniGenreButtons[nextIndex];
        selectMiniGenre(nextButton.dataset.miniGenre || "adventures");
        nextButton.focus();
      };
      button.addEventListener("click", handleClick);
      button.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => { button.removeEventListener("click", handleClick); button.removeEventListener("keydown", handleKeyDown); });
    });
    if (miniGenreButtons.length) selectMiniGenre("adventures");

    type NarrativeElement = { number: string; title: string; description: string };
    const narrativeElementData: Record<string, NarrativeElement> = {
      characterization: { number: "01", title: "Characterization", description: "Notice what characters say, do, think, and how they change." },
      setting: { number: "02", title: "Setting", description: "Track the time, place, and conditions that shape the story world." },
      plot: { number: "03", title: "Plot", description: "Follow how connected events build tension, change, and resolution." },
      "point-of-view": { number: "04", title: "Point of View", description: "Consider whose perspective guides what the reader knows and feels." },
      theme: { number: "05", title: "Theme", description: "Look for the larger idea about life, people, or values that the story explores." },
    };
    const narrativeElementButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-unit-one-element]"));
    const narrativeElementStage = root.querySelector<HTMLElement>(".unit-one-element-stage");
    const narrativeElementNumber = root.querySelector<HTMLElement>("[data-unit-one-element-number]");
    const narrativeElementTitle = root.querySelector<HTMLElement>("[data-unit-one-element-title]");
    const narrativeElementDescription = root.querySelector<HTMLElement>("[data-unit-one-element-description]");
    const narrativeElementDetails = Array.from(root.querySelectorAll<HTMLElement>("[data-unit-one-element-detail]"));
    const selectNarrativeElement = (elementKey: string) => {
      const element = narrativeElementData[elementKey] || narrativeElementData.characterization;
      narrativeElementButtons.forEach((button) => {
        const selected = button.dataset.unitOneElement === elementKey;
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      if (narrativeElementStage) narrativeElementStage.dataset.unitOneElementStage = elementKey;
      if (narrativeElementNumber) narrativeElementNumber.textContent = element.number;
      if (narrativeElementTitle) narrativeElementTitle.textContent = element.title;
      if (narrativeElementDescription) narrativeElementDescription.textContent = element.description;
      narrativeElementDetails.forEach((detail) => { detail.hidden = detail.dataset.unitOneElementDetail !== elementKey; });
    };
    narrativeElementButtons.forEach((button, index) => {
      const handleClick = () => selectNarrativeElement(button.dataset.unitOneElement || "characterization");
      const handleKeyDown = (event: KeyboardEvent) => {
        const movement = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
        const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? narrativeElementButtons.length - 1 : (index + movement + narrativeElementButtons.length) % narrativeElementButtons.length;
        if (!movement && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        const nextButton = narrativeElementButtons[nextIndex];
        selectNarrativeElement(nextButton.dataset.unitOneElement || "characterization");
        nextButton.focus();
      };
      button.addEventListener("click", handleClick);
      button.addEventListener("keydown", handleKeyDown);
      cleanup.push(() => { button.removeEventListener("click", handleClick); button.removeEventListener("keydown", handleKeyDown); });
    });
    if (narrativeElementButtons.length) selectNarrativeElement("characterization");

    const handlePopState = () => {
      const hash = window.location.hash;
      const nextView = routeForHash(hash) || "cover";
      const focusId = nextView === "reading" && hash.toLowerCase().startsWith("#reading-") ? hash.slice(1) : null;
      showView(nextView, { historyMode: "none", focusId });
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    cleanup.push(() => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    });

    const lightbox = root.querySelector<HTMLElement>(".lightbox");
    const lightboxImage = lightbox?.querySelector<HTMLImageElement>("img");
    const lightboxTitle = lightbox?.querySelector<HTMLElement>("h2");
    const lightboxAuthor = lightbox?.querySelector<HTMLElement>("p");
    const lightboxClose = lightbox?.querySelector<HTMLButtonElement>(".lightbox-close");
    let lastFocusedCard: HTMLButtonElement | null = null;

    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      lastFocusedCard?.focus({ preventScroll: true });
    };

    root.querySelectorAll<HTMLButtonElement>("button.reading-card").forEach((card) => {
      const openLightbox = () => {
        if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxAuthor) return;
        lastFocusedCard = card;
        lightboxImage.src = toMediaUrl(`/narrative-writing/assets/${card.dataset.image || ""}`);
        lightboxImage.alt = card.dataset.title || "";
        lightboxTitle.textContent = card.dataset.title || "";
        lightboxAuthor.textContent = card.dataset.author || "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        lightboxClose?.focus();
      };
      card.addEventListener("click", openLightbox);
      cleanup.push(() => card.removeEventListener("click", openLightbox));
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
      cleanup.push(() => lightboxClose.removeEventListener("click", closeLightbox));
    }
    if (lightbox) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target === lightbox) closeLightbox();
      };
      lightbox.addEventListener("click", handleBackdropClick);
      cleanup.push(() => lightbox.removeEventListener("click", handleBackdropClick));
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && lightbox?.classList.contains("open")) closeLightbox();
    };
    document.addEventListener("keydown", handleEscape);
    cleanup.push(() => document.removeEventListener("keydown", handleEscape));

    const initialHash = window.location.hash;
    const initialView = routeForHash(initialHash) || "cover";
    showView(initialView, {
      historyMode: "none",
      focusId: initialView === "reading" && initialHash.toLowerCase().startsWith("#reading-") ? initialHash.slice(1) : null,
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bookImages = Array.from(root.querySelectorAll<HTMLImageElement>(".cover-book img"));

    root.querySelectorAll<HTMLElement>(".cover-book").forEach((book) => {
      const image = book.querySelector<HTMLImageElement>("img");
      if (!image) return;
      let lastPluck = -Infinity;
      let lastX = 0;
      let lastY = 0;

      const pluck = (event: PointerEvent, entering = false) => {
        if (event.pointerType === "touch" || reducedMotion.matches || typeof image.animate !== "function") return;
        const now = performance.now();
        const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
        if (now - lastPluck < 420 || (!entering && distance < 12)) return;
        lastPluck = now;
        lastX = event.clientX;
        lastY = event.clientY;
        image.getAnimations().forEach((animation) => animation.cancel());
        image.animate(
          [
            { transform: "translateY(0)", offset: 0 },
            { transform: "translateY(calc(-1 * var(--book-lift)))", offset: 0.22 },
            { transform: "translateY(calc(-0.12 * var(--book-lift)))", offset: 0.55 },
            { transform: "translateY(calc(-0.3 * var(--book-lift)))", offset: 0.73 },
            { transform: "translateY(0)", offset: 1 },
          ],
          { duration: 540, easing: "cubic-bezier(.22,.61,.36,1)" },
        );
      };
      const handlePointerEnter = (event: PointerEvent) => pluck(event, true);
      const handlePointerMove = (event: PointerEvent) => pluck(event);
      book.addEventListener("pointerenter", handlePointerEnter);
      book.addEventListener("pointermove", handlePointerMove);
      cleanup.push(() => {
        book.removeEventListener("pointerenter", handlePointerEnter);
        book.removeEventListener("pointermove", handlePointerMove);
      });
    });

    const stopBookAnimations = () => {
      if (reducedMotion.matches) {
        bookImages.forEach((image) => image.getAnimations().forEach((animation) => animation.cancel()));
      }
    };
    reducedMotion.addEventListener("change", stopBookAnimations);
    cleanup.push(() => reducedMotion.removeEventListener("change", stopBookAnimations));

    const interactiveCoverTitle = root.querySelector<HTMLElement>("[data-interactive-title]");
    if (interactiveCoverTitle) {
      const titleText = interactiveCoverTitle.dataset.interactiveTitle?.trim() || interactiveCoverTitle.textContent?.trim() || "";
      const titleFragment = document.createDocumentFragment();
      const titleReturnTimers = new WeakMap<HTMLElement, number>();
      let flowerIndex = 0;
      let activeTitleLetter: HTMLElement | null = null;

      interactiveCoverTitle.setAttribute("aria-label", titleText);
      interactiveCoverTitle.textContent = "";

      for (const character of titleText) {
        if (/\s/.test(character)) {
          titleFragment.append(document.createTextNode(character));
          continue;
        }

        const letter = document.createElement("span");
        const glyph = document.createElement("span");
        const sticker = document.createElement("img");
        const imageFile = flowerStickerFiles[flowerIndex];
        const isUppercase = character === character.toUpperCase() && character !== character.toLowerCase();
        const stickerHeight = isUppercase ? "1.04em" : tallLowercase.has(character) ? "0.98em" : "0.76em";
        const stickerBottom = isUppercase || tallLowercase.has(character) ? "-0.02em" : "0.045em";

        letter.className = "cover-letter";
        letter.dataset.titleIndex = String(flowerIndex);
        letter.style.setProperty("--flower-angle", `${flowerAngles[flowerIndex] || 0}deg`);
        letter.style.setProperty("--sticker-height", stickerHeight);
        letter.style.setProperty("--sticker-bottom", stickerBottom);
        glyph.className = "cover-letter-glyph";
        glyph.textContent = character;
        sticker.className = "cover-letter-sticker";
        sticker.src = toMediaUrl(`/narrative-writing/assets/flower-letter-stickers/${imageFile}`);
        sticker.alt = "";
        sticker.setAttribute("aria-hidden", "true");
        sticker.decoding = "async";
        sticker.draggable = false;
        letter.append(glyph, sticker);
        titleFragment.append(letter);
        flowerIndex += 1;
      }

      interactiveCoverTitle.append(titleFragment);

      const clearTitleReturn = (letter: HTMLElement) => clearLater(titleReturnTimers.get(letter));
      const bloomTitleLetter = (letter: HTMLElement | null) => {
        if (reducedMotion.matches || !letter) return;
        clearTitleReturn(letter);
        letter.classList.remove("is-returning", "is-blooming");
        void letter.offsetWidth;
        letter.classList.add("is-blooming");
      };
      const returnTitleLetter = (letter: HTMLElement | null, delay = 0) => {
        if (!letter) return;
        clearTitleReturn(letter);
        const timer = later(() => {
          letter.classList.remove("is-blooming");
          void letter.offsetWidth;
          letter.classList.add("is-returning");
          later(() => letter.classList.remove("is-returning"), 390);
        }, delay);
        titleReturnTimers.set(letter, timer);
      };
      const selectTitleLetter = (letter: HTMLElement | null) => {
        if (reducedMotion.matches || !letter || letter === activeTitleLetter) return;
        const previousLetter = activeTitleLetter;
        activeTitleLetter = letter;
        if (previousLetter) returnTitleLetter(previousLetter, 130);
        bloomTitleLetter(letter);
      };

      const handleTitlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".cover-letter") : null;
        if (!target || !interactiveCoverTitle.contains(target)) {
          const previousLetter = activeTitleLetter;
          activeTitleLetter = null;
          returnTitleLetter(previousLetter, 120);
          return;
        }
        selectTitleLetter(target);
      };
      const handleTitlePointerLeave = () => {
        const previousLetter = activeTitleLetter;
        activeTitleLetter = null;
        returnTitleLetter(previousLetter, 150);
      };
      const handleTitlePointerDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse") return;
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".cover-letter") : null;
        if (!target || !interactiveCoverTitle.contains(target)) return;
        event.preventDefault();
        selectTitleLetter(target);
      };
      const handleReducedMotionChange = () => {
        if (!reducedMotion.matches) return;
        activeTitleLetter = null;
        interactiveCoverTitle.querySelectorAll<HTMLElement>(".cover-letter").forEach((letter) => {
          clearTitleReturn(letter);
          letter.classList.remove("is-blooming", "is-returning");
        });
      };

      interactiveCoverTitle.addEventListener("pointermove", handleTitlePointerMove);
      interactiveCoverTitle.addEventListener("pointerleave", handleTitlePointerLeave);
      interactiveCoverTitle.addEventListener("pointerdown", handleTitlePointerDown);
      reducedMotion.addEventListener("change", handleReducedMotionChange);
      cleanup.push(() => {
        interactiveCoverTitle.removeEventListener("pointermove", handleTitlePointerMove);
        interactiveCoverTitle.removeEventListener("pointerleave", handleTitlePointerLeave);
        interactiveCoverTitle.removeEventListener("pointerdown", handleTitlePointerDown);
        reducedMotion.removeEventListener("change", handleReducedMotionChange);
      });
    }

    return () => {
      cleanup.forEach((dispose) => dispose());
      timers.forEach((timer) => window.clearTimeout(timer));
      bookImages.forEach((image) => image.getAnimations().forEach((animation) => animation.cancel()));
    };
  }, []);

  useEffect(() => {
    const readingDetailId = route.view.startsWith("reading-")
      ? `#reading-detail-${route.view.slice("reading-".length)}`
      : null;
    if (!readingDetailId) return;
    const article = rootRef.current?.querySelector<HTMLElement>(`${readingDetailId} .reading-full-text`);
    const body = article?.querySelector<HTMLElement>(".reading-full-text-body");
    if (!article || !body) return;

    const notes = Array.from(article.querySelectorAll<HTMLDetailsElement>(".reading-analysis-note"));
    if (notes.length === 0) return;
    const anchors = new Map<HTMLDetailsElement, HTMLParagraphElement>();
    const paragraphs = Array.from(body.querySelectorAll<HTMLParagraphElement>("p:not(.reading-full-text-divider)"));
    for (const note of notes) {
      const savedIndex = Number(note.dataset.noteAnchorIndex);
      let next = note.nextElementSibling;
      while (next?.matches("details.reading-analysis-note")) next = next.nextElementSibling;
      const anchor = note.dataset.noteAnchorIndex !== undefined && Number.isInteger(savedIndex)
        ? paragraphs.find((paragraph) => Number(paragraph.dataset.readingParagraphIndex) === savedIndex)
        : next instanceof HTMLParagraphElement
          ? next
          : paragraphs[0];
      if (anchor) {
        note.dataset.noteAnchorIndex = anchor.dataset.readingParagraphIndex ?? String(paragraphs.indexOf(anchor));
        anchors.set(note, anchor);
      }
    }
    const connector = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    connector.classList.add("reading-analysis-connectors");
    connector.setAttribute("aria-hidden", "true");
    connector.setAttribute("preserveAspectRatio", "none");
    article.prepend(connector);

    let frame = 0;
    let settleFrame = 0;
    const arrange = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const desktop = window.matchMedia("(min-width: 821px)").matches;
        const mobileInsertions = new Map<HTMLParagraphElement, Element>();
        for (const [note, anchor] of anchors) {
          if (desktop) anchor.parentElement?.insertBefore(note, anchor);
          else {
            const previous = mobileInsertions.get(anchor) ?? anchor;
            previous.insertAdjacentElement("afterend", note);
            mobileInsertions.set(anchor, note);
          }
        }

        if (!desktop) {
          article.classList.remove("reading-notes-rail-ready");
          connector.replaceChildren();
          body.style.removeProperty("padding-bottom");
          return;
        }

        article.classList.add("reading-notes-rail-ready");
        const articleRect = article.getBoundingClientRect();
        const bodyRect = body.getBoundingClientRect();
        const gap = 18;
        let previousBottom = 0;
        let lastBottom = 0;
        const positions = new Map<HTMLDetailsElement, { top: number; anchor: HTMLParagraphElement }>();

        for (const note of notes) {
          const anchor = anchors.get(note);
          if (!anchor) continue;
          const wantedTop = Math.max(0, anchor.getBoundingClientRect().top - articleRect.top);
          const top = Math.max(wantedTop, previousBottom ? previousBottom + gap : 0);
          note.style.top = `${top}px`;
          const height = note.getBoundingClientRect().height;
          previousBottom = top + height;
          lastBottom = Math.max(lastBottom, previousBottom);
          positions.set(note, { top, anchor });
        }

        const currentPadding = Number.parseFloat(body.style.paddingBottom) || 0;
        const naturalBodyBottom = bodyRect.bottom - articleRect.top - currentPadding;
        const railExtra = Math.max(0, lastBottom - naturalBodyBottom) + 24;
        body.style.paddingBottom = `${railExtra}px`;
        const width = article.scrollWidth;
        const height = Math.max(article.scrollHeight, lastBottom + 24);
        connector.setAttribute("viewBox", `0 0 ${width} ${height}`);
        connector.setAttribute("width", String(width));
        connector.setAttribute("height", String(height));
        connector.replaceChildren();

        for (const [note, placement] of positions) {
          const paragraphRect = placement.anchor.getBoundingClientRect();
          const noteRect = note.getBoundingClientRect();
          const startX = paragraphRect.right - articleRect.left;
          const startY = paragraphRect.top - articleRect.top + Math.min(20, paragraphRect.height / 2);
          const endX = noteRect.left - articleRect.left;
          const endY = placement.top + noteRect.height / 2;
          const bendX = Math.max(startX + 8, endX - 12);
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", `M ${startX} ${startY} H ${bendX} V ${endY} H ${endX}`);
          path.setAttribute("class", "reading-analysis-connector-line");
          connector.append(path);
          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", String(startX));
          dot.setAttribute("cy", String(startY));
          dot.setAttribute("r", "2.5");
          dot.setAttribute("class", "reading-analysis-connector-dot");
          connector.append(dot);
        }
      });
    };

    const handleToggle = () => {
      arrange();
      cancelAnimationFrame(settleFrame);
      settleFrame = requestAnimationFrame(arrange);
    };
    notes.forEach((note) => note.addEventListener("toggle", handleToggle));
    const resizeObserver = new ResizeObserver(arrange);
    // Observe card size changes only. Watching the article/body here would observe
    // the padding and connector size that arrange() itself writes, causing a loop.
    notes.forEach((note) => resizeObserver.observe(note));
    window.addEventListener("resize", arrange);
    arrange();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settleFrame);
      window.removeEventListener("resize", arrange);
      notes.forEach((note) => note.removeEventListener("toggle", handleToggle));
      resizeObserver.disconnect();
      connector.remove();
      notes.forEach((note) => note.style.removeProperty("top"));
      body.style.removeProperty("padding-bottom");
      article.classList.remove("reading-notes-rail-ready");
    };
  }, [route.view]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stopQuotes = initUnitThreeQuotes(root);
    const stopArtwork = initUnitTheoryArt(root);
    return () => { stopQuotes(); stopArtwork(); };
  }, []);

  const returnHome = () => {
    const base = `${window.location.pathname}${window.location.search}`;
    window.history.pushState({ section: "home" }, "", base);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    onHome();
  };

  const unitMatch = /^unit-(one|two|three|four|five|six)(?:-knowledge)?$/.exec(route.view);
  const activeUnit = unitMatch ? ["one", "two", "three", "four", "five", "six"].indexOf(unitMatch[1]) + 1 : null;
  const navigateFromDeck = (hash: string) => {
    const view = routeForHash(hash);
    if (!view) return;
    window.history.pushState({ narrativeView: view }, "", `${window.location.pathname}${window.location.search}${hash}`);
    setRoute(current => ({ view, focusId: null, revision: current.revision + 1 }));
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const setNarrativeRoot = useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
    setCharacterSlot(node?.querySelector<HTMLElement>("#character-reference-slot") ?? null);
    setSettingSlot(node?.querySelector<HTMLElement>("#setting-reference-slot") ?? null);
    setStorybookSlot(node?.querySelector<HTMLElement>("#storybook-slot") ?? null);
    setHomeSlot(node?.querySelector<HTMLElement>("#narrative-home-slot") ?? null);
    setHomeActionSlot(node?.querySelector<HTMLElement>("#narrative-home-action-slot") ?? null);
  }, []);

  return (
    <div
      ref={setNarrativeRoot}
      className={`narrative-course${route.view === "cover" ? " home-active" : ""}`}
      data-narrative-view={route.view}
      data-unit-deck-active={activeUnit ? "true" : undefined}
      data-editable-skip
    >
      <NarrativeMarkup />
      {activeUnit ? <UnitDeckViewer key={activeUnit} unit={activeUnit} onNavigate={navigateFromDeck} /> : <UniversityFooter />}
      {characterSlot ? createPortal(<CharacterReference />, characterSlot) : null}
      {settingSlot ? createPortal(<SettingReference />, settingSlot) : null}
      {storybookSlot ? createPortal(<StoryBook />, storybookSlot) : null}
      {homeSlot ? createPortal(<a className="narrative-site-brand" href="/" aria-label="NegentropyLearning home"><img src="https://assets.negentropylearning.com.cn/media/brand/fat-cat-wordmark.png" alt="" /><span>NegentropyLearning</span></a>, homeSlot) : null}
      {homeActionSlot ? createPortal(<button className="narrative-home-button" type="button" onClick={returnHome} aria-label="Return to Learning with Rachel home">Home</button>, homeActionSlot) : null}
    </div>
  );
}
