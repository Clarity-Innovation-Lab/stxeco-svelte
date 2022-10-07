<script context="module" lang="ts">
	export async function load({ fetch }: { fetch: any }) {
		try {
			const url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/gh-issues'
			const res = await fetch(url)
			const issues = await res.json()
			if (res.ok) {
				return {
					props: {
						issues
					}
				}
			} else {
				return {
					status: res.status,
					error: new Error('Could not fetch issues')
				}
			}
		} catch (err) {
			console.log('SSError in sip/issues.. ', err)
		}
}
</script>

<script lang="ts">
	import SipUtils from '$lib/service/SipUtils';
	import { goto } from '$app/navigation';
	import type { IssueType } from "../../types/stxeco.type";
	import { ArrowUpRightCircle, SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";
	import { DateTime } from 'luxon'

	export let issues:Array<IssueType>;

	const labels = (labels: any[]) => {
		if (!labels) return ''
		let labelNames = ''
		labels.forEach((label) => {
			labelNames += label.name
		})
		return labelNames
	}
	let numbProposals = issues.filter((o) => o.pullRequest).length
	let numbIssues = issues.filter((o) => !o.pullRequest).length

	let menuClasses = ' pointer btn '
	$: issueClassList = (filter1 === 'issues') ? menuClasses + ' btn-danger text-dark' : menuClasses + ' btn-outline-danger' 
	$: propClassList = (filter1 === 'issues') ? menuClasses + ' btn-outline-danger' : menuClasses + ' btn-danger text-dark'

	const back = () => {
		goto(`/sip`, { replaceState: false })
	}

	let filter1 = 'proposals'
	let filtered = issues
	function filter(newfilter:string) {
		if (newfilter === 'issues') {
			filter1 = 'issues'
			filtered = issues.filter((o) => !o.pullRequest)
		} else {
			filter1 = 'proposals'
			filtered = issues.filter((o) => o.pullRequest)
		}
	}
	let sortDir = true;
	let sortField = 'title';

	const reorder = (sf:string) => {
		sortField = sf;
		sortDir = !sortDir;
	}
	$: sortedSips = SipUtils.sortSips(filtered, sortDir, sortField);

</script>

<svelte:head>
	<title>SIP PROCESS</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="">
	<div class="container">
		{#if filter1 === 'issues'}
        <h1 class="text-danger">SIP <span class="strokeme-danger">SUGGESTIONS</span></h1>
        <p class="strapline">Improvements raised as suggestions and pending feedback from the community</p>
		{:else}
        <h1 class="text-danger">SIP <span class="strokeme-danger">PROPOSALS</span></h1>
        <p class="strapline">Improvements currently under consideration by advisory boards</p>
		{/if}
		<div class="d-flex justify-content-between">
			<div class="">
				<button class={propClassList} on:click={() => {filter('proposals')}}>Proposals</button><button class="btn btn-outline-danger" on:click={() => {filter('proposals')}}>{numbProposals}</button>
				<span class="mx-1">&nbsp;</span>
				<button class={issueClassList} on:click={() => {filter('issues')}}>Suggestions</button><button class="btn btn-outline-danger" on:click={() => {filter('proposals')}}>{numbIssues}</button>
			</div>
			<div>
				<button class="btn btn-sm outline-light" on:click|preventDefault={() => { back() }}>BACK</button>
			</div>
		</div>
		<div class="bg-card mt-4 p-5">
			<table class="table text-white">
				<thead>
					<tr>
						<th scope="col" on:click={() => reorder('title')}><div class="cell-fill pointer">{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Title</div></th>
						<th scope="col" on:click={() => reorder('labels')}><div class="cell pointer">{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} State</div></th>
						<th scope="col"><div class="cell pointer">Comments</div></th>
						<th scope="col" on:click={() => reorder('date')}><div class="cell pointer">{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Created</div></th>
						<th scope="col" on:click={() => reorder('updatedAt')}><div class="cell pointer">{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Updated</div></th>
						<th scope="col"><div class="cell pointer">Actions</div></th>
					</tr>
				</thead>
				<tbody>
					{#each sortedSips as issue}
					<tr>
					<th scope="row" class="py-3">{issue.title}</th>
					<td class="py-3">{ labels(issue.labels) }</td>
					<td class="py-3">{issue.comments.length}</td>
					<td class="py-3">{(!issue.createdAt) ? '' : DateTime.fromMillis(issue.createdAt).toLocaleString({ month: 'short', day: '2-digit', year: '2-digit' })}</td>
					<td class="py-3">{(!issue.updatedAt) ? '' : DateTime.fromMillis(issue.updatedAt).toLocaleString({ month: 'short', day: '2-digit', year: '2-digit' })}</td>
					<td class="py-3">
						<a target="_blank" class="mr-2 text-info" href={issue.htmlUrl}>
							<span data-bs-toggle="tooltip" data-bs-placement="top" title="View on GitHub">
								<ArrowUpRightCircle fill="white" width={20} height={20} />
							</span>
						</a>
					</td>
				</tr>
				{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
	th {
		padding: 0;
		margin: 0;
		font-size: 0.9rem;
	}
	td {
		font-size: 0.9rem;
	}
	tbody>tr>td {
    border-color: #dd216e;
    border-right: none;
    border-left: none;
    border-top: none;
    border-bottom: 1pt solid #dd216e;
	font-family: Gilroy-Light;
}
tbody>tr>th {
    border-color: #dd216e;
    border-right: none;
    border-left: none;
    border-top: none;
    border-bottom: 1pt solid #dd216e;
	font-family: Gilroy-Light;
}
thead{
		border: unset;
		border: none!important;
	}
	thead>tr{
		border: unset;
		border: none!important;
	}
	thead>tr>th{
		border: unset;
		border: none!important;
	}
	.cell {
		border: 1pt solid #dd216e;
		color: #cbcbcb;
		text-transform: uppercase;
		padding: 3px 10px;
		margin-right: 3px;
		white-space: nowrap;
	}
	.cell-fill {
		background-color: #dd216e;
		border: 1pt solid #dd216e;
		color: #111;
		text-transform: uppercase;
		padding: 3px 2px;
		margin-right: 2px;
	}
</style>
