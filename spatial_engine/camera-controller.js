/**
 * AuraBeat Spatial 3D Engine - Camera Controller
 * Manages 3DoF orientation camera head-look tracking:
 * - Left Click: Normal UI interaction
 * - Right Click & Drag: Natural first-person head-look (turns head in direction of drag)
 * - Double Click / Shift+Click: Instant snap reset to (0°, 0°)
 */

window.AuraBeatSpatial = window.AuraBeatSpatial || {};

(function () {
  class SpatialCameraController {
    constructor() {
      this.targetYaw = 0;   // Degrees (-60 to +60)
      this.targetPitch = 0; // Degrees (-35 to +35)
      this.yaw = 0;
      this.pitch = 0;

      this.isRightDragging = false;
      this.previousMouseX = 0;
      this.previousMouseY = 0;

      this.sensitivity = 0.18;
      this.damping = 0.14;

      this.listeners = [];
      this.targetElement = null;
      this.animationFrameId = null;
      this._camState = { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0, isDragging: false };
    }

    init(targetElement) {
      this.targetElement = targetElement || document.querySelector('.stage-viewport') || document.body;
      this.bindEvents();
      this.startLoop();
    }

    onCameraUpdate(fn) {
      if (typeof fn === 'function') {
        this.listeners.push(fn);
      }
    }

    bindEvents() {
      const viewportContainer = document.querySelector('.stage-viewport') || document.body;
      viewportContainer.addEventListener('contextmenu', (e) => e.preventDefault());

      window.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          this.isRightDragging = true;
          this.previousMouseX = e.clientX;
          this.previousMouseY = e.clientY;
          document.body.classList.add('camera-dragging');
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isRightDragging) return;

        const deltaX = e.clientX - this.previousMouseX;
        const deltaY = e.clientY - this.previousMouseY;

        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;

        // Head-Look: moving mouse right turns head right (+yaw), moving mouse up looks up (+pitch)
        this.targetYaw += deltaX * this.sensitivity;
        this.targetPitch -= deltaY * this.sensitivity;

        this.targetYaw = Math.max(-60, Math.min(60, this.targetYaw));
        this.targetPitch = Math.max(-35, Math.min(35, this.targetPitch));
      });

      window.addEventListener('mouseup', (e) => {
        if (e.button === 2) {
          this.isRightDragging = false;
          document.body.classList.remove('camera-dragging');
        }
      });

      window.addEventListener('dblclick', (e) => {
        if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
          this.resetCamera();
        }
      });
    }

    resetCamera() {
      this.targetYaw = 0;
      this.targetPitch = 0;
    }

    startLoop() {
      const state = this._camState;
      const update = () => {
        const deltaYaw = this.targetYaw - this.yaw;
        const deltaPitch = this.targetPitch - this.pitch;

        if (Math.abs(deltaYaw) > 0.001 || Math.abs(deltaPitch) > 0.001 || this.isRightDragging !== state.isDragging) {
          this.yaw += deltaYaw * this.damping;
          this.pitch += deltaPitch * this.damping;

          state.yaw = this.yaw;
          state.pitch = this.pitch;
          state.targetYaw = this.targetYaw;
          state.targetPitch = this.targetPitch;
          state.isDragging = this.isRightDragging;

          for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](state);
          }
        }

        this.animationFrameId = requestAnimationFrame(update);
      };
      update();
    }
  }

  window.AuraBeatSpatial.CameraController = new SpatialCameraController();
})();
