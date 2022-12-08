<script>
// @ts-nocheck
import settings from '$lib/settings'
import { getAuth, getAccount } from '@micro-stacks/svelte';
import { c32ToB58 } from "micro-stacks/crypto";
import {onMount} from 'svelte'
import ChainUtils from '$lib/service/ChainUtils';
import { serializeCV, uintCV, standardPrincipalCV, cvToJSON, deserializeCV } from "micro-stacks/clarity";
import { bytesToHex } from "micro-stacks/common";

const auth = getAuth();
const account = getAccount();
const explorerUrl = function (address) {
	return import.meta.env.VITE_STACKS_EXPLORER + '/address/' + address + '/?chain=' + import.meta.env.VITE_NETWORK;;
}
const decodeAddr = c32ToB58($account.stxAddress);
//const recodeAddr = b58ToC32(c32ToB58($account.stxAddress));
let historicLocked = null;
let historicTotal = null;
let historicVotingCap = null;
let balanceAtHeight = 0;
let lockedAtHeight = 0;
let liquidAtHeight = 0;
let stacksTipHeight = $settings.info.stacks_tip_height;
let stxAddress = $account.stxAddress;
const resetHeight = async () => {
	stacksTipHeight = $settings.info.stacks_tip_height;
	stxAddress = $account.stxAddress;
	changeHeight();
	historicData();
}

// /v2/contracts/call-read/SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z/ede007-snapshot-proposal-voting-v5/get-historical-values
const historicData = async () => {
	const height = (stacksTipHeight === $settings.info.stacks_tip_height) ? stacksTipHeight - 1 : stacksTipHeight;
	let functionArgs = [`0x${bytesToHex(serializeCV(uintCV(height)))}`, `0x${bytesToHex(serializeCV(standardPrincipalCV(stxAddress)))}`];
	const data = {
		contractAddress: import.meta.env.VITE_DAO_DEPLOY_ADDRESS,
		contractName: 'ede007-snapshot-proposal-voting-v5',
		functionName: 'get-historical-values',
		functionArgs
	}
	const raw = await ChainUtils.callContractReadOnly(data);
    const historic = cvToJSON(deserializeCV(raw.result));
	historicTotal = ChainUtils.fromMicroAmount(historic.value.value['user-balance'].value);
	historicVotingCap = ChainUtils.fromMicroAmount(historic.value.value['voting-cap'].value);
	historicLocked = balanceAtHeight - historicTotal;
	console.log(historic);
}

const changeHeight = async () => {
    try {
      const response = await ChainUtils.getFromApi('/extended/v1/address/' + stxAddress + '/balances?until_block=' + stacksTipHeight);
      balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance))
      lockedAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.locked))
      liquidAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
	  historicData();
    } catch (e) {
      balanceAtHeight = 0;
      console.log(e)
    }
}
onMount(async () => {
	changeHeight(stacksTipHeight);
	historicData(stacksTipHeight);
})

</script>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="content bg-card p-5 text-white">
	<h1 class=""><span class="strokeme-white">About</span> STX.ECO</h1>
	<p class="strapline">STX.ECO is a community funded and driven project for the Stacks Ecosystem.</p>

	<div class="row my-4">
		<div class="col-12">
			{#if $auth.isSignedIn}
			<h4>Logged in as</h4>
			<p class="text-warning">
				<a class="text-warning" href={explorerUrl($account.stxAddress)} target="_blank">{$account.stxAddress} / {decodeAddr}</a> 
			</p>
			<h6>Balance</h6>
			<div class="form-field mb-3">
				<input class="w-75" style="height: 42px;" placeholder="Stacks block height" type="number" bind:value={stacksTipHeight}/>
				<button class="outline-dark" on:click={changeHeight}>
					Fetch
				</button>
				<button class="outline-dark" on:click={resetHeight}>
					Reset
				</button>
			</div>
			<div class="form-field mb-5">
				<input class="w-75" style="height: 42px;" placeholder="Stacks address" type="string" bind:value={stxAddress}/>
				<button class="outline-dark" on:click={changeHeight}>
					Fetch
				</button>
				<button class="outline-dark" on:click={resetHeight}>
					Reset
				</button>
			</div>
			<div class="row">
				<div class="col-md-6 col-sm-12">
					<h6>User Balance From API</h6>
					<div class="card text-dark my-3 p-4">
						<div class="card-text py-2">Total Balance: {balanceAtHeight}</div>
						<div class="card-text py-2">Locked Balance: {lockedAtHeight}</div>
						<div class="card-text py-2">Liquid Balance: {liquidAtHeight}</div>
					</div>
				</div>
				<!--
				<div class="col-md-6 col-sm-12">
					<h6>Data From POX Contract (via Voting contract)</h6>
					<div class="card text-dark my-3 p-4">
						<div class="card-text py-2">Total Balance: {historicTotal}</div>
						<div class="card-text py-2">Locked Balance: {historicLocked}</div>
						<div class="card-text py-2">Voting Cap: {historicVotingCap}</div>
					</div>
				</div>
				-->
			</div>
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
