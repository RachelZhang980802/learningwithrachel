import type { InquireFeatureArticle } from "./inquire-feature-articles";
import { livingCityProsCons } from "./inquire-living-city-article";

export function LivingCityArticleBody({ article }: { article: InquireFeatureArticle }) {
  return <div className="inquire-publication-body living-city-reading">
    {article.dek && <p className="inquire-publication-dek">{article.dek}</p>}
    {article.paragraphs.map((paragraph) => article.sectionHeadings?.includes(paragraph)
      ? <h2 className="inquire-publication-section-title" key={paragraph}>{paragraph}</h2>
      : <p key={paragraph}>{paragraph}</p>)}
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
