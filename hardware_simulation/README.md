# AuraBeat — Hardware Simulation Specs Directory

This directory contains individually structured JSON specification profiles for each simulated XR/AR hardware device supported by the **AuraBeat Spatial Rhythm Launcher**.

Each file stores the complete hardware profile used by `app.js` to drive: FOV viewport calibration, benchmark execution speed, telemetry display, latency simulation, PPD legibility warnings, and primary storage path references.

---

## Device Files

| File | Device | Category |
|---|---|---|
| `xreal_aura.json` | XREAL Aura | AR Smart Glasses (Optical See-Through) |
| `viture_luma_ultra.json` | VITURE Luma Ultra | XR Smart Glasses (Birdbath Optical) |
| `samsung_galaxy_xr.json` | Samsung Galaxy XR | Premium XR Headset (Passthrough MR) |
| `meta_quest_3.json` | Meta Quest 3 | Standalone VR/MR Headset (Passthrough) |

---

## Hardware Comparison Matrix

### Display & Optics

| Spec                         | XREAL Aura             | VITURE Luma Ultra            | Samsung Galaxy XR      | Meta Quest 3                 | Meta Quest 3S                |
|------------------------------|------------------------|------------------------------|------------------------|------------------------------|------------------------------|
| **Panel Type**               | Dual Sony Micro-OLED   | Dual Sony Micro-OLED         | Dual Micro-OLED        | Dual Fast-Switch LCD         | Single Fast-Switch LCD       |
| **Resolution (per eye)**     | 1920 × 1200            | 1920 × 1200                  | 3552 × 3840            | 2064 × 2208                  | 1832 × 1920                  |
| **Aspect Ratio**             | 16:10 (WUXGA)          | 16:10 (WUXGA)                | ~15:16 (Near-Square)   | ~15:16 (Near-Square)         | ~23:24 (Near-Square)         |
| **Refresh Rate**             | 120 Hz                 | 120 Hz                       | Up to 90 Hz            | 72 / 90 / 120 Hz             | 90 / 120 Hz                  |
| **FOV (Diagonal)**           | 70°                    | 52°                          | 118°                   | 110°                         | 104°                         |
| **FOV (H × V)**              | 61° × 39°              | ~45° × ~28°                  | 109° × 100°            | 103.8° × 96.4°               | 96° × 90°                    |
| **PPD**                      | ~31.5                  | ~44.6                        | ~32.5                  | ~20.0                        | ~20.0                        |
| **Optics Type**              | Waveguide              | Birdbath                     | Pancake                | Pancake                      | Fresnel                      |
| **Dimming**                  | 5-Level Electrochromic | Electrochromic (0.5%–40%)    | —                      | —                            | —                            |
| **Vision Correction**        | Prescription inserts   | Built-in diopter up to -4.0D | Magnetic inserts       | Third-party magnetic inserts | Lens inserts                 |
| **IPD**                      | Software-adjustable    | 58–70 mm                     | Software IPD           | 58–71 mm (physical slider)   | 3-position adjustment        |

---

### Compute Architecture

| Spec                  | XREAL Aura                     | VITURE Luma Ultra               | Samsung Galaxy XR       | Meta Quest 3              |
|-----------------------|--------------------------------|---------------------------------|-------------------------|---------------------------|
| **Architecture**      | Split-Compute (Glasses + Puck) | Host-Tethered (No internal SoC) | Integrated Standalone   | Integrated Standalone     |
| **Primary SoC**       | Snapdragon Reality Elite       | Host Device                     | Snapdragon XR2+ Gen 2   | Snapdragon XR2 Gen 2      |
| **Coprocessor**       | XREAL X1S Spatial Coprocessor  | HARMAN AudioEFX DSP + MCU       | Hexagon NPU + Dual ISP  | Integrated Sensor Hub     |
| **RAM**               | 12GB or 16GB LPDDR5            | Host Device RAM                 | 16GB LPDDR5             | 8GB LPDDR5 (68 GB/s)      |
| **Storage**           | 256GB or 512GB                 | Host Device Storage             | 256GB                   | 128GB or 512GB            |
| **Battery**           | 4,455 mAh (in Compute Puck)    | None (USB-C powered)            | External belt pack      | 5,060 mAh (in headset)    |
| **Battery Life**      | Not specified                  | N/A                             | ~2 hours                | ~2.2–3 hours              |
| **TDP**               | ~10W – 15W                     | ~2.5W – 4.5W                    | ~15W – 18W              | ~10W – 12W                |
| **Cooling**           | Puck passive/active            | None (glasses only)             | Active fan              | Active fan                |

---

### Connectivity

| Spec             | XREAL Aura            | VITURE Luma Ultra       | Samsung Galaxy XR  | Meta Quest 3                        |
|------------------|-----------------------|-------------------------|--------------------|-------------------------------------|
| **Wi-Fi**        | Wi-Fi 6/6E (puck)     | None (host-dependent)   | Wi-Fi 7            | Wi-Fi 6E                            |
| **Bluetooth**    | Bluetooth 5.3 (puck)  | None (host-dependent)   | Bluetooth 5.4      | Bluetooth 5.2 LE                    |
| **USB-C**        | DisplayPort-In (puck) | Magnetic pogo-pin USB-C | USB-C              | USB-C (USB 3.0)                     |
| **PC Streaming** | DisplayPort-In direct | USB-C DP Alt Mode       | Wi-Fi 7 wireless   | AirLink / Virtual Desktop (Wi-Fi 6E)|

---

### Audio

| Spec                | XREAL Aura                | VITURE Luma Ultra         | Samsung Galaxy XR     | Meta Quest 3             |
|---------------------|---------------------------|---------------------------|-----------------------|--------------------------|
| **Speakers**        | Open-ear spatial speakers | Open-ear spatial speakers | 2-way stereo speakers | Open-ear stereo speakers |
| **Audio Tuning**    | Bose spatial audio        | HARMAN AudioEFX           | Samsung / Qualcomm    | Meta 3D spatial audio    |
| **Microphones**     | 4-mic beamforming array   | Relies on host device     | 6-mic array           | Integrated mic array     |
| **Headphone Jack**  | Not specified             | None                      | Not specified         | 3.5mm audio jack         |

---

### Sensors & Tracking

| Spec                | XREAL Aura              | VITURE Luma Ultra                     | Samsung Galaxy XR           | Meta Quest 3                          |
|---------------------|-------------------------|---------------------------------------|-----------------------------|---------------------------------------|
| **Tracking**        | 6DoF (X1S Coprocessor)  | 6DoF (via SpaceWalker / Pro Neckband) | 6DoF inside-out             | 6DoF inside-out                       |
| **Total Cameras**   | 2 (+ privacy LED)       | 3 (1 RGB + 2 depth)                   | 12                          | 6 (4 tracking + 2 passthrough)        |
| **Passthrough**     | Optical see-through     | Optical see-through                   | Full-color 6.5 MP           | Full-color RGB                        |
| **Eye Tracking**    | No                      | No                                    | Yes (4 inner cameras)       | No                                    |
| **Depth Sensor**    | No                      | 2x grayscale depth sensors            | Depth sensing               | Depth projector                       |
| **Primary Input**   | Bare-hand gesture (X1S) | Bare-hand gesture (SpaceWalker)       | Eye + pinch gesture + voice | Touch Plus controllers + Direct Touch |
| **Wear Detection**  | No                      | Yes (auto on/off)                     | Not specified               | No                                    |

---

### Physical

| Spec            | XREAL Aura               | VITURE Luma Ultra              | Samsung Galaxy XR                  | Meta Quest 3      |
|-----------------|--------------------------|--------------------------------|------------------------------------|-------------------|
| **Weight**      | Under 95g (glasses only) | 83g                            | 545g (headset) + 302g (belt pack)  | 515g              |
| **Dimensions**  | Not specified            | 155 × 50.1 × 56.5 mm (folded) | Not specified                      | 184 × 160 × 98 mm |

---

## AuraBeat Simulation Profile Summary

| Metric                    | XREAL Aura                            | VITURE Luma Ultra                     | Samsung Galaxy XR                     | Meta Quest 3                          |
|---------------------------|---------------------------------------|---------------------------------------|---------------------------------------|---------------------------------------|
| **Simulation Latency**    | 8.4 ms                                | 12.2 ms                               | 5.8 ms                                | 9.6 ms                                |
| **Speed Factor**          | 0.45x (Fastest)                       | 1.35x (Slowest)                       | 0.70x                                 | 1.00x (Baseline)                      |
| **XR Benchmark Score**    | 98 / 100                              | 82 / 100                              | 95 / 100                              | 88 / 100                              |
| **FOV Class (CSS)**       | `fov-xreal`                           | `fov-viture`                          | `fov-samsung`                         | `fov-quest`                           |
| **PPD Warning**           | No                                    | No                                    | No                                    | **Yes** (~20 PPD, +14% font scale)    |
| **Storage Sim Path**      | `/storage/emulated/0/AuraBeat/Songs/` | `/storage/emulated/0/AuraBeat/Songs/` | `/storage/emulated/0/AuraBeat/Songs/` | `/storage/emulated/0/AuraBeat/Songs/` |

---

## Notes

- **Speed Factor** controls how fast or slow the `runMultiPassBenchmark()` benchmark animation runs in `app.js`. A lower value = faster execution = more powerful hardware.
- **PPD Warning** triggers the `#ppd-note-banner` banner and applies `.low-ppd-mode` CSS class (which increases UI font size by +14%) — currently exclusive to Meta Quest 3 due to its ~20.0 PPD display density falling below the 30 PPD clarity threshold.
- **Storage Sim Path** reflects the simulated primary internal storage path. No SD card slots exist on any of the supported hardware in this matrix.
- All specs were sourced from official manufacturer pages, GSMArena, vr-compare.com, and verified tech publications as of July 2026.
