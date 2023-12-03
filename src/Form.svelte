<script>
  import { createForm } from "svelte-forms-lib";

  import * as yup from 'yup';

	export let data = {};
	export let result = {};
	export let onSubmit = () => {};

	let name = data.name ?? '';
	let ac = data.ac ?? '';
	let cnt = data.cnt ?? '';
	let adv_cnt = data.adv_cnt ?? '';
	let hit_mod = data.hit_mod ?? '';
	let dice = data.dice ?? '';

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
      result = values;
      onSubmit(values);
    }
  });

</script>

<div class="scroll">
	<div class="scroll_contents">

  <form on:submit={handleSubmit}>
    <div>
      <span class="block">Creature name</span>
      <input type="text" name="name" bind:value={$form.name} placeholder="Creature name" on:change={handleChange} on:blur={handleChange} />
      {#if errors.name}{errors.name}{/if}
    </div>
    <div>
      <span class="block">Target AC</span>
      <input type="number" name="ac" bind:value={$form.ac} placeholder="Target armor class" on:change={handleChange} on:blur={handleChange} />
      {#if errors.ac}{errors.ac}{/if}
    </div>
    <div>
      <span class="block"># of creatures</span>
      <input type="number" name="cnt" bind:value={$form.cnt} placeholder="Enter number of creatures" on:change={handleChange} on:blur={handleChange} />
      {#if errors.cnt}{errors.cnt}{/if}
    </div>
    <div>
      <span class="block">Attacks with advantage</span>
      <input type="number" name="adv_cnt" bind:value={$form.adv_cnt} placeholder="Enter number of attacks with advantage" on:change={handleChange} on:blur={handleChange} />
      {#if errors.adv_cnt}{errors.adv_cnt}{/if}
    </div>
    <div>
      <span class="block">To hit modifier</span>
      <input type="number" name="hit_mod" bind:value={$form.hit_mod} placeholder="Enter to-hit roll modifier" on:change={handleChange} on:blur={handleChange} />
      {#if errors.hit_mod}{errors.hit_mod}{/if}
    </div>
    <div>
      <span class="block">Damage dice roll</span>
      <input type="text" name="dice" bind:value={$form.dice} placeholder="Enter dice roll for damage, e.g. 2d4+4" on:change={handleChange} on:blur={handleChange} />
      {#if errors.dice}{errors.dice}{/if}
    </div>
    <div class="scroll_action">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
	</div>
</div>

<div class="results">
  <pre>
    {JSON.stringify(result, null, 2)}
  </pre>
</div>

<style>

/* extra pack attack form styles */
    
div.results {
  justify-content: left;
  text-align: left;
} 
  
div.scroll {
  margin: 0 0;
  background: url('/images/scroll-png-26394.png');
  background-position: center;
  background-repeat: no-repeat;
  height: 790px;
  padding-left: 88px;
  padding-right: 88px;
  max-width: 1000px;
}   
    
div.scroll_contents {
  padding-top: 20%;
  justify-content: center;
  text-align: left;
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

</style>
