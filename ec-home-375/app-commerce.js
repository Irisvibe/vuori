(function(){const A=window.VuoriApp,{state:S,D,esc:e}=A,V=A.views;
// The list uses a short date. Detail and payment keep the full placement time.
const orderDateFormat = new Intl.DateTimeFormat('zh-CN', {
 timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'
});
const orderTimeFormat = new Intl.DateTimeFormat('zh-CN', {
 timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hourCycle:'h23'
});
A.orderPlacedAt = (order, compact = false) => {
 const value = order.created ?? order.createdAt;
 const date = value == null || value === '' ? null : new Date(value);
 if (!date || !Number.isFinite(date.getTime())) {
  return '<p class="order-created">下单时间暂无记录</p>';
 }
 const day = orderDateFormat.format(date);
 const full = day.replaceAll('/', '-') + ' ' + orderTimeFormat.format(date);
 return `<p class="order-created">${compact?'':'下单时间 '}<time datetime="${e(date.toISOString())}"${compact?` title="下单时间 ${e(full)}" aria-label="下单时间 ${e(full)}"`:''}>${e(compact?day.replaceAll('/', '.'):full)}</time></p>`;
};
A.orderMetadata = (order, compact = false) => `<div class="order-metadata">
 <div class="order-number"><span>订单号</span><span class="order-number-value">${e(order.id)}</span><button type="button" class="order-copy" ${A.attr('copy-demo',{value:order.id,label:'订单号'})} aria-label="复制订单号 ${e(order.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h12v13H8zM16 8V3H3v13h5"/></svg></button></div>
 ${compact?'':A.orderPlacedAt(order)}
</div>`;
function module(title,html,link=''){return `<section class="ux-home-entry"><div class="ux-sectionhead"><span>${title}</span>${link}</div>${html}</section>`}
A.fabrics=[
 {id:'interlock',name:'BreatheInterlock™',image:'fabric-interlock.png.webp?v=20261029-images-all',alt:'蓝色面料纹理与白色运动内衣穿着细节',title:'从触感开始，找到你的节奏。',desc:'贴近日常的每一次伸展，探索身体与面料的关系。',caption:'面料纹理 / 穿着细节'},
 {id:'bliss',name:'Vuori BlissBlend™',image:'feel.webp.webp?v=20261029-images-all',alt:'AllTheFeels 系列运动穿着影像',title:'跟随身体，自在伸展。',desc:'从一件贴身单品开始，发现运动与生活之间的自在。',caption:'AllTheFeels™ / 穿着影像',filter:'BlissBlend'},
 {id:'dream',name:'DreamKnit™',filter:'DreamKnit',image:'halo-studio.png.webp?v=20261029-images-all',alt:'Halo 阔腿长裤的垂坠与穿着细节',title:'让舒适，成为日常。',desc:'从清晨出发到日常相聚，找到属于自己的穿着节奏。',caption:'Halo / 垂坠细节',filter:'DreamKnit'}
];
A.fabrics.push({id:'form',name:'Vuori BlissBlend Form™',image:'fabric-blissblend-form.png.webp?v=20261029-images-all',alt:'Vuori BlissBlend Form 深色面料纹理',title:'Vuori BlissBlend Form™',desc:'探索面料与穿着体验。',caption:'面料纹理'});
const fabricTextures=[['dream','fabric-dreamknit.png.webp?v=20261029-images-all'],['bliss','fabric-blissblend.png.webp?v=20261029-images-all'],['form','fabric-blissblend-form.png.webp?v=20261029-images-all'],['interlock','fabric-breatheinterlock.png.webp?v=20261029-images-all']];
A.fabricModule=()=>`<div class="section-head"><h2>面料特辑</h2><div class="fabric-rail-controls" aria-label="浏览面料"><button ${A.attr('fabric-scroll',{direction:-1})} aria-label="上一组面料" disabled>${A.icon('back')}</button><button ${A.attr('fabric-scroll',{direction:1})} aria-label="下一组面料">${A.icon('chevron')}</button></div></div><div class="fabric-texture-rail" aria-label="面料系列，可横向滑动">${fabricTextures.map(([id,image])=>{const f=A.fabrics.find(f=>f.id===id);return `<article class="fabric-texture-item"><button class="fabric-texture-card" ${A.attr('go',{route:'U07',params:JSON.stringify({type:'fabric',fabric:id})})} aria-label="探索 ${f.name} 面料"><img src="assets/${image}" alt="${f.name} 面料纹理" width="157" height="157" loading="lazy"><span>${f.name}</span></button><div data-compare-control="${id}">${A.fabricCompareControl(id)}</div></article>`}).join('')}</div><div class="fabric-compare-bar">${A.fabricCompareBar()}</div>`;
A.bindFabricRail=()=>{const rail=document.querySelector('.fabric-texture-rail');if(!rail)return;const update=()=>{const prev=document.querySelector('[data-ux="fabric-scroll"][data-direction="-1"]'),next=document.querySelector('[data-ux="fabric-scroll"][data-direction="1"]');prev.disabled=rail.scrollLeft<2;next.disabled=rail.scrollLeft>=rail.scrollWidth-rail.clientWidth-2;};rail.addEventListener('scroll',update,{passive:true});update();};
function home(){const t=document.createElement('template');t.innerHTML=A.homeHTML;const content=t.content;const quick=content.querySelector('.quick-section');quick.querySelector('h2').textContent='甄选新品';quick.querySelector('.products').innerHTML=D.products.slice(0,2).map(p=>A.card(p)).join('');quick.querySelector('.link').setAttribute('data-ux','home-new');
 const service=content.querySelector('.service');const before=document.createElement('div');before.innerHTML=module('男士系列 / 女士系列',`<div class="ux-gender-pair"><button ${A.attr('list-gender',{value:'男士'})}><img src="assets/men.jpg.webp?v=20261029-images-all" alt="男士系列"><span>选购男士 ${A.icon('arrow')}</span></button><button ${A.attr('list-gender',{value:'女士'})}><img src="assets/women.jpg.webp?v=20261029-images-all" alt="女士系列"><span>选购女士 ${A.icon('arrow')}</span></button></div>`)+module('品牌上新',`<div class="ux-home-topic"><img src="assets/training.png.webp?v=20261029-images-all" alt="当季运动系列"><div><h3>开启自在新篇</h3><p>运动与日常之间，发现新的穿着灵感。</p>${A.link('探索全新系列','U05',{id:'new'})}</div></div>`);service.after(...before.children);
 const after=document.createElement('div');after.innerHTML=module('编辑精选',`<p class="ux-note" style="margin:-7px 0 15px">编辑精选</p><div class="ux-horizontal-products">${D.products.slice(2,4).map(p=>A.card(p,true)).join('')}</div>`,A.link('探索精选','U03',{title:'编辑精选',collection:'edit'}))+module('成套穿搭',`<div class="ux-home-topic"><img src="assets/women.jpg.webp?v=20261029-images-all" alt="日常成套穿搭示意"><div><h3>自在成套，各自精彩</h3><p>从上装到下装，逐件选择适合你的颜色与尺码。</p>${A.link('选购套装单品','U06',{kind:'set'})}</div></div>`);quick.after(...after.children);
 const search=content.querySelector('.search');search.setAttribute('data-ux','go');search.dataset.route='U04';search.setAttribute('role','button');search.tabIndex=0;
 content.querySelector('.hero .button').removeAttribute('href');content.querySelector('.hero .button').setAttribute('data-ux','go');content.querySelector('.hero .button').dataset.route='U05';content.querySelector('.hero .button').textContent='探索本季系列 →';
 content.querySelectorAll('.top-tabs a').forEach((x,i)=>{x.dataset.ux=i===0?'home-top':'home-collection';x.dataset.value=['精选','女士','男士','新品','编辑精选'][i]});
 const outfit=content.querySelector('.outfit-section');outfit.querySelectorAll('.scene-tabs button').forEach((b,i)=>{b.dataset.ux='home-outfit';b.dataset.value=['日常','训练','户外'][i];b.classList.toggle('selected',(S.homeScene||'日常')===b.dataset.value)});const scene=S.homeScene||'日常';outfit.querySelector('.outfit-visual>img').src='assets/'+({日常:'profile.png.webp?v=20261029-images-all',训练:'training.png.webp?v=20261029-images-all',户外:'community.png.webp?v=20261029-images-all'})[scene];outfit.querySelectorAll('.hotspot').forEach(x=>{x.dataset.ux='go';x.dataset.route='U06'});outfit.querySelector('.photo-action').dataset.ux='go';outfit.querySelector('.photo-action').dataset.route='U06';
 const color=content.querySelector('.color-section'),themes=[['海岸蓝','training.png.webp?v=20261029-images-all'],['浆果红','feel.webp.webp?v=20261029-images-all'],['云雾白','women.jpg.webp?v=20261029-images-all'],['炭灰黑','strato-tee.png.webp?v=20261029-images-all']],ci=S.homeColor||0;color.querySelectorAll('.color-option').forEach((b,i)=>{b.dataset.ux='home-color';b.dataset.index=i;b.classList.toggle('selected',ci===i)});color.querySelector('.color-visual img').src='assets/'+themes[ci][1];color.querySelector('.color-caption>span').textContent=themes[ci][0]+'，找到你的日常灵感。';color.querySelectorAll('a').forEach(x=>{x.dataset.ux='home-color-list';x.dataset.color=themes[ci][0]});
 const sceneBlock=document.createElement('div');sceneBlock.innerHTML=module('随境而动',`<p class="ux-note" style="margin:-7px 0 12px">从运动到日常，按场景选购</p><div class="ux-home-scenes">${['训练','日常','户外'].map(x=>`<button ${A.attr('scene-list',{value:x})}>${x} ${A.icon('arrow')}</button>`).join('')}</div>`)+module('探索关键词',`<div class="ux-home-keywords">${['AllTheFeels','阔腿裤','运动短袖'].map(x=>`<button ${A.attr('keyword',{value:x})}>${x}</button>`).join('')}</div>`);color.after(...sceneBlock.children);
 content.querySelector('.fabric-section').innerHTML=A.fabricModule();S.fabricChanged=false;content.querySelector('.outline-action').dataset.ux='story';content.querySelectorAll('.community a').forEach(x=>{x.dataset.ux='go';x.dataset.route='U22'});const membership=content.querySelector('.membership');membership.dataset.ux='root';membership.dataset.route='U30';
 // Home keeps module titles and decision-making information; narrative lives in detail pages.
 content.querySelectorAll('.hero-copy .en,.hero-copy p,.section-description,.ux-home-topic h3,.ux-home-topic p,.ux-home-entry>p,.fabric-intro,.fabric-description,.fabric-archive-copy h3,.fabric-image-caption,.outfit-copy,.story-copy h3,.story-copy p,.community-copy h3,.community-copy p,.membership p,.signoff p,.color-caption>span').forEach(el=>el.remove());
 const colorAction=content.querySelector('.color-caption a');colorAction.innerHTML='选购'+themes[ci][0]+A.icon('arrow');
 const wrap=document.createElement('div');wrap.className='home-concise';wrap.append(content);if(A.q('state')==='module-error')quick.innerHTML=A.notice('新品暂未加载，其他内容仍可继续浏览。','retry');if(A.q('state')==='missing')wrap.querySelector('.color-section')?.remove();if(A.q('state')==='expired-target')wrap.prepend(Object.assign(document.createElement('div'),{innerHTML:A.notice('部分专题已结束，可继续探索其他内容。')}));return wrap.outerHTML;}
V.U01=home;
V.U02=()=>`<div class="ux-page">${A.heading('找到你的自在装备','从运动到日常，探索适合你的系列。')}<button class="ux-searchform" ${A.attr('go',{route:'U04'})} style="width:100%"><span class="ux-searchinput">${A.icon('search')}搜索商品、系列与面料</span></button>${A.tabs(['女士','男士'],S.gender,'category-gender')}<div class="ux-categories"><aside class="ux-catside">${['全部','新品','上装','长裤','运动内衣','系列','面料'].map(x=>`<button class="${S.category===x?'selected':''}" ${A.attr('category-select',{value:x})}>${x}</button>`).join('')}</aside><section class="ux-catmain">${A.q('state')==='empty'?A.empty('这个分类还在准备中','先看看其他系列。','category-select',{value:'全部'},'查看全部','grid'):`<img class="ux-catbanner" src="assets/${S.gender==='女士'?'women.jpg.webp?v=20261029-images-all':'men.jpg.webp?v=20261029-images-all'}" alt="${S.gender}系列"><h3 class="ux-spaced">${S.gender} · ${S.category}</h3><div class="ux-category-grid">${(S.category==='面料'?['DreamKnit','BlissBlend','Strato']:S.category==='系列'?['甄选新品','日常精选','训练系列']:['全部单品','运动上装','自在长裤','日常穿搭']).map(x=>`<button ${A.attr('category-list',{value:x})}>${x}${A.icon('chevron')}</button>`).join('')}</div>${A.row('按场景发现','go',{route:'U03',params:JSON.stringify({gender:S.gender,scene:'训练',title:'训练系列'})})}${A.row('按色彩选购','go',{route:'U03',params:JSON.stringify({gender:S.gender,title:'色彩之选'})})}`}</section></div></div>`;
A.filteredProducts=(params=A.route.params)=>{
const query=key=>params[key]??'';
let ps=D.products.filter(p=>!p.retired),q=query('q').trim().toLowerCase(),gender=query('gender'),cat=query('category'),color=query('color'),size=query('size'),scene=query('scene'),fabric=query('fabric');if(query('themeColor'))ps=ps.filter(p=>p.colors.some(([name])=>query('themeColor').split(',').includes(name)));if(query('themeFabric'))ps=ps.filter(p=>p.fabric===query('themeFabric'));if(q)ps=ps.filter(p=>`${p.name} ${p.cn} ${p.fabric} ${p.colors.map(x=>x[0]).join(' ')}`.toLowerCase().includes(q));if(gender)ps=ps.filter(p=>p.gender===gender);if(cat)ps=ps.filter(p=>cat.split(',').includes(p.category));if(color)ps=ps.filter(p=>p.colors.some(c=>color.split(',').includes(c[0])));const subtype=query('subcategory'),tags=query('tag').split(',').filter(Boolean);if(subtype)ps=ps.filter(p=>subtype.split(',').includes(p.subcategory));if(tags.length){const sets=A.listMerchandisingTags();ps=ps.filter(p=>tags.some(tag=>sets[tag]?.has(p.id)));}if(size||query('stock')==='1')ps=ps.filter(p=>p.sizes.some(s=>(!size||size.split(',').includes(s))&&p.colors.some((c,i)=>(!color||color.split(',').includes(c[0]))&&(!query('themeColor')||query('themeColor').split(',').includes(c[0]))&&A.skuStock(p,i,s,query('state'))>0)));if(scene)ps=ps.filter(p=>scene.split(',').includes(p.scene));if(fabric)ps=ps.filter(p=>fabric.split(',').includes(p.fabric));if(query('price')==='under800')ps=ps.filter(p=>p.price<800);if(query('state')==='soldout')ps=ps.filter(p=>!p.stock);if(query('state')==='filter-empty'||query('state')==='empty')ps=[];const sort=query('sort');if(sort==='价格从低到高')ps.sort((a,b)=>a.price-b.price);if(sort==='价格从高到低')ps.sort((a,b)=>b.price-a.price);if(sort==='上新优先')ps.reverse();if(sort==='销量优先'){const ranked=A.listMerchandisingTags()['人气之选'];ps.sort((a,b)=>(b.salesCount??Number(ranked.has(b.id)))-(a.salesCount??Number(ranked.has(a.id))));}return ps;};
V.U03=()=>{const ps=A.filteredProducts(),title=A.q('q')?'“'+A.q('q')+'”的搜索结果':(A.q('title')||((A.q('gender')||'')+'全部单品'));return `<div class="ux-page">${A.heading(title)}<div class="ux-sortbar"><span>${ps.length} 件商品</span><button ${A.attr('sort')}>${e(A.q('sort','综合排序'))}⌄</button><button ${A.attr('filters')}>筛选 ${A.icon('filter')}</button></div>${ps.length?A.cards(ps.slice(0,S.pageSize),true)+(ps.length>S.pageSize?`<div class="ux-pad">${A.button('加载更多','load-more',{},'outline')}</div>`:'<p class="ux-note ux-pad" style="text-align:center">已显示全部商品</p>'):A.empty('暂未找到合适的单品','试试移除一些条件，或换个关键词。','clear-filters',{},'清空筛选','search')}${!ps.length?`<div class="ux-pad">${A.link('重新搜索','U04')}</div>`:''}</div>`};
const searchTrends=['樱桃深红','Halo','DreamKnit','丝绒紫','紧身裤','运动短袖','Restore'];
const searchPicks=[
 ['h344-pop-3','home753/344-8216-imgImageWomanWearingAlltheformLegging3.png.webp?v=20261029-images-all'],
 ['h344-pop-0','home753/344-8216-imgImage.png.webp?v=20261029-images-all'],
 ['h344-pop-1','home753/344-8216-imgImageWomanWearingAlltheformLegging2.png.webp?v=20261029-images-all'],
 ['h344-new-2','home753/344-8120-imgImageWomanWearingAlltheformLegging2.png.webp?v=20261029-images-all']
];
const searchIcon=(name)=>`<img src="assets/${name}.svg" alt="">`;
function searchPick(product,defaultImage){
 const color=S.cardColors[product.id]??0;
 const name=product.cn||product.name;
 return window.VuoriProductList.card({
  id:product.id,name,src:product.pdpConfig?.colorImages?.[color]||'assets/'+defaultImage,
  open:A.attr('product',{id:product.id,color}),price:product.price,previousPrice:product.compareAtPrice,
  quickAdd:{attrs:A.attr('sku',{pid:product.id,color,origin:'search'}),icon:'assets/home753/344-8235-imgIcon.svg',disabled:!product.stock},
  swatches:A.colorButtons(product,color,'search-card-color')
 });
}
function searchHistory(){
 return `<section class="search-discovery-section search-history" aria-labelledby="search-history">
  <div class="search-history-heading">
   <h2 id="search-history">最近搜索</h2>
   ${S.history.length?`<button type="button" class="search-history-clear" ${A.attr('clear-history')} aria-label="清除所有搜索记录">${searchIcon('search2230/trash')}</button>`:''}
  </div>
  ${S.history.length?`<ul class="search-history-list">${S.history.map(word=>`<li>
   <button type="button" ${A.attr('keyword',{value:word})}>${e(word)}</button>
   <button type="button" class="search-history-remove" ${A.attr('remove-history',{value:word})} aria-label="删除搜索记录 ${e(word)}">${searchIcon('search2230/remove')}</button>
  </li>`).join('')}</ul>`:'<p class="search-history-empty">还没有搜索记录</p>'}
 </section>`;
}
function searchView(query='',drawer=false){
 const picks=searchPicks.map(([id,src])=>{
  const product=D.products.find(product=>product.id===id);
  return product&&!product.retired?searchPick(product,src):'';
 }).join('');
 return `<div class="ux-page search-discovery" data-node-id="2230:24872">
  ${drawer?`<div class="search-system" aria-hidden="true"><span>9:41</span><span>${searchIcon('search2230/signal')}${searchIcon('search2230/wifi')}${searchIcon('plp2065/battery')}</span></div>`:''}
  <header class="search-drawer-header">
   <div class="search-header-nav" role="group" aria-label="页面导航">
    <button type="button" ${A.attr('close-search')} aria-label="关闭搜索">${searchIcon('search2230/back')}</button><i></i>
    <button type="button" ${A.attr('search-home')} aria-label="首页">${searchIcon('bag2075/header-home')}</button>
   </div>
   <div class="search-header-menu" aria-label="微信小程序菜单">${searchIcon('search2230/menu-more')}<i></i>${searchIcon('search2230/menu-close')}</div>
  </header>
  <form class="search-discovery-form" data-form="search" role="search">
   <button class="ux-searchsubmit search-discovery-submit" type="submit" aria-label="搜索">${searchIcon('bag2075/header-search')}</button>
   <input type="search" name="keyword" aria-label="搜索商品" enterkeyhint="search" autocomplete="off" placeholder="搜索商品、系列或颜色" value="${e(query)}" maxlength="80" aria-describedby="search-discovery-error">
   <button class="search-scan" type="button" ${A.attr('search-scan')} aria-label="扫码搜索">${searchIcon('search2230/scan')}</button>
  </form>
  <p class="ux-error search-discovery-error" id="search-discovery-error" data-search-error role="status"></p>
  <section class="search-discovery-section" aria-labelledby="search-trends">
   <h2 id="search-trends">热门趋势</h2>
   <div class="search-trend-list">${searchTrends.map(word=>`<button type="button" ${A.attr('keyword',{value:word})}>${e(word)}</button>`).join('')}</div>
  </section>
  ${searchHistory()}
  ${picks?`<section class="search-popular" aria-labelledby="search-popular">
   <h2 id="search-popular">人气推荐</h2>
   <div class="search-pick-rail" role="region" tabindex="0" aria-label="人气推荐商品，可横向滚动">${picks}</div>
  </section>`:''}
 </div>`;
}
V.U04=()=>searchView(A.q('q'));

let closeSearchTimer;
function showSearch({query,scrollTop=0}){
 let drawer=A.$('#search-drawer');
 if(!drawer){
  drawer=document.createElement('dialog');
  drawer.id='search-drawer';
  drawer.className='search-drawer';
  drawer.setAttribute('aria-label','搜索商品');
  document.body.append(drawer);
  drawer.addEventListener('cancel',event=>{event.preventDefault();dismissSearch()});
  drawer.addEventListener('click',event=>{
   if(event.target!==drawer)return;
   const rect=drawer.getBoundingClientRect();
   if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dismissSearch();
  });
  window.addEventListener('resize',()=>{if(drawer.open)A.positionSheet(drawer)});
 }
 clearTimeout(closeSearchTimer);
 drawer.classList.remove('is-closing');
 if(!drawer.open){
  drawer.innerHTML=searchView(query,true);
  A.positionSheet(drawer);
  drawer.showModal();
  drawer.scrollTop=scrollTop;
 }
}
function hideSearch(immediately){
 const drawer=A.$('#search-drawer');
 if(!drawer?.open)return;
 clearTimeout(closeSearchTimer);
 const finish=()=>{drawer.close();drawer.classList.remove('is-closing');drawer.replaceChildren()};
 if(immediately||matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}
 drawer.classList.add('is-closing');
 closeSearchTimer=setTimeout(finish,160);
}
function dismissSearch(){
 if(history.state?.searchDrawer)history.back();
 else hideSearch(false);
}
A.openSearch=(query='')=>{
 if(A.route.id==='U04'){A.$('.search-discovery-form input')?.focus();return}
 const entry=history.state;
 if(entry?.searchDrawer){showSearch(entry.searchDrawer);return}
 const searchDrawer={query};
 A.scrolls[A.lastURL]=A.$('#app-content').scrollTop;
 // Give the drawer its own history entry while keeping the underlying route.
 history.pushState({...entry,vuori:true,depth:(entry?.depth||0)+1,searchDrawer},'');
 showSearch(searchDrawer);
};
A.search=value=>{
 const q=String(value||'').trim();
 if(!q)return;
 S.history=[q,...S.history.filter(word=>word!==q)].slice(0,8);
 S.pageSize=4;
 A.track('search_submit',{keyword:q});
 const entry=history.state,drawer=A.$('#search-drawer');
 if(entry?.searchDrawer&&drawer?.open){
  const query=drawer.querySelector('[name="keyword"]').value;
  history.replaceState({...entry,searchDrawer:{query,scrollTop:drawer.scrollTop}},'');
 }
 A.go('U03',{q});
};
A.refreshSearchHistory=()=>{
 const section=A.$('.search-discovery .search-history');
 if(section)section.outerHTML=searchHistory();
};
A.actions['close-search']=()=>{if(A.$('#search-drawer')?.open)dismissSearch();else A.back()};
A.actions['search-home']=()=>{if(A.route.id==='U01')dismissSearch();else A.root('U01')};
A.actions['search-scan']=(_,button)=>{
 const status=button.closest('.search-discovery').querySelector('[data-search-error]');
 if(typeof window.wx?.scanCode!=='function'){status.textContent='请在支持扫码的微信环境中使用此功能。';return}
 window.wx.scanCode({
  success:result=>A.search(result.result),
  fail:()=>{status.textContent='扫码未完成，请重试或输入关键词。'}
 });
};
A.actions['search-card-color']=({pid,color},button)=>{
 const product=D.products.find(item=>item.id===pid);
 const pick=searchPicks.find(([id])=>id===pid);
 if(!pick||!product?.colors[Number(color)])return;
 S.cardColors[pid]=Number(color);
 const card=button.closest('.plp-product');
 const rail=card.parentElement,offset=rail.scrollLeft;
 const focused=button===document.activeElement;
 card.outerHTML=searchPick(product,pick[1]);
 rail.scrollLeft=offset;
 if(focused)Array.from(rail.children).find(item=>item.dataset.pid===pid)
  ?.querySelector('.ux-swatch[aria-pressed="true"]')?.focus({preventScroll:true});
};
const renderBeforeSearch=A.render;
A.render=(...args)=>{
 const entry=history.state?.searchDrawer;
 const routeChanged=A.lastURL!==(location.hash||'#/U01');
 if(routeChanged||!entry)hideSearch(routeChanged);
 renderBeforeSearch(...args);
 if(entry)showSearch(entry);
};
V.U05=()=>{const partial=A.q('state')==='partial';return `<div class="ux-page"><div class="ux-editorial"><img src="assets/training.png.webp?v=20261029-images-all" alt="当季运动系列"><div class="ux-editorial-copy"><h2>开启自在新篇</h2><p>运动与日常之间，发现全新穿着灵感。</p></div></div><div class="ux-pad"><h3>舒适随行，自在切换</h3><p class="ux-muted ux-spaced">从轻盈的运动单品到日常穿搭，找到属于你的节奏。系列与文案为原型示意。</p>${A.button('探索全新系列','go',{route:'U03',params:JSON.stringify({title:'甄选新品',collection:'new'})},'ux-spaced')}</div>${partial?A.notice('部分单品已结束销售，以下为仍可浏览的商品。'):''}${A.cards(D.products.slice(0,partial?1:4))}</div>`};
V.U06=()=>{const set=A.q('kind')==='set',all=A.q('state')==='unavailable';return `<div class="ux-page"><img class="ux-story-image" style="height:330px" src="assets/${set?'women.jpg.webp?v=20261029-images-all':'profile.png.webp?v=20261029-images-all'}" alt="${set?'成套穿搭':'日常搭配'}示意">${A.heading(set?'自在成套，各自精彩':'你的节奏，你的穿搭',set?'套装中的单品可独立选择，不包含整套折扣。':'从造型出发，逐件找到适合你的单品。')}<div class="ux-pad small"><p class="ux-note">关联款式为交互演示，不表示与影像中的服饰完全相同。</p></div>${all?A.empty('这套搭配暂不可购','仍可浏览搭配灵感，或继续发现其他系列。','go',{route:'U03'},'发现其他单品'):A.q('state')==='partial'?A.notice('部分搭配单品暂时缺货，可分别选购其他单品。'):''}${!all?`<div class="ux-items">${D.products.slice(0,2).map((p,i)=>`<div class="ux-item"><img src="assets/${p.image}" alt="${e(p.name)}" ${A.attr('product',{id:p.id})}><div class="ux-item-info"><h4>${p.name}</h4><p>${p.cn}</p><span class="ux-item-price">${A.productPrice(p.price,p.compareAtPrice)}</span><div class="ux-spaced">${A.q('state')==='partial'&&i===1?'<span class="ux-note">暂时缺货</span>':A.button('选择单品规格','sku',{pid:p.id},'outline')}</div></div></div>`).join('')}</div>`:''}</div>`};
V.U07=()=>{const type=A.q('type','brand'),policy=type==='policy',fabric=type==='fabric',material=A.fabrics.find(f=>f.id===A.q('fabric'))||A.fabrics[1];if(policy)return `<div class="ux-page">${A.heading(A.q('title','服务与政策'))}<div class="ux-pad ux-prose"><p>此页展示正式政策的阅读版式与返回路径。</p><h3 class="ux-gap">购物与配送</h3><p>配送范围、费用和发货承诺需以品牌正式政策和订单确认信息为准。</p><h3 class="ux-gap">退货与退款</h3><p>申请期限、商品状态要求与退款规则待业务确认。本原型不将演示数据作为正式承诺。</p><h3 class="ux-gap">个人信息</h3><p>演示输入不会提交外部服务；收货地址、会员资料与活动表单仅在当前浏览会话中使用。</p></div></div>`;return `<div class="ux-page"><img class="ux-story-image" src="assets/${fabric?material.image:'surf.png.webp?v=20261029-images-all'}" alt="${fabric?'面料故事':'运动生活方式'}">${A.heading(fabric?'感受 '+material.name:'为运动，也为生活。')}<div class="ux-pad ux-prose" style="padding-top:0"><p>${fabric?material.title:'好的状态，不只发生在运动时。让舒适融入每一天，在自然、运动与彼此的连接中，发现生活的更多可能。'}</p><p>${fabric?'柔软、轻盈与灵活的面料体验，服务于自在的运动与日常。具体性能与成分以品牌批准的商品资料为准。':'从清晨的运动到与伙伴相聚的时刻，探索更自在的生活节奏。'}</p>${A.q('state')==='video-error'?A.notice('影片暂未播放，可继续阅读图文内容。','retry'):A.button('播放品牌影片','video',{},'outline ux-gap')}</div>${A.q('state')==='empty'?'':`<section class="ux-section"><h3>${fabric&&material.filter?'相关单品':'继续发现'}</h3>${fabric?A.button(material.filter?'选购相关单品':'探索运动单品','go',{route:'U03',params:JSON.stringify(material.filter?{fabric:material.filter,title:material.name+' 系列'}:{title:'运动与日常单品'})}):A.button('走进社区','go',{route:'U22'})}</section>`}</div>`};
V.U08=()=>{const p=A.currentProduct(),v=A.q('state');if(A.detailProduct!==p.id){A.detailProduct=p.id;S.detailColor=Math.min(Number(A.q('color',0)),p.colors.length-1);S.detailSize='';S.detailQty=1;}const unavailable=p.retired||v==='retired',soldout=!p.stock||v==='soldout',priceError=v==='price-error'||p.price==null;return `<div class="ux-page"><div class="ux-gallery"><img src="assets/${p.image}" alt="${e(p.name)}" ${A.attr('media',{image:p.image})}><span class="ux-gallery-note">款式图 · ${e(p.colors[S.detailColor]?.[0])}</span></div><div class="ux-pad vui-detail-summary"><h2 class="ux-product-name">${p.name}</h2><p class="ux-muted" style="margin-top:7px">${p.cn}</p><div class="ux-price ux-spaced">${A.productPrice(priceError?null:p.price,p.compareAtPrice)}</div>${unavailable||soldout||priceError?A.notice(unavailable?'本商品已下架':soldout?'本款式暂时售罄':'暂未获取到售价，请稍后重试。','retry'):''}<div class="vui-sku-options">${window.VuoriQuickBuy.renderOptions({colors:p.colors,color:S.detailColor,sizes:p.sizes,size:S.detailSize,disabledSizes:p.sizes.filter(s=>!A.skuStock(p,S.detailColor,s)),attrs:(action,data)=>A.attr(({color:'detail-color',size:'detail-size',guide:'size-guide'})[action],{pid:p.id,...data})})}</div><p class="ux-note ux-spaced">选择的颜色以文字为准，部分规格暂用款式图展示。</p></div><section class="ux-section"><h3>自在于每一种日常</h3><p class="ux-muted">${p.fabric} 系列。轻盈的穿着体验与自然舒展的剪裁，陪伴运动和日常。</p>${A.row('成分与保养','product-info',{type:'care'})}${A.row('配送与退换','product-info',{type:'delivery'})}${A.row('联系客服','support')}</section><div class="ux-bottom"><button class="ux-support" ${A.attr('support')}>${A.icon('support')}客服</button><button class="ux-btn outline" ${A.attr('sku',{pid:p.id,mode:'buy'})} ${unavailable||soldout||priceError?'disabled':''}>立即购买</button><button class="ux-btn" ${A.attr('sku',{pid:p.id})} ${unavailable||soldout||priceError?'disabled':''}>加入购物袋</button></div></div>`};
V.U09=()=>{const items=S.bag,previewInvalid=A.q('state')==='invalid';return `<div class="ux-page">${A.heading('购物袋',S.member?'为运动与日常，留一份自在。':'游客购物袋 · 登录后可继续结算')}${A.q('state')==='price-change'?A.notice('部分商品价格发生变化，请确认新的演示价格。','accept-price'):''}${A.q('state')==='stock-change'?A.notice('部分商品库存变化，请调整数量后继续。','accept-stock'):''}${items.length&&A.q('state')!=='empty'?`<div class="ux-pad small ux-row"><label class="ux-checklabel"><input class="ux-check" type="checkbox" data-bag-all ${A.validBag().length&&A.validBag().every(i=>i.selected)?'checked':''}>全选</label><span class="ux-note">${A.validBag().length} 个有效规格</span></div><div class="ux-items">${items.map((i,k)=>A.item(i,{check:true,edit:true,index:k})).join('')}</div>${previewInvalid?`<div class="ux-section">${A.item({pid:'daily',color:0,size:'M',qty:1,price:890,invalid:true})}${A.button('清理失效商品','clear-invalid',{},'outline')}</div>`:''}<div class="ux-pad">${A.priceSummary(A.selectedItems(),null)}</div><div class="ux-bottom"><div><span class="ux-note">合计</span><div class="ux-total">${A.money(A.total(A.selectedItems()))}</div></div><button class="ux-btn" ${A.attr('checkout')} ${!A.selectedItems().length?'disabled':''}>去结算（${A.selectedItems().length}）</button></div>`:A.empty('购物袋，等待新的灵感。','发现适合运动与日常的自在装备。','go',{route:'U03'},'去逛逛')}</div>`};
V.U10=()=>{if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;const a=S.addresses.find(x=>x.id===S.selectedAddress)||S.addresses[0],items=S.checkoutItems,v=A.q('state'),noAddress=!a||v==='no-address';return `<div class="ux-page">${A.heading('确认订单')}<div class="ux-pad small">${noAddress?A.row('添加收货地址','go',{route:'U11',params:JSON.stringify({choose:'1'})}):`<button class="ux-listrow" ${A.attr('go',{route:'U11',params:JSON.stringify({choose:'1'})})}><div><p>${e(a.name)}　${e(a.phone.replace(/(\d{3})\d{4}/,'$1 **** '))}</p><p class="ux-note">${e(a.region+' '+a.detail)}</p></div>${A.icon('chevron')}</button>`}</div>${v==='undeliverable'?A.notice('当前地址暂不支持配送，请更换收货地址。'):''}${v==='price-change'||v==='stock-change'?A.notice(v==='price-change'?'部分商品价格已更新，需确认后提交。':'库存有变化，请返回调整商品数量。'):''}<div class="ux-items">${items.map(i=>A.item(i)).join('')}</div><div class="ux-pad">${A.row('优惠券','coupons',{select:'1'},S.coupon?.name||'选择可用优惠券')}${A.row('金额 / 运费说明','amount-info')}${A.priceSummary(items)}<p class="ux-note ux-spaced">普通快递配送。运费、配送范围与发货承诺为待确认规则；此处仅展示演示金额。</p></div><div class="ux-bottom"><div class="ux-total">${A.money(A.total(items)-(S.coupon?.amount||0))}</div><button class="ux-btn" ${A.attr('submit-order')} ${noAddress||v==='undeliverable'?'disabled':''}>提交订单</button></div></div>`};
const addressRegions=['上海市 闵行区','江苏省 苏州市 姑苏区','广东省 深圳市 南山区','广东省 深圳市 罗湖区','上海市 黄浦区','浙江省 杭州市 西湖区','北京市 朝阳区','四川省 成都市 锦江区'];
A.wechatDemoAddresses=[
 ['示例收件人 A','上海市 闵行区','虚构海风路 10 号 · 演示 101 室'],
 ['示例收件人 B','江苏省 苏州市 姑苏区','虚构青松街与云杉路交叉口 · 演示东门 2 号'],
 ['示例收件人 C','广东省 深圳市 南山区','虚构晴空大道 30 号 · 演示 303 室'],
 ['示例收件人 D','上海市 黄浦区','虚构月湾街 40 号 · 演示 404 室'],
 ['示例收件人 E','浙江省 杭州市 西湖区','虚构银杏巷 50 号 · 演示 505 室'],
 ['示例收件人 F','北京市 朝阳区','虚构远山路 60 号 · 演示 606 室'],
 ['示例收件人 G','四川省 成都市 锦江区','虚构晨光路 70 号 · 演示 707 室']
].map(([name,region,detail],i)=>({id:'WX-DEMO-'+(i+1),name,region,detail,phone:'0000000010'+(i+1),default:false}));
A.checkoutAddressOptions=()=>S.checkoutAddressImport?[...S.addresses.filter(item=>item.id!==S.checkoutAddressImport.id),S.checkoutAddressImport]:S.addresses;
A.checkoutAddressChoice=()=>A.checkoutAddressOptions().find(item=>item.id===S.addressChoice)||A.checkoutAddress?.();
const editAddressIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5H5v14h14v-7M10 14l9-9"/></svg>';
const maskPhone=phone=>phone.replace(/(\d{3})\d{4}/,'$1 **** ');
A.addressNameParts=({name='',surname,givenName})=>{
 if(surname!=null&&givenName!=null)return {surname,givenName};
 const [first='',...rest]=Array.from(name);
 return {surname:first,givenName:rest.join('').trim()};
};
function addressManagement(){
 const choose=A.q('choose')==='1';
 const options=choose?A.checkoutAddressOptions():S.addresses;
 const items=A.q('state')==='empty'?[]:options;
 const selected=choose&&items.find(item=>item.id===A.checkoutAddressChoice()?.id);
 return `<div class="ux-page address-management">
  <div class="address-page-heading"><h1>地址管理</h1></div>
  <div class="address-page-body">
   ${items.length?items.map(item=>{
    const contact=`<span class="address-recipient">${e(item.name)}${item.default?'<small>默认地址</small>':''}</span><span>${e(maskPhone(item.phone))}</span><span>${e(item.region+' '+item.detail)}</span>`;
    return `<article class="address-entry" data-selected="${item.id===selected?.id}">
     ${choose?`<button type="button" class="address-entry-details" ${A.attr('address-preview',{id:item.id})} aria-pressed="${item.id===selected?.id}">${contact}<span class="address-entry-selection" aria-hidden="true"></span></button>`:`<div class="address-entry-details">${contact}</div>`}
     <div class="address-entry-actions">
      <button type="button" class="address-link" ${A.attr('address-form',{id:item.id})} aria-label="编辑 ${e(item.name)}的地址">编辑</button>
      <button type="button" class="address-link" ${A.attr('address-delete',{id:item.id})} aria-label="删除 ${e(item.name)}的地址">删除</button>
     </div>
    </article>`;
   }).join(''):'<p class="address-empty" role="status">暂无收货地址</p>'}
   ${A.button('添加新地址','address-form',{},'address-primary')}
  </div>
  ${choose?`<div class="ux-bottom address-select-footer"><button type="button" class="ux-btn address-primary" ${A.attr('address-choose',{id:selected?.id||''})} ${selected?'':'disabled'}>确认选择</button></div>`:''}
 </div>`;
}
function wechatAddressList(){
 return `<div class="ux-page wechat-address-list">
  <p class="wechat-address-demo-label">演示地址 · 仅用于原型体验</p>
  ${A.wechatDemoAddresses.length?A.wechatDemoAddresses.map(item=>`<article class="wechat-address-row">
   <button type="button" class="wechat-address-pick" ${A.attr('address-wechat-pick',{id:item.id})}>
    <span>${e(item.region.replaceAll(' ',''))}</span><strong>${e(item.detail)}</strong><span>${e(item.name)} <span>${e(item.phone.replace(/^(\d{3})(\d{4})/,'$1 $2 '))}</span></span>
   </button>
   <button type="button" class="wechat-address-edit" ${A.attr('address-form',{id:item.id})} aria-label="编辑 ${e(item.name)}的演示地址">${editAddressIcon}</button>
  </article>`).join(''):'<p class="checkout-address-empty" role="status">暂无地址</p>'}
 </div>`;
}
A.actions['address-form']=({id})=>{
 const {choose,wechat,fromList,form}=A.route.params;
 const items=wechat==='1'?A.wechatDemoAddresses:A.checkoutAddressOptions();
 if(id&&!items.some(item=>item.id===id))return;
 if(A.q('state')==='empty'){
  A.go('U11',{choose},true);
 }
 A.go('U12',{id,choose,wechat,fromList,form,fromAddressList:'1'});
};
V.U11=()=>!S.member?`<div class="ux-page">${A.gate()}</div>`:A.q('wechat')==='1'?wechatAddressList():addressManagement();
V.U12=()=>{
 const demo=A.q('wechat')==='1';
 const id=A.q('id');
 const address=(demo?A.wechatDemoAddresses:A.checkoutAddressOptions()).find(item=>item.id===id)||{};
 if(id&&!address.id)return `<div class="ux-page">${A.empty('这条地址已不存在','','address-form-back',{},'返回地址管理')}</div>`;
 const {surname,givenName}=A.addressNameParts(address);
 const regions=[...new Set([address.region,A.formDrafts?.[A.lastURL]?.region,...addressRegions].filter(Boolean))];
 return `<div class="ux-page address-management">
  <div class="address-page-heading"><h1>${id?'编辑地址':'添加新地址'}</h1>${demo?'':`<button type="button" class="address-link" ${A.attr('address-wechat')}>授权微信地址</button>`}</div>
  <form class="address-page-body address-form" data-form="address" data-demo="${demo}" novalidate>
   <p class="address-required">${demo?'* 必填项 · 请使用演示信息':'* 必填项'}</p>
   <div class="address-name-fields">
    <input name="surname" value="${e(surname)}" aria-label="姓氏" placeholder="姓氏*" autocomplete="family-name" maxlength="15" required>
    <input name="givenName" value="${e(givenName)}" aria-label="名字" placeholder="名字*" autocomplete="given-name" maxlength="30" required>
   </div>
   <input type="tel" name="phone" value="${e(address.phone||'')}" aria-label="手机号码" placeholder="${demo?'演示手机号码*':'手机号码*'}" autocomplete="tel-national" maxlength="11" required>
   <div class="address-region-field">
    <select name="region" aria-label="省市区" required><option value="">省市区*</option>${regions.map(region=>`<option ${region===address.region?'selected':''}>${e(region)}</option>`).join('')}</select>
    ${A.icon('chevron')}
   </div>
   <textarea name="detail" aria-label="详细地址" placeholder="地址*" autocomplete="street-address" rows="1" maxlength="200" required>${e(address.detail||'')}</textarea>
   <label class="ux-checklabel address-default"><input class="ux-check" type="checkbox" name="default" ${address.default?'checked':''}>设为默认地址</label>
   <p class="ux-error" data-error role="status"></p>
   <button class="ux-btn address-primary" type="submit" disabled>确定</button>
  </form>
 </div>`;
};
V.U13=()=>{const o=A.currentOrder(),v=A.q('state','success'),map={success:['支付成功','订单已进入待发货状态。'],pending:['支付结果确认中','请先查询订单状态，避免重复支付。'],cancelled:['支付已取消','订单保留为待支付，可稍后继续。'],failed:['支付未完成','请查看失败提示后，再决定是否重试。']},m=map[v]||map.success;return `<div class="ux-page"><div class="ux-result"><div class="ux-result-icon">${A.icon(v==='success'?'check':v==='pending'?'clock':'order')}</div><h2>${m[0]}</h2><p class="ux-muted">${m[1]}</p><p>${e(o?.id||'演示订单')}</p><p class="ux-note">本地交互演示，未发起微信支付，没有实际扣款。正式支付状态须以服务端结果为准。</p>${v==='pending'?A.button('主动查询订单状态','query-payment',{id:o?.id}):A.button('查看订单','go',{route:'U15',params:JSON.stringify({id:o?.id})})}${A.button('继续选购','go',{route:'U03'},'outline')}</div></div>`};
V.U14=()=>{if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;const filter=A.q('status','全部'),orders=S.orders.filter(o=>filter==='全部'||o.status===filter);return `<div class="ux-page">${A.heading('我的订单')}${A.tabs(['全部','待支付','待发货','待收货','已完成','已关闭'],filter,'order-filter')}${orders.length&&A.q('state')!=='empty'?orders.map(o=>`<article class="ux-ordercard"><div class="ux-row"><span class="ux-note">${e(o.id)}</span><span class="ux-state-plain">${o.status}</span></div>${o.items.map(i=>A.item(i)).join('')}<div class="ux-row"><span class="ux-note">共 ${o.items.reduce((n,i)=>n+i.qty,0)} 件</span><span>实付 ${A.money(o.total)}</span></div><div class="ux-order-actions">${A.button('查看订单','go',{route:'U15',params:JSON.stringify({id:o.id})},'outline inline')}${o.status==='待支付'?A.button('继续支付','pay-demo',{id:o.id},'inline'):o.status==='待收货'?A.button('查看物流','go',{route:'U16',params:JSON.stringify({id:o.id})},'inline'):''}</div></article>`).join(''):A.empty('暂无相关订单','换个状态查看，或继续发现喜欢的单品。','go',{route:'U03'},'继续选购','order')}</div>`};
A.orderReturnActions=order=>{
 const lines=A.refundLines(order);
 if(!lines.length)return '';
 const entry=(label,scope)=>A.button(label,'go',{route:'U18',params:JSON.stringify({id:order.id,scope})},'outline inline');
 if(!A.canReturn(order))return entry('申请退款','partial');
 const canFull=A.canReturnFull(order,lines);
 const canPartial=!canFull||order.items.reduce((sum,item)=>sum+item.qty,0)>1;
 return (canFull?entry('整单退货','full'):'')+(canPartial?entry('部分退货','partial'):'');
};
V.U15=()=>{
 if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;
 const order=A.currentOrder();
 const previewStatus={unpaid:'待支付',partial:'部分发货',refund:'售后处理中',unknown:'支付确认中'}[A.q('state')];
 const status=previewStatus||(order.status==='待支付'&&order.paymentResult==='pending'?'支付确认中':order.status);
 const returnActions=A.orderReturnActions(order);
 const canTrack=['待收货','已完成','部分发货'].includes(status);
 const address=order.address;
 const phone=address?.phone?.replace(/(\d{3})\d{4}/,'$1 **** ')||'138 **** 0000';
 let actions=A.button('继续选购','go',{route:'U03'});
 if(status==='待支付'){
  actions=A.button('取消订单','cancel-order',{id:order.id},'outline')
   +A.button('继续支付','pay-demo',{id:order.id},'order-primary-action');
 }else if(status==='支付确认中'){
  actions=A.button('查询支付结果','query-payment',{id:order.id},'order-primary-action');
 }else if(status==='待收货'){
  actions=A.button('确认收货','receive-order',{id:order.id},'order-primary-action');
 }
 return `<div class="ux-page vui-order-page order-detail-page">
  ${A.heading(status,status==='待支付'?'订单等待支付确认。':'订单信息与履约进展将在这里更新。')}
  <div class="ux-items vui-order-panel">${order.items.map(item=>A.item(item)).join('')}</div>
  <div class="ux-pad vui-order-panel vui-order-section order-detail-summary">
   <section class="order-detail-amount" aria-labelledby="order-amount-heading">
    <h3 id="order-amount-heading">费用明细</h3>
    ${order.quote?A.checkoutSummary(order.quote):A.priceSummary(order.items,order.coupon||null)}
   </section>
   <section class="order-detail-info" aria-labelledby="order-info-heading">
    <h3 id="order-info-heading">订单信息</h3>
    ${A.orderMetadata(order)}
   </section>
   <section class="order-detail-address" aria-labelledby="order-address-heading">
    <h3 id="order-address-heading">收货信息</h3>
    <p class="order-detail-recipient"><span>${e(address?.name||'体验用户')}</span><span>${e(phone)}</span></p>
    <p class="order-detail-address-line">${e(address?address.region+' '+address.detail:'示例收货地址 · 仅用于界面演示')}</p>
   </section>
   <div class="order-detail-services">
    ${A.row('联系客服','support')}
    ${canTrack?A.row('查看物流','go',{route:'U16',params:JSON.stringify({id:order.id})}):''}
   </div>
   ${returnActions?`<div class="ux-order-actions">${returnActions}</div>`:''}
  </div>
  <div class="ux-bottom">${actions}</div>
 </div>`;
};
V.U16=()=>{const v=A.q('state'),pack=A.q('package','1');return `<div class="ux-page vui-order-page">${A.heading('物流详情')}${A.tabs(['包裹 1','包裹 2'],'包裹 '+pack,'package')}<div class="ux-pad vui-order-panel vui-order-section">${A.item(A.currentOrder().items[0])}<div class="ux-row ux-spaced"><div><p>演示承运商</p><p class="ux-note">DEMO000${pack}2601020</p></div><button class="ux-link ux-note" ${A.attr('copy-demo',{value:'DEMO000'+pack+'2601020'})}>复制单号</button></div></div><section class="ux-section">${v==='no-tracking'?'<h3>暂未更新物流轨迹</h3><p class="ux-muted">包裹信息正在同步，请稍后查看。</p>':`<h3>${v==='exception'?'物流异常，正在跟进':v==='delivered'?'包裹已签收':'包裹运输中'}</h3><div class="ux-timeline">${[v==='delivered'?'已签收 · 请核对商品':v==='exception'?'运输延迟 · 可联系客服':'运输中 · 已到达城市转运中心','包裹已离开分拨中心','已揽收 · 等待运输'].map((x,i)=>`<div class="ux-timepoint"><div><p>${x}</p><p class="ux-note">10.${22-i}　10:30 · 演示轨迹</p></div></div>`).join('')}</div>`}${A.button('联系顾问','support',{},'outline')}</section></div>`};
const refundItems=refund=>refund.lines||[{pid:refund.pid,color:0,size:'M',qty:refund.qty,price:refund.amount/refund.qty}];
V.U17=()=>{
 if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;
 const refunds=A.q('state')==='empty'?[]:S.refunds.filter(refund=>!A.q('order')||refund.order===A.q('order'));
 return `<div class="ux-page vui-order-page">${A.heading('售后记录')}${refunds.length?'<div class="vui-order-list">'+refunds.map(refund=>`<article class="ux-ordercard vui-order-card"><div class="vui-order-panel">
  <div class="ux-row"><span class="ux-note">${e(refund.id)}</span><span>${e(refund.stage)}</span></div>
  ${refundItems(refund).map(item=>A.item(item)).join('')}
  </div><div class="ux-order-actions vui-order-panel">${A.button('查看进度','go',{route:'U20',params:JSON.stringify({id:refund.id})},'outline inline')}</div>
 </article>`).join('')+'</div>':A.empty('暂无售后记录','可在订单详情中查看可申请售后的商品。','go',{route:'U14'},'查看订单','order')}</div>`;
};
V.U18=()=>{
 if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;
 const order=A.refundOrder(),full=A.q('scope')==='full';
 const lines=A.q('state')==='empty'?[]:A.refundLines(order);
 const title=A.canReturn(order)?full?'整单退货':'部分退货':'申请退款';
 const eligible=lines.length&&(!full||A.canReturn(order)&&A.canReturnFull(order,lines));
 return `<div class="ux-page vui-order-page">${A.heading(title,full?'请核对本次退货包含的商品。':'选择本次申请的商品，下一步可填写数量。')}
  ${eligible?`<form class="ux-form ux-pad vui-order-panel vui-order-section" data-form="refund-select">
   ${lines.map(({index,item,maxQty})=>`<div class="refund-select-row">
    ${full?'':`<input class="ux-check" type="checkbox" name="item" value="${index}" aria-label="选择 ${e(A.product(item.pid).cn)}">`}
    <div>${A.item({...item,qty:maxQty})}<p class="ux-note">可申请 ${maxQty} 件</p></div>
   </div>`).join('')}
   <p class="ux-error" data-error></p><button class="ux-btn" type="submit">下一步</button>
  </form>`:A.empty('当前订单暂无符合条件的商品','请查看订单或售后进度。','go',{route:'U14'},'返回订单','order')}
 </div>`;
};
V.U19=()=>{
 if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;
 const draft=S.refundDraft,order=A.refundOrder();
 const lines=draft?.order===order?.id&&draft?A.refundLines(order).filter(line=>draft.indices.includes(line.index)):[];
 if(!lines.length)return `<div class="ux-page">${A.empty('请先选择售后商品','从订单详情发起申请。','go',{route:'U14'},'查看订单','order')}</div>`;
 const amount=Math.round(lines.reduce((sum,line)=>sum+A.refundAmount(line,draft.full?line.maxQty:1),0)*100)/100;
 const title=draft.type==='仅退款'?'申请退款':draft.full?'整单退货申请':'部分退货申请';
 return `<div class="ux-page vui-order-page">${A.heading(title)}
  <form class="ux-form ux-pad vui-order-panel vui-order-section" data-form="refund" novalidate>
   ${lines.map(({index,item,maxQty})=>`<section class="refund-quantity-row">
    ${A.item({...item,qty:maxQty})}
    ${draft.full?`<input type="hidden" data-refund-quantity="${index}" value="${maxQty}"><p class="ux-note">退货数量 ${maxQty} 件</p>`:
    `<label class="ux-field"><span>申请数量 · 最多 ${maxQty} 件</span><input name="${lines.length===1?'qty':'qty-'+index}" type="number" min="1" max="${maxQty}" step="1" value="1" data-refund-quantity="${index}"></label>`}
   </section>`).join('')}
   ${A.field('申请原因','reason','请选择',{options:['请选择','尺码不合适','商品不符合预期','商品存在问题','其他原因']})}
   <div class="ux-row"><span>预计退款金额</span><span data-refund-amount>${A.money(amount)}</span></div>
   ${A.field('补充说明','description','',{type:'textarea',placeholder:'请描述具体情况（选填）'})}
   <label class="ux-upload">${A.icon('image')}<span>上传凭证（图片，选填）<input type="file" name="evidence" accept="image/*" data-refund-upload></span></label><div data-upload-preview></div>
   <p class="ux-note">金额按演示订单的商品实付分摊。凭证用于本地预览。</p>
   <p class="ux-error" data-error></p><button class="ux-btn" type="submit">提交申请</button>
  </form>
 </div>`;
};
V.U20=()=>{const r=A.currentRefund(),stage=({applying:'申请中',waiting:'待处理',return:'待寄回',refund:'待退款',completed:'已完成',rejected:'已拒绝',closed:'已关闭'})[A.q('state')]||r.stage;return `<div class="ux-page vui-order-page">${A.heading(stage,stage==='待寄回'?'请按审核结果寄回商品，再填写退货物流。':stage==='已拒绝'?'未符合当前演示条件，可联系客服了解原因。':'售后进展将在这里持续更新。')}<div class="ux-items vui-order-panel">${refundItems(r).map(item=>A.item(item)).join('')}</div><div class="ux-pad vui-order-panel vui-order-section"><div class="ux-money-row"><span>申请退款</span><span>${A.money(r.amount)}</span></div><div class="ux-money-row"><span>申请类型</span><span>${r.scope&&r.type==='退货退款'?(r.scope==='full'?'整单退货':'部分退货'):e(r.type)}</span></div><p class="ux-note ux-spaced">售后单号：${e(r.id)}</p>${stage==='待寄回'?`<div class="ux-form-notice ux-gap"><p>退货地址由审核结果提供</p><p class="ux-note">当前为演示地址，不可用于实际寄件。</p></div>${A.button(r.tracking?'修改退货物流':'填写退货物流','go',{route:'U21',params:JSON.stringify({id:r.id})},'ux-gap')}`:''}<div class="ux-timeline ux-gap">${[stage,'申请已提交'].map((x,i)=>`<div class="ux-timepoint"><div><p>${x}</p><p class="ux-note">${i?'等待审核处理':'当前进度 · 交互演示'}</p></div></div>`).join('')}</div>${A.button('联系客服','support',{},'outline')}</div></div>`};
V.U21=()=>{const r=A.currentRefund();return `<div class="ux-page vui-order-page">${A.heading(r.tracking?'修改退货物流':'填写退货物流')}<form class="ux-form ux-pad vui-order-panel vui-order-section" data-form="return-logistics" style="padding-top:0">${A.field('物流公司','carrier',r.carrier||'请选择',{options:['请选择','顺丰速运','中通快递','圆通速递','其他物流']})}${A.field('物流单号','tracking',r.tracking||'',{placeholder:'填写实际退货运单号',maxlength:40})}<p class="ux-note">请确认物流信息与寄回商品一致。本地演示不会提交真实物流。</p><p class="ux-error" data-error></p><button class="ux-btn" type="submit">提交物流信息</button></form></div>`};
})();
