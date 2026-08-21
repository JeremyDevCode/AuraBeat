/**
 * AuraBeat Spatial 3D Engine - Viewport 3D Renderer
 * Implements standard Tangent Pinhole Camera Projection with natural direct cursor panning,
 * allowing panels to glide smoothly across the optical lens and clip naturally at the FOV boundary.
 */

window.AuraBeatSpatial = window.AuraBeatSpatial || {};

(function () {
  class Viewport3DRenderer {
    constructor() {
      this.yawReadout = null;
      this.pitchReadout = null;
      this.FOCAL_LENGTH = 620; // Virtual focal distance in px
    }

    init() {
      this.yawReadout = document.getElementById('camera-yaw-readout');
      this.pitchReadout = document.getElementById('camera-pitch-readout');

      if (window.AuraBeatSpatial.CameraController) {
        window.AuraBeatSpatial.CameraController.onCameraUpdate((camState) => {
          this.render(camState);
        });
      }
    }

    render({ yaw, pitch }) {
      if (!this.yawReadout) this.yawReadout = document.getElementById('camera-yaw-readout');
      if (!this.pitchReadout) this.pitchReadout = document.getElementById('camera-pitch-readout');

      // Natural Direct Drag Panning:
      // Dragging mouse RIGHT (+yaw) -> Panel glides smoothly to RIGHT (+panX) with cursor
      // Dragging mouse UP (+pitch) -> Panel glides smoothly UP (-panY) with cursor
      const radYaw = (yaw * Math.PI) / 180;
      const radPitch = (pitch * Math.PI) / 180;

      const panX = (Math.tan(radYaw) * this.FOCAL_LENGTH).toFixed(1);
      const panY = (-Math.tan(radPitch) * this.FOCAL_LENGTH).toFixed(1);
      const rotY = (yaw * 0.35).toFixed(2);
      const rotX = (-pitch * 0.35).toFixed(2);

      const worldRig = document.getElementById('spatial-world-rig');
      if (worldRig) {
        worldRig.style.transform = `translate3d(${panX}px, ${panY}px, 0px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }

      if (this.yawReadout) {
        this.yawReadout.textContent = `${yaw >= 0 ? '+' : ''}${Math.round(yaw)}°`;
      }
      if (this.pitchReadout) {
        this.pitchReadout.textContent = `${pitch >= 0 ? '+' : ''}${Math.round(pitch)}°`;
      }
    }
  }

  window.AuraBeatSpatial.Viewport3DRenderer = new Viewport3DRenderer();
})();
