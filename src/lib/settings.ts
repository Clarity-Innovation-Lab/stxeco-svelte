import { writable, get } from 'svelte/store';
import GeneralUtils from '$lib/service/GeneralUtils';
import type { SettingsType } from "src/types/stxeco.type";
import authService from '$lib/service/StacksAuthService';

function createStore() {
  const initialValue:SettingsType = {
    extensions: undefined
  };
  // destructure the store on creation to have 'direct access' to methods
  const { subscribe, update, set } = writable(initialValue);

  return {
    subscribe,

    async init() {
      let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data';
      if (authService.getProfile().loggedIn) {
        url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data/' + authService.getProfile().stxAddress
      }
      const res = await fetch(url);
      const daoData = await res.json();
      if (authService.getProfile().loggedIn) {
        const callData = {
          path: '/v2/accounts/' + authService.getProfile().stxAddress,
          httpMethod: 'get',
          postData: null
        }
        const res = await GeneralUtils.postToApi('/v2/accounts', callData);
        res.balance = GeneralUtils.fromMicroAmount(res.balance);
        res.locked = GeneralUtils.fromMicroAmount(res.locked);
        daoData.accountInfo = res;
      }

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
