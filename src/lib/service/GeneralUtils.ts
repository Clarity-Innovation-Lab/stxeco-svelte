import { sha256 } from 'js-sha256'
import { standardPrincipalCV, uintCV } from 'micro-stacks/clarity';

const precision = 1000000
const btcPrecision = 100000000

const GeneralUtils = {
  postToApi: async (path:string, data:unknown) => {
    const url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi' + path;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },  
  buildHash: function (hashable:string) {
    const hash = sha256.create()
    hash.update(hashable)
    return hash.hex()
    // return crypto.createHash('sha256').update(hashable).digest('hex')
  },
  isValidAddress: function (addr: string) {
    try {
      standardPrincipalCV(addr)
      const network = process.env.VUE_APP_NETWORK
      if (network === 'testnet' && addr.indexOf('ST') !== 0) return false
      if (network === 'mainnet' && addr.indexOf('SP') !== 0) return false
      return true
    } catch (err) {
      return false
    }
  },
  isValidAmount: function (amt: number) {
    try {
      uintCV(amt)
      return true
    } catch (err) {
      return false
    }
  },
  fromSatoshi: function (amount: number) {
    try {
      return Math.round(amount) / btcPrecision
    } catch {
      return 0
    }
  },
  fromOnChainAmount: function (amountMicroStx: string, gftPrecision: number) {
    try {
      let amountMStx = parseInt(amountMicroStx, 16)
      if (typeof amountMicroStx === 'string') {
        amountMStx = Number(amountMStx)
      }
      if (amountMStx === 0) return 0
      if (!gftPrecision) {
        amountMStx = amountMStx / precision
        return Math.round(amountMStx * precision) / precision
      } else {
        const newPrec = Math.pow(10, gftPrecision)
        amountMStx = amountMStx / newPrec
        return Math.round(amountMStx * newPrec) / newPrec
      }
    } catch {
      return 0
    }
  },
  toOnChainAmount: function (amount: number, gftPrecision?: number|undefined) {
    try {
      if (!gftPrecision) {
        amount = amount * precision
        return amount; // Math.round(amount * precision) / precision
      } else {
        const newPrec = Math.pow(10, gftPrecision)
        amount = amount * newPrec
        return Math.round(amount * newPrec) / newPrec
      }
    } catch {
      return 0
    }
  },
  toDecimals: function (amount: number, precision: number) {
    if (!precision) precision = 100
    if (!amount) return
    if (typeof amount === 'string') {
      amount = Number(amount)
    }
    return Math.round(amount * precision) / precision // amount.toFixed(2)
  },
  fromMicroAmount: function (amountMicroStx: number) {
    try {
      if (amountMicroStx === 0) return 0
      const val = Math.round(amountMicroStx) / (precision)
      return val
    } catch {
      return 0
    }
  },
  sortResults: function (resultSet: any[]) {
    resultSet = resultSet.sort(function compare (a: { title: string }, b: { title: string }) {
      const nameA = a.title.toUpperCase() // ignore upper and lowercase
      const nameB = b.title.toUpperCase() // ignore upper and lowercase
      if (nameA > nameB) {
        return -1
      }
      if (nameA < nameB) {
        return 1
      }
      // names must be equal
      return 0
    })
    return resultSet
  },
  stringToHex: function (str: { length: number; charCodeAt: (arg0: number) => { (): any; new(): any; toString: { (arg0: number): any; new(): any } } }) {
    const arr = []
    for (let i = 0; i < str.length; i++) {
      arr[i] = (str.charCodeAt(i).toString(16)).slice(-4)
    }
    return '0x' + arr.join('')
  }
}
export default GeneralUtils
