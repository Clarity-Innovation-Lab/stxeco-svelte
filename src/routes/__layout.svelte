<script lang="ts">
    // import { Buffer } from "buffer";
    import "../app.scss";
    import settings from '$lib/settings'
    import {tick, onMount} from 'svelte'
    import Header from "$lib/header/Header.svelte";
    import Footer from "$lib/header/Footer.svelte";
    import { page } from "$app/stores";
    import Notifications from 'svelte-notifications';
    import { mountClient } from "@micro-stacks/svelte";
    import { getAccount } from '@micro-stacks/svelte';

    mountClient({
        appName: 'Ecosystem DAO',
        appIconUrl: 'img/logo.png'
    })
    const account = getAccount();

    let bootstrap: { Tooltip: new (arg0: any) => any; Dropdown: new (arg0: any) => any; };

    if (typeof window !== "undefined") {
      // @ts-ignore
      // window.Buffer = Buffer;
    }
    let appInitialized:boolean
    onMount(async () => {
      try {
          bootstrap = (await import('bootstrap'));
          await settings.init($account.stxAddress)           
          appInitialized = true
          console.log("Page=", page);
          await tick();
          setTimeout(function () {
            const tooltipTriggerList = window.document.querySelectorAll('[data-bs-toggle="tooltip"]')
            if (tooltipTriggerList) [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
            const popoverTriggerList = window.document.querySelectorAll('[data-bs-toggle="dropdown"]')
            if (popoverTriggerList) [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Dropdown(popoverTriggerEl))
          }, 1000)

      } catch(error) {
            console.error(error)
      }
  })
</script>

<Notifications>
  <Header />
{#if appInitialized}
<main class="my-5" style="min-height: 70vh; background-size: contain;">
  <slot />
</main>
{/if}
<Footer/>
</Notifications>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

</style>
