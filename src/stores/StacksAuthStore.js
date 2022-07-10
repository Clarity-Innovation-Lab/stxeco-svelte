// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { writable } from 'svelte/store'
// import StacksAuthService from '../stores/StacksAuthService.js'

const profile = {
    username: '',
    loggedIn: false
}

const StacksAuthStore = writable(profile)

export default StacksAuthStore