"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOrbisStore } from "@/lib/store";

export default function IntroCopy() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 2000);
    const unsub = useOrbisStore.subscribe((state) => {
      const el = ref.current;
      if (!el) return;
      const opacity = Math.max(0, 1 - state.progress * 55);
      el.style.opacity = String(opacity);
      el.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
    });
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed bottom-12 left-12 z-40 flex flex-col items-start gap-5 md:left-20"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="eyebrow text-gradient-gold text-sm md:text-base"
      >
        Grow Together
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.4 }}
        className="flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-xs tracking-widest2 uppercase">
          Scroll Down
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-solar-gold text-xl"
        >
          ↓
        </motion.span>
      </motion.div>
    </div>
  );
}
