"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function useStarGeometry(count: number, radius: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 1.6 + 0.3;
    }
    return { positions, sizes };
  }, [count, radius]);
}

export default function Starfield() {
  const near = useStarGeometry(4200, 260);
  const far = useStarGeometry(3200, 520);
  const nearRef = useRef<THREE.Points>(null);
  const farRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (nearRef.current) nearRef.current.rotation.y += delta * 0.003;
    if (farRef.current) farRef.current.rotation.y -= delta * 0.0012;
  });

  return (
    <group>
      <points ref={farRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[far.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.75}
          sizeAttenuation
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </points>
      <points ref={nearRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[near.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={1.1}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
