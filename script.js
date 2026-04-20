/* ================================================================
   GÓNGORA DESPACHOS — script.js
   Interactividad completa: Navbar, Sliders, Animaciones, Formulario WhatsApp
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. INICIALIZAR AOS (Animate On Scroll)
  ============================================================ */
  AOS.init({
    duration: 800,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    once: true,
    offset: 80,
    disable: false
  });


  /* ============================================================
     2. NAVBAR — Scroll, Hamburguesa, Dropdown, Overlay
  ============================================================ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  // Crear overlay para cerrar menú en móvil
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // ── Scroll: clase .scrolled ──
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // ejecutar al cargar

  // ── Abrir / cerrar menú móvil ──
  const toggleMenu = (open) => {
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(!navMenu.classList.contains('open'));
  });

  overlay.addEventListener('click', () => toggleMenu(false));

  // ── Cerrar al hacer clic en enlace (excepto dropdown-toggle) ──
  navMenu.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) toggleMenu(false);
    });
  });

  // ── Cerrar al pulsar Escape ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // ── Dropdown en móvil: toggle clic ──
  document.querySelectorAll('.has-dropdown').forEach(parent => {
    const toggle = parent.querySelector('.dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        e.stopPropagation();
        // Cerrar otros dropdowns abiertos
        document.querySelectorAll('.has-dropdown.open').forEach(other => {
          if (other !== parent) other.classList.remove('open');
        });
        parent.classList.toggle('open');
      }
    });
  });

  // ── Cerrar dropdown de escritorio al hacer clic fuera ──
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 900) {
      document.querySelectorAll('.has-dropdown').forEach(d => {
        if (!d.contains(e.target)) d.classList.remove('open');
      });
    }
  });

  // ── Smooth scroll para anclas ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Marcar enlace activo según sección visible ──
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => activeLinkObserver.observe(s));

  // ── Cerrar menú al redimensionar ──
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      toggleMenu(false);
      // Cerrar todos los dropdowns móviles
      document.querySelectorAll('.has-dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });


  /* ============================================================
     3. HERO SWIPER
  ============================================================ */
  const heroSwiper = new Swiper('.hero-swiper', {
    loop: true,
    speed: 900,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    effect: 'fade',
    fadeEffect: { crossFade: true },
    navigation: {
      prevEl: '.hero-prev',
      nextEl: '.hero-next',
    },
    pagination: {
      el: '.hero-pagination',
      clickable: true,
    },
    on: {
      slideChangeTransitionStart() {
        const activeSlide = this.slides[this.activeIndex];
        if (!activeSlide) return;

        const elements = [
          activeSlide.querySelector('.hero-eyebrow'),
          activeSlide.querySelector('.hero-title'),
          activeSlide.querySelector('.hero-subtitle'),
          activeSlide.querySelector('.hero-cta-group'),
        ];

        elements.forEach((el, i) => {
          if (!el) return;
          el.style.transition = 'none';
          el.style.opacity    = '0';
          el.style.transform  = 'translateY(24px)';

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transition = `opacity .7s ${i * .15 + .2}s ease, transform .7s ${i * .15 + .2}s ease`;
              el.style.opacity    = '1';
              el.style.transform  = 'translateY(0)';
            });
          });
        });
      }
    }
  });


  /* ============================================================
     4. TESTIMONIOS SWIPER
  ============================================================ */
  new Swiper('.testimonials-swiper', {
    loop: true,
    speed: 700,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    slidesPerView: 1,
    spaceBetween: 28,
    pagination: {
      el: '.testimonials-pagination',
      clickable: true,
    },
    breakpoints: {
      640:  { slidesPerView: 1 },
      900:  { slidesPerView: 2 },
      1100: { slidesPerView: 3 },
    },
  });


  /* ============================================================
     5. CONTADOR DE ESTADÍSTICAS
  ============================================================ */
  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .5 });

  document.querySelectorAll('.stat-number').forEach(n => counterObserver.observe(n));


  /* ============================================================
     6. BOTÓN VOLVER ARRIBA
  ============================================================ */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================================================
     7. FORMULARIO → ABRIR WHATSAPP
  ============================================================ */
  const sendBtn   = document.getElementById('sendWhatsApp');
  const WA_NUMBER = '5544705244';

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const nombre   = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const email    = document.getElementById('email').value.trim();
      const asunto   = document.getElementById('asunto').value;
      const mensaje  = document.getElementById('mensaje').value.trim();

      // Validación
      if (!nombre || !telefono || !email || !mensaje) {
        showFormAlert('Por favor complete todos los campos obligatorios.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showFormAlert('Ingrese un correo electrónico válido.', 'error');
        return;
      }

      // Mensaje WhatsApp formateado
      const waMessage =
        `Hola, mi nombre es *${nombre}*.\n\n` +
        `📋 *Consulta Jurídica — Góngora Despachos*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Nombre:* ${nombre}\n` +
        `📞 *Teléfono:* ${telefono}\n` +
        `📧 *Email:* ${email}\n` +
        (asunto ? `⚖️ *Área de interés:* ${asunto}\n` : '') +
        `\n📝 *Descripción del caso:*\n${mensaje}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `_Enviado desde el sitio web de Góngora Despachos_`;

      const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;
      window.open(waURL, '_blank', 'noopener,noreferrer');
      showFormAlert('¡Mensaje listo! Se abrirá WhatsApp para enviarlo.', 'success');
    });
  }

  const showFormAlert = (text, type) => {
    const prev = document.querySelector('.form-alert');
    if (prev) prev.remove();

    const alert = document.createElement('div');
    alert.className = `form-alert form-alert--${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${text}`;

    Object.assign(alert.style, {
      display:        'flex',
      alignItems:     'center',
      gap:            '10px',
      padding:        '14px 18px',
      borderRadius:   '4px',
      marginBottom:   '18px',
      fontSize:       '.88rem',
      fontWeight:     '500',
      background:     type === 'success' ? 'rgba(37,211,102,.15)' : 'rgba(220,53,69,.15)',
      border:         `1px solid ${type === 'success' ? 'rgba(37,211,102,.4)' : 'rgba(220,53,69,.4)'}`,
      color:          type === 'success' ? '#25d366' : '#ff6b7a',
    });

    const form = document.getElementById('contactForm');
    form.insertBefore(alert, form.firstChild);
    setTimeout(() => { if (alert.parentNode) alert.remove(); }, 5000);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  /* ============================================================
     8. REVELACIÓN DE CARDS CON INTERSECTION OBSERVER
  ============================================================ */
  const revealElements = document.querySelectorAll(
    '.area-card, .why-card, .contact-info-card, .mv-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .6s ${(i % 3) * .1}s ease, transform .6s ${(i % 3) * .1}s ease`;
    revealObserver.observe(el);
  });


  /* ============================================================
     9. PARALLAX SUAVE EN HERO (solo desktop)
  ============================================================ */
  if (window.innerWidth > 900) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        document.querySelectorAll('.hero-slide').forEach(slide => {
          slide.style.backgroundPositionY = `${50 + window.scrollY * 0.12}%`;
        });
      }
    }, { passive: true });
  }


  /* ============================================================
     10. VALIDACIÓN EN TIEMPO REAL DEL FORMULARIO
  ============================================================ */
  const isValidField = (field) => {
    const val = field.value.trim();
    if (field.hasAttribute('required') && !val) return false;
    if (field.type === 'email' && val && !isValidEmail(val)) return false;
    return true;
  };

  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
    .forEach(input => {
      input.addEventListener('blur', () => {
        input.style.borderColor = isValidField(input) ? '' : 'rgba(220,53,69,.6)';
        input.dataset.error = String(!isValidField(input));
      });
      input.addEventListener('input', () => {
        if (input.dataset.error === 'true') {
          input.style.borderColor = isValidField(input) ? '' : 'rgba(220,53,69,.6)';
        }
      });
    });


  /* ============================================================
     11. LOADER — fade-in inicial
  ============================================================ */
  document.body.style.opacity   = '0';
  document.body.style.transition = 'opacity .5s ease';

  const showPage = () => { document.body.style.opacity = '1'; };

  if (document.readyState === 'complete') {
    showPage();
  } else {
    window.addEventListener('load', showPage);
    // Fallback si load tarda demasiado
    setTimeout(showPage, 2000);
  }


}); // end DOMContentLoaded