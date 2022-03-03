import {getCrc32} from '@dfinity/principal/lib/esm/utils/getCrc'

// var getCrc = require("@dfinity/principal/lib/esm/utils/getCrc");
// factory file in js
// const withTM = require("next-transpile-modules")(["mojave/classes"]);
// 

import { IDL } from '@dfinity/candid';
import {
  Actor,
  ActorSubclass,
  HttpAgent,
  Identity,
} from "@dfinity/agent";
const suffix = '.icp'

export type ActorProps = {
  canisterId?: string;
  interfaceFactory: IDL.InterfaceFactory;
};

export const shortPrincipal = (
  principalId?: string,
  firstLength = 5,
  lastLength = 3
) => {
  if (principalId) {
    const firstPart = principalId.slice(0, firstLength);
    const secondPart = principalId.slice(
      principalId.length - lastLength,
      principalId.length
    );

    return `${firstPart}...${secondPart}`;
  }
};

// export const shortPrincipal = (principal: string | undefined) => {
//   console.log(principal)
//   return `${principal?.substr(0,5)}...${principal?.substr(-4)}`
// }

export const getTimeString = (t: bigint | undefined) => {
  if (!t) {
    return undefined
  }
  var d = new Date(Number(t / BigInt(1000000)));
  return d.toLocaleString('en-US', { timeZone: 'UTC' });
}

// _ - number character
export const addIcpSuffix = (name: string | undefined) => {
  if (typeof name === 'undefined') return;
  if (!name.endsWith(suffix))
    return name + suffix
  else
    return name

}

export const verifyAccountId = (hexString: string) => {
  if (hexString.length !== 64){
    throw new Error('Invalid account id: wrong length')
  }
  // crc part
  var crc = Number('0x'+ hexString.slice(0, 8))
  // id part
  var id = Uint8Array.from(Buffer.from((hexString).slice(8), 'hex'))
  if (crc !== getCrc32(id))
    throw new Error('Invalid account id: crc check error.')
  else 
    return true
}

export const removeIcpSuffix = (name: string | undefined) => {
  if (typeof name === 'undefined') return;
  if (name.endsWith(suffix))
    return name.slice(0, name.length - 4)
  else
    return name
}

export const getCountDownTimeString = (t: bigint | undefined) => {
  if (!t) {
    return undefined
  }
  var endTime = new Date(Number(t / BigInt(1000000))).getTime()
  var currentTime = new Date().getTime()

  if (currentTime >= endTime) {
    return {
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }
  var diff = endTime - currentTime
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const day = Math.floor(hours / 24)
  return {
    day: day,
    hours: (hours - day * 24),
    minutes: (minutes - hours * 60),
    seconds: (seconds - minutes * 60)
  }
}

export const getCountDownTime = (t: bigint | undefined) => {
  if (!t) {
    return undefined
  }
  var endTime = new Date(Number(t / BigInt(1000000))).getTime()
  var currentTime = new Date().getTime()
  return endTime > currentTime ? endTime - currentTime : 0
}

export const verifyConnectionAndAgent = async () => {
  try {
    // @ts-ignore
    const connected = await window.ic.plug.isConnected();
    // @ts-ignore
    // @ts-ignore
    if (!connected) await window.ic.plug.requestConnect({
      whitelist: ["kqomr-yaaaa-aaaai-qbdzq-cai"]
    });
    // @ts-ignore
    // @ts-ignore
    if (connected && !window.ic.plug.agent) {
      // @ts-ignore
      await window.ic.plug.createAgent({
        whitelist: ["kqomr-yaaaa-aaaai-qbdzq-cai"]
      })
    }
    return true;
  } catch (e) {
    console.log(e);
  }
}
