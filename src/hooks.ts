import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');
  event.routeId = cookies['userid'] || crypto.randomUUID();

  const response = await resolve(event);

  if (!cookies['userid']) {
    response.headers.set(
      'set-cookie',
      cookie.serialize('userid', event.routeId, {
        path: '/',
        httpOnly: true,
      })
    );
  }

  return response;
};
