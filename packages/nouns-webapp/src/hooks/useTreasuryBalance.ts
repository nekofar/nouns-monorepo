import useLidoBalance from './useLidoBalance';
import useTokenBuyerBalance from './useTokenBuyerBalance';
import config from '../config';
import { useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';
import axios from 'axios';
/**
 * Computes treasury balance (ETH + Lido)
 *
 * @returns Total balance of treasury (ETH + Lido) as EthersBN
 */
export const useTreasuryBalance = () => {
  const { data: ethBalance } = useBalance({
    address: config.addresses.nounsDaoExecutor as `0x${string}`,
  });

  const { data: ethBalanceTreasuryV2 } = useBalance({
    address: config.addresses.nounsDaoExecutorProxy as `0x${string}`,
  });

  const lidoBalanceAsETH = useLidoBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceTreasuryV2AsETH = useLidoBalance(config.addresses.nounsDaoExecutorProxy);
  const tokenBuyerBalanceAsETH = useTokenBuyerBalance();

  return (
    (ethBalance?.value ?? 0n) +
    (ethBalanceTreasuryV2?.value ?? 0n) +
    (lidoBalanceAsETH ?? 0n) +
    (lidoBalanceTreasuryV2AsETH ?? 0n) +
    (tokenBuyerBalanceAsETH ?? 0n)
  );
};

/**
 * Computes treasury usd value of treasury assets (ETH + Lido) at current ETH-USD exchange rate
 *
 * @returns USD value of treasury assets (ETH + Lido) at current exchange rate
 */
export const useTreasuryUSDValue = () => {
  const etherPrice = Number(useCoingeckoPrice('ethereum', 'usd'));
  const treasuryBalance = useTreasuryBalance() ?? 0n;

  // Convert bigint to number using viem's formatEther
  const treasuryBalanceETH = Number(formatEther(treasuryBalance));

  return etherPrice * treasuryBalanceETH;
};

/**
 * Custom hook to fetch cryptocurrency prices from CoinGecko API
 *
 * @param cryptoId - The id of the cryptocurrency on CoinGecko (e.g., 'ethereum', 'bitcoin')
 * @param vsCurrency - The currency to convert to (e.g., 'usd', 'eur')
 * @returns The current price of the cryptocurrency in the specified currency
 */
export const useCoingeckoPrice = (cryptoId: string, vsCurrency: string): string => {
  const [price, setPrice] = useState<string>('0');

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${vsCurrency}`,
        );

        if (response.data && response.data[cryptoId] && response.data[cryptoId][vsCurrency]) {
          setPrice(response.data[cryptoId][vsCurrency].toString());
        }
      } catch (error) {
        console.error('Error fetching price from CoinGecko:', error);
      }
    };

    fetchPrice();

    // Set up a polling interval to keep the price updated
    const intervalId = setInterval(fetchPrice, 60000); // Update every minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [cryptoId, vsCurrency]);

  return price;
};
