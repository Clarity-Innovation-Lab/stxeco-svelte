<script lang="ts">
	import CardWithParams from '../../shared/CardWithParams.svelte'

	let st1 = '<p>Submit proposals to the DAO</p>'
	let st2 = '<p>Ongoing votes - delegate your vote</p>'
	let st3 = '<p>Get involved - join the discussion</p>'
	let st4 = '<p>The DAO is a community</p>'

</script>

<svelte:head>
	<title>DAO</title>
	<meta name="description" content="Submit and vote on proposals" />
</svelte:head>

<section>
    <div class="container my-5">
      <div class="row">
        <div class="col">
        </div>
      </div>
      <div class="row">
        <div class="col-6 my-2"
        >
          <CardWithParams
		  	title="Proposals"
			image="img/bg/thinker.jpg"
            subtitle={st1}
            linkTarget="/dao/proposals"
            linkName="Proposals"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams
			title="Voting"
			subtitle={st2}
			image="img/bg/vote.jpg"
            linkTarget="/dao/voting"
            linkName="Voting"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams
		  	title="Forum"
            subtitle={st3}
			image="img/bg/seats.jpg"
            linkTarget="/sip-landing/issues"
            linkName="Make a Suggestion?"
          />
        </div>
        <div class="col-6 my-2"
        >
          <CardWithParams
			title="Membership"
			subtitle={st4}
			image="img/bg/membership.jpg"
            linkTarget="/dao/membership?filter=pulls"
            linkName="Learn About Membership"
          />
        </div>
      </div>
    </div>
  </section>

<style>
</style>
