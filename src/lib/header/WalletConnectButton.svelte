<script>
import { Power } from "svelte-bootstrap-icons";
import { getAuth } from "@micro-stacks/svelte";
 
const auth = getAuth();

const logout = () => {
	$auth.signOut();
}
const login = () => {
	$auth.openAuthRequest();
}
</script>

{#if $auth.isSignedIn}
	<span class="pointer" style="vertical-align: middle;"><a on:click|preventDefault={logout} href="/"><Power fill="dark" width={20} height={40} /></a></span>
{:else if $auth.isRequestPending}
	Authenticating..
{:else}
	<span class="pointer" on:click|preventDefault={login} style="vertical-align: middle;"><img width="80px" src="/img/wallet-grey.svg" alt="stx ecosystem dao"/></span>
{/if}

<style>
</style>