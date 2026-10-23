import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { resolve, relative, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const { match } = require('next/dist/compiled/path-to-regexp');
const root = process.cwd();
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
  if(routes.some(test=>test('/'+encodeURI(rel)))){omitted++;return false;}
  return true;
}});
async function audit(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  const p=resolve(dir,entry.name);
  if(entry.isDirectory())await audit(p);
  else if(entry.isSymbolicLink()||entry.name.endsWith('.node'))throw new Error('Unexpected platform-dependent file: '+p);
}}
await audit(bundle);
for(const name of ['install-preview.sh','update-release.sh','nginx-preview.conf','learningwithrachel.service']){
 await cp(resolve(root,'deploy/aliyun',name),resolve(bundle,name));
}
const commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
await writeFile(resolve(bundle,'deployment.json'),JSON.stringify({sourceCommit:commit,builtAt:new Date().toISOString(),preset:'node-server',omittedMediaFiles:omitted,resourceRules:routes.length},null,2)+'\n');
const archive=resolve(output,'learningwithrachel-aliyun.tar.gz');
execFileSync('tar',['-czf',archive,'-C',output,'learningwithrachel'],{env:{...process.env,COPYFILE_DISABLE:'1'}});
const hash=createHash('sha256').update(await readFile(archive)).digest('hex');
await writeFile(resolve(output,'SHA256SUMS'),hash+'  '+basename(archive)+'\n');
console.log(JSON.stringify({archive,sha256:hash,bytes:(await stat(archive)).size,omittedMediaFiles:omitted}));
