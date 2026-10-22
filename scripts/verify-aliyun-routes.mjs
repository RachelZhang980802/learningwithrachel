import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=process.cwd();
const base=process.env.ALIYUN_TEST_URL ?? 'http://127.0.0.1:8080';
const manifest=JSON.parse(await readFile(root+'/releases/2026-10-22/assets.json'));
const config=JSON.parse(await readFile(root+'/vercel.json'));
const files=manifest.files;
const checks=files.map(f=>({path:'/'+encodeURI(f.path),destination:'https://assets.negentropylearning.com.cn/releases/2026-10-22/'+encodeURI(f.path)}));
checks.push(...config.redirects.filter(r=>!r.source.includes(':path')).map(r=>({path:r.source,destination:r.destination})));
for(let i=0;i<checks.length;i+=24)await Promise.all(checks.slice(i,i+24).map(async c=>{const r=await fetch(base+c.path+'?test=aliyun',{redirect:'manual'});assert.equal(r.status,307,c.path);assert.equal(r.headers.get('location'),c.destination+'?test=aliyun',c.path);}));
for(const path of ['/essential-grammar-4/review.html','/mindmaps/index.html','/quiz-designs/index.html']){const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,200,path);}
console.log(JSON.stringify({resourceRequestsPassed:checks.length,htmlPagesPassed:3}));
