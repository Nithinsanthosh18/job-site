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
          className="fixed left-4 sm:left-8 top-6 bottom-6 z-50 w-[92vw] sm:w-[56vw] max-w-[760px] h-[calc(100vh-48px)] glass-panel border border-solar-gold/40 rounded-[32px] p-6 sm:p-8 md:p-12 overflow-y-auto overscroll-contain shadow-[0_0_120px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
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
  const differentiators = [
    {
      title: "End-to-End Tech Execution",
      desc: "Under one roof: development, design, data, DevOps, and product strategy.",
    },
    {
      title: "Rapid, Transparent Collaboration",
      desc: "Clear milestones, direct communication, and impact metrics.",
    },
    {
      title: "Global Talent Network",
      desc: "Ensuring the right expertise for every project and budget.",
    },
  ];

  return (
    <div className="space-y-6 text-white/80 text-sm leading-relaxed">
      {/* Introduction Card */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4 border border-white/10">
        <h3 className="text-solar-gold text-xs tracking-widest2 uppercase font-semibold flex items-center gap-2">
          <span className="text-solar-gold">✦</span> Introduction
        </h3>
        <p className="text-white/95 font-medium text-sm sm:text-base leading-relaxed">
          ORBIS is your beacon for all things tech freelancing—a bold, future-forward partner born from collaboration in May 2026, designed to turn bold ideas into scalable digital outcomes.
        </p>
        <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
          ORBIS is not just a freelancing company; it is a living constellation of engineers, designers, and strategists united to illuminate every corner of technology—from clean code and seamless UX to resilient infrastructure and intelligent automation. Born in May 2026, Orbis embodies speed, integrity, and boundless curiosity, delivering transformative solutions that empower businesses to orbit beyond yesterday’s limits. We listen, we prototype, we ship—together, we turn complex problems into elegant, measurable outcomes.
        </p>

        {/* Core Differentiators */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <h4 className="text-solar-gold/90 text-xs font-semibold uppercase tracking-widest2">
            Core Differentiators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {differentiators.map((diff, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-3 hover:border-solar-gold/40 transition-colors"
              >
                <div className="text-solar-gold text-xs font-bold mb-1 flex items-center gap-1.5">
                  <span className="text-[10px]">❖</span>
                  {diff.title}
                </div>
                <p className="text-[11px] text-white/70 leading-normal">
                  {diff.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="space-y-4">
        {/* Our Mission */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-white/10">
          <h3 className="text-solar-gold text-xs tracking-widest2 uppercase font-semibold flex items-center gap-2">
            <span className="text-solar-gold">✦</span> Our Mission
          </h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            At ORBIS, our mission is to transform ideas into meaningful technology solutions that help businesses, entrepreneurs, and individuals move forward with confidence. Established from a shared vision in May 2026, we bring together creativity, technical expertise, strategic thinking, and a commitment to excellence to deliver reliable digital services for every challenge. From website and application development to design, automation, software solutions, and technology consulting, we aim to make innovation more accessible, practical, and impactful. We believe that technology should not be complicated or distant—it should be clear, useful, adaptable, and created around the real needs of people. Through honest communication, collaborative partnerships, and continuous learning, ORBIS is committed to turning complex concepts into simple, powerful, and future-ready digital experiences.
          </p>
          <div className="bg-solar-gold/10 border-l-2 border-solar-gold p-3 rounded-r-xl italic text-solar-gold text-xs sm:text-sm font-medium">
            “Our mission is to make technology work for people, ideas, and progress.”
          </div>
        </div>

        {/* Our Vision */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-3 border border-white/10">
          <h3 className="text-solar-gold text-xs tracking-widest2 uppercase font-semibold flex items-center gap-2">
            <span className="text-solar-gold">✦</span> Our Vision
          </h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our vision is to establish ORBIS as a trusted global technology and freelancing company recognized for innovation, quality, creativity, and meaningful collaboration. We imagine a future where every ambitious idea—whether from a growing business, a startup, or an individual creator—has access to the talent and technology needed to become reality. ORBIS seeks to build a connected ecosystem of skilled professionals who work together across disciplines, cultures, and industries to create solutions that inspire progress and open new possibilities. We are not simply focused on completing projects; we aspire to create long-term value, strengthen businesses, and shape digital experiences that remain relevant in a constantly changing world. As we grow, ORBIS will continue to explore new technologies, embrace bold thinking, and serve as a creative force that helps clients move beyond limitations and confidently enter the future.
          </p>
          <div className="bg-solar-gold/10 border-l-2 border-solar-gold p-3 rounded-r-xl italic text-solar-gold text-xs sm:text-sm font-medium">
            “Our vision is to become a global orbit of talent and innovation, turning possibilities into progress.”
          </div>
        </div>
      </div>

      {/* Stat counters */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
        {[
          { n: 1, s: "+", label: "Projects" },
          { n: 98, s: "%", label: "On-time" },
          { n: 12, s: "+", label: "Tech Stack" },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-4 rounded-xl text-center border border-white/10 hover:border-solar-gold/40 transition-colors">
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
          <span>📍</span> <span>Tiruchengode, Namakkal, Tamil Nadu, India.</span>
        </p>
        <p className="flex items-center gap-2">
          <span>✉️</span> <a href="mailto:theorbiscontact@gmail.com" className="hover:text-solar-gold transition-colors">theorbiscontact@gmail.com</a>
        </p>
        <p className="flex items-center gap-2">
          <span>📸</span> <a href="https://www.instagram.com/orbis.technologies?igsh=MXFxd2M2NTIxcTU2dw==" target="_blank" rel="noopener noreferrer" className="hover:text-solar-gold transition-colors">@orbis.technologies (Instagram)</a>
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
