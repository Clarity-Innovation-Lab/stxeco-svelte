/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import StacksAuthStore from '../../stores/StacksAuthStore.js';
// import { client } from './micro-stacks-client.ts';
import settings from '$lib/settings'
import { AppConfig, UserSession, showConnect, authenticate } from '@stacks/connect'
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

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
  if (userSession.isUserSignedIn()) {
    p.loggedIn = true;
    p.stxAddress = userSession.loadUserData().stxAddress;
    /**
    if (network === 'testnet') {
      p.stxAddress = client.testnetStxAddress;
    } else if (network === 'devnet') {
      p.stxAddress = client.testnetStxAddress;
    }
    **/
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
    const authOptions = {
      sendToSignIn: false,
      userSession: userSession,
      redirectTo: '/create',
      manifestPath: '/manifest.json',
      onFinish: () => {
        StacksAuthStore.update(() => {
          return getProfile();
        });
      },
      appDetails: defDetails
    }
    showConnect(authOptions);
    settings.init()
  },
  logout: async function () {
    if (userSession.isUserSignedIn()) {
      await client.signOut();
      StacksAuthStore.update(() => {
        return getProfile();
      });
      settings.init()
    }
  },
  updateLoginStatus: function () {
    StacksAuthStore.update(() => {
      return getProfile();
    });
  }
};

export default StacksAuthService;
