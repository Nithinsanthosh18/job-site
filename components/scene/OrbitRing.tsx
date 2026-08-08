"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useOrbisStore } from "@/lib/store";

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

export default function OrbitRing({ radius }: { radius: number }) {
  const lineRef = useRef<any>(null);
  const activeSection = useOrbisStore((s) => s.activeSection);
  const progress = useOrbisStore((s) => s.progress);
  const currentOpacity = useRef(0.38);

  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 360;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);

  const n = 10;
  const scaled = progress * n;
  const currentIdx = Math.round(scaled);
  const distFromCenter = Math.abs(scaled - currentIdx);

  const isFocusedOnSegment =
    CELESTIAL_FOCUS_IDS.includes(activeSection) && distFromCenter <= 0.25;
  const isStartingStage = activeSection === "intro" || progress < 0.05;

  // Orbit lines fade out on intro stage & when visiting the Sun or any planet section.
  // Orbit lines show smoothly during overview or travel mode between sections!
  const targetOpacity = isStartingStage || isFocusedOnSegment ? 0 : 0.38;

  useFrame(() => {
    currentOpacity.current = THREE.MathUtils.lerp(
      currentOpacity.current,
      targetOpacity,
      0.25
    );

    if (lineRef.current) {
      lineRef.current.visible = currentOpacity.current > 0.005;
      if (lineRef.current.material) {
        lineRef.current.material.transparent = true;
        lineRef.current.material.opacity = currentOpacity.current;
      }
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#ffffff"
      transparent
      opacity={0.3}
      lineWidth={0.5}
    />
  );
}
