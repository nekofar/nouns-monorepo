import { cache, cacheKey, CHAIN_ID } from '../config';

export const ensCacheKey = (address: string) => {
  return cacheKey(cache.ens, CHAIN_ID, address);
};
