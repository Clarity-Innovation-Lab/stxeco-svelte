<script lang="ts">
import { page } from '$app/stores';
import WalletConnectButton from './WalletConnectButton.svelte'
import { Tools } from "svelte-bootstrap-icons"; 
</script>

<div class="container-fluid px-0">
	<div class="bg-danger py-2 text-light py-0 text-center under-construction">
		<Tools /> Under construction - <a class="text-light" href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank">contributions welcome via discord!</a>
	</div>
</div>

<nav class="navbar navbar-expand-sm sticky-top navbar-light bg-warning py-4">
	<div class="container">
	  	<a class="navbar-brand" href="/"><img src="/img/logo.png" alt="" width="30" height="24"  class="d-inline-block align-text-top pr-3"> <span class="mx-3">Eco-system-DAO</span></a>
		  <span class="nav-item"><a class:text-danger={$page.url.pathname === '/about'} href="/about">About</a></span>
		  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse " id="navbarNav">
			<ul class="navbar-nav me-auto">
			</ul>
			<ul class="navbar-nav ">
				<li class="nav-item"><a class:text-danger={$page.url.pathname.indexOf('/dao') > -1} href="/dao">DAO</a></li>
				<li class="nav-item"><a class:text-danger={$page.url.pathname.indexOf('/sip') > -1} href="/sip">SIPs</a></li>
				<li class="nav-item">
					<WalletConnectButton />
				</li>
			</ul>
		</div>
	</div>
</nav>

{#if $page.url.pathname.indexOf('/dao') > -1}
<div class="bg-light text-dark py-2 text-center text-small">
	<span class="px-3 border-right nav-item">{#if $page.url.pathname === '/dao/proposals'}<span class="active">SIP Home</span>{:else}<a href="/dao/proposals">Proposals</a>{/if}</span>
	<span class="px-3 border-right nav-item">{#if $page.url.pathname === '/dao/extensions'}<span class="active">SIP Issues</span>{:else}<a href="/dao/extensions">Extension</a>{/if}</span>
	<span class="px-3 nav-item">{#if $page.url.pathname === '/dao/strategy'}<span class="active">SIP Voting</span>{:else}<a href="/dao/strategy">Launch Plans</a>{/if}</span>
</div>
{/if}

{#if $page.url.pathname.indexOf('/sip') > -1}
<div class="bg-light text-dark py-2 text-center text-small">
	<span class="px-3 border-right nav-item">{#if $page.url.pathname === '/sip'}<span class="active">SIP Home</span>{:else}<a href="/sip">SIP Home</a>{/if}</span>
	<span class="px-3 border-right nav-item">{#if $page.url.pathname === '/sip/issues'}<span class="active">SIP Issues</span>{:else}<a href="/sip/issues">SIP Issues</a>{/if}</span>
	<span class="px-3 nav-item">{#if $page.url.pathname === '/sip/sip-voting'}<span class="active">SIP Voting</span>{:else}<a href="/sip/sip-voting">SIP Voting</a>{/if}</span>
</div>
{/if}

<style>
	.active {
		color: purple;
	}
	nav {
		height: 80px;
		display: flex;
		justify-content: center;
		--background: rgba(0, 255, 255, 0.7);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
