/* Local checkout prototype. Production pricing, reservations and payment belong to the transaction service. */
(function(){
const A=window.VuoriApp,{D,state:S,views:V,actions:H,attr,esc,money}=A;
const paymentRoute='U45';
D.pages.push([paymentRoute,'微信支付','购物袋与结算']);

const rules={orderThreshold:2000,orderDiscount:100,freeShippingThreshold:500,shipping:15,reservationMinutes:15};
const drafts=new WeakMap();
const acceptedTerms=new WeakSet();
let acceptedPriceItems;
const orderById=id=>S.orders.find(order=>order.id===id);
const currentOrder=()=>orderById(A.q('id'));
const address=A.checkoutAddress=()=>S.addresses.find(item=>item.id===S.selectedAddress)||S.addresses.find(item=>item.default)||S.addresses[0];
const go=(route,params={})=>attr('go',{route,params:JSON.stringify(params)});
const icon=name=>`<img src="assets/checkout2271/${name}.svg" alt="">`;
const wechatMethod=()=>`<div class="checkout-method"><span>${icon('wechat')}微信支付</span>${icon('check')}</div>`;
const skuKey=item=>JSON.stringify([item.pid,Number(item.color??0),item.size,Object.entries(item.extra||{}).sort()]);
const skuQuantities=items=>{
 const quantities=new Map();
 for(const item of items)quantities.set(skuKey(item),(quantities.get(skuKey(item))||0)+Number(item.qty));
 return quantities;
};
const productFor=item=>D.products.find(product=>product.id===item.pid);
const round=value=>Math.round(value*100)/100;
const hasDeliverableAddress=()=>Boolean(address())&&!['no-address','undeliverable'].includes(A.q('state'));
const canSubmit=items=>hasDeliverableAddress()&&items.length>0&&acceptedTerms.has(items);

function quote(items,coupon=null){
 const subtotal=round(A.total(items));
 const itemDiscount=round(items.reduce((sum,item)=>{
  const product=productFor(item);
  const price=item.price??product?.price??0;
  return sum+Math.max(0,Number(item.compareAtPrice??product?.compareAtPrice??price)-price)*item.qty;
 },0));
 const orderDiscount=subtotal>=rules.orderThreshold?rules.orderDiscount:0;
 const eligibleAmount=round(subtotal-orderDiscount);
 const couponDiscount=coupon?.online&&coupon.status==='可用'&&eligibleAmount>=coupon.threshold
  ?round(Math.min(coupon.amount,eligibleAmount)):0;
 const shipping=items.length&&eligibleAmount<rules.freeShippingThreshold?rules.shipping:0;
 const merchandisePayable=round(eligibleAmount-couponDiscount);
 return {subtotal:round(subtotal+itemDiscount),itemDiscount,orderDiscount,couponDiscount,shipping,merchandisePayable,total:round(merchandisePayable+shipping),eligibleAmount};
}

function amountRows(value,hideZeroDiscounts=false,couponButton=false){
 return [
  ['商品金额',value.subtotal],
  ['商品优惠',value.itemDiscount,true],
  ['订单优惠',value.orderDiscount,true],
  ['优惠券优惠',value.couponDiscount,true],
  ['配送费',value.shipping]
 ].filter(([label,amount,discount])=>!hideZeroDiscounts||!discount||amount>0||(couponButton&&label==='优惠券优惠'))
  .map(([label,amount,discount])=>couponButton&&label==='优惠券优惠'
   ?`<button class="ux-money-row bag1733-coupon" ${attr('coupons')} aria-label="选择优惠券或输入券码"><span>优惠券</span><span${amount?' class="checkout-discount"':''}>${amount?'- '+money(amount):'未使用'}</span></button>`
   :`<div class="ux-money-row"><span>${label}</span><span${discount&&amount>0?' class="checkout-discount"':''}>${discount&&amount>0?'- ':''}${money(amount)}</span></div>`).join('')
  +`<div class="ux-money-row total"><span>应付金额</span><strong>${money(value.total)}</strong></div>`;
}
A.checkoutSummary=amountRows;
A.checkoutQuote=quote;
A.bagCoupon=()=>quote(A.selectedItems(),S.bagCoupon).couponDiscount?S.bagCoupon:null;

A.beginBuyCheckout=(line,{addedToBag=false}={})=>{
 S.checkoutItems=[{...line}];
 S.checkoutSource=addedToBag?'buy-with-bag-line':'buy';
 S.coupon=null;
 A.closeSheet(true);
 A.startDemoAuth('U10');
};

function checkoutItem(item){
 const product=productFor(item);
 const price=item.price??product?.price;
 const original=Number(item.compareAtPrice??product?.compareAtPrice??price);
 const color=item.color??0;
 const specs=[product?.colors?.[color]?.[0],item.size,...Object.values(item.extra||{})].filter(Boolean);
 const image=product?.pdpConfig?.colorImages?.[color]||(product?'assets/'+product.image:'');
 return `<article class="ux-item checkout-item">
  ${image?`<img src="${esc(image)}" alt="${esc(product.cn)}">`:''}
  <div class="ux-item-info">
   <h4 class="checkout-item-name">${esc(item.name||product?.name||'商品')}${product?.cn?`<span>${esc(product.cn)}</span>`:''}</h4>
   ${specs.length?`<p class="checkout-item-spec">${esc(specs.join(' / '))}</p>`:''}
   <div class="checkout-item-price">${A.productPrice(price,original)}<span class="checkout-item-qty">× ${esc(item.qty)}</span></div>
   ${original>price?'<span class="checkout-offer">商品优惠</span>':''}
  </div>
 </article>`;
}

V.U10=()=>{
 if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;
 const selected=address(),items=S.checkoutItems;
 const state=A.q('state');
 const noAddress=!selected||state==='no-address';
 const draft=drafts.get(items);
 const value=draft?.quote||quote(items,S.coupon);
 const quantity=items.reduce((sum,item)=>sum+Number(item.qty),0);
 return `<div class="ux-page checkout-page" data-node-id="2271:34742">
  ${A.heading('确认订单')}
  <section class="ux-section">
   <h3>配送地址</h3>
   <div class="checkout-row-surface checkout-address">
    <button class="ux-listrow checkout-address-main" ${attr('checkout-address-list')}>
     ${noAddress?'<span>添加地址</span>':`<span><strong>${esc(selected.name)}</strong><span class="checkout-address-phone">${esc(selected.phone.replace(/(\d{3})\d{4}/,'$1 **** '))}</span>${selected.default?'<small class="checkout-offer">默认</small>':''}
     <span class="checkout-address-detail">${esc(selected.region+' '+selected.detail)}</span></span>`}${icon('address-next')}
    </button>
    <button class="checkout-address-wechat" ${attr('address-wechat')}>微信授权</button>
   </div>
   ${state==='undeliverable'?A.notice('当前地址暂不支持配送，请更换收货地址。'):''}
  </section>
  <section class="ux-section checkout-products">
   <div class="checkout-products-heading"><h3>订单商品</h3><span>${quantity} 件商品</span></div>
   ${items.length?items.map(checkoutItem).join(''):'<p class="ux-muted">请先选择需要结算的商品。</p>'}
   ${value.orderDiscount?`<span class="checkout-offer">演示满 ${money(rules.orderThreshold)} 减 ${money(rules.orderDiscount)}</span>`:''}
  </section>
  <section class="ux-section checkout-pricing">
   <h3>订单金额</h3>
   <button class="ux-listrow checkout-row-surface checkout-coupon" ${attr('coupons',{select:'1'})}><span>优惠券</span><span>${esc(value.couponDiscount?(draft?.coupon||S.coupon)?.name:'选择优惠券')}${icon('coupon-next')}</span></button>
   ${amountRows(value,true)}
   <p class="ux-note ux-spaced">演示运费为 ${money(rules.shipping)}，用券前满 ${money(rules.freeShippingThreshold)} 免配送费。</p>
  </section>
  <section class="ux-section checkout-payment-method">
   <h3>支付方式</h3>
   ${wechatMethod()}
  </section>
  <div class="ux-bottom checkout-bottom" data-node-id="2271:34868">
   <div class="checkout-consent">
    <input class="ux-check" id="checkout-terms" type="checkbox" aria-labelledby="checkout-terms-copy" ${acceptedTerms.has(items)?'checked':''}>
    <span id="checkout-terms-copy"><label for="checkout-terms">我已仔细阅读并同意VUORI</label><button type="button" ${go('U42',{doc:'purchase'})}>使用条款</button>和<button type="button" ${go('U42',{doc:'returns'})}>退换货政策</button></span>
   </div>
   <div class="checkout-footer-summary" data-node-id="2273:34979"><span>共${quantity}件</span><strong id="checkout-pay-amount">合计 ${money(value.total)}</strong></div>
   <button class="ux-btn" type="button" aria-describedby="checkout-pay-amount" data-node-id="2271:34881" ${attr('submit-order')} ${canSubmit(items)?'':'disabled'}>立即支付</button>
  </div>
 </div>`;
};

document.addEventListener('change',event=>{
 if(event.target.id!=='checkout-terms'||A.route.id!=='U10')return;
 const items=S.checkoutItems;
 if(event.target.checked)acceptedTerms.add(items);
 else acceptedTerms.delete(items);
 event.target.closest('.checkout-bottom').querySelector('[data-ux="submit-order"]').disabled=!canSubmit(items);
});

const demoCode='DEMO100';
const codeCoupon={id:'demo-code',name:'演示券码 DEMO100',amount:100,threshold:800,online:true,status:'可用'};
const couponItems=()=>A.route.id==='U09'?A.selectedItems():S.checkoutItems;
const activeCoupon=()=>A.route.id==='U09'?A.bagCoupon():S.coupon;
function setCoupon(coupon){
 if(A.route.id==='U09'||S.checkoutSource==='bag')S.bagCoupon=coupon;
 if(A.route.id==='U10')S.coupon=coupon;
 A.closeSheet(true);
 A.render(false);
}
H.coupons=()=>{
 if(!['U09','U10'].includes(A.route.id))return;
 const items=couponItems(),selected=activeCoupon();
 const accounts=S.member?D.coupons.map(coupon=>{
  const discount=quote(items,coupon).couponDiscount;
  const hint=discount?`可减 ${money(discount)}`:!coupon.online?'仅限门店使用':coupon.status!=='可用'?'优惠券不可用':'未满足使用门槛';
  return `<button class="ux-listrow" ${attr('pick-coupon',{id:coupon.id})} ${discount?'':'disabled'}><span>${esc(coupon.name)}<br><small class="ux-note">${esc(hint)}</small></span>${selected?.id===coupon.id?A.icon('check'):''}</button>`;
 }).join(''):'<p class="ux-note ux-spaced">登录后可选择账户优惠券。</p>';
 A.openSheet('选择优惠券',`<div class="checkout-sheet-options checkout-row-surface"><button class="ux-listrow" ${attr('pick-coupon',{id:'none'})}><span>不使用优惠券</span>${!selected?A.icon('check'):''}</button>${accounts}</div>
  <form class="ux-form ux-gap" data-form="checkout-coupon-code">
   ${A.field('优惠券码','code',selected?.id===codeCoupon.id?demoCode:'',{placeholder:'输入优惠券码',maxlength:30})}
   <p class="ux-note">演示券码 ${demoCode}，用券前满 ¥800 减 ¥100。</p>
   <p class="ux-error" data-error role="status"></p>
   <button class="ux-btn" type="submit">使用券码</button>
  </form>`);
};
H['pick-coupon']=data=>{
 if(!['U09','U10'].includes(A.route.id))return;
 if(data.id==='none'){setCoupon(null);return;}
 const coupon=S.member?D.coupons.find(item=>item.id===data.id):null;
 if(quote(couponItems(),coupon).couponDiscount)setCoupon(coupon);
};
const handleForm=A.handleForm;
A.handleForm=async form=>{
 if(form.dataset.form!=='checkout-coupon-code')return handleForm(form);
 if(!['U09','U10'].includes(A.route.id))return;
 if(form.elements.code.value.trim().toUpperCase()!==demoCode){
  A.formError(form,'券码无效，请核对后重试。');return;
 }
 if(!quote(couponItems(),codeCoupon).couponDiscount){
  A.formError(form,'当前商品金额未达到用券门槛。');return;
 }
 setCoupon(codeCoupon);
};

function reservationActive(order,now){
 return order.status==='待支付'&&order.reservationUntil>now;
}
function expireReservation(order){
 if(order?.status==='待支付'&&order.reservationUntil&&order.reservationUntil<=Date.now())order.status='已关闭';
}
function enoughStock(items){
 const now=Date.now();
 const occupied=skuQuantities(S.orders.filter(order=>
  reservationActive(order,now)||(order.reservationUntil&&order.paymentResult==='success')).flatMap(order=>order.items));
 const requested=skuQuantities(items);
 return items.every(item=>{
  const product=productFor(item);
  if(!product||item.invalid||product.retired||!Number.isInteger(item.qty)||item.qty<1)return false;
  const sku=A.PDP?.sku(product,{...item,color:Number(item.color??0),extra:item.extra||{}});
  const key=skuKey(item);
  return sku&&requested.get(key)<=(sku.stock-(occupied.get(key)||0))&&requested.get(key)<=(sku.limit??Infinity);
 });
}

H['checkout-price-confirm']=()=>{
 acceptedPriceItems=S.checkoutItems;
 A.closeSheet(true);
 A.toast('已确认演示金额，可继续支付');
};
H['submit-order']=()=>{
 if(A.route.id!=='U10'||!S.member)return;
 const items=S.checkoutItems,selected=address(),state=A.q('state');
 if(!acceptedTerms.has(items)){A.toast('请先阅读并同意使用条款和退换货政策');return;}
 const existing=drafts.get(items);
 if(existing){
  expireReservation(existing);
  A.go(existing.status==='待支付'?paymentRoute:'U15',{id:existing.id},true);
  return;
 }
 if(!selected||state==='no-address'){A.toast('请先选择收货地址');return;}
 if(state==='undeliverable'||!items.length)return;
 if(state==='price-change'&&acceptedPriceItems!==items){
  A.confirm('价格已更新','请核对当前演示金额后继续。','checkout-price-confirm');return;
 }
 if(state==='stock-change'||!enoughStock(items)){
  A.openSheet('库存发生变化',`<p>部分规格无法满足当前数量，请返回购物袋调整。</p>${A.button('返回购物袋','go',{route:'U09'},'ux-gap')}`);return;
 }
 if(state==='submit-error'){A.toast('提交未完成，请重试，商品和地址已保留');return;}

 const value=quote(items,S.coupon);
 if(S.coupon&&!value.couponDiscount){
  S.coupon=null;
  if(S.checkoutSource==='bag')S.bagCoupon=null;
  A.render(false);
  A.toast('优惠券已不可用，请确认更新后的金额');
  return;
 }
 const created=Date.now();
 const order={
  id:'DEMO'+created+'-'+S.orders.length,status:'待支付',
  items:items.map(item=>({...structuredClone(item),name:productFor(item).name})),
  quote:value,total:value.total,coupon:S.coupon?structuredClone(S.coupon):null,
  address:structuredClone(selected),source:S.checkoutSource,
  sourceBagKeys:['bag','buy-with-bag-line'].includes(S.checkoutSource)?[...skuQuantities(items)].map(([key,qty])=>({key,qty})):[],
  created:new Date(created).toISOString(),
  reservationUntil:created+rules.reservationMinutes*60_000
 };
 S.orders.unshift(order);
 drafts.set(items,order);
 A.track('order_created',{id:order.id});
 A.go(paymentRoute,{id:order.id},true);
};

V[paymentRoute]=()=>{
 if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;
 const order=currentOrder();
 expireReservation(order);
 if(!order)return `<div class="ux-page">${A.empty('未找到订单','请返回订单列表查看。','go',{route:'U14'},'查看订单')}</div>`;
 const pending=order.paymentResult==='pending'&&order.status==='待支付';
 const payable=order.status==='待支付'&&!pending;
 const reservedUntil=order.reservationUntil&&new Date(order.reservationUntil).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false});
 return `<div class="ux-page checkout-page">
  ${A.heading('微信支付')}
  <section class="ux-section checkout-payment-amount"><div class="checkout-row-surface"><p>应付金额</p><strong>${money(order.total)}</strong>${A.orderMetadata(order)}</div></section>
  <section class="ux-section"><h3>支付方式</h3>${wechatMethod()}
  <p class="ux-note ux-spaced">${pending?'支付结果确认中，请先查询订单状态。':payable&&reservedUntil?'库存预锁至 '+reservedUntil+'，请在此之前完成支付。':order.status==='已关闭'?'订单已关闭。':'订单状态：'+esc(order.status)}</p>
  <p class="ux-note">本页为支付演示。</p></section>
  <div class="ux-bottom checkout-bottom">${payable?A.button('微信支付','checkout-pay',{id:order.id}):pending?A.button('查询支付结果','query-payment',{id:order.id}):A.button('查看订单','go',{route:'U15',params:JSON.stringify({id:order.id})})}</div>
 </div>`;
};

H['pay-demo']=data=>{
 const order=orderById(data.id);
 if(order&&S.member)A.go(paymentRoute,{id:order.id});
};
H['checkout-pay']=data=>{
 const order=orderById(data.id);
 expireReservation(order);
 if(!S.member||order?.status!=='待支付'||order.paymentResult==='pending'){A.render(false);return;}
 A.openSheet('微信支付演示',`<p>请选择支付结果体验后续流程。</p><div class="ux-stack ux-gap">
  ${[['success','模拟支付成功'],['cancelled','模拟取消支付'],['pending','模拟结果确认中'],['failed','模拟支付失败']].map(([value,label])=>A.button(label,'pay-result',{id:order.id,value},value==='success'?'':'outline')).join('')}
 </div>`);
};

function removePaidItems(order){
 if(!order.sourceBagKeys?.length||order.bagRemoved)return;
 for(const ref of order.sourceBagKeys||[]){
  let remaining=ref.qty;
  for(const item of S.bag){
   if(remaining<=0)break;
   if(skuKey(item)!==ref.key)continue;
   const qty=Math.min(item.qty,remaining);
   item.qty-=qty;
   remaining-=qty;
  }
 }
 S.bag=S.bag.filter(item=>item.qty>0);
 order.bagRemoved=true;
 A.save();
}

H['pay-result']=data=>{
 const order=orderById(data.id);
 expireReservation(order);
 if(!S.member||order?.status!=='待支付'||!['success','cancelled','pending','failed'].includes(data.value))return;
 if(order.paymentResult==='pending'&&data.query!=='1')return;
 order.paymentResult=data.value;
 if(data.value==='success'){
  order.status='待发货';
  removePaidItems(order);
 }
 A.track('payment_result',{id:order.id,result:data.value});
 A.go('U13',{id:order.id},true);
};

H['query-payment']=data=>{
 const order=orderById(data.id);
 expireReservation(order);
 if(!order||!S.member)return;
 const pending=order.status==='待支付'&&order.paymentResult==='pending';
 A.openSheet('查询支付结果',`<p>当前订单：${pending?'支付确认中':esc(order.status)}</p>
  <p class="ux-note ux-spaced">原型不会自动判定到账。</p>
  ${pending?`<div class="ux-stack ux-gap">${A.button('模拟查单已支付','pay-result',{id:order.id,value:'success',query:'1'})}${A.button('模拟查单未支付','pay-result',{id:order.id,value:'failed',query:'1'},'outline')}</div>`:''}
  ${A.button('查看订单','go',{route:'U15',params:JSON.stringify({id:order.id})},'ux-gap outline')}`);
};

V.U13=()=>{
 if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;
 const order=currentOrder();
 expireReservation(order);
 const state=order?.status==='已关闭'?'closed':order?.paymentResult;
 const messages={
  success:['支付成功','订单已进入待发货状态。'],
  pending:['支付结果确认中','请先查询订单状态。'],
  cancelled:['支付已取消','订单已保留，可返回支付。'],
  failed:['支付未完成','你可以返回支付页重试。'],
  closed:['订单已关闭','库存占用已释放。']
 };
 const [title,description]=messages[state]||['暂无支付结果','可到订单列表查看订单状态。'];
 return `<div class="ux-page checkout-page">
 ${A.heading(title)}
 <section class="ux-section"><div class="ux-result checkout-row-surface">
  <div class="ux-result-icon">${A.icon(state==='success'?'check':state==='pending'?'clock':'order')}</div>
  <p class="ux-muted">${description}</p>
  ${order?`<p>${esc(order.id)} · ${money(order.total)}</p>`:''}
  <p class="ux-note">支付结果为本地演示。</p>
 </div></section>
 <div class="ux-section checkout-result-links">
  ${state==='success'?`<button class="checkout-campaign" ${go('U22')}>
   <span class="checkout-campaign-copy"><small>VUORI 社区</small><strong>发现社区活动</strong><span>浏览社区活动 ${A.icon('arrow')}</span></span>
  </button>`:''}
  ${A.link('继续选购','U03')}
 </div>
 <div class="ux-bottom checkout-bottom">
  ${state==='pending'?A.button('查询支付结果','query-payment',{id:order.id}):['cancelled','failed'].includes(state)?A.button('返回微信支付','pay-demo',{id:order.id}):''}
  ${order?A.button('查看订单','go',{route:'U15',params:JSON.stringify({id:order.id})},state==='pending'||['cancelled','failed'].includes(state)?'outline':''):A.button('查看订单列表','go',{route:'U14'})}
 </div></div>`;
};

const render=A.render;
const system=A.$('.system');
const defaultSystem=system.innerHTML;
A.render=function(...args){
 const {id,params}=A.parse();
 const wechatAddress=id==='U11'&&params.wechat==='1';
 const addressPage=['U11','U12'].includes(id)&&!wechatAddress;
 const active=wechatAddress||addressPage||['U10','U13',paymentRoute].includes(id);
 document.body.classList.toggle('checkout-mode',active);
 document.body.classList.toggle('wechat-address-mode',wechatAddress);
 document.body.classList.toggle('address-management-mode',addressPage);
 if(!active&&system.querySelector('.checkout-system-icons'))system.innerHTML=defaultSystem;
 render(...args);
 if(!active)return;
 system.innerHTML=`<span class="time">9:41</span><span class="checkout-system-icons">${icon('signal')}${icon('wifi')}${icon('battery')}</span>`;
 if(wechatAddress){
  A.$('#app-header').innerHTML=`<button type="button" ${attr('back')} aria-label="返回">${icon('back')}</button><strong>我的地址</strong><button type="button" ${attr('address-form')} aria-label="添加新地址"><span class="wechat-address-plus">${A.icon('plus')}</span></button>`;
  return;
 }
 if(addressPage){
  A.$('#app-header').innerHTML=`<button class="address-nav-back" ${attr(id==='U12'?'address-form-back':'back')} aria-label="返回">${icon('back')}</button>
   <img class="address-nav-brand" src="assets/wordmark.png.webp?v=20261029-images-all" alt="Vuori">
   <div class="checkout-nav-menu" aria-label="微信小程序菜单">${icon('menu')}<i aria-hidden="true"></i>${icon('exit')}</div>`;
  const form=A.$('#app-content .address-form');
  if(form)A.syncAddressForm(form);
  return;
 }
 A.$('#app-header').innerHTML=`<div class="checkout-nav-left" role="group" aria-label="页面导航">
  <button ${attr('back')} aria-label="返回">${icon('back')}</button><i aria-hidden="true"></i>
  <button ${attr('root',{route:'U01'})} aria-label="首页"><img src="assets/bag2075/header-home.svg" alt=""></button>
 </div>
 <div class="checkout-nav-menu" aria-label="微信小程序菜单">${icon('menu')}<i aria-hidden="true"></i>${icon('exit')}</div>`;
};

const orderList=V.U14;
V.U14=()=>{
 S.orders.forEach(expireReservation);
 return orderList();
};
const orderDetail=V.U15;
V.U15=()=>{
 const order=currentOrder();
 expireReservation(order);
 return orderDetail();
};
})();
