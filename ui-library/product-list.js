(function () {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const image = (src, alt = '', loading = 'lazy') =>
    `<img src="${esc(src)}" alt="${esc(alt)}" loading="${loading}">`;

  function toolbar({ sorts, assetBase = '', filterAttrs = '' }) {
    return `<div class="plp-sortbar" aria-label="排序和筛选">
      ${sorts.map(({ label, pressed, attrs, ariaLabel, icon }) => `<button ${attrs} aria-pressed="${!!pressed}"${ariaLabel ? ` aria-label="${esc(ariaLabel)}"` : ''}>${esc(label)}${icon ? image(assetBase + icon, '', 'eager') : ''}</button>`).join('')}
      <button ${filterAttrs} class="plp-open-filter">筛选${image(assetBase + 'plp2065/filter.svg', '', 'eager')}</button>
    </div>`;
  }

  function tabs({ label, items }) {
    return `<div class="plp-tabs" role="group" aria-label="${esc(label)}">${items.map(item =>
      `<button ${item.attrs} aria-pressed="${!!item.pressed}">${esc(item.label)}</button>`).join('')}</div>`;
  }

  function categoryRail({ items, label = '横滑浏览推荐分类' }) {
    return `<div class="plp-category-rail" aria-label="${esc(label)}">${items.map(item => {
      const photo = image(item.src);
      const crop = item.crop?.map(Number);
      return `<button ${item.attrs} class="plp-category-tile"><span class="plp-category-photo">${crop
        ? `<span class="plp-category-crop" style="left:${crop[0]}px;top:${crop[1]}px;width:${crop[2]}px;height:${crop[3]}px">${photo}</span>`
        : photo}</span><span>${esc(item.label)}</span></button>`;
    }).join('')}</div>`;
  }

  function editorial({ src, alt, title, description, action }) {
    return `<article class="plp-editorial">${image(src, alt)}<h2>${esc(title)}</h2><p>${esc(description)}</p>${action}</article>`;
  }

  function card({ id, name, tone, src, fabric, price, previousPrice, label, exclusive, open = '', quickAdd, swatches = '' }) {
    return `<article class="plp-product" data-pid="${esc(id)}">
      <div class="plp-product-photo">
        <button ${open} class="plp-product-link" aria-label="查看${esc(name)}">${image(src, name)}</button>
        ${label ? `<span class="plp-card-label">${esc(label)}</span>` : ''}
        ${quickAdd ? `<button class="plp-card-add" type="button" ${quickAdd.attrs} aria-label="快速加购 ${esc(name)}" ${quickAdd.disabled ? 'disabled' : ''}>${image(quickAdd.icon, '', 'eager')}</button>` : ''}
      </div>
      ${swatches}
      <button class="plp-product-name" ${open}>${fabric ? `<span>${esc(fabric)}</span>` : ''}${esc(name)}</button>
      ${tone ? `<p class="plp-product-tone">${esc(tone)}</p>` : ''}
      <p class="plp-product-price">${window.VuoriProductPrice.render(price,previousPrice)}</p>
      ${exclusive ? '<p class="plp-product-exclusive">线上专享</p>' : ''}
    </article>`;
  }

  function filterGroup({ key, label, options, open = false }) {
    const colors = key === 'color';
    return `<details class="plp-filter-group"${open ? ' open' : ''}>
      <summary><span>${esc(label)}</span><span class="plp-filter-indicator" aria-hidden="true"></span></summary>
      <div class="plp-filter-options ${colors ? 'plp-filter-colors' : ''}">
        ${options.length ? options.map(item => `<button class="${colors ? 'plp-filter-color' : 'plp-filter-chip'}" ${item.attrs} aria-pressed="${!!item.pressed}">
          ${colors ? `<i style="--filter-tone:${esc(item.tone || 'transparent')}" aria-hidden="true"></i>` : ''}<span>${esc(item.label)}</span>
        </button>`).join('') : `<p class="plp-filter-empty">暂无${esc(label)}选项</p>`}
      </div>
    </details>`;
  }

  function filterContent({ groups, stock, resetAttrs = '', applyAttrs = '', result }) {
    return `<div class="plp-filter">
      <div class="plp-filter-scroll">
        ${groups.map(filterGroup).join('')}
        <button class="plp-stock-switch" role="switch" aria-checked="${!!stock.checked}" ${stock.attrs}><span>仅看有货</span><i aria-hidden="true"></i></button>
      </div>
      <div class="plp-filter-footer">
        <button class="plp-filter-reset" ${resetAttrs}>全部清空</button>
        <button class="plp-filter-apply" aria-live="polite" ${applyAttrs}>${esc(result)}</button>
      </div>
    </div>`;
  }

  window.VuoriProductList = { toolbar, tabs, categoryRail, editorial, card, filterContent };
})();
