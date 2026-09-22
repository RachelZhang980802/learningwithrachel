"use client";

/* Xiumi cover URLs are user-provided, so they cannot use the static image loader. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { getXiumiArticles, type XiumiArticle } from "./xiumiArticleStore";
import "./xiumi-article.css";

export function XiumiArticleShelf() {
  const [articles, setArticles] = useState<XiumiArticle[]>([]);

  useEffect(() => {
    const refresh = () => setArticles(getXiumiArticles());
    refresh();
    window.addEventListener("xiumi-articles-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("xiumi-articles-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!articles.length) return null;

  return (
    <section className="xiumi-article-shelf" aria-labelledby="xiumi-shelf-title">
      <div><p>IMPORTED READING</p><h2 id="xiumi-shelf-title">Xiumi articles</h2></div>
      <div className="xiumi-article-shelf-grid">
        {articles.map((article) => (
          <article key={article.slug} className="xiumi-article-shelf-card">
            {article.coverImage && <img src={article.coverImage} alt="" />}
            <p>{article.author || "Imported reading"}</p>
            <h3>{article.title}</h3>
            <a href={`/reading/${encodeURIComponent(article.slug)}`}>Read Text →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
