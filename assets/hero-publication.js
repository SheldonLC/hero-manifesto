(() => {
  const progress = document.querySelector('.reading-progress');
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
  const sections = [...document.querySelectorAll('.canon-section[id]')];
  const revealTargets = [...document.querySelectorAll('.section-inner, .diagram')];

  const updateProgress = () => {
    if (!progress) return;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? window.scrollY / height : 0;
    progress.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  };

  const activeObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    tocLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: [0.05, 0.25, 0.5] });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  sections.forEach((section) => activeObserver.observe(section));
  revealTargets.forEach((target) => {
    target.classList.add('reveal');
    revealObserver.observe(target);
  });

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();

