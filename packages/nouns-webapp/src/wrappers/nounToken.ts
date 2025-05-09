import type { Address } from '@/utils/types';

import { useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';

import config, { cache, cacheKey, CHAIN_ID } from '@/config';
import {
  useReadNounsTokenBalanceOf,
  useReadNounsTokenDelegates,
  useReadNounsTokenGetCurrentVotes,
  useReadNounsTokenGetPriorVotes,
  useReadNounsTokenIsApprovedForAll,
  useReadNounsTokenSeeds,
  useWriteNounsTokenDelegate,
  useWriteNounsTokenSetApprovalForAll,
} from '@/contracts';
import { EscrowedNoun, Noun } from '@/subgraphs';

import {
  Delegates,
  accountEscrowedNounsQuery,
  delegateNounsAtBlockQuery,
  ownedNounsQuery,
  seedsQuery,
} from './subgraph';

export interface NounId {
  id: string;
}

export interface INounSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

const seedCacheKey = cacheKey(cache.seed, CHAIN_ID, config.addresses.nounsToken);
const isSeedValid = (seed: INounSeed | Record<string, never> | undefined) => {
  const expectedKeys = ['background', 'body', 'accessory', 'head', 'glasses'];
  const hasExpectedKeys = expectedKeys.every(key => (seed || {}).hasOwnProperty(key));
  const hasValidValues = Object.values(seed || {}).some(v => v !== 0);
  return hasExpectedKeys && hasValidValues;
};

const seedArrayToObject = (seeds: (INounSeed & { id: string })[]) => {
  return seeds.reduce<Record<string, INounSeed>>((acc, seed) => {
    acc[seed.id] = {
      background: Number(seed.background),
      body: Number(seed.body),
      accessory: Number(seed.accessory),
      head: Number(seed.head),
      glasses: Number(seed.glasses),
    };
    return acc;
  }, {});
};

const useNounSeeds = () => {
  const cache = localStorage.getItem(seedCacheKey);
  const cachedSeeds = cache ? JSON.parse(cache) : undefined;
  const { data } = useQuery(seedsQuery(), {
    skip: !!cachedSeeds,
  });

  useEffect(() => {
    if (!cachedSeeds && data?.seeds?.length) {
      localStorage.setItem(seedCacheKey, JSON.stringify(seedArrayToObject(data.seeds)));
    }
  }, [data, cachedSeeds]);

  return cachedSeeds;
};

export const useNounSeed = (nounId: bigint): INounSeed => {
  const seeds = useNounSeeds();
  const seed = seeds?.[nounId.toString()];

  const { data: response } = useReadNounsTokenSeeds({
    args: [nounId],
    query: { enabled: !seed },
  });

  if (response) {
    const seedCache = localStorage.getItem(seedCacheKey);
    if (seedCache && isSeedValid(response as unknown as INounSeed)) {
      const seedData = response as unknown as INounSeed;
      const updatedSeedCache = JSON.stringify({
        ...JSON.parse(seedCache),
        [nounId.toString()]: {
          accessory: seedData.accessory,
          background: seedData.background,
          body: seedData.body,
          glasses: seedData.glasses,
          head: seedData.head,
        },
      });
      localStorage.setItem(seedCacheKey, updatedSeedCache);
    }
    return response as unknown as INounSeed;
  }
  return seed;
};

export const useUserVotes = (): number | undefined => {
  const { address } = useAccount();
  return useAccountVotes(address ?? zeroAddress);
};

export const useAccountVotes = (account?: string): number | undefined => {
  const { data: votes } = useReadNounsTokenGetCurrentVotes({
    args: [account as Address],
    query: { enabled: !!account },
  });

  return votes ? Number(votes as bigint) : undefined;
};

export const useUserDelegatee = (): string | undefined => {
  const { address } = useAccount();

  const { data: delegate } = useReadNounsTokenDelegates({
    args: [address as Address],
    query: { enabled: !!address },
  });

  return delegate as string | undefined;
};

export const useUserVotesAsOfBlock = (block: number | undefined): number | undefined => {
  const { address } = useAccount();

  const { data: votes } = useReadNounsTokenGetPriorVotes({
    args: [address as Address, BigInt(block || 0)],
    query: { enabled: !!address && !!block },
  });

  return votes ? Number(votes as bigint) : undefined;
};

export const useDelegateVotes = () => {
  const { writeContractAsync, status, error } = useWriteNounsTokenDelegate({});

  return {
    send: (delegatee: Address) => writeContractAsync({ args: [delegatee] }),
    state: { status, errorMessage: error?.message },
  };
};

export const useNounTokenBalance = (address: string): number | undefined => {
  const { data: tokenBalance } = useReadNounsTokenBalanceOf({
    args: [address as Address],
    query: { enabled: !!address },
  });

  return tokenBalance ? Number(tokenBalance as bigint) : undefined;
};

export const useUserOwnedNounIds = (pollInterval: number) => {
  const { address } = useAccount();
  const {
    loading,
    data: nouns,
    error,
    refetch,
  } = useQuery<Array<Noun>>(ownedNounsQuery(address?.toLowerCase() ?? ''), {
    pollInterval: pollInterval,
  });
  const userOwnedNouns: number[] = nouns?.map(noun => Number(noun.id)) || [];
  return { loading, data: userOwnedNouns, error, refetch };
};

export const useUserEscrowedNounIds = (pollInterval: number, forkId: string) => {
  const { address } = useAccount();
  const {
    loading,
    data: escrowedNouns,
    error,
    refetch,
  } = useQuery<Array<EscrowedNoun>>(accountEscrowedNounsQuery(address?.toLowerCase() ?? ''), {
    pollInterval: pollInterval,
  });
  // filter escrowed nouns to just this fork
  const userEscrowedNounIds: number[] =
    escrowedNouns?.reduce((acc: number[], escrowedNoun) => {
      if (escrowedNoun.fork.id === forkId) {
        acc.push(+escrowedNoun.noun.id);
      }
      return acc;
    }, []) || [];
  return { loading, data: userEscrowedNounIds, error, refetch };
};

export const useSetApprovalForAll = () => {
  const { writeContractAsync, status, error } = useWriteNounsTokenSetApprovalForAll({});

  const isApprovedForAll = status === 'success';

  return {
    setApproval: (operator: Address, approved: boolean) =>
      writeContractAsync({ args: [operator, approved] }),
    setApprovalState: { status, errorMessage: error?.message },
    isApprovedForAll,
  };
};

export const useIsApprovedForAll = () => {
  const { address } = useAccount();

  const { data: isApprovedForAll } = useReadNounsTokenIsApprovedForAll({
    args: [address as Address, config.addresses.nounsDAOProxy as Address],
    query: { enabled: !!address },
  });

  return (isApprovedForAll as boolean) || false;
};

export const useDelegateNounsAtBlockQuery = (signers: string[], block: number) => {
  const { loading, data, error } = useQuery<Delegates>(delegateNounsAtBlockQuery(signers, block));
  return { loading, data, error };
};
