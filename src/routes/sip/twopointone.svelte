<script lang="ts">
  import RepeatContent from '$lib/shared/RepeatContent.svelte';

  let sipTab = 'twopointone';
</script>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="mb-4">
  <img width="100%" src="https://images.prismic.io/edao/4c50f9d5-01fc-4bb5-80c1-722937cf1aaf_jennybg.png?auto=compress,format?auto=compress,format" alt="Stacks 2.1 banner"/>
</div>
<!-- BUTTON PANEL -->
<div class="mb-5">
  <div class="">
    <RepeatContent docType="sip_tab" uid={sipTab} />
  </div>
  <div class="bg-card px-5 mb-4 py-4">
    <h2 class="text-info"><img class="arrow" src="https://images.prismic.io/edao/1ee869e3-1b10-4cdc-9745-6bc5c1f45eef_stx_eco_directional_arrow.png?auto=compress,format"/> <span class="">General Information</span></h2>    
    <RepeatContent docType="sip_tab" uid="twoonefaq" />
  </div>
</div>

<style>
h2 {
  color: #4786cd !important;
}
  p, ul, li { color: #fff; }
  
  .arrow { position: relative; top:-18px; left:0px; width: 8px; }
  
  .sub-text { font-size: 0.95rem; margin-left: 15px; }
  
  .text-header { font-size: 1.4rem;  font-weight: 700; color: #4786cd; }
  
/**

h1 {
  font-size: 2.8rem;
  line-height: 2.2rem;
  margin-bottom: 20px;
}

.btn { padding: 15px 15px!important; }
.float-panel {
  width: 100%; 
  background-color: #111;
  opacity: 0.85;
  position: absolute; 
  left: 0;
  right: 0;
  margin: 0 auto; 
  top: 290px; 
  width: 300px; 
  text-align: start;
  padding: 5px 5px;
}
@media (max-width: 900px) {
  h1 {
    font-size: 2.4rem;
    line-height: 1.7rem;
  }
  .float-panel { 
    width: 300px; top: 210px;;
  }
}
@media (max-width: 700px) {
  h1 {
    font-size: 2.4rem;
    line-height: 2.0rem;
  }
  .float-panel { 
    width: 260px; top: 190px;
  }
}
**/
</style>
