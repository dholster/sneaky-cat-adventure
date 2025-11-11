uniform float uTime;
uniform float uDetectionState; // 0=unaware, 1=suspicious, 2=alert
uniform float uDetectionLevel; // 0.0 to 1.0
uniform vec3 uConeColor;

varying vec2 vUv;

// Simple noise function for organic look
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // Calculate distance from cone origin (bottom center)
  vec2 center = vec2(0.5, 0.0);
  float dist = distance(vUv, center);

  // Multi-layer radial gradient for depth
  float innerGlow = 1.0 - smoothstep(0.0, 0.3, dist); // Bright center
  float midGradient = 1.0 - smoothstep(0.2, 0.7, dist); // Mid fade
  float outerFade = 1.0 - smoothstep(0.5, 1.0, dist); // Outer edge

  // Combine gradients
  float alpha = innerGlow * 0.7 + midGradient * 0.5 + outerFade * 0.3;

  // Add animated scanning lines (multiple frequencies for depth)
  float scanLine1 = sin(vUv.y * 15.0 - uTime * 2.5) * 0.05 + 0.95;
  float scanLine2 = sin(vUv.y * 8.0 - uTime * 1.5 + 3.14) * 0.03 + 0.97;
  alpha *= scanLine1 * scanLine2;

  // Radial scanning effect (rotating rays)
  float angle = atan(vUv.y - 0.0, vUv.x - 0.5);
  float radialScan = sin(angle * 6.0 + uTime * 1.5) * 0.05 + 0.95;
  alpha *= radialScan;

  // Enhanced pulse based on detection level (more intense when alert)
  float pulseSpeed = 3.0 + uDetectionState * 2.0;
  float pulseAmount = 0.15 + uDetectionState * 0.15;
  float pulse = sin(uTime * pulseSpeed) * pulseAmount + (1.0 - pulseAmount);
  alpha *= pulse;

  // Scale alpha with detection level (brighter when detecting)
  alpha *= (0.15 + uDetectionLevel * 0.7);

  // Add subtle noise for organic texture
  float noiseVal = noise(vUv * 50.0 + uTime * 0.5) * 0.03;
  alpha += noiseVal;

  // Enhanced edge glow (brighter rim)
  float edgeStart = 0.75;
  float edgeEnd = 0.95;
  float edge = smoothstep(edgeStart, edgeEnd, dist);
  float edgeGlow = edge * (0.4 + uDetectionLevel * 0.3);
  alpha += edgeGlow;

  // Add spotlight effect at origin (brightest at center)
  float spotlight = pow(1.0 - min(dist * 1.5, 1.0), 2.0) * 0.3;
  alpha += spotlight;

  // Clamp alpha
  alpha = clamp(alpha, 0.0, 1.0);

  gl_FragColor = vec4(uConeColor, alpha);
}
