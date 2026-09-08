# AuraBeat — Architectural Specification (`spec.md`)
**Version:** 1.1.0  
**Role:** Lead Software & Systems Architect  
**Project:** AuraBeat (Spatial Audio Rhythm Game & XR Hardware Simulation Engine)  
**Target Platform:** Pure Vanilla Web (Zero-Build, HTML5 / CSS3 / ES6+), Porting Ready for Android XR, Meta Horizon OS & WebXR  
**Modularity Standard:** Strictly `< 300 LOC` per file (Zero-Tolerance Gate via `tests/audit_loc.ps1`)

---

## 1. System Overview & Native-First Architecture

AuraBeat combines spatial audio rhythm mechanics with a real-time optics and hardware telemetry simulator. To overcome physical hardware constraints, AuraBeat operates as a **2D Widescreen Hardware Simulation & Prototyping Layer**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             BROWSER VIEWPORT                                │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ BACKGROUND CANVAS (Layer 0)                                            │  │
│  │ - High-DPI Vector Starfield Particles (Depth z in [0, width])         │  │
│  │ - Soaring Spaced Vertical Resonant Pillars (Height 2600px, X: ±1350px) │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ PERSPECTIVE VIEWPORT (Layer 1 - CSS 3D Perspective 1000px)             │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ HEADSET-LOCKED FOV FRAME (Body-Locked Optics Mask)              │  │  │
│  │  │ - Physical FOV Apertures: XREAL 70°, VITURE 52°, Quest 3 110°   │  │  │
│  │  │ - Optical Dimming Filter (0%, 35%, 100% electrochromic glass)   │  │  │
│  │  │                                                                 │  │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │ 3DOF WORLD-ANCHORED RIG (Inverse Camera Rotations)        │  │  │  │
│  │  │  │ - R_world = R_x(-pitch) * R_y(-yaw)                      │  │  │  │
│  │  │  │ - Intro & Diagnostic Bento HUD Tiles                      │  │  │  │
│  │  │  │ - Rhythm Note Trajectories & 360 Targets                  │  │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ SIMULATION CONTROL DOCK (Layer 2 - Floating S.C.D. & Capsule)         │  │
│  │ - Hardware Switcher, Direct BGM Player, Optics Toggles, Camera Reset  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ponytail Ladder Enforcements
1. **Zero Third-Party Build Dependencies:** No npm, webpack, vite, or external runtime libraries. Uses browser-native HTML5 `<canvas>`, `<audio>`, ES6 modules, and CSS 3D transforms.
2. **Direct Unmuted Native Audio:** Chromium sandboxes mute Web Audio destinations on local `file:///` media when routed through `createMediaElementSource`. AuraBeat routes HTML5 `<audio id="bgm-audio-node">` directly to hardware output, using decoupled mathematical energy modeling to guarantee unmuted, crystal-clear sound.
3. **Strict Modularity Boundary:** Every JavaScript source file must remain strictly under 300 LOC. Any subsystem approaching the threshold is decomposed into atomic single-responsibility modules.

---

## 2. Mathematical Models & Telemetry Contracts

### 2.1 3DoF World-Anchored Camera Projection
When the user rotates their head with yaw ($\psi$) and pitch ($\theta$), the physical headset frame remains locked to the user's face, while virtual objects anchored in the world rotate in the exact inverse direction:
$$\mathbf{R}_{\text{world}} = \mathbf{R}_x(-\theta) \cdot \mathbf{R}_y(-\psi)$$
$$\begin{bmatrix} X' \\ Y' \\ Z' \end{bmatrix} = \begin{bmatrix} \cos(-\psi) & 0 & \sin(-\psi) \\ 0 & 1 & 0 \\ -\sin(-\psi) & 0 & \cos(-\psi) \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 0 & \cos(-\theta) & -\sin(-\theta) \\ 0 & \sin(-\theta) & \cos(-\theta) \end{bmatrix} \begin{bmatrix} X \\ Y \\ Z \end{bmatrix}$$
- **CSS Transformation Matrix Invariant:** `transform: rotateX(${-pitch}deg) rotateY(${-yaw}deg)` applied to `#spatial-world-rig`.
- **Damping Model:** Exponential smoothing $\psi_{t} = \psi_{t-1} + \alpha (\psi_{\text{target}} - \psi_{t-1})$ with $\alpha = 0.15$.

### 2.2 Cubic Hermite Spline Trajectories
Spatial rhythm notes travel toward the player along cubic Hermite parametric paths $P(t)$ for $t \in [0, 1]$:
$$P(t) = (2t^3 - 3t^2 + 1)P_0 + (t^3 - 2t^2 + t)M_0 + (-2t^3 + 3t^2)P_1 + (t^3 - t^2)M_1$$
* $P_0, P_1 \in \mathbb{R}^3$: Start and end control positions.
* $M_0, M_1 \in \mathbb{R}^3$: Tangent velocity vectors defining trajectory curvature.

### 2.3 Volumetric Cylinder Sweep Collision Detection
To prevent tunneling when notes pass at high velocity ($> 15\text{m/s}$), hit registration computes the minimum distance between the swept hand path segment $\overline{H_0 H_1}$ and the target note position $N$:
$$d = \frac{\| (N - H_0) \times (H_1 - H_0) \|}{\| H_1 - H_0 \|}$$
$$\text{Hit Condition: } d \le r_{\text{hand}} + r_{\text{note}}$$
* $r_{\text{hand}} = 0.08\text{m}$ (simulated hand collider radius).
* $r_{\text{note}} = 0.12\text{m}$ (target note radius).

### 2.4 Optical See-Through (OST) Color Blending
Micro-OLED AR glasses cannot produce true black pixels; pixel luminance adds to the ambient real-world luminance ($L_{\text{ambient}}$):
$$L_{\text{perceived}} = L_{\text{ambient}} \cdot (1 - \tau_{\text{glass}}) + L_{\text{display}}$$
* $\tau_{\text{glass}} \in \{0.00, 0.35, 1.00\}$: Electrochromic dimming level.
* **Von Kries White-Point Adaptation:** Boosts red/orange channels and attenuates blue to compensate for amber-tinted birdbath optical coatings:
  $$\begin{bmatrix} R' \\ G' \\ B' \end{bmatrix} = \begin{bmatrix} 1.32 & 0 & 0 \\ 0 & 1.05 & 0 \\ 0 & 0 & 0.78 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix}$$

---

## 3. Data Formats & Storage Schemas

### 3.1 `.auramap` Beatmap Specification (v1.0)
```json
{
  "$schema": "https://aurabeat.dev/schemas/auramap-v1.json",
  "version": "1.0",
  "metadata": {
    "title": "Glow",
    "artist": "MA:RK",
    "audioFile": "intro/Audio/MA:RK - Glow - House.opus",
    "bpm": 126,
    "duration": 194.5,
    "difficulty": "Master",
    "mode": "gamv_360"
  },
  "notes": [
    {
      "id": "note_001",
      "timestampMs": 1250,
      "laneAngleDeg": 45.0,
      "handType": "RIGHT",
      "splineConfig": {
        "start": { "x": 120, "y": 80, "z": 800 },
        "end": { "x": 40, "y": 0, "z": 100 },
        "tangentStart": { "x": 0, "y": 0, "z": -400 },
        "tangentEnd": { "x": 0, "y": 0, "z": -100 }
      }
    }
  ],
  "narrativeEvents": [
    { "timestampMs": 32000, "type": "FOV_DILATION", "param": 1.25 },
    { "timestampMs": 64000, "type": "ELECTROCHROMIC_DIM", "level": 2 }
  ]
}
```

### 3.2 `.aurarec` Telemetry Recording Specification (v1.0)
```json
{
  "recordVersion": "1.0",
  "deviceProfile": "XREAL Aura",
  "sessionTimestamp": 1757289600000,
  "trackTitle": "Glow",
  "summary": {
    "finalScore": 985200,
    "accuracyPct": 99.4,
    "maxCombo": 342,
    "ratingCounts": { "PERFECT": 320, "GREAT": 22, "GOOD": 0, "MISS": 0 }
  },
  "frameTelemetry": [
    {
      "frameTimeMs": 16.6,
      "headPose": { "qx": 0.0, "qy": 0.024, "qz": 0.0, "qw": 0.999 },
      "handLeft": { "x": -0.22, "y": -0.05, "z": 0.45 },
      "handRight": { "x": 0.24, "y": 0.02, "z": 0.48 },
      "events": [{ "noteId": "note_001", "rating": "PERFECT", "deltaMs": 4.2 }]
    }
  ]
}
```

---

## 4. Subsystem APIs & Module Contracts

### 4.1 Core Engine Subsystems (`core_engine/`)
- `window.AuraBeatCore.SplineInterpolator`:
  - `evaluatePoint(p0, m0, p1, m1, t): {x, y, z}`
  - `testVolumetricSweep(h0, h1, rH, notePos, rN): boolean`
  - `evaluateHitAccuracy(deltaMs): {rating: string, score: number}`
- `window.AuraBeatCore.AudioDspVbe`:
  - `presets: {electronic, orchestral, voice, metal}`
  - `createNldCurve(preset): Float32Array (2048 samples)`
- `window.AuraBeatCore.AudioReactiveEngine`:
  - `getAudioEnergy(audioElement): {beatPulse, bpmRatio, subBass, midEnergy, highEnergy}`
  - Silence-Gated Invariant: returns strictly `0.000` when `audio.paused || audio.volume === 0`.
- `window.AuraBeatCore.OstColorBlender`:
  - `applyVonKriesCorrection([r, g, b]): string`
  - `getAberrationOffset(normalizedPupilDistance): {redOffsetPx, blueOffsetPx}`
- `window.AuraBeatCore.AuraMapParser`:
  - `parse(jsonString): AuraMap`
  - `validate(mapObject): {valid: boolean, errors: string[]}`
  - `generateProceduralMap(title, artist, audioFile, bpm, duration, mode): AuraMap`
- `window.AuraBeatCore.TelemetryRecorder`:
  - `startRecording(deviceKey, trackTitle): void`
  - `recordFrame(headPose, handL, handR, events): void`
  - `stopRecording(finalScore, accuracy): AuraRec`

### 4.2 Hardware Simulation Subsystems (`hardware_simulation/`)
- `window.AuraBeatHardware.HardwareRegistry`:
  - `getProfile(deviceKey): DeviceProfile` (xreal, viture, samsung, quest, quest3s)
  - `getCalibratedFov(deviceKey): {hFov, vFov, dFov, ppd}`
- `window.AuraBeatHardware.BgmPlayer`:
  - `init(): void`
  - `playTrack(index): Promise<void>`
  - `togglePlayPause(): void`
  - `setVolume(0-100): void`
  - Direct speaker routing: outputs to `<audio id="bgm-audio-node">` directly.
- `window.AuraBeatHardware.HardwareDrawer`:
  - `init(onDeviceChanged): void`
  - `switchDevice(deviceKey): void`
  - `toggleFovMask(enabled): void`
  - Controls Simulation Control Dock (SCD) drawer and capsule UI.

### 4.3 Spatial 3D Engine (`spatial_engine/`)
- `window.AuraBeatSpatial.CameraController`:
  - `init(containerElement): void`
  - `setOrientation(yaw, pitch, roll): void`
### 2.5 Harmonic String Wave & Amplitude Model
The spatial line displacement $W(i, t)$ for node $i \in [0, N-1]$ on string $s$ is evaluated as:
$$W(i, t) = \left[ A_{\text{line}} \cdot \sin\left(\phi_s + i \cdot k_{\text{wave}}\right) \cdot \tilde{E}_{\text{reactive}} \cdot S_{\text{sens}} + W_{\text{idle}} \right] \cdot \Gamma_{\text{pulse}}$$
* $A_{\text{line}} \in [0.1, 3.0]$: User-calibrated line amplitude ("line aptitude").
* $S_{\text{sens}} \in [0.1, 3.0]$: Audio reactivity sensitivity multiplier.
* $\tilde{E}_{\text{reactive}}$: Exponential Moving Average (EMA) smoothed energy:
  $$\tilde{E}_t = \alpha_{\text{smooth}} \cdot E_t + (1 - \alpha_{\text{smooth}}) \cdot \tilde{E}_{t-1}, \quad \alpha_{\text{smooth}} \in [0.05, 0.95]$$
* $\Gamma_{\text{pulse}} = 1.0 + (P_{\text{beat}} - 1.0) \cdot K_{\text{pulse}}$, where $K_{\text{pulse}} \in [0.0, 3.0]$ is user beat pulse reactivity.
* Node position $X'_i$:
  $$X'_i = \left( X_{\text{colonnade}} + \text{sign}(X) \cdot \frac{G_{\text{gap}}}{2} + W(i, t) \right) / Z_i \cdot f_o + c_x$$
  where $G_{\text{gap}} \in [100, 1200]\text{px}$ defines the central sanctuary corridor clearance.

### 2.6 Radial Kaleidoscope Symmetrical Projection
When kaleidoscope mode is engaged with fold count $M \in \{2, 3, 4, 6, 8\}$, each point $(x, y)$ in the normalized visualizer plane is rendered across $M$ rotational reflections rotated at angle $\theta_m$:
$$\theta_m = \theta_{\text{spin}} + \frac{2\pi m}{M}, \quad m \in \{0, 1, \dots, M-1\}$$
$$\begin{bmatrix} x'_m \\ y'_m \end{bmatrix} = \begin{bmatrix} \cos \theta_m & -\sin \theta_m \\ \sin \theta_m & \cos \theta_m \end{bmatrix} \begin{bmatrix} x - c_x \\ y - c_y \end{bmatrix} + \begin{bmatrix} c_x \\ c_y \end{bmatrix}$$
* $\theta_{\text{spin}}(t) = \theta_0 + \omega_{\text{spin}} \cdot t$, where $\omega_{\text{spin}} \in [-5.0, +5.0]\text{ rad/s}$ is angular spin speed.

### 2.7 Line Depth-Culling & Anti-Flashing Near-Plane Clamp
To eliminate jagged line tearing when lines fly near the optical viewpoint ($Z \to 0$):
* Near-plane threshold: $Z_{\text{near}} = 120\text{px}$.
* Hermite alpha taper: $\alpha(Z) = \text{clamp}\left(\frac{Z - Z_{\text{near}}}{180}, 0.0, 1.0\right) \cdot \sin\left(\frac{Z}{Z_{\text{max}}} \pi\right)$.
* Uniform string depth: All nodes on string $s$ share constant depth $Z_s$ during perspective division ($Z_i = Z_s$), eliminating undulating Z-plane warping.

---

## 3. Data Formats & Storage Schemas

### 3.1 `.auramap` Beatmap Specification (v1.0)
```json
{
  "$schema": "https://aurabeat.dev/schemas/auramap-v1.json",
  "version": "1.0",
  "metadata": {
    "title": "Glow",
    "artist": "MA:RK",
    "audioFile": "intro/Audio/MA:RK - Glow - House.opus",
    "bpm": 126,
    "duration": 194.5,
    "difficulty": "Master",
    "mode": "gamv_360"
  },
  "notes": [
    {
      "id": "note_001",
      "timestampMs": 1250,
      "laneAngleDeg": 45.0,
      "handType": "RIGHT",
      "splineConfig": {
        "start": { "x": 120, "y": 80, "z": 800 },
        "end": { "x": 40, "y": 0, "z": 100 },
        "tangentStart": { "x": 0, "y": 0, "z": -400 },
        "tangentEnd": { "x": 0, "y": 0, "z": -100 }
      }
    }
  ],
  "narrativeEvents": [
    { "timestampMs": 32000, "type": "FOV_DILATION", "param": 1.25 },
    { "timestampMs": 64000, "type": "ELECTROCHROMIC_DIM", "level": 2 }
  ]
}
```

### 3.2 `.aurarec` Telemetry Recording Specification (v1.0)
```json
{
  "recordVersion": "1.0",
  "deviceProfile": "XREAL Aura",
  "sessionTimestamp": 1757289600000,
  "trackTitle": "Glow",
  "summary": {
    "finalScore": 985200,
    "accuracyPct": 99.4,
    "maxCombo": 342,
    "ratingCounts": { "PERFECT": 320, "GREAT": 22, "GOOD": 0, "MISS": 0 }
  },
  "frameTelemetry": [
    {
      "frameTimeMs": 16.6,
      "headPose": { "qx": 0.0, "qy": 0.024, "qz": 0.0, "qw": 0.999 },
      "handLeft": { "x": -0.22, "y": -0.05, "z": 0.45 },
      "handRight": { "x": 0.24, "y": 0.02, "z": 0.48 },
      "events": [{ "noteId": "note_001", "rating": "PERFECT", "deltaMs": 4.2 }]
    }
  ]
}
```

### 3.3 `aurabeat_visualizer_settings_v1` LocalStorage Schema
```json
{
  "version": 1,
  "lines": {
    "amplitude": 1.0,
    "barCount": 10,
    "sensitivity": 1.0,
    "detail": 8,
    "thickness": 2.4,
    "barWidth": 2.4,
    "glow": 12,
    "beatPulse": 1.0,
    "gap": 500,
    "smoothing": 0.4,
    "reactMode": "balanced",
    "waveSpeed": 1.0,
    "colorTheme": "neon",
    "symmetryMode": "vertical",
    "bandFilter": "all",
    "enabled": true
  },
  "balls": {
    "count": 18,
    "size": 8,
    "speed": 1.0,
    "enabled": true
  },
  "effects": {
    "spin": 0.0,
    "kaleidoscope": 0
  },
  "activeProfile": "default"
}
```

### 3.4 `aurabeat_visualizer_profiles_v1` LocalStorage Schema
```json
{
  "customProfiles": {
    "Midnight Cyan": {
      "lines": { "amplitude": 1.5, "barCount": 14, "thickness": 2.8, "glow": 20, "gap": 420, "colorTheme": "cyan" },
      "balls": { "count": 20, "size": 9, "speed": 1.2 },
      "effects": { "spin": 0.2, "kaleidoscope": 0 }
    }
  }
}
```

---

## 4. Subsystem APIs & Module Contracts

### 4.1 Core Engine Subsystems (`core_engine/`)
- `window.AuraBeatCore.SplineInterpolator`:
  - `evaluatePoint(p0, m0, p1, m1, t): {x, y, z}`
  - `testVolumetricSweep(h0, h1, rH, notePos, rN): boolean`
  - `evaluateHitAccuracy(deltaMs): {rating: string, score: number}`
- `window.AuraBeatCore.AudioDspVbe`:
  - `presets: {electronic, orchestral, voice, metal}`
  - `createNldCurve(preset): Float32Array (2048 samples)`
- `window.AuraBeatCore.AudioReactiveEngine`:
  - `getAudioEnergy(audioElement): {beatPulse, bpmRatio, subBass, midEnergy, highEnergy}`
  - Silence-Gated Invariant: returns strictly `0.000` when `audio.paused || audio.volume === 0`.
- `window.AuraBeatCore.OstColorBlender`:
  - `applyVonKriesCorrection([r, g, b]): string`
  - `getAberrationOffset(normalizedPupilDistance): {redOffsetPx, blueOffsetPx}`
- `window.AuraBeatCore.AuraMapParser`:
  - `parse(jsonString): AuraMap`
  - `validate(mapObject): {valid: boolean, errors: string[]}`
  - `generateProceduralMap(title, artist, audioFile, bpm, duration, mode): AuraMap`
- `window.AuraBeatCore.TelemetryRecorder`:
  - `startRecording(deviceKey, trackTitle): void`
  - `recordFrame(headPose, handL, handR, events): void`
  - `stopRecording(finalScore, accuracy): AuraRec`

### 4.2 Hardware Simulation Subsystems (`hardware_simulation/`)
- `window.AuraBeatHardware.HardwareRegistry`:
  - `getProfile(deviceKey): DeviceProfile` (xreal, viture, samsung, quest, quest3s)
  - `getCalibratedFov(deviceKey): {hFov, vFov, dFov, ppd}`
- `window.AuraBeatHardware.BgmPlayer`:
  - `init(): void`
  - `playTrack(index): Promise<void>`
  - `togglePlayPause(): void`
  - `setVolume(0-100): void`
  - Direct speaker routing: outputs to `<audio id="bgm-audio-node">` directly.
- `window.AuraBeatHardware.HardwareDrawer`:
  - `init(onDeviceChanged): void`
  - `switchDevice(deviceKey): void`
  - `toggleFovMask(enabled): void`
  - `toggleDrawer(forceState): void`: Triggers cubic-bezier spring scale/translate/opacity morphing from capsule pill.
- `window.AuraBeatHardware.VisualizerDevPanel`:
  - `init(): void`
  - `detachWindow(): void`: Detaches Visualizer Studio as a draggable, standalone glassmorphism window.
  - `dockWindow(): void`: Docks floating window back into the BGM Player slot.
  - Profile Management: handles create, save/modify, and delete profile events.

### 4.3 Spatial 3D Engine (`spatial_engine/`)
- `window.AuraBeatSpatial.CameraController`:
  - `init(containerElement): void`
  - `setOrientation(yaw, pitch, roll): void`
  - `resetCamera(): void`
  - `onPoseChange(callback): void`
- `window.AuraBeatSpatial.VisualizerSettings`:
  - `getParams(): VisualizerConfig`
  - `setParam(category, key, value): void`
  - `getProfiles(): { [name: string]: ProfileConfig }`
  - `createProfile(name, optionalParams): boolean`
  - `modifyActiveProfile(): boolean`
  - `deleteProfile(name): boolean`
  - `applyProfile(name): void`
  - `resetDefaults(): void`
  - `subscribe(listener): () => void`
  - Persistent caching to `aurabeat_visualizer_settings_v1` and `aurabeat_visualizer_profiles_v1`.
- `window.AuraBeatSpatial.SpatialGridCanvas`:
  - `init(canvasElement): void`
  - Render soaring widely-spaced vertical resonant pillars:
    - Span: $Y \in [-1400, +1400]\text{px}$ ($2800\text{px}$ vertical height).
    - Dynamic color palette themes (Neon, Cyan, Crimson, Amber, Emerald, Monochrome).
    - Multi-lane colonnade separation with dynamic user $G_{\text{gap}}$.
    - Parametric line amplitude, wave speed, sensitivity, thickness, glow, and detail.
    - Continuous angular spin and $M$-fold radial kaleidoscope reflections.
- `window.AuraBeatSpatial.Viewport3DRenderer`:
  - `applyWorldPose(rigElement, yaw, pitch): void`

---

## 5. Invariants & Safety Guards

1. **Audio Output Guarantee:** Never attach `createMediaElementSource()` to the primary background audio element on `file:///` protocols.
2. **Hot-Path Zero Allocation:** No object literals or array instantiations inside `requestAnimationFrame` loops (`animateCanvas`, `SpatialGridCanvas.render`, `SplineInterpolator.testVolumetricSweep`). Pre-allocate point arrays and reuse scratch buffers.
3. **Modularity Gate:** Every file must pass `tests/audit_loc.ps1` with LOC $< 300$.
4. **World-Lock Correctness:** Right-mouse head rotation to the right (+yaw) must produce counter-clockwise world-rig rotation (-yaw) on virtual panels.
5. **Near-Plane Stability Invariant:** Spatial strings must smoothly taper to $\alpha = 0$ when $Z < 120\text{px}$ without sweeping or jumping across center screen coordinates.
6. **Dynamic Morphing Invariant:** Drawer opening/closing must never utilize abrupt `display: none` switches that interrupt CSS hardware-accelerated transforms; visibility and pointer events must transition after animation duration ($400\text{ms}$).
7. **Detached Window Independence:** Detached Visualizer Studio window must retain 100% functionality and remain rendered regardless of drawer open/closed lifecycle state.

---

## 6. Verification & Test Harness

- **Quiet LOC Modularity Audit:**
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\tests\audit_loc.ps1
  ```
- **Automated Headless Test Suite:**
  Run in modern browser via `tests/test_runner.html` or inspect exit code from `tests/test-suite.js`.
- **Target Invariant Validation:**
  - 100% test pass rate across mathematical spline, collision, parser, telemetry, profile CRUD, and color blending modules.
  - Zero console errors during audio initialization, device switching, or 3DoF camera rotation.


