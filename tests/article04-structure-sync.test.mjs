import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=process.env.ARTICLE04_PROJECT_ROOT || path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json')),ts=require('typescript'),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.startsWith('.')?(name.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')):load(path.resolve(path.dirname(file),name+'.ts'))):require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);return module.exports;
}
const {getLesson,vocabularyMatches}=load(path.join(root,'app/articleLessons.ts'));
const {article04Annotations:annotations,article04SyntaxKey:key,withArticle04Structure}=load(path.join(root,'app/article04Structure.ts'));
const raw={...JSON.parse(fs.readFileSync(path.join(root,'app/article02to05Lessons.json'),'utf8')),...JSON.parse(fs.readFileSync(path.join(root,'app/article06to10Lessons.json'),'utf8'))};
const lesson=getLesson('04');
const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children)]);
const frames=id=>flat(lesson.sentences[id-1].structureNodes).filter(n=>n.kind==='clause');


test('all 75 sentence and dialogue units retain original content, Chinese explanations and vocabulary destinations',()=>{
  assert.equal(lesson.sentences.length,75);assert.deepEqual(lesson.vocabulary,raw['04'].vocabulary);
  for(const [i,s]of lesson.sentences.entries()){
    const original=raw['04'].sentences[i];
    for(const f of ['id','paragraph','audioSrc','translation','classification','paraphrase','reuse','pdfNotes'])assert.deepEqual(s[f],original[f],`${s.id}: ${f}`);
    assert.ok(s.note.includes(original.note));
    const {fullArticleParagraphs}=load(path.join(root,'app/suppliedArticles.ts'));
    assert.equal(fullArticleParagraphs[3][s.paragraph-1].slice(s.paragraphStart,s.paragraphEnd),s.text);
    const destinations=(owner,text)=>vocabularyMatches(owner,s.id,text).map(v=>({sourceRow:v.sourceRow,word:v.word,form:text.slice(v.start,v.end)}));
    assert.deepEqual(destinations(lesson,s.text),destinations(raw['04'],original.text));
  }
});
test('exact ranges partition every sentence once with valid nested structures',()=>{
  for(const s of lesson.sentences){
    assert.equal(s.functions.map(([,t])=>t).join(''),s.text);
    function visit(nodes,start,end){let cursor=start;for(const n of nodes){assert.equal(n.start,cursor);assert.ok(n.end>n.start&&n.end<=end);assert.equal(n.text,s.text.slice(n.start,n.end));if(n.kind==='clause')visit(n.children,n.start,n.end);cursor=n.end;}assert.equal(cursor,end);}
    visit(s.structureNodes,0,s.text.length);
  }
});
test('all 132 frames share source ranges, English labels and palette with the reading annotations',()=>{
  let count=0;for(const s of lesson.sentences){
    assert.equal(s.structureEnglishOnly,true);assert.doesNotMatch(s.structureClassification.label+s.structureClassification.priorityLabel,/[\u3400-\u9fff]/);
    for(const n of flat(s.structureNodes))assert.doesNotMatch(n.englishLabel,/[\u3400-\u9fff]/);
    for(const c of annotations[s.id].clauses){
      const found=frames(s.id).filter(n=>n.start===c.start&&n.end===c.end&&n.englishLabel===(c.label??key[c.kind].label));
      assert.equal(found.length,1);assert.equal(found[0].syntaxColor,c.color??key[c.kind].color);count++;
    }
  }assert.equal(count,132);
});
test('all 149 predicate spans share main/subordinate roles and exact letter coverage',()=>{
  let count=0;for(const s of lesson.sentences){const units=flat(s.structureNodes).filter(n=>n.kind==='unit');
    for(const p of annotations[s.id].predicates){
      assert.equal(p.text,s.text.slice(p.start,p.end));
      const sub=annotations[s.id].clauses.some(c=>!['main','quote'].includes(c.kind)&&c.start<=p.start&&p.end<=c.end);assert.equal(p.role,sub?'sub':'main');
      for(let i=p.start;i<p.end;i++)if(/[A-Za-z]/.test(s.text[i])){const n=units.find(n=>n.start<=i&&i<n.end);assert.equal(n.predicateRole,p.role);assert.equal(n.syntaxColor,p.role==='main'?'#ff2500':'#feb72e');}count++;
    }
    for(const n of units.filter(n=>n.predicateRole))for(let i=n.start;i<n.end;i++)if(/[A-Za-z]/.test(s.text[i]))assert.ok(annotations[s.id].predicates.some(p=>p.start<=i&&i<p.end));
  }assert.equal(count,149);
});
test('ellipsis, quoted questions, non-finite phrases and nested clauses retain their actual roles',()=>{
 assert.equal(annotations[42].predicates.length,0);assert.equal(frames(42)[0].englishLabel,'Sentence fragment');
 assert.deepEqual(annotations[4].predicates.map(p=>p.text),['are packed','try']);
 assert.deepEqual(annotations[6].predicates.map(p=>p.text),['is']);
 assert.deepEqual(annotations[5].predicates.map(p=>p.text),['may','be']);
 for(const id of [15,49,54])assert.deepEqual(frames(id).map(n=>n.englishLabel),['Quoted main clause','Reporting clause']);
 assert.ok(frames(25).some(n=>n.englishLabel==='Reduced concessive clause'));
 assert.equal(frames(27)[1].excerpt,'[are]');assert.deepEqual(annotations[27].predicates.map(p=>p.text),['are']);
 assert.ok(frames(30).some(n=>n.englishLabel==='Result clause'));
 assert.equal(lesson.sentences[30].text,'There are the initials J. S. on it.');
 const comment=frames(38).find(n=>n.englishLabel==='Parenthetical comment');
 assert.ok(flat(comment.children).some(n=>n.englishLabel==='Object clause'));
 assert.deepEqual(annotations[38].predicates.filter(p=>p.role==='sub').map(p=>p.text),['believe','do']);
 assert.ok(frames(39).some(n=>n.englishLabel==='Content clause'));
 assert.equal(frames(41).length,1);assert.equal(frames(68).length,2);
 assert.ok(annotations[47].predicates.some(p=>p.text==='up'));assert.ok(annotations[64].predicates.some(p=>p.text==='down'));
 assert.ok(frames(53).some(n=>n.englishLabel==='Comparative clause'));
 assert.ok(lesson.sentences[59].functions.map(([,t])=>t).join('').startsWith('His father and mother are both Finns:'));
 assert.ok(frames(60).some(n=>n.englishLabel==='Predicative clause'));
 assert.deepEqual(annotations[63].predicates.map(p=>p.text),["'s"]);
 assert.ok(frames(66).some(n=>n.englishLabel==='Reduced conditional clause'));
 assert.deepEqual(annotations[72].predicates.map(p=>p.text),['Let']);
});
test('changed source fails safely and other articles are not processed by the Article 04 adapter',()=>{
  const edited={...raw['04'].sentences[0],text:'New text.'};assert.equal(withArticle04Structure(edited),edited);
  for(const id of ['03','05','06','07','08','09','10'])for(const s of raw[id].sentences)assert.equal(withArticle04Structure(s),s);
});
