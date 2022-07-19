<script lang="ts">
  import settings from '$lib/settings'
	import Modal from '$lib/shared/Modal.svelte';
  //import { Tooltip, Toast, Popover } from 'bootstrap';
  import { Gear, ArrowUpRightCircle, CodeSlash } from "svelte-bootstrap-icons";
  import { goto } from '$app/navigation';
  import type { ProposalType, DaoPropertyType } from "../../../types/stxeco.type";
  import {tick, onMount} from 'svelte'
  import StacksAuthStore from '../../../stores/StacksAuthStore.js'

  let showModal:boolean;
	const toggleModal = () => {
		showModal = !showModal
	}

  const emergencia = import.meta.env.VITE_DAO_EMERGENCY_TEAM;
  const network = import.meta.env.VITE_NETWORK;
  const explorer = import.meta.env.VITE_STACKS_EXPLORER;

  const contractUrl = (txId:string) => {
      return explorer + '/txid/' + txId + '?chain=' + network
  }

  const executiveTeam = emergencia.indexOf($StacksAuthStore.stxAddress) > -1
  let item:ProposalType;
  const hasSufficientBalance = (currentItem:ProposalType) => {
    const userProps = $settings.userProperties
    const hasBalance = userProps.find((o) => o.functionName === 'edg-has-percentage-balance').value.value
    return hasBalance
    /**
    const daoProps = $settings.daoProperties
    const tokeBalance = userProps.find((o) => o.functionName === 'edg-get-balance').value.value
    const tokenBalanceLocked = userProps.find((o) => o.functionName === 'edg-get-locked').value.value
    const proposeFactor = daoProps.find((o) => o.id === 'propose-factor').value
    return (tokeBalance + tokenBalanceLocked) * (proposeFactor.value) >= tokeBalance * 1000
    **/
  }
  const openSesame = (currentItem:ProposalType) => {
    item = currentItem;
    toggleModal();
  }
  const openProposal = (currentItem:ProposalType) => {
    item = currentItem;
    goto(`/dao/proposals/${item.contractId}`, { replaceState: false }) 
  }
  const submitProposal = () => {
    goto('/dao/proposal-submission', { replaceState: false }) 
  }
  const getStatusMessage = (proposal:ProposalType) => {
    const stacksTipHeight = $settings.info.stacks_tip_height
    let message = 'not yet submitted'
    if (proposal.proposalData) {
      if (proposal.proposalData.concluded) {
        if (proposal.proposalData.passed) message = 'Proposal Passed'
        else message = 'Proposal failed'
      } else if (stacksTipHeight > proposal.proposalData.endBlockHeight) {
        message = 'Voting ended'
      }
      else if (stacksTipHeight < proposal.proposalData.startBlockHeight) {
        message = 'Starts in ' + (proposal.proposalData.startBlockHeight - stacksTipHeight) + ' blocks.'
      }
      else {
        message = 'Cast your vote!'
      }
    }
    return message;
  }
  const getStatusTip = (status:string) => {
    if (status === 'draft') {
      return 'Proposal in draft status and can still be edited'
    } else if (status === 'deployed') {
      return 'Proposal contract is deployed but not yet submitted to the DAO'
    } else if (status === 'submitted') {
      return 'Proposal contract has been submitted to the DAO'
    } else {
      return 'Unknown status'
    }
  }

  let bootstrap:any;
  onMount(async () => {
    bootstrap = (await import('bootstrap'));
    await tick();
      const tooltipTriggerList = window.document.querySelectorAll('[data-bs-toggle="tooltip"]')
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
      const popoverTriggerList = window.document.querySelectorAll('[data-bs-toggle="dropdown"]')
      const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Dropdown(popoverTriggerEl))

  })
  </script>
  
  <svelte:head>
    <title>DAO Proposals</title>
    <meta name="description" content="Ecosystem DAO proposals" />
  </svelte:head>
  
  <Modal {showModal} on:click={toggleModal}>
    <div class="source-modal"><pre style="width: 95%">{item.contract.source_code}</pre></div>
    <div slot="title">
      <h3>Proposal: {item.contract.contract_id.split('.')[1]}</h3>
    </div>
  </Modal>
  
  <section>
  </section>

  <section>
    <div class="container">
      {#if hasSufficientBalance}
        <a class="dropdown-item" href="/" on:click|preventDefault={() => { submitProposal() }}>Submit a Proposal</a>
      {:else}
        <span class="dropdown-item">Insufficient balance in this account to submit proposals</span>
      {/if}

      <div class="row">
        <div class="col-12">
          <table class="table table-striped text-small">
            <thead>
              <tr>
              <th scope="col">Title</th>
              <th scope="col">State</th>
              <th scope="col">Proposed By</th>
              <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each $settings.proposals as item}
              <tr>
                <th scope="row" class="py-3"><a class="text-info" href={'/dao/proposals/' + item.contract.contract_id}>{item.contract.contract_id.split('.')[1]}</a></th>
                <td class="py-3">{item.status}</td>
                <td class="py-3">{item.proposer}</td>
                <td class="py-3">
                  <div class="dropdown">
                    <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <Gear fill="purple" width={20} height={20} />
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { openSesame(item) }}><CodeSlash fill="purple" width={20} height={20} /> Show Clarity Source Code</a>
                      <a class="dropdown-item mb-2 border-bottom pointer text-info" href={contractUrl(item.contractId)} target="_blank"><ArrowUpRightCircle fill="purple" width={20} height={20} /> Show on Explorer</a>
                      <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { openProposal(item) }} target="_blank"><ArrowUpRightCircle fill="purple" width={20} height={20} /> Open Proposal</a>
                      {#if !item.proposalData && hasSufficientBalance}
                      <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/dao/proposals/submissions" data-bs-toggle="tooltip" data-bs-placement="top" title={getStatusTip(item.status)}><ArrowUpRightCircle fill="purple" width={20} height={20} /> Submit Proposal</a>
                      {:else}
                      <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { openProposal(item) }} target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" title={getStatusTip(item.status)}>{getStatusMessage(item)}</a>
                      {/if}
                      {#if executiveTeam}
                      <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { openSesame(item) }} data-bs-toggle="tooltip" data-bs-placement="top" title="Emergency proposals can only be sumbitted by executive team members"><ArrowUpRightCircle fill="purple" width={20} height={20} /> Emergency Proposal</a>
                      {/if}
                    </div>
                  </div>
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
    /**
    section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    **/
  </style>
  