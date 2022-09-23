<script lang="ts">
import { createEventDispatcher } from 'svelte';
import DaoUtils from '$lib/service/DaoUtils';
import settings from '$lib/settings';
import type { ProposalType } from "../../../../types/stxeco.type";

let dispatch = createEventDispatcher();

export let proposal:ProposalType;

const stacksTipHeight = $settings.info?.stacks_tip_height || 0;
const sigsRequired = Number($settings.daoProperties?.find((o) => o.id === 'get-signals-required')?.value) || 0;
const fundingCost = Number($settings.daoProperties?.find((o) => o.id === 'funding-cost')?.value) / 1000000 || 0;
const status = proposal.status;

const openSesame = () => {
	dispatch('openSourceModal', proposal)
}
const explorerUrl = () => {
	return import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + proposal.deployTxId + '?chain=' + import.meta.env.VITE_NETWORK;
}
const statusStyle = () => {
    let clazzes = 'border-top: 1pt solid ' + status.colorCode + '; border-left: 1pt solid ' + status.colorCode + '; border-right: 1pt solid ' + status.colorCode + ';';
    /**
	let clazzes = '';
    if (typeof proposal.executedAt === 'number' && proposal.executedAt > 0) {
      clazzes = 'border-top: 1pt solid #64c872; border-left: 1pt solid #64c872; border-right: 1pt solid #64c872; color: #64c872;';
    } else if (proposal.funding > -1 && proposal.funding < fundingCost) {
		clazzes = 'border-top: 1pt solid #fdad37; border-left: 1pt solid #fdad37; border-right: 1pt solid #fdad37; color: #fdad37;';
    } else if (proposal.funding > -1 && proposal.funding >= fundingCost) {
		clazzes = 'border-top: 1pt solid #dd216e; border-left: 1pt solid #dd216e; border-right: 1pt solid #dd216e; color: #dd216e;';
    }
	**/
    return clazzes;
}

const actionStyle = () => {
    let clazzes = 'border-top: 1pt solid ' + status.colorCode + '; border-left: 1pt solid ' + status.colorCode + '; border-bottom: 1pt solid ' + status.colorCode + ';';
    return clazzes;
}

const actionRightStyle = () => {
    let clazzes = 'border: 1pt solid ' + status.colorCode + ';';
    return clazzes;
}
const filter = () => {
    let clazzes = 'filter-' + status.color;
    return clazzes;
}
const headerStyle = () => {
    let clazzes = 'upper text-' + status.color;
    /**
	if (typeof proposal.executedAt === 'number' && proposal.executedAt > 0) {
      clazzes += 'text-success';
    } else if (proposal.funding > -1 && proposal.funding < fundingCost) {
      clazzes += 'text-warning';
    } else if (proposal.funding > -1 && proposal.funding >= fundingCost) {
      clazzes += 'text-danger';
    }
	**/
    return clazzes;
}

</script>

<div class="box">
	<div class="row">
		<div class="col-1">
		  <img style="position: relative; top: -20px; left: 15px;" src="/img/svg-assets/stx_eco_directional_arrow.svg" alt="Scroll down" width="15" height="auto" />
		</div>
		<div class="col-11">
				<div class="row">
					<div class="cols-12">
						<h2><a class={headerStyle()} href={'/dao/proposals/' + proposal.contract.contract_id}>{proposal.contractId.split('.')[1]}</a></h2>
					</div>
				</div>
				<div class="row">
					<div class="cols-12">
						<p  class="p-2" style={statusStyle()}>
							{status.name}
							{#if status.name === 'emergexec'}(<a class={'pointer text-' + status.color} href={'/dao/proposals/' + proposal.contract.contract_id}><span class="">{proposal.emergencySignals}/{sigsRequired}</span></a>){/if}
							{#if status.name === 'voting'} - <a class={'pointer text-' + status.color} href={'/dao/proposals/' + proposal.contract.contract_id}><span class="">{DaoUtils.getVotingMessage(proposal.proposalData, stacksTipHeight)}</span></a>{/if}
							{#if status.name === 'funding'}(<a class={'pointer text-' + status.color} href={'/dao/proposals/' + proposal.contract.contract_id}><span class="">{proposal.funding}/{fundingCost}</span></a>){/if}
						</p>		
					</div>
				</div>
				<div class="row">
					<div class="col-3"><p class="text-light p-2" style={actionStyle()}>actions</p></div>
					<div class="col-9">
						<p class="p-2" style={actionRightStyle()}><a class="pointer text-light" href="/" on:click|preventDefault={() => { openSesame() }}>Show Clarity</a></p>
						<p class="p-2" style={actionRightStyle()}><a class="pointer text-light" href={explorerUrl()} target="_blank">Open Explorer</a></p>
					</div>
				</div>
			</div>
	</div>
</div>

<style>
.box {
	font-family: Gilroy-ExtraBold;
	background-color: #262626;
	height: auto;
	margin: 10px 2px;
	padding: 30px 10px;
}
.box h2 {
	font-size: 1.2rem;
}
.box p {
	font-family: Gilroy-Light;
	padding: 3px;
	margin: 0 !important;
	font-size: 1.0rem;
	text-transform: lowercase;
}
.col-9 {
	padding-left: 0 !important;
}
.col-3 {
	padding-right: 0 !important;
}
.text-light {
	color: #ededed;
}
</style>
