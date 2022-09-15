<script lang="ts">
import { page } from '$app/stores';
import WalletConnectButton from './WalletConnectButton.svelte'
import { Tools } from "svelte-bootstrap-icons";

let transparent = 'bg-warning';
if ($page.url.pathname === '/') {
	transparent = 'transparent';
}

</script>
<!--
<div class="px-0">
	<div class="bg-danger py-2 text-light py-0 text-center under-construction">
		<Tools /> Under construction - <a class="text-light" href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank">contributions welcome via discord!</a>
	</div>
</div>
-->
<nav class="navbar navbar-expand-md navbar-light {transparent} py-4">
	<div class="container-fluid mx-4">
	  	<a class="navbar-brand" href="/">
			<img src="/img/png-assets/stx_eco_logo_white.png" alt="stacks ecosystem dao logo" width="198" height="auto"/>
		</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
				<li class="nav-item"><a class:text-danger={$page.url.pathname === '/about'} href="/about">About</a></li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
					  votes
					</a>
					<ul class="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown">
					  <li><a class="dropdown-item text-white" href="/dao/proposals">Proposals</a></li>
					  <li><a class="dropdown-item" href="/dao/extensions">DAO Extensions</a></li>
					  <li><hr class="dropdown-divider"></li>
					  <li><a class="dropdown-item" href="/blog/posts/twopointone">Latest on the 2.1 Upgrade</a></li>
					</ul>
				</li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						Stacks
					</a>
					<ul class="dropdown-menu dropdown-menu-start" aria-labelledby="navbarDropdown">
					  <li><a class="dropdown-item text-white" href="/sip">Processes</a></li>
					  <li><a class="dropdown-item" href="/sip/issues">Ongoing</a></li>
					  <li><a class="dropdown-item" href="/sip/sip-voting">Upgrades</a></li>
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
.active {
	color: purple;
}
</style>
