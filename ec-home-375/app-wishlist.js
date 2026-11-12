(function(){
const A=window.VuoriApp,{D,$,attr,esc}=A;
const isWishlist=id=>id==='U40'||id==='U44';
D.pages.push(['U44','我的收藏','购物袋与结算']);

const icon=(name,folder='wishlist2193')=>`<img src="assets/${folder}/${name}.svg" alt="">`;
function card(product){
 const color=A.state.cardColors[product.id]??0;
 const image=product.pdpConfig?.colorImages?.[color]||'assets/'+product.image;
 const detail=attr('product',{id:product.id,color});
 const prefix=product.name.split(' ')[0]+' ';
 const title=product.cn.startsWith(prefix)?product.cn.slice(prefix.length):product.cn;
 const name=product.fabric==='DreamKnit'?'DreamKnit™':product.name;
 return `<article class="wishlist-item member-favorite">
  <div class="wishlist-image">
   <button class="wishlist-media" ${detail}><img src="${esc(image)}" alt="${esc(product.cn)}"></button>
   <button class="wishlist-save member-remove-favorite" type="button" aria-label="取消收藏 ${esc(product.cn)}" aria-pressed="true" ${attr('wishlist-save',{pid:product.id})}>${icon('imgIcon5')}</button>
  </div>
  ${A.colorButtons(product,color)}
  <button class="wishlist-product" ${detail}><span>${esc(name)}</span><span>${esc(title)}</span></button>
  <p class="wishlist-color">${esc(product.colors[color]?.[0]||'')}</p>
  ${A.productPrice(product.price,product.compareAtPrice)}
  <button class="wishlist-add" ${attr('wishlist-add',{pid:product.id,color})} ${product.retired?'disabled':''}>加入购物袋</button>
 </article>`;
}
function wishlist(){
 const saved=A.q('state')==='empty'?[]:D.products.filter(product=>A.PDP.liked.has(product.id));
 return `<div class="wishlist${saved.length?'':' wishlist--empty'}" data-node-id="2193:11081">
  <div class="wishlist-heading"><h1>我的收藏</h1><span>${saved.length}件商品</span></div>
  ${saved.length?`<div class="wishlist-grid">${saved.map(card).join('')}</div>`:A.commerceEmpty({title:'还没有收藏商品',icon:'heart',label:'去发现单品'})}
 </div>`;
}
A.views.U44=wishlist;
A.views.U40=()=>A.state.member?wishlist():`<div class="ux-page">${A.gate()}</div>`;

A.actions['wishlist-save']=({pid})=>{
 if(!A.PDP.liked.has(pid))return;
 A.confirmCentered('确定取消收藏吗？',[
  '这件商品将从收藏夹移除。','想再次收藏，可前往商品详情页。'
 ],'wishlist-remove-confirm',{pid});
};
A.actions['wishlist-remove-confirm']=async({pid},button)=>{
 const panel=button.closest('.centered-confirm');
 const error=panel.querySelector('.centered-confirm-error');
 error.hidden=true;
 button.disabled=true;
 try{
  await A.setFavorite(pid,false);
  if(panel.isConnected&&isWishlist(A.route.id)){
   A.render(false);
   $('#ux-sheet').addEventListener('close',()=>{
    $('.wishlist-save, .wishlist .ux-empty button')?.focus({preventScroll:true});
   },{once:true});
  }
  A.toast('已取消收藏');
 }catch(err){
  error.textContent=err.message||'暂未取消收藏，请重试。';
  error.hidden=false;
 }finally{button.disabled=false}
};
A.actions['wishlist-add']=({pid,color})=>A.actions['pdp-open']({pid,color,intent:'add',wishlist:true});

const render=A.render;
A.render=function(...args){
 const active=isWishlist(A.parse().id);
 document.body.classList.toggle('wishlist-mode',active);
 const focused=document.activeElement?.closest('.wishlist .ux-swatch')?.dataset;
 render(...args);
 if(!active)return;
 $('.system').innerHTML=`<span class="time">9:41</span><div class="system-icons">${['imgIcon','imgIcon1','imgIcon2'].map(name=>icon(name)).join('')}</div>`;
 $('#app-header').innerHTML=`<div class="wishlist-header-nav" role="group" aria-label="页面导航">
  <button ${attr('back')} aria-label="返回">${icon('img')}</button><i></i><button ${attr('root',{route:'U01'})} aria-label="首页">${icon('header-home','bag2075')}</button>
 </div><div class="wishlist-header-menu" aria-label="微信小程序菜单">${icon('imgIcon3')}<i></i>${icon('imgIcon4')}</div>`;
 if(focused)Array.from(document.querySelectorAll('.wishlist .ux-swatch')).find(button=>
  button.dataset.pid===focused.pid&&button.dataset.color===focused.color
 )?.focus({preventScroll:true});
};
})();
