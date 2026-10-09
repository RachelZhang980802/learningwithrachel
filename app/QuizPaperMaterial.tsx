const REFERENCE_IMAGE = "https://assets.negentropylearning.com.cn/quiz-header-reference.png";

type PaperCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const CREAM_CROP: PaperCrop = { x: 940, y: 10, width: 560, height: 190 };
const FIBER_CROP: PaperCrop = { x: 200, y: 530, width: 1150, height: 310 };

function ReferenceCrop({ crop }: { crop: PaperCrop }) {
  return (
    <svg
      width={crop.width}
      height={crop.height}
      viewBox={`${crop.x} ${crop.y} ${crop.width} ${crop.height}`}
      preserveAspectRatio="none"
      overflow="hidden"
    >
      <image href={REFERENCE_IMAGE} width="1536" height="1024" />
    </svg>
  );
}

function MirroredPaper({ crop }: { crop: PaperCrop }) {
  return (
    <>
      <ReferenceCrop crop={crop} />
      <g transform={`translate(${crop.width * 2} 0) scale(-1 1)`}>
        <ReferenceCrop crop={crop} />
      </g>
      <g transform={`translate(0 ${crop.height * 2}) scale(1 -1)`}>
        <ReferenceCrop crop={crop} />
      </g>
      <g transform={`translate(${crop.width * 2} ${crop.height * 2}) scale(-1 -1)`}>
        <ReferenceCrop crop={crop} />
      </g>
    </>
  );
}

/** Render once in the page SVG. Folder SVG paths can reference these document-wide IDs. */
export function QuizPaperDefinitions({ scale = 1 }: { scale?: number }) {
  return (
    <defs>
      <pattern
        id="quiz-reference-cream"
        width={CREAM_CROP.width * 2}
        height={CREAM_CROP.height * 2}
        patternUnits="userSpaceOnUse"
        patternTransform={`scale(${scale})`}
      >
        <MirroredPaper crop={CREAM_CROP} />
      </pattern>
      <pattern
        id="quiz-reference-fiber"
        width={FIBER_CROP.width * 2}
        height={FIBER_CROP.height * 2}
        patternUnits="userSpaceOnUse"
        patternTransform={`scale(${scale})`}
      >
        <MirroredPaper crop={FIBER_CROP} />
      </pattern>
    </defs>
  );
}

/** Shift the original paper's mean color without flattening its fiber contrast. */
export function QuizFolderTint({ id, color }: { id: string; color: string }) {
  const rgb = [1, 3, 5].map((start) => parseInt(color.slice(start, start + 2), 16));
  const sourceMean = [198.699, 212.777, 200.409];
  const contrast = 1.15;
  return <defs>
    <filter id={id} colorInterpolationFilters="sRGB">
      <feComponentTransfer>
        <feFuncR type="linear" slope={contrast} intercept={(rgb[0] - contrast * sourceMean[0]) / 255} />
        <feFuncG type="linear" slope={contrast} intercept={(rgb[1] - contrast * sourceMean[1]) / 255} />
        <feFuncB type="linear" slope={contrast} intercept={(rgb[2] - contrast * sourceMean[2]) / 255} />
      </feComponentTransfer>
    </filter>
  </defs>;
}

/** A continuous page background; this also registers the folder material definitions. */
export function QuizPaperBackdrop({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      className="integrated-quiz-paper-backdrop"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <QuizPaperDefinitions scale={scale} />
      <rect width="100%" height="100%" fill="url(#quiz-reference-cream)" />
    </svg>
  );
}
