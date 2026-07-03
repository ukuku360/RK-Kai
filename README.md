# RoomingKos Kai

Kai is a sales-conversion demo for RoomingKos. It captures a prospect's room search needs, ranks mock RoomingKos listings, explains the match, and prepares a staff handoff brief.

## Demo Scope

- Conversational intake for budget, move-in timing, preferred area, stay length, lifestyle, and facilities.
- Rule-based property matching with AI-agent-style explanations.
- Ranked property cards, comparison view, inspection action, and lead handoff summary.
- Website toggle script for linking the main RoomingKos website to the Kai web app.

## Local Run

```bash
npm install
npm run dev
```

## RoomingKos Website Toggle

Add this script to the RoomingKos website template. Replace the URL with the final Kai deployment URL.

```html
<script
  src="https://YOUR-KAI-DEPLOYMENT.vercel.app/kai-toggle.js"
  data-kai-url="https://YOUR-KAI-DEPLOYMENT.vercel.app/?source=roomingkos-site"
  defer
></script>
```

The script adds a small Kai button and redirects visitors into the Kai consultation app with source tracking.
