"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { SUN } from "@/data/planets";

const sunShader = {
  uniforms: {
    uTexture: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffffff") },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vPosition = mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Dual-sample seamless spherical wrapping with smooth blending across seam
      vec2 uv1 = vec2(fract(vUv.x), vUv.y);
      vec2 uv2 = vec2(fract(vUv.x + 0.5), vUv.y);
      
      vec4 col1 = texture2D(uTexture, uv1);
      vec4 col2 = texture2D(uTexture, uv2);
      
      // Blend factor: 1 in middle of uv1, 0 near u=0 and u=1 (seam)
      float seamDist = sin(vUv.x * 3.141592653589793);
      float blend = smoothstep(0.02, 0.25, seamDist);
      
      vec3 baseColor = mix(col2.rgb, col1.rgb, blend) * uColor;
      
      // Soft limb darkening for authentic 3D sphere volume
      vec3 viewDir = normalize(-vPosition);
      float NdotV = max(dot(normalize(vNormal), viewDir), 0.0);
      float rim = 1.0 - NdotV;
      float limb = pow(NdotV, 0.35);
      
      vec3 finalColor = baseColor * (0.88 + 0.3 * limb);
      
      // Subtle fiery rim warmth
      finalColor += vec3(1.0, 0.45, 0.1) * pow(rim, 3.5) * 0.7;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

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

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: sunShader.vertexShader,
      fragmentShader: sunShader.fragmentShader,
    });
  }, [texture]);

  useEffect(() => {
    if (shaderMaterial && texture) {
      shaderMaterial.uniforms.uTexture.value = texture;
      shaderMaterial.needsUpdate = true;
    }
  }, [shaderMaterial, texture]);

  // Create smooth radial fire glow textures programmatically for soft photorealistic fire aura
  const fireCoronaTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(256, 256, 120, 256, 256, 256);
    gradient.addColorStop(0, "rgba(255, 170, 30, 0.9)");
    gradient.addColorStop(0.3, "rgba(255, 90, 10, 0.5)");
    gradient.addColorStop(0.6, "rgba(255, 40, 0, 0.2)");
    gradient.addColorStop(0.85, "rgba(200, 20, 0, 0.05)");
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
    gradient.addColorStop(0, "rgba(255, 140, 0, 0.6)");
    gradient.addColorStop(0.45, "rgba(255, 60, 0, 0.2)");
    gradient.addColorStop(0.8, "rgba(180, 10, 0, 0.04)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = time;
    }

    // 1. Smoothly rotate the main photorealistic Sun sphere
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.02;
    }

    // 2. Animate organic solar fire corona breathing pulse
    if (coronaSpriteRef.current) {
      const pulse =
        SUN.radius * 2.3 + Math.sin(time * 2.5) * (SUN.radius * 0.05);
      coronaSpriteRef.current.scale.set(pulse, pulse, 1);
    }

    // 3. Animate outer solar flare atmosphere
    if (outerGlowRef.current) {
      const outerPulse =
        SUN.radius * 3.0 + Math.cos(time * 1.8) * (SUN.radius * 0.06);
      outerGlowRef.current.scale.set(outerPulse, outerPulse, 1);
    }

    // 4. Soft flickering solar point light
    if (lightRef.current) {
      lightRef.current.intensity = 280 + Math.sin(time * 3.0) * 20;
    }
  });

  return (
    <group visible={true}>
      {/* 1. Main 100% Seamless Photorealistic Sun Sphere */}
      <mesh ref={coreRef} material={shaderMaterial}>
        <sphereGeometry args={[SUN.radius, 128, 128]} />
      </mesh>

      {/* 2. Soft Photorealistic Solar Fire Corona */}
      {fireCoronaTexture && (
        <sprite
          ref={coronaSpriteRef}
          scale={[SUN.radius * 2.3, SUN.radius * 2.3, 1]}
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
          scale={[SUN.radius * 3.0, SUN.radius * 3.0, 1]}
        >
          <spriteMaterial
            map={outerFireGlowTexture}
            transparent
            opacity={0.45}
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
