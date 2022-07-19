<script context="module" lang="ts">
  export async function load({ fetch }) {
    const url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/proposals'
    const res = await fetch(url)
    const proposals = await res.json()
    if (res.ok) {
      return {
        props: {
          proposals
        }
      }
    } else {
      return {
        status: res.status,
        error: new Error('Could not fetch proposals')
      }
    }
  }
  </script>
  
  <script lang="ts">
  import type { ProposalType } from "../../../types/stxeco.type";
  import { ArrowUpRightCircle } from "svelte-bootstrap-icons";
  import settings from '$lib/settings';
  import { DateTime } from 'luxon'
  export let proposals:Array<ProposalType>;
  console.log(proposals)
  const canPropose = () => {
      return true
  }    
  </script>
  
  <svelte:head>
    <title>SIP Suggestions</title>
    <meta name="description" content="Svelte demo app" />
  </svelte:head>
  
  <section>
    <div></div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <table class="table table-striped text-small">
            <thead>
              <tr>
              <th scope="col">Title</th>
              <th scope="col">State</th>
              <th scope="col">Proposed By</th>
              <th scope="col">Date</th>
              <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each proposals as item}
              <tr>
                <th scope="row" class="py-3"><a class="mr-2 text-info" href={'/dao/proposals/' + item.contractId}>{item.title}</a></th>
                <td class="py-3">{item.status}</td>
                <td class="py-3">{item.proposer}</td>
                <td class="py-3">{(!item.created) ? '' : DateTime.fromMillis(item.created).toLocaleString({ month: 'short', day: '2-digit', year: '2-digit' })}</td>
                <td class="py-3">
                  <a target="_blank" class="mr-2 text-info" href={'/dao/proposals/' + item.contractId}>
                    <span data-bs-toggle="tooltip" data-bs-placement="top" title="View on GitHub">
                      <ArrowUpRightCircle fill="purple" width={20} height={20} />
                    </span>
                  </a>
                </td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  
  <style>
    section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
  </style>
  