/* U09 layout from Figma 2075:26240. Cart actions and totals use the shared runtime. */
(function(){
const A=window.VuoriApp;
const S=A.state;
const icon=path=>`<img src="assets/${path}.svg" alt="">`;
const itemCount=()=>A.validBag().reduce((total,item)=>total+Number(item.qty||0),0);

A.views.U09=()=>{
 const items=S.bag;
 const visible=items.length&&A.q('state')!=='empty';
 const selected=A.selectedItems();
 const count=itemCount();
 const alerts=(A.q('state')==='price-change'?A.notice('部分商品价格发生变化，请确认新的演示价格。','accept-price'):'')
  +(A.q('state')==='stock-change'?A.notice('部分商品库存变化，请调整数量后继续。','accept-stock'):'');
 const allSelected=count>0&&A.validBag().every(item=>item.selected);
 const invalid=A.q('state')==='invalid'
  ?`<section class="ux-section">${A.item({pid:'daily',color:0,size:'M',qty:1,price:890,invalid:true})}${A.button('清理失效商品','clear-invalid',{},'outline')}</section>`
  :'';
 const contents=visible?`
  <div class="bag1733-selection">
   <label class="ux-checklabel"><input class="ux-check" type="checkbox" aria-label="全选购物袋商品" data-bag-all ${allSelected?'checked':''}>全选</label>
   <span>共${count} 件</span>
  </div>
  <div class="ux-items bag1733-items">${items.map((item,index)=>A.item(item,{check:true,edit:true,index})).join('')}</div>
  ${invalid}
  <section class="bag1733-summary" aria-label="选中商品金额明细">${A.priceSummary(selected,null).replace('<small class="ux-note">演示</small>','')}</section>`
  :A.empty('购物袋，等待新的灵感。','发现适合运动与日常的自在装备。','go',{route:'U03'},'去逛逛');
 return `<div class="bag1733">
  <div class="bag1733-scroll">
   <h1 class="bag1733-title">购物袋</h1>
   ${alerts}${contents}
  </div>
  ${visible?`<div class="bag1733-checkout">
   <div class="bag1733-total"><span>合计</span><strong>${A.money(A.total(selected))}</strong></div>
   <button class="ux-btn" ${A.attr('checkout')} ${selected.length?'':'disabled'}>去结算（${selected.length}）</button>
  </div>`:''}
 </div>`;
};

const render=A.render;
A.render=function(...args){
 const active=A.parse().id==='U09';
 document.body.classList.toggle('bag1733-mode',active);
 render(...args);
 if(!active)return;

 A.$('.system').innerHTML=`<span class="time">9:41</span><div class="system-icons">${icon('bag2075/signal')}${icon('bag2075/wifi')}${icon('bag1733/imgIcon2')}</div>`;
 A.$('#app-header').innerHTML=`
  <button class="bag1733-search" type="button" ${A.attr('go',{route:'U04'})} aria-label="搜索商品">${icon('bag2075/search')}</button>
  <img class="bag1733-wordmark" src="assets/pdp1590-latest/imgImageVuori.png.webp?v=20261029-images-all" alt="Vuori">
  <div class="bag1733-capsule" aria-label="微信小程序菜单">
   <span>${icon('bag2075/capsule-more')}</span><i aria-hidden="true"></i><span>${icon('bag2075/capsule-close')}</span>
  </div>
 `;

 const nav=A.$('#app-nav');
 nav.classList.remove('over-kv');
 const count=itemCount();
 const tabs=[
  ['U01','首页','bag2075/nav-home'],
  ['U02','分类','bag1733/imgGroup1'],
  ['U22','社区','bag2075/nav-community'],
  ['U09','购物袋',count?'bag2075/nav-bag-count':'bag1733/imgGroup'],
  ['U30','我的','bag1733/imgGroup1912056220']
 ];
 nav.innerHTML=tabs.map(([route,label,asset])=>`<button ${A.attr('root',{route})} aria-label="${label}" aria-current="${route==='U09'?'page':'false'}" class="${route==='U09'?'active':''}">
  <span class="bag1733-nav-icon">${icon(asset)}${route==='U09'&&count?`<span class="bag1733-nav-count" aria-hidden="true">${Math.min(count,99)}${count>99?'+':''}</span>`:''}</span>
  <span>${label}</span>
 </button>`).join('');
};
})();
