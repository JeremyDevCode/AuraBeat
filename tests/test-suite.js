/**
 * AuraBeat Automated Test Suite
 * Validates Cubic Hermite math, volumetric collision sweep, .auramap schema,
 * telemetry recording, hardware profiles, and the strict < 300 LOC constraint.
 */

const fs = require('fs');
const path = require('path');

// Mock browser window objects for headless testing
global.window = global;
global.performance = { now: () => Date.now() };

console.log("==================================================");
console.log("  AURABEAT XR SIMULATION ENGINE — TEST SUITE");
console.log("==================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Load Hardware Registry
require('../hardware_simulation/hardware-registry.js');
const hw = window.AuraBeatHardware;
assert(hw && hw.profiles && hw.profiles.xreal, "Hardware Registry loads XREAL Aura profile");
assert(hw.getProfile('quest').ppdVal === 20, "Quest 3 profile reports 20 PPD");
assert(hw.getProfile('xreal').score === 98, "XREAL Aura profile reports score 98");

// 2. Load and Test Cubic Hermite Spline Engine
require('../core_engine/spline-interpolator.js');
const spline = window.AuraBeatCore.SplineInterpolator;
assert(spline, "SplineInterpolator module loaded");

const p0 = { x: 0, y: 0, z: 0 };
const m0 = { x: 10, y: 0, z: 0 };
const p1 = { x: 100, y: 0, z: 0 };
const m1 = { x: 10, y: 0, z: 0 };

const midPoint = spline.evaluatePoint(p0, m0, p1, m1, 0.5);
assert(Math.abs(midPoint.x - 50) < 0.001, "Hermite midpoint interpolation satisfies symmetry (x=50)");

// Volumetric Cylinder Sweep Hit Registration Test
const handStart = { x: 0, y: 0, z: 10 };
const handEnd = { x: 100, y: 0, z: 10 };
const noteTarget = { x: 50, y: 2, z: 10 };
const isHit = spline.testVolumetricSweep(handStart, handEnd, 5, noteTarget, 5);
assert(isHit === true, "Volumetric cylinder sweep detects high-speed pass-through collision");

const missTarget = { x: 50, y: 50, z: 10 };
const isMiss = spline.testVolumetricSweep(handStart, handEnd, 5, missTarget, 5);
assert(isMiss === false, "Volumetric cylinder sweep accurately ignores out-of-range notes");

const hitRating = spline.evaluateHitAccuracy(25);
assert(hitRating.rating === 'PERFECT' && hitRating.score === 100, "Hit evaluation scores <=45ms as PERFECT");

// 3. Load and Test .auramap Parser
require('../core_engine/auramap-parser.js');
const parser = window.AuraBeatCore.AuraMapParser;
assert(parser, "AuraMapParser module loaded");

const generatedMap = parser.generateProceduralMap("Test Track", "Artist", "intro/Audio/test.flac", 128, 60, "gamv_360");
const validation = parser.validate(generatedMap);
assert(validation.valid === true, ".auramap generated chart satisfies v1.0 JSON schema");
assert(generatedMap.notes.length > 10, ".auramap procedural generation generates rhythm notes");
assert(generatedMap.narrativeEvents.length === 3, ".auramap GAMV mode embeds 3 narrative branch triggers");

// 4. Load and Test .aurarec Telemetry Recorder
require('../core_engine/telemetry-recorder.js');
const recorder = window.AuraBeatCore.TelemetryRecorder;
assert(recorder, "TelemetryRecorder module loaded");

recorder.startRecording("XREAL Aura", "Test Track");
recorder.recordFrame({ qx: 0, qy: 0, qz: 0, qw: 1 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, [{ noteId: "note_1", rating: "PERFECT" }]);
const telemetryExport = recorder.stopRecording(150000, 99.2);
assert(telemetryExport.recordVersion === "1.0", ".aurarec output formatVersion is 1.0");
assert(telemetryExport.frameTelemetry.length === 1, ".aurarec frame buffer captured frame telemetry");

// 5. Load and Test Optical See-Through Color Blender
require('../core_engine/ost-color-blender.js');
const ost = window.AuraBeatCore.OstColorBlender;
assert(ost, "OstColorBlender module loaded");

const correctedColor = ost.applyVonKriesCorrection([100, 100, 100]);
assert(correctedColor.includes("rgb(132, 105, 78)"), "Von Kries 35% state corrects chromatic white-point (boosts red/orange, reduces blue)");

const aberration = ost.getAberrationOffset(0.9);
assert(aberration && aberration.redOffsetPx !== undefined, "Subpixel aberration warp computes pupil entry offsets");

// 6. LOC & Modularity Audit (< 300 LOC Constraint)
console.log("\n--------------------------------------------------");
console.log("  MODULARITY AUDIT (< 300 LOC REQUIREMENT)");
console.log("--------------------------------------------------");

const baseDir = path.resolve(__dirname, '..');
const dirsToAudit = ['core_engine', 'gameplay', 'spatial_engine', 'intro', 'hardware_simulation'];
let allCompliant = true;

dirsToAudit.forEach(dir => {
  const fullDir = path.join(baseDir, dir);
  if (!fs.existsSync(fullDir)) return;
  const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.js'));
  files.forEach(file => {
    const filePath = path.join(fullDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const loc = content.split('\n').length;
    const isUnder300 = loc < 300;
    assert(isUnder300, `${dir}/${file} is atomic (${loc} LOC < 300)`);
    if (!isUnder300) allCompliant = false;
  });
});

// Check root app.js
const appJsContent = fs.readFileSync(path.join(baseDir, 'app.js'), 'utf8');
const appLoc = appJsContent.split('\n').length;
assert(appLoc < 300, `app.js is atomic (${appLoc} LOC < 300)`);

console.log("\n==================================================");
console.log(`  RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log("==================================================\n");
