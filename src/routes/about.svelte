<script context="module">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>
<script>
// @ts-nocheck
	import StacksAuthStore from '../stores/StacksAuthStore'
	import settings from '$lib/settings'

</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="content">
	<h1>About Ecosystem DAO</h1>

	<p>
		Ecosystem DAO is a project that's all about bvuilding the foundations for a new
		fairer and more secure Internet.
	</p>

	<p>
		The DAO - Decentralised Autonomous Organisation - helps create consensus between
		groups of people working often remotely.
	</p>
	<h4>User Properties</h4>
	<p class="text-small">{$StacksAuthStore.stxAddress}</p>
	{#if $settings.userProperties}
	{#each $settings.userProperties as item}
	<p>{item.functionName} = {item.value.value}</p>
	{/each}
	{/if}
	<p>--------------------------------------------</p>
	<h4>Blockchain Info</h4>
	Stacks Tip Height: {($settings.info.stacks_tip_height)}
	<p>--------------------------------------------</p>
	<h4>Dao Properties</h4>
	{#each $settings.daoProperties as item}
	<p>{item.id} = {item.value}</p>
	{/each}
	<p>--------------------------------------------</p>
	<h4>Proposals</h4>
	{#each $settings.proposals as item}
	<p>{item.title}</p>
	{/each}
	<p>--------------------------------------------</p>
	<h4>Extensions</h4>
	{#each $settings.extensions as item}
	<p>{item.contract.contract_id}</p>
	{/each}
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
