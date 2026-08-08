"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { PlanetDef, PLANETS } from "@/data/planets";
import { useOrbisStore } from "@/lib/store";
import { getPlanetPosition } from "./positions";

function PlanetGLTF({
  modelUrl,
  textureUrl,
  radius,
  defId,
}: {
  modelUrl: string;
  textureUrl: string;
  radius: number;
  defId: string;
}) {
  const { scene } = useGLTF(modelUrl);
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  const ringTexture = useLoader(THREE.TextureLoader, "/textures/saturn_ring.png");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    }

    // Calculate bounding box to center the model at (0,0,0)
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    // Normalize scale so planet model fits the configured def.radius size
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const targetScale = (radius * 2) / maxDim;
      clone.scale.setScalar(targetScale);
    }

    // Earth and Uranus keep their original GLB model materials unchanged.
    // Other planets get their authentic high-res texture mapped onto the 3D model mesh.
    if (defId !== "earth" && defId !== "uranus") {
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const isRingMesh =
            mesh.name.toLowerCase().includes("ring") ||
            mesh.name.toLowerCase().includes("circle");

          if (isRingMesh) {
            ringTexture.colorSpace = THREE.SRGBColorSpace;
            mesh.material = new THREE.MeshBasicMaterial({
              map: ringTexture,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.85,
            });
          } else {
            mesh.material = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.75,
              metalness: 0.05,
              transparent: true,
            });
          }
        }
      });
    }

    return clone;
  }, [scene, texture, ringTexture, radius, defId]);

  return <primitive object={clonedScene} />;
}

function SaturnRing({ radius, texturePath }: { radius: number; texturePath: string }) {
  const ringTexture = useLoader(THREE.TextureLoader, texturePath);
  return (
    <mesh rotation={[Math.PI / 2.3, 0, 0]}>
      <ringGeometry args={[radius * 1.4, radius * 2.5, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Planet({ def }: { def: PlanetDef }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const activeSection = useOrbisStore((s) => s.activeSection);
  const progress = useOrbisStore((s) => s.progress);
  const setHoveredPlanet = useOrbisStore((s) => s.setHoveredPlanet);
  const setActiveSection = useOrbisStore((s) => s.setActiveSection);
  const setPanelOpen = useOrbisStore((s) => s.setPanelOpen);

  const handleClick = (e: any) => {
    e.stopPropagation();
    const el = document.getElementById(`section-${def.id}`);
    el?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(def.id);
    setPanelOpen(true);
  };

  const currentOpacity = useRef(0);

  const CELESTIAL_FOCUS_IDS = [
    "sun",
    "mercury",
    "venus",
    "earth",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ];

  // Calculate if camera is focused on a specific celestial section (Sun or Planets)
  const n = 10;
  const scaled = progress * n;
  const currentIdx = Math.round(scaled);
  const distFromCenter = Math.abs(scaled - currentIdx);

  const isFocusedOnSegment =
    CELESTIAL_FOCUS_IDS.includes(activeSection) && distFromCenter <= 0.25;
  const isStartingStage = activeSection === "intro" || progress < 0.05;

  // Hide planets on starting intro stage to keep left logo region clean.
  // When focused on a specific section (including visiting the Sun), ONLY that section's target remains visible (all other planets hide).
  // In overview or travel mode between sections, all planets are visible.
  let targetOpacity = 1;
  if (isStartingStage) {
    targetOpacity = 0;
  } else if (isFocusedOnSegment) {
    targetOpacity = activeSection === def.id ? 1 : 0;
  }

  useFrame((state, delta) => {
    currentOpacity.current = THREE.MathUtils.lerp(
      currentOpacity.current,
      targetOpacity,
      0.25
    );

    if (groupRef.current) {
      groupRef.current.visible = currentOpacity.current > 0.01;
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              m.transparent = true;
              m.opacity = currentOpacity.current;
            });
          } else if (mesh.material) {
            mesh.material.transparent = true;
            mesh.material.opacity = currentOpacity.current;
          }
        }
      });
    }

    // All planets CONTINUOUSLY MOVE / REVOLVE AROUND THE SUN along their orbit lines in real time!
    const time = state.clock.getElapsedTime();
    const currentAngle = def.orbitAngle + time * def.orbitSpeed * 0.5;
    const currentX = Math.cos(currentAngle) * def.orbitRadius;
    const currentZ = Math.sin(currentAngle) * def.orbitRadius;

    if (groupRef.current) {
      groupRef.current.position.set(currentX, 0, currentZ);
      getPlanetPosition(def.id).set(currentX, 0, currentZ);
    }

    // Visited planet rotates continuously on its axis
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * def.spinSpeed;
    }

    const targetScale = hovered ? 1.08 : 1;
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, def.tilt]}>
        <group
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            setHoveredPlanet(def.id);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            setHoveredPlanet(null);
          }}
        >
          {def.model ? (
            <PlanetGLTF
              modelUrl={def.model}
              textureUrl={def.texture}
              radius={def.radius}
              defId={def.id}
            />
          ) : (
            <mesh>
              <sphereGeometry args={[def.radius, 64, 64]} />
              <meshStandardMaterial
                map={useLoader(THREE.TextureLoader, def.texture)}
                roughness={0.85}
                metalness={0.05}
                transparent
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

// Preload all GLTF models for smooth performance
PLANETS.forEach((p) => {
  if (p.model) {
    useGLTF.preload(p.model);
  }
});
