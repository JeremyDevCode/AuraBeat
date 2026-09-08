/**
 * AuraBeat - Visualizer Developer Studio Panel Controller
 * Handles two-way reactive binding, profile CRUD operations,
 * window detaching / floating with auto-close drawer, and fluid glide-snap docking.
 */

window.AuraBeatHardware = window.AuraBeatHardware || {};

(function () {
  const SLIDER_CONFIGS = [
    ['slider-line-amp', 'val-line-amp', 'lines', 'amplitude', v => `${Number(v).toFixed(1)}x`],
    ['slider-line-count', 'val-line-count', 'lines', 'barCount', v => `${Math.round(v)}`, parseInt],
    ['slider-line-sens', 'val-line-sens', 'lines', 'sensitivity', v => `${Number(v).toFixed(1)}x`],
    ['slider-line-detail', 'val-line-detail', 'lines', 'detail', v => `${Math.round(v)} nodes`, parseInt],
    ['slider-line-thickness', 'val-line-thickness', 'lines', 'thickness', v => `${Number(v).toFixed(1)}px`],
    ['slider-line-glow', 'val-line-glow', 'lines', 'glow', v => `${Math.round(v)}px`, parseInt],
    ['slider-line-pulse', 'val-line-pulse', 'lines', 'beatPulse', v => `${Number(v).toFixed(1)}x`],
    ['slider-line-gap', 'val-line-gap', 'lines', 'gap', v => `${Math.round(v)}px`, parseInt],
    ['slider-line-smoothing', 'val-line-smoothing', 'lines', 'smoothing', v => `${Number(v).toFixed(2)}`],
    ['slider-line-wavespeed', 'val-line-wavespeed', 'lines', 'waveSpeed', v => `${Number(v).toFixed(1)}x`],
    ['slider-line-length', 'val-line-length', 'lines', 'length', v => `${Math.round(v * 100)}%`],
    ['slider-bias-cyan', 'val-bias-cyan', 'lines', 'spectrumBiasCyan', v => v < 0.45 ? 'Bass Tilt' : (v > 0.55 ? 'Treble Tilt' : 'Balanced')],
    ['slider-bias-pink', 'val-bias-pink', 'lines', 'spectrumBiasPink', v => v < 0.45 ? 'Bass Tilt' : (v > 0.55 ? 'Treble Tilt' : 'Balanced')],
    ['slider-ball-react', 'val-ball-react', 'balls', 'reactivity', v => `${Number(v).toFixed(1)}x`],
    ['slider-ball-smoothing', 'val-ball-smoothing', 'balls', 'smoothing', v => `${Number(v).toFixed(2)}`],
    ['slider-effects-spin', 'val-effects-spin', 'effects', 'spin', v => `${Number(v).toFixed(1)}`],
    ['slider-kaleidoscope', 'val-kaleidoscope', 'effects', 'kaleidoscope', v => (v === 0 ? 'Off' : `${v}-Way`), parseInt],
    ['slider-ball-count', 'val-ball-count', 'balls', 'count', v => `${Math.round(v)}`, parseInt],
    ['slider-ball-size', 'val-ball-size', 'balls', 'size', v => `${Math.round(v)}px`, parseInt],
    ['slider-ball-speed', 'val-ball-speed', 'balls', 'speed', v => `${Number(v).toFixed(1)}x`],
    ['slider-dust-count', 'val-dust-count', 'dust', 'count', v => `${Math.round(v)}`, parseInt],
    ['slider-dust-speed', 'val-dust-speed', 'dust', 'speed', v => `${Number(v).toFixed(1)}x`],
    ['slider-dust-size', 'val-dust-size', 'dust', 'size', v => `${Number(v).toFixed(1)}px`]
  ];

  class VisualizerDevPanel {
    constructor() {
      this.isOpen = false;
      this.isDetached = false;
      this.isDragging = false;
      this.dragOffset = { x: 0, y: 0 };
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      this.initialized = true;
      this.bindToggle();
      this.bindControls();
      this.bindProfileControls();
      this.bindWindowing();

      if (window.AuraBeatSpatial && window.AuraBeatSpatial.VisualizerSettings) {
        window.AuraBeatSpatial.VisualizerSettings.subscribe(p => this.syncUiFromParams(p));
      }
    }

    bindToggle() {
      const btnToggle = document.getElementById('btn-bgm-dev-settings');
      const btnClose = document.getElementById('btn-dev-close');
      const panel = document.getElementById('bgm-dev-panel');
      if (!btnToggle || !panel) return;

      const toggleStudio = (state) => {
        this.isOpen = (state !== undefined) ? state : !this.isOpen;
        panel.classList.toggle('hidden', !this.isOpen);
        btnToggle.classList.toggle('active', this.isOpen);
      };

      btnToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleStudio(); });
      if (btnClose) btnClose.addEventListener('click', (e) => { e.stopPropagation(); toggleStudio(false); });
    }

    bindControls() {
      const vs = window.AuraBeatSpatial ? window.AuraBeatSpatial.VisualizerSettings : null;
      if (!vs) return;

      for (let i = 0; i < SLIDER_CONFIGS.length; i++) {
        const [id, valId, cat, key, fmt, parser] = SLIDER_CONFIGS[i];
        const slider = document.getElementById(id);
        const readout = document.getElementById(valId);
        if (!slider) continue;
        slider.addEventListener('input', (e) => {
          const parsed = parser ? parser(e.target.value) : parseFloat(e.target.value);
          if (readout) readout.textContent = fmt ? fmt(parsed) : e.target.value;
          vs.setParam(cat, key, parsed);
        });
      }

      const selTheme = document.getElementById('select-line-theme');
      if (selTheme) selTheme.addEventListener('change', (e) => vs.setParam('lines', 'colorTheme', e.target.value));
      const selBand = document.getElementById('select-line-band');
      if (selBand) selBand.addEventListener('change', (e) => vs.setParam('lines', 'bandFilter', e.target.value));
    }

    bindProfileControls() {
      const vs = window.AuraBeatSpatial ? window.AuraBeatSpatial.VisualizerSettings : null;
      if (!vs) return;

      const selProfile = document.getElementById('select-dev-profile');
      const btnNew = document.getElementById('btn-profile-new');
      const btnSave = document.getElementById('btn-profile-save');
      const btnDel = document.getElementById('btn-profile-del');
      const btnReset = document.getElementById('btn-dev-reset');
      const rowNew = document.getElementById('dev-profile-new-row');
      const inputName = document.getElementById('input-profile-name');
      const btnConfirm = document.getElementById('btn-profile-confirm');
      const btnCancel = document.getElementById('btn-profile-cancel');

      if (selProfile) selProfile.addEventListener('change', (e) => vs.applyProfile(e.target.value));

      if (btnNew && rowNew && inputName) {
        btnNew.addEventListener('click', (e) => {
          e.stopPropagation();
          rowNew.classList.remove('hidden');
          inputName.value = '';
          inputName.focus();
        });
      }

      if (btnConfirm && rowNew && inputName) {
        btnConfirm.addEventListener('click', (e) => {
          e.stopPropagation();
          const name = inputName.value.trim() || `Profile ${Object.keys(vs.getProfiles()).length + 1}`;
          vs.createProfile(name);
          rowNew.classList.add('hidden');
        });
      }

      if (btnCancel && rowNew) btnCancel.addEventListener('click', (e) => { e.stopPropagation(); rowNew.classList.add('hidden'); });

      if (btnSave) {
        btnSave.addEventListener('click', (e) => {
          e.stopPropagation();
          if (vs.modifyActiveProfile()) {
            btnSave.innerHTML = '<i class="ri-check-line"></i> Saved';
            setTimeout(() => { btnSave.innerHTML = '<i class="ri-save-3-line"></i> Save'; }, 1000);
          }
        });
      }

      if (btnDel) {
        btnDel.addEventListener('click', (e) => {
          e.stopPropagation();
          vs.deleteProfile(vs.getParams().activeProfile);
        });
      }

      if (btnReset) btnReset.addEventListener('click', (e) => { e.stopPropagation(); vs.resetDefaults(); });
    }

    bindWindowing() {
      const panel = document.getElementById('bgm-dev-panel');
      const titlebar = document.getElementById('dev-panel-titlebar');
      const btnDetach = document.getElementById('btn-dev-detach');
      const dockZone = document.getElementById('dev-dock-placeholder');
      if (!panel || !titlebar) return;

      if (btnDetach) {
        btnDetach.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.isDetached) this.dockWindow(); else this.detachWindow();
        });
      }

      if (dockZone) dockZone.addEventListener('click', (e) => { e.stopPropagation(); this.dockWindow(); });

      titlebar.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.dev-action-icon-btn') || e.target.closest('button')) return;
        if (!this.isDetached) this.detachWindow();
        this.isDragging = true;
        titlebar.setPointerCapture(e.pointerId);
        const rect = panel.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
      });

      titlebar.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        let nx = Math.max(10, Math.min(window.innerWidth - panel.offsetWidth - 10, e.clientX - this.dragOffset.x));
        let ny = Math.max(10, Math.min(window.innerHeight - panel.offsetHeight - 10, e.clientY - this.dragOffset.y));
        panel.style.left = `${nx}px`;
        panel.style.top = `${ny}px`;
        panel.style.right = 'auto';

        if (dockZone && !dockZone.classList.contains('hidden')) {
          const dRect = dockZone.getBoundingClientRect();
          const isNear = (e.clientX >= dRect.left - 60 && e.clientX <= dRect.right + 60 &&
                          e.clientY >= dRect.top - 60 && e.clientY <= dRect.bottom + 60);
          dockZone.classList.toggle('snap-highlight', isNear);
        }
      });

      const endDrag = (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        window._suppressDrawerCloseUntil = Date.now() + 800;
        try { titlebar.releasePointerCapture(e.pointerId); } catch (err) {}
        if (dockZone && dockZone.classList.contains('snap-highlight')) {
          dockZone.classList.remove('snap-highlight');
          this.dockWindow();
        }
      };

      titlebar.addEventListener('pointerup', endDrag);
      titlebar.addEventListener('pointercancel', endDrag);
    }

    detachWindow() {
      const panel = document.getElementById('bgm-dev-panel');
      const dockZone = document.getElementById('dev-dock-placeholder');
      const btnDetach = document.getElementById('btn-dev-detach');
      if (!panel) return;

      this.isDetached = true;
      document.body.appendChild(panel);
      panel.classList.add('detached-window');
      panel.classList.remove('hidden');
      if (dockZone) dockZone.classList.remove('hidden');
      if (btnDetach) {
        btnDetach.innerHTML = '<i class="ri-contract-left-line"></i>';
        btnDetach.title = 'Glide and Dock into Drawer';
      }

      if (window.AuraBeatHardware && window.AuraBeatHardware.HardwareDrawer) {
        window.AuraBeatHardware.HardwareDrawer.toggleDrawer(false);
      }
    }

    dockWindow() {
      const panel = document.getElementById('bgm-dev-panel');
      const dockZone = document.getElementById('dev-dock-placeholder');
      if (!panel || !this.isDetached) return;
      window._suppressDrawerCloseUntil = Date.now() + 1000;

      if (window.AuraBeatHardware && window.AuraBeatHardware.HardwareDrawer) {
        window.AuraBeatHardware.HardwareDrawer.toggleDrawer(true);
      }

      requestAnimationFrame(() => {
        const dw = Math.min(620, window.innerWidth * 0.92);
        const zRect = dockZone ? dockZone.getBoundingClientRect() : null;
        const dest = (zRect && zRect.width > 50 && zRect.top > 80) ? zRect : {
          left: Math.round((window.innerWidth - dw) / 2 + 36),
          top: 278,
          width: Math.round(dw - 72)
        };

        panel.style.transition = 'all 0.42s cubic-bezier(0.16, 1, 0.3, 1)';
        panel.style.left = `${dest.left}px`;
        panel.style.top = `${dest.top}px`;
        panel.style.width = `${dest.width}px`;
        panel.style.opacity = '0.9';
        panel.style.transform = 'scale(0.98)';
        panel.style.boxShadow = '0 0 30px rgba(0, 242, 254, 0.5)';

        setTimeout(() => { this.finalizeDock(panel, dockZone); }, 430);
      });
    }

    finalizeDock(panel, dockZone) {
      this.isDetached = false;
      panel.classList.remove('detached-window');
      panel.style.transition = '';
      panel.style.left = '';
      panel.style.top = '';
      panel.style.width = '';
      panel.style.opacity = '';
      panel.style.transform = '';
      panel.style.boxShadow = '';

      if (dockZone && dockZone.parentNode) {
        dockZone.parentNode.insertBefore(panel, dockZone.nextSibling);
        dockZone.classList.add('hidden');
      }

      const btnDetach = document.getElementById('btn-dev-detach');
      if (btnDetach) {
        btnDetach.innerHTML = '<i class="ri-picture-in-picture-2-line"></i>';
        btnDetach.title = 'Detach / Float as Independent Window';
      }
    }

    syncUiFromParams(params) {
      if (!params) return;
      const vs = window.AuraBeatSpatial ? window.AuraBeatSpatial.VisualizerSettings : null;

      for (let i = 0; i < SLIDER_CONFIGS.length; i++) {
        const [id, valId, cat, key, fmt] = SLIDER_CONFIGS[i];
        const input = document.getElementById(id);
        const label = document.getElementById(valId);
        const val = (params[cat] && params[cat][key] !== undefined) ? params[cat][key] : undefined;
        if (input && val !== undefined) input.value = val;
        if (label && val !== undefined) label.textContent = fmt ? fmt(val) : val;
      }

      const selTheme = document.getElementById('select-line-theme');
      if (selTheme && params.lines && params.lines.colorTheme) selTheme.value = params.lines.colorTheme;
      const selBand = document.getElementById('select-line-band');
      if (selBand && params.lines && params.lines.bandFilter) selBand.value = params.lines.bandFilter;

      if (vs) {
        const selProfile = document.getElementById('select-dev-profile');
        const btnSave = document.getElementById('btn-profile-save');
        const btnDel = document.getElementById('btn-profile-del');
        const profiles = vs.getProfiles();
        const activeKey = params.activeProfile || 'default';

        if (selProfile) {
          selProfile.innerHTML = '';
          for (const k of Object.keys(profiles)) {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = profiles[k].name || k;
            if (k === activeKey) opt.selected = true;
            selProfile.appendChild(opt);
          }
        }
        const isCustom = vs.isCustomProfile(activeKey);
        if (btnSave) btnSave.style.display = isCustom ? 'inline-flex' : 'none';
        if (btnDel) btnDel.style.display = isCustom ? 'inline-flex' : 'none';
      }
    }
  }

  window.AuraBeatHardware.VisualizerDevPanel = new VisualizerDevPanel();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AuraBeatHardware.VisualizerDevPanel.init());
  } else {
    window.AuraBeatHardware.VisualizerDevPanel.init();
  }
})();
