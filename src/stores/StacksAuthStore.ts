import { writable } from 'svelte/store';

const StacksAuthStore = writable({
  loggedIn: false,
  stxAddress: null,
});

export default StacksAuthStore;
