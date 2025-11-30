import { useCurrency } from "../contexts/CurrencyContext";

// Custom hook for easy currency formatting in components
export const useCurrencyFormatter = () => {
  const { formatAmount, convertAmount, currency, getCurrentCurrencyData } =
    useCurrency();

  return {
    // Format amount with current currency
    format: formatAmount,

    // Convert amount from USD to current currency
    fromUSD: (amount) => convertAmount(amount, "USD", currency),

    // Convert amount from current currency to USD
    toUSD: (amount) => convertAmount(amount, currency, "USD"),

    // Get current currency info
    currentCurrency: getCurrentCurrencyData(),

    // Simple format for display (without currency conversion)
    display: (amount, currencyCode = currency) =>
      formatAmount(amount, currencyCode),
  };
};

export default useCurrencyFormatter;
