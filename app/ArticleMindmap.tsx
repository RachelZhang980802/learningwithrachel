"use client";

import { useEffect, useRef, useState } from "react";

/** Isolated mindmap surface. Article vocabulary, audio and analysis stay in their own modules. */
export function ArticleMindmap({ articleId, title }: { articleId: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [worksheetHeight, setWorksheetHeight] = useState<number | null>(null);
  useEffect(() => {
    setWorksheetHeight(null);
    const onHeight = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      const data = event.data;
      if (data?.type !== "learning-mindmap-height" || data.articleId !== articleId) return;
      setWorksheetHeight(data.open && Number.isFinite(data.height) ? Math.ceil(data.height) : null);
    };
    window.addEventListener("message", onHeight);
    return () => window.removeEventListener("message", onHeight);
  }, [articleId]);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("open") === "reading" && url.searchParams.get("panel") === "mindmap" && url.searchParams.get("article") !== articleId) {
      url.searchParams.set("article", articleId);
      window.history.replaceState(window.history.state, "", url);
    }
  }, [articleId]);

  return <iframe
    ref={frameRef}
    key={`${articleId}-atlas-10-4`}
    src={`/mindmaps/index.html?article=${encodeURIComponent(articleId)}&rev=atlas-10-4`}
    title={`Mindmap — ${title}`}
    allow="fullscreen"
    style={{ display: "block", width: "100%", height: worksheetHeight ?? "calc(100dvh - 64px)", minHeight: worksheetHeight === null ? 560 : 0, border: 0, background: "#f5f3eb" }}
  />;
}
