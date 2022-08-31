<script lang="ts">
	import { page } from '$app/stores';
  import type { ProposalType } from "../../../../types/stxeco.type";

	export let proposal:ProposalType;
</script>

<section>
  {#if  typeof proposal.executedAt === 'number' && proposal.executedAt > 0}
  <div class="">
    <p>Proposal was executed at block {proposal.executedAt}.
      {#if typeof proposal.emergencySignals === 'number' && proposal.emergencySignals > 0}
        And was executed by the executive team with {proposal.emergencySignals} votes.
      {/if}
    </p>
    </div>
  {/if}
</section>

<style>
</style>
