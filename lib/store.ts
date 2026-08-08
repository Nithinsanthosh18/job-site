import { create } from "zustand";
import { SectionId } from "@/data/planets";

interface OrbisState {
  progress: number; // 0..1 across the whole scroll journey
  activeSection: SectionId | "sun" | "intro" | "overview";
  hoveredPlanet: SectionId | null;
  panelOpen: boolean;
  introDone: boolean;
  setProgress: (p: number) => void;
  setActiveSection: (s: OrbisState["activeSection"]) => void;
  setHoveredPlanet: (p: SectionId | null) => void;
  setPanelOpen: (v: boolean) => void;
  setIntroDone: (v: boolean) => void;
}

export const useOrbisStore = create<OrbisState>((set) => ({
  progress: 0,
  activeSection: "intro",
  hoveredPlanet: null,
  panelOpen: false,
  introDone: false,
  setProgress: (p) => set({ progress: p }),
  // When scrolling/moving to another planet, automatically close the previous planet's details
  setActiveSection: (s) =>
    set((state) => ({
      activeSection: s,
      panelOpen: state.activeSection !== s ? false : state.panelOpen,
    })),
  setHoveredPlanet: (p) => set({ hoveredPlanet: p }),
  setPanelOpen: (v) => set({ panelOpen: v }),
  setIntroDone: (v) => set({ introDone: v }),
}));
