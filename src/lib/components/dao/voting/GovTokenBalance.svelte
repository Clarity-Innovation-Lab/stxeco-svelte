<script lang="ts">
	import settings from '$lib/settings';

  const governanceExt = $settings.extensions.find((o: { contract: { contract_id: string|string[]; }; }) => o.contract.contract_id.indexOf('ede000-governance') > 0);
  const governance = governanceExt && governanceExt.valid;

  const totalSupply = $settings.daoProperties?.find((o) => o.id === 'get-total-supply')?.value || 0;
  const tokenBalance = $settings.userProperties?.find((o) => o.functionName === 'edg-get-balance')?.value?.value || 0
  const tokenBalanceLocked = $settings.userProperties?.find((dp) => dp.functionName === 'edg-get-locked')?.value?.value || 0
  const totalDelegatedToMe = $settings.userProperties?.find((dp) => dp.functionName === 'edg-get-total-delegated')?.value?.value || 0

</script>

<section class="bg-dark text-white p-4 my-4">
    {#if governance}
    <div class="row mt-5">
      <div class="col-12">
        <div class="row">
          <div class="col-md-4 col-sm-12">Unlocked</div>  
          <div class="col-md-6 col-sm-12">{ tokenBalance }</div>  
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-12">locked</div>  
          <div class="col-md-6 col-sm-12">{ tokenBalanceLocked }</div>  
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-12">delegated</div>  
          <div class="col-md-6 col-sm-12">{ totalDelegatedToMe }</div>  
        </div>
        <div class="row">
          <div class="col-md-4 col-sm-12">Total Supply:</div>  
          <div class="col-md-6 col-sm-12">{ totalSupply }</div>  
        </div>
      </div>  
    </div>
    {/if}
</section>

<style>
</style>
