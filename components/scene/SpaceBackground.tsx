"use client";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function SpaceBackground() {
  const texture = useLoader(THREE.TextureLoader, "/backgrounds/custom_milkyway.jpg");

  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  return (
    <mesh scale={[-2000, -2000, -2000]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        color="#ffffff"
      />
    </mesh>
  );
}
