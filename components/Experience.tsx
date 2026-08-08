"use client";

import dynamic from "next/dynamic";
import Navbar from "./ui/Navbar";
import InfoPanel from "./ui/InfoPanel";
import HeroLogoSequence from "./ui/HeroLogoSequence";
import PlanetFocusCard from "./ui/PlanetFocusCard";
import SolarHUD from "./ui/SolarHUD";

// The R3F canvas touches window/WebGL — keep it client-only.
const SceneCanvas = dynamic(() => import("./scene/SceneCanvas"), {
  ssr: false,
});

export default function Experience() {
  return (
    <div className="fixed inset-0 z-0 bg-[#030308] overflow-hidden">
      {/* Exact cosmic sky background image — no filters or overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/backgrounds/milkyway.jpg"
          alt="Cosmic Sky"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 3D WebGL Canvas rendered transparently on top */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <SceneCanvas />
      </div>

      <Navbar />
      <HeroLogoSequence />
      <PlanetFocusCard />
      <SolarHUD />
      <InfoPanel />
    </div>
  );
}
