import * as THREE from "three";
import { SectionId } from "@/data/planets";

export const planetPositions: Record<string, THREE.Vector3> = {};

export function getPlanetPosition(id: SectionId): THREE.Vector3 {
  if (!planetPositions[id]) planetPositions[id] = new THREE.Vector3();
  return planetPositions[id];
}
