import { Fragment } from "react";

/**
 * A conservative visual cue for collocations that learners are likely to meet
 * in ordinary conversation, general writing, or everyday media. Specialist,
 * academic, legal, and historical phrases stay unmarked.
 */
const everydayStarts = /^(?:a\s+(?:large|significant|small|big|certain|new|curious|faint|grim|sacred|bare|clear|mystery|valuable|broad|vast|hideous|trifling|quickening|leading)|an?\s+(?:easy|essential|exclamation|italicized|industrious|important)|be\b|have\b|get\b|go\b|come\b|make\b|take\b|give\b|keep\b|lose\b|look\b|feel\b|think\b|talk\b|call\b|clear\b|solve\b|listen\b|watch\b|read\b|write\b|work\b|study\b|show\b|find\b|use\b|in\b|out\s+of\b|by\s+accident\b|on\b|at\b|to\b|for\b|with\b|the\s+(?:bare\s+minimum|letters\s+of\s+the\s+alphabet|modern\s+era))\b/i;
const everydayPhrases = /^(?:a\s+(?:large|significant)\s+proportion\s+of|methodical\s+(?:study|work)|get\s+around\s+(?:a\s+problem|an\s+obstacle)|think\s+outside\s+the\s+box|be\s+worth\b|be\s+worth\s+doing\b|be\s+worth\s+it\b|hit\s+on\s+(?:an?\s+)?(?:idea|solution|answer)|concentrate\s+on\b|be\s+curious\b|be\s+fascinated\b|clear\s+up\b|cry\s+out\b|disagree\s+with\b|appeal\s+to\b|call\s+on\b|clinch\s+a\s+(?:deal|victory)\b)/i;
const specialistTerms = /\b(?:academic|doctoral|master'?s|bachelor'?s|thesis|dissertation|faculty|university|college|constitutional|memorandum|presidential|napoleonic|ratio|production\s+capacity|language\s+acquisition|methodology|methodological|authority|ruling|common\s+era|factual\s+knowledge|positive\s+knowledge)\b/i;

export function isEverydayCollocation(value: string) {
  const english = value.slice(0, value.search(/[\u3400-\u9fff]/) >= 0 ? value.search(/[\u3400-\u9fff]/) : value.length).trim();
  return !specialistTerms.test(english) && (everydayStarts.test(english) || everydayPhrases.test(english));
}

function splitCollocation(value: string) {
  const chineseStart = value.search(/[\u3400-\u9fff]/);
  if (chineseStart < 0) return { english: value.trim(), chinese: "" };
  return { english: value.slice(0, chineseStart).trim(), chinese: value.slice(chineseStart).trim() };
}

export function CollocationLines({ values }: { values: string[] }) {
  return <div className="collocation-list" aria-label="搭配列表">
    {values.filter(Boolean).map((value, index) => {
      const { english, chinese } = splitCollocation(value);
      const everyday = isEverydayCollocation(value);
      return <div className="collocation-line" key={`${value}-${index}`}>
        <span className={`collocation-phrase${everyday ? " is-everyday" : ""}`} title={everyday ? "日常高频搭配" : undefined}>{english}</span>
        {chinese && <span className="collocation-translation">{chinese}</span>}
      </div>;
    })}
  </div>;
}
