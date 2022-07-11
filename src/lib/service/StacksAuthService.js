/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import StacksAuthStore from '../../stores/StacksAuthStore.js'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'

const network = import.meta.env.VITE_NETWORK
let origin = import.meta.env.VITE_ORIGIN
if (typeof window !== 'undefined') {
  origin = window.location.origin
}

const defDetails = {
    name: 'Clarity Smart Contracts for #Bitcoin',
    icon: origin + '/img/logo.png'
}

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

const getProfile = (userSession) => {
    if (userSession.isUserSignedIn()) {
        const stacksProfile = userSession.loadUserData().profile
        const profile = {
            username: stacksProfile.name,
            description: stacksProfile.description,
            loggedIn: true    
        }
        profile.stxAddress = (stacksProfile.stxAddress.devnet) ? stacksProfile.stxAddress.devnet : stacksProfile.stxAddress.testnet
        if (network === 'mainnet') {
            profile.stxAddress = stacksProfile.stxAddress.mainnet
        } else if (network === 'testnet') {
            profile.stxAddress = stacksProfile.stxAddress.testnet
        }
        return profile
    } else {
        return {
            stxAddress: '',
            username: '',
            loggedIn: false,
            description: null     
        }
    }
}

const StacksAuthService = {
    login: function () {
        console.log('Runing on the server...')
        const authOptions = {
            sendToSignIn: false,
            userSession: userSession,
            redirectTo: '/create',
            manifestPath: '/manifest.json',
            onFinish: ({ userSession }) => {
                StacksAuthStore.update(p => {
                    return getProfile(userSession)
                })
            },
            appDetails: defDetails
        }
        showConnect(authOptions)
    },
    logout: function () {
        if (userSession.isUserSignedIn()) {
            userSession.signUserOut()
            StacksAuthStore.update(() => {
                return getProfile(userSession)
            })
        }    
    },
    updateLoginStatus: function () {
        StacksAuthStore.update(() => {
            return getProfile(userSession)
        })
    }
}
  

export default StacksAuthService