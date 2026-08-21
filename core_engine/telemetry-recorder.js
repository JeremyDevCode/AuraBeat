/**
 * AuraBeat Core Engine - .aurarec Telemetry Recorder
 * Records raw spatial coordinates (head quaternions, joint velocities, hit timestamps)
 * to avoid battery/thermal overhead of local MP4 encoding on standalone XR hardware.
 */

window.AuraBeatCore = window.AuraBeatCore || {};

(function () {
  class TelemetryRecorder {
    constructor() {
      this.isRecording = false;
      this.sessionMetadata = {};
      this.frames = [];
      this.startTime = 0;
      this.frameCount = 0;
    }

    startRecording(deviceModel = 'XREAL Aura', songTitle = 'Unknown') {
      this.isRecording = true;
      this.frames = [];
      this.frameCount = 0;
      this.startTime = performance.now();
      this.sessionMetadata = {
        deviceModel,
        songTitle,
        recordTimestamp: new Date().toISOString(),
        renderFps: 120
      };
    }

    recordFrame(headPose, leftHand, rightHand, hits = []) {
      if (!this.isRecording) return;

      const elapsedMs = Math.round(performance.now() - this.startTime);
      this.frames.push({
        frameIndex: this.frameCount++,
        timestampMs: elapsedMs,
        headPose: headPose || { qx: 0, qy: 0, qz: 0, qw: 1 },
        leftHand: leftHand || { x: -0.2, y: -0.1, z: 0.5, vx: 0, vy: 0, vz: 0 },
        rightHand: rightHand || { x: 0.2, y: -0.1, z: 0.5, vx: 0, vy: 0, vz: 0 },
        hits
      });
    }

    stopRecording(finalScore = 0, accuracyPct = 100) {
      this.isRecording = false;
      return {
        recordVersion: '1.0',
        sessionMetadata: {
          ...this.sessionMetadata,
          totalFrames: this.frameCount,
          finalScore,
          accuracyPercent: accuracyPct
        },
        frameTelemetry: this.frames
      };
    }

    exportJson(finalScore, accuracyPct) {
      const data = this.stopRecording(finalScore, accuracyPct);
      return JSON.stringify(data, null, 2);
    }
  }

  window.AuraBeatCore.TelemetryRecorder = new TelemetryRecorder();
})();
