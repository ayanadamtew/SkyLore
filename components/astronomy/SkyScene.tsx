"use client";

import { Html, Line, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RealisticStars } from "@/components/astronomy/RealisticStars";
import { signedAngle } from "@/lib/format";
import type { RendererQuality, SkyLayers, SkyObject, SkySnapshot } from "@/types/sky";

type SkySceneProps = {
  sky: SkySnapshot;
  selectedId: string | null;
  selectedIds?: string[];
  replayStarCount?: number | null;
  closeSelectionLoop?: boolean;
  minimumStarAltitude?: number;
  viewAzimuth: number;
  zoom: number;
  layers: SkyLayers;
  quality: RendererQuality;
  onSelect: (id: string) => void;
  onRotate: (azimuth: number) => void;
};

const EMPTY_IDS: string[] = [];

type DragState = {
  x: number;
  azimuth: number;
  moved: boolean;
} | null;

export function SkyScene({
  sky,
  selectedId,
  selectedIds = EMPTY_IDS,
  replayStarCount = null,
  closeSelectionLoop = false,
  minimumStarAltitude = -8,
  viewAzimuth,
  zoom,
  layers,
  quality,
  onSelect,
  onRotate,
}: SkySceneProps) {
  const drag = useRef<DragState>(null);
  const ignoreSelectionUntil = useRef(0);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    drag.current = { x: event.clientX, azimuth: viewAzimuth, moved: false };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const delta = event.clientX - drag.current.x;
    if (Math.abs(delta) > 4 && !drag.current.moved) {
      drag.current.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    onRotate(drag.current.azimuth - delta * 0.32);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (drag.current?.moved) ignoreSelectionUntil.current = performance.now() + 120;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleSelect(id: string) {
    if (performance.now() < ignoreSelectionUntil.current) return;
    onSelect(id);
  }

  return (
    <div
      className="h-full min-h-[inherit] w-full touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label={`Interactive sky map for ${sky.city.name}`}
    >
      <Canvas
        dpr={quality === "HIGH" ? [1, 2] : [1, 1.5]}
        camera={{ position: [0, 3.2, 14.5], fov: 38, near: 0.1, far: 100 }}
        gl={{ antialias: quality !== "LOW", powerPreference: "high-performance" }}
      >
        <CameraAim />
        <color attach="background" args={[sky.darkness === "Daylight" ? "#15283a" : "#07101a"]} />
        <fog attach="fog" args={[sky.darkness === "Daylight" ? "#15283a" : "#07101a", 12, 42]} />
        <ambientLight intensity={0.85} />
        <pointLight position={[0, 7, 2]} intensity={1.2} color="#f0cf8a" />
        <SkyDome
          sky={sky}
          selectedId={selectedId}
          selectedIds={selectedIds}
          replayStarCount={replayStarCount}
          closeSelectionLoop={closeSelectionLoop}
          minimumStarAltitude={minimumStarAltitude}
          targetAzimuth={viewAzimuth}
          zoom={zoom}
          layers={layers}
          quality={quality}
          onSelect={handleSelect}
        />
      </Canvas>
    </div>
  );
}

function CameraAim() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 2.65, -2.5);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function SkyDome({
  sky,
  selectedId,
  selectedIds,
  replayStarCount,
  closeSelectionLoop,
  minimumStarAltitude,
  targetAzimuth,
  zoom,
  layers,
  quality,
  onSelect,
}: {
  sky: SkySnapshot;
  selectedId: string | null;
  selectedIds: string[];
  replayStarCount: number | null;
  closeSelectionLoop: boolean;
  minimumStarAltitude: number;
  targetAzimuth: number;
  zoom: number;
  layers: SkyLayers;
  quality: RendererQuality;
  onSelect: (id: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const [animatedAzimuth, setAnimatedAzimuth] = useState(targetAzimuth);
  const starCount = quality === "LOW" ? 3500 : quality === "MEDIUM" ? 6500 : 10000;
  const starOpacity = sky.darkness === "Daylight" ? 0.72 : sky.darkness === "Civil twilight" ? 0.82 : 0.96;
  const displayedSelectedIds = replayStarCount === null ? selectedIds : selectedIds.slice(0, replayStarCount);

  useFrame((_, delta) => {
    if (reducedMotion) {
      setAnimatedAzimuth(targetAzimuth);
      return;
    }
    setAnimatedAzimuth((current) => {
      const diff = signedAngle(targetAzimuth - current);
      if (Math.abs(diff) < 0.04) return targetAzimuth;
      return current + diff * Math.min(1, delta * 3.8);
    });
  });

  return (
    <group>
      <RealisticStars
        count={starCount}
        mode="dome"
        paused={Boolean(reducedMotion)}
        rotationY={THREE.MathUtils.degToRad(animatedAzimuth)}
        opacity={starOpacity}
        pointScale={quality === "HIGH" ? 1.22 : 1.06}
        seed={19073}
      />
      <AtmosphereVeil quality={quality} />
      {layers.grid ? <CelestialGrid viewAzimuth={animatedAzimuth} zoom={zoom} /> : null}
      {layers.constellations ? (
        <ConstellationLayer sky={sky} selectedId={selectedId} viewAzimuth={animatedAzimuth} zoom={zoom} onSelect={onSelect} />
      ) : null}
      {displayedSelectedIds.length ? (
        <BuilderConstellationLayer
          sky={sky}
          starIds={displayedSelectedIds}
          closeLoop={closeSelectionLoop && displayedSelectedIds.length === selectedIds.length}
          viewAzimuth={animatedAzimuth}
          zoom={zoom}
        />
      ) : null}
      <StarField
        sky={sky}
        selectedId={selectedId}
        selectedIds={displayedSelectedIds}
        minimumAltitude={minimumStarAltitude}
        viewAzimuth={animatedAzimuth}
        zoom={zoom}
        labels={layers.labels}
        onSelect={onSelect}
      />
      {layers.planets ? <PlanetLayer sky={sky} selectedId={selectedId} viewAzimuth={animatedAzimuth} zoom={zoom} labels={layers.labels} onSelect={onSelect} /> : null}
      <HorizonLayer viewAzimuth={animatedAzimuth} zoom={zoom} />
    </group>
  );
}

function AtmosphereVeil({ quality }: { quality: RendererQuality }) {
  if (quality === "LOW") return null;
  return (
    <group>
      <mesh position={[0, 1.2, -7.8]} rotation={[-0.24, 0, 0]}>
        <planeGeometry args={[16, 7, 16, 16]} />
        <meshBasicMaterial color="#18313a" transparent opacity={0.17} depthWrite={false} />
      </mesh>
      <mesh position={[4.4, 0.6, -6.4]} rotation={[-0.12, -0.3, 0]}>
        <planeGeometry args={[6, 4, 8, 8]} />
        <meshBasicMaterial color="#df9e67" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

function StarField({
  sky,
  selectedId,
  selectedIds,
  minimumAltitude,
  viewAzimuth,
  zoom,
  labels,
  onSelect,
}: {
  sky: SkySnapshot;
  selectedId: string | null;
  selectedIds: string[];
  minimumAltitude: number;
  viewAzimuth: number;
  zoom: number;
  labels: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <group>
      {sky.stars
        .filter((star) => star.altitude > minimumAltitude)
        .map((star) => {
          const selectionIndex = selectedIds.indexOf(star.id);
          return (
          <ObjectMarker
            key={star.id}
            object={star}
            selected={selectedId === star.id || selectionIndex >= 0}
            selectionIndex={selectionIndex >= 0 ? selectionIndex : undefined}
            viewAzimuth={viewAzimuth}
            zoom={zoom}
            labels={labels || selectedId === star.id || selectionIndex >= 0 || star.magnitude < 0.35}
            onSelect={onSelect}
          />
          );
        })}
    </group>
  );
}

function PlanetLayer({
  sky,
  selectedId,
  viewAzimuth,
  zoom,
  labels,
  onSelect,
}: {
  sky: SkySnapshot;
  selectedId: string | null;
  viewAzimuth: number;
  zoom: number;
  labels: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <group>
      {[...sky.planets, sky.moon, sky.sun]
        .filter((object) => object.altitude > -8)
        .map((object) => (
          <ObjectMarker
            key={object.id}
            object={object}
            selected={selectedId === object.id}
            viewAzimuth={viewAzimuth}
            zoom={zoom}
            labels={labels || selectedId === object.id}
            onSelect={onSelect}
          />
        ))}
    </group>
  );
}

function ObjectMarker({
  object,
  selected,
  selectionIndex,
  viewAzimuth,
  zoom,
  labels,
  onSelect,
}: {
  object: SkyObject;
  selected: boolean;
  selectionIndex?: number;
  viewAzimuth: number;
  zoom: number;
  labels: boolean;
  onSelect: (id: string) => void;
}) {
  const position = positionOnDome(object.altitude, object.azimuth, viewAzimuth, zoom);
  const size = objectSize(object, selected);
  const style = { "--object-color": object.color } as CSSProperties;

  if (object.type === "moon") {
    return (
      <Suspense fallback={null}>
        <MoonMarker
          object={object}
          position={position}
          selected={selected}
          size={size}
          labels={labels}
          onSelect={onSelect}
        />
      </Suspense>
    );
  }

  return (
    <group position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(object.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[size, object.type === "star" ? 12 : 24, object.type === "star" ? 12 : 24]} />
        <meshBasicMaterial color={object.color} toneMapped={false} transparent opacity={object.altitude < 0 ? 0.42 : 1} />
      </mesh>
      {selected ? (
        <mesh>
          <ringGeometry args={[size * 1.8, size * 2.25, 48]} />
          <meshBasicMaterial color="#f0cf8a" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
      {selectionIndex !== undefined ? (
        <Html position={[0, size * 2.65, 0]} center>
          <span className="builder-star-order">{selectionIndex + 1}</span>
        </Html>
      ) : null}
      {object.id === "saturn" ? (
        <mesh rotation={[1.2, 0.3, 0.4]}>
          <ringGeometry args={[size * 1.6, size * 2.6, 48]} />
          <meshBasicMaterial color="#d7c28d" transparent opacity={0.58} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
      {labels ? (
        <Html position={[0, -size * 2.8, 0]} center>
          <span className="object-label" style={style}>
            {object.name}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

function BuilderConstellationLayer({
  sky,
  starIds,
  closeLoop,
  viewAzimuth,
  zoom,
}: {
  sky: SkySnapshot;
  starIds: string[];
  closeLoop: boolean;
  viewAzimuth: number;
  zoom: number;
}) {
  const starMap = useMemo(() => new Map(sky.stars.map((star) => [star.id, star])), [sky.stars]);
  const segments = starIds.slice(1).map((id, index) => [starIds[index], id] as const);
  if (closeLoop && starIds.length >= 3) segments.push([starIds.at(-1)!, starIds[0]]);

  return (
    <group renderOrder={8}>
      {segments.map(([from, to], index) => {
        const start = starMap.get(from);
        const end = starMap.get(to);
        if (!start || !end) return null;
        return (
          <Line
            key={`${from}-${to}`}
            points={[
              positionOnDome(start.altitude, start.azimuth, viewAzimuth, zoom),
              positionOnDome(end.altitude, end.azimuth, viewAzimuth, zoom),
            ]}
            color={index === segments.length - 1 ? "#f2d59a" : "#e36e43"}
            lineWidth={index === segments.length - 1 ? 2.1 : 1.35}
            transparent
            opacity={index === segments.length - 1 ? 0.92 : 0.68}
            depthTest={false}
          />
        );
      })}
    </group>
  );
}

function MoonMarker({
  object,
  position,
  selected,
  size,
  labels,
  onSelect,
}: {
  object: SkyObject;
  position: [number, number, number];
  selected: boolean;
  size: number;
  labels: boolean;
  onSelect: (id: string) => void;
}) {
  const sourceTexture = useTexture("/textures/moon-lro-2k.jpg");
  const texture = useMemo(() => {
    sourceTexture.colorSpace = THREE.SRGBColorSpace;
    sourceTexture.anisotropy = 8;
    sourceTexture.wrapS = THREE.RepeatWrapping;
    sourceTexture.needsUpdate = true;
    return sourceTexture;
  }, [sourceTexture]);
  const illumination = THREE.MathUtils.clamp(object.illumination ?? 0.5, 0.001, 0.999);
  const phaseAngle = Math.acos(illumination * 2 - 1);
  const waxing = object.phase?.toLowerCase().includes("waxing") ?? true;
  const lightDirection = useMemo(
    () =>
      new THREE.Vector3((waxing ? 1 : -1) * Math.sin(phaseAngle), 0.035, Math.cos(phaseAngle)).normalize(),
    [phaseAngle, waxing],
  );
  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uLightDirection: { value: lightDirection },
      uOpacity: { value: object.altitude < 0 ? 0.42 : 1 },
    }),
    [lightDirection, object.altitude, texture],
  );
  const style = { "--object-color": object.color } as CSSProperties;

  return (
    <group position={position}>
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(object.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <shaderMaterial
          uniforms={uniforms}
          transparent={object.altitude < 0}
          depthWrite={object.altitude >= 0}
          toneMapped={false}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vViewNormal;

            void main() {
              vUv = uv;
              vViewNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform sampler2D uMap;
            uniform vec3 uLightDirection;
            uniform float uOpacity;
            varying vec2 vUv;
            varying vec3 vViewNormal;

            void main() {
              vec3 normal = normalize(vViewNormal);
              float terminator = smoothstep(-0.025, 0.035, dot(normal, normalize(uLightDirection)));
              float limb = 0.72 + 0.28 * pow(max(normal.z, 0.0), 0.35);
              vec3 albedo = pow(texture2D(uMap, vUv).rgb, vec3(0.88));
              vec3 lunarColor = albedo * vec3(1.11, 1.04, 0.91);
              float reflectedLight = mix(0.018, 2.05, terminator) * limb;
              gl_FragColor = vec4(lunarColor * reflectedLight, uOpacity);
            }
          `}
        />
      </mesh>
      {selected ? (
        <mesh>
          <ringGeometry args={[size * 1.35, size * 1.52, 64]} />
          <meshBasicMaterial color="#f0cf8a" transparent opacity={0.86} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
      {labels ? (
        <Html position={[0, -size * 1.8, 0]} center>
          <span className="object-label moon-object-label" style={style}>
            {object.name} · {Math.round(illumination * 100)}%
          </span>
        </Html>
      ) : null}
    </group>
  );
}

function ConstellationLayer({
  sky,
  selectedId,
  viewAzimuth,
  zoom,
  onSelect,
}: {
  sky: SkySnapshot;
  selectedId: string | null;
  viewAzimuth: number;
  zoom: number;
  onSelect: (id: string) => void;
}) {
  const starMap = useMemo(() => new Map(sky.stars.map((star) => [star.id, star])), [sky.stars]);

  return (
    <group>
      {sky.constellations
        .filter((constellation) => constellation.visibility > 0.15)
        .map((constellation) => {
          const selected = selectedId === constellation.id;
          return (
            <group key={constellation.id}>
              {constellation.segments.map(([from, to]) => {
                const start = starMap.get(from);
                const end = starMap.get(to);
                if (!start || !end) return null;
                return (
                  <Line
                    key={`${from}-${to}`}
                    points={[
                      positionOnDome(start.altitude, start.azimuth, viewAzimuth, zoom),
                      positionOnDome(end.altitude, end.azimuth, viewAzimuth, zoom),
                    ]}
                    color={constellation.color}
                    lineWidth={selected ? 2.2 : 1.1}
                    transparent
                    opacity={selected ? 0.78 : 0.34}
                  />
                );
              })}
              <mesh
                position={positionOnDome(constellation.averageAltitude, constellation.averageAzimuth, viewAzimuth, zoom)}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(constellation.id);
                }}
              >
                <sphereGeometry args={[0.18, 14, 14]} />
                <meshBasicMaterial color={constellation.color} transparent opacity={0.001} />
              </mesh>
              {selected ? (
                <Html position={positionOnDome(constellation.averageAltitude + 4, constellation.averageAzimuth, viewAzimuth, zoom)} center>
                  <span className="object-label" style={{ "--object-color": constellation.color } as CSSProperties}>
                    {constellation.name}
                  </span>
                </Html>
              ) : null}
            </group>
          );
        })}
    </group>
  );
}

function CelestialGrid({ viewAzimuth, zoom }: { viewAzimuth: number; zoom: number }) {
  const rings = [15, 30, 45, 60, 75].map((altitude) => ({
    altitude,
    points: circleAtAltitude(altitude, viewAzimuth, zoom),
  }));
  const spokes = Array.from({ length: 24 }, (_, index) => index * 15);
  const altitudeMarks = [0, 15, 30, 45, 60, 75, 90];
  const centralMeridian = altitudeMarks.map((altitude) => positionOnDome(altitude, viewAzimuth, viewAzimuth, zoom));

  return (
    <group>
      {rings.map((ring) => (
        <Line
          key={ring.altitude}
          points={ring.points}
          color="#9bb9b6"
          lineWidth={ring.altitude % 30 === 0 ? 0.75 : 0.5}
          transparent
          opacity={ring.altitude % 30 === 0 ? 0.2 : 0.105}
        />
      ))}
      {spokes.map((azimuth) => (
        <Line
          key={azimuth}
          points={[positionOnDome(89.5, azimuth, viewAzimuth, zoom), positionOnDome(0, azimuth, viewAzimuth, zoom)]}
          color="#9bb9b6"
          lineWidth={azimuth % 30 === 0 ? 0.65 : 0.4}
          transparent
          opacity={azimuth % 30 === 0 ? 0.14 : 0.07}
        />
      ))}
      <Line points={centralMeridian} color="#e3d8bd" lineWidth={0.9} transparent opacity={0.46} />
      {altitudeMarks.map((altitude) => {
        const tickSpan = altitude === 90 ? 5 : 1.1;
        return (
          <group key={altitude}>
            <Line
              points={[
                positionOnDome(altitude, viewAzimuth - tickSpan, viewAzimuth, zoom),
                positionOnDome(altitude, viewAzimuth + tickSpan, viewAzimuth, zoom),
              ]}
              color="#e3d8bd"
              lineWidth={0.9}
              transparent
              opacity={0.58}
            />
            <Html position={positionOnDome(altitude, viewAzimuth + (altitude === 90 ? 8 : 2.3), viewAzimuth, zoom)} center>
              <span className="celestial-degree-label altitude-degree-label">{altitude}°</span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function HorizonLayer({ viewAzimuth, zoom }: { viewAzimuth: number; zoom: number }) {
  const ticks = Array.from({ length: 72 }, (_, index) => index * 5);
  const labels = Array.from({ length: 12 }, (_, index) => index * 30).filter(
    (azimuth) => Math.abs(signedAngle(azimuth - viewAzimuth)) <= 82,
  );

  function cardinalFor(azimuth: number) {
    if (azimuth === 0) return "N";
    if (azimuth === 90) return "E";
    if (azimuth === 180) return "S";
    if (azimuth === 270) return "W";
    return null;
  }

  return (
    <group>
      <Line points={circleAtAltitude(0, viewAzimuth, zoom)} color="#efe1c1" lineWidth={1.25} transparent opacity={0.72} />
      {ticks.map((azimuth) => {
        const major = azimuth % 30 === 0;
        const medium = azimuth % 10 === 0;
        return (
          <Line
            key={azimuth}
            points={[
              positionOnDome(-0.65, azimuth, viewAzimuth, zoom),
              positionOnDome(major ? 1.8 : medium ? 1.15 : 0.65, azimuth, viewAzimuth, zoom),
            ]}
            color="#e3d8bd"
            lineWidth={major ? 0.95 : 0.55}
            transparent
            opacity={major ? 0.72 : medium ? 0.45 : 0.27}
          />
        );
      })}
      {labels.map((azimuth) => {
        const cardinal = cardinalFor(azimuth);
        return (
          <Html key={azimuth} position={positionOnDome(-3.7, azimuth, viewAzimuth, zoom)} center>
            <span className={`celestial-degree-label horizon-degree-label${cardinal ? " is-cardinal" : ""}`}>
              {cardinal ? `${cardinal} · ` : ""}
              {azimuth}°
            </span>
          </Html>
        );
      })}
    </group>
  );
}

function circleAtAltitude(altitude: number, viewAzimuth: number, zoom: number) {
  return Array.from({ length: 97 }, (_, index) => {
    const azimuth = (index / 96) * 360;
    return positionOnDome(altitude, azimuth, viewAzimuth, zoom);
  });
}

function positionOnDome(altitude: number, azimuth: number, viewAzimuth: number, zoom: number): [number, number, number] {
  const clippedAltitude = THREE.MathUtils.clamp(altitude, -8, 90);
  const altitudeRad = THREE.MathUtils.degToRad(clippedAltitude);
  const deltaRad = THREE.MathUtils.degToRad(signedAngle(azimuth - viewAzimuth));
  const radius = 7.7 * zoom;
  const x = Math.sin(deltaRad) * Math.cos(altitudeRad) * radius;
  const y = Math.sin(altitudeRad) * radius * 0.72;
  const z = -Math.cos(deltaRad) * Math.cos(altitudeRad) * radius;
  return [x, y, z];
}

function objectSize(object: SkyObject, selected: boolean) {
  if (object.type === "sun") return selected ? 0.23 : 0.18;
  if (object.type === "moon") return selected ? 0.55 : 0.44;
  if (object.type === "planet") return selected ? 0.18 : 0.13;
  const base = Math.max(0.045, Math.min(0.15, 0.14 - object.magnitude * 0.018));
  return selected ? base * 1.55 : base;
}
