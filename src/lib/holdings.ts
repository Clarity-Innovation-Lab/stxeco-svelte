import { writable, get } from 'svelte/store';
import type { HoldingsType } from "src/types/stxeco.type";

function createStore() {
  const initialValue:HoldingsType = {
    nfts: undefined
  };
  // destructure the store on creation to have 'direct access' to methods
  const { subscribe, update, set } = writable(initialValue);

  return {
    subscribe,

    async init(stxAddress:string|undefined) {
      if (!stxAddress) return;
      const url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/nft/' + stxAddress + '/' + 0 + '/25';
      const res = await fetch(url).catch(error => {
        console.error('error was: ' + error);
      });
      if (res && res.ok) {
        const holdings = await res.json();
        set(holdings);
      }
    },

    changeSetting(key: string, value: HoldingsType) {
      if (!key) return;
      let storeValue: HoldingsType = get(this);
      storeValue = value;
      update((_) => storeValue);
    }
  };
}

export default createStore();
