document.addEventListener('DOMContentLoaded', () => {

  // --- Loader ---
  const loader = document.getElementById('loader');
  const triggerShow = () => {
    loader.classList.add('done');
    document.querySelectorAll('.anim-hero').forEach(el => el.classList.add('show'));
  };
  window.addEventListener('load', () => setTimeout(triggerShow, 500));
  setTimeout(triggerShow, 2000);

  // --- Mobile nav ---
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('active'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('active'))
  );

  // --- Marquee (infinite) ---
  const trustTrack = document.getElementById('trustTrack');
  if (trustTrack) {
    const items = [
      { name: 'La Mejor Mesa', cls: 'trust__item--mesa' },
      { name: 'Reservas', cls: 'trust__item--sub' },
      { name: 'Moligest', cls: 'trust__item--moli' },
      { name: 'Gestión operativa', cls: 'trust__item--sub' },
      { name: 'Tiketeo', cls: 'trust__item--tik' },
      { name: 'Venta de entradas', cls: 'trust__item--sub' },
    ];
    const fragment = items.map(i =>
      `<span class="trust__item ${i.cls}">${i.name}</span><span class="trust__sep">·</span>`
    ).join('');
    // 8 copies ensures seamless loop on any screen
    trustTrack.innerHTML = Array(8).fill(`<div class="trust__slide">${fragment}</div>`).join('');
  }

  // --- Nav scroll ---
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  // --- Hero parallax ---
  const heroContent = document.getElementById('heroContent');
  const heroDevice = document.getElementById('heroDevice');
  const scrollHint = document.getElementById('scrollHint');

  // --- Text Reveal (word-by-word) + BG parallax ---
  const revealP = document.getElementById('revealParagraph');
  const textSection = document.getElementById('textReveal');
  const rings = document.querySelectorAll('.tr-ring');
  const glows = document.querySelectorAll('.tr-glow');
  let wordEls = [];

  if (revealP) {
    const text = revealP.textContent.trim();
    revealP.innerHTML = text.split(/\s+/).map(w => `<span class="word">${w}</span>`).join(' ');
    wordEls = revealP.querySelectorAll('.word');
  }

  // --- Showcase device parallax ---
  const device = document.getElementById('showcaseDevice');
  const showcase = document.getElementById('showcase');

  // --- Main scroll handler (single rAF loop) ---
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Hero parallax — text fades faster, device stays longer
      if (scrollY < vh * 1.5) {
        const progress = scrollY / vh;

        // Text elements fade and move up
        const heroTexts = document.querySelectorAll('.hero__eyebrow, .hero__h1, .hero__sub');
        heroTexts.forEach(el => {
          el.style.opacity = Math.max(0, 1 - progress * 2);
          el.style.transform = `translateY(${scrollY * 0.4}px)`;
        });

        // CTAs fade slightly later
        const ctas = document.querySelector('.hero__ctas');
        if (ctas) {
          ctas.style.opacity = Math.max(0, 1 - progress * 2.5);
          ctas.style.transform = `translateY(${scrollY * 0.3}px)`;
        }

        // Device moves up slower, fades last
        if (heroDevice) {
          heroDevice.style.opacity = Math.max(0, 1 - progress * 1.0);
          heroDevice.style.transform = `perspective(2400px) rotateX(${Math.max(0, 6 - progress * 8)}deg) translateY(${scrollY * 0.1}px)`;
        }

        if (scrollHint) {
          scrollHint.style.opacity = Math.max(0, 1 - progress * 5);
        }
      }

      // Text reveal
      if (textSection) {
        const rect = textSection.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const scrolled = -rect.top;
          const total = textSection.offsetHeight - vh;
          const progress = Math.max(0, Math.min(1, scrolled / total));

          wordEls.forEach((w, i) => {
            w.classList.toggle('lit', progress > i / wordEls.length);
          });

          // Rings scale with scroll
          rings.forEach((ring, i) => {
            const scale = 1 + progress * (0.3 + i * 0.15);
            const opacity = 0.3 + progress * 0.7;
            ring.style.transform = `scale(${scale})`;
            ring.style.opacity = opacity;
          });

          // Glows drift
          glows.forEach((glow, i) => {
            const drift = (progress - 0.5) * (60 + i * 40);
            const driftX = i === 0 ? -drift : drift;
            glow.style.transform = `translate(${driftX}px, ${-drift * 0.5}px)`;
            glow.style.opacity = 0.3 + progress * 0.7;
          });
        }
      }

      // Showcase device
      if (device && showcase) {
        const rect = showcase.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const scrolled = -rect.top;
          const total = showcase.offsetHeight - vh;
          const progress = Math.max(0, Math.min(1, scrolled / total));

          device.classList.toggle('active', progress > 0.1);

          const textWrap = showcase.querySelector('.showcase__text-wrap');
          if (textWrap) {
            if (progress > 0.5) {
              const fade = Math.max(0, 1 - (progress - 0.5) * 3);
              textWrap.style.opacity = fade;
              textWrap.style.transform = `translateY(${-(progress - 0.5) * 80}px)`;
            } else {
              textWrap.style.opacity = 1;
              textWrap.style.transform = 'translateY(0)';
            }
          }
        }
      }

      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Reveal on scroll ---
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    }),
    { threshold: 0.05, rootMargin: '0px 0px -80px 0px' }
  );

  document.querySelectorAll('.bento__card').forEach((el, i) => {
    el.classList.add('reveal');
    const d = i % 3;
    if (d) el.classList.add(`reveal-delay-${d}`);
    revealObserver.observe(el);
  });

  document.querySelectorAll('.fb__card').forEach((el, i) => {
    el.classList.add('reveal');
    const d = i % 3;
    if (d) el.classList.add(`reveal-delay-${d}`);
    revealObserver.observe(el);
  });

  document.querySelectorAll('.proceso__step').forEach((el, i) => {
    el.classList.add('reveal');
    el.classList.add(`reveal-delay-${i + 1}`);
    revealObserver.observe(el);
  });

  document.querySelectorAll('.section-head, .contacto__grid').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // --- Form ---
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = 'Enviado ✓';
    btn.disabled = true;
    btn.style.opacity = '0.6';
  });
});
