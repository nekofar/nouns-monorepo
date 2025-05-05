import { IBid } from '../wrappers/subgraph';

/**
 * Sorts bids chronologically using block timestamp and
 * transaction index within the block.
 * @param a First bid
 * @param b Second bid
 */
export const compareBidsChronologically = (a: IBid, b: IBid): number => {
  const adjustedTimes = {
    a: BigInt(a.blockTimestamp) * 1_000_000n + BigInt(a.txIndex ?? 0),
    b: BigInt(b.blockTimestamp) * 1_000_000n + BigInt(b.txIndex ?? 0),
  };
  return Number(adjustedTimes.b - adjustedTimes.a);
};
