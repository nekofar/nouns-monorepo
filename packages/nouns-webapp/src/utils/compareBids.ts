import { Bid } from './types';

const timestampMultiple = BigInt(1_000_000);

const generateBidScore = (bid: Bid) =>
  BigInt(bid.timestamp) * BigInt(timestampMultiple) + BigInt(bid.transactionIndex);
export const compareBids = (bidA: Bid, bidB: Bid): number => {
  const aScore = generateBidScore(bidA);
  const bScore = generateBidScore(bidB);
  return Number(bScore - aScore);
};
