<script>
	import { page } from '$app/stores';
	import settings from '$lib/settings';
  import VotingSnapshot from '$lib/components/dao/proposals/VotingSnapshot.svelte'
  import ProposalMetaDisplay from '$lib/components/dao/proposals/ProposalMetaDisplay.svelte'
  import BallotBox from '$lib/components/dao/proposals/BallotBox.svelte'
  import { goto } from '$app/navigation';

  let contractId = $page.params.contractId;
	let showProposalData = false;
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId)
  const back = () => {
    goto(`/dao/proposals`, { replaceState: false }) 
  }
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
    <div class="my-5">
      <div class="border-bottom pb-5 mb-5 w-100 d-flex justify-content-between text-small">
        <h4>Proposal: <span class="">{ proposal.title }</span></h4>
        <p>
          <button class="btn btn-sm outline-light" on:click|preventDefault={() => { back() }}>BACK</button>
          {#if proposal.proposalData}<button class="btn btn-sm outline-light" on:click={() => showProposalData = !showProposalData}>show info</button>{/if}
        </p>
      </div>
    </div>
	  {#if showProposalData && proposal.proposalData}
    <div>
      <VotingSnapshot {proposal}/>
    </div>
	  {/if}
    {#if proposal.proposalData}
    <div>
      <BallotBox {proposal} />
    </div>
    {/if}

    <ul class="nav nav-tabs" id="myTab" role="tablist">
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
  </section>

<style>
</style>
