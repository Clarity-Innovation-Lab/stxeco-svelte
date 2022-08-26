<script context="module" lang="ts">
export const prerender = true;
export async function load({ fetch }) {
	try {
		if (typeof window !== "undefined") {
			const url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/gh-issues'
			const res = await fetch(url)
			const issues = await res.json()
			if (res.ok) {
				return {
					props: {
						issues
					}
				}
			} else {
				return {
					status: res.status,
					error: new Error('Could not fetch issues')
				}
			}
		}
	} catch (e) {
		console.log('Error on server fetching from github.. ', e);
	}
}
</script>
<script>
	import createClient from '$lib/prismicio'; // Update this path if necessary
	import  * as prismicH from '@prismicio/helpers';
	
	const client = createClient()
	const document = client.getSingle('home')
  </script>
  
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Ecosystem DAO" />
</svelte:head>

<section>
	{#await document}
	<p>Loading...</p>
  {:then prismicResponse}
  {@html prismicH.asHTML(prismicResponse.data.content)}
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
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
