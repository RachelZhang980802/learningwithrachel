import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=process.env.ARTICLE05_PROJECT_ROOT || path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json')),ts=require('typescript'),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.startsWith('.')?(name.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')):load(path.resolve(path.dirname(file),name+'.ts'))):require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);return module.exports;
}
const {getLesson,vocabularyMatches}=load(path.join(root,'app/articleLessons.ts'));
const {article05Annotations:annotations,article05SyntaxKey:key,withArticle05Structure}=load(path.join(root,'app/article05Structure.ts'));
const raw={...JSON.parse(fs.readFileSync(path.join(root,'app/article02to05Lessons.json'),'utf8')),...JSON.parse(fs.readFileSync(path.join(root,'app/article06to10Lessons.json'),'utf8'))};
const lesson=getLesson('05');
const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children)]);
const frames=id=>flat(lesson.sentences[id-1].structureNodes).filter(n=>n.kind==='clause');


test('all 80 sentence and dialogue units retain original content, Chinese explanations and vocabulary destinations',()=>{
  assert.equal(lesson.sentences.length,80);assert.deepEqual(lesson.vocabulary,raw['05'].vocabulary);
  for(const [i,s]of lesson.sentences.entries()){
    const original=raw['05'].sentences[i];
    for(const f of ['id','paragraph','audioSrc','translation','classification','paraphrase','reuse','pdfNotes'])assert.deepEqual(s[f],original[f],`${s.id}: ${f}`);
    assert.ok(s.note.includes(original.note));
    const {fullArticleParagraphs}=load(path.join(root,'app/suppliedArticles.ts'));
    assert.equal(fullArticleParagraphs[4][s.paragraph-1].slice(s.paragraphStart,s.paragraphEnd),s.text);
    const destinations=(owner,text)=>vocabularyMatches(owner,s.id,text).map(v=>({sourceRow:v.sourceRow,word:v.word,form:text.slice(v.start,v.end)}));
    assert.deepEqual(destinations(lesson,s.text),destinations(raw['05'],original.text));
  }
});
test('exact ranges partition every sentence once with valid nested structures',()=>{
  for(const s of lesson.sentences){
    assert.equal(s.functions.map(([,t])=>t).join(''),s.text);
    function visit(nodes,start,end){let cursor=start;for(const n of nodes){assert.equal(n.start,cursor);assert.ok(n.end>n.start&&n.end<=end);assert.equal(n.text,s.text.slice(n.start,n.end));if(n.kind==='clause')visit(n.children,n.start,n.end);cursor=n.end;}assert.equal(cursor,end);}
    visit(s.structureNodes,0,s.text.length);
  }
});
test('all 110 frames share source ranges, English labels and palette with the reading annotations',()=>{
  let count=0;for(const s of lesson.sentences){
    assert.equal(s.structureEnglishOnly,true);assert.doesNotMatch(s.structureClassification.label+s.structureClassification.priorityLabel,/[\u3400-\u9fff]/);
    for(const n of flat(s.structureNodes))assert.doesNotMatch(n.englishLabel,/[\u3400-\u9fff]/);
    for(const c of annotations[s.id].clauses){
      const found=frames(s.id).filter(n=>n.start===c.start&&n.end===c.end&&n.englishLabel===(c.label??key[c.kind].label));
      assert.equal(found.length,1);assert.equal(found[0].syntaxColor,c.color??key[c.kind].color);count++;
    }
  }assert.equal(count,110);
});
test('all 109 predicate spans share main/subordinate roles and exact letter coverage',()=>{
  let count=0;for(const s of lesson.sentences){const units=flat(s.structureNodes).filter(n=>n.kind==='unit');
    for(const p of annotations[s.id].predicates){
      assert.equal(p.text,s.text.slice(p.start,p.end));
      const sub=annotations[s.id].clauses.some(c=>!['main','quote'].includes(c.kind)&&c.start<=p.start&&p.end<=c.end);assert.equal(p.role,sub?'sub':'main');
      for(let i=p.start;i<p.end;i++)if(/[A-Za-z]/.test(s.text[i])){const n=units.find(n=>n.start<=i&&i<n.end);assert.equal(n.predicateRole,p.role);assert.equal(n.syntaxColor,p.role==='main'?'#ff2500':'#feb72e');}count++;
    }
    for(const n of units.filter(n=>n.predicateRole))for(let i=n.start;i<n.end;i++)if(/[A-Za-z]/.test(s.text[i]))assert.ok(annotations[s.id].predicates.some(p=>p.start<=i&&i<p.end));
  }assert.equal(count,109);
});
test('dialogue fragments, inverted conditionals, reporting clauses and contractions retain their roles',()=>{
  for(const id of [14,57,61,63,64,78,79]){
    assert.equal(annotations[id].predicates.length,0);assert.equal(frames(id)[0].englishLabel,'Sentence fragment');
    assert.equal(frames(id)[0].syntaxColor,'#746958');
  }
  assert.deepEqual(annotations[70].predicates.map(p=>p.text),['Imagine']);
  assert.equal(frames(3).filter(n=>n.englishLabel==='Conditional clause').length,2);
  assert.deepEqual(annotations[3].predicates.filter(p=>p.role==='main').map(p=>p.text),['would','have been']);
  assert.deepEqual(frames(15).map(n=>n.englishLabel),['Quoted fragment','Reporting clause']);
  const speech18=frames(18).find(n=>n.englishLabel==='Quoted main clause');
  assert.ok(flat(speech18.children).some(n=>n.englishLabel==='Object clause'));
  assert.deepEqual(frames(23).map(n=>n.englishLabel),['Vocative fragment','Reporting clause','Quoted main clause','Quoted main clause']);
  const time21=frames(21).find(n=>n.englishLabel==='Time clause');
  assert.equal(flat(time21.children).filter(n=>n.englishLabel==='Absolute construction').length,3);
  assert.deepEqual(annotations[21].predicates.map(p=>p.text),['bowed','glanced']);
  assert.deepEqual(annotations[32].predicates.map(p=>p.text),["'ve"]);
  assert.ok(annotations[31].predicates.some(p=>p.text==="'ve received"));
  assert.ok(frames(34).some(n=>n.englishLabel==='Parenthetical comment'));
  const object38=frames(38).find(n=>n.englishLabel==='Object clause');
  assert.ok(flat(object38.children).some(n=>n.englishLabel==='Relative clause'));
  assert.deepEqual(annotations[41].predicates.map(p=>p.text),['was','training','had made']);
  assert.equal(frames(43).length,1);assert.equal(frames(53).length,1);
  assert.deepEqual(annotations[54].predicates.map(p=>p.text),["'d been looking"]);
  assert.deepEqual(annotations[71].predicates.filter(p=>p.role==='sub').map(p=>p.text),['can marry','take']);
});
test('changed source fails safely and other articles are not processed by the Article 05 adapter',()=>{
  const edited={...raw['05'].sentences[0],text:'New text.'};assert.equal(withArticle05Structure(edited),edited);
  for(const id of ['04','06','07','08','09','10'])for(const s of raw[id].sentences)assert.equal(withArticle05Structure(s),s);
});
