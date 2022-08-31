import { writable, get } from 'svelte/store';
import ChainUtils from '$lib/service/ChainUtils';
import type { SettingsType } from "src/types/stxeco.type";

function createStore() {
  const initialValue:SettingsType = {
    extensions: undefined
  };
  // destructure the store on creation to have 'direct access' to methods
  const { subscribe, update, set } = writable(initialValue);

  return {
    subscribe,

    async init(stxAddress:string|undefined) {
      let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data';
      if (stxAddress) {
        url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data/' + stxAddress
      }
      const res = await fetch(url);
      const daoData = await res.json();
      daoData.proposals = daoData.proposals.filter((p) => p.contract.tx_status !== 'failed')
      if (stxAddress) {
        const callData = {
          path: '/v2/accounts/' + stxAddress,
          httpMethod: 'get',
          postData: null
        }
        const res = await ChainUtils.postToApi('/v2/accounts', callData);
        res.balance = ChainUtils.fromMicroAmount(res.balance);
        res.locked = ChainUtils.fromMicroAmount(res.locked);
        daoData.accountInfo = res;
      }

      if (res.ok) set(daoData);
    },

    changeSetting(key: string, value: SettingsType) {
      if (!key) return;
      let storeValue: SettingsType = get(this);
      storeValue = value;
      update((_) => storeValue);
    }
  };
}

export default createStore();
