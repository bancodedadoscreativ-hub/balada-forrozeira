/* V19: conteúdo desacoplado. A V18 permanece como fallback ao abrir offline. */
(async function(){
 let data; try {const r=await fetch('conteudo.json',{cache:'no-store'});if(!r.ok)throw Error(r.status);data=await r.json()}catch(e){console.info('Conteúdo padrão da V18 em uso (abra por servidor para ler conteudo.json).');return}
 const setText=(el,v)=>{if(el&&typeof v==='string')el.textContent=v};
 const bio=data.biografia||{},intro=document.querySelectorAll('#biografia .bio-copy p');
 (bio.introducao||[]).forEach((t,i)=>setText(intro[i],t));
 setText(document.querySelector('.bio-history-v18 p'),bio.trajetoria);
 (bio.recomeco||[]).forEach((t,i)=>{const ps=document.querySelectorAll('.bio-newchapter-v18 p');setText(ps[i],t)});
 const links=data.links||{};
 const replacements=[['instagram','instagram.com'],['tiktok','tiktok.com'],['youtube','youtube.com'],['suamusica','suamusica.com.br'],['whatsapp','wa.me/'],['presskit','drive.google.com']];
 document.querySelectorAll('a[href]').forEach(a=>{const old=a.getAttribute('href')||'';for(const [k,domain] of replacements){if(links[k]&&old.includes(domain)){a.href=links[k];break}}});
 const m=data.midia||{};
 const replaceImg=(selector,src)=>{const el=document.querySelector(selector);if(el&&src)el.src=src};
 replaceImg('.hero-person',m.foto_abertura);replaceImg('#biografia .bio-visual img',m.foto_biografia);replaceImg('.press-photo img',m.foto_presskit);
 const video=document.querySelector('.bio-motion-bg video source');if(video&&m.video_fundo&&video.src!==m.video_fundo){video.src=m.video_fundo;video.parentElement.load();video.parentElement.play().catch(()=>{})}
 const preview=document.querySelector('#youtube-preview source');if(preview&&m.video_youtube){preview.src=m.video_youtube;preview.parentElement.load();preview.parentElement.play().catch(()=>{})}
 const audio=document.getElementById('site-music');if(audio&&m.musica)audio.src=m.musica;
 const gallery=document.querySelector('.gallery-grid');if(gallery&&Array.isArray(m.galeria)){gallery.replaceChildren();m.galeria.forEach((src,i)=>{if(!src)return;const img=document.createElement('img');img.src=src;img.alt='Balada Forrozeira no palco '+(i+1);img.loading='lazy';gallery.append(img)})}
 const shows=document.getElementById('shows-list'),empty=document.getElementById('shows-empty');
 if(shows&&empty&&Array.isArray(data.agenda)){
  shows.replaceChildren();const valid=data.agenda.filter(x=>x&&/^\d{4}-\d{2}-\d{2}$/.test(x.data||'')&&String(x.cidade||'').trim()).sort((a,b)=>a.data.localeCompare(b.data));
  empty.hidden=valid.length>0;
  const meses=['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  valid.forEach(x=>{const [ano,mes,dia]=x.data.split('-').map(Number);if(mes<1||mes>12||dia<1||dia>31)return;const card=document.createElement('div');card.className='show';const date=document.createElement('div');date.className='show-date';const strong=document.createElement('strong');strong.textContent=String(dia).padStart(2,'0');const small=document.createElement('small');small.textContent=meses[mes-1];date.append(strong,small);const info=document.createElement('div');const title=document.createElement('h3');title.textContent=x.evento||'Balada Forrozeira ao vivo';const local=document.createElement('p');local.textContent=x.local||'Apresentação confirmada';info.append(title,local);const city=document.createElement('div');city.className='show-city';city.textContent=x.cidade+(x.estado?' · '+x.estado:'');const status=document.createElement('span');status.className='status';status.textContent='Confirmado';card.append(date,info,city,status);shows.append(card)});
 }
 const grid=document.getElementById('music-cards');if(grid&&Array.isArray(data.plataformas)){
  grid.replaceChildren();data.plataformas.filter(x=>x.ativo&&/^https:\/\//.test(x.url||'')).forEach(x=>{const a=document.createElement('a');a.className='album';a.href=x.url;a.target='_blank';a.rel='noopener noreferrer';const art=document.createElement('div');art.className='album-art';if(x.imagem){const img=document.createElement('img');img.src=x.imagem;img.alt=x.nome;art.append(img)}const body=document.createElement('div');body.className='album-body';const h=document.createElement('h3');h.textContent=x.nome||'Lançamento';const p=document.createElement('p');p.textContent=x.descricao||'';const link=document.createElement('strong');link.textContent=(x.chamada||'Ouvir agora')+' ↗';body.append(h,p,link);a.append(art,body);grid.append(a)})
 }
})();