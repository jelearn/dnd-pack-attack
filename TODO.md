# TODO

## Open Tasks

### Critical Hit Damage Method — Add Player Option

**File:** `src/pack-attack.js` — `attackRoll()` function (crit damage block, ~line 53)

**Background:**  
The current implementation adds the extra crit dice at their **maximum value** rather than re-rolling them. For example, a `2d6+3` critical hit always adds 12 (max of 2d6) + the rolled 2d6 + 3, rather than rolling 4d6+3.

This is a deliberate player-favourable deviation from 5e RAW, which states you should roll all damage dice twice (both sets random).

**Task:**  
Add a configuration option (e.g., a checkbox or toggle in the UI) that lets the user choose between:

1. **Current behaviour (Max Dice):** Extra crit dice are always maximum value — faster, more predictable, slightly higher average damage.
2. **5e RAW (Roll Dice):** Extra crit dice are randomly re-rolled — faithful to the rules, slightly lower average damage.

**Implementation notes:**
- The `attackRoll()` function in `pack-attack.js` would need a new parameter (e.g., `crit_method = 'max'`) defaulting to the current behaviour so nothing breaks.
- The UI toggle should be added to `src/App.svelte` alongside the existing form fields and passed through `packAttack()` → `attackRoll()`.
- The `packAttack()` function signature would need the new option added to its `args` object.
- Default should remain `max` to preserve existing behaviour for users who don't change it.
- Update `AGENTS.md` crit hit documentation once implemented.
