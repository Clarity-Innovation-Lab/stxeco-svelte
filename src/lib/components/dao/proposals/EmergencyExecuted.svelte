<script lang="ts">
  import type { ProposalType } from "../../../../types/stxeco.type";

	export let proposal:ProposalType;
</script>

<div class="bg-card py-4 px-5" >
  <div class="text-white">
    <h4>Proposal Executed by Executive Team</h4>
    <p>Proposal was executed at block {proposal.executedAt}.
      {#if typeof proposal.emergencySignals === 'number' && proposal.emergencySignals > 0}
        And was executed by the executive team with {proposal.emergencySignals} votes.
      {/if}
    </p>
  </div>
</div>

<style>
</style>
