/**
 * AuraBeat Intro Process - Stage 4: Spatial Environment UI Selection Module
 * Interactive architectural showcase of spatial UI framework concepts with dynamic hover expansion.
 */

window.AuraBeatIntroModules = window.AuraBeatIntroModules || {};

window.AuraBeatIntroModules.uiSelection = {
  id: 'stage-ui-select',
  name: 'Spatial Environment UI Selection',

  getTemplate() {
    return `
      <section id="stage-ui-select" class="stage hidden">
        <div class="ui-select-wrapper">
          <div class="selector-header">
            <span class="stage-tag">System Preferences</span>
            <h2>Spatial Environment UI Selection</h2>
            <p>Select your preferred desktop & HUD layout framework</p>
          </div>

          <!-- Uncalibrated Hardware Warning Banner -->
          <div id="uncalibrated-warning-banner" class="uncalibrated-warning-banner squircle hidden">
            <i class="ri-alert-line text-amber"></i>
            <span><strong>Uncalibrated Hardware Performance Notice:</strong> Telemetry benchmark was skipped. Basic profiles are active.</span>
          </div>

          <!-- UI Modularization Notice Banner -->
          <div class="modular-notice-banner squircle">
            <i class="ri-tools-line text-accent"></i>
            <span><strong>UI Framework Modularization Notice:</strong> Desktop HUD presets are currently in active development for the v4.0 release.</span>
          </div>

          <div class="ui-cards-container">
            <!-- HyperOS Spatial 2.0 Card (CURRENTLY IN THE WORKS) -->
            <div class="squircle-card ui-preset-card works-preset spring-pop" id="card-hyperos" title="HyperOS Spatial 2.0 (In Active Development)">
              <div class="preset-card-top">
                <div class="preset-icon-container hyperos-gradient squircle">
                  <i class="ri-mist-line"></i>
                </div>
                <div class="preset-badge works-badge"><i class="ri-tools-line"></i> Currently In The Works</div>
              </div>
              <h3>HyperOS Spatial 2.0</h3>
              <p class="preset-desc">Superellipse geometry, asymmetric bento layout, fluid spring transitions, and tactile blur widgets.</p>
              <div class="preset-tags">
                <span class="tag">Squircle Geometry</span>
                <span class="tag">Asymmetric Bento</span>
                <span class="tag">Tactile Blur</span>
              </div>
            </div>

            <!-- Apple visionOS Spatial Card (UNDER DESIGN EVALUATION) -->
            <div class="squircle-card ui-preset-card locked-preset spring-pop" id="card-visionos" title="Apple visionOS Spatial (Under Design Evaluation)">
              <div class="preset-card-top">
                <div class="preset-icon-container apple-gradient squircle">
                  <i class="ri-apple-fill"></i>
                </div>
                <div class="preset-badge locked-badge"><i class="ri-git-commit-line"></i> Under Design Evaluation</div>
              </div>
              <h3>Apple visionOS Spatial</h3>
              <p class="preset-desc">Ultra-translucent glass floating window panes, circular app launcher grid, and soft ambient shadows.</p>
              <div class="preset-tags">
                <span class="tag">Circular Icons</span>
                <span class="tag">Frosted Glass</span>
                <span class="tag">Ambient Glow</span>
              </div>
            </div>

            <!-- Samsung One UI XR Card (UNDER DESIGN EVALUATION) -->
            <div class="squircle-card ui-preset-card locked-preset spring-pop" id="card-samsung" title="Samsung One UI XR (Under Design Evaluation)">
              <div class="preset-card-top">
                <div class="preset-icon-container samsung-gradient squircle">
                  <i class="ri-smartphone-line"></i>
                </div>
                <div class="preset-badge locked-badge"><i class="ri-git-commit-line"></i> Under Design Evaluation</div>
              </div>
              <h3>Samsung One UI XR</h3>
              <p class="preset-desc">One-handed reachability focus, bold rounded card structures, pill notifications, and vivid color accents.</p>
              <div class="preset-tags">
                <span class="tag">Focus Blocks</span>
                <span class="tag">Pill Widgets</span>
                <span class="tag">Vivid Accents</span>
              </div>
            </div>
          </div>

          <div class="preset-footer-hint" style="margin-top: 14px; text-align: center;">
            <small style="color: var(--text-muted); font-size: 0.72rem;">
              <i class="ri-information-line text-accent"></i> Hover to inspect spatial geometry. Environment layouts are currently in development.
            </small>
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
    document.querySelectorAll('.ui-preset-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.add('card-spring-active');
        setTimeout(() => card.classList.remove('card-spring-active'), 400);
      });
    });
  }
};
