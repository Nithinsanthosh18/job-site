"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PLANETS } from "@/data/planets";
import { useOrbisStore } from "@/lib/store";

const NAV_ITEMS = [
  { id: "sun", label: "Sun" },
  ...PLANETS.map((p) => ({ id: p.id, label: p.navLabel })),
  { id: "overview", label: "Overview" },
];

const FIVE_QUOTES = [
  "GROW TOGETHER · PREMIUM AI & SOFTWARE",
  "The best code is written for people",
  "Programming is where imagination becomes reality",
  "Every great product begins with one idea",
  "Dream · Code · Build",
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const activeSection = useOrbisStore((s) => s.activeSection);

  useEffect(() => {
    return useOrbisStore.subscribe((s) => {
      // Hide on first page (intro), show starting when visiting the Sun onwards
      const isPastIntro = s.activeSection !== "intro" && s.progress >= 0.07;
      setVisible(isPastIntro);
    });
  }, []);

  // Cycle through the 5 quotes one by one every 4.5 seconds when details are not open
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % FIVE_QUOTES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectSegment = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false); // Details disappear and 5 quotes return after segment selection
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 px-2 md:px-6 py-3 transition-all duration-500 pointer-events-auto flex justify-center ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 md:gap-3.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-solar-gold/35 bg-black/85 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.95)] transition-all duration-300 ${
          menuOpen ? "w-full max-w-[96vw] lg:max-w-7xl" : "w-full max-w-5xl"
        }`}
      >
        {/* Left: Logo (White Background) */}
        <button
          onClick={() => {
            scrollToSection("intro");
            setMenuOpen(false);
          }}
          className="flex items-center cursor-pointer group shrink-0 overflow-hidden rounded-full border border-white/20 bg-white px-2 py-0.5 transition-transform hover:scale-105 shadow-md"
          title="Return to Top"
        >
          <div className="relative h-6 w-16 md:h-7 md:w-22">
            <Image
              src="/images/orbis-navbar-logo-white-bg.png"
              alt="ORBIS Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </button>

        {/* Center: 5 Quotes cycling one by one (default) OR Details Segments (when 3 dots clicked) */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-1">
          <AnimatePresence mode="wait">
            {!menuOpen ? (
              /* 5 QUOTES ONE BY ONE */
              <motion.div
                key={`quote-${quoteIndex}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-xl mx-auto flex items-center justify-center px-4 py-1 rounded-full border border-solar-gold/30 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(245,197,99,0.2)] text-center"
              >
                <span className="font-display text-solar-gold text-[11px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold text-center truncate drop-shadow-[0_0_8px_rgba(245,197,99,0.5)]">
                  {FIVE_QUOTES[quoteIndex]}
                </span>
              </motion.div>
            ) : (
              /* SEGMENTS TRACK (Shown when 3 dots clicked, wording bar disappears) */
              <motion.nav
                key="segments-track"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex items-center justify-between md:justify-center overflow-x-auto no-scrollbar py-0.5"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex items-center justify-between gap-1 md:gap-2.5 w-full shrink-0">
                  {NAV_ITEMS.map((item) => {
                    const isActive = item.id === activeSection;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSegment(item.id)}
                        className={`group flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-2.5 md:py-1 rounded-full transition-all duration-200 shrink-0 cursor-pointer ${
                          isActive
                            ? "bg-solar-gold/25 text-solar-gold border border-solar-gold/60 shadow-[0_0_15px_rgba(245,197,99,0.4)]"
                            : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        {/* Dot Node Indicator */}
                        <span
                          className={`rounded-full transition-all duration-200 shrink-0 ${
                            isActive
                              ? "w-2 h-2 md:w-2.5 md:h-2.5 bg-solar-gold shadow-[0_0_10px_rgba(245,197,99,0.9)] ring-2 ring-solar-gold/50 scale-110"
                              : "w-1.5 h-1.5 md:w-2 md:h-2 bg-white/40 group-hover:bg-white/80 group-hover:scale-110"
                          }`}
                        />

                        {/* Section Label */}
                        <span className="font-display text-[10px] md:text-xs tracking-wider uppercase font-semibold whitespace-nowrap">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Three Dots Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          title={menuOpen ? "Show Tagline Bar" : "Show Segments"}
          className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full border transition-all cursor-pointer shrink-0 ${
            menuOpen
              ? "border-solar-gold bg-solar-gold/30 text-solar-gold shadow-[0_0_18px_rgba(245,197,99,0.5)] scale-105"
              : "border-solar-gold/40 bg-white/5 text-solar-gold hover:border-solar-gold hover:bg-solar-gold/20"
          }`}
        >
          <span className="text-lg md:text-xl font-bold tracking-tighter leading-none select-none">
            ⋮
          </span>
        </button>
      </div>
    </header>
  );
}
