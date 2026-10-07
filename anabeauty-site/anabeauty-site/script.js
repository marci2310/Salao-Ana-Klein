const serviceCatalog = {
  cabelo: [
    { name: 'Escova', desc: 'Finalização com movimento e brilho', price: 75, time: 50 },
    { name: 'Corte & styling', desc: 'Corte personalizado + finalização', price: 150, time: 70 },
    { name: 'Mechas', desc: 'Iluminação sob medida para você', price: 420, time: 210 },
    { name: 'Coloração', desc: 'Cor, cobertura e tratamento', price: 260, time: 150 },
    { name: 'Tratamento', desc: 'Diagnóstico + ritual de recuperação', price: 145, time: 60 },
    { name: 'Penteado', desc: 'Produção especial para o seu evento', price: 220, time: 100 },
  ],
  unhas: [
    { name: 'Pé & mão', desc: 'Cuidado completo e acabamento impecável', price: 95, time: 80 },
    { name: 'Manicure', desc: 'Esmaltação clássica e cuticulagem', price: 45, time: 40 },
    { name: 'Alongamento', desc: 'Estrutura, comprimento e naturalidade', price: 190, time: 120 },
    { name: 'Spa dos pés', desc: 'Esfoliação, hidratação e relaxamento', price: 80, time: 45 },
  ],
  estetica: [
    { name: 'Limpeza de pele', desc: 'Pele renovada, limpa e luminosa', price: 180, time: 80 },
    { name: 'Design de sobrancelhas', desc: 'Desenho que valoriza seu olhar', price: 55, time: 35 },
    { name: 'Drenagem', desc: 'Leveza, bem-estar e cuidado corporal', price: 140, time: 60 },
    { name: 'Massagem relaxante', desc: 'Uma pausa para corpo e mente', price: 160, time: 60 },
  ],
  make: [
    { name: 'Make social', desc: 'Produção completa para ocasiões especiais', price: 220, time: 100 },
    { name: 'Make express', desc: 'Beleza fresca para o dia a dia', price: 140, time: 60 },
    { name: 'Cílios & sobrancelhas', desc: 'Olhar definido e natural', price: 110, time: 50 },
  ],
  noivas: [
    { name: 'Make & hair', desc: 'Produção completa para o grande dia', price: 680, time: 240 },
    { name: 'Dia da noiva', desc: 'Ritual completo com acompanhamento', price: 1200, time: 360 },
    { name: 'Penteado festa', desc: 'Estrutura e acabamento de longa duração', price: 280, time: 120 },
  ],
};
const allServices = Object.values(serviceCatalog).flat();
const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

function renderServices(category = 'cabelo') {
  const grid = document.querySelector('#services-grid');
  grid.innerHTML = serviceCatalog[category].map((service, index) => `
    <article class="service-card" style="--delay:${index * 60}ms">
      <h3>${service.name}</h3><strong>${money(service.price)}</strong>
      <p>${service.desc}</p><span class="service-card__time">aprox. ${service.time} min</span>
    </article>`).join('');
}
function renderCombo() {
  const options = allServices.slice(0, 10);
  document.querySelector('#combo-options').innerHTML = options.map((service, index) => `
    <label class="combo-option"><input type="checkbox" value="${service.name}" data-price="${service.price}" data-time="${service.time}" /><span>${service.name}<small>${money(service.price)} · ${service.time} min</small></span></label>`).join('');
  document.querySelector('#combo-options').addEventListener('change', updateCombo);
}
function updateCombo() {
  const selected = [...document.querySelectorAll('.combo-option input:checked')];
  const time = selected.reduce((total, item) => total + Number(item.dataset.time), 0);
  const price = selected.reduce((total, item) => total + Number(item.dataset.price), 0);
  document.querySelector('#selected-count').textContent = `${selected.length} selecionado${selected.length === 1 ? '' : 's'}`;
  document.querySelector('#combo-time').textContent = time ? `${Math.floor(time / 60)}h${time % 60 ? ` ${time % 60}min` : ''}` : '—';
  document.querySelector('#combo-price').textContent = price ? money(price) : 'R$ 0';
  document.querySelectorAll('.combo-option').forEach((label) => label.classList.toggle('is-selected', label.querySelector('input').checked));
  updateWhatsappLinks();
}

function setupComboFlow() {
  const cta = document.querySelector('#combo-cta');
  if (!cta) return;
  cta.addEventListener('click', (event) => {
    if (!document.querySelector('.combo-option input:checked')) { event.preventDefault(); document.querySelector('#combo-options').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });
}

/* Mensagem automática no WhatsApp: nada é guardado, o texto vai só no link. */
const unitNames = { '5581991220930': 'Shopping RioMar', '558195071572': 'Shopping Recife', '558196941964': 'Shopping Plaza' };
function updateWhatsappLinks() {
  const services = [...document.querySelectorAll('.combo-option input:checked')].map((input) => input.value);
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    if (!link.dataset.waOriginal) link.dataset.waOriginal = link.getAttribute('href');
    const number = (link.dataset.waOriginal.match(/wa\.me\/(\d+)/) || [])[1];
    if (!services.length || !number) { link.setAttribute('href', link.dataset.waOriginal); return; }
    const unit = unitNames[number];
    const text = `Olá, Ana Klein Beauty! Gostaria de saber mais sobre: ${services.join(' + ')}.${unit ? ` Tenho interesse na unidade ${unit}.` : ''}`;
    link.setAttribute('href', `https://wa.me/${number}?text=${encodeURIComponent(text)}`);
  });
}

function setupTabs() {
  document.querySelectorAll('.service-tab').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('.service-tab').forEach((item) => { item.classList.remove('is-active'); item.setAttribute('aria-selected', 'false'); });
    tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true'); renderServices(tab.dataset.category);
  }));
}
function setupGallery() {
  const groups = [
    [
      { src: 'images/espaco.webp', caption: 'O espaço · Ana Klein Beauty' },
      { src: 'images/espaco-recepcao.webp', caption: 'Recepção' },
      { src: 'images/espaco-atendimento.webp', caption: 'Área de atendimento e lavatórios' },
      { src: 'images/espaco-espera.webp', caption: 'Recepção e sala de espera' },
    ],
    [{ src: 'images/cabelos.webp', caption: 'Cabelos · balayage e ondas polidas' }],
    [{ src: 'images/unhas.webp', caption: 'Unhas · manicure nude rose gold' }],
  ];
  const modal = document.querySelector('#gallery-modal');
  const image = document.querySelector('#modal-image');
  const caption = document.querySelector('#modal-caption');
  const prev = document.querySelector('.modal-nav--prev');
  const next = document.querySelector('.modal-nav--next');
  let group = []; let index = 0; let touchStart = null;
  const show = () => {
    const item = group[index];
    image.src = item.src; image.alt = item.caption;
    caption.textContent = group.length > 1 ? `${item.caption} · ${index + 1}/${group.length}` : item.caption;
    prev.hidden = next.hidden = group.length < 2;
  };
  const step = (direction) => { index = (index + direction + group.length) % group.length; show(); };
  const close = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); };
  document.querySelectorAll('[data-gallery]').forEach((card) => card.addEventListener('click', () => {
    group = groups[Number(card.dataset.gallery)]; index = 0; show();
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
  }));
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  document.querySelector('.modal-close').addEventListener('click', close);
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  modal.addEventListener('touchstart', (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', (event) => { if (touchStart === null || group.length < 2) return; const dx = event.changedTouches[0].clientX - touchStart; touchStart = null; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); });
  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (group.length > 1 && event.key === 'ArrowRight') step(1);
    if (group.length > 1 && event.key === 'ArrowLeft') step(-1);
  });
}
function setupNavigation() {
  const header = document.querySelector('.site-header'); const toggle = document.querySelector('.menu-toggle'); const nav = document.querySelector('.main-nav');
  let scrolled = false;
  window.addEventListener('scroll', () => { const next = window.scrollY > 30; if (next !== scrolled) { scrolled = next; header.classList.toggle('is-scrolled', next); } }, { passive: true });
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }));
}
function setupMap() {
  const facade = document.querySelector('#map-facade');
  if (!facade) return;
  facade.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.title = 'Mapa das unidades Ana Klein Beauty em Recife';
    frame.src = facade.dataset.src;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    facade.replaceWith(frame);
  }, { once: true });
}
renderServices(); renderCombo(); setupComboFlow(); setupTabs(); setupGallery(); setupNavigation(); setupMap();
