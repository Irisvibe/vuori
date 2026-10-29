/* Retry a same-site asset once after a transient image download failure. */
(function(){
 const retried=new Set();
 document.addEventListener('error',event=>{
  const img=event.target;if(!(img instanceof HTMLImageElement))return;
  let url;try{url=new URL(img.currentSrc||img.src,location.href)}catch{return}
  if(url.origin!==location.origin||!url.pathname.includes('/assets/')||url.searchParams.has('image-retry')||retried.has(url.href))return;
  retried.add(url.href);const original=img.getAttribute('src');
  setTimeout(()=>{if(!img.isConnected||img.getAttribute('src')!==original||img.naturalWidth)return;url.searchParams.set('image-retry','1');img.src=url.href},1200);
 },true);
})();
