"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type RealisticStarsProps = {
  count: number;
  mode: "volume" | "dome";
  paused: boolean;
  seed?: number;
  rotationY?: number;
  opacity?: number;
  pointScale?: number;
};

const STAR_COLORS = [
  new THREE.Color("#f6e3ba"),
  new THREE.Color("#d7ecff"),
  new THREE.Color("#fffdf0"),
  new THREE.Color("#ffd5ae"),
];

export function RealisticStars({
  count,
  mode,
  paused,
  seed = 7283,
  rotationY = 0,
  opacity = 1,
  pointScale = 1,
}: RealisticStarsProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => createStarGeometry(count, mode, seed), [count, mode, seed]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uPointScale: { value: pointScale },
    }),
    [opacity, pointScale],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    if (!material.current) return;
    if (!paused) material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uOpacity.value = opacity;
    material.current.uniforms.uPointScale.value = pointScale;
  });

  return (
    <group rotation={[0, rotationY, 0]}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          uniforms={uniforms}
          vertexShader={`
            attribute float aPhase;
            attribute float aSpeed;
            attribute float aSize;
            attribute float aIntensity;
            uniform float uTime;
            uniform float uOpacity;
            uniform float uPointScale;
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
              vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
              float pulse = 0.78 + 0.22 * sin(uTime * aSpeed + aPhase);
              vColor = color;
              vAlpha = pulse * aIntensity * uOpacity;
              gl_PointSize = max(1.0, aSize * uPointScale * pulse * (26.0 / max(10.0, -viewPosition.z)));
              gl_Position = projectionMatrix * viewPosition;
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
              float distanceToCenter = length(gl_PointCoord - vec2(0.5));
              float core = smoothstep(0.5, 0.035, distanceToCenter);
              float halo = smoothstep(0.5, 0.22, distanceToCenter) * 0.16;
              gl_FragColor = vec4(vColor, (core + halo) * vAlpha);
            }
          `}
        />
      </points>
    </group>
  );
}

function createStarGeometry(count: number, mode: RealisticStarsProps["mode"], initialSeed: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const intensities = new Float32Array(count);
  let seed = initialSeed;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let index = 0; index < count; index += 1) {
    const point = index * 3;
    if (mode === "volume") {
      positions[point] = (random() - 0.5) * 25;
      positions[point + 1] = (random() - 0.34) * 12;
      positions[point + 2] = -5 - random() * 28;
    } else {
      const azimuth = random() * Math.PI * 2;
      const sinAltitude = -0.12 + random() * 1.1;
      const radius = 25 + random() * 17;
      const horizontalRadius = Math.sqrt(1 - sinAltitude * sinAltitude) * radius;
      positions[point] = Math.sin(azimuth) * horizontalRadius;
      positions[point + 1] = sinAltitude * radius;
      positions[point + 2] = -Math.cos(azimuth) * horizontalRadius;
    }

    const color = STAR_COLORS[Math.floor(random() * STAR_COLORS.length)];
    colors[point] = color.r;
    colors[point + 1] = color.g;
    colors[point + 2] = color.b;
    phases[index] = random() * Math.PI * 2;
    speeds[index] = 0.42 + random() * 1.6;
    sizes[index] = 0.72 + Math.pow(random(), 6) * 3.7;
    intensities[index] = 0.46 + Math.pow(random(), 0.72) * 0.54;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aIntensity", new THREE.BufferAttribute(intensities, 1));
  return geometry;
}
