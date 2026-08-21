/**
 * AuraBeat Intro Manager
 * Central coordinator and state machine for all modular intro processes:
 * 1. Subsystem Engine Pre-Loader (stage-loader)
 * 2. Title Intro Reveal (stage-intro)
 * 3. System Optimization & BeatMap Indexer (stage-pre-benchmark)
 * 4. Multi-Pass Diagnostic Benchmark (stage-benchmark)
 * 5. Spatial Environment UI Selection (stage-ui-select)
 */

class IntroManager {
  constructor() {
    this.modules = {};
    this.currentStageId = 'stage-loader';
    this.hasDismissedFoss = false;
    this.getCurrentProfileCallback = null;
    this.getCurrentDeviceKeyCallback = null;
    this.isBenchmarkSkipped = false;
    this.missingModules = [];
    this.stageOrder = [
      'stage-loader',
      'stage-intro',
      'stage-pre-benchmark',
      'stage-benchmark',
      'stage-ui-select',
      'stage-sandbox',
      'stage-gamv'
    ];
  }

  registerModule(moduleObj) {
    if (!moduleObj || !moduleObj.id) return;
    this.modules[moduleObj.id] = moduleObj;
  }

  setProfileProvider(fn) {
    this.getCurrentProfileCallback = fn;
  }

  setDeviceKeyProvider(fn) {
    this.getCurrentDeviceKeyCallback = fn;
  }

  getCurrentDeviceKey() {
    if (this.getCurrentDeviceKeyCallback) {
      return this.getCurrentDeviceKeyCallback();
    }
    return 'xreal';
  }

  getCurrentProfile() {
    if (this.getCurrentProfileCallback) {
      return this.getCurrentProfileCallback();
    }
    return null;
  }

  renderStages(viewportElement) {
    if (!viewportElement) return;

    const targetContainer = document.getElementById('spatial-world-rig') || viewportElement;

    // Check if stages are already present in DOM or render modular templates
    Object.values(this.modules).forEach(mod => {
      let existingSection = document.getElementById(mod.id);
      if (!existingSection && typeof mod.getTemplate === 'function') {
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = mod.getTemplate().trim();
        const newSection = tempContainer.firstElementChild;
        targetContainer.appendChild(newSection);
      }
    });

    // Initialize events for all registered modules
    Object.values(this.modules).forEach(mod => {
      if (typeof mod.init === 'function') {
        mod.init(this);
      }
    });
  }

  getNextAvailableStage(targetStageId) {
    const startIndex = this.stageOrder.indexOf(targetStageId);
    if (startIndex === -1) return 'stage-ui-select';

    for (let i = startIndex; i < this.stageOrder.length; i++) {
      const stageId = this.stageOrder[i];
      if (stageId === 'stage-loader' || stageId === 'stage-ui-select' || stageId === 'stage-dashboard' || this.modules[stageId]) {
        return stageId;
      }
    }
    return 'stage-ui-select';
  }

  skipToUiSelection() {
    this.isBenchmarkSkipped = true;
    this.switchStage('stage-ui-select');
  }

  updateUncalibratedWarning() {
    const banner = document.getElementById('uncalibrated-warning-banner');
    if (banner) {
      if (this.isBenchmarkSkipped || !this.modules['stage-benchmark']) {
        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }
    }
  }

  switchStage(targetStageId) {
    let resolvedStageId = this.getNextAvailableStage(targetStageId);

    if ((targetStageId === 'stage-benchmark' && resolvedStageId !== 'stage-benchmark') ||
        (!this.modules['stage-benchmark'] && resolvedStageId === 'stage-ui-select')) {
      this.isBenchmarkSkipped = true;
    }

    this.stageOrder.forEach(id => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.classList.add('hidden');
        elem.classList.remove('active');
      }
    });

    const targetElem = document.getElementById(resolvedStageId);
    if (targetElem) {
      targetElem.classList.remove('hidden');
      setTimeout(() => {
        targetElem.classList.add('active');
      }, 50);

      this.currentStageId = resolvedStageId;

      if (resolvedStageId === 'stage-ui-select') {
        this.updateUncalibratedWarning();
      }

      // Trigger stage specific lifecycle start methods
      const mod = this.modules[resolvedStageId];
      if (mod && typeof mod.start === 'function') {
        mod.start();
      }
    }
  }

  onLoaderFinished() {
    const fossModal = document.getElementById('foss-modal');
    if (!this.hasDismissedFoss && fossModal) {
      fossModal.classList.remove('hidden');
    } else {
      this.switchStage('stage-intro');
    }
  }

  startSequence() {
    this.switchStage('stage-loader');
    if (this.modules['stage-loader'] && typeof this.modules['stage-loader'].start === 'function') {
      this.modules['stage-loader'].start();
    }
  }
}

window.AuraBeatIntroManager = new IntroManager();

// Automatically register all loaded intro modules
if (window.AuraBeatIntroModules) {
  Object.values(window.AuraBeatIntroModules).forEach(mod => {
    window.AuraBeatIntroManager.registerModule(mod);
  });
}
