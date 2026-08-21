/**
 * AuraBeat - HyperOS 2.0 Spatial Rhythm Engine Launcher
 * Central orchestration initializing hardware simulation, BGM player,
 * spatial 3D engine, intro lifecycle, and high-DPI vector particle canvas.
 */

document.addEventListener('DOMContentLoaded', () => {
  const aspectWarningBanner = document.getElementById('aspect-warning-banner');
  const fullscreenLockModal = document.getElementById('fullscreen-lock-modal');
  const btnRequestFullscreen = document.getElementById('btn-request-fullscreen');
  const toastFullscreenBtn = document.getElementById('toast-fullscreen-btn');
  const dismissFossBtn = document.getElementById('dismiss-foss-btn');
  const closeFossBtn = document.getElementById('close-foss-btn');
  const fossModal = document.getElementById('foss-modal');

  function checkAspectRatioAndFullscreen() {
    const isFullscreen = !!document.fullscreenElement;
    const ratio = window.innerWidth / window.innerHeight;
    const isWidescreen169 = (ratio >= 1.58 && ratio <= 1.88);
    if (isFullscreen || isWidescreen169) {
      if (aspectWarningBanner) aspectWarningBanner.classList.add('hidden');
      if (fullscreenLockModal) fullscreenLockModal.classList.add('hidden');
    } else {
      if (aspectWarningBanner) aspectWarningBanner.classList.remove('hidden');
      if (fullscreenLockModal) fullscreenLockModal.classList.remove('hidden');
    }
  }

  function triggerFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  if (btnRequestFullscreen) btnRequestFullscreen.addEventListener('click', triggerFullscreen);
  if (toastFullscreenBtn) toastFullscreenBtn.addEventListener('click', triggerFullscreen);
  window.addEventListener('resize', checkAspectRatioAndFullscreen);
  document.addEventListener('fullscreenchange', checkAspectRatioAndFullscreen);
  checkAspectRatioAndFullscreen();

  // 1. Initialize Modular Background Music Player (Default: MA:RK - Glow)
  if (window.AuraBeatHardware && window.AuraBeatHardware.BgmPlayer) {
    window.AuraBeatHardware.BgmPlayer.init();
  }

  // 2. Initialize Modular Hardware Simulation Drawer
  if (window.AuraBeatHardware && window.AuraBeatHardware.HardwareDrawer) {
    window.AuraBeatHardware.HardwareDrawer.init((deviceKey, profile) => {
      if (window.AuraBeatIntroManager) {
        window.AuraBeatIntroManager.renderStages(document.querySelector('.stage-viewport'));
      }
    });
  }

  // 3. Initialize Intro Flow Manager
  if (window.AuraBeatIntroManager) {
    const drawer = window.AuraBeatHardware ? window.AuraBeatHardware.HardwareDrawer : null;
    window.AuraBeatIntroManager.setProfileProvider(() => drawer ? drawer.getProfile() : { name: 'XREAL Aura', dFov: '70°' });
    window.AuraBeatIntroManager.setDeviceKeyProvider(() => drawer ? drawer.currentDeviceKey : 'xreal');
    window.AuraBeatIntroManager.renderStages(document.querySelector('.stage-viewport'));
    window.AuraBeatIntroManager.startSequence();
  }

  // 4. Initialize Spatial 3D Engine
  if (window.AuraBeatSpatial3DEngine) {
    window.AuraBeatSpatial3DEngine.init();
  }

  if (dismissFossBtn) {
    dismissFossBtn.addEventListener('click', () => {
      if (window.AuraBeatIntroManager) {
        window.AuraBeatIntroManager.hasDismissedFoss = true;
        if (fossModal) fossModal.classList.add('hidden');
        window.AuraBeatIntroManager.switchStage('stage-intro');
      }
    });
  }
  if (closeFossBtn) {
    closeFossBtn.addEventListener('click', () => {
      if (fossModal) fossModal.classList.add('hidden');
      if (window.AuraBeatIntroManager) window.AuraBeatIntroManager.switchStage('stage-intro');
    });
  }

  // 5. High-DPI Vector Particle Canvas
  const canvas = document.getElementById('spatial-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let beatPulse = 1.0;

  function resizeCanvas() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class VectorParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = (Math.random() - 0.5) * width * 1.5;
      this.y = (Math.random() - 0.5) * height * 1.5;
      this.z = Math.random() * width;
      this.size = Math.random() * 2.0 + 1.0;
      this.color = Math.random() > 0.5 ? '#00f2fe' : '#4facfe';
      this.speed = Math.random() * 1.2 + 0.4;
    }
    update(bpmRatio) {
      this.z -= this.speed * beatPulse * (bpmRatio || 1.0);
      if (this.z <= 0) { this.reset(); this.z = width; }
    }
    draw() {
      const cx = width / 2;
      const cy = height / 2;
      const screenX = (this.x / this.z) * 420 + cx;
      const screenY = (this.y / this.z) * 420 + cy;
      const radius = (1 - this.z / width) * this.size * 1.6 * beatPulse;
      const alpha = (1 - this.z / width) * 0.85;

      if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height && radius > 0.4) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(0.8, radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  for (let i = 0; i < 28; i++) particles.push(new VectorParticle());

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    const energy = (window.AuraBeatHardware && window.AuraBeatHardware.BgmPlayer)
      ? window.AuraBeatHardware.BgmPlayer.getAudioEnergy()
      : { beatPulse: 1.0, bpmRatio: 1.0 };
    beatPulse = energy.beatPulse || 1.0;
    const bpmRatio = energy.bpmRatio || 1.0;

    if (window.AuraBeatSpatial && window.AuraBeatSpatial.SpatialGridCanvas) {
      window.AuraBeatSpatial.SpatialGridCanvas.drawSpatialGrid(ctx, width, height, beatPulse);
    }
    particles.forEach(p => { p.update(bpmRatio); p.draw(); });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
});
