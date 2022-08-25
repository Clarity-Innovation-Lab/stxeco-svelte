<script context="module">
export async function load({ params, fetch }) {
  try {
    const contractId = params.contractId;
    let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/proposal/' + contractId;
    let res = await fetch(url);
    if (res.ok) {
        const proposal = await res.json();
				return {
					props: {
            contractId,
            proposal
					}
				}
			} else {
				return {
					status: res.status,
					error: new Error('Could not fetch issues')
				}
			}
  } catch (e) {
    console.log(e);
  }
}
</script>

<script lang="ts">
import settings from '$lib/settings';
import ChainUtils from '$lib/service/ChainUtils';
import {onMount} from 'svelte'
import VotingSchedule from '$lib/components/dao/voting/VotingSchedule.svelte'
import PropBallotBox from '$lib/components/dao/voting/PropVotingBallotBox.svelte'
import SnapBallotBox from '$lib/components/dao/voting/SnapVotingBallotBox.svelte'
import { goto } from '$app/navigation';
import ExecutedBanner from '$lib/components/dao/proposals/ExecutedBanner.svelte'
import type { ProposalType } from "../../../types/stxeco.type";
import { getAccount } from '@micro-stacks/svelte';

const account = getAccount();

export let proposal:ProposalType;
export let contractId:string;

const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false
// export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId)
const back = () => {
  goto(`/dao/proposals`, { replaceState: false })
}
const submit = () => {
  goto(`/dao/proposals/submission/${contractId}`, { replaceState: false })
}
let showEmergVoting = false;
onMount(async () => {
  if (proposal.proposalData) {
    const callData = {
      path: '/extended/v1/address/' + $account.stxAddress + '/balances?until_block=' + proposal.proposalData?.startBlockHeight,
      httpMethod: 'get'
    }
    const response = await ChainUtils.postToApi('/v2/accounts', callData);
    balanceAtHeight = ChainUtils.fromMicroAmount(response.stx.balance)
  }
})
$: balanceAtHeight = 0
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
    <div class="my-2">
      <div class="border-bottom pb-2 mb-5 w-100 d-flex justify-content-between text-small">
        <h4>Proposal: <span class="">{ proposal.title }</span></h4>
        <p>
          <button class="btn btn-sm outline-light" on:click|preventDefault={() => { back() }}>BACK</button>
          {#if executiveTeamMember}<button class="btn btn-sm outline-light" on:click={() => showEmergVoting = !showEmergVoting}>...</button>{/if}
        </p>
      </div>
    </div>
	  {#if proposal.deployTxId}
      {#if proposal.votingContract === 'ede007-snapshot-proposal-voting'}
        <div class="jumbo">
          <h6 class="my-3">Proposal requires support before voting can start...</h6>
          <button class="btn btn-outline-primary" on:click|preventDefault={() => { submit() }}>fund proposal</button>
        </div>
      {:else}
        <div class="jumbo">
          <h6 class="my-3">Proposal is deployed and ready to submit to the DAO</h6>
          <button class="btn btn-outline-primary" on:click|preventDefault={() => { submit() }}>submit</button>
        </div>
      {/if}
	  {/if}
	  <ExecutedBanner {proposal} />
    {#if proposal.proposalData}
      <div>
        <VotingSchedule {proposal}/>
      </div>
      <div>
        {#if proposal.votingContract === 'ede001-proposal-voting'}
          <PropBallotBox {proposal} />
        {:else if proposal.votingContract === 'ede007-snapshot-proposal-voting'}
          <SnapBallotBox {proposal} {balanceAtHeight}/>
        {/if}
      </div>
    {/if}

    <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
      <div class="source-modal"><pre style="width: 95%">{proposal.contract.source_code}</pre></div>
    </div>
    <!--
    <ul class="mt-5 nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Contract</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Description</button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
        <div class="source-modal"><pre style="width: 95%">{proposal.contract.source_code}</pre></div>
      </div>
      <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
        <ProposalMetaDisplay {proposal} />
      </div>
    </div>
    -->  
  </section>

<style>
</style>
