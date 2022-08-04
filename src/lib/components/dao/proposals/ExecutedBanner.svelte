<script lang="ts">
	import { page } from '$app/stores';
  import type { ProposalType } from "../../../../types/stxeco.type";

	export let proposal:ProposalType;
</script>

<section>
  {#if proposal.executedAt > 0}
  <div class="bg-success text-white p-4">
    <p>Proposal was executed at block {proposal.executedAt}</p>
    {#if proposal.emergencySignals > 0}
    <p>
      Proposal was executed by executive team with {proposal.emergencySignals} signals.
    </p>
    {/if}
    </div>
  {/if}
</section>

<style>
</style>
