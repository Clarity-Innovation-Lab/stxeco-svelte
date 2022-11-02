<script lang="ts">
import { page } from "$app/stores";
import { onMount } from 'svelte';
import { getAccount, getNetwork } from '@micro-stacks/svelte';
import MetaData from '$lib/components/nft/MetaData.svelte';
import Canvas from '$lib/shared/Canvas.svelte';
import DaoUtils from '$lib/service/DaoUtils';
    
const mempool = $page.url.searchParams.has('mempool');
const account = getAccount();
const network = getNetwork();
let currentNetork = ($network.isMainnet) ? 'mainnet' : 'testnet'; 
let votes: any[] = [];
let assetIdList: any[] = [];
let assetId:any;
let hasVotes = true;
$: offset = 0;
$: holdings = {
  total: 0,
  results: []
};;
$: currentPage = 0;
let pageSize = 20;
let loading = true;
const gateway = "https://hashone.mypinata.cloud/";
const gatewayAr = "https://arweave.net/";

const nextPage = async (init:boolean) => {
  if (!init && holdings.total <= (currentPage * pageSize)) return;
  if (init) {
    offset = 0;
    currentPage = 0;
  }
  loading = true;
  const assetIdentifier = assetId?.contractAddress + '.' + assetId?.contractName + '::' + assetId?.assetName;
  const url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/nft/' + $account.stxAddress + '/' + assetIdentifier + '/' + offset + '/' + pageSize;
  const res = await fetch(url).catch(error => {
    console.error('error was: ' + error);
  });
  if (res && res.ok) {
    let response = await res.json();
    holdings = response;
    holdings.results.forEach((item:any) => {
      let image = item?.metaData?.image || '';
      if (image.startsWith('ipfs://')) {
        image = item.metaData.image.replace('ipfs://', gateway)
      } else if (image.startsWith('ipfs/')) {
        image = gateway + image;
      } else if (image.startsWith('ar://')) {
        image = item.metaData.image.replace('ar://', gatewayAr)
      }
      if (item && item.metaData) item.metaData.image = image;
    })
    offset += pageSize;
    currentPage++;
    loading = false;
  }
}
let imageSrc:string = '/img/bns.jpg';
let canvasMode = false;
const selectItem = (event: any) => {
  const item = event.detail.item;
  imageSrc = item?.metaData?.image || '/img/bns.jpg';
  canvasMode = !canvasMode;
}
const toggleCanvas = () => {
  canvasMode = !canvasMode;
}

let sortedAssets: any[] = [];
onMount(async () => {
  const contractId = $page.params.contractId;
  // await nextPage(true)
  let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/nft/assets/' + $account.stxAddress;
  let res = await fetch(url);
  assetIdList = await res.json();
  assetIdList.forEach((o) => {
    sortedAssets.push({
      contractAddress: o.split('.')[0],
      contractName: o.split('.')[1].split('::')[0],
      assetName: o.split('.')[1].split('::')[1]
    })
  })
  sortedAssets = sortedAssets.sort(DaoUtils.dynamicSort('assetName'));
  assetId = sortedAssets[0];
  nextPage(true);

  url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/events/voter/' + contractId + '/' + $account.stxAddress;
  res = await fetch(url);
  if (res.ok) {
    votes = await res.json();
    hasVotes = votes?.length > 0;
  }
})
</script>


<svelte:head>
	<title>DAO</title>
	<meta name="description" content="Submit and vote on proposals" />
</svelte:head>

<section>
  <div class="">
    <div class="container text-white">
      <h1 class="text-info"><span class="strokeme-info">Badge</span> Pickup</h1>
      {#if assetIdList.length > 0}
      {#if !canvasMode}
      <div class="mb-5">
        <h4>Choose NFT Collection</h4>
        <select bind:value={assetId} on:change="{() => { nextPage(true) }}">
          {#each sortedAssets as asset}
          <option value={asset}>{asset.assetName + ' from ' + asset.contractName}</option>
          {/each}
        </select>
      </div>
      {/if}
      {#if mempool || votes.length > 0}
      <div>
        <p>Thanks for voting on this proposal!</p>
        <p>To make a badge...</p>
        <ol>
          <li>Click an NFT you like from your wallet - they are displayed 20 per page</li>
          <li>Align the I voted banner and background NFT image how you like</li>
          <li>Click the download icon - the image will be downloaded to your computer</li>
          <li>In twitter set the image as your profile pic!</li>
        </ol>
        <p>Note: if you don't have any NFTs in this account you can transfer one and 
          return here once the transfer confirms - it will still work.</p>
      </div>
      {/if}
        {#if !$account?.stxAddress}
        <div>Please log in to continue</div>
        {:else if loading}
        <div>Loading nfts - can take a few moments..</div>
        <div>Loading for address: {$account.stxAddress} on {currentNetork}.</div>
        {:else}
          {#if holdings.total > 0}
            {#if canvasMode}
            <div class="row">
              <Canvas {imageSrc} on:toggle_canvas={toggleCanvas} hasVotes={mempool || votes.length > 0}/>
            </div>
            {:else}
            <div class="d-flex justify-content-between">
              <p class="strapline">Step 1: Choose an NFT</p>
              <p class="strapline"><a href="/" on:click|preventDefault={() => nextPage(false)}>page {currentPage} / {(Math.floor(holdings.total / pageSize)) + 1} ({holdings.total} NFTs)</a></p>
            </div>
            <div class="row">
              {#each holdings.results as item}
                <MetaData {item} on:select_item={selectItem}/>
              {/each}
            </div>
            {/if}
          {:else}
          <div>
            <p>No NFTs for address: {$account.stxAddress} on {currentNetork}</p>
            <p>Transfer an NFT to this address to claim a badge. Or vote with an address
              with NFTs already in the wallet.
            </p>
          </div>
          {/if}
        {/if}
        {:else}
        <div>
          <p>No NFTs for address: {$account.stxAddress} on {currentNetork}</p>
          <p>You can transfer an NFT to this address to claim a badge. Or vote with an address
            with NFTs already in the wallet.
          </p>
        </div>
        {/if}
      </div>
  </div>
</section>

<style>
</style>