#!/usr/bin/env python3
"""Repair Article 06 boundaries identified during listening review.

The current 49-record manifest already contains the abbreviation-safe sentence
list.  These overrides move boundaries to adjacent waveform silence ends so
the ``R. Burton`` sentence keeps ``40 or 50 in all.``, the following long
sentence keeps its final clause, and the two short sentences are not left as
near-empty clips.  All records remain marked for human listening review.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path


OVERRIDES = {
    # The earlier cut selected internal pauses inside the R. Burton sentence
    # and the following long sentence.  Move both boundaries to the later
    # waveform silences so the clips follow the written sentence units.
    "a06-p01-s03": (21.760, 35.331),
    "a06-p01-s04": (35.331, 56.741),
    "a06-p01-s05": (56.741, 61.137),
    "a06-p01-s14": (139.735, 142.852),
    "a06-p01-s15": (142.852, 152.314),
    "a06-p05-s02": (415.033, 418.604),
    "a06-p05-s03": (418.604, 423.186),
    "a06-p05-s04": (423.186, 427.355),
    "a06-p05-s05": (427.355, 430.142),
    "a06-p05-s06": (430.142, 454.082),
}


def args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Repair Article 06 waveform boundaries for two short sentences.")
    parser.add_argument("--manifest", type=Path, default=Path("public/audio/article-06/manifest.json"))
    parser.add_argument("--source", type=Path, default=Path("public/audio-reading-benjamin-franklin.mp3"))
    parser.add_argument("--output-dir", type=Path, default=Path("public/audio/article-06"))
    return parser.parse_args()


def cut(source: Path, start: float, end: float, target: Path) -> None:
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-ss", f"{start:.3f}", "-to", f"{end:.3f}", "-i", str(source),
            "-map_metadata", "-1", "-codec:a", "libmp3lame", "-q:a", "2", str(target),
        ],
        check=True,
    )


def main() -> int:
    opts = args()
    manifest = json.loads(opts.manifest.read_text(encoding="utf-8"))
    records = manifest.get("sentences", [])
    if manifest.get("articleId") != "06" or len(records) != 49:
        raise ValueError("Expected the corrected Article 06 manifest with 49 records")
    if not opts.source.exists():
        raise FileNotFoundError(opts.source)

    for record in records:
        if record["sentenceId"] in OVERRIDES:
            start, end = OVERRIDES[record["sentenceId"]]
            record["startTime"], record["endTime"] = start, end
        record["verified"] = False
        record["needsReview"] = True

    with tempfile.TemporaryDirectory(prefix="article06-boundaries-") as temporary:
        temp_dir = Path(temporary)
        for record in records:
            clip = temp_dir / f"{record['sentenceId']}.mp3"
            cut(opts.source, float(record["startTime"]), float(record["endTime"]), clip)
        for clip in temp_dir.glob("*.mp3"):
            shutil.move(str(clip), opts.output_dir / clip.name)

    opts.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Repaired Article 06 boundaries for the reported sentence mismatches and short sentences.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
