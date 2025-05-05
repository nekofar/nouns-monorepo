import { containsBlockedText } from '../../utils/moderation/containsBlockedText';
import { useEnsName } from 'wagmi';

interface EnsOrLongAddressProps {
  address: `0x${string}`;
}

/**
 * Resolves ENS for address if one exists, otherwise falls back to full address
 */
const EnsOrLongAddress: React.FC<EnsOrLongAddressProps> = props => {
  const { address } = props;
  const { data: ens } = useEnsName({ address });
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  return <>{ens && !ensMatchesBlocklistRegex ? ens : address}</>;
};

export default EnsOrLongAddress;
