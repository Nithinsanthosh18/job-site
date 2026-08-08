"use client";

import { useOrbisStore } from "@/lib/store";
import { PLANETS } from "@/data/planets";

const SEGMENT_LIST = [
  { id: "sun", label: "Sun" },
  ...PLANETS.map((p) => ({ id: p.id, label: p.name })),
  { id: "overview", label: "Overview" },
];

export default function SolarHUD() {
  return null;
}
