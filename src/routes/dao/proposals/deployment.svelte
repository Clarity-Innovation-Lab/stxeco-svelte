<script lang="ts">
import settings from '$lib/settings';
import { DateTime } from 'luxon'
import ProposalDeploymentForm from '$lib/components/dao/proposals/ProposalDeploymentForm.svelte';
import LoadFile from '$lib/components/dao/proposals/LoadFile.svelte';
import { CaretRight, CaretRightFill } from "svelte-bootstrap-icons";
import type { ProposalType } from 'src/types/stxeco.type.js';
import { getAccount } from "@micro-stacks/svelte";
import { getOpenContractDeploy } from "@micro-stacks/svelte";

const contractDeploy = getOpenContractDeploy();

const account = getAccount();

const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false
let canSubmit = $settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance')?.value?.value || false;
if (!canSubmit) {
  canSubmit = $account.stxAddress === import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
}
let showNoop = false;
let showFromFile = false;
const contractSource = `
;; DAO: Ecosystem DAO
;; Title: <title>
;; Author: <author>
;; Synopsis: <synopsis>
;; Description: <description>

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
(ok true)
)
`
let newProposal:ProposalType;
let showDeployButton = false;
let replacedSource = contractSource;
let contractName = '';
const addNewPoll = (e: { detail:  { contractName: string; title: string; author: string; synopsis: string; description: string; }; }) => {
  contractName = e.detail.contractName;
  newProposal = {
    title: e.detail.title,
    proposer: $account.stxAddress,
    status: 'deployed',
    created: DateTime.now().ts,
    updated: DateTime.now().ts,
    contractId: $account.stxAddress + '.' + contractName,
    contract: {
      source_code: replacedSource,
      contract_id: $account.stxAddress + '.' + contractName
    }
  }
  replacedSource = contractSource.replace('<title>', e.detail.title);
  replacedSource = replacedSource.replace('<author>', e.detail.author);
  replacedSource = replacedSource.replace('<synopsis>', e.detail.synopsis);
  replacedSource = replacedSource.replace('<description>', e.detail.description);
  showDeployButton = true;
}

const fileLoaded = (e: { detail: { contractName: string; source: string; }; }) => {
  replacedSource = e.detail.source;
  contractName = e.detail.contractName;
  showDeployButton = true;
  newProposal = {
    title: contractName,
    proposer: $account.stxAddress,
    status: 'deployed',
    created: DateTime.now().ts,
    updated: DateTime.now().ts,
    contractId: $account.stxAddress + '.' + contractName,
    contract: {
      source_code: replacedSource,
      contract_id: $account.stxAddress + '.' + contractName
    }
  }
}

let txId: string;
const deployContract = async () => {
  await $contractDeploy.openContractDeploy({
    codeBody: replacedSource,
    contractName: contractName,
    onFinish: data => {
      txId = data.txId;
      newProposal.status = 'deploying'
      newProposal.deployTxId = data.txId
      let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/proposals';
      postData(url, newProposal)
    },
    onCancel: () => {
      console.log('popup closed!');
    },
  });
}
const postData = async (url:string, data:any) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}
$: newSource = replacedSource;
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;
</script>

<svelte:head>
  <title>Contract Deployment</title>
  <meta name="description" content="Contract Deployment" />
</svelte:head>
  
<section>
  <div class="container">
    {#if canSubmit || executiveTeamMember}
    <h3><span>Options for Deploying a Proposal Contract</span></h3>
    <div class="mt-4 pointer" on:click={() => { showNoop = true; showFromFile = false; showDeployButton = false }}>{#if showNoop}<CaretRightFill fill="purple"/>{:else}<CaretRight />{/if} Deploy simple voting only (noop) proposal</div>
    <div class="pointer" on:click={() => { showNoop = false; showFromFile = true; showDeployButton = false }}>{#if showFromFile}<CaretRightFill fill="purple"/>{:else}<CaretRight/>{/if} Upload a fully unit tested proposal</div>
    {:else}
    <div class="container">Unable to deploy proposal</div>
    {/if}
    <div class="row mt-3">
      {#if !txId && showDeployButton}
      <div class="my-3 d-flex justify-content-start">
        <button class="btn btn-sm outline-light" on:click|preventDefault={() => { deployContract() }}>Deploy</button>
      </div>
      {/if}
      {#if txId}
      <div>
        <a href={explorerUrl} target="_blank">View on explorer</a>
      </div>
      {/if}
          {#if showNoop}
      <div class="col-md-6 col-sm-12">
        <ProposalDeploymentForm on:addNewPoll={addNewPoll} />
      </div>
      <div class="col-md-6 col-sm-12">
          Deploy a standard vote only proposal.
          <div><pre class="source-code">{newSource}</pre></div>
      </div>
      {/if}
      {#if showFromFile}
      <div class="col-12">
        {#if !showDeployButton}
        <LoadFile on:fileLoaded={fileLoaded}/>
        {:else}
        <div><pre class="source-code">{newSource}</pre></div>
        {/if}
      </div>
      {/if}
    </div>
  </div>
</section>
  
  <style>
  </style>
  