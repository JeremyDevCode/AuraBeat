# AuraBeat — Spatial Audio Rhythm Game & XR Hardware Simulation Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-AR%20Glasses%20%7C%20VR%20%26%20XR%20Headsets-00f2fe.svg)](#-target-hardware-simulation-matrix)
[![Hackathon](https://img.shields.io/badge/CLAD%20Summer%20Hackathon-Ambient%20Suite%20Track-ff007f.svg)](#-the-clad-summer-hackathon-developer-roadmap--ambient-suite-ecosystem)
[![Audio](https://img.shields.io/badge/Audio-23%20Opus%20Tracks%20(193kbps)-a855f7.svg)](#-features--architecture-highlights)
[![Modularity](https://img.shields.io/badge/Modularity-%3C%20300%20LOC%20Per%20File%20(100%25%20Green)-00e676.svg)](#-project-structure)
[![Zero-Build](https://img.shields.io/badge/Build-Pure%20Vanilla%20Web%20(Zero--Build)-blue.svg)](#-running-locally)

> [!IMPORTANT]
> **Developer Note & Spatial Prototyping Architecture:**
> **AuraBeat** is a spatial audio rhythm game currently in active development. As an independent developer engineering for next-generation spatial computing without physical access to all target hardware kits (XREAL Aura, VITURE Luma, Samsung Galaxy XR, Meta Quest headsets), AuraBeat is built with a **2D Widescreen Hardware Simulation & Prototyping Layer**.
> 
> This architecture enables full validation of spatial UI/UX layouts, `.auramap` beatmap storage indexing, telemetry benchmarks, optical FOV scaling, and multi-device performance profiling on standard browsers—making it **streamlined and seamless to port to native Android XR, Meta Horizon OS, and WebXR** as physical developer hardware becomes accessible.

---

**AuraBeat** combines spatial rhythm game mechanics with an optics & hardware telemetry simulator. Designed with Xiaomi HyperOS 2.0 superellipse geometry, asymmetric bento HUD layouts, and tactile motion physics, **AuraBeat** prepares rhythm engine execution for next-generation spatial optics.

---

## 🌟 The CLAD Summer Hackathon, Developer Roadmap & Ambient Suite Ecosystem

> [!NOTE]
> **Current Status & Temporary AuraBeat Sprint Pause (Sept 2026):**
> With university **Exam Week commencing September 1st**, academic preparation takes top priority. To balance study commitments with ambitious software innovation, active development on AuraBeat's rhythm gameplay is temporarily **postponed** to allocate focused energy toward **The CLAD Summer Hackathon** to engineer a rough prototype of the **Ambient Suite**.

---

### 🎯 The Challenge: Balancing Exams, Hackathon Innovation & Personal Accountability
As a solo independent developer at **AuraLabs Studio**, balancing rigorous academic exams with competitive engineering requires ruthless discipline. Studies take the highest precedence—and every remaining hour of focus is dedicated to bringing the **Ambient Suite** to life during The CLAD Summer Hackathon.

> [!TIP]
> **A Transparent Note from the Developer:**
> While winning the hackathon is far from guaranteed—especially under tight exam constraints—participating is an invaluable personal milestone. I have often struggled with severe procrastination and keeping up with development timelines. Taking on this challenge serves as a vital **accountability forcing function** to build discipline, push through executive dysfunction, and turn abstract spatial ideas into tangible working code.

---

### 🌌 The Vision: The Ambient Suite Ecosystem
The **Ambient Suite** is an offline-first, privacy-respecting spatial computing & personal telemetry ecosystem designed for lightweight smart glasses and mobile companion hosts:

```
                      ┌─────────────────────────────────┐
                      │          AMBIENT TRACK          │
                      │  (Central Hub, Task Tree,       │
                      │   Grant Ledger, Pearson Engine) │
                      └───────────────┬─────────────────┘
                                      │ (On-Demand Content Providers)
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  DAILY AMBIENT   │        │  SPORT AMBIENT   │        │   LENS AMBIENT   │
│  Biometrics, SQI,│        │  HR Zones, VO2,  │        │  Gemini Vision,  │
│  IoT (BLE/UDP)   │        │  Low-Latency BLE │        │  Homography, ESWF│
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

1. **Daily Ambient (Biometric & IoT Sentinel):**
   - Direct BLE GATT ingestion (Xiaomi S400 Scale, Smartwatch) and local encrypted UDP bypass for smart appliances.
   - Deterministic mathematical models: Body Mass Index (BMI), Mifflin-St Jeor Basal Metabolic Rate (BMR), and weighted Sleep Quality Index (SQI).
2. **Ambient Track (Central Hub & Correlation Engine):**
   - Hierarchical non-linear Task Tree with Recursive Completion Factor (TTCF) mathematics.
   - Cross-Domain Pearson Correlation ($r_{xy}$) linking physiological variables (sleep, glycemic index) to daily cognitive task velocity.
   - Local-first SQLite Write-Ahead Logging (WAL) and audit-grade grant expenditure ledger.
3. **Sport Ambient (Spatial Athletic HUD):**
   - Real-time athletic stress telemetry using Tanaka Max HR, Karvonen Target Heart Rate zones, and rolling Uth-Sørensen $VO_2\text{ Max}$ estimation.
   - Glanceable, color-vignetted peripheral HUD casting to smart glasses with sub-5ms latency.
4. **Lens Ambient (Multimodal Spatial Vision):**
   - Passive context capture via smart glasses camera using Gemini Multimodal API structured JSON parsing.
   - Planar Homography Matrix ($H$) for distortion-free head-tracking HUD alignment and Energy Slump Warning Factor (ESWF) metabolic alerts.

---

### 👓 The Hardware Mission: Funding the XREAL One Pro
A critical challenge in developing spatial computing software like **AuraBeat** and the **Ambient Suite** is being **restricted to standard 2D flat displays**. Simulating 3DoF/6DoF optics, monocular HUD viewports, and peripheral vision cues on flat screens requires extensive emulation layers.

Competing in **The CLAD Summer Hackathon** is aimed at unlocking the resources needed to acquire true wearable AR hardware—specifically the **XREAL One Pro**:
1. **Accelerate AuraBeat & Ambient Suite Development:** Transitioning directly from 2D widescreen simulation to native DisplayPort Alt-Mode casting, NRSDK spatial anchors, and real Micro-OLED birdbath optics.
2. **Conquer Procrastination & Supercharge Daily Productivity:** Creating a floating, distraction-free spatial workspace to organize daily study schedules, task trees, and engineering sprints without physical monitor limits.
3. **True Spatial Progressive HUD Validation:** Validating Easy Mode (Peripheral Guardian), Advanced Mode (Metrics Grid), and Expert Mode (Diagnostic Engine) in real-world ambient lighting.

---

## 👓 Target Hardware Simulation Matrix

AuraBeat includes calibrated hardware specifications, optical FOV apertures, and simulated telemetry profiles for:

| Device | Category | Primary SoC | Display Optics | FOV (Diag) | PPD Density | Aspect Ratio | Benchmark Tier |
|---|---|---|---|---|---|---|---|
| **XREAL Aura** | AR Smart Glasses | Snapdragon® Reality Elite + X1S Coprocessor | Dual Sony Micro-OLED | **70°** | ~31.5 PPD | 16:10 (WUXGA) | **AR SCORE: 98** |
| **Samsung Galaxy XR** | Premium XR Headset | Snapdragon® XR2+ Gen 2 + Hexagon NPU/ISP | Dual Micro-OLED (4K+ per eye) | **118°** | ~32.5 PPD | ~15:16 (Near-Square) | **XR SCORE: 95** |
| **Meta Quest 3** | Standalone VR/MR | Snapdragon® XR2 Gen 2 + Sensor Hub | Dual Fast-Switch LCD | **110°** | ~20.0 PPD | ~15:16 (Near-Square) | **VR SCORE: 88** |
| **Meta Quest 3S** | Standalone VR/MR | Snapdragon® XR2 Gen 2 + Sensor Hub | Single Fast-Switch LCD | **104°** | ~20.0 PPD | ~23:24 (Near-Square) | **VR SCORE: 86** |
| **VITURE Luma Ultra** | XR Smart Glasses | Host-Driven (USB-C Tethered) + Sensor MCU | Dual Sony Micro-OLED (1500 nits) | **52°** | ~44.6 PPD | 16:10 (WUXGA) | **AR SCORE: 82** |

*Detailed JSON specification profiles are available in the [`hardware_simulation/`](hardware_simulation/) directory.*

---

## ✨ Features & Architecture Highlights

### 🏝️ Dynamic Island Simulation Capsule
- Top-mounted **Dynamic Island Capsule** that smoothly morphs into the expanded frosted-glass hardware control drawer using fluid cubic-bezier spring physics (`transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1)`).
- Quick toggles for Hardware Profile recalibration, FOV Optical Lens Masking vs Unclipped View, 3D Camera Reset, and Intro Restart.

### 🎵 23-Track Opus BGM Jukebox Engine
- **Full 23-Track Audio Library:** High-fidelity Opus audio stems (193 kbps) featuring *MA:RK, Virtual Riot, Porter Robinson, Vicetone, Nitro Fun, Cartoon, Wintergatan, gabriawll, mekaloton, Rival, ThatBehavior, Dirty Palm, FAR, F_NERA, Joyful, Pretty Patterns, Pure 100%, RJ Pasin, Ram99*.
- **Apple Music-Style Controls:**
  - **Shuffle Mode (`🔀`):** Randomized non-repeating queue.
  - **Repeat 3-State Cycle (`🔁` / `🔂`):** Repeat All, Repeat One Track, and Repeat OFF.
  - **Randomize Dice (`🎲`):** Instantly rolls and plays a random song from the library.
- **Unmuted Native Audio Routing:** Direct HTML5 DOM speaker output with zero cross-origin muting on local `file:///` and live web servers. Default starting track: **`MA:RK — Glow`** at **25% volume**.

### 🔴🟣🔵 Custom Real-PCM Frequency-Reactive 3D Vector Orbs
- Floating vector gradient orbs with sample-accurate, acoustic PCM frequency responses:
  - 🔴 **Red Orbs (`BASS`):** Reactive to real sub-bass & 808 glides with **$+32\%$** sustained radiance and **$+20\%$** staccato kicks.
  - 🟣 **Purple Orbs (`MID`):** Reactive to vocals, chords, and synth harmonics with **$+16\%$** smooth pulse.
  - 🔵 **Cyan Orbs (`TREBLE`):** Reactive to real high-frequency transients and hi-hats with **$+10\%$** crisp micro-shimmers.
- **Strict Silence Gate:** Produces **`0.000` energy (zero false beats)** during silence or quiet drops.
- **Live BPM Analysis & Saved Data Badge:** Real-time tempo lock (`[ ⚡ 124 BPM (Locked) ]`) with persistent `localStorage` profile caching and a mini 3-band spectrum meter.

### 🚀 Modular Intro & Diagnostic Benchmark Pipeline
- **Stage 0: Pre-Loader (`stage-loader.js`)**: Subsystem verification scanner.
- **Stage 1: Title Reveal (`stage-intro.js`)**: Spatial rhythm branding presentation.
- **Stage 2: Pre-Flight Indexer (`system-indexer.js`)**: Real filesystem scanner indexing 23 Opus audio stems, 6 DSP modules, and 5 hardware profiles.
- **Stage 3: Telemetry Benchmark (`diagnostic-benchmark.js`)**: Multi-pass hardware stress benchmark featuring the **Holographic Cybernetic Core**, thermal junction modeling, and device-specific scores.
- **Stage 4: Spatial UI Selection (`ui-selection.js`)**: Architectural framework showcases for Xiaomi HyperOS 2.0, Apple visionOS, and Samsung One UI XR with spring hover physics.

---

## 🛠️ Project Structure

Every module adheres to a strict **`< 300 LOC`** architectural constraint:

```
AuraBeat/
├── index.html                   # Activator Shell & Engine Mount Point
├── app.js                       # Central Orchestration & Particle Loop (< 150 LOC)
├── styles.css                   # HyperOS 2.0 Design Tokens, FOV Bounds & Glassmorphism
├── core_engine/                 # Mathematical, Audio DSP & Optics Subsystems
│   ├── audio-dsp-vbe.js         # Virtual Bass Extension (VBE) DSP Filter
│   ├── audio-reactive-engine.js # Real-PCM Wave Slicing & Silence-Gated Analyzer
│   ├── auramap-parser.js        # .auramap 3D Spatial Beatmap Parser
│   ├── optical-dimming-filter.js# Optical Dimming & Contrast Transmission
│   ├── ost-color-blender.js     # Harmonic OST Color Theme Engine
│   ├── spline-interpolator.js   # Cubic Hermite Spline Trajectory Interpolator
│   └── telemetry-recorder.js    # Performance Telemetry & Hardware Profiler
├── hardware_simulation/         # Hardware Simulation & BGM Modules
│   ├── bgm-player.js            # 23-Track Opus BGM Jukebox Player (< 250 LOC)
│   ├── hardware-drawer.js       # Dynamic Island Capsule Morphing Drawer (< 160 LOC)
│   ├── hardware-registry.js     # Calibration Matrices for XREAL, VITURE, Quest, Samsung
│   ├── meta_quest_3.json        # Hardware Profile: Meta Quest 3
│   ├── meta_quest_3s.json       # Hardware Profile: Meta Quest 3S
│   ├── samsung_galaxy_xr.json   # Hardware Profile: Samsung Galaxy XR
│   ├── viture_luma_ultra.json   # Hardware Profile: VITURE Luma Ultra
│   ├── xreal_aura.json          # Hardware Profile: XREAL Aura
│   └── README.md                # Hardware Calibration Matrix Documentation
├── intro/                       # Modular Intro & Benchmark Flow Pipeline
│   ├── Audio/                   # 23 High-Fidelity Opus Audio Stems (193kbps)
│   │   └── DISCLAIMER.md        # Non-Commercial Research & Fair Use Disclaimer
│   ├── benchmark-auth.js        # Stage 3 Authorization Modal Lock
│   ├── diagnostic-benchmark.js  # Stage 3 Multi-Pass Diagnostic Benchmark
│   ├── intro-manager.js         # Central Pipeline State Machine Coordinator
│   ├── stage-intro.js           # Stage 1 Title Reveal Screen
│   ├── stage-loader.js          # Stage 0 Pre-Loader Subsystem Scanner
│   ├── system-indexer.js        # Stage 2 Pre-Flight Storage & Stem Indexer
│   └── ui-selection.js          # Stage 4 Spatial UI Framework Selector
├── spatial_engine/              # 3D Spatial Vector & Camera Engine
│   ├── camera-controller.js     # 3DoF First-Person Head-Look Drag Controller
│   ├── spatial-grid-canvas.js   # Frequency-Reactive Vector Gradient Orbs
│   ├── spatial-manager.js       # 3D Spatial Scene Coordinator
│   └── viewport-3d-renderer.js  # 3D Optical Matrix Viewport Renderer
├── tests/                       # Automated Quality & Modularity Test Suites
│   ├── audit_loc.ps1            # PowerShell LOC Enforcement Audit (< 300 LOC)
│   ├── test-suite.js            # Automated Assertion Test Runner
│   └── test_runner.html         # In-Browser Graphical Test Suite
├── LICENSE                      # MIT Open Source License
└── README.md                    # Project Architecture & Setup Guide
```

---

## 🚀 Running Locally

No heavy Node build tools, bundlers, or compilation steps required:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JeremyDevCode/AuraBeat.git
   cd AuraBeat
   ```
2. **Open in your browser:**
   - Double-click [index.html](index.html) in File Explorer, or serve with any local HTTP server (e.g. VS Code *Live Server*, `python -m http.server`, or `npx serve`).
3. **Controls:**
   - **Click / Tap:** Normal UI interaction and track playback.
   - **Right-Click & Drag:** First-person 3DoF spatial head-look camera.
   - **Double-Click / Shift+Click:** Snap camera back to center `(0°, 0°)`.
   - **F11:** Fullscreen Widescreen mode to simulate 16:9 AR FOV optics accurately.

---

## 📄 License & Audio Fair Use Notice

- **Software & Engine:** Open source under the [MIT License](LICENSE).
- **Audio Assets:** All included audio stems are sample fixtures provided strictly for **non-commercial technical benchmarking, spatial DSP evaluation, and Hermite spline rhythm testing**. All copyrights belong to their respective original artists and labels. See [`intro/Audio/DISCLAIMER.md`](intro/Audio/DISCLAIMER.md) for the complete legal notice.
