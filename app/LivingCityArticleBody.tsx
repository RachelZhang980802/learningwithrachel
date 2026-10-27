import { Fragment } from "react";
import type { InquireFeatureArticle } from "./inquire-feature-articles";
import { livingCityProsCons } from "./inquire-living-city-article";
import { livingCityTranslations } from "./SupplementaryTranslations";

export function LivingCityArticleBody({ article }: { article: InquireFeatureArticle }) {
  return <div className="inquire-publication-body living-city-reading">
    {article.dek && <p className="inquire-publication-dek">{article.dek}</p>}
    {article.paragraphs.map((paragraph, paragraphIndex) => <Fragment key={paragraphIndex}>
      {article.sectionHeadings?.includes(paragraph)
        ? <h2 className="inquire-publication-section-title">{paragraph}</h2>
        : <p>{paragraph}</p>}
      {livingCityTranslations[paragraphIndex] && <details className="supplementary-translation">
        <summary aria-label="展开或收起本段中文翻译" title="点击 ☞ 查看本段中文翻译"><span aria-hidden="true">☞</span></summary>
        <p lang="zh-CN">{livingCityTranslations[paragraphIndex]}</p>
      </details>}
    </Fragment>)}
    <section className="living-city-table-section" aria-labelledby="living-city-table-title">
      <h2 className="inquire-publication-section-title" id="living-city-table-title">Pros and Cons of Living in the City</h2>
      <div className="living-city-table-scroll">
        <table className="living-city-table">
          <thead><tr><th scope="col">Topic</th><th scope="col">Pros</th><th scope="col">Cons</th></tr></thead>
          <tbody>{livingCityProsCons.map((row) => <tr key={row.topic}>
            <th scope="row">{row.topic}</th>
            <td><ul>{row.pros.map((item) => <li key={item}>{item}</li>)}</ul></td>
            <td><ul>{row.cons.map((item) => <li key={item}>{item}</li>)}</ul></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  </div>;
}
