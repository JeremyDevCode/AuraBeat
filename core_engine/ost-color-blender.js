/**
 * AuraBeat Core Engine - Optical See-Through (OST) Color Blender & Spectral Adapter
 * Applies Von Kries Chromatic Adaptation, Color-Space Multiplexing, and Subpixel Aberration Warping
 * to prevent ambient background wash-out on additive Micro-OLED displays.
 */

window.AuraBeatCore = window.AuraBeatCore || {};

(function () {
  class OstColorBlender {
    constructor() {
      // Von Kries Adaptation Matrix for 35% Electrochromic State (compensating blue-gray tint)
      this.vonKriesMatrix = [
        [1.32, 0.00, 0.00], // Boost Red/Orange
        [0.00, 1.05, 0.00], // Neutral Green
        [0.00, 0.00, 0.78]  // Desaturate excess blue
      ];

      // Optical aberration coefficients for 70° FOV X-Prism optics
      this.kappaRed = 0.015;
      this.kappaBlue = -0.018;
    }

    /**
     * Corrects RGB color vector using Von Kries adaptation matrix.
     * @param {Array<number>} rgb - [r, g, b] in range [0, 255]
     * @returns {string} Corrected CSS rgb() string
     */
    applyVonKriesCorrection(rgb) {
      const r = Math.min(255, Math.max(0, Math.round(rgb[0] * this.vonKriesMatrix[0][0])));
      const g = Math.min(255, Math.max(0, Math.round(rgb[1] * this.vonKriesMatrix[1][1])));
      const b = Math.min(255, Math.max(0, Math.round(rgb[2] * this.vonKriesMatrix[2][2])));
      return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Color-Space Multiplexing: shifts target note color to maximize contrast against background.
     * C_render = C_target + k * (C_target - C_ambient)
     */
    multiplexAgainstBackground(targetRgb, ambientRgb, k = 0.4) {
      const cr = Math.min(255, Math.max(0, Math.round(targetRgb[0] + k * (targetRgb[0] - ambientRgb[0]))));
      const cg = Math.min(255, Math.max(0, Math.round(targetRgb[1] + k * (targetRgb[1] - ambientRgb[1]))));
      const cb = Math.min(255, Math.max(0, Math.round(targetRgb[2] + k * (targetRgb[2] - ambientRgb[2]))));
      return `rgb(${cr}, ${cg}, ${cb})`;
    }

    /**
     * Computes subpixel chromatic aberration coordinate warp for FOV edge elements:
     * r_red = r_base * (1 + kappa_1 * r_base^2)
     */
    getAberrationOffset(radiusNorm) {
      const r2 = radiusNorm * radiusNorm;
      const redOffset = radiusNorm * (1 + this.kappaRed * r2) - radiusNorm;
      const blueOffset = radiusNorm * (1 + this.kappaBlue * r2) - radiusNorm;
      return { redOffsetPx: (redOffset * 10).toFixed(1), blueOffsetPx: (blueOffset * 10).toFixed(1) };
    }
  }

  window.AuraBeatCore.OstColorBlender = new OstColorBlender();
})();
