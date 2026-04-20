// ── STORAGE HELPER ──
const DEFAULTS = {
  announcements: [],
  gallery: [],
  pricesWoman: [
    { name: 'Corte + Brushing', price: '35€' },
    { name: 'Brushing', price: '18€' },
    { name: 'Coloração (a partir de)', price: '45€' },
    { name: 'Madeixas (a partir de)', price: '70€' },
    { name: 'Tratamento (a partir de)', price: '25€' },
  ],
  pricesMan: [
    { name: 'Corte', price: '18€' },
    { name: 'Corte + Barba', price: '25€' },
    { name: 'Barba', price: '12€' },
    { name: 'Tratamento couro cabeludo', price: '20€' },
  ],
  schedule: [
    { day: 'Seg–Sex', open: '10:00', close: '19:00', closed: false },
    { day: 'Sábado',  open: '10:00', close: '18:00', closed: false },
    { day: 'Domingo', open: '',      close: '',       closed: true  },
  ],
  settings: {
    zappy: 'https://EXEMPLO-LINK-ZAPPY',
    email: 'email-do-salao@exemplo.com',
  }
};

function getData(key) {
  try {
    const v = localStorage.getItem('zen_' + key);
    return v ? JSON.parse(v) : DEFAULTS[key];
  } catch { return DEFAULTS[key] }
}

// ── ANNOUNCEMENTS BANNER ──
function renderAnnouncements() {
  const list = getData('announcements').filter(a => a.active);
  if (!list.length) return;

  const typeColors = {
    promo: { bg: 'rgba(107,124,90,.15)', color: '#4a6338', border: 'rgba(107,124,90,.25)' },
    aviso: { bg: 'rgba(143,110,82,.15)', color: '#6b4c2e', border: 'rgba(143,110,82,.25)' },
    info:  { bg: 'rgba(40,34,26,.06)',   color: '#4a4035', border: 'rgba(40,34,26,.12)' },
  };

  const wrapper = document.createElement('div');
  wrapper.id = 'announcements-bar';
  wrapper.style.cssText = 'position:relative;z-index:49;';

  list.forEach(a => {
    const c = typeColors[a.type] || typeColors.info;
    const bar = document.createElement('div');
    bar.style.cssText = `
      background:${c.bg}; border-bottom:1px solid ${c.border};
      color:${c.color}; padding:10px 20px;
      display:flex; align-items:center; justify-content:center; gap:12px;
      font-size:13.5px; font-weight:500; text-align:center; flex-wrap:wrap;
    `;
    bar.innerHTML = `
      <span>📢 <strong>${a.title}</strong> — ${a.text}</span>
      ${a.link && a.btnTxt ? `<a href="${a.link}" target="_blank" rel="noopener" style="background:${c.color};color:#f2ece1;border-radius:999px;padding:4px 14px;font-size:12px;font-weight:600;text-decoration:none">${a.btnTxt}</a>` : ''}
    `;
    wrapper.appendChild(bar);
  });

  document.body.insertAdjacentElement('afterbegin', wrapper);

  // Adjust sticky header top offset
  const header = document.getElementById('header');
  if (header) {
    const h = wrapper.offsetHeight;
    header.style.top = h + 'px';
  }
}

// ── GALLERY ──
function renderGallery() {
  const galleryEl = document.querySelector('.gallery');
  if (!galleryEl) return;

  // Read directly from localStorage — never fall back to hardcoded examples
  let photos = [];
  try {
    const stored = localStorage.getItem('zen_gallery');
    if (stored) photos = JSON.parse(stored);
  } catch(e) { photos = [] }

  if (!photos.length) {
    galleryEl.innerHTML = '<p style="color:var(--color-muted, #837468); text-align:center; padding:40px 0; grid-column:1/-1">Fotos em breve — volta a visitar-nos! 🌿</p>';
    return;
  }

  const items = photos.map((p, i) => {
    const isTall = i === 0;
    const isWide = i === photos.length - 1 && photos.length >= 5;
    return `<div class="gallery__item${isTall ? ' gallery__item--tall' : ''}${isWide ? ' gallery__item--wide' : ''} reveal" style="--d:${i * 0.06}s">
      <img src="${p.url}" alt="${p.alt}" loading="lazy" />
    </div>`;
  });

  galleryEl.innerHTML = items.join('');
  galleryEl.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ── PRICES ──
function renderPrices() {
  const woman = getData('pricesWoman');
  const man   = getData('pricesMan');

  const womanTbody = document.querySelector('#prices-woman-list');
  const manTbody   = document.querySelector('#prices-man-list');

  if (womanTbody) womanTbody.innerHTML = woman.map(p =>
    `<li><span>${p.name}</span><strong>${p.price}</strong></li>`
  ).join('');

  if (manTbody) manTbody.innerHTML = man.map(p =>
    `<li><span>${p.name}</span><strong>${p.price}</strong></li>`
  ).join('');
}

// ── SCHEDULE ──
function renderSchedule() {
  const schedule = getData('schedule');
  const el = document.querySelector('#hours-list');
  if (!el) return;
  el.innerHTML = schedule.map(s =>
    `<li><span>${s.day}</span><strong>${s.closed ? 'Fechado' : `${s.open} – ${s.close}`}</strong></li>`
  ).join('');
}

// ── ZAPPY LINKS ──
function updateZappyLinks() {
  const settings = getData('settings');
  const zappy = settings.zappy;
  if (!zappy || zappy.includes('EXEMPLO')) return;
  document.querySelectorAll('a[href*="EXEMPLO-LINK-ZAPPY"]').forEach(a => {
    a.href = zappy;
  });
}

// ── HEADER SCROLL ──
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

// ── MOBILE MENU ──
const burger    = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");
burger?.addEventListener("click", () => {
  const expanded = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", String(!expanded));
  burger.classList.toggle("open", !expanded);
  mobileNav.hidden = expanded;
});
mobileNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.classList.remove("open");
  });
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target) }
  }),
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ── FOOTER YEAR ──
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── CONTACT FORM ──
const form = document.getElementById("contactForm");
form?.addEventListener("submit", e => {
  e.preventDefault();
  const data    = new FormData(form);
  const name    = (data.get("name") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();
  const settings = getData('settings');
  const to      = settings.email || 'email-do-salao@exemplo.com';
  const subject = `Mensagem do site${name ? " — " + name : ""}`;
  const body    = `${message}\n\n— Enviado pelo site Zen Organic Hair Concept`;
  window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const id     = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = (header?.offsetHeight || 60) + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  });
});

// ── PROMOTIONS ──
function renderPromos() {
  const list = getData('announcements').filter(a => a.active && a.type === 'promo');
  const grid = document.getElementById('promos-grid');
  const empty = document.getElementById('promos-empty');
  if (!grid) return;

  // If no admin promos yet, keep the example HTML
  if (!list.length) return;

  empty.style.display = 'none';
  grid.innerHTML = list.map((a, i) => {
    const isFeatured = i === 0;
    if (isFeatured) {
      return `
        <article class="promo-card promo-card--featured reveal" style="--d:.04s">
          <div class="promo-card__inner">
            <div class="promo-tag">✦ Destaque</div>
            <h3>${a.title}</h3>
            <p>${a.text}</p>
            ${a.link ? `<a class="btn btn--primary" href="${a.link}" target="_blank" rel="noopener">
              ${a.btnTxt || 'Aproveitar oferta'}
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>` : ''}
          </div>
          <div class="promo-card__deco" aria-hidden="true">✿</div>
        </article>`;
    }
    return `
      <article class="promo-card reveal" style="--d:${i * 0.08}s">
        <div class="promo-tag promo-tag--subtle">Promoção</div>
        <h3>${a.title}</h3>
        <p>${a.text}</p>
        ${a.link ? `<a class="promo-link" href="${a.link}" target="_blank" rel="noopener">${a.btnTxt || 'Saber mais'} →</a>` : ''}
      </article>`;
  }).join('');

  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ── INIT DYNAMIC CONTENT ──
renderAnnouncements();
renderPromos();
renderGallery();
renderPrices();
renderSchedule();
updateZappyLinks();

// ── POPUP CONTA ──
(function() {
  const POPUP_KEY    = 'zen_popup_dismissed';
  const POPUP_DELAY  = 4000; // 4 segundos após abrir a página

  function openPopup() {
    const overlay = document.getElementById('accountPopupOverlay');
    const popup   = document.getElementById('accountPopup');
    if (!overlay) return;
    overlay.style.pointerEvents = 'auto';
    overlay.style.opacity       = '1';
    popup.style.transform       = 'translateY(0)';
  }

  window.closePopup = function(permanent) {
    const overlay = document.getElementById('accountPopupOverlay');
    const popup   = document.getElementById('accountPopup');
    if (!overlay) return;
    overlay.style.opacity       = '0';
    overlay.style.pointerEvents = 'none';
    popup.style.transform       = 'translateY(20px)';
    // Guardar que foi dispensado (não volta a aparecer nesta sessão)
    sessionStorage.setItem(POPUP_KEY, '1');
  };

  // Fechar ao clicar fora do popup
  document.getElementById('accountPopupOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closePopup();
  });

  // Fechar com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePopup();
  });

  // Mostrar popup após delay se ainda não foi dispensado nesta sessão
  if (!sessionStorage.getItem(POPUP_KEY)) {
    setTimeout(openPopup, POPUP_DELAY);
  }
})();
