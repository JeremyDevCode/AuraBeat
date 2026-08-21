/**
 * AuraBeat Core Engine - Optical Dimming & Exposure Compensation Filter
 * Mitigates discrete 3-step electrochromic lens switching (0%, 35%, 100%) via
 * Inverse Gamma scaling, dynamic screen-space vignetting, and transient downbeat snapping.
 */

window.AuraBeatCore = window.AuraBeatCore || {};

(function () {
  class OpticalDimmingFilter {
    constructor() {
      this.currentDimmingLevel = 0; // 0 (0%), 1 (35%), 2 (100%)
      this.virtualAlpha = 0.0;
      this.vignetteRadius = 1.0;
      this.overlayElement = null;
    }

    init() {
      this.ensureVignetteOverlay();
    }

    ensureVignetteOverlay() {
      let overlay = document.getElementById('dimming-vignette-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'dimming-vignette-overlay';
        overlay.className = 'dimming-vignette-overlay';
        overlay.style.cssText = `
          position: fixed; inset: 0; pointer-events: none; z-index: 45;
          transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          background: radial-gradient(circle, rgba(0,0,0,0) 65%, rgba(0,0,0,0.85) 100%);
          opacity: 0;
        `;
        document.body.appendChild(overlay);
      }
      this.overlayElement = overlay;
    }

    /**
     * Sets hardware electrochromic dimming level with inverse gamma compensation.
     * @param {number} level - 0 (Clear), 1 (35% Tint), 2 (100% Dark)
     * @param {boolean} snapToDownbeat - Snaps register change on immediate audio transient
     */
    setDimmingLevel(level, snapToDownbeat = true) {
      this.currentDimmingLevel = Math.max(0, Math.min(2, level));
      const targetPhysicalBlock = (this.currentDimmingLevel === 1) ? 0.35 : (this.currentDimmingLevel === 2 ? 1.0 : 0.0);

      if (snapToDownbeat) {
        this.virtualAlpha = targetPhysicalBlock;
        this.applyExposureCompensation();
      } else {
        // Smooth interpolation over 350ms
        let start = performance.now();
        const startAlpha = this.virtualAlpha;
        const animate = (now) => {
          const progress = Math.min(1, (now - start) / 350);
          this.virtualAlpha = startAlpha + (targetPhysicalBlock - startAlpha) * progress;
          this.applyExposureCompensation();
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }

    /**
     * Applies Digital Exposure Compensation: I_virtual = I_base * (1 - alpha(t))
     */
    applyExposureCompensation() {
      if (!this.overlayElement) this.ensureVignetteOverlay();
      if (!this.overlayElement) return;

      const baseBrightness = 1.0 + (this.virtualAlpha * 0.45); // Boost digital elements to compensate
      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.style.filter = `brightness(${baseBrightness.toFixed(2)}) contrast(${(1 + this.virtualAlpha * 0.15).toFixed(2)})`;
      }

      this.overlayElement.style.opacity = (this.virtualAlpha * 0.85).toFixed(2);
    }

    /**
     * Dynamic Screen-Space Vignetting based on accuracy percentage:
     * V(r) = 1.0 - clamp((r - R_start)/(R_end - R_start), 0.0, 1.0)^k
     * @param {number} accuracyPct - 0 to 100
     */
    updateAccuracyVignette(accuracyPct) {
      if (!this.overlayElement) this.ensureVignetteOverlay();
      if (!this.overlayElement) return;

      // Accuracy 100% -> clear (radius 85%), Accuracy 50% -> constricts inward (radius 45%)
      const normalizedAcc = Math.max(0, Math.min(100, accuracyPct)) / 100;
      const innerClearRadius = Math.round(45 + normalizedAcc * 40); // 45% to 85%
      const outerDarkRadius = innerClearRadius + 25;

      this.overlayElement.style.background = `radial-gradient(circle at center, rgba(0, 0, 0, 0) ${innerClearRadius}%, rgba(3, 4, 8, 0.92) ${outerDarkRadius}%)`;
      this.overlayElement.style.opacity = normalizedAcc < 0.8 ? (1 - normalizedAcc * 0.8).toFixed(2) : (this.virtualAlpha * 0.85).toFixed(2);
    }
  }

  window.AuraBeatCore.OpticalDimmingFilter = new OpticalDimmingFilter();
})();
