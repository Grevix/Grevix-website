/**
 * Grevix Instant Navigation Engine
 * Eliminates page switching lag by:
 * 1. Using the Speculation Rules API for 0ms prerendering in modern browsers
 * 2. Instant prefetching on hover / touchstart for mobile and desktop
 */
(function() {
  const internalPages = [
    '/',
    '/about',
    '/projects',
    '/events',
    '/community',
    '/blog',
    '/ambassador',
    '/index.html',
    '/about.html',
    '/projects.html',
    '/events.html',
    '/community.html',
    '/blog.html',
    '/ambassador.html'
  ];

  // 1. Inject Speculation Rules API if supported (Chrome, Edge, Opera, Samsung Internet)
  try {
    if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
      const specScript = document.createElement('script');
      specScript.type = 'speculationrules';
      specScript.textContent = JSON.stringify({
        prerender: [
          {
            source: 'list',
            urls: internalPages
          }
        ]
      });
      document.head.appendChild(specScript);
    }
  } catch (e) {}

  // 2. Fast prefetch on touch / hover for instant response on all browsers
  const prefetched = new Set();

  function prefetchUrl(href) {
    if (!href || prefetched.has(href)) return;
    prefetched.add(href);

    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = 'document';
      document.head.appendChild(link);
    } catch (e) {}
  }

  // Preload top nav links immediately when idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      internalPages.slice(0, 7).forEach(prefetchUrl);
    });
  } else {
    setTimeout(() => {
      internalPages.slice(0, 7).forEach(prefetchUrl);
    }, 1200);
  }

  // Prefetch when user touches or hovers a link
  function onInteraction(e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
    prefetchUrl(href);
  }

  document.addEventListener('pointerenter', onInteraction, { passive: true });
  document.addEventListener('touchstart', onInteraction, { passive: true });
})();
