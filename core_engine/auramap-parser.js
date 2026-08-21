/**
 * AuraBeat Core Engine - .auramap Spatial Beatmap Parser & Chart Generator
 * Validates .auramap JSON schemas, computes 3D note coordinates, and embeds
 * dynamic narrative branching cues for Interactive GAMVs.
 */

window.AuraBeatCore = window.AuraBeatCore || {};

(function () {
  class AuraMapParser {
    validate(mapData) {
      if (!mapData || typeof mapData !== 'object') return { valid: false, error: 'Invalid JSON root' };
      if (!mapData.metadata || !mapData.metadata.songTitle || !mapData.metadata.bpm) {
        return { valid: false, error: 'Missing required metadata (songTitle, bpm)' };
      }
      if (!Array.isArray(mapData.notes)) {
        return { valid: false, error: 'Missing notes array' };
      }
      return { valid: true };
    }

    /**
     * Generates a procedural .auramap for an audio file with rhythmic notes and GAMV branch points.
     */
    generateProceduralMap(songTitle, artist, audioPath, bpm = 128, durationSec = 120, mode = 'sandbox_180') {
      const beatIntervalMs = (60 / bpm) * 1000;
      const notes = [];
      const narrativeEvents = [];
      const totalBeats = Math.floor((durationSec * 1000) / beatIntervalMs);

      for (let b = 4; b < totalBeats; b += (b % 8 === 0 ? 1 : 2)) {
        const timeMs = Math.round(b * beatIntervalMs);
        const lane = (b % 3) - 1; // -1 (Left), 0 (Center), 1 (Right)
        const isSlider = (b % 12 === 0);

        notes.push({
          id: `note_${b}`,
          timestampMs: timeMs,
          lane: lane,
          type: isSlider ? 'bezier_slider' : 'tap',
          position3D: {
            x: lane * 220,
            y: Math.sin(b * 0.5) * 60,
            z: 800
          },
          durationMs: isSlider ? Math.round(beatIntervalMs * 2) : 0
        });
      }

      if (mode === 'gamv_360') {
        narrativeEvents.push(
          { timestampMs: 15000, triggerCondition: 'accuracy_above_90', environmentTheme: 'dark_city', dimmingState: 1, colorGrade: '#4facfe' },
          { timestampMs: 45000, triggerCondition: 'accuracy_above_90', environmentTheme: 'crystal_fortress', dimmingState: 2, colorGrade: '#7f00ff' },
          { timestampMs: 80000, triggerCondition: 'always', environmentTheme: 'neon_grid', dimmingState: 0, colorGrade: '#00f2fe' }
        );
      }

      return {
        formatVersion: '1.0',
        metadata: {
          songTitle,
          artist,
          audioFile: audioPath,
          bpm,
          offsetMs: 120,
          difficulty: 'Hard',
          mode
        },
        notes,
        narrativeEvents
      };
    }
  }

  window.AuraBeatCore.AuraMapParser = new AuraMapParser();
})();
