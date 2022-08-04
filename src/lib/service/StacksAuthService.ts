/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import StacksAuthStore from '../../stores/StacksAuthStore.js';
import { client } from '$lib/micro-stacks-client.ts';
import settings from '$lib/settings';

interface Profile {
  username: string;
  stxAddress: string;
  loggedIn: boolean;
}

const network = import.meta.env.VITE_NETWORK;

const getProfile: Profile = () => {
  const p: Profile = {
    username: '',
    loggedIn: false,
  };
  if (client.hasSession) {
    p.loggedIn = true;
    p.stxAddress = client.stxAddress;
    if (network === 'testnet') {
      p.stxAddress = client.testnetStxAddress;
    } else if (network === 'devnet') {
      p.stxAddress = client.testnetStxAddress;
    }
    return p;
  } else {
    return p;
  }
};

const StacksAuthService = {
  getProfile: function () {
    return getProfile();
  },
  login: async function () {
    console.log('Runing on the server...');
    if (!client.hasSession) await client.authenticate();
    StacksAuthStore.update(() => {
      return getProfile();
    });
    settings.init();
  },
  logout: async function () {
    if (client.hasSession) {
      await client.signOut();
      StacksAuthStore.update(() => {
        return getProfile();
      });
      settings.init();
    }
  },
  updateLoginStatus: function () {
    StacksAuthStore.update(() => {
      return getProfile();
    });
  },
};

export default StacksAuthService;
