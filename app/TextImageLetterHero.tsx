"use client";

import { useMemo, useState } from "react";

const stickerByLetter: Record<string, string> = {
  R: "/text-image-letters/letter-r.png",
  e: "/text-image-letters/letter-e.png",
  a: "/text-image-letters/letter-a.png",
  d: "/text-image-letters/letter-d.png",
  b: "/text-image-letters/letter-b.png",
  t: "/text-image-letters/letter-t.png",
  w: "/text-image-letters/letter-w.png",
  n: "/text-image-letters/letter-n.png",
  h: "/text-image-letters/letter-h.png",
  l: "/text-image-letters/letter-l.png",
  i: "/text-image-letters/letter-i.png",
  s: "/text-image-letters/letter-s.png",
};

type TextImageLetterHeroProps = {
  lines: string[];
  id?: string;
};

export function TextImageLetterHero({ lines, id = "library-title" }: TextImageLetterHeroProps) {
  const [active, setActive] = useState<{ index: number; variant: 0 | 1 } | null>(null);
  const text = useMemo(() => lines.join(" "), [lines]);
  const reveal = (index: number) => {
    setActive({ index, variant: 0 });
  };

  return (
    <h1 id={id} className="text-image-letter-hero" aria-label={text}>
      {lines.map((line, lineIndex) => (
        <span className="text-image-letter-line" key={`${line}-${lineIndex}`}>
          {Array.from(line).map((character, characterIndex) => {
        const index = lineIndex * 100 + characterIndex;
        if (character === " ") return <span className="text-image-letter-space" key={`space-${index}`}> </span>;
        if (!/[A-Za-z]/.test(character)) return <span className="text-image-letter-punctuation" key={`${character}-${index}`}>{character}</span>;

        const isActive = active?.index === index;
        return (
          <button
            className={`text-image-letter${isActive ? " is-active" : ""}`}
            key={`${character}-${index}`}
            type="button"
            aria-label={`${character}: fabric letter sticker`}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") reveal(index);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setActive(null);
            }}
            onFocus={() => reveal(index)}
            onBlur={() => setActive(null)}
            onClick={() => setActive((current) => current?.index === index ? null : { index, variant: 0 })}
          >
            <img className="text-image-letter-sticker" src={stickerByLetter[character]} alt="" aria-hidden="true" />
          </button>
        );
          })}
        </span>
      ))}
    </h1>
  );
}
