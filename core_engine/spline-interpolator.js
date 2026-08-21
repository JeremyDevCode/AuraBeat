/**
 * AuraBeat Core Engine - Predictive Cubic Hermite Spline Interpolator
 * Implements continuous volumetric cylinder projection between 30-60Hz hand tracking frames
 * to prevent dropped hits during high-velocity swings, targeting >=92% hit registration.
 */

window.AuraBeatCore = window.AuraBeatCore || {};

(function () {
  class HermiteSplineInterpolator {
    constructor() {
      // Reusable vectors to prevent heap allocation on hot animation loops
      this._tempP = { x: 0, y: 0, z: 0 };
      this._tempV = { x: 0, y: 0, z: 0 };
    }

    /**
     * Computes 3D position along a Cubic Hermite Spline segment.
     * @param {Object} p0 - Start position {x, y, z}
     * @param {Object} m0 - Start tangent/velocity {x, y, z}
     * @param {Object} p1 - End position {x, y, z}
     * @param {Object} m1 - End tangent/velocity {x, y, z}
     * @param {number} t - Normalized sub-frame parameter [0, 1]
     * @param {Object} [out] - Optional target object to store result
     * @returns {Object} Interpolated 3D point {x, y, z}
     */
    evaluatePoint(p0, m0, p1, m1, t, out) {
      const target = out || this._tempP;
      const t2 = t * t;
      const t3 = t2 * t;

      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;

      target.x = h00 * p0.x + h10 * m0.x + h01 * p1.x + h11 * m1.x;
      target.y = h00 * p0.y + h10 * m0.y + h01 * p1.y + h11 * m1.y;
      target.z = h00 * p0.z + h10 * m0.z + h01 * p1.z + h11 * m1.z;

      return target;
    }

    /**
     * Computes velocity vector (first derivative) along the Hermite Spline.
     */
    evaluateVelocity(p0, m0, p1, m1, t, out) {
      const target = out || this._tempV;
      const t2 = t * t;

      const dh00 = 6 * t2 - 6 * t;
      const dh10 = 3 * t2 - 4 * t + 1;
      const dh01 = -6 * t2 + 6 * t;
      const dh11 = 3 * t2 - 2 * t;

      target.x = dh00 * p0.x + dh10 * m0.x + dh01 * p1.x + dh11 * m1.x;
      target.y = dh00 * p0.y + dh10 * m0.y + dh01 * p1.y + dh11 * m1.y;
      target.z = dh00 * p0.z + dh10 * m0.z + dh01 * p1.z + dh11 * m1.z;

      return target;
    }

    /**
     * Projects a continuous volumetric cylinder between raw camera frames
     * and tests for geometric collision against note targets.
     * @param {Object} p0 - Hand start position {x, y, z}
     * @param {Object} p1 - Hand end position {x, y, z}
     * @param {number} handRadius - Effective palm/finger radius (m or px)
     * @param {Object} notePos - Target note center {x, y, z}
     * @param {number} noteRadius - Note strike sphere radius
     * @returns {boolean} True if swept cylinder intersects note volume
     */
    testVolumetricSweep(p0, p1, handRadius, notePos, noteRadius) {
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const dz = p1.z - p0.z;
      const lenSq = dx * dx + dy * dy + dz * dz;

      // Single point collision if movement is negligible
      if (lenSq < 0.0001) {
        const distSq = (p0.x - notePos.x) ** 2 + (p0.y - notePos.y) ** 2 + (p0.z - notePos.z) ** 2;
        const totalR = handRadius + noteRadius;
        return distSq <= totalR * totalR;
      }

      // Project note center onto segment [p0, p1]
      const t = Math.max(0, Math.min(1, (
        (notePos.x - p0.x) * dx +
        (notePos.y - p0.y) * dy +
        (notePos.z - p0.z) * dz
      ) / lenSq));

      const projX = p0.x + t * dx;
      const projY = p0.y + t * dy;
      const projZ = p0.z + t * dz;

      const distSq = (projX - notePos.x) ** 2 + (projY - notePos.y) ** 2 + (projZ - notePos.z) ** 2;
      const thresholdRadius = handRadius + noteRadius;

      return distSq <= (thresholdRadius * thresholdRadius);
    }

    /**
     * Hit evaluation with environmental degradation tolerance.
     */
    evaluateHitAccuracy(timeDeltaMs, isDegradedEnv = false) {
      const absDelta = Math.abs(timeDeltaMs);
      const tolerance = isDegradedEnv ? 1.25 : 1.0;

      if (absDelta <= 45 * tolerance) return { rating: 'PERFECT', score: 100, deltaMs: timeDeltaMs };
      if (absDelta <= 90 * tolerance) return { rating: 'GREAT', score: 75, deltaMs: timeDeltaMs };
      if (absDelta <= 140 * tolerance) return { rating: 'GOOD', score: 50, deltaMs: timeDeltaMs };
      return { rating: 'MISS', score: 0, deltaMs: timeDeltaMs };
    }
  }

  window.AuraBeatCore.SplineInterpolator = new HermiteSplineInterpolator();
})();
