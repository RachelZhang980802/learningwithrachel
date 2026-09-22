export type XiumiArticle = {
  title: string;
  author: string;
  slug: string;
  coverImage: string;
  html: string;
  updatedAt: string;
};

const STORAGE_KEY = "close-reading-xiumi-articles-v1";
const blockedTags = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "base",
  "meta",
  "link",
]);

function isSafeUrl(value: string, allowImageData = false) {
  const url = value.trim().replace(/[\u0000-\u001f\u007f\s]+/g, "").toLowerCase();
  if (!url || url.startsWith("#") || url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) return true;
  if (url.startsWith("https:") || url.startsWith("http:") || url.startsWith("mailto:") || url.startsWith("tel:")) return true;
  return allowImageData && url.startsWith("data:image/");
}

function hasUnsafeStyle(value: string) {
  const style = value.toLowerCase().replace(/\s+/g, "");
  if (style.includes("expression(") || style.includes("-moz-binding") || style.includes("@import") || style.includes("javascript:")) return true;
  return [...style.matchAll(/url\(([^)]*)\)/g)].some((match) => !isSafeUrl(match[1].replace(/["']/g, ""), true));
}

export function normalizeXiumiSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function sanitizeXiumiHtml(source: string) {
  const template = document.createElement("template");
  template.innerHTML = source;

  template.content.querySelectorAll<HTMLElement>("*").forEach((element) => {
    if (blockedTags.has(element.tagName.toLowerCase())) {
      element.remove();
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;
      if (name.startsWith("on") || name === "srcdoc") {
        element.removeAttribute(attribute.name);
        return;
      }
      if (["href", "src", "xlink:href", "poster", "action"].includes(name) && !isSafeUrl(value, name === "src" && element.tagName === "IMG")) {
        element.removeAttribute(attribute.name);
        return;
      }
      if (name === "style" && hasUnsafeStyle(value)) element.removeAttribute(attribute.name);
    });

    if (element.tagName === "A") {
      element.setAttribute("rel", "noopener noreferrer");
      if (element.getAttribute("target") === "_blank") element.setAttribute("target", "_blank");
    }
  });

  return template.innerHTML;
}

export function getXiumiArticles(): XiumiArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(isXiumiArticle) : [];
  } catch {
    return [];
  }
}

export function getXiumiArticle(slug: string) {
  return getXiumiArticles().find((article) => article.slug === slug) || null;
}

export function saveXiumiArticle(article: XiumiArticle) {
  const articles = getXiumiArticles();
  const next = [article, ...articles.filter((item) => item.slug !== article.slug)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("xiumi-articles-updated"));
}

function isXiumiArticle(value: unknown): value is XiumiArticle {
  if (!value || typeof value !== "object") return false;
  const article = value as Partial<XiumiArticle>;
  return [article.title, article.author, article.slug, article.coverImage, article.html, article.updatedAt].every((field) => typeof field === "string");
}
