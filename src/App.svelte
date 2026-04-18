<script>
  import { packAttack } from './pack-attack.js';

  const VERSION = import.meta.env.VITE_VERSION ?? '';

  const defaults = {
    name: 'Dire Wolves',
    ac: '15',
    cnt: '2',
    adv_cnt: '2',
    hit_mod: '5',
    dice: '2d6+3'
  };

  let values = $state({ ...defaults });
  let touched = $state({});
  let attackHistory = $state([]);

  // Mirrors the Yup validation schema from the original React implementation
  const errors = $derived(validate(values));

  function validate(v) {
    const e = {};
    if (!v.name || v.name.length < 2) e.name = "C'mon, your name is longer than that";
    if (v.ac === '' || Number(v.ac) < 0) e.ac = "C'mon, your target is tougher than that";
    if (v.cnt === '' || Number(v.cnt) < 1) e.cnt = 'Need at least one creature to attack';
    if (v.adv_cnt !== '' && Number(v.adv_cnt) < 0) e.adv_cnt = "Can't have less than zero creatures with advantage";
    if (!v.dice || !/^[0-9]+d[0-9]+(\+[0-9]+)?$/.test(v.dice)) e.dice = 'Must match dice roll pattern (e.g. 2d4+1)';
    return e;
  }

  const isValid = $derived(Object.keys(errors).length === 0);
  const dirty = $derived(JSON.stringify(values) !== JSON.stringify(defaults));

  function handleSubmit(e) {
    e.preventDefault();
    touched = Object.fromEntries(Object.keys(values).map(k => [k, true]));
    if (!isValid) return;

    const result = packAttack({
      name: values.name,
      ac: values.ac,
      cnt: values.cnt,
      adv_cnt: values.adv_cnt,
      hit_mod: values.hit_mod,
      dice: values.dice
    });

    attackHistory = [
      `${result[0]} ${values.name} hit for ${result[1]} damage, with ${result[2]} critical failures and ${result[3]} critical successes.`,
      ...attackHistory
    ];
  }

  function handleReset() {
    values = { ...defaults };
    touched = {};
  }

  function fieldClass(name) {
    return touched[name] && errors[name] ? 'input-group animated shake error' : 'input-group';
  }
</script>

<div class="app">
  <div class="title">
    <h1>D&D Pack Attack Roller{VERSION ? ` (${VERSION})` : ''}</h1>
    Using the conjure animals spell and having them attack all at the same time?
    This form helps you roll their attacks, criticals, damage, and misses all
    at once to save you (and your DM) time.
  </div>

  <div class="attack_form">
    <form onsubmit={handleSubmit}>
      <div class="scroll_outer">
        <div class="scroll_contents">
          <div class="scroll_inner">

            {#snippet field(id, label, type, placeholder)}
              <div class={fieldClass(id)}>
                <label class="label" for={id}>{label}</label>
                <input
                  {id}
                  {type}
                  {placeholder}
                  class="text-input"
                  bind:value={values[id]}
                  onblur={() => (touched[id] = true)}
                />
                {#if touched[id] && errors[id]}
                  <div class="input-feedback">{errors[id]}</div>
                {/if}
              </div>
            {/snippet}

            {@render field('name', 'Creature', 'text', 'Name of creatures')}
            {@render field('ac', 'Target AC', 'number', 'Target armor class')}
            {@render field('cnt', 'Number of Creatures', 'number', 'Enter number of creatures')}
            {@render field('adv_cnt', 'Attacks with advantage', 'number', 'Enter number of attacks with advantage')}
            {@render field('hit_mod', 'To hit modifier', 'number', 'Enter to-hit roll modifier')}
            {@render field('dice', 'Damage Roll', 'text', 'Enter dice roll for damage, e.g. 2d4+4')}

            <div class="scroll_action">
              <button type="button" class="outline" onclick={handleReset} disabled={!dirty}>Reset</button>
              <button type="submit">Roll Attack</button>
            </div>
          </div>
        </div>
      </div>

      <div class="results">
        <ul>
          {#each attackHistory as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    </form>
  </div>
</div>
