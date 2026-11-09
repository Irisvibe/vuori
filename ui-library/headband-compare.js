/* Hair accessories only. Product details are separate from the apparel fabric guide. */
(function () {
  const fabrics = [
    {id:'form', name:'BlissBlend Form™', photo:'fabric-blissblend-form.png.webp?v=20261029-images-all',
      feel:'奶油般柔软，轻盈有弹性',
      function:'吸湿排汗，内侧隐藏式凝胶防滑条帮助发带贴合固定。',
      use:'轻度训练、工作室课程、全天舒适佩戴'},
    {id:'dream', name:'DreamKnit™', photo:'fabric-dreamknit.png.webp?v=20261029-images-all',
      feel:'超柔软，四向弹力，佩戴几乎无感',
      function:'吸湿排汗，长时间佩戴依然顺滑舒适。',
      use:'日常佩戴、通勤、轻度锻炼、球场运动或工作室课程'},
    {id:'interlock', name:'BreatheInterlock™', photo:'fabric-breatheinterlock.png.webp?v=20261029-images-all',
      feel:'顺滑，富有支撑感的弹力针织',
      function:'吸湿排汗，凝胶防滑条帮助发带稳固贴合。',
      use:'训练、跑步、高强度工作室课程'},
    {id:'stretch', name:'性能弹力针织',
      feel:'轻便透气',
      function:'吸湿排汗、快干，佩戴稳固舒适。',
      use:'户外锻炼、日照充足时的活动、交叉训练'}
  ];
  const dimensions = [
    {key:'feel', label:'手感', path:'M3 7c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M3 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M3 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2'},
    {key:'function', label:'功能', path:'M12 3c1.5 2.7 5.5 6.5 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 9.5 10.5 5.7 12 3Z M9 14a3 3 0 0 0 2 2.6'},
    {key:'use', label:'适用场景', path:'M3 19 9.6 8l3.2 5.2 2.5-3.6L21 19H3Z M18 5.5h.01'}
  ];
  const icons = {
    down:'m6 9 6 6 6-6',
    swatch:'M5 5h14v14H5z M5 9l4-4m-4 9 9-9M5 19 19 5m-9 14 9-9m-4 9 4-4'
  };
  const icon = (path, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
  const esc = x => String(x).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const find = id => fabrics.find(f => f.id === id);
  const nameHTML = fabric => esc(fabric.name).replace(/(\S+)™$/, '<span class="vui-hb-word">$1<sup>™</sup></span>');
  const media = (fabric, base) => fabric.photo
    ? `<img src="${esc(base + fabric.photo)}" alt="" decoding="async">`
    : `<span class="vui-hb-placeholder">${icon(icons.swatch)}<span>面料图待补充</span></span>`;

  let instance = 0;
  function render({assetBase='assets/', pair=['form','dream']}={}) {
    if (pair.length !== 2 || pair[0] === pair[1] || !pair.every(find)) pair = ['form','dream'];
    const id = 'headband-compare-' + ++instance;
    const selected = pair.map(find);
    return `<section class="vui-headband-compare" data-headband-compare data-asset-base="${esc(assetBase)}" aria-labelledby="${id}-title">
      <div class="vui-hb-intro">
        <div class="vui-hb-title-row"><h2 id="${id}-title">发带面料对比</h2><span>${fabrics.length} 种面料</span></div>
        <p>点击面料名称，切换任意两种面料对比。</p>
      </div>
      <table class="vui-hb-table" aria-labelledby="${id}-title">
        <thead><tr>${selected.map((fabric, slot) => `<th scope="col" id="${id}-col-${slot}">
          <div class="vui-hb-media" data-hb-media="${slot}">${media(fabric, assetBase)}</div>
          <label class="vui-hb-picker">
            <span data-hb-name="${slot}" aria-hidden="true">${nameHTML(fabric)}</span>
            ${icon(icons.down)}
            <select data-hb-slot="${slot}" aria-label="${slot === 0 ? '左侧' : '右侧'}对比面料">${fabrics.map(f => `<option value="${f.id}"${f.id === fabric.id ? ' selected' : ''}${f.id === pair[1-slot] ? ' disabled' : ''}>${f.name}</option>`).join('')}</select>
          </label>
        </th>`).join('')}</tr></thead>
        <tbody>${dimensions.map(({key,label,path}) => `<tr><th colspan="2" id="${id}-${key}" class="vui-hb-dimension"><span>${icon(path)}${label}</span></th></tr>
          <tr class="vui-hb-values">${selected.map((fabric,slot) => `<td headers="${id}-${key} ${id}-col-${slot}" data-hb-value="${key}-${slot}">${fabric[key]}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
      <p class="vui-hb-note">具体面料与功能以商品详情为准。</p>
      <span class="vui-hb-sr" role="status"></span>
    </section>`;
  }

  document.addEventListener('change', event => {
    const select = event.target.closest?.('[data-hb-slot]');
    const root = select?.closest('[data-headband-compare]');
    if (!root) return;
    const slot = Number(select.dataset.hbSlot);
    const other = root.querySelector(`[data-hb-slot="${1-slot}"]`);
    const fabric = find(select.value);
    if (!fabric || other.value === fabric.id) {
      select.value = select.querySelector('[selected]').value;
      return;
    }
    for (const option of select.options) option.toggleAttribute('selected', option.value === fabric.id);
    for (const option of other.options) option.disabled = option.value === fabric.id;
    root.querySelector(`[data-hb-name="${slot}"]`).innerHTML = nameHTML(fabric);
    root.querySelector(`[data-hb-media="${slot}"]`).innerHTML = media(fabric, root.dataset.assetBase);
    for (const {key} of dimensions) root.querySelector(`[data-hb-value="${key}-${slot}"]`).textContent = fabric[key];
    root.querySelector('[role="status"]').textContent = `${slot === 0 ? '左侧' : '右侧'}已切换为 ${fabric.name}`;
    root.dispatchEvent(new CustomEvent('headband-pair-change', {
      bubbles: true, detail: [...root.querySelectorAll('[data-hb-slot]')].map(control => control.value)
    }));
  });

  window.VuoriHeadbandCompare = {render};
})();
