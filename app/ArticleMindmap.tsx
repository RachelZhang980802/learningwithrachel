"use client";

import { useEffect } from "react";

/** Isolated mindmap surface. Article vocabulary, audio and analysis stay in their own modules. */
export function ArticleMindmap({ articleId, title }: { articleId: string; title: string }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("open") === "reading" && url.searchParams.get("panel") === "mindmap" && url.searchParams.get("article") !== articleId) {
      url.searchParams.set("article", articleId);
      window.history.replaceState(window.history.state, "", url);
    }
  }, [articleId]);

  return <iframe
    key={`${articleId}-river-10-1`}
    src={`/mindmaps/index.html?article=${encodeURIComponent(articleId)}&rev=river-10-1`}
    title={`Mindmap — ${title}`}
    allow="fullscreen"
    style={{ display: "block", width: "100%", height: "calc(100dvh - 64px)", minHeight: 560, border: 0, background: "#f5f3eb" }}
  />;
}
