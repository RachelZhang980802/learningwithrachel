(() => {
  'use strict';
  const {pages, topics, sources, audit} = window.ALLUSIONS_DATA;
  const $ = id => document.getElementById(id);
  const card=$('card'), stack=$('stack'), previous=document.querySelector('.previous'), next=document.querySelector('.next');
  let index=0, playing=false, timer=null, hovered=false, focused=false, startX=null, startY=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const current=()=>pages[index];
  const dialogOpen=()=>!!document.querySelector('dialog[open]');
  function schedule(){
    clearTimeout(timer);
    if(!playing || hovered || focused || document.hidden || dialogOpen())return;
    const words=(card.textContent||'').trim().split(/\s+/).length;
    timer=setTimeout(()=>show((index+1)%pages.length,{manual:false}),Math.max(14000,words*380));
  }
  function updatePlay(){
    $('play').textContent=playing?'Ⅱ':'▶';
    $('play').setAttribute('aria-pressed',String(playing));
    const label=playing?'Pause automatic playback':'Start automatic playback';
    $('play').setAttribute('aria-label',label);$('play').title=label;
    $('play-status').textContent=playing?(hovered||focused||dialogOpen()?'Paused while you read.':'Auto-play · pauses while you read'):'Select an allusion, or press play to browse.';
  }
  function stop(){playing=false;clearTimeout(timer);updatePlay();}
  function show(i,{manual=true,hash=true,animate=true}={}){
    if(i<0||i>=pages.length)return;
    if(manual)stop();index=i;
    const p=current();
    $('card-title').textContent=p.title;
    $('card-title').classList.toggle('long-title',p.title.length>26);
    $('category').textContent=p.editorial?'READING NOTE':'ALLUSIONS';
    $('card-kind').textContent=p.kind;
    $('card-body').innerHTML=p.html;
    card.classList.toggle('image-card',p.pictures.length>0);
    $('card-images').replaceChildren();
    p.pictures.forEach((pic,j)=>{
      const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Enlarge ${p.title} illustration ${j+1}`);
      const im=document.createElement('img');im.src=`allusions-assets/${pic.file}`;im.alt=`${p.title} · PPT slide ${p.slide}, image ${j+1}`;im.width=pic.width;im.height=pic.height;
      b.append(im);b.addEventListener('click',()=>openImage(pic,im.alt));$('card-images').append(b);
    });
    $('part-count').textContent=`${String(p.part).padStart(2,'0')} / ${String(p.parts).padStart(2,'0')}`;
    $('source-button').textContent=`PPT ${p.slide} ↗`;
    $('page-count').textContent=`Allusion ${Math.max(0,p.topic)} / ${audit.allusions} · Page ${index+1} / ${pages.length}`;
    if(p.topic===0)$('page-count').textContent=`Introduction · Page ${index+1} / ${pages.length}`;
    if(p.topic===topics.length-1)$('page-count').textContent=`Why learn allusions? · Page ${index+1} / ${pages.length}`;
    previous.disabled=index===0;next.disabled=index===pages.length-1;
    $('previous-topic').disabled=p.topic===0;$('next-topic').disabled=p.topic===topics.length-1;
    renderDock();
    if(hash)history.replaceState(null,'','#'+p.id);
    if(animate&&!reduced.matches){card.classList.remove('turn-in');void card.offsetWidth;card.classList.add('turn-in');}
    document.querySelectorAll('#topic-list button').forEach(b=>{if(Number(b.dataset.topic)===p.topic)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
    schedule();
  }
  function renderDock(){
    const t=current().topic;const start=Math.max(0,Math.min(t-1,topics.length-3));
    $('topic-tabs').replaceChildren();
    topics.slice(start,start+3).forEach((topic,offset)=>{
      const b=document.createElement('button');b.type='button';b.className='topic-tab';b.textContent=topic.title;b.title=topic.title;
      if(start+offset===t)b.setAttribute('aria-current','true');
      b.addEventListener('click',()=>show(topic.start));$('topic-tabs').append(b);
    });
  }
  previous.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));
  $('previous-topic').addEventListener('click',()=>show(topics[current().topic-1].start));
  $('next-topic').addEventListener('click',()=>show(topics[current().topic+1].start));
  $('play').addEventListener('click',()=>{playing=!playing;updatePlay();schedule();});
  stack.addEventListener('mouseenter',()=>{hovered=true;updatePlay();schedule();});
  stack.addEventListener('mouseleave',()=>{hovered=false;updatePlay();schedule();});
  stack.addEventListener('focusin',()=>{focused=true;updatePlay();schedule();});
  stack.addEventListener('focusout',e=>{if(!stack.contains(e.relatedTarget)){focused=false;updatePlay();schedule();}});
  document.addEventListener('visibilitychange',schedule);
  document.addEventListener('keydown',e=>{
    if(dialogOpen()||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
    if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}
    if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}
  });
  stack.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;startY=e.changedTouches[0].clientY;},{passive:true});
  stack.addEventListener('touchend',e=>{if(startX==null)return;const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1));startX=null;},{passive:true});
  topics.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.dataset.topic=i;b.innerHTML=escape(t.title)+`<small>PPT ${t.slide} · ${t.end-t.start} pages</small>`;b.addEventListener('click',()=>{$('contents-dialog').close();show(t.start);});$('topic-list').append(b);});
  $('search').addEventListener('input',()=>{const term=$('search').value.toLocaleLowerCase().trim();document.querySelectorAll('#topic-list button').forEach(b=>{b.hidden=!b.textContent.toLocaleLowerCase().includes(term);});});
  function openDialog(el){clearTimeout(timer);el.showModal();updatePlay();}
  $('contents-button').addEventListener('click',()=>{openDialog($('contents-dialog'));$('search').focus();});
  $('source-button').addEventListener('click',()=>{
    const p=current(),s=sources[p.slide-1];$('source-title').textContent=`PPT · Slide ${p.slide}`;
    $('source-image').src=`allusions-assets/original/slide-${p.slide}.webp`;
    $('source-image').alt=`Original slide ${p.slide}: ${p.title}`;
    const related=audit.corrections.filter(c=>c.slide===p.slide);
    $('source-text').innerHTML='<details><summary>Original slide text</summary>'+s.clean.map(t=>'<p>'+escape(t)+'</p>').join('')+'</details>'+
     (related.length?'<details><summary>Editorial changes</summary>'+related.map(c=>`<p>${escape(c.reason)}</p><p><del>${escape(c.original)}</del><br>${escape(c.revised)}</p>`).join('')+'</details>':'')+
     (s.notes.some(t=>t.trim())?'<p class="check-note">Source speaker note · to verify: '+escape(s.notes.join(' '))+'</p>':'');
    openDialog($('source-dialog'));
  });
  function openImage(pic,alt){$('image-title').textContent=`${current().title} · PPT ${current().slide}`;$('large-image').src=`allusions-assets/${pic.file}`;$('large-image').alt=alt;$('full-image').href=`allusions-assets/${pic.original}`;openDialog($('image-dialog'));}
  document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close-dialog').addEventListener('click',()=>d.close());d.addEventListener('close',()=>{updatePlay();schedule();});d.addEventListener('click',e=>{if(e.target!==d)return;const b=d.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)d.close();});});
  function fromHash(){const h=decodeURIComponent(location.hash.slice(1));let i=pages.findIndex(p=>p.id===h);if(i<0){const t=topics.find(t=>t.id===h);if(t)i=t.start;}if(i<0)i=topics.find(t=>t.slide===5).start;show(i,{hash:false,animate:false});}
  window.addEventListener('hashchange',fromHash);fromHash();
})();
