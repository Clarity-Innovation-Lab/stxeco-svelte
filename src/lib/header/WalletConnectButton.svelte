<script>
import { Power } from "svelte-bootstrap-icons";
import { getAuth } from "@micro-stacks/svelte";
import settings from '$lib/settings'
import { getAccount } from '@micro-stacks/svelte';

const auth = getAuth();
const account = getAccount();

const logout = () => {
	$auth.signOut();
	// window.location.reload();
}
const login = () => {
	$auth.openAuthRequest({
    	onFinish: payload => {
      		console.log(payload);
			settings.init($account.stxAddress)           
    	}
  	});
}
</script>

{#if $auth.isSignedIn}
	<span class="nav-item">
		<a href="/" class="pointer" style="vertical-align: middle;" on:click|preventDefault={logout}>
			<img src="/img/png-assets/stx_eco_wallet_on.png" alt="Wallet Connected" width="40" height="auto" />
		</a>
	</span>
{:else if $auth.isRequestPending}
	<span class="nav-item"><a href="/" on:click|preventDefault={login}><img src="/img/png-assets/stx_eco_wallet_off.png" alt="Connect Wallet / Login" width="40" height="auto"/></a></span>
{:else}
	<span class="nav-item"><a href="/" class="pointer" on:click|preventDefault={login} ><img src="/img/png-assets/stx_eco_wallet_off.png" alt="Connect Wallet / Login" width="40" height="auto"/></a></span>
{/if}

<style>
.nav-item {
	text-transform: lowercase;
	font-weight: 700;
	font-size: 1.0rem;
}
</style>