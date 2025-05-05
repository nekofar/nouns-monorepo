import { useBalance } from 'wagmi';
import useLidoBalance from './useLidoBalance';

function useForkTreasuryBalance(treasuryContractAddress?: string) {
  const { data: ethBalanceData } = useBalance({
    address: treasuryContractAddress as `0x${string}` | undefined,
  });
  const lidoBalanceAsETH = useLidoBalance(treasuryContractAddress);

  const ethBalance = ethBalanceData?.value ?? 0n;

  return ethBalance + ((lidoBalanceAsETH as bigint) ?? 0n);
}

export default useForkTreasuryBalance;
