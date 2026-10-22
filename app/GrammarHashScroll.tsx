"use client";

import { useEffect } from "react";

export function GrammarHashScroll() {
  useEffect(() => {
    const scrollToChapter = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" })));
    };
    scrollToChapter();
    window.addEventListener("hashchange", scrollToChapter);
    return () => window.removeEventListener("hashchange", scrollToChapter);
  }, []);
  return null;
}
