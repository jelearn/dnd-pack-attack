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
</script>

<Form data={data} />
