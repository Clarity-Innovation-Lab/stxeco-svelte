<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';
	import Modal from '$lib/shared/Modal.svelte';
  import AmountSelection from '$lib/components/dao/proposals/AmountSelection.svelte'
  import { client } from '$lib/micro-stacks-client';
  import { contractPrincipalCV, trueCV, falseCV, uintCV } from 'micro-stacks/clarity';
  import { PostConditionMode } from 'micro-stacks/transactions';
  import { TxType } from '@micro-stacks/client';

	let contractId = $page.params.contractId;
	let stacksTipHeight = $settings.info.stacks_tip_height;
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);

  const totalSupply = $settings.daoProperties?.find((o) => o.id === 'get-total-supply').value;
  const proposalDuration = $settings.daoProperties?.find((o) => o.id === 'proposal-duration').value;
  const tokenBalance = $settings.userProperties?.find((o) => o.functionName === 'edg-get-balance').value.value
  const tokenBalanceLocked = $settings.userProperties?.find((dp) => dp.functionName === 'edg-get-locked').value.value
  const totalDelegatedToMe = $settings.userProperties?.find((dp) => dp.functionName === 'edg-get-total-delegated').value.value

  export let vfor = true
  export let title = proposal.title
  let showModal:boolean;
	const toggleModal = () => {
		showModal = !showModal;
	}
  const proposalEnds = () => {
    if (!proposalDuration) return 0
    return Number(proposal.proposalData.startBlockHeight) + Number(proposalDuration)
  }
  $: votingInProgress = () => {
      return stacksTipHeight >= proposal.proposalData.startBlockHeight && stacksTipHeight < proposal.proposalData.endBlockHeight
  }
  const statusMessage = () => {
    const propData = proposal.proposalData
    if (propData.concluded) {
      if (propData.passed) return 'Voting ended, proposal concluded, proposal passed'
      else return 'Voting ended, proposal concluded, proposal failed to pass'
    } else if (stacksTipHeight > propData.endBlockHeight) return 'Voting ended'
    else if (stacksTipHeight < propData.startBlockHeight) return 'Voting starts in ' + (propData.startBlockHeight - stacksTipHeight) + ' blocks'
    else return 'Voting started - cast or delegate your vote!'
  }
  
  let amount = 0
  const castVote = async (data:any) => {
    const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
    toggleModal()
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
    const governanceCV = contractPrincipalCV(deployer, 'ede000-governance-token')
    const proposalCV = contractPrincipalCV(vote.proposalContractId.split('.')[0], vote.proposalContractId.split('.')[1])
    const txOptions = {
      postConditions: [],
      postConditionMode: PostConditionMode.Deny,
      contractAddress: deployer,
      contractName: 'ede002-proposal-voting',
      functionName: 'vote',
      functionArgs: [amountCV, forCV, proposalCV, governanceCV],
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
    const payload = await client.signTransaction(TxType.ContractCall, txOptions);
  }

  const canVote = tokenBalance > tokenBalanceLocked
  const vip = true
  const votingProgressPercentage = proposal.proposalData && votingInProgress
</script>

<Modal {showModal} on:click={toggleModal}>
  <AmountSelection {vfor} {proposal} on:castVote={castVote}/>
  <div slot="title">
    <h3>{proposal.title}</h3>
  </div>
</Modal>

<section>
  <div>
    <div class="row">
      {#if votingInProgress}
      <div cols="12">
        <h4>Voting in Progress -> Block { stacksTipHeight }</h4>
        <div class="progress">
          <div class="progress-bar progress-bar-striped"
                role="progressbar" 
                style={'width:' + votingProgressPercentage + '%'}
                aria-valuenow={votingProgressPercentage} aria-valuemin={0} aria-valuemax={100}></div>
        </div>
        <div class="d-flex justify-content-between text-small">
          <div>{ proposal.proposalData.startBlockHeight }</div>
          <div>{ proposalEnds }</div>
        </div>
      </div>
      {:else}
      <div class="text-center mb-3">
        <button>{ statusMessage }<button>
      </div>
      {/if}
    </div>
    {#if canVote}
    <div class="row">
      <div class="my-5 text-center">
        <div class="d-flex justify-content-around">
          <div>
            <button class="success" on:click={toggleModal}>FOR<button>
          </div>
          <h2>Cast your Vote</h2>
          <div>
            <button class="info" on:click={toggleModal}>AGAINST<button>
          </div>
        </div>
      </div>
    </div>
    {:else}
    <div class="row">
      <div class="my-5 text-center">
        <div class="d-flex justify-content-around">
          No unlocked governance tokens
        </div>
      </div>
    </div>
    {/if}
  </div>
</section>

<style>
</style>
