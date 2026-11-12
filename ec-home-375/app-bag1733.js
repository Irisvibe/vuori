/* U09 layout from Figma 2194:11313. Cart actions and totals use the shared runtime. */
(function(){
const A=window.VuoriApp;
const S=A.state;
const icon=path=>`<img src="assets/${path}.svg" alt="">`;
const itemCount=()=>A.validBag().reduce((total,item)=>total+Number(item.qty||0),0);

const moving=new WeakSet();
const e=A.esc;
function bagItem(item,index){
 const product=A.product(item.pid),color=item.color??0;
 const invalid=item.invalid||product.retired||!product.stock;
 const size=[item.size,...Object.values(item.extra||{})].filter(Boolean).join(' / ');
 const name=product.fabric==='DreamKnit'?'DreamKnit™':product.name;
 const description=product.cn.startsWith(product.name.split(' ')[0]+' ')?product.cn.slice(product.name.split(' ')[0].length+1):product.cn;
 const detail=A.attr('product',{id:product.id,color});
 const image=product.pdpConfig?.colorImages?.[color]||'assets/'+product.image;
 return `<article class="ux-item">
  <input class="ux-check" type="checkbox" aria-label="选择 ${e(product.name)}" data-bag-check="${index}" ${item.selected&&!invalid?'checked':''} ${invalid?'disabled':''}>
  <button class="bag2194-image" ${detail}><img src="${e(image)}" alt="${e(product.cn)}"></button>
  <div class="ux-item-info">
   <button class="bag2194-product" ${detail}><span>${e(item.name||name)}</span><span>${e(description)}</span></button>
   <button class="bag2194-spec" ${A.attr('sku',{pid:product.id,index})} aria-label="修改规格" ${invalid?'disabled':''}><span>${e(product.colors[color]?.[0]||'默认色')}${size?`<span class="bag2194-size"> / ${e(size)}</span>`:''}</span>${icon('my1725/imgArrowBack')}</button>
   <span class="ux-item-price">${A.productPrice(item.price??product.price,item.compareAtPrice??product.compareAtPrice)}</span>
   ${invalid?'<span class="bag2194-unavailable">商品暂不可购买</span>':A.quantity(item.qty,'bag-qty',{index})}
   <div class="bag2194-actions">
    <button class="ux-link" ${A.attr('bag-move-to-wishlist',{index})} ${moving.has(item)?'disabled':''}>移至收藏</button>
    <button class="bag2194-delete" ${A.attr('bag-remove',{index})} aria-label="删除 ${e(product.cn)}">${icon('bag2194/imgGroup1')}</button>
   </div>
  </div>
 </article>`;
}
let moveTarget;
A.actions['bag-move-to-wishlist']=({index})=>{
 moveTarget=S.bag[Number(index)];
 if(!moveTarget||moving.has(moveTarget))return;
 A.confirmCentered('确定移至收藏夹吗？',[
  '这件商品将从购物袋移至收藏夹。','你可以在「我的收藏」中查看。'
 ],'bag-move-confirm');
};
A.actions['bag-move-confirm']=async(_,button)=>{
 const item=moveTarget;
 if(!S.bag.includes(item)||moving.has(item)){A.closeSheet(true);return}
 const error=button.closest('.centered-confirm').querySelector('.centered-confirm-error');
 error.hidden=true;
 moving.add(item);
 button.disabled=true;
 try{
  await A.setFavorite(item.pid,true);
  S.bag=S.bag.filter(row=>row!==item);
  A.save();
  if(A.route.id==='U09'&&(button.isConnected||!A.$('#ux-sheet').open))A.render(false);
  A.toast('已移至收藏夹');
 }catch(err){
  error.textContent=err.message||'暂未移至收藏夹，请重试。';
  error.hidden=false;
 }finally{
  moving.delete(item);
  button.disabled=false;
  const currentIndex=S.bag.indexOf(item);
  const currentButton=A.$(`[data-ux="bag-move-to-wishlist"][data-index="${currentIndex}"]`);
  if(currentButton)currentButton.disabled=false;
 }
};

A.views.U09=()=>{
 const items=S.bag;
 const visible=items.length&&A.q('state')!=='empty';
 const selected=A.selectedItems();
 const count=itemCount();
 const coupon=A.bagCoupon();
 const quote=A.checkoutQuote(selected,coupon);
 const alerts=(A.q('state')==='price-change'?A.notice('部分商品价格发生变化，请确认新的演示价格。','accept-price'):'')
  +(A.q('state')==='stock-change'?A.notice('部分商品库存变化，请调整数量后继续。','accept-stock'):'');
 const allSelected=count>0&&A.validBag().every(item=>item.selected);
 const invalid=A.q('state')==='invalid'
  ?`<section class="ux-section">${A.item({pid:'daily',color:0,size:'M',qty:1,price:890,invalid:true})}${A.button('清理失效商品','clear-invalid',{},'outline')}</section>`
  :'';
 const contents=visible?`
  <div class="bag1733-selection">
   <label class="ux-checklabel"><input class="ux-check" type="checkbox" aria-label="全选购物袋商品" data-bag-all ${allSelected?'checked':''}>全选</label>
  </div>
  <div class="ux-items bag1733-items">${items.map(bagItem).join('')}</div>
  ${invalid}
  <section class="bag1733-summary" aria-label="选中商品金额明细">
   ${S.bagCoupon&&!coupon?'<p class="ux-note">所选优惠券当前不可用。</p>':''}
   ${A.checkoutSummary(quote,true,true)}</section>`
  :A.commerceEmpty({
   title:'购物袋还是空的',
   icon:'bag',
   label:'去逛逛',
   secondary:`<button class="bag2194-wishlist bag2194-empty-wishlist" ${A.attr('go',{route:'U44'})}>查看收藏夹</button>`
  });
 return `<div class="bag1733" data-node-id="2391:16421">
  <div class="bag1733-scroll">
   <div class="bag2194-heading"><h1 class="bag1733-title">购物袋</h1><span>${visible?count:0}件商品</span></div>
   ${alerts}${contents}
  </div>
  ${visible?`<div class="bag1733-checkout">
   <div class="bag1733-total"><span>合计</span><strong>${A.money(quote.total)}</strong></div>
   <button class="ux-btn" ${A.attr('checkout')} ${selected.length?'':'disabled'}>去结算（${selected.length}）</button>
  </div>`:''}
 </div>`;
};

const render=A.render;
A.render=function(...args){
 const active=A.parse().id==='U09';
 const scrollTop=active&&A.route.id==='U09'?A.$('.bag1733-scroll')?.scrollTop||0:0;
 document.body.classList.toggle('bag1733-mode',active);
 render(...args);
 if(!active)return;
 if(A.$('.bag1733-scroll'))A.$('.bag1733-scroll').scrollTop=scrollTop;

 A.$('.system').innerHTML=`<span class="time">9:41</span><div class="system-icons">${icon('bag2194/imgIcon')}${icon('bag2194/imgIcon1')}${icon('bag1733/imgIcon2')}</div>`;
 A.$('#app-header').innerHTML=`
  <button class="bag1733-search" type="button" ${A.attr('go',{route:'U04'})} aria-label="搜索商品">${icon('bag2075/search')}</button>
  <img class="bag1733-wordmark" src="assets/bag2194/imgContainer.svg" alt="Vuori">
  <div class="bag1733-capsule" aria-label="微信小程序菜单">
   <span><img src="assets/pdp2075/menu-more.png.webp?v=20261029-images-all" alt=""></span><i aria-hidden="true"></i><span><img src="assets/pdp2075/menu-close.png.webp?v=20261029-images-all" alt=""></span>
  </div>
 `;

 const nav=A.$('#app-nav');
 nav.classList.remove('over-kv');
 const count=A.q('state')==='empty'?0:itemCount();
 const tabs=[
  ['U01','首页','bag2194/imgGroup1912056219'],
  ['U02','分类','bag1733/imgGroup1'],
  ['U22','社区','bag2194/imgVuoriCircleV1LogoDark2'],
  ['U09','购物袋',count?'bag2075/nav-bag-count':'bag1733/imgGroup'],
  ['U30','我的','bag1733/imgGroup1912056220']
 ];
 nav.innerHTML=tabs.map(([route,label,asset])=>`<button ${A.attr('root',{route})} aria-label="${label}" aria-current="${route==='U09'?'page':'false'}" class="${route==='U09'?'active':''}">
  <span class="bag1733-nav-icon">${icon(asset)}${route==='U09'&&count?`<span class="bag1733-nav-count" aria-hidden="true">${Math.min(count,99)}${count>99?'+':''}</span>`:''}</span>
  <span>${label}</span>
 </button>`).join('');
};
})();
