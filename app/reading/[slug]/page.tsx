"use client";

/* Imported cover URLs are user-provided, so they cannot use the static image loader. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { getXiumiArticle, type XiumiArticle } from "../../xiumiArticleStore";
import "../../xiumi-article.css";

export default function XiumiReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const [article, setArticle] = useState<XiumiArticle | null | undefined>(undefined);

  useEffect(() => {
    void params.then(({ slug }) => setArticle(getXiumiArticle(decodeURIComponent(slug))));
  }, [params]);

  if (article === undefined) return <main className="xiumi-reading-page" data-editable-skip />;
  if (!article) {
    return <main className="xiumi-reading-page" data-editable-skip><section className="xiumi-reading-empty"><p>IMPORTED READING</p><h1>Article not found</h1><Link href="/">← Reading library</Link></section></main>;
  }

  return (
    <main className="xiumi-reading-page" data-editable-skip>
      <nav className="xiumi-reading-nav" aria-label="Reading navigation"><Link href="/">← Reading library</Link><Link href="/admin/xiumi">Import article</Link></nav>
      <article className="xiumi-reading-article">
        {article.coverImage && <img className="xiumi-reading-cover" src={article.coverImage} alt="" />}
        <header><p>IMPORTED READING</p><h1>{article.title}</h1>{article.author && <span>By {article.author}</span>}</header>
        <div className="xiumi-article" dangerouslySetInnerHTML={{ __html: article.html }} />
      </article>
    </main>
  );
}
