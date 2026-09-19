# AuraBeat — Spatial Audio Rhythm Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20XR%20%7C%20Spatial%20Computing-00f2fe.svg)](#)
[![Status](https://img.shields.io/badge/Status-Phase%201%3A%20Make%20It%20Work-ff9800.svg)](#-core-guiding-philosophy--roadmap)
[![Development](https://img.shields.io/badge/Maintainer-Solo%20Developer-blueviolet.svg)](#)

> [!WARNING]
> ### Public Repository Status: Frozen Web Prototype vs. Active Android XR Engine
>
> - **Frozen Web Prototype:** The code currently hosted on this public branch represents an early, frozen web-based proof-of-concept (HTML5 / Canvas 2D simulation layer).
> - **Native Android XR Rewrite:** Active development has fully transitioned to a ground-up native **Android XR** engine built with Kotlin, the **Jetpack XR SDK**, **Jetpack Compose for XR**, and dedicated low-latency audio pipelines.
> - **Solo Developer Cadence:** AuraBeat is engineered by a **solo developer**. Public repository updates are pushed in consolidated architectural milestones rather than frequent micro-commits.

---

## 🧭 Core Guiding Philosophy & Roadmap

Development follows a strict 3-phase engineering discipline inspired by the [*Distant Horizons*](https://gitlab.com/distant-horizons/distant-horizons) project architecture:

```
[ Phase 1: Make it Work ]  ▶  [ Phase 2: Make it Good ]  ▶  [ Phase 3: Make it Fast ]
     (CURRENT STAGE)                    (Upcoming)                      (Planned)
```

### 🟡 Phase 1: Make it Work (CURRENT STAGE)
*Establishing the runtime foundation and deterministic audio/rhythm synchronization.*
- **Runtime Foundation:** Initialize the native Android XR session lifecycle and root `Subspace` volume containers.
- **Audio Synchronization:** Implement robust multi-track audio stem decoding, audio hardware clock drift compensation, and millisecond-accurate sync stability.
- **Functional Primitives:** Focus strictly on rhythm mechanics, hit-detection math, and raw debug/telemetry overlays over visual polish.

### ⚪ Phase 2: Make it Good
*Refining spatial ergonomics, near-eye optics, and intuitive interaction.*
- **Spatial UI Refactoring:** Migrate HUD and menu systems to Jetpack XR `SpatialPanel`s and floating reactive `Orbiter`s.
- **Near-Eye Optical Ergonomics:** Optimize rendering for Optical See-Through (OST) micro-OLED displays—leveraging true additive black (`#000000` for pure optical transparency), high-contrast legibility, and active safeguards against subpixel wear and thermal concentration.
- **Natural Spatial Affordances:** Implement 6DoF hand tracking gestures and binaural 3D spatial audio localization.

### ⚪ Phase 3: Make it Fast
*Profiling memory, latency budgets, and hardware thermals.*
- **Zero-Allocation Audio Buffers:** Profile and optimize memory allocations for concurrent real-time stem mixing without garbage collection pauses.
- **Compositor Optimization:** Tune rendering passes to strictly meet motion-to-photon latency deadlines (90 Hz / 120 Hz).
- **Thermal & Power Budgeting:** Minimize sustained CPU/GPU compute loads to manage thermal dissipation on wearable XR hardware.

---

## 🥽 Display Architecture: Near-Eye Micro-OLED Projection

AuraBeat's spatial layout engine fundamentally diverges from standard mobile application design:

- **Additive Light Transmission:** In optical see-through (OST) waveguides, pixels do not obstruct ambient light—they emit additive illumination onto transparent combiners. True black (`#000000`) emits zero light, yielding optical transparency.
- **The Failure of 2D Mobile Conventions:** Conventional 2D mobile patterns rely heavily on opaque background cards and dark-gray surfaces (e.g., `#121212` or Material Dark tones). On near-eye optical displays, dark-gray surfaces appear as muddy, semi-transparent grey boxes hovering in the user's physical environment, degrading immersion and increasing eye strain.
- **Optics-First Geometry:** UI elements are structured with luminous vector contours, adaptive edge contrast, and spatial anchors specifically tuned for micro-OLED projection rather than flat mobile glass.

---

## 📦 Repository Structure (Legacy Web Prototype)

The files in this repository reflect the early 2D browser-based simulation prototype:

- **`index.html` / `app.js`:** Static web simulation activator and orchestration loop.
- **`core_engine/`:** Audio reactivity analysis, Hermite spline interpolation, and optical filters.
- **`hardware_simulation/`:** Optical FOV aperture specs and profiles for devices like XREAL Aura, Samsung Galaxy XR, and Meta Quest 3.
- **`intro/Audio/`:** 23 Opus audio stems used for DSP benchmarking and sync testing.

---

## 🛠️ Build & Environment Setup

- **Android XR Native Engine:** Environment requirements, Android Studio setup instructions, and Jetpack XR SDK dependencies will be published once **Phase 1: Make it Work** reaches milestone stability.
- **Exploring the Legacy Web Prototype:** To test the legacy proof-of-concept, open [index.html](index.html) directly in any modern web browser or serve via a lightweight static file server.

---

## 📄 License & Audio Fair Use Notice

- **Source Code:** Released under the [MIT License](LICENSE).
- **Audio Assets:** All included audio stems are fixtures provided strictly for **non-commercial technical benchmarking, spatial DSP evaluation, and Hermite spline rhythm testing**. All copyrights remain with their original artists. Refer to [`intro/Audio/DISCLAIMER.md`](intro/Audio/DISCLAIMER.md) for details.
