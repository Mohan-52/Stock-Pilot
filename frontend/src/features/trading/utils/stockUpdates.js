export const applyLiveStockUpdate = (stocks, update) => {
  if (!update?.symbol) {
    return stocks;
  }

  return stocks.map((stock) =>
    stock.symbol === update.symbol
      ? {
          ...stock,
          price: update.price,
          timestamp: update.timestamp,
          previousPrice: stock.price,
          lastUpdatedAt: update.timestamp || Date.now(),
        }
      : stock,
  );
};

export const normalizeStockList = (payload) => {
  const stocks = Array.isArray(payload)
    ? payload
    : payload?.content || payload?.data || payload?.stocks || [];

  return stocks.map((stock) => ({
    ...stock,
    previousPrice: stock.price,
    lastUpdatedAt: stock.timestamp,
  }));
};
