/* Local sign-in, phone authorization and member profile. */
(function(){
 const A=window.VuoriApp,{D,state:S,views:V,actions:H,attr,esc}=A;
 const profileRoute=A.demoAuthProfileRoute='U46';
 const loginRoute='U47';
 const demoPhone='00000000101';
 let flow;
 D.pages.push([profileRoute,'加入会员','我的与会员'],[loginRoute,'注册 / 登录','我的与会员']);
 const consentKey='vuori-demo-auth-consent-v1';
 const membersKey='vuori-demo-auth-registered-v1';
 let hasConsent=false;
 let registeredPhones=new Set();
 try{
  hasConsent=sessionStorage.getItem(consentKey)==='yes';
  registeredPhones=new Set(JSON.parse(sessionStorage.getItem(membersKey)||'[]'));
 }catch{}
 const remember=(key,value)=>{try{sessionStorage.setItem(key,value)}catch{}};
 const canAuthorize=()=>flow&&[loginRoute,profileRoute].includes(A.route.id);

 const asset=name=>`<img src="assets/login2392/${name}" alt="">`;
 const button=(label,action,options='')=>`<button type="button" ${attr(action)} ${options}>${label}</button>`;
 const policy=(text,doc)=>`<a href="${A.routeURL('U42',doc==='privacy'?{doc}:{})}" class="demo-auth-policy" ${attr('auth-policy',{doc})}>《${text}》</a>`;
 const privacy=()=>policy('飞奥力（上海）商贸有限公司隐私政策','privacy');
 const terms=()=>policy('用户服务协议','service');
 const agreement=(id,text,checked=false)=>`<div class="demo-auth-agreement"><input type="checkbox" id="${id}" name="${id}" aria-labelledby="${id}-text" ${checked?'checked':''}><span id="${id}-text">${text}</span></div>`;
 const standardAgreement=checked=>agreement('auth-consent','我已阅读、理解并同意'+privacy()+'和'+terms()+'。',checked);
 const transferAgreement=checked=>agreement('auth-transfer','我理解并同意 Vuori 将根据 '+privacy()+' 将我的个人信息传输至境外。',checked);

 A.startDemoAuth=target=>{
  if(S.member){A.go(target);return;}
  flow={target,phone:'',codeIssued:false};
  A.go(loginRoute);
 };
 V[loginRoute]=()=>`<section class="demo-auth-login" data-node-id="2392:17120" aria-labelledby="demo-auth-login-heading">
   <div class="demo-auth-login-brand">${asset('17120-imgVuoriWordmarkWhite2.svg')}</div>
   <div class="demo-auth-profile-card demo-auth-login-card">
    <h1 id="demo-auth-login-heading">注册 / 登录</h1>
    ${S.member
     ?button('返回我的','auth-my-return','class="ux-btn"')
     :`${flow?.target==='U10'?'<p class="demo-auth-login-hint">登录后继续结算</p>':''}
       <div class="demo-auth-agreements">${standardAgreement(hasConsent)}${transferAgreement(hasConsent)}</div>
       <p class="ux-error" data-auth-error role="status"></p>
       ${button('一键授权手机号','auth-request-phone','class="ux-btn"')}`}
   </div>
  </section>`;
 H['auth-my-return']=()=>A.go('U30',{},true);
 H['auth-home']=()=>A.go('U01',{},true);

 H['auth-policy']=({doc})=>{
  const title=doc==='privacy'?'隐私政策':'用户服务协议';
  const record=(window.VuoriLegalDocs||[]).find(entry=>entry.id===doc&&typeof entry.bodyText==='string');
  const content=record?record.bodyText.split(/\n\s*\n/).map(line=>`<p>${esc(line)}</p>`).join(''):'<p>正式文本待接入。本地原型仅展示条款查看流程。</p>';
  A.openSheet(title,`<div class="ux-stack">${content}</div>`,true);
 };
 function showPhoneAuthorization(){
  A.openSheet('手机号授权演示',`<section class="demo-auth-sheet demo-auth-phone" data-node-id="2392:17447">
   <div class="demo-auth-merchant">
    <span class="demo-auth-merchant-mark">${asset('17447-imgEllipse1492.svg')}${asset('17447-imgVuoriWordmarkWhite3.svg')}</span>
    <span>Vuori 线上精品店</span>
    ${button('ⓘ','auth-phone-info','class="demo-auth-phone-info" aria-label="关于演示授权"')}
   </div>
   <h3>申请获取并验证你的手机号</h3><p class="demo-auth-note">注册、登录小程序 · 演示授权</p>
   <div class="demo-auth-phone-options">
    ${button('000****0101<small>演示绑定号码</small>','auth-use-phone')}
    ${button('不允许','close-sheet')}
   </div>
   ${button('使用其它号码','auth-other-phone','class="demo-auth-other-link"')}
  </section>`);
 }
 H['auth-request-phone']=()=>{
  const page=A.$('.demo-auth-login');
  if(!flow||A.route.id!==loginRoute||!page||S.member)return;
  const unchecked=page.querySelector('input[type="checkbox"]:not(:checked)');
  if(unchecked){
   page.querySelector('[data-auth-error]').textContent='请先阅读并勾选两项协议';
   unchecked.focus();
   return;
  }
  hasConsent=true;
  remember(consentKey,'yes');
  showPhoneAuthorization();
 };
 H['auth-phone-info']=()=>A.openSheet('手机号授权演示','<p>此原型使用虚构号码展示授权流程。</p>',true);
 H['auth-my']=()=>{if(A.route.id==='U30'&&!S.member)A.startDemoAuth('U30')};
 function enterProfile(phone){
  if(!flow||A.route.id!==loginRoute)return;
  flow.phone=phone;
  if(registeredPhones.has(phone)){finish();return;}
  delete A.formDrafts[A.routeURL(profileRoute)];
  A.go(profileRoute,{},true);
 }
 H['auth-use-phone']=()=>{if(A.$('#ux-sheet[open] .demo-auth-phone'))enterProfile(demoPhone)};
 H['auth-other-phone']=()=>{
  if(!canAuthorize())return;
  flow.codeIssued=false;
  A.openSheet('使用其他号码',`<form class="ux-form demo-auth-other" data-form="auth-phone">
   ${A.field('手机号','phone','',{type:'tel',placeholder:'000 开头的 11 位演示号码',maxlength:11})}
   ${button('获取演示验证码','auth-code','class="ux-btn outline"')}
   ${A.field('验证码','code','',{placeholder:'输入 6 位演示验证码',maxlength:6})}
   <p class="demo-auth-note" data-code-note role="status">本地演示使用虚构号码。</p>
   <p class="ux-error" data-error role="status"></p>
   <button type="submit" class="ux-btn">验证并继续</button>
  </form>`);
 };
 H['auth-code']=(_,button)=>{
  const form=button.closest('form');
  if(!flow||!/^000\d{8}$/.test(form.elements.phone.value.trim())){
   A.formError(form,'请输入 000 开头的 11 位演示号码');return;
  }
  flow.codeIssued=form.elements.phone.value.trim();
  A.formError(form,'');
  form.querySelector('[data-code-note]').textContent='演示验证码 123456';
  form.elements.code.focus();
 };

 const select=(label,name,options)=>`<label class="ux-field"><span>${label}</span><span class="demo-auth-select"><select name="${name}"><option value="">请选择${label}</option>${options.map(option=>`<option>${option}</option>`).join('')}</select>${asset('16848-imgArrowBack1.svg')}</span></label>`;
 const choices=(name,options,type='checkbox')=>options.map(value=>`<label><input type="${type}" name="${name}" value="${value}"><span>${value}</span></label>`).join('');
 const multiple=(title,name,options,sizes=false)=>`<div class="demo-auth-choice-heading"><span>${title}</span><small>（可多选）</small></div><div class="demo-auth-choices${sizes?' demo-auth-sizes':''}" role="group" aria-label="${title}">${choices(name,options)}</div>`;
 const sizes=['XXS','XS','S','M','L','XL','XXL'];
 V[profileRoute]=()=>{
  if(!flow?.phone)return `<div class="ux-page">${A.empty('暂无待完成的注册','可从「我的」开启本地登录注册演示。','go',{route:'U30'},'返回我的','user')}</div>`;
  return `<div class="ux-page demo-auth-profile" data-node-id="2392:16848">
   <h2 class="sr-only">加入会员</h2>
   <form class="ux-form" data-form="auth-profile">
    <div class="demo-auth-profile-scroll">
    <div class="demo-auth-profile-card" data-node-id="2392:16863">
     <div class="demo-auth-required">
      <label class="ux-field"><span>手机号（已验证）</span><input type="tel" name="phone" value="${esc(flow.phone)}" readonly></label>
      <p class="ux-note">以下资料选填，可稍后在「我的」中补充。</p>
      ${A.field('昵称','nickname','',{placeholder:'请输入',maxlength:20})}
      <div class="ux-field"><span>称谓</span><div class="demo-auth-choices" role="group" aria-label="称谓">${choices('title',['女士','先生','不方便透露'],'radio')}</div></div>
      <label class="ux-field"><span>生日</span><span class="demo-auth-select"><input type="date" name="birthday" max="${new Date().toISOString().slice(0,10)}" aria-label="生日">${asset('16848-imgArrowBack1.svg')}</span><small>请准确填写，生日每年仅可修改一次。</small></label>
      ${select('城市','city',['上海','深圳','北京','杭州','广州','成都','其他'])}
     </div>
     <div class="demo-auth-preferences">${multiple('分享您感兴趣的运动','sports',['瑜伽','跑步','训练','网球','高尔夫','户外活动'])}</div>
     <div class="demo-auth-preferences">${multiple('分享您感兴趣的品类','categories',['女装','男鞋','配件','鞋履','合作款'])}</div>
     <div class="demo-auth-preferences">
      <div class="demo-auth-choice-heading"><span>尺码偏好</span>${button('尺码指南','size-guide','class="demo-auth-policy"')}</div>
      ${multiple('你的上装尺码','topSize',sizes,true)}
      ${multiple('你的下装尺码','bottomSize',sizes,true)}
     </div>
     <p class="ux-error" data-error role="status"></p>
    </div></div>
    <div class="demo-auth-profile-footer" data-node-id="2392:17045">
     <button class="ux-btn" type="submit">继续</button>
     ${button('下次再说','auth-skip','class="demo-auth-skip"')}
    </div>
   </form>
  </div>`;
 };
 function finish(profile){
  if(!flow?.phone||!canAuthorize())return;
  const {target,phone}=flow;
  const joining=A.route.id===profileRoute;
  if(joining){
   registeredPhones.add(phone);
   remember(membersKey,JSON.stringify([...registeredPhones]));
  }
  Object.assign(S.profile,{phone},profile);
  S.member=true;
  flow=null;
  if(joining)A.clearFormDraft();
  A.go(target,{},true);
  A.toast('已进入体验账号');
 }
 H['auth-skip']=()=>{if(A.route.id===profileRoute)finish()};
 H['auth-cancel']=()=>{
  if(!canAuthorize())return;
  flow=null;
  A.clearFormDraft();
  if(history.state?.depth>0)A.back();
  else A.go('U30',{},true);
 };
 function syncForm(form){
  form.elements.birthday.classList.toggle('has-value',Boolean(form.elements.birthday.value));
 }
 document.addEventListener('change',event=>{
  const control=event.target;
  if(control.closest('.demo-auth-login')&&control.type==='checkbox'){
   control.toggleAttribute('checked',control.checked);
   A.$('[data-auth-error]').textContent='';
  }
 });
 document.addEventListener('input',event=>{
  const form=event.target.closest('[data-form="auth-profile"]');
  if(form)syncForm(form);
 });
 const handleForm=A.handleForm;
 A.handleForm=async form=>{
  if(form.dataset.form==='auth-phone'){
   const data=new FormData(form),phone=String(data.get('phone')||'').trim();
   if(!flow||flow.codeIssued!==phone||data.get('code')!=='123456')return A.formError(form,'请核对演示手机号和验证码');
   enterProfile(phone);
  }else if(form.dataset.form==='auth-profile'){
   const data=new FormData(form);
   if(!form.elements.birthday.validity.valid)return A.formError(form,'请输入有效的生日');
   const topSizes=data.getAll('topSize'),bottomSizes=data.getAll('bottomSize');
   const profile={
    nickname:form.elements.nickname.value.trim(),gender:({女士:'女士',先生:'男士',不方便透露:'不愿透露'})[data.get('title')],
    birthday:data.get('birthday'),city:data.get('city'),size:topSizes[0]||bottomSizes[0]
   };
   for(const [field,values] of Object.entries({sports:data.getAll('sports'),categories:data.getAll('categories'),topSizes,bottomSizes})){
    if(values.length)profile[field]=values;
   }
   finish(Object.fromEntries(Object.entries(profile).filter(([,value])=>value)));
  }else return handleForm(form);
 };

 const render=A.render;
 const system=A.$('.system'),originalSystem=system.innerHTML;
 A.render=function(...args){
  const {id}=A.parse();
  const loggingIn=id===loginRoute;
  const joining=id===profileRoute&&Boolean(flow?.phone);
  const active=loggingIn||joining;
  const page=A.$('.page');
  if(!active&&[loginRoute,profileRoute].includes(A.route.id))flow=null;
  if(loggingIn&&!flow)flow={target:'U30',phone:'',codeIssued:false};
  page.classList.toggle('demo-auth-join',active);
  page.classList.toggle('demo-auth-login-page',loggingIn);
  page.querySelector('.demo-auth-hero')?.remove();
  if(system.querySelector('.demo-auth-status-icons'))system.innerHTML=originalSystem;
  render(...args);
  if(!active)return;
  system.insertAdjacentHTML('beforebegin',`<div class="demo-auth-hero" aria-hidden="true">${asset('16848-img05OurStoryImpact1.png.webp?v=20261029-images-all')}<div>${asset('16848-hero.jpg.webp?v=20261029-images-all')}</div><i></i></div>`);
  const capsule=(dots,circle)=>`<div class="demo-auth-capsule" aria-label="微信小程序菜单">${asset(dots)}<i></i>${asset(circle)}</div>`;
  if(loggingIn){
   system.innerHTML=`<span>9:41</span><span class="demo-auth-status-icons">${asset('17120-imgGroup.svg')}</span>`;
   A.$('#app-header').innerHTML=`<div class="demo-auth-login-nav">${button(asset('17120-imgVector1170.svg'),'auth-cancel','aria-label="返回"')}${button(asset('17120-imgGroup1912056219.svg'),'auth-home','aria-label="首页"')}</div>${capsule('17120-imgFill43.svg','17120-imgGroup2.svg')}`;
   return;
  }
  system.innerHTML=`<span>9:41</span><span class="demo-auth-status-icons">${asset('16848-imgCellularConnection.svg')}${asset('16848-imgWifi.svg')}<i></i>${asset('16848-imgCap.svg')}</span>`;
  A.$('#app-header').innerHTML=`<button type="button" class="demo-auth-back" ${attr('auth-cancel')} aria-label="返回">${asset('16848-imgVector994.svg')}</button><span class="demo-auth-header-logo">${asset('16848-imgVector1.svg')}</span>${capsule('16848-imgFill43.svg','16848-imgGroup2.svg')}`;
  syncForm(A.$('[data-form="auth-profile"]'));
 };
})();
