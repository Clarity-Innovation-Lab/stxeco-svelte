<script>
import Section1 from '$lib/components/homepage/Section1.svelte'
import Section2 from '$lib/components/homepage/Section2.svelte'
</script>
  
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Ecosystem DAO" />
</svelte:head>

<Section1 homepage={true}/>
<div class="container">
  <Section2/>
</div>
