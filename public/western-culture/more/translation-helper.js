// Copy this file beside app.js and import its named exports from app.js.
// First translations use MyMemory; successful results are kept in memory and
// in the existing browser cache so repeat clicks do not need another request.
const CACHE_KEY = "mythology-sentence-translations-v1";
const MAX_CACHE_ENTRIES = 8000;
const REQUEST_TIMEOUT_MS = 5000;
const MAX_QUERY_BYTES = 450;
const encoder = new TextEncoder();
const inFlight = new Map();
const cache = new Map();

const normalize = (value) => String(value ?? "").replace(/\s+/gu, " ").trim();

try {
  const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    for (const [source, translated] of Object.entries(stored)) {
      if (typeof translated === "string" && translated.trim()) {
        cache.set(normalize(source), translated.trim());
      }
    }
  }
} catch {
  // Storage may be disabled; the in-memory cache still works.
}

function remember(source, translated) {
  cache.delete(source);
  cache.set(source, translated);
  while (cache.size > MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(cache)));
  } catch {
    // Translation still succeeds if storage is full or unavailable.
  }
}

export function getCachedChineseTranslation(text) {
  return cache.get(normalize(text)) || null;
}

function chunksForApi(text) {
  if (encoder.encode(text).length <= MAX_QUERY_BYTES) return [text];
  const chunks = [];
  let current = "";
  for (const word of text.split(" ")) {
    const next = current ? `${current} ${word}` : word;
    if (encoder.encode(next).length <= MAX_QUERY_BYTES) {
      current = next;
      continue;
    }
    if (current) chunks.push(current);
    if (encoder.encode(word).length <= MAX_QUERY_BYTES) {
      current = word;
      continue;
    }
    // Extremely long tokens are rare in this book, but keep the API limit.
    current = "";
    for (const character of word) {
      if (encoder.encode(current + character).length > MAX_QUERY_BYTES) {
        chunks.push(current);
        current = character;
      } else {
        current += character;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function fetchTranslation(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const translated = [];
    for (const chunk of chunksForApi(source)) {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en%7Czh-CN`;
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error("Translation service is unavailable. Tap to try again.");
      const payload = await response.json();
      const result = payload?.responseData?.translatedText;
      if (Number(payload?.responseStatus) !== 200 || typeof result !== "string" || !result.trim()) {
        throw new Error("Translation service is unavailable. Tap to try again.");
      }
      translated.push(result.trim());
    }
    const result = translated.join(" ").trim();
    if (!result || result === source) throw new Error("Translation is unavailable. Tap to try again.");
    return result;
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Translation took too long. Tap to try again.");
    if (error instanceof Error && error.message.startsWith("Translation")) throw error;
    throw new Error("Translation service is unavailable. Tap to try again.");
  } finally {
    clearTimeout(timer);
  }
}

export function requestChineseTranslation(text) {
  const source = normalize(text);
  if (!source) return Promise.reject(new Error("There is no sentence to translate."));
  const cached = cache.get(source);
  if (cached) return Promise.resolve(cached);
  const pending = inFlight.get(source);
  if (pending) return pending;

  const request = fetchTranslation(source)
    .then((translated) => {
      remember(source, translated);
      return translated;
    })
    .finally(() => inFlight.delete(source));
  inFlight.set(source, request);
  return request;
}
