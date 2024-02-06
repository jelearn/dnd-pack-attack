<script>
	export let data = {
		name: 'Dire Wolves',
		ac: '15',
		cnt: '2',
		adv_cnt: '2',
		hit_mod: '5',
		dice: '2d6+3'
	};

	export let result = '';

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
				'We rolled to hit AC ' +
					enemy_ac +
					' with advantage, result: ' +
					attack +
					' and ' +
					attack_adv
			);
		} else {
			console.log('We rolled to hit ' + enemy_ac + ', result: ' + attack);
		}

		if ((attack === 1 && !adv_modifier) || (attack === 1 && attack_adv === 1 && adv_modifier)) {
			// Critical Fails
			console.log('--> CRITICAL MISS!');
			return [-1, 0];
		} else if (
			attack + attack_modifier >= enemy_ac ||
			(adv_modifier && attack_adv + attack_modifier >= enemy_ac)
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
					'--> CRITICAL HIT Dammage roll ' +
						dmg_die_cnt +
						'd' +
						dmg_die +
						' + ' +
						dmg_bonus +
						' = [' +
						dmg_rolls +
						'] + ' +
						dmg_bonus +
						' + ' +
						crit_dmg +
						' = ' +
						damage
				);
			} else {
				type = 1;
				console.log(
					'--> Dammage roll ' +
						dmg_die_cnt +
						'd' +
						dmg_die +
						' + ' +
						dmg_bonus +
						' = [' +
						dmg_rolls +
						'] + ' +
						dmg_bonus +
						' = ' +
						damage
				);
			}

			return [type, damage];
		} else {
			console.log('--> Missed.');
			return [0, 0];
		}
	}

	function parseDice(dice) {
		let die_pos = dice.indexOf('d');
		let mod_pos = dice.indexOf('+');
		let bonus = 0;
		if (mod_pos < 0) {
			mod_pos = dice.length;
		} else {
			bonus = parseInt(dice.slice(mod_pos + 1, dice.length), 10);
		}

		let die_cnt = parseInt(dice.slice(0, die_pos), 10);
		let die = parseInt(dice.slice(die_pos + 1, mod_pos), 10);

		return [die_cnt, die, bonus];
	}

	export function packAttack(args) {
		// Set defaults...
		let name = 'wolves',
			ac = 10,
			cnt = 16,
			adv_cnt = cnt,
			hit_mod = 4,
			dice = '2d4+2';

		// Support named parameters:
		// NOTE: Trash languages = trash work arounds.
		// https://stackoverflow.com/questions/15508282/named-arguments-in-javascript
		for (var i in args) {
			switch (i) {
				case 'name':
					name = args[i];
					break;
				case 'ac':
					ac = parseInt(args[i], 10);
					break;
				case 'cnt':
					cnt = parseInt(args[i], 10);
					break;
				case 'adv_cnt':
					adv_cnt = parseInt(args[i], 10);
					break;
				case 'hit_mod':
					hit_mod = parseInt(args[i], 10);
					break;
				case 'dice':
					dice = args[i];
					break;
				default:
					break;
			}
		}

		console.log(name + ' attack!');

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
		console.log(hit_cnt + ' ' + name + ' hit for a total of ' + total_damage);
		if (crit_fail_cnt > 0) {
			console.log(crit_fail_cnt + ' ' + name + ' failed critically!');
		}
		return [hit_cnt, total_damage, crit_fail_cnt, crit_cnt];
	}

	/* pack-attack.js END */

  import * as yup from 'yup';
  import {Form, Message} from 'svelte-yup';

	const schema = yup.object().shape({
		name: yup
			.string()
			.min(2, "C'mon, your name is longer than that")
			.required('Creature name is required.'),
		ac: yup.number().min(0, "C'mon, you're tougher than that").required('Target AC is required.'),
		cnt: yup
			.number()
			.min(1, 'Need at least one creature to attack.')
			.required('Must specify the number of attacking creatures.'),
		adv_cnt: yup.number().min(0, "Can't have less then zero creatures with advantage.").default(0),
		hit_mod: yup.number().typeError("Must be a number.").default(0).max(19, "Anything less than 20.").min(-19, "Anything greater than -20."),
		dice: yup
			.string()
			.min(3, 'Provide a dice roll, e.g. 2d4+1 or 1d12')
			.matches(/^[0-9]+d[0-9]+(\+[0-9]+)?$/, 'Must match dice roll pattern.')
			.required('Must specify a dice roll')
	});


    let fields = data;
    let submitted = false;
    let isValid;

    function formSubmit(){
        submitted = true;
        isValid = schema.isValidSync(fields);

        if(isValid){

          let attack_result = packAttack(fields);
          result =
            attack_result[0] +
            ' ' +
            fields.name +
            ' hit for ' +
            attack_result[1] +
            ' damage, with ' +
            attack_result[2] +
            ' critical failures and ' +
            attack_result[3] +
            ' critical successes.';

        }
    }

</script>

<div class="scroll">
	<div class="scroll_contents">
		<Form class="form" {schema} {fields} submitHandler={formSubmit} {submitted}>
			<div class="row">
				<div class="cell">
					<span class="block">Creature name</span>
					<input
						type="text"
						bind:value={fields.name}
						placeholder="Creature name"
					/>
          <Message name="name" />
				</div>
				<div class="cell">
					<span class="block">Target AC</span>
					<input
						type="number"
						bind:value={fields.ac}
						placeholder="Target armor class"
					/>
          <Message name="ac" />
				</div>
			</div>
			<div class="row">
				<div class="cell">
					<span class="block"># of creatures</span>
					<input
						type="number"
						bind:value={fields.cnt}
						placeholder="Enter number of creatures"
					/>
          <Message name="cnt" />
				</div>
				<div class="cell">
					<span class="block">Attacks with advantage</span>
					<input
						type="number"
						bind:value={fields.adv_cnt}
						placeholder="Enter number of attacks with advantage"
					/>
          <Message name="adv_cnt" />
				</div>
			</div>
			<div class="row">
				<div class="cell">
					<span class="block">To hit modifier</span>
					<input
						type="number"
						bind:value={fields.hit_mod}
						placeholder="Enter to-hit roll modifier"
					/>
          <Message name="hit_mod" />
				</div>
				<div class="cell">
					<span class="block">Damage dice roll</span>
					<input
						type="text"
						bind:value={fields.dice}
						placeholder="e.g. 2d4+4"
					/>
          <Message name="dice" />
				</div>
			</div>
			<div class="scroll_action">
				<button type="submit" class="btn-submit">Submit</button>
			</div>
		</Form>
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
		padding: 0.5rem;
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
