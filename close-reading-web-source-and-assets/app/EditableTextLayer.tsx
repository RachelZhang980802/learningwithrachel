"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const EDITS_KEY = "close-reading-text-edits-v1";
const NOTES_KEY = "close-reading-user-notes-v1";

type StoredEdits = Record<string, string>;

type TextTarget = {
  key: string;
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
  node: HTMLElement;
};

type OriginalText = { node: HTMLElement; text: string };

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing and storage-restricted contexts can reject localStorage.
  }
}

function directText(node: HTMLElement) {
  return Array.from(node.childNodes)
    .filter((child) => child.nodeType === Node.TEXT_NODE)
    .map((child) => child.textContent ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function setDirectText(node: HTMLElement, value: string) {
  const textNodes = Array.from(node.childNodes).filter((child) => child.nodeType === Node.TEXT_NODE) as Text[];
  if (textNodes.length) {
    textNodes[0].data = value;
    textNodes.slice(1).forEach((textNode) => { textNode.data = ""; });
  } else {
    node.textContent = value;
  }
}

function domPath(node: HTMLElement, root: HTMLElement) {
  const parts: string[] = [];
  let current: HTMLElement | null = node;
  while (current && current !== root) {
    let sibling = current.previousElementSibling;
    let index = 0;
    while (sibling) {
      index += 1;
      sibling = sibling.previousElementSibling;
    }
    parts.unshift(`${current.tagName.toLowerCase()}${index}`);
    current = current.parentElement;
  }
  const scope = root.firstElementChild?.className || "page";
  const sentence = node.closest<HTMLElement>("[data-sentence-id]")?.dataset.sentenceId || "";
  return `${scope}|${sentence}|${parts.join("/")}`;
}

function isVisible(node: HTMLElement) {
  if (node.closest("[data-editable-ui], [hidden], [aria-hidden='true']")) return false;
  const style = window.getComputedStyle(node);
  if (style.display === "none" || style.visibility === "hidden") return false;
  const rect = node.getBoundingClientRect();
  return rect.width > 2 && rect.height > 2;
}

export function EditableTextLayer({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const editsRef = useRef<StoredEdits>({});
  const originalsRef = useRef<Record<string, OriginalText>>({});
  const [editing, setEditing] = useState(false);
  const [targets, setTargets] = useState<TextTarget[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [edits, setEdits] = useState<StoredEdits>({});
  const [notes, setNotes] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const scan = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    const next: TextTarget[] = [];
    root.querySelectorAll<HTMLElement>("*").forEach((node) => {
      if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION"].includes(node.tagName)) return;
      const text = directText(node);
      if (!text || text.length > 2400 || !isVisible(node)) return;
      const key = domPath(node, root);
      const remembered = originalsRef.current[key];
      if (!remembered || remembered.node !== node) originalsRef.current[key] = { node, text };
      else if (editsRef.current[key] === undefined && remembered.text !== text) remembered.text = text;
      const original = originalsRef.current[key].text;
      const override = editsRef.current[key];
      if (override !== undefined && directText(node) !== override) setDirectText(node, override);
      if (override === undefined && directText(node) !== original) setDirectText(node, original);
      const rect = node.getBoundingClientRect();
      next.push({
        key,
        text: override ?? original,
        left: rect.left - rootRect.left,
        top: rect.top - rootRect.top,
        width: rect.width,
        height: rect.height,
        node,
      });
    });
    setTargets((previous) => {
      if (previous.length === next.length && previous.every((item, index) => {
        const candidate = next[index];
        return item.key === candidate.key && item.text === candidate.text && Math.abs(item.left - candidate.left) < 0.5 && Math.abs(item.top - candidate.top) < 0.5;
      })) return previous;
      return next;
    });
  }, []);

  useEffect(() => {
    const savedEdits = readStored<StoredEdits>(EDITS_KEY, {});
    const savedNotes = readStored<string[]>(NOTES_KEY, []);
    editsRef.current = savedEdits;
    setEdits(savedEdits);
    setNotes(Array.isArray(savedNotes) ? savedNotes : []);
    scan();
  }, [scan]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const scheduleScan = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(scan);
    };
    const observer = new MutationObserver(scheduleScan);
    observer.observe(root, { childList: true, characterData: true, subtree: true });
    window.addEventListener("resize", scheduleScan);
    window.addEventListener("scroll", scheduleScan, true);
    scheduleScan();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleScan);
      window.removeEventListener("scroll", scheduleScan, true);
    };
  }, [scan]);

  const activeTarget = useMemo(() => targets.find((target) => target.key === activeKey), [activeKey, targets]);

  useEffect(() => {
    setDraft(activeTarget?.text ?? "");
  }, [activeTarget]);

  const commitEdit = useCallback((target: TextTarget, value: string) => {
    const next = { ...editsRef.current, [target.key]: value };
    editsRef.current = next;
    setEdits(next);
    writeStored(EDITS_KEY, next);
    if (target.node.isConnected) setDirectText(target.node, value);
    setSaving(false);
    window.requestAnimationFrame(scan);
  }, [scan]);

  useEffect(() => {
    if (!activeTarget || !draft.trim() || draft.trim() === activeTarget.text) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = window.setTimeout(() => commitEdit(activeTarget, draft.trim()), 350);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [activeTarget, commitEdit, draft]);

  const saveEdit = () => {
    if (!activeTarget) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    const value = draft.trim();
    if (!value) return;
    commitEdit(activeTarget, value);
    setActiveKey(null);
  };

  const resetEdits = () => {
    Object.keys(editsRef.current).forEach((key) => {
      const target = targets.find((item) => item.key === key);
      const original = originalsRef.current[key];
      if (target?.node.isConnected && original) setDirectText(target.node, original.text);
    });
    editsRef.current = {};
    setEdits({});
    writeStored(EDITS_KEY, {});
    setActiveKey(null);
    window.requestAnimationFrame(scan);
  };

  const saveNote = () => {
    const value = noteDraft.trim();
    if (!value) return;
    const next = [...notes, value];
    setNotes(next);
    writeStored(NOTES_KEY, next);
    setNoteDraft("");
    setAddOpen(false);
  };

  const removeNote = (index: number) => {
    const next = notes.filter((_, noteIndex) => noteIndex !== index);
    setNotes(next);
    writeStored(NOTES_KEY, next);
  };

  return (
    <div ref={rootRef} className="editable-site-shell">
      {children}

      {editing && <div className="editable-target-layer" data-editable-ui>
        {targets.map((target) => (
          <button
            key={target.key}
            className="editable-target-button"
            style={{ left: Math.max(0, target.left + target.width - 12), top: Math.max(4, target.top - 11) }}
            type="button"
            aria-label={`Edit text: ${target.text.slice(0, 80)}`}
            onClick={(event) => { event.stopPropagation(); setActiveKey(target.key); }}
          >✎</button>
        ))}
      </div>}

      <div className="editable-toolbar" data-editable-ui>
        <button type="button" className={editing ? "is-active" : ""} onClick={() => { setEditing((value) => !value); setActiveKey(null); }}>
          {editing ? "Done" : "Edit text"}
        </button>
        {editing && <button type="button" onClick={() => { setAddOpen(true); setActiveKey(null); }}>＋ Add text</button>}
        {Object.keys(edits).length > 0 && <button type="button" className="editable-reset" onClick={resetEdits}>Reset saved</button>}
        {(saving || Object.keys(edits).length > 0 || notes.length > 0) && <span role="status">{saving ? "Saving…" : "Saved locally"}</span>}
      </div>

      {activeTarget && <section className="editable-popover" data-editable-ui role="dialog" aria-label="Edit text">
        <header><strong>Edit text</strong><button type="button" aria-label="Close editor" onClick={() => setActiveKey(null)}>×</button></header>
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} autoFocus />
        <footer><button type="button" onClick={() => setActiveKey(null)}>Cancel</button><button type="button" className="is-primary" onClick={saveEdit}>Save</button></footer>
      </section>}

      {addOpen && <section className="editable-popover" data-editable-ui role="dialog" aria-label="Add text">
        <header><strong>Add text</strong><button type="button" aria-label="Close add text" onClick={() => setAddOpen(false)}>×</button></header>
        <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Write a note to keep with this page…" rows={4} autoFocus />
        <footer><button type="button" onClick={() => setAddOpen(false)}>Cancel</button><button type="button" className="is-primary" onClick={saveNote}>Save</button></footer>
      </section>}

      {notes.length > 0 && <aside className="editable-notes-panel" data-editable-ui aria-label="Saved notes">
        <header><strong>My notes</strong><span>{notes.length}</span></header>
        {notes.map((note, index) => <div className="editable-note" key={`${note}-${index}`}><p>{note}</p><button type="button" onClick={() => removeNote(index)} aria-label={`Delete note ${index + 1}`}>×</button></div>)}
      </aside>}
    </div>
  );
}
