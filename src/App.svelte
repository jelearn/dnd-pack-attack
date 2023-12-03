<script>
	import Form from './Form.svelte';
	
  let data = {
    name: "Dire Wolves",
    ac: "15",
    cnt: "2",
    adv_cnt: "2",
    hit_mod: "5",
    dice: "2d6+3"
  }

	let submittedData = null;
</script>

<Form data={data} onSubmit={(data) => submittedData = data} />

<div>
	<span>Submitted Data</span>
	<pre>
		{JSON.stringify(submittedData, null, 2)}
	</pre>
</div>
