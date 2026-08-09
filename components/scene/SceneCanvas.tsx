"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Sun from "./Sun";
import Planet from "./Planet";
import OrbitRing from "./OrbitRing";
import CameraRig from "./CameraRig";
import { PLANETS } from "@/data/planets";

export default function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 52], fov: 45, near: 0.1, far: 3000 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      {/* Soft, balanced lighting for realistic 3D planets */}
      <ambientLight intensity={0.45} color="#e0e8ff" />
      <directionalLight position={[15, 20, 25]} intensity={0.6} color="#ffffff" />

      <Suspense fallback={null}>
        <Sun />
        {/* Render all concentric orbit rings centered around the Sun */}
        {PLANETS.map((p) => (
          <OrbitRing key={`ring-${p.id}`} radius={p.orbitRadius} />
        ))}
        {/* Render all planets */}
        {PLANETS.map((p) => (
          <Planet key={p.id} def={p} />
        ))}
      </Suspense>

      <CameraRig />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.25}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.2} darkness={0.35} />
      </EffectComposer>
    </Canvas>
  );
}
