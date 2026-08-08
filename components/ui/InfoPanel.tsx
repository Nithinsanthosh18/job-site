"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useOrbisStore } from "@/lib/store";
import {
  SERVICES,
  TECHNOLOGIES,
  CAPABILITIES,
  SUPPORT,
  FOUNDERS,
  PROJECTS,
  PLANETS,
} from "@/data/planets";
import AnimatedCounter from "./AnimatedCounter";
import ContactForm from "./ContactForm";

export default function InfoPanel() {
  const activeSection = useOrbisStore((s) => s.activeSection);
  const panelOpen = useOrbisStore((s) => s.panelOpen);
  const setPanelOpen = useOrbisStore((s) => s.setPanelOpen);

  const def = PLANETS.find((p) => p.id === activeSection);
  const open = panelOpen && !!def;

  return (
    <AnimatePresence>
      {open && def && (
        <motion.aside
          initial={{ x: "-110%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-110%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-4 sm:left-8 top-6 bottom-6 z-50 w-[92vw] sm:w-[56vw] max-w-[760px] h-[calc(100vh-48px)] glass-panel border border-solar-gold/40 rounded-[32px] p-6 sm:p-8 md:p-12 overflow-y-auto shadow-[0_0_120px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
        >
          <div className="flex flex-col justify-between min-h-full">
            <div>
              {/* Header section with Close button */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div>
                  <p className="eyebrow text-solar-gold text-xs tracking-widest2 mb-1">
                    {def.name} · Full Details
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide">
                    {def.title}
                  </h2>
                  <p className="text-white/60 text-xs sm:text-sm mt-1">{def.tagline}</p>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  aria-label="Close details"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-solar-gold hover:border-solar-gold transition-colors text-xs uppercase tracking-widest2 cursor-pointer shrink-0"
                >
                  <span>Close</span>
                  <span className="text-sm font-bold">✕</span>
                </button>
              </div>

              {/* Dynamic Section Contents */}
              <div className="py-2">
                {def.id === "mercury" && <AboutContent />}
                {def.id === "venus" && <ServicesContent />}
                {def.id === "earth" && <ProjectsContent />}
                {def.id === "mars" && <TechContent />}
                {def.id === "jupiter" && <CapabilitiesContent />}
                {def.id === "saturn" && <SupportContent />}
                {def.id === "uranus" && <TeamContent />}
                {def.id === "neptune" && <ContactContent />}
              </div>
            </div>

            {/* Footer inside left panel */}
            <div className="pt-6 mt-8 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
              <span>© 2026 ORBIS Studio</span>
              <button
                onClick={() => setPanelOpen(false)}
                className="hover:text-solar-gold transition-colors uppercase tracking-widest2 cursor-pointer"
              >
                Back to 3D Planet View →
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function AboutContent() {
  return (
    <div className="space-y-6 text-white/80 text-sm leading-relaxed">
      <div className="glass-panel p-5 rounded-2xl">
        <h3 className="text-solar-gold text-xs tracking-widest2 uppercase mb-2 font-semibold">
          Introduction
        </h3>
        <p>
          ORBIS is a premium AI and software freelancing studio. We pair senior
          engineers with product-minded designers to take ideas from a whiteboard
          sketch to production software.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-2xl">
          <h3 className="text-solar-gold text-xs tracking-widest2 uppercase mb-1 font-semibold">
            Mission
          </h3>
          <p className="text-xs text-white/70">
            Build technology that compounds for clients — software that keeps paying off long after launch day.
          </p>
        </div>
        <div className="glass-panel p-4 rounded-2xl">
          <h3 className="text-solar-gold text-xs tracking-widest2 uppercase mb-1 font-semibold">
            Vision
          </h3>
          <p className="text-xs text-white/70">
            To be the studio ambitious founders and teams call first when an idea is worth building properly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
        {[
          { n: 40, s: "+", label: "Projects" },
          { n: 98, s: "%", label: "On-time" },
          { n: 12, s: "+", label: "Tech Stack" },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-4 rounded-xl text-center">
            <AnimatedCounter target={stat.n} suffix={stat.s} active />
            <p className="text-[10px] uppercase tracking-widest2 text-white/50 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesContent() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SERVICES.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="glass-panel rounded-xl p-4 text-xs sm:text-sm text-white/90 hover:border-solar-gold/50 transition-colors flex items-center gap-2.5"
        >
          <span className="text-solar-gold">✦</span>
          <span>{s}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ProjectsContent() {
  return (
    <div className="space-y-4">
      {PROJECTS.map((p) => (
        <div key={p.name} className="glass-panel rounded-2xl p-5">
          <h4 className="font-display text-xl text-white mb-1">{p.name}</h4>
          <p className="text-[11px] tracking-widest2 uppercase text-solar-gold mb-2 font-semibold">
            {p.tech}
          </p>
          <p className="text-xs text-white/75 leading-relaxed mb-4">
            {p.description}
          </p>
          <div className="flex gap-4 text-xs font-semibold uppercase tracking-widest2 text-solar-gold border-t border-white/10 pt-3">
            <span className="hover:underline cursor-pointer">GitHub →</span>
            <span className="hover:underline cursor-pointer">Live Demo →</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TechContent() {
  return (
    <div className="flex flex-wrap gap-2">
      {TECHNOLOGIES.map((t) => (
        <span
          key={t}
          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-white/90 hover:border-solar-gold hover:text-solar-gold hover:bg-solar-gold/10 transition-all cursor-default"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function CapabilitiesContent() {
  return (
    <div className="space-y-3">
      {CAPABILITIES.map((c, i) => (
        <div key={c} className="glass-panel p-3 rounded-xl flex items-center gap-3">
          <span className="text-xs w-6 text-solar-gold font-mono">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-xs sm:text-sm text-white/90 w-36 font-medium">{c}</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${80 + ((i * 7) % 20)}%` }}
              transition={{ duration: 1, delay: i * 0.05 }}
              className="h-full bg-gradient-to-r from-solar-orange to-solar-gold"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportContent() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SUPPORT.map((s) => (
        <div
          key={s}
          className="glass-panel p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm text-white/90"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-solar-gold shadow-[0_0_8px_rgba(245,197,99,0.8)]" />
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
}

function TeamContent() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {FOUNDERS.map((f) => (
        <div
          key={f.name}
          className="glass-panel rounded-2xl p-4 flex flex-col items-center text-center gap-3"
        >
          <div className="relative h-16 w-16 rounded-full overflow-hidden border border-solar-gold/50 shadow-[0_0_15px_rgba(245,197,99,0.3)] shrink-0">
            <Image src={f.image} alt={f.name} fill className="object-cover" />
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold">{f.name}</h4>
            <p className="text-[10px] text-solar-gold tracking-widest2 uppercase mt-0.5">
              {f.role}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactContent() {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-2xl space-y-3 text-xs sm:text-sm text-white/80">
        <h3 className="text-solar-gold text-xs tracking-widest2 uppercase font-semibold">
          Contact Information
        </h3>
        <p className="flex items-center gap-2">
          <span>📍</span> <span>Erode, Tamil Nadu, India</span>
        </p>
        <p className="flex items-center gap-2">
          <span>✉️</span> <span>hello@orbis.dev</span>
        </p>
        <p className="flex items-center gap-2">
          <span>📞</span> <span>+91 00000 00000</span>
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-solar-gold text-xs tracking-widest2 uppercase font-semibold mb-4">
          Send Us A Message
        </h3>
        <ContactForm />
      </div>
    </div>
  );
}
