import { isNounderNoun } from '../utils/nounderNoun';
import { useAppSelector } from '../hooks';
import { AuctionState } from '../state/slices/auction';

export interface Auction {
  amount: bigint;
  bidder: string;
  endTime: bigint;
  startTime: bigint;
  nounId: bigint;
  settled: boolean;
}

/**
 * Computes timestamp after which a Noun could vote
 * @param nounId TokenId of Noun
 * @returns Unix timestamp after which Noun could vote
 */
export const useNounCanVoteTimestamp = (nounId: number) => {
  const nextNounId = nounId + 1;

  const nextNounIdForQuery = isNounderNoun(BigInt(nextNounId)) ? nextNounId + 1 : nextNounId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  const maybeNounCanVoteTimestamp = pastAuctions.find((auction: AuctionState) => {
    const maybeNounId = auction.activeAuction?.nounId;
    return maybeNounId ? BigInt(maybeNounId) === BigInt(nextNounIdForQuery) : false;
  })?.activeAuction?.startTime;

  if (!maybeNounCanVoteTimestamp) {
    // This state only occurs during loading flashes
    return BigInt(0);
  }

  return BigInt(maybeNounCanVoteTimestamp);
};
