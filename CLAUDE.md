# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repo is **pre-implementation**. It currently contains only:
- `specs/specs.txt` — the authoritative product spec (read it before any code work)
- `reference/BRes140146.pdf` — *Relaciones y cartas de Cristóbal Colón* (Navarrete), the primary historical source the simulator must cite
- `reference/*.url` — pointer to the Archive.org copy of the same source

There is no `index.html` yet, no build system, no tests, and no package manager. The deliverable is a single self-contained HTML file produced according to `specs/specs.txt`.

## What is being built

A historically-rigorous, single-file HTML5 simulator of Columbus's 1492 voyage. Hard architectural constraints from the spec that drive every decision:

- **One file, no local assets.** Everything (Three.js, Tailwind, Leaflet/Mapbox, OrbitControls, custom shaders) ships in a single `index.html` loaded entirely from public CDNs. Do not introduce a bundler, npm, or local asset files unless the user explicitly changes this constraint.
- **Source-traceability is non-negotiable.** Every crew name, coordinate, date, weather event, and toponym must carry a `source` field (or equivalent inline metadata attribute) pointing to an authoritative open-source historical reference — primarily the *Diario de a bordo*, the Navarrete collection in `reference/`, or the *Archivo General de Indias*. Treat untraceable data as a bug.
- **No placeholders.** Spec explicitly forbids `// TODO`, truncated functions, or stub data. If a section can't be fully implemented in one pass, flag it to the user rather than committing a stub.

## Architectural pillars

The spec defines five interlocking subsystems. Changes to one usually ripple into others — keep this map in mind:

1. **Dual-layer cartography** (left half of screen). Layer A = 15th-century parchment aesthetic with period toponyms; Layer B = modern satellite/vector. A user-controlled opacity slider crossfades them. Implemented with Leaflet / Mapbox / OpenLayers via CDN.
2. **Coordinate Display Matrix** — four simultaneous readouts: (a) Columbus's dead-reckoning *estima*, (b) 1492 magnetic coordinates using a period geomagnetic model (gufm1 or equivalent), (c) modern magnetic coordinates computed for **today = 2026-05-16** (the spec hardcodes this date), (d) WGS84 GPS. The magnetic-declination functions are the math core; the rest of the HUD reads from them.
3. **Historical engine** — full first-voyage crew roster, scripted logbook events keyed to real dates starting **3 August 1492**, and first-person role switching that swaps the entire UI perspective per role (Columbus → charts; helmsman → rigging stress; cooper → rations).
4. **Three.js nautical simulator** (right half of screen). Custom Gerstner/trochoidal wave shader on a high-density plane; the vessel's pitch/roll/yaw/heave matrix is mathematically derived from wave height and slope at the ship's position — they are not independent animations. Each sail (Trinquete, Mayor, Gavia, Mezana, Cebadera) is its own geometry with furl/unfurl state, and ship speed is computed from wind angle vs. sail configuration.
5. **Period instrument HUD** — interactive astrolabe, quadrant, compass rose (with 1492 deviation baked in), ampolleta. Plus telemetry: wind (knots/Beaufort), speed-through-water vs. speed-over-ground, *abatimiento*, *deriva*, rigging strain, hull integrity.

## Code structure (single file)

The spec mandates this top-level JS organization inside `index.html`:

1. Historical datasets as JSON literals with `source` fields (`CREW_DATABASE`, `HISTORICAL_LOGBOOK`, …).
2. Pure math functions for geomagnetic/coordinate models (`calculate1492MagneticDeclination`, `calculate2026MagneticDeclination`).
3. Three.js scene + Gerstner shader definitions.
4. A `SimulationEngine` class owning the tick loop — `constructor()` wires up maps, scene, and DOM listeners; `update(deltaTime)` runs physics → wave displacement → telemetry → UI sync in that order.
5. `DOMContentLoaded` instantiates `window.App = new SimulationEngine()`.

The layout is a single flex row: `#map-container` (50% width, 2D dual map) on the left, `#canvas-container` (50% width, Three.js + HUD overlay) on the right. Tailwind utility classes only — no separate stylesheet.

## Running and "building"

There is no build step. To preview work, open `index.html` directly in a modern browser (Chromium-based recommended for shader debugging). There are no lint or test commands defined; if the user requests them, propose a setup before adding one.

## Working conventions specific to this project

- The spec hardcodes **2026-05-16** as "today" for the modern-magnetic-coordinate calculation. Don't replace it with `new Date()` — it's a fixed product requirement.
- Voyage start is **3 August 1492** (departure from Palos). Time controls are 1× / 10× / 100×.
- Spanish nautical terminology in the spec (*aparejo*, *abatimiento*, *deriva*, *ampolleta*, *estima*) is intentional and should be preserved in UI labels and identifiers where it conveys meaning the English term loses.
- When adding historical data, cite the source inline. If you can't find a source, ask the user — don't invent names, dates, or coordinates.
