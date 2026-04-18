# D&D Pack Attack Roller

A web tool for quickly rolling dice when many creatures attack simultaneously in D&D 5e — most commonly used by Druids with the *Conjure Animals* spell.

---

## What It Does

Enter your summoned creatures' stats and click **Roll Attack**. The app simulates all attack rolls at once and reports:

- Number of hits (and critical hits)
- Number of misses (and critical fails)
- Total damage dealt

### Input Fields

| Field | Description | Example |
|---|---|---|
| Creature Name | Label for the results display | `Dire Wolf` |
| Target AC | Armor Class of the enemy being attacked | `15` |
| Number of Creatures | How many are attacking | `8` |
| Advantage Count | How many have advantage on attack rolls | `8` |
| Hit Modifier | Attack bonus added to each d20 roll | `+5` |
| Damage Roll | Damage dice in standard notation | `2d6+3` |

### Dice Notation

Format: `NdS` or `NdS+B`

- `N` = number of dice, `S` = die size, `B` = flat damage bonus
- Examples: `2d6+3` (two d6 plus 3), `1d8`, `4d4+1`

---

## D&D 5e Mechanics

The roller implements standard 5e rules:

- **Hit:** d20 roll + modifier ≥ target AC
- **Critical Hit:** Natural 20 — damage dice are doubled (extra dice rolled, flat bonus added once). e.g., `2d6+3` crit = 4d6+3, not 2×(2d6+3)
- **Critical Fail:** Natural 1 — automatic miss, no damage. With advantage, both dice must show 1.
- **Advantage:** Roll two d20s, use the higher result.

---

## Common Conjure Animals Setups

| Creature | AC | Hit Mod | Damage |
|---|---|---|---|
| Dire Wolf | 14 | +5 | `2d6+3` |
| Giant Wolf Spider | 13 | +3 | `1d6+1` |
| Constrictor Snake | 12 | +4 | `1d8+2` |
| Brown Bear (claw) | 11 | +5 | `2d6+4` |
| Brown Bear (bite) | 11 | +5 | `1d8+4` |

---

## Development Setup

**Requirements:** Node.js 19+, npm 9+

**Tech stack:** Svelte 5, Vite 6, Express 4

```bash
# Install dependencies
npm install

# Start development server (hot reload, port 5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run production server (port $PORT or 8080)
npm start

# Run core logic unit tests
npm test
```

---

## Project Structure

```
src/
  App.svelte         # Main UI component (form, validation, results)
  main.js            # Svelte entry point — mounts App to #root
  pack-attack.js     # Core dice rolling logic (attackRoll, parseDice, packAttack)
  pack-attack.css    # Parchment scroll theme styling
  app.css            # Form/input/button base styling
  img/               # Scroll background image
public/
  favicon.ico        # Site favicon
  manifest.json      # PWA manifest
index.html           # Vite HTML entry template
vite.config.mjs      # Vite + Svelte build config
server.js            # Express server for production (serves /dist)
dist/                # Production build output (committed — deployed directly)
```

---

## Deployment

**Heroku:** Configured via `Procfile`. `npm start` runs Express which serves `/dist`.

**GitHub Pages:** Configured via `.github/workflows/static.yml`. Builds on push to main and deploys `dist/`.

To release a new version:
1. Bump `version` in `package.json`
2. Bump `VITE_VERSION` in `.env` to match
3. Run `npm run build`
4. Commit `/dist` and push

---

## License

GPL-3.0
