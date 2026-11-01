"use client";

import { Fragment, useState } from "react";

type InlineClozeQuestionProps = {
  parts: string[];
  answers: string[];
  explanations: string[];
  translation?: string;
};

export function InlineClozeQuestion({ parts, answers, explanations, translation }: InlineClozeQuestionProps) {
  const [opened, setOpened] = useState<boolean[]>(() => answers.map(() => false));

  const toggle = (index: number) => {
    setOpened((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value));
  };

  return <div className="article01-inline-cloze" data-editable-skip="true">
    <p className="article01-inline-cloze-sentence">
      {parts.map((part, index) => <Fragment key={`${part}-${index}`}>
        {part}
        {index < answers.length && <button
          type="button"
          className="article01-inline-blank"
          aria-expanded={opened[index]}
          aria-label={opened[index] ? `第 ${index + 1} 空：答案已显示，再次点击可收起` : `第 ${index + 1} 空：点击显示答案`}
          onClick={() => toggle(index)}
        >
          <span className={opened[index] ? "article01-inline-blank-answer" : "article01-inline-blank-line"}>
            {opened[index] ? answers[index] : "__________"}
          </span>
        </button>}
      </Fragment>)}
    </p>
    {opened.some(Boolean) && <div className="article01-inline-explanations" aria-live="polite">
      {opened.map((isOpen, index) => isOpen && <p key={index}><strong>{answers[index]}</strong> — {explanations[index]}</p>)}
      {translation && <p className="article01-inline-translation" lang="zh-CN">{translation}</p>}
    </div>}
  </div>;
}

export function InlineStoryOrder() {
  const [open, setOpen] = useState(false);
  return <button
    type="button"
    className="article01-story-order"
    aria-expanded={open}
    aria-label={open ? "Hide the plotline order" : "Reveal the plotline order"}
    onClick={() => setOpen((value) => !value)}
  >
    <span className="article01-story-order-label">Plotline:</span>
    <span className={open ? "article01-story-order-answer" : "article01-story-order-line"}>{open ? "D-A-C-B" : "____________________"}</span>
    {open && <span className="article01-story-order-translation" lang="zh-CN">正确顺序为 D—A—C—B。</span>}
  </button>;
}
