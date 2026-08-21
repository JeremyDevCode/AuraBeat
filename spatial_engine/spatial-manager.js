/**
 * AuraBeat Spatial 3D Engine - Central Manager
 * Coordinates CameraController, Viewport3DRenderer, and SpatialGridCanvas modules.
 */

window.AuraBeatSpatial = window.AuraBeatSpatial || {};

class Spatial3DEngineManager {
  constructor() {
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    const viewportElem = document.querySelector('.stage-viewport');

    if (window.AuraBeatSpatial.CameraController) {
      window.AuraBeatSpatial.CameraController.init(viewportElem);
    }

    if (window.AuraBeatSpatial.Viewport3DRenderer) {
      window.AuraBeatSpatial.Viewport3DRenderer.init();
    }

    if (window.AuraBeatSpatial.SpatialGridCanvas) {
      window.AuraBeatSpatial.SpatialGridCanvas.init();
    }

    this.bindToolbarEvents();
    this.isInitialized = true;
    console.log("[AuraBeat] 3D Spatial VR/AR Camera Engine Initialized.");
  }

  bindToolbarEvents() {
    const resetBtn = document.getElementById('reset-camera-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetCamera();
      });
    }
  }

  resetCamera() {
    if (window.AuraBeatSpatial.CameraController) {
      window.AuraBeatSpatial.CameraController.resetCamera();
    }
  }

  getCameraOffset() {
    if (window.AuraBeatSpatial.SpatialGridCanvas) {
      return window.AuraBeatSpatial.SpatialGridCanvas.getCameraOffset();
    }
    return { offsetX: 0, offsetY: 0 };
  }
}

window.AuraBeatSpatial3DEngine = new Spatial3DEngineManager();
