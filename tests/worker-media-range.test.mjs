import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real worker media handler without loading the application server.
const source = fs.readFileSync(new URL('../worker/index.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };
vm.runInThisContext(`(function(require,module,exports){${code}\n})`)(name => {
  if (name === 'vinext/server/image-optimization') return {};
  if (name === 'vinext/server/app-router-entry') return { default: { fetch() { throw new Error('Unexpected app request'); } } };
  throw new Error(`Unexpected import: ${name}`);
}, module, module.exports);
const worker = module.exports.default;

for (const [name, header, range, offset, length] of [
  ['bounded', 'bytes=20-39', { offset: 20, length: 20 }, 20, 20],
  ['open ended', 'bytes=20-', { offset: 20 }, 20, 80],
  ['starting at zero', 'bytes=0-19', { length: 20 }, 0, 20],
  ['suffix', 'bytes=-20', { suffix: 20 }, 80, 20],
  ['suffix larger than object', 'bytes=-200', { suffix: 200 }, 0, 100],
]) {
  test(`media range: ${name} returns accurate headers and streams the body`, async () => {
    const body = new Uint8Array(length).fill(7);
    const response = await worker.fetch(new Request('https://local.test/media/test.wav', {
      headers: { range: header },
    }), { MEDIA: { async get(key, options) {
      assert.equal(key, 'test.wav');
      assert.equal(options.range.get('range'), header);
      return { size: 100, range, body, httpEtag: '"audio"', writeHttpMetadata(headers) { headers.set('content-type', 'audio/wav'); } };
    } } }, {});
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('content-range'), `bytes ${offset}-${offset + length - 1}/100`);
    assert.equal(response.headers.get('content-length'), String(length));
    assert.equal(response.headers.get('content-type'), 'audio/wav');
    assert.equal(response.headers.get('etag'), '"audio"');
    assert.equal(response.headers.get('accept-ranges'), 'bytes');
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), body);
  });
}

test('media request without Range keeps the complete response', async () => {
  const response = await worker.fetch(new Request('https://local.test/media/test.wav'), {
    MEDIA: { async get(key, options) {
      assert.equal(options, undefined);
      return { size: 3, body: new Uint8Array([1, 2, 3]), httpEtag: '"audio"', writeHttpMetadata() {} };
    } },
  }, {});
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-range'), null);
  assert.equal(response.headers.get('content-length'), '3');
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [1, 2, 3]);
});
