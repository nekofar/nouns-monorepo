import { useReadContract } from 'wagmi';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';

const { addresses } = config;

function useLidoBalance(address: string | undefined) {
  const { data: balance } = useReadContract({
    address: addresses.lidoToken as `0x${string}`,
    abi: ERC20,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && addresses.lidoToken),
    },
  });

  return balance;
}

export default useLidoBalance;
