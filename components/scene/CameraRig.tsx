"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PLANETS, SUN } from "@/data/planets";
import { useOrbisStore } from "@/lib/store";
import { getPlanetPosition } from "./positions";

interface Keyframe {
  position: () => THREE.Vector3;
  lookAt: () => THREE.Vector3;
  fov: number;
  radius?: number;
}

// Section keyframes for camera navigation
const SEGMENTS: Keyframe[] = [
  // 0 — Hero Intro: Zoomed Sun filling top/bottom & right edge
  {
    position: () => new THREE.Vector3(-6.5, 0, 10.0),
    lookAt: () => new THREE.Vector3(-5.0, 0, 0),
    fov: 42,
  },
  // 1 — Sun Transition: Sun moves into fuller view
  {
    position: () => new THREE.Vector3(-1.0, 0, 16.5),
    lookAt: () => new THREE.Vector3(0, 0, 0),
    fov: 48,
  },
  // 2..9 — Planets (Mercury -> Neptune) dynamically tracking moving orbital positions
  ...PLANETS.map<Keyframe>((p) => ({
    position: () => {
      const pos = getPlanetPosition(p.id);
      const camRadius = p.radius * 3.8 + 2.0;
      return new THREE.Vector3(pos.x, pos.y + 0.5, pos.z + camRadius);
    },
    lookAt: () => {
      return getPlanetPosition(p.id);
    },
    fov: 44,
    radius: p.radius,
  })),
  // 10 — OVERVIEW (LAST SECTION ONLY): Full solar system overview
  {
    position: () => new THREE.Vector3(0, 52, 90),
    lookAt: () => new THREE.Vector3(0, 0, 0),
    fov: 62,
  },
];

export default function CameraRig() {
  const { camera } = useThree();
  const progress = useOrbisStore((s) => s.progress);
  const panelOpen = useOrbisStore((s) => s.panelOpen);

  const posTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const n = SEGMENTS.length - 1;
    const scaled = THREE.MathUtils.clamp(progress, 0, 1) * n;
    let idx = Math.floor(scaled);
    if (idx >= n) idx = n - 1;
    const t = THREE.MathUtils.smootherstep(scaled - idx, 0, 1);

    const a = SEGMENTS[idx];
    const b = SEGMENTS[idx + 1];

    // Dynamically update position & lookAt target for moving orbiting planets
    posTarget.current.copy(a.position()).lerp(b.position(), t);
    lookTarget.current.copy(a.lookAt()).lerp(b.lookAt(), t);
    let fov = THREE.MathUtils.lerp(a.fov, b.fov, t);

    // When details card is open (panelOpen === true):
    // Shift camera lookTarget along the camera's local RIGHT vector so the active planet
    // moves smoothly into the exact center of the right side window!
    if (panelOpen && idx >= 2 && idx <= 9) {
      const r = a.radius || 1;

      // Compute camera forward and right direction vectors
      const forward = new THREE.Vector3()
        .subVectors(lookTarget.current, posTarget.current)
        .normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(forward, up).normalize();

      // Shift target left along camera right vector -> planet moves to RIGHT side of viewport
      lookTarget.current.sub(right.multiplyScalar(r * 2.2));
      fov = 40;
    }

    // Smooth camera damping
    const damp = 1 - Math.pow(0.001, delta);
    camera.position.lerp(posTarget.current, damp);
    currentLook.current.lerp(lookTarget.current, damp);
    camera.lookAt(currentLook.current);

    if ("fov" in camera) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, damp);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

export const SEGMENT_COUNT = SEGMENTS.length;
export const SUN_RADIUS = SUN.radius;
