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

```bash
# Install dependencies
npm install

# Start development server (hot reload, port 3000)
npm run start-dev

# Build for production
npm run build

# Run production server (port $PORT or 8080)
npm start
```

---

## Project Structure

```
src/
  pack-attack.js     # Core dice rolling logic (attackRoll, parseDice, packAttack)
  index.js           # React UI and Formik form
  pack-attack.css    # Parchment scroll theme styling
  formik.css         # Form/input styling
public/
  index.html         # HTML template
server.js            # Express server for production
build/               # Pre-built bundle (committed — deployed directly)
```

---

## Deployment

**Heroku:** Configured via `Procfile`. `npm start` runs Express which serves `/build`.

**GitHub Pages:** Configured via `.github/workflows/static.yml`. Builds and deploys static files on push to main.

To release a new version:
1. Bump `REACT_APP_VERSION` in `.env`
2. Run `npm run build`
3. Commit `/build` and push

---

## License

GPL-3.0
