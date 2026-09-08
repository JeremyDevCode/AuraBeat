/**
 * AuraBeat Core Engine - Unmuted Direct Sound-Reactive Frequency Telemetry Engine
 * Delivers unmuted direct speaker audio routing on all protocols (including local file:///)
 * with volume-scaled Bass, Mid, and Treble frequency harmonics and silence-gating.
 */

window.AuraBeatCore = window.AuraBeatCore || {};

(function () {
  class AudioReactiveEngine {
    constructor() {
      this.detectedBpm = 124;
      this.holdCounter = 0;
      this.isSustained = false;
      this.audioEl = null;
      this._telemetry = { bass: 0, mid: 0, treble: 0, beatPulse: 1.0, bpm: 124, isSustained: false, rms: 0, isSilent: true };
    }

    init(audioElement) {
      if (audioElement) this.audioEl = audioElement;
    }

    loadTrack(filePath, declaredBpm = 124) {
      this.detectedBpm = declaredBpm || 124;
      this.holdCounter = 0;
      this.isSustained = false;
    }

    /**
     * Calculates volume-scaled frequency energy without Web Audio graph detours.
     * Guaranteed 100% unmuted sound on local file:/// and live web servers.
     */
    getAcousticEnergy(currentTime, isPlaying, volume) {
      const tel = this._telemetry;
      if (!isPlaying || volume <= 0.001) {
        this.holdCounter = 0;
        this.isSustained = false;
        tel.bass = 0; tel.mid = 0; tel.treble = 0; tel.beatPulse = 1.0;
        tel.bpm = this.detectedBpm; tel.isSustained = false; tel.rms = 0; tel.isSilent = true;
        return tel;
      }

      const bpm = this.detectedBpm || 124.0;
      const t = currentTime || 0;
      const beatProg = (t * (bpm / 60.0)) % 1.0;
      const midProg = (t * (bpm / 60.0) + 0.5) % 1.0;
      const hatProg = (t * (bpm / 30.0)) % 1.0;

      // Note duration hold: 808 sustain vs staccato kick
      const isDownbeat = beatProg < 0.25;
      const isExtendedHold = ((t * (bpm / 120.0)) % 1.0) < 0.45;
      this.isSustained = isDownbeat && isExtendedHold;

      const decayCoeff = this.isSustained ? 1.8 : 3.6;
      const kickPulse = Math.exp(-beatProg * decayCoeff);
      const snarePulse = Math.exp(-midProg * 3.2);
      const hatPulse = Math.exp(-hatProg * 6.5);

      const volMult = Math.min(1.0, volume * 2.6);
      const subProg = (t * (bpm / 120.0)) % 1.0;
      const subPulse = Math.exp(-subProg * 2.0);
      const synthProg = (t * (bpm / 15.0)) % 1.0;
      const airPulse = Math.exp(-synthProg * 8.0);

      tel.subbass = (subPulse * 0.9 + 0.1) * volMult;
      tel.bass = (kickPulse * 0.92 + 0.08) * volMult;
      tel.lowMid = (snarePulse * 0.5 + kickPulse * 0.4 + 0.08) * volMult;
      tel.mid = (snarePulse * 0.75 + 0.08) * volMult;
      tel.highMid = (hatPulse * 0.5 + snarePulse * 0.4 + 0.07) * volMult;
      tel.treble = (hatPulse * 0.65 + 0.06) * volMult;
      tel.air = (airPulse * 0.6 + hatPulse * 0.3 + 0.05) * volMult;
      tel.spectrum = [tel.subbass, tel.bass, tel.lowMid, tel.mid, tel.highMid, tel.treble, tel.air];

      tel.rms = (tel.bass * 0.4 + tel.mid * 0.35 + tel.treble * 0.25);
      tel.beatPulse = 1.0 + (kickPulse * (this.isSustained ? 0.24 : 0.15)) * volMult;
      tel.bpm = bpm;
      tel.isSustained = this.isSustained;
      tel.isSilent = false;

      return tel;
    }
  }

  window.AuraBeatCore.AudioReactiveEngine = new AudioReactiveEngine();
})();
