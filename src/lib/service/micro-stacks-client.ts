import { createClient } from '@micro-stacks/client';
import type { ClientConfig } from '@micro-stacks/client';

let origin = import.meta.env.VITE_ORIGIN;
if (typeof window !== 'undefined') {
  origin = window.location.origin;
}

const config: ClientConfig = {
  appName: 'DAO on #Bitcoin',
  appIconUrl: origin + '/img/logo.png',
};

const client = createClient({ config });

export { client };
