<script lang="ts">
	import CardWithParams from '../../shared/CardWithParams.svelte'
	import { enhance } from '$lib/form';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let st1 = '<p>Getting the community involved via the DAO</p><ol><li>Activate SIP becomes a DAO Proposal</li><li>Rules of the DAO apply - e.g.</li><li>Voting starts in 1 day / ends in 1 week</li></ol>'
	let st2 = '<p>About CABs - Advisory Boards!</p><ol><li>Goverance - join discussions</li><li>Tokenomics - join discussions</li><li>Technical - join discussions</li></ol>'
	let st3 = '<p>SIPs start out as suggestions or issues registered on GitHub</p><ol><li>GitHub is complicated - learn about why we use it.</li><li>Have a suggestion for improving Stacks?</li><li>Comment on someone else\'s suggestion?</li></ol>'
	let st4 = '<p>A <strong>Proposal</strong> is a Pull Request in GitHub lingo</p><ol><li>SIP workflow.</li><li>Review open proposals</li><li>Comment on open proposals</li></ol>'
	type Todo = {
		uid: string;
		created_at: Date;
		text: string;
		done: boolean;
		pending_delete: boolean;
	};
</script>

<svelte:head>
	<title>Stacks Improvement Proposals</title>
	<meta name="description" content="Help build the foundation for the User Owned Internet" />
</svelte:head>

<section>
    <div class="container my-5">
      <div class="row">
        <div class="col">
          <h1>Stacks Improvement Proposals</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-6 my-2"
        >
          <CardWithParams
		  	title="Activating SIP"
			image="img/bg/ecosys.jpg"
            subtitle={st1}
            linkTarget="/sip-landing/sip-voting"
            linkName="More About Voting"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams
			title="Advisory Boards"
			subtitle={st2}
			image="img/bg/ecosys.jpg"
            linkTarget="/sip-landing/sip-cabs"
            linkName="About the CABs"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams
		  	title="SIP Suggestions"
            subtitle={st3}
			image="img/bg/ecosys.jpg"
            linkTarget="/sip-landing/issues"
            linkName="Make a Suggestion?"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams
			title="SIP Proposals"
			subtitle={st4}
			image="img/bg/ecosys.jpg"
            linkTarget="/sip-landing/issues?filter=pulls"
            linkName="SIP Proposals"
          />
        </div>
      </div>
    </div>
  </section>

<style>
</style>
