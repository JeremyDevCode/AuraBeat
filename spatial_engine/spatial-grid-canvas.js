/**
 * AuraBeat Spatial 3D Engine - Full-Audio Spectrum Harmonic Strings & Orbs
 * Renders full-frequency spectral wave dispersion across all lines with configurable
 * Bass/Treble tilt per color line, dynamic length scaling, and spectral particle orbs.
 */

window.AuraBeatSpatial = window.AuraBeatSpatial || {};

(function () {
  const MAX_DETAIL_NODES = 24;

  const THEMES = {
    neon: { bass: { stroke: '#ff0055', highlight: '#ff3366', glow: 'rgba(255,0,85,0.45)' }, treble: { stroke: '#ffffff', highlight: '#00f2fe', glow: 'rgba(0,242,254,0.45)' } },
    cyan: { bass: { stroke: '#00f2fe', highlight: '#4facfe', glow: 'rgba(0,242,254,0.5)' }, treble: { stroke: '#e0f7fa', highlight: '#00e5ff', glow: 'rgba(0,229,255,0.45)' } },
    crimson: { bass: { stroke: '#ff1744', highlight: '#ff5252', glow: 'rgba(255,23,68,0.5)' }, treble: { stroke: '#ff9100', highlight: '#ffd700', glow: 'rgba(255,145,0,0.45)' } },
    amber: { bass: { stroke: '#ffab00', highlight: '#ffd600', glow: 'rgba(255,171,0,0.5)' }, treble: { stroke: '#fff8e1', highlight: '#ffe57f', glow: 'rgba(255,229,127,0.45)' } },
    emerald: { bass: { stroke: '#00e676', highlight: '#69f0ae', glow: 'rgba(0,230,118,0.5)' }, treble: { stroke: '#b9f6ca', highlight: '#00b0ff', glow: 'rgba(105,240,174,0.45)' } },
    monochrome: { bass: { stroke: '#ffffff', highlight: '#cfd8dc', glow: 'rgba(255,255,255,0.4)' }, treble: { stroke: '#eceff1', highlight: '#90a4ae', glow: 'rgba(207,216,220,0.35)' } }
  };

  class SmoothVectorOrb {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.reset();
    }

    reset() {
      this.x = (Math.random() - 0.5) * this.width * 1.8;
      this.y = (Math.random() - 0.5) * this.height * 1.4;
      this.z = Math.random() * 850 + 250;
      this.baseRadius = Math.random() * 7 + 4;
      this.speed = Math.random() * 1.4 + 0.6;
      this.phase = Math.random() * Math.PI * 2;
      const types = ['bass', 'mid', 'treble'];
      this.type = types[Math.floor(Math.random() * types.length)];
      this.palette = this.type === 'bass' ? { core: '#fff', mid: '#ff0055', stroke: '#ff3366' }
        : (this.type === 'mid' ? { core: '#fff', mid: '#7f00ff', stroke: '#a855f7' } : { core: '#fff', mid: '#00f2fe', stroke: '#4facfe' });
    }

    update(beatPulse, bpmRatio, speedScale) {
      this.z -= this.speed * (beatPulse || 1.0) * (bpmRatio || 1.0) * (speedScale || 1.0);
      this.phase += 0.03 * (bpmRatio || 1.0);
      if (this.z <= 20) { this.reset(); this.z = 1000; }
    }

    draw(ctx, width, height, camOffset, energy, sizeMult, ballCfg) {
      if (!ctx) return;
      const cx = width / 2 + (camOffset ? camOffset.offsetX : 0);
      const cy = height / 2 + (camOffset ? camOffset.offsetY : 0);
      const reactMult = (ballCfg && ballCfg.reactivity !== undefined) ? ballCfg.reactivity : 1.2;

      let rawBand = 0;
      if (energy && !energy.isSilent) {
        rawBand = (this.type === 'bass' ? (energy.bass || 0) : (this.type === 'mid' ? (energy.mid || 0) : (energy.treble || 0))) * reactMult;
      }
      const sFactor = (ballCfg && ballCfg.smoothing !== undefined) ? ballCfg.smoothing : 0.35;
      this.smoothEnergy = (this.smoothEnergy !== undefined) ? (this.smoothEnergy * (1.0 - sFactor) + rawBand * sFactor) : rawBand;
      const bandEnergy = this.smoothEnergy;

      const depthRatio = 1 - (this.z / 1000);
      const floatY = Math.sin(this.phase) * (6 + bandEnergy * 16);
      const screenX = (this.x / this.z) * 420 + cx;
      const screenY = ((this.y + floatY) / this.z) * 420 + cy;

      const radius = Math.max(2.0, (depthRatio * 14 + this.baseRadius) * (sizeMult || 1.0) * (1.0 + bandEnergy * 0.7));
      const nearAlpha = this.z < 120 ? Math.max(0, (this.z - 20) / 100) : 1.0;
      const alpha = Math.sin(depthRatio * Math.PI) * (0.7 + bandEnergy * 0.3) * nearAlpha;
      if (alpha <= 0.01) return;

      ctx.save();
      ctx.globalAlpha = alpha;
      const grad = ctx.createRadialGradient(screenX - radius * 0.25, screenY - radius * 0.25, radius * 0.08, screenX, screenY, radius);
      grad.addColorStop(0, this.palette.core); grad.addColorStop(0.35, this.palette.mid);
      grad.addColorStop(0.85, this.palette.stroke); grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = this.palette.stroke; ctx.lineWidth = 1.0 + bandEnergy * 1.5;
      if (bandEnergy > 0.3) { ctx.shadowColor = this.palette.stroke; ctx.shadowBlur = bandEnergy * 16 * depthRatio; }
      ctx.stroke(); ctx.restore();
    }
  }

  class HarmonicSpatialString {
    constructor(width, height, type = 'bass', laneIndex = 0) {
      this.width = width;
      this.height = height;
      this.type = type;
      this.laneIndex = laneIndex;
      this.nodes = [];
      this._points = [];
      for (let i = 0; i < MAX_DETAIL_NODES; i++) this._points.push({ x: 0, y: 0 });
      this._sBass = 0; this._sMid = 0; this._sTreble = 0;
      this.reset(500);
    }

    reset(gapVal = 500) {
      this.z = Math.random() * 850 + 350;
      this.speed = Math.random() * 1.5 + 0.8;
      this.phase = Math.random() * Math.PI * 2;
      this.freqSpeed = Math.random() * 0.05 + 0.03;
      const spanHeight = Math.random() * 600 + 2200;
      const topY = -(spanHeight / 2);
      const isLeft = (this.laneIndex % 2 === 0);
      const laneSpread = (Math.floor(this.laneIndex / 2) / 8) * 450;
      const sideDist = 150 + (gapVal || 500) * 0.25 + laneSpread + Math.random() * 60;
      const sideOffset = isLeft ? -sideDist : sideDist;
      this.nodes = [];
      for (let i = 0; i < MAX_DETAIL_NODES; i++) {
        this.nodes.push({ x0: sideOffset, y0: topY + (i / (MAX_DETAIL_NODES - 1)) * spanHeight });
      }
    }

    update(beatPulse, bpmRatio, gapVal, waveSpeed = 1.0, lineSmoothing = 0.4) {
      const s = Math.max(0.05, Math.min(0.95, lineSmoothing !== undefined ? lineSmoothing : 0.4));
      const rhythmRate = Math.max(0.3, 1.35 - s * 0.9);
      this.z -= this.speed * (beatPulse || 1.0) * (bpmRatio || 1.0) * rhythmRate;
      this.phase += this.freqSpeed * (bpmRatio || 1.0) * (waveSpeed || 1.0) * rhythmRate;
      if (this.z <= 80) { this.reset(gapVal); this.z = 1150; }
    }

    draw(ctx, width, height, camOffset, energy, lineCfg, smoothedEnergy) {
      if (!ctx) return;
      const nodeCount = Math.min(MAX_DETAIL_NODES, Math.max(4, lineCfg.detail || 8));
      const cx = width / 2 + (camOffset ? camOffset.offsetX : 0);
      const cy = height / 2 + (camOffset ? camOffset.offsetY : 0);
      const depthRatio = 1 - (this.z / 1200);
      if (depthRatio <= 0.05 || depthRatio >= 0.98) return;

      const nearAlpha = this.z < 160 ? Math.max(0, (this.z - 80) / 80) : 1.0;
      const lenMult = (lineCfg && lineCfg.length !== undefined) ? lineCfg.length : 1.0;
      const isPink = (this.type === 'bass');
      const bias = isPink
        ? (lineCfg.spectrumBiasPink !== undefined ? lineCfg.spectrumBiasPink : 0.35)
        : (lineCfg.spectrumBiasCyan !== undefined ? lineCfg.spectrumBiasCyan : 0.65);

      const s = (lineCfg && lineCfg.smoothing !== undefined) ? lineCfg.smoothing : 0.40;
      const lerpRate = Math.max(0.06, 1.0 - s * 0.9);

      let tBass = 0, tMid = 0, tTreble = 0;
      if (energy && !energy.isSilent) {
        const bassWeight = Math.max(0.25, 1.2 - bias * 0.85);
        const trebleWeight = Math.max(0.25, 0.3 + bias * 0.95);
        tBass = (energy.bass || 0) * bassWeight;
        tMid = (energy.mid || 0) * 0.95;
        tTreble = (energy.treble || 0) * trebleWeight;
      }
      this._sBass += (tBass - this._sBass) * lerpRate;
      this._sMid += (tMid - this._sMid) * lerpRate;
      this._sTreble += (tTreble - this._sTreble) * lerpRate;
      const overallEnergy = (this._sBass * 0.45 + this._sMid * 0.35 + this._sTreble * 0.20) * (lineCfg.sensitivity || 1.0);

      const ampBase = 28 * (lineCfg.amplitude || 1.0);
      const pts = this._points;
      const idleSway = Math.sin(this.phase * 0.35) * 3;
      const nodeZ = Math.max(30, this.z);
      const jitterDamp = Math.max(0.15, 1.0 - s * 0.82);

      for (let i = 0; i < nodeCount; i++) {
        const u = i / (nodeCount - 1);
        const n = this.nodes[Math.floor(u * (MAX_DETAIL_NODES - 1))];
        const wLow = Math.max(0, 1.0 - u * 1.5);
        const wMid = Math.sin(u * Math.PI);
        const wHigh = Math.max(0, (u - 0.3) * 1.4);

        const nodeAmp = (this._sBass * wLow * 1.3 + this._sMid * wMid * 1.0 + this._sTreble * wHigh * 0.85) * ampBase;
        const waveDisp = Math.sin(this.phase * 1.2 + i * 0.55) * (nodeAmp + 2)
          + Math.cos(this.phase * 2.5 + i * 1.2) * (this._sMid * ampBase * 0.4 * jitterDamp)
          + Math.sin(this.phase * 4.2 + i * 2.0) * (this._sTreble * ampBase * 0.28 * jitterDamp) + idleSway;
        pts[i].x = ((n.x0 + waveDisp) / nodeZ) * 420 + cx;
        pts[i].y = (((n.y0 * lenMult)) / nodeZ) * 420 + cy;
      }

      const alpha = Math.sin(depthRatio * Math.PI) * (0.65 + overallEnergy * 0.35) * nearAlpha;
      if (alpha <= 0.02) return;

      const theme = THEMES[lineCfg.colorTheme] || THEMES.neon;
      const pal = isPink ? theme.bass : theme.treble;

      ctx.save();
      ctx.globalAlpha = Math.min(1.0, alpha);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < nodeCount - 1; i++) {
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) * 0.5, (pts[i].y + pts[i + 1].y) * 0.5);
      }
      ctx.lineTo(pts[nodeCount - 1].x, pts[nodeCount - 1].y);
      ctx.lineWidth = ((lineCfg.thickness || 2.4) + overallEnergy * 1.6) * (depthRatio * 1.25);
      ctx.strokeStyle = overallEnergy > 0.35 ? pal.highlight : pal.stroke;
      const glowAmt = lineCfg.glow !== undefined ? lineCfg.glow : 12;
      if (glowAmt > 0 && overallEnergy > 0.08) {
        ctx.shadowColor = pal.glow;
        ctx.shadowBlur = (glowAmt * 0.5 + overallEnergy * glowAmt) * depthRatio;
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  class SpatialGridCanvas {
    constructor() {
      this.yaw = 0;
      this.pitch = 0;
      this.orbs = [];
      this.strings = [];
      this.spinAngle = 0.0;
      this.smoothedEnergy = 0.0;
      this._camOffset = { offsetX: 0, offsetY: 0 };
      this._clip = { x: 0, y: 0, w: 0, h: 0, r: 0, init: false };
    }

    init() {
      this.reconcileEntities();
      if (window.AuraBeatSpatial.CameraController) {
        window.AuraBeatSpatial.CameraController.onCameraUpdate((cam) => {
          this.yaw = cam.yaw;
          this.pitch = cam.pitch;
        });
      }
    }

    getSettings() {
      return (window.AuraBeatSpatial && window.AuraBeatSpatial.VisualizerSettings)
        ? window.AuraBeatSpatial.VisualizerSettings.getParams()
        : { lines: { amplitude: 1.0, barCount: 10, sensitivity: 1.0, detail: 8, thickness: 2.4, glow: 12, beatPulse: 1.0, gap: 500, smoothing: 0.4, waveSpeed: 1.0, length: 1.0, spectrumBiasCyan: 0.65, spectrumBiasPink: 0.35, colorTheme: 'neon', enabled: true },
            balls: { count: 18, size: 8, speed: 1.0, reactivity: 1.2, enabled: true },
            effects: { spin: 0.0, kaleidoscope: 0 } };
    }

    reconcileEntities() {
      const cfg = this.getSettings();
      const targetOrbs = cfg.balls.enabled ? (cfg.balls.count || 18) : 0;
      const targetStrings = cfg.lines.enabled ? (cfg.lines.barCount || 10) : 0;
      const w = window.innerWidth, h = window.innerHeight;
      while (this.orbs.length < targetOrbs) this.orbs.push(new SmoothVectorOrb(w, h));
      if (this.orbs.length > targetOrbs) this.orbs.length = targetOrbs;
      while (this.strings.length < targetStrings) {
        const idx = this.strings.length;
        const isPink = (idx % 4 === 0 || idx % 4 === 3);
        this.strings.push(new HarmonicSpatialString(w, h, isPink ? 'bass' : 'treble', idx));
      }
      if (this.strings.length > targetStrings) this.strings.length = targetStrings;
    }

    drawSpatialGrid(ctx, width, height, beatPulse, extraRender) {
      if (!ctx) return;
      const cfg = this.getSettings();
      this.reconcileEntities();
      const energy = (window.AuraBeatHardware && window.AuraBeatHardware.BgmPlayer) ? window.AuraBeatHardware.BgmPlayer.getAudioEnergy() : null;

      let rawEnergy = 0;
      if (energy && !energy.isSilent) {
        rawEnergy = (energy.bass || 0) * 0.5 + (energy.mid || 0) * 0.35 + (energy.treble || 0) * 0.15;
      }

      const smoothAlpha = cfg.lines.smoothing || 0.40;
      this.smoothedEnergy = this.smoothedEnergy * (1.0 - smoothAlpha) + rawEnergy * smoothAlpha;

      const bpmRatio = (energy && energy.bpmRatio) ? energy.bpmRatio : 1.0;
      const activePulse = (energy && energy.beatPulse) ? energy.beatPulse : (beatPulse || 1.0);
      const pulseMult = cfg.lines.beatPulse !== undefined ? cfg.lines.beatPulse : 1.0;
      const effPulse = 1.0 + (activePulse - 1.0) * pulseMult;

      const camYawRad = (this.yaw || 0) * (Math.PI / 180);
      const camPitchRad = (this.pitch || 0) * (Math.PI / 180);
      this._camOffset.offsetX = -Math.sin(camYawRad) * 450;
      this._camOffset.offsetY = Math.sin(camPitchRad) * 450;

      const spinSpeed = cfg.effects.spin || 0.0;
      if (Math.abs(spinSpeed) > 0.001) this.spinAngle += spinSpeed * 0.015;

      const folds = cfg.effects.kaleidoscope || 0;
      const renderPass = () => {
        if (cfg.balls.enabled) {
          for (let i = 0; i < this.orbs.length; i++) {
            this.orbs[i].update(effPulse, bpmRatio, cfg.balls.speed);
            this.orbs[i].draw(ctx, width, height, this._camOffset, energy, cfg.balls.size / 8, cfg.balls);
          }
        }
        if (cfg.lines.enabled) {
          for (let i = 0; i < this.strings.length; i++) {
            this.strings[i].update(effPulse, bpmRatio, cfg.lines.gap, cfg.lines.waveSpeed, cfg.lines.smoothing);
            this.strings[i].draw(ctx, width, height, this._camOffset, energy, cfg.lines, this.smoothedEnergy);
          }
        }
        if (extraRender) extraRender();
      };

      const fovEl = document.getElementById('ar-fov-frame');
      let tX = 0, tY = 0, tW = width, tH = height, tR = 0, shouldClip = false;
      if (fovEl && !fovEl.classList.contains('hidden')) {
        const r = fovEl.getBoundingClientRect();
        if (r.width > 20 && r.height > 20) {
          tX = r.left; tY = r.top; tW = r.width; tH = r.height; tR = 28; shouldClip = true;
        }
      }
      if (!this._clip.init) {
        this._clip = { x: tX, y: tY, w: tW, h: tH, r: tR, init: true };
      } else {
        const l = 0.16;
        this._clip.x += (tX - this._clip.x) * l; this._clip.y += (tY - this._clip.y) * l;
        this._clip.w += (tW - this._clip.w) * l; this._clip.h += (tH - this._clip.h) * l;
        this._clip.r += (tR - this._clip.r) * l;
      }
      const isFull = (this._clip.x <= 2 && this._clip.y <= 2 && this._clip.w >= width - 4 && this._clip.h >= height - 4);
      const needsClip = !isFull || shouldClip;
      if (needsClip) {
        ctx.save(); ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(this._clip.x, this._clip.y, this._clip.w, this._clip.h, Math.max(0, this._clip.r));
        else ctx.rect(this._clip.x, this._clip.y, this._clip.w, this._clip.h);
        ctx.clip();
      }

      if (folds >= 2) {
        const cx = width / 2, cy = height / 2, angleStep = (Math.PI * 2) / folds;
        for (let k = 0; k < folds; k++) {
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(this.spinAngle + k * angleStep);
          if (k % 2 === 1) ctx.scale(1, -1);
          ctx.translate(-cx, -cy); renderPass(); ctx.restore();
        }
      } else if (Math.abs(this.spinAngle) > 0.001) {
        const cx = width / 2, cy = height / 2;
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(this.spinAngle); ctx.translate(-cx, -cy);
        renderPass(); ctx.restore();
      } else {
        renderPass();
      }
      if (needsClip) ctx.restore();
    }
  }

  window.AuraBeatSpatial.SpatialGridCanvas = new SpatialGridCanvas();
})();
