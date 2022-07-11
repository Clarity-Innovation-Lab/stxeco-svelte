<script lang="ts">
import { page } from '$app/stores';
import StacksAuthStore from '../../stores/StacksAuthStore.js'
import StacksAuthService from '$lib/service/StacksAuthService'
import WalletConnectButton from './WalletConnectButton.svelte'

const logout = () => {
	StacksAuthService.logout()
}
</script>

<header>
    <nav>
		<span class="title">
			<a href="/"><img width="30px" src="img/logo.png" alt="stx ecosystem dao"/></a>
		</span>
		<span class="links">
			<a class:active={$page.url.pathname === '/dao'} href="/dao">DAO</a>
			<a class:active={$page.url.pathname === '/sips'} href="/sips">SIPs</a>
			{#if $StacksAuthStore.loggedIn}
				<a on:click|preventDefault={logout} href="/">Logout</a>
			{:else}
				<WalletConnectButton />
			{/if}
		</span>
    </nav> 
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	nav {
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
