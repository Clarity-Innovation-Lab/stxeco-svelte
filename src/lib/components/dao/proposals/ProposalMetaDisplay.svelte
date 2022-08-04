<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';

	let contractId = $page.params.contractId;
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
</script>

<section>
  <div>
    {#if proposal.githubIssue}
    <div class="row">
      <div class="col-md-8 col-sm-12">
        Github Issue
      </div>
      <div class="col-md-8 col-sm-12">
          <a href={proposal.githubIssue} target="_blank">
            View issue on github
          </a>
      </div>
    </div>
    {/if}
    {#if proposal.githubPullRequest}
    <div class="row">
      <div class="col-md-8 col-sm-12">
        Github Pull Request
      </div>
      <div class="col-md-8 col-sm-12">
          <a href={proposal.githubPullRequest} target="_blank">View pull request on github</a>
      </div>
    </div>
    {/if}
    {#if proposal.description}
    <div class="row">
      <div class="col-md-2 col-sm-12">
        Additional Info
      </div>
      <div class="col-md-8 col-sm-12">
        <vue-markdown v-if="proposal.description" :source="proposal.description" />
        <div v-else>
          n/a
        </div>
      </div>
    </div>
    {/if}
  </div>
</section>

<style>
</style>
