#!/usr/bin/env python3
"""Rebuild Article 06 sentence clips after correcting abbreviation boundaries.

The source recording and existing timing boundaries are retained.  The only
semantic corrections encoded here are the three abbreviations that must not
create sentence breaks: ``R. Burton's``, ``Dr. Mather's``, and ``Mr. Matthew``.
The script keeps the opening offset after the spoken title and author, and
leaves every clip marked for human listening review.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path


MERGE_AFTER = {
    # (paragraph, old sentence number): merge this sentence with the next one
    ("a06-p01", 3),  # R. Burton's
    ("a06-p01", 7),  # Dr. Mather's
    ("a06-p02", 1),  # Mr. Matthew Adams
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Rebuild Article 06 sentence clips with abbreviation-safe boundaries."
    )
    parser.add_argument("--manifest", type=Path, default=Path("public/audio/article-06/manifest.json"))
    parser.add_argument("--source", type=Path, default=Path("public/audio-reading-benjamin-franklin.mp3"))
    parser.add_argument("--output-dir", type=Path, default=Path("public/audio/article-06"))
    return parser.parse_args()


def merged_records(records: list[dict]) -> list[dict]:
    output: list[dict] = []
    index = 0
    while index < len(records):
        current = records[index]
        key = (current["paragraphId"], int(current["sentenceId"].rsplit("-s", 1)[1]))
        if key in MERGE_AFTER:
            if index + 1 >= len(records):
                raise ValueError(f"Cannot merge final sentence {current['sentenceId']}")
            following = records[index + 1]
            if following["paragraphId"] != current["paragraphId"]:
                raise ValueError(f"Merge crossed paragraph boundary at {current['sentenceId']}")
            merged = dict(current)
            merged["text"] = f"{current['text']} {following['text']}"
            merged["endTime"] = following["endTime"]
            output.append(merged)
            index += 2
        else:
            output.append(dict(current))
            index += 1

    # Renumber within each paragraph so IDs remain stable and contiguous.
    counters: dict[str, int] = {}
    for record in output:
        paragraph_id = record["paragraphId"]
        counters[paragraph_id] = counters.get(paragraph_id, 0) + 1
        record["sentenceId"] = f"{paragraph_id}-s{counters[paragraph_id]:02d}"
        record["audioSrc"] = f"/audio/article-06/{record['sentenceId']}.mp3"
        record["verified"] = False
        record["needsReview"] = True
    return output


def run_ffmpeg(source: Path, start: float, end: float, destination: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-ss",
            f"{start:.3f}",
            "-to",
            f"{end:.3f}",
            "-i",
            str(source),
            "-map_metadata",
            "-1",
            "-codec:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(destination),
        ],
        check=True,
    )


def main() -> int:
    args = parse_args()
    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    original = manifest["sentences"]
    if manifest.get("articleId") != "06" or len(original) != 52:
        raise ValueError("Expected the current Article 06 manifest with 52 pre-correction records")
    if not args.source.exists():
        raise FileNotFoundError(args.source)

    records = merged_records(original)
    if len(records) != 49:
        raise AssertionError(f"Expected 49 records after abbreviation merges, got {len(records)}")

    with tempfile.TemporaryDirectory(prefix="article06-audio-") as temporary:
        temporary_dir = Path(temporary)
        for record in records:
            output = temporary_dir / f"{record['sentenceId']}.mp3"
            run_ffmpeg(args.source, float(record["startTime"]), float(record["endTime"]), output)
        args.output_dir.mkdir(parents=True, exist_ok=True)
        expected = {f"{record['sentenceId']}.mp3" for record in records}
        for old in args.output_dir.glob("a06-p*-s*.mp3"):
            if old.name not in expected:
                old.unlink()
        for clip in temporary_dir.glob("*.mp3"):
            shutil.move(str(clip), args.output_dir / clip.name)

    manifest["sentenceCount"] = len(records)
    manifest["sentences"] = records
    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Rebuilt {len(records)} Article 06 sentence clips; 3 abbreviation boundaries merged.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
