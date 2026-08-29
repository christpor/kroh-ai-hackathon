# 🎬 RECREATE PROMPT: KROH (ក្រោះ) — Full-Bleed Video Landing Page
> **Skill Standard:** `/web-vibe` v6.2 (Elite Site Recreation Engine)  
> **Aesthetic:** Single-Viewport Cinematic Black `#000` + Full-Bleed CloudFront Video Loop + Dot-Matrix Display Typography (`BubbledotICG-FinePos`) + Inter UI + Frosted Glass Floating Pills + Counting Stats Footer.  
> **Output Target:** `index.html` + `styles.css` + `main.js` (Zero Frameworks, Pure Native HTML5/CSS3/Vanilla JS, Sub-10ms Paint).  

---

## 🎯 THE 1-SHOT MASTER PROMPT (COPY-PASTE FOR HACKATHONS)

```markdown
Rebuild this as a single-viewport, full-bleed video-background landing page for "KROH (ក្រោះ) — The Autonomous Anti-Scam Shield for Cambodia" using static HTML + CSS + vanilla JS (zero frameworks, zero build tools). Match the design system exactly.

### File Structure:
- index.html
- styles.css
- main.js
- assets/logo.webp (or SVG shield mark)

### Document Title:
`KROH (ក្រោះ) — Intelligence Designed To Protect`

### Core Theme & Canvas:
- Body: Pure black `#000000`, `overflow: hidden`, height `100vh` / `100dvh`, antialiased text.
- Font Stack: `Inter` for UI (400, 500, 600) + `BubbledotICG-FinePos` (retro dot-matrix display) for headlines, numbers & stat symbols.

---

### 1. Full-Viewport Ambient Video Background (Exact CDN)
Full-viewport cover video positioned behind all UI:
```html
<div class="bg">
  <video class="bg-video" autoplay muted loop playsinline>
    <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4" />
  </video>
  <div class="bg-overlay"></div>
</div>
```
- Video CSS: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; z-index: 0;`
- Parent `.bg`: `position: absolute; inset: 0; background: #000; overflow: hidden;`
- Subtle vignette overlay: `background: radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);`

---

### 2. Fonts & External CDN Links
```html
<!-- Inter UI Font -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- BubbledotICG-FinePos (Retro Dot-Matrix Display) -->
<link href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos" rel="stylesheet" />

<!-- Font Awesome 6.5.2 Brands & Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
```

---

### 3. CSS Variables & Design Tokens
```css
:root {
  --bg: #000000;
  --text: #ffffff;
  --muted: #8e8e8e;
  --nav-text: #2e2e2e;
  --pill-dark: #28282a;
  --sign-in-text: #c8c8c8;
  --nav-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
  --trust-bg: #28282a;
  --trust-border: rgba(255, 255, 255, 0.4);
  --trust-text: #c4c2c3;
  --emerald: #059669;
  --font-sans: "Inter", "Kantumruy Pro", -apple-system, sans-serif;
  --font-display: "BubbledotICG-FinePos", "Geist Pixel Circle", monospace;
}
```

---

### 4. Layout Composition (One Single Viewport, 3 Vertical Zones)
`.page`: `display: flex; flex-direction: column; justify-content: space-between; align-items: center; min-height: 100vh; min-height: 100dvh; padding: clamp(16px, 2.4vh, 28px) clamp(14px, 3vw, 32px); overflow: hidden; position: relative; z-index: 1;`

#### Zone A: Floating Header (Top, max-width: 760px)
- **Circular Logo Button:** 44×44px, white background `#fff`, border-radius 50%, soft shadow `--nav-shadow`. Contains a 72% scaled shield icon. Hover: `scale(1.05)`.
- **Center Nav Pill:** White `#fff` pill (height 46px, max-width 440px, radius 999px). Links: **Home** (active, with 3 black dots underneath), **Shield Bot**, **Threat Radar**, **Docs**. Color `#2e2e2e`, Inter 500, size 14px.
- **Action Pill:** Dark `#28282a` pill with text `#c8c8c8` (*"Launch Bot" / "Sign in"*). Hover: bg `#323234`, text `#fff`, `translateY(-1px)`.
- **Entrance Animation:** `slideDown 0.7s cubic-bezier(0.22, 1, 0.36, 1) both`.

#### Zone B: Hero Section (Center, max-width: 920px, text-center)
1. **Trust Avatar Row (“Protected 17M+ Citizens • MPTC Aligned”):**
   - Inline flex, `--trust-size: clamp(36px, 4.5vw, 42px)`.
   - Three overlapping dark padded rings (border `1px solid rgba(255,255,255,0.4)`), each with an inner white circular disk containing a brand icon:
     1. `fa-brands fa-telegram` (Telegram Bot)
     2. `fa-solid fa-shield-halved` (National Defense)
     3. `fa-solid fa-building-columns` (Bank Security)
   - Overlapped by a dark trust pill (`#28282a`, radius 999) with text: `Protected 25,000+ Scans • National Shield`.
2. **Two-Line Retro Dot-Matrix Headline:**
   ```
   INTELLIGENCE
   DESIGNED TO PROTECT
   ```
   - Font: `BubbledotICG-FinePos`, solid white, `clamp(28px, 6.2vw, 76px)`, letter-spacing `-0.04em`, line-height 1.1.
   - Staggered line fade entrance (`line1: 0.12s`, `line2: 0.3s`).
3. **Subhead (High-Contrast White/Silver):**
   - Text: `Real-time autonomous defense against phishing links, voice scams, and fraudulent APKs across Cambodia in sub-300ms.`
   - Font size `15.5px`, color `#d0d0d0`, opacity `0.85`, max-width `540px`.
4. **Glow CTA Button:**
   - Text: `⚡ Protect Telegram Free` (or `Get Started`)
   - White pill, black text, Inter 600, padding `12px 28px`, radius 999.
   - White glow box-shadow: `0 0 0 1px rgba(255,255,255,0.15), 0 0 22px rgba(255,255,255,0.32), 0 0 44px rgba(255,255,255,0.12)`.
   - Hover: `translateY(-2px) scale(1.02)` with heightened luminescence.

#### Zone C: Animated Stats Footer (Bottom, max-width: 920px, 4 Columns)
Grid of 4 counting stats cards with retro dot-matrix glyphs:
1. Glyph `<` | Target: `200` | Suffix: `ms` | Decimals: `0` | Label: `Inference Triage`
2. Glyph `%` | Target: `99.9` | Suffix: `%` | Decimals: `1` | Label: `Detection Accuracy`
3. Glyph `*` | Target: `24` | Suffix: `/7` | Decimals: `0` | Label: `Autonomous Defense`
4. Glyph `#` | Target: `17` | Suffix: `M` | Decimals: `0` | Label: `Citizens Shielded`

- JavaScript count-up animation with `easeOutCubic`, duration `1600ms`, triggered via `IntersectionObserver`.

---

### 5. Mobile Navigation & Responsive Rules (≤720px)
- Desktop nav & sign-in hide.
- Header becomes `space-between`: 44×44px white logo left, 44×44px dark circular hamburger right (`#28282a` with 3 white bars).
- When hamburger clicked: transforms into white circle with black X, opens a full-screen blurred backdrop (`rgba(0,0,0,0.65)`, backdrop-filter `blur(8px)`), revealing a floating rounded white card (`radius: 28px`) with staggered navigation links.
- Stats grid transforms into 2×2 layout.
- Prevent all horizontal scrollbars (`overflow-x: hidden`).
```

---

## 🛠️ Step-by-Step Implementation Files
All production files are generated below in `/home/christ/projects/kroh-video-landing/`:
- `index.html` (Complete semantic HTML)
- `styles.css` (Ultra-fast responsive CSS with clamp scales)
- `main.js` (IntersectionObserver count-up + mobile hamburger controller)
