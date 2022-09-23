<script>
// @ts-nocheck
import settings from '$lib/settings'
import { getAccount } from '@micro-stacks/svelte';
import { getAuth } from "@micro-stacks/svelte";

const auth = getAuth();
const account = getAccount();
const explorerUrl = function (address) {
	return import.meta.env.VITE_STACKS_EXPLORER + '/address/' + address + '/?chain=' + import.meta.env.VITE_NETWORK;;
}
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="content bg-card p-5 text-white">
	<h1 class=""><span class="strokeme-white">About</span> STX.ECO</h1>
	<p class="strapline">STX.ECO is a community funded and driven project for the Stacks Ecosystem.</p>

	<div class="row my-4">
		<div class="col-12">
			{#if $auth.isSignedIn}
			<h4>Logged in as</h4>
			<p class="text-warning">{#if $settings?.accountInfo?.bnsName}$settings?.accountInfo?.bnsName<br/>{/if}<a class="text-warning" href={explorerUrl($account.stxAddress)} target="_blank">{$account.stxAddress}</a></p>
			{:else}
			<p class="text-warning">Click the connect button above to connect your wallet</p>
			{/if}
			<h4>DAO Deploy Address</h4>
			<p class="text-warning"><a class="text-warning" href={explorerUrl(import.meta.env.VITE_DAO_DEPLOY_ADDRESS)} target="_blank">{import.meta.env.VITE_DAO_DEPLOY_ADDRESS}</a></p>
			<h4>DAO API Address</h4>
			<p class="text-warning"><a class="text-warning" href={import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/dao-properties'} target="_blank">{import.meta.env.VITE_CLARITYLAB_API}/daoapi/v2/dao-properties</a></p>
		</div>
	</div>
	<div class="row mb-4">
		<div class="col-12">
			<h4>Application Settings</h4>
			<p class="">Network: {import.meta.env.VITE_NETWORK}</p>
			<p class="">Stacks Tip Height: {($settings.info?.stacks_tip_height || 0)}</p>
		</div>
	</div>
	<div class="row">
		<div class="col-12">
			<h4>Dao Settings</h4>
			{#if $settings}
			<!--
			{#if $auth.isSignedIn}
				{#if $settings.userProperties}
				<h4>Your Settings</h4>
				{#each $settings.userProperties as item}
						<p>{item.functionName} = {item?.value?.value}</p>
					{/each}
				{/if}
			{/if}
			-->
			{#if $settings.daoProperties}
				{#each $settings.daoProperties as item}
					{#if item.id === 'funding-cost'}
					<p>Proposal Crowd Funding Cost = {item.value / 1000000} STX</p>
					{:else if item.id === 'proposal-duration'}
					<p>Duration of voting is {item.value} Blocks</p>
					{:else if item.id === 'proposal-start-delay'}
					<p>Delay between proposal being fully funded/submitted and the start of voting is {item.value} Blocks</p>
					{:else if item.id === 'get-signals-required'}
					<p>Emergency proposals can be passed with {item.value} votes from the emergency team</p>
					{:else if item.value}
					<p>{item.id} = {item.value}</p>
					{/if}
				{/each}
			{/if}
		{/if}
		</div>
	</div>
	
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
