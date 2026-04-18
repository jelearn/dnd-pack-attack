# AGENTS.md

Shared instructions for all AI coding agents (Claude Code, Copilot, Cursor, etc.) working in this repository.

## Project Overview

**dnd-pack-attack** is a single-page web app that simulates D&D 5e "pack attack" dice rolls. It is primarily used by Druids casting *Conjure Animals* to quickly calculate combined attack outcomes when many creatures attack a single target simultaneously.

Users input:
- Creature name (label only — not used in calculations)
- Target's Armor Class (AC)
- Number of creatures attacking
- How many have Advantage (roll two d20s, take higher)
- Hit modifier (attack bonus added to d20 roll)
- Damage dice notation (e.g., `2d6+3`)

The app rolls all attacks and reports: total hits, total damage dealt, critical hit count, and critical fail count.

## D&D 5e Rules Context

Understanding these mechanics is required to maintain the dice logic in `src/pack-attack.js`:

- **Attack roll:** Roll 1d20, add hit modifier. If result >= target AC, it's a hit.
- **Advantage:** Roll 2d20, use the higher result. Either die showing a hit counts as a hit.
- **Critical Hit (Crit):** Natural 20 on the d20 (before modifier). Damage dice are doubled by adding an extra set of dice rolls equal to the base dice count — the flat bonus is added only once. e.g., `2d6+3` on a crit = roll 4d6+3 total, NOT 2×(2d6+3).
- **Critical Fail:** Natural 1 on the d20. With advantage, BOTH dice must show 1 for a crit fail. Always misses, deals no damage.
- **Miss:** Attack roll + modifier < AC. No damage.
- **Hit:** Attack roll + modifier >= AC. Roll damage dice normally.

These rules are implemented in `attackRoll()` in `src/pack-attack.js`. Do not change the crit damage formula without verifying against 5e RAW.

## Repository Structure

```
src/
  App.svelte         # Main UI component — form, validation, results display
  main.js            # Svelte entry point — mounts App.svelte to #root
  pack-attack.js     # Core dice logic — attackRoll(), parseDice(), packAttack()
  pack-attack.css    # D&D parchment scroll theme styling
  app.css            # Form input/button/error base styling
  img/               # Scroll background image (scroll-png-26394.png)
public/
  favicon.ico        # Site favicon (copied to dist/ on build)
  manifest.json      # PWA manifest
index.html           # Vite HTML entry template (root level)
vite.config.mjs      # Vite + Svelte build config (.mjs — ESM required by the Svelte plugin)
server.js            # Express server (production — serves /dist)
dist/                # Production build output (committed to repo)
.env                 # VITE_VERSION env var
Procfile             # Heroku deployment config
```

## Technology Stack

- **Frontend:** Svelte 5 (runes API: `$state`, `$derived`, `$effect`)
- **Build:** Vite 6 with `@sveltejs/vite-plugin-svelte` (requires `"type": "module"` in package.json)
- **Backend:** Express 4 (static file serving only — no API)
- **Runtime:** Node.js ^19.1.0, npm ^9.1.2
- **Hosting:** Heroku (primary), GitHub Pages (secondary via `.github/workflows/static.yml`)

## Dice Notation Format

The app accepts dice strings in the format: `NdS` or `NdS+B`
- `N` = number of dice (integer ≥ 1)
- `d` = literal letter d
- `S` = die size (4, 6, 8, 10, 12, 20, etc.)
- `B` = optional flat bonus (integer ≥ 0)

Examples: `2d6+3`, `1d4`, `8d8+5`

Validation regex (in `src/App.svelte` `validate()` function): `^[0-9]+d[0-9]+(\+[0-9]+)?$`
Parser: `parseDice()` in `src/pack-attack.js`

## Development Commands

```bash
npm run dev          # Vite dev server with hot reload (port 5173)
npm run build        # Production build output to /dist
npm run preview      # Preview the production build locally
npm start            # Express server serving /dist (port $PORT or 8080)
npm test             # Run pack-attack.js unit tests in Node
```

## Testing

- Unit tests for dice logic live at the bottom of `src/pack-attack.js`, using Node's built-in `assert`. They run automatically when the module is loaded.
- `npm test` runs the file directly in Node to verify these tests pass.
- No Svelte component tests exist. New UI logic should be covered by unit tests where possible.
- Before shipping any change to `pack-attack.js`, run `npm test` to confirm tests still pass.

## Code Conventions

- **Separation of concerns:** Dice logic (`pack-attack.js`) must remain a framework-agnostic ES module. Keep all D&D mechanics there; keep all UI in `App.svelte`.
- **Svelte 5 runes:** Use `$state` for mutable reactive values, `$derived` for computed values, `$effect` for side effects. Do not use legacy Svelte 4 `$:` reactive declarations.
- **`packAttack()` return signature:** Returns `[hit_count, total_damage, crit_fail_count, crit_count]` — preserve this.
- **Validation:** The `validate()` function in `App.svelte` mirrors the original Yup schema. Keep validation messages consistent with the original wording.
- **CSS:** Global classes from `app.css` and `pack-attack.css` are imported in `main.js`. Svelte component-scoped styles are acceptable for component-specific overrides.
- **CSS naming:** BEM-adjacent — `.scroll_outer`, `.scroll_inner`, `.scroll_contents`, `.scroll_action`, `.input-group`, `.text-input`.

## Known Issues (Do Not Duplicate Work)

- `src/img/scroll-png-26394.png` (941KB) is oversized — optimize if working on performance.
- No mobile-responsive breakpoints in `pack-attack.css` — scroll container uses a fixed 790px height tied to the background image dimensions.
- No Svelte component tests exist.

## Deployment Notes

- The `/dist` directory is committed to the repo and deployed directly.
- Always run `npm run build` and commit the updated `/dist` before pushing a release.
- Heroku: `Procfile` → `npm start` → `server.js` (serves `/dist`).
- GitHub Pages: `.github/workflows/static.yml` builds and deploys on push to main.
- Version is set in `.env` as `VITE_VERSION` and accessed in `App.svelte` via `import.meta.env.VITE_VERSION`.
- When releasing: bump `version` in `package.json`, bump `VITE_VERSION` in `.env`, rebuild.

## What NOT to Change Without Discussion

- The crit damage formula in `attackRoll()` — it matches 5e RAW (double dice, not double total).
- The return signature of `packAttack()` — `App.svelte` destructures all four values.
- The validation regex for dice notation — changes may silently break input parsing.
- Deployment infrastructure (`Procfile`, `server.js`, `static.yml`) without understanding both deployment targets.

## AI Contributions

General guidance:

- Before generating any code, plan your work first and make sure you review the current contents of the workspace for
  any changes that might have been made outside your context.
- Commits to any workspace code should be done incrementally for specific tasks or features.
- When possible, repeatable tests should be added to the code base to confirm key design features still work
  on an ongoing basis.
    - When not possible, they should be noted in the TODO to address manually.
- When an agent is writing the commit, it should follow the pattern: `${MODEL_NAME} <no-reply@${MODEL_AUTHOR_DOMAIN}>`
    - Where `MODEL_NAME` is the full name and version of the model, and `MODEL_AUTHOR_DOMAIN` is the domain name
      of the model's author.
    - For example: `Claude Sonnet 4.6 <noreply@anthropic.com>`
    - This should be done using the `--author` argument to `git commit`.
        - For example: `git commit --author 'Claude Sonnet 4.6 <noreply@anthropic.com>'`
- Changes should be made with instructive comments explaining why they are required so that the project is as
  instructive as possible.
