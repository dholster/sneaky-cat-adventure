uniform float uTime;
uniform float uDetectionState; // 0=unaware, 1=suspicious, 2=alert
uniform float uDetectionLevel; // 0.0 to 1.0
uniform vec3 uConeColor;

varying vec2 vUv;

void main() {
  // Calculate distance from cone origin (bottom center)
  vec2 center = vec2(0.5, 0.0);
  float dist = distance(vUv, center);

  // Create radial gradient
  float alpha = 1.0 - smoothstep(0.0, 0.9, dist);

  // Add scanning line effect
  float scanLine = sin(vUv.y * 20.0 - uTime * 2.0) * 0.1 + 0.9;
  alpha *= scanLine;

  // Pulse based on detection level
  float pulse = sin(uTime * 3.0 * (1.0 + uDetectionState)) * 0.15 + 0.85;
  alpha *= pulse;

  // Increase alpha with detection level
  alpha *= (0.2 + uDetectionLevel * 0.6);

  // Edge glow
  float edge = smoothstep(0.85, 0.95, dist);
  alpha += edge * 0.3;

  gl_FragColor = vec4(uConeColor, alpha);
}
