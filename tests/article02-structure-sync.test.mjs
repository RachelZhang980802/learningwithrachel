import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=process.env.ARTICLE02_PROJECT_ROOT || path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json')),ts=require('typescript'),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.startsWith('.')?(name.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')):load(path.resolve(path.dirname(file),name+'.ts'))):require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);return module.exports;
}
const {getLesson,vocabularyMatches}=load(path.join(root,'app/articleLessons.ts'));
const {article02Annotations:annotations,article02SyntaxKey:key,withArticle02Structure}=load(path.join(root,'app/article02Structure.ts'));
const raw={...JSON.parse(fs.readFileSync(path.join(root,'app/article02to05Lessons.json'),'utf8')),...JSON.parse(fs.readFileSync(path.join(root,'app/article06to10Lessons.json'),'utf8'))};
const lesson=getLesson('02');
const page=ts.createSourceFile('page.tsx',fs.readFileSync(path.join(root,'app/page.tsx'),'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let paragraphs;function find(node){if(ts.isVariableDeclaration(node)&&node.name.getText(page)==='robotsParagraphs')paragraphs=node.initializer.elements.map(n=>n.text);ts.forEachChild(node,find);}find(page);

const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children)]);
const frames=id=>flat(lesson.sentences[id-1].structureNodes).filter(n=>n.kind==='clause');


test('all 48 sentence and dialogue units retain original content, Chinese explanations and vocabulary destinations',()=>{
  assert.equal(lesson.sentences.length,48);assert.deepEqual(lesson.vocabulary,raw['02'].vocabulary);
  for(const [i,s]of lesson.sentences.entries()){
    const original=raw['02'].sentences[i];
    for(const f of ['id','paragraph','audioSrc','translation','classification','paraphrase','reuse','pdfNotes'])assert.deepEqual(s[f],original[f],`${s.id}: ${f}`);
    assert.ok(s.note.includes(original.note));
    assert.equal(paragraphs[s.paragraph-1].slice(s.paragraphStart,s.paragraphEnd),s.text);
    const destinations=(owner,text)=>vocabularyMatches(owner,s.id,text).map(v=>({sourceRow:v.sourceRow,word:v.word,form:text.slice(v.start,v.end)}));
    assert.deepEqual(destinations(lesson,s.text),destinations(raw['02'],original.text));
  }
});
test('exact ranges partition every sentence once with valid nested structures',()=>{
  for(const s of lesson.sentences){
    assert.equal(s.functions.map(([,t])=>t).join(''),s.text);
    function visit(nodes,start,end){let cursor=start;for(const n of nodes){assert.equal(n.start,cursor);assert.ok(n.end>n.start&&n.end<=end);assert.equal(n.text,s.text.slice(n.start,n.end));if(n.kind==='clause')visit(n.children,n.start,n.end);cursor=n.end;}assert.equal(cursor,end);}
    visit(s.structureNodes,0,s.text.length);
  }
});
test('all 86 frames share source ranges, English labels and palette with the reading annotations',()=>{
  let count=0;for(const s of lesson.sentences){
    assert.equal(s.structureEnglishOnly,true);assert.doesNotMatch(s.structureClassification.label+s.structureClassification.priorityLabel,/[\u3400-\u9fff]/);
    for(const n of flat(s.structureNodes))assert.doesNotMatch(n.englishLabel,/[\u3400-\u9fff]/);
    for(const c of annotations[s.id].clauses){
      const found=frames(s.id).filter(n=>n.start===c.start&&n.end===c.end&&n.englishLabel===(c.label??key[c.kind].label));
      assert.equal(found.length,1);assert.equal(found[0].syntaxColor,c.color??key[c.kind].color);count++;
    }
  }assert.equal(count,86);
});
test('all 98 predicate spans share main/subordinate roles and exact letter coverage',()=>{
  let count=0;for(const s of lesson.sentences){const units=flat(s.structureNodes).filter(n=>n.kind==='unit');
    for(const p of annotations[s.id].predicates){
      assert.equal(p.text,s.text.slice(p.start,p.end));
      const sub=annotations[s.id].clauses.some(c=>!['main','quote'].includes(c.kind)&&c.start<=p.start&&p.end<=c.end);assert.equal(p.role,sub?'sub':'main');
      for(let i=p.start;i<p.end;i++)if(/[A-Za-z]/.test(s.text[i])){const n=units.find(n=>n.start<=i&&i<n.end);assert.equal(n.predicateRole,p.role);assert.equal(n.syntaxColor,p.role==='main'?'#ff2500':'#feb72e');}count++;
    }
    for(const n of units.filter(n=>n.predicateRole))for(let i=n.start;i<n.end;i++)if(/[A-Za-z]/.test(s.text[i]))assert.ok(annotations[s.id].predicates.some(p=>p.start<=i&&i<p.end));
  }assert.equal(count,98);
});
test('subjunctive, displaced relatives, cleft focus and nested content retain their roles',()=>{
 assert.deepEqual(annotations[1].predicates.map(p=>p.text),['should be taxed','is going']);
 assert.deepEqual(annotations[2].predicates.map(p=>p.text),['is gaining']);
 assert.ok(frames(3).some(n=>n.antecedent==='a draft report'));
 assert.deepEqual(annotations[4].predicates.filter(p=>p.role==='sub').map(p=>p.text),['start','force']);
 assert.ok(!annotations[4].clauses.some(c=>c.restoration?.includes('should')));
 assert.deepEqual(annotations[6].predicates.filter(p=>p.role==='sub').map(p=>p.text),['make','do']);
 assert.deepEqual(annotations[18].predicates.filter(p=>p.role==='sub').map(p=>p.text),['are getting closed','replaced']);
 assert.deepEqual(annotations[19].predicates.map(p=>p.text),['will','be','will be left behind']);
 assert.ok(frames(25).some(n=>n.englishLabel==='Comparative clause'));
 assert.ok(frames(27).some(n=>n.englishLabel==='Parenthetical comment'));
 assert.ok(frames(29).some(n=>n.antecedent==='The biggest argument'));
 const pred=frames(31).find(n=>n.englishLabel==='Predicative clause');
 assert.ok(flat(pred.children).some(n=>n.englishLabel==='Relative clause'));
 assert.ok(lesson.sentences[30].text.includes('is that, this'));assert.ok(raw['02'].sentences[30].text.includes('is that this'));
 assert.equal(frames(38).filter(n=>n.englishLabel==='Relative clause').length,1);assert.equal(frames(38).filter(n=>n.englishLabel==='Object clause').length,1);
 assert.equal(frames(39).filter(n=>n.englishLabel==='Main clause').length,1);assert.equal(frames(39).filter(n=>n.englishLabel==='Relative clause').length,2);
 assert.ok(frames(43).some(n=>n.englishLabel==='Cleft clause'));
 assert.deepEqual(annotations[43].predicates.map(p=>[p.text,p.role]),[['was','main'],['found','sub']]);
 assert.equal(frames(45).filter(n=>n.englishLabel==='Reason clause').length,0);assert.ok(!annotations[45].predicates.some(p=>p.text==='amplifying'));
 assert.equal(frames(47).filter(n=>n.englishLabel==='Main clause').length,3);
 const time=frames(47).find(n=>n.englishLabel==='Time clause');assert.ok(lesson.sentences[46].structureNodes[1].children.some(n=>n.id===time.id));
});
test('changed source fails safely and other articles are not processed by the Article 02 adapter',()=>{
  const edited={...raw['02'].sentences[0],text:'New text.'};assert.equal(withArticle02Structure(edited),edited);
  for(const id of ['03','04','05','06','07','08','09','10'])for(const s of raw[id].sentences)assert.equal(withArticle02Structure(s),s);
});
