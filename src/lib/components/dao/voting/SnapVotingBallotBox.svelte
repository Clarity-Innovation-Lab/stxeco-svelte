<script lang="ts">
	import settings from '$lib/settings';
  import { client } from '$lib/micro-stacks-client';
  import { contractPrincipalCV, trueCV, falseCV, uintCV } from 'micro-stacks/clarity';
  import { PostConditionMode } from 'micro-stacks/transactions';
  import { TxType } from '@micro-stacks/client';
  import type { ContractCallParams } from '@micro-stacks/client';
  import type { ProposalType } from "../../../../types/stxeco.type";
	import GeneralUtils from '$lib/service/GeneralUtils';

	export let proposal:ProposalType;
	export let balanceAtHeight:number;

  const proposalData = proposal.proposalData || { votesFor: 0, votesAgainst: 0, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }

	let stacksTipHeight = $settings.info.stacks_tip_height;
  let tokenBalance = $settings.userProperties?.find((o) => o.functionName === 'edg-get-balance')?.value?.value || 0
  const tokenBalanceLocked = $settings.userProperties?.find((dp) => dp.functionName === 'edg-get-locked')?.value.value || 0;


	let amount = 0;

  const castVote = async (vfor:boolean) => {
    const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
    if (amount === 0) return;
    let forCV = trueCV()
    if (!vfor) {
      forCV = falseCV()
    }
		// const amountUSTX = GeneralUtils.toOnChainAmount(amount)
		const amountUSTX = GeneralUtils.toOnChainAmount(amount)
    const amountCV = uintCV(amountUSTX)
    const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
    const txOptions:ContractCallParams = {
      postConditions: [],
      postConditionMode: PostConditionMode.Deny,
      contractAddress: deployer,
      contractName: 'ede007-snapshot-proposal-voting',
      functionName: 'vote',
      functionArgs: [amountCV, forCV, proposalCV],
      // network,
      appDetails: {
        name: 'Ecosystem DAO',
        icon: '/img/logo.png'
      },
      onCancel: (error: any) => {
        console.error(error)
      },
      onFinish: (result: { txId: { txid: any; }; txRaw: any; stacksTransaction: any; }) => {
        console.log(result);
      }
    }
    await client.signTransaction(TxType.ContractCall, txOptions);
  }

  const canVote = tokenBalance > tokenBalanceLocked && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight
</script>

<section>
  <div class="jumbo">
    <div>
      <h4>Snapshot Voting</h4>
    <p>Vote using any amount up to your balance at the block height where voting started.</p>
		<p>Your wallet balance at block {proposal.proposalData?.startBlockHeight} is {balanceAtHeight} STX</p>
  </div>
  {#if canVote}
  <div class="row">
		<form on:submit|preventDefault>
			<div class="mb-3 text-center">
				<div class="form-text"><h6>Voting Power - <a href="/" on:click|preventDefault={() => amount = 1}>min</a> / <a href="/" on:click|preventDefault={() => amount = balanceAtHeight}>max</a> voting power.</h6></div>
				<div class="d-flex justify-content-center"><input class="w-25 form-control" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution"/> </div>
				<div class="text-small text-info">No STX is transferred by voting.</div>
			</div>
		</form>
    <div class="my-5">
      <div class="d-flex justify-content-around">
        <div>
          <button class="btn btn-outline-info" on:click={() => castVote(true)}>FOR <br/> {GeneralUtils.fromMicroAmount(proposalData.votesFor)}</button>
        </div>
        <h2>Cast your Vote</h2>
        <div>
          <button class="btn btn-outline-success" on:click={() => castVote(false)}>AGAINST <br/> {GeneralUtils.fromMicroAmount(proposalData.votesAgainst)}</button>
        </div>
      </div>
    </div>
  </div>
  {/if}
</div>
</section>

<style>
</style>
