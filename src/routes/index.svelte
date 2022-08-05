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
	
<script lang="ts">

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Ecosystem DAO" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset="svelte-welcome.webp" type="image/webp" />
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</span>
	</h1>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
