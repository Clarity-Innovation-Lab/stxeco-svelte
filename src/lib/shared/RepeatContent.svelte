<script>
  import Tab1 from '$lib/components/sips/tabs/Tab1.svelte';
	import createClient from '$lib/prismicio'; // Update this path if necessary
	import  * as prismicH from '@prismicio/helpers';
	
	export let docType;
	export let uid;
	const client = createClient()
	const document = client.getByUID(docType, uid);
	const isText = (tabContent) => {
		let ans = false;
		for (let o of tabContent) {
			if (o.text.indexOf('</div>') > -1) {
				ans = true;
				break;
			}
		}
		return ans;
	}
</script>
  
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Ecosystem DAO" />
</svelte:head>

<section>
	{#await document}
	<p>Loading...</p>
  {:then prismicResponse}
	{#if isText(prismicResponse.data.tab_content)}
		<h1>Yes Divs</h1>
  		{@html prismicH.asText(prismicResponse.data.tab_content)}
	{:else}
		<h1>No Divs</h1>
		{@html prismicH.asHTML(prismicResponse.data.tab_content)}
	{/if}
  <!--
	<h1>{prismicH.asText(prismicResponse.data.title)}</h1>
	{@html prismicH.asHTML(prismicResponse.data.tagline)}
	{@html prismicH.asImageSrc(prismicResponse.data['homepage-image'])}
  -->
  {:catch error}
  <pre>{document}</pre>
  <pre>{error.message}</pre>
  {/await}
</section>

<style>
</style>
