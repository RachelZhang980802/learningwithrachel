import {sections, places, characters, questions} from './w2-content.js';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let source, active = 0, selectedPage = 1, returnFocus;
const sourceDialog = $('#source-view');
const lightbox = $('#lightbox');
const imageBase = 'https://assets.negentropylearning.com.cn/western-culture/assets/w2/';

function showImage(src, caption, origin) {
  returnFocus = origin;
  lightbox.querySelector('img').src = src;
  lightbox.querySelector('img').alt = caption;
  lightbox.querySelector('p').textContent = caption;
  lightbox.querySelector('a').href = src;
  lightbox.showModal();
}
function figure([page, index, caption]) {
  const picture = source[page-1].pictures[index];
  const full = imageBase + picture.original;
  return `<figure class="course-figure"><button type="button" data-image="${escape(full)}" data-caption="${escape(caption)}" aria-label="Enlarge: ${escape(caption)}"><img src="${imageBase+picture.src}" alt="${escape(caption)}" loading="lazy" width="${picture.width}" height="${picture.height}"></button><figcaption>${escape(caption)} <span>W2, p.${page}</span></figcaption></figure>`;
}
function termHTML(term, id) {
  const [name,ipa,description,zh] = term;
  return `<button type="button" class="term-button" aria-expanded="false" aria-controls="${id}">${escape(name)}</button><div class="term-description" id="${id}" hidden>${ipa?`<span class="ipa">${escape(ipa)}</span>`:''}${escape(description)}<p lang="zh-CN">${escape(zh)}</p></div>`;
}
function renderTopic(topic, index) {
  const images = topic.images || [], terms = topic.terms || [];
  const railImages = topic.wide ? [] : images;
  const hasRail = railImages.length || terms.length;
  return `<section class="topic" id="${topic.id}" tabindex="-1"><div class="topic-layout ${hasRail?'':'text-only'}"><div class="topic-copy"><h2><span class="number">${String(index+1).padStart(2,'0')}</span>${topic.title}</h2>${topic.body}${topic.zh?`<p class="zh" lang="zh-CN">${topic.zh}</p>`:''}${topic.question?`<div class="think"><h3>Think about it</h3><p>${topic.question}</p><details><summary>A starting point</summary><p>${topic.hint}</p></details></div>`:''}<div class="source-pages" aria-label="Related original slides">${topic.pages.map(p=>`<button type="button" data-page="${p}">p.${p}</button>`).join('')}</div>${topic.pages.length?`<details class="detail-note"><summary>Complete slide wording & notes</summary><div class="full-source">${topic.pages.map(p=>`<h4>Slide ${p}</h4><div>${escape(source[p-1].text) || 'This page contains images. Use the page button to view the complete original.'}</div>${source[p-1].notes.trim()?`<h4>Original speaker note${p===54?' · unrelated carry-over from W1':''}</h4><div>${escape(source[p-1].notes)}</div>`:''}`).join('')}</div></details>`:''}</div>${hasRail?`<aside class="topic-rail" aria-label="Images and key terms">${railImages.map(figure).join('')}${terms.length?`<div class="terms"><h3>Key terms</h3>${terms.map((term,i)=>termHTML(term,`${topic.id}-term-${i}`)).join('')}</div>`:''}</aside>`:''}${topic.wide&&images.length?`<div class="wide-gallery ${images.length===1?'single':''}">${images.map(figure).join('')}</div>`:''}</div></section>`;
}
function switcher(id, items, label) {
  const root = document.getElementById(id);
  if(!root)return;
  const tabs = document.createElement('div'); tabs.className='plot-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',label);
  const panel = document.createElement('div');panel.className='interaction-panel';panel.setAttribute('role','tabpanel');panel.id=id+'-panel';panel.tabIndex=0;
  const select = i => {
    [...tabs.children].forEach((button,j)=>{button.setAttribute('aria-selected',String(i===j));button.tabIndex=i===j?0:-1;});
    panel.setAttribute('aria-labelledby',id+'-tab-'+i);
    panel.innerHTML=items[i][1];
  };
  items.forEach(([title],i)=>{
    const button=document.createElement('button');button.type='button';button.id=id+'-tab-'+i;button.setAttribute('role','tab');button.setAttribute('aria-controls',panel.id);button.textContent=title;
    button.addEventListener('click',()=>select(i));
    button.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%items.length;if(e.key==='ArrowLeft')n=(i-1+items.length)%items.length;if(e.key==='Home')n=0;if(e.key==='End')n=items.length-1;if(n!==undefined){e.preventDefault();select(n);tabs.children[n].focus();}});
    tabs.append(button);
  });root.append(tabs,panel);select(0);
}
function interactions() {
  switcher('bronze-comparison',[
    ['Minoan',`<h3>Crete · Knossos</h3><p>Course dates: 2500–1400 BCE. The slides connect the palace at Knossos, the mythical Minos and <strong>Linear A</strong>. Look closely at the palace and bull-leaping images below.</p>`],
    ['Mycenaean',`<h3>Mainland Greece · Mycenae</h3><p>Course dates: 1600–1100 BCE. Compare fortifications, weapons and gold burial objects. Palace administration used <strong>Linear B</strong> to record early Greek.</p>`],
    ['Compare',`<div class="table-wrap"><table><tr><th></th><th>Minoan</th><th>Mycenaean</th></tr><tr><td>Setting</td><td>Crete</td><td>Greek mainland</td></tr><tr><td>Course site</td><td>Knossos</td><td>Mycenae</td></tr><tr><td>Script</td><td>Linear A</td><td>Linear B</td></tr><tr><td>Visual evidence</td><td>Palace and fresco</td><td>Weapons, gate and mask</td></tr></table></div>`]
  ],'Compare Bronze Age civilizations');
  switcher('iliad-plot',[
    ['01 · Dishonour',`<h3>A dispute within the Greek army</h3><p>Agamemnon takes Briseis from Achilles. Achilles experiences this as a public loss of honour and withdraws from battle.</p>`],
    ['02 · Withdrawal',`<h3>The cost of absence</h3><p>Without Achilles, the Greeks suffer heavy losses. Hector leads successful Trojan attacks.</p>`],
    ['03 · Grief',`<h3>Patroclus enters the battle</h3><p>Achilles’s close companion Patroclus fights wearing Achilles’s armour. Hector kills him, changing the direction of Achilles’s anger.</p>`],
    ['04 · Revenge',`<h3>Achilles returns</h3><p>Achilles reconciles with Agamemnon and fights again. He kills Hector and drags his body in revenge.</p>`],
    ['05 · Recognition',`<h3>Priam asks for his son</h3><p>Priam comes to Achilles for Hector’s body. Achilles responds to the father’s grief. Hector’s funeral closes the epic.</p>`]
  ],'The plot of the Iliad');
  switcher('calendar-comparison',[
    ['1600',`<h3>A leap year in both systems</h3><p>1600 is divisible by 4 and by 400. It meets both the Julian and Gregorian rules.</p>`],
    ['1700',`<h3>The rules give different answers</h3><p>1700 is divisible by 4, so the Julian rule gives a leap year. It is a century year not divisible by 400, so the Gregorian rule does not.</p>`],
    ['2000',`<h3>A century year that qualifies</h3><p>2000 is divisible by 400. It is a Gregorian leap year as well as a Julian leap year.</p>`]
  ],'Calendar examples');
  switcher('place-explorer',places.map(([name,ipa,description,zh])=>[name,`<h3>${name}</h3><p>${ipa}</p><p>${description}</p><p class="zh" lang="zh-CN">${zh}</p><p class="source-link">Locate the name on the full course map below. Select the image to enlarge its labels.</p>`]),'Place names on the Greek map');
  switcher('character-explorer',characters.map(([name,role,ipa,description,zh])=>[name,`<p class="eyebrow">${role}</p><h3>${name}</h3><p>${ipa}</p><p>${description}</p><p class="zh" lang="zh-CN">${zh}</p>`]),'People of the Trojan War');
  const review=$('#review-questions');if(review) review.innerHTML=questions.map(([q,route,hint],i)=>`<details><summary><span class="number">${String(i+1).padStart(2,'0')}.</span> ${q}</summary><p>${hint}</p><a href="#${route}">Return to the reading ↗</a></details>`).join('');
}
function route(scroll=true) {
  let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch{}
  const [sectionId,topicId]=hash.split('/');
  let index=sections.findIndex(s=>s.id===sectionId);if(index<0)index=0;
  active=index;const section=sections[index];
  $('#section-label').textContent=section.no;
  $('#section-title').textContent=section.title;
  $('#section-intro').textContent=section.intro;
  document.querySelector('.heading-portrait')?.remove();
  $('.lesson-heading').classList.toggle('has-portrait',section.id==='overview');
  if(section.id==='overview'){
    const portrait=document.createElement('div');portrait.className='heading-portrait';
    portrait.innerHTML=figure([47,0,'Homer · the poet remembered by later generations.']);
    $('.lesson-heading').append(portrait);
  }
  document.title=`${section.title} · Early Greece · Western Culture`;
  $('#subnav').innerHTML=section.topics.map(t=>`<a href="#${section.id}/${t.id}"${t.id===topicId?' aria-current="location"':''}>${t.title}</a>`).join('');
  $('#lesson-nav').innerHTML=sections.map((s,i)=>`<a href="#${s.id}"${index===i?' aria-current="page"':''}><span>${s.no}</span>${s.title}</a>`).join('');
  $('#lesson-content').innerHTML=section.topics.map(renderTopic).join('');
  const sirens=document.querySelector('#odyssey .topic-copy');
  if(sirens){const citation=document.createElement('p');citation.className='source-link';citation.innerHTML='<a href="https://www.theoi.com/Text/HomerOdyssey12.html" target="_blank" rel="noreferrer">Read Homer · Odyssey, Book 12 (A. T. Murray translation) ↗</a>';sirens.append(citation);}
  interactions();
  const previous=sections[index-1],next=sections[index+1];
  $('#previous').href=previous?'#'+previous.id:'greece.html';$('#previous').textContent=previous?'← '+previous.title:'← W1 · Introduction';
  $('#next').href=next?'#'+next.id:'#overview';$('#next').textContent=next?next.title+' →':'Back to overview ↑';
  $('#position').textContent=`${index+1} / ${sections.length}`;
  $('#contents').classList.remove('open');$('.mobile-menu').setAttribute('aria-expanded','false');
  if(scroll)requestAnimationFrame(()=>{const target=document.getElementById(topicId)||$('#lesson');target.scrollIntoView({block:'start',behavior:'instant'});target.focus({preventScroll:true});});
}
function renderSource() {
  const slide=source[selectedPage-1];$('#source-select').value=selectedPage;
  $('[data-source-prev]').disabled=selectedPage===1;$('[data-source-next]').disabled=selectedPage===69;
  $('#source-body').innerHTML=`<p class="source-link">Original wording is retained. Corrections and qualifications appear in the lesson.</p><img class="original-slide" src="${imageBase}slides/slide-${String(selectedPage).padStart(2,'0')}.jpg" alt="Complete original W2 slide ${selectedPage}" style="width:100%;height:auto"><h3>Original text</h3><pre>${escape(slide.text)||'No text boxes on this page. Read the original image above.'}</pre><h3>Speaker notes${selectedPage===54?' · unrelated note carried over from W1':''}</h3><pre>${escape(slide.notes)||'No speaker notes.'}</pre>${slide.pictures.length?`<details><summary>Individual source images · ${slide.pictures.length}</summary><div class="source-images">${slide.pictures.map(p=>`<a href="${imageBase+p.original}" target="_blank" rel="noreferrer"><img src="${imageBase+p.src}" alt="Image from W2 slide ${selectedPage}" loading="lazy"></a>`).join('')}</div></details>`:''}`;
}
function openSource(page,origin){selectedPage=page;returnFocus=origin;renderSource();sourceDialog.showModal();}

$('#chinese').addEventListener('click',()=>{const on=document.body.classList.toggle('with-chinese');$('#chinese').setAttribute('aria-pressed',String(on));$('#chinese span').textContent=on?'ON':'OFF';});
$('.mobile-menu').addEventListener('click',()=>{const on=$('#contents').classList.toggle('open');$('.mobile-menu').setAttribute('aria-expanded',String(on));});
for(const dialog of [lightbox,sourceDialog]){dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>returnFocus?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.image)showImage(button.dataset.image,button.dataset.caption,button);
  if(button.dataset.page)openSource(Number(button.dataset.page),button);
  if(button.classList.contains('term-button')){const enabled=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(enabled));document.getElementById(button.getAttribute('aria-controls')).hidden=!enabled;}
});
$('#originals').addEventListener('click',()=>{if(source)openSource(sections[active].topics[0].pages[0]||1,$('#originals'));});
for(let i=1;i<=69;i++){const option=document.createElement('option');option.value=i;option.textContent=i;$('#source-select').append(option);}
$('#source-select').addEventListener('change',()=>{selectedPage=Number($('#source-select').value);renderSource();});
$('[data-source-prev]').addEventListener('click',()=>{if(selectedPage>1){selectedPage--;renderSource();}});
$('[data-source-next]').addEventListener('click',()=>{if(selectedPage<69){selectedPage++;renderSource();}});
sourceDialog.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT')return;if(e.key==='ArrowRight'&&selectedPage<69){selectedPage++;renderSource();}if(e.key==='ArrowLeft'&&selectedPage>1){selectedPage--;renderSource();}});
async function init(){try{const response=await fetch('assets/w2/source.json');if(!response.ok)throw Error('source load');source=await response.json();route(Boolean(location.hash));}catch{$('#lesson-content').innerHTML='<div class="load-error"><h2>The reading could not load.</h2><p>Please check your connection and try again.</p><button id="retry">Try again</button></div>';$('#retry').addEventListener('click',init);}}
addEventListener('hashchange',()=>{if(source)route();});
init();
