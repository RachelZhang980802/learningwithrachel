import { cp, mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { resolve, relative, basename, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { manifestFingerprint, releaseManifest, sameFile, sha256File } from '../deploy/aliyun/incremental-release.mjs';
const require = createRequire(import.meta.url);
const { match } = require('next/dist/compiled/path-to-regexp');
const root = process.cwd();
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--base')) {
  throw new Error('Usage: node scripts/package-aliyun.mjs [--base FULL_ARCHIVE_OR_RELEASE_MANIFEST]');
}
const baselinePath = args[1] && resolve(args[1]);
const baseline = baselinePath ? await readBaseline(baselinePath) : null;
if (baseline && (!/^[0-9a-f]{40}$/.test(baseline.sourceCommit) || !baseline.files['server/index.mjs'])) {
  throw new Error('Invalid baseline release manifest.');
}

async function readBaseline(path) {
  if (path.endsWith('.json')) return JSON.parse(await readFile(path, 'utf8'));
  const stage = await mkdtemp(join(tmpdir(), 'rachel-base-'));
  try {
    execFileSync('tar', ['-xzf', path, '-C', stage], { stdio: 'inherit' });
    return await releaseManifest(join(stage, 'learningwithrachel'));
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
}
const hosting = JSON.parse(await readFile(resolve(root,'vercel.json'),'utf8'));
const routes = hosting.redirects.map(r=>match(r.source));
const output = resolve(root,'dist/aliyun');
const bundle = resolve(output,'learningwithrachel');
await rm(output,{recursive:true,force:true});
await mkdir(bundle,{recursive:true});
await cp(resolve(root,'.output/server'),resolve(bundle,'server'),{recursive:true});
const publicRoot=resolve(root,'.output/public');
let omitted=0;
await cp(publicRoot,resolve(bundle,'public'),{recursive:true,filter:async p=>{
  const rel=relative(publicRoot,p).replaceAll('\\','/');
  if(basename(p)==='.DS_Store'||rel==='qa'||rel.startsWith('qa/'))return false;
  if((await stat(p)).isDirectory())return true;
  // Mindmap pages are self-contained static apps. Keep their modules, data,
  // fonts and artwork version-matched with the HTML instead of redirecting to R2.
  if(rel.startsWith('mindmaps/'))return true;
  // The new More page background ships with its CSS, outside the legacy R2 snapshot.
  if(rel==='inquire-assets/more-floral-background.png')return true;
  if(routes.some(test=>test('/'+encodeURI(rel)))){omitted++;return false;}
  return true;
}});
async function audit(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  const p=resolve(dir,entry.name);
  if(entry.isDirectory())await audit(p);
  else if(entry.isSymbolicLink()||entry.name.endsWith('.node'))throw new Error('Unexpected platform-dependent file: '+p);
}}
await audit(bundle);
execFileSync(process.execPath,[resolve(root,'scripts/verify-narrative-package.mjs')],{cwd:root,stdio:'inherit'});
for(const name of ['install-preview.sh','update-release.sh','nginx-preview.conf','learningwithrachel.service']){
 await cp(resolve(root,'deploy/aliyun',name),resolve(bundle,name));
}
const commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
await writeFile(resolve(bundle,'deployment.json'),JSON.stringify({sourceCommit:commit,builtAt:new Date().toISOString(),preset:'node-server',omittedMediaFiles:omitted,resourceRules:routes.length},null,2)+'\n');
const target = await releaseManifest(bundle);
const manifestPath = resolve(root, 'dist/aliyun-manifests', `${commit}.json`);
await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, JSON.stringify(target) + '\n');

const archive = resolve(output, baseline ? 'learningwithrachel-incremental.tar.gz' : 'learningwithrachel-aliyun.tar.gz');
let changedFiles;
if (baseline) {
  const stage = await mkdtemp(join(tmpdir(), 'rachel-delta-'));
  try {
    const delta = join(stage, 'learningwithrachel');
    await mkdir(delta);
    const changed = Object.entries(target.files).filter(([path, file]) => !sameFile(baseline.files[path], file));
    changedFiles = changed.length;
    for (const [path] of changed) {
      const destination = join(delta, 'payload', path);
      await mkdir(dirname(destination), { recursive: true });
      await cp(join(bundle, path), destination);
    }
    await cp(join(bundle, 'deployment.json'), join(delta, 'deployment.json'));
    await cp(join(bundle, 'update-release.sh'), join(delta, 'update-release.sh'));
    await cp(resolve(root, 'deploy/aliyun/incremental-release.mjs'), join(delta, 'incremental-release.mjs'));
    await writeFile(join(delta, 'incremental.json'), JSON.stringify({
      format: 1, baseCommit: baseline.sourceCommit, baseFingerprint: manifestFingerprint(baseline), target,
    }) + '\n');
    archiveRelease(stage);
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
} else {
  archiveRelease(output);
}

function archiveRelease(parent) {
  execFileSync('tar', ['-czf', archive, '-C', parent, 'learningwithrachel'], {
    env: { ...process.env, COPYFILE_DISABLE: '1' },
  });
}
const hash = await sha256File(archive);
await writeFile(resolve(output, 'SHA256SUMS'), hash + '  ' + basename(archive) + '\n');
console.log(JSON.stringify({
  archive, sha256: hash, bytes: (await stat(archive)).size, omittedMediaFiles: omitted,
  manifest: manifestPath, baseCommit: baseline?.sourceCommit, changedFiles,
}));
