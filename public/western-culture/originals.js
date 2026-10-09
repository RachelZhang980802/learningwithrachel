(() => {
  const groups = {concepts:[1,2,3,4,5,6,7,8,9],images:Array.from({length:18},(_,i)=>i+10),dialogue:Array.from({length:8},(_,i)=>i+28),study:Array.from({length:9},(_,i)=>i+36)};
  const modal = document.createElement('dialog');
  modal.className = 'source-dialog';
  modal.setAttribute('aria-label','Original course slides');
  modal.innerHTML = `<header><div><small>W1 · ORIGINAL COURSE MATERIAL</small><h2>Read alongside the original.</h2></div><button type="button" data-close aria-label="Close original slides">×</button></header><nav aria-label="Original slide navigation"><button type="button" data-back>← Previous</button><label>Slide <select aria-label="Choose original slide"></select> / 44</label><button type="button" data-forward>Next →</button></nav><p class="source-status" role="status"></p><img class="source-page" alt=""><details><summary>Original wording & speaker notes</summary><h3>Slide text · unedited</h3><pre data-text></pre><h3>Speaker notes · unedited</h3><pre data-notes></pre></details><p class="source-disclaimer">This is the original slide, including its images and wording. Source corrections and verification limits are explained in the lesson. Original statements are not automatically verified facts.</p>`;
  document.body.append(modal);
  const selector = modal.querySelector('select');
  for(let i=1;i<=44;i++){const option=document.createElement('option');option.value=i;option.textContent=String(i).padStart(2,'0');selector.append(option);}
  let page=1, origin, slides, loading;
  const render=()=>{
    selector.value=page;
    const image=modal.querySelector('img');image.src=`https://assets.negentropylearning.com.cn/western-culture/assets/w1/slides/slide-${String(page).padStart(2,'0')}.jpg`;image.alt=`W1 original slide ${page}, complete page`;
    modal.querySelector('[data-back]').disabled=page===1;modal.querySelector('[data-forward]').disabled=page===44;
    modal.querySelector('[data-text]').textContent=slides?.[page-1]?.text || (slides?'No text boxes on this slide.':'Loading original text…');
    modal.querySelector('[data-notes]').textContent=slides?.[page-1]?.notes || (slides?'No speaker notes.':'Loading…');
  };
  const open=async(number,button)=>{
    page=number;origin=button;render();modal.showModal();
    if(!slides){try{loading ||= fetch('assets/w1/source-slides.json').then(r=>{if(!r.ok)throw Error();return r.json();});slides=await loading;modal.querySelector('.source-status').textContent='';render();}catch{loading=null;modal.querySelector('.source-status').textContent='Original text could not load. Close and reopen to retry; the full slide image remains available.';}}
  };
  for(const [id,pages] of Object.entries(groups)){
    const section=document.getElementById(id), block=document.createElement('details');block.className='original-strip';
    const summary=document.createElement('summary');summary.textContent=`Explore the original slides · ${pages[0]}–${pages.at(-1)}`;block.append(summary);
    const note=document.createElement('p');note.textContent='Every original image and detail is preserved here. Select a page to read it at full size, with its original text and notes.';block.append(note);
    const grid=document.createElement('div');grid.className='source-thumbnails';
    pages.forEach(n=>{const button=document.createElement('button');button.type='button';button.innerHTML=`<img src="https://assets.negentropylearning.com.cn/western-culture/assets/w1/slides/slide-${String(n).padStart(2,'0')}.jpg" loading="lazy" alt="Original slide ${n}"><span>SLIDE ${String(n).padStart(2,'0')}</span>`;button.addEventListener('click',()=>open(n,button));grid.append(button);});block.append(grid);section.append(block);
  }
  const all=document.createElement('button');all.type='button';all.className='original-open';all.textContent='Original slides ↗';all.addEventListener('click',()=>open(groups[document.body.dataset.chapter]?.[0]||1,all));document.querySelector('.lesson-bar').append(all);
  selector.addEventListener('change',()=>{page=Number(selector.value);render();});
  modal.querySelector('[data-back]').addEventListener('click',()=>{page--;render();});
  modal.querySelector('[data-forward]').addEventListener('click',()=>{page++;render();});
  modal.querySelector('[data-close]').addEventListener('click',()=>modal.close());
  modal.addEventListener('close',()=>origin?.focus());
  modal.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT')return;if(e.key==='ArrowRight'&&page<44){page++;render();}if(e.key==='ArrowLeft'&&page>1){page--;render();}});
  const intro=document.querySelector('#references > p');intro.textContent='This reading is edited from W1-西方文明1.1.pptx. All 44 original pages, including every image, repeated definition and speaker note, remain available in Original slides. The English lesson reorganizes the material; linked sources and explicit notes distinguish corrections, teaching adaptations and details still awaiting verification.';
})();
