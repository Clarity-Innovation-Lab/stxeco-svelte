import { createClient } from '@micro-stacks/client';
import type { ClientConfig } from '@micro-stacks/client';
import { StacksMocknet } from 'micro-stacks/network';

const network = import.meta.env.VITE_NETWORK;
let origin = import.meta.env.VITE_ORIGIN;
if (typeof window !== 'undefined') {
  origin = window.location.origin;
}
const config: ClientConfig = {
  appName: 'DAO on #Bitcoin',
  appIconUrl: origin + '/img/logo.png',
};

const client = createClient({ config });

if (network === 'testnet') {
  client.setNetwork('testnet')
} else if (network === 'local') {
  client.setNetwork(new StacksMocknet())
} else {
  client.setNetwork('mainnet')
}

export { client };
