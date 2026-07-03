# RoomingKos Kai

Kai is a sales-conversion demo for RoomingKos. It captures a prospect's room search needs, ranks public RoomingKos catalog options, explains the match, and prepares a staff handoff brief.

Live demo: https://rk-4xf4bjkdv-yoonho-nas-projects.vercel.app

Website toggle preview: https://rk-4xf4bjkdv-yoonho-nas-projects.vercel.app/?view=site

## Demo Scope

- Conversational intake for budget, move-in timing, preferred area, stay length, lifestyle, and facilities.
- Rule-based matching over the generated public RoomingKos catalog.
- Ranked property cards, comparison view, inspection action, and lead handoff summary.
- Website toggle script for linking the main RoomingKos website to the Kai web app.
- Catalog generation from the verified building-centric public scrape: 8 named buildings and 35 individual rooming house properties.

## Local Run

```bash
npm install
npm run verify:catalog
npm run dev
```

## Data Verification

Kai reads `src/data/roomingkosCatalog.ts`, which is generated from the building-centered public archive under `RoomingKos_collected_info_2026-07-03/08_building_centric_2026-07-04`.

Run this before demoing or deploying:

```bash
npm run qa
```

The QA command verifies the current public-data shape, lead parsing, recommendation ranking, handoff generation, website toggle behavior, production build, and lint checks. The catalog check specifically covers 43 listings, 8 named buildings, 35 rooming-house properties, 12 available options, 25 waitlist options, 6 coming-soon options, source URL coverage, apply-link coverage, room-type rows, price range, and a Swanston sample match.

## RoomingKos Website Toggle

Add this script to the RoomingKos website template.

```html
<script
  src="https://rk-4xf4bjkdv-yoonho-nas-projects.vercel.app/kai-toggle.js"
  data-kai-url="https://rk-4xf4bjkdv-yoonho-nas-projects.vercel.app/?source=roomingkos-site"
  defer
></script>
```

The script adds a small Kai button and redirects visitors into the Kai consultation app with source tracking.
