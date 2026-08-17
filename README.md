# Ava Dermatology — Premium Website

A high-end, immersive single-page website for a modern dermatology clinic.
Pure static site — **no build step, no frameworks, no external asset dependencies**.
Works offline (fonts gracefully fall back to system serif/sans if the CDN is unreachable).

## Run / Preview

You already have everything — it's plain HTML/CSS/JS. Open `index.html` in any browser.

For full JavaScript + WebGL behavior, serve it over `http://` (some browsers restrict
modules/features on `file://`). A tiny PowerShell static server is included:

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File server.ps1
```

Then open http://localhost:8791/ . (Stop it by closing the PowerShell window.)

## File structure

```
ava-dermatology/
├─ index.html          # semantic markup, SEO/OG/JSON-LD, all sections
├─ css/styles.css      # design system: light + dark themes, layout, motion
├─ js/data.js          # ← EDIT THIS: content + configuration (WhatsApp, etc.)
├─ js/hero3d.js        # self-contained raw-WebGL raymarched hero centerpiece
├─ js/main.js          # theme, nav, modals, carousel, FAQ, form, interactions
├─ assets/             # favicon.svg, og-image.svg (self-contained SVG)
│  └─ img/             # premium SVG art: about, doctor, serum, texture, before, after
│                      #   (self-contained placeholders — swap for real photography)
└─ server.ps1          # optional local static server (Windows/PowerShell)
```

## Configure before publishing

Everything clinic-specific is a **clearly-marked placeholder**. Search for `[ ... ]`
brackets in `index.html` and replace them:

1. **WhatsApp number** — `js/data.js` → `AVA_CONFIG.WHATSAPP_NUMBER`
   (international format, digits only, e.g. `"15551234567"`).
   Until set, the WhatsApp buttons show a reminder toast instead of opening a broken link.
2. **Contact details** — location is set to **Houston, TX 77001**; the street address,
   phone, email and WhatsApp number remain `[ placeholders ]` in `index.html` / `js/data.js`.
3. **Images** — the visuals in `assets/img/` (Hero chips, About, Doctor, Before/After) and the
   generated treatment thumbnails are premium, self-contained **SVG art placeholders**.
   Replace any with real photography by swapping the file (keep the name) or setting the
   `<img>`'s `src`. Nothing points to an external host, so nothing can break.
3. **Doctor** — name, qualifications, bio, portrait image (Doctor section).
4. **Results / Before & After** — replace placeholder cards with your own *consented* photos.
5. **Testimonials** — `js/data.js` → `AVA_REVIEWS` (replace sample placeholders with real, consented reviews).
6. **Treatments & FAQ copy** — `js/data.js` (`AVA_TREATMENTS`, `AVA_FAQ`).
7. **SEO/URLs** — update `og:url`, canonical, and JSON-LD address in `index.html`.
8. **Booking form** — currently shows a client-side confirmation. Wire the submit
   handler in `js/main.js` to your booking backend or email service.
9. **Maps** — replace the map placeholder with a real Google Maps embed.
10. **Social / legal links** — footer social + Privacy/Terms are placeholders.

## Design & feature notes

- **Themes**: light (white / pearl / soft blue) and a deep-charcoal dark theme.
  Toggle in the nav; preference is saved to `localStorage` and respects the OS
  setting on first visit. Smooth animated transition.
- **3D hero**: a raymarched WebGL "skin orb" with soft studio lighting, subsurface
  glow, fresnel rim light, ambient particles, slow float and mouse parallax.
  Positions responsively (right on desktop, upper area on mobile). Falls back to a
  CSS gradient if WebGL is unavailable, and pauses when off-screen or the tab is hidden.
- **Motion**: ambient orbs, gentle parallax, scroll reveals, magnetic buttons,
  card tilt, smooth carousel/accordion. Fully honors `prefers-reduced-motion`.
- **Accessibility**: semantic HTML, skip link, keyboard-operable nav/modal/FAQ,
  visible focus states, labeled + validated form, ARIA live regions, alt/aria text.
- **Performance**: capped device-pixel-ratio, ~45fps render cap, IntersectionObserver
  pausing, lazy per-section reveals, no heavy libraries.

## Medical-content integrity

This site intentionally makes **no** unsupported medical claims, invented credentials,
awards, statistics, guaranteed outcomes, or fabricated reviews. Results language notes
that outcomes vary by individual. Keep it that way when replacing placeholders.
