export const formatCurrency = (valueInCents) => {
  const amount = typeof valueInCents === "number" ? valueInCents / 100 : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatPercentage = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0.00%";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};
