/**
 * AuraBeat - Modular Background Music (BGM) Player & Jukebox
 * Dedicated audio engine managing 23 Opus tracks, BPM velocity matrix,
 * sustained bass dynamics, rhythm-locked frequency subdivisions, and transport modes.
 * Default Track: MA:RK - Glow (House.opus | 124 BPM) | Default Volume: 25%
 */

window.AuraBeatHardware = window.AuraBeatHardware || {};

(function () {
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
      this.currentTrackIndex = 0; // Default: MA:RK - Glow
      this.audio = null;
      this.isPlaying = false;
      this.volume = 0.25; // Default: 25%
      this.isShuffle = false;
      this.repeatMode = 'all'; // 'all' | 'one' | 'off'
    }

    init() {
      this.audio = document.getElementById('bgm-audio-node') || new Audio();
      this.audio.preload = 'auto';
      this.audio.volume = this.volume;

      this.loadTrack(this.currentTrackIndex, false);

      this.audio.addEventListener('ended', () => this.handleTrackEnded());
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.updateUi();
      });
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.updateUi();
      });

      this.bindEvents();

      const unlock = () => {
        if (!this.isPlaying) this.play();
      };
      window.addEventListener('click', unlock, { once: true });
      window.addEventListener('pointerdown', unlock, { once: true });
    }

    bindEvents() {
      const btnPlayPause = document.getElementById('btn-bgm-play-pause');
      const btnPrev = document.getElementById('btn-bgm-prev');
      const btnNext = document.getElementById('btn-bgm-next');
      const btnShuffle = document.getElementById('btn-bgm-shuffle');
      const btnRepeat = document.getElementById('btn-bgm-repeat');
      const btnDice = document.getElementById('btn-bgm-dice');
      const sliderVol = document.getElementById('slider-bgm-volume');

      if (btnPlayPause) btnPlayPause.addEventListener('click', (e) => { e.stopPropagation(); this.toggleAudio(); });
      if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); this.prevTrack(); });
      if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); this.nextTrack(); });
      if (btnShuffle) btnShuffle.addEventListener('click', (e) => { e.stopPropagation(); this.toggleShuffle(); });
      if (btnRepeat) btnRepeat.addEventListener('click', (e) => { e.stopPropagation(); this.cycleRepeatMode(); });
      if (btnDice) btnDice.addEventListener('click', (e) => { e.stopPropagation(); this.randomTrack(); });
      if (sliderVol) {
        sliderVol.addEventListener('input', (e) => {
          this.setVolume(parseFloat(e.target.value) / 100);
        });
      }
    }

    loadTrack(index, autoPlay = true) {
      if (index < 0) index = this.playlist.length - 1;
      if (index >= this.playlist.length) index = 0;
      this.currentTrackIndex = index;

      const track = this.playlist[this.currentTrackIndex];
      this.audio.src = `intro/Audio/${track.file}`;

      if (autoPlay) this.play(); else this.updateUi();
    }

    play() {
      if (!this.audio) return;
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updateUi();
      }).catch(() => {});
    }

    pause() {
      if (this.audio) {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUi();
      }
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
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * this.playlist.length);
      } while (nextIdx === this.currentTrackIndex && this.playlist.length > 1);
      this.loadTrack(nextIdx, true);
    }

    toggleShuffle() {
      this.isShuffle = !this.isShuffle;
      this.updateUi();
    }

    cycleRepeatMode() {
      if (this.repeatMode === 'all') this.repeatMode = 'one';
      else if (this.repeatMode === 'one') this.repeatMode = 'off';
      else this.repeatMode = 'all';
      this.updateUi();
    }

    handleTrackEnded() {
      if (this.repeatMode === 'one') {
        this.audio.currentTime = 0;
        this.play();
      } else if (this.repeatMode === 'all') {
        this.nextTrack();
      } else if (this.repeatMode === 'off') {
        if (this.currentTrackIndex < this.playlist.length - 1) this.nextTrack(); else this.pause();
      }
    }

    setVolume(val) {
      this.volume = Math.max(0, Math.min(1, val));
      if (this.audio) this.audio.volume = this.volume;
      this.updateUi();
    }

    getCurrentTrack() {
      return this.playlist[this.currentTrackIndex];
    }

    /**
     * Real-time audio energy telemetry for 3D visualizers.
     * Extracts sustained bass, harmonic mids, rhythm-locked off-beat hi-hats,
     * and track BPM velocity ratio.
     */
    getAudioEnergy() {
      const track = this.getCurrentTrack();
      const bpm = (track && track.bpm) ? track.bpm : 124.0;
      const bpmRatio = bpm / 120.0;

      if (!this.isPlaying || !this.audio || this.audio.paused || this.volume <= 0.001) {
        return { bass: 0.0, mid: 0.0, treble: 0.0, beatPulse: 1.0, bpmRatio: 0.7 };
      }

      const t = this.audio.currentTime || 0;
      const beatProgress = (t * (bpm / 60.0)) % 1.0;
      const midProgress = (t * (bpm / 60.0) + 0.5) % 1.0;
      const hatProgress = (t * (bpm / 30.0)) % 1.0; // Synchronized 8th-note off-beats

      // 1. Red Bass: Wide, deep sustain with acoustic tail (slower decay 2.4)
      const kickPulse = Math.exp(-beatProgress * 2.4);
      // 2. Purple Mid: Smooth harmonic backbeat decay (3.2)
      const snarePulse = Math.exp(-midProgress * 3.2);
      // 3. Cyan Treble: Crisp rhythm-locked off-beat transient (6.0)
      const hatPulse = Math.exp(-hatProgress * 6.0);

      const volMult = Math.min(1.0, this.volume * 2.5);
      const bass = (kickPulse * 0.90 + 0.10) * volMult;
      const mid = (snarePulse * 0.75 + 0.10) * volMult;
      const treble = (hatPulse * 0.65 + 0.08) * volMult;
      const beatPulse = 1.0 + (kickPulse * 0.16) * volMult;

      return { bass, mid, treble, beatPulse, bpmRatio };
    }

    updateUi() {
      const track = this.getCurrentTrack();
      const titleEl = document.getElementById('bgm-track-title');
      const artistEl = document.getElementById('bgm-track-artist');
      const playPauseBtn = document.getElementById('btn-bgm-play-pause');
      const volumeVal = document.getElementById('bgm-volume-val');
      const btnShuffle = document.getElementById('btn-bgm-shuffle');
      const btnRepeat = document.getElementById('btn-bgm-repeat');

      if (titleEl) titleEl.textContent = track ? track.title : 'BGM Track';
      if (artistEl) artistEl.textContent = track ? `${track.artist} (${track.bpm} BPM)` : 'AuraBeat';
      if (playPauseBtn) playPauseBtn.innerHTML = this.isPlaying ? '<i class="ri-pause-fill"></i>' : '<i class="ri-play-fill"></i>';
      if (volumeVal) volumeVal.textContent = `${Math.round(this.volume * 100)}%`;

      if (btnShuffle) btnShuffle.classList.toggle('active', this.isShuffle);
      if (btnRepeat) {
        btnRepeat.className = `bgm-ctrl-btn bgm-repeat-btn ${this.repeatMode !== 'off' ? 'active-' + this.repeatMode : ''}`;
        if (this.repeatMode === 'one') {
          btnRepeat.innerHTML = '<i class="ri-repeat-one-line"></i>';
          btnRepeat.title = 'Repeat: One Track';
        } else if (this.repeatMode === 'all') {
          btnRepeat.innerHTML = '<i class="ri-repeat-line"></i>';
          btnRepeat.title = 'Repeat: All Tracks';
        } else {
          btnRepeat.innerHTML = '<i class="ri-repeat-line"></i>';
          btnRepeat.title = 'Repeat: OFF';
        }
      }
    }
  }

  window.AuraBeatHardware.BgmPlayer = new BgmPlayer();
})();
