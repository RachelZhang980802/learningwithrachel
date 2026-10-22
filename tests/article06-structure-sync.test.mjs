import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=process.env.ARTICLE06_PROJECT_ROOT || path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json')),ts=require('typescript'),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.startsWith('.')?(name.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')):load(path.resolve(path.dirname(file),name+'.ts'))):require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);return module.exports;
}
const {getLesson,vocabularyMatches}=load(path.join(root,'app/articleLessons.ts'));
const {article06Annotations:annotations,article06SyntaxKey:key,withArticle06Structure}=load(path.join(root,'app/article06Structure.ts'));
const raw=JSON.parse(fs.readFileSync(path.join(root,'app/article06to10Lessons.json'),'utf8'));
const lesson=getLesson('06');
const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children)]);
const frames=id=>flat(lesson.sentences[id-1].structureNodes).filter(n=>n.kind==='clause');


test('all 49 sentences retain original content, Chinese explanations and vocabulary destinations',()=>{
  assert.equal(lesson.sentences.length,49);assert.deepEqual(lesson.vocabulary,raw['06'].vocabulary);
  for(const [i,s]of lesson.sentences.entries()){
    const original=raw['06'].sentences[i];
    for(const f of ['id','paragraph','audioSrc','translation','classification','paraphrase','reuse','pdfNotes'])assert.deepEqual(s[f],original[f],`${s.id}: ${f}`);
    assert.ok(s.note.includes(original.note));
    const {fullArticleParagraphs}=load(path.join(root,'app/suppliedArticles.ts'));
    assert.equal(fullArticleParagraphs[5][s.paragraph-1].slice(s.paragraphStart,s.paragraphEnd),s.text);
    const destinations=(owner,text)=>vocabularyMatches(owner,s.id,text).map(v=>({sourceRow:v.sourceRow,word:v.word,form:text.slice(v.start,v.end)}));
    assert.deepEqual(destinations(lesson,s.text),destinations(raw['06'],original.text));
  }
});
test('exact ranges partition every sentence once with valid nested structures',()=>{
  for(const s of lesson.sentences){
    assert.equal(s.functions.map(([,t])=>t).join(''),s.text);
    function visit(nodes,start,end){let cursor=start;for(const n of nodes){assert.equal(n.start,cursor);assert.ok(n.end>n.start&&n.end<=end);assert.equal(n.text,s.text.slice(n.start,n.end));if(n.kind==='clause')visit(n.children,n.start,n.end);cursor=n.end;}assert.equal(cursor,end);}
    visit(s.structureNodes,0,s.text.length);
  }
});
test('all 125 frames share source ranges, English labels and palette with the reading annotations',()=>{
  let count=0;for(const s of lesson.sentences){
    assert.equal(s.structureEnglishOnly,true);assert.doesNotMatch(s.structureClassification.label+s.structureClassification.priorityLabel,/[\u3400-\u9fff]/);
    for(const n of flat(s.structureNodes))assert.doesNotMatch(n.englishLabel,/[\u3400-\u9fff]/);
    for(const c of annotations[s.id].clauses){
      const found=frames(s.id).filter(n=>n.start===c.start&&n.end===c.end&&n.englishLabel===(c.label??key[c.kind].label));
      assert.equal(found.length,1);assert.equal(found[0].syntaxColor,c.color??key[c.kind].color);count++;
    }
  }assert.equal(count,125);
});
test('all 168 predicate spans share main/subordinate roles and exact letter coverage',()=>{
  let count=0;for(const s of lesson.sentences){const units=flat(s.structureNodes).filter(n=>n.kind==='unit');
    for(const p of annotations[s.id].predicates){
      assert.equal(p.text,s.text.slice(p.start,p.end));
      const sub=annotations[s.id].clauses.some(c=>!['main','quote'].includes(c.kind)&&c.start<=p.start&&p.end<=c.end);assert.equal(p.role,sub?'sub':'main');
      for(let i=p.start;i<p.end;i++)if(/[A-Za-z]/.test(s.text[i])){const n=units.find(n=>n.start<=i&&i<n.end);assert.equal(n.predicateRole,p.role);assert.equal(n.syntaxColor,p.role==='main'?'#ff2500':'#feb72e');}count++;
    }
    for(const n of units.filter(n=>n.predicateRole))for(let i=n.start;i<n.end;i++)if(/[A-Za-z]/.test(s.text[i]))assert.ok(annotations[s.id].predicates.some(p=>p.start<=i&&i<p.end));
  }assert.equal(count,168);
});
test('archaic source, ellipsis, reporting layers and phrasal particles retain exact roles',()=>{
  assert.ok(lesson.sentences[1].text.includes("the The Pilgrim's Progress, my first collection was"));
  assert.deepEqual(annotations[2].predicates.map(p=>p.text),['was']);
  assert.ok(frames(4).some(n=>n.englishLabel==='Elliptical main clause'&&n.excerpt==='[I]'));
  assert.ok(frames(4).some(n=>n.englishLabel==='Subject clause'));
  assert.ok(!frames(5).some(n=>n.englishLabel==='Object clause'));
  const outer6=frames(6).find(n=>n.antecedent==='Essays to Do Good');
  assert.ok(flat(outer6.children).some(n=>n.antecedent==='a turn of thinking'));
  assert.ok(!annotations[16].predicates.some(p=>p.text.includes('returned')));
  assert.ok(frames(16).some(n=>n.englishLabel==='Purpose clause'));
  assert.deepEqual(annotations[21].predicates.map(p=>p.text),['sold']);
  assert.ok(frames(21).some(n=>n.englishLabel==='Absolute construction'));
  const relative25=frames(25).find(n=>n.text.startsWith('which disputatious turn'));
  assert.equal(relative25.end,lesson.sentences[24].text.length);
  assert.equal(annotations[25].predicates.filter(p=>p.text==='is').length,3);
  assert.equal(frames(29).filter(n=>n.englishLabel==='Appositive clause').length,2);
  assert.ok(annotations[31].predicates.some(p=>p.text==='down'&&p.role==='main'));
  assert.ok(frames(41).some(n=>n.englishLabel==='Reduced conditional clause'&&n.excerpt==='[it was]'));
  assert.ok(annotations[42].predicates.some(p=>p.text==='by'&&p.role==='main'));
  const reported44=frames(44).find(n=>n.englishLabel==='Object clause'&&n.text.startsWith('I should'));
  assert.ok(flat(reported44.children).some(n=>n.englishLabel==='Conditional clause'));
  assert.ok(flat(reported44.children).some(n=>n.englishLabel==='Reason clause'));
  assert.ok(!annotations[44].predicates.some(p=>/fix|make/.test(p.text)));
  assert.equal(frames(48).filter(n=>n.englishLabel==='Main clause').length,3);
  const firstWhich49=frames(49).find(n=>n.text.startsWith('which my father'));
  assert.ok(flat(firstWhich49.children).some(n=>n.englishLabel==='Time clause'));
  const concession49=frames(49).find(n=>n.englishLabel==='Concessive clause');
  assert.ok(flat(concession49.children).some(n=>n.englishLabel==='Parenthetical comment'));
  const comparison49=frames(49).find(n=>n.englishLabel==='Comparative clause');
  assert.equal(comparison49.text.trim(),'as I could');
});
test('changed source fails safely and other articles are not processed by the Article 06 adapter',()=>{
  const edited={...raw['06'].sentences[0],text:'New text.'};assert.equal(withArticle06Structure(edited),edited);
  for(const id of ['07','08','09','10'])for(const s of raw[id].sentences)assert.equal(withArticle06Structure(s),s);
});
