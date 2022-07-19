<script>
    import { getAccount, getAuth } from "@micro-stacks/svelte";

const auth = getAuth();
const account = getAccount();

$: loggedIn = $auth.isSignedIn;
$: sessionStatus = !$account.stxAddress ? 'No active session' : $account.stxAddress
// let response: any;
$: label = $auth.isRequestPending
	? "Loading..."
	: $auth.isSignedIn
		? "Sign out"
		: "Connect Stacks wallet";

function onClick() {
	if ($auth.isSignedIn) {
		$auth.signOut();
	} else {
		$auth.openAuthRequest();
	}
}

</script>

<h2>{sessionStatus}</h2>

{#if loggedIn}
	<span on:click|preventDefault={onClick}>Logout</span>
{:else}
	<span on:click|preventDefault={onClick} style="vertical-align: middle;"><img width="80px" src="/img/wallet-grey.svg" alt="stx ecosystem dao"/></span>
{/if}

<style>
</style>