<script lang="ts">
import settings from '$lib/settings'
import Modal from '$lib/shared/Modal.svelte';
import ClaritySytaxHighlighter from '$lib/shared/ClaritySytaxHighlighter.svelte';
import type { ExtensionType } from "../../../types/stxeco.type";
import DaoUtils from '$lib/service/DaoUtils';
import { SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";
import ExtensionGridItem from '$lib/components/dao/extensions/ExtensionGridItem.svelte'

let item:ExtensionType;
let componentKey = 0;
let sourceCode: string|undefined = '';
let showModal:boolean;
const toggleModal = () => {
  showModal = !showModal
}

const openSourceModal = (evt) => {
  item = evt.detail;
  sourceCode = item.contract.source_code;
  toggleModal();
}
let sortDir = true;
let sortField = 'title';
const reorder = (sf:string) => {
    sortField = sf;
    sortDir = !sortDir;
    componentKey++;
}
$: sortedProps = DaoUtils.sortExtensions($settings.extensions, sortDir, sortField);
</script>
  
<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
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
        <div class="cols-12">
            <h1 class="text-white"><span class="strokeme-white">DAO</span> Extensions</h1>
            <p class="strapline">The toolkit of the DAO. The active extensions are the mechanics of the DAO. 
              They define how the internals work, governing everything from proposal submission to voting to governance
              to treasury management. We name the extension contracts according to the convention EDEXXX where EDE 
              stands for Ecosystem DAO Extension and XXX is the extension number.
            </p>
          </div>
          <div class="cols-12">
            <div class="m-5 d-flex justify-content-center">
            <div class="filter pointer m-2" on:click={() => reorder('title')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Title</div>
            <div class="filter pointer m-2" on:click={() => reorder('status')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Status</div>
          </div>
        </div>
        <div class="cols-12">
          <div class="row">
            {#key componentKey}
              {#each sortedProps as item}
                  <div class="col-md-6 col-sm-12"><ExtensionGridItem extension={item} on:openSourceModal={openSourceModal}/></div>
              {/each}
            {/key}
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <style>
    .filter {
      border: 1pt solid #787878;
      color: #787878;
      padding: 3px 17px;
}

  </style>
  