# AuraBeat — Task Breakdown & Implementation Milestones (`tasks.md`)
**Version:** 1.1.0  
**Role:** Lead Software & Systems Architect  
**Constraint:** Max strictly `< 300 LOC` per file, zero-build vanilla stack, quiet verification gate before marking complete.

---

## Phase 1: Zero-Build Foundation & High-DPI Vector Canvas [COMPLETED]

- [x] **Task 1.1: HTML5 Viewport & HyperOS Bento Container**
  - **Files:** `index.html`, `styles.css`
  - **Scope:** Establish 16:9 widescreen layout, dark mode palette, superellipse tokens, and viewport perspective wrapper.
  - **Verification:** Viewport renders without scroll overflow; F11 fullscreen modal properly triggers.

- [x] **Task 1.2: High-DPI Vector Particle Canvas & Audio Pulse Synchronization**
  - **Files:** `app.js`, `styles.css`
  - **Scope:** Implement DPR-scaled `<canvas id="spatial-canvas">` with depth-projected vector particles pulsating to acoustic telemetry.
  - **Verification:** Canvas scales smoothly on window resize without pixelation.

---

## Phase 2: Core DSP & Mathematical Modeling Engine [COMPLETED]

- [x] **Task 2.1: Cubic Hermite Spline Trajectory & Volumetric Sweep Engine**
  - **Files:** `core_engine/spline-interpolator.js`
  - **Scope:** Implement parametric $P(t)$ evaluation, 3D line-segment volumetric cylinder collision sweep, and millisecond hit window accuracy ratings.
  - **Verification:** All mathematical assertions pass in `tests/test_runner.html`.

- [x] **Task 2.2: Virtual Bass Extension (VBE) Non-Linear Device Synthesis**
  - **Files:** `core_engine/audio-dsp-vbe.js`
  - **Scope:** Build 2048-sample NLD transfer curve synthesizing upper harmonics for low-frequency audibility on micro-speakers.
  - **Verification:** Tested preset curve generation with 2048 samples.

- [x] **Task 2.3: Silence-Gated Dynamic Audio Reactive Engine**
  - **Files:** `core_engine/audio-reactive-engine.js`
  - **Scope:** Decouple audio energy calculation from sandboxed media elements; provide strict silence gating ($0.000$ energy on pause/mute).
  - **Verification:** Verified zero movement when audio paused.

- [x] **Task 2.4: Optical See-Through Color Blender & Von Kries Adaptation**
  - **Files:** `core_engine/ost-color-blender.js`
  - **Scope:** Implement additive color blending, Von Kries chromatic white-point correction, and chromatic aberration offset calculators.
  - **Verification:** Unit assertions confirm Von Kries white point mapping.

- [x] **Task 2.5: Electrochromic Optical Dimming Filter**
  - **Files:** `core_engine/optical-dimming-filter.js`
  - **Scope:** Calibrate physical electrochromic lens transmittance levels (0%, 35%, 100%) and ambient contrast compensation.
  - **Verification:** Verification tests pass for all 3 tint levels.

- [x] **Task 2.6: `.auramap` Beatmap Parser & Procedural Chart Generator**
  - **Files:** `core_engine/auramap-parser.js`
  - **Scope:** Validate v1.0 JSON schemas, parse rhythm events, and generate procedural charts with GAMV 360 narrative markers.
  - **Verification:** Generated map passes schema validation.

- [x] **Task 2.7: `.aurarec` 90Hz Telemetry Recorder**
  - **Files:** `core_engine/telemetry-recorder.js`
  - **Scope:** Record 6DoF head pose quaternions, hand spatial vectors, hit accuracy metrics, and export session logs.
  - **Verification:** Telemetry session exports valid v1.0 JSON payload.

---

## Phase 3: XR Hardware Simulation & Telemetry Profiles [COMPLETED]

- [x] **Task 3.1: Multi-Device Specification Registry**
  - **Files:** `hardware_simulation/hardware-registry.js`
  - **Scope:** Hardware profiles for XREAL Aura (70°), VITURE Luma (52°), Samsung XR (118°), Quest 3 (110°), and Quest 3S (104°).
  - **Verification:** Registry correctly returns calibrated PPD, FOV, and aspect ratios.

- [x] **Task 3.2: Direct Unmuted BGM Audio Player**
  - **Files:** `hardware_simulation/bgm-player.js`
  - **Scope:** Direct `<audio id="bgm-audio-node">` hardware routing, 23 Opus tracks, shuffle, repeat, dice, and live 3-band spectrum meter.
  - **Verification:** Unmuted sound plays clearly through local speakers on `file:///`.

- [x] **Task 3.3: Floating Capsule & Simulation Control Dock (SCD) Drawer**
  - **Files:** `hardware_simulation/hardware-drawer.js`
  - **Scope:** Build morphing SCD drawer with device switcher, FOV frame toggle, 3D camera reset, launcher restart, and FOSS notice modal.
  - **Verification:** Drawer expands and closes with smooth spring animations.

---

## Phase 4: Spatial 3D Engine & 3DoF World-Anchored Head-Look [COMPLETED]

- [x] **Task 4.1: 3DoF Head-Look Camera Controller**
  - **Files:** `spatial_engine/camera-controller.js`
  - **Scope:** Right-click mouse drag head-look, yaw/pitch bounding, damping interpolation, and camera reset dispatching.
  - **Verification:** Smooth damped rotation updates; camera reset returns yaw/pitch to $(0^\circ, 0^\circ)$.

- [x] **Task 4.2: CSS 3D World-Rig Projection & Matrix Transform Renderer**
  - **Files:** `spatial_engine/viewport-3d-renderer.js`
  - **Scope:** Apply inverse matrix rotation `rotateX(-pitch) rotateY(-yaw)` to `#spatial-world-rig` for genuine 3DoF world-locking.
  - **Verification:** World-anchored panels remain locked in space while the FOV frame stays body-locked.

- [x] **Task 4.3: Soaring Vertical Resonant Pillars & Reactive Canvas**
  - **Files:** `spatial_engine/spatial-grid-canvas.js`
  - **Scope:** High-DPI canvas with towering vertical pillars ($Y \in [-1400, +1400]$), wide colonnade separation ($X \in [\pm 380, \pm 1350]$), red bass/mid standing waves, and white treble shimmer.
  - **Verification:** Wide central corridor remains open and clear for UI panels; pillars vibrate to audio energy.

- [x] **Task 4.4: Spatial Lifecycle Coordination Manager**
  - **Files:** `spatial_engine/spatial-manager.js`
  - **Scope:** Orchestrate camera pose listeners, grid canvas updates, and viewport re-renders.
  - **Verification:** Verified clean event binding and lifecycle management.

---

## Phase 5: Intro Flow, Storage Indexing & Telemetry Benchmark [COMPLETED]

- [x] **Task 5.1: Stage Loader & Intro Lifecycle Manager**
  - **Files:** `intro/stage-loader.js`, `intro/intro-manager.js`
  - **Scope:** Sequential stage rendering into `#spatial-world-rig` with state transitions and hardware profile binding.
  - **Verification:** Multi-stage intro transitions execute without DOM leaks.

- [x] **Task 5.2: Welcome Intro Stage & FOSS PoC Modal Integration**
  - **Files:** `intro/stage-intro.js`
  - **Scope:** HyperOS bento card with hardware badge, launcher start trigger, and FOSS notice dialog.
  - **Verification:** Correctly transitions to system indexing on click.

- [x] **Task 5.3: Storage Indexer & Opus Audio Library Verification**
  - **Files:** `intro/system-indexer.js`
  - **Scope:** Procedural indexing simulation scanning local audio assets, validating bitrates, and caching track metadata.
  - **Verification:** Progress bar animates to 100% and advances to benchmark.

- [x] **Task 5.4: Diagnostic Benchmark & PPD Telemetry Evaluation**
  - **Files:** `intro/diagnostic-benchmark.js`, `intro/benchmark-auth.js`
  - **Scope:** Calibrate simulated PPD, FOV aperture, GPU draw call latency, and present passkey authorization.
  - **Verification:** Benchmark runs 100% clean and updates hardware metrics.

- [x] **Task 5.5: Track & Mode Selection Grid**
  - **Files:** `intro/ui-selection.js`
  - **Scope:** Asymmetric bento grid displaying available Opus tracks, difficulty selectors, and gameplay launcher triggers.
  - **Verification:** Track cards trigger audio playback and mode selection.

---

## Phase 6: Interactive 360 Gameplay Rhythm Stage & Note Spawner (Pending Execution)

- [ ] **Task 6.1: Real-time 3D Note Spawner & Spline Approach System**
  - **Files:** `gameplay/note-spawner.js`, `gameplay/gameplay-stage.js`
  - **Scope:** Instantiate notes travelling along Hermite splines at calibrated approach speeds ($10\text{m/s} - 25\text{m/s}$) synchronized to audio timestamps.
  - **Verification:** Notes spawn at correct timestamps and interpolate smoothly along spline curves.

- [ ] **Task 6.2: Volumetric Collision Detection & Real-time Hit Scoring**
  - **Files:** `gameplay/hit-evaluator.js`, `gameplay/score-engine.js`
  - **Scope:** Connect mouse pointer / simulated 6DoF hand positions to `SplineInterpolator.testVolumetricSweep` for millisecond-accurate hit registration, combo tracking, and score calculation.
  - **Verification:** PERFECT/GREAT/GOOD/MISS ratings trigger with visual splash effects and combo multipliers.

- [ ] **Task 6.3: 360 Head-Tracking Note Target Ring & Peripheral Guardian**
  - **Files:** `gameplay/target-ring.js`, `spatial_engine/viewport-3d-renderer.js`
  - **Scope:** Render an optical hit target ring at focal depth ($Z = 100\text{px}$) with directional peripheral arrows guiding head rotation toward upcoming notes.
  - **Verification:** Peripheral indicators flash when upcoming notes originate outside the active device FOV aperture.

- [ ] **Task 6.4: Interactive GAMV Narrative Branching Triggers**
  - **Files:** `gameplay/gamv-branching.js`, `core_engine/auramap-parser.js`
  - **Scope:** Parse narrative branch triggers from `.auramap` to trigger dynamic FOV dilation, optical dimming level shifts, and visualizer palette transforms.
  - **Verification:** Narrative events dynamically alter electrochromic dimming and FOV framing during gameplay.

---

## Phase 7: Ambient Suite Inter-App Telemetry Bridge & Native XR Porting (Pending Execution)

- [ ] **Task 7.1: Daily Ambient BLE Broadcast Data Ingestion**
  - **Files:** `ambient_bridge/biometric-bridge.js`
  - **Scope:** Interface with `DailyAmbient` BLE broadcast contracts (heart rate, fatigue index, SQI) to dynamically modulate note speeds and visualizer intensity.
  - **Verification:** Simulated biometric inputs adjust game difficulty and visual feedback in real time.

- [ ] **Task 7.2: WebXR / OpenXR Device Anchor Exporter**
  - **Files:** `hardware_simulation/openxr-exporter.js`
  - **Scope:** Export calibrated FOV, spatial coordinates, and spline meshes into standard WebXR / OpenXR transforms for native Android XR and Meta Horizon OS deployment.
  - **Verification:** Exported transforms match OpenXR coordinate standards ($+Y$ up, $-Z$ forward).

---

## Phase 8: Visualizer Engine Overhaul & BGM Developer Settings Studio

- [x] **Task 8.1: Visualizer Configuration & State Model**
  - **Files:** `spatial_engine/visualizer-settings.js`
  - **Scope:** Implement default visualizer parameters, reactive parameter mutation, subscriber callbacks, localStorage persistence (`aurabeat_visualizer_settings_v1`), and preset configurations (Default, Neon Flow, Hyper Kaleidoscope, Deep Bass, Ethereal).
  - **Verification:** Parameters serialize and deserialize correctly without memory leakage.

- [x] **Task 8.2: Line Fixing & Parametric Harmonic String Engine**
  - **Files:** `spatial_engine/spatial-grid-canvas.js`
  - **Scope:** Fix near-plane clipping artifacts ($Z < 120$), eliminate multi-node Z-depth warping, connect dynamic line amplitude, bar count, sensitivity, detail (node count), thickness, glow, beat pulse, and corridor gap to `VisualizerSettings`.
  - **Verification:** Lines frame the center sanctuary without cutting through UI or flashing on near-plane pass.

- [x] **Task 8.3: Spin Rotation, Orbs & Radial Kaleidoscope Visualizer Engine**
  - **Files:** `spatial_engine/spatial-grid-canvas.js`, `app.js`
  - **Scope:** Add continuous angular spin rotation and radial kaleidoscope symmetry projection ($M \in \{0, 2, 3, 4, 6, 8\}$ folds) around canvas focal center; connect ball count, size, and speed to `VisualizerSettings`.
  - **Verification:** Kaleidoscope renders clean geometric radial symmetry without dropping 60fps frame rate.

- [x] **Task 8.4: HyperOS BGM Developer Settings Bento Drawer Markup & CSS**
  - **Files:** `index.html`, `styles.css`
  - **Scope:** Integrate Developer Settings toggle button (`#btn-bgm-dev-settings`) into the Background Music Player card; construct collapsible developer bento drawer with slider controls, preset pills, and responsive styling.
  - **Verification:** Panel animates smoothly when toggled; controls fit seamlessly into HyperOS bento aesthetic.

- [x] **Task 8.5: Visualizer Developer Panel Controller & Event Wiring**
  - **Files:** `hardware_simulation/visualizer-dev-panel.js`, `hardware_simulation/hardware-drawer.js`
  - **Scope:** Implement event handlers for all parameter inputs (amplitude, bar count, sensitivity, detail, thickness, glow, beat pulse, spin, react mode, kaleidoscope, gap, smoothing, bar width, balls), preset selection, and reset to defaults.
  - **Verification:** Real-time slider adjustments update canvas instantaneously; values persist across drawer close/open and browser reload.

---

## Phase 9: Drawer Morphing Transition, Profile CRUD & Detachable Floating Studio

- [x] **Task 9.1: Smooth Dynamic Capsule Drawer Morphing Transition**
  - **Files:** `styles.css`, `hardware_simulation/hardware-drawer.js`
  - **Scope:** Replace abrupt `display: none` toggle with cubic-bezier spring scale/translate/opacity morphing originating from capsule pill (`scale(0.85, 0.4) translateY(-28px)` -> `scale(1) translateY(0)`), with delayed pointer/visibility cleanup.
  - **Verification:** Drawer expands and collapses with continuous fluid spring animation without flashing.

- [x] **Task 9.2: Visualizer Studio Profile CRUD & Extended Settings Engine**
  - **Files:** `spatial_engine/visualizer-settings.js`, `spatial_engine/spatial-grid-canvas.js`
  - **Scope:** Implement full Profile CRUD system (create custom named profile, modify/save active profile, delete custom profile, switch profiles) stored under `aurabeat_visualizer_profiles_v1`. Add Wave Speed, Color Theme palettes, and Audio Band Filter parameters to visualizer engine.
  - **Verification:** Unit tests confirm create, modify, delete, and persistence of custom profiles.

- [x] **Task 9.3: Detachable Floating Window & Snap-Docking System**
  - **Files:** `hardware_simulation/visualizer-dev-panel.js`, `index.html`
  - **Scope:** Implement pop-out detach button and draggable titlebar on `#bgm-dev-panel`. Window persists independently when simulation menu closes. When dragged over the drawer dock zone, trigger snap highlight border and snap-dock back into the BGM player.
  - **Verification:** Detached window floats, moves, stays active on menu close, and docks seamlessly upon snap.

- [x] **Task 9.4: Verification, Modularity Gate & Regression Checks**
  - **Files:** `tests/audit_loc.ps1`, `tests/test_runner.html`
  - **Scope:** Execute PowerShell LOC audit confirming all JavaScript files strictly $< 300$ LOC; verify all unit tests pass 100% green.
  - **Verification:** 100% green pass on LOC audit and unit tests.

---

## Modularity & Verification Gate

Run following quiet commands to verify code hygiene and test passing status:
```powershell
# 1. Verify strict < 300 LOC modularity gate across all JS files
powershell -ExecutionPolicy Bypass -File .\tests\audit_loc.ps1

# 2. Automated test suite execution
# Open tests/test_runner.html in browser to verify 100% green pass rate
```


