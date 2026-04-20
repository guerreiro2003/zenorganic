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
  const to      = "email-do-salao@exemplo.com"; // ← substituir pelo email real
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

// ── POPUP ZEN CLUB ──
(function() {
  const POPUP_KEY   = 'zen_popup_dismissed';
  const POPUP_DELAY = 4000;

  function openPopup() {
    const overlay = document.getElementById('popupOverlay');
    const box     = document.getElementById('popupBox');
    if (!overlay) return;
    overlay.style.pointerEvents = 'auto';
    overlay.style.opacity       = '1';
    box.style.transform         = 'translateY(0)';
  }

  window.closePopup = function() {
    const overlay = document.getElementById('popupOverlay');
    const box     = document.getElementById('popupBox');
    if (!overlay) return;
    overlay.style.opacity       = '0';
    overlay.style.pointerEvents = 'none';
    box.style.transform         = 'translateY(20px)';
    sessionStorage.setItem(POPUP_KEY, '1');
  };

  document.getElementById('popupOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) closePopup();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup() });

  if (!sessionStorage.getItem(POPUP_KEY)) {
    setTimeout(openPopup, POPUP_DELAY);
  }
})();
