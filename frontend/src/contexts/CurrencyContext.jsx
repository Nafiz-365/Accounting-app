import React, { createContext, useState } from "react";
import {
  getCurrencyByCode,
  formatCurrency,
  convertCurrency,
} from "../utils/currencyData";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    return savedCurrency || "USD";
  });

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
  };

  const formatAmount = (amount, targetCurrency = currency) => {
    return formatCurrency(amount, targetCurrency);
  };

  const formatNumber = (number, targetCurrency = currency) => {
    const currencyData = getCurrencyByCode(targetCurrency);
    return new Intl.NumberFormat(currencyData.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const convertAmount = (
    amount,
    fromCurrency = "USD",
    toCurrency = currency
  ) => {
    return convertCurrency(amount, fromCurrency, toCurrency);
  };

  const getCurrentCurrencyData = () => {
    return getCurrencyByCode(currency);
  };

  const value = {
    currency,
    setCurrency: handleCurrencyChange,
    formatAmount,
    formatNumber,
    convertAmount,
    getCurrentCurrencyData,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext };
export default CurrencyContext;
