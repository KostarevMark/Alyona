// Three.js train scene: loads assets/models/lastochka-textured.glb — the
// user's own textured ES1 "Lastochka" (Siemens Desiro-based Russian commuter
// EMU) export, es1-lastochka/es1_lastochka.glb, run once through
// `gltf-transform metalrough` (see the loader call below for why) — and
// turns its one authored 3-car unit into the 8 coaches the 8 portfolio
// wagons need.
//
// Geometry facts (measured from the same geometry when it was still a bare
// OBJ with no material data; unaffected by the metalrough re-export, which
// only touches material JSON, not meshes/transforms):
//   - the file models one 3-car unit: a driver's-cab "front" section, and two
//     generic, noseless "middle"/"rear" sections of identical length.
//   - obj2gltf renames every material that repeats across the OBJ's 3
//     physical sections with a numeric suffix (plain / "_006" / "_002") —
//     that suffix, not any node name or grouping in the source file, is what
//     lets every mesh be assigned to a section below.
//   - front (nose)  Z 11.893 .. 38.668, center  25.2805
//   - middle        Z -12.865 .. 12.865, center  0
//   - rear          Z -37.594 .. -11.865, center -24.7296
//   - rear-to-rear pitch (== middle-to-rear) = 24.7296, reused for every
//     generic-car repeat needed to reach 8 coaches.
//   - front-to-middle pitch = 25.2805, reused once to place a mirrored copy
//     of the nose that closes the far end of the train (the source file only
//     has one nose; a real Lastochka unit is symmetric, noses at both ends).
//   - overall unit size: 3.587 (width, X) x 4.983 (height, Y) x 76.262
//     (length, Z) — no textures survive the missing .mtl, so livery colour
//     below is applied purely from each mesh's own Y position, not names.
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/three/examples/jsm/loaders/GLTFLoader.js';

const FRONT_CENTER = 25.28052043914795;
const MIDDLE_CENTER = 0;
const REAR_CENTER = -24.729575634002686;
const REAR_PITCH = MIDDLE_CENTER - REAR_CENTER;   // 24.7296 — generic car-to-car spacing
const FRONT_PITCH = FRONT_CENTER - MIDDLE_CENTER; // 25.2805 — spacing either nose sits proud by
const TOTAL_WAGONS = 8;

// Car-centre positions along the model's native (pre-rotation) Z axis, in
// portfolio-wagon order (0 = the authored nose, 7 = its mirrored twin).
const CAR_CENTERS_Z = [FRONT_CENTER, MIDDLE_CENTER, REAR_CENTER];
for (let i = 3; i <= 6; i++) CAR_CENTERS_Z.push(CAR_CENTERS_Z[i - 1] - REAR_PITCH);
CAR_CENTERS_Z.push(CAR_CENTERS_Z[6] - FRONT_PITCH); // slot 7: mirrored nose

// The whole assembly is rotated +90 degrees about Y once, right after it's
// built (see `root.rotation.y` below), which maps native Z one-for-one onto
// world X (new_x = z under that rotation) — so these are also the final
// world X centres the camera code targets, unchanged by the rotation.
const CAR_CENTERS_X = CAR_CENTERS_Z;
const RAIL_GAUGE_HALF = 0.76; // half of Russian 1520mm gauge, in metres/world-units
const RAIL_TOP_Y = -2.4915;   // the model's own lowest point (wheel-rail contact)

export function coachCenterX(index) {
  return CAR_CENTERS_X[index];
}

const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = THREE.MathUtils.lerp;
const lerpV = (out, ax, ay, az, bx, by, bz, t) => out.set(lerp(ax, bx, t), lerp(ay, by, t), lerp(az, bz, t));

export async function initTrainScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x140f0c, 0.0095);

  const camera = new THREE.PerspectiveCamera(45, 1, 2, 300);

  // --- warm cinematic lighting ---
  const key = new THREE.DirectionalLight(0xffd39a, 2.5);
  key.position.set(-40, 30, 40);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fc2ff, 0.5);
  rim.position.set(50, 20, -30);
  scene.add(rim);
  const hemi = new THREE.HemisphereLight(0x6e5a4a, 0x120e0b, 0.75);
  scene.add(hemi);
  const glow = new THREE.PointLight(0xff8a4d, 0, 40, 2); // switched on near the train for extra warmth
  scene.add(glow);

  // --- load the model ---
  // This is the user's own textured export (es1-lastochka/es1_lastochka.glb),
  // run through `gltf-transform metalrough` first: the source file authored
  // its materials with the old KHR_materials_pbrSpecularGlossiness extension
  // (and marked it *required*), which this project's vendored GLTFLoader.js
  // has no code for at all — it was silently dropping every texture and
  // falling back to a blank default material. `metalrough` rewrites all 42
  // materials to standard pbrMetallicRoughness (same 18 baseColor textures,
  // now referenced the way GLTFLoader actually reads them) with no other
  // changes to geometry, names, or layout.
  const gltf = await new GLTFLoader().loadAsync('assets/models/lastochka-textured.glb');
  const rawRoot = gltf.scene;

  // --- classify every mesh into the 3 physical sections baked into the
  // source OBJ, purely from the material-name suffix (see header comment) —
  // materials are the model's own real textures, left untouched ---
  const sections = { front: new THREE.Group(), middle: new THREE.Group(), rear: new THREE.Group() };
  const allMeshes = [];
  rawRoot.traverse((obj) => { if (obj.isMesh) allMeshes.push(obj); });
  allMeshes.forEach((mesh) => {
    const origName = mesh.material?.name || '';
    const sectionKey = origName.endsWith('_006') ? 'middle' : origName.endsWith('_002') ? 'rear' : 'front';
    sections[sectionKey].attach(mesh);
  });

  // --- assemble all 8 coaches ---
  // Slots 0-2 are the sections at their own authored positions (no offset
  // needed — the source geometry already places them correctly relative to
  // each other). Slots 3-6 repeat the generic "rear" car at the measured
  // pitch. Slot 7 mirrors the "front" nose (there is only one in the source
  // file) to close the far end, the way a real bidirectional Lastochka unit
  // has a cab at both ends.
  const root = new THREE.Group();
  root.add(sections.front, sections.middle, sections.rear);

  for (let i = 3; i <= 6; i++) {
    const clone = sections.rear.clone(true);
    clone.position.z = -REAR_PITCH * (i - 2);
    root.add(clone);
  }

  const mirroredNose = sections.front.clone(true);
  mirroredNose.scale.z = -1;
  mirroredNose.position.z = CAR_CENTERS_Z[7] + FRONT_CENTER;
  root.add(mirroredNose);

  // Rotate the whole assembly so its native length axis (Z) becomes the
  // world X axis the camera bands below are written against — CAR_CENTERS_X
  // is deliberately just CAR_CENTERS_Z, since new_x == old_z under this turn.
  root.rotation.y = Math.PI / 2;
  scene.add(root);

  // --- procedural rail + sleepers (the source model is train-only, no
  // track) — spans generously past both ends of the assembled 8-car train ---
  const trackMinX = coachCenterX(TOTAL_WAGONS - 1) - 20;
  const trackMaxX = coachCenterX(0) + 20;
  const trackLength = trackMaxX - trackMinX;
  const trackCenterX = (trackMinX + trackMaxX) / 2;
  const railMat = new THREE.MeshStandardMaterial({ color: 0x5b5852, roughness: 0.35, metalness: 0.75 });
  const railGeometry = new THREE.BoxGeometry(trackLength, 0.16, 0.14);
  [RAIL_GAUGE_HALF, -RAIL_GAUGE_HALF].forEach((z) => {
    const rail = new THREE.Mesh(railGeometry, railMat);
    rail.position.set(trackCenterX, RAIL_TOP_Y - 0.08, z);
    scene.add(rail);
  });
  const SLEEPER_PITCH = 0.65;
  const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x2a2420, roughness: 0.85, metalness: 0.05 });
  const sleeperGeometry = new THREE.BoxGeometry(0.22, 0.12, 2.0);
  const sleeperCount = Math.ceil(trackLength / SLEEPER_PITCH);
  const sleepers = new THREE.InstancedMesh(sleeperGeometry, sleeperMat, sleeperCount);
  const m = new THREE.Matrix4();
  for (let i = 0; i < sleeperCount; i++) {
    m.makeTranslation(trackMinX + i * SLEEPER_PITCH, RAIL_TOP_Y - 0.22, 0);
    sleepers.setMatrixAt(i, m);
  }
  sleepers.instanceMatrix.needsUpdate = true;
  scene.add(sleepers);

  // --- headlight glow at the nose ---
  const glowTexture = makeGlowTexture();
  const headlightMat = new THREE.SpriteMaterial({
    map: glowTexture, color: 0xffcf8a, transparent: true, opacity: 0.85,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const headlight = new THREE.Sprite(headlightMat);
  headlight.scale.setScalar(4);
  headlight.position.set(coachCenterX(0) + 13.5, 0.3, 0);
  scene.add(headlight);

  // --- camera state driven by the scroll narrative ---
  let journeyProgress = 0;
  let targetCoachX = coachCenterX(0);
  let followedX = targetCoachX;
  let paused = false;
  const camPos = new THREE.Vector3();
  const lookAt = new THREE.Vector3();

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  const BOUNDARY_1 = 0.1, BOUNDARY_2 = 0.85, TRANSITION = 0.05;

  function animate() {
    requestAnimationFrame(animate);
    if (paused) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // gentle continuous idle motion — the train is always faintly alive on its springs
    root.position.y = Math.sin(t * 0.55) * 0.05;
    root.rotation.z = Math.sin(t * 0.4) * 0.0025;
    root.rotation.x = Math.cos(t * 0.33) * 0.0015;

    headlightMat.opacity = 0.7 + Math.sin(t * 3) * 0.08;

    // camera-follow easing — exponential, framerate independent (silky, not jerky)
    followedX = lerp(followedX, targetCoachX, 1 - Math.exp(-dt * 3.2));

    // three narrative bands, cross-blended with smoothstep so there is never a hard cut
    if (journeyProgress < BOUNDARY_1 - TRANSITION) {
      heroFrame(journeyProgress / BOUNDARY_1);
      glow.intensity = 0;
    } else if (journeyProgress < BOUNDARY_1 + TRANSITION) {
      const heroP = journeyProgress / BOUNDARY_1;
      const heroPos = new THREE.Vector3(), heroLook = new THREE.Vector3();
      heroFrame(heroP, heroPos, heroLook);
      const mix = smoothstep(BOUNDARY_1 - TRANSITION, BOUNDARY_1 + TRANSITION, journeyProgress);
      camPos.lerpVectors(heroPos, new THREE.Vector3(followedX + 6, 8.5, 22), mix);
      lookAt.lerpVectors(heroLook, new THREE.Vector3(followedX, 3.5, 0), mix);
      camera.position.copy(camPos);
      camera.lookAt(lookAt);
      glow.position.set(followedX, 5, 0); glow.intensity = mix * 1.4;
    } else if (journeyProgress < BOUNDARY_2 - TRANSITION) {
      camera.position.set(followedX + 6, 8.5, 22);
      camera.lookAt(followedX, 3.5, 0);
      glow.position.set(followedX, 5, 0); glow.intensity = 1.4;
      key.color.setHex(0xffd39a); key.intensity = 2.5;
    } else {
      const p = smoothstep(BOUNDARY_2 - TRANSITION, BOUNDARY_2 + TRANSITION * 2, journeyProgress);
      const tailX = coachCenterX(TOTAL_WAGONS - 1);
      lerpV(camPos, followedX + 6, 8.5, 22, tailX - 10, 7, 26, p);
      camera.position.copy(camPos);
      camera.lookAt(lerp(followedX, tailX, p), 3.5, 0);
      glow.position.set(lerp(followedX, tailX, p), 5, 0); glow.intensity = 1.4;
      key.color.setHex(0xffb066);
      key.intensity = lerp(2.5, 3.1, p);
    }

    function heroFrame(p, outPos = null, outLook = null) {
      const pos = outPos || camPos;
      const look = outLook || lookAt;
      pos.set(lerp(62, 25, p), lerp(19, 10, p), lerp(56, 30, p));
      look.set(lerp(24, coachCenterX(0), p), 4, 0);
      if (!outPos) { camera.position.copy(pos); camera.lookAt(look); }
    }

    renderer.render(scene, camera);
  }
  animate();

  document.addEventListener('visibilitychange', () => { paused = document.hidden; });

  const api = {
    setJourneyProgress(p) { journeyProgress = p; },
    setActiveWagon(idx) { targetCoachX = coachCenterX(idx); },
    setPaused(v) { paused = v; },
    _snapTo(idx) { targetCoachX = coachCenterX(idx); followedX = targetCoachX; }, // debug only
  };
  window.__trainDebug = { camera, scene, renderer, api, get progress() { return journeyProgress; }, get followedX() { return followedX; } };
  return api;
}

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.4)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
