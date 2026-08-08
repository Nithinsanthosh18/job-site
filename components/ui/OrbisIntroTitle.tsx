"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useOrbisStore } from "@/lib/store";
import { SEGMENT_COUNT } from "@/components/scene/CameraRig";

const INTRO_END = 1 / (SEGMENT_COUNT - 1);

export default function OrbisIntroTitle() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = useOrbisStore.subscribe((state) => {
      const el = wrapRef.current;
      if (!el) return;
      // Fade out as user scrolls into next section
      const t = Math.min(1, state.progress / INTRO_END);
      const opacity = Math.max(0, 1 - t * 3);
      const translateX = -t * 60; // slides left as it fades
      el.style.opacity = String(opacity);
      el.style.transform = `translateX(${translateX}px)`;
      el.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
    });
    return unsub;
  }, []);

  return (
    <div
      ref={wrapRef}
      className="fixed left-0 top-0 z-40 flex h-full w-1/2 flex-col items-start justify-center pl-12 md:pl-20"
      style={{ willChange: "opacity, transform" }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        className="eyebrow mb-5 text-solar-gold text-xs tracking-[0.35em]"
      >
        Grow Together
      </motion.p>

      {/* Main ORBIS wordmark */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="font-display select-none leading-none tracking-tight text-white"
        style={{
          fontSize: "clamp(5rem, 13vw, 11rem)",
          textShadow: "0 0 80px rgba(245, 197, 99, 0.18)",
        }}
      >
        ORBIS
      </motion.h1>

      {/* Thin gold divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
        className="mt-6 h-px w-24 origin-left bg-gradient-to-r from-solar-gold to-transparent"
      />

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.85, ease: "easeOut" }}
        className="mt-5 max-w-xs text-sm leading-relaxed text-white/50"
      >
        We build products that orbit the future — from AI to the web.
      </motion.p>
    </div>
  );
}
