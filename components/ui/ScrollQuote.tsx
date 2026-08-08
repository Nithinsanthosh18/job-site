"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QUOTES } from "@/data/planets";
import { useOrbisStore } from "@/lib/store";
import { SEGMENT_COUNT } from "@/components/scene/CameraRig";

const QUOTE = QUOTES[Math.floor(Math.random() * QUOTES.length)];

// Zoom-out is segment index 2 of SEGMENT_COUNT-1 total spans
const SPAN = 1 / (SEGMENT_COUNT - 1);
const START = SPAN * 1.55;
const END = SPAN * 2.75;

export default function ScrollQuote() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return useOrbisStore.subscribe((s) => {
      setVisible(s.progress > START && s.progress < END);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center px-8">
      <AnimatePresence>
        {visible && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="font-display text-2xl md:text-4xl text-center text-white/90 max-w-2xl italic"
          >
            &ldquo;{QUOTE}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
