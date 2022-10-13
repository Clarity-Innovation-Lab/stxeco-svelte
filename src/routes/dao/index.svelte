<script lang="ts">
import settings from '$lib/settings'
import CardWithParams from '$lib/shared/CardWithParams.svelte'
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { getOpenContractCall } from '@micro-stacks/svelte';
import type { ExtensionType } from "../../types/stxeco.type";

const contractCall = getOpenContractCall();

let st1 = '<p>Submit proposals to the DAO</p>'
let st2 = '<p>Ongoing votes - delegate your vote</p>'
let st3 = '<p>Get involved - join the discussion</p>'
let st4 = '<p>The DAO is a community</p>'
let txId: string;

const constructDao = async () => {
  const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
  const bootstrap = contractPrincipalCV(deployer, 'edp000-bootstrap-minimal')
  // const bootstrap = contractPrincipalCV(deployer, 'edp010-set-phase1-extensions')
  await $contractCall.openContractCall({
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: deployer,
    contractName: import.meta.env.VITE_DAO_CONTRACT_NAME,
    functionName: 'construct',
    functionArgs: [bootstrap],
    onFinish: data => {
      console.log('finished contract call!', data);
      txId = data.txId;
    },
    onCancel: () => {
      console.log('popup closed!');
    },
  });
}

$: constructed = $settings.extensions?.filter((o:ExtensionType) => o.valid).length > 0 || false;
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;
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
  {#if txId}
  <div>
    <a href={explorerUrl} target="_blank">View on explorer</a>
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
            linkTarget="/dao/proposals?filter=voting"
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
