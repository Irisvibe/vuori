/* Figma 366:12016 — second KV, built from the existing homepage hero. */
(function(){
 const A=window.VuoriApp;
 A.kv366HTML=first=>{
  const pager=()=>`<div class="h366-pagination" role="group" aria-label="首屏轮播分页">${[0,1].map(i=>`<button ${A.attr('kv366-select',{index:i})} aria-label="切换至第 ${i+1} 帧" aria-pressed="${i===0}"><i></i></button>`).join('')}</div>`;
  first=first.replace(/<button class="h344-progress"[\s\S]*?<\/button>/,pager());
  const second=first.replace('data-node-id="344:8055"','data-node-id="366:12016"')
   .replace(/<img class="h344-kv-image"[^>]*>/,`<div class="h366-background" aria-hidden="true"><img src="assets/kv366/imgSection.png" alt=""><img src="assets/kv366/imgSection1.png" alt=""></div>`)
   .replace(/<video[\s\S]*?<\/video>/,'')
   .replace('<h1><span>Bliss</span>Blend<span>™</span></h1>','<h1>BlissBlend™</h1>')
   .replace(/data-ux="h344-play"/g,'data-ux="kv366-auto"')
   .replace(/aria-label="播放品牌影片"/g,'aria-label="自动轮播首屏"');
  return `<div class="h366-carousel" role="region" aria-roledescription="轮播" aria-label="品牌主视觉" tabindex="0"><div class="h366-track">${[first,second].map((html,i)=>`<div class="h366-slide" role="group" aria-roledescription="幻灯片" aria-label="第 ${i+1} 帧，共 2 帧" ${i?'inert aria-hidden="true"':'aria-hidden="false"'}>${html}</div>`).join('')}</div><span class="h366-sr" aria-live="polite" aria-atomic="true">第 1 帧，共 2 帧</span></div>`;
 };
 let cleanup=()=>{};
 A.bindKV366=()=>{
  cleanup();
  const root=document.querySelector('.h366-carousel');if(!root)return;
  const track=root.querySelector('.h366-track'),slides=[...root.querySelectorAll('.h366-slide')],controller=new AbortController(),signal=controller.signal;
  let index=0,timer=null,autoplay=false,visible=true,drag=null,suppressClick=false,pending=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const stop=()=>{clearTimeout(timer);timer=null};
  const schedule=()=>{stop();if(autoplay&&visible&&!document.hidden&&(!root.contains(document.activeElement)||document.activeElement===root))timer=setTimeout(()=>select((index+1)%2),6000)};
  const sync=i=>{
   if(i!==index){root.querySelector('video')?.pause();root.querySelectorAll('[data-ux="h344-play"]').forEach(b=>{b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','继续播放品牌影片')})}
   index=i;
   slides.forEach((s,n)=>{s.inert=n!==i;s.setAttribute('aria-hidden',String(n!==i));s.classList.toggle('is-current',n===i)});
   root.querySelectorAll('[data-ux="kv366-select"]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.index===i)));
   root.querySelector('.h366-sr').textContent=`第 ${i+1} 帧，共 2 帧`;
   schedule();
  };
  const select=i=>{
   if(slides[index].contains(document.activeElement))root.focus({preventScroll:true});
   pending=i;track.scrollTo({left:i*track.clientWidth,behavior:reduced.matches?'instant':'smooth'});
   sync(i);
  };
  A.actions['kv366-select']=d=>select(Number(d.index));
  A.actions['kv366-auto']=()=>{
   autoplay=!autoplay;
   root.querySelectorAll('[data-ux="kv366-auto"]').forEach(b=>{b.setAttribute('aria-pressed',String(autoplay));b.setAttribute('aria-label',autoplay?'暂停自动轮播':'自动轮播首屏')});
   // Move focus to the carousel so autoplay can start after an explicit click.
   root.focus({preventScroll:true});
   if(autoplay){stop();timer=setTimeout(()=>select((index+1)%2),6000)}else stop();
  };
  track.addEventListener('scroll',()=>{if(pending!==null){if(Math.abs(track.scrollLeft-pending*track.clientWidth)<2)pending=null;else return}const i=Math.round(track.scrollLeft/track.clientWidth);if(i!==index)sync(i)},{passive:true,signal});
  root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select((index+1)%2)}},{signal});
  track.addEventListener('pointerdown',e=>{pending=null;if(e.pointerType!=='mouse'){stop();return}if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:track.scrollLeft,moved:false};stop()},{signal});
  track.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(!drag.moved&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(e.clientY-drag.y)){drag.moved=true;track.setPointerCapture(e.pointerId);track.classList.add('is-dragging')}if(drag.moved){e.preventDefault();track.scrollLeft=drag.left-dx}},{signal});
  const end=e=>{if(!drag)return;const d=drag;drag=null;track.classList.remove('is-dragging');if(d.moved){suppressClick=true;const direction=e.clientX-d.x;select(Math.abs(direction)>40?Math.max(0,Math.min(1,Math.round(d.left/track.clientWidth)+(direction<0?1:-1))):Math.round(d.left/track.clientWidth));if(track.hasPointerCapture(d.id))track.releasePointerCapture(d.id)}else schedule()};
  track.addEventListener('pointerup',end,{signal});track.addEventListener('pointercancel',()=>{if(!drag)return;drag=null;track.classList.remove('is-dragging');select(index)},{signal});
  track.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();suppressClick=false}},{capture:true,signal});
  root.addEventListener('focusin',stop,{signal});root.addEventListener('focusout',()=>queueMicrotask(schedule),{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();root.querySelector('video')?.pause()}else schedule()},{signal});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible)root.querySelector('video')?.pause();schedule()},{threshold:.2});observer.observe(root);
  const resize=new ResizeObserver(()=>track.scrollTo({left:index*track.clientWidth,behavior:'instant'}));resize.observe(track);
  sync(0);
  cleanup=()=>{stop();controller.abort();observer.disconnect();resize.disconnect();root.querySelector('video')?.pause()};
 };
})();
