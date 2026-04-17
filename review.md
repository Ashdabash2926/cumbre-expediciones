# Cumbre Expediciones — Session Log

## 2026-04-15 — Initial Build

### What Was Built
Multi-page portfolio website for a fictional Huaraz-based trekking company, **Cumbre Expediciones**. Built as a demo piece for Ash to show a mountaineering/hostel business during a Workaway volunteering trip in Peru.

### Stack
- HTML + Tailwind CDN (no build step)
- Vanilla JS
- Google Fonts (Instrument Sans + DM Sans)
- Unsplash stock imagery (real Cordillera Blanca / Huaraz photos)

### Pages (7)
1. **index.html** — Cinematic full-screen hero (Huascarán sunrise), scrolling text banner, animated stats counter, featured treks grid, "Why Cumbre" section, testimonials, CTA banner
2. **treks.html** — 8 multi-day treks with duration/difficulty filter system and expandable detail cards
3. **day-hikes.html** — 6 day hike cards with what's included/what to bring sections
4. **climbing.html** — 4 peak profiles (Pisco, Ishinca, Huascarán, Alpamayo) with mountain difficulty ratings and requirements section
5. **about.html** — Company story, 4 team member cards, certifications bar, values section
6. **gallery.html** — 15-image masonry grid with category filters (Treks/Summits/Landscapes/People) and full lightbox with keyboard + swipe navigation
7. **contact.html** — Contact form with client-side validation, WhatsApp/email/map info, 6-item FAQ accordion

### Interactive Features
- Navbar: transparent → solid with blur on scroll
- Mobile hamburger menu with animated X close
- Scroll-triggered fade-up / slide-in / scale-reveal animations (Intersection Observer)
- Tour filter system (treks page) — filter by duration + difficulty via data attributes
- Gallery category filter + masonry layout
- Image lightbox — arrow keys, escape, swipe on mobile
- Contact form validation with inline errors + success state
- FAQ accordion (single-open)
- Stats counter animation (requestAnimationFrame)
- Hero slow-zoom on page load

### Design
- **Palette**: Forest green (#1B4332) primary, alpine orange (#E86F2C) CTA accent, stone/cream neutrals
- **Typography**: Instrument Sans headings, DM Sans body
- **Visual effects**: Film grain overlay (SVG noise), glassmorphism navbar, vignette on page heroes, card image zoom on hover, parallax backgrounds, ghost buttons with backdrop-blur

### Images
All imagery is real Cordillera Blanca / Huaraz from Unsplash:
- Huascarán at sunrise (hero)
- Laguna 69 with Chacraraju
- Pastoruri Glacier / Nevado Pastoruri
- Laguna Parón turquoise waters
- Cordillera Blanca snow-capped peaks
- Mountain lake reflections
- Trekkers ascending to Laguna 69
- Aerial glacial lake views

### File Structure
```
cumbre-expediciones/
├── index.html
├── treks.html
├── day-hikes.html
├── climbing.html
├── about.html
├── gallery.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
└── review.md
```

### Notes
- Hero image was initially a Machu Picchu photo misidentified as "mountain with clouds, Peru" — swapped to Huascarán sunrise
- Gallery filter `.hidden` CSS was scoped only to `.card-grid .card` initially — fixed to also cover `.masonry-grid .gallery-item`
- No build step, no npm, no frameworks — pure static site matching Ash's existing portfolio conventions
