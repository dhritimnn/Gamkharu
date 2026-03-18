// ─── Gamkharu Loader + Animations ────────────────────────────────────────────

(function() {
  // ─── Styles ────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #gk-loader {
      position: fixed;
      inset: 0;
      background: white;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: opacity 0.4s ease;
    }

    #gk-loader.hide {
      opacity: 0;
      pointer-events: none;
    }

    #gk-loader .gk-dot-row {
      display: flex;
      gap: 8px;
    }

    #gk-loader .gk-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #FF6435;
      animation: gk-bounce 0.9s infinite ease-in-out;
    }

    #gk-loader .gk-dot:nth-child(2) { animation-delay: 0.15s; }
    #gk-loader .gk-dot:nth-child(3) { animation-delay: 0.3s; }

    @keyframes gk-bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40%            { transform: scale(1);   opacity: 1;   }
    }

    #gk-loader .gk-brand {
      margin-top: 16px;
      font-family: "Lexend Deca", sans-serif;
      font-size: 1rem;
      color: #FF6435;
      letter-spacing: 2px;
    }

    /* ── Entrance animation (page load) ── */
    .gk-fade-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }

    .gk-fade-up.gk-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Scroll animation ── */
    .gk-scroll-reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .gk-scroll-reveal.gk-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Stagger delays for grids/rows ── */
    .gk-scroll-reveal:nth-child(2) { transition-delay: 0.08s; }
    .gk-scroll-reveal:nth-child(3) { transition-delay: 0.16s; }
    .gk-scroll-reveal:nth-child(4) { transition-delay: 0.24s; }
    .gk-scroll-reveal:nth-child(5) { transition-delay: 0.32s; }
    .gk-scroll-reveal:nth-child(6) { transition-delay: 0.40s; }
  `;
  document.head.appendChild(style);

  // ─── Loader HTML ───────────────────────────────────────────────────────────
  const loader = document.createElement('div');
  loader.id = 'gk-loader';
  loader.innerHTML = `
    <div class="gk-dot-row">
      <div class="gk-dot"></div>
      <div class="gk-dot"></div>
      <div class="gk-dot"></div>
    </div>
    <div class="gk-brand">GAMKHARU</div>
  `;
  document.body.appendChild(loader);

  // ─── Hide loader + trigger entrance animations ─────────────────────────────
  window.addEventListener('load', () => {
    loader.classList.add('hide');
    setTimeout(() => {
      loader.remove();
      triggerEntranceAnimations();
    }, 400);
  });

  // ─── Entrance: animate navbar, search bar, first visible sections ──────────
  function triggerEntranceAnimations() {
    const targets = document.querySelectorAll('nav, .sticky-top, .carousel, .gk-fade-up');
    targets.forEach((el, i) => {
      el.classList.add('gk-fade-up');
      setTimeout(() => el.classList.add('gk-visible'), i * 100);
    });
    // Start observing scroll elements
    initScrollReveal();
  }

  // ─── Scroll reveal via IntersectionObserver ────────────────────────────────
  function initScrollReveal() {
    // Auto-tag common content blocks for scroll reveal
    const selectors = [
      '#featured > .card',
      '#container > .col',
      '#catagory .col',
      '.cat-section',
      'footer',
      '.p-4 > .card',
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('gk-scroll-reveal')) {
          el.classList.add('gk-scroll-reveal');
        }
      });
    });

    // Also observe anything manually tagged
    const allReveal = document.querySelectorAll('.gk-scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('gk-visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    }, { threshold: 0.12 });

    allReveal.forEach(el => observer.observe(el));
  }

  // ─── Re-run scroll reveal after dynamic content loads ─────────────────────
  // Call this from search.js / index.js after renderProducts / renderFeatured
  window.gkRevealNew = function() {
    const allReveal = document.querySelectorAll('.gk-scroll-reveal:not(.gk-visible)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('gk-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    allReveal.forEach(el => observer.observe(el));
  };

})();
