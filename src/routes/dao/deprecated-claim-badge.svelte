<script lang="ts">
import { onMount } from 'svelte';
import { getAccount, getNetwork } from '@micro-stacks/svelte';
import MetaData from '$lib/components/nft/MetaData.svelte';
import Canvas from '$lib/shared/Canvas.svelte';
  //import holdings from '$lib/holdings';

const account = getAccount();
const network = getNetwork();
let currentNetork = ($network.isMainnet) ? 'mainnet' : 'testnet'; 
$: offset = 0;
$: holdings = {
  total: 0,
  results: []
};;
$: page = 0;
let pageSize = 50;
let loading = true;
onMount(async () => {
  await nextPage(true)
});
const gateway = "https://hashone.mypinata.cloud/";
const nextPage = async (init:boolean) => {
  if (!init && holdings.total <= (page * pageSize)) return;
  loading = true;
  const url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/nft/' + $account.stxAddress + '/' + offset + '/' + pageSize;
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
      }
      item.metaData.image = image;
    })
    offset += pageSize;
    page++;
    loading = false;
  }
}
let imageSrc:string = 'https://hashone.mypinata.cloud/ipfs/QmRZA25mjkVBK6mXQVZeubAi9LmupYBWvS2oJCVPmbuw29/indige5-0.jpg';
let canvasMode = false;
const selectItem = (event: any) => {
  const item = event.detail.item;
  canvasMode = !canvasMode;
  imageSrc = item.metaData.image;
}
const toggleCanvas = (event: any) => {
  canvasMode = !canvasMode;
}

</script>

<svelte:head>
	<title>DAO</title>
	<meta name="description" content="Submit and vote on proposals" />
</svelte:head>

<section>
  <div class="">
    <div class="container">
      <h1 class="text-info">Badge <span class="strokeme-info">Pickup</span></h1>
      
        {#if loading}
        <div>Loading nfts - can take a few moments..</div>
        <div>Loading for address: {$account.stxAddress} on {currentNetork}.</div>
        {:else}
          {#if holdings.total > 0}
            {#if canvasMode}
            <div class="row">
              <Canvas {imageSrc} on:toggle_canvas={toggleCanvas} />
            </div>            
            {:else}
            <div class="d-flex justify-content-between">
              <p class="strapline">Step 1: Choose an NFT</p>
              <p class="strapline"><a href="/" on:click|preventDefault={() => nextPage(false)}>page {page} / {(Math.floor(holdings.total / pageSize)) + 1} ({holdings.total} NFTs)</a></p>
            </div>
            <div class="row">
              {#each holdings.results as item}
                <MetaData {item} on:select_item={selectItem}/>
              {/each}
            </div>
            {/if}
          {:else}
          <div>No NFTs for address: {$account.stxAddress} on {currentNetork}</div>
          {/if}
        {/if}
    </div>
  </div>
</section>

<style>
</style>
