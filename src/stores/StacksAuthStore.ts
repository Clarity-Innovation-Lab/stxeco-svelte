import { writable } from 'svelte/store';
import type { ProfileType } from "../types/stxeco.type";

const profile:ProfileType = {
  loggedIn: false,
  stxAddress: undefined,
}
const StacksAuthStore = writable(profile);

//export const alert = writable('Welcome to the to-do list app!');

export default StacksAuthStore;
