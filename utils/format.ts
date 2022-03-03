import BigNumber from 'bignumber.js';
// import { parseUnits } from 'ethers/lib/utils';
// export const parseAmount = (val: string, decimals: string | number): bigint => {
//   try {
//     const fixedVal = new BigNumber(val).toFixed(Number(decimals)); // Fix for scientific notation string
//     const str = parseUnits(fixedVal, decimals).toString();
//     return BigInt(str);
//   } catch (err) {
//     return BigInt(0);
//   }
// };

export const VerifyDomainName = (domain: string | undefined): boolean => {
  try {
    if(!domain || domain.length < 3 || domain.length > 64) return false
    const reg = /^[a-z0-9\-]+$/;
    return reg.test(domain) ? true : false
  } catch (err) { 
    return false;
  }
};