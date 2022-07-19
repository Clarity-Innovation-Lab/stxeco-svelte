import { writable, get } from 'svelte/store';
//import authService from '$lib/service/StacksAuthService';
import type { SettingsType } from "../types/stxeco.type";

function createStore() {
  const initialValue = {};
  // destructure the store on creation to have 'direct access' to methods
  const { subscribe, update, set } = writable(initialValue);

  return {
    subscribe,

    async init(stxAddress:string|null) {
      let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data';
      if (stxAddress) {
        url =
          import.meta.env.VITE_CLARITYLAB_API +
          '/daoapi/v2/dao-data/' +
          stxAddress;
      }
      const res = await fetch(url);
      const daoData = await res.json();
      if (res.ok) set(daoData);
    },

    changeSetting(key: string, value: SettingsType) {
      if (!key) return;
      let storeValue: SettingsType = get(this);
      storeValue = value;
      update((_) => storeValue);
    },
  };
}

export default createStore();
