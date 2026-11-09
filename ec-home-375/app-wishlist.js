(function(){
const A=window.VuoriApp,{D,$,attr,esc}=A;
const route='U44';
const recentKey='vuori-recent-products';
const recentLimit=12;
let recent=[];
try{
 const stored=JSON.parse(localStorage.getItem(recentKey)||'[]');
 if(Array.isArray(stored))recent=[...new Set(stored.filter(id=>typeof id==='string'))].slice(0,recentLimit);
}catch{}

D.pages.push([route,'心愿单','购物袋与结算']);

function recordVisit(){
 if(A.route.id!=='U08'||!$('.pdp-summary'))return;
 const id=A.currentProduct().id;
 if(recent[0]===id)return;
 recent=[id,...recent.filter(value=>value!==id)].slice(0,recentLimit);
 try{localStorage.setItem(recentKey,JSON.stringify(recent));}catch{}
}

function card(product,showRemove=false){
 return `<div class="wishlist-item">
  ${A.card(product,true)}
  ${showRemove?`<button class="wishlist-save" type="button" aria-label="取消收藏 ${esc(product.name)}" aria-pressed="true" ${attr('wishlist-save',{pid:product.id})}>${A.icon('heart')}</button>`:''}
 </div>`;
}

A.views[route]=()=>{
 const saved=D.products.filter(product=>A.PDP.liked.has(product.id));
 const viewed=recent.map(id=>D.products.find(product=>product.id===id)).filter(product=>product&&!product.retired);
 return `<div class="wishlist">
  <nav class="wishlist-crumb" aria-label="当前位置"><button ${attr('root',{route:'U01'})}>首页</button><span aria-hidden="true">/</span><span aria-current="page">心愿单</span></nav>
  <section aria-labelledby="wishlist-title">
   <h1 id="wishlist-title">我的心愿单</h1>
   ${saved.length?`<div class="wishlist-grid">${saved.map(product=>card(product,true)).join('')}</div>`:'<p class="wishlist-intro">还没有收藏。遇到喜欢的单品，点亮爱心，就能在这里找到。</p>'}
  </section>
  <section class="wishlist-recent" aria-labelledby="wishlist-recent-title">
   <h2 id="wishlist-recent-title">最近浏览</h2>
   ${viewed.length?`<div class="wishlist-rail" tabindex="0" role="region" aria-label="最近浏览商品，可左右滑动">${viewed.map(product=>card(product)).join('')}</div>`:`<p class="wishlist-note">浏览过的单品会出现在这里。</p>${A.link('探索商品','U03')}`}
  </section>
 </div>`;
};

A.actions['wishlist-save']=async(data,button)=>{
 button.disabled=true;
 try{
  await A.actions['pdp-favorite'](data);
  if(A.route.id===route)A.render(false);
 }finally{button.disabled=false;}
};

const render=A.render;
A.render=function(...args){
 const rail=$('.wishlist-rail');
 const scrollLeft=rail?.scrollLeft||0;
 const active=document.activeElement;
 const action=active?.closest('.wishlist')?active.dataset:null;
 const inRail=!!active?.closest('.wishlist-rail');
 render(...args);
 recordVisit();

 if(A.route.id===route){
  const nextRail=$('.wishlist-rail');
  if(nextRail)nextRail.scrollLeft=scrollLeft;
  if(action?.ux){
   const region=$(inRail?'.wishlist-rail':'.wishlist-grid');
   const match=Array.from(region?.querySelectorAll('[data-ux]')||[]).find(button=>
    button.dataset.ux===action.ux&&button.dataset.pid===action.pid&&button.dataset.color===action.color);
   match?.focus({preventScroll:true});
  }
 }
};
})();
