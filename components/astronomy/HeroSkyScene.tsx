"use client";

import { Line, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RealisticStars } from "@/components/astronomy/RealisticStars";

const ALTITUDES = [0, 15, 30, 45, 60, 75];
const AZIMUTHS = Array.from({ length: 13 }, (_, index) => -90 + index * 15);

export function HeroSkyScene() {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.15, 13.5], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
    >
      <color attach="background" args={["#030708"]} />
      <fog attach="fog" args={["#030708", 18, 45]} />
      <HeroCamera />
      <ambientLight intensity={0.32} color="#9fb7ba" />
      <directionalLight position={[7, 5, 8]} intensity={3.2} color="#fff0cf" />
      <RealisticStars count={10000} mode="volume" paused={Boolean(reducedMotion)} pointScale={1.02} />
      <HeroGrid />
      <HeroConstellation />
      <Suspense fallback={null}>
        <RotatingMoon paused={Boolean(reducedMotion)} />
      </Suspense>
    </Canvas>
  );
}

function HeroCamera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0.35, 0.1, -4.8);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function HeroGrid() {
  const altitudeMarks = [...ALTITUDES, 90];

  return (
    <group>
      {ALTITUDES.map((altitude) => (
        <Line
          key={altitude}
          points={Array.from({ length: 97 }, (_, index) => heroDomePoint(altitude, -90 + (index / 96) * 180))}
          color={altitude === 0 ? "#e6ddc8" : "#8ea6a5"}
          lineWidth={altitude === 0 ? 1.15 : altitude % 30 === 0 ? 0.72 : 0.48}
          transparent
          opacity={altitude === 0 ? 0.74 : altitude % 30 === 0 ? 0.24 : 0.14}
        />
      ))}
      {AZIMUTHS.map((azimuth) => (
        <Line
          key={azimuth}
          points={Array.from({ length: 31 }, (_, index) => heroDomePoint(index * 3, azimuth))}
          color={azimuth === 0 ? "#ded4bf" : "#8ea6a5"}
          lineWidth={azimuth === 0 ? 0.9 : azimuth % 30 === 0 ? 0.62 : 0.4}
          transparent
          opacity={azimuth === 0 ? 0.5 : azimuth % 30 === 0 ? 0.18 : 0.09}
        />
      ))}
      {altitudeMarks.map((altitude) => (
        <Line
          key={altitude}
          points={[heroDomePoint(altitude, -1.2), heroDomePoint(altitude, 1.2)]}
          color="#ece2cc"
          lineWidth={0.9}
          transparent
          opacity={0.65}
        />
      ))}
      {Array.from({ length: 35 }, (_, index) => -85 + index * 5).map((azimuth) => {
        const major = azimuth % 30 === 0;
        const medium = azimuth % 10 === 0;
        return (
          <Line
            key={azimuth}
            points={[heroDomePoint(-0.8, azimuth), heroDomePoint(major ? 2.1 : medium ? 1.35 : 0.8, azimuth)]}
            color="#e8dfcb"
            lineWidth={major ? 0.9 : 0.5}
            transparent
            opacity={major ? 0.7 : medium ? 0.44 : 0.25}
          />
        );
      })}
    </group>
  );
}

function HeroConstellation() {
  const points: Array<[number, number, number]> = [
    [2.55, 0.15, -4.65],
    [3.05, 0.55, -4.65],
    [3.62, 0.72, -4.65],
    [4.15, 0.28, -4.65],
    [4.02, -0.38, -4.65],
    [3.35, -0.48, -4.65],
    [3.05, 0.55, -4.65],
    [2.25, 0.98, -4.65],
    [1.72, 1.42, -4.65],
  ];

  return (
    <group>
      <Line points={points} color="#ead9ba" lineWidth={1.05} transparent opacity={0.66} />
      {points.map((point, index) => (
        <mesh key={`${index}-${point[0]}-${point[1]}`} position={point}>
          <sphereGeometry args={[index === 3 ? 0.07 : 0.045, 16, 16]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#ffdca3" : "#dcecff"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function RotatingMoon({ paused }: { paused: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const sourceTexture = useTexture("/textures/moon-lro-2k.jpg");
  const { viewport } = useThree();
  const compact = viewport.width < 9;
  const texture = useMemo(() => {
    sourceTexture.colorSpace = THREE.SRGBColorSpace;
    sourceTexture.anisotropy = 8;
    sourceTexture.wrapS = THREE.RepeatWrapping;
    sourceTexture.needsUpdate = true;
    return sourceTexture;
  }, [sourceTexture]);

  useFrame((_, delta) => {
    if (mesh.current && !paused) mesh.current.rotation.y += delta * 0.06;
  });

  return (
    <group position={[compact ? 2.15 : 4.55, compact ? 2.42 : 2.78, -2.9]} scale={compact ? 0.76 : 1}>
      <mesh ref={mesh} rotation={[0.08, -Math.PI / 2, -0.08]}>
        <sphereGeometry args={[0.9, 72, 72]} />
        <meshStandardMaterial map={texture} color="#f5e4c3" roughness={1} metalness={0} />
      </mesh>
      <pointLight position={[0.9, 0.8, 2]} intensity={1.3} distance={5} color="#efc986" />
    </group>
  );
}

function heroDomePoint(altitude: number, azimuth: number): [number, number, number] {
  const altitudeRadians = THREE.MathUtils.degToRad(altitude);
  const azimuthRadians = THREE.MathUtils.degToRad(azimuth);
  const radius = 11.1;
  return [
    Math.sin(azimuthRadians) * Math.cos(altitudeRadians) * radius + 0.55,
    Math.sin(altitudeRadians) * radius * 0.72 - 5,
    -5.3,
  ];
}
