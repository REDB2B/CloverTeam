/**
 * Clover Team - Interactive Core JavaScript
 * Features: Slider, Unit-Economics Calculator, Rotating Banner Widget,
 * Canvas Particles, 3D Tilt, Modal, Dynamic Counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile navigation toggle
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // 3. Ambient Particle Canvas Effect in Background
  initParticleCanvas();

  // 4. Hero Card 3D Tilt
  init3DTilt();

  // 5. Stat Counter Animation
  initStatCounters();

  // 6. Cases Slider
  initCasesSlider();

  // 7. Interactive Unit Economics Calculator
  initUnitEconomicsCalculator();

  // 8. Rotating Banner Widget (Specially requested)
  initRotatingBannerWidget();

  // 9. Lead Consultation Modal
  initLeadModal();

  // 10. Forms Handler
  initForms();
});

/* ==========================================================================
   3. AMBIENT PARTICLES CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 22), 60);

  const colors = [
    'rgba(16, 185, 129, 0.4)', // green
    'rgba(6, 182, 212, 0.4)',  // cyan
    'rgba(251, 191, 36, 0.35)', // yellow
    'rgba(255, 125, 26, 0.35)'  // orange
  ];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   4. 3D CARD TILT
   ========================================================================== */
function init3DTilt() {
  const card = document.querySelector('.clover-main-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 12;
    const rotY = (x / (rect.width / 2)) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   5. STAT COUNTER ANIMATION
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * ease;

      el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('ru-RU')}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target.toLocaleString('ru-RU')}${suffix}`;
      }
    }
    requestAnimationFrame(update);
  }
}

/* ==========================================================================
   6. CASES SLIDER
   ========================================================================== */
function initCasesSlider() {
  const slider = document.querySelector('.cases-slider');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slider) return;

  const getScrollAmount = () => {
    const card = slider.querySelector('.case-card');
    return card ? card.offsetWidth + 24 : 400;
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }

  // Update dots on scroll
  slider.addEventListener('scroll', () => {
    const totalScroll = slider.scrollWidth - slider.clientWidth;
    if (totalScroll <= 0) return;
    const progress = slider.scrollLeft / totalScroll;
    const activeIndex = Math.min(Math.round(progress * (dots.length - 1)), dots.length - 1);

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const card = slider.querySelector('.case-card');
      if (card) {
        slider.scrollTo({ left: idx * (card.offsetWidth + 24), behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE UNIT-ECONOMICS CALCULATOR
   ========================================================================== */
function initUnitEconomicsCalculator() {
  const budgetInput = document.getElementById('calc-budget');
  const checkInput = document.getElementById('calc-check');
  const crInput = document.getElementById('calc-cr');

  const budgetDisplay = document.getElementById('display-budget');
  const checkDisplay = document.getElementById('display-check');
  const crDisplay = document.getElementById('display-cr');

  const resLeads = document.getElementById('res-leads');
  const resRevenue = document.getElementById('res-revenue');
  const resProfit = document.getElementById('res-profit');
  const resRoi = document.getElementById('res-roi');

  if (!budgetInput || !checkInput || !crInput) return;

  function recalculate() {
    const budget = parseFloat(budgetInput.value);
    const avgCheck = parseFloat(checkInput.value);
    const cr = parseFloat(crInput.value); // in percent

    budgetDisplay.textContent = `$${budget.toLocaleString('ru-RU')}`;
    checkDisplay.textContent = `$${avgCheck.toLocaleString('ru-RU')}`;
    crDisplay.textContent = `${cr}%`;

    // Dynamic model:
    // Estimated CPL in B2B/CPA typically scales with budget & niche check
    // Average realistic CPL = base $15 + 1.2% of ticket
    const estCpl = Math.max(12, Math.round(14 + (avgCheck * 0.015)));
    const estimatedLeads = Math.floor(budget / estCpl);
    const qualifiedDeals = Math.floor(estimatedLeads * (cr / 100));
    const estimatedRevenue = qualifiedDeals * avgCheck;
    const netProfit = estimatedRevenue - budget;
    const roi = budget > 0 ? Math.round((netProfit / budget) * 100) : 0;

    resLeads.textContent = `${estimatedLeads.toLocaleString('ru-RU')} лидов`;
    resRevenue.textContent = `$${Math.max(0, estimatedRevenue).toLocaleString('ru-RU')}`;
    resProfit.textContent = (netProfit >= 0 ? `+$${netProfit.toLocaleString('ru-RU')}` : `-$${Math.abs(netProfit).toLocaleString('ru-RU')}`);
    resRoi.textContent = `${roi > 0 ? '+' : ''}${roi}%`;

    if (netProfit < 0) {
      resProfit.style.color = '#ef4444';
      resRoi.style.color = '#ef4444';
    } else {
      resProfit.style.color = 'var(--clover-yellow)';
      resRoi.style.color = 'var(--clover-green)';
    }
  }

  budgetInput.addEventListener('input', recalculate);
  checkInput.addEventListener('input', recalculate);
  crInput.addEventListener('input', recalculate);

  recalculate();
}

/* ==========================================================================
   8. ROTATING BANNER WIDGET (HOT CASES & ALERTS)
   ========================================================================== */
function initRotatingBannerWidget() {
  const widget = document.getElementById('rotating-banner-widget');
  if (!widget) return;

  const items = widget.querySelectorAll('.widget-card-item');
  const prevBtn = widget.querySelector('.widget-btn-prev');
  const nextBtn = widget.querySelector('.widget-btn-next');
  const closeBtn = widget.querySelector('.widget-btn-close');
  const minTrigger = widget.querySelector('.widget-min-trigger');
  const progressFill = widget.querySelector('.widget-progress-fill');

  let currentIndex = 0;
  const intervalDuration = 5500;
  let timer = null;
  let progressTimer = null;
  let startTime = null;

  function showSlide(index) {
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === index);
    });
    startProgress();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(currentIndex);
  }

  function startProgress() {
    clearInterval(progressTimer);
    clearTimeout(timer);
    if (progressFill) progressFill.style.width = '0%';

    startTime = Date.now();
    progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / intervalDuration) * 100, 100);
      if (progressFill) progressFill.style.width = `${pct}%`;

      if (elapsed >= intervalDuration) {
        clearInterval(progressTimer);
        nextSlide();
      }
    }, 50);
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });

  // Pause on hover
  widget.addEventListener('mouseenter', () => {
    clearInterval(progressTimer);
  });

  widget.addEventListener('mouseleave', () => {
    if (!widget.classList.contains('minimized')) {
      startProgress();
    }
  });

  // Minimize / Expand
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      widget.classList.add('minimized');
      clearInterval(progressTimer);
    });
  }

  if (minTrigger) {
    minTrigger.addEventListener('click', () => {
      widget.classList.remove('minimized');
      startProgress();
    });
  }

  // Quick link click to jump to cases
  widget.querySelectorAll('.widget-action-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSec = document.getElementById('cases');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial start
  showSlide(0);
}

/* ==========================================================================
   9. LEAD CONSULTATION MODAL
   ========================================================================== */
function initLeadModal() {
  const modal = document.getElementById('lead-modal');
  const openButtons = document.querySelectorAll('.open-consult-modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. FORMS & TELEGRAM INTEGRATION
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll('form[data-handle="lead-form"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value || 'Без имени';
      const tg = form.querySelector('[name="telegram"]')?.value || 'Не указан';
      const niche = form.querySelector('[name="niche"]')?.value || 'B2B/CPA';
      const budget = form.querySelector('[name="budget"]')?.value || 'Не указан';

      // Pre-filled message for Telegram direct link
      const encodedMsg = encodeURIComponent(
        `Привет, Clover Team! Хочу обсудить проект.\n\n👤 Имя: ${name}\n✈️ Telegram: ${tg}\n🎯 Ниша/Проект: ${niche}\n💰 Планируемый бюджет: ${budget}`
      );

      // Hide fields, show success
      const successBox = form.parentElement.querySelector('.form-success-message');
      if (successBox) {
        form.style.display = 'none';
        successBox.style.display = 'block';

        // Provide button to jump straight to Telegram with data
        const tgBtn = successBox.querySelector('.tg-direct-send-btn');
        if (tgBtn) {
          tgBtn.href = `https://t.me/clover_traffic_lead?text=${encodedMsg}`;
        }
      }
    });
  });

  // Copy Telegram link / handle
  document.querySelectorAll('[data-copy-tg]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-copy-tg');
      navigator.clipboard.writeText(val).then(() => {
        const origText = btn.innerHTML;
        btn.innerHTML = '<span>Скопировано! ✓</span>';
        setTimeout(() => {
          btn.innerHTML = origText;
        }, 2000);
      });
    });
  });
}
