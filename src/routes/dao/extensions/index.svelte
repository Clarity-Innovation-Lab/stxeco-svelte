<script lang="ts">
  import settings from '$lib/settings'
	import Modal from '$lib/shared/Modal.svelte';
	import ClaritySytaxHighlighter from '$lib/shared/ClaritySytaxHighlighter.svelte';
  import type { ExtensionType } from "../../../types/stxeco.type";
	import DaoUtils from '$lib/service/DaoUtils';
  import { SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";

  let item:ExtensionType;
  let sourceCode: string|undefined = '';
  let showModal:boolean;
	const toggleModal = () => {
		showModal = !showModal
	}

  const openSesame = (currentItem:ExtensionType) => {
    item = currentItem;
    sourceCode = item.contract.source_code;
    toggleModal();
  }
  const explorerUrl = (txId:string) => {
      return import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;
  }

  let sortDir = true;

  const reorder = () => {
    sortDir = !sortDir;
  }

  $: sortedProps = DaoUtils.sortExtensions($settings.extensions, sortDir);

</script>
  
<svelte:head>
    <title>Extensions</title>
    <meta name="description" content="DAO Extensions - Clarity Smart Contracts" />
</svelte:head>
  
<Modal {showModal} on:click={toggleModal}>
	<div class="source-modal"><ClaritySytaxHighlighter {sourceCode} /></div>
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
              <th scope="col" class="pointer" on:click={() => reorder()}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Name</th>
              <th scope="col">Connected</th>
              <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each sortedProps as item}
              <tr>
              <th class:text-white={item.valid} class:bg-success={item.valid} scope="row" class="py-3"><span class="pointer mr-2">{item?.contract?.contract_id?.split('.')[1]}</span></th>
              <td class:text-white={item.valid} class:bg-success={item.valid} class="pointer py-3" data-bs-toggle="tooltip" data-bs-placement="top" title="State of extension. Connected means this is an active extension in the DAO. Extensions can be activated by proposals">
                <span>
                  {item.valid}
                </span>
              </td>
              <td class:text-white={item.valid} class:bg-success={item.valid} class="pointer py-3">
                <div class="dropdown">
                  <span class="dropdown px-3" type="button" id="dropdownMenuButton" data-toggle="dropdown"  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ...
                  </span>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item pointer text-info" href="/" on:click|preventDefault={() => { openSesame(item) }}>Show Clarity Source Code</a>
                    <a class="dropdown-item pointer text-info" href={explorerUrl(item.contractId)} target="_blank">Show on Explorer</a>
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
  </style>
  