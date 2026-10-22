import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=process.env.ARTICLE01_PROJECT_ROOT || path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json')),ts=require('typescript'),cache=new Map();
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.startsWith('.')?(name.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')):load(path.resolve(path.dirname(file),name+'.ts'))):require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);return module.exports;
}
const {article01ReadingLesson:lesson,article01Annotations:annotations,article01SyntaxKey:key,withArticle01Structure}=load(path.join(root,'app/article01Structure.ts'));
const {article01StructureData:raw}=load(path.join(root,'app/article01StructureData.ts'));
const page=ts.createSourceFile('page.tsx',fs.readFileSync(path.join(root,'app/page.tsx'),'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let paragraphs;function find(node){if(ts.isVariableDeclaration(node)&&node.name.getText(page)==='steffensParagraphs')paragraphs=node.initializer.elements.map(n=>n.text);ts.forEachChild(node,find);}find(page);
const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children)]);
const frames=id=>flat(lesson.sentences[id-1].structureNodes).filter(n=>n.kind==='clause');


test('all 40 sentences retain original source, Chinese explanations and existing classification',()=>{
 assert.equal(lesson.sentences.length,40);
 const originalClassification=JSON.parse(fs.readFileSync(path.join(root,'public/sentence-badges/article01-classification.json'),'utf8')).sentences;
 for(const [i,s]of lesson.sentences.entries()){
  assert.equal(s.text,raw.functions[i].key);
  assert.ok(s.note.includes(raw.reviewNotes.find(n=>n.key===s.text).note));
  assert.equal(paragraphs[s.paragraph-1].slice(s.paragraphStart,s.paragraphEnd),s.text);
  assert.deepEqual(s.classification,originalClassification[i]);
 }
});
test('exact ranges partition every sentence once with valid nested structures',()=>{
  for(const s of lesson.sentences){
    assert.equal(s.functions.map(([,t])=>t).join(''),s.text);
    function visit(nodes,start,end){let cursor=start;for(const n of nodes){assert.equal(n.start,cursor);assert.ok(n.end>n.start&&n.end<=end);assert.equal(n.text,s.text.slice(n.start,n.end));if(n.kind==='clause')visit(n.children,n.start,n.end);cursor=n.end;}assert.equal(cursor,end);}
    visit(s.structureNodes,0,s.text.length);
  }
});
test('all 80 frames share source ranges, English labels and palette with the reading annotations',()=>{
  let count=0;for(const s of lesson.sentences){
    assert.equal(s.structureEnglishOnly,true);assert.doesNotMatch(s.structureClassification.label+s.structureClassification.priorityLabel,/[\u3400-\u9fff]/);
    for(const n of flat(s.structureNodes))assert.doesNotMatch(n.englishLabel,/[\u3400-\u9fff]/);
    for(const c of annotations[s.id].clauses){
      const found=frames(s.id).filter(n=>n.start===c.start&&n.end===c.end&&n.englishLabel===(c.label??key[c.kind].label));
      assert.equal(found.length,1);assert.equal(found[0].syntaxColor,c.color??key[c.kind].color);count++;
    }
  }assert.equal(count,80);
});
test('all 94 predicate spans share main/subordinate roles and exact letter coverage',()=>{
  let count=0;for(const s of lesson.sentences){const units=flat(s.structureNodes).filter(n=>n.kind==='unit');
    for(const p of annotations[s.id].predicates){
      assert.equal(p.text,s.text.slice(p.start,p.end));
      const sub=annotations[s.id].clauses.some(c=>!['main','quote'].includes(c.kind)&&c.start<=p.start&&p.end<=c.end);assert.equal(p.role,sub?'sub':'main');
      for(let i=p.start;i<p.end;i++)if(/[A-Za-z]/.test(s.text[i])){const n=units.find(n=>n.start<=i&&i<n.end);assert.equal(n.predicateRole,p.role);assert.equal(n.syntaxColor,p.role==='main'?'#ff2500':'#feb72e');}count++;
    }
    for(const n of units.filter(n=>n.predicateRole))for(let i=n.start;i<n.end;i++)if(/[A-Za-z]/.test(s.text[i]))assert.ok(annotations[s.id].predicates.some(p=>p.start<=i&&i<p.end));
  }assert.equal(count,94);
});
test('complex nesting, coordinated roots, ellipsis and fragments retain actual grammatical roles',()=>{
 assert.equal(frames(2).filter(n=>n.englishLabel==='Main clause').length,3);
 const content=frames(2).find(n=>n.englishLabel==='Appositive clause');assert.ok(flat(content.children).some(n=>n.englishLabel==='Reduced concessive clause'));
 assert.ok(annotations[2].predicates.some(p=>p.text==='have'));assert.ok(!annotations[2].predicates.some(p=>p.text==='have to offer'));
 assert.deepEqual(annotations[6].predicates.map(p=>p.text),['concentrated','interested','worked']);
 const reason=frames(9).find(n=>n.englishLabel==='Reason clause');assert.ok(flat(reason.children).some(n=>n.englishLabel==='Relative clause'));
 assert.deepEqual(annotations[11].predicates.filter(p=>p.role==='sub').map(p=>p.text),['was','did','understand','need']);
 assert.equal(frames(16).filter(n=>n.englishLabel==='Object clause').length,2);
 assert.deepEqual(annotations[25].predicates.map(p=>p.text),['deepened']);
 assert.equal(frames(30).filter(n=>n.englishLabel==='Main clause').length,3);
 const comparative=frames(30).find(n=>n.englishLabel==='Comparative clause');assert.ok(flat(comparative.children).some(n=>n.englishLabel==='Object clause'));
 assert.equal(annotations[30].predicates.filter(p=>p.text==='establish').length,1);
 assert.deepEqual(frames(36).map(n=>n.englishLabel),['Reporting clause','Quoted main clause']);
 assert.equal(annotations[37].predicates.length,0);assert.equal(frames(37)[0].englishLabel,'Sentence fragment');assert.equal(frames(37)[0].syntaxColor,'#746958');
 assert.equal(frames(39).filter(n=>n.englishLabel==='Appositive clause').length,2);
 assert.deepEqual(annotations[40].predicates.map(p=>p.text),['was']);
});
test('source edits fail safely without registering Article 01 in the other articles lesson registry',()=>{
 const s={...lesson.sentences[0],text:'Edited source.'};assert.equal(withArticle01Structure(s),s);
 const {getLesson}=load(path.join(root,'app/articleLessons.ts'));assert.equal(getLesson('01'),undefined);
 for(const id of ['02','03','04','05','06','07','08','09','10'])for(const item of getLesson(id).sentences)assert.equal(withArticle01Structure(item),item);
});
