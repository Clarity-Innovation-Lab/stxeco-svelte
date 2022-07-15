<script lang="ts">
  import settings from '$lib/settings'
	import Modal from '$lib/shared/Modal.svelte';
  import type { ProposalType } from "../../../types/stxeco.type";
  import { ArrowUpRightCircle } from "svelte-bootstrap-icons";
  import { DateTime } from 'luxon'

  let item;
  let showModal;
	const toggleModal = () => {
		showModal = !showModal
	}

  const openSesame = (currentItem) => {
    item = currentItem;
    toggleModal();
  }
  const canPropose = () => {
      return true
  }    
  </script>
  
  <svelte:head>
    <title>DAO Proposals</title>
    <meta name="description" content="Ecosystem DAO proposals" />
  </svelte:head>
  
  <Modal {showModal} on:click={toggleModal}>
    <div class="source-modal"><pre style="width: 95%">{item.proposalContract.source_code}</pre></div>
    <div slot="title">
      <h3>Proposal: {item.proposalContract.contract_id.split('.')[1]}</h3>
    </div>
  </Modal>
  
  <section>
  </section>

  <section>
    <div></div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <table class="table table-striped text-small">
            <thead>
              <tr>
              <th scope="col">Title</th>
              <th scope="col">State</th>
              <th scope="col">Proposed By</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each $settings.proposals as item}
              <tr>
              <th scope="row" class="py-3"><span on:click={() => { openSesame(item) }} class="pointer mr-2 text-info">{item.proposalContract.contract_id.split('.')[1]}</span></th>
              <td class="py-3">{item.status}</td>
              <td class="py-3">{item.proposer}</td>
              <td class="py-3">{(!item.created) ? '' : DateTime.fromMillis(item.created).toLocaleString({ month: 'short', day: '2-digit', year: '2-digit' })}</td>
              <td class="py-3">
                <a class="mr-2 text-info" href={'/dao/proposals/' + item.contractId}>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Open proposal">
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
  