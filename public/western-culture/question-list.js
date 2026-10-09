(() => {
  const root = document.getElementById('review-questions');
  if (!root) return;
  const main = document.getElementById('review-content');
  const partNav = document.getElementById('review-part-nav');
  const jump = document.getElementById('review-jump');
  const storageKey = 'western-culture-review-self-reflection-v1';
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const pad = number => String(number).padStart(2, '0');
  let data;
  let activeChapter;
  let checks = {};
  let savingAvailable = true;
  try { checks = JSON.parse(localStorage.getItem(storageKey) || '{}'); }
  catch { savingAvailable = false; }
  if (!checks || typeof checks !== 'object' || Array.isArray(checks)) checks = {};

  function reflectionCount() {
    const count = activeChapter.parts.flatMap(p => p.sections.flatMap(s => s.questions)).filter(q => checks[`${activeChapter.id}-${q.number}`] === true).length;
    document.getElementById('review-reflection-count').textContent = `${count} / ${activeChapter.count} self-reflections`;
    if (!savingAvailable) {
      const note = document.getElementById('review-save-note');
      note.textContent = 'Self-reflections are saved for this session only.';
      note.hidden = false;
    }
  }

  function questionRow(question, chapter) {
    const key = `${chapter.id}-${question.number}`;
    const textId = `question-${key}`;
    return `<li class="review-question" value="${question.number}">
      <span class="review-question-number" aria-hidden="true">${pad(question.number)}</span>
      <div class="review-question-copy"><p id="${textId}">${escape(question.text)}</p>${question.note ? `<small class="review-question-note" lang="zh-CN">${escape(question.note)}</small>` : ''}</div>
      <label class="review-check"><input type="checkbox" data-reflection="${key}" aria-label="Self-reflection: Question ${pad(question.number)}" aria-describedby="${textId}" ${checks[key] === true ? 'checked' : ''}></label>
    </li>`;
  }

  function sectionHtml(section, chapter, index) {
    return `<section class="review-section" id="${section.id}" aria-labelledby="${section.id}-heading">
      <header class="review-section-heading"><h4 id="${section.id}-heading" class="${section.code ? '' : 'review-no-code'}">${section.code ? `<span class="review-section-code">${escape(section.code)}</span>` : ''}<span>${escape(section.title)} ${section.pages ? `<span class="review-pages">(${escape(section.pages)})</span>` : ''}</span></h4>${index === 0 ? '<span class="review-self-label">Self-reflection</span>' : ''}</header>
      ${section.questions.length > 0 && section.note ? `<p class="review-source-warning" lang="zh-CN">${escape(section.note)}</p>` : ''}
      <ol class="review-question-list" start="${section.questions[0]?.number || 1}">${section.questions.map(q => questionRow(q, chapter)).join('')}</ol>
    </section>`;
  }

  function appendixRows(rows) {
    return rows.map((row, index) => {
      const sameFigure = other => other && other[0] === row[0] && other[1] === row[1];
      return `<tr>${row.map((cell, column) => {
        if (column > 1 || !cell) return `<td>${escape(cell)}</td>`;
        if (sameFigure(rows[index - 1])) return '';
        let span = 1;
        while (sameFigure(rows[index + span])) span += 1;
        return `<td${span > 1 ? ` rowspan="${span}" class="review-merged-name"` : ''}>${escape(cell)}</td>`;
      }).join('')}</tr>`;
    }).join('');
  }

  function render(chapter) {
    activeChapter = chapter;
    document.title = `${chapter.label} · Questions for Review · Western Culture`;
    document.getElementById('review-chapter-title').textContent = `${chapter.label} · ${chapter.title}`;
    document.getElementById('review-count').textContent = `${chapter.parts.length} parts · ${chapter.count} review items`;
    document.querySelectorAll('[data-chapter]').forEach(link => {
      if (link.dataset.chapter === chapter.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    partNav.innerHTML = chapter.parts.map((part, index) => `<details ${index === 0 ? 'open' : ''} data-part="${part.id}"><summary>${escape(part.number)} · ${escape(part.title)}</summary><ul><li><a href="#chapter-${chapter.id}/${part.id}">View this part</a></li>${part.sections.map(s => `<li><a href="#chapter-${chapter.id}/${s.id}">${escape(s.code)} ${escape(s.title)}</a></li>`).join('')}</ul></details>`).join('');
    jump.innerHTML = '<option value="">Choose a section…</option>' + chapter.parts.map(part => `<optgroup label="${escape(part.number + ' · ' + part.title)}"><option value="${part.id}">View this part</option>${part.sections.map(s => `<option value="${s.id}">${escape(s.code + ' ' + s.title)}</option>`).join('')}</optgroup>`).join('') + (chapter.id === 'one' ? '<option value="appendix">Greek &amp; Roman mythology · Reference table</option>' : '');
    root.innerHTML = chapter.parts.map(part => `<section class="review-part" id="${part.id}" aria-labelledby="${part.id}-heading"><header class="review-part-heading"><span class="review-part-number">${escape(part.number)}</span><h3 id="${part.id}-heading">${escape(part.title)}</h3></header>${part.sections.map((s, index) => sectionHtml(s, chapter, index)).join('')}</section>`).join('');
    if (chapter.id === 'one') {
      root.insertAdjacentHTML('beforeend', `<section class="review-appendix" id="appendix" aria-labelledby="appendix-title"><h3 id="appendix-title">${escape(data.appendix.title)}</h3><p>Gods, heroes and other mythological figures · Adapted from the original PDF, pp. 17–18. Names and wording have been standardized in English. Relationships vary across ancient accounts; blank cells indicate information not listed in this table.</p><div class="review-table-wrap" tabindex="0" role="region" aria-label="Greek and Roman mythology reference table"><table><thead><tr>${data.appendix.headers.map(h => `<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${appendixRows(data.appendix.rows)}</tbody></table></div></section>`);
    }
    const next = data.chapters[(data.chapters.indexOf(chapter) + 1) % data.chapters.length];
    const nextLink = document.getElementById('review-next-chapter');
    nextLink.href = `#chapter-${next.id}`;
    nextLink.textContent = `${next.label} →`;
    reflectionCount();
  }

  function navigate(scroll = true) {
    const [chapterHash, sectionId] = location.hash.slice(1).split('/');
    const chapter = data.chapters.find(c => `chapter-${c.id}` === chapterHash) || data.chapters[0];
    if (chapter !== activeChapter) render(chapter);
    partNav.querySelectorAll('a').forEach(link => {
      if (link.hash === location.hash) {
        link.setAttribute('aria-current', 'location');
        link.closest('details').open = true;
      } else link.removeAttribute('aria-current');
    });
    jump.value = sectionId || '';
    const destination = sectionId ? document.getElementById(sectionId) : main;
    if (scroll && location.hash !== '#review-content') requestAnimationFrame(() => {
      (destination || main).scrollIntoView({ block: 'start', behavior: 'instant' });
      if (destination) { destination.tabIndex = -1; destination.focus({ preventScroll: true }); }
    });
  }

  root.addEventListener('change', event => {
    const input = event.target.closest('[data-reflection]');
    if (!input) return;
    if (input.checked) checks[input.dataset.reflection] = true;
    else delete checks[input.dataset.reflection];
    try { localStorage.setItem(storageKey, JSON.stringify(checks)); }
    catch { savingAvailable = false; }
    reflectionCount();
  });
  jump.addEventListener('change', () => { if (jump.value) location.hash = `chapter-${activeChapter.id}/${jump.value}`; });
  document.querySelectorAll('[data-chapter]').forEach(link => link.addEventListener('click', () => {
    if (data && link.hash === location.hash) navigate();
  }));
  addEventListener('hashchange', () => { if (data && location.hash !== '#review-content') navigate(); });
  fetch('question-list-data.json', { cache: 'no-store' }).then(response => {
    if (!response.ok) throw new Error('Question list unavailable');
    return response.json();
  }).then(result => { data = result; navigate(Boolean(location.hash)); }).catch(() => {
    root.innerHTML = '<p>问题清单暂时未能加载。请刷新页面，或<a href="https://assets.negentropylearning.com.cn/western-culture/assets/western-civilization-question-list.pdf">打开原 PDF</a>。</p>';
  });
})();
