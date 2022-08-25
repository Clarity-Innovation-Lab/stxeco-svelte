<script>
// @ts-nocheck
import settings from '$lib/settings'
import { getAccount } from '@micro-stacks/svelte';
import { getAuth } from "@micro-stacks/svelte";

const auth = getAuth();
const account = getAccount();
const explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/?chain=' + import.meta.env.VITE_NETWORK;
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="content">
	<h1>About Ecosystem DAO</h1>

	<p>Consesnsus building for changes affecting the Stacks Network.</p>

	<h4>Logged in as</h4>
	<p class="text-small">{$account.stxAddress || 'anon'}</p>
	
	<h4>App Settings</h4>
	<p class="text-small">Network: {import.meta.env.VITE_NETWORK}</p>
	<p class="text-small">API: {import.meta.env.VITE_CLARITYLAB_API}</p>
	<p class="text-small">Deployer: {import.meta.env.VITE_DAO_DEPLOY_ADDRESS}</p>
	<p class="text-small"><a href={explorerUrl} target="_blank">Explorer</a></p>
	
	{#if $settings}
		{#if $auth.isSignedIn}
			{#if $settings.userProperties}
			<h4>Your Settings</h4>
			{#each $settings.userProperties as item}
					<p>{item.functionName} = {item.value.value}</p>
				{/each}
			{/if}
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
