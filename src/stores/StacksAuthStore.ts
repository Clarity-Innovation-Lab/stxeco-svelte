import { writable } from 'svelte/store';

const StacksAuthStore = writable({
  loggedIn: false,
  stxAddress: null,
});

//export const alert = writable('Welcome to the to-do list app!');

export default StacksAuthStore;
