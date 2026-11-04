/* Bundle SKU selections are isolated from PDP/individual quick-buy selections. */
(function(){
const A=window.VuoriApp,S=A.state,H=A.actions,e=A.esc;
let draft=null;
const available=(p,row,size)=>!p.retired&&p.price!=null&&A.skuStock(p,row.color,size)>0;
function draw(focus){
 const dialog=document.querySelector('#ux-sheet'),scroll=dialog.querySelector('.ob-items')?.scrollTop||0;
 const selected=draft.rows.filter(x=>x.selected),ready=selected.length&&selected.every(r=>r.size&&available(A.product(r.pid),r,r.size));
 A.openSheet('搭配一键加购',`<div class="ob-panel" data-component="outfit-bundle"><p class="ob-intro">当前图片中的 ${draft.rows.length} 件单品，分别选择尺码</p><div class="ob-items">${draft.rows.map((r,i)=>{const p=A.product(r.pid);return `<article class="ob-item ${r.selected?'':'ob-unselected'}"><div class="ob-summary"><button class="ob-check" ${A.attr('ob-toggle',{index:i})} aria-pressed="${r.selected}" aria-label="${r.selected?'不选':'选中'}${e(p.cn)}">${r.selected?'✓':''}</button><img src="assets/${e(p.image)}" alt="${e(p.cn)}"><div><h3>${e(p.cn)}</h3><p>${e(p.colors[r.color][0])}</p><strong>${A.money(p.price)}</strong><small>数量 1</small></div></div><div class="ob-options"><div class="ob-colors" aria-label="${e(p.cn)}颜色">${p.colors.map(([name,tone],color)=>`<button style="--tone:${tone}" ${A.attr('ob-color',{index:i,color})} aria-label="${e(name)}" aria-pressed="${r.color===color}" ${r.selected?'':'disabled'}><i></i></button>`).join('')}</div><div class="ob-size-heading"><span>尺码${r.size?' · '+e(r.size):''}</span><button ${A.attr('ob-guide',{index:i})}>尺码指南</button></div><div class="ob-sizes" aria-label="${e(p.cn)}尺码">${p.sizes.map(size=>`<button ${A.attr('ob-size',{index:i,size})} aria-pressed="${r.size===size}" ${r.selected&&available(p,r,size)?'':'disabled'}>${e(size)}</button>`).join('')}</div></div></article>`}).join('')}</div><div class="ob-footer"><p class="ob-error" role="status" aria-live="polite">${e(draft.error||(!selected.length?'请至少选择一件单品':!ready?'请为每件选中单品选择尺码':''))}</p><div class="ob-total"><span>已选 ${selected.length} 件</span><strong>合计 ${A.money(selected.reduce((sum,r)=>sum+(A.product(r.pid).price||0),0))}</strong></div><button class="ob-submit" ${A.attr('ob-submit')} ${ready?'':'disabled'}>确认加购（${selected.length}）</button></div></div>`);
 dialog.querySelector('.ob-items').scrollTop=scroll;
 if(focus)dialog.querySelector(focus)?.focus({preventScroll:true});
}
H['outfit-bundle']=()=>{draft={rows:[...new Set(A.currentOutfitIds())].map(pid=>({pid,color:S.cardColors[pid]||0,size:'',selected:true})),error:''};draw()};
H['ob-toggle']=d=>{const r=draft?.rows[Number(d.index)];if(!r)return;r.selected=!r.selected;draft.error='';draw(`[data-ux="ob-toggle"][data-index="${d.index}"]`)};
H['ob-color']=d=>{const r=draft?.rows[Number(d.index)];if(!r)return;r.color=Number(d.color);if(r.size&&!available(A.product(r.pid),r,r.size))r.size='';draft.error='';draw(`[data-ux="ob-color"][data-index="${d.index}"][data-color="${d.color}"]`)};
H['ob-size']=d=>{const r=draft?.rows[Number(d.index)];if(!r||!available(A.product(r.pid),r,d.size))return;r.size=d.size;draft.error='';draw(`[data-ux="ob-size"][data-index="${d.index}"][data-size="${d.size}"]`)};
H['ob-guide']=d=>{const r=draft?.rows[Number(d.index)];if(r)H['pdp-guide']?H['pdp-guide']({pid:r.pid}):H['size-guide']()};
H['ob-submit']=()=>{
 if(!draft||draft.busy)return;
 const rows=draft.rows.filter(r=>r.selected);if(!rows.length)return;
 const next=structuredClone(S.bag);
 for(const r of rows){const p=A.product(r.pid);if(!r.size||!available(p,r,r.size)){draft.error='部分规格暂不可购，请重新选择尺码。';draw();return}
 const same=next.find(x=>x.pid===r.pid&&x.color===r.color&&x.size===r.size&&Object.keys(x.extra||{}).length===0);
 if((same?.qty||0)+1>A.skuStock(p,r.color,r.size)){draft.error=e(p.cn)+'的购物袋数量已达到库存上限，请调整规格。';draw();return}
 if(same)same.qty++;else next.push({pid:r.pid,color:r.color,size:r.size,qty:1,price:p.price,selected:true,extra:{}});
 }
 if(A.q('state')==='add-error'&&!draft.retried){draft.retried=true;draft.error='加购未完成，请重试。已保留所有选择。';draw();return}
 draft.busy=true;S.bag=next;A.save();A.track('outfit_bundle_add_success',{items:rows.map(r=>({pid:r.pid,size:r.size,color:r.color}))});const count=rows.length;A.closeSheet(true);A.render(false);A.toast(`已将 ${count} 件单品加入购物袋 · 本地演示`);draft=null;
};
})();
