<script context="module" lang="ts">
export async function load({ fetch }) {
	const res = await fetch(import.meta.env.VITE_CLARITYLAB_API + '/mesh/v2/gh-issues')
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
}
</script>

<script lang="ts">
import type { IssueType } from "../../types/stxeco.type";
import { ArrowUpRightCircle } from "svelte-bootstrap-icons";
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

let menuClasses = 'border-right pointer pl-5 '
$: issueClassList = (filter1 === 'issues') ? menuClasses + ' text-danger' : menuClasses
$: propClassList = (filter1 === 'issues') ? menuClasses : menuClasses + ' text-danger'
$: filteredIssues = filtered

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

</script>

<svelte:head>
	<title>SIP Suggestions</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="container">
		<div class="row">
			<div class="col-12 text-small">
				<span class={issueClassList} on:click={() => {filter('issues')}}>Suggestions ({numbIssues})</span>
				<span class={propClassList} on:click={() => {filter('proposals')}}>Proposals ({numbProposals})</span>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-12">
				<table class="table table-striped text-small">
					<thead>
					  <tr>
						<th scope="col">Title</th>
						<th scope="col">State</th>
						<th scope="col">Comments</th>
						<th scope="col">Date</th>
						<th scope="col">Actions</th>
					  </tr>
					</thead>
					<tbody>
						{#each filteredIssues as issue}
						<tr>
						<th scope="row" class="py-3">{issue.title}</th>
						<td class="py-3">{ labels(issue.labels) }</td>
						<td class="py-3">{issue.comments.length}</td>
						<td class="py-3">{(!issue.createdAt) ? '' : DateTime.fromMillis(issue.createdAt).toLocaleString({ month: 'short', day: '2-digit', year: '2-digit' })}</td>
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
