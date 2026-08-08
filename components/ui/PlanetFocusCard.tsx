"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PLANETS } from "@/data/planets";
import { useOrbisStore } from "@/lib/store";

export default function PlanetFocusCard() {
  const activeSection = useOrbisStore((s) => s.activeSection);
  const progress = useOrbisStore((s) => s.progress);
  const panelOpen = useOrbisStore((s) => s.panelOpen);
  const setPanelOpen = useOrbisStore((s) => s.setPanelOpen);

  const def = PLANETS.find((p) => p.id === activeSection);

  // Automatically show focus card when close to any planet section
  const n = 10;
  const scaled = progress * n;
  const currentIdx = Math.round(scaled);
  const distFromCenter = Math.abs(scaled - currentIdx);
  const isFocused = distFromCenter < 0.35;

  const visible = !!def && !panelOpen && isFocused;

  return (
    <AnimatePresence>
      {visible && def && (
        <div className="fixed bottom-8 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex flex-col items-center text-center glass-panel border border-solar-gold/40 rounded-2xl px-6 py-4 max-w-xs sm:max-w-sm w-full shadow-[0_0_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
          >
            <span className="eyebrow text-solar-gold text-[10px] tracking-widest2 mb-0.5">
              {def.name}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide mb-0.5">
              {def.title}
            </h2>
            <p className="text-[11px] text-white/60 mb-3.5 leading-tight">
              {def.tagline}
            </p>

            <button
              onClick={() => setPanelOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 w-full py-2.5 px-6 rounded-full bg-gradient-to-r from-solar-orange to-solar-gold text-black font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-102 hover:shadow-[0_0_25px_rgba(245,197,99,0.8)] cursor-pointer"
            >
              <span>CLICK TO VIEW</span>
              <span className="group-hover:translate-x-1 transition-transform font-extrabold text-sm">
                →
              </span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
