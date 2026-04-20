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
    disable: 'phone'   // En móviles muy pequeños omitimos para rendimiento
  });


  /* ============================================================
     2. NAVBAR — Scroll, Hamburguesa, Dropdown
  ============================================================ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  // Overlay para cerrar menú en móvil
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // --- Scroll: agregar clase .scrolled ---
  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Ejecutar al cargar

  // --- Hamburguesa: abrir/cerrar menú ---
  const toggleMenu = (open) => {
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  overlay.addEventListener('click', () => toggleMenu(false));

  // --- Cerrar menú al hacer clic en un enlace ---
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) toggleMenu(false);
    });
  });

  // --- Dropdown en móvil: toggle al hacer clic ---
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach(parent => {
    const toggle = parent.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          parent.classList.toggle('open');
        }
      });
    }
  });

  // --- Smooth scroll para todos los nav-links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Marcar enlace activo según sección visible ---
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => activeLinkObserver.observe(s));


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
    // Resetear animaciones en cada slide
    on: {
      slideChangeTransitionStart() {
        const activeSlide = this.slides[this.activeIndex];
        // Reiniciar animaciones de contenido
        const content = activeSlide.querySelector('.hero-content');
        if (content) {
          content.style.animation = 'none';
          // Forzar reflow
          void content.offsetHeight;
          content.style.animation = '';
        }
        // Animar elementos individualmente
        const eyebrow  = activeSlide.querySelector('.hero-eyebrow');
        const title    = activeSlide.querySelector('.hero-title');
        const subtitle = activeSlide.querySelector('.hero-subtitle');
        const cta      = activeSlide.querySelector('.hero-cta-group');
        [eyebrow, title, subtitle, cta].forEach((el, i) => {
          if (!el) return;
          el.style.opacity = '0';
          el.style.transform = 'translateY(24px)';
          el.style.transition = `opacity .7s ${i * .15 + .2}s ease, transform .7s ${i * .15 + .2}s ease`;
          // Pequeño delay para forzar reflow
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
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
      640: { slidesPerView: 1 },
      900: { slidesPerView: 2 },
      1100: { slidesPerView: 3 },
    },
  });


  /* ============================================================
     5. CONTADOR DE ESTADÍSTICAS (Stats Bar)
  ============================================================ */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
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

  statNumbers.forEach(n => counterObserver.observe(n));


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
  const sendBtn = document.getElementById('sendWhatsApp');
  const WA_NUMBER = '5544705244';

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      // Obtener valores
      const nombre   = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const email    = document.getElementById('email').value.trim();
      const asunto   = document.getElementById('asunto').value;
      const mensaje  = document.getElementById('mensaje').value.trim();

      // Validación básica
      if (!nombre || !telefono || !email || !mensaje) {
        showFormAlert('Por favor complete todos los campos obligatorios.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormAlert('Ingrese un correo electrónico válido.', 'error');
        return;
      }

      // Construir mensaje para WhatsApp
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

  /**
   * Mostrar alerta contextual en el formulario
   */
  const showFormAlert = (text, type) => {
    // Eliminar alerta anterior si existe
    const prev = document.querySelector('.form-alert');
    if (prev) prev.remove();

    const alert = document.createElement('div');
    alert.className = `form-alert form-alert--${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${text}`;

    // Estilos inline para no depender de CSS adicional
    Object.assign(alert.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 18px',
      borderRadius: '4px',
      marginBottom: '18px',
      fontSize: '.88rem',
      fontWeight: '500',
      background: type === 'success' ? 'rgba(37,211,102,.15)' : 'rgba(220,53,69,.15)',
      border: `1px solid ${type === 'success' ? 'rgba(37,211,102,.4)' : 'rgba(220,53,69,.4)'}`,
      color: type === 'success' ? '#25d366' : '#ff6b7a',
      animation: 'fadeSlideUp .4s ease forwards',
    });

    const form = document.getElementById('contactForm');
    form.insertBefore(alert, form.firstChild);

    // Auto-eliminar
    setTimeout(() => { if (alert.parentNode) alert.remove(); }, 5000);
  };

  /**
   * Validar email
   */
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  /* ============================================================
     8. ANIMACIÓN DE APARICIÓN LATERAL PERSONALIZADA
        (complementa AOS con efectos adicionales para cards)
  ============================================================ */
  const revealElements = document.querySelectorAll(
    '.area-card, .why-card, .testimonial-card, .contact-info-card, .mv-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
    revealObserver.observe(el);
  });

  // Agregar clase revealed via CSS
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(revealStyle);


  /* ============================================================
     9. EFECTO PARALLAX SUAVE EN HERO
  ============================================================ */
  const heroSection = document.querySelector('.hero');
  if (heroSection && window.innerWidth > 900) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const slides = document.querySelectorAll('.hero-slide');
        slides.forEach(slide => {
          slide.style.backgroundPositionY = `${50 + scrolled * 0.15}%`;
        });
      }
    }, { passive: true });
  }


  /* ============================================================
     10. CERRAR MENÚ AL REDIMENSIONAR LA VENTANA
  ============================================================ */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      toggleMenu(false);
    }
  });


  /* ============================================================
     11. NAV LINK ACTIVE STYLE (CSS dinámico)
  ============================================================ */
  const activeLinkStyle = document.createElement('style');
  activeLinkStyle.textContent = `.nav-link.active { color: var(--gold) !important; }`;
  document.head.appendChild(activeLinkStyle);


  /* ============================================================
     12. VALIDACIÓN EN TIEMPO REAL DEL FORMULARIO
  ============================================================ */
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

  formInputs.forEach(input => {
    // Al perder el foco, validar
    input.addEventListener('blur', () => {
      validateField(input);
    });

    // Al escribir, limpiar error si ya es válido
    input.addEventListener('input', () => {
      if (input.dataset.error === 'true') {
        validateField(input);
      }
    });
  });

  const validateField = (field) => {
    let valid = true;
    const val = field.value.trim();

    if (field.hasAttribute('required') && !val) {
      valid = false;
    } else if (field.type === 'email' && val && !isValidEmail(val)) {
      valid = false;
    }

    field.style.borderColor = valid ? '' : 'rgba(220,53,69,.6)';
    field.dataset.error = valid ? 'false' : 'true';
    return valid;
  };


  /* ============================================================
     13. LOADER (Fade-in inicial de la página)
  ============================================================ */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Fallback si load ya ocurrió
  if (document.readyState === 'complete') {
    document.body.style.opacity = '1';
  }


}); // end DOMContentLoaded
