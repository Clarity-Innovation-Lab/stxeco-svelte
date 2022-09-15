<script lang="ts">
import "../app.scss";
import settings from '$lib/settings';
import {tick, onMount} from 'svelte';
import Homepage from "$lib/components/homepage/Homepage.svelte";
import Header from "$lib/header/Header.svelte";
import Footer from "$lib/header/Footer.svelte";
import { page } from "$app/stores";
import Notifications from 'svelte-notifications';
import { mountClient } from "@micro-stacks/svelte";
import { getAccount, getNetwork } from '@micro-stacks/svelte';
import { getAuth } from "@micro-stacks/svelte";
import { afterNavigate } from '$app/navigation';
import Four01 from '$lib/shared/Four01.svelte';

let origin = import.meta.env.VITE_ORIGIN;
if (typeof window !== 'undefined') {
  origin = window.location.origin;
}

let homepage = false;
if ($page.url.pathname === '/') {
  homepage = true;
}

const config = {
  appName: 'Ecosystem DAO',
  appIconUrl: origin + '/img/logo.png',
  network: import.meta.env.VITE_NETWORK
};
mountClient(config);
const network = getNetwork();
const auth = getAuth();
$network.setNetwork(import.meta.env.VITE_NETWORK);
const account = getAccount();

let bootstrap: { Tooltip: new (arg0: any) => any; Dropdown: new (arg0: any) => any; };
let four01 = false;

let appInitialized:boolean = false;
afterNavigate((nav) => {
  if (nav.to.pathname === '/') {
    homepage = true;
  } else {
    homepage = false;
  }

  if (!$auth.isSignedIn && !$auth.isRequestPending) {
    if (nav.to?.pathname && nav.to.pathname.indexOf('/dao/proposals/') > -1) {
      console.log('to: ', nav.to);
      //goto(`/401`, { replaceState: true })
      four01 = true;
    } else {
      four01 = false;
    }
  } else {
      four01 = false;
  }
})
onMount(async () => {
  try {
      bootstrap = (await import('bootstrap'));
      await settings.init($account.stxAddress);     
      appInitialized = true;
      console.log("Page=", page);
      await tick();
      setTimeout(function () {
        const tooltipTriggerList = window.document.querySelectorAll('[data-bs-toggle="tooltip"]');
        if (tooltipTriggerList) [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        const popoverTriggerList = window.document.querySelectorAll('[data-bs-toggle="dropdown"]');
        if (popoverTriggerList) [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Dropdown(popoverTriggerEl));
      }, 1000)

  } catch(error) {
        console.log(error);
  }
})
</script>

<Notifications>
{#if !homepage}
  <Header />
  {#if four01}
    <Four01 />
  {/if}
  {#if appInitialized}
  <main class="my-5" style="min-height: 70vh; background-size: contain;">
    <slot />
  </main>
  {/if}
  <Footer />
{:else}
  <Homepage />
  <Footer />
{/if}
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
