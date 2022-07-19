<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';

	let contractId = $page.params.contractId;
	let stacksTipHeight = $settings.info.stacks_tip_height;
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);

  const totalSupply = $settings.daoProperties?.find((o) => o.id === 'get-total-supply').value;
  const tokenBalance = $settings.userProperties?.find((o) => o.functionName === 'edg-get-balance').value.value
  const tokenBalanceLocked = $settings.userProperties?.find((dp) => dp.functionName === 'edg-get-locked').value.value
  const totalDelegatedToMe = $settings.userProperties?.find((dp) => dp.functionName === 'edg-get-total-delegated').value.value

</script>

<section>
  <div class="preview mb-5">
    <div class="row">
      <div class="cols-4">Now at</div>  
      <div class="cols-8">{ $settings.info.stacks_tip_height }</div>  
    </div>
    <div class="row">
      <div class="col-4">Voting starts:</div>  
      <div class="col-8">{ proposal.proposalData.startBlockHeight }</div>  
    </div>
    <div class="row">
      <div class="col-4">Voting ends:</div>  
      <div class="col-8">{ proposal.proposalData.endBlockHeight }</div>  
    </div>

    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-12">Your Balance</div>  
        </div>
        <div class="row">
          <div class="col-md-6 cols-sm-12">Unlocked</div>  
          <div class="col-md-6 cols-sm-12">{ tokenBalance }</div>  
        </div>
        <div class="row">
          <div class="col-md-6 cols-sm-12">locked</div>  
          <div class="col-md-6 cols-sm-12">{ tokenBalanceLocked }</div>  
        </div>
        <div class="row">
          <div class="col-md-6 cols-sm-12">delegated</div>  
          <div class="col-md-6 cols-sm-12">{ totalDelegatedToMe }</div>  
        </div>
        <div class="row text-center mt-3">
          <div class="cols-sm-12">Proposed by: { proposal.proposalData.proposer }</div>  
        </div>
        <div class="row text-center mt-3">
          <div class="cols-sm-12">Total Supply: { totalSupply }</div>  
        </div>
      </div>  
    </div>
  </div>
</section>

<style>
</style>
