<script lang="ts">
  import settings from '$lib/settings'
	import Modal from '$lib/shared/Modal.svelte';
  import type { ExtensionType } from "../../../types/stxeco.type";
	import DaoUtils from '$lib/service/DaoUtils';
  import { SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";

  let item:ExtensionType;
  let showModal:boolean;
	const toggleModal = () => {
		showModal = !showModal
	}

  const openSesame = (currentItem:ExtensionType) => {
    item = currentItem;
    toggleModal();
  }

  let sortDir = true;
  let sortField = 'title';

  const reorder = (sf:string) => {
    sortField = sf;
    sortDir = !sortDir;
  }

  $: sortedProps = DaoUtils.sortExtensions($settings.extensions, sortDir);

</script>
  
<svelte:head>
    <title>Extensions</title>
    <meta name="description" content="DAO Extensions - Clarity Smart Contracts" />
</svelte:head>
  
<Modal {showModal} on:click={toggleModal}>
	<div class="source-modal"><pre style="width: 95%">{item.contract.source_code}</pre></div>
	<div slot="title">
		<h3>Extension: {item.contractId.split('.')[1]}</h3>
	</div>
</Modal>

  <section>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h4>Extensions</h4>
          <table class="table table-striped text-small">
            <thead>
              <tr>
              <th scope="col" class="pointer" on:click={() => reorder('title')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Name</th>
              <th scope="col">Connected</th>
              </tr>
            </thead>
            <tbody>
              {#each sortedProps as item}
              <tr>
              <th class:text-white={item.valid} class:bg-success={item.valid} scope="row" class="py-3"><span on:click={() => { openSesame(item) }} class="pointer mr-2">{item.contract.contract_id.split('.')[1]}</span></th>
              <td class:text-white={item.valid} class:bg-success={item.valid} class="pointer py-3" data-bs-toggle="tooltip" data-bs-placement="top" title="State of extension. Connected means this is an active extension in the DAO. Extensions can be activated by proposals">
                <span>
                  {item.valid}
                </span>
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
  </style>
  