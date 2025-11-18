const sliderSelector = '#KithHeroSlider';

export function initKithHeroSlider(root = document) {
  const slider = root.querySelector(sliderSelector);
  if (!slider) return;

  const slides = slider.querySelectorAll('.kith-slide');
  const dots = slider.querySelectorAll('.kith-dot');
  const prev = slider.querySelector('.kith-prev');
  const next = slider.querySelector('.kith-next');
  let active = 0;

  /**
   * @param {number} index
   */
  function updateSlider(index) {
    if (!slides.length || !dots.length) return;

    const targetSlide = slides[index];
    const targetDot = dots[index];

    if (!targetSlide || !targetDot) return;

    slides.forEach((s) => s.classList.remove('is-active'));
    targetSlide.classList.add('is-active');

    dots.forEach((d) => {
      d.classList.remove('active');
      const progressEl = /** @type {HTMLElement | null} */ (d.querySelector('.progress'));
      if (progressEl) {
        progressEl.style.width = '0%';
        progressEl.style.transition = 'none';
      }
    });

    const progress = /** @type {HTMLElement | null} */ (targetDot.querySelector('.progress'));
    if (!progress) return;
    targetDot.classList.add('active');

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            progress.style.transition = `width 2000ms linear`; // adjust duration visually
            progress.style.width = '100%';
        });
    });
  }

  prev?.addEventListener('click', () => {
    active = (active - 1 + slides.length) % slides.length;
    updateSlider(active);
  });

  next?.addEventListener('click', () => {
    active = (active + 1) % slides.length;
    updateSlider(active);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      active = i;
      updateSlider(active);
    });
  });

  updateSlider(active);
}

document.addEventListener('DOMContentLoaded', () => {
  initKithHeroSlider();
});