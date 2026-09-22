#!/usr/bin/env python3
"""One-pass Article 06 transcription, forced text alignment, batch cutting, and QA.

The full recording is transcribed once with word timestamps.  Those timestamps
are aligned to the fixed, website-derived sentence manifest.  Sentence clips
are then cut from a single PCM decode of the original recording and each new
clip is transcribed for automated QA.  Existing S001-S009 media and mappings
are treated as locked inputs and are never rewritten by this program.
"""

from __future__ import annotations

import argparse
import html
import json
import math
import random
import re
import subprocess
import time
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Iterable

import numpy as np
from faster_whisper import WhisperModel


LOCKED_THROUGH = 9
MODEL_NAME = "small.en"
NUMBER_WORDS = {
    "1717": ["seventeen", "seventeen"],
    "40": ["forty"],
    "50": ["fifty"],
}
CANONICAL = {
    "dr": "doctor",
    "doctor": "doctor",
    "mr": "mister",
    "mister": "mister",
}
CONTENT_STOPWORDS = {
    "a", "an", "and", "as", "at", "be", "been", "but", "by", "for", "from",
    "had", "has", "have", "he", "her", "his", "i", "if", "in", "is", "it",
    "me", "my", "of", "on", "or", "our", "she", "that", "the", "their",
    "them", "they", "this", "to", "was", "we", "were", "which", "who", "with",
    "would", "you",
}


@dataclass(frozen=True)
class TimedToken:
    text: str
    start: float
    end: float
    source_text: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Batch-align Article 06 from one full-recording transcription."
    )
    parser.add_argument("--source", type=Path, default=Path("public/audio-reading-benjamin-franklin.mp3"))
    parser.add_argument(
        "--fixed-manifest",
        type=Path,
        default=Path("public/audio/article-06-sentence-manifest.json"),
    )
    parser.add_argument(
        "--locked-manifest",
        type=Path,
        default=Path("public/audio/article-06-serial-v1/manifest.json"),
    )
    parser.add_argument("--site-source", type=Path, default=Path("app/suppliedArticles.ts"))
    parser.add_argument(
        "--output-dir", type=Path, default=Path("public/audio/article-06-batch-v3")
    )
    parser.add_argument(
        "--artifacts-dir", type=Path, default=Path("artifacts/article-06-force-alignment")
    )
    parser.add_argument(
        "--review-page", type=Path, default=Path("public/qa/article-06-audio-review.html")
    )
    parser.add_argument("--model", default=MODEL_NAME)
    parser.add_argument("--model-dir", type=Path, default=Path("/tmp/a06-whisper-models"))
    parser.add_argument("--reuse-transcript", action="store_true")
    return parser.parse_args()


def normalise_parts(text: str) -> list[str]:
    text = text.lower().replace("’", "'").replace("‘", "'")
    raw_parts = re.findall(r"[a-z]+(?:'[a-z]+)?|\d+", text)
    output: list[str] = []
    for part in raw_parts:
        if part in NUMBER_WORDS:
            output.extend(NUMBER_WORDS[part])
            continue
        output.append(CANONICAL.get(part, part))
    return output


def content_tokens(tokens: Iterable[str]) -> list[str]:
    return [token for token in tokens if token not in CONTENT_STOPWORDS]


def word_similarity(left: str, right: str) -> float:
    if left == right:
        return 1.0
    if left.rstrip("s") == right.rstrip("s") and min(len(left), len(right)) >= 4:
        return 0.92
    return SequenceMatcher(None, left, right).ratio()


def extract_site_paragraphs(source: Path) -> list[str]:
    text = source.read_text(encoding="utf-8")
    match = re.search(r'^\s*"5"\s*:\s*\[(.*?)^\s*\],\s*\n\s*"6"\s*:', text, re.M | re.S)
    if not match:
        raise ValueError("Could not locate Article 06 paragraph array (key 5) in suppliedArticles.ts")
    return json.loads("[" + match.group(1) + "]")


def validate_fixed_manifest(manifest: dict, site_source: Path) -> list[dict]:
    records = manifest.get("sentences", [])
    if manifest.get("articleId") != "06" or len(records) != 49:
        raise ValueError("Expected the fixed Article 06 manifest with exactly 49 sentences")
    indices = [record.get("globalIndex") for record in records]
    if indices != list(range(1, 50)):
        raise ValueError("Article 06 global sentence indices are not contiguous from 1 to 49")
    ids = [record.get("sentenceId") for record in records]
    if len(ids) != len(set(ids)):
        raise ValueError("Article 06 contains duplicate sentence IDs")
    for index, record in enumerate(records, 1):
        expected_suffix = f"-s{index:03d}"
        if not str(record.get("sentenceId", "")).endswith(expected_suffix):
            raise ValueError(f"Unexpected sentence ID order at S{index:03d}: {record.get('sentenceId')}")
        if not str(record.get("text", "")).strip():
            raise ValueError(f"Empty sentence text at S{index:03d}")

    site_paragraphs = extract_site_paragraphs(site_source)
    paragraph_ids: list[str] = []
    grouped: dict[str, list[str]] = {}
    for record in records:
        paragraph_id = record["paragraphId"]
        if paragraph_id not in grouped:
            grouped[paragraph_id] = []
            paragraph_ids.append(paragraph_id)
        grouped[paragraph_id].append(record["text"])
    rebuilt = [" ".join(grouped[paragraph_id]) for paragraph_id in paragraph_ids]
    canonical = lambda value: re.sub(r"\s+", " ", value).strip()
    if [canonical(item) for item in rebuilt] != [canonical(item) for item in site_paragraphs]:
        raise ValueError("Fixed sentence manifest does not reconstruct the current website Article 06 text")
    return records


def transcribe_full(
    model: WhisperModel,
    source: Path,
    transcript_path: Path,
) -> dict:
    segments, info = model.transcribe(
        str(source),
        language="en",
        beam_size=5,
        best_of=5,
        temperature=0.0,
        condition_on_previous_text=True,
        word_timestamps=True,
        vad_filter=False,
        initial_prompt=(
            "Reading by Benjamin Franklin. R. Burton's Historical Collections. "
            "Dr. Mather's Essays to Do Good. Mr. Matthew Adams. The Spectator."
        ),
    )
    segment_rows: list[dict] = []
    word_rows: list[dict] = []
    for segment in segments:
        segment_words = []
        for word in segment.words or []:
            row = {
                "text": word.word,
                "start": round(float(word.start), 3),
                "end": round(float(word.end), 3),
                "probability": round(float(word.probability), 5),
            }
            segment_words.append(row)
            word_rows.append(row)
        segment_rows.append(
            {
                "id": segment.id,
                "start": round(float(segment.start), 3),
                "end": round(float(segment.end), 3),
                "text": segment.text.strip(),
                "words": segment_words,
            }
        )
    payload = {
        "model": MODEL_NAME,
        "language": info.language,
        "languageProbability": info.language_probability,
        "duration": info.duration,
        "segments": segment_rows,
        "words": word_rows,
    }
    transcript_path.parent.mkdir(parents=True, exist_ok=True)
    transcript_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return payload


def timed_tokens(transcript: dict) -> list[TimedToken]:
    tokens: list[TimedToken] = []
    for word in transcript["words"]:
        parts = normalise_parts(word["text"])
        if not parts:
            continue
        start = float(word["start"])
        end = float(word["end"])
        width = max(0.0, end - start) / len(parts)
        for offset, part in enumerate(parts):
            tokens.append(
                TimedToken(
                    text=part,
                    start=start + width * offset,
                    end=start + width * (offset + 1),
                    source_text=word["text"].strip(),
                )
            )
    return tokens


def reference_tokens(records: list[dict]) -> tuple[list[str], list[int]]:
    tokens: list[str] = []
    owners: list[int] = []
    for sentence_index, record in enumerate(records):
        parts = normalise_parts(record["text"])
        tokens.extend(parts)
        owners.extend([sentence_index] * len(parts))
    return tokens, owners


def align_tokens(reference: list[str], observed: list[TimedToken]) -> list[int | None]:
    n, m = len(reference), len(observed)
    scores = np.empty((n + 1, m + 1), dtype=np.float32)
    trace = np.empty((n + 1, m + 1), dtype=np.uint8)
    gap = -1.0
    scores[0, 0] = 0.0
    trace[0, 0] = 0
    for i in range(1, n + 1):
        scores[i, 0] = i * gap
        trace[i, 0] = 1
    for j in range(1, m + 1):
        scores[0, j] = j * gap
        trace[0, j] = 2
    for i in range(1, n + 1):
        left = reference[i - 1]
        for j in range(1, m + 1):
            similarity = word_similarity(left, observed[j - 1].text)
            diagonal_score = 2.2 if similarity == 1.0 else (1.2 if similarity >= 0.82 else -1.5)
            diagonal = scores[i - 1, j - 1] + diagonal_score
            up = scores[i - 1, j] + gap
            across = scores[i, j - 1] + gap
            if diagonal >= up and diagonal >= across:
                scores[i, j] = diagonal
                trace[i, j] = 0
            elif up >= across:
                scores[i, j] = up
                trace[i, j] = 1
            else:
                scores[i, j] = across
                trace[i, j] = 2
    mapping: list[int | None] = [None] * n
    i, j = n, m
    while i > 0 or j > 0:
        direction = int(trace[i, j])
        if i > 0 and j > 0 and direction == 0:
            if word_similarity(reference[i - 1], observed[j - 1].text) >= 0.58:
                mapping[i - 1] = j - 1
            i -= 1
            j -= 1
        elif i > 0 and (j == 0 or direction == 1):
            i -= 1
        else:
            j -= 1
    return mapping


def audio_duration(source: Path) -> float:
    result = subprocess.run(
        [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=nw=1:nk=1", str(source),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def derive_boundaries(
    records: list[dict],
    ref_tokens: list[str],
    owners: list[int],
    observed: list[TimedToken],
    mapping: list[int | None],
    duration: float,
) -> list[dict]:
    ref_by_sentence: list[list[int]] = [[] for _ in records]
    for ref_index, sentence_index in enumerate(owners):
        ref_by_sentence[sentence_index].append(ref_index)
    output: list[dict] = []
    mapped_ranges: list[tuple[int | None, int | None]] = []
    for indices in ref_by_sentence:
        mapped = [mapping[index] for index in indices if mapping[index] is not None]
        mapped_ranges.append((min(mapped) if mapped else None, max(mapped) if mapped else None))

    for sentence_index, (record, indices) in enumerate(zip(records, ref_by_sentence)):
        mapped_pairs = [(index, mapping[index]) for index in indices if mapping[index] is not None]
        if not mapped_pairs:
            output.append({"status": "FAIL", "issues": ["No aligned words"], "startTime": None, "endTime": None})
            continue
        first_ref, first_obs = mapped_pairs[0]
        last_ref, last_obs = mapped_pairs[-1]
        assert first_obs is not None and last_obs is not None
        previous_last = mapped_ranges[sentence_index - 1][1] if sentence_index > 0 else None
        next_first = mapped_ranges[sentence_index + 1][0] if sentence_index + 1 < len(records) else None
        start = observed[first_obs].start - 0.32
        end = observed[last_obs].end + 0.45
        if previous_last is not None:
            start = max(start, observed[previous_last].end + 0.03)
        if next_first is not None:
            next_start = observed[next_first].start
            if next_start > observed[last_obs].end:
                end = min(end, next_start - 0.03)
        start = max(0.0, start)
        end = min(duration, end)
        aligned_count = len(mapped_pairs)
        coverage = aligned_count / max(1, len(indices))
        boundary_first = first_ref == indices[0] and word_similarity(ref_tokens[first_ref], observed[first_obs].text) >= 0.75
        boundary_last = last_ref == indices[-1] and word_similarity(ref_tokens[last_ref], observed[last_obs].text) >= 0.75
        observed_slice = [token.text for token in observed[first_obs : last_obs + 1]]
        target = [ref_tokens[index] for index in indices]
        alignment_similarity = SequenceMatcher(None, " ".join(target), " ".join(observed_slice)).ratio()
        gaps = [
            observed[index + 1].start - observed[index].end
            for index in range(first_obs, last_obs)
        ]
        issues: list[str] = []
        if coverage < 0.90:
            issues.append(f"Alignment coverage {coverage:.1%}")
        if alignment_similarity < 0.90:
            issues.append(f"Alignment similarity {alignment_similarity:.1%}")
        if not boundary_first:
            issues.append("First target word not stably aligned")
        if not boundary_last:
            issues.append("Last target word not stably aligned")
        if max(gaps, default=0.0) > 1.15:
            issues.append(f"Long internal pause {max(gaps):.2f}s")
        if end <= start or end - start < 0.45:
            issues.append("Invalid or implausibly short boundary")
        status = "PASS"
        if not mapped_pairs or end <= start:
            status = "FAIL"
        elif issues:
            status = "REVIEW"
        output.append(
            {
                "startTime": round(start, 3),
                "endTime": round(end, 3),
                "duration": round(end - start, 3),
                "alignmentCoverage": round(coverage, 5),
                "alignmentSimilarity": round(alignment_similarity, 5),
                "boundaryFirstAligned": boundary_first,
                "boundaryLastAligned": boundary_last,
                "maxInternalPause": round(max(gaps, default=0.0), 3),
                "alignedTranscript": " ".join(observed_slice),
                "status": status,
                "issues": issues,
            }
        )
    return output


def run_ffmpeg(args: list[str]) -> None:
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def cut_clips(source: Path, output_dir: Path, records: list[dict], alignments: list[dict]) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    pcm = output_dir.parent / ".article06-force-align-source.wav"
    try:
        run_ffmpeg(["-i", str(source), "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "1", str(pcm)])
        for record, alignment in zip(records, alignments):
            index = int(record["globalIndex"])
            if index <= LOCKED_THROUGH or alignment.get("startTime") is None:
                continue
            filename = f"{record['sentenceId']}-v3.mp3"
            destination = output_dir / filename
            run_ffmpeg(
                [
                    "-i", str(pcm),
                    "-af", f"atrim=start={alignment['startTime']}:end={alignment['endTime']},asetpts=PTS-STARTPTS",
                    "-codec:a", "libmp3lame", "-b:a", "96k", "-ar", "44100", "-ac", "1",
                    "-write_xing", "1", str(destination),
                ]
            )
    finally:
        pcm.unlink(missing_ok=True)


def transcribe_clip(model: WhisperModel, clip: Path) -> str:
    segments, _ = model.transcribe(
        str(clip), language="en", beam_size=5, temperature=0.0,
        condition_on_previous_text=False, word_timestamps=False, vad_filter=False,
    )
    return " ".join(segment.text.strip() for segment in segments).strip()


def token_coverage(target: list[str], actual: list[str]) -> float:
    matcher = SequenceMatcher(None, target, actual)
    return sum(block.size for block in matcher.get_matching_blocks()) / max(1, len(target))


def token_present(token: str | None, actual: list[str]) -> bool:
    if token is None:
        return True
    return any(word_similarity(token, candidate) >= 0.76 for candidate in actual)


def neighbour_phrase(tokens: list[str], from_start: bool) -> str:
    content = content_tokens(tokens)
    selected = content[:3] if from_start else content[-3:]
    return " ".join(selected)


def qa_clips(
    model: WhisperModel,
    output_dir: Path,
    records: list[dict],
    alignments: list[dict],
    locked_manifest: dict,
) -> list[dict]:
    locked_by_id = {record["sentenceId"]: record for record in locked_manifest["sentences"]}
    random_source = random.Random(6010)
    pass_sample = set(random_source.sample(list(range(LOCKED_THROUGH, len(records))), 4))
    paragraph_first: set[int] = set()
    for index, record in enumerate(records):
        if index == 0 or record["paragraphId"] != records[index - 1]["paragraphId"]:
            paragraph_first.add(index)

    results: list[dict] = []
    for index, (record, alignment) in enumerate(zip(records, alignments)):
        global_index = int(record["globalIndex"])
        target_tokens = normalise_parts(record["text"])
        if global_index <= LOCKED_THROUGH:
            has_locked_audio = bool(locked_by_id.get(record["sentenceId"], {}).get("audioSrc"))
            results.append(
                {
                    **alignment,
                    "status": "PASS" if has_locked_audio else "REVIEW",
                    "locked": True,
                    "autoTranscript": (
                        "User-confirmed locked sentence; not retranscribed or recut."
                        if has_locked_audio
                        else "Locked sentence has no audioSrc in the current project manifest."
                    ),
                    "qaSimilarity": None,
                    "wordCoverage": None,
                    "firstContentWordPresent": True if has_locked_audio else None,
                    "lastContentWordPresent": True if has_locked_audio else None,
                    "neighbourLeak": False,
                    "issues": [] if has_locked_audio else ["Existing locked mapping has no audioSrc"],
                    "manualReviewRequired": not has_locked_audio,
                    "manualReviewReasons": [] if has_locked_audio else ["Resolve locked S009 mapping conflict"],
                }
            )
            continue
        clip = output_dir / f"{record['sentenceId']}-v3.mp3"
        transcript = transcribe_clip(model, clip) if clip.exists() else ""
        actual_tokens = normalise_parts(transcript)
        target_content = content_tokens(target_tokens)
        first_content = target_content[0] if target_content else (target_tokens[0] if target_tokens else None)
        last_content = target_content[-1] if target_content else (target_tokens[-1] if target_tokens else None)
        similarity = SequenceMatcher(None, " ".join(target_tokens), " ".join(actual_tokens)).ratio()
        coverage = token_coverage(target_tokens, actual_tokens)
        first_present = token_present(first_content, actual_tokens)
        last_present = token_present(last_content, actual_tokens)
        previous = normalise_parts(records[index - 1]["text"]) if index > 0 else []
        following = normalise_parts(records[index + 1]["text"]) if index + 1 < len(records) else []
        actual_joined = " ".join(actual_tokens)
        previous_leak = neighbour_phrase(previous, False) in actual_joined if previous else False
        next_leak = neighbour_phrase(following, True) in actual_joined if following else False
        neighbour_leak = previous_leak or next_leak
        issues = list(alignment.get("issues", []))
        if similarity < 0.90:
            issues.append(f"Clip similarity {similarity:.1%}")
        if coverage < 0.90:
            issues.append(f"Clip word coverage {coverage:.1%}")
        if not first_present:
            issues.append(f"First content word not detected: {first_content}")
        if not last_present:
            issues.append(f"Last content word not detected: {last_content}")
        if neighbour_leak:
            issues.append("Possible adjacent-sentence speech detected")
        duration = float(alignment.get("duration") or 0.0)
        if duration <= 0 or duration > 50:
            issues.append(f"Implausible clip duration {duration:.2f}s")
        if not transcript:
            status = "FAIL"
        elif coverage < 0.55 or (not first_present and not last_present):
            status = "FAIL"
        elif issues:
            status = "REVIEW"
        else:
            status = "PASS"

        manual_reasons: list[str] = []
        if index == len(records) - 1:
            manual_reasons.append("Final sentence")
        if index in paragraph_first:
            manual_reasons.append("First sentence of paragraph")
        if re.search(r"[;:—–]", record["text"]):
            manual_reasons.append("Contains semicolon, colon, or dash")
        if alignment.get("maxInternalPause", 0.0) > 1.15:
            manual_reasons.append("Long internal pause")
        if index in pass_sample:
            manual_reasons.append("Deterministic 10% PASS sample")
        if status in {"REVIEW", "FAIL"}:
            manual_reasons.append(f"Automatic status {status}")
        if manual_reasons and status == "PASS":
            status = "REVIEW"
            issues.append("Required human spot-check before website binding")
        results.append(
            {
                **alignment,
                "status": status,
                "locked": False,
                "autoTranscript": transcript,
                "qaSimilarity": round(similarity, 5),
                "wordCoverage": round(coverage, 5),
                "firstContentWordPresent": first_present,
                "lastContentWordPresent": last_present,
                "neighbourLeak": neighbour_leak,
                "issues": sorted(set(issues)),
                "manualReviewRequired": bool(manual_reasons),
                "manualReviewReasons": sorted(set(manual_reasons)),
            }
        )
    return results


def build_output_manifest(
    fixed: dict,
    locked: dict,
    records: list[dict],
    qa: list[dict],
    output_dir: Path,
) -> dict:
    locked_by_id = {record["sentenceId"]: record for record in locked["sentences"]}
    output_records: list[dict] = []
    for record, result in zip(records, qa):
        index = int(record["globalIndex"])
        if index <= LOCKED_THROUGH:
            preserved = dict(locked_by_id.get(record["sentenceId"], record))
            preserved["globalIndex"] = index
            preserved["locked"] = True
            preserved["qaStatus"] = result["status"]
            preserved["qaNote"] = (
                "User-confirmed; existing file and mapping preserved without recutting"
                if result["status"] == "PASS"
                else "Locked mapping preserved unchanged; current manifest contains no audioSrc"
            )
            if result["status"] != "PASS":
                preserved["needsReview"] = True
                preserved["issue"] = "Existing locked mapping has no audioSrc; no audio was recut"
            output_records.append(preserved)
            continue
        audio_src = None
        verified = False
        needs_review = result["status"] != "PASS"
        if result["status"] == "PASS":
            audio_src = f"/audio/article-06-batch-v3/{record['sentenceId']}-v3.mp3?v=20260828-force-align-v3"
        output_records.append(
            {
                "globalIndex": index,
                "sentenceId": record["sentenceId"],
                "paragraphId": record["paragraphId"],
                "text": record["text"],
                "startTime": result.get("startTime"),
                "endTime": result.get("endTime"),
                "audioSrc": audio_src,
                "verified": verified,
                "needsReview": needs_review,
                "qaStatus": result["status"],
                "qaSimilarity": result.get("qaSimilarity"),
                "wordCoverage": result.get("wordCoverage"),
                "issue": "; ".join(result.get("issues", [])) or None,
            }
        )
    return {
        "articleId": "06",
        "title": fixed["title"],
        "author": fixed["author"],
        "sourceAudio": fixed["sourceAudio"],
        "sentenceCount": len(output_records),
        "segmentationVersion": "full-recording-force-alignment-v3",
        "transcriptionRunsOnFullAudio": 1,
        "lockedThrough": "S009",
        "semanticMatchChecked": False,
        "automatedTranscriptChecked": True,
        "sentences": output_records,
    }


def render_review_page(
    destination: Path,
    records: list[dict],
    qa: list[dict],
    audio_manifest: dict,
) -> None:
    audio_by_id = {record["sentenceId"]: record for record in audio_manifest["sentences"]}
    rows: list[str] = []
    for record, result in zip(records, qa):
        index = int(record["globalIndex"])
        audio_src = audio_by_id.get(record["sentenceId"], {}).get("audioSrc") or ""
        audio_src = audio_src.split("?", 1)[0]
        if audio_src.startswith("/audio/"):
            audio_src = ".." + audio_src
        similarity = result.get("qaSimilarity")
        similarity_text = (
            ("confirmed" if result["status"] == "PASS" else "missing mapping")
            if result.get("locked")
            else (f"{similarity:.1%}" if similarity is not None else "—")
        )
        reasons = [*result.get("issues", []), *result.get("manualReviewReasons", [])]
        rows.append(
            f'''<tr class="status-{result['status'].lower()}" data-status="{result['status']}">
              <td class="number">S{index:03d}<small>{html.escape(record['sentenceId'])}</small></td>
              <td class="sentence">{html.escape(record['text'])}<details><summary>检查信息</summary>{html.escape(' · '.join(reasons) or 'No automatic issue')}</details></td>
              <td><audio controls preload="none" src="{html.escape(audio_src)}"></audio></td>
              <td class="transcript">{html.escape(result.get('autoTranscript') or '—')}</td>
              <td>{similarity_text}</td>
              <td><span class="badge">{result['status']}</span></td>
            </tr>'''
        )
    counts = {status: sum(result["status"] == status for result in qa) for status in ("PASS", "REVIEW", "FAIL")}
    page = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Article 06 sentence audio audit</title><style>
:root{{--paper:#f7f2e8;--ink:#2d281f;--line:#d9cfbc;--pass:#e0f2e5;--review:#fff0b8;--fail:#f9d2cf}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:14px/1.55 ui-sans-serif,system-ui,-apple-system,sans-serif}}
header{{position:sticky;top:0;z-index:2;background:rgba(247,242,232,.96);border-bottom:1px solid var(--line);padding:18px 24px}}
h1{{font:700 25px/1.2 Georgia,serif;margin:0 0 8px}}.summary{{display:flex;gap:10px;flex-wrap:wrap}}.summary b,button{{border:1px solid var(--line);background:#fff;padding:6px 10px;border-radius:999px}}
main{{padding:20px;overflow:auto}}table{{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border:1px solid var(--line)}}th,td{{padding:12px;vertical-align:top;border-bottom:1px solid var(--line);text-align:left}}th{{position:sticky;top:99px;background:#f2eadb;z-index:1}}td.number{{font-weight:800;white-space:nowrap}}td.number small{{display:block;font-weight:400;color:#776e61}}td.sentence{{min-width:360px;font:16px/1.55 Georgia,serif}}td.transcript{{min-width:260px;color:#5b544a}}audio{{width:260px;max-width:28vw}}.badge{{padding:4px 8px;border-radius:999px;font-weight:800}}.status-pass .badge{{background:var(--pass)}}.status-review .badge{{background:var(--review)}}.status-fail .badge{{background:var(--fail)}}tr.is-hidden{{display:none}}details{{font:12px/1.4 ui-sans-serif;color:#776e61;margin-top:6px}}
@media(max-width:760px){{header{{position:static}}th{{position:static}}main{{padding:8px}}audio{{max-width:none;width:220px}}}}
</style></head><body><header><h1>Article 06 · Reading · sentence audio audit</h1>
<div class="summary"><b>PASS {counts['PASS']}</b><b>REVIEW {counts['REVIEW']}</b><b>FAIL {counts['FAIL']}</b>
<button data-filter="ALL">全部</button><button data-filter="PASS">PASS</button><button data-filter="REVIEW">REVIEW</button><button data-filter="FAIL">FAIL</button>
<button id="previous-audio">← 上一句</button><button id="next-audio">下一句 →</button></div></header>
<main><table><thead><tr><th>编号</th><th>句子原文</th><th>播放音频</th><th>自动转写</th><th>匹配度</th><th>状态</th></tr></thead><tbody>{''.join(rows)}</tbody></table></main>
<script>
const rows=[...document.querySelectorAll('tbody tr')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{{const wanted=button.dataset.filter;rows.forEach(row=>row.classList.toggle('is-hidden',wanted!=='ALL'&&row.dataset.status!==wanted));}}));
const audios=[...document.querySelectorAll('audio')];let activeAudio=0;
audios.forEach((audio,index)=>{{audio.addEventListener('play',()=>{{activeAudio=index;audios.forEach((other,i)=>{{if(i!==index)other.pause()}})}});audio.addEventListener('ended',()=>{{const next=audios[index+1];if(next)next.play();}});}});
document.querySelector('#previous-audio').addEventListener('click',()=>{{activeAudio=Math.max(0,activeAudio-1);audios[activeAudio]?.play();}});
document.querySelector('#next-audio').addEventListener('click',()=>{{activeAudio=Math.min(audios.length-1,activeAudio+1);audios[activeAudio]?.play();}});
</script></body></html>'''
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(page, encoding="utf-8")


def main() -> int:
    started = time.monotonic()
    args = parse_args()
    fixed_manifest = json.loads(args.fixed_manifest.read_text(encoding="utf-8"))
    locked_manifest = json.loads(args.locked_manifest.read_text(encoding="utf-8"))
    records = validate_fixed_manifest(fixed_manifest, args.site_source)
    if not args.source.exists():
        raise FileNotFoundError(args.source)
    args.artifacts_dir.mkdir(parents=True, exist_ok=True)
    transcript_path = args.artifacts_dir / "article06-full-transcription-small-en.json"
    model = WhisperModel(args.model, device="cpu", compute_type="int8", download_root=str(args.model_dir))
    if args.reuse_transcript and transcript_path.exists():
        transcript = json.loads(transcript_path.read_text(encoding="utf-8"))
    else:
        transcript = transcribe_full(model, args.source, transcript_path)

    observed = timed_tokens(transcript)
    ref_tokens, owners = reference_tokens(records)
    mapping = align_tokens(ref_tokens, observed)
    alignments = derive_boundaries(
        records, ref_tokens, owners, observed, mapping, audio_duration(args.source)
    )
    cut_clips(args.source, args.output_dir, records, alignments)
    qa = qa_clips(model, args.output_dir, records, alignments, locked_manifest)
    output_manifest = build_output_manifest(
        fixed_manifest, locked_manifest, records, qa, args.output_dir
    )
    args.output_dir.mkdir(parents=True, exist_ok=True)
    (args.output_dir / "manifest.json").write_text(
        json.dumps(output_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    report = {
        "articleId": "06",
        "title": fixed_manifest["title"],
        "author": fixed_manifest["author"],
        "sentenceCount": len(records),
        "lockedCount": LOCKED_THROUGH,
        "generatedCount": len(records) - LOCKED_THROUGH,
        "counts": {status: sum(result["status"] == status for result in qa) for status in ("PASS", "REVIEW", "FAIL")},
        "manualReviewCount": sum(bool(result.get("manualReviewRequired")) for result in qa),
        "fullRecordingTranscriptionRuns": 1,
        "runtimeSeconds": round(time.monotonic() - started, 2),
        "sentences": [
            {
                "globalIndex": record["globalIndex"],
                "sentenceId": record["sentenceId"],
                "paragraphId": record["paragraphId"],
                "text": record["text"],
                **result,
            }
            for record, result in zip(records, qa)
        ],
    }
    (args.artifacts_dir / "article06-audio-qa-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    render_review_page(args.review_page, records, qa, output_manifest)
    print(json.dumps({key: report[key] for key in ("sentenceCount", "lockedCount", "generatedCount", "counts", "manualReviewCount", "runtimeSeconds")}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
