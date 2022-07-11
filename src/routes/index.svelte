<script context="module" lang="js">
	export const prerender = true;
</script>

<script>
	import Card from '../shared/Card.svelte'
	import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<LayoutGrid>
	<Cell span={6} class="text-center">
		<Card>
			<h4>Ecosystem DAO</h4>
			<p>A Contributors DAO on Stacks</p>
			<button><a href="/stxdao/membership">Learn More</a></button>
		</Card>
	</Cell>
	<Cell span={6} class="text-center">
		<Card>
			<h4>Stacks Improvement Proposals</h4>
			<p>Contribute to the growth of the Stacks Network</p>
			<button><a href="/stxdao/sip-landing">More about SIPs</a></button>
		</Card>
	</Cell>
	<Cell span={6} class="text-center">
		<Card>
			<h4>Cast Your Vote</h4>
			<p>Vote on network upgrades and improvements</p>
			<button><a href="/stxdao/proposals">Learn More</a></button>
		</Card>
	</Cell>
	<Cell span={6} class="text-center">
		<Card>
			<h4>Make a Change</h4>
			<p>Submit a proposal</p>
			<button><a href="/stxdao/proposals">Learn More</a></button>
		</Card>
	</Cell>
</LayoutGrid>

<style>
	h4 {
		color: #000;
		width: 100%;
	}
</style>
