<script lang="ts">
  import { createEventDispatcher } from 'svelte';

	export let currentFilter:string|null;
  if (!currentFilter) currentFilter = 'all';
  const filterValues = ['all', 'emergexec', 'voting', 'funding', 'concluded', 'deployed', 'draft']
  let dispatch = createEventDispatcher();
</script>

<section>
  <div class="preview mb-5">
    <div class="dropdown">
      <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {currentFilter}
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {#each filterValues as filter }
          <span class="dropdown-item mb-2 border-bottom pointer text-info" on:click={() => dispatch('propFilterChange', filter)}>{filter}</span>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
</style>
