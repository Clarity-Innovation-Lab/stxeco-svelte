import settings from '$lib/settings'

const url = import.meta.env.PROD ? 'https://micro-stacks-sveltekit-example.vercel.app' : `http://${new URL(import.meta.url).host}`;

export const onPersistState = async (dehydratedState: string) => {
    const formData = new FormData();
  
    formData.set('dehydratedState', dehydratedState);
  
    await fetch(url + '/api/session/save', {
      method: 'POST',
      body: formData,
    });
    const state = JSON.parse(dehydratedState)
    await settings.init(state[1][1][0].address);
};
  
  export const onSignOut = async () => {
  await fetch(url + '/api/session/destroy', {
    method: 'POST',
    body: null,
  });
};