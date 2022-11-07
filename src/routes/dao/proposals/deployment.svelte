<script lang="ts">
import settings from '$lib/settings';
import { DateTime } from 'luxon'
import ProposalDeploymentForm from '$lib/components/dao/deployment/ProposalDeploymentForm.svelte';
import LoadFile from '$lib/components/dao/deployment/LoadFile.svelte';
import type { ProposalType } from 'src/types/stxeco.type.js';
import { getAccount } from "@micro-stacks/svelte";
import { getOpenContractDeploy } from "@micro-stacks/svelte";
import { goto } from '$app/navigation';
import Modal from '$lib/shared/Modal.svelte';
import DaoRules from '$lib/components/dao/proposals/DaoRules.svelte';

const contractDeploy = getOpenContractDeploy();

const account = getAccount();

let showRulesModal:boolean;
const openRulesModal = () => {
  showRulesModal = true;
}
const closeModal = () => {
  showRulesModal = false;
}

const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false
let canSubmit = true; //$settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance')?.value?.value || false;
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

(impl-trait '${import.meta.env.VITE_DAO_DEPLOY_ADDRESS}.proposal-trait.proposal-trait)

(define-public (execute (sender principal))
        (ok true)
)
`
let newProposal:ProposalType;
let showDeployButton = false;
let updated = false;
let replacedSource = contractSource;
let contractName = '';
const addNewPoll = (e: { detail:  { contractName: string; title: string; author: string; synopsis: string; description: string; }; }) => {
  contractName = e.detail.contractName;
  newProposal = {
    title: e.detail.title,
    proposer: $account.stxAddress,
    funding: 0,
    status: { name: 'deploying', color: '', colorCode: '' },
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
    updated = true;
}

const fileLoaded = (e: { detail: { contractName: string; source: string; }; }) => {
  replacedSource = e.detail.source;
  contractName = e.detail.contractName;
  showDeployButton = true;
  newProposal = {
    title: contractName,
    proposer: $account.stxAddress,
    funding: 0,
    status: { name: 'deploying', color: '', colorCode: '' },
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
      newProposal.status = { name: 'deploying', color: '', colorCode: '' };
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
$: newSourceValid = replacedSource.indexOf(import.meta.env.VITE_DAO_DEPLOY_ADDRESS + '.proposal-trait.proposal-trait') > -1 || $account.stxAddress === import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;
$: noopColor = (showNoop) ? 'warning' : 'grey';
$: opColor = (showFromFile) ? 'warning' : 'grey';
</script>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<Modal showModal={showRulesModal} on:click={closeModal}>
    <div class="source-modal"><DaoRules /></div>
    <div slot="title">
        <h3>DAO Rules</h3>
    </div>
</Modal>

<section class="text-white">
  <div class="row">
    <div class="cols-12">
      <h1 class="text-white"><span class="strokeme-white">Make</span> a Proposal</h1>
      <p class="strapline">Choose the type of proposal</p>
        <p class="strapline">1) <span class="text-warning">Non Operational</span> proposals
        are advisory - the subject is described in the comments of the Clarity contract.</p>
        <p class="strapline">2) <span class="text-warning">Operational</span> proposals are contractual - they are expressed by the code
        of the proposal contract - they are automatically executed if the vote carries and they
        can do all manner of things including activating/deactivating extension, disbursing funds, 
        purchasing/transferring NFTs and more.</p>
    </div>
    <div class="row">
      <div class="cols-12 text-end my-3">
        <p class="w-100 text-right">
          <!-- <button class={'btn btn-outline-white'} on:click|preventDefault={() => { openRulesModal() }}>dao rules</button>-->
          <button class={'btn btn-outline-white'} on:click|preventDefault={() => { goto(`/dao/proposals`) }}>back</button>
        </p>
      </div>
    </div>
    <div class="row">
      <div class="cols-12 text-center my-3">
          {#if canSubmit || executiveTeamMember}
          <p class="">
            <button class={'mx-2 mb-3 btn rounded btn-outline-' + noopColor} on:click={() => { showNoop = true; showFromFile = false; showDeployButton = false }}>Non-Operational Proposal</button>
            <button class={'mx-2 mb-3 btn rounded btn-outline-' + opColor} on:click={() => { showNoop = false; showFromFile = true; showDeployButton = false }}>Operational Proposal</button>
          </p>
          {:else}
          <div class="container">The ability to create proposals is restricted to exec team members until after the 2.1 Upgrade Vote.</div>
          {/if}
      </div>
    </div>
    {#if showNoop}
      <div class="row mx-0">
        <div class="col-md-6 col-sm-12">
            <pre class="source-code">{newSource}</pre>
        </div>
        <div class="col-md-6 col-sm-12">
          {#if !showDeployButton}
            <ProposalDeploymentForm on:addNewPoll={addNewPoll} />
          {:else if txId}
          <div>
            <a href={explorerUrl} target="_blank">View on explorer</a>
          </div>
          {:else}
          <div class="text-center mt-5">
            {#if newSourceValid}
              <p>Contract ready to be deployed - once its fully deployed crowd fund support for this proposal</p>
              <button class="btn rounded btn-warning" on:click|preventDefault={() => { deployContract() }}>Deploy Proposal</button>
            {:else}
              <p class="bg-danger p-3">Contract is not ready to be deployed - please check the contract implements the trait correctly - using the full address given above.</p>
              <button disabled class="btn rounded text-danger">Proposal Trait Invalid</button>
            {/if}
          </div>
          {/if}
        </div>
      </div>
    {:else if showFromFile}
    <div class="row mx-0">
      <div class="col-12">
        <h4>Upload Contract</h4>
        <p>Please ensure the contract is;</p>
        <ol>
          <li>fully clarinet unit tested</li>
          <li>implements <strong>'{import.meta.env.VITE_DAO_DEPLOY_ADDRESS}.proposal-trait</strong></li>
        </ol>
          {#if !showDeployButton}
            <LoadFile on:fileLoaded={fileLoaded}/>
          {:else}
          <div class="row">
              <div class="col-md-8 col-sm-12">
                <pre class="source-code">{newSource}</pre>
              </div>
              <div class="col-md-4 col-sm-12">
                {#if txId}
                  <div>
                    <a href={explorerUrl} target="_blank">View on explorer</a>
                  </div>
                {:else}
                  <div class="text-center mt-5">
                    {#if newSourceValid}
                    <p>Contract ready to be deployed - once its fully deployed crowd fund support for this proposal</p>
                    <button class="btn rounded btn-warning" on:click|preventDefault={() => { deployContract() }}>Deploy Proposal</button>
                    {:else}
                    <p class="bg-danger p-3">Contract is not ready to be deployed - please check the contract implements the trait correctly - using the full address given above.</p>
                    <button disabled class="btn rounded text-danger">Proposal Trait Invalid</button>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</section>
<!--
<section>
  <div class="container">
    <div class="row mt-3">
      {#if !txId && showDeployButton}
        <div class="my-3 d-flex justify-content-start">
          {#if newSourceValid}
          <button class="btn btn-sm outline-light" on:click|preventDefault={() => { deployContract() }}>Deploy Proposal Contract</button>
          {:else}
          <button disabled class="btn btn-sm text-danger">Proposal Trait Invalid</button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</section>
-->
  
<style>
.rounded {
  border-radius: 50px !important;
	text-transform: uppercase;
  border: 1pt solid #444444;
  border-radius: 50px !important;
  font-size: 1.15rem;;
  padding: 15px 25px;
}
</style>
  