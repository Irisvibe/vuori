(function(){const A=window.VuoriApp,{state:S,D,esc:e}=A,H=A.actions,$=A.$;
const params=x=>{try{return JSON.parse(x||'{}')}catch{return {}}},normal=()=>{const p={...A.route.params};delete p.state;A.go(A.route.id,p,true)},itemKey=i=>[i.pid,i.color,i.size].join(':');
H.go=d=>{const data=params(d.params);if(d.route==='U04')A.openSearch(data.q);else A.go(d.route,data)};H.root=d=>A.root(d.route);H.back=()=>A.back();H['login-page']=()=>A.root('U30');H['member-go']=d=>A.requireMember(d.route,params(d.params));H.retry=normal;H['close-sheet']=()=>A.closeSheet();H['home-top']=()=>{$('#app-content').scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};H['home-new']=()=>A.go('U03',{title:'甄选新品',collection:'new'});
H.product=d=>{A.detailProduct=null;A.go('U08',{id:d.id,color:d.color??0});};
H['card-color']=d=>{S.cardColors[d.pid]=Number(d.color);A.render(false)};
H['detail-color']=d=>{S.detailColor=Number(d.color);S.detailSize='';A.track('sku_select',{pid:d.pid,color:d.color});A.render(false)};
H['detail-size']=d=>{S.detailSize=d.value;A.render(false)};
H['list-gender']=d=>A.go('U03',{gender:d.value,title:d.value+'系列'});H['category-gender']=d=>{S.gender=d.value;S.category='全部';A.render(false)};H['category-select']=d=>{S.category=d.value;A.render(false)};
H['category-list']=d=>{const p={gender:S.gender,title:S.gender+' · '+d.value};if(S.category==='面料')p.fabric=d.value;else if(['上装','长裤','运动内衣'].includes(S.category))p.category=S.category;else if(d.value==='运动上装')p.category='上装';else if(d.value==='自在长裤')p.category='长裤';else if(d.value==='训练系列')p.scene='训练';A.go('U03',p)};
H['home-collection']=d=>A.go('U03',['女士','男士'].includes(d.value)?{gender:d.value,title:d.value+'系列'}:{title:d.value});H['scene-list']=d=>A.go('U03',{scene:d.value,title:d.value+'场景'});H['home-outfit']=d=>{S.homeScene=d.value;A.render(false)};H['home-color']=d=>{S.homeColor=Number(d.index);A.render(false)};H['home-color-list']=d=>A.go('U03',{color:d.color,title:d.color+'色系'});H.story=()=>A.go('U07',{type:'brand'});H['fabric-scroll']=d=>{const rail=document.querySelector('.fabric-texture-rail');rail?.scrollBy({left:Number(d.direction)*165.172,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};H['fabric-select']=d=>{const index=Number(d.index);if(!A.fabrics[index]||index===(S.homeFabric||0))return;S.homeFabric=index;S.fabricChanged=true;A.render(false);};
H.keyword=d=>A.search(d.value);H['clear-search']=()=>{const i=$('input[name="keyword"]');if(i){i.value='';i.focus()}};H['clear-history']=()=>A.confirm('清除搜索记录','清除本机保存的全部搜索记录？','confirm-clear-history');H['confirm-clear-history']=()=>{S.history=[];A.save();A.closeSheet(true);A.refreshSearchHistory()};
H['remove-history']=({value},button)=>{
 const index=S.history.indexOf(value);
 if(index<0)return;
 const restoreFocus=document.activeElement===button;
 S.history.splice(index,1);
 A.save();
 A.refreshSearchHistory();
 if(restoreFocus){
  const remaining=document.querySelectorAll('.search-history-remove');
  (remaining[Math.min(index,remaining.length-1)]||$('.search-discovery-form input'))?.focus({preventScroll:true});
 }
};H['load-more']=()=>{S.pageSize=Math.max(6,S.pageSize)+4;A.render(false)};
A.listFilterKeys=['tag','gender','category','subcategory','size','color','fabric','scene','price','stock'];
A.listFilterLabel=(key,value)=>key==='stock'?'仅看有货':key==='price'&&value==='under800'?'¥ 800 以下':value;
A.listMerchandisingTags=()=>{
 const sets=A.Catalog?.sets()||{};
 return {
  '新品上新':new Set([...(sets['new-women']||[]),...(sets['new-men']||[])]),
  '人气之选':new Set([...(sets['popular-women']||[]),...(sets['popular-men']||[])])
 };
};

function filterDraftParams(){
 const params=A.productListScope?.()??{...A.route.params};
 for(const [key,values] of Object.entries(A.filterDraft)){
  if(values.length)params[key]=values.join(',');
  else delete params[key];
 }
 delete params.state;
 return params;
}
const filterResultLabel=()=>`查看 ${A.filteredProducts(filterDraftParams()).length} 件商品`;
function updateFilterResult(){
 const button=$('#ux-sheet .plp-filter-apply');
 if(button)button.textContent=filterResultLabel();
}

A.filters=()=>{
 const products=D.products.filter(p=>!p.retired);
 const values=key=>[...new Set(products.map(p=>p[key]).filter(Boolean))];
 const tones=new Map();
 for(const p of products)for(const [name,tone] of p.colors)if(!tones.has(name))tones.set(name,tone);
 const options=[
  ['category','类目',values('category')],
  ['size','尺码',[...new Set(products.flatMap(p=>p.sizes))]],
  ['color','颜色',[...tones.keys()]],
  ['scene','场景',values('scene')],
  ['fabric','材质',values('fabric')],
  ['tag','标签',Object.entries(A.listMerchandisingTags()).filter(([,ids])=>ids.size).map(([label])=>label)],
  ['gender','性别',['女士','男士'].filter(value=>values('gender').includes(value))],
  ['subcategory','品类',values('subcategory')],
  ['price','价格',['under800']]
 ];
 A.filterDraft=Object.fromEntries(A.listFilterKeys.map(key=>[key,A.q(key).split(',').filter(Boolean)]));
 const groups=options.map(([key,label,available])=>{
  const selected=A.filterDraft[key];
  return {key,label,options:[...new Set([...available,...selected])].map(value=>({
   label:A.listFilterLabel(key,value),attrs:A.attr('filter-toggle',{key,value}),
   pressed:selected.includes(value),tone:tones.get(value)
  }))};
 });
 A.openSheet('筛选',window.VuoriProductList.filterContent({
  groups,stock:{checked:A.filterDraft.stock.includes('1'),attrs:A.attr('filter-toggle',{key:'stock',value:'1'})},
  resetAttrs:A.attr('filter-reset'),applyAttrs:A.attr('filter-apply'),result:filterResultLabel()
 }));
};
H.filters=A.filters;
H['filter-toggle']=(data,element)=>{
 const selection=A.filterDraft[data.key];
 if(!selection)return;
 const active=selection.includes(data.value);
 if(active)selection.splice(selection.indexOf(data.value),1);
 else if(data.key==='gender')selection.splice(0,selection.length,data.value);
 else selection.push(data.value);
 if(data.key==='gender'){
  element.closest('.plp-filter-options').querySelectorAll('button').forEach(button=>{
   button.setAttribute('aria-pressed',String(selection.includes(button.dataset.value)));
  });
 }else element.setAttribute(data.key==='stock'?'aria-checked':'aria-pressed',String(!active));
 updateFilterResult();
};
H['filter-reset']=()=>{
 Object.values(A.filterDraft).forEach(values=>values.splice(0));
 $('#ux-sheet').querySelectorAll('.plp-filter [aria-pressed]').forEach(button=>button.setAttribute('aria-pressed','false'));
 $('#ux-sheet').querySelector('.plp-stock-switch')?.setAttribute('aria-checked','false');
 updateFilterResult();
};
H['filter-apply']=()=>{
 const params=filterDraftParams();
 S.pageSize=4;
 A.track('filter_apply',{filters:{...A.filterDraft}});
 A.go('U03',params,true);
};
H['clear-filter']=data=>{
 const params=A.productListScope?.()??{...A.route.params};
 delete params[data.key];
 delete params.state;
 A.go('U03',params,true);
};
H['clear-filters']=()=>{
 const params=A.productListScope?.()??{...A.route.params};
 for(const key of [...A.listFilterKeys,'state'])delete params[key];
 A.go('U03',params,true);
};
H.sort=()=>A.openSheet('商品排序',`<div class="ux-stack">${['综合排序','上新优先','价格从低到高','价格从高到低'].map(v=>`<button class="ux-listrow" ${A.attr('sort-apply',{value:v})}><span>${v}</span>${A.q('sort','综合排序')===v?A.icon('check'):''}</button>`).join('')}</div>`);H['sort-apply']=d=>A.go('U03',{...A.route.params,sort:d.value},true);
A.skuStock=(p,color,size,state=A.q('state'))=>{if(!p.stock||p.retired||state==='soldout'||state==='retired')return 0;if(color===1&&size==='XS')return 0;return Math.min(5,p.stock)};
A.quickBuyTitle=p=>/[A-Za-z]/.test(p.cn)?p.cn:(p.name.split(' ')[0]+' '+p.cn);
A.skuHTML=()=>{const o=A.sku,p=A.product(o.pid),unknown=p.price==null||A.q('state')==='price-error',stock=A.skuStock(p,o.color,o.size);return window.VuoriQuickBuy.render({title:A.quickBuyTitle(p),price:unknown?null:p.price,previousPrice:p.compareAtPrice,image:'assets/'+p.image,colors:p.colors,color:o.color,sizes:p.sizes,size:o.size,disabledSizes:p.sizes.filter(s=>!A.skuStock(p,o.color,s)),error:unknown?'无法获取价格，暂不可购买':o.error||'',unavailable:unknown||!stock,confirmLabel:o.index!=null?'确认修改':o.mode==='buy'?'立即购买':'加入购物袋',attrs:(action,data)=>A.attr(({close:'close-sheet',color:'sku-color',guide:'size-guide',size:'sku-size',confirm:'sku-confirm'})[action],data||{})})};
A.openSKU=focus=>{A.openSheet('选择商品规格',A.skuHTML());if(focus){const buttons=[...document.querySelectorAll('#ux-sheet [data-ux]')],b=buttons.find(b=>b.dataset.ux===focus.action&&(!focus.key||b.dataset[focus.key]===String(focus.value)));(b&&!b.disabled?b:b?.parentElement.querySelector('button:not(:disabled)'))?.focus({preventScroll:true})}};
H.sku=d=>{const p=A.product(d.pid),editing=d.index!==undefined&&d.index!==''?S.bag[Number(d.index)]:null;A.sku={pid:p.id,color:editing?.color??(d.color!==undefined?Number(d.color):A.detailProduct===p.id?S.detailColor:S.cardColors[p.id]??0),size:editing?.size??(A.detailProduct===p.id?S.detailSize:''),qty:editing?.qty??1,index:editing?Number(d.index):null,mode:d.mode||'add',error:''};A.openSKU()};
H['sku-color']=d=>{A.sku.color=Number(d.color);if(!A.skuStock(A.product(A.sku.pid),A.sku.color,A.sku.size))A.sku.size='';A.openSKU({action:'sku-color',key:'color',value:d.color})};H['sku-size']=d=>{A.sku.size=d.value;A.sku.error='';A.openSKU({action:'sku-size',key:'value',value:d.value})};
H['sku-confirm']=()=>{const o=A.sku,p=A.product(o.pid);if(!o.size||!A.skuStock(p,o.color,o.size)||p.price==null)return;if(A.q('state')==='add-error'&&!o.retried){o.retried=true;o.error='加购未完成，请保留当前规格后重试。';A.openSKU();return;}const line={pid:p.id,color:o.color,size:o.size,qty:o.index==null?1:o.qty,price:p.price,selected:true};if(o.mode==='buy'){A.beginBuyCheckout(line);return;}const others=S.bag.filter((_,i)=>i!==o.index),same=others.find(i=>itemKey(i)===itemKey(line));if((same?.qty||0)+line.qty>A.skuStock(p,o.color,o.size)){o.error='该规格库存不足，请更换规格或在购物袋中调整数量。';A.openSKU();return;}if(same)same.qty+=line.qty;else others.push(line);S.bag=others;A.track('add_to_bag_success',{pid:p.id,size:o.size,color:o.color});A.save();A.closeSheet(true);A.render(false);A.toast(o.index!=null?'商品规格已更新':'已加入购物袋');};
H['size-guide']=()=>A.openSheet('尺码指南',`<p>选择适合你的穿着状态</p><p class="ux-note ux-spaced">以下为尺寸表版式示意，不是正式商品测量数据。正式尺寸按款式与品类提供。</p><table class="ux-table ux-gap"><tr><th>尺码</th><th>胸围 / 腰围</th><th>测量口径</th></tr>${['XS','S','M','L','XL'].map(s=>`<tr><td>${s}</td><td>待正式数据</td><td>平铺测量</td></tr>`).join('')}</table><p class="ux-note ux-spaced">自然站立，将软尺水平环绕测量部位，不要拉紧。个人尺码偏好不代表合身保证。</p>`,true);
H['product-info']=d=>A.openSheet(d.type==='care'?'成分与保养':'配送与退换',`<p>${d.type==='care'?'按服装水洗标进行清洁和保养。面料成分与护理信息以正式商品资料为准。':'配送范围、运费、发货承诺及退换政策由交易和履约团队确认。此处展示规则说明的交互载体。'}</p>${A.button('查看政策说明','go',{route:'U07',params:JSON.stringify({type:'policy',title:d.type==='care'?'商品护理':'配送与退换政策'})},'outline ux-gap')}`);
H['bag-qty']=d=>{const i=S.bag[Number(d.index)];if(!i)return;const qty=Math.min(A.skuStock(A.product(i.pid),i.color,i.size),Math.max(1,i.qty+Number(d.delta)));if(qty<1){A.toast('该规格暂不可用');return;}i.qty=qty;A.save();A.render(false)};
let bagRemovalTarget;
H['bag-remove']=({index})=>{
 bagRemovalTarget=S.bag[Number(index)];
 if(!bagRemovalTarget)return;
 A.confirmCentered('确定删除这件商品吗？',[
  '这件商品将从购物袋移除。','如需购买，可在商品详情页重新加入。'
 ],'bag-remove-confirm');
};
H['bag-remove-confirm']=()=>{
 const index=S.bag.indexOf(bagRemovalTarget);
 bagRemovalTarget=null;
 if(index<0){A.closeSheet(true);return}
 S.bag.splice(index,1);
 A.save();
 A.render(false);
 A.toast('商品已移除');
};
H['clear-invalid']=()=>A.confirm('清理失效商品','只移除已失效的商品，其他选择将保留。','clear-invalid-confirm');H['clear-invalid-confirm']=()=>{S.bag=S.bag.filter(i=>!i.invalid&&A.product(i.pid).stock>0);normal();A.toast('已清理失效商品')};
H.checkout=()=>{const selected=A.selectedItems();if(!selected.length){A.toast('请先选择可结算商品');return;}S.checkoutItems=structuredClone(selected);S.checkoutSource='bag';S.coupon=A.bagCoupon();A.startDemoAuth('U10')};H['accept-price']=()=>{if(S.bag[0]){const p=A.product(S.bag[0].pid);p.price+=100;S.bag[0].price=p.price;}normal();A.toast('已确认新的演示价格')};H['accept-stock']=()=>{if(S.bag[0])S.bag[0].qty=1;normal();A.toast('数量已调整')};
H.coupons=()=>{const total=A.total(S.checkoutItems);A.openSheet('选择优惠券',`<button class="ux-listrow" ${A.attr('pick-coupon',{id:'none'})}><span>不使用优惠券</span>${!S.coupon?A.icon('check'):''}</button>${D.coupons.map(c=>{const ok=c.online&&c.status==='可用'&&total>=c.threshold;return `<button class="ux-listrow" ${A.attr('pick-coupon',{id:c.id})} ${ok?'':'disabled'}><span><span>${c.name}<br><small class="ux-note">${ok?'可减 ¥'+c.amount:!c.online?'仅限门店使用':c.status==='已过期'?'已过期':'未满足使用门槛'}</small></span></span><span>${S.coupon?.id===c.id?A.icon('check'):''}</span></button>`}).join('')}<p class="ux-note ux-gap">可用券与规则均为演示，不代表现有券可在线抵扣。</p>`)};H['pick-coupon']=d=>{S.coupon=d.id==='none'?null:D.coupons.find(c=>c.id===d.id);A.closeSheet(true);A.render(false)};H['amount-info']=()=>A.openSheet('金额与配送说明',`<p>商品金额按当前演示 SKU 和数量计算，优惠券仅在满足演示门槛时适用。</p><p class="ux-note ux-spaced">运费、优惠分摊、退款返券及配送规则尚待业务确认。本原型显示 ¥0 配送费作为布局示意，不承诺正式免运费。</p>`);
H['checkout-address-list']=()=>{
 S.addressChoice=null;S.checkoutAddressImport=null;
 A.go('U11',{choose:'1'});
};
H['address-preview']=({id})=>{
 if(A.route.id!=='U11'||!A.q('choose')||!A.checkoutAddressOptions().some(item=>item.id===id))return;
 S.addressChoice=id;
 A.render(false);
 [...document.querySelectorAll('[data-ux="address-preview"]')].find(button=>button.dataset.id===id)?.focus({preventScroll:true});
};
H['address-choose']=({id})=>{
 const item=A.checkoutAddressOptions().find(row=>row.id===id);
 if(!item)return;
 if(item===S.checkoutAddressImport){
  if(item.default)S.addresses.forEach(row=>row.default=false);
  const index=S.addresses.findIndex(row=>row.id===id);
  if(index===-1)S.addresses.push(item);
  else S.addresses[index]=item;
 }
 S.selectedAddress=id;
 if(A.q('choose')){
  S.addressChoice=null;S.checkoutAddressImport=null;
  A.go('U10',{},true);
 }else{A.toast('已设为本次选用地址');A.render(false)}
};
H['address-delete']=({id})=>A.confirm('删除地址','确认删除这条收货地址？','address-delete-confirm',{id});
H['address-delete-confirm']=({id})=>{
 S.addresses=S.addresses.filter(item=>item.id!==id);
 if(S.checkoutAddressImport?.id===id)S.checkoutAddressImport=null;
 if(S.selectedAddress===id)S.selectedAddress=null;
 if(S.addressChoice===id)S.addressChoice=null;
 A.render(false);
 A.toast('地址已删除');
};
H['address-form-back']=()=>{
 if(A.q('fromAddressList')&&history.state?.vuori&&history.state.depth>0)A.back();
 else{
  const {choose,wechat,fromList,form}=A.route.params;
  A.go('U11',{choose,wechat,fromList,form},true);
 }
};
const canChooseWechatAddress=()=>S.member&&['U10','U11','U12'].includes(A.route.id);
const wechatAddressFormValues=address=>({
 ...A.addressNameParts(address),phone:address.phone,region:address.region,detail:address.detail
});
function fillAddressForm(form,address){
 const fields=form.elements;
 if(![...fields.region.options].some(option=>option.value===address.region)){
  fields.region.add(new Option(address.region,address.region));
 }
 for(const [key,value] of Object.entries(wechatAddressFormValues(address)))fields[key].value=value;
 A.formError(form,'');
 A.syncAddressForm(form);
}
let wechatAddressFormURL;
function useWechatAddress(result){
 const clean=value=>typeof value==='string'?value.trim():'';
 const street=clean(result?.streetName),detailNew=clean(result?.detailInfoNew);
 const address={
  name:clean(result?.userName),
  phone:clean(result?.telNumber),
  region:[result?.provinceName,result?.cityName,result?.countyName].map(clean).filter(Boolean).join(' '),
  detail:clean(result?.detailInfo)||(detailNew.startsWith(street)?detailNew:[street,detailNew].filter(Boolean).join(' '))
 };
 if(Object.values(address).some(value=>!value)){
  A.toast('微信地址信息不完整，请重新选择或手动填写');
  return;
 }
 if(A.route.id==='U12'){
  const form=$('#app-content [data-form="address"]');
  if(form)fillAddressForm(form,address);
  return;
 }
 const comparable=value=>value.replace(/\s+/g,'');
 let item=S.addresses.find(item=>Object.entries(address).every(([key,value])=>comparable(item[key])===comparable(value)));
 if(!item)item={id:'ADDR-'+crypto.randomUUID(),...address,default:false};
 if(A.route.id==='U11'&&A.q('choose')){
  stageCheckoutAddress(item);
  A.render(false);
  return;
 }
 if(!S.addresses.includes(item))S.addresses.push(item);
 if(A.route.id==='U10'){
  S.selectedAddress=item.id;
  if(A.q('state')==='no-address'){
   const params={...A.route.params};
   delete params.state;
   A.go('U10',params,true);
  }else A.render(false);
 }else A.render(false);
 A.toast(A.route.id==='U10'?'已使用微信收货地址':'微信收货地址已导入');
}

let choosingWechatAddress=false;
H['address-wechat']=async(_data,button)=>{
 if(choosingWechatAddress||!canChooseWechatAddress())return;
 const host=A.MemberCenter?.host;
 const wx=window.wx;
 if(typeof host?.chooseAddress!=='function'&&typeof wx?.chooseAddress!=='function'){
  if(A.route.id==='U12'){
   wechatAddressFormURL=A.lastURL;
   A.go('U11',{wechat:'1',form:'1',choose:A.q('choose')});
   return;
  }
  const fromList=A.route.id==='U11';
  if(!fromList){S.addressChoice=null;S.checkoutAddressImport=null;}
  A.go('U11',{choose:fromList?A.q('choose'):'1',wechat:'1',fromList:fromList?'1':''});
  return;
 }
 const label=button.textContent;
 choosingWechatAddress=true;
 button.disabled=true;
 button.textContent='等待选择地址…';
 try{
  const result=typeof host?.chooseAddress==='function'
   ?await host.chooseAddress()
   :await new Promise((success,fail)=>wx.chooseAddress({success,fail}));
  if(button.isConnected&&canChooseWechatAddress())useWechatAddress(result);
 }catch(error){
  if(!button.isConnected||!canChooseWechatAddress())return;
  const reason=String(error?.code||'')+' '+String(error?.errMsg||error?.message||'');
  A.toast(/cancel/i.test(reason)?'已取消选择微信地址':/deny|denied|auth|privacy|permission/i.test(reason)?'未获得微信地址授权，可重试或手动填写':'微信地址暂未获取，请重试或手动填写');
 }finally{
  choosingWechatAddress=false;
  button.disabled=false;
  button.textContent=label;
 }
};
function stageCheckoutAddress(item){
 S.checkoutAddressImport=S.addresses.includes(item)?null:item;
 S.addressChoice=item.id;
}
H['address-wechat-pick']=({id})=>{
 if(A.route.id!=='U11'||A.q('wechat')!=='1'||!S.member)return;
 const source=A.wechatDemoAddresses.find(item=>item.id===id);
 if(!source)return;
 if(A.q('form')==='1'&&wechatAddressFormURL&&history.state?.depth>0){
  const url=wechatAddressFormURL;
  wechatAddressFormURL=null;
  Object.assign(A.formDrafts[url]??={},wechatAddressFormValues(source));
  history.back();
  return;
 }
 const item={...source};
 const choose=A.q('choose'),fromList=A.q('fromList');
 if(choose)stageCheckoutAddress(item);
 else{
  if(item.default)S.addresses.forEach(row=>row.default=false);
  const index=S.addresses.findIndex(row=>row.id===id);
  if(index===-1)S.addresses.push(item);
  else S.addresses[index]=item;
 }
 if(fromList&&history.state?.depth>0)history.back();
 else A.go('U11',{choose},true);
};

H['submit-order']=async(d,el)=>{if(A.orderSubmitting)return;const address=S.addresses.find(x=>x.id===S.selectedAddress)||S.addresses[0];if(!address){A.toast('请先添加收货地址');return;}if(A.q('state')==='price-change'&&!S.acceptedCheckoutPrice){A.confirm('价格已更新','请核对新金额后继续。这里为价格变化的演示反馈。','checkout-price-confirm');return;}if(A.q('state')==='stock-change'){A.openSheet('库存发生变化',`<p>部分规格无法满足当前数量，请返回购物袋调整。</p>${A.button('返回购物袋','go',{route:'U09'},'ux-gap')}`);return;}A.orderSubmitting=true;el.disabled=true;el.textContent='正在提交…';await new Promise(r=>setTimeout(r,450));if(A.q('state')==='submit-error'){A.orderSubmitting=false;el.disabled=false;el.textContent='提交订单';A.toast('提交未完成，请重试，商品和地址已保留');return;}const id='DEMO'+Date.now().toString().slice(-9),total=A.total(S.checkoutItems)-(S.coupon?.amount||0),o={id,status:'待支付',items:S.checkoutItems.map(i=>({...i,name:A.product(i.pid).name})),total,coupon:S.coupon?structuredClone(S.coupon):null,address:structuredClone(address),source:S.checkoutSource,sourceBagKeys:S.checkoutSource==='bag'?S.checkoutItems.map(i=>({key:itemKey(i),qty:i.qty})):[],created:new Date().toISOString()};S.orders.unshift(o);A.orderSubmitting=false;A.track('order_created',{id});A.go('U15',{id});H['pay-demo']({id});};H['checkout-price-confirm']=()=>{S.acceptedCheckoutPrice=true;A.closeSheet(true);A.toast('已确认演示金额，可继续提交')};
H['pay-demo']=d=>A.openSheet('支付流程演示',`<p>此处不调用微信支付，请选择一种结果体验后续页面。</p><p class="ux-note ux-spaced">真实支付由微信原生收银台与服务端确认；本原型不会产生扣款。</p><div class="ux-stack ux-gap">${A.button('模拟支付成功','pay-result',{id:d.id,value:'success'})}${A.button('模拟取消支付','pay-result',{id:d.id,value:'cancelled'},'outline')}${A.button('模拟结果确认中','pay-result',{id:d.id,value:'pending'},'outline')}${A.button('模拟支付失败','pay-result',{id:d.id,value:'failed'},'outline')}</div>`);
H['pay-result']=d=>{const o=S.orders.find(x=>x.id===d.id);if(!o)return;if(d.value==='success'){o.status='待发货';if(!o.bagRemoved&&o.source==='bag'){for(const ref of o.sourceBagKeys||[]){const i=S.bag.find(x=>itemKey(x)===ref.key);if(i)i.qty-=ref.qty;}S.bag=S.bag.filter(x=>x.qty>0);o.bagRemoved=true;A.save();}}else o.status='待支付';A.track('payment_result',{id:o.id,result:d.value});A.go('U13',{id:o.id,state:d.value})};H['query-payment']=d=>{const o=S.orders.find(x=>x.id===d.id)||A.currentOrder();A.openSheet('查询演示订单状态',`<p>当前订单：${o.status}</p><p class="ux-note ux-spaced">本地没有支付服务端，不自动判定到账。可返回订单，或通过演示面板切换不同结果状态。</p>${A.button('查看订单','go',{route:'U15',params:JSON.stringify({id:o.id})},'ux-gap')}`)};
H['order-filter']=d=>A.go('U14',{status:d.value},true);H['cancel-order']=d=>A.confirm('取消订单','确认关闭这笔待支付的演示订单？','cancel-order-confirm',{id:d.id});H['cancel-order-confirm']=d=>{const o=S.orders.find(x=>x.id===d.id);if(o?.status==='待支付')o.status='已关闭';A.closeSheet(true);A.render(false);A.toast('演示订单已关闭')};H['receive-order']=d=>A.confirm('确认收货','请确认商品已经收到。这只会改变本地演示订单状态。','receive-order-confirm',{id:d.id});H['receive-order-confirm']=d=>{const o=S.orders.find(x=>x.id===d.id);if(o)o.status='已完成';A.closeSheet(true);A.render(false);A.toast('演示订单已完成')};H.package=d=>A.go('U16',{...A.route.params,package:d.value.endsWith('2')?'2':'1'},true);H['copy-demo']=async d=>{try{await navigator.clipboard.writeText(d.value);A.toast('已复制'+(d.label||'演示编号'))}catch{A.openSheet(d.label||'演示编号',`<p class="ux-long-id">${e(d.value)}</p><p class="ux-note ux-spaced">可长按或选择文本进行复制。</p>`)}};
H['activity-theme']=d=>A.go('U23',{theme:d.value});H['activity-theme-filter']=d=>A.go('U23',{...A.route.params,theme:d.value},true);H['clear-activity-filter']=()=>A.go('U23',{},true);H['activity-filters']=()=>A.openSheet('筛选活动',`<form class="ux-form" data-form="activity-filters">${A.field('城市','city',A.q('city','全部'),{options:['全部','深圳','上海','杭州']})}${A.field('状态','status',A.q('status','全部'),{options:['全部','未开始','已结束']})}<div class="ux-sheet-footer">${A.button('重置','clear-activity-filter',{},'outline')}<button class="ux-btn" type="submit">确认筛选</button></div></form>`);
H.coach=d=>{const a=A.activity(d.id);A.openSheet('教练介绍',`<h3>${a.coach}</h3><p class="ux-muted ux-spaced">社区运动伙伴 · 演示介绍</p><p class="ux-spaced">一起体验运动，在自然的节奏中找到适合自己的状态。正式教练信息与资质以活动详情为准。</p>`)};
H.sessions=d=>{const a=A.activity(d.id);A.sessionActivity=a.id;A.openSheet('日期与场次',`<p>${a.name}</p><div class="ux-specs ux-gap"><button class="selected">${a.date}</button></div><div class="ux-stack ux-gap"><button class="ux-listrow" ${A.attr('choose-session',{id:a.id,value:a.date+' '+a.time})} ${a.mode==='upcoming'?'disabled':''}><span>${a.time}</span><span>${a.mode==='upcoming'?'未开放':a.mode==='full'?'候补':'可预约'}</span></button><button class="ux-listrow" disabled><span>14:00–16:00</span><span class="ux-note">已截止</span></button></div><p class="ux-note ux-gap">日期、场次及开放规则均为演示，不生成实际名额。</p>`)};H['choose-session']=d=>{S.session={aid:d.id,label:d.value};A.closeSheet(true);if(A.sessionContinue){A.sessionContinue=false;A.requireMember('U25',{id:d.id,wait:A.sessionWait?'1':'0'})}else A.render(false)};H['activity-book']=d=>{A.sessionContinue=true;A.sessionWait=A.q('state')==='full'||A.activity(d.id).mode==='full';H.sessions(d)};H['booking-open']=d=>{const b=S.bookings.find(b=>b.aid===d.id&&['未使用','候补中'].includes(b.status));A.requireMember(b?.status==='候补中'?'U29':'U28',b?{id:b.id}:{})};H['activity-rules']=()=>A.openSheet('活动须知',`<p>请确认参与信息真实准确，并按活动通知到场。</p><p class="ux-note ux-spaced">候补转正、取消截止、爽约处罚及签到窗口仍待业务确认；本原型不会新增固定期限。</p>`);H.subscribe=()=>A.openSheet('订阅活动更新',`<p>开启提醒后，及时了解社区活动信息。</p><p class="ux-note ux-spaced">此处展示订阅说明，真实系统授权由微信原生面板承接。本地不发起订阅。</p>${A.button('知道了','close-sheet',{},'ux-gap')}`);
H['booking-filter']=d=>A.go('U27',{type:d.value},true);H['cancel-booking']=d=>A.confirm('取消预约 / 候补','请先核对正式活动的取消规则。确认后仅取消这条本地体验记录。','cancel-booking-confirm',{id:d.id});H['cancel-booking-confirm']=d=>{const b=S.bookings.find(x=>x.id===d.id);if(b)b.status='已取消';A.closeSheet(true);A.render(false);A.toast('体验记录已取消')};H['waitlist-promote']=d=>{let b=S.bookings.find(x=>x.id===d.id);if(!b){b={id:'ACT-PROMOTED',aid:'surf',status:'未使用'};S.bookings.push(b)}b.status='未使用';A.go('U28',{id:b.id})};
H['coupon-filter']=d=>A.go('U35',{status:d.value},true);H['store-city']=()=>A.openSheet('选择城市',`<div class="ux-stack">${['全部','深圳','上海','北京'].map(x=>`<button class="ux-listrow" ${A.attr('store-city-choose',{value:x})}>${x}</button>`).join('')}</div>`);H['store-city-choose']=d=>A.go('U37',{city:d.value},true);H['store-location']=()=>A.openSheet('定位与门店',`<p>允许定位可帮助查找附近门店，也可手动选择城市。</p><p class="ux-note ux-spaced">本原型不访问设备位置。以下仅体验同意与拒绝后的界面。</p><div class="ux-sheet-footer">${A.button('暂不定位','go',{route:'U37',params:JSON.stringify({state:'location-denied'})},'outline')}${A.button('体验深圳门店','go',{route:'U37',params:JSON.stringify({city:'深圳'})})}</div>`);H['store-navigation']=()=>A.openSheet('门店导航',`<p>正式小程序将通过原生地图展示准确地址。</p><p class="ux-note ux-spaced">当前为示例地址，不发起导航。</p>`);H['store-phone']=()=>A.openSheet('联系门店',`<p>正式门店电话待资料确认。</p><p class="ux-note ux-spaced">原生拨号界面由设备提供；此处不会拨打电话。</p>`);H.advisor=()=>A.openSheet('专属顾问',`<p>扫码或通过企业微信联系专属顾问。</p><div class="ux-code-demo" aria-label="非有效企微二维码的演示图"></div><p class="ux-note">演示顾问码，不可扫码添加。正式二维码由门店系统提供。</p>`);H.support=()=>A.openSheet('有什么可以帮你？',`${A.row('商品与尺码咨询','support-topic',{value:'商品与尺码咨询'})}${A.row('订单 / 配送 / 售后','support-topic',{value:'订单与售后'})}${A.row('社区活动咨询','support-topic',{value:'社区活动咨询'})}<p class="ux-note ux-gap">本地原型仅展示服务入口，不发送客服消息。</p>`);H['support-topic']=d=>A.openSheet(d.value,`<p>请通过正式商城的在线客服或门店顾问获取帮助。</p><p class="ux-note ux-spaced">这里展示咨询说明，不连接外部客服服务。</p>`);
H.media=d=>A.openSheet('图片预览',`<img src="assets/${e(d.image)}" alt="商品或内容大图" style="width:100%;max-height:70vh;object-fit:contain">`);H.video=()=>A.openSheet('品牌影片',`<video controls playsinline preload="metadata" poster="assets/hero.png.webp?v=20261029-images-all" src="assets/brand-film.mp4" style="width:100%"></video>`);
H['send-code']=(d,el)=>{const form=el.closest('form'),phone=form.elements.phone.value.trim();if(!/^1\d{10}$/.test(phone)){A.formError(form,'请输入正确的 11 位手机号');return;}A.formError(form,'');S.codeSent=Date.now();let seconds=60;el.disabled=true;el.textContent=seconds+'s 后重发';clearInterval(A.codeTimer);A.codeTimer=setInterval(()=>{seconds--;if(!el.isConnected||seconds<=0){clearInterval(A.codeTimer);if(el.isConnected){el.disabled=false;el.textContent='重新获取'}}else el.textContent=seconds+'s 后重发'},1000);A.toast('演示验证码：123456')};
A.canReturn=order=>['待收货','待评价','已完成'].includes(order?.status);
A.refundLines=order=>{
 if(!order||(!A.canReturn(order)&&order.status!=='待发货'))return [];
 const subtotal=A.total(order.items);
 const paid=Math.round(Math.max(0,order.quote?.merchandisePayable??order.total)*100);
 const reserved=order.items.map(()=>0);
 for(const refund of S.refunds.filter(r=>r.order===order.id&&!['已关闭','已拒绝'].includes(r.stage))){
  const lines=refund.lines||[{lineIndex:order.items.findIndex(item=>item.pid===refund.pid),qty:refund.qty}];
  for(const line of lines)if(reserved[line.lineIndex]!=null)reserved[line.lineIndex]+=line.qty;
 }
 let cumulative=0,allocated=0;
 return order.items.map((item,index)=>{
  cumulative+=(item.price??A.product(item.pid).price??0)*item.qty;
  const allocation=subtotal?Math.round(paid*cumulative/subtotal):0;
  const cents=allocation-allocated;
  allocated=allocation;
  const used=Math.min(item.qty,reserved[index]);
  return {index,item,used,maxQty:item.qty-used,cents};
 }).filter(line=>line.maxQty>0);
};
const refundAmount=(line,qty)=>(Math.round(line.cents*(line.used+qty)/line.item.qty)-Math.round(line.cents*line.used/line.item.qty))/100;
A.refundOrder=()=>{const id=A.q('id')||(A.route.id==='U19'?S.refundDraft?.order:'');return id?S.orders.find(order=>order.id===id):S.orders.find(order=>A.refundLines(order).length)};
A.canReturnFull=(order,lines)=>lines.length>0&&lines.reduce((qty,line)=>qty+line.maxQty,0)===order.items.reduce((qty,item)=>qty+item.qty,0);
function refundSelection(draft,form){
 const order=S.orders.find(o=>o.id===draft.order);
 return A.refundLines(order).filter(line=>draft.indices.includes(line.index)).map(line=>{
  const field=form.querySelector(`[data-refund-quantity="${line.index}"]`);
  const qty=field?Number(field.value):0;
  return {...line,qty,amount:refundAmount(line,Math.max(0,Math.min(qty||0,line.maxQty)))};
 });
}
A.updateRefundEstimate=form=>{
 const draft=S.refundDraft;
 if(!draft)return;
 const amount=refundSelection(draft,form).reduce((sum,line)=>sum+line.amount,0);
 form.querySelector('[data-refund-amount]').textContent=A.money(Math.round(amount*100)/100);
};
A.refundAmount=refundAmount;

function addressFormError(values,demo){
 if(!values.surname.trim()||!values.givenName.trim())return '请填写姓氏和名字';
 const phonePattern=demo?/^000\d{8}$/:/^(?:1\d{10}|000\d{8})$/;
 if(!phonePattern.test(values.phone.trim()))return demo?'请输入 000 开头的 11 位演示号码':'请输入正确的手机号码';
 if(!values.region)return '请选择所在省市区';
 if(values.detail.trim().length<5)return '详细地址请至少填写 5 个字';
 return '';
}
A.syncAddressForm=form=>{
 const error=addressFormError(Object.fromEntries(new FormData(form)),form.dataset.demo==='true');
 form.querySelector('[type="submit"]').disabled=Boolean(error);
};
document.addEventListener('input',event=>{
 const form=event.target.closest('.address-form');
 if(form)A.syncAddressForm(form);
});
document.addEventListener('change',event=>{
 const form=event.target.closest('.address-form');
 if(form)A.syncAddressForm(form);
});
A.handleForm=async(form)=>{const values=Object.fromEntries(new FormData(form)),type=form.dataset.form;A.formError(form,'');
 if(type==='search'){if(!values.keyword?.trim()){const p=form.closest('.search-discovery')?.querySelector('[data-search-error]');if(p)p.textContent='请输入想寻找的商品或系列';return;}A.search(values.keyword);return;}
 if(type==='address'){
  const demo=form.dataset.demo==='true',id=A.q('id');
  const error=addressFormError(values,demo);
  if(error)return A.formError(form,error);
  const items=demo?A.wechatDemoAddresses:S.addresses;
  let item=(demo?items:A.checkoutAddressOptions()).find(row=>row.id===id);
  if(id&&!item)return A.formError(form,'这条地址已不存在');
  const surname=values.surname.trim(),givenName=values.givenName.trim();
  const original=item&&A.addressNameParts(item);
  const name=original?.surname===surname&&original.givenName===givenName?item.name:surname+givenName;
  const update={surname,givenName,name,phone:values.phone.trim(),region:values.region,detail:values.detail.trim(),default:!!values.default};
  if(update.default&&(!item||item!==S.checkoutAddressImport))items.forEach(row=>row.default=false);
  if(item)Object.assign(item,update);
  else{
   item={...update,id:(demo?'WX-DEMO-':'ADDR-')+crypto.randomUUID()};
   items.push(item);
  }
  if(!demo&&A.q('choose'))S.addressChoice=item.id;
  A.clearFormDraft();
  H['address-form-back']();
  A.toast('地址已保存');
  return;
 }
 if(type==='activity-filters'){A.go('U23',{...A.route.params,city:values.city,status:values.status},true);return;}
 if(type==='login'){if(!values.agree)return A.formError(form,'请先阅读并同意使用条款与隐私政策');A.openSheet('手机号授权体验',`<p>正式系统会调用微信原生手机号授权。</p><p class="ux-note ux-spaced">当前仅使用体验账号，不读取你的微信手机号，也不向外部提交身份信息。</p>${A.button('使用体验账号继续','experience-login',{},'ux-gap')}`);return;}
 if(type==='phone-login'){if(!/^1\d{10}$/.test(values.phone))return A.formError(form,'请输入正确的手机号码');if(!S.codeSent)return A.formError(form,'请先获取演示验证码');if(Date.now()-S.codeSent>300000)return A.formError(form,'验证码已过期，请重新获取');if(values.code!=='123456')return A.formError(form,'验证码不正确，请重新输入');if(!values.agree)return A.formError(form,'请同意使用条款与隐私政策');await A.busy(form,()=>{S.profile.phone=values.phone;A.clearFormDraft();A.login()});return;}
 if(type==='profile'){if(!values.nickname.trim())return A.formError(form,'请填写昵称');if(!/^1\d{10}$/.test(values.phone))return A.formError(form,'请输入正确的手机号码');await A.busy(form,()=>{Object.assign(S.profile,values);A.clearFormDraft();A.toast('个人资料已保存');A.go('U30',{},true)});return;}
 if(type==='booking'){if(!values.name.trim())return A.formError(form,'请填写参与人姓名');if(!/^1\d{10}$/.test(values.phone))return A.formError(form,'请输入正确的手机号码');if(!values.agree)return A.formError(form,'请先阅读并确认活动须知');const a=A.currentActivity();if(S.bookings.some(b=>b.aid===a.id&&['未使用','候补中'].includes(b.status)))return A.formError(form,'你已提交该活动的报名，请在我的活动中查看');await A.busy(form,()=>{const wait=a.mode==='full'||A.q('wait')==='1';const b={id:'ACT'+Date.now(),aid:a.id,status:wait?'候补中':'未使用',session:S.session?.label||a.date+' '+a.time};S.bookings.push(b);A.clearFormDraft();A.go('U26',{id:a.id,wait:wait?'1':'0'},true)});return;}
 if(type==='refund-select'){
  const order=A.refundOrder(),lines=A.refundLines(order),full=A.q('scope')==='full';
  if(!S.member||!lines.length)return A.formError(form,'当前订单暂无可申请的商品');
  if(full&&(!A.canReturn(order)||!A.canReturnFull(order,lines)))return A.formError(form,'订单已有售后记录，请选择部分退货');
  const chosen=full?lines.map(line=>line.index):new FormData(form).getAll('item').map(Number);
  const indices=lines.filter(line=>chosen.includes(line.index)).map(line=>line.index);
  if(!indices.length)return A.formError(form,'请选择需要售后的商品');
  S.refundDraft={order:order.id,indices,full,type:A.canReturn(order)?'退货退款':'仅退款'};
  A.clearFormDraft();
  A.go('U19',{id:order.id});
  return;
 }
 if(type==='refund'){
  const draft=S.refundDraft,order=A.refundOrder();
  if(!S.member||!draft||draft.order!==order?.id)return A.formError(form,'请重新选择售后商品');
  if(!values.reason||values.reason==='请选择')return A.formError(form,'请选择申请原因');
  if(A.q('state')==='upload-error'&&values.evidence?.size)return A.formError(form,'凭证上传失败，请重新选择或移除凭证');
  if(A.q('state')==='submit-error')return A.formError(form,'提交未完成，请稍后重试，填写内容已保留');
  await A.busy(form,()=>{
   if(!form.isConnected)return;
   if(draft.type!==(A.canReturn(order)?'退货退款':'仅退款'))return A.formError(form,'订单状态已变化，请重新选择');
   const lines=refundSelection(draft,form);
   if(lines.length!==draft.indices.length||lines.some(line=>!Number.isInteger(line.qty)||line.qty<1||line.qty>line.maxQty))return A.formError(form,'申请数量超出可售后范围，请重新选择');
   const wholeOrder=A.canReturnFull(order,lines.map(line=>({...line,maxQty:line.qty})));
   if(draft.full&&(!A.canReturn(order)||!wholeOrder))return A.formError(form,'订单可退数量已变化，请重新选择');
   if(!draft.full&&draft.type==='退货退款'&&wholeOrder)return A.formError(form,'已选择整单商品，请返回订单使用「整单退货」');
   const id='AS'+Date.now();
   const items=lines.map(({index,item,qty,amount})=>({...item,lineIndex:index,qty,amount}));
   const amount=Math.round(items.reduce((sum,item)=>sum+item.amount,0)*100)/100;
   S.refunds.unshift({id,order:order.id,pid:items[0].pid,lines:items,qty:items.reduce((sum,item)=>sum+item.qty,0),amount,type:draft.type,scope:draft.full?'full':'partial',reason:values.reason,description:String(values.description||'').trim(),stage:'申请中'});
   S.refundDraft=null;
   A.clearFormDraft();
   A.go('U20',{id},true);
   A.toast('售后申请已提交（演示）');
  });
  return;
 }
 if(type==='return-logistics'){if(values.carrier==='请选择')return A.formError(form,'请选择物流公司');if(!/^[a-zA-Z0-9-]{6,40}$/.test(values.tracking))return A.formError(form,'请填写 6–40 位有效物流单号');await A.busy(form,()=>{const r=A.currentRefund();r.carrier=values.carrier;r.tracking=values.tracking;r.stage='待处理';A.clearFormDraft();A.go('U20',{id:r.id},true);A.toast('退货物流已保存')});}
};H['experience-login']=()=>{A.closeSheet(true);A.clearFormDraft();A.login()};
A.formDrafts={};A.captureFormDraft=()=>{if(A.skipCaptureOnce){A.skipCaptureOnce=false;return;}const form=$('#app-content form');if(!form)return;const data={};for(const el of form.elements){if(!el.name||el.type==='file')continue;data[el.name]=el.type==='checkbox'||el.type==='radio'?{value:el.value,checked:el.checked}:el.value;}A.formDrafts[A.lastURL]=data;};A.clearFormDraft=()=>{delete A.formDrafts[A.lastURL];A.skipCaptureOnce=true};
})();
