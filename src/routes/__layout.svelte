<script lang="ts">
    import { Buffer } from 'buffer';
	import { onMount } from 'svelte';
    import StacksAuthService from '$lib/service/StacksAuthService';
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

<footer>
	<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

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
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
