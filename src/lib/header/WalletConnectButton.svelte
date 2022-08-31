<script>
import { Power } from "svelte-bootstrap-icons";
import { getAuth } from "@micro-stacks/svelte";
import settings from '$lib/settings'
import { getAccount } from '@micro-stacks/svelte';

const auth = getAuth();
const account = getAccount();

const logout = () => {
	$auth.signOut();
	window.location.reload();
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
	<a href="/" class="pointer" style="vertical-align: middle;" on:click|preventDefault={logout}><Power fill="dark" width={20} height={40} /></a>
{:else if $auth.isRequestPending}
	Authenticating..
{:else}
<a href="/" class="text-white pointer" on:click|preventDefault={login} >Connect Wallet</a>
{/if}

<style>
</style>