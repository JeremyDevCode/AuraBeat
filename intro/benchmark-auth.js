/**
 * AuraBeat Intro Process - Stage 3A: Benchmark Authorization Panel
 * Manages authorization checklist, background app recommendations,
 * and high-precision telemetry sampling consent.
 */

window.AuraBeatIntroModules = window.AuraBeatIntroModules || {};

(function () {
  const BenchmarkAuth = {
    getTemplate(deviceName) {
      return `
        <div id="benchmark-auth-panel" class="auth-panel squircle">
          <div class="auth-header">
            <i class="ri-shield-keyhole-line text-accent"></i>
            <div>
              <h4>Telemetry Benchmark Authorization Required</h4>
              <p>Please authorize high-precision timer sampling and review pre-flight setup</p>
            </div>
          </div>
          <div class="auth-checklist">
            <div class="auth-item">
              <i class="ri-checkbox-circle-fill text-green"></i>
              <span><strong>Close Background Apps:</strong> Close secondary browser tabs and background processes to ensure unthrottled CPU/GPU frame pacing.</span>
            </div>
            <div class="auth-item">
              <i class="ri-checkbox-circle-fill text-green"></i>
              <span><strong>Display Refresh Rate:</strong> Verify device display refresh rate is configured to maximum mode (120Hz / 90Hz).</span>
            </div>
            <div class="auth-item">
              <i class="ri-shield-check-fill text-accent"></i>
              <span><strong>Authorize Performance Metrics:</strong> Authorize WebGL polygon rasterization stress testing, .auramap chart benchmark parsing, RAM buffer allocation, and thermal junction simulation for target <strong id="auth-device-name">${deviceName || 'XREAL Aura'}</strong>.</span>
            </div>
          </div>
          <button id="btn-authorize-benchmark" class="btn-primary squircle-btn spring-btn auth-start-btn">
            <span>Authorize & Begin Multi-Pass Benchmark</span>
            <i class="ri-speed-line"></i>
          </button>
        </div>
      `;
    },

    bindEvents(onAuthorize) {
      const btnAuth = document.getElementById('btn-authorize-benchmark');
      if (btnAuth && typeof onAuthorize === 'function') {
        btnAuth.addEventListener('click', onAuthorize);
      }
    }
  };

  window.AuraBeatIntroModules.benchmarkAuth = BenchmarkAuth;
})();
