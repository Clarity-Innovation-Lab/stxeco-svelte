<script lang="ts">
	import Tab1 from "$lib/components/sips/tabs/Tab1.svelte";
	import Tab2 from "$lib/components/sips/tabs/Tab2.svelte";
	import Tab3 from "$lib/components/sips/tabs/Tab3.svelte";
  import Tabs from "$lib/shared/Tabs.svelte";

/**
let st1 = '<p>Getting the community involved via the DAO</p><ol><li>Activate SIP becomes a DAO Proposal</li><li>Rules of the DAO apply - e.g.</li><li>Voting starts in 1 day / ends in 1 week</li></ol>'
let st2 = '<p>About CABs - Advisory Boards!</p><ol><li>Goverance - join discussions</li><li>Tokenomics - join discussions</li><li>Technical - join discussions</li></ol>'
let st3 = '<p>SIPs start out as suggestions or issues registered on GitHub</p><ol><li>GitHub is complicated - learn about why we use it.</li><li>Have a suggestion for improving Stacks?</li><li>Comment on someone else\'s suggestion?</li></ol>'
let st4 = '<p>A <strong>Proposal</strong> is a Pull Request in GitHub lingo</p><ol><li>SIP workflow.</li><li>Review open proposals</li><li>Comment on open proposals</li></ol>'
**/
  let items = [
    { label: "SIP Process",
		 value: 1,
		 component: Tab1
		},
    { label: "Making Suggestions",
		 value: 2,
		 component: Tab2
		},
    { label: "Advisory Boards",
		 value: 3,
		 component: Tab3
		}
  ];
</script>

<svelte:head>
	<title>Stacks Improvement Proposals</title>
	<meta name="description" content="Help build the foundation for the User Owned Internet" />
</svelte:head>

<section class="text-white">
    <div class="container my-0">
      <div class="row mb-5">
        <div class="col">
          <h1><span class="strokeme-white">SIPs<br/></span> Stacks Improvement Proposals</h1>
          <h6 class="strapline">Everything you wanted to know but were afraid to ask!</h6>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <Tabs {items} />
        </div>
      </div>
      <!--
      <div class="row">
        <div class="col-6 my-2">
          <CardWithParams title="Suggestions" subtitle="" image="/img/bg/ecosys.jpg"
            linkTarget="/sip/issues" linkName="Browse Suggestions"/>
        </div>
        <div class="col-6 my-2">
          <CardWithParams title="Proposals" subtitle="" image="/img/bg/tree.jpg"
            linkTarget="/sip/issues?filter=pulls" linkName="Browse Proposals"/>
        </div>
        <div class="col-6 my-2">
          <CardWithParams title="Activating SIP" subtitle="" image="/img/bg/ecosys.jpg"
            linkTarget="/sip/sip-voting" linkName="About Voting"/>
        </div>
        <div class="col-6 my-2">
          <CardWithParams title="Advisory Boards" subtitle="" image="/img/bg/tree.jpg"
            linkTarget="/sip/sip-cabs" linkName="About the CABs"/>
        </div>
      </div>
      -->
    </div>
  </section>

<style>
</style>
