<script lang="ts">
  import CardWithParams from "../../shared/CardWithParams.svelte";

  const cardData = [
    {
      title: "Activating SIP",
      image: "img/bg/ecosys.jpg",
      subtitle: `<p>Getting the community involved via the DAO</p>
        <ol>
          <li>Activate SIP becomes a DAO Proposal</li>
          <li>Rules of the DAO apply - e.g.</li>
          <li>Voting starts in 1 day / ends in 1 week</li>
        </ol>`,
      linkTarget: "/sip-landing/sip-voting",
      linkName: "More About Voting",
    },
    {
      title: "Advisory Boards",
      image: "img/bg/ecosys.jpg",
      subtitle: `<p>About CABs - Advisory Boards!</p>
        <ol>
          <li>Governance - join discussions</li>
          <li>Tokenomics - join discussions</li>
          <li>Technical - join discussions</li>
        </ol>`,
      linkTarget: "/sip-landing/sip-cabs",
      linkName: "About the CABs",
    },
    {
      title: "SIP Suggestions",
      image: "img/bg/ecosys.jpg",
      subtitle: `<p>SIPs start out as suggestions or issues registered on GitHub</p>
        <ol>
          <li>GitHub is complicated - learn about why we use it.</li>
          <li>Have a suggestion for improving Stacks?</li>
          <li>Comment on someone else's suggestion?</li>
        </ol>`,
      linkTarget: "/sip-landing/issues",
      linkName: "Make a suggestion?",
    },
    {
      title: "SIP Proposals",
      image: "img/bg/ecosys.jpg",
      subtitle: `<p>A <strong>Proposal</strong> is a Pull Request in GitHub lingo</p>
        <ol>
          <li>SIP workflow.</li>
          <li>Review open proposals</li>
          <li>Comment on open proposals</li>
        </ol>`,
      linkTarget: "/sip-landing/sip-voting",
      linkName: "SIP Proposals",
    },
  ];

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
  <meta
    name="description"
    content="Help build the foundation for the User Owned Internet"
  />
</svelte:head>

<section>
  <div class="container my-5">
    <div class="row">
      <div class="col">
        <h1>Stacks Improvement Proposals</h1>
      </div>
    </div>
    <div class="row">
      {#each cardData as card}
        <div class="col-6 my-2">
          <CardWithParams
            title={card.title}
            image={card.image}
            subtitle={card.subtitle}
            linkTarget={card.linkTarget}
            linkName={card.linkName}
          />
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
</style>
