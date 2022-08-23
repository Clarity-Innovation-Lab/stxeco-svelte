<script>
// @ts-nocheck
	import settings from '$lib/settings'
    import { getAccount } from '@micro-stacks/svelte';
 
    const account = getAccount();

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
	<p class="text-small">{$account.stxAddress || 'anon'}</p>
	{#if $settings}
	{#if $settings.userProperties}
	{#each $settings.userProperties as item}
	<p>{item.functionName} = {item.value.value}</p>
	{/each}
	{/if}
	<p>--------------------------------------------</p>
	<h4>Blockchain Info</h4>
	Stacks Tip Height: {($settings.info?.stacks_tip_height || 0)}
	<p>--------------------------------------------</p>
	<h4>Dao Properties</h4>
	{#if $settings.daoProperties}
	{#each $settings.daoProperties as item}
	<p>{item.id} = {item.value}</p>
	{/each}
	{/if}
	<p>--------------------------------------------</p>
	<h4>Proposals</h4>
	{#if $settings.proposals}
	{#each $settings.proposals as item}
	<p>{item.title}</p>
	{/each}
	{/if}
	<p>--------------------------------------------</p>
	<h4>Extensions</h4>
	{#if $settings.extensions}
	{#each $settings.extensions as item}
	<p>{item.contract.contract_id}</p>
	{/each}
	{/if}
	{/if}
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
