/**
 * AuraBeat Core Engine - AI-Acoustic Virtual Bass Enhancement (AI-VBE) DSP
 * Overcomes open-ear dipole acoustic cancellation (bass roll-off) via 4th-order
 * Linkwitz-Riley filtering and Non-Linear Device (NLD) harmonic synthesis.
 */

window.AuraBeatCore = window.AuraBeatCore || {};

(function () {
  class AudioDspVbeEngine {
    constructor() {
      this.audioCtx = null;
      this.inputNode = null;
      this.outputNode = null;
      this.vbeActive = true;
      this.currentGenre = 'electronic';

      this.presets = {
        electronic: { cutoff: 80, harmonicGain: 1.4, a1: 0.6, a2: 0.3, a3: 0.1 },
        orchestral: { cutoff: 65, harmonicGain: 1.1, a1: 0.5, a2: 0.35, a3: 0.15 },
        rock: { cutoff: 75, harmonicGain: 1.25, a1: 0.55, a2: 0.3, a3: 0.15 },
        ambient: { cutoff: 60, harmonicGain: 0.9, a1: 0.7, a2: 0.2, a3: 0.1 }
      };
    }

    init(audioContext) {
      if (this.audioCtx) return;
      this.audioCtx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      this.setupGraph();
    }

    setupGraph() {
      if (!this.audioCtx) return;

      this.inputNode = this.audioCtx.createGain();
      this.outputNode = this.audioCtx.createGain();

      // Main High-Pass Stream (preserve vocals, synths, treble)
      this.highPassFilter = this.audioCtx.createBiquadFilter();
      this.highPassFilter.type = 'highpass';
      this.highPassFilter.frequency.value = 85;
      this.highPassFilter.Q.value = 0.707;

      // 4th-Order Linkwitz-Riley Sub-bass Isolation (two cascaded 2nd-order Butterworth filters)
      this.lowPass1 = this.audioCtx.createBiquadFilter();
      this.lowPass1.type = 'lowpass';
      this.lowPass1.frequency.value = 75;
      this.lowPass1.Q.value = 0.707;

      this.lowPass2 = this.audioCtx.createBiquadFilter();
      this.lowPass2.type = 'lowpass';
      this.lowPass2.frequency.value = 75;
      this.lowPass2.Q.value = 0.707;

      // Non-Linear Device (NLD) Harmonic Waveshaper
      this.harmonicShaper = this.audioCtx.createWaveShaper();
      this.harmonicShaper.curve = this.createNldCurve(this.presets.electronic);
      this.harmonicShaper.oversample = '2x';

      // Bandpass filter to confine synthesized harmonics to transducer sweet-spot (100-250Hz)
      this.harmonicBandpass = this.audioCtx.createBiquadFilter();
      this.harmonicBandpass.type = 'bandpass';
      this.harmonicBandpass.frequency.value = 160;
      this.harmonicBandpass.Q.value = 1.2;

      this.vbeHarmonicGain = this.audioCtx.createGain();
      this.vbeHarmonicGain.gain.value = 1.35;

      // Wire Primary High-Pass path
      this.inputNode.connect(this.highPassFilter);
      this.highPassFilter.connect(this.outputNode);

      // Wire Sub-bass NLD Harmonic Synthesis path
      this.inputNode.connect(this.lowPass1);
      this.lowPass1.connect(this.lowPass2);
      this.lowPass2.connect(this.harmonicShaper);
      this.harmonicShaper.connect(this.harmonicBandpass);
      this.harmonicBandpass.connect(this.vbeHarmonicGain);
      this.vbeHarmonicGain.connect(this.outputNode);
    }

    /**
     * Generates Non-Linear Device (NLD) transfer curve:
     * f_harmonics = A1*(2f) + A2*(3f) + A3*(4f) with soft-clipping.
     */
    createNldCurve(preset, n_samples = 2048) {
      const curve = new Float32Array(n_samples);
      const { a1, a2, a3 } = preset;

      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1; // Range [-1, 1]
        // Chebyshev polynomial harmonic generation with tanh soft saturation
        const h2 = 2 * x * x - 1;
        const h3 = 4 * x * x * x - 3 * x;
        const h4 = 8 * x * x * x * x - 8 * x * x + 1;

        const synthetic = a1 * h2 + a2 * h3 + a3 * h4;
        curve[i] = Math.tanh(x * 0.5 + synthetic * 0.5);
      }
      return curve;
    }

    setGenrePreset(genre) {
      const preset = this.presets[genre] || this.presets.electronic;
      this.currentGenre = genre;
      if (this.harmonicShaper) {
        this.harmonicShaper.curve = this.createNldCurve(preset);
      }
      if (this.vbeHarmonicGain) {
        this.vbeHarmonicGain.gain.value = preset.harmonicGain;
      }
      if (this.lowPass1 && this.lowPass2) {
        this.lowPass1.frequency.value = preset.cutoff;
        this.lowPass2.frequency.value = preset.cutoff;
      }
    }

    setVbeEnabled(enabled) {
      this.vbeActive = !!enabled;
      if (this.vbeHarmonicGain) {
        this.vbeHarmonicGain.gain.value = this.vbeActive
          ? (this.presets[this.currentGenre] ? this.presets[this.currentGenre].harmonicGain : 1.3)
          : 0;
      }
    }

    getInput() {
      if (!this.inputNode && this.audioCtx) this.setupGraph();
      return this.inputNode;
    }

    getOutput() {
      if (!this.outputNode && this.audioCtx) this.setupGraph();
      return this.outputNode;
    }
  }

  window.AuraBeatCore.AudioDspVbe = new AudioDspVbeEngine();
})();
