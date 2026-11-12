/* Member center from the user's feature table. All unconnected transactions are explicit demos. */
(function(){
const A=window.VuoriApp,S=A.state,D=A.D,H=A.actions,e=A.esc;
const M=A.MemberCenter={host:window.VuoriMemberHost||null,invoices:{},pendingAvatar:null,invoicePending:new Set()};
const go=(route,params={})=>A.attr('go',{route,params:JSON.stringify(params)}),member=(route,params={})=>A.attr('member-go',{route,params:JSON.stringify(params)});
const arrow=()=>`<span class="member-arrow">${A.icon('chevron')}</span>`;
const row=(label,route,auth=true,params={})=>`<button class="myef-row" ${auth?member(route,params):go(route,params)}><span>${label}</span>${arrow()}</button>`;
const liked=()=>D.products.filter(p=>A.PDP.liked.has(p.id));
for(const page of [['U40','我的收藏','会员中心'],['U41','帮助中心','会员中心'],['U42','法律条款','会员中心'],['U43','电子发票','会员中心']])if(!D.pages.some(x=>x[0]===page[0]))D.pages.push(page);
D.pages.find(p=>p[0]==='U31')[1]='登录 / 注册';
M.orderStatuses=['全部','待支付','待发货','待收货','待评价','已完成','退货 / 售后','已关闭'];
const hasRefund=o=>S.refunds.some(r=>r.order===o.id)||['售后处理中','退款处理中','已退款','已退货'].includes(o.status);
const orderCount=status=>status==='退货 / 售后'?S.refunds.length:S.orders.filter(o=>o.status===status).length;
A.memberHomeServices=()=>`<section class="myef-glass myef-account"><div class="myef-account-heading"><h2>我的订单</h2><button ${member('U14')}>全部订单 ${arrow()}</button></div><div class="member-order-shortcuts">${[['bag','待付款','待支付'],['order','待发货','待发货'],['truck','待收货','待收货'],['heart','待评价','待评价'],['support','退货售后','退货 / 售后']].map(([icon,label,status])=>`<button ${member(status==='退货 / 售后'?'U17':'U14',{status})}><span class="member-order-icon">${A.icon(icon)}${S.member&&orderCount(status)?`<i>${orderCount(status)}</i>`:''}</span><span>${label}</span></button>`).join('')}</div></section><section class="myef-glass member-shortcuts" aria-label="我的常用服务">${[['heart','我的收藏','U40',liked().length+'件收藏'],['coupon','优惠券','U35',D.coupons.filter(c=>c.status==='可用').length+'张待使用'],['pin','收货地址','U11',S.addresses.length+'个地址']].map(([icon,label,route,count])=>`<button ${member(route)}>${A.icon(icon)}<span>${label}</span><small>${S.member?count:'登录查看'}</small></button>`).join('')}</section><section class="myef-glass myef-member-services">${row('账户信息管理','U33')}${row('我的活动','U27')}${row('会员码','U34')}${row('电子发票','U43')}${row('帮助中心','U41',false)}${row('法律条款','U42',false)}</section>`;
const eligible=o=>['待发货','待收货','待评价','已完成'].includes(o.status);
const invoiceLabel=order=>M.invoices[order.id]?'查看发票申请':'申请发票';
const invoiceData=order=>({route:'U43',params:JSON.stringify({id:order.id})});
function orderCard(order) {
 const status = order.status === '待支付' ? '待付款' : order.status;
 const quantity = order.items.reduce((sum,item)=>sum+item.qty,0);
 const route = id => ({route:id,params:JSON.stringify({id:order.id})});
 const actions = [A.button('查看订单','go',route('U15'),'outline inline')];
 if (['待支付','待发货'].includes(order.status)) {
  actions.push(A.button('取消订单','cancel-order',{id:order.id},'outline inline'));
 }
 actions.push(A.orderReturnActions(order));
 if (eligible(order)) actions.push(A.button(invoiceLabel(order),'go',invoiceData(order),'outline inline'));
 if (order.status === '待支付') actions.push(A.button('继续支付','pay-demo',{id:order.id},'inline'));
 if (order.status === '待收货') actions.push(A.button('查看物流','go',route('U16'),'inline'));
 if (order.status === '待评价') actions.push(A.button('评价说明','member-review-info',{},'outline inline'));

 return `<article class="ux-ordercard vui-order-card">
  <div class="vui-order-panel">
   <div class="vui-order-card-heading">${A.orderMetadata(order,true)}<span class="vui-order-status${status==='待收货'?' is-receiving':''}">${e(status)}</span></div>
   ${order.items.map(item=>A.item(item)).join('')}
   <div class="vui-order-summary">${A.orderPlacedAt(order,true)}<div class="vui-order-totals"><span>共${quantity}件</span><strong>实付 ${A.money(order.total)}</strong></div></div>
  </div>
  <div class="ux-order-actions vui-order-panel">${actions.join('')}</div>
 </article>`;
}
A.views.U14=()=>{
 if (!S.member) return `<div class="ux-page">${A.gate()}</div>`;
 const status = A.q('status','全部');
 const orders = A.q('state') === 'empty' ? [] : S.orders.filter(order =>
  status === '全部' || (status === '退货 / 售后' && hasRefund(order)) || order.status === status);
 return `<div class="ux-page member-page vui-order-page vui-order-list-page">
  ${A.tabs(M.orderStatuses,status,'order-filter').replace('>待支付</button>','>待付款</button>')}
  ${orders.length?`<div class="vui-order-list">${orders.map(orderCard).join('')}</div>
   <div class="vui-order-end"><img src="../ui-library/assets/order-2324/end-rule.svg" alt=""><span>暂无更多订单</span></div>`:
   A.empty('暂无相关订单','换个状态查看，或继续发现喜欢的单品。','go',{route:'U03'},'继续选购','order')}
  <p class="member-local-note">本地演示订单，不产生真实支付、退款或物流请求。</p>
 </div>`;
};
const orderRoutes = new Set(['U14','U15','U16','U17','U18','U19','U20','U21','U43']);
const orderIcon = name => `<img src="../ui-library/assets/order-2324/${name}.svg" alt="">`;
const baseRender = A.render;
const orderSystem = A.$('.system');
const originalOrderSystem = orderSystem.innerHTML;
A.render = function(...args) {
 const {id} = A.parse();
 const isOrder = orderRoutes.has(id);
 document.body.classList.toggle('vui-order-mode',isOrder);
 if (!isOrder && orderSystem.querySelector('.vui-order-system')) orderSystem.innerHTML = originalOrderSystem;
 baseRender.apply(this,args);
 if (!isOrder) return;
 const title = D.pages.find(page=>page[0]===id)?.[1] || '订单';
 orderSystem.innerHTML = `<span class="time">9:41</span><div class="system-icons vui-order-system">${orderIcon('signal')}${orderIcon('wifi')}${orderIcon('battery')}</div>`;
 A.$('#app-header').innerHTML = `<div class="vui-order-nav" role="group" aria-label="页面导航">
  <button type="button" ${A.attr('back')} aria-label="返回">${orderIcon('back')}</button><i aria-hidden="true"></i>
  <button type="button" ${A.attr('root',{route:'U01'})} aria-label="首页">${orderIcon('home')}</button>
 </div><h1 class="vui-order-header-title">${e(title)}</h1>
 <div class="vui-order-menu" aria-label="微信小程序菜单">${orderIcon('menu')}<i aria-hidden="true"></i>${orderIcon('close')}</div>`;
 const tabs = A.$('.vui-order-list-page > .ux-tabs');
 if (tabs) {
  for (const button of tabs.children) button.setAttribute('aria-pressed', String(button.classList.contains('selected')));
  const selected = tabs.querySelector('.selected');
  if (selected && selected.getBoundingClientRect().right > tabs.getBoundingClientRect().right) {
   tabs.scrollLeft = selected.getBoundingClientRect().right - tabs.getBoundingClientRect().right + 16;
  }
 }
};
H['member-review-info']=()=>A.openSheet('待评价订单',`<p>这里保留待评价订单的查看入口，当前未接入评价提交服务。</p>${A.button('知道了','close-sheet',{},'ux-gap')}`);
const orderDetail=A.views.U15;A.views.U15=()=>{let html=orderDetail();if(!S.member)return html;const o=A.currentOrder(),index=html.lastIndexOf('<div class="ux-bottom">');if(index<0)return html;const extra=`<section class="ux-pad member-order-tools vui-order-panel vui-order-section">${eligible(o)?A.row(invoiceLabel(o),'go',invoiceData(o)):''}${o.status==='待发货'?A.row('取消未发货订单','cancel-order',{id:o.id}):''}${hasRefund(o)?A.row('退货 / 退款记录','go',{route:'U17',params:JSON.stringify({order:o.id})}):''}</section>`;return html.slice(0,index)+extra+html.slice(index)};
H['cancel-order']=d=>{const o=S.orders.find(x=>x.id===d.id);if(!o||!['待支付','待发货'].includes(o.status)||o.status==='待支付'&&o.paymentResult==='pending'){A.toast('当前订单状态不可取消');return}A.confirm('取消订单',o.status==='待支付'?'确认关闭这笔待付款演示订单？':'当前为已付款、未发货的演示订单。取消后仅展示售后处理中，不会发起真实退款。','cancel-order-confirm',{id:o.id,expected:o.status})};
H['cancel-order-confirm']=d=>{const o=S.orders.find(x=>x.id===d.id);if(!o||!['待支付','待发货'].includes(o.status)||o.status==='待支付'&&o.paymentResult==='pending'||d.expected&&d.expected!==o.status){A.toast('订单状态已变化，请重新查看');return}if(o.status==='待支付')o.status='已关闭';else{o.status='售后处理中';if(!S.refunds.some(r=>r.order===o.id&&r.source==='cancel')){const i=o.items[0];S.refunds.unshift({id:'CANCEL-DEMO-'+o.id,order:o.id,pid:i.pid,qty:i.qty,amount:o.total,type:'取消未发货订单',reason:'用户取消',stage:'退款处理中',source:'cancel'})}}A.closeSheet(true);A.render(false);A.toast('订单状态已更新 · 本地演示')};
// Avatar remains in memory; actual identity/phone verification belongs to the host.
A.views.U33=()=>{if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;const p=S.profile;return `<div class="ux-page member-page">${A.heading('账户信息管理')}<form class="ux-form ux-pad" data-form="profile" style="padding-top:0"><label class="member-avatar-field"><span>头像</span><span class="member-avatar-preview">${M.pendingAvatar||p.avatar?`<img src="${e(M.pendingAvatar||p.avatar)}" alt="本地头像预览">`:A.icon('user')}</span><span class="ux-note">选择图片<input type="file" accept="image/png,image/jpeg,image/webp" data-member-avatar aria-label="选择头像图片"></span></label>${A.field('昵称','nickname',p.nickname,{maxlength:20})}<label class="ux-field"><span>手机号码</span><input name="phone" value="${e(p.phone)}" readonly inputmode="tel"></label>${A.field('性别','gender',p.gender,{options:['未设置','女士','男士','不愿透露']})}${A.field('生日（选填）','birthday',p.birthday,{type:'date'})}${A.field('常驻城市','city',p.city,{options:['深圳','上海','北京','其他']})}${A.field('运动偏好','sport',p.sport,{options:['徒步','跑步','冲浪','训练','舒展']})}${A.field('常用尺码','size',p.size,{options:['XS','S','M','L','XL']})}<p class="ux-note">资料与头像仅保存在当前体验中。真实头像、昵称与手机号由用户授权及会员服务提供。</p><p class="ux-error" data-error></p><button class="ux-btn" type="submit">保存资料</button></form></div>`};
document.addEventListener('change',async event=>{const input=event.target;if(!input.matches('[data-member-avatar]'))return;const file=input.files?.[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){input.value='';A.formError(input.form,'请选择5MB以内的PNG、JPG或WebP图片');return}const reader=new FileReader();reader.onload=()=>{if(!input.isConnected||A.route.id!=='U33')return;M.pendingAvatar=String(reader.result);input.closest('form').querySelector('.member-avatar-preview').innerHTML=`<img src="${e(M.pendingAvatar)}" alt="本地头像预览">`};reader.readAsDataURL(file)});
// Coupon statuses are coupon semantics; no new activity badge tiers are introduced.
A.views.U35=()=>{if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;let status=A.q('status',A.q('state')==='expired'?'已过期':A.q('state')==='used'?'已使用':'待使用');if(status==='可用')status='待使用';const coupons=A.q('state')==='empty'?[]:D.coupons.filter(c=>status==='待使用'?c.status==='可用':status==='已使用'?['已使用','已核销'].includes(c.status):c.status==='已过期');return `<div class="ux-page member-page">${A.heading('我的优惠券')}${A.tabs(['待使用','已使用','已过期'],status,'coupon-filter')}<div class="ux-pad">${coupons.length?coupons.map(c=>`<button class="ux-coupon" ${go('U36',{id:c.id,...(status==='已使用'?{state:'used'}:status==='已过期'?{state:'expired'}:{})})}><div class="ux-coupon-value"><small>¥ </small>${c.amount}</div><div><h3>${e(c.name)}</h3><p>${c.threshold?'满'+c.threshold+'元可用':'以券规则为准'}</p><p>${e(c.expires)} 到期</p><p>${c.online?'线上商城演示适用':'仅门店适用'}</p></div></button>`).join(''):A.empty('暂无相关优惠券','新的会员礼遇会显示在这里。','go',{route:'U03'},'继续发现','coupon')}<p class="ux-note">示例优惠券，不代表正式权益；实际状态与规则待券系统接入。</p></div></div>`};
const faq=[['体验账号','本地原型使用演示账号，打开后可直接体验订单、地址和预约流程。'],['管理个人资料','在账户信息管理中修改头像、昵称、性别和生日，点击保存生效。当前资料仅保存在本地体验会话。'],['管理收货地址','在收货地址中新增或编辑地址，可设置默认地址；默认地址会用于后续结算选择。'],['查看订单与物流','按状态查看订单，进入订单详情核对商品与金额；有物流信息时可查看包裹轨迹。当前轨迹为演示。'],['取消订单与退换货','待付款或未发货订单可申请取消；其他可售后订单可在详情发起申请。具体可取消范围与退款结果以正式订单服务为准。'],['收藏与优惠券','商品详情中的收藏会同步到我的收藏。优惠券可按待使用、已使用、已过期查看，以单券规则为准。'],['申请电子发票','从已付款订单进入电子发票，填写抬头和接收邮箱。当前仅保存演示申请资料，不生成有效发票。'],['查询门店','通过查找门店按城市筛选，查看位置、营业信息及门店服务入口，正式资料与原生地图能力待接入。']];
A.views.U41=()=>`<div class="ux-page member-page">${A.heading('帮助中心')}<div class="ux-pad" style="padding-top:0">${faq.map(([title,body],i)=>`<details class="member-faq" ${i===0?'open':''}><summary>${title}<i></i></summary><p>${body}</p></details>`).join('')}${A.button('联系客服','support',{},'outline ux-gap')}</div></div>`;
const legal=[['purchase','购物条款与条件'],['privacy','个人信息保护政策'],['membership','会员章程'],['returns','退换货政策']];
A.views.U42=()=>{const id=A.q('doc'),meta=legal.find(([key])=>key===id);if(!meta)return `<div class="ux-page member-page">${A.heading('法律条款')}<div class="ux-pad" style="padding-top:0">${legal.map(([key,title])=>A.row(title,'go',{route:'U42',params:JSON.stringify({doc:key})})).join('')}<p class="ux-note ux-gap">正式法律文本待品牌审核后接入。本地原型不作为已发布条款。</p></div></div>`;const doc=(window.VuoriLegalDocs||[]).find(d=>d.id===id&&typeof d.bodyText==='string');return `<div class="ux-page member-page">${A.heading(meta[1])}<article class="ux-pad member-legal" style="padding-top:0">${doc?`${doc.version?`<p class="ux-note">版本 ${e(doc.version)}</p>`:''}${doc.bodyText.split(/\n\s*\n/).map(p=>`<p>${e(p)}</p>`).join('')}`:'<h3>正式文本待接入</h3><p>该入口已预留，正式内容将在品牌审核确认后提供。</p><p class="ux-note">当前未生成或发布购物条款、隐私政策或会员章程。</p>'}</article></div>`};
A.views.U43=()=>{if(!S.member)return `<div class="ux-page">${A.gate()}</div>`;const o=S.orders.find(o=>o.id===A.q('id'));if(!o)return `<div class="ux-page member-page">${A.heading('电子发票')}<div class="ux-pad" style="padding-top:0"><p class="ux-note">选择已付款的演示订单，填写开票资料。</p>${S.orders.filter(eligible).map(o=>A.row(o.id,'go',{route:'U43',params:JSON.stringify({id:o.id})},A.money(o.total))).join('')}${!S.orders.some(eligible)?'<p class="ux-spaced">暂无可展示的订单</p>':''}</div></div>`;if(!eligible(o))return `<div class="ux-page">${A.empty('当前订单不可申请开票','请返回订单查看最新状态。','go',{route:'U15',params:JSON.stringify({id:o.id})},'查看订单','order')}</div>`;const d=M.invoices[o.id]||{};return `<div class="ux-page member-page vui-order-page">${A.heading(d.requestId||d.saved?'发票申请详情':'申请电子发票')}<div class="ux-pad" style="padding-top:0"><div class="member-invoice-order vui-order-panel">${A.orderMetadata(o)}<span>订单实付 ${A.money(o.total)}</span></div><form class="ux-form" data-form="member-invoice" novalidate data-order="${e(o.id)}">${A.field('抬头类型','titleType',d.titleType||'个人',{options:['个人','单位']})}${A.field('发票抬头','title',d.title||'',{placeholder:'个人姓名或单位名称',maxlength:100})}<div data-tax-field ${d.titleType==='单位'?'':'hidden'}>${A.field('单位税号','taxNo',d.taxNo||'',{placeholder:'填写单位纳税人识别号',maxlength:30})}</div>${A.field('接收邮箱','email',d.email||'',{type:'email',placeholder:'用于接收电子发票',maxlength:100})}<p class="ux-note">正式可开票范围、金额及结果由订单与发票服务核验。${M.host?.requestInvoice?'提交后以服务端受理状态为准。':'当前只保存本地演示资料，不提交开票、不生成有效票据。'}</p>${d.requestId?`<p class="ux-note">申请编号：${e(d.requestId)}</p>`:d.saved?'<p class="ux-note">已保存本次演示资料，尚未提交。</p>':''}<p class="ux-error" data-error></p><button class="ux-btn" type="submit">${M.host?.requestInvoice?'提交开票申请':'保存申请资料（演示）'}</button></form></div></div>`};
document.addEventListener('change',event=>{if(event.target.name==='titleType'&&event.target.closest('[data-form="member-invoice"]'))event.target.form.querySelector('[data-tax-field]').hidden=event.target.value!=='单位'});
const handle=A.handleForm;
A.handleForm=async form=>{
 const type=form.dataset.form,values=Object.fromEntries(new FormData(form));
 if(type==='profile'){
  A.formError(form,'');if(!String(values.nickname||'').trim())return A.formError(form,'请填写昵称');
  if(values.birthday&&values.birthday>new Date().toLocaleDateString('en-CA'))return A.formError(form,'生日不能晚于今天');
  return A.busy(form,()=>{if(!form.isConnected)return;for(const k of ['nickname','gender','birthday','city','sport','size'])S.profile[k]=String(values[k]||'').trim();if(M.pendingAvatar){S.profile.avatar=M.pendingAvatar;M.pendingAvatar=null}A.clearFormDraft();A.toast('资料已保存 · 本地演示');A.go('U30',{},true)})
 }
 if(type==='phone-login'&&values.phone!==S.memberCodePhone)return A.formError(form,'请为当前手机号重新获取演示验证码');
 if(type!=='member-invoice')return handle(form);
 A.formError(form,'');const o=S.orders.find(o=>o.id===form.dataset.order);
 if(!o||!eligible(o))return A.formError(form,'订单状态已变化，请返回查看');
 if(M.invoicePending.has(o.id))return A.formError(form,'该订单资料正在处理，请勿重复提交');
 if(!String(values.title||'').trim())return A.formError(form,'请填写发票抬头');
 if(values.titleType==='单位'&&!String(values.taxNo||'').trim())return A.formError(form,'请填写单位税号');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email||'')))return A.formError(form,'请填写正确的接收邮箱');
 const routeKey=A.lastURL;M.invoicePending.add(o.id);
 try{await A.busy(form,async()=>{
  if(!form.isConnected)return;
  if(!eligible(o)){A.formError(form,'订单状态已变化，请返回查看');return}
  try{
   const data={titleType:values.titleType,title:String(values.title).trim(),taxNo:values.titleType==='单位'?String(values.taxNo).trim():'',email:String(values.email).trim()};
   if(M.host?.requestInvoice){
    if(M.invoices[o.id]?.requestId){A.formError(form,'此订单已有申请记录，请等待服务端处理');return}
    const result=await M.host.requestInvoice({orderId:o.id,...data});
    if(result?.status!=='accepted'||!result.requestId)throw Error('开票申请未受理，请重试');
    M.invoices[o.id]={...data,requestId:result.requestId};A.toast('开票申请已受理')
   }else{M.invoices[o.id]={...data,saved:true};A.toast('已保存演示资料，尚未提交开票')}
   if(form.isConnected&&A.lastURL===routeKey){A.clearFormDraft();A.render(false);A.skipCaptureOnce=false}
  }catch(err){if(form.isConnected)A.formError(form,err.message||'暂未保存，请重试')}
 })}finally{M.invoicePending.delete(o.id)}
};
const sendCode=H['send-code'];H['send-code']=(d,el)=>{sendCode(d,el);const phone=el.closest('form').elements.phone.value.trim();if(/^1\d{10}$/.test(phone)&&S.codeSent)S.memberCodePhone=phone};
for(const id of ['U31','U32']){const view=A.views[id];A.views[id]=()=>{let html=view().replace('欢迎来到 Vuori','登录 / 注册').replace('连接运动、日常与同频的伙伴。','微信授权或手机验证码，选择适合你的方式。').replace('data-route="U07"','data-route="U42"');if(id==='U32')html=html.replace('<span>同意使用条款与隐私政策</span>',`<span>同意<button type="button" class="ux-link" ${go('U42')}>使用条款与隐私政策</button></span>`);return html}};
A.errorVariants.U40=['empty'];
const decorate=A.myefDecorate;A.myefDecorate=()=>{decorate();const page=A.$('.page'),active=A.route.id==='U30';page.classList.toggle('myef-upgraded',active);};
})();
