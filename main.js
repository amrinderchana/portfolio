// ─── THEME TOGGLE ──────────────────────────────────────────────────────────
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function currentTheme() {
    const saved = root.getAttribute('data-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggle.setAttribute('aria-pressed', String(currentTheme() === 'dark'));

  toggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    toggle.setAttribute('aria-pressed', String(next === 'dark'));
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// ─── SCROLL REVEAL (IntersectionObserver, transform/opacity only) ─────────
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !targets.length) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(el => io.observe(el));
})();

// ─── NAV ACTIVE STATE (IntersectionObserver, no scroll-event layout reads) ─
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const linkFor = id => document.querySelector(`.nav-links a[href="#${id}"]`);

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => io.observe(section));
})();

// ─── DYNAMIC YEARS ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const startDate = new Date('2016-04-01');
  const years = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24 * 365.25));

  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) heroSub.textContent = heroSub.textContent.replace('8+ years', `${years}+ years`);

  const statNum = document.querySelector('.stat-num');
  if (statNum && statNum.textContent === '8+') statNum.textContent = `${years}+`;

  document.querySelectorAll('#about p').forEach(p => {
    if (p.textContent.includes('8+ years')) {
      p.innerHTML = p.innerHTML.replace('8+ years', `${years}+ years`);
    }
  });

  const footerP = document.querySelector('footer p');
  if (footerP && footerP.textContent.includes('© 2026')) {
    footerP.textContent = footerP.textContent.replace('© 2026', `© ${new Date().getFullYear()}`);
  }
});
