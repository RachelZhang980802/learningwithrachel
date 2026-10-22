import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const root=process.env.ARTICLE09_PROJECT_ROOT || path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(root,'package.json'));
const ts=require('typescript'),cache=new Map();
const readJSON=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.startsWith('.') ? (name.endsWith('.json') ? JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')) : load(path.resolve(path.dirname(file),name+'.ts'))) : require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);
  return module.exports;
}
const {getLesson,vocabularyMatches}=load(path.join(root,'app/articleLessons.ts'));
const {clauseLabels}=load(path.join(root,'app/articleSyntaxLabels.ts'));
const raw=readJSON('app/article06to10Lessons.json');
const lesson=getLesson('09');
const inline=readJSON('app/article09Syntax.json');
const flatten=nodes=>nodes.flatMap(node=>[node,...flatten(node.children)]);
const frames=id=>flatten(lesson.sentences[id-1].structureNodes).filter(n=>n.kind==='clause');

test('all 50 sentences retain source, paragraph, audio, translation and vocabulary destinations',()=>{
  assert.equal(lesson.sentences.length,50);
  assert.deepEqual(lesson.vocabulary,raw['09'].vocabulary);
  for(const [i,sentence]of lesson.sentences.entries()){
    const before=raw['09'].sentences[i];
    for(const key of ['id','text','paragraph','audioSrc','translation','paraphrase','reuse','pdfNotes'])assert.deepEqual(sentence[key],before[key],`${sentence.id}: ${key}`);
    assert.deepEqual(vocabularyMatches(lesson,sentence.id,sentence.text),vocabularyMatches(raw['09'],before.id,before.text));
    assert.equal(inline[sentence.id].text,sentence.text);
  }
});

test('every Structure tree covers its source exactly once and has strictly nested, valid ranges',()=>{
  for(const sentence of lesson.sentences){
    assert.equal(sentence.functions.map(([,text])=>text).join(''),sentence.text);
    const units=flatten(sentence.structureNodes).filter(n=>n.kind==='unit');
    assert.equal(units.map(n=>n.text).join(''),sentence.text,`sentence ${sentence.id}`);
    function visit(nodes,start,end){let cursor=start;for(const n of nodes){
      assert.equal(n.start,cursor,`${sentence.id}: gap or overlap`);assert.ok(n.end>n.start&&n.end<=end);
      assert.equal(n.text,sentence.text.slice(n.start,n.end));
      if(n.kind==='clause')visit(n.children,n.start,n.end);
      cursor=n.end;
    }assert.equal(cursor,end);}
    visit(sentence.structureNodes,0,sentence.text.length);
  }
});

test('all 27 inline subordinate labels have exactly one matching Structure frame',()=>{
  let count=0;
  for(const s of lesson.sentences)for(const clause of inline[s.id].clauses){
    const matches=frames(s.id).filter(n=>n.start===clause.start&&n.end>=clause.end&&n.englishLabel===clauseLabels[clause.kind]);
    assert.equal(matches.length,1,`${s.id}: ${clause.kind}`);
    assert.match(s.text.slice(clause.end,matches[0].end),/^[\s,;:.!?)]*$/);
    count++;
  }
  assert.equal(count,27);
});

test('predicate highlighting and Structure constituents agree in both directions',()=>{
  for(const s of lesson.sentences){
    const highlighted=new Set();
    for(const p of inline[s.id].predicates){
      assert.equal(s.text.slice(p.start,p.end),p.text);
      for(let i=p.start;i<p.end;i++)if(/[A-Za-z]/.test(s.text[i]))highlighted.add(i);
      const subordinate=inline[s.id].clauses.some(c=>c.start<=p.start&&p.end<=c.end);
      assert.equal(p.role,subordinate?'sub':'main',`${s.id}: ${p.text}`);
    }
    const structural=new Set();let start=0;
    for(const [label,text]of s.functions){
      if(/谓语|系动词|助动词|情态动词/.test(label))for(let i=start;i<start+text.length;i++)if(/[A-Za-z]/.test(s.text[i]))structural.add(i);
      start+=text.length;
    }
    assert.deepEqual([...highlighted].sort((a,b)=>a-b),[...structural].sort((a,b)=>a-b),`sentence ${s.id}`);
  }
});

test('audited difficult clauses retain their grammatical parent and interpretation',()=>{
  const tree35=frames(35),time=tree35.find(n=>n.englishLabel==='Time clause');
  const reason=flatten(time.children).find(n=>n.englishLabel==='Reason clause');
  assert.ok(reason);assert.ok(flatten(reason.children).some(n=>n.englishLabel==='Object clause'));
  const tree41=frames(41),predicatives=tree41.filter(n=>n.englishLabel==='Predicative clause');
  assert.equal(predicatives.length,2);
  assert.ok(flatten(predicatives[1].children).some(n=>n.englishLabel==='Appositive clause'));
  const relative=frames(44).find(n=>n.englishLabel==='Relative clause');
  const comment=flatten(relative.children).find(n=>n.englishLabel==='Parenthetical comment');
  assert.equal(comment.text.trim(),'I admit');
  assert.ok(frames(44).some(n=>n.englishLabel==='Reason clause'));
  const roots48=lesson.sentences[47].structureNodes.filter(n=>n.kind==='clause');
  assert.equal(roots48.length,2);
  for(const main of roots48)assert.equal(flatten(main.children).filter(n=>n.englishLabel==='Time clause').length,1);
  assert.match(roots48[1].excerpt,/\[it's been\]/);
  assert.ok(flatten(roots48[1].children).some(n=>n.englishLabel==='Relative clause'&&n.antecedent==='the house'));
  assert.ok(frames(12).some(n=>n.englishLabel==='Time clause'));
  assert.match(lesson.sentences[11].note,/doing/);
  assert.ok(frames(4).some(n=>n.englishLabel==='Quoted imperative'&&n.text==='TRAVEL LIKE A LOCAL!'));
  assert.ok(inline['4'].predicates.some(p=>p.text==='TRAVEL'&&p.role==='main'));
  assert.deepEqual(inline['33'].predicates.map(p=>p.text),['arose']);
  assert.ok(inline['38'].clauses.some(c=>c.kind==='purpose'));
});

test('the audit applies only to article 09',()=>{
  const {withArticle09Structure}=load(path.join(root,'app/article09Structure.ts'));
  for(const id of ['06','07','08','10'])for(const sentence of raw[id].sentences)assert.deepEqual(withArticle09Structure(sentence),sentence);
});

test('English-only labels use the Text palette and retain Chinese explanatory notes',()=>{
  const {syntaxColors}=load(path.join(root,'app/articleSyntaxLabels.ts'));
  const audit=readJSON('app/article09StructureAudit.json');
  for(const sentence of lesson.sentences){
    assert.equal(sentence.structureEnglishOnly,true);
    assert.doesNotMatch(sentence.structureClassification.label + sentence.structureClassification.priorityLabel,/[\u3400-\u9fff]/);
    assert.equal(sentence.note,audit[sentence.id].note);
    for(const node of flatten(sentence.structureNodes)){
      assert.doesNotMatch(node.englishLabel,/[\u3400-\u9fff]/);
      if(node.kind==='clause'){
        const clause=inline[sentence.id].clauses.find(c=>c.start===node.start&&clauseLabels[c.kind]===node.englishLabel);
        assert.equal(node.syntaxColor,clause?syntaxColors[clause.kind]:node.englishLabel==='Parenthetical comment'?syntaxColors.parenthetical:syntaxColors.main);
      }else assert.equal(node.syntaxColor,node.predicateRole?syntaxColors[node.predicateRole]:syntaxColors.neutral);
    }
    const units=flatten(sentence.structureNodes).filter(n=>n.kind==='unit');
    for(const predicate of inline[sentence.id].predicates)for(let i=predicate.start;i<predicate.end;i++)if(/[A-Za-z]/.test(sentence.text[i])){
      const unit=units.find(n=>n.start<=i&&i<n.end);assert.equal(unit.predicateRole,predicate.role);assert.equal(unit.syntaxColor,syntaxColors[predicate.role]);
    }
  }
});
