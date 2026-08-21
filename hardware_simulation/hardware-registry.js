/**
 * AuraBeat Hardware Simulation Registry
 * Standardized hardware profiles, optical FOV bounds, and telemetry metrics
 * for XREAL Aura, VITURE Luma Ultra, Samsung Galaxy XR, and Meta Quest 3/3S.
 */

window.AuraBeatHardware = window.AuraBeatHardware || {};

(function () {
  const PROFILE_UI = {
    xreal: {
      fovClass: 'fov-xreal',
      activeClass: 'fov-xreal-active',
      hFov: '61°',
      vFov: '39°',
      dFov: '70°',
      badge: 'XREAL Aura (70°)'
    },
    viture: {
      fovClass: 'fov-viture',
      activeClass: 'fov-viture-active',
      hFov: '45°',
      vFov: '28°',
      dFov: '52°',
      badge: 'VITURE Luma (52°)'
    },
    samsung: {
      fovClass: 'fov-samsung',
      activeClass: 'fov-samsung-active',
      hFov: '109°',
      vFov: '100°',
      dFov: '118°',
      badge: 'Samsung XR (118°)'
    },
    quest: {
      fovClass: 'fov-quest',
      activeClass: 'fov-quest-active',
      hFov: '103.8°',
      vFov: '96.4°',
      dFov: '110°',
      badge: 'Quest 3 (110°)'
    },
    quest3s: {
      fovClass: 'fov-quest3s',
      activeClass: 'fov-quest3s-active',
      hFov: '96°',
      vFov: '90°',
      dFov: '104°',
      badge: 'Quest 3S (104°)'
    }
  };

  const DEVICE_PROFILES = {
    xreal: {
      id: 'xreal',
      name: 'XREAL Aura',
      categoryType: 'AR',
      soc: 'Qualcomm Snapdragon Reality Elite Platform',
      coproc: 'XREAL X1S Spatial Coprocessor',
      ram: '12GB LPDDR5 / 16GB LPDDR5',
      tdp: '~10W – 15W (Compute Puck)',
      latency: '8.4 ms',
      panel: 'Dual Sony Micro-OLED (16:10)',
      hz: '120 Hz',
      ppd: '~31.5 PPD',
      ppdVal: 31.5,
      speedFactor: 0.45,
      score: 98,
      scoreLabel: 'AR SCORE',
      text: 'XREAL Aura (1920×1200 | 16:10 | 70° FOV | ~31.5 PPD | 120Hz)',
      dimmingLevels: [0, 35, 100],
      ...PROFILE_UI.xreal
    },
    viture: {
      id: 'viture',
      name: 'VITURE Luma Ultra',
      categoryType: 'AR',
      soc: 'Hosted entirely on connected device (PC / Deck / Phone)',
      coproc: 'Onboard Sensor MCU',
      ram: 'Hosted by connected device',
      tdp: '~2.5W – 4.5W (Host Power)',
      latency: '12.2 ms',
      panel: 'Dual Sony Micro-OLED (16:10)',
      hz: '120 Hz',
      ppd: '~44.6 PPD',
      ppdVal: 44.6,
      speedFactor: 1.35,
      score: 82,
      scoreLabel: 'AR SCORE',
      text: 'VITURE Luma Ultra (1920×1200 | 16:10 | 52° FOV | ~44.6 PPD | 120Hz)',
      dimmingLevels: [0.5, 40],
      ...PROFILE_UI.viture
    },
    samsung: {
      id: 'samsung',
      name: 'Samsung Galaxy XR',
      categoryType: 'XR',
      soc: 'Qualcomm Snapdragon XR2+ Gen 2',
      coproc: 'Hexagon NPU + Dual ISP (12 Cameras)',
      ram: '16GB LPDDR5',
      tdp: '~15W – 18W (Active Fan)',
      latency: '5.8 ms',
      panel: 'Dual Micro-OLED (Near-Square)',
      hz: 'Up to 90 Hz (60 / 72 / 90 Hz modes)',
      ppd: '~32.5 PPD',
      ppdVal: 32.5,
      speedFactor: 0.70,
      score: 95,
      scoreLabel: 'XR SCORE',
      text: 'Samsung Galaxy XR (3552×3840 | Near-Square | 118° FOV | ~32.5 PPD | 90Hz)',
      dimmingLevels: null,
      ...PROFILE_UI.samsung
    },
    quest: {
      id: 'quest',
      name: 'Meta Quest 3',
      categoryType: 'VR',
      soc: 'Qualcomm Snapdragon XR2 Gen 2',
      coproc: 'Integrated Sensor Hub (IMU & Depth)',
      ram: '8GB LPDDR5 (68 GB/s memory bandwidth)',
      tdp: '~10W – 12W (Active Fan)',
      latency: '9.6 ms',
      panel: 'Dual Fast-Switch LCD (Near-Square)',
      hz: '72 / 90 / 120 Hz',
      ppd: '~20 PPD',
      ppdVal: 20,
      speedFactor: 1.00,
      score: 88,
      scoreLabel: 'VR SCORE',
      text: 'Meta Quest 3 (2064×2208 | Near-Square | 110° FOV | ~20 PPD | 120Hz)',
      dimmingLevels: null,
      ...PROFILE_UI.quest
    },
    quest3s: {
      id: 'quest3s',
      name: 'Meta Quest 3S',
      categoryType: 'VR',
      soc: 'Qualcomm Snapdragon XR2 Gen 2',
      coproc: 'Integrated Sensor Hub',
      ram: '8GB LPDDR5',
      tdp: '~10W – 12W (Active Fan)',
      latency: '9.8 ms',
      panel: 'Single Fast-Switch LCD (Near-Square)',
      hz: '90 / 120 Hz',
      ppd: '~20 PPD',
      ppdVal: 20,
      speedFactor: 1.05,
      score: 86,
      scoreLabel: 'VR SCORE',
      text: 'Meta Quest 3S (1832×1920 | Near-Square | 104° FOV | ~20 PPD | 120Hz)',
      dimmingLevels: null,
      ...PROFILE_UI.quest3s
    }
  };

  window.AuraBeatHardware.profiles = DEVICE_PROFILES;
  window.AuraBeatHardware.getProfile = function (key) {
    return DEVICE_PROFILES[key] || DEVICE_PROFILES.xreal;
  };
  window.AuraBeatHardware.getAllProfiles = function () {
    return DEVICE_PROFILES;
  };
})();
