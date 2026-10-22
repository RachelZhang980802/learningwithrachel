import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=process.env.ARTICLE10_PROJECT_ROOT || path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json')),ts=require('typescript'),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.startsWith('.')?(name.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')):load(path.resolve(path.dirname(file),name+'.ts'))):require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);return module.exports;
}
const {getLesson,vocabularyMatches}=load(path.join(root,'app/articleLessons.ts'));
const {article10Annotations:annotations,article10SyntaxKey:key,withArticle10Structure}=load(path.join(root,'app/article10Structure.ts'));
const raw=JSON.parse(fs.readFileSync(path.join(root,'app/article06to10Lessons.json'),'utf8'));
const lesson=getLesson('10');
const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children)]);
const frames=id=>flat(lesson.sentences[id-1].structureNodes).filter(n=>n.kind==='clause');

test('26 sentences retain source, notes, audio, translation and all vocabulary destinations',()=>{
  assert.equal(lesson.sentences.length,26);assert.deepEqual(lesson.vocabulary,raw['10'].vocabulary);
  for(const [i,s]of lesson.sentences.entries()){
    const original=raw['10'].sentences[i];
    for(const field of ['id','text','paragraph','audioSrc','translation','classification','paraphrase','reuse','pdfNotes'])assert.deepEqual(s[field],original[field],`${s.id}: ${field}`);
    assert.ok(s.note.includes(original.note));
    assert.deepEqual(vocabularyMatches(lesson,s.id,s.text),vocabularyMatches(raw['10'],s.id,s.text));
  }
});
test('every structure partitions its source exactly once with properly nested ranges',()=>{
  for(const s of lesson.sentences){
    assert.equal(s.functions.map(([,t])=>t).join(''),s.text);
    function walk(nodes,start,end){let cursor=start;for(const n of nodes){
      assert.equal(n.start,cursor,`${s.id}: ${n.label}`);assert.ok(n.end>n.start&&n.end<=end);
      assert.equal(n.text,s.text.slice(n.start,n.end));
      if(n.kind==='clause')walk(n.children,n.start,n.end);cursor=n.end;
    }assert.equal(cursor,end);}
    walk(s.structureNodes,0,s.text.length);
  }
});
test('all 101 clause frames share exact source ranges, English labels and colors with Text',()=>{
  let count=0;
  for(const s of lesson.sentences){
    const nodes=frames(s.id);assert.equal(nodes.length,annotations[s.id].clauses.length);
    for(const c of annotations[s.id].clauses){
      const matches=nodes.filter(n=>n.start===c.start&&n.end===c.end&&n.englishLabel===key[c.kind].label);
      assert.equal(matches.length,1);assert.equal(matches[0].syntaxColor,key[c.kind].color);count++;
    }
    for(const n of flat(s.structureNodes))assert.doesNotMatch(n.englishLabel,/[\u3400-\u9fff]/);
    assert.equal(s.structureEnglishOnly,true);
  }
  assert.equal(count,101);
});
test('all 115 predicate spans retain their main/subordinate role and identical color',()=>{
  let count=0;
  for(const s of lesson.sentences){
    const units=flat(s.structureNodes).filter(n=>n.kind==='unit');
    for(const p of annotations[s.id].predicates){
      assert.equal(p.text,s.text.slice(p.start,p.end));
      const sub=annotations[s.id].clauses.some(c=>c.kind!=='main'&&c.start<=p.start&&p.end<=c.end);
      assert.equal(p.role,sub?'sub':'main');
      for(let i=p.start;i<p.end;i++)if(/[A-Za-z]/.test(s.text[i])){
        const unit=units.find(n=>n.start<=i&&i<n.end);assert.ok(unit);assert.equal(unit.predicateRole,p.role);assert.equal(unit.syntaxColor,p.role==='main'?'#ff2500':'#feb72e');
      }count++;
    }
    for(const unit of units.filter(n=>n.predicateRole))for(let i=unit.start;i<unit.end;i++)if(/[A-Za-z]/.test(s.text[i]))assert.ok(annotations[s.id].predicates.some(p=>p.start<=i&&i<p.end));
  }
  assert.equal(count,115);
});
test('difficult grammatical relationships are preserved instead of excerpt-based guesses',()=>{
  assert.equal(frames(2).filter(n=>n.englishLabel==='Main clause').length,2); // coordinating for
  assert.equal(frames(13).filter(n=>n.englishLabel==='Main clause').length,8);
  assert.equal(frames(13).filter(n=>n.englishLabel==='Relative clause').length,7);
  assert.equal(frames(19).filter(n=>n.englishLabel==='Main clause').length,10);
  const reef=frames(19).find(n=>n.antecedent==='a bluff reef');assert.ok(flat(reef.children).some(n=>n.englishLabel==='Conditional clause'));
  const warning=frames(19).find(n=>n.englishLabel==='Appositive clause');assert.ok(warning.text.startsWith('that that troublesome'));
  assert.equal(frames(21).filter(n=>n.excerpt.startsWith('[that]')).length,2);
  assert.ok(frames(24).some(n=>n.englishLabel==='Fused relative clause'));
  assert.ok(annotations[16].predicates.some(p=>p.text==='in'));
  assert.ok(!annotations[8].predicates.some(p=>p.text.includes('to know')));
  assert.ok(!annotations[19].predicates.some(p=>/upon|through|stretching/.test(p.text)));
});
test('mismatched text fails safely and the Article 10 adapter leaves other articles untouched',()=>{
  const edited={...raw['10'].sentences[0],text:'Edited source.'};assert.equal(withArticle10Structure(edited),edited);
  for(const id of ['06','07','08','09'])for(const s of raw[id].sentences)assert.equal(withArticle10Structure(s),s);
});
