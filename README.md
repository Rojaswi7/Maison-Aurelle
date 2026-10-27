# Maison Aurelle

A concept digital flagship for a fictional Genevan watchmaker. It covers product thinking, interaction design and front-end craft in one shipped site.

**Live pages**

| Route | What it shows |
| --- | --- |
| `/` | A hero that assembles as you scroll, a live dial playground, a craft story with count-up stats, and a client-story carousel |
| `/collections` | Filtering with layout animation, sorting, 3D tilt cards, and a quick view driven by the URL |
| `/configure` | A 6-step configurator: live SVG preview, 3D flip to the caseback, animated pricing, autosave, share links |
| `/appointment` | A 4-step booking flow: calendar, honest availability, inline validation, review and edit, .ics export |
| `/atelier` | A horizontal timeline driven by vertical scroll, the métiers d'art, and the founder's story |
| `/case-study` | The design rationale: problem, personas, principles, decisions and trade-offs, accessibility, metrics |

## Highlights

- **Procedural SVG watch.** All 4,500 combinations render in code. The hands show your real local time, the moonphase shows tonight's moon, and the gears and balance wheel tick.
- **Motion with restraint.** Lenis smooth scroll and Framer Motion animations, all of which `prefers-reduced-motion` turns off.
- **Accessibility.** Native inputs behind every custom control, ARIA tabs with arrow keys, focus-trapped dialogs, a skip link and visible focus states.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project** and import the repo. Vercel detects Vite automatically (build: `npm run build`, output: `dist`).
3. Deploy. `vercel.json` already rewrites every route to `index.html`, so deep links like `/configure` work.

Or from the terminal: `npm i -g vercel && vercel --prod`.

## Personalise

Put your name and email in `src/data/site.js`. They appear in the footer and the case study.
