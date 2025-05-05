import { useReadContract } from 'wagmi';
import config from '../../config';
import StreamFactoryABI from './streamFactory.abi.json';
import { SupportedCurrency } from '../../components/ProposalActionsModal/steps/TransferFundsDetailsStep';
import { parseEther } from 'viem';

interface UsePredictStreamAddressProps {
  msgSender?: string;
  payer?: string;
  recipient?: string;
  tokenAmount?: string;
  tokenAddress?: string;
  startTime?: number;
  endTime?: number;
}

export function usePredictStreamAddress({
  msgSender,
  payer,
  recipient,
  tokenAmount,
  tokenAddress,
  startTime,
  endTime,
}: UsePredictStreamAddressProps) {
  const { data: predictedAddress } = useReadContract({
    abi: StreamFactoryABI,
    address: (config.addresses.nounsStreamFactory ?? '') as `0x${string}`,
    functionName: 'predictStreamAddress',
    args: [msgSender, payer, recipient, tokenAmount, tokenAddress, startTime, endTime],
  });

  return predictedAddress?.toString();
}

export function formatTokenAmount(amount?: string, currency?: SupportedCurrency) {
  const amt = amount ?? '0';
  switch (currency) {
    case SupportedCurrency.USDC:
      return Math.round(parseFloat(amt) * 1_000_000).toString();
    case SupportedCurrency.WETH:
    case SupportedCurrency.STETH:
      return parseEther(amt).toString();
    default:
      return amt;
  }
}

export function getTokenAddressForCurrency(currency?: SupportedCurrency) {
  switch (currency) {
    case SupportedCurrency.USDC:
      return config.addresses.usdcToken;
    case SupportedCurrency.WETH:
      return config.addresses.weth;
    case SupportedCurrency.STETH:
      return config.addresses.steth;
    default:
      return '';
  }
}

export function parseStreamCreationCallData(callData: string) {
  const callDataArray = callData.split(',');

  if (!callDataArray || callDataArray.length < 6) {
    return {
      recipient: '',
      streamAddress: '',
      startTime: 0,
      endTime: 0,
      streamAmount: 0,
      tokenAddress: '',
    };
  }

  const streamAddress = callDataArray[6];
  const nonce = callDataArray[5];
  const startTime = parseInt(callDataArray[3]);
  const endTime = parseInt(callDataArray[4]);
  const streamAmount = parseInt(callDataArray[1]);
  const recipient = callDataArray[0];
  const tokenAddress = callDataArray[2];
  return {
    recipient,
    streamAddress,
    startTime,
    endTime,
    streamAmount,
    tokenAddress,
    nonce,
  };
}
