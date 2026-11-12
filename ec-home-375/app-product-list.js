(function(){
const PLP=window.VuoriProductList;
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
const accessoryRail=()=>PLP.categoryRail({items:categoryTiles.map(([label,src,category,crop])=>({
 label,src:'assets/'+src,crop,attrs:go('U03',{category,title:label,lp:'standard'})
}))});
const travelBag=()=>PLP.editorial({
 src:'assets/plp2065/travel-bag.png.webp?v=20261029-images-all',alt:'深蓝色 Vuori 旅行包与面料细节',title:'Vuori旅行包',
 description:'功能和形态，专为长途工作量身打造。',
 action:A.button('立即选购','go',{route:'U03',params:JSON.stringify({catalog:'accessories',accessory:'bags',title:'包袋'})},'outline')
});
const tabs=(label,entries,selected,key)=>PLP.tabs({label,items:entries.map(([value,text])=>({
 label:text,attrs:attr('plp-tab',{key,value}),pressed:selected===value
}))});
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
function card(p,tones,newIds){
 const color=currentTone(p,tones),name=p.cn||p.name,tone=p.colors[color]?.[0];
 const src=p.pdpConfig?.colorImages?.[color]||'assets/'+p.image;
 return PLP.card({
  id:p.id,name,tone,src,open:attr('plp-product',{id:p.id,color}),
  fabric:p.fabric&&!['日常','训练'].includes(p.fabric)?p.fabric+(p.fabric==='DreamKnit'?'™':''):'',
  price:p.price,previousPrice:p.compareAtPrice,
  label:p.stock===0?'暂时售罄':newIds.has(p.id)?'新品推荐':'',exclusive:p.onlineExclusive===true,
  quickAdd:{
   attrs:attr('sku',{pid:p.id,color}),
   icon:'assets/home753/344-8235-imgIcon.svg',
   disabled:!p.stock||p.retired||A.q('state')==='soldout'
  },
  swatches:A.colorButtons(p,color,'plp-card-color')
 });
}
const sortbar=params=>{
 const nextPrice=params.sort==='价格从低到高'?'价格从高到低':'价格从低到高';
 return PLP.toolbar({assetBase:'assets/',filterAttrs:attr('filters'),sorts:[
  {label:'价格',attrs:attr('plp-sort',{value:nextPrice}),pressed:params.sort?.startsWith('价格'),ariaLabel:nextPrice,icon:'plp2065/price.svg'},
  {label:'销量',attrs:attr('plp-sort',{value:'销量优先'}),pressed:params.sort==='销量优先'},
  {label:'新品',attrs:attr('plp-sort',{value:'上新优先'}),pressed:params.sort==='上新优先'}
 ]});
};
function intro(kind,params,title){
 if(kind==='dream')return `<div class="plp-hero">${image('plp2065/dreamknit.png.webp?v=20261029-images-all','','eager')}<h1>${esc(params.gender||'女士')}DreamKnit™系列</h1></div>${tabs('DreamKnit 品类',dreamTabs,params.dreamTab||'','dreamTab')}`;
 if(kind==='accessories')return `<div class="plp-hero"><h1 class="plp-visually-hidden">配饰</h1>${image('plp2065/accessories.png.webp?v=20261029-images-all','Vuori 配饰穿搭','eager')}</div>${accessoryRail()}`;
 return `<h1 class="plp-heading">${esc(title)}</h1>${kind==='color'?tabs('色系性别',[['','查看全部'],['男士','男士'],['女士','女士']],params.gender||'','gender'):''}`;
}
const tones=()=>String(A.q('color')||A.q('themeColor')).split(',').filter(Boolean);
V.U03=()=>{
 const params=A.route.params,kind=variant(params),ps=A.filteredProducts();
 const isSearch=Boolean(params.q?.trim());
 const emptySearch=isSearch&&!ps.length;
 const title=kind==='popular'?(params.gender||(params.catalog==='popular-men'?'男士':'女士'))+'人气之选':params.q?'“'+params.q+'”的搜索结果':params.title||((params.gender||'')+'全部单品');
 const newIds=A.listMerchandisingTags()['新品上新'];
 const shown=ps.slice(0,Math.max(6,S.pageSize)),cards=shown.map(p=>card(p,tones(),newIds));
 if(kind==='accessories')cards.splice(Math.min(6,cards.length),0,travelBag());
 let empty='';
 if(emptySearch){
  empty=`<div class="ux-empty" role="status">${A.icon('search')}<h3>暂未找到合适的单品</h3></div>`;
 }else if(!ps.length){
  const description=kind==='accessories'?'当前暂无可展示的配饰。':'试试移除一些条件，或换个关键词。';
  empty=A.empty('暂未找到合适的单品',description,'clear-filters',{},'清空筛选','search');
 }
 return `<div class="ux-page plp-page${isSearch?' plp-search-results':''}" data-lp="${kind}" ${nodes[kind]?`data-node-id="${nodes[kind]}"`:''}>
  ${intro(kind,params,title)}
  <div class="plp-results">${emptySearch?'':sortbar(params)}
   ${ps.length?'<p class="plp-visually-hidden" role="status">'+ps.length+' 件商品</p>':''}
   ${cards.length?`<div class="plp-grid">${cards.join('')}</div>`:''}
   ${empty}
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
 old.outerHTML=card(p,tones(),A.listMerchandisingTags()['新品上新']);
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
