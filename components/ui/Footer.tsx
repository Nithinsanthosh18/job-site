export default function Footer() {
  return (
    <footer className="relative z-50 bg-transparent py-8 px-4 text-center pointer-events-auto">
      {/* Small floating Oval / Pill Capsule Bar */}
      <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 bg-black/25 backdrop-blur-2xl border border-white/20 rounded-full px-8 py-3.5 shadow-[0_0_35px_rgba(0,0,0,0.6)] pointer-events-auto relative z-50">
        <span className="font-display text-lg text-gradient-gold tracking-widest font-semibold sm:border-r sm:border-white/15 sm:pr-6">
          ORBIS
        </span>

        <div className="flex items-center gap-5 text-xs text-white/70">
          <span className="hover:text-solar-gold cursor-pointer transition-colors">
            LinkedIn
          </span>
          <a
            href="https://www.instagram.com/orbis.technologies?igsh=MXFxd2M2NTIxcTU2dw=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-solar-gold cursor-pointer transition-colors pointer-events-auto relative z-50"
          >
            Instagram
          </a>
        </div>

        <span className="text-[10px] text-white/40 tracking-wider sm:border-l sm:border-white/15 sm:pl-6">
          © {new Date().getFullYear()} ORBIS
        </span>
      </div>
    </footer>
  );
}
