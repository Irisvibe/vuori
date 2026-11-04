/* Global IA reference: the user's three screenshots, 2026-10-27.
   Men detail tree was not supplied. Accessories supplemented from the user screenshot on 2026-10-27.
   New/best/sets are explicit prototype selections, not real merchandising or sales ranks. */
(function(){
const A=window.VuoriApp,S=A.state,e=A.esc;
const C=A.Catalog={active:'women',scroll:{},folds:{},gender:'女士'};
const accessoryTypes=[['all','全部配饰'],['bags','包袋'],['hair','发饰'],['hats','帽子'],['socks','袜子'],['equipment','瑜伽垫与装备'],['sale','优惠精选']];
const roots=[['new','新品'],['women','女士'],['men','男士'],['scenes','场景穿搭'],['colors','颜色'],['accessories','配饰'],['gifting','礼赠'],['explore','探索']];
const asset=path=>'assets/'+path;
const attrs=(act,data={})=>A.attr('catalog-'+act,data);
const live=()=>A.D.products.filter(p=>!p.retired);
const items=g=>live().filter(p=>p.gender===g);
const go=(title,params={},cls='catalog-link',extra='')=>`<button class="${cls}" ${attrs('open',{title,params:JSON.stringify(params)})} ${extra}><span>${e(title)}</span>${A.icon('chevron')}</button>`;
const image=(src,alt,cls='')=>`<img class="${cls}" src="${e(src)}" alt="${e(alt)}" loading="lazy">`;
const route=(label,id,params={},cls='catalog-link')=>`<button class="${cls}" ${A.attr('go',{route:id,params:JSON.stringify(params)})}><span>${e(label)}</span>${A.icon('chevron')}</button>`;
function fold(id,title,html,initial=false){const key=C.active+':'+id,opened=C.folds[key]??initial;return `<details class="catalog-fold" data-catalog-fold="${key}" ${opened?'open':''}><summary>${e(title)}<i aria-hidden="true"></i></summary><div class="catalog-fold-body">${html}</div></details>`}
function garmentHero(gender,photo,alt){
 const audience=gender==='女士'?'women':'men';
 return `<div class="catalog-hero catalog-garment-hero">
  ${image(asset(photo),alt)}
  <div class="catalog-garment-quick" role="group" aria-label="${gender}精选入口">
   ${go('新品上新',{gender,catalog:'new-'+audience,sort:'上新优先'})}
   ${go('人气之选',{gender,catalog:'popular-'+audience})}
   ${route('成套穿搭','U06',{gender})}
  </div>
 </div>`;
}
function menPane(){
 const gender='男士';
 const types=[
  ['连帽衫与卫衣','上装','strato-tee.png.webp?v=20261104-pages'],
  ['运动裤','长裤','category-men1905/joggers.png.webp?v=20261104-pages'],
  ['夹克与背心','上装','category-men1905/jackets.png.webp?v=20261104-pages'],
  ['长袖上衣','上装','category-men1905/long-sleeve.png.webp?v=20261104-pages']
 ];
 const clothingGrid=`<div class="catalog-product-types">${types.map(([label,category,photo])=>`<button ${attrs('open',{title:gender+' · '+category,params:JSON.stringify({gender,category})})}>${image(asset(photo),'')}<span>${label}</span></button>`).join('')}</div>`;
 const fabrics=[...new Set(items(gender).map(p=>p.fabric))].filter(f=>!['日常','训练'].includes(f));
 return `<div class="catalog-men" data-node-id="1905:6163">
  <div class="catalog-pane-heading"><h1>男士</h1></div>
  ${garmentHero(gender,'category-men1905/hero.png.webp?v=20261104-pages','Thibault Magnin 滑雪穿搭')}
  ${fold('featured','精选推荐',go('自在日常',{gender,scene:'日常'})+go('Restore 舒适系列',{gender,catalog:'restore'})+go('蓝色新作',{gender,color:'海岸蓝'})+go('秋日叠穿',{gender,category:'上装'}))}
  ${fold('clothing','服装分类',clothingGrid+`<button class="catalog-women-more" ${attrs('open',{title:'男士 · 全部单品',params:JSON.stringify({gender})})}>探索更多</button>`,true)}
  ${fold('accessories','配饰',accessoryLinks())}
  ${fold('collections','系列与面料',fabrics.map(f=>go(f,{gender,fabric:f})).join(''))}
 </div>`;
}
function womenPane(){
 const gender='女士';
 const restore={gender,catalog:'restore'};
 const types=[
  ['连帽衫与卫衣','上装','color-story/violet-0.png.webp?v=20261104-pages'],
  ['运动裤','长裤','halo-studio.png.webp?v=20261104-pages'],
  ['夹克与背心','上装','category-men1905/jackets.png.webp?v=20261104-pages'],
  ['长袖上衣','上装','category-men1905/jackets.png.webp?v=20261104-pages']
 ];
 const clothingGrid=`<div class="catalog-product-types">${types.map(([label,category,photo])=>`<button ${attrs('open',{title:gender+' · '+category,params:JSON.stringify({gender,category})})}>${image(asset(photo),'')}<span>${label}</span></button>`).join('')}</div>`;
 const fabrics=[...new Set(items(gender).map(p=>p.fabric))].filter(f=>!['日常','训练'].includes(f));
 return `<div class="catalog-women" data-node-id="1736:1105">
  <div class="catalog-pane-heading"><h1>女士</h1></div>
  ${garmentHero(gender,'category-women1736/hero.png.webp?v=20261104-pages','女士秋日穿搭')}
  ${fold('featured','精选推荐',go('自在日常',{gender,scene:'日常'})+go('Restore 舒适系列',restore)+go('蓝色新作',{gender,color:'海岸蓝'})+go('秋日叠穿',{gender,category:'上装'}))}
  ${fold('clothing','服装分类',clothingGrid+`<button class="catalog-women-more" ${attrs('open',{title:'女士 · 全部单品',params:JSON.stringify({gender})})}>探索更多</button>`,true)}
  ${fold('accessories','配饰',accessoryLinks())}
  ${fold('collections','系列与面料',fabrics.map(f=>go(f,{gender,fabric:f})).join(''))}
 </div>`;
}
function sceneEntry(g){return `<button class="catalog-link catalog-scene-entry" ${attrs('scenes',{gender:g||C.gender})}><span>场景穿搭</span>${A.icon('arrow')}</button>`}
const sceneCategories=[
 ['golf','高尔夫','日常'],['hike','徒步','户外'],['run','跑步','训练'],
 ['snow','滑雪 & 雪上运动',''],['swim','游泳',''],['tennis','网球','训练'],
 ['train','综合训练','训练'],['travel','出行','日常'],['yoga','瑜伽 & 普拉提','训练']
];
function scenes(){
 const gender=S.h344SceneGender||'女士';
 return `<div class="catalog-scene-gallery" data-node-id="1873:4901">
  <div class="catalog-pane-heading">
   <h1>场景穿搭</h1>
   <div class="catalog-scene-genders" role="group" aria-label="选购性别">${['女士','男士'].map(value=>`<button ${attrs('scene-gender',{value})} aria-pressed="${gender===value}">${value}</button>`).join('')}</div>
  </div>
  <div class="catalog-product-types">${sceneCategories.map(([photo,label,fallback])=>{
   const scene=items(gender).some(p=>p.scene===label)?label:fallback||label;
   return `<button ${attrs('open',{title:gender+' · '+scene,params:JSON.stringify({gender,scene})})}>${image(asset('category-scene1873/'+photo+'.png.webp?v=20261104-pages'),'')}<span>${e(label)}</span></button>`;
  }).join('')}</div>
  <button class="catalog-women-more" ${attrs('open',{title:gender+' · 全部单品',params:JSON.stringify({gender})})}>探索更多</button>
 </div>`;
}
A.actions['catalog-scene-gender']=(data)=>{
 S.h344SceneGender=data.value;
 A.render(false);
 A.$('.catalog-scene-genders [aria-pressed=true]')?.focus({preventScroll:true});
};

const navyColor=/藏蓝|深蓝|海军蓝|海岸蓝|深海蓝/;
const colorCategories=[
 {id:'red',label:'红色',tone:'#7c3023',image:'red',matches:name=>/红/.test(name)},
 {id:'violet',label:'紫色',tone:'#494166',image:'violet',matches:name=>/紫/.test(name)},
 {id:'green',label:'绿色',tone:'#36512c',image:'green',matches:name=>/绿/.test(name)},
 {id:'blue',label:'蓝色',tone:'#678a93',image:'violet',matches:name=>/蓝/.test(name)&&!navyColor.test(name)},
 {id:'white',label:'白色',tone:'#f7f7f7',image:'white',matches:name=>/白/.test(name)},
 {id:'brown',label:'棕色',tone:'#5f4c46',image:'brown',matches:name=>/棕|咖|驼/.test(name)},
 {id:'grey',label:'灰色',tone:'#979594',image:'grey',matches:name=>/灰/.test(name)&&!/黑/.test(name)},
 {id:'navy',label:'藏蓝色',tone:'#273855',image:'navy',matches:name=>navyColor.test(name)}
];
function colorCategory(){
 return `<div class="catalog-color-category" data-node-id="1873:4276">
  <div class="catalog-pane-heading"><h1>按颜色选购</h1></div>
  <div class="catalog-color-grid">${colorCategories.map(({id,label,tone,image:photo})=>`<button class="catalog-color-tile" ${attrs('color',{id})}>
   <span class="catalog-color-photo">${image(asset('category1873/'+photo+'.png.webp?v=20261104-pages'),'')}<i style="--catalog-color-tone:${tone}" aria-hidden="true"></i></span>
   <span>${label}</span>
  </button>`).join('')}</div>
  <button class="catalog-color-more" ${attrs('open',{title:'全部单品'})}>探索更多</button>
 </div>`;
}
A.actions['catalog-color']=({id})=>{
 const group=colorCategories.find(color=>color.id===id);
 if(!group)return;
 const names=new Set();
 for(const product of live()){
  const index=product.colors.findIndex(([name])=>group.matches(name));
  if(index>=0)S.cardColors[product.id]=index;
  for(const [name] of product.colors)if(group.matches(name))names.add(name);
 }
 S.pageSize=4;
 A.go('U03',{color:[...names].join(',')||group.label,title:group.label+' · 色彩选购'});
};

function genderTile(g,label,params={}){return `<button class="catalog-editorial-card" ${attrs('open',{title:label,params:JSON.stringify({gender:g,...params})})}>${image(asset(g==='女士'?'women.jpg.webp?v=20261104-pages':'men.jpg.webp?v=20261104-pages'),label)}<span>${e(label)}${A.icon('arrow')}</span></button>`}
function newness(){return `<div class="catalog-pane-heading"><h1>新品</h1></div><div class="catalog-editorial-list">${genderTile('女士','女士新品',{catalog:'new-women',sort:'上新优先'})}${genderTile('男士','男士新品',{catalog:'new-men',sort:'上新优先'})}</div><section class="catalog-simple-section"><h2>从这里发现</h2><button class="catalog-link" ${attrs('root',{value:'accessories'})}><span>配饰新品</span>${A.icon('chevron')}</button>${route('初识 Vuori','U07',{type:'story',title:'我们的故事'})}</section>`}
function accessoryLinks(includeAll=true){return accessoryTypes.filter(([key])=>includeAll||key!=='all').map(([key,label])=>go(label,{catalog:'accessories',accessory:key})).join('')}
function accessories(){const rail=`<div class="catalog-accessory-rail" tabindex="0" role="region" aria-label="配饰精选，可左右滑动">${[['bags','包袋与背包','bags'],['equipment','运动配件','fitness'],['hats','帽子','hats']].map(([key,title,img])=>`<button class="catalog-accessory-card" ${attrs('open',{title,params:JSON.stringify({catalog:'accessories',accessory:key})})}>${image(asset('category-accessories/'+img+'.webp.webp?v=20261104-pages'),title)}<span>${e(title)}${A.icon('arrow')}</span></button>`).join('')}</div>`;return `<div class="catalog-pane-heading"><h1>配饰</h1>${go('查看全部',{catalog:'accessories',accessory:'all'},'catalog-all')}</div><button class="catalog-hero catalog-accessory-hero" ${attrs('open',{title:'包袋',params:JSON.stringify({catalog:'accessories',accessory:'bags'})})}>${image(asset('category-accessories/bags.webp.webp?v=20261104-pages'),'包袋穿搭')}<span>自在随行${A.icon('arrow')}</span></button>${fold('accessory-types','配饰分类',`<div class="catalog-accessory-menu">${accessoryLinks(false)}</div>`,true)}${fold('accessory-feature','配饰精选',rail,true)}`}
function gifting(){return `<div class="catalog-pane-heading"><h1>礼赠</h1></div><p class="catalog-gift-copy">让舒适，成为一份心意。</p><div class="catalog-editorial-list">${genderTile('女士','送给她')}${genderTile('男士','送给他')}</div>`}
function explore(){return `<div class="catalog-pane-heading"><h1>探索</h1></div><button class="catalog-explore-hero" ${A.attr('go',{route:'U07',params:JSON.stringify({type:'story',title:'我们的故事'})})}>${image('assets/community.png.webp?v=20261104-pages','Vuori 社区生活')}<span>运动之外<br>生活之中${A.icon('arrow')}</span></button><section class="catalog-simple-section"><h2>发现 Vuori</h2>${route('我们的故事','U07',{type:'story',title:'我们的故事'})}${route('社区生活','U22')}${route('查找门店','U37')}</section>${sceneEntry()}${fold('fabric','按面料发现',[...new Set(live().map(p=>p.fabric))].filter(f=>!['日常','训练'].includes(f)).map(f=>go(f,{fabric:f})).join(''))}`}
function pane(){if(A.q('state')==='empty')return `<div class="catalog-pane-heading"><h1>${roots.find(([id])=>id===C.active)[1]}</h1></div><div class="catalog-unavailable"><h2>这个分类还在准备中</h2><p>先看看其他系列。</p><button class="catalog-text-link" ${attrs('reset')}>查看当前分类</button></div>`;return C.active==='women'?womenPane():C.active==='colors'?colorCategory():C.active==='scenes'?scenes():C.active==='new'?newness():C.active==='accessories'?accessories():C.active==='gifting'?gifting():C.active==='explore'?explore():menPane()}
A.views.U02=()=>`<div class="catalog-page" data-component="catalog-navigation"><div class="catalog-columns"><nav class="catalog-sidebar" aria-label="一级分类">${roots.map(([id,label])=>`<button ${attrs('root',{value:id})} aria-pressed="${id===C.active}" aria-controls="catalog-pane" class="${id===C.active?'selected':''}">${id==='scenes'&&['women','men','colors','scenes'].includes(C.active)?'场景':label}</button>`).join('')}</nav><section class="catalog-pane" id="catalog-pane" aria-label="${roots.find(([id])=>id===C.active)[1]}分类内容"><div class="catalog-pane-content">${pane()}</div></section></div></div>`;
A.actions['catalog-root']=(d)=>{if(!roots.some(([id])=>id===d.value))return;const panel=A.$('.catalog-pane');if(panel)C.scroll[C.active]=panel.scrollTop;C.active=d.value;if(C.active==='scenes'&&!S.h344SceneGender)S.h344SceneGender=C.gender;if(['women','men'].includes(C.active)){C.gender=C.active==='women'?'女士':'男士';S.gender=C.gender}A.render(false);A.$('.catalog-sidebar .selected')?.focus({preventScroll:true})};
A.actions['catalog-scenes']=d=>{S.h344SceneGender=d.gender==='男士'?'男士':'女士';A.actions['catalog-root']({value:'scenes'})};
A.actions['catalog-open']=d=>{let params={};try{params=JSON.parse(d.params||'{}')}catch{}S.pageSize=4;A.go('U03',{...params,title:d.title});};
A.actions['catalog-reset']=()=>{const params={...A.route.params};delete params.state;A.go('U02',params,true)};
// Explicit prototype merchandising sets; real CMS selections remain to be connected.
C.sets=()=>({'new-women':items('女士').filter(p=>p.id.startsWith('h344-new')).map(p=>p.id),'new-men':['strato','polo'],'popular-women':items('女士').filter(p=>p.id.startsWith('h344-pop')).map(p=>p.id),'popular-men':['strato','polo'],'restore':live().filter(p=>/restore/i.test(p.name+' '+p.cn)).map(p=>p.id)});
const filtered=A.filteredProducts;A.filteredProducts=()=>{const ps=filtered(),key=A.q('catalog');if(!key)return ps;if(key==='accessories'){const type=A.q('accessory','all'),name=accessoryTypes.find(([k])=>k===type)?.[1];const accessories=ps.filter(p=>p.department==='配饰'||p.catalogType==='accessories'||accessoryTypes.slice(1,6).some(([k,n])=>p.accessoryType===k||p.category===n));if(type==='all')return accessories;if(type==='sale')return accessories.filter(p=>p.onSale===true&&Number.isFinite(p.compareAtPrice)&&p.compareAtPrice>p.price);return accessories.filter(p=>p.accessoryType===type||p.category===name)}const ids=C.sets()[key];return ids?ps.filter(p=>ids.includes(p.id)):[]};
const listView=A.views.U03;A.views.U03=()=>{if(A.q('catalog')!=='accessories'||A.filteredProducts().length)return listView();return `<div class="ux-page catalog-accessory-results">${A.heading(A.q('title','配饰'))}${A.empty('这个类目还在准备中','当前暂无可展示的商品，先看看其他配饰。','catalog-back-accessories',{},'返回配饰分类','bag')}</div>`};
A.actions['catalog-back-accessories']=()=>{C.active='accessories';A.back()};
document.addEventListener('keydown',event=>{const rail=event.target.closest?.('.catalog-accessory-rail,.catalog-scene-view .h344-rail');if(!rail||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();rail.scrollBy({left:event.key==='ArrowRight'?150:-150,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});
function bind(){const icon=(name,ext='svg',alt='')=>`<img src="assets/category1580/${name}.${ext}" alt="${alt}">`;A.$('.system').innerHTML=`<span class="time">9:41</span><div class="system-icons">${icon('imgIcon1')}${icon('imgIcon2')}${icon('imgIcon3')}</div>`;A.$('#app-header').innerHTML=`<button class="catalog-header-search" ${A.attr('go',{route:'U04'})} aria-label="搜索商品">${icon('imgIcon4')}</button><div class="catalog-header-logo">${icon('imgImageVuori1','png.webp?v=20261104-pages','vuori')}</div><div class="catalog-header-capsule" aria-label="微信小程序菜单">${icon('imgIcon5')}<i></i>${icon('imgIcon6')}</div>`;document.querySelectorAll('.catalog-shortcuts>button>svg').forEach(icon=>icon.remove());const nav=A.$('#app-nav');nav.innerHTML=A.brandBottomNavHTML('U02');nav.classList.remove('over-kv');A.$('#app-content').onscroll=null;const panel=A.$('.catalog-pane');if(!panel)return;panel.querySelectorAll('.catalog-scene-view .h344-rail').forEach(rail=>{rail.tabIndex=0;rail.setAttribute('role','region');rail.setAttribute('aria-label','场景搭配单品，可左右滑动')});panel.scrollTop=C.scroll[C.active]||0;panel.addEventListener('scroll',()=>C.scroll[C.active]=panel.scrollTop,{passive:true});if(!matchMedia('(prefers-reduced-motion: reduce)').matches)panel.firstElementChild.animate([{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.16,1,.3,1)'});}
document.addEventListener('toggle',event=>{if(event.target.matches?.('[data-catalog-fold]'))C.folds[event.target.dataset.catalogFold]=event.target.open},true);
const render=A.render;A.render=function(...args){document.body.classList.toggle('catalog-mode',A.parse().id==='U02');render(...args);if(A.route.id==='U02')bind()};
})();
