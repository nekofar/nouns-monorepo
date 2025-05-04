import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';

/**
 * A function that takes a block number from the chain and returns the timestamp of when the block occurred.
 * @param blockNumber target block number to retrieve the timestamp for
 * @returns unix timestamp of block number
 */
export function useBlockTimestamp(blockNumber: number | undefined): number | undefined {
  const publicClient = usePublicClient();
  const [blockTimestamp, setBlockTimestamp] = useState<number | undefined>();

  useEffect(() => {
    async function updateBlockTimestamp() {
      if (!blockNumber || !publicClient) return;

      try {
        const blockData = await publicClient.getBlock({
          blockNumber: BigInt(blockNumber),
        });
        setBlockTimestamp(blockData.timestamp ? Number(blockData.timestamp) : undefined);
      } catch (error) {
        console.error('Failed to fetch block timestamp:', error);
      }
    }

    updateBlockTimestamp();
  }, [blockNumber, publicClient]);

  return blockTimestamp;
}
