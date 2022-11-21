<script>
import { getAuth,  } from "@micro-stacks/svelte";
import { getAccount } from '@micro-stacks/svelte';
import settings from '$lib/settings'
// import { onNoWalletFound } from 'micro-stacks/connect';
import { onMount } from 'svelte';

const auth = getAuth();
const account = getAccount();

const logout = () => {
	$auth.signOut();
}
let webWalletNeeded = false;
const login = () => {
	try {
		$auth.openAuthRequest({
			onFinish: payload => {
				console.log(payload);
				window.location.reload();
			},
			onCancel: () => {
				console.log('canceled');
			}
  		}).catch((err) => {
          console.log(err);
          // https://www.hiro.so/wallet/install-web
          webWalletNeeded = true;
        });
	} catch (e) {
		if (window) window.location.href = "https://wallet.hiro.so/wallet/install-web";
	}
}
onMount(async () => {
	webWalletNeeded = typeof window.StacksProvider === 'undefined';
})

</script>

{#if webWalletNeeded}
<span class="nav-item" style="position: relative; top: 2px;">
	<a href="https://wallet.hiro.so/wallet/install-web" class="pointer" target="_blank">
		Install Web Wallet
	</a>
</span>
{:else if $auth.isSignedIn}
	<span class="nav-item">
		<a href="/" class="pointer" style="vertical-align: middle;" on:click|preventDefault={logout}>
			<span  class="px-2"><img src="/img/png-assets/stx_eco_wallet_on.png" alt="Wallet Connected" width="40" height="auto" /></span> Connected
		</a>
	</span>
{:else if $auth.isRequestPending}
	<span class="nav-item"><a href="/" on:click|preventDefault={login}><span  class="px-2"><img src="/img/png-assets/stx_eco_wallet_off.png" alt="Connect Wallet / Login" width="40" height="auto"/></span> connect wallet</a></span>
{:else}
	<span class="nav-item"><a href="/" class="pointer px-2" on:click|preventDefault={login} ><span  class="px-1"><img src="/img/png-assets/stx_eco_wallet_off.png" alt="Connect Wallet / Login" width="40" height="auto"/></span> connect wallet</a></span>
{/if}

<style>
.nav-item {
	text-transform: lowercase;
	font-weight: 700;
	font-size: 1.0rem;
}
</style>