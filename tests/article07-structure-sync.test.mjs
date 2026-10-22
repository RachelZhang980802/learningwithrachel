import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=process.env.ARTICLE07_PROJECT_ROOT || path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json')),ts=require('typescript'),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.startsWith('.')?(name.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')):load(path.resolve(path.dirname(file),name+'.ts'))):require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);return module.exports;
}
const {getLesson,vocabularyMatches}=load(path.join(root,'app/articleLessons.ts'));
const {article07Annotations:annotations,article07SyntaxKey:key,withArticle07Structure}=load(path.join(root,'app/article07Structure.ts'));
const raw=JSON.parse(fs.readFileSync(path.join(root,'app/article06to10Lessons.json'),'utf8'));
const lesson=getLesson('07');
const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children)]);
const frames=id=>flat(lesson.sentences[id-1].structureNodes).filter(n=>n.kind==='clause');


test('all 48 sentences retain original content, Chinese explanations and vocabulary destinations',()=>{
  assert.equal(lesson.sentences.length,48);assert.deepEqual(lesson.vocabulary,raw['07'].vocabulary);
  for(const [i,s]of lesson.sentences.entries()){
    const original=raw['07'].sentences[i];
    for(const f of ['id','paragraph','audioSrc','translation','classification','paraphrase','reuse','pdfNotes'])assert.deepEqual(s[f],original[f],`${s.id}: ${f}`);
    assert.ok(s.note.includes(original.note));
    const {fullArticleParagraphs}=load(path.join(root,'app/suppliedArticles.ts'));
    assert.equal(fullArticleParagraphs[6][s.paragraph-1].slice(s.paragraphStart,s.paragraphEnd),s.text);
    const destinations=(owner,text)=>vocabularyMatches(owner,s.id,text).map(v=>({sourceRow:v.sourceRow,word:v.word,form:text.slice(v.start,v.end)}));
    assert.deepEqual(destinations(lesson,s.text),destinations(raw['07'],original.text));
  }
});
test('exact ranges partition every sentence once with valid nested structures',()=>{
  for(const s of lesson.sentences){
    assert.equal(s.functions.map(([,t])=>t).join(''),s.text);
    function visit(nodes,start,end){let cursor=start;for(const n of nodes){assert.equal(n.start,cursor);assert.ok(n.end>n.start&&n.end<=end);assert.equal(n.text,s.text.slice(n.start,n.end));if(n.kind==='clause')visit(n.children,n.start,n.end);cursor=n.end;}assert.equal(cursor,end);}
    visit(s.structureNodes,0,s.text.length);
  }
});
test('all 84 frames share source ranges, English labels and palette with the reading annotations',()=>{
  let count=0;for(const s of lesson.sentences){
    assert.equal(s.structureEnglishOnly,true);assert.doesNotMatch(s.structureClassification.label+s.structureClassification.priorityLabel,/[\u3400-\u9fff]/);
    for(const n of flat(s.structureNodes))assert.doesNotMatch(n.englishLabel,/[\u3400-\u9fff]/);
    for(const c of annotations[s.id].clauses){
      const found=frames(s.id).filter(n=>n.start===c.start&&n.end===c.end&&n.englishLabel===(c.label??key[c.kind].label));
      assert.equal(found.length,1);assert.equal(found[0].syntaxColor,c.color??key[c.kind].color);count++;
    }
  }assert.equal(count,84);
});
test('all 91 predicate spans share main/subordinate roles and exact letter coverage',()=>{
  let count=0;for(const s of lesson.sentences){const units=flat(s.structureNodes).filter(n=>n.kind==='unit');
    for(const p of annotations[s.id].predicates){
      assert.equal(p.text,s.text.slice(p.start,p.end));
      const sub=annotations[s.id].clauses.some(c=>!['main','quote'].includes(c.kind)&&c.start<=p.start&&p.end<=c.end);assert.equal(p.role,sub?'sub':'main');
      for(let i=p.start;i<p.end;i++)if(/[A-Za-z]/.test(s.text[i])){const n=units.find(n=>n.start<=i&&i<n.end);assert.equal(n.predicateRole,p.role);assert.equal(n.syntaxColor,p.role==='main'?'#ff2500':'#feb72e');}count++;
    }
    for(const n of units.filter(n=>n.predicateRole))for(let i=n.start;i<n.end;i++)if(/[A-Za-z]/.test(s.text[i]))assert.ok(annotations[s.id].predicates.some(p=>p.start<=i&&i<p.end));
  }assert.equal(count,91);
});
test('inversion, ellipsis, non-finite supplements and nested clauses preserve their roles',()=>{
  assert.deepEqual(annotations[2].predicates.map(p=>p.text),['did','come together']);
  assert.deepEqual(annotations[6].predicates.map(p=>p.text),['Let']);
  assert.equal(frames(12).find(n=>n.englishLabel==='Content clause').text,'that individuals don\'t harm the community.');
  assert.ok(frames(13).some(n=>n.englishLabel==='Purpose clause'));
  assert.deepEqual(annotations[14].predicates.map(p=>p.text),['measure','will measure']);
  assert.equal(frames(19).filter(n=>n.englishLabel==='Relative clause').length,2);
  assert.ok(!annotations[19].predicates.some(p=>p.text.includes(' or ')));
  assert.equal(frames(26).filter(n=>n.englishLabel==='Main clause').length,3);
  assert.ok(frames(27).some(n=>n.englishLabel==='Absolute construction'));
  assert.ok(!annotations[27].predicates.some(p=>p.text.includes('asked')));
  assert.equal(frames(30).filter(n=>n.englishLabel==='Elliptical main clause').length,2);
  assert.ok(frames(30).filter(n=>n.englishLabel==='Elliptical main clause').every(n=>n.excerpt==='[has had cities]'));
  assert.ok(frames(35).some(n=>n.englishLabel==='Place clause'));
  assert.deepEqual(annotations[36].predicates.map(p=>p.text),['is']);
  assert.ok(frames(36).some(n=>n.englishLabel==='Exclamative fragment'&&n.excerpt==='[that is]'));
  const reason=frames(42).find(n=>n.englishLabel==='Reason clause');
  assert.ok(flat(reason.children).some(n=>n.englishLabel==='Parenthetical comment'));
  assert.ok(!annotations[42].predicates.some(p=>/asking|bewailing|living|importuned/.test(p.text)));
  const condition=frames(48).find(n=>n.englishLabel==='Conditional clause');
  assert.equal(flat(condition.children).filter(n=>n.englishLabel==='Relative clause').length,2);
  assert.deepEqual(annotations[48].predicates.filter(p=>p.role==='main').map(p=>p.text),['would','choose']);
});
test('changed source fails safely and other articles are not processed by the Article 07 adapter',()=>{
  const edited={...raw['07'].sentences[0],text:'New text.'};assert.equal(withArticle07Structure(edited),edited);
  for(const id of ['06','08','09','10'])for(const s of raw[id].sentences)assert.equal(withArticle07Structure(s),s);
});
