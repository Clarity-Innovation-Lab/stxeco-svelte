<script lang="ts">
  import StacksAuthStore from '../../../stores/StacksAuthStore.js'
  import settings from '$lib/settings';
  import { DateTime } from 'luxon'
  import { client } from '$lib/micro-stacks-client';
  import { TxType } from '@micro-stacks/client';
  import ProposalDeploymentForm from '$lib/components/dao/proposals/ProposalDeploymentForm.svelte';
  import LoadFile from '$lib/components/dao/proposals/LoadFile.svelte';
  import { CaretRight, CaretRightFill } from "svelte-bootstrap-icons";
  import type { ProposalType } from 'src/types/stxeco.type.js';

  const emergencia = import.meta.env.VITE_DAO_EMERGENCY_TEAM;
  const executiveTeam = emergencia.indexOf($StacksAuthStore.stxAddress) > -1;
  const percentageBal = $settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance');
  const canSubmit = percentageBal?.value.vlaue || false;

  let showNoop = false;
  let showFromFile = false;
  const contractSource = `
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
      proposer: $StacksAuthStore.stxAddress,
      status: 'deployed',
      created: DateTime.now().ts,
      updated: DateTime.now().ts,
      contractId: $StacksAuthStore.stxAddress + '.' + contractName,
      contract: {
        source_code: replacedSource,
        contract_id: $StacksAuthStore.stxAddress + '.' + contractName
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
      proposer: $StacksAuthStore.stxAddress,
      status: 'deployed',
      created: DateTime.now().ts,
      updated: DateTime.now().ts,
      contractId: $StacksAuthStore.stxAddress + '.' + contractName,
      contract: {
        source_code: replacedSource,
        contract_id: $StacksAuthStore.stxAddress + '.' + contractName
      }
    }
	}

  $: newSource = replacedSource;
  const deployContract = async () => {
    const txOptions = {
      codeBody: replacedSource,
      contractName: contractName,
      appDetails: {
        name: 'Ecosystem DAO',
        icon: '/img/logo.png'
      },
      onCancel: (error: any) => {
        console.error(error)
      },
      onFinish: (result: { txId: string; txRaw: any; stacksTransaction: any; }) => {
        console.log(result)
        newProposal.status = 'deploying'
        newProposal.deployTxId = result.txId
        let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/proposals';
        postData(url, newProposal)
      }
    }
    client.signTransaction(TxType.ContractDeploy, txOptions);
  }
  const postData = async (url:string, data:any) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      //mode: 'cors', // no-cors, *cors, same-origin
      //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      //redirect: 'follow', // manual, *follow, error
      //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  </script>
  
  <svelte:head>
    <title>Contract Deployment</title>
    <meta name="description" content="Contract Deployment" />
  </svelte:head>
  
<section>
  <div class="container">
    {#if canSubmit || executiveTeam}
    <h3><span>Options for Deploying a Proposal Contract</span></h3>
    <div class="my-4 pointer" on:click={() => { showNoop = true; showFromFile = false; showDeployButton = false }}>{#if showNoop}<CaretRightFill fill="purple"/>{:else}<CaretRight />{/if} Deploy simple voting only (noop) proposal</div>
    <div class="pointer" on:click={() => { showNoop = false; showFromFile = true; showDeployButton = false }}>{#if showFromFile}<CaretRightFill fill="purple"/>{:else}<CaretRight/>{/if} Upload a fully unit tested proposal</div>
    {:else}
    <div class="container">Unable to deploy proposal</div>
    {/if}
    <div class="row mt-5">
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
      {#if showDeployButton}
      <div class="mt-3 d-flex justify-content-start">
        <button class="btn btn-sm outline-light" on:click|preventDefault={() => { deployContract() }}>Deploy</button>
      </div>
      {/if}
    </div>
  </div>
</section>
  
  <style>
  </style>
  