<script lang="ts">
import { House } from "svelte-bootstrap-icons";
import RouteHome from "stacks-voice/components/route-home.svelte";
</script>

<svelte:head>
	<title>Forum DAO</title>
	<meta name="description" content="Secure spoof free message board" />
</svelte:head>

<div id="forum">
	<div class="d-flex justify-content-end m-4"><a href="/forum"><House width={30} height={30}/></a></div>
	<RouteHome />
</div>

<style>
</style>
