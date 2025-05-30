import React from 'react';

import { Trans } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'react-bootstrap';

import _HeartIcon from '@/assets/icons/Heart.svg';
import _LinkIcon from '@/assets/icons/Link.svg';
import ShortAddress from '@/components/ShortAddress';
import Tooltip from '@/components/Tooltip';
import { nounsAuctionHouseAddress } from '@/contracts';
import { useAppSelector } from '@/hooks';
import { execute } from '@/subgraphs/execute';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { Address } from '@/utils/types';
import { defaultChain } from '@/wagmi';
import { auctionQuery } from '@/wrappers/subgraph';

import classes from './NounInfoRowHolder.module.css';

interface NounInfoRowHolderProps {
  nounId: bigint;
}

const NounInfoRowHolder: React.FC<NounInfoRowHolderProps> = props => {
  const { nounId } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);

  const { isLoading, error, data } = useQuery({
    queryKey: ['auction', nounId],
    queryFn: () => execute(auctionQuery, { id: nounId.toString() }),
  });

  const winner = data && data.auction?.bidder?.id;

  if (isLoading || !winner) {
    return (
      <div className={classes.nounHolderInfoContainer}>
        <span className={classes.nounHolderLoading}>
          <Trans>Loading...</Trans>
        </span>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Trans>Failed to fetch Noun info</Trans>
      </div>
    );
  }

  const etherscanURL = buildEtherscanAddressLink(winner);
  const shortAddressComponent = <ShortAddress address={winner as Address} />;
  const chainId = defaultChain.id;

  return (
    <Tooltip
      tip="View on Etherscan"
      tooltipContent={() => {
        return <Trans>View on Etherscan</Trans>;
      }}
      id="holder-etherscan-tooltip"
    >
      <div className={classes.nounHolderInfoContainer}>
        <span>
          <Image src={_HeartIcon} className={classes.heartIcon} />
        </span>
        <span>
          <Trans>Winner</Trans>
        </span>
        <span>
          <a
            className={
              isCool ? classes.nounHolderEtherscanLinkCool : classes.nounHolderEtherscanLinkWarm
            }
            href={etherscanURL}
            target={'_blank'}
            rel="noreferrer"
          >
            {winner.toLowerCase() === nounsAuctionHouseAddress[chainId].toLowerCase() ? (
              <Trans>Nouns Auction House</Trans>
            ) : (
              shortAddressComponent
            )}
            <span className={classes.linkIconSpan}>
              <Image src={_LinkIcon} className={classes.linkIcon} />
            </span>
          </a>
        </span>
      </div>
    </Tooltip>
  );
};

export default NounInfoRowHolder;
