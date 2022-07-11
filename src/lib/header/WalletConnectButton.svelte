<script>
import StacksAuthService from '$lib/service/StacksAuthService'

const login = () => {
	StacksAuthService.login()
}
</script>

<span on:click|preventDefault={login} style="vertical-align: middle;"><img width="80px" src="img/wallet-grey.svg" alt="stx ecosystem dao"/></span>

<style>
</style>