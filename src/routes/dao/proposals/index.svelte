<script lang="ts">
  import settings from '$lib/settings'
	import Modal from '$lib/shared/Modal.svelte';
  //import { Tooltip, Toast, Popover } from 'bootstrap';
  import { Gear, ArrowUpRightCircle } from "svelte-bootstrap-icons";
  import { goto } from '$app/navigation';
  import type { ProposalType } from "../../../types/stxeco.type";
  import {tick, onMount} from 'svelte'

  let showModal:boolean;
	const toggleModal = () => {
		showModal = !showModal
	}

  const network = import.meta.env.VITE_NETWORK;
  const explorer = import.meta.env.VITE_STACKS_EXPLORER;

  const contractUrl = (txId:string) => {
      return explorer + '/txid/' + txId + '?chain=' + network
  }

  let item:ProposalType;
  const openSesame = (currentItem:ProposalType) => {
    item = currentItem;
    toggleModal();
  }
  const next = (currentItem:ProposalType) => {
    item = currentItem;
    goto(`/dao/proposals/${item.contractId}`, { replaceState: false }) 
  }
  let bootstrap;
  onMount(async () => {
    bootstrap = (await import('bootstrap'));
    await tick();
      //const tooltipTriggerList = window.document.querySelectorAll('[data-bs-toggle="tooltip"]')
      //const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
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
    <div>

      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <Gear fill="purple" width={20} height={20} />
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <span class="dropdown-item">Status</span>
          <a class="dropdown-item" href="/dao/proposals">Open</a>
          <a class="dropdown-item" href="/">Another action</a>
          <a class="dropdown-item" href="/">Something else here</a>
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
              <th scope="col">Proposed By</th>
              <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each $settings.proposals as item}
              <tr>
              <th scope="row" class="py-3"><span on:click={() => { openSesame(item) }} class="pointer mr-2 text-info">{item.contract.contract_id.split('.')[1]}</span></th>
              <td class="py-3">{item.status}</td>
              <td class="py-3">{item.proposer}</td>
              <!--<td class="py-3">{(!item.created) ? '' : DateTime.fromMillis(item.created).toLocaleString({ month: 'short', day: '2-digit', year: '2-digit' })}</td>-->
              <td class="py-3">
                <a href="/" class="mr-2 text-info" on:click|preventDefault={() => { next(item) }}>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Open proposal">
                    <Gear fill="purple" width={20} height={20} />
                  </span>
                </a>
                <a target="_blank" class="mr-2 text-info" href={contractUrl(item.contractId)}>
                    <span data-bs-toggle="tooltip" data-bs-placement="top" title="Show on explorer">
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
  