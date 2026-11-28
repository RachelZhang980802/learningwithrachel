import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { chmod, copyFile, link, lstat, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function sha256File(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}

export async function releaseManifest(directory) {
  const files = {};
  async function visit(relativePath) {
    const path = join(directory, relativePath);
    const info = await lstat(path);
    if (info.isDirectory()) {
      for (const name of (await readdir(path)).sort()) await visit(`${relativePath}/${name}`);
    } else if (info.isFile()) {
      files[relativePath] = { sha256: await sha256File(path), executable: Boolean(info.mode & 0o111) };
    } else {
      throw new Error(`Unsupported release file: ${relativePath}`);
    }
  }
  await visit('public');
  await visit('server');
  const { sourceCommit } = JSON.parse(await readFile(join(directory, 'deployment.json'), 'utf8'));
  return { sourceCommit, files };
}

export function sameFile(previous, next) {
  return previous?.sha256 === next.sha256 && previous.executable === next.executable;
}

export function manifestFingerprint(manifest) {
  const entries = Object.keys(manifest.files).sort().map(path => {
    const { sha256, executable } = manifest.files[path];
    return [path, sha256, executable];
  });
  return createHash('sha256').update(JSON.stringify(entries)).digest('hex');
}

function checkFilePath(path) {
  const [directory, ...parts] = path.split('/');
  if (!['server', 'public'].includes(directory) || !parts.length ||
      parts.some(part => !part || part === '.' || part === '..' || part.includes('\\'))) {
    throw new Error(`Invalid release path: ${path}`);
  }
}

export async function prepareIncrementalRelease(bundle, previous, destination) {
  const delta = JSON.parse(await readFile(join(bundle, 'incremental.json'), 'utf8'));
  const baseline = await releaseManifest(previous);
  if (delta.format !== 1 || baseline.sourceCommit !== delta.baseCommit ||
      manifestFingerprint(baseline) !== delta.baseFingerprint) {
    throw new Error('The active release does not match the incremental base. No changes were applied.');
  }
  const deploymentPath = join(bundle, 'deployment.json');
  const deployment = JSON.parse(await readFile(deploymentPath, 'utf8'));
  if (delta.target.sourceCommit !== deployment.sourceCommit) throw new Error('Incremental target commit mismatch.');
  const entries = Object.entries(delta.target.files);
  for (const [path, file] of entries) {
    checkFilePath(path);
    if (sameFile(baseline.files[path], file)) continue;
    const payload = join(bundle, 'payload', path);
    if (!(await lstat(payload)).isFile() || await sha256File(payload) !== file.sha256) {
      throw new Error(`Incremental payload mismatch: ${path}`);
    }
  }
  if (!delta.target.files['server/index.mjs']) throw new Error('Missing application entry point.');
  await mkdir(destination, { mode: 0o755 });
  try {
    for (const component of ['server', 'public']) await mkdir(join(destination, component), { mode: 0o755 });
    for (const [path, file] of entries) {
      const dest = join(destination, path);
      await mkdir(dirname(dest), { recursive: true, mode: 0o755 });
      if (sameFile(baseline.files[path], file)) {
        await link(join(previous, path), dest);
      } else {
        await copyFile(join(bundle, 'payload', path), dest);
        await chmod(dest, file.executable ? 0o755 : 0o644);
      }
    }
    await copyFile(deploymentPath, join(destination, 'deployment.json'));
  } catch (error) {
    await rm(destination, { recursive: true, force: true });
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [bundle, previous, destination] = process.argv.slice(2);
  if (!bundle || !previous || !destination) throw new Error('Usage: incremental-release.mjs BUNDLE PREVIOUS DESTINATION');
  process.umask(0o022);
  await prepareIncrementalRelease(bundle, previous, destination);
}
