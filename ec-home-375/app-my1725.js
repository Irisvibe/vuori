/* Member home, Figma 2256:32332. */
(function(){
const A=window.VuoriApp,S=A.state,D=A.D,e=A.esc;
const originalAssets=new Set([
 'imgArrowBack','imgIconFrame','imgIconFrame1','imgIconFrame2','imgIconFrame3','imgIconFrame4',
 'imgVector','imgVector1','imgImageVuori','imgVuoriWordmarkWhite3','imgSvgImgGroup2Svg'
]);
function img(name,alt=''){
 const directory=originalAssets.has(name)?'my1725':'my2178';
 const extension=name==='imgImageVuori'||name==='imgBackground'?'png.webp':'svg';
 return `<img src="assets/${directory}/${name}.${extension}" alt="${alt}">`;
}
const go=(id,auth=true,params={})=>A.attr(auth?'member-go':'go',{route:id,params:JSON.stringify(params)});
const arrow=()=>`<span class="m1725-arrow">${img('imgArrowBack')}</span>`;
const statArrow=()=>`<span class="m1725-stat-arrow">${img('imgVector1170')}</span>`;
const currentAsset=(name)=>`<img src="assets/my2256/${name}.svg" alt="">`;
function row(label,id,auth=true,params={},icon=''){
 const iconMarkup=icon?`<span class="m1725-service-icon">${icon}</span>`:'';
 return `<button class="m1725-row" ${go(id,auth,params)}><span class="m1725-icon-label">${iconMarkup}${label}</span>${arrow()}</button>`;
}
const pages=()=>`<div class="m1725-service-pages">
 <div class="m1725-service-track" id="my2256-services">
  <section class="m1725-card m1725-policies" aria-label="政策" data-node-id="2256:32499">
   ${row('退换货政策','U42',false,{doc:'returns'})}${row('使用条款','U42',false,{doc:'purchase'})}${row('隐私政策','U42',false,{doc:'privacy'})}
  </section>
  <section class="m1725-card m1725-service-links" aria-label="微信服务">
   <button class="m1725-row" ${A.attr('myef-follow')}><span>关注 Vuori 公众号</span>${arrow()}</button>
   <button class="m1725-row" ${A.attr('myef-adviser')}><span>联系门店顾问</span>${arrow()}</button>
  </section>
 </div>
 <div class="m1725-pagination" role="group" aria-label="服务卡片">
  <button type="button" ${A.attr('my2256-service-page',{index:0})} aria-label="政策" aria-controls="my2256-services" aria-pressed="true"></button>
  <button type="button" ${A.attr('my2256-service-page',{index:1})} aria-label="微信服务" aria-controls="my2256-services" aria-pressed="false"></button>
 </div>
</div>`;
A.actions['my2256-service-page']=({index})=>{
 const track=A.$('.m1725-service-track');
 if(track)track.scrollTo({left:Number(index)*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
};
const returnsIcon=()=>`<span class="m1725-return-icon">${img('imgIconFrame3')}<span class="m1725-return-front">${img('imgVector')}</span><span class="m1725-return-redo">${img('imgIconFrame4')}</span><span class="m1725-return-lid">${img('imgVector1')}</span></span>`;
const chrome=()=>`<div class="m1725-chrome">
 <div class="m1725-status"><span>9:41</span><div class="m1725-system-icons">${img('imgCellularConnection')}${img('imgWifi')}<span class="m1725-battery"><i></i>${img('imgCap')}</span></div></div>
 <header class="m1725-header">${img('imgVector2','vuori')}<div class="m1725-capsule" aria-label="微信小程序菜单">${img('imgFill43')}<i></i>${img('imgSvgImgGroup2Svg')}</div></header>
</div>`;
function stats(){
 const favorites=D.products.filter(product=>A.PDP.liked.has(product.id)).length;
 const coupons=D.coupons.filter(coupon=>coupon.status==='可用'||coupon.status==='待使用').length;
 return `<section class="m1725-card m1725-stats" aria-label="我的常用服务" data-node-id="2256:32366">
  ${[['我的收藏','U40',favorites],['我的券包','U35',coupons]].map(([label,route,count])=>
   `<button ${go(route)}><b>${S.member?count:'—'}</b><span>${label}${statArrow()}</span></button>`
  ).join('<i aria-hidden="true"></i>')}
 </section>`;
}
const orderShortcuts=[
 ['待付款','待支付','imgIconFrame'],
 ['待发货','待发货','imgIconFrame1'],
 ['待收货','待收货','imgIconFrame2'],
 ['退货售后','退货 / 售后','returns']
];
const orders=()=>`<section class="m1725-card m1725-orders" data-node-id="2256:32388">
 <div class="m1725-section-head"><h2>我的订单</h2><button ${go('U14')} aria-label="全部订单">${arrow()}</button></div>
 <div class="m1725-order-grid">${orderShortcuts.map(([label,status,icon])=>
  `<button ${go(icon==='returns'?'U17':'U14',true,{status})}><span class="m1725-order-icon">${icon==='returns'?returnsIcon():img(icon)}</span><span>${label}</span></button>`
 ).join('')}</div>
</section>`;
const activityShortcuts=[
 ['未使用','unused',{status:'未使用'}],
 ['候补','waitlist',{type:'候补'}],
 ['已取消','cancelled',{status:'已取消'}],
 ['已核销','redeemed',{status:'已核销'}],
 ['已失效','expired',{status:'已失效'}]
];
const activities=()=>`<section class="m1725-card m1725-activities" data-node-id="2378:15484">
 <div class="m1725-section-head"><h2>我的活动</h2><button ${go('U27')} aria-label="全部活动">${arrow()}</button></div>
 <div class="m1725-order-grid m1725-activity-grid">${activityShortcuts.map(([label,icon,params])=>
  `<button ${go('U27',true,params)}><span class="m1725-order-icon"><img src="assets/my-activities/${icon}.svg?v=2" width="24" height="24" alt=""></span><span>${label}</span></button>`
 ).join('')}</div>
</section>`;
A.views.U30=()=>`<div class="m1725-screen" data-node-id="2256:32332">
 ${chrome()}
 <div class="m1725-identity" data-enter>
  <div class="m1725-profile">
   <span class="m1725-avatar">${S.member&&S.profile.avatar?`<img class="m1725-avatar-photo" src="${e(S.profile.avatar)}" alt="">`:currentAsset('imgLayer1')}</span>
   <div class="m1725-profile-copy"><h1>${S.member?`<span lang="en">Hi, </span>${e(S.profile.nickname)}`:'登录 / 注册'}</h1>${S.member?'':'<p id="m1725-profile-hint">登录注册 可享更多权益</p>'}</div>
   <button class="m1725-profile-action" ${S.member?go('U33'):A.attr('auth-my')} aria-label="${S.member?'编辑个人资料':'登录注册'}" ${S.member?'':'aria-describedby="m1725-profile-hint"'}></button>
  </div>
  ${S.member?`<button class="m1725-code" ${go('U34')} aria-label="会员码">${img('imgQrCode')}</button>`:''}
 </div>
 <div class="m1725-content">
  ${stats()}
  ${orders()}
  ${activities()}
  <section class="m1725-card m1725-services" data-node-id="2256:32459">
   ${row('个人信息','U33',true,{},img('imgGroup1912056197'))}
   ${row('地址管理','U11',true,{},currentAsset('address-management'))}
   ${row('门店列表','U37',false,{},img('imgGroup1912056225'))}
  </section>
  ${pages()}
 </div>
</div>`;
A.myefDecorate=()=>{
 const page=A.$('.page'),active=A.route.id==='U30';
 page.classList.remove('myef','myef-member-page','myef-upgraded');
 page.classList.toggle('my1725',active);
 if(!active)return;
 const nav=A.$('#app-nav'),bagCount=A.validBag().length;
 const items=[
  ['U01','首页',currentAsset('imgImage')],
  ['U02','分类','<img src="assets/home344/344-8667-imgGroup.svg" alt="">'],
  ['U22','活动',`<span class="m1725-community-icon">${currentAsset('imgVuoriCircleV1LogoDark3')}</span>`],
  ['U09','购物袋',currentAsset('imgGroup')],
  ['U30','我的',currentAsset('imgImage2')]
 ];
 nav.innerHTML=items.map(([id,label,icon])=>{
  const selected=id==='U30';
  const count=id==='U09'&&bagCount?`<span class="m1725-bag-count" aria-hidden="true">${bagCount>99?'99+':bagCount}</span>`:'';
  const name=count?`${label}，${bagCount} 项商品`:label;
  return `<button ${A.attr('root',{route:id})} aria-label="${name}" aria-current="${selected?'page':'false'}" class="${selected?'active':''}">
   <span class="m1725-nav-icon">${icon}${count}</span><span>${label}</span>
  </button>`;
 }).join('');
 const track=A.$('.m1725-service-track');
 if(track){
  track.addEventListener('scroll',()=>{
   const selected=Math.round(track.scrollLeft/track.clientWidth);
   track.closest('.m1725-service-pages').querySelectorAll('.m1725-pagination button').forEach((button,index)=>{
    button.setAttribute('aria-pressed',String(index===selected));
   });
  },{passive:true});
 }
 nav.classList.remove('over-kv');
};
// Address management remains accessible from personal information.
const profile=A.views.U33;
A.views.U33=()=>{
 const html=profile();
 if(!S.member)return html;
 const addressLabel=`<span class="m1725-icon-label"><span class="m1725-service-icon">${currentAsset('address-management')}</span>地址管理</span>`;
 return html.replace(/<\/div>$/,`<section class="ux-section m1725-account-links">${A.row(addressLabel,'member-go',{route:'U11'})}</section></div>`);
};
})();
