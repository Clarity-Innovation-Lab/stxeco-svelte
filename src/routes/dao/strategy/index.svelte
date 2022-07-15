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
  import settings from '$lib/settings'
  import type { ProposalType } from "../../../types/stxeco.type";
  import { ArrowUpRightCircle } from "svelte-bootstrap-icons";
  import { DateTime } from 'luxon'
  export let proposals:Array<ProposalType> = settings;
  console.log(proposals)
  const canPropose = () => {
      return true
  }    
  </script>
  
  <svelte:head>
    <title>Dao Strategy</title>
    <meta name="description" content="Svelte demo app" />
  </svelte:head>
  
  <section>
    <div></div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          Dao Launch Strategy
        </div>
      </div>
    </div>
  </section>
  
  <style>
  </style>
  