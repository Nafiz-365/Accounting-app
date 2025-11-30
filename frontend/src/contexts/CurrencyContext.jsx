import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrencyByCode,
  formatCurrency,
  convertCurrency,
} from "../utils/currencyData";

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");

  // Load saved currency on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

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

export default CurrencyContext;
