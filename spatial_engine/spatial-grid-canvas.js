/**
 * AuraBeat Spatial 3D Engine - Smooth Vector Spatial Orbs Visualizer
 * Renders crisp, clean vector gradient orbs floating in 3D spatial space,
 * dynamically reactive to track BPM velocity and discrete frequency bands:
 * - Red Orbs: Reactive to Bass with wide, punchy sustain (+24%)
 * - Purple Orbs: Reactive to Mid harmonics (+16%)
 * - Cyan/Blue Orbs: Reactive to rhythm-locked off-beat Treble (+10%)
 */

window.AuraBeatSpatial = window.AuraBeatSpatial || {};

(function () {
  class SmoothVectorOrb {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.reset();
    }

    reset() {
      this.x = (Math.random() - 0.5) * this.width * 1.5;
      this.y = (Math.random() - 0.5) * this.height * 1.4;
      this.z = Math.random() * 800 + 250;
      this.baseRadius = Math.random() * 8 + 6;
      this.speed = Math.random() * 1.5 + 0.6;
      this.phase = Math.random() * Math.PI * 2;

      const types = ['bass', 'mid', 'treble', 'treble'];
      this.type = types[Math.floor(Math.random() * types.length)];

      if (this.type === 'bass') {
        // Red / Rose / Crimson (Deep Bass Kick)
        this.palette = { core: '#ffffff', mid: '#ff0055', stroke: '#ff3366' };
        this.baseRadius += 2.2;
      } else if (this.type === 'mid') {
        // Purple / Magenta / Violet (Harmonic Mids & Vocals)
        this.palette = { core: '#ffffff', mid: '#7f00ff', stroke: '#a855f7' };
      } else {
        // Cyan / Electric Blue (Crisp Treble & Transients)
        this.palette = { core: '#ffffff', mid: '#00f2fe', stroke: '#4facfe' };
      }
    }

    update(beatPulse, bpmRatio) {
      this.z -= this.speed * (beatPulse || 1.0) * (bpmRatio || 1.0);
      this.phase += 0.02 * (bpmRatio || 1.0);
      if (this.z <= 15) { this.reset(); this.z = 1000; }
    }

    draw(ctx, width, height, cameraOffset, audioBass, audioMid, audioTreble) {
      if (!ctx) return;
      const cx = width / 2 + (cameraOffset ? cameraOffset.offsetX : 0);
      const cy = height / 2 + (cameraOffset ? cameraOffset.offsetY : 0);
      const floatY = Math.sin(this.phase) * 8;
      const screenX = (this.x / this.z) * 420 + cx;
      const screenY = ((this.y + floatY) / this.z) * 420 + cy;
      const depthRatio = 1 - (this.z / 1000);

      let bandEnergy = 0;
      let scaleMult = 0.10;
      if (this.type === 'bass') {
        bandEnergy = audioBass || 0;
        scaleMult = 0.24; // Deeper, wider pulse on Red
      } else if (this.type === 'mid') {
        bandEnergy = audioMid || 0;
        scaleMult = 0.16; // Harmonic resonance on Purple
      } else {
        bandEnergy = audioTreble || 0;
        scaleMult = 0.10; // Rhythm-locked off-beat micro-shimmer on Cyan
      }

      const radius = Math.max(2.5, (depthRatio * 16 + this.baseRadius) * (1.0 + bandEnergy * scaleMult));
      let alpha = Math.sin(depthRatio * Math.PI) * (0.80 + bandEnergy * 0.15);

      if (screenX >= -40 && screenX <= width + 40 && screenY >= -40 && screenY <= height + 40 && alpha > 0.02) {
        ctx.save();
        ctx.globalAlpha = Math.min(1.0, alpha * (0.88 + bandEnergy * 0.12));
        const gradient = ctx.createRadialGradient(screenX - radius * 0.25, screenY - radius * 0.25, radius * 0.08, screenX, screenY, radius);
        gradient.addColorStop(0, this.palette.core);
        gradient.addColorStop(0.35, this.palette.mid);
        gradient.addColorStop(0.85, this.palette.stroke);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = this.palette.stroke;
        ctx.lineWidth = 1.2 + bandEnergy * 0.4;
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  class SpatialGridCanvas {
    constructor() {
      this.yaw = 0;
      this.pitch = 0;
      this.canvas = null;
      this.ctx = null;
      this.orbs = [];
      this.ORB_COUNT = 24;
    }

    init() {
      this.canvas = document.getElementById('spatial-canvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.orbs = [];
        for (let i = 0; i < this.ORB_COUNT; i++) this.orbs.push(new SmoothVectorOrb(w, h));
      }

      if (window.AuraBeatSpatial.CameraController) {
        window.AuraBeatSpatial.CameraController.onCameraUpdate((camState) => {
          this.yaw = camState.yaw;
          this.pitch = camState.pitch;
        });
      }
    }

    drawSpatialGrid(ctx, width, height, beatPulse) {
      if (!ctx) return;

      const energy = (window.AuraBeatHardware && window.AuraBeatHardware.BgmPlayer)
        ? window.AuraBeatHardware.BgmPlayer.getAudioEnergy()
        : { bass: 0, mid: 0, treble: 0, beatPulse: 1.0, bpmRatio: 1.0 };

      const activePulse = energy.beatPulse || beatPulse || 1.0;
      const bpmRatio = energy.bpmRatio || 1.0;
      const camOffset = { offsetX: -this.yaw * 12.0, offsetY: this.pitch * 10.0 };

      if (!this.orbs || this.orbs.length === 0) {
        this.orbs = [];
        for (let i = 0; i < this.ORB_COUNT; i++) this.orbs.push(new SmoothVectorOrb(width, height));
      }
      this.orbs.forEach(orb => {
        orb.update(activePulse, bpmRatio);
        orb.draw(ctx, width, height, camOffset, energy.bass, energy.mid, energy.treble);
      });
    }
  }

  window.AuraBeatSpatial.SpatialGridCanvas = new SpatialGridCanvas();
})();
