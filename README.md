# Nova — startup showcase

A single-page marketing mockup for **Nova**, a fictional AI productivity startup.
Portfolio / demo piece — there is no backend, no accounts, and no real product
behind it.

## What it shows

- **Dark SaaS aesthetic** — near-black navy ground, violet accent (`#8b5cf6` /
  `#a855f7`), system sans-serif type.
- **Three.js particle hero** — a slow-drifting point cloud behind the headline
  (`three@0.160.0`, loaded from a CDN via import map).
- **Scroll-snap sections** — hero / features / pricing / footer, snapped with
  `scroll-snap-type: y proximity`.
- **Scroll-position fade** — each section's distance from the viewport centre is
  mapped (in JS) to a `--enter` custom property; the fade/slide itself lives in
  CSS. Same "scroll position → CSS variable, motion in CSS" approach throughout.
- **Feature cards** with a hover glow + lift.
- **Pricing** with one highlighted plan.
- **Footer** with placeholder social links.
- Respects `prefers-reduced-motion`: no snap, no fade, no particle spin.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Markup — four sections, particle canvas, import map |
| `styles.css` | Tokens, scroll-snap, the CSS side of the fade, all visual styling |
| `script.js`  | ES module — Three.js particle background + the scroll→`--enter` mapping |

## Running it

Needs a static file server — the ES-module import map and the Three.js CDN fetch
don't work from `file://`.

```sh
npx serve .
# or
python -m http.server 8000
```

Then open the root URL.

## Notes

- All call-to-action buttons and social links are inert (`href="#"`).
- `scroll-snap-type` is `proximity` rather than `mandatory` so touch / trackpad
  momentum scrolling isn't forced to a full-section settle. The settle speed is
  browser-controlled and not tunable in CSS, so the snap can still be tuned
  further (section count, dropping `scroll-behavior: smooth`, gating to wider
  viewports).
