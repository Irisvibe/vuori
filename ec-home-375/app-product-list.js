(function(){
const A=window.VuoriApp,{views:V,actions:H,state:S,attr,esc}=A;
const nodes={dream:'2065:21787',accessories:'2025:10056',popular:'2065:22273',color:'2019:7751'};
const variant=params=>{
 if(params.catalog==='accessories'&&(!params.accessory||params.accessory==='all'))return 'accessories';
 if(params.lp==='standard'||params.q)return 'standard';
 if(params.lp==='color'||params.themeColor||params.color&&/色系|色彩选购|迷雾蓝/.test(params.title||''))return 'color';
 if(params.themeFabric==='DreamKnit'||params.fabric==='DreamKnit')return 'dream';
 if(params.catalog?.startsWith('popular-')||params.collection==='edit')return 'popular';
 return 'standard';
};
A.productListScope=()=>{
 const params={...A.route.params},kind=variant(params);
 if(kind==='color'){
  params.lp='color';
  params.themeColor=params.themeColor||params.color||'';
 }
 if(kind==='dream')params.themeFabric='DreamKnit';
 if(kind==='standard')params.lp='standard';
 return params;
};

const image=(src,alt='',loading='lazy')=>`<img src="assets/${esc(src)}" alt="${esc(alt)}" loading="${loading}">`;
const icon=name=>image('plp2065/'+name+'.svg','','eager');
const go=(route,params={})=>attr('go',{route,params:JSON.stringify(params)});
const categoryTiles=[
 ['运动短袖','home1843/category-15.png.webp?v=20261029-images-all','上装',[-7.75,-3.99,152,189]],
 ['连帽衫','home1843/category-17.png.webp?v=20261029-images-all','上装',[-6.75,-3.99,149,188]],
 ['毛衣','home1843/category-16.png.webp?v=20261029-images-all','上装',[-6.75,-3.99,151,188]],
 ['运动短袖','home1843/category-18.png.webp?v=20261029-images-all','上装',[-6.25,-1.69,149,184]],
 ['运动短袖','home1843/category-19.png.webp?v=20261029-images-all','上装',[-7.75,-3,151,186]],
 ['运动短袖','plp2065/category-6.png.webp?v=20261029-images-all','上装'],
 ['运动短袖','plp2065/category-7.png.webp?v=20261029-images-all','上装']
];
const accessoryRail=()=>`<div class="plp-category-rail" aria-label="横滑浏览推荐分类">${categoryTiles.map(([label,src,category,crop])=>`<button ${go('U03',{category,title:label,lp:'standard'})} class="plp-category-tile"><span class="plp-category-photo">${crop?`<span class="plp-category-crop" style="left:${crop[0]}px;top:${crop[1]}px;width:${crop[2]}px;height:${crop[3]}px">${image(src)}</span>`:image(src)}</span><span>${label}</span></button>`).join('')}</div>`;
const travelBag=()=>`<article class="plp-editorial">${image('plp2065/travel-bag.png.webp?v=20261029-images-all','深蓝色 Vuori 旅行包与面料细节')}<h2>Vuori旅行包</h2><p>功能和形态，专为长途工作量身打造。</p>${A.button('立即选购','go',{route:'U03',params:JSON.stringify({catalog:'accessories',accessory:'bags',title:'包袋'})},'outline')}</article>`;
const tabs=(label,entries,selected,key)=>`<div class="plp-tabs" role="group" aria-label="${label}">${entries.map(([value,text])=>`<button ${attr('plp-tab',{key,value})} aria-pressed="${selected===value}">${text}</button>`).join('')}</div>`;
const dreamTabs=[['','查看全部'],['hoodies','连帽衫与卫衣'],['pants','运动裤与运动裤'],['layers','背心与夹克'],['short-tops','Short Sleeve Tops'],['shorts','Shorts'],['long-tops','Long Sleeve Tops'],['jackets','Shirt Jackets']];
const dreamCategory={
 hoodies:p=>/hoodie|sweatshirt|连帽衫|卫衣/i.test(p.name+' '+p.cn),
 pants:p=>p.category==='长裤',
 layers:p=>/vest|jacket|背心|夹克|外套/i.test(p.name+' '+p.cn),
 'short-tops':p=>/tee|short sleeve|短袖/i.test(p.name+' '+p.cn),
 shorts:p=>p.category==='短裤',
 'long-tops':p=>/long sleeve|长袖/i.test(p.name+' '+p.cn),
 jackets:p=>/jacket|夹克|外套/i.test(p.name+' '+p.cn)
};
const filtered=A.filteredProducts;
A.filteredProducts=(params=A.route.params)=>{
 const products=filtered(params),test=variant(params)==='dream'&&Object.hasOwn(dreamCategory,params.dreamTab)&&dreamCategory[params.dreamTab];
 return test?products.filter(test):products;
};

const currentTone=(p,colors)=>{
 const saved=S.cardColors[p.id];
 if(saved!==undefined&&p.colors[saved])return saved;
 const matching=p.colors.findIndex(([name])=>colors.includes(name));
 return matching<0?0:matching;
};
function card(p,tones,newIds,quickBuy){
 const color=currentTone(p,tones),name=p.cn||p.name,tone=p.colors[color]?.[0];
 const src=p.pdpConfig?.colorImages?.[color]||'assets/'+p.image;
 const open=attr('plp-product',{id:p.id,color});
 const price=A.money(p.price).replace(/^¥ /,'¥');
 return `<article class="plp-product" data-pid="${esc(p.id)}">
  <div class="plp-product-photo"><button ${open} class="plp-product-link" aria-label="查看${esc(name)}"><img src="${esc(src)}" alt="${esc(name)}" loading="lazy"></button>
   ${p.stock===0?'<span class="plp-card-label">暂时售罄</span>':newIds.has(p.id)?'<span class="plp-card-label">新品推荐</span>':''}
   ${quickBuy&&p.stock!==0?`<button class="plp-card-add" ${attr('sku',{pid:p.id,color})} aria-label="快速加购 ${esc(name)}">${image('home753/344-8235-imgIcon.svg','','eager')}</button>`:''}
  </div>
  ${A.colorButtons(p,color,'plp-card-color')}
  <button class="plp-product-name" ${open}>${p.fabric&&!['日常','训练'].includes(p.fabric)?`<span>${esc(p.fabric)}${p.fabric==='DreamKnit'?'™':''}</span>`:''}${esc(name)}</button>
  ${tone?`<p class="plp-product-tone">${esc(tone)}</p>`:''}
  <p class="plp-product-price ${p.compareAtPrice>p.price?'is-discounted':''}">${price}${p.compareAtPrice>p.price?` <s>${A.money(p.compareAtPrice).replace(/^¥ /,'¥')}</s>`:''}</p>
  ${p.onlineExclusive===true?'<p class="plp-product-exclusive">线上专享</p>':''}
 </article>`;
}
const sortbar=params=>{
 const price=params.sort?.startsWith('价格');
 return `<div class="plp-sortbar" aria-label="排序和筛选">
  <button ${attr('plp-sort',{value:params.sort==='价格从低到高'?'价格从高到低':'价格从低到高'})} aria-pressed="${!!price}" aria-label="${params.sort==='价格从低到高'?'价格从高到低':'价格从低到高'}">价格${icon('price')}</button>
  <button ${attr('plp-sort',{value:'销量优先'})} aria-pressed="${params.sort==='销量优先'}">销量</button>
  <button ${attr('plp-sort',{value:'上新优先'})} aria-pressed="${params.sort==='上新优先'}">新品</button>
  <button ${attr('filters')} class="plp-open-filter">筛选${icon('filter')}</button>
 </div>`;
};
function intro(kind,params,title){
 if(kind==='dream')return `<div class="plp-hero">${image('plp2065/dreamknit.png.webp?v=20261029-images-all','','eager')}<h1>${esc(params.gender||'女士')}DreamKnit™系列</h1></div>${tabs('DreamKnit 品类',dreamTabs,params.dreamTab||'','dreamTab')}`;
 if(kind==='accessories')return `<div class="plp-hero"><h1 class="plp-visually-hidden">配饰</h1>${image('plp2065/accessories.png.webp?v=20261029-images-all','Vuori 配饰穿搭','eager')}</div>${accessoryRail()}`;
 return `<h1 class="plp-heading">${esc(title)}</h1>${kind==='color'?tabs('色系性别',[['','查看全部'],['男士','男士'],['女士','女士']],params.gender||'','gender'):''}`;
}
const tones=()=>String(A.q('color')||A.q('themeColor')).split(',').filter(Boolean);
V.U03=()=>{
 const params=A.route.params,kind=variant(params),ps=A.filteredProducts();
 const title=kind==='popular'?(params.gender||(params.catalog==='popular-men'?'男士':'女士'))+'人气之选':params.q?'“'+params.q+'”的搜索结果':params.title||((params.gender||'')+'全部单品');
 const chips=A.listFilterKeys.filter(key=>params[key]&&!(kind==='color'&&key==='color'&&(!params.themeColor||params.themeColor===params.color))&&!(kind==='dream'&&key==='fabric'&&params.fabric==='DreamKnit')&&!(key==='gender'&&(kind==='color'||kind==='popular'&&params.catalog?.startsWith('popular-'))));
 const newIds=A.listMerchandisingTags()['新品上新'];
 const shown=ps.slice(0,Math.max(6,S.pageSize)),cards=shown.map(p=>card(p,tones(),newIds,kind!=='standard'));
 if(kind==='accessories')cards.splice(Math.min(6,cards.length),0,travelBag());
 return `<div class="ux-page plp-page" data-lp="${kind}" ${nodes[kind]?`data-node-id="${nodes[kind]}"`:''}>
  ${intro(kind,params,title)}
  <div class="plp-results">${sortbar(params)}
   ${chips.length?`<div class="ux-chips">${chips.map(key=>`<button class="ux-chip selected" ${attr('clear-filter',{key})}>${esc(A.listFilterLabel(key,params[key]))} ×</button>`).join('')}<button class="ux-chip" ${attr('clear-filters')}>清空筛选</button></div>`:''}
   ${ps.length?'<p class="plp-visually-hidden" role="status">'+ps.length+' 件商品</p>':''}
   ${cards.length?`<div class="plp-grid">${cards.join('')}</div>`:''}
   ${ps.length?'':A.empty('暂未找到合适的单品',kind==='accessories'?'当前暂无可展示的配饰。':'试试移除一些条件，或换个关键词。','clear-filters',{},'清空筛选','search')}
   ${ps.length>shown.length?A.button('加载更多','load-more',{},'outline'):''}
  </div>
 </div>`;
};

H['plp-tab']=({key,value},button)=>{
 if(!['gender','dreamTab'].includes(key))return;
 const params=A.productListScope();
 if(value)params[key]=value;
 else delete params[key];
 delete params.state;
 S.pageSize=6;
 const offset=button.parentElement.scrollLeft;
 A.go('U03',params,true);
 const rail=A.$('.plp-tabs');
 if(rail){rail.scrollLeft=offset;rail.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});}
};
H['plp-sort']=({value})=>H['sort-apply']({value:A.q('sort')===value?'综合排序':value});
H['plp-product']=data=>{
 const color=Number(data.color),selection=A.PDP?.selections[data.id];
 if(selection&&selection.color!==color)H['pdp-color']({pid:data.id,color});
 H.product(data);
};
H['plp-card-color']=({pid,color},button)=>{
 const p=A.product(pid),index=Number(color);
 if(!p.colors[index])return;
 S.cardColors[pid]=index;
 const old=button.closest('.plp-product'),offset=button.parentElement.scrollLeft,focus=button===document.activeElement;
 const previous=old.previousElementSibling,parent=old.parentElement;
 old.outerHTML=card(p,tones(),A.listMerchandisingTags()['新品上新'],variant(A.route.params)!=='standard');
 const updated=previous?previous.nextElementSibling:parent.firstElementChild;
 const swatches=updated?.querySelector('.ux-swatches');
 if(swatches){swatches.scrollLeft=offset;if(focus)swatches.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});}
};
const render=A.render;
A.render=function(...args){
 const next=A.parse(),kind=variant(next.params);
 const active=next.id==='U03';
 document.body.classList.toggle('plp-mode',active);
 render(...args);
 if(active&&A.$('.plp-page'))A.decorateShopHeader({assetRoot:'plp2065',searchIcon:['popular','color'].includes(kind)?'plp2065/search-large.svg':'bag2075/header-search.svg',searchHint:next.params.q||'摇粒绒外套'});
};
})();
