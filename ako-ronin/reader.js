
(function(){
  'use strict';
  const root=document.documentElement;
  const $=id=>document.getElementById(id);
  const storage={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  const modeKey='ako-reading-night',sizeKey='ako-reading-font-size',positionKey='ako-reading-position:'+location.pathname.split('/').pop().replace(/\.html$/,'');
  let night=storage.get(modeKey)==='1'||(storage.get(modeKey)===null&&storage.get('ako-night')==='true');
  let size=Number(storage.get(sizeKey));if(!Number.isFinite(size)||size<14||size>26||size%2!==0)size=18;
  let ruby=storage.get('ako-reading-ruby')!=='0';
  const savedPosition=Number(storage.get(positionKey));
  const panel=$('reader-panel'),open=$('reader-open'),close=$('reader-close');
  function setPanel(visible){panel.hidden=!visible;open.setAttribute('aria-expanded',String(visible));if(visible)$('reader-close').focus();else open.focus()}
  open.addEventListener('click',()=>setPanel(panel.hidden));close.addEventListener('click',()=>setPanel(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setPanel(false)});
  document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!open.contains(e.target)){panel.hidden=true;open.setAttribute('aria-expanded','false')}});
  function apply(){document.body.classList.toggle('hide-ruby',!ruby);$('ruby-toggle').textContent=ruby?'ルビ：オン':'ルビ：オフ';$('ruby-toggle').setAttribute('aria-pressed',String(ruby));root.dataset.theme=night?'night':'paper';root.style.setProperty('--reader-font-size',size+'px');$('night-toggle').textContent=night?'通常表示':'夜表示';$('night-toggle').setAttribute('aria-pressed',String(night));$('font-current').textContent=size+'px';$('font-minus').disabled=size<=14;$('font-plus').disabled=size>=26}
  $('ruby-toggle').addEventListener('click',()=>{ruby=!ruby;storage.set('ako-reading-ruby',ruby?'1':'0');apply();requestAnimationFrame(()=>update(false))});
  $('night-toggle').addEventListener('click',()=>{night=!night;storage.set(modeKey,night?'1':'0');apply()});
  function adjust(delta){size=Math.max(14,Math.min(26,size+delta));storage.set(sizeKey,String(size));apply();requestAnimationFrame(()=>update(false))}
  $('font-minus').addEventListener('click',()=>adjust(-2));$('font-plus').addEventListener('click',()=>adjust(2));apply();
  const progress=$('reading-progress-fill');let pending=false;
  function update(save=false){const total=Math.max(0,document.documentElement.scrollHeight-innerHeight);progress.style.width=(total?Math.min(100,100*scrollY/total):100)+'%';$('reading-percent').textContent=Math.round(total?Math.min(100,100*scrollY/total):100)+'%';if(save)storage.set(positionKey,String(Math.round(scrollY)));pending=false}
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(()=>update(true))}},{passive:true});addEventListener('resize',()=>update(false));addEventListener('load',()=>update(false));
  $('resume-reading').addEventListener('click',()=>{const saved=savedPosition;setPanel(false);if(Number.isFinite(saved)&&saved>0)scrollTo({top:Math.min(saved,document.documentElement.scrollHeight-innerHeight),behavior:'smooth'})});

  update();
})();
