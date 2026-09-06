document.addEventListener('DOMContentLoaded', () => {
  // Setup reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.anim').forEach(el => el.classList.add('reduced-motion'));
  }

  // --- Mobile Menu Toggle ---
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMenu() {
    if (!burgerBtn || !mobileMenu || !mobileOverlay) return;
    burgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.remove('hidden');
    mobileOverlay.classList.remove('hidden');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    if (!burgerBtn || !mobileMenu || !mobileOverlay) return;
    burgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.add('hidden');
    mobileOverlay.classList.add('hidden');
    document.body.classList.remove('menu-open');
  }

  if (burgerBtn && mobileMenu && mobileOverlay) {
    burgerBtn.addEventListener('click', () => {
      const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burgerBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 720 && burgerBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  }

  // --- Count Up Animation ---
  const statValues = document.querySelectorAll('.stat-value');

  // easeOutCubic function
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateValue(obj, start, end, duration, startOffset, decimals) {
    if (prefersReducedMotion) {
      obj.innerHTML = end.toFixed(decimals);
      return;
    }
    
    // Wait for start offset
    setTimeout(() => {
      let startTime = null;
      
      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = currentTime - startTime;
        let p = progress / duration;
        if (p > 1) p = 1;
        
        const currentVal = start + (end - start) * easeOutCubic(p);
        obj.innerHTML = currentVal.toFixed(decimals);
        
        if (progress < duration) {
          window.requestAnimationFrame(step);
        } else {
          obj.innerHTML = end.toFixed(decimals);
        }
      }
      
      window.requestAnimationFrame(step);
    }, startOffset);
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger all stats when footer comes into view
        statValues.forEach((stat, i) => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const decimals = parseInt(stat.getAttribute('data-decimals'), 10);
          
          const duration = 1500 + i * 80;
          const startOffset = 480 + i * 90;
          
          animateValue(stat, 0, target, duration, startOffset, decimals);
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const footer = document.querySelector('.stats');
  if (footer) {
    observer.observe(footer);
  }
});
