import { writable, get } from 'svelte/store';
import authService from '$lib/service/StacksAuthService';

function createStore() {

    const initialValue = {}
    // destructure the store on creation to have 'direct access' to methods
    const {subscribe, update, set} = writable(initialValue);

    return {
        subscribe,

        async init() {
            let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data'
            if (authService.getProfile().loggedIn) {
                url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/dao-data/' + authService.getProfile().stxAddress
            }
            const res = await fetch(url)
            const daoData = await res.json()
            if (res.ok) set( daoData );
        },

        changeSetting(key:string, value:any) {
            if(!key) return;
            const storeValue:any = get(this)
            storeValue[key] = value
            update(_ => storeValue)
            
        }
    }
}

export default createStore();
