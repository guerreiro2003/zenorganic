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
function observeReveal() {
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => revealObserver.observe(el));
}
observeReveal();

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
  const to      = "geral@zenorganic.pt"; // ← email real do salão
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

// ── GALERIA DINÂMICA (localStorage zen_gallery) ──
function renderGallery() {
  const grid  = document.getElementById("galleryGrid");
  const empty = document.getElementById("galleryEmpty");
  if (!grid) return;

  let photos = [];
  try {
    const stored = localStorage.getItem("zen_gallery");
    photos = stored ? JSON.parse(stored) : [];
  } catch(e) { photos = []; }

  if (!photos.length) {
    grid.style.display  = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  grid.style.display  = "";
  if (empty) empty.style.display = "none";

  // Distribuir em classes para layout masonry (tall/wide para primeiras fotos)
  const layoutClasses = ["gallery__item--tall", "", "", "", "gallery__item--wide"];
  grid.innerHTML = photos.map((p, i) => {
    const extra = i < layoutClasses.length ? layoutClasses[i] : "";
    const delay = (i * 0.06).toFixed(2);
    return `<div class="gallery__item ${extra} reveal" style="--d:${delay}s">
      <img src="${p.url}" alt="${p.caption || 'Trabalho ' + (i+1)}" loading="lazy" />
    </div>`;
  }).join("");

  observeReveal();
}

// ── EQUIPA DINÂMICA (localStorage zen_team) ──
function renderTeam() {
  const grid  = document.getElementById("teamGrid");
  const empty = document.getElementById("teamEmpty");
  if (!grid) return;

  let team = [];
  try {
    const stored = localStorage.getItem("zen_team");
    team = stored ? JSON.parse(stored) : [];
  } catch(e) { team = []; }

  if (!team.length) {
    grid.style.display  = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  grid.style.display  = "";
  if (empty) empty.style.display = "none";

  grid.innerHTML = team.map((m, i) => {
    const initial = (m.name || "?").charAt(0).toUpperCase();
    const delay   = (i * 0.07).toFixed(2);
    return `<div class="team-card reveal" style="--d:${delay}s">
      <div class="team-avatar">${m.photo ? `<img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" />` : initial}</div>
      <div class="team-name">${m.name || ""}</div>
      <div class="team-role">${m.role || "Colaborador/a"}</div>
      ${m.bio ? `<div class="team-bio">${m.bio}</div>` : ""}
    </div>`;
  }).join("");

  observeReveal();
}

// ── ANÚNCIOS DINÂMICOS (localStorage zen_announcements) ──
function renderAnnouncements() {
  const grid = document.getElementById("promos-grid");
  if (!grid) return;

  let items = [];
  try {
    const stored = localStorage.getItem("zen_announcements");
    items = stored ? JSON.parse(stored).filter(a => a.active) : [];
  } catch(e) { items = []; }

  if (!items.length) return; // manter os cards estáticos por defeito

  // Adicionar cards de anúncios dinâmicos após os estáticos
  items.forEach((a, i) => {
    const card = document.createElement("article");
    card.className = "promo-card reveal";
    card.style.cssText = `--d:${0.04 + i * 0.08}s`;
    card.innerHTML = `
      ${a.type ? `<div class="promo-tag promo-tag--subtle">${a.type}</div>` : ""}
      <h3>${a.title || ""}</h3>
      <p>${a.description || ""}</p>
      ${a.linkUrl ? `<a class="promo-link" href="${a.linkUrl}" target="_blank" rel="noopener">${a.linkText || "Saber mais"} →</a>` : ""}
    `;
    grid.appendChild(card);
  });
  observeReveal();
}

// ── PREÇOS DINÂMICOS (localStorage) ──
function renderPrices() {
  const womanList = document.getElementById("prices-woman-list");
  const manList   = document.getElementById("prices-man-list");

  try {
    const storedW = localStorage.getItem("zen_prices_woman");
    const storedM = localStorage.getItem("zen_prices_man");
    if (storedW && womanList) {
      const items = JSON.parse(storedW);
      womanList.innerHTML = items.map(p => `<li><span>${p.name}</span><strong>${p.price}</strong></li>`).join("");
    }
    if (storedM && manList) {
      const items = JSON.parse(storedM);
      manList.innerHTML = items.map(p => `<li><span>${p.name}</span><strong>${p.price}</strong></li>`).join("");
    }
  } catch(e) {}
}

// ── HORÁRIOS DINÂMICOS (localStorage) ──
function renderHours() {
  const list = document.getElementById("hours-list");
  if (!list) return;
  try {
    const stored = localStorage.getItem("zen_schedule");
    if (!stored) return;
    const sched = JSON.parse(stored);
    const DAYS = [
      { key:"monday",    label:"Segunda" },
      { key:"tuesday",   label:"Terça" },
      { key:"wednesday", label:"Quarta" },
      { key:"thursday",  label:"Quinta" },
      { key:"friday",    label:"Sexta" },
      { key:"saturday",  label:"Sábado" },
      { key:"sunday",    label:"Domingo" },
    ];
    // Agrupar dias consecutivos com mesmo horário
    let html = "";
    const active = DAYS.filter(d => sched[d.key]);
    active.forEach(d => {
      const v = sched[d.key];
      html += `<li><span>${d.label}</span><strong>${v.closed ? "Fechado" : `${v.open} – ${v.close}`}</strong></li>`;
    });
    if (html) list.innerHTML = html;
  } catch(e) {}
}

// ── PARCERIAS DINÂMICAS (localStorage zen_partners) ──
function renderPartners() {
  const grid  = document.getElementById('partnersGrid');
  const empty = document.getElementById('partnersEmpty');
  if (!grid) return;

  let partners = [];
  try {
    const stored = localStorage.getItem('zen_partners');
    partners = stored ? JSON.parse(stored) : [];
  } catch(e) { partners = []; }

  if (!partners.length) {
    grid.style.display  = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }
  grid.style.display  = '';
  if (empty) empty.style.display = 'none';

  grid.innerHTML = partners.map((p, i) => `
    <div class="partner-card reveal" style="--d:${(i * 0.07).toFixed(2)}s">
      <div class="partner-icon">${p.icon || '🤝'}</div>
      <div class="partner-name">${p.name || ''}</div>
      ${p.desc ? `<div class="partner-desc">${p.desc}</div>` : ''}
    </div>`).join('');

  observeReveal();
}

// ── INICIALIZAR ──
renderGallery();
renderTeam();
renderPartners();
renderAnnouncements();
renderPrices();
renderHours();

// ── POPUP ZEN CLUB ──
(function() {
  const POPUP_KEY   = "zen_popup_dismissed";
  const POPUP_DELAY = 4000;
  const overlay = document.getElementById("popupOverlay");
  if (!overlay) return;

  let lastFocus = null;

  function openPopup() {
    lastFocus = document.activeElement;
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    // Focus first interactive element for a11y
    const firstBtn = overlay.querySelector("a.btn, button");
    if (firstBtn) firstBtn.focus();
  }

  function closePopup() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    sessionStorage.setItem(POPUP_KEY, "1");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  window.closePopup = closePopup;

  // Click on overlay or any [data-popup-close] closes
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay || e.target.closest("[data-popup-close]")) {
      closePopup();
    }
  });

  // Escape closes
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("show")) closePopup();
  });

  if (!sessionStorage.getItem(POPUP_KEY)) {
    setTimeout(openPopup, POPUP_DELAY);
  }
})();
