#!/usr/bin/env python3
"""Translate the supplied books locally and save one Chinese result per English unit.

The optional loopback reader serves imported pages and prioritizes clicks while
the same model fills the static cache. Fully prepared books need no server.
"""
import argparse
from collections import deque
from concurrent.futures import Future, TimeoutError
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
from queue import Empty, Queue, Full
import re
import sqlite3
from threading import Lock, Thread
import time
from urllib.parse import urlsplit

BOOKS = ("good-writing", "college-writing", "descriptosaurus")
ORIGINS = ("http://127.0.0.1:5173", "http://localhost:5173")


def cache_key(sentence):
    context = sentence.get("context")
    return context + "\t" + sentence["en"] if context else sentence["en"]


def clean_translation(text, source, book):
    text = re.sub(r"<\|[^>]+\|>", "", text).strip()
    text = re.sub(r"^(?:译文|翻译(?:结果)?|中文(?:译文|翻译)?)[：:]\s*", "", text)
    if book == "college-writing":
        if re.search(r"\bthesis statements?\b", source, re.I):
            text = re.sub(r"论点陈述句?|论题陈述句?|论文陈述句?|论文声明|论点声明|主旨陈述句?", "中心论点句", text)
        if re.search(r"\btopic sentences?\b", source, re.I):
            text = text.replace("话题句", "主题句")
    return text


def atomic_json(path, value):
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")))
    temporary.replace(path)


class Library:
    def __init__(self, args):
        self.root = args.root
        self.order = [args.book, *args.then]
        self.work = args.root / ".local-preview/writing-library"
        self.public = args.root / "public/narrative-course/books/library"
        self.books = {}
        self.source_bytes = {}
        self.source_lock = Lock()
        self.requests = Queue(maxsize=32)
        self.db = sqlite3.connect(self.work / "translations.sqlite")
        self.table = "translations_hy_mt2" if args.engine == "hy-mt2" else "translations"
        self.db.execute(f"CREATE TABLE IF NOT EXISTS {self.table} (source TEXT PRIMARY KEY, chinese TEXT NOT NULL)")
        self.cache = dict(self.db.execute(f"SELECT source, chinese FROM {self.table}"))
        self.refresh_overrides()
        self.engine = args.engine

    def refresh_overrides(self):
        file = self.public / "translation-overrides.json"
        self.overrides = json.loads(file.read_text()) if file.is_file() else {}

    def load(self, book):
        if book not in self.order:
            return None
        with self.source_lock:
            if book not in self.books:
                source = self.work / f"{book}-source.json"
                if not source.is_file():
                    return None
                payload = source.read_bytes()
                self.books[book] = json.loads(payload)
                self.source_bytes[book] = payload
            return self.books[book]

    def known(self, book, text):
        corrections = self.overrides.get(book, {})
        override = corrections.get(text) or corrections.get(text.rsplit("\t", 1)[-1])
        if override:
            return override
        cached = self.cache.get(text)
        return clean_translation(cached, text, book) if cached else None

    def save(self, text, answer):
        self.cache[text] = answer
        self.db.execute(f"INSERT OR REPLACE INTO {self.table} VALUES (?, ?)", (text, answer))

    def publish(self, book, source):
        self.refresh_overrides()
        sentences = {}
        warnings = []
        for key, sentence in source["sentences"].items():
            en = sentence["en"]
            zh = self.known(book, cache_key(sentence))
            if not zh:
                raise ValueError(f"{book}: missing translation for {key}")
            sentences[key] = {**sentence, "zh": zh}
            if (not re.search(r"[\u3400-\u9fff]", zh) and len(en) > 20) or (len(en) > 140 and len(zh) < len(en) * .12) or re.search(r"(.{6,20})\1\1", zh):
                warnings.append({"id": key, "en": en, "zh": zh})
        model = "Tencent Hy-MT2 1.8B" if self.engine == "hy-mt2" else "Tencent HY-MT1.5-1.8B"
        info = {"language": "zh-CN", "model": model, "storage": "sentence-keyed static text", "unitCount": len(sentences)}
        directory = self.public / book
        directory.mkdir(parents=True, exist_ok=True)
        atomic_json(directory / "book.json", {**source, "sentences": sentences, "translation": info})
        report = {"book": book, "units": len(sentences), "uniqueEnglish": len({cache_key(s) for s in sentences.values()}),
                  "localTranslations": len(sentences), "overrides": len(self.overrides.get(book, {})), "warnings": warnings}
        atomic_json(self.work / f"{book}-translation-report.json", report)
        print(json.dumps({**report, "warnings": len(warnings)}, ensure_ascii=False), flush=True)


def start_reader(library, port):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def send_json(self, status, data):
            body = data if isinstance(data, bytes) else json.dumps(data, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            origin = self.headers.get("Origin")
            if origin in ORIGINS:
                self.send_header("Access-Control-Allow-Origin", origin)
                self.send_header("Vary", "Origin")
            try:
                self.end_headers()
                self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError):
                pass

        def do_GET(self):
            if self.headers.get("Origin") not in ORIGINS or self.headers.get("Host") != f"127.0.0.1:{port}":
                return self.send_json(403, {"error": "Local preview only"})
            if self.path == "/health":
                return self.send_json(200, {"service": "writing-library"})
            match = re.fullmatch(r"/([a-z-]+)/(book\.json|sentence/([a-zA-Z0-9_-]+))", urlsplit(self.path).path)
            if not match:
                return self.send_json(404, {"error": "Unknown book or sentence"})
            book, route, key = match.groups()
            source = library.load(book)
            if not source:
                return self.send_json(404, {"error": "Book has not been imported"})
            if route == "book.json":
                library.refresh_overrides()
                return self.send_json(200, library.source_bytes[book])
            sentence = source["sentences"].get(key)
            if not sentence:
                return self.send_json(404, {"error": "Unknown sentence"})
            text = cache_key(sentence)
            zh = library.known(book, text)
            if zh:
                return self.send_json(200, {"zh": zh})
            reply = Future()
            try:
                library.requests.put_nowait((book, text, reply))
                self.send_json(200, {"zh": reply.result(timeout=75)})
            except (Full, TimeoutError, ValueError):
                reply.cancel()
                self.send_json(503, {"error": "Local translation is not ready; click again to retry."})

    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    Thread(target=server.serve_forever, daemon=True).start()
    print(f"Loopback reader listening on 127.0.0.1:{port}", flush=True)
    return server


class Model:
    def __init__(self, args):
        import mlx.core as mx
        from mlx_lm import load
        from mlx_lm.generate import BatchGenerator
        from mlx_lm.sample_utils import make_sampler
        self.mx = mx
        mx.set_memory_limit(3 * 1024 ** 3)
        mx.set_cache_limit(192 * 1024 ** 2)
        model, self.tokenizer = load(str(args.model), trust_remote_code=False)
        if args.fp16:
            model.set_dtype(mx.float16)
        self.generator = BatchGenerator(
            model, stop_tokens=[[token] for token in self.tokenizer.eos_token_ids],
            sampler=make_sampler(temp=0), completion_batch_size=args.batch_size,
            prefill_batch_size=min(args.batch_size, 4), prefill_step_size=512,
        )

    def insert(self, jobs):
        prompts = []
        limits = []
        for _, text, attempt in jobs:
            prefix = "将以下文本翻译为简体中文，注意只需要输出翻译后的结果，不要额外解释："
            if attempt:
                prefix = "把以下英文完整翻译成简体中文。保留数字、编号、专有名词及原有符号。仅输出译文："
            context, _, english = text.rpartition("\t")
            if context:
                prefix = "这是描写词汇书里的一个词条。语境和词性：" + context + "。只翻译后面的英文词条，不要翻译语境，不加解释："
            prompt = self.tokenizer.apply_chat_template([{"role": "user", "content": prefix + "\n\n" + english}],
                                                        tokenize=True, add_generation_prompt=True)
            prompts.append(prompt)
            limits.append(max(64, min(1536, len(english) * 2 + 96)))
        return self.generator.insert(prompts, max_tokens=limits)


def translate(library, args):
    model = None
    waiting = {}
    in_flight = {}
    active = set()
    urgent = deque()
    retries = deque()
    started = time.monotonic()
    last_print = started
    last_commit = started

    for book in library.order:
        source = library.load(book)
        while not source:
            if not args.serve:
                raise FileNotFoundError(f"{book}-source.json")
            # The second volume may still be having its original pages imported.
            time.sleep(.5)
            source = library.load(book)
        library.refresh_overrides()
        unique = list(dict.fromkeys(cache_key(s) for s in source["sentences"].values()))
        remaining = {text for text in unique if not library.known(book, text)}
        pending = deque(text for text in unique if text in remaining)
        print(f"{book}: {len(source['sentences'])} units · {len(unique)} unique · {len(remaining)} awaiting translation", flush=True)

        # Keep two slots available for clicks; additional bulk sequences are
        # inserted as older ones finish, without restarting the model.
        bulk_limit = max(1, args.batch_size - (2 if args.serve else 0))
        while remaining or in_flight or urgent or retries:
            for _ in range(32):
                try:
                    requested_book, text, reply = library.requests.get_nowait()
                except Empty:
                    break
                if reply.cancelled():
                    continue
                known = library.known(requested_book, text)
                if known:
                    if reply.set_running_or_notify_cancel():
                        reply.set_result(known)
                    continue
                if text not in waiting and text not in active:
                    urgent.append((requested_book, text, 0))
                waiting.setdefault(text, []).append((requested_book, reply))

            jobs = []
            while urgent and len(jobs) + len(in_flight) < args.batch_size:
                job = urgent.popleft()
                if job[1] not in active:
                    jobs.append(job)
                    active.add(job[1])
            while retries and len(jobs) + len(in_flight) < args.batch_size:
                jobs.append(retries.popleft())
            while pending and len(jobs) + len(in_flight) < bulk_limit:
                text = pending.popleft()
                if text in remaining and text not in active:
                    jobs.append((book, text, 0))
                    active.add(text)

            if jobs:
                if model is None:
                    model = Model(args)
                for uid, job in zip(model.insert(jobs), jobs):
                    in_flight[uid] = (job, [])
            if not in_flight:
                if remaining:
                    raise RuntimeError(f"{book}: {len(remaining)} translations not queued")
                break

            _, responses = model.generator.next()
            for result in responses:
                job, tokens = in_flight[result.uid]
                requested_book, text, attempt = job
                if result.finish_reason != "stop":
                    tokens.append(result.token)
                if result.finish_reason is None:
                    continue
                del in_flight[result.uid]
                raw = model.tokenizer.decode(tokens)
                zh = clean_translation(raw, text, requested_book)
                if (not zh or result.finish_reason == "length") and not attempt:
                    retries.append((requested_book, text, 1))
                    continue
                if not zh or result.finish_reason == "length":
                    library.db.commit()
                    raise ValueError(f"{requested_book}: incomplete local translation of {text!r}")
                library.save(text, raw)
                active.remove(text)
                remaining.discard(text)
                replies = waiting.pop(text, [])
                if replies:
                    library.db.commit()
                for reply_book, reply in replies:
                    if reply.set_running_or_notify_cancel():
                        reply.set_result(library.known(reply_book, text))

            now = time.monotonic()
            if now - last_commit >= 2:
                library.db.commit()
                last_commit = now
            if now - last_print >= 20:
                print(f"{book}: {len(unique)-len(remaining)}/{len(unique)} unique saved · {now-started:.0f}s · "
                      f"{model.mx.get_peak_memory()/1e9:.2f} GB peak", flush=True)
                last_print = now

        library.db.commit()
        library.publish(book, source)
    if model:
        model.generator.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--book", choices=BOOKS, required=True)
    parser.add_argument("--then", choices=BOOKS, action="append", default=[])
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--model", type=Path, required=True)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--engine", choices=["hy-mt1.5", "hy-mt2"], default="hy-mt1.5")
    parser.add_argument("--fp16", action="store_true")
    parser.add_argument("--serve", action="store_true")
    parser.add_argument("--port", type=int, default=5174)
    args = parser.parse_args()
    if args.batch_size < 1:
        parser.error("--batch-size must be positive")
    library = Library(args)
    (library.work / f"{args.book}-translation.pid").write_text(str(os.getpid()))
    reader = start_reader(library, args.port) if args.serve else None
    try:
        translate(library, args)
    finally:
        if reader:
            reader.shutdown()
            reader.server_close()
        library.db.close()


if __name__ == "__main__":
    main()
