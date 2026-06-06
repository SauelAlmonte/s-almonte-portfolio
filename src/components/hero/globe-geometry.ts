import * as THREE from "three";

/**
 * Turn the equirectangular land mask into a set of points that sit on the
 * continents of a unit sphere. The mask has dark land on a bright ocean, so a
 * pixel is "land" when its brightness is below a threshold.
 *
 * Done once on mount (a few ms for ~20k candidate points) — no per-frame work.
 */

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export interface GlobePoints {
  positions: Float32Array;
  randoms: Float32Array;
  warms: Float32Array;
  land: THREE.Vector3[]; // kept land positions, reused to anchor the arcs
}

export function sampleLandPoints(
  image: HTMLImageElement,
  candidates: number,
  radius: number,
): GlobePoints {
  // Read the mask pixels via an offscreen canvas.
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(image, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;

  const pos: number[] = [];
  const rnd: number[] = [];
  const warm: number[] = [];
  const land: THREE.Vector3[] = [];

  for (let i = 0; i < candidates; i++) {
    // Fibonacci sphere → even coverage with no pole clustering.
    const y = 1 - (i / (candidates - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * GOLDEN_ANGLE;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    const lat = Math.asin(y) * (180 / Math.PI);
    if (lat < -58 || lat > 80) continue; // skip the noisy poles / Antarctica cap

    const lon = Math.atan2(z, x) * (180 / Math.PI);
    const u = (lon + 180) / 360;
    const v = (90 - lat) / 180;
    const px = Math.min(w - 1, Math.max(0, Math.floor(u * w)));
    const py = Math.min(h - 1, Math.max(0, Math.floor(v * h)));
    const idx = (py * w + px) * 4;
    const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 765;

    if (brightness < 0.4) {
      // land
      pos.push(x * radius, y * radius, z * radius);
      rnd.push(Math.random());
      warm.push(Math.random() < 0.12 ? 1 : 0);
      land.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }
  }

  return {
    positions: new Float32Array(pos),
    randoms: new Float32Array(rnd),
    warms: new Float32Array(warm),
    land,
  };
}

/**
 * A faint latitude/longitude grid (graticule) so the dot cloud unmistakably
 * reads as a globe. Emitted as line segments slightly above the dot radius.
 */
export function buildGraticule(
  radius: number,
  latStep = 20,
  lonStep = 20,
  seg = 96,
): Float32Array {
  const r = radius * 1.004;
  const out: number[] = [];
  const toRad = Math.PI / 180;

  const point = (lat: number, lon: number) => {
    const phi = (90 - lat) * toRad;
    const theta = (lon + 180) * toRad;
    return [
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    ];
  };

  // latitude rings (skip the very poles)
  for (let lat = -60; lat <= 60; lat += latStep) {
    for (let i = 0; i < seg; i++) {
      const a = point(lat, (i / seg) * 360 - 180);
      const b = point(lat, ((i + 1) / seg) * 360 - 180);
      out.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    }
  }
  // longitude meridians
  for (let lon = -180; lon < 180; lon += lonStep) {
    for (let i = 0; i < seg; i++) {
      const a = point(-80 + (i / seg) * 160, lon);
      const b = point(-80 + ((i + 1) / seg) * 160, lon);
      out.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    }
  }
  return new Float32Array(out);
}

export interface ArcGeometry {
  positions: Float32Array;
  progress: Float32Array;
  phase: Float32Array;
}

/**
 * Build a handful of great-circle-ish arcs between random land points. Each arc
 * is a quadratic curve lifted above the surface, emitted as line segments with a
 * per-vertex progress (0..1) and a per-arc phase so the shader can run a pulse
 * along each one independently.
 */
export function buildArcs(
  land: THREE.Vector3[],
  arcCount: number,
  radius: number,
  segments = 48,
): ArcGeometry {
  const positions: number[] = [];
  const progress: number[] = [];
  const phase: number[] = [];

  if (land.length < 2) {
    return {
      positions: new Float32Array(),
      progress: new Float32Array(),
      phase: new Float32Array(),
    };
  }

  for (let a = 0; a < arcCount; a++) {
    const start = land[(Math.random() * land.length) | 0];
    let end = land[(Math.random() * land.length) | 0];
    // Prefer visibly separated endpoints so arcs read as connections.
    let guard = 0;
    while (start.distanceTo(end) < radius * 0.8 && guard++ < 12) {
      end = land[(Math.random() * land.length) | 0];
    }

    const mid = start.clone().add(end).multiplyScalar(0.5);
    const lift = 1 + 0.18 + start.distanceTo(end) * 0.22; // higher for longer hops
    mid.normalize().multiplyScalar(radius * lift);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const pts = curve.getPoints(segments);
    const arcPhase = Math.random();

    for (let s = 0; s < pts.length - 1; s++) {
      const p0 = pts[s];
      const p1 = pts[s + 1];
      positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
      progress.push(s / (pts.length - 1), (s + 1) / (pts.length - 1));
      phase.push(arcPhase, arcPhase);
    }
  }

  return {
    positions: new Float32Array(positions),
    progress: new Float32Array(progress),
    phase: new Float32Array(phase),
  };
}
