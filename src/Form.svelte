<script>
  import { createForm } from "svelte-forms-lib";

  import * as yup from 'yup';

	export let data = {};
	export let result = "";

	let name = data.name ?? '';
	let ac = data.ac ?? '';
	let cnt = data.cnt ?? '';
	let adv_cnt = data.adv_cnt ?? '';
	let hit_mod = data.hit_mod ?? '';
	let dice = data.dice ?? '';

/* pack-attack.js START */

// TODO: Figure out how to keep this in a separate file

function attackRoll(
  enemy_ac,
  adv_modifier = true,
  attack_modifier = 4,
  dmg_die = 4,
  dmg_die_cnt = 2,
  dmg_bonus = 2,
  attack = Math.floor(Math.random() * 20) + 1,
  attack_adv = Math.floor(Math.random() * 20) + 1
) {
  // Returns: [type, damage]
  // type on of: -1 = crit miss, 0 = miss, 1 = hit, 2 = crit

  if (adv_modifier) {
    console.log(
      "We rolled to hit AC " +
        enemy_ac +
        " with advantage, result: " +
        attack +
        " and " +
        attack_adv
    );
  } else {
    console.log("We rolled to hit " + enemy_ac + ", result: " + attack);
  }

  if (
    (attack === 1 && !adv_modifier) ||
    (attack === 1 && attack_adv === 1 && adv_modifier)
  ) {
    // Critical Fails
    console.log("--> CRITICAL MISS!");
    return [-1, 0];
  } else if (
    (attack + attack_modifier) >= enemy_ac ||
    (adv_modifier && ((attack_adv + attack_modifier) >= enemy_ac))
  ) {
    // Hits
    let damage = 0;
    let dmg_rolls = [];
    for (let d = 0; d < dmg_die_cnt; d++) {
      let next_dmg = Math.floor(Math.random() * dmg_die) + 1;
      dmg_rolls.push(next_dmg);
      damage += next_dmg;
    }

    damage += dmg_bonus;

    let type = 1;
    if (attack === 20 || (adv_modifier && attack_adv === 20)) {
      type = 2;
      let crit_dmg = dmg_die * dmg_die_cnt;
      damage += crit_dmg;
      console.log(
        "--> CRITICAL HIT Dammage roll " +
          dmg_die_cnt +
          "d" +
          dmg_die +
          " + " +
          dmg_bonus +
          " = [" +
          dmg_rolls +
          "] + " +
          dmg_bonus +
          " + " +
          crit_dmg +
          " = " +
          damage
      );
    } else {
      type = 1;
      console.log(
        "--> Dammage roll " +
          dmg_die_cnt +
          "d" +
          dmg_die +
          " + " +
          dmg_bonus +
          " = [" +
          dmg_rolls +
          "] + " +
          dmg_bonus +
          " = " +
          damage
      );
    }

    return [type, damage];
  } else {
    console.log("--> Missed.");
    return [0, 0];
  }
}

function parseDice(dice) {
  let die_pos = dice.indexOf("d");
  let mod_pos = dice.indexOf("+");
  let bonus = 0;
  if (mod_pos < 0) {
    mod_pos = dice.length;
  } else {
    bonus = parseInt(dice.slice(mod_pos + 1, dice.length), 10);
  }

  let die_cnt = parseInt(dice.slice(0, die_pos), 10);
  let die = parseInt(dice.slice(die_pos + 1, mod_pos), 10 );

  return [die_cnt, die, bonus];
}

export function packAttack(args) {
  // Set defaults...
  let name = "wolves",
    ac = 10,
    cnt = 16,
    adv_cnt = cnt,
    hit_mod = 4,
    dice = "2d4+2";

  // Support named parameters:
  // NOTE: Trash languages = trash work arounds.
  // https://stackoverflow.com/questions/15508282/named-arguments-in-javascript
  for (var i in args) {
    switch (i) {
      case "name":
        name = args[i];
        break;
      case "ac":
        ac = parseInt(args[i], 10);
        break;
      case "cnt":
        cnt = parseInt(args[i], 10);
        break;
      case "adv_cnt":
        adv_cnt = parseInt(args[i], 10);
        break;
      case "hit_mod":
        hit_mod = parseInt(args[i], 10);
        break;
      case "dice":
        dice = args[i];
        break;
      default:
        break;
    }
  }

  console.log(name + " attack!");

  let [die_cnt, die, bonus] = parseDice(dice);
  var total_damage = 0;
  var hit_cnt = 0;
  var crit_cnt = 0;
  var crit_fail_cnt = 0;
  for (let x = 0; x < cnt; x++) {
    let adv_mod = false;
    if (x < adv_cnt) {
      adv_mod = true;
    }
    let [rtype, rdmg] = attackRoll(ac, adv_mod, hit_mod, die, die_cnt, bonus);

    if (rtype > 0) {
      total_damage += rdmg;
      hit_cnt += 1;
      if (rtype == 2) {
        crit_cnt += 1;
      }
    } else if (rtype < 0) {
      crit_fail_cnt += 1;
    }
  }
  console.log(hit_cnt + " " + name + " hit for a total of " + total_damage);
  if (crit_fail_cnt > 0) {
    console.log(crit_fail_cnt + " " + name + " failed critically!");
  }
  return [hit_cnt, total_damage, crit_fail_cnt, crit_cnt];
}

/* pack-attack.js END */

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: data,
    validationSchema: yup.object().shape({
      name: yup.string()
        .min(2, "C'mon, your name is longer than that")
        .required("First name is required."),
      ac: yup.number()
        .min(0, "C'mon, you're tougher than that")
        .required("Target AC is required."),
      cnt: yup.number()
        .min(1, "Need at least one creature to attack")
        .required("Must specify the number of attacking creatures."),
      adv_cnt: yup.number().min(
        0,
        "Can't have less then zero creatures with advantage"
      ),
      hit_mod: yup.number(),
      dice: yup.string()
        .min(3, "Provide a dice roll, e.g. 2d4+1 or 1d12")
        .matches(/^[0-9]+d[0-9]+(\+[0-9]+)?$/, "Must match dice roll pattern.")
        .required("Must specify a dice roll")
    }),
    onSubmit: values => {

      let attack_result = packAttack({
        name: values.name,
        ac: values.ac,
        cnt: values.cnt,
        adv_cnt: values.adv_cnt,
        hit_mod: values.hit_mod,
        dice: values.dice
      });

      result =
        attack_result[0] +
        " " +
        values.name +
        " hit for " +
        attack_result[1] +
        " damage, with " +
        attack_result[2] +
        " critical failures and " +
        attack_result[3] +
        " critical successes.";

    }
  });

</script>

<div class="scroll">
	<div class="scroll_contents">
    <form on:submit={handleSubmit}>
      <div class="row">
        <div class="cell">
          <span class="block">Creature name</span>
          <input type="text" name="name" bind:value={$form.name} placeholder="Creature name" on:change={handleChange} on:blur={handleChange} />
          {#if errors.name}{errors.name}{/if}
        </div>
        <div class="cell">
          <span class="block">Target AC</span>
          <input type="number" name="ac" bind:value={$form.ac} placeholder="Target armor class" on:change={handleChange} on:blur={handleChange} />
          {#if errors.ac}{errors.ac}{/if}
        </div>
      </div>
      <div class="row">
        <div class="cell">
          <span class="block"># of creatures</span>
          <input type="number" name="cnt" bind:value={$form.cnt} placeholder="Enter number of creatures" on:change={handleChange} on:blur={handleChange} />
          {#if errors.cnt}{errors.cnt}{/if}
        </div>
        <div class="cell">
          <span class="block">Attacks with advantage</span>
          <input type="number" name="adv_cnt" bind:value={$form.adv_cnt} placeholder="Enter number of attacks with advantage" on:change={handleChange} on:blur={handleChange} />
          {#if errors.adv_cnt}{errors.adv_cnt}{/if}
        </div>
      </div>
      <div class="row">
        <div class="cell">
          <span class="block">To hit modifier</span>
          <input type="number" name="hit_mod" bind:value={$form.hit_mod} placeholder="Enter to-hit roll modifier" on:change={handleChange} on:blur={handleChange} />
          {#if errors.hit_mod}{errors.hit_mod}{/if}
        </div>
        <div class="cell">
          <span class="block">Damage dice roll</span>
          <input type="text" name="dice" bind:value={$form.dice} placeholder="e.g. 2d4+4" on:change={handleChange} on:blur={handleChange} />
          {#if errors.dice}{errors.dice}{/if}
        </div>
      </div>
      <div class="scroll_action">
        <button type="submit" class="btn-submit">Submit</button>
      </div>
    </form>
    <div class="results">
      {result}
    </div>
  </div>
</div>

<style>

/* extra pack attack form styles */
    
div.results {
  justify-content: center;
  text-align: center;
  font-size: 17px;
} 
  
div.scroll {
  margin: 0 0;
  background: url('/images/scroll-png-26394.png');
  background-position: center;
  background-repeat: no-repeat;
  height: 790px;
  max-width: 1000px;
}   
    
div.scroll_contents {
  padding-top: 150px;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 20%;
  
  max-width: 100%;
  max-height: 700px;
  position: relative;

}

div.scroll_action {
  text-align: center;
}

button {
  max-width: 150px;
  margin: 20px 0;
  padding: 12px 20px;
  border-style: none;
  border-radius: 5px;
  background-color: #08c;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
  font-size: 17px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  outline: none;
  -webkit-appearance: none;
}

input {
  border: 1px solid #ccc;
  border-radius: 4px;
  display: block;
  font-size: 16px;
  padding: .5rem;
  width: 100%;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.cell {
  padding-top: 5px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 5px;
}

</style>
