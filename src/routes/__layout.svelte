<script lang="ts">
    import { Buffer } from 'buffer';
	import { onMount } from 'svelte';
    import StacksAuthService from '$lib/service/StacksAuthService.js';
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	import Footer from '$lib/header/Footer.svelte';
    import { page } from '$app/stores';
	
    if (typeof window !== 'undefined') {
        // @ts-ignore
        window.Buffer = Buffer;
    }

	onMount(async () => {
		StacksAuthService.updateLoginStatus();
	});

    console.log('Page=', page);
</script>

<Header />
<main>
	<slot />
</main>
<Footer/>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
		padding-top: 100px;
	}
</style>
