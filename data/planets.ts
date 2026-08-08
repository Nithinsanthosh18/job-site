export type SectionId =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export interface PlanetDef {
  id: SectionId;
  name: string;
  navLabel: string;
  texture: string;
  model?: string;
  ring?: string;
  radius: number; // relative sphere radius
  orbitRadius: number; // distance from sun
  orbitAngle: number; // fixed orbital position angle for smooth snake travel
  orbitSpeed: number; // radians / second
  spinSpeed: number;
  tilt: number;
  color: string;
  title: string;
  tagline: string;
}

export const SUN = {
  texture: "/textures/sun_real.jpg",
  model: "/models/sun.glb",
  radius: 6,
};

export const PLANETS: PlanetDef[] = [
  {
    id: "mercury",
    name: "Mercury",
    navLabel: "About",
    texture: "/textures/mercury.jpg",
    model: "/models/mercury.glb",
    radius: 0.5,
    orbitRadius: 13,
    orbitAngle: 0.1,
    orbitSpeed: 0.09,
    spinSpeed: 0.02,
    tilt: 0.01,
    color: "#b8a99a",
    title: "About ORBIS",
    tagline: "Introduction · Mission · Vision",
  },
  {
    id: "venus",
    name: "Venus",
    navLabel: "Services",
    texture: "/textures/venus.jpg",
    model: "/models/venus.glb",
    radius: 0.85,
    orbitRadius: 18,
    orbitAngle: 0.9,
    orbitSpeed: 0.065,
    spinSpeed: -0.015,
    tilt: 3.09,
    color: "#e8c88a",
    title: "Our Services",
    tagline: "What we build, end to end",
  },
  {
    id: "earth",
    name: "Earth",
    navLabel: "Projects",
    texture: "/textures/earth.jpg",
    model: "/models/earth.glb",
    radius: 0.9,
    orbitRadius: 24,
    orbitAngle: 1.8,
    orbitSpeed: 0.05,
    spinSpeed: 0.35,
    tilt: 0.41,
    color: "#4b8cff",
    title: "Projects We Delivered",
    tagline: "Work that shipped and scaled",
  },
  {
    id: "mars",
    name: "Mars",
    navLabel: "Technologies",
    texture: "/textures/mars.jpg",
    model: "/models/mars.glb",
    radius: 0.65,
    orbitRadius: 30,
    orbitAngle: 2.7,
    orbitSpeed: 0.04,
    spinSpeed: 0.33,
    tilt: 0.44,
    color: "#c1440e",
    title: "Technologies",
    tagline: "The stack behind every build",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    navLabel: "Capabilities",
    texture: "/textures/jupiter.jpg",
    model: "/models/jupiter.glb",
    radius: 2.4,
    orbitRadius: 39,
    orbitAngle: 3.6,
    orbitSpeed: 0.022,
    spinSpeed: 0.9,
    tilt: 0.05,
    color: "#d8ae7e",
    title: "Why Choose ORBIS",
    tagline: "Capability, at scale",
  },
  {
    id: "saturn",
    name: "Saturn",
    navLabel: "Support",
    texture: "/textures/saturn.jpg",
    model: "/models/saturn.glb",
    ring: "/textures/saturn_ring.png",
    radius: 2.0,
    orbitRadius: 49,
    orbitAngle: 4.5,
    orbitSpeed: 0.016,
    spinSpeed: 0.8,
    tilt: 0.47,
    color: "#e8d3a0",
    title: "Customer Support",
    tagline: "We stay after launch day",
  },
  {
    id: "uranus",
    name: "Uranus",
    navLabel: "Team",
    texture: "/textures/uranus.jpg",
    model: "/models/uranus.glb",
    radius: 1.4,
    orbitRadius: 60,
    orbitAngle: 5.4,
    orbitSpeed: 0.012,
    spinSpeed: 0.6,
    tilt: 1.71,
    color: "#a7e5e6",
    title: "Our Team",
    tagline: "The people behind ORBIS",
  },
  {
    id: "neptune",
    name: "Neptune",
    navLabel: "Contact",
    texture: "/textures/neptune.jpg",
    model: "/models/neptune.glb",
    radius: 1.35,
    orbitRadius: 72,
    orbitAngle: 6.2,
    orbitSpeed: 0.01,
    spinSpeed: 0.58,
    tilt: 0.49,
    color: "#3b5cc4",
    title: "Contact ORBIS",
    tagline: "Let's grow together",
  },
];

export const SERVICES = [
  "Web Development",
  "AI Development",
  "Machine Learning",
  "LLM Solutions",
  "Automation",
  "Cloud",
  "API Integration",
  "Mobile Apps",
  "UI / UX Design",
  "Blockchain",
  "Cyber Security",
  "Data Analytics",
];

export const TECHNOLOGIES = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "TensorFlow",
  "PyTorch",
  "LangChain",
  "OpenAI",
  "Claude",
  "Gemini",
  "AWS",
  "Azure",
  "Firebase",
  "Flutter",
  "React Native",
  "Kotlin",
];

export const CAPABILITIES = [
  "Innovation",
  "Performance",
  "Security",
  "Scalability",
  "Creativity",
  "Research",
  "Quality",
  "Fast Delivery",
  "Affordable Pricing",
  "Professional Team",
];

export const SUPPORT = [
  "Maintenance",
  "Bug Fixes",
  "Monitoring",
  "24/7 Support",
  "Training",
  "Documentation",
  "Version Updates",
  "Feature Expansion",
];

export const FOUNDERS = [
  { name: "Lokajith T", role: "Founder", image: "/founders/founder_1.jpg" },
  {
    name: "Nithin Santhosh R",
    role: "Co-Founder",
    image: "/founders/founder_2.jpg",
  },
  {
    name: "Sunil Kumar B",
    role: "Co-Founder",
    image: "/founders/founder_3.jpg",
  },
];

export const PROJECTS = [
  {
    name: "Aurora Retail Dashboard",
    tech: "React · Node.js · PostgreSQL",
    description:
      "A real-time analytics dashboard for a multi-store retail chain, tracking sales, inventory, and staffing in one place.",
  },
  {
    name: "Nova Fraud Shield",
    tech: "Python · XGBoost · Flask",
    description:
      "A machine-learning fraud detection service for card transactions, tuned for high recall without hurting checkout speed.",
  },
  {
    name: "Signa — Sign Language Translator",
    tech: "TensorFlow · CNN + LSTM",
    description:
      "A real-time sign-to-text translator that reads gesture sequences from a webcam feed and captions them live.",
  },
];

export const QUOTES = [
  "The best code is written for people.",
  "Programming is where imagination becomes reality.",
  "Every great product begins with one idea.",
  "Dream. Code. Build.",
];
