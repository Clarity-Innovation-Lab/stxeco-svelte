<script lang="ts">
  import { Buffer } from "buffer";
  import { onMount } from "svelte";
  import StacksAuthService from "$lib/service/StacksAuthService";
  import Header from "$lib/header/Header.svelte";
  import "../app.scss";
  import Footer from "$lib/header/Footer.svelte";
  import { page } from "$app/stores";

  if (typeof window !== "undefined") {
    // @ts-ignore
    window.Buffer = Buffer;
  }

  onMount(async () => {
    StacksAuthService.updateLoginStatus();
  });

  console.log("Page=", page);
</script>

<Header />

<main class="my-5" style="min-height: 70vh; background-size: contain;">
  <slot />
</main>

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
