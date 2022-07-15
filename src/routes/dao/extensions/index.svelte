<script lang="ts">
  import settings from '$lib/settings'
	import Modal from '$lib/shared/Modal.svelte';

  let item;
  let showModal;
	const toggleModal = () => {
		showModal = !showModal
	}

  const openSesame = (currentItem) => {
    item = currentItem;
    toggleModal();
  }
</script>
  
<svelte:head>
    <title>Extensions</title>
    <meta name="description" content="DAO Extensions - Clarity Smart Contracts" />
</svelte:head>
  
<Modal {showModal} on:click={toggleModal}>
	<div class="source-modal"><pre style="width: 95%">{item.contract.source_code}</pre></div>
	<div slot="title">
		<h3>Extension: {item.contract.contract_id.split('.')[1]}</h3>
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
              <th scope="col">Name</th>
              <th scope="col">Connected</th>
              </tr>
            </thead>
            <tbody>
              {#each $settings.extensions as item}
              <tr>
              <th scope="row" class="py-3"><span on:click={() => { openSesame(item) }} class="pointer mr-2 text-info">{item.contract.contract_id.split('.')[1]}</span></th>
              <td class="pointer py-3" data-bs-toggle="tooltip" data-bs-placement="top" title="State of extension. Connected means this is an active extension in the DAO. Extensions can be activated by proposals">
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
  