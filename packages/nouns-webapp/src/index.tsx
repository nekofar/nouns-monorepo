import React, { useEffect } from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import account from './state/slices/account';
import application from './state/slices/application';
import logs from './state/slices/logs';
import auction, {
  appendBid,
  reduxSafeAuction,
  reduxSafeBid,
  reduxSafeNewAuction,
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from './state/slices/auction';
import onDisplayAuction, {
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
} from './state/slices/onDisplayAuction';
import { ApolloProvider, useQuery } from '@apollo/client';
import { clientFactory, latestAuctionsQuery } from './wrappers/subgraph';
import pastAuctions, { addPastAuctions } from './state/slices/pastAuctions';
import LogsUpdater from './state/updaters/logs';
import config, { CHAIN_ID, createNetworkHttpUrl } from './config';
import { createRoot } from 'react-dom/client';

import { useAppDispatch, useAppSelector } from './hooks';
import { connectRouter, push, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, combineReducers, createStore, PreloadedState } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { nounPath } from './utils/history';
import { LanguageProvider } from './i18n/LanguageProvider';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePublicClient, WagmiProvider } from 'wagmi';
import { config as wagmiConfig } from './wagmi';

import {
  nounsAuctionHouseAddress,
  useReadNounsAuctionHouseAuction,
  useWatchNounsAuctionHouseAuctionBidEvent,
  useWatchNounsAuctionHouseAuctionCreatedEvent,
  useWatchNounsAuctionHouseAuctionExtendedEvent,
  useWatchNounsAuctionHouseAuctionSettledEvent,
} from './contracts';
import { Log, parseAbiItem } from 'viem';
import { hardhat } from 'wagmi/chains';

const queryClient = new QueryClient();

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    auction,
    logs,
    pastAuctions,
    onDisplayAuction,
  });

export default function configureStore(preloadedState: PreloadedState<any>) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
createNetworkHttpUrl('mainnet');
createNetworkHttpUrl('sepolia');
const client = clientFactory(config.app.subgraphApiUri);

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();
  const publicClient = usePublicClient();

  const processBidFilter = async (
    nounId: bigint,
    sender: string,
    value: bigint,
    extended: boolean,
    event: Log,
  ) => {
    const block = await publicClient.getBlock({
      blockNumber: event.blockNumber ?? undefined,
    });

    const timestamp = block.timestamp;
    const { transactionHash, transactionIndex } = event;
    dispatch(
      appendBid(
        reduxSafeBid({
          nounId,
          sender,
          value,
          extended,
          transactionHash: transactionHash ?? '',
          transactionIndex: transactionIndex ?? 0,
          timestamp,
        }),
      ),
    );
  };
  const processAuctionCreated = (nounId: bigint, startTime: bigint, endTime: bigint) => {
    dispatch(setActiveAuction(reduxSafeNewAuction({ nounId, startTime, endTime, settled: false })));
    const nounIdNumber = Number(BigInt(nounId));
    dispatch(push(nounPath(nounIdNumber)));
    dispatch(setOnDisplayAuctionNounId(nounIdNumber));
    dispatch(setLastAuctionNounId(nounIdNumber));
  };
  const processAuctionExtended = (nounId: bigint, endTime: bigint) => {
    dispatch(setAuctionExtended({ nounId, endTime }));
  };
  const processAuctionSettled = (nounId: bigint, winner: string, amount: bigint) => {
    dispatch(setAuctionSettled({ nounId, amount, winner }));
  };

  // Fetch the current auction
  const { data: currentAuction } = useReadNounsAuctionHouseAuction();
  useEffect(() => {
    if (currentAuction) {
      dispatch(setFullAuction(reduxSafeAuction(currentAuction)));
      dispatch(setLastAuctionNounId(Number(currentAuction.nounId)));
    }
  }, [currentAuction, dispatch]);

  // Fetch the previous 24 hours of bids
  useEffect(() => {
    if (CHAIN_ID === hardhat.id) {
      return;
    }
    (async () => {
      const latestBlock = await publicClient.getBlock();
      const fromBlock = latestBlock.number > 7200n ? latestBlock.number - 7200n : 0n;

      const logs = await publicClient.getLogs({
        address: nounsAuctionHouseAddress[CHAIN_ID],
        event: parseAbiItem(
          'event AuctionBid(uint256 indexed nounId, address sender, uint256 value, bool extended)',
        ),
        fromBlock,
        toBlock: latestBlock.number,
      });

      for (const log of logs) {
        if (log.args === undefined) return;
        processBidFilter(...(log.args as [bigint, string, bigint, boolean]), log);
      }
    })();
  }, [processBidFilter, publicClient]);

  // Watch for new bids
  useWatchNounsAuctionHouseAuctionBidEvent({
    onLogs: logs => {
      for (const log of logs) {
        if (log.args === undefined) return;
        processBidFilter(...(log.args as [bigint, string, bigint, boolean]), log);
      }
    },
  });

  // Watch for new auction creation events
  useWatchNounsAuctionHouseAuctionCreatedEvent({
    onLogs: logs => {
      for (const log of logs) {
        processAuctionCreated(...(log.args as [bigint, bigint, bigint]));
      }
    },
  });

  // Watch for new auction extended events
  useWatchNounsAuctionHouseAuctionExtendedEvent({
    onLogs: logs => {
      for (const log of logs) {
        processAuctionExtended(...(log.args as [bigint, bigint]));
      }
    },
  });

  // Watch for auction settlement events
  useWatchNounsAuctionHouseAuctionSettledEvent({
    onLogs: logs => {
      for (const log of logs) {
        processAuctionSettled(...(log.args as [bigint, string, bigint]));
      }
    },
  });

  return <></>;
};

const PastAuctions: React.FC = () => {
  const latestAuctionId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const { data } = useQuery(latestAuctionsQuery());
  const dispatch = useAppDispatch();

  useEffect(() => {
    data && dispatch(addPastAuctions({ data }));
  }, [data, latestAuctionId, dispatch]);

  return <></>;
};

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ChainSubscriber />
    <React.StrictMode>
      <ApolloProvider client={client}>
        <PastAuctions />
        <LanguageProvider>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </WagmiProvider>
        </LanguageProvider>
      </ApolloProvider>
    </React.StrictMode>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
