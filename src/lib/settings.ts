import { writable, get } from 'svelte/store';
import ChainUtils from '$lib/service/ChainUtils';
import type { SettingsType } from "src/types/stxeco.type";
import type { ProposalType } from "src/types/stxeco.type";
import DaoUtils from '$lib/service/DaoUtils';
import { fetchNamesByAddress } from "micro-stacks/api";

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
      daoData.proposals = daoData.proposals.filter((p:ProposalType) => p.contract.tx_status !== 'failed')
      const stacksTipHeight = daoData.info?.stacks_tip_height || 0;
      daoData.proposals.forEach((proposal:ProposalType) => {
        proposal.status = DaoUtils.getStatus(stacksTipHeight, proposal);
        // console.log(proposal.contractId + ' -> ' + proposal.status.name)
      })
  
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
        fetchNamesByAddress({ url: import.meta.env.VITE_APP_STACKS_API, blockchain: "stacks", address: stxAddress }).then((result) => {
          daoData.accountInfo.bnsName = result && result.names && result.names[0];
        })
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
