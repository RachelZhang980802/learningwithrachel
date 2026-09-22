"use client";

import { type ClipboardEvent, type FormEvent, useRef, useState } from "react";
import { normalizeXiumiSlug, sanitizeXiumiHtml, saveXiumiArticle } from "./xiumiArticleStore";
import "./xiumi-article.css";

export function XiumiArticleImport() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const updateSlugFromTitle = (value: string) => {
    setTitle(value);
    if (!slug) setSlug(normalizeXiumiSlug(value));
  };

  const pasteRichText = (event: ClipboardEvent<HTMLDivElement>) => {
    const sourceHtml = event.clipboardData.getData("text/html");
    if (!sourceHtml) return;

    event.preventDefault();
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    const fragment = range.createContextualFragment(sanitizeXiumiHtml(sourceHtml));
    range.deleteContents();
    range.insertNode(fragment);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const saveArticle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSlug = normalizeXiumiSlug(slug || title);
    const pastedHtml = editorRef.current?.innerHTML || "";
    const html = sanitizeXiumiHtml(pastedHtml);

    if (!title.trim() || !normalizedSlug || !html.trim()) {
      setSavedSlug(null);
      setStatus("Add a title, a valid slug, and pasted Xiumi content before saving.");
      return;
    }

    try {
      saveXiumiArticle({
        title: title.trim(),
        author: author.trim(),
        slug: normalizedSlug,
        coverImage: coverImage.trim(),
        html,
        updatedAt: new Date().toISOString(),
      });
      setSlug(normalizedSlug);
      setSavedSlug(normalizedSlug);
      setStatus("Saved. The reading page is ready.");
    } catch {
      setSavedSlug(null);
      setStatus("This article is too large for browser storage. Use fewer embedded images or host images by URL.");
    }
  };

  return (
    <main className="xiumi-import-page" data-editable-skip>
      <section className="xiumi-import-card" aria-labelledby="xiumi-import-title">
        <p className="xiumi-import-kicker">ADMIN · RICH TEXT IMPORT</p>
        <h1 id="xiumi-import-title">Paste Xiumi Article</h1>
        <p className="xiumi-import-intro">Copy from Xiumi’s <em>Export → Continue with Copy &amp; Paste</em>, then paste the formatted article below. Its HTML and inline styling are kept inside the reading article.</p>

        <form onSubmit={saveArticle} className="xiumi-import-form">
          <div className="xiumi-field-grid">
            <label>Title<input value={title} onChange={(event) => updateSlugFromTitle(event.target.value)} autoComplete="off" required /></label>
            <label>Author<input value={author} onChange={(event) => setAuthor(event.target.value)} autoComplete="off" /></label>
            <label>Slug<input value={slug} onChange={(event) => setSlug(normalizeXiumiSlug(event.target.value))} placeholder="the-necklace" autoComplete="off" required /></label>
            <label>Cover image<input value={coverImage} onChange={(event) => setCoverImage(event.target.value)} type="url" placeholder="https://…" autoComplete="off" /></label>
          </div>

          <label className="xiumi-paste-label">Rich-text paste area
            <div
              ref={editorRef}
              className="xiumi-paste-area"
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              data-placeholder="Paste the complete formatted Xiumi article here…"
              onPaste={pasteRichText}
            />
          </label>

          <div className="xiumi-import-actions">
            <button type="submit">Save article</button>
            {savedSlug && <a href={`/reading/${encodeURIComponent(savedSlug)}`}>Open reading page →</a>}
          </div>
          {status && <p className="xiumi-import-status" role="status">{status}</p>}
        </form>
      </section>
    </main>
  );
}
