/**
 * AuraBeat Spatial 3D Engine - Visualizer Settings & Profile Engine
 * Manages live parametric visualizer calibration, Default Spatial profile,
 * custom user profiles (Create, Modify, Delete), and localStorage persistence.
 */

window.AuraBeatSpatial = window.AuraBeatSpatial || {};

(function () {
  const SETTINGS_KEY = 'aurabeat_visualizer_settings_v1';
  const PROFILES_KEY = 'aurabeat_visualizer_profiles_v1';

  const DEFAULT_PARAMS = {
    lines: {
      amplitude: 1.0,        // 0.1x to 3.0x displacement scale
      barCount: 10,          // 2 to 32 harmonic strings
      sensitivity: 1.0,      // 0.1x to 3.0x reactivity multiplier
      detail: 8,             // 4 to 20 nodes per string
      thickness: 2.4,        // 0.5px to 8.0px base stroke width
      barWidth: 2.4,         // Alias for thickness / width
      glow: 12,              // 0px to 30px shadowBlur bloom
      beatPulse: 1.0,        // 0.0x to 3.0x pulse kick multiplier
      gap: 500,              // 100px to 1200px corridor gap
      smoothing: 0.40,       // 0.05 to 0.95 EMA energy damping
      waveSpeed: 1.0,        // 0.2x to 3.0x standing wave speed
      length: 1.0,           // 0.3x to 2.2x vertical span / line length
      spectrumBiasCyan: 0.65,// 0.0 (bass) to 1.0 (treble) full-spectrum tilt
      spectrumBiasPink: 0.35,// 0.0 (bass) to 1.0 (treble) full-spectrum tilt
      colorTheme: 'neon',    // 'neon' | 'cyan' | 'crimson' | 'amber' | 'emerald' | 'monochrome'
      bandFilter: 'all',     // 'all' | 'subbass' | 'bass' | 'mids' | 'treble'
      reactMode: 'balanced',
      enabled: true
    },
    balls: {
      count: 18,             // 0 to 60 orbs
      size: 8,               // 2px to 24px base radius
      speed: 1.0,            // 0.2x to 3.0x z-depth velocity
      reactivity: 1.2,       // 0.2x to 3.0x multi-band spectral reactivity
      smoothing: 0.35,       // 0.05 to 0.95 orb float / energy damping
      enabled: true
    },
    dust: {
      count: 28,             // 0 to 80 ambient dust particles
      speed: 1.0,            // 0.1x to 3.0x velocity
      size: 1.5,             // 0.5px to 5.0px particle size
      enabled: true
    },
    effects: {
      spin: 0.0,             // -5.0 to +5.0 rad/s continuous angular rotation
      kaleidoscope: 0        // 0 (off), 2, 3, 4, 6, 8 folds
    },
    activeProfile: 'default'
  };

  const FACTORY_PROFILES = {
    default: {
      name: 'Default Spatial',
      isFactory: true,
      lines: Object.assign({}, DEFAULT_PARAMS.lines),
      balls: Object.assign({}, DEFAULT_PARAMS.balls),
      dust: Object.assign({}, DEFAULT_PARAMS.dust),
      effects: Object.assign({}, DEFAULT_PARAMS.effects)
    }
  };

  class VisualizerSettingsManager {
    constructor() {
      this.listeners = [];
      this.customProfiles = this.loadCustomProfiles();
      this.params = this.loadFromStorage();
    }

    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }

    loadCustomProfiles() {
      try {
        const raw = localStorage.getItem(PROFILES_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    saveCustomProfiles() {
      try {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(this.customProfiles));
      } catch (e) {}
    }

    loadFromStorage() {
      try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return this.clone(DEFAULT_PARAMS);
        const parsed = JSON.parse(raw);
        const validActive = (parsed.activeProfile && (FACTORY_PROFILES[parsed.activeProfile] || this.customProfiles[parsed.activeProfile]))
          ? parsed.activeProfile
          : 'default';

        return {
          lines: Object.assign({}, DEFAULT_PARAMS.lines, parsed.lines || {}),
          balls: Object.assign({}, DEFAULT_PARAMS.balls, parsed.balls || {}),
          dust: Object.assign({}, DEFAULT_PARAMS.dust, parsed.dust || {}),
          effects: Object.assign({}, DEFAULT_PARAMS.effects, parsed.effects || {}),
          activeProfile: validActive
        };
      } catch (e) {
        return this.clone(DEFAULT_PARAMS);
      }
    }

    saveToStorage() {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.params));
      } catch (e) {}
    }

    getParams() {
      return this.params;
    }

    getProfiles() {
      return Object.assign({}, FACTORY_PROFILES, this.customProfiles);
    }

    isCustomProfile(name) {
      return Object.prototype.hasOwnProperty.call(this.customProfiles, name);
    }

    setParam(category, key, value) {
      if (!this.params[category]) return;
      if (typeof this.params[category][key] === 'number') {
        value = Number(value);
      } else if (typeof this.params[category][key] === 'boolean') {
        value = Boolean(value);
      }
      this.params[category][key] = value;
      if (category === 'lines' && key === 'thickness') this.params.lines.barWidth = value;
      if (category === 'lines' && key === 'barWidth') this.params.lines.thickness = value;
      this.saveToStorage();
      this.notify();
    }

    applyProfile(key) {
      const all = this.getProfiles();
      const target = all[key];
      if (!target) return false;

      this.params.lines = Object.assign({}, DEFAULT_PARAMS.lines, target.lines);
      this.params.balls = Object.assign({}, DEFAULT_PARAMS.balls, target.balls);
      this.params.dust = Object.assign({}, DEFAULT_PARAMS.dust, target.dust);
      this.params.effects = Object.assign({}, DEFAULT_PARAMS.effects, target.effects);
      this.params.activeProfile = key;
      this.saveToStorage();
      this.notify();
      return true;
    }

    createProfile(name) {
      const cleanName = (name || '').trim();
      if (!cleanName) return false;
      const key = 'custom_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');

      this.customProfiles[key] = {
        name: cleanName,
        isFactory: false,
        lines: this.clone(this.params.lines),
        balls: this.clone(this.params.balls),
        dust: this.clone(this.params.dust),
        effects: this.clone(this.params.effects)
      };

      this.saveCustomProfiles();
      this.applyProfile(key);
      return key;
    }

    modifyActiveProfile() {
      const active = this.params.activeProfile;
      if (!this.isCustomProfile(active)) return false;

      this.customProfiles[active].lines = this.clone(this.params.lines);
      this.customProfiles[active].balls = this.clone(this.params.balls);
      this.customProfiles[active].dust = this.clone(this.params.dust);
      this.customProfiles[active].effects = this.clone(this.params.effects);

      this.saveCustomProfiles();
      this.saveToStorage();
      this.notify();
      return true;
    }

    deleteProfile(key) {
      if (!this.isCustomProfile(key)) return false;
      delete this.customProfiles[key];
      this.saveCustomProfiles();

      if (this.params.activeProfile === key) {
        this.applyProfile('default');
      } else {
        this.notify();
      }
      return true;
    }

    resetDefaults() {
      this.params = this.clone(DEFAULT_PARAMS);
      this.saveToStorage();
      this.notify();
    }

    subscribe(fn) {
      if (typeof fn === 'function') {
        this.listeners.push(fn);
        fn(this.params);
      }
      return () => {
        this.listeners = this.listeners.filter(l => l !== fn);
      };
    }

    notify() {
      for (let i = 0; i < this.listeners.length; i++) {
        try { this.listeners[i](this.params); } catch (e) {}
      }
    }
  }

  window.AuraBeatSpatial.VisualizerSettings = new VisualizerSettingsManager();
  window.AuraBeatSpatial.FACTORY_PROFILES = FACTORY_PROFILES;
})();
