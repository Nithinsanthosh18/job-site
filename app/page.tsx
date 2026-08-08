"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/lib/useLenis";
import { useOrbisStore } from "@/lib/store";
import { PLANETS } from "@/data/planets";
import Experience from "@/components/Experience";
import Footer from "@/components/ui/Footer";

gsap.registerPlugin(ScrollTrigger);

const SECTION_IDS = [
  "intro",
  "sun",
  ...PLANETS.map((p) => p.id),
  "overview",
] as const;

export default function Home() {
  useLenis();
  const trackRef = useRef<HTMLDivElement>(null);
  const setProgress = useOrbisStore((s) => s.setProgress);
  const setActiveSection = useOrbisStore((s) => s.setActiveSection);

  useEffect(() => {
    if (!trackRef.current) return;
    const n = SECTION_IDS.length - 1;

    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.35,
      // Automatic smooth snap/focus when getting close to any planet section
      snap: {
        snapTo: 1 / n,
        duration: { min: 0.25, max: 0.45 },
        delay: 0.12,
        ease: "power2.out",
      },
      onUpdate: (self) => {
        setProgress(self.progress);
        const idx = Math.min(n, Math.round(self.progress * n));
        setActiveSection(SECTION_IDS[idx] as any);
      },
    });

    return () => trigger.kill();
  }, [setProgress, setActiveSection]);

  return (
    <>
      <Experience />

      <main className="pointer-events-none">
        <div ref={trackRef} className="relative pointer-events-none">
          {SECTION_IDS.map((id) => (
            <section
              key={id}
              id={`section-${id}`}
              className="h-screen w-full pointer-events-none"
              aria-label={id}
            />
          ))}
        </div>

        <div className="pointer-events-auto">
          <Footer />
        </div>
      </main>
    </>
  );
}
