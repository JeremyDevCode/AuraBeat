/**
 * AuraBeat Intro Process - Stage 0: Subsystem Pre-Loader Module
 * Manages engine initialization steps, intro/ module file verification scan,
 * progress fill animations, and transition to Title Intro.
 */

window.AuraBeatIntroModules = window.AuraBeatIntroModules || {};

window.AuraBeatIntroModules.loader = {
  id: 'stage-loader',
  name: 'Subsystem Pre-Loader & Module Scanner',

  getTemplate() {
    return `
      <section id="stage-loader" class="stage active">
        <div class="squircle-card loader-card spring-pop">
          <div class="loader-visual">
            <div class="loader-ring"></div>
            <div class="loader-core"><i class="ri-pulse-fill spin"></i></div>
          </div>
          <h3 class="loader-title">INITIALIZING AURABEAT</h3>
          <p id="loader-status" class="loader-status-text">Scanning intro folder modules...</p>
          <div class="loader-progress-bar">
            <div id="loader-progress-fill" class="loader-progress-fill" style="width: 15%;"></div>
          </div>
          <div id="loader-missing-warning" class="loader-missing-alert hidden">
            <i class="ri-error-warning-line text-yellow"></i>
            <span><strong>Missing Module Alert:</strong> Non-essential intro modules are missing. The engine will auto-skip unavailable stages.</span>
          </div>
          <div id="loader-module-checklist" class="loader-checklist">
            <div class="check-item pending" id="chk-loader"><i class="ri-loader-4-line spin"></i> stage-loader.js</div>
            <div class="check-item pending" id="chk-intro"><i class="ri-loader-4-line spin"></i> stage-intro.js</div>
            <div class="check-item pending" id="chk-indexer"><i class="ri-loader-4-line spin"></i> system-indexer.js</div>
            <div class="check-item pending" id="chk-benchmark"><i class="ri-loader-4-line spin"></i> diagnostic-benchmark.js</div>
            <div class="check-item pending" id="chk-ui"><i class="ri-loader-4-line spin"></i> ui-selection.js</div>
          </div>
        </div>
      </section>
    `;
  },

  init(manager) {
    this.manager = manager;
  },

  start() {
    const loaderStatus = document.getElementById('loader-status');
    const loaderProgressFill = document.getElementById('loader-progress-fill');
    const loaderMissingWarning = document.getElementById('loader-missing-warning');

    if (!loaderStatus || !loaderProgressFill) return;

    const requiredModules = [
      { key: 'loader', file: 'stage-loader.js', label: 'Subsystem Pre-Loader Engine', chkId: 'chk-loader' },
      { key: 'intro', file: 'stage-intro.js', label: 'Title Reveal Module', chkId: 'chk-intro' },
      { key: 'systemIndexer', file: 'system-indexer.js', label: 'System Optimization & BeatMap Indexer', chkId: 'chk-indexer' },
      { key: 'diagnosticBenchmark', file: 'diagnostic-benchmark.js', label: 'Multi-Pass Diagnostic Benchmark', chkId: 'chk-benchmark' },
      { key: 'uiSelection', file: 'ui-selection.js', label: 'Spatial Environment UI Selection', chkId: 'chk-ui' }
    ];

    let missingCount = 0;
    requiredModules.forEach(m => {
      if (!window.AuraBeatIntroModules || !window.AuraBeatIntroModules[m.key]) {
        missingCount++;
      }
    });

    if (missingCount > 0 && loaderMissingWarning) {
      loaderMissingWarning.classList.remove('hidden');
    }

    let currentStep = 0;
    if (this.interval) clearInterval(this.interval);

    const updateChecklist = (item, verified) => {
      const elem = document.getElementById(item.chkId);
      if (elem) {
        if (verified) {
          elem.className = 'check-item verified';
          elem.innerHTML = `<i class="ri-checkbox-circle-fill text-green"></i> intro/${item.file} verified`;
        } else {
          elem.className = 'check-item missing';
          elem.innerHTML = `<i class="ri-alert-fill text-yellow"></i> intro/${item.file} missing (Stage Auto-Skipped)`;
        }
      }
    };

    const steps = [
      { text: "Initializing Low-Latency Spatial Audio Driver...", progress: "15%" },
      { text: "Scanning intro module directory (intro/)...", progress: "30%" },
      ...requiredModules.map((m, idx) => {
        const isVerified = !!(window.AuraBeatIntroModules && window.AuraBeatIntroModules[m.key]);
        const pct = 30 + Math.round(((idx + 1) / requiredModules.length) * 55);
        return {
          text: isVerified ? `[OK] Verified intro/${m.file}` : `[WARNING] intro/${m.file} missing — Skipping stage`,
          progress: `${pct}%`,
          action: () => updateChecklist(m, isVerified)
        };
      }),
      {
        text: missingCount > 0
          ? "Scan complete. Missing module stages will be bypassed automatically."
          : "All required intro process modules verified! Engine ready.",
        progress: "100%"
      }
    ];

    this.interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        loaderStatus.textContent = step.text;
        loaderProgressFill.style.width = step.progress;
        if (typeof step.action === 'function') {
          step.action();
        }
        currentStep++;
      } else {
        clearInterval(this.interval);
        setTimeout(() => {
          if (this.manager) {
            this.manager.onLoaderFinished();
          }
        }, 600);
      }
    }, 380);
  }
};
