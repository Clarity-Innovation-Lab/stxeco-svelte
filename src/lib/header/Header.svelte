<script lang="ts">
import { page } from '$app/stores';
import StacksAuthStore from '../../stores/StacksAuthStore.js'
import StacksAuthService from '$lib/service/StacksAuthService'
import WalletConnectButton from './WalletConnectButton.svelte'

const logout = () => {
	StacksAuthService.logout()
}
</script>

<nav class="navbar navbar-expand-sm sticky-top navbar-light bg-warning py-4">
	<div class="container">
	  	<a class="navbar-brand" href="/"><img src="/img/logo.png" alt="" width="30" height="24"  class="d-inline-block align-text-top pr-3"> <span class="mx-3">Eco-system-DAO</span></a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse " id="navbarNav">
			<ul class="navbar-nav me-auto">
			</ul>
			<ul class="navbar-nav ">
				<li class="nav-item"><a class:active={$page.url.pathname === '/dao'} href="/dao">DAO</a></li>
				<li class="nav-item"><a class:active={$page.url.pathname === '/sip-landing'} href="/sip-landing">SIPs</a></li>
				<li class="nav-item">
					{#if $StacksAuthStore.loggedIn}
						<a on:click|preventDefault={logout} href="/">Logout</a>
					{:else}
						<WalletConnectButton />
					{/if}
				</li>
			</ul>
		</div>
	</div>
</nav>

<style>
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
