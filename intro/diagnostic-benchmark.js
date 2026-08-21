/**
 * AuraBeat Intro Process - Stage 3: Multi-Pass Diagnostic Benchmark Module
 * Coordinates telemetry benchmarking, log streaming, score animations,
 * and hardware profile resets using the decoupled hardware registry.
 */

window.AuraBeatIntroModules = window.AuraBeatIntroModules || {};

(function () {
  const SIM_PASS_METRICS = {
    xreal: {
      socMetric: "Snapdragon® Reality Elite (4.5M poly/s)",
      coprocMetric: "XREAL X1S (8.4ms | 0.28s Load)",
      ramMetric: "3.4GB / 12GB LPDDR5 (~31.5 PPD)",
      tdpMetric: "Puck ~10W–15W (34.2°C Peak)",
      polygons: "4.5M polygons/sec",
      loadTime: "0.28s",
      temp: "34.2°C"
    },
    samsung: {
      socMetric: "Snapdragon® XR2+ Gen 2 (3.4M poly/s)",
      coprocMetric: "Hexagon NPU (5.8ms | 0.35s Load)",
      ramMetric: "4.1GB / 16GB LPDDR5 (~32.5 PPD)",
      tdpMetric: "Active Fan ~15W–18W (38.8°C Peak)",
      polygons: "3.4M polygons/sec",
      loadTime: "0.35s",
      temp: "38.8°C"
    },
    quest: {
      socMetric: "Snapdragon® XR2 Gen 2 (2.6M poly/s)",
      coprocMetric: "Sensor Hub (9.6ms | 0.42s Load)",
      ramMetric: "3.8GB / 8GB LPDDR5 (~20 PPD)",
      tdpMetric: "Active Fan ~10W–12W (41.2°C Peak)",
      polygons: "2.6M polygons/sec",
      loadTime: "0.42s",
      temp: "41.2°C"
    },
    quest3s: {
      socMetric: "Snapdragon® XR2 Gen 2 (2.4M poly/s)",
      coprocMetric: "Sensor Hub (9.8ms | 0.45s Load)",
      ramMetric: "3.6GB / 8GB LPDDR5 (~20 PPD)",
      tdpMetric: "Active Fan ~10W–12W (42.0°C Peak)",
      polygons: "2.4M polygons/sec",
      loadTime: "0.45s",
      temp: "42.0°C"
    },
    viture: {
      socMetric: "USB-C DP Host (~2.1M poly/s)",
      coprocMetric: "Sensor MCU (12.2ms | 0.52s Load)",
      ramMetric: "2.4GB Draw (~44.6 PPD)",
      tdpMetric: "Glasses Draw ~3.5W (32.1°C Passive)",
      polygons: "2.1M polygons/sec",
      loadTime: "0.52s",
      temp: "32.1°C"
    }
  };

  const DiagnosticBenchmark = {
    id: 'stage-benchmark',
    name: 'Multi-Pass Diagnostic Benchmark',
    isBenchmarkCompleted: false,
    benchmarkTimer: null,

    getTemplate() {
      const authHtml = (window.AuraBeatIntroModules.benchmarkAuth)
        ? window.AuraBeatIntroModules.benchmarkAuth.getTemplate('XREAL Aura')
        : '';

      return `
        <section id="stage-benchmark" class="stage hidden">
          <div class="squircle-card benchmark-card spring-pop">
            <div class="stage-header">
              <span class="stage-tag">Hardware Telemetry</span>
              <h2>Multi-Pass Compute & System Benchmark</h2>
              <p>Evaluating rasterization, chart load speed, memory bandwidth, and thermal dissipation</p>
            </div>

            ${authHtml}

            <!-- BENCHMARK RUNNER VIEW (HIDDEN UNTIL AUTHORIZED) -->
            <div id="benchmark-runner-view" class="runner-view hidden">
              <div class="telemetry-core-visual">
                <div class="hex-orbit-ring outer-spin"></div>
                <div class="hex-orbit-ring inner-spin"></div>
                <div class="energy-pulse-core">
                  <div class="core-glow-badge">
                    <span id="benchmark-score">0</span>
                    <small id="benchmark-score-label">XR SCORE</small>
                  </div>
                </div>
              </div>

              <div class="diag-log-container squircle">
                <div id="diag-log-stream" class="log-stream">
                  <div class="log-line info">> Awaiting benchmark initiation...</div>
                </div>
              </div>

              <div class="benchmark-grid">
                <div class="squircle-tile metric-tile">
                  <i class="ri-cpu-line metric-icon"></i>
                  <div class="metric-info">
                    <span class="metric-label">Primary System-on-Chip (SoC)</span>
                    <span id="val-soc" class="metric-val">--</span>
                  </div>
                </div>
                <div class="squircle-tile metric-tile">
                  <i class="ri-chip-line metric-icon"></i>
                  <div class="metric-info">
                    <span class="metric-label">Co-Processor / Latency</span>
                    <span id="val-coproc" class="metric-val text-accent">--</span>
                  </div>
                </div>
                <div class="squircle-tile metric-tile">
                  <i class="ri-ram-2-line metric-icon"></i>
                  <div class="metric-info">
                    <span class="metric-label">System RAM & Display</span>
                    <span id="val-ram" class="metric-val">--</span>
                  </div>
                </div>
                <div class="squircle-tile metric-tile">
                  <i class="ri-flashlight-line metric-icon"></i>
                  <div class="metric-info">
                    <span class="metric-label">Thermal Design & Power (TDP)</span>
                    <span id="val-tdp" class="metric-val">--</span>
                  </div>
                </div>
              </div>

              <div class="benchmark-btn-group">
                <button id="btn-re-test" class="btn-secondary squircle-btn spring-btn" title="Re-run telemetry benchmark">
                  <i class="ri-refresh-line"></i> Re-Run Diagnostics
                </button>
                <button id="btn-to-ui-select" class="btn-primary squircle-btn spring-btn btn-downhighlighted" disabled>
                  <span>Evaluating Telemetry...</span>
                  <i class="ri-loader-4-line spin"></i>
                </button>
              </div>
            </div>

          </div>
        </section>
      `;
    },

    init(manager) {
      this.manager = manager;
      this.bindEvents();
    },

    bindEvents() {
      if (window.AuraBeatIntroModules.benchmarkAuth) {
        window.AuraBeatIntroModules.benchmarkAuth.bindEvents(() => this.runBenchmark());
      }

      const btnReTest = document.getElementById('btn-re-test');
      if (btnReTest) {
        btnReTest.addEventListener('click', () => this.runBenchmark());
      }

      const btnToUiSelect = document.getElementById('btn-to-ui-select');
      if (btnToUiSelect) {
        btnToUiSelect.addEventListener('click', () => {
          if (this.isBenchmarkCompleted && !btnToUiSelect.disabled && this.manager) {
            this.manager.switchStage('stage-ui-select');
          }
        });
      }
    },

    getProfileData() {
      const devKey = (this.manager && this.manager.getCurrentDeviceKey) ? this.manager.getCurrentDeviceKey() : 'xreal';
      const prof = (window.AuraBeatHardware && window.AuraBeatHardware.getProfile)
        ? window.AuraBeatHardware.getProfile(devKey)
        : { name: 'XREAL Aura', soc: 'Qualcomm Snapdragon Reality Elite', score: 98, scoreLabel: 'AR SCORE', speedFactor: 0.45 };
      const metrics = SIM_PASS_METRICS[devKey] || SIM_PASS_METRICS.xreal;
      return { prof, metrics, devKey };
    },

    resetBenchmarkState() {
      this.isBenchmarkCompleted = false;
      if (this.benchmarkTimer) clearTimeout(this.benchmarkTimer);

      const authPanel = document.getElementById('benchmark-auth-panel');
      const runnerView = document.getElementById('benchmark-runner-view');
      const authDeviceName = document.getElementById('auth-device-name');
      const btnToUiSelect = document.getElementById('btn-to-ui-select');
      const diagLogStream = document.getElementById('diag-log-stream');
      const benchmarkScore = document.getElementById('benchmark-score');
      const benchmarkScoreLabel = document.getElementById('benchmark-score-label');

      const { prof } = this.getProfileData();

      if (authDeviceName) authDeviceName.textContent = prof.name;
      if (benchmarkScoreLabel) benchmarkScoreLabel.textContent = prof.scoreLabel;
      if (authPanel) authPanel.classList.remove('hidden');
      if (runnerView) runnerView.classList.add('hidden');
      if (diagLogStream) diagLogStream.innerHTML = '<div class="log-line info">> Awaiting benchmark initiation...</div>';
      if (benchmarkScore) benchmarkScore.textContent = '0';

      ['val-soc', 'val-coproc', 'val-ram', 'val-tdp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '--';
      });

      if (btnToUiSelect) {
        btnToUiSelect.className = 'btn-primary squircle-btn spring-btn btn-downhighlighted';
        btnToUiSelect.disabled = true;
        btnToUiSelect.innerHTML = '<span>Evaluating Telemetry...</span> <i class="ri-loader-4-line spin"></i>';
      }
    },

    start() {
      this.resetBenchmarkState();
    },

    runBenchmark() {
      const authPanel = document.getElementById('benchmark-auth-panel');
      const runnerView = document.getElementById('benchmark-runner-view');
      if (authPanel) authPanel.classList.add('hidden');
      if (runnerView) runnerView.classList.remove('hidden');

      if (this.benchmarkTimer) clearTimeout(this.benchmarkTimer);
      this.isBenchmarkCompleted = false;

      const btnToUiSelect = document.getElementById('btn-to-ui-select');
      const diagLogStream = document.getElementById('diag-log-stream');
      const benchmarkScore = document.getElementById('benchmark-score');
      const benchmarkScoreLabel = document.getElementById('benchmark-score-label');
      const valSoc = document.getElementById('val-soc');
      const valCoproc = document.getElementById('val-coproc');
      const valRam = document.getElementById('val-ram');
      const valTdp = document.getElementById('val-tdp');

      if (!btnToUiSelect || !diagLogStream) return;

      diagLogStream.innerHTML = '';
      if (benchmarkScore) benchmarkScore.textContent = '0';

      const { prof, metrics } = this.getProfileData();
      if (benchmarkScoreLabel) benchmarkScoreLabel.textContent = prof.scoreLabel;

      const sf = prof.speedFactor || 1.0;
      const passes = [
        { msg: `> [Authorization Granted] Target Profile: ${prof.name} (${prof.soc})`, delay: Math.round(150 * sf) },
        { msg: `> [Pass 1/4 SoC Rasterization] WebGL mesh stress... Throughput: ${metrics.polygons}. Passed.`, delay: Math.round(800 * sf), act: () => { if (valSoc) valSoc.textContent = metrics.socMetric; } },
        { msg: `> [Pass 2/4 Co-Processor & Latency] .auramap chart parsing... Load: ${metrics.loadTime} | Coproc: ${prof.coproc}. Passed.`, delay: Math.round(1900 * sf), act: () => { if (valCoproc) valCoproc.textContent = metrics.coprocMetric; } },
        { msg: `> [Pass 3/4 RAM & Display] Allocating spatial mesh vertex buffers... ${metrics.ramMetric}. Passed.`, delay: Math.round(3000 * sf), act: () => { if (valRam) valRam.textContent = metrics.ramMetric; } },
        { msg: `> [Pass 4/4 Thermal & Power] Evaluating thermal junction limits... Temp: ${metrics.temp} | TDP: ${prof.tdp}. Passed.`, delay: Math.round(4100 * sf), act: () => { if (valTdp) valTdp.textContent = metrics.tdpMetric; } }
      ];

      passes.forEach(p => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = 'log-line info';
          div.textContent = p.msg;
          diagLogStream.appendChild(div);
          diagLogStream.scrollTop = diagLogStream.scrollHeight;
          if (p.act) p.act();
        }, p.delay);
      });

      const totalTime = Math.round(4300 * sf);
      this.benchmarkTimer = setTimeout(() => {
        let score = 0;
        const targetScore = prof.score || 95;
        const scoreInterval = setInterval(() => {
          score += 4;
          if (score >= targetScore) {
            score = targetScore;
            clearInterval(scoreInterval);
            this.isBenchmarkCompleted = true;

            const finalLog = document.createElement('div');
            finalLog.className = 'log-line success';
            finalLog.textContent = `> ${prof.name} Benchmark Complete (${(totalTime / 1000).toFixed(1)}s speed | ${prof.scoreLabel}: ${targetScore}/100). All telemetry tests passed!`;
            diagLogStream.appendChild(finalLog);
            diagLogStream.scrollTop = diagLogStream.scrollHeight;

            btnToUiSelect.className = 'btn-primary squircle-btn spring-btn';
            btnToUiSelect.disabled = false;
            btnToUiSelect.innerHTML = '<span>Continue to UI Selection</span> <i class="ri-arrow-right-line"></i>';
          }
          if (benchmarkScore) benchmarkScore.textContent = score;
        }, 35);
      }, totalTime);
    }
  };

  window.AuraBeatIntroModules.diagnosticBenchmark = DiagnosticBenchmark;
})();
