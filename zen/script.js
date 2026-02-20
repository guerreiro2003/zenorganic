// Mobile menu
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

burger?.addEventListener("click", () => {
  const expanded = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", String(!expanded));
  mobileNav.hidden = expanded;
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form: opens user's email client (no backend)
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = encodeURIComponent(data.get("name") || "");
  const message = encodeURIComponent(data.get("message") || "");

  // TODO: troca para o email real do salão quando tiveres
  const to = "email-do-salao@exemplo.com";
  const subject = `Mensagem do site - ${decodeURIComponent(name)}`.trim();
  const body = `${decodeURIComponent(message)}\n\n— Enviado pelo site`.trim();

  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
