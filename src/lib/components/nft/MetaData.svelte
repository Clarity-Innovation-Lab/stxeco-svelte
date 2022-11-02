<script lang="ts">
	import { createEventDispatcher } from "svelte";
	//const { deserializeCV, cvToJSON } = require("@stacks/transactions");
	import { deserializeCV, cvToJSON } from "micro-stacks/clarity";
	import ChainUtils from '$lib/service/ChainUtils';

	const dispatch = createEventDispatcher();

	export let item:any;
	const owner = (item?.tokenIdMap?.owner) ? item?.tokenIdMap?.owner + ':' : '';
	const fallback = '/img/bns.jpg'; //'https://images.prismic.io/edao/ab7c56c4-b1a0-4d3b-ad5a-dc95018b6816_stx_eco_vote_image.png?auto=compress,format';
    let bnsName: any;
    let bnsNamespace: any;
	if (item.asset_identifier.indexOf('bns::names') > -1) {
		const result = cvToJSON(deserializeCV(item.value.hex));
		bnsName = ChainUtils.hexToAscii(result.value.name.value);
		bnsNamespace = ChainUtils.hexToAscii(result.value.namespace.value);
		item.bnsName = bnsName + '.' + bnsNamespace;
		//bnsName = Buffer.from(bnsName, 'hex');
	}

	const imageSrc = () => {
		return (item?.metaData?.image) ? item?.metaData.image : fallback;
	}
	const contractName = () => {
		return (item?.asset_identifier) ? item?.asset_identifier.split('::')[0].split('.')[1] : '';
	}
	const toggleCanvas = (item: any) => {
		dispatch("select_item", { item });
	}
	
</script>
	
<div class="col-4">
	<div class="text-white">
		{#if item.metaData}
		<h6 class={(owner) ? 'text-warning' : 'text-info'} title={owner}>{contractName()} #{item?.tokenIdMap?.tokenId} </h6>
		<a href="/" on:click|preventDefault={() => {toggleCanvas(item)}}><img width="100%" src={imageSrc()} alt={'Image for ' + item?.tokenIdMap?.tokenId}/></a>
		{:else if item.asset_identifier.indexOf('bns::names') > -1}
		<h6 class="text-info" title={owner}>{contractName()}: {bnsName + '.' + bnsNamespace} </h6>
		<a href="/" on:click|preventDefault={() => {toggleCanvas(item)}}><img width="100%" src={'/img/bns.jpg'} alt={bnsName}/></a>
		{:else}
		<h6 class={(owner) ? 'text-warning' : 'text-info'} title={owner}>{contractName()} #{item?.tokenIdMap?.tokenId} </h6>
		<img width="100%" src={'/img/questionmark.png'} alt={'Image for ' + item?.tokenIdMap?.tokenId}/>
		{/if}
		<!--
		{#if owner}
		<div><input value={item.token_uri}/></div>
		<div><input value={item.asset_identifier}/></div>
		{/if}
		-->
	</div>

</div>
