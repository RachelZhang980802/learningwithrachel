(() => {
  const $ = s => document.querySelector(s);
  const units = {
    'greece-1': ['Greece I', 'Origins, Myth & Polis', 0, 0, 4],
    'greece-2': ['Greece II', 'Classical & Hellenistic Worlds', 0, 4, 7],
    'rome-1': ['Rome I', 'Kingdom & Republic', 1, 0],
    'rome-2': ['Rome II', 'Empire & Transformation', 2, 0]
  };
  const children = node => Object.values(node.children || {}).flat();
  let sheets, pending, page = 0, items = [], leafPages = [], currentNode, detail = false;
  const mobile = matchMedia('(max-width:800px)');
  const size = () => mobile.matches ? 1 : 4;
  const text = (tag, value) => { const e = document.createElement(tag); e.textContent = value; return e; };
  function path() { return location.hash.slice(1).split('/').filter(Boolean); }
  function draw() {
    const root = $('#node-content'); root.replaceChildren();
    const showCards = items.length && !detail;
    const total = showCards ? Math.ceil(items.length / size()) : Math.max(1, leafPages.length);
    page = Math.max(0, Math.min(page, total - 1));
    root.classList.toggle('single', !showCards);
    if (showCards) {
      items.slice(page * size(), (page + 1) * size()).forEach((node, i) => {
        const card = document.createElement('a'); card.className = 'topic-card';
        card.href = '#' + [...path(), page * size() + i].join('/');
        card.append(text('small', String(page * size() + i + 1).padStart(2, '0')),
          text('h2', node.title?.length > 150 ? node.title.slice(0,150) + '...' : node.title || 'Source image'), text('span', children(node).length ? `${children(node).length} topics →` : 'Read →'));
        root.append(card);
      });
    } else {
      const article = document.createElement('article'); article.className = 'leaf';
      const content = leafPages[page];
      if (content?.image) {
        const link = document.createElement('a'); link.href = content.image; link.target = '_blank'; link.rel = 'noopener';
        const img = document.createElement('img'); img.src = content.image; img.alt = currentNode?.title || 'Original mind-map image';
        link.append(img); article.append(link);
      } else article.append(text('p', content || 'End of this branch.'));
      root.append(article);
    }
    $('#page-count').textContent = `${page + 1} / ${total}`;
    $('#prev').disabled = page === 0; $('#next').disabled = page >= total - 1;
  }
  async function load() {
    if (sheets) return sheets;
    if (!pending) pending = fetch('assets/course-mindmap.json').then(r => {
      if (!r.ok) throw Error('Course map unavailable'); return r.json();
    }).then(d => sheets = d).catch(e => { pending = null; throw e; });
    return pending;
  }
  async function route() {
    const current = location.hash, parts = path(), unit = units[parts[0]];
    const open = Boolean(unit);
    $('#chapter-map').hidden = open; $('#unit-stage').hidden = !open;
    document.body.classList.toggle('in-unit', open);
    document.querySelectorAll('[data-world]').forEach(a => {
      a.removeAttribute('aria-current');
      if (parts[0]?.startsWith(a.dataset.world)) a.setAttribute('aria-current', 'page');
    });
    if (!open) { document.title = 'Greco-Roman Cultures | Chapter Map'; return; }
    $('#unit-label').textContent = unit[0]; $('#node-title').textContent = unit[1];
    $('#node-content').replaceChildren(text('p', 'Loading course map...'));
    $('#up-link').href = parts.length > 1 ? '#' + parts.slice(0, -1).join('/') : 'greece-map.html';
    try {
      await load(); if (current !== location.hash) return;
      items = children(sheets[unit[2]].rootTopic).slice(unit[3], unit[4]);
      let node = null;
      for (const index of parts.slice(1)) {
        if (!/^\d+$/.test(index) || !items[Number(index)]) throw Error('Topic not found');
        node = items[Number(index)]; items = children(node);
      }
      page = 0; detail = false; currentNode = node;
      const title = node?.title?.trim() || unit[1];
      // Paginate full source statements without summarizing the original wording.
      const statement = [node?.title, node?.notes?.plain?.content].filter(Boolean).join('\n\n');
      const words = statement.split(/\s+/); leafPages = [];
      for (let i = 0; i < words.length; i += 65) leafPages.push(words.slice(i, i + 65).join(' '));
      if (node?.image?.src?.startsWith('xap:resources/')) leafPages.unshift({image:'https://assets.negentropylearning.com.cn/western-culture/assets/xmind/' + node.image.src.slice(4)});
      $('#source-detail').hidden = !node || !items.length;
      $('#source-detail').textContent = 'Source detail';
      $('#node-title').textContent = title.length > 180 ? 'Source detail' : title;
      document.title = `${unit[0]} | ${title.slice(0, 100)}`;
      draw(); $('#node-title').focus({preventScroll:true});
    } catch (error) {
      if (current !== location.hash) return;
      const retry = text('button', 'Try again'); retry.addEventListener('click', route);
      $('#node-content').replaceChildren(text('p', error.message), retry);
      $('#prev').disabled = $('#next').disabled = true;
    }
  }
  $('#prev').addEventListener('click', () => { page--; draw(); });
  $('#source-detail').addEventListener('click', () => {
    detail = !detail; page = 0; $('#source-detail').textContent = detail ? 'Chapter cards' : 'Source detail'; draw();
  });
  $('#next').addEventListener('click', () => { page++; draw(); });
  mobile.addEventListener('change', () => { page = 0; if (sheets) draw(); });
  addEventListener('hashchange', route); route();
})();
