"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useOrbisStore } from "@/lib/store";
import { SEGMENT_COUNT } from "@/components/scene/CameraRig";

const INTRO_END = 1 / (SEGMENT_COUNT - 1);

export default function OrbisLogo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = useOrbisStore.subscribe((state) => {
      const el = ref.current;
      if (!el) return;
      const t = Math.min(1, state.progress / INTRO_END);
      const ease = t * t * (3 - 2 * t); // smoothstep

      const startSize = 210;
      const endSize = 46;
      const size = startSize + (endSize - startSize) * ease;

      // Centered -> top-left, staying inside a safe margin on both axes
      const startTop = 50;
      const endTop = 6;
      const startLeft = 50;
      const endLeft = 4.5;
      const top = startTop + (endTop - startTop) * ease;
      const left = startLeft + (endLeft - startLeft) * ease;
      const xOffset = -50 + 50 * ease; // -50% (centered) -> 0% (left aligned)
      const yOffset = -50 + 50 * ease;

      el.style.top = `${top}%`;
      el.style.left = `${left}%`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.transform = `translate(${xOffset}%, ${yOffset}%) rotate(${
        2 - 2 * ease
      }deg)`;
    });
    return unsub;
  }, []);

  return (
    <div
      ref={ref}
      className="fixed z-50 pointer-events-none drop-shadow-[0_0_25px_rgba(245,197,99,0.45)] transition-none"
      style={{
        top: "50%",
        left: "50%",
        width: 210,
        height: 210,
        transform: "translate(-50%, -50%) rotate(2deg)",
      }}
    >
      <Image
        src="/images/orbis-logo.jpeg"
        alt="ORBIS — Grow Together"
        fill
        priority
        className="object-contain rounded-full mix-blend-screen"
      />
    </div>
  );
}
