<script lang="ts">
import { page } from '$app/stores';
import WalletConnectButton from './WalletConnectButton.svelte'

//let transparent = 'bg-warning';
//if ($page.url.pathname === '/') {
//	transparent = 'transparent';
//}
export let homepage:boolean;

</script>
<!--
<div class="px-0">
	<div class="bg-danger py-2 text-light py-0 text-center under-construction">
		<Tools /> Under construction - <a class="text-light" href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank">contributions welcome via discord!</a>
	</div>
</div>
-->
<nav class="navbar navbar-expand-md navbar-light transparent py-1 mt-2 mb-3">
	<div class="container-fluid mt-4 mx-5">
	  	<a class="navbar-brand mx-0 px-0" href="/">
			{#if homepage}
			<img class="nav-logo" src="/img/png-assets/stx_eco_logo_white.png" alt="stacks ecosystem dao logo" />
			{:else}
			<img class="nav-logo" src="/img/STX ECO - Colour logos/STX ECO Colour logos - PNG/STX_ECO_Colour_logo-03.png" alt="stacks ecosystem dao logo" />
			<!-- <img class="nav-logo" src="/img/STX ECO logo concepts-01-yellow.jpeg" alt="stacks ecosystem dao logo" /> -->
			{/if}
		</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
				<li class="nav-item"><a href="/sip/twopointone">About 2.1</a></li>
				<li class="nav-item"><a href="/forum">Forum</a></li>
				<li class="nav-item dropdown">
					<span class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						proposals
					</span>
					<ul class="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown">
						<li><a class="dropdown-item" href="/dao/proposals">All Proposals</a></li>
						<li><a class="dropdown-item" href="/dao/extensions">DAO Extensions</a></li>
						<li><a class="dropdown-item" href="/dao/claim-badge">Claim Badge</a></li>
					</ul>
				</li>
				<li class="nav-item dropdown">
					<span class="nav-link dropdown-toggle text-white" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						stacks
					</span>
					<ul class="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown">
					  <li><a class="dropdown-item" href="/sip">Processes</a></li>
					  <li><a class="dropdown-item" href="/sip/issues">SIP Board</a></li>
					  <li><a class="dropdown-item" href="/about">About</a></li>
					</ul>
				</li>
				<li class="nav-item mb-1">
					<WalletConnectButton />
				</li>
			</ul>
		</div>
	</div>
</nav>

<style>
</style>
