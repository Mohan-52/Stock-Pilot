import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAccessToken } from "../services/apiClient";
import { useLiveStockUpdates } from "../features/trading/hooks/useLiveStockUpdates";

const StockStoreContext = createContext(null);

const mergeStockListIntoMap = (previousMap, stocks) => {
  const nextMap = { ...previousMap };

  stocks.forEach((stock) => {
    if (!stock?.symbol) {
      return;
    }

    nextMap[stock.symbol] = {
      ...nextMap[stock.symbol],
      ...stock,
      previousPrice:
        stock.previousPrice ?? nextMap[stock.symbol]?.previousPrice ?? stock.price,
      lastUpdatedAt:
        stock.lastUpdatedAt ??
        stock.timestamp ??
        nextMap[stock.symbol]?.lastUpdatedAt,
    };
  });

  return nextMap;
};

export const StockStoreProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(() => getAccessToken());
  const [stockMap, setStockMap] = useState({});
  const [stockSymbols, setStockSymbols] = useState([]);
  const [watchlistSymbols, setWatchlistSymbols] = useState([]);

  useEffect(() => {
    const handleAuthChange = () => {
      const nextToken = getAccessToken();
      setAccessTokenState(nextToken);

      if (!nextToken) {
        setStockMap({});
        setStockSymbols([]);
        setWatchlistSymbols([]);
      }
    };

    window.addEventListener("authTokenChanged", handleAuthChange);
    return () => window.removeEventListener("authTokenChanged", handleAuthChange);
  }, []);

  const handleLiveStockUpdate = useCallback((update) => {
    if (!update?.symbol) {
      return;
    }

    setStockMap((previousMap) => {
      const existingStock = previousMap[update.symbol];

      if (!existingStock) {
        return previousMap;
      }

      return {
        ...previousMap,
        [update.symbol]: {
          ...existingStock,
          price: update.price,
          timestamp: update.timestamp,
        },
      };
    });
  }, []);

  const connectionStatus = useLiveStockUpdates({
    enabled: Boolean(accessToken),
    onStockUpdate: handleLiveStockUpdate,
  });

  const hydrateStocks = useCallback((stocks) => {
    setStockMap((previousMap) => mergeStockListIntoMap(previousMap, stocks));
    setStockSymbols(stocks.map((stock) => stock.symbol).filter(Boolean));
  }, []);

  const hydrateWatchlist = useCallback((stocks) => {
    const watchedStocks = stocks.map((stock) => ({
      ...stock,
      watchlisted: stock.watchlisted ?? true,
    }));

    setStockMap((previousMap) =>
      mergeStockListIntoMap(previousMap, watchedStocks),
    );
    setWatchlistSymbols(
      watchedStocks.map((stock) => stock.symbol).filter(Boolean),
    );
  }, []);

  const setWatchlisted = useCallback((symbol, watchlisted) => {
    setStockMap((previousMap) => {
      const existingStock = previousMap[symbol];

      if (!existingStock) {
        return previousMap;
      }

      return {
        ...previousMap,
        [symbol]: {
          ...existingStock,
          watchlisted,
        },
      };
    });

    setWatchlistSymbols((previousSymbols) => {
      if (watchlisted) {
        return previousSymbols.includes(symbol)
          ? previousSymbols
          : [...previousSymbols, symbol];
      }

      return previousSymbols.filter((currentSymbol) => currentSymbol !== symbol);
    });
  }, []);

  const stocks = useMemo(
    () => stockSymbols.map((symbol) => stockMap[symbol]).filter(Boolean),
    [stockMap, stockSymbols],
  );

  const watchlist = useMemo(
    () => watchlistSymbols.map((symbol) => stockMap[symbol]).filter(Boolean),
    [stockMap, watchlistSymbols],
  );

  const value = useMemo(
    () => ({
      connectionStatus,
      stockMap,
      stocks,
      watchlist,
      hydrateStocks,
      hydrateWatchlist,
      setWatchlisted,
    }),
    [
      connectionStatus,
      stockMap,
      stocks,
      watchlist,
      hydrateStocks,
      hydrateWatchlist,
      setWatchlisted,
    ],
  );

  return (
    <StockStoreContext.Provider value={value}>
      {children}
    </StockStoreContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStockStore = () => {
  const context = useContext(StockStoreContext);

  if (!context) {
    throw new Error("useStockStore must be used within a StockStoreProvider");
  }

  return context;
};
