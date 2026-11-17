/**
 * CLOVER TEAM — STUDIO INTERACTIONS & LOGIC
 * Minimalist, high-performance, non-template architecture.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initCasesSlider();
  initRotatingStudioBanner();
  initModal();
  initFormHandlers();
  initClipboardCopy();
});

/* 1. Header scroll detection */
function initHeader() {
  const header = document.querySelector('.studio-header');
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
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.studio-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });

  nav.querySelectorAll('.studio-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.textContent = '☰';
    });
  });
}

/* 3. Editorial Cases Slider */
function initCasesSlider() {
  const track = document.querySelector('.cases-editorial-track');
  const prevBtn = document.querySelector('.nav-arrow-btn.prev');
  const nextBtn = document.querySelector('.nav-arrow-btn.next');
  if (!track) return;

  const getStep = () => {
    const card = track.querySelector('.case-editorial-card');
    return card ? card.offsetWidth + 24 : 420;
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });
  }
}

/* 4. Rotating Studio Corner Alert / Hot Case Ticker */
function initRotatingStudioBanner() {
  const banner = document.getElementById('rotating-studio-banner');
  if (!banner) return;

  const items = banner.querySelectorAll('.banner-item');
  const prevBtn = banner.querySelector('.banner-btn-prev');
  const nextBtn = banner.querySelector('.banner-btn-next');
  const closeBtn = banner.querySelector('.banner-btn-close');
  const expandBtn = banner.querySelector('.banner-expand-trigger');
  const progressFill = banner.querySelector('.banner-progress-fill');

  let activeIndex = 0;
  const cycleTime = 5500;
  let timer = null;
  let progressInterval = null;
  let startTime = null;

  function setSlide(idx) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === idx);
    });
    runProgress();
  }

  function advance() {
    activeIndex = (activeIndex + 1) % items.length;
    setSlide(activeIndex);
  }

  function regress() {
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    setSlide(activeIndex);
  }

  function runProgress() {
    clearInterval(progressInterval);
    clearTimeout(timer);
    if (progressFill) progressFill.style.width = '0%';

    startTime = Date.now();
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / cycleTime) * 100, 100);
      if (progressFill) progressFill.style.width = `${pct}%`;

      if (elapsed >= cycleTime) {
        clearInterval(progressInterval);
        advance();
      }
    }, 50);
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); advance(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); regress(); });

  banner.addEventListener('mouseenter', () => clearInterval(progressInterval));
  banner.addEventListener('mouseleave', () => {
    if (!banner.classList.contains('minimized')) runProgress();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      banner.classList.add('minimized');
      clearInterval(progressInterval);
    });
  }

  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      banner.classList.remove('minimized');
      runProgress();
    });
  }

  // Links click smooth scroll
  banner.querySelectorAll('.banner-item-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const casesSec = document.getElementById('cases');
      casesSec?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  setSlide(0);
}

/* 5. Minimalist Modal Dialog */
function initModal() {
  const modal = document.getElementById('consult-modal');
  const triggers = document.querySelectorAll('.trigger-consult-modal');
  const dismissBtn = document.querySelector('.modal-dismiss-btn');
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

  if (dismissBtn) dismissBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* 6. Form Handlers & Telegram Direct Link */
function initFormHandlers() {
  const forms = document.querySelectorAll('form[data-form="brief"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'Не указано';
      const tg = form.querySelector('[name="telegram"]')?.value || 'Не указан';
      const task = form.querySelector('[name="task"]')?.value || 'Полный комплекс услуг';
      const budget = form.querySelector('[name="budget"]')?.value || 'Не указан';

      const text = encodeURIComponent(
        `Привет, Clover Team! Хотим обсудить проект.\n\n` +
        `• Имя / Контакт: ${name}\n` +
        `• Telegram: ${tg}\n` +
        `• Задача: ${task}\n` +
        `• Бюджет / Масштаб: ${budget}`
      );

      const alertBox = form.parentElement.querySelector('.form-alert-success');
      if (alertBox) {
        form.style.display = 'none';
        alertBox.style.display = 'block';

        const directLink = alertBox.querySelector('.direct-tg-link');
        if (directLink) {
          directLink.href = `https://t.me/clover_team_lead?text=${text}`;
        }
      }
    });
  });
}

/* 7. Clipboard Copy */
function initClipboardCopy() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const val = el.getAttribute('data-copy');
      navigator.clipboard.writeText(val).then(() => {
        const original = el.textContent;
        el.textContent = 'Скопировано ✓';
        setTimeout(() => {
          el.textContent = original;
        }, 1800);
      });
    });
  });
}
