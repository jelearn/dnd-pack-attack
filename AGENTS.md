# AGENTS.md

Shared instructions for all AI coding agents (Claude Code, Copilot, Cursor, etc.) working in this repository.

See [README.md](./README.md) for project description, setup commands, and deployment steps.  
See [TODO.md](./TODO.md) for known issues and planned work — check before starting any task.

---

## D&D 5e Rules Context

Understanding these mechanics is required to maintain `src/pack-attack.js`:

- **Attack roll:** Roll 1d20 + hit modifier. If result >= target AC, it's a hit.
- **Advantage:** Roll 2d20, use the higher. Either die hitting counts as a hit.
- **Critical Hit:** Natural 20 (before modifier). The extra crit dice are added at their **maximum value** (not randomly re-rolled) — flat bonus added once. e.g., `2d6+3` crit = rolled 2d6 + 12 (max of 2d6) + 3. This deviates from 5e RAW intentionally (player-favourable). See TODO.md for the planned option to toggle this.
- **Critical Fail:** Natural 1. With advantage, BOTH dice must show 1. Always misses, no damage.
- **Miss:** Attack + modifier < AC. No damage.

## Repository Structure

```
src/
  App.svelte         # UI component — form, validation, results display
  main.js            # Svelte entry point — mounts App.svelte to #root
  pack-attack.js     # Core dice logic — attackRoll(), parseDice(), packAttack()
  pack-attack.css    # D&D parchment scroll theme styling
  app.css            # Form input/button/error base styling
  img/               # Scroll background image (scroll-png-26394.png, 941KB)
public/
  favicon.ico        # Copied to dist/ on build
  manifest.json      # PWA manifest
index.html           # Vite HTML entry template (root level)
vite.config.js       # Vite + Svelte build config
server.js            # Express server (production — serves /dist)
dist/                # Production build output (committed to repo)
.env                 # VITE_VERSION env var
Procfile             # Heroku deployment config
```

## Technology Stack

- **Frontend:** Svelte 5 (runes API: `$state`, `$derived`, `$effect`)
- **Build:** Vite 6 with `@sveltejs/vite-plugin-svelte`
- **Backend:** Express 4 (static file serving only — no API)
- **Runtime:** Node.js >=18.0.0, npm >=9.1.2
- **Hosting:** Heroku (primary), GitHub Pages (secondary via `.github/workflows/static.yml`)

## Dice Notation

Format: `NdS` or `NdS+B` (e.g., `2d6+3`, `1d8`). See README.md for full description.

Validation regex (in `App.svelte` `validate()`): `^[0-9]+d[0-9]+(\+[0-9]+)?$`  
Parser: `parseDice()` in `src/pack-attack.js`

## Testing

- Unit tests live at the bottom of `src/pack-attack.js` using Node's built-in `assert`. They run on module load.
- `npm test` runs the file directly in Node — always run this before committing changes to `pack-attack.js`.
- No Svelte component tests exist. New UI logic should be covered by unit tests in `pack-attack.js` where possible; otherwise note in TODO.md.

## Code Conventions

- **Separation of concerns:** `pack-attack.js` must remain a framework-agnostic ES module. All D&D mechanics stay there; all UI stays in `App.svelte`. Never import Svelte APIs into `pack-attack.js`.
- **Svelte 5 runes:** Use `$state` for mutable values, `$derived` for computed values, `$effect` for side effects. Do not use legacy Svelte 4 `$:` reactive declarations.
- **`packAttack()` return signature:** `[hit_count, total_damage, crit_fail_count, crit_count]` — preserve this; `App.svelte` destructures all four values.
- **CSS:** `app.css` and `pack-attack.css` are imported globally in `main.js`. Svelte component-scoped styles are acceptable for component-specific additions only.

## Known Issues

- `src/img/scroll-png-26394.png` (941KB) is oversized — optimize if working on performance.
- Scroll container in `pack-attack.css` uses a fixed 790px height — not mobile-responsive.
- No Svelte component tests exist.

## What NOT to Change Without Discussion

- **Crit damage formula** in `attackRoll()` — uses max dice (not a roll). Intentional. See TODO.md before touching.
- **`packAttack()` return signature** — callers destructure all four values.
- **Validation regex** for dice notation — changes may silently break input parsing.
- **Deployment infrastructure** (`Procfile`, `server.js`, `static.yml`) — two deployment targets; understand both before changing either.

## AI Contributions

- Before generating any code, plan your work first and make sure you review the
  current contents of the workspace for any changes that might have been made outside
  your context.
- Commits to any workspace code should be done incrementally for specific tasks or
  features.
- When possible, repeatable tests should be added to the code base to confirm
  key design features still work on an ongoing basis.
    - When not possible, they should be noted in the TODO to address manually.
- When an agent is writing the commit, it should follow the pattern:
    - `${MODEL_NAME} <no-reply@${MODEL_AUTHOR_DOMAIN}>`
    - Where:
        - `MODEL_NAME` is the full name and version of the model.
        - `MODEL_AUTHOR_DOMAIN` is the domain name of the model's author.
    - For example: `Claude Sonnet 4.6 <noreply@anthropic.com>`
    - This should be done using the `--author` argument to `git commit`.
        - For example: `git commit --author 'Claude Sonnet 4.6 <noreply@anthropic.com>'`
- Changes should be made with instructive comments explaining why they are
  required so that the project is as instructive as possible.

