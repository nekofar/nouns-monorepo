import React, { useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router';

import { useAppSelector } from '@/hooks';
import useOnDisplayAuction from '@/wrappers/onDisplayAuction';

import classes from './AuctionNavigation.module.css';

interface AuctionNavigationProps {
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}

const AuctionNavigation: React.FC<AuctionNavigationProps> = props => {
  const { isFirstAuction, isLastAuction, onPrevAuctionClick, onNextAuctionClick } = props;
  const isCool = useAppSelector(state => state.application.stateBackgroundColor) === '#d5d7e1';
  const navigate = useNavigate();
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const onDisplayAuctionNounId = Number(onDisplayAuction?.nounId);

  // Page through Nouns via a keyboard
  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: { key: string }) => {
      if (event.key === 'ArrowLeft') {
        // This is a hack.
        // If we don't put this, the first keystore
        // from the noun at / doesn't work (i.e.,
        // to go from current noun to current noun - 1 would take two arrow presses)
        if (onDisplayAuctionNounId === lastAuctionNounId) {
          navigate(`/noun/${lastAuctionNounId}`);
        }

        if (!isFirstAuction) {
          onPrevAuctionClick();
        }
      }
      if (event.key === 'ArrowRight') {
        if (!isLastAuction) {
          onNextAuctionClick();
        }
      }
    },
    [
      isFirstAuction,
      isLastAuction,
      lastAuctionNounId,
      navigate,
      onDisplayAuctionNounId,
      onNextAuctionClick,
      onPrevAuctionClick,
    ],
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className={classes.navArrowsContainer}>
      <button
        onClick={() => onPrevAuctionClick()}
        className={isCool ? classes.leftArrowCool : classes.leftArrowWarm}
        disabled={isFirstAuction}
      >
        ←
      </button>
      <button
        onClick={() => onNextAuctionClick()}
        className={isCool ? classes.rightArrowCool : classes.rightArrowWarm}
        disabled={isLastAuction}
      >
        →
      </button>
    </div>
  );
};
export default AuctionNavigation;
