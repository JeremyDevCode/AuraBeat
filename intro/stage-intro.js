/**
 * AuraBeat Intro Process - Stage 1: Title Intro Reveal Module
 * Renders title branding and triggers transition to Pre-Flight Check (System Optimization & Beatmap Indexer).
 */

window.AuraBeatIntroModules = window.AuraBeatIntroModules || {};

window.AuraBeatIntroModules.intro = {
  id: 'stage-intro',
  name: 'Title Intro Reveal',

  getTemplate() {
    return `
      <section id="stage-intro" class="stage hidden">
        <div class="squircle-card intro-card rhythm-pulse-card spring-pop">
          <div class="logo-hero">
            <div class="hero-icon-wrapper squircle">
              <svg class="hero-svg-logo" width="38" height="38" viewBox="0 0 48 48" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00f2fe" />
                    <stop offset="50%" stop-color="#4facfe" />
                    <stop offset="100%" stop-color="#7f00ff" />
                  </linearGradient>
                  <filter id="heroGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <circle cx="24" cy="24" r="20" stroke="url(#heroGrad)" stroke-width="2.5" stroke-dasharray="8 4"
                  opacity="0.9" filter="url(#heroGlow)" />
                <rect x="12" y="20" width="3.5" height="8" rx="1.75" fill="url(#heroGrad)" />
                <rect x="18" y="14" width="3.5" height="20" rx="1.75" fill="url(#heroGrad)" />
                <rect x="24" y="9" width="3.5" height="30" rx="1.75" fill="url(#heroGrad)" />
                <rect x="30" y="16" width="3.5" height="16" rx="1.75" fill="url(#heroGrad)" />
                <rect x="36" y="21" width="3.5" height="6" rx="1.75" fill="url(#heroGrad)" />
              </svg>
            </div>
            <h1 class="hero-title">AURA<span>BEAT</span></h1>
            <div class="rhythm-tag-pill">
              <i class="ri-music-2-line"></i> Spatial Audio Rhythm Engine
            </div>
          </div>

          <div class="intro-actions">
            <button id="btn-to-pre-benchmark" class="btn-primary squircle-btn spring-btn">
              <span>Begin Pre-Flight Check</span>
              <i class="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </section>
    `;
  },

  init(manager) {
    this.manager = manager;
    this.bindEvents();
  },

  bindEvents() {
    const btnToPreBenchmark = document.getElementById('btn-to-pre-benchmark');
    if (btnToPreBenchmark) {
      btnToPreBenchmark.addEventListener('click', () => {
        if (this.manager) {
          this.manager.switchStage('stage-pre-benchmark');
        }
      });
    }
  }
};
