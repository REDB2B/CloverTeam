/**
 * CLOVER TEAM — MAFIA TRAFA STYLE INTERACTIVE SCRIPT
 * High-conversion calculator, dynamic counters, rotating live widget,
 * cases slider, FAQ accordion, modals and Telegram deep-linking.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initCounters();
  initCasesSlider();
  initTrafficCalculator();
  initRotatingLiveWidget();
  initFaqAccordion();
  initModals();
  initForms();
  initClipboard();
});

/* 1. Header scroll detection */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* 2. Mobile Navigation */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-links-list');
  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener('click', () => {
    navList.classList.toggle('open');
    toggleBtn.textContent = navList.classList.contains('open') ? '✕' : '☰';
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggleBtn.textContent = '☰';
    });
  });
}

/* 3. Number Counter Animation */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));

  function animateValue(el) {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1600;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * ease;

      el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('ru-RU')}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target.toLocaleString('ru-RU')}${suffix}`;
    }
    requestAnimationFrame(update);
  }
}

/* 4. Cases Carousel */
function initCasesSlider() {
  const track = document.querySelector('.cases-carousel-track');
  const prevBtn = document.querySelector('.arrow-slider-btn.prev');
  const nextBtn = document.querySelector('.arrow-slider-btn.next');
  if (!track) return;

  const getStep = () => {
    const card = track.querySelector('.case-card-mafia');
    return card ? card.offsetWidth + 24 : 450;
  };

  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: getStep(), behavior: 'smooth' }));
  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -getStep(), behavior: 'smooth' }));
}

/* 5. Scale & Traffic Calculator (Mafia Trafa style) */
function initTrafficCalculator() {
  const budgetBar = document.getElementById('calc-budget-bar');
  const budgetOutput = document.getElementById('calc-budget-val');
  const vertSelect = document.getElementById('calc-vert-select');
  const checkBar = document.getElementById('calc-check-bar');
  const checkOutput = document.getElementById('calc-check-val');

  const leadsOut = document.getElementById('calc-res-leads');
  const revOut = document.getElementById('calc-res-rev');
  const profitOut = document.getElementById('calc-res-profit');
  const roiOut = document.getElementById('calc-res-roi');

  if (!budgetBar || !checkBar) return;

  function recalculate() {
    const budget = parseFloat(budgetBar.value);
    const avgCheck = parseFloat(checkBar.value);
    const vert = vertSelect ? vertSelect.value : 'b2b';

    budgetOutput.textContent = `$${budget.toLocaleString('ru-RU')}`;
    checkOutput.textContent = `$${avgCheck.toLocaleString('ru-RU')}`;

    // Niche multiplier for CPL
    let baseCpl = 16;
    let crMultiplier = 0.12;

    if (vert === 'ecomm') {
      baseCpl = 10;
      crMultiplier = 0.18;
    } else if (vert === 'crypto') {
      baseCpl = 28;
      crMultiplier = 0.08;
    } else if (vert === 'cpa') {
      baseCpl = 12;
      crMultiplier = 0.15;
    }

    const estimatedLeads = Math.max(10, Math.floor(budget / baseCpl));
    const deals = Math.max(1, Math.floor(estimatedLeads * crMultiplier));
    const revenue = Math.floor(deals * avgCheck);
    const netProfit = revenue - budget;
    const roi = budget > 0 ? Math.round((netProfit / budget) * 100) : 0;

    leadsOut.textContent = `${estimatedLeads.toLocaleString('ru-RU')} заявок`;
    revOut.textContent = `$${revenue.toLocaleString('ru-RU')}`;
    profitOut.textContent = netProfit >= 0 ? `+$${netProfit.toLocaleString('ru-RU')}` : `-$${Math.abs(netProfit).toLocaleString('ru-RU')}`;
    roiOut.textContent = `${roi > 0 ? '+' : ''}${roi}%`;

    profitOut.style.color = netProfit >= 0 ? 'var(--clover-yellow)' : '#ef4444';
    roiOut.style.color = roi >= 0 ? 'var(--clover-green)' : '#ef4444';
  }

  budgetBar.addEventListener('input', recalculate);
  checkBar.addEventListener('input', recalculate);
  vertSelect?.addEventListener('change', recalculate);

  recalculate();
}

/* 6. Rotating Live Widget (Hot Cases & Live Alerts) */
function initRotatingLiveWidget() {
  const widget = document.getElementById('rotating-live-widget');
  if (!widget) return;

  const slides = widget.querySelectorAll('.widget-slide');
  const nextBtn = widget.querySelector('.w-btn-next');
  const prevBtn = widget.querySelector('.w-btn-prev');
  const closeBtn = widget.querySelector('.w-btn-close');
  const restoreBtn = widget.querySelector('.widget-restore-btn');
  const progressBar = widget.querySelector('.widget-progress-bar');

  let curIdx = 0;
  const slideDuration = 5500;
  let timer = null;
  let progressInt = null;
  let startTime = null;

  function show(idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    runProgress();
  }

  function next() {
    curIdx = (curIdx + 1) % slides.length;
    show(curIdx);
  }

  function prev() {
    curIdx = (curIdx - 1 + slides.length) % slides.length;
    show(curIdx);
  }

  function runProgress() {
    clearInterval(progressInt);
    clearTimeout(timer);
    if (progressBar) progressBar.style.width = '0%';

    startTime = Date.now();
    progressInt = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / slideDuration) * 100, 100);
      if (progressBar) progressBar.style.width = `${pct}%`;

      if (elapsed >= slideDuration) {
        clearInterval(progressInt);
        next();
      }
    }, 50);
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

  widget.addEventListener('mouseenter', () => clearInterval(progressInt));
  widget.addEventListener('mouseleave', () => {
    if (!widget.classList.contains('minimized')) runProgress();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      widget.classList.add('minimized');
      clearInterval(progressInt);
    });
  }

  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      widget.classList.remove('minimized');
      runProgress();
    });
  }

  widget.querySelectorAll('.widget-link-act').forEach(l => {
    l.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  show(0);
}

/* 7. FAQ Accordion */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-card-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer-body');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach(other => {
        other.classList.remove('active');
        const ans = other.querySelector('.faq-answer-body');
        if (ans) ans.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  });
}

/* 8. Modals */
function initModals() {
  const modal = document.getElementById('lead-modal');
  const triggers = document.querySelectorAll('.open-mafia-modal');
  const closeBtn = document.querySelector('.modal-close-x');
  if (!modal) return;

  const open = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  triggers.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  }));

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* 9. Forms & Telegram Deep Linking */
function initForms() {
  const forms = document.querySelectorAll('form[data-action="lead"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'Не указано';
      const tg = form.querySelector('[name="telegram"]')?.value || 'Не указан';
      const vert = form.querySelector('[name="vertical"]')?.value || 'Любая вертикаль';
      const budget = form.querySelector('[name="budget"]')?.value || 'Не указан';

      const msg = encodeURIComponent(
        `🍀 Привет, Clover Team! Хотим запустить связку.\n\n` +
        `👤 Имя: ${name}\n` +
        `✈️ Telegram: ${tg}\n` +
        `🎯 Направление: ${vert}\n` +
        `💰 Бюджет: ${budget}\n\n` +
        `Жду обратной связи и медиаплана!`
      );

      const alertBox = form.parentElement.querySelector('.form-done-alert');
      if (alertBox) {
        form.style.display = 'none';
        alertBox.style.display = 'block';

        const btn = alertBox.querySelector('.tg-launch-link');
        if (btn) {
          btn.href = `https://t.me/clover_team_lead?text=${msg}`;
        }
      }
    });
  });
}

/* 10. Clipboard Copy */
function initClipboard() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const text = el.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        const orig = el.textContent;
        el.textContent = 'Скопировано ✓';
        setTimeout(() => {
          el.textContent = orig;
        }, 2000);
      });
    });
  });
}
