"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useOrbisStore } from "@/lib/store";

export default function HeroLogoSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 200);

    const unsub = useOrbisStore.subscribe((state) => {
      const el = containerRef.current;
      const scrollEl = scrollRef.current;
      const progress = state.progress;

      // Totally disable hero logo & tagline as soon as user leaves the intro section towards the Sun
      if (el) {
        if (state.activeSection !== "intro" || progress > 0.05) {
          el.style.opacity = "0";
          el.style.display = "none";
          el.style.pointerEvents = "none";
        } else {
          const t = Math.min(1, Math.max(0, progress / 0.04));
          const opacity = Math.max(0, 1 - t);
          el.style.opacity = String(opacity);
          el.style.display = opacity <= 0.01 ? "none" : "block";
          el.style.transform = `translate(-50%, -50%) scale(${1 - t * 0.15})`;
          el.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
        }
      }

      if (scrollEl) {
        if (state.activeSection !== "intro" || progress > 0.03) {
          scrollEl.style.opacity = "0";
          scrollEl.style.display = "none";
          scrollEl.style.pointerEvents = "none";
        } else {
          const scrollOpacity = Math.max(0, 1 - progress * 25);
          scrollEl.style.opacity = String(scrollOpacity);
          scrollEl.style.display = scrollOpacity <= 0.01 ? "none" : "flex";
          scrollEl.style.pointerEvents = scrollOpacity < 0.05 ? "none" : "auto";
        }
      }
    });

    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  return (
    <>
      {/* Official ORBIS Logo + Tagline Centered Column on Left Space Region */}
      <div
        ref={containerRef}
        className="fixed z-40 left-[26%] sm:left-[24%] top-[46%] pointer-events-none origin-center transition-none"
        style={{
          transform: "translate(-50%, -50%) scale(1)",
          willChange: "opacity, transform",
        }}
      >
        <div className="flex flex-col items-center text-center gap-4">
          {/* Logo Centered */}
          <div className="relative w-[300px] h-[170px] sm:w-[420px] sm:h-[235px] filter drop-shadow-[0_0_40px_rgba(245,197,99,0.85)]">
            <Image
              src="/images/orbis-logo-white.png"
              alt="ORBIS — Grow Together"
              fill
              priority
              className="object-contain object-center"
            />
          </div>

          {/* Tagline Bar Centered */}
          <div className="px-5 py-2 rounded-full border border-solar-gold/40 bg-black/60 backdrop-blur-md shadow-[0_0_20px_rgba(245,197,99,0.3)]">
            <p className="font-display text-solar-gold text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold text-center drop-shadow-[0_0_8px_rgba(245,197,99,0.6)]">
              Grow Together · Premium AI &amp; Software
            </p>
          </div>
        </div>
      </div>

      {/* EXPLORE instruction Centered under Logo Column */}
      <div
        ref={scrollRef}
        className="fixed left-[26%] sm:left-[24%] top-[82%] z-40 flex flex-col items-center text-center gap-2 pointer-events-none -translate-x-1/2"
        style={{ willChange: "opacity" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xs tracking-[0.35em] uppercase text-white/75 font-semibold text-center"
        >
          EXPLORE
        </motion.p>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-solar-gold text-xl font-light"
        >
          ↓
        </motion.span>
      </div>
    </>
  );
}
