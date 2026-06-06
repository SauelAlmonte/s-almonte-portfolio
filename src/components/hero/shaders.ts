/**
 * GLSL for the hero globe. Kept as plain strings so the R3F components can feed
 * them to `ShaderMaterial` without a loader/plugin. All three materials use
 * additive blending with depthWrite off so the glow stacks like light.
 */

/* ---- Dotted earth (THREE.Points) ---- */
export const POINT_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRandom;   // per-point twinkle phase
  attribute float aWarm;     // 1.0 → lean toward the warm accent
  varying float vTwinkle;
  varying float vWarm;
  varying float vFacing;     // >0 faces the camera, <0 faces away

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mv.z);

    // points sit on a unit sphere, so the normal is just the position
    vec3 vNormal = normalize(normalMatrix * normalize(position));
    vec3 vDir = normalize(-mv.xyz);
    vFacing = dot(vNormal, vDir);

    vTwinkle = aRandom;
    vWarm = aWarm;
  }
`;

export const POINT_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColorA;     // cyan
  uniform vec3 uColorB;     // lavender
  uniform vec3 uColorWarm;  // pink
  varying float vTwinkle;
  varying float vWarm;
  varying float vFacing;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;                       // round points
    float core = smoothstep(0.5, 0.0, d);       // soft falloff
    float tw = 0.72 + 0.28 * sin(uTime * 1.6 + vTwinkle * 6.2831);
    float fa = smoothstep(-0.55, 0.2, vFacing);  // dim the far hemisphere
    vec3 col = mix(uColorA, uColorB, vTwinkle);
    col = mix(col, uColorWarm, vWarm * 0.6);
    gl_FragColor = vec4(col, core * tw * fa * uOpacity);
  }
`;

/* ---- Atmosphere rim glow (back-side fresnel sphere) ---- */
export const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), uPower);
    gl_FragColor = vec4(uColor, fres * uIntensity);
  }
`;

/* ---- Network arcs (LineSegments) with a traveling pulse ---- */
export const ARC_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  attribute float aProgress;  // 0..1 along the arc
  attribute float aPhase;     // per-arc offset so they don't pulse in unison
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float head = fract(uTime * uSpeed + aPhase);
    float dist = aProgress - head;
    dist = dist - floor(dist + 0.5);            // wrap to [-0.5, 0.5]
    vGlow = smoothstep(0.14, 0.0, abs(dist));   // bright near the head
  }
`;

export const ARC_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uPulseColor;
  varying float vGlow;
  void main() {
    vec3 col = mix(uColor, uPulseColor, vGlow);
    gl_FragColor = vec4(col, 0.10 + vGlow * 0.9); // faint base line + bright pulse
  }
`;
