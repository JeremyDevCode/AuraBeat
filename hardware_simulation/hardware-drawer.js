/**
 * AuraBeat - Modular Hardware Simulation Drawer Controller
 * Manages Dynamic Island Capsule morphing transitions, hardware profiles, optics toggles, and camera resets.
 */

window.AuraBeatHardware = window.AuraBeatHardware || {};

(function () {
  class HardwareDrawer {
    constructor() {
      this.currentDeviceKey = 'xreal';
      this.isDrawerOpen = false;
      this.onDeviceChangeCallback = null;
    }

    init(onDeviceChange) {
      this.onDeviceChangeCallback = onDeviceChange;
      this.bindEvents();
      this.setDevice(this.currentDeviceKey, false);
    }

    bindEvents() {
      const simCapsule = document.getElementById('sim-dynamic-capsule');
      const btnCloseDrawer = document.getElementById('btn-close-sim-drawer');
      const toggleFovBtn = document.getElementById('toggle-fov-btn');
      const resetCameraBtn = document.getElementById('reset-camera-btn');
      const resetFlowBtn = document.getElementById('reset-flow-btn');
      const openFossBtn = document.getElementById('open-foss-btn');
      const fossModal = document.getElementById('foss-modal');

      if (simCapsule) {
        simCapsule.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleDrawer();
        });
      }

      if (btnCloseDrawer) {
        btnCloseDrawer.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleDrawer(false);
        });
      }

      document.addEventListener('click', (e) => {
        const capsuleRoot = document.getElementById('sim-capsule-root');
        if (this.isDrawerOpen && capsuleRoot && !capsuleRoot.contains(e.target)) {
          this.toggleDrawer(false);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isDrawerOpen) {
          this.toggleDrawer(false);
        }
      });

      // Target Hardware Profile Grid
      document.querySelectorAll('.drawer-device-grid .device-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          this.setDevice(pill.dataset.device, true);
        });
      });

      // FOV Lens Frame Toggle
      if (toggleFovBtn) {
        toggleFovBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const arFovFrame = document.getElementById('ar-fov-frame');
          const fovStatusDesc = document.getElementById('fov-status-desc');
          if (arFovFrame) {
            const isHidden = arFovFrame.classList.toggle('hidden');
            toggleFovBtn.classList.toggle('active-btn', !isHidden);
            if (fovStatusDesc) {
              fovStatusDesc.textContent = isHidden ? 'Unclipped View (Full)' : 'Optical Mask ON';
            }
          }
        });
      }

      // 3D Camera Reset
      if (resetCameraBtn) {
        resetCameraBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.AuraBeatSpatial && window.AuraBeatSpatial.CameraController) {
            window.AuraBeatSpatial.CameraController.resetCamera();
          }
        });
      }

      // Restart Flow
      if (resetFlowBtn) {
        resetFlowBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.AuraBeatIntroManager) {
            window.AuraBeatIntroManager.startSequence();
          }
        });
      }

      // FOSS PoC Notice
      if (openFossBtn && fossModal) {
        openFossBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          fossModal.classList.remove('hidden');
        });
      }
    }

    toggleDrawer(forceState) {
      const capsuleRoot = document.getElementById('sim-capsule-root');
      const drawer = document.getElementById('sim-control-drawer');
      if (!drawer) return;

      this.isDrawerOpen = (forceState !== undefined) ? forceState : !this.isDrawerOpen;
      drawer.classList.toggle('hidden', !this.isDrawerOpen);
      if (capsuleRoot) capsuleRoot.classList.toggle('drawer-open', this.isDrawerOpen);
    }

    getProfile(key) {
      return (window.AuraBeatHardware && window.AuraBeatHardware.getProfile)
        ? window.AuraBeatHardware.getProfile(key || this.currentDeviceKey)
        : { name: 'XREAL Aura', dFov: '70°', activeClass: 'fov-xreal-active', fovClass: 'fov-xreal', text: 'XREAL Aura (70°)', ppdVal: 31.5 };
    }

    setDevice(deviceKey, triggerRestart = true) {
      if (deviceKey === this.currentDeviceKey && triggerRestart) return;
      this.currentDeviceKey = deviceKey;

      const profile = this.getProfile(deviceKey);
      const isLowPpd = (profile.ppdVal < 30);
      const appContainer = document.getElementById('app');
      const arFovFrame = document.getElementById('ar-fov-frame');
      const fovDeviceName = document.getElementById('fov-device-name');
      const capsuleDeviceName = document.getElementById('capsule-device-name');
      const restartModal = document.getElementById('restart-modal');
      const restartModalMsg = document.getElementById('restart-modal-msg');

      document.body.className = `fov-${deviceKey}-active ${isLowPpd ? 'low-ppd-mode' : ''}`;
      if (appContainer) appContainer.className = `app-container fov-${deviceKey}-active ${isLowPpd ? 'low-ppd-mode' : ''}`;

      document.documentElement.style.setProperty('--current-fov-deg', profile.dFov);
      document.documentElement.style.setProperty('--current-hardware-ppd', `${profile.ppdVal}`);

      if (arFovFrame) {
        arFovFrame.className = `fov-frame ${profile.fovClass} ${arFovFrame.classList.contains('hidden') ? 'hidden' : ''}`;
      }
      if (fovDeviceName) fovDeviceName.textContent = profile.text;
      if (capsuleDeviceName) capsuleDeviceName.textContent = `${profile.name} (${profile.dFov})`;

      document.querySelectorAll('.drawer-device-grid .device-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.device === deviceKey);
      });

      if (window.AuraBeatIntroModules && window.AuraBeatIntroModules.diagnosticBenchmark) {
        if (typeof window.AuraBeatIntroModules.diagnosticBenchmark.resetBenchmarkState === 'function') {
          window.AuraBeatIntroModules.diagnosticBenchmark.resetBenchmarkState();
        }
      }

      if (typeof this.onDeviceChangeCallback === 'function') {
        this.onDeviceChangeCallback(deviceKey, profile);
      }

      if (triggerRestart && restartModal && restartModalMsg) {
        restartModalMsg.textContent = `Hardware profile changed to ${profile.name}. Re-calibrating FOV optics & restarting sequence...`;
        restartModal.classList.remove('hidden');
        setTimeout(() => {
          restartModal.classList.add('hidden');
          if (window.AuraBeatIntroManager) window.AuraBeatIntroManager.startSequence();
        }, 1200);
      }
    }
  }

  window.AuraBeatHardware.HardwareDrawer = new HardwareDrawer();
})();
