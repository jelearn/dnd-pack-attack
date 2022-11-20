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
    (attack == 1 && !adv_modifier) ||
    (attack == 1 && attack_adv == 1 && adv_modifier)
  ) {
    // Critical Fails
    console.log("--> CRITICAL MISS!");
    return [-1, 0];
  } else if (
    attack + attack_modifier >= enemy_ac ||
    (adv_modifier && attack_adv + attack_modifier >= enemy_ac)
  ) {
    // Hits
    let damage = 0;
    let dmg_rolls = [];
    for (let d = 0; d < dmg_die_cnt; d++) {
      let next_dmg = Math.floor(Math.random() * 4) + 1;
      dmg_rolls.push(next_dmg);
      damage += next_dmg;
    }

    damage += dmg_bonus;

    let type = 1;
    if (attack == 20 || (adv_modifier && attack_adv == 20)) {
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
    bonus = parseInt(dice.slice(mod_pos + 1, dice.length));
  }

  let die_cnt = parseInt(dice.slice(0, die_pos));
  let die = parseInt(dice.slice(die_pos + 1, mod_pos));

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
        ac = args[i];
        break;
      case "cnt":
        cnt = args[i];
        break;
      case "adv_cnt":
        adv_cnt = args[i];
        break;
      case "hit_mod":
        hit_mod = args[i];
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
  var crit_fail_cnt = 0;
  for (let x = 0; x < cnt; x++) {
    let a = 0,
      b = 0,
      adv_mod = false;
    if (x < adv_cnt) {
      adv_mod = true;
    }
    let [rtype, rdmg] = attackRoll(ac, adv_mod, hit_mod, die, die_cnt, bonus);

    if (rtype >= 0) {
      total_damage += rdmg;
      hit_cnt += 1;
    } else {
      crit_fail_cnt += 1;
    }
  }
  console.log(hit_cnt + " " + name + " hit for a total of " + total_damage);
  if (crit_fail_cnt > 0) {
    console.log(crit_fail_cnt + " " + name + " failed critically!");
  }
  return [hit_cnt, total_damage, crit_fail_cnt];
}

// tests
const assert = require("assert");

let console_log = console.log;
// Disable logs temporarily unless testing...
console.log = function () {};

assert.equal(parseDice("2d2+2").toString(), [2, 2, 2].toString());
assert.equal(parseDice("1d4+3").toString(), [1, 4, 3].toString());
assert.equal(parseDice("200d12+22").toString(), [200, 12, 22].toString());
assert.equal(parseDice("3d8").toString(), [3, 8, 0].toString());

assert.equal(
  attackRoll(10, false, 4, 6, 2, 2, 11, 1)[0],
  1,
  "Expecting a normal hit"
);
assert.equal(
  attackRoll(10, false, 0, 4, 2, 2, 9, 1)[0],
  0,
  "Expecting a miss hit"
);
assert.equal(
  attackRoll(10, false, 1, 4, 2, 2, 9, 1)[0],
  1,
  "Expecting a hit with modifier"
);
assert.equal(
  attackRoll(10, false, 1, 4, 2, 2, 1, 1)[0],
  -1,
  "Expecting a critical failure"
);
assert.equal(
  attackRoll(10, true, 0, 4, 2, 2, 1, 1)[0],
  -1,
  "Expecting a critical failure"
);
assert.equal(
  attackRoll(10, true, 0, 4, 2, 2, 1, 10)[0],
  1,
  "Expecting a hit because of advantage"
);
assert.equal(
  attackRoll(10, false, 0, 4, 2, 2, 10, 20)[0],
  1,
  "Expecting a hit we are not rolling advantage"
);
assert.equal(
  attackRoll(10, true, 0, 4, 2, 2, 10, 20)[0],
  2,
  "Expecting a critical hit we are rolling advantage"
);
assert.equal(
  attackRoll(10, true, 1, 4, 2, 2, 10, 19)[0],
  1,
  "Expecting a dirty 20 is not critial"
);

console.log = console_log;

// usage and examples
// packAttack({ac: 9});
// packAttack({ac: 15, cnt: 16, adv_cnt: 16, hit_mod: 4, dice: "2d4+2"});
// packAttack({name: "direwolves", ac: 15, cnt: 8, adv_cnt: 8, hit_mod: 5, dice: "2d6+2"});
// packAttack({name: "constrictor snakes", ac: 16, cnt: 8, adv_cnt: 0, hit_mod: 4, dice: "1d8+2"});
// packAttack({name: "brown bears claw ", ac: 12, cnt: 8, adv_cnt: 0, hit_mod: 6, dice: "2d6+2"});
// packAttack({name: "brown bears bite ", ac: 11, cnt: 8, adv_cnt: 0, hit_mod: 6, dice: "1d8+4"});
// packAttack({
//   name: "giant octopus",
//   ac: 15,
//   cnt: 4,
//   adv_cnt: 0,
//   hit_mod: 5,
//   dice: "2d6+2"
// });
