# ORBIS — Solar System Portfolio Website

A cinematic, scroll-driven 3D journey through the solar system, built for ORBIS
Freelancing Company with Next.js, React Three Fiber, GSAP ScrollTrigger, and
Lenis smooth scroll.

## What's implemented

- **Opening screen** — centered ORBIS logo, glow + 2° tilt, tagline and
  bouncing "Scroll Down" arrow that fade in after 2s.
- **Scroll-driven camera** — a single continuous flight path through 12
  keyframes: intro → Sun hero → zoom-out (with a random fading quote) → each
  of the 8 planets in turn → full solar-system overview. Driven by one GSAP
  ScrollTrigger reading Lenis's smoothed scroll position.
- **Logo transition** — the centered hero logo smoothly scales down and
  travels to a fixed top-left nav position as soon as scrolling starts, and
  stays there for the rest of the site.
- **Sun hero** — recreates the reference image: Sun large on the right,
  logo/empty space on the left, glow + corona layers, slow rotation, bloom
  post-processing.
- **All 8 planets** — textured with your provided 8K maps (downsampled to 2K
  for the web), continuously orbiting and spinning, Saturn has its ring.
  Hover → glow, scale up, name label, pointer cursor. Click → camera flies in
  and an info panel slides in from the right with the exact content from your
  brief (About/Services/Projects/Technologies/Capabilities/Support/Team/Contact).
- **Contact form** on Neptune's panel (front-end only — wire up an email/API
  provider to make it actually send).
- **Transparent nav**, **footer**, **Tailwind design tokens** matching your
  palette (pure black / deep space blue / galaxy purple / solar orange /
  golden hover), reduced-motion support.

## What's intentionally left as follow-up work

This brief describes a large, full production build (LOD, GPU instancing,
frustum culling, full SEO pass, exhaustive accessibility audit, a Leva debug
panel, real HDR environment maps, etc.). This scaffold implements the full
structure and interaction model end-to-end with working code, but the
fit-and-finish (camera framing per breakpoint, mobile performance tuning,
copy polish, real project/contact data) will need iteration with the app
actually running in a browser — something best done in an editor/dev-server
loop rather than a single one-shot generation.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build && npm run start   # production build
```

## Project structure

```
app/                  Next.js App Router entry (layout, page, globals.css)
components/
  Experience.tsx       Fixed 3D canvas + all overlay UI
  scene/                R3F scene: Sun, Planet, Starfield, CameraRig, OrbitRing
  ui/                   DOM overlay UI: logo, intro copy, navbar, info panel, etc.
data/planets.ts         All planet + section content (edit copy here)
lib/store.ts             Zustand store bridging scroll state <-> 3D scene
lib/useLenis.ts           Lenis + GSAP ScrollTrigger wiring
public/                  Your textures, backgrounds, logo, founder photos
```

## Where to go next

- Replace `public/images/orbis-logo.jpeg` with a transparent PNG cut-out of
  your logo if you have one — it'll look cleaner against the starfield.
- Tune `components/scene/CameraRig.tsx` → `SEGMENTS` for exact camera framing
  per section (numbers there are a good starting point, not final).
- Wire `components/ui/ContactForm.tsx` to a real email/API endpoint.
- Swap the placeholder project entries in `data/planets.ts` (`PROJECTS`) for
  your real case studies, with GitHub/live links.
- Consider `@react-three/drei`'s `<Html>`/`<Preload>` and texture compression
  (KTX2/Basis) for the performance targets in the original brief.
