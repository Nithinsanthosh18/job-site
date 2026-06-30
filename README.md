# Orbis — Marketing Landing Page

Dark-themed, scroll-driven 3D landing experience for Orbis freelance marketing agency.

## Stack

- **Three.js** (r160) — WebGL 3D scene with orbital ring and particle field
- **GSAP 3** + ScrollTrigger + ScrollToPlugin — scroll-driven animations
- **Vanilla JS** (ES Modules) — no framework, zero build step required for dev
- **CSS Custom Properties** — dark theme tokens, responsive layout

## Project Structure

```
orbis/
├── index.html          # Entry point
├── css/
│   └── style.css       # All styles (dark theme, layout, animations)
├── js/
│   ├── main.js         # GSAP animations, UI interactions, cursor
│   └── scene.js        # Three.js WebGL scene (scroll + mouse driven)
└── assets/
    └── orbis_logo.jpg  # Brand logo (auto-inverted for dark bg)
```

## Running Locally

**Option 1 — VS Code Live Server** (recommended)
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → Open with Live Server
3. Opens at `http://127.0.0.1:5500`

**Option 2 — Node.js serve**
```bash
npx serve .
# Open http://localhost:3000
```

**Option 3 — Python**
```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

> ⚠️ Must be served over HTTP (not `file://`) because Three.js loads as an ES Module via CDN.

## Customization

### Colors (css/style.css)
```css
:root {
  --clr-bg:      #080A0F;   /* page background */
  --clr-violet:  #7C3AED;   /* primary accent / glow */
  --clr-accent:  #A78BFA;   /* lighter violet for text */
  --clr-text:    #E8EAF0;   /* primary text */
  --clr-muted:   #8891A8;   /* secondary text */
}
```

### 3D Scene (js/scene.js)
- `particleCount` — number of background stars (default 1800)
- `orbGroup.rotation` scroll multipliers — controls how fast ring spins on scroll
- Ring radii — adjust `TorusGeometry` first parameter

### Content
- Edit copy directly in `index.html`
- Swap `assets/orbis_logo.jpg` with any image; it's CSS-inverted to white

## Production Build

No bundler is required. For production:

1. **Inline critical CSS** into `<head>` for faster first paint
2. **Host on any static host** (Netlify, Vercel, Cloudflare Pages, GitHub Pages):
   ```bash
   # Netlify drag-and-drop: just zip the orbis/ folder and upload
   # Vercel CLI:
   npx vercel
   ```
3. **Optional minification:**
   ```bash
   npx lightningcss --minify css/style.css -o css/style.min.css
   npx terser js/scene.js -o js/scene.min.js
   npx terser js/main.js  -o js/main.min.js
   # Then update index.html to reference .min files
   ```
4. **Image optimization:** convert `orbis_logo.jpg` to `.webp` for ~30% size saving
   ```bash
   npx sharp-cli -i assets/orbis_logo.jpg -o assets/orbis_logo.webp
   ```

## Accessibility

- All interactive elements have `:focus-visible` outlines
- `aria-label` on nav, sections, logo link, and mobile toggle
- `aria-hidden="true"` on decorative canvas and cursor elements
- `prefers-reduced-motion` disables all CSS animations
- GSAP animations skip in reduced-motion via the media query
- Color contrast meets WCAG AA for all text/background pairs

## Performance Notes

- Three.js loaded from jsDelivr CDN (cached across sites)
- GSAP loaded from cdnjs (same)
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` caps retina overdraw
- Particle count drops safely to 800 on mobile if you add a check: `window.innerWidth < 600 ? 800 : 1800`
- `{ passive: true }` on all scroll listeners

## Browser Support

Chrome 90+, Firefox 90+, Safari 15+, Edge 90+  
(Requires ES Modules + WebGL 1 support)
