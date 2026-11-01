import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {designs} from '../public/mindmaps/atlas-designs.js';
const base=new URL('../public/mindmaps/data/',import.meta.url);
const articles=JSON.parse(await readFile(new URL('worksheets.json',base),'utf8'));
const luminance=hex=>{const rgb=hex.match(/[a-f\d]{2}/gi).map(n=>parseInt(n,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
test('ten distinct six-colour themes retain readable heading contrast',()=>{
 assert.equal(articles.length,10);
 assert.equal(new Set(articles.map(a=>designs[a.id].palette.join(','))).size,10);
 for(const a of articles){const d=designs[a.id];assert.equal(new Set(d.palette).size,6);assert.equal(d.fills.length,6);for(const c of d.palette)assert.ok(1.05/(luminance(c)+.05)>=4.5,`${a.id}: white text on ${c} needs more contrast`);}
});
for(const article of articles){
 test(`${article.id}: branches refer to actual nodes of the supplied original map`,async()=>{
  const source=JSON.parse(await readFile(new URL(`${article.id}.json`,base),'utf8'));
  const sourceIds=new Set(source.scenes.flatMap(s=>s.nodes.map(n=>n.id))),covered=new Set(),ids=new Set();
  assert.equal(article.title,source.title);
  for(const section of article.figure.sections){
   assert.ok(section.title&&section.sourceIds.length&&section.paragraphs.length);
   assert.ok(!ids.has(section.id));ids.add(section.id);
   for(const item of [section,...section.cards]){
    assert.ok(item.sourceIds.length>0);
    item.sourceIds.forEach(id=>assert.ok(sourceIds.has(id),`Unknown original node: ${id}`));
    item.paragraphs.forEach(p=>{assert.ok(Number.isInteger(p)&&p>=1&&p<=source.paragraphs.length);covered.add(p);});
   }
   for(const card of section.cards){assert.ok(card.zh&&card.title);assert.ok(!ids.has(card.id));ids.add(card.id);assert.ok(card.paragraphs.every(p=>section.paragraphs.includes(p)));}
  }
  assert.deepEqual([...covered].sort((a,b)=>a-b),source.paragraphs.map((_,i)=>i+1));
 });
 test(`${article.id}: ten short answer gaps within bullet points and comparison pairs`,()=>{
  let count=0;
  const inspectText=text=>{assert.ok(text.trim());assert.ok(text.split(/\s+/).length<=18,`Use concise phrases: ${text}`);const m=[...text.matchAll(/\[\[([^\]]+)\]\]/g)];assert.equal(m.length,(text.match(/\[\[/g)||[]).length);assert.equal(m.length,(text.match(/\]\]/g)||[]).length);for(const x of m)assert.ok(x[1].split(/\s+/).length<=3);count+=m.length;};
  const inspect=(items,depth=0)=>{assert.ok(depth<=1);for(const b of items){inspectText(b.text);if(b.children)inspect(b.children,depth+1);}};
  for(const section of article.figure.sections){
   assert.ok(['branches','sequence','comparison'].includes(section.layout));
   if(section.layout==='comparison'){assert.equal(section.headers.length,2);assert.ok(section.pairs.length>0);section.pairs.forEach(p=>{inspectText(p.left);inspectText(p.right);});}
   else{assert.ok(section.cards.length>0);section.cards.forEach(card=>{assert.ok(card.bullets.length>=2);inspect(card.bullets);});}
  }
  assert.equal(count,10);
 });
}
test('distinctive structures from the original maps are preserved',()=>{
 const section=id=>articles.find(a=>a.id===id).figure.sections;
 assert.deepEqual(section('01').map(s=>s.title),['Introduction','The Method','Conclusion']);
 assert.deepEqual(section('03')[1].cards.map(c=>c.title),['Childhood','Graduate school','Established adulthood']);
 assert.deepEqual(section('06').map(s=>s.title),['Franklin as a Reader','Franklin as a Writer']);
 assert.deepEqual(section('08').slice(1).map(s=>s.title),['Mechanisms','Consequences','Solutions · Attitude & Action']);
 for(const card of section('07')[1].cards.slice(0,3))assert.deepEqual(card.bullets.map(b=>b.text),['Why?','How?','Result']);
 assert.equal(section('10')[1].pairs.length,8,'Seven landscape pairs plus the response to them');
});
