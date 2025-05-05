import { resolveNounContractAddress } from '../../utils/resolveNounsContractAddress';
import classes from './ShortAddress.module.css';
import { containsBlockedText } from '../../utils/moderation/containsBlockedText';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import React from 'react';
import { useIsNetworkEnsSupported } from '../../hooks/useIsNetworkEnsSupported';
import { blo } from 'blo';
import { useEnsName } from 'wagmi';

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number }> = props => {
  const { address, avatar, size = 24 } = props;
  const hasENS = useIsNetworkEnsSupported();
  const { data: ens } = useEnsName({ address: address as `0x${string}` }) || {
    data: resolveNounContractAddress(address),
  };
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  const shortAddress = useShortAddress(address);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {hasENS && avatar && (
          <div key={address}>
            <img width={size} height={size} src={blo(address as `0x${string}`)} alt={ens} />
          </div>
        )}
        <span>{ens && !ensMatchesBlocklistRegex ? ens : shortAddress}</span>
      </div>
    );
  }

  return <>{ens && !ensMatchesBlocklistRegex ? ens : shortAddress}</>;
};

export default ShortAddress;
