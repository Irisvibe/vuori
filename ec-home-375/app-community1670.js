/* Activity landing from Figma 2075:25484. */
(function(){
const A=window.VuoriApp;
const asset=name=>'assets/community2075/'+name;
const picture=(name,cls='',alt='')=>`<img src="${asset(name)}" class="${cls}" alt="${alt}">`;
const themes=['Run.','Surf.','Hike.','Train.','Chill.'];
const navIcons={
 U01:picture('imgImage.svg'),
 U02:picture('imgImage1.svg'),
 U22:`<span class="community-entry-nav-mark">${picture('imgVuoriCircleV1LogoDark3.svg')}</span>`,
 U09:picture('imgGroup.svg'),
 U30:picture('imgImage2.svg')
};
A.views.U22=()=>`<section class="community-entry" data-source-node="2075:25484" aria-label="Vuori 运动社区">
 <div class="community-entry-media" aria-hidden="true">
  ${picture('img.jpg.webp?v=20261029-images-all','community-entry-background')}
  ${picture('img1.jpg.webp?v=20261029-images-all','community-entry-background')}
  ${picture('img2.jpg.webp?v=20261029-images-all','community-entry-crop')}
 </div>
 <header class="community-entry-header">
  <div class="community-entry-status" aria-hidden="true"><span>9:41</span>${picture('imgCellularConnection.svg','community-entry-cell')}${picture('imgWifi.svg','community-entry-wifi')}<i class="community-entry-battery"><b></b></i>${picture('imgCap.svg','community-entry-cap')}</div>
  <button class="community-entry-logo" ${A.attr('root',{route:'U01'})} aria-label="返回 Vuori 首页">${picture('imgVector.svg','','vuori')}</button>
  <div class="community-entry-capsule" role="img" aria-label="微信系统菜单示意">${picture('imgFill43.svg','community-entry-more')}<i></i>${picture('imgGroup2.svg','community-entry-circle')}</div>
 </header>
 <ul class="community-entry-themes" lang="en">${themes.map(label=>`<li>${label}</li>`).join('')}</ul>
 <div class="community-entry-lines" aria-hidden="true">${themes.map(()=>'<i></i>').join('')}</div>
 <div class="community-entry-copy">
  <p>在节奏中，自在探索</p>
  <div class="community-entry-actions">
   <button class="community-entry-enter" ${A.attr('go',{route:'U23',params:JSON.stringify(A.q('state')==='empty'?{state:'empty'}:{})})}>点击报名${picture('imgFrame2147216876.svg')}</button>
   <button class="community-entry-subscribe" ${A.attr('subscribe')}>订阅${picture('imgMaterialSymbolsLightAddAlertOutlineSharp.svg')}</button>
  </div>
 </div>
</section>`;

const render=A.render;
A.render=function(...args){
 const entry=A.parse().id==='U22';
 document.body.classList.toggle('community-entry-mode',entry);
 render(...args);
 if(!entry)return;
 const nav=A.$('#app-nav');
 nav.hidden=false;
 nav.innerHTML=A.brandBottomNavHTML('U22',navIcons);
 A.$('#app-content').onscroll=null;
};
})();
