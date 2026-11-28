import assert from 'node:assert/strict';
import { chmod, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { manifestFingerprint, prepareIncrementalRelease, releaseManifest } from '../deploy/aliyun/incremental-release.mjs';

async function put(directory, path, data) {
  const filename = join(directory, path);
  await mkdir(dirname(filename), { recursive: true });
  await writeFile(filename, data);
  return filename;
}

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'test-rachel-delta-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const previous = join(root, 'previous');
  const expected = join(root, 'expected');
  const bundle = join(root, 'bundle');
  const destination = join(root, 'destination');
  await put(previous, 'deployment.json', '{"sourceCommit":"old"}');
  await put(expected, 'deployment.json', '{"sourceCommit":"next"}');
  await put(bundle, 'deployment.json', '{"sourceCommit":"next"}');
  for (const directory of [previous, expected]) await put(directory, 'public/unchanged.png', 'unchanged-media');
  await put(previous, 'server/index.mjs', 'old code');
  await put(previous, 'public/old/path.js', 'old asset');
  await put(expected, 'server/index.mjs', 'new code');
  await put(expected, 'public/old', 'file replaces directory');
  await chmod(await put(expected, 'server/launcher', 'launch'), 0o755);
  await put(bundle, 'payload/server/index.mjs', 'new code');
  await put(bundle, 'payload/public/old', 'file replaces directory');
  await put(bundle, 'payload/server/launcher', 'launch');
  const base = await releaseManifest(previous);
  const target = await releaseManifest(expected);
  await put(bundle, 'incremental.json', JSON.stringify({
    format: 1, baseCommit: base.sourceCommit, baseFingerprint: manifestFingerprint(base), target,
  }));
  return { previous, bundle, destination, target };
}

test('incremental release shares unchanged files and preserves the prior version', async t => {
  const { previous, bundle, destination, target } = await fixture(t);
  await prepareIncrementalRelease(bundle, previous, destination);
  assert.deepEqual(await releaseManifest(destination), target);
  const shared = 'public/unchanged.png';
  assert.equal((await stat(join(destination, shared))).ino, (await stat(join(previous, shared))).ino);
  assert.equal(await readFile(join(previous, 'server/index.mjs'), 'utf8'), 'old code');
  assert.equal(await readFile(join(previous, 'public/old/path.js'), 'utf8'), 'old asset');
  assert.equal(await readFile(join(destination, 'public/old'), 'utf8'), 'file replaces directory');
  assert.equal((await stat(join(destination, 'server/launcher'))).mode & 0o777, 0o755);
});

test('a modified active file or corrupt payload stops incremental preparation before writing a release', async t => {
  const { previous, bundle, destination } = await fixture(t);
  await put(previous, 'server/index.mjs', 'unrecorded local edit');
  await assert.rejects(prepareIncrementalRelease(bundle, previous, destination), /active release does not match/);
  await assert.rejects(stat(destination), { code: 'ENOENT' });
  await put(previous, 'server/index.mjs', 'old code');
  await put(bundle, 'payload/server/index.mjs', 'corrupted');
  await assert.rejects(prepareIncrementalRelease(bundle, previous, destination), /payload mismatch/);
  await assert.rejects(stat(destination), { code: 'ENOENT' });
});
