import { Auction } from '../../wrappers/nounsAuction';
import { useAppSelector } from '../../hooks';
import React, { useEffect, useState, useRef, ChangeEvent, useCallback } from 'react';
import classes from './Bid.module.css';
import { Spinner, InputGroup, FormControl, Button, Col } from 'react-bootstrap';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import WalletConnectModal from '../WalletConnectModal';
import SettleManuallyBtn from '../SettleManuallyBtn';
import { Trans } from '@lingui/react/macro';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import {
  useReadNounsAuctionHouseMinBidIncrementPercentage,
  useWriteNounsAuctionHouseCreateBid,
  useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction,
} from '../../contracts';
import { formatEther, parseEther } from 'viem';
import { usePublicClient } from 'wagmi';

const computeMinimumNextBid = (
  currentBid: bigint,
  minBidIncPercentage: bigint | undefined,
): bigint => {
  if (!minBidIncPercentage) {
    return 0n;
  }
  const multiplier = (100n + minBidIncPercentage) as bigint;
  return (currentBid * multiplier + 99n) / 100n;
};

const minBidEth = (minBid: bigint): string => {
  if (minBid === 0n) return '0.01';

  const eth = Number(formatEther(minBid));
  return eth % 1 === 0 ? eth.toFixed(2) : (Math.ceil(eth * 100) / 100).toFixed(2);
};

const currentBid = (bidInputRef: React.RefObject<HTMLInputElement>): bigint => {
  const value = bidInputRef.current?.value?.trim();
  return value ? parseEther(value) : 0n;
};

const Bid: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { auction, auctionEnded } = props;
  const activeLocale = useActiveLocale();

  const publicClient = usePublicClient();

  const account = useAppSelector(state => state.account.activeAccount);

  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidInput, setBidInput] = useState('');

  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: auctionEnded ? <Trans>Settle</Trans> : <Trans>Place bid</Trans>,
  });

  const [showConnectModal, setShowConnectModal] = useState(false);

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const { data: minBidIncPercentage } = useReadNounsAuctionHouseMinBidIncrementPercentage();
  const minBid = computeMinimumNextBid(
    auction && BigInt(auction.amount.toString()),
    minBidIncPercentage !== undefined ? BigInt(minBidIncPercentage) : undefined,
  );

  const {
    writeContract: placeBid,
    data: placeBidTx,
    isPending: isPlacingBid,
  } = useWriteNounsAuctionHouseCreateBid();

  const {
    writeContract: settleAuction,
    data: settleAuctionTx,
    isPending: isSettlingAuction,
  } = useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction();

  const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // disable more than 2 digits after decimal point
    if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
      return;
    }

    setBidInput(event.target.value);
  };

  const placeBidHandler = async () => {
    if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    if (currentBid(bidInputRef) < minBid) {
      setModal({
        show: true,
        title: <Trans>Insufficient bid amount 🤏</Trans>,
        message: (
          <Trans>
            Please place a bid higher than or equal to the minimum bid amount of {minBidEth(minBid)}{' '}
            ETH
          </Trans>
        ),
      });
      setBidInput(minBidEth(minBid));
      return;
    }

    const value = parseEther(bidInputRef.current.value.toString());
    placeBid({
      args: [auction.nounId],
      value,
    });
  };

  const settleAuctionHandler = () => {
    settleAuction({});
  };

  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  // successful bid using redux store state
  useEffect(() => {
    if (!account || !placeBidTx || auctionEnded) return;

    const bidAmount = parseEther(bidInputRef.current?.value?.trim() || '0');
    const isCorrectTx = bidAmount === auction.amount;

    if (auction.bidder !== account || !isCorrectTx) return;

    const checkTx = async () => {
      try {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: placeBidTx,
          confirmations: 1,
        });

        if (receipt.status === 'success') {
          setModal({
            title: <Trans>Success</Trans>,
            message: <Trans>Bid was placed successfully!</Trans>,
            show: true,
          });
          setBidButtonContent({ loading: false, content: <Trans>Place bid</Trans> });
          clearBidInput();
        }
      } catch (err) {
        console.error('Bid tx failed or reverted', err);
      }
    };

    checkTx();
  }, [auction, placeBidTx, account, auctionEnded, setModal, publicClient]);

  // placing bid transaction state hook
  useEffect(() => {
    if (auctionEnded) return;

    if (isPlacingBid) {
      setBidButtonContent({ loading: true, content: <></> });
      return;
    }

    if (!placeBidTx) {
      setBidButtonContent({ loading: false, content: <Trans>Place bid</Trans> });
      return;
    }

    const checkTx = async () => {
      try {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: placeBidTx,
        });

        if (receipt.status === 'reverted') {
          setModal({
            title: <Trans>Transaction Failed</Trans>,
            message: <Trans>Please try again.</Trans>,
            show: true,
          });
          setBidButtonContent({ loading: false, content: <Trans>Bid</Trans> });
        }
      } catch (err) {
        setModal({
          title: <Trans>Error</Trans>,
          message: (err as Error)?.message || <Trans>Please try again.</Trans>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <Trans>Bid</Trans> });
      }
    };

    checkTx();
  }, [placeBidTx, isPlacingBid, auctionEnded, setModal, publicClient]);

  // settle auction transaction state hook
  useEffect(() => {
    if (!auctionEnded) return;

    if (isSettlingAuction) {
      setBidButtonContent({ loading: true, content: <></> });
      return;
    }

    if (!settleAuctionTx) {
      setBidButtonContent({ loading: false, content: <Trans>Settle Auction</Trans> });
      return;
    }

    const checkTx = async () => {
      try {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: settleAuctionTx,
        });

        if (receipt.status === 'success') {
          setModal({
            title: <Trans>Success</Trans>,
            message: <Trans>Settled auction successfully!</Trans>,
            show: true,
          });
        } else {
          setModal({
            title: <Trans>Transaction Failed</Trans>,
            message: <Trans>Please try again.</Trans>,
            show: true,
          });
        }

        setBidButtonContent({ loading: false, content: <Trans>Settle Auction</Trans> });
      } catch (error) {
        setModal({
          title: <Trans>Error</Trans>,
          message: (error as Error)?.message || <Trans>Please try again.</Trans>,
          show: true,
        });
        setBidButtonContent({ loading: false, content: <Trans>Settle Auction</Trans> });
      }
    };

    checkTx();
  }, [settleAuctionTx, isSettlingAuction, auctionEnded, setModal, publicClient]);

  if (!auction) return null;

  const isDisabled = isPlacingBid || isSettlingAuction || !account;

  const fomoNounsBtnOnClickHandler = () => {
    // Open Fomo Nouns in a new tab
    window.open('https://fomonouns.wtf', '_blank')?.focus();
  };

  const isWalletConnected = activeAccount !== undefined;

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <InputGroup>
        {!auctionEnded && (
          <>
            <span className={classes.customPlaceholderBidAmt}>
              {!auctionEnded && !bidInput ? (
                <>
                  Ξ {minBidEth(minBid)}{' '}
                  <span
                    className={
                      activeLocale === 'ja-JP' ? responsiveUiUtilsClasses.disableSmallScreens : ''
                    }
                  >
                    <Trans>or more</Trans>
                  </span>
                </>
              ) : (
                ''
              )}
            </span>
            <FormControl
              className={classes.bidInput}
              type="number"
              min="0"
              onChange={bidInputHandler}
              ref={bidInputRef}
              value={bidInput}
            />
          </>
        )}
        {!auctionEnded ? (
          <Button
            className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
            onClick={auctionEnded ? settleAuctionHandler : placeBidHandler}
            disabled={isDisabled}
          >
            {bidButtonContent.loading ? <Spinner animation="border" /> : bidButtonContent.content}
          </Button>
        ) : (
          <>
            <Col lg={12} className={classes.voteForNextNounBtnWrapper}>
              <Button className={classes.bidBtnAuctionEnded} onClick={fomoNounsBtnOnClickHandler}>
                <Trans>Vote for the next Noun</Trans> ⌐◧-◧
              </Button>
            </Col>
            {/* Only show force settle button if wallet connected */}
            {isWalletConnected && (
              <Col lg={12}>
                <SettleManuallyBtn settleAuctionHandler={settleAuctionHandler} auction={auction} />
              </Col>
            )}
          </>
        )}
      </InputGroup>
    </>
  );
};
export default Bid;
