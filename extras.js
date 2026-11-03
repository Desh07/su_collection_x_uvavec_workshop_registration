/* Landing-page extras: sticky CTA bar and keyboard-aware registration popup. */
(() => {
  const bar = document.getElementById('sticky-cta');
  const hero = document.querySelector('.hero-actions') || document.querySelector('.campaign-hero');
  if (!bar || !hero || !('IntersectionObserver' in window)) return;
  const button = bar.querySelector('button');
  new IntersectionObserver(([entry]) => {
    const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show));
    if (button) button.tabIndex = show ? 0 : -1;
  }).observe(hero);
})();

/* Fit the popup to the visible area above Android/iOS keyboards. Dynamic vh
   alone tracks browser chrome, but does not reliably subtract the keyboard. */
(() => {
  const viewport = window.visualViewport;
  let frame = 0;
  function update() {
    frame = 0;
    const height = viewport?.height || window.innerHeight;
    document.documentElement.style.setProperty('--quiz-viewport-height', `${Math.max(1, height)}px`);
    document.documentElement.style.setProperty('--quiz-viewport-top', `${Math.max(0, viewport?.offsetTop || 0)}px`);
    const overlay = document.getElementById('quiz-overlay');
    const panel = document.getElementById('quiz-main-panel');
    const input = document.activeElement;
    if (!overlay || overlay.style.display === 'none' || !panel || !input || !panel.contains(input) || !input.matches('input,textarea,select')) return;
    // Scroll only the card body; never move the page or hide the fixed footer.
    const field = input.getBoundingClientRect(), area = panel.getBoundingClientRect();
    if (field.bottom > area.bottom - 12) panel.scrollTop += field.bottom - area.bottom + 12;
    else if (field.top < area.top + 12) panel.scrollTop -= area.top + 12 - field.top;
  }
  function schedule() { if (!frame) frame = window.requestAnimationFrame(update); }
  viewport?.addEventListener('resize', schedule);
  viewport?.addEventListener('scroll', schedule);
  window.addEventListener('resize', schedule);
  document.addEventListener('focusin', schedule);
  schedule();
})();
