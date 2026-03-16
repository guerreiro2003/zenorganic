/* ── TOKENS ── */
:root {
  --bg:        #f2ece1;
  --bg-alt:    #ebe4d8;
  --bg-card:   #ede7db;
  --text:      #28221a;
  --text-2:    #4a4035;
  --muted:     #837468;
  --accent:    #6b7c5a;
  --accent-2:  #8f6e52;
  --line:      rgba(40,34,26,.10);
  --line-mid:  rgba(40,34,26,.16);
  --r:         16px;
  --r-lg:      22px;
  --shadow:    0 16px 50px rgba(40,34,26,.14);
  --shadow-sm: 0 6px 20px rgba(40,34,26,.09);
}

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
html { scroll-behavior: smooth }
body {
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  font-size: 15px;
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none }
address { font-style: normal }
img { display: block; max-width: 100% }

/* ── PAPER TEXTURE ── */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  opacity: .032;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px;
}

/* Warm blob */
body::after {
  content: '';
  position: fixed; top: -120px; right: -100px; z-index: 0; pointer-events: none;
  width: 700px; height: 600px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(143,110,82,.09), transparent 70%);
}

.container { width: min(1140px, 92%); margin: 0 auto; position: relative; z-index: 1 }

/* ── HEADER ── */
.header {
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  background: rgba(242,236,225,.88);
  border-bottom: 1px solid var(--line);
  transition: box-shadow .3s;
}
.header.scrolled { box-shadow: 0 2px 28px rgba(40,34,26,.10) }
.header__inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 0; gap: 20px;
}

.brand { display: flex; align-items: center; gap: 11px }
.brand__mark {
  width: 38px; height: 38px; border-radius: 10px;
  display: grid; place-items: center;
  background: linear-gradient(145deg, rgba(107,124,90,.18), rgba(107,124,90,.06));
  border: 1px solid rgba(107,124,90,.28);
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600; font-size: 18px;
  color: var(--accent);
  flex-shrink: 0;
}
.brand__mark--sm { width: 32px; height: 32px; font-size: 15px }
.brand__name { font-weight: 500; font-size: 14px; letter-spacing: .01em; color: var(--text) }
.brand__sub { font-size: 11px; color: var(--muted); letter-spacing: .04em; margin-top: 1px }

.nav { display: flex; gap: 22px; align-items: center }
.nav a {
  color: var(--muted); font-size: 13.5px; letter-spacing: .01em;
  transition: color .2s; position: relative; padding-bottom: 2px;
}
.nav a::after {
  content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
  height: 1px; background: var(--accent-2);
  transform: scaleX(0); transform-origin: left;
  transition: transform .25s ease;
}
.nav a:hover { color: var(--text) }
.nav a:hover::after { transform: scaleX(1) }

.header__cta { display: flex; gap: 8px; align-items: center }

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  border-radius: 999px; padding: 10px 18px;
  border: 1px solid var(--line);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500; font-size: 13.5px; letter-spacing: .01em;
  cursor: pointer;
  transition: transform .15s ease, background .15s ease, border-color .15s ease, box-shadow .15s ease;
  white-space: nowrap;
}
.btn svg { transition: transform .2s ease }
.btn:hover { transform: translateY(-1px) }
.btn:hover svg { transform: translateX(3px) }
.btn:active { transform: translateY(0) }
.btn--primary {
  background: var(--accent);
  color: #f7f4ee;
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(107,124,90,.25);
}
.btn--primary:hover {
  background: #5d6e4d;
  box-shadow: 0 6px 22px rgba(107,124,90,.35);
}
.btn--ghost {
  background: rgba(40,34,26,.06);
  color: var(--text-2);
  border-color: var(--line);
}
.btn--ghost:hover { background: rgba(40,34,26,.10) }
.btn--lg { padding: 13px 24px; font-size: 14.5px }
.btn--full { width: 100% }

/* ── MOBILE NAV ── */
.burger {
  display: none; width: 42px; height: 42px; border-radius: 10px;
  border: 1px solid var(--line); background: rgba(40,34,26,.05);
  padding: 10px; cursor: pointer;
}
.burger span { display: block; height: 1.5px; background: var(--text); margin: 5px 0; border-radius: 1px; transition: transform .25s, opacity .25s }
.burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg) }
.burger.open span:nth-child(2) { opacity: 0 }
.burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg) }

.mobileNav {
  border-top: 1px solid var(--line);
  padding: 10px 0 18px;
  background: rgba(242,236,225,.97);
}
.mobileNav a { display: block; padding: 11px 4%; color: var(--muted); font-size: 14px }
.mobileNav a:hover { color: var(--text) }
.mobileNav__btn { margin: 12px 4% 0; display: inline-flex }

/* ── SCROLL REVEAL ── */
.reveal {
  opacity: 0; transform: translateY(26px);
  transition: opacity .7s ease calc(var(--d, 0s)), transform .7s ease calc(var(--d, 0s));
}
.reveal--right { transform: translateX(26px) }
.reveal.visible { opacity: 1; transform: none }

/* ── HERO ── */
.hero { padding: 56px 0 36px; position: relative }
.hero__grid {
  display: grid; grid-template-columns: 1.1fr .9fr;
  gap: 36px; align-items: center;
}
.pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border-radius: 999px;
  border: 1px solid rgba(107,124,90,.25);
  background: rgba(107,124,90,.09);
  color: var(--accent); font-size: 11px; letter-spacing: .07em; text-transform: uppercase;
  margin-bottom: 20px;
}
.pill__dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent);
  animation: pulse 2.8s ease infinite;
}
@keyframes pulse {
  0%,100% { opacity: 1; transform: scale(1) }
  50%      { opacity: .4; transform: scale(.65) }
}

h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(42px, 5.5vw, 68px);
  font-weight: 300; line-height: 1.02; letter-spacing: -.02em;
  margin-bottom: 18px; color: var(--text);
}
h1 em { font-style: italic; color: var(--accent-2) }
.lead { color: var(--muted); font-size: 15.5px; max-width: 48ch; margin-bottom: 26px; line-height: 1.65 }
.hero__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px }

.hero__badges { display: flex; gap: 8px; flex-wrap: wrap }
.badge {
  font-size: 11.5px; color: var(--muted);
  border: 1px solid var(--line); background: rgba(40,34,26,.04);
  padding: 6px 12px; border-radius: 999px; letter-spacing: .02em;
}

.hero__media { position: relative }
.hero__media-inner {
  border-radius: var(--r-lg); overflow: hidden;
  border: 1px solid var(--line-mid);
  box-shadow: var(--shadow); position: relative;
}
.hero__media-inner img { width: 100%; object-fit: cover; aspect-ratio: 4/3; display: block }
.hero__media-inner::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(40,30,20,.22));
  pointer-events: none;
}
.hero__media-tag {
  position: absolute; bottom: 16px; left: 16px; z-index: 2;
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(242,236,225,.88); backdrop-filter: blur(8px);
  border: 1px solid rgba(40,34,26,.12);
  border-radius: 999px; padding: 7px 14px;
  font-size: 11.5px; color: var(--accent);
}

.hero__scroll-hint {
  display: flex; align-items: center; gap: 10px;
  color: var(--muted); font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
  margin-top: 42px; padding-left: 2px;
}
.hero__scroll-line {
  width: 40px; height: 1px; background: rgba(40,34,26,.15);
  position: relative; overflow: hidden;
}
.hero__scroll-line::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -40px; width: 40px;
  background: var(--accent-2);
  animation: scanline 2.2s linear infinite;
}
@keyframes scanline { to { left: 40px } }

/* ── SECTIONS ── */
.section { padding: 66px 0 }
.section--alt {
  background: var(--bg-alt);
  border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
}
.section__head { margin-bottom: 30px }
.section__label {
  display: block; margin-bottom: 7px;
  font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--accent-2);
}
.section__head h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 300; letter-spacing: -.02em;
  margin-bottom: 7px; line-height: 1.08; color: var(--text);
}
.section__head p { color: var(--muted); max-width: 55ch }

/* ── CARDS ── */
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px }
.card {
  background: var(--bg-card);
  border: 1px solid var(--line); border-radius: var(--r-lg); padding: 22px;
  box-shadow: var(--shadow-sm);
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}
.card:hover {
  transform: translateY(-4px);
  border-color: rgba(107,124,90,.25);
  box-shadow: 0 18px 44px rgba(40,34,26,.14);
}
.card__icon { font-size: 20px; color: var(--accent); margin-bottom: 12px; opacity: .8 }
.card h3 { font-size: 16px; font-weight: 500; margin-bottom: 7px; color: var(--text) }
.card p { color: var(--muted); font-size: 13.5px; margin-bottom: 14px; line-height: 1.55 }
.card__link {
  font-size: 13px; font-weight: 500; color: var(--accent);
  display: inline-flex; align-items: center; gap: 5px;
  transition: gap .2s, color .2s;
}
.card__link:hover { gap: 9px; color: var(--accent-2) }

/* ── PROMOTIONS ── */
.section--promos { position: relative; overflow: hidden }
.section--promos::before {
  content: '✿';
  position: absolute; top: -20px; right: 5%;
  font-size: 180px; color: rgba(107,124,90,.055);
  pointer-events: none; line-height: 1; z-index: 0;
  font-family: serif;
}

.promos-grid {
  display: grid;
  grid-template-columns: 1.45fr 1fr 1fr;
  gap: 14px;
  position: relative; z-index: 1;
}

.promo-card {
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; gap: 10px;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  position: relative; overflow: hidden;
}
.promo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 44px rgba(40,34,26,.14);
  border-color: rgba(107,124,90,.22);
}

/* Featured card */
.promo-card--featured {
  background: linear-gradient(145deg, #e8e0d0, #dfd7c8);
  border-color: rgba(107,124,90,.2);
  padding: 0; overflow: hidden;
}
.promo-card--featured .promo-card__inner {
  padding: 28px;
  display: flex; flex-direction: column; gap: 14px;
  position: relative; z-index: 1;
  height: 100%;
}
.promo-card__deco {
  position: absolute; bottom: -28px; right: 10px; z-index: 0;
  font-size: 140px; color: rgba(107,124,90,.10);
  line-height: 1; pointer-events: none;
  font-family: serif;
}
.promo-card--featured h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-weight: 300; line-height: 1.1;
  color: var(--text);
}
.promo-card--featured p { color: var(--text-2); font-size: 14px; line-height: 1.6; flex: 1 }
.promo-card--featured .btn--primary { align-self: flex-start }

/* Regular cards */
.promo-card h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 300; color: var(--text);
}
.promo-card p { color: var(--muted); font-size: 13.5px; line-height: 1.55; flex: 1 }

.promo-tag {
  display: inline-flex; align-items: center;
  font-size: 10.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
  background: rgba(107,124,90,.15); color: var(--accent);
  padding: 4px 10px; border-radius: 999px;
  align-self: flex-start;
}
.promo-tag--subtle {
  background: rgba(143,110,82,.12); color: var(--accent2);
}

.promo-price {
  display: flex; align-items: baseline; gap: 9px;
  margin-top: auto;
}
.promo-price__old {
  font-size: 14px; color: var(--muted);
  text-decoration: line-through;
}
.promo-price__new {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-weight: 300; color: var(--accent);
}
.promo-link {
  font-size: 13px; font-weight: 500; color: var(--accent2);
  display: inline-flex; align-items: center; gap: 4px;
  transition: gap .2s, color .2s;
  margin-top: 4px;
}
.promo-link:hover { gap: 8px; color: var(--accent) }

/* No promos state */
.promos-empty { display: none }

@media (max-width: 820px) {
  .promos-grid { grid-template-columns: 1fr }
  .section--promos::before { font-size: 100px }
}

/* ── PRICING ── */
.pricing { display: grid; grid-template-columns: 1fr 1fr .85fr; gap: 14px; align-items: start }
.pricing__col, .pricing__cta {
  border: 1px solid var(--line); border-radius: var(--r-lg);
  background: var(--bg-card); padding: 22px; box-shadow: var(--shadow-sm);
}
.pricing__col h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 300; margin-bottom: 14px; letter-spacing: -.01em;
}
.pricing__col ul { list-style: none }
.pricing__col li {
  display: flex; justify-content: space-between; gap: 12px;
  padding: 11px 0; border-bottom: 1px solid var(--line);
  color: var(--muted); font-size: 13.5px;
}
.pricing__col li strong { color: var(--text); font-weight: 500 }
.pricing__col li:last-child { border-bottom: none }
.pricing__cta {
  text-align: center;
  background: linear-gradient(160deg, rgba(107,124,90,.10), rgba(107,124,90,.04));
  border-color: rgba(107,124,90,.22);
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.pricing__cta-leaf { font-size: 28px; color: var(--accent); opacity: .55 }
.pricing__cta h3 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300 }
.pricing__cta p { color: var(--muted); font-size: 13.5px; max-width: 24ch; text-align: center }
.tiny { font-size: 11.5px; color: var(--muted) }

/* ── GALLERY ── */
.gallery {
  display: grid; grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 220px; gap: 12px;
}
.gallery__item { border-radius: var(--r); overflow: hidden; border: 1px solid var(--line) }
.gallery__item img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .55s ease; filter: saturate(.88);
}
.gallery__item:hover img { transform: scale(1.05); filter: saturate(1.05) }
.gallery__item--tall { grid-row: span 2 }
.gallery__item--wide { grid-column: span 2 }

/* ── QUOTES ── */
.quotes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px }
.quote {
  border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 22px; background: var(--bg-card); box-shadow: var(--shadow-sm);
}
.quote__stars { color: var(--accent-2); font-size: 13px; letter-spacing: 2px; margin-bottom: 12px }
.quote blockquote {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px; font-weight: 300; font-style: italic;
  color: var(--text); line-height: 1.55; margin-bottom: 12px;
}
.quote figcaption { color: var(--muted); font-size: 12px; letter-spacing: .04em }

/* ── LOCATION ── */
.location { display: grid; grid-template-columns: 1fr 1.3fr; gap: 14px }
.location__info {
  border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 22px; background: var(--bg-card);
  display: flex; flex-direction: column; gap: 20px;
}
.location__block h3, .hours h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 19px; font-weight: 300; margin-bottom: 10px;
}
.location__block address { color: var(--muted); font-size: 14px; line-height: 1.7 }
.location__block address strong { color: var(--text) }
.location__actions { display: flex; gap: 9px; flex-wrap: wrap; margin-top: 14px }
.hours ul { list-style: none }
.hours li {
  display: flex; justify-content: space-between;
  padding: 9px 0; border-bottom: 1px solid var(--line);
  color: var(--muted); font-size: 13.5px;
}
.hours li strong { color: var(--text); font-weight: 500 }
.hours li:last-child { border-bottom: none }
.location__map {
  border: 1px solid var(--line); border-radius: var(--r-lg);
  overflow: hidden; box-shadow: var(--shadow); min-height: 380px;
}
.location__map iframe { width: 100%; height: 100%; border: 0; display: block }

/* ── CONTACT ── */
.contact { display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 14px }
.contact__card {
  border: 1px solid var(--line); border-radius: var(--r-lg);
  padding: 22px; background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; gap: 8px;
}
.contact__card--accent {
  background: linear-gradient(160deg, rgba(107,124,90,.10), rgba(107,124,90,.04));
  border-color: rgba(107,124,90,.22);
}
.contact__icon { font-size: 20px; color: var(--accent); opacity: .8 }
.contact__card h3 { font-size: 16px; font-weight: 500; color: var(--text) }
.contact__card p { color: var(--muted); font-size: 13.5px; flex: 1 }

.social-links { display: flex; flex-direction: column; gap: 7px; margin-top: 2px }
.social-link {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--muted); transition: color .2s;
}
.social-link:hover { color: var(--accent) }

/* Floating label fields */
.field { position: relative; margin-top: 12px }
.field input, .field textarea {
  width: 100%; padding: 14px 12px 6px;
  border-radius: 10px; border: 1px solid rgba(40,34,26,.14);
  background: rgba(242,236,225,.7); color: var(--text);
  font-family: 'DM Sans', sans-serif; font-size: 13.5px;
  outline: none; resize: vertical; transition: border-color .2s, background .2s;
}
.field input:focus, .field textarea:focus {
  border-color: rgba(107,124,90,.45); background: rgba(242,236,225,.95);
}
.field label {
  position: absolute; top: 10px; left: 12px;
  font-size: 12px; color: var(--muted); pointer-events: none;
  transition: transform .2s, font-size .2s, color .2s; transform-origin: left top;
}
.field input:not(:placeholder-shown) ~ label,
.field textarea:not(:placeholder-shown) ~ label,
.field input:focus ~ label,
.field textarea:focus ~ label {
  transform: translateY(-5px) scale(.85); color: var(--accent);
}

/* ── FOOTER ── */
.footer {
  border-top: 1px solid var(--line); padding: 24px 0;
  background: var(--bg-alt);
}
.footer__inner { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap }
.footer__brand { display: flex; align-items: center; gap: 10px }
.footer__name { font-size: 13px; font-weight: 500; color: var(--text) }
.footer__loc { font-size: 11px; color: var(--muted); margin-top: 1px }
.footer__copy { font-size: 12px; color: var(--muted) }

/* ── RESPONSIVE ── */
@media (max-width: 1000px) {
  .nav, .header__cta { display: none }
  .burger { display: inline-block }
}
@media (max-width: 820px) {
  .hero__grid { grid-template-columns: 1fr }
  .hero__media { order: -1 }
  .cards { grid-template-columns: repeat(2, 1fr) }
  .pricing { grid-template-columns: 1fr }
  .gallery { grid-template-columns: repeat(2, 1fr) }
  .gallery__item--wide { grid-column: span 1 }
  .quotes { grid-template-columns: 1fr }
  .location { grid-template-columns: 1fr }
  .contact { grid-template-columns: 1fr }
}
@media (max-width: 480px) {
  .cards { grid-template-columns: 1fr }
  .gallery { grid-template-columns: 1fr }
  .gallery__item--tall { grid-row: span 1 }
  h1 { font-size: 38px }
}
