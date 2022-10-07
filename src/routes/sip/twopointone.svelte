<script lang="ts">
  import RepeatContent from '$lib/shared/RepeatContent.svelte';

  let sipTab = 'twopointone';
</script>

<svelte:head>
	<title>Stacks Improvement Proposals</title>
	<meta name="description" content="Help build the foundation for the User Owned Internet" />
</svelte:head>
<!-- HEADER PANEL -->

<div class="mb-4">
  <img width="100%" src="https://images.prismic.io/edao/06e5f803-2bdc-4a93-ba00-1002315fa5b2_stx_eco_2.1_upgrade_banner_image.png?auto=compress,format" alt="Stacks 2.1 banner"/>
  <div class="float-panel text-info pb-4">
    <div class="row px-2">
      <div class="col-1 text-right">
        <img class="arrow" style="position:relative; top:8px; left:5px;" width="10px" src="https://images.prismic.io/edao/1ee869e3-1b10-4cdc-9745-6bc5c1f45eef_stx_eco_directional_arrow.png?auto=compress,format" alt="Stacks 2.1 banner"/>
      </div>
      <div class="col-11 mx-3">
        <h1 class="text-info"><span class="">Stacks 2.1 <br/><span class="strokeme-info">Upgrade</span></h1>
        <a href="/dao/proposals/ST132K8CVJ9B2GEDHTQS5MH3N7BR5QDMN1P1RZG3Y.edp015-stacks-2-1-activation" class="btn btn-info btn-rounded p-0 px-4">Vote Now</a>
      </div>
    </div>
  </div>
</div>
<!-- BUTTON PANEL -->
<div class="mb-5">
  <div class="">
    <RepeatContent docType="sip_tab" uid={sipTab} />
  </div>
</div>

<style>
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
</style>
