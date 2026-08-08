"use client";

import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { SUN } from "@/data/planets";

export default function Sun() {
  const texture = useLoader(THREE.TextureLoader, SUN.texture);

  const coreRef = useRef<THREE.Mesh>(null);
  const coronaSpriteRef = useRef<THREE.Sprite>(null);
  const outerGlowRef = useRef<THREE.Sprite>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  // Create smooth radial fire glow textures programmatically for soft photorealistic fire aura
  const fireCoronaTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(256, 256, 120, 256, 256, 256);
    gradient.addColorStop(0, "rgba(255, 170, 30, 0.95)");
    gradient.addColorStop(0.25, "rgba(255, 90, 10, 0.65)");
    gradient.addColorStop(0.55, "rgba(255, 40, 0, 0.35)");
    gradient.addColorStop(0.8, "rgba(200, 20, 0, 0.12)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    return new THREE.CanvasTexture(canvas);
  }, []);

  const outerFireGlowTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(256, 256, 140, 256, 256, 256);
    gradient.addColorStop(0, "rgba(255, 140, 0, 0.7)");
    gradient.addColorStop(0.4, "rgba(255, 60, 0, 0.3)");
    gradient.addColorStop(0.8, "rgba(180, 10, 0, 0.08)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Smoothly rotate the main photorealistic Sun sphere
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.02;
    }

    // 2. Animate organic solar fire corona breathing pulse
    if (coronaSpriteRef.current) {
      const pulse = SUN.radius * 2.5 + Math.sin(time * 2.5) * (SUN.radius * 0.06);
      coronaSpriteRef.current.scale.set(pulse, pulse, 1);
    }

    // 3. Animate outer solar flare atmosphere
    if (outerGlowRef.current) {
      const outerPulse = SUN.radius * 3.4 + Math.cos(time * 1.8) * (SUN.radius * 0.08);
      outerGlowRef.current.scale.set(outerPulse, outerPulse, 1);
    }

    // 4. Soft flickering solar point light
    if (lightRef.current) {
      lightRef.current.intensity = 280 + Math.sin(time * 3.0) * 20;
    }
  });

  return (
    <group visible={true}>
      {/* 1. Main Seamless Photorealistic Sun Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[SUN.radius, 128, 128]} />
        <meshBasicMaterial
          map={texture}
          color={new THREE.Color("#ffffff")}
        />
      </mesh>

      {/* 2. Soft Photorealistic Solar Fire Corona */}
      {fireCoronaTexture && (
        <sprite
          ref={coronaSpriteRef}
          scale={[SUN.radius * 2.5, SUN.radius * 2.5, 1]}
        >
          <spriteMaterial
            map={fireCoronaTexture}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* 3. Outer Solar Flare Radiating Atmosphere */}
      {outerFireGlowTexture && (
        <sprite
          ref={outerGlowRef}
          scale={[SUN.radius * 3.4, SUN.radius * 3.4, 1]}
        >
          <spriteMaterial
            map={outerFireGlowTexture}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* 4. Soft Solar Light Emission */}
      <pointLight
        ref={lightRef}
        color="#ffb855"
        intensity={280}
        distance={600}
        decay={1.8}
      />
    </group>
  );
}
