<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';
	import Modal from '$lib/shared/Modal.svelte';
  import AmountSelection from '$lib/components/dao/voting/PropVotingSelectAmount.svelte'
  import { client } from '$lib/micro-stacks-client';
  import { contractPrincipalCV, trueCV, falseCV, uintCV } from 'micro-stacks/clarity';
  import { PostConditionMode } from 'micro-stacks/transactions';
  import { TxType } from '@micro-stacks/client';

	let contractId = $page.params.contractId;
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
  const proposalData = proposal.proposalData || { startBlockHeight: 0, endBlockHeight: 0, proposer: '' }

	let stacksTipHeight = $settings.info.stacks_tip_height;
  let tokenBalance = $settings.userProperties?.find((o) => o.functionName === 'edg-get-balance')?.value?.value || 0
  const tokenBalanceLocked = $settings.userProperties?.find((dp) => dp.functionName === 'edg-get-locked')?.value.value || 0;


  let vfor:boolean;
  let showModal:boolean;
	const toggleModal = (myVote:boolean) => {
		showModal = !showModal;
    vfor = myVote;
	}
	const closeModal = () => {
		showModal = false;
	}
  let amount = 0
  const castVote = async (data:any) => {
    const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
		showModal = !showModal;
    if (data.amount) amount = data.amount
    const vote = {
      proposalContractId: proposal.contractId,
      amount: amount,
      vfor: vfor
    }
    let forCV = trueCV()
    if (!vote.vfor) {
      forCV = falseCV()
    }
    const amountCV = uintCV(vote.amount)
    const proposalCV = contractPrincipalCV(vote.proposalContractId.split('.')[0], vote.proposalContractId.split('.')[1])
    const txOptions = {
      postConditions: [],
      postConditionMode: PostConditionMode.Deny,
      contractAddress: deployer,
      contractName: 'ede002-proposal-voting',
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
        console.log(result)
      }
    }
    await client.signTransaction(TxType.ContractCall, txOptions);
  }

  const canVote = tokenBalance > tokenBalanceLocked && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight
</script>

<Modal {showModal} on:click={closeModal}>
  <AmountSelection {vfor} {proposal} on:castVote={castVote}/>
  <div slot="title">
    <h3>{proposal.title}</h3>
  </div>
</Modal>

<section>
  {#if canVote}
  <div class="row">
    <div class="my-5 text-center">
      <div class="d-flex justify-content-around">
        <div>
          <button class="btn btn-outline-info" on:click={() => toggleModal(true)}>FOR</button>
        </div>
        <h2>Cast your Vote</h2>
        <div>
          <button class="btn btn-outline-success" on:click={() => toggleModal(false)}>AGAINST</button>
        </div>
      </div>
    </div>
  </div>
  {:else if tokenBalance <= tokenBalanceLocked}
  <div class="row">
    <div class="my-5 text-center">
      <div class="d-flex justify-content-around">
        No unlocked governance tokens
      </div>
    </div>
  </div>
  {/if}
</section>

<style>
</style>
