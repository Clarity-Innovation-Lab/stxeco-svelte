<script lang="ts">
  import RepeatContent from '$lib/shared/RepeatContent.svelte';

  let componentKey = 0;
  let sipTab = 'sip_tab1';
  $: sipTab;

  const changeSipTab = (tab:string) => {
    sipTab = tab;
    componentKey++;
  }

  const classes = (link:string) => {
    if (link === sipTab) return 'p-0 px-sm-3 px-md-5 m-0 btn btn-info';
    else return 'p-0 px-sm-3 px-md-5 m-0 btn btn-outline-info';
  }
</script>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>
<!-- HEADER PANEL -->

<div class="mb-4">
  <img width="100%" src="https://images.prismic.io/edao/bedc7562-279a-454d-a2dc-91b25eec00a7_stx_eco_SIP_banner_image.png?auto=compress,format" alt="Stacks 2.1 banner"/>
  <div class="float-panel text-info">
    <div class="row px-2">
      <div class="col-1 text-right">
        <img class="arrow" style="position:relative; top:3px; left:0px;" width="10px" src="https://images.prismic.io/edao/1ee869e3-1b10-4cdc-9745-6bc5c1f45eef_stx_eco_directional_arrow.png?auto=compress,format" alt="Stacks 2.1 banner"/>
      </div>
      <div class="col-11 mx-3">
        <h1 class="text-info"><span class="strokeme-info">SIP</span> Stacks<br/>Improvement<br/>Proposals</h1>
        <p class="strapline-bold">Everything you wanted to know <br/>but were afraid to ask!</p>
      </div>
    </div>
  </div>
</div>
<!-- BUTTON PANEL -->
{#key componentKey}
<div class="mb-4">
  <div class="d-flex justify-content-center">
    <p class="text-small">
      <span><a href="/sip" on:click|preventDefault={() => { changeSipTab('sip_tab1')}} class={classes('sip_tab1')}>PROCESSES</a></span>
      <span><a href="/sip" on:click|preventDefault={() => { changeSipTab('sip_tab2')}} class={classes('sip_tab2')}>SUGGESTIONS</a></span>
      <span><a href="/sip" on:click|preventDefault={() => { changeSipTab('sip_tab3')}} class={classes('sip_tab3')}>GOVERNANCE</a></span>
    </p>
  </div>
</div>
  
  
<div class="mb-5">
  <div class="">
    <RepeatContent docType="sip_tab" uid={sipTab} />
  </div>
</div>
{/key}

<style>
h1 {
  font-size: 2.2rem;
  line-height: 2.2rem;
}
p { font-size: 0.9rem; margin: 10px 0px 10px 0px; color: #fff; } 

.btn { padding: 15px 15px!important; }
.text-small a {
  font-size: 0.7rem; padding: 5px 20px;
}
.float-panel {
  width: 100%; 
  background-color: #111;
  opacity: 0.85;
  position: absolute; 
  left: 0;
  right: 0;
  margin: 0 auto; 
  top: 220px; 
  width: 300px; 
  text-align: start;
  padding: 5px 5px;
}
@media (max-width: 900px) {
  h1 {
    font-size: 1.8rem;
    line-height: 1.7rem;
  }
  p { font-size: 0.7rem; margin: 2px; }
  .float-panel { 
    width: 300px; top: 210px;;
  }
  .text-small  a { font-size: 0.8rem;}
}
@media (max-width: 700px) {
  h1 {
    font-size: 1.2rem;
    line-height: 1.2rem;
  }
  p { font-size: 0.6rem; margin: 2px; }
  .float-panel { 
    width: 200px; top: 190px;;
  }
  .text-small  a { font-size: 0.7rem;}
}
</style>
