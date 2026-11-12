(function(){
 const escape=value=>String(value).replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
 })[char]);
 const format=new Intl.NumberFormat('en-US');
 function amount(value){
  if(typeof value==='number')return Number.isFinite(value)&&value>=0?value:null;
  if(typeof value!=='string')return null;
  const normalized=value.trim().replace(/^[¥￥]\s*/,'').replaceAll(',','');
  return /^\d+(?:\.\d+)?$/.test(normalized)?Number(normalized):null;
 }
 function render(price,compareAtPrice){
  const current=amount(price),original=amount(compareAtPrice);
  const discounted=current!==null&&original!==null&&original>current;
  const label=current===null?String(price??'').trim()||'价格暂不可用':'¥'+format.format(current);
  return `<span class="vui-product-price${discounted?' is-discounted':''}"><span class="vui-price-current">${escape(label)}</span>${discounted?`<s class="vui-price-original" aria-label="原价 ¥${format.format(original)}">¥${format.format(original)}</s>`:''}</span>`;
 }
 window.VuoriProductPrice={render};
})();
