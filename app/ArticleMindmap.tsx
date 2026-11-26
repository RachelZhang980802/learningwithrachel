"use client";

import { useEffect, useRef, useState } from "react";

/** Isolated mindmap surface. Article vocabulary, audio and analysis stay in their own modules. */
export function ArticleMindmap({ articleId, title }: { articleId: string; title: string }) {
  const isRobotMap = articleId === "02";
  const revision = isRobotMap ? "article02-source-map" : "article02-evaluation-v2";
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
    key={`${articleId}-${revision}`}
    className={isRobotMap ? "robot-map-frame" : undefined}
    src={`/mindmaps/index.html?article=${encodeURIComponent(articleId)}&rev=${revision}`}
    title={`Mindmap — ${title}`}
    allow="fullscreen"
    style={{ display: "block", width: "100%", height: isRobotMap ? 0 : worksheetHeight ?? "calc(100dvh - 64px)", minHeight: isRobotMap || worksheetHeight !== null ? 0 : 560, border: 0, background: "#eef1f3" }}
  />;
}
