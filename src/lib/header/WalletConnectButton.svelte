<script>
import { Power } from "svelte-bootstrap-icons";
import { get_client } from "../../stores/client";
import { client } from '$lib/micro-stacks-client';

// const auth = client.auth;
//const account = get_client().selectAccount(client.getState());

//const address = account;
const logout = () => {
	client.signOut();
}
const login = () => {
	client.authenticate();
}
</script>

{#if client.hasSession}
	<span class="pointer" style="vertical-align: middle;"><a on:click|preventDefault={logout} href="/"><Power fill="dark" width={20} height={40} /></a></span>
{:else if client.isRequestPending}
	Authenticating..
{:else}
	<span class="pointer" on:click|preventDefault={login} style="vertical-align: middle;"><img width="80px" src="/img/wallet-grey.svg" alt="stx ecosystem dao"/></span>
{/if}

<style>
</style>