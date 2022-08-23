<script lang="ts">
  import settings from '$lib/settings'
	import CardWithParams from '$lib/shared/CardWithParams.svelte'
  import { client } from '$lib/micro-stacks-client';
  import { contractPrincipalCV } from 'micro-stacks/clarity';
  import { PostConditionMode } from 'micro-stacks/transactions';
  import { TxType } from '@micro-stacks/client';
  // import { makeContractCallToken, openTransactionPopup } from 'micro-stacks/connect';
  // import type {ContractCallTxOptions, FinishedTxData } from 'micro-stacks/connect';

	let st1 = '<p>Submit proposals to the DAO</p>'
	let st2 = '<p>Ongoing votes - delegate your vote</p>'
	let st3 = '<p>Get involved - join the discussion</p>'
	let st4 = '<p>The DAO is a community</p>'
	let response;

  const constructDao = async () => {
    const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
    const bootstrap = contractPrincipalCV(deployer, 'edp000-bootstrap-minimal')
    // const bootstrap = contractPrincipalCV(deployer, 'edp010-set-phase1-extensions')
    
    const txOptions = {
      postConditions: [],
      postConditionMode: PostConditionMode.Deny,
      contractAddress: deployer,
      contractName: 'executor-dao',
      functionName: 'construct',
      functionArgs: [bootstrap],
      // network,
      appDetails: {
        name: 'Ecosystem DAO',
        icon: '/img/logo.png'
      },
      onCancel: (error: any) => {
        console.log(error)
      },
      onFinish: (result: { txId: { txid: any; }; txRaw: any; stacksTransaction: any; }) => {
        console.log(result)
      }
    }
    await client.signTransaction(TxType.ContractCall, txOptions);
}

  $: constructed = $settings.extensions?.filter((o) => o.valid).length > 0 || false
</script>

<svelte:head>
	<title>DAO</title>
	<meta name="description" content="Submit and vote on proposals" />
</svelte:head>

<section>
  {#if !constructed}
  <div class="container text-center">
    <button type="button" class="btn btn-primary" on:click={constructDao}>CONSTRUCT DAO</button>
  </div>
  {/if}

    <div class="container my-5">
      <div class="row">
        <div class="col">
        </div>
      </div>
      <div class="row">
        <div class="col-6 my-2"
        >
          <CardWithParams title="Proposals" image="/img/bg/thinker.jpg" subtitle={st1}
            linkTarget="/dao/proposals"
            linkName="Proposals"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams title="Voting" subtitle={st2} image="/img/bg/vote.jpg"
            linkTarget="/dao/voting"
            linkName="Voting"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams title="Forum"  subtitle={st3} image="/img/bg/seats.jpg"
            linkTarget="/sip/issues"
            linkName="Make a Suggestion?"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams title="Membership" subtitle={st4} image="/img/bg/membership.jpg"
            linkTarget="/dao/membership?filter=pulls"
            linkName="Learn About Membership"
          />
        </div>
      </div>
    </div>
  </section>

<style>
</style>
