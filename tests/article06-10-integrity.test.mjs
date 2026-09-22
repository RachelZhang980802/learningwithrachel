import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const root=path.resolve(import.meta.dirname,'..');
const base=path.join(root,'work/article06-10-completion-2026-09-08');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const data=JSON.parse(read('app/article06to10Lessons.json'));
const original=JSON.parse(fs.readFileSync(path.join(base,'source-data.json')));
const baseline=JSON.parse(fs.readFileSync(path.join(base,'before-manifest.json')));
const pdfs=JSON.parse(fs.readFileSync(path.join(base,'pdf-pages.json')));
const reviewed=JSON.parse(fs.readFileSync(path.join(base,'review-status.json')));
const notes=JSON.parse(fs.readFileSync(path.join(base,'integrated-notes.json')));
const dictionary=JSON.parse(fs.readFileSync(path.join(base,'sources/dictionary-index.json')));
const req=createRequire(import.meta.url),cache=new Map();
let states=[],cursor=0;
const react={...React,useId:()=> 'answer-06-10',useState(initial){
  const index=cursor++;if(!(index in states))states[index]=typeof initial==='function'?initial():initial;
  return [states[index],value=>{states[index]=typeof value==='function'?value(states[index]):value;}];
}};
function load(file){
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const localRequire=name=>{
    if(name==='react')return react;if(name.endsWith('.css'))return {};
    if(!name.startsWith('.'))return req(name);
    const resolved=path.resolve(path.dirname(file),name);
    if(name.endsWith('.json'))return JSON.parse(fs.readFileSync(resolved));
    return load(['','.tsx','.ts'].map(s=>resolved+s).find(fs.existsSync));
  };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(localRequire,module,module.exports);
  return module.exports;
}
const helpers=load(path.join(root,'app/articleLessons.ts'));
const content=load(path.join(root,'app/ArticleLessonContent.tsx'));
const notebook=load(path.join(root,'app/ArticleOneNotebook.tsx'));
const grammar=load(path.join(root,'app/GrammarLegend.tsx'));
const render=(component,props)=>{cursor=0;return component(props)};
const reset=()=>{states=[];cursor=0};
function find(node,predicate){
  if(!node||typeof node!=='object')return;
  if(predicate(node))return node;
  for(const child of React.Children.toArray(node.props?.children)){const result=find(child,predicate);if(result)return result;}
}
const textFrom=html=>html.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const hash=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const ids=['06','07','08','09','10'];

test('all 238 sentences preserve the source text, numbering, paragraph and original audio',()=>{
  assert.deepEqual(ids.map(id=>data[id].sentences.length),[49,48,65,50,26]);
  for(const id of ids){const lesson=data[id];assert.equal(helpers.getLesson(id).title,lesson.title);
    for(const [i,sentence] of lesson.sentences.entries()){
      for(const field of ['id','text','paragraph','audioSrc'])assert.equal(sentence[field],original[id].sentences[i][field],`${id}/${i+1}/${field}`);
      assert.equal(sentence.functions.map(([,text])=>text).join(''),sentence.text);
      assert.ok(sentence.translation&&sentence.paraphrase&&sentence.note&&sentence.clauses.length);
      assert.ok(sentence.functions.every(([label,text])=>label&&text));
    }
  }
  assert.equal(data['09'].sentences[11].classification.priorityLabel,'重点讲解');
  assert.equal(data['09'].sentences[11].classification.badge,'complex');
  assert.ok(data['10'].sentences[12].clauses.length>=12);
  assert.ok(data['10'].sentences[18].clauses.length>=10);
});

test('repeated pronouns, adjacent that and contractions retain their actual grammatical boundaries',()=>{
  assert.deepEqual(data['09'].sentences[3].functions.slice(0,3),[
    ['条件从句','If you have researched a trip in, say, the past five to ten years or so, '],
    ['主语','you '],['谓语','may have noticed '],
  ]);
  const warning=data['10'].sentences[18].functions;
  const connector=warning.findIndex(([label])=>label==='内容从句连接词');
  assert.deepEqual(warning.slice(connector,connector+3),[
    ['内容从句连接词','that '],['内容从句主语','that troublesome place '],['内容从句谓语','is shoaling up '],
  ]);
  let contractions=0;
  for(const lesson of Object.values(data))for(const sentence of lesson.sentences){
    for(const [index,[label,text]] of sentence.functions.entries()){
      assert.ok(!/主语与(?:谓语|系动词)/.test(label));
      if(/主语/.test(label)&&/^[A-Za-z]+$/.test(text)){
        const next=sentence.functions[index+1];
        if(next&&/^['’](s|ve|re|m|d|ll)\b/.test(next[1])){
          assert.equal(grammar.grammarRole(label),'subject');
          assert.equal(grammar.grammarRole(next[0]),'predicate');contractions++;
        }
      }
    }
  }
  assert.ok(contractions>=10);
  const supplement=data['10'].sentences[12].functions.find(([,text])=>text==='black and conspicuous; ');
  assert.equal(grammar.grammarRole(supplement[0]),'complement');
});

test('243 DOCX entries have bilingual cards, verified sources, extra-sense review and matching highlights',()=>{
  const supplied=fs.readFileSync(path.join(base,'sources/vocabulary.txt'),'utf8').split(/第[六七八九十]篇：Words and Expressions\n/).slice(1);
  const canonical=s=>s.trim().replace(/\s+/g,' ').replace(/^pajama$/,'pajamas').replace(/^void of sth\.$/,'void of something');
  assert.deepEqual(ids.map(id=>data[id].vocabulary.length),[62,43,44,53,41]);
  for(const [index,id] of ids.entries()){
    const lesson=data[id];
    const expected=supplied[index].split('\n').filter(s=>s.trim()&&s.trim()!=='第八').map(canonical);
    assert.deepEqual(lesson.vocabulary.map(w=>canonical(w.word)),expected,id);
    const reachable=new Set();
    for(const sentence of lesson.sentences)for(const match of helpers.vocabularyMatches(lesson,sentence.id,sentence.text))reachable.add(match.sourceRow);
    for(const word of lesson.vocabulary){
      if(word.titleOnly)assert.ok(word.forms.some(form=>lesson.title.toLowerCase().includes(form.toLowerCase())));
      else assert.ok(reachable.has(word.sourceRow),`${id}/${word.word}`);
      assert.match(word.definition,/ — .*\p{Script=Han}/u);
      assert.ok(word.ipa&&word.partOfSpeech&&word.usage&&word.collocations.length&&word.compare.length&&word.family.length);
      assert.equal(word.otherSensesReviewed,true);
      assert.ok(word.sources.some(s=>/cambridge\.org|oxfordlearnersdictionaries\.com/.test(s.url)),word.word);
      for(const source of word.sources)assert.ok(dictionary.some(s=>s.url===source.url),source.url);
      reset();
      const tree=render(content.LessonWords,{lesson,sentence:lesson.sentences[word.occurrences[0]-1],initialSourceRow:word.sourceRow});
      assert.equal(tree.props['data-source-row'],word.sourceRow);
      const desk=find(tree,x=>x.props?.cards);
      assert.deepEqual(desk.props.cards.map(x=>x.id),['meaning','collocations','compare','usage','press']);
      const html=renderToStaticMarkup(desk.props.cards[0].content);
      assert.ok(html.includes('Other meanings'));
      if(word.titleOnly)assert.ok(html.includes('Title word'));
      assert.ok(desk.props.cards.find(x=>x.id==='press').content);
      for(const line of word.family)assert.doesNotMatch(line,/^(noun|verb|adjective|adverb)\s/);
    }
  }
});

test('every full-text paragraph and title keeps its characters and opens the corresponding card',()=>{
  for(const id of ids){const lesson=data[id];
    for(const [index,text] of original[id].paragraphs.entries()){
      const segments=helpers.paragraphSegments(lesson,index+1,text);
      assert.equal(segments.map(x=>x.text).join(''),text);
      reset();
      const html=renderToStaticMarkup(React.createElement(content.LessonVocabularyParagraph,{articleId:id,paragraph:index+1,text,onSelect(){}}));
      assert.equal(textFrom(html),text,`${id} paragraph ${index+1}`);
      for(const segment of segments){let selected;
        const tree=render(content.LessonVocabularyText,{lesson,sentence:segment.sentence,text:segment.text,onSelect(value){selected=value}});
        const button=find(tree,x=>x.type==='button');
        if(button){button.props.onClick();assert.equal(selected.sentence,segment.sentence);assert.ok(lesson.vocabulary.find(w=>w.sourceRow===selected.sourceRow).occurrences.includes(selected.sentence));}
      }
    }
    let selected;
    const title=render(content.LessonVocabularyTitle,{articleId:id,text:lesson.title,onSelect(value){selected=value}});
    assert.equal(textFrom(renderToStaticMarkup(title)),lesson.title);
    const button=find(title,x=>x.type==='button');
    if(button){button.props.onClick();assert.ok(lesson.vocabulary.find(w=>w.sourceRow===selected.sourceRow).occurrences.includes(selected.sentence));}
  }
});

test('each sentence uses the shared front, four back entrances, its unit cat and classification cat',()=>{
  assert.equal(new Set(ids.map(id=>data[id].catSrc)).size,5);
  for(const id of ids){const lesson=data[id];for(const sentence of lesson.sentences){
    const props={articleId:id,title:lesson.title,catSrc:lesson.catSrc,audioSrc:sentence.audioSrc,sentenceClassification:sentence.classification,sentences:lesson.sentences.map(x=>x.text),selected:sentence.id-1,paragraph:sentence.paragraph-1,ranges:original[id].paragraphs.map((_,i)=>{const ss=lesson.sentences.filter(s=>s.paragraph===i+1);return {start:ss[0].id-1,end:ss.at(-1).id-1}}),onPanel(){},onSelect(){},onStep(){},onExit(){}};
    reset();const front=renderToStaticMarkup(React.createElement(notebook.ArticleOneNotebook,{...props,panel:null}));
    assert.ok(front.includes(lesson.catSrc)&&front.includes(sentence.audioSrc));
    assert.ok(front.includes(`/sentence-badges/${sentence.classification.badge}-cat.png`));
    for(const panel of ['words','structure','meaning','paraphrase']){
      const children=panel==='words'?React.createElement(content.LessonWords,{lesson,sentence})
        :panel==='structure'?React.createElement(content.LessonStructure,{sentence})
        :React.createElement(content.LessonActivities,{lesson,sentence,panel,onPanel(){}});
      reset();const html=renderToStaticMarkup(React.createElement(notebook.ArticleOneNotebook,{...props,panel},children));
      for(const entry of ['Words','Structure','Meaning','Practice'])assert.ok(html.includes(`<span>${entry}</span>`));
      assert.ok(html.includes('返回正面')&&html.includes(`/sentence-badges/${sentence.classification.badge}-cat.png`));
    }
  }}
});

test('476 separate structure cards and 238 Reuse answers reveal and hide their own content',()=>{
  for(const lesson of Object.values(data))for(const sentence of lesson.sentences){
    reset();const tree=render(content.LessonStructure,{sentence});const cards=React.Children.toArray(tree.props.children);
    assert.equal(cards.length,2);
    for(const card of cards){
      reset();const draw=()=>render(card.type,card.props);let rendered=draw();let button=find(rendered,x=>x.type==='button');
      assert.equal(button.props['aria-expanded'],false);button.props.onClick();rendered=draw();
      button=find(rendered,x=>x.type==='button');assert.equal(button.props['aria-expanded'],true);
      const html=renderToStaticMarkup(find(rendered,x=>x.props?.id==='answer-06-10'));
      assert.ok(html.includes('notebook-analysis-answer'));
      if(card.props.title.startsWith('02'))assert.ok(html.includes('十篇文章统一的句法成分配色'));
      button.props.onClick();assert.equal(find(draw(),x=>x.props?.id==='answer-06-10').props.hidden,true);
    }
    reset();const draw=()=>render(content.LessonReuse,{sentence});let rendered=draw();let button=find(rendered,x=>x.type==='button');
    assert.equal(button.props.children,sentence.reuse.zh);assert.match(sentence.reuse.pattern,/___/);
    assert.equal(find(rendered,x=>x.props?.id==='answer-06-10').props.children,null);
    button.props.onClick();rendered=draw();button=find(rendered,x=>x.type==='button');
    assert.equal(find(rendered,x=>x.props?.id==='answer-06-10').props.children,sentence.reuse.en);
    button.props.onClick();assert.equal(find(draw(),x=>x.props?.id==='answer-06-10').props.hidden,true);
  }
  for(const [label,expected] of Object.entries({'主语':'subject','谓语':'predicate','宾语':'object','表语':'complement','定语':'modifier','状语':'adverbial','主语＋谓语':'clause','连接词':'linker'}))assert.equal(grammar.grammarRole(label),expected);
});

test('all 140 actual PDF pages and 170 integrated notes have reviewed source destinations',()=>{
  assert.equal(Object.values(pdfs).reduce((n,p)=>n+p.pages.length,0),140);assert.equal(notes.length,170);
  for(const id of ids){const pages=pdfs[id].pages.map(x=>x.page);
    assert.deepEqual(reviewed[id].textPages,pages);assert.deepEqual(reviewed[id].visualPages,pages);
    assert.equal(hash(`public/lesson-sources/article${id}.pdf`),pdfs[id].sha256);
    for(const page of pages)assert.ok(fs.existsSync(path.join(base,`pages/${id}/${String(page).padStart(2,'0')}.png`)));
  }
  for(const note of notes)for(const number of note.sentences){
    const sentence=data[note.articleId].sentences[number-1];assert.ok(sentence.pdfNotes.some(n=>n.title===note.title&&n.entry===note.entry));
    const html=renderToStaticMarkup(React.createElement(content.LessonPdfNotes,{sentence,entry:note.entry}));
    for(const page of note.pages)assert.ok(html.includes(`article${note.articleId}.pdf#page=${page}`));
  }
});

test('951 audio files, first five lessons, author entrances and all other existing assets remain byte-identical',()=>{
  const allowed=new Set(['app/page.tsx','app/articleLessons.ts','app/ArticleLessonContent.tsx']);let audio=0;
  for(const [file,sha] of Object.entries(baseline)){
    if(allowed.has(file))continue;assert.equal(hash(file),sha,file);if(/\.(mp3|wav|m4a|ogg)$/i.test(file))audio++;
  }
  assert.equal(audio,951);
  const before=fs.readFileSync(path.join(base,'before/app/page.tsx.backup'),'utf8');
  let after=read('app/page.tsx');
  after=after.replace('LessonVocabularyParagraph, LessonVocabularyTitle,','LessonVocabularyParagraph,');
  after=after.replace('<h1>{index >= 5 && getLesson(article.number) ? <LessonVocabularyTitle articleId={article.number} text={article.title} onSelect={(target) => { setVocabularyTarget(target); setAnalysisMode(true); window.scrollTo(0, 0); }}/> : article.title}</h1>','<h1>{article.title}</h1>');
  after=after.replace('{getLesson(article.number) ? <LessonVocabularyParagraph','{index <= 4 ? <LessonVocabularyParagraph');
  assert.equal(after,before,'page changes are confined to the new vocabulary highlighting');
});
