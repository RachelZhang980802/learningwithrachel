// Run against a local preview. Optionally set PLAYWRIGHT_MODULE_PATH and
// SYNTAX_BROWSER_PATH to use an existing Playwright/Chrome installation.
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browsers = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const engine = process.env.SYNTAX_BROWSER_ENGINE || 'chromium';
assert.ok(['chromium', 'webkit', 'firefox'].includes(engine));
const outputDir = process.env.SYNTAX_AUDIT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'syntax-label-audit-'));
fs.mkdirSync(outputDir, { recursive: true });
const baseURL = process.env.SYNTAX_BASE_URL || 'http://127.0.0.1:5173/';
const articleURL = id => { const url = new URL(baseURL); url.searchParams.set('open', 'reading'); url.searchParams.set('article', id); url.hash = 'text'; return url.href; };
const b = await browsers[engine].launch({ headless: true, ...(process.env.SYNTAX_BROWSER_PATH ? { executablePath: process.env.SYNTAX_BROWSER_PATH } : {}) });
const p = await b.newPage({ viewport: { width: 2048, height: 1188 } });
const errors = [];
p.on('pageerror', e => errors.push(e.message));
const measurements = () => p.locator('.syntax-copy').evaluateAll(copies => {
    let count = 0;
    const bad = [], collisions = [], textCollisions = [];
    for (const copy of copies) {
        const runs = [];
        let source = '';
        const walk = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
        let n;
        while (n = walk.nextNode()) {
            if (n.parentElement.closest('.syntax-label,.syntax-parenthesis'))
                continue;
            runs.push({ node: n, start: source.length, end: source.length + n.textContent.length });
            source += n.textContent;
        }
        const getRects = (start, end) => runs.flatMap(r => { const a = Math.max(start, r.start), z = Math.min(end, r.end); if (a >= z)
            return []; const range = document.createRange(); range.setStart(r.node, a - r.start); range.setEnd(r.node, z - r.start); return [...range.getClientRects()].filter(r => r.width && r.height); });
        // Native initial-letter ranges include unused descender space below the
        // visible capital. Inspect that decorative capital in screenshots;
        // check ordinary glyph boxes here without treating its blank space as ink.
        const allText = getRects(copy.classList.contains('syntax-opening-copy') ? 1 : 0, source.length);
        const rects = [];
        for (const clause of copy.querySelectorAll('.syntax-clause')) {
            count++;
            const tag = clause.querySelector('.syntax-label'), rect = tag.getBoundingClientRect();
            const rs = getRects(+clause.dataset.anchorStart, +clause.dataset.anchorEnd);
            const line = rs.filter(r => Math.abs(r.top - rs[0].top) < 3);
            const center = (Math.min(...line.map(r => r.left)) + Math.max(...line.map(r => r.right))) / 2;
            const scale = copy.getBoundingClientRect().width / parseFloat(getComputedStyle(copy).width);
            const stem = getComputedStyle(tag, '::after');
            const endpoint = rect.left + (parseFloat(stem.left) + 1) * scale;
            const delta = Math.abs(center - endpoint);
            const gap = Math.min(...line.map(r => r.top)) - rect.bottom;
            const row = { sentence: copy.closest('[data-sentence-id]').dataset.sentenceId, label: tag.textContent, word: source.slice(+clause.dataset.anchorStart, +clause.dataset.anchorEnd), delta, gap, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
            if (delta > 2 || gap < 1 || rect.left < -.5 || rect.right > innerWidth + .5 || getComputedStyle(tag).visibility !== 'visible' || getComputedStyle(tag).position !== 'absolute')
                bad.push(row);
            for (const r of allText)
                if (rect.left < r.right - .5 && r.left < rect.right - .5 && rect.top < r.bottom - .5 && r.top < rect.bottom - .5)
                    textCollisions.push(row);
            rects.push(row);
        }
        for (let i = 0; i < rects.length; i++)
            for (let j = i + 1; j < rects.length; j++) {
                const a = rects[i], c = rects[j];
                if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom)
                    collisions.push([a, c]);
            }
    }
    return { count, bad, collisions, textCollisions, overflow: document.documentElement.scrollWidth - innerWidth };
});
const results = [];
try {
    for (let article = 1; article <= 10; article++) {
        const id = String(article).padStart(2, '0');
        await p.goto(articleURL(id), { waitUntil: 'domcontentloaded' });
        await p.locator('.syntax-number').first().waitFor();
        // Observe repeated animation frames, not just one screenshot: a WebKit
        // drop-cap/rt feedback loop used to change this height continuously.
        for (const width of [390, 910, 2150]) {
            await p.setViewportSize({ width, height: 1282 });
            await p.locator('.syntax-number').first().click();
            await p.evaluate(() => document.fonts.ready);
            await p.waitForTimeout(300);
            const stability = await p.locator('.syntax-copy').first().evaluate(copy => new Promise(resolve => {
                const samples = [];
                const capture = () => {
                    const box = copy.getBoundingClientRect();
                    const labels = [...copy.querySelectorAll('.syntax-label')].map(tag => {
                        const r = tag.getBoundingClientRect();
                        return [r.x - box.x, r.y - box.y, r.width, r.height];
                    });
                    samples.push(JSON.stringify([box.width, box.height, copy.style.cssText, labels]));
                    if (samples.length < 60) requestAnimationFrame(capture);
                    else resolve({ unique: new Set(samples).size, height: box.height, width: box.width });
                };
                requestAnimationFrame(capture);
            }));
            assert.equal(stability.unique, 1, `${engine} ${id} ${width}: sentence must settle instead of flashing`);
            assert.ok(stability.height < 2000, `${id}: drop cap must not inflate the sentence`);
            await p.locator('.syntax-number').first().click();
        }
        const before = await p.locator('.vocabulary-highlight').evaluateAll(es => es.map(e => ({ text: e.textContent, color: getComputedStyle(e).backgroundColor, row: e.dataset.sourceRow, aria: e.getAttribute('aria-label') })));
        await p.locator('.syntax-number').evaluateAll(bs => bs.forEach(b => b.click()));
        await p.waitForTimeout(350);
        assert.deepEqual(await p.locator('.vocabulary-highlight').evaluateAll(es => es.map(e => ({ text: e.textContent, color: getComputedStyle(e).backgroundColor, row: e.dataset.sourceRow, aria: e.getAttribute('aria-label') }))), before);
        const expectedCount = Object.values(JSON.parse(fs.readFileSync(new URL('../app/article' + id + 'Syntax.json', import.meta.url), 'utf8'))).reduce((n, a) => n + a.clauses.filter(c => c.kind !== 'main').length, 0);
        const cases = [];
        for (const width of [320, 390, 600, 768, 910, 1280, 2048])
            for (const font of ['Futura', 'Georgia']) {
                await p.setViewportSize({ width, height: 1188 });
                await p.locator('.syntax-copy').evaluateAll((es, font) => es.forEach(e => e.style.fontFamily = font), font);
                await p.waitForTimeout(180);
                const m = await measurements();
                assert.equal(m.count, expectedCount);
                cases.push({ width, font, ...m });
                if (m.bad.length || m.collisions.length || m.textCollisions.length || m.overflow > 1) {
                    console.log('FAIL', id, width, font, JSON.stringify(m));
                    throw Error('Alignment check failed');
                }
            }
        await p.setViewportSize({ width: 2048, height: 1188 });
        for (const zoom of [.8, 1.25, 1.5, 1]) {
            await p.evaluate(z => document.body.style.zoom = String(z), zoom);
            await p.waitForTimeout(180);
            const m = await measurements();
            assert.equal(m.count, expectedCount);
            cases.push({ zoom, ...m });
            if (m.bad.length || m.collisions.length || m.textCollisions.length || m.overflow > 1) {
                console.log('FAIL zoom', id, zoom, JSON.stringify(m));
                throw Error('Zoom alignment failed');
            }
        }
        await p.locator('.syntax-copy').evaluateAll(es => es.forEach(e => e.style.fontFamily = 'Futura'));
        await p.waitForTimeout(200);
        await p.locator(`[data-sentence-id="${article === 1 ? 2 : 1}"]`).scrollIntoViewIfNeeded();
        await p.screenshot({ path: `${outputDir}/after-${id}-wide.png` });
        results.push({ id, cases });
        console.log(`PASS ${id}: ${cases[0].count} labels; 18 width/font/zoom cases; unchanged vocabulary.`);
        fs.writeFileSync(path.join(outputDir, 'results.json'), JSON.stringify(results, null, 2));
    }
    assert.deepEqual(errors, []);
    await p.goto(articleURL('01'), { waitUntil: 'domcontentloaded' });
    const navigation = [];
    for (let article = 1; article <= 10; article++) {
        const id = String(article).padStart(2, '0');
        await p.locator(`.syntax-reading[data-article="${id}"]`).waitFor();
        assert.equal(await p.locator('.syntax-number[aria-expanded="true"]').count(), 0, `${id}: expansion from previous article must not leak`);
        const first = p.locator('.syntax-number').first();
        await first.focus();
        await p.keyboard.press('Enter');
        assert.equal(await first.getAttribute('aria-expanded'), 'true');
        await p.keyboard.press('Enter');
        assert.equal(await first.getAttribute('aria-expanded'), 'false');
        for (const overlap of [false, true]) {
            await p.locator('.syntax-number').evaluateAll(bs => bs.forEach(b => { if (b.getAttribute('aria-expanded') === 'false')
                b.click(); }));
            await p.waitForTimeout(150);
            const m = await measurements();
            assert.deepEqual(m.bad, []);
            assert.deepEqual(m.collisions, []);
            assert.deepEqual(m.textCollisions, []);
            assert.ok(await p.locator('.syntax-notes[lang="zh-CN"]').count());
            let word = p.locator(overlap ? '#text .vocabulary-highlight:has(.syntax-predicate)' : '#text .vocabulary-highlight').first();
            if (!await word.count())
                word = p.locator('#text .vocabulary-highlight').first();
            const label = (await word.getAttribute('aria-label')).replace(/^查看词汇 /, '').replace(/^查看 /, '').replace(/ 的词汇卡$/, '');
            const sentence = await word.evaluate(el => el.closest('[data-sentence-id]').dataset.sentenceId);
            await word.click();
            await p.locator('.word-picker').waitFor();
            assert.equal((await p.locator('.word-picker button[aria-pressed="true"]').innerText()).trim(), label.trim());
            await p.locator('.notebook-tab-structure').click();
            await p.locator('.clause-entry').click();
            await p.locator('.sentence-diagram').waitFor();
            assert.doesNotMatch(await p.locator('.sentence-diagram').innerText(), /[\u3400-\u9fff]/);
            assert.match(await p.locator('.notebook-analysis-note').innerText(), /[\u3400-\u9fff]/);
            await p.getByRole('link', { name: 'Text', exact: true }).click();
            await p.locator(`.syntax-reading[data-article="${id}"]`).waitFor();
            navigation.push({ id, sentence, label, overlap });
        }
        // Leave marks open when moving to the next article, the user's failing path.
        await p.locator('.syntax-number').evaluateAll(bs => bs.slice(0, 3).forEach(b => { if (b.getAttribute('aria-expanded') === 'false')
            b.click(); }));
        if (article < 10)
            await p.getByRole('button', { name: 'Next article', exact: true }).click();
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(outputDir, 'navigation.json'), JSON.stringify(navigation, null, 2));
    console.log('Audit output:', outputDir);
    console.log('PASS: sequential article navigation, keyboard toggles, 20 vocabulary jumps and corresponding Structure/Chinese explanations.');
}
finally {
    await b.close();
}
