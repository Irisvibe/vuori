/* Local checkout prototype. Production pricing, reservations and payment belong to the transaction service. */
(function(){
const A=window.VuoriApp,{D,state:S,views:V,actions:H,attr,esc,money}=A;
const paymentRoute='U45';
D.pages.push([paymentRoute,'微信支付','购物袋与结算']);

const rules={orderThreshold:2000,orderDiscount:100,freeShippingThreshold:500,shipping:15,reservationMinutes:15};
const drafts=new WeakMap();
let acceptedPriceItems;
const orderById=id=>S.orders.find(order=>order.id===id);
const currentOrder=()=>orderById(A.q('id'));
const address=A.checkoutAddress=()=>S.addresses.find(item=>item.id===S.selectedAddress)||S.addresses.find(item=>item.default)||S.addresses[0];
const go=(route,params={})=>attr('go',{route,params:JSON.stringify(params)});
const skuKey=item=>JSON.stringify([item.pid,Number(item.color??0),item.size,Object.entries(item.extra||{}).sort()]);
const skuQuantities=items=>{
 const quantities=new Map();
 for(const item of items)quantities.set(skuKey(item),(quantities.get(skuKey(item))||0)+Number(item.qty));
 return quantities;
};
const productFor=item=>D.products.find(product=>product.id===item.pid);
const round=value=>Math.round(value*100)/100;

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

function amountRows(value){
 const discount=amount=>amount?'- '+money(amount):money(0);
 return [
  ['商品金额',money(value.subtotal)],
  ['商品优惠',discount(value.itemDiscount)],
  ['订单优惠',discount(value.orderDiscount)],
  ['优惠券优惠',discount(value.couponDiscount)],
  ['配送费',money(value.shipping)]
 ].map(([label,amount])=>`<div class="ux-money-row"><span>${label}</span><span>${amount}</span></div>`).join('')
  +`<div class="ux-money-row total"><span>应付金额</span><strong>${money(value.total)}</strong></div>`;
}
A.checkoutSummary=amountRows;

function checkoutItem(item){
 const product=productFor(item);
 const price=item.price??product?.price;
 const original=Number(item.compareAtPrice??product?.compareAtPrice??price);
 const specs=[product?.colors?.[item.color??0]?.[0],item.size,...Object.values(item.extra||{})].filter(Boolean);
 return `<article class="ux-item checkout-item">
  ${product?`<img src="assets/${esc(product.image)}" alt="${esc(product.cn)}">`:''}
  <div class="ux-item-info">
   <h4>${esc(item.name||product?.name||'商品')}</h4>
   <p>${esc([product?.cn,...specs].filter(Boolean).join(' · '))}</p>
   <div class="checkout-item-price"><strong>${money(price)}</strong>${original>price?`<s>${money(original)}</s>`:''}<span>× ${esc(item.qty)}</span></div>
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
 return `<div class="ux-page checkout-page">
  ${A.heading('确认订单')}
  <section class="ux-section">
   <h3>收货地址</h3>
   ${noAddress?A.row('添加收货地址','go',{route:'U11',params:'{"choose":"1"}'}):`<button class="ux-listrow checkout-address" ${go('U11',{choose:'1'})}>
    <span><strong>${esc(selected.name)}</strong>　${esc(selected.phone.replace(/(\d{3})\d{4}/,'$1 **** '))}${selected.default?'<small class="checkout-offer">默认</small>':''}
    <span class="checkout-address-detail">${esc(selected.region+' '+selected.detail)}</span></span>${A.icon('chevron')}
   </button>`}
   ${state==='undeliverable'?A.notice('当前地址暂不支持配送，请更换收货地址。'):''}
  </section>
  <section class="ux-section checkout-products">
   <h3>订单商品</h3>
   ${items.length?items.map(checkoutItem).join(''):'<p class="ux-muted">请先选择需要结算的商品。</p>'}
   ${value.orderDiscount?`<span class="checkout-offer">演示满 ${money(rules.orderThreshold)} 减 ${money(rules.orderDiscount)}</span>`:''}
  </section>
  <section class="ux-section checkout-pricing">
   <h3>订单金额</h3>
   ${A.row('优惠券','coupons',{select:'1'},value.couponDiscount?(draft?.coupon||S.coupon)?.name:'选择优惠券')}
   ${amountRows(value)}
   <p class="ux-note ux-spaced">演示运费为 ${money(rules.shipping)}，用券前满 ${money(rules.freeShippingThreshold)} 免配送费。</p>
  </section>
  <div class="ux-bottom"><div><span class="ux-note">应付金额</span><div class="ux-total">${money(value.total)}</div></div>
   <button class="ux-btn" ${attr('submit-order')} ${noAddress||!items.length||state==='undeliverable'?'disabled':''}>去支付</button>
  </div>
 </div>`;
};

H.coupons=()=>{
 const eligible=quote(S.checkoutItems).eligibleAmount;
 A.openSheet('选择优惠券',`<button class="ux-listrow" ${attr('pick-coupon',{id:'none'})}><span>不使用优惠券</span>${!S.coupon?A.icon('check'):''}</button>
  ${D.coupons.map(coupon=>{
   const usable=quote(S.checkoutItems,coupon).couponDiscount>0;
   const hint=usable?`可减 ${money(Math.min(coupon.amount,eligible))}`:!coupon.online?'仅限门店使用':coupon.status!=='可用'?'优惠券不可用':'未满足使用门槛';
   return `<button class="ux-listrow" ${attr('pick-coupon',{id:coupon.id})} ${usable?'':'disabled'}><span>${esc(coupon.name)}<br><small class="ux-note">${esc(hint)}</small></span>${S.coupon?.id===coupon.id?A.icon('check'):''}</button>`;
  }).join('')}`);
};
H['pick-coupon']=data=>{
 const coupon=D.coupons.find(item=>item.id===data.id);
 if(data.id!=='none'&&!quote(S.checkoutItems,coupon).couponDiscount)return;
 S.coupon=coupon||null;
 A.closeSheet(true);
 A.render(false);
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
  sourceBagKeys:S.checkoutSource==='bag'?[...skuQuantities(items)].map(([key,qty])=>({key,qty})):[],
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
  <section class="ux-section checkout-payment-amount"><p>应付金额</p><strong>${money(order.total)}</strong><p class="ux-note">订单号 ${esc(order.id)}</p></section>
  <section class="ux-section"><h3>支付方式</h3><div class="checkout-method"><span>微信支付</span>${A.icon('check')}</div>
  <p class="ux-note ux-spaced">${pending?'支付结果确认中，请先查询订单状态。':payable&&reservedUntil?'库存预锁至 '+reservedUntil+'，请在此之前完成支付。':order.status==='已关闭'?'订单已关闭。':'订单状态：'+esc(order.status)}</p>
  <p class="ux-note">本页为支付演示。</p></section>
  <div class="ux-bottom">${payable?A.button('微信支付','checkout-pay',{id:order.id}):pending?A.button('查询支付结果','query-payment',{id:order.id}):A.button('查看订单','go',{route:'U15',params:JSON.stringify({id:order.id})})}</div>
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
 if(order.source!=='bag'||order.bagRemoved)return;
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
 return `<div class="ux-page checkout-page"><div class="ux-result">
  <div class="ux-result-icon">${A.icon(state==='success'?'check':state==='pending'?'clock':'order')}</div>
  <h2>${title}</h2><p class="ux-muted">${description}</p>
  ${order?`<p>${esc(order.id)} · ${money(order.total)}</p>`:''}
  <p class="ux-note">支付结果为本地演示。</p>
  ${state==='pending'?A.button('查询支付结果','query-payment',{id:order.id}):['cancelled','failed'].includes(state)?A.button('返回微信支付','pay-demo',{id:order.id}):''}
  ${order?A.button('查看订单','go',{route:'U15',params:JSON.stringify({id:order.id})},'outline'):A.button('查看订单列表','go',{route:'U14'},'outline')}
  ${state==='success'?`<button class="checkout-campaign" ${go('U22')}>
   <span class="checkout-campaign-copy"><small>VUORI 社区</small><strong>发现社区活动</strong><span>浏览社区活动 ${A.icon('arrow')}</span></span>
  </button>`:''}
  ${A.link('继续选购','U03')}
 </div></div>`;
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
