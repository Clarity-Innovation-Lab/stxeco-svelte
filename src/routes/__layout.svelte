<script lang="ts">
    import { Buffer } from "buffer";
    import "../app.scss";
    import settings from '$lib/settings'
    import {onMount} from 'svelte'
    import StacksAuthService from "$lib/service/StacksAuthService";
    import Header from "$lib/header/Header.svelte";
    import Footer from "$lib/header/Footer.svelte";
    import { page } from "$app/stores";

    let bootstrap;

    if (typeof window !== "undefined") {
      // @ts-ignore
      window.Buffer = Buffer;
    }
    let appInitialized:boolean
    onMount(async () => {
      try {
        //bootstrap = (await import('bootstrap'));
          StacksAuthService.updateLoginStatus();
          await settings.init()           
          appInitialized = true
          console.log("Page=", page);
      } catch(error) {
            console.error(error)
      }
  })

</script>

<Header />
{#if appInitialized}
<main class="my-5" style="min-height: 70vh; background-size: contain;">
  <slot />
</main>
{/if}
<Footer/>

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
