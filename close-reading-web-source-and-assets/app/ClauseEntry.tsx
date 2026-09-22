export function ClauseEntry({ onOpen, disabled = false, controls }: { onOpen: () => void; disabled?: boolean; controls?: string }) {
  return <button type="button" className="clause-entry" onClick={onOpen} tabIndex={disabled ? -1 : 0} aria-expanded={false} aria-controls={controls}>
    <span className="clause-entry-heading"><span className="clause-entry-kicker">STRUCTURE NOTES · 句法手记</span><span className="clause-entry-title">CLAUSE ARCHITECTURE</span><span className="clause-entry-subtitle">Main and Subordinate Units</span></span>
    <svg className="clause-entry-diagram" viewBox="0 0 144 90" fill="none" aria-hidden="true"><path d="M72 26v19M28 63V45h88v18" stroke="currentColor" strokeWidth="1.5"/><rect x="43" y="8" width="58" height="20" rx="3" fill="#eedbcf" stroke="#a86a51"/><rect x="8" y="63" width="40" height="18" rx="3" fill="#dce8df" stroke="#648575"/><rect x="96" y="63" width="40" height="18" rx="3" fill="#e6e0ed" stroke="#8c7c9b"/></svg>
    <span className="clause-entry-footer"><span>从主句开始，读懂每一层关系</span><span className="clause-entry-action">View clause analysis <span aria-hidden="true">↗</span></span></span>
  </button>;
}
