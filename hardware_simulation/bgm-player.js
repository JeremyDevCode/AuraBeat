/**
 * AuraBeat - Modular Background Music (BGM) Player & Jukebox
 * Integrates with Core Real-PCM AudioReactiveEngine for sample-accurate
 * silence-gated visualizer telemetry, per-track lifecycle resets, and persistent cache.
 * Default Track: MA:RK - Glow (124 BPM) | Default Volume: 25%
 */

window.AuraBeatHardware = window.AuraBeatHardware || {};

(function () {
  const STORAGE_KEY = 'aurabeat_bgm_profiles_v1';

  const BGM_PLAYLIST = [
    { title: "Glow", artist: "MA：RK", bpm: 124, file: "MA：RK - Glow - House.opus" },
    { title: "I heard you like polyrhythms", artist: "Virtual Riot", bpm: 140, file: "Virtual - Riot - I heard you like polyrhythms.opus" },
    { title: "Senja", artist: "gabriawll", bpm: 118, file: "gabriawll - Senja - Electric.opus" },
    { title: "Shelter", artist: "Porter Robinson", bpm: 100, file: "Porter Robinson - Shelter - Electronic.opus" },
    { title: "Nevada", artist: "Vicetone", bpm: 128, file: "Vicetone - Nevada - Dance.opus" },
    { title: "New Game", artist: "Nitro Fun", bpm: 128, file: "Nitro Fun - New Game - House.opus" },
    { title: "Euphoria", artist: "Cartoon", bpm: 128, file: "Cartoon - Euphoria - Dance.opus" },
    { title: "Control", artist: "Unknown Brain", bpm: 110, file: "Unknown Brain - Control - Dance.opus" },
    { title: "Marble Machine", artist: "Wintergatan", bpm: 112, file: "Wintergatan - Marble Machine - Pop.opus" },
    { title: "Where You Are", artist: "Rival", bpm: 130, file: "Rival - Where You Are - Electronic.opus" },
    { title: "Light It Up", artist: "Robin Hustin", bpm: 126, file: "Robin Hustin - Light It Up - Dance.opus" },
    { title: "Only Human", artist: "ThatBehavior", bpm: 120, file: "ThatBehavior - Only Human - Electric.opus" },
    { title: "To The Back", artist: "Dirty Palm", bpm: 128, file: "Dirty Palm - To The Back - Dance.opus" },
    { title: "Dragon Curve", artist: "mekaloton", bpm: 132, file: "mekaloton - Dragon Curve - Dance.opus" },
    { title: "Last Line", artist: "mekaloton", bpm: 130, file: "mekaloton - Last Line - Dance.opus" },
    { title: "Specialist Command", artist: "mekaloton", bpm: 128, file: "mekaloton - Specialist Command for Hazard Extraction and Management of Aberrance - Dance.opus" },
    { title: "i think about you", artist: "FAR", bpm: 85, file: "FAR - i think about you not thinking about me Piano Solo - Jazz.opus" },
    { title: "I Don't Know Why", artist: "F_NERA", bpm: 124, file: "F_NERA - I Don't Know Why - Dance.opus" },
    { title: "charlatan", artist: "Joyful", bpm: 116, file: "Joyful - charlatan - Electronic.opus" },
    { title: "Home", artist: "Pretty Patterns", bpm: 96, file: "Pretty Patterns - Home - Folk∕Americana.opus" },
    { title: "Final Hour", artist: "Pure 100%", bpm: 130, file: "Pure 100% - Final Hour (Game Ver.) - K-Pop.opus" },
    { title: "Full Moon 2.0", artist: "RJ Pasin", bpm: 145, file: "RJ Pasin - Full Moon 2.0 - Metal.opus" },
    { title: "Meet The Sniper Theme", artist: "Ram99", bpm: 92, file: "Ram99 - Meet The Sniper Theme (Professional Standards) - Jazz.opus" }
  ];

  class BgmPlayer {
    constructor() {
      this.playlist = BGM_PLAYLIST;
      this.currentTrackIndex = 0;
      this.audio = null;
      this.isPlaying = false;
      this.volume = 0.25;
      this.isShuffle = false;
      this.repeatMode = 'all';

      this.cachedProfiles = this.loadCachedProfiles();
      this.analysisProgress = 0;
      this.isAnalyzed = false;
      this.activeTrackFile = '';
    }

    loadCachedProfiles() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    saveProfile(file, data) {
      this.cachedProfiles[file] = data;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cachedProfiles));
      } catch (e) {}
    }

    init() {
      this.audio = document.getElementById('bgm-audio-node') || new Audio();
      this.audio.preload = 'auto';
      this.audio.volume = this.volume;

      if (window.AuraBeatCore && window.AuraBeatCore.AudioReactiveEngine) {
        window.AuraBeatCore.AudioReactiveEngine.init();
      }

      this.loadTrack(this.currentTrackIndex, false);

      this.audio.addEventListener('ended', () => this.handleTrackEnded());
      this.audio.addEventListener('play', () => {
        if (window.AuraBeatCore && window.AuraBeatCore.AudioReactiveEngine) {
          window.AuraBeatCore.AudioReactiveEngine.ensureContext();
        }
        this.isPlaying = true;
        this.updateUi();
      });
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.updateUi();
      });

      this.bindEvents();

      const unlock = () => { if (!this.isPlaying) this.play(); };
      window.addEventListener('click', unlock, { once: true });
      window.addEventListener('pointerdown', unlock, { once: true });
    }

    bindEvents() {
      const btnPlay = document.getElementById('btn-bgm-play-pause');
      const btnPrev = document.getElementById('btn-bgm-prev');
      const btnNext = document.getElementById('btn-bgm-next');
      const btnShuf = document.getElementById('btn-bgm-shuffle');
      const btnRep = document.getElementById('btn-bgm-repeat');
      const btnDice = document.getElementById('btn-bgm-dice');
      const slider = document.getElementById('slider-bgm-volume');

      if (btnPlay) btnPlay.addEventListener('click', (e) => { e.stopPropagation(); this.toggleAudio(); });
      if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); this.prevTrack(); });
      if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); this.nextTrack(); });
      if (btnShuf) btnShuf.addEventListener('click', (e) => { e.stopPropagation(); this.toggleShuffle(); });
      if (btnRep) btnRep.addEventListener('click', (e) => { e.stopPropagation(); this.cycleRepeatMode(); });
      if (btnDice) btnDice.addEventListener('click', (e) => { e.stopPropagation(); this.randomTrack(); });
      if (slider) slider.addEventListener('input', (e) => this.setVolume(parseFloat(e.target.value) / 100));
    }

    loadTrack(index, autoPlay = true) {
      if (index < 0) index = this.playlist.length - 1;
      if (index >= this.playlist.length) index = 0;
      this.currentTrackIndex = index;

      const track = this.playlist[this.currentTrackIndex];
      this.activeTrackFile = track.file;
      this.audio.src = `intro/Audio/${track.file}`;

      // Clean per-track lifecycle reset
      const cached = this.cachedProfiles[track.file];
      if (cached) {
        this.isAnalyzed = true;
        this.analysisProgress = 100;
      } else {
        this.isAnalyzed = false;
        this.analysisProgress = 0;
      }

      // Notify custom real-PCM reactive engine
      if (window.AuraBeatCore && window.AuraBeatCore.AudioReactiveEngine) {
        window.AuraBeatCore.AudioReactiveEngine.loadTrack(track.file, track.bpm);
      }

      if (autoPlay) this.play(); else this.updateUi();
    }

    play() {
      if (!this.audio) return;
      this.audio.play().then(() => { this.isPlaying = true; this.updateUi(); }).catch(() => {});
    }

    pause() {
      if (this.audio) { this.audio.pause(); this.isPlaying = false; this.updateUi(); }
    }

    toggleAudio() {
      if (this.isPlaying) this.pause(); else this.play();
      return this.isPlaying;
    }

    nextTrack() {
      if (this.isShuffle) this.randomTrack(); else this.loadTrack(this.currentTrackIndex + 1, true);
    }

    prevTrack() {
      if (this.isShuffle) this.randomTrack(); else this.loadTrack(this.currentTrackIndex - 1, true);
    }

    randomTrack() {
      let idx;
      do { idx = Math.floor(Math.random() * this.playlist.length); }
      while (idx === this.currentTrackIndex && this.playlist.length > 1);
      this.loadTrack(idx, true);
    }

    toggleShuffle() { this.isShuffle = !this.isShuffle; this.updateUi(); }

    cycleRepeatMode() {
      this.repeatMode = this.repeatMode === 'all' ? 'one' : (this.repeatMode === 'one' ? 'off' : 'all');
      this.updateUi();
    }

    handleTrackEnded() {
      if (this.repeatMode === 'one') { this.audio.currentTime = 0; this.play(); }
      else if (this.repeatMode === 'all') { this.nextTrack(); }
      else if (this.repeatMode === 'off') {
        if (this.currentTrackIndex < this.playlist.length - 1) this.nextTrack(); else this.pause();
      }
    }

    setVolume(val) {
      this.volume = Math.max(0, Math.min(1, val));
      if (this.audio) this.audio.volume = this.volume;
      this.updateUi();
    }

    getCurrentTrack() { return this.playlist[this.currentTrackIndex]; }

    /**
     * Extracts live acoustic energy from Core AudioReactiveEngine.
     * Silence-gated: returns 0.000 if audio is silent.
     */
    getAudioEnergy() {
      const track = this.getCurrentTrack();
      const trackBpm = (track && track.bpm) ? track.bpm : 124.0;
      const t = (this.audio && this.audio.currentTime) ? this.audio.currentTime : 0;

      let energy = { bass: 0, mid: 0, treble: 0, beatPulse: 1.0, bpm: trackBpm, isSustained: false, rms: 0, isSilent: true };

      if (window.AuraBeatCore && window.AuraBeatCore.AudioReactiveEngine) {
        energy = window.AuraBeatCore.AudioReactiveEngine.getAcousticEnergy(t, this.isPlaying, this.volume);
      }

      const activeBpm = energy.bpm || trackBpm;
      const bpmRatio = activeBpm / 120.0;

      // Live BPM Analysis Badge Progress Update
      if (!this.isAnalyzed && this.isPlaying && !energy.isSilent) {
        this.analysisProgress = Math.min(100, Math.floor((t / 2.5) * 100));
        if (this.analysisProgress >= 100) {
          this.isAnalyzed = true;
          this.saveProfile(track.file, { bpm: activeBpm, locked: true });
          this.updateUi();
        } else {
          this.updateDspBadgeText();
        }
      }

      this.updateSpectrumMeter(energy.bass, energy.mid, energy.treble);
      return { ...energy, bpmRatio };
    }

    updateSpectrumMeter(bass, mid, treble) {
      const elLow = document.getElementById('meter-low');
      const elMid = document.getElementById('meter-mid');
      const elHigh = document.getElementById('meter-high');
      if (elLow) elLow.style.height = `${Math.max(2, Math.min(10, bass * 10))}px`;
      if (elMid) elMid.style.height = `${Math.max(2, Math.min(10, mid * 10))}px`;
      if (elHigh) elHigh.style.height = `${Math.max(2, Math.min(10, treble * 10))}px`;
    }

    updateDspBadgeText() {
      const textEl = document.getElementById('bgm-dsp-badge-text');
      if (textEl && !this.isAnalyzed) textEl.textContent = `Analyzing ${this.analysisProgress}%`;
    }

    updateUi() {
      const track = this.getCurrentTrack();
      const titleEl = document.getElementById('bgm-track-title');
      const artistEl = document.getElementById('bgm-track-artist');
      const playBtn = document.getElementById('btn-bgm-play-pause');
      const volVal = document.getElementById('bgm-volume-val');
      const btnShuf = document.getElementById('btn-bgm-shuffle');
      const btnRep = document.getElementById('btn-bgm-repeat');
      const badgeEl = document.getElementById('bgm-dsp-badge');

      if (titleEl) titleEl.textContent = track ? track.title : 'BGM Track';
      if (artistEl) artistEl.textContent = track ? track.artist : 'AuraBeat';
      if (playBtn) playBtn.innerHTML = this.isPlaying ? '<i class="ri-pause-fill"></i>' : '<i class="ri-play-fill"></i>';
      if (volVal) volVal.textContent = `${Math.round(this.volume * 100)}%`;

      if (btnShuf) btnShuf.classList.toggle('active', this.isShuffle);
      if (btnRep) {
        btnRep.className = `bgm-ctrl-btn bgm-repeat-btn ${this.repeatMode !== 'off' ? 'active-' + this.repeatMode : ''}`;
        btnRep.innerHTML = this.repeatMode === 'one' ? '<i class="ri-repeat-one-line"></i>' : '<i class="ri-repeat-line"></i>';
      }

      if (badgeEl && track) {
        const cached = this.cachedProfiles[track.file];
        const displayBpm = (cached && cached.bpm) ? cached.bpm : track.bpm;
        if (cached) {
          badgeEl.className = 'bgm-dsp-badge cached';
          badgeEl.innerHTML = `<i class="ri-save-3-line"></i><span>${displayBpm} BPM (Saved)</span>`;
        } else if (this.isAnalyzed) {
          badgeEl.className = 'bgm-dsp-badge locked';
          badgeEl.innerHTML = `<i class="ri-checkbox-circle-fill"></i><span>${displayBpm} BPM (Locked)</span>`;
        } else {
          badgeEl.className = 'bgm-dsp-badge analyzing';
          badgeEl.innerHTML = `<i class="ri-loader-4-line spin"></i><span id="bgm-dsp-badge-text">Analyzing ${this.analysisProgress}%</span>`;
        }
      }
    }
  }

  window.AuraBeatHardware.BgmPlayer = new BgmPlayer();
})();
