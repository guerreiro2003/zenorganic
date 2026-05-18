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

// ── GALERIA (BookIt Firestore → site_gallery) ──
async function renderGallery() {
  const grid  = document.getElementById("galleryGrid");
  const empty = document.getElementById("galleryEmpty");
  if (!grid) return;

  let photos = await loadFromBookIt("site_gallery");
  if (photos === null) {
    // Fallback to localStorage (legacy)
    try {
      const stored = localStorage.getItem("zen_gallery");
      photos = stored ? JSON.parse(stored) : [];
    } catch(e) { photos = []; }
  }

  if (!photos.length) {
    grid.style.display  = "none";
    if (empty) empty.style.display = "block";
    return;
  }
  grid.style.display  = "";
  if (empty) empty.style.display = "none";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const layoutClasses = ["gallery__item--feature", "", "", "", "gallery__item--wide", "", "gallery__item--tall"];
  grid.innerHTML = photos.map((p, i) => {
    const extra = i < layoutClasses.length ? layoutClasses[i] : "";
    const delay = (i * 0.06).toFixed(2);
    return `<div class="gallery__item ${extra} reveal" style="--d:${delay}s">
      <img src="${esc(p.url)}" alt="${esc(p.caption || 'Trabalho ' + (i+1))}" loading="lazy" />
    </div>`;
  }).join("");

  observeReveal();
}

// ── EQUIPA DINÂMICA (lê do Firestore do salão Book It ligado) ──
// Single source of truth: BookIt staff collection. The owner manages
// the team (and photos) in BookIt admin; this site auto-syncs.
function renderTeam() {
  const grid  = document.getElementById("teamGrid");
  const empty = document.getElementById("teamEmpty");
  if (!grid) return;

  // Renders a list (after we fetch from Firestore)
  function paint(team) {
    if (!team.length) {
      grid.style.display = "none";
      if (empty) empty.style.display = "block";
      return;
    }
    grid.style.display = "";
    if (empty) empty.style.display = "none";

    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);

    grid.innerHTML = team.map((m, i) => {
      const initial = (m.name || "?").charAt(0).toUpperCase();
      const delay   = (i * 0.07).toFixed(2);
      const photoBlock = m.photoUrl
        ? `<img src="${esc(m.photoUrl)}" alt="${esc(m.name)}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('team__photo--fallback')" />`
        : `<div class="team__initial" aria-hidden="true">${esc(initial)}</div>`;
      return `<article class="team__member reveal" style="--d:${delay}s">
        <div class="team__photo">${photoBlock}</div>
        <h3 class="team__name">${esc(m.name || "")}</h3>
        <p class="team__role">${esc(m.role || "Colaborador/a")}</p>
        ${m.bio ? `<p class="team__bio">${esc(m.bio)}</p>` : ""}
      </article>`;
    }).join("");

    observeReveal();
  }

  // Try Firestore first (BookIt staff for the linked salon)
  loadTeamFromBookIt().then(team => {
    if (team !== null) {
      paint(team);
    } else {
      // Fallback to localStorage if Firestore fails or no salon configured
      let team = [];
      try {
        const stored = localStorage.getItem("zen_team");
        team = stored ? JSON.parse(stored) : [];
      } catch(e) { team = []; }
      paint(team);
    }
  });
}

/* Shared Firestore reader for ZenOrganic. Lazy-loads the SDK only when first
 * needed. Returns the array of docs, or null if anything fails (lets caller
 * fall back to localStorage). */
const SALON = "demo";
let _fsCache = null;
async function getFirestoreDb() {
  if (_fsCache) return _fsCache;
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const fs = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  const app = initializeApp({
    apiKey: "AIzaSyABK6W0yTe_EQfna5_Sz7DcI9nPwvh5TNw",
    authDomain: "bookit-51575.firebaseapp.com",
    projectId: "bookit-51575",
    appId: "1:304719409100:web:15f30b52ee324f00517769"
  }, "zen-site-loader");
  _fsCache = { db: fs.getFirestore(app), ...fs };
  return _fsCache;
}

async function loadFromBookIt(subcollection, options = {}) {
  try {
    const fs = await getFirestoreDb();
    const constraints = [];
    if (options.activeOnly) constraints.push(fs.where("active","==", true));
    constraints.push(fs.orderBy(options.orderField || "order","asc"));
    const snap = await fs.getDocs(fs.query(
      fs.collection(fs.db, "salons", SALON, subcollection),
      ...constraints
    ));
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.warn(`[zen] Could not load ${subcollection} from BookIt:`, e.message);
    return null;
  }
}

async function loadTeamFromBookIt() {
  return loadFromBookIt("staff", { activeOnly: true });
}

// ── PROMOÇÕES (BookIt Firestore → promotions, filtered active) ──
async function renderAnnouncements() {
  const grid = document.getElementById("promos-grid");
  if (!grid) return;

  // Use createdAt as fallback since promotions don't have explicit 'order'
  let items = null;
  try {
    const fs = await getFirestoreDb();
    const snap = await fs.getDocs(fs.query(
      fs.collection(fs.db, "salons", SALON, "promotions"),
      fs.where("active","==", true)
    ));
    items = snap.docs.map(d => d.data());
  } catch (e) {
    console.warn("[zen] promotions load failed:", e.message);
  }

  // localStorage fallback (legacy)
  if (items === null) {
    try {
      const stored = localStorage.getItem("zen_announcements");
      items = stored ? JSON.parse(stored).filter(a => a.active) : [];
    } catch(e) { items = []; }
  }

  if (!items.length) return; // keep static fallback card

  // Replace the static fallback if we have real items
  grid.innerHTML = '';
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  items.forEach((a, i) => {
    const card = document.createElement("article");
    card.className = "promo-card reveal";
    card.style.cssText = `--d:${0.04 + i * 0.08}s`;
    const tag = a.badgeText || a.type;
    card.innerHTML = `
      ${tag ? `<div class="promo-tag promo-tag--subtle">${esc(tag)}</div>` : ""}
      <h3>${esc(a.title || "")}</h3>
      <p>${esc(a.description || "")}</p>
      <a class="promo-link" href="https://bookit-51575.web.app/?salon=demo" target="_blank" rel="noopener">Marcar →</a>
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

// ── PARCERIAS (BookIt Firestore → site_partners) ──
async function renderPartners() {
  const grid  = document.getElementById('partnersGrid');
  const empty = document.getElementById('partnersEmpty');
  if (!grid) return;

  let partners = await loadFromBookIt("site_partners");
  if (partners === null) {
    try {
      const stored = localStorage.getItem('zen_partners');
      partners = stored ? JSON.parse(stored) : [];
    } catch(e) { partners = []; }
  }

  if (!partners.length) {
    grid.style.display  = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }
  grid.style.display  = '';
  if (empty) empty.style.display = 'none';

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  grid.innerHTML = partners.map((p, i) => `
    <div class="partner-card reveal" style="--d:${(i * 0.07).toFixed(2)}s">
      <div class="partner-icon">${esc(p.icon || '🤝')}</div>
      <div class="partner-name">${esc(p.name || '')}</div>
      ${p.desc ? `<div class="partner-desc">${esc(p.desc)}</div>` : ''}
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
