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

	let menuClasses = ' pointer mr-5 '
	$: issueClassList = (filter1 === 'issues') ? menuClasses + ' text-danger' : menuClasses
	$: propClassList = (filter1 === 'issues') ? menuClasses : menuClasses + ' text-danger'

	const back = () => {
		goto(`/sip`, { replaceState: false })
	}

	let filter1 = 'issues'
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
	<title>SIP Suggestions</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="container">
		<div class="d-flex justify-content-between">
			<div class="text-small">
				<span class={issueClassList} on:click={() => {filter('issues')}}>Suggestions ({numbIssues})</span>
				<span class={propClassList} on:click={() => {filter('proposals')}}>Proposals ({numbProposals})</span>
			</div>
			<div>
				<button class="btn btn-sm outline-light" on:click|preventDefault={() => { back() }}>BACK</button>
			</div>
		</div>
		<div class="">
			<table class="table table-striped text-small">
				<thead>
					<tr>
						<th scope="col" class="pointer" on:click={() => reorder('title')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Title</th>
						<th scope="col" class="pointer" on:click={() => reorder('labels')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} State</th>
						<th scope="col">Comments</th>
						<th scope="col" class="pointer" on:click={() => reorder('date')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Created</th>
						<th scope="col" class="pointer" on:click={() => reorder('updatedAt')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Updated</th>
						<th scope="col">Actions</th>
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
								<ArrowUpRightCircle fill="purple" width={20} height={20} />
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
</style>
