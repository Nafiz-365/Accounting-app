import React, { useState } from "react";
import { DollarSign, Globe, ChevronDown, Check } from "lucide-react";
import { currencies, getCurrencyByCode } from "../utils/currencyData";

const CurrencySelector = ({ selectedCurrency, onCurrencyChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentCurrency = getCurrencyByCode(selectedCurrency);

  const themeClasses = {
    dark: {
      bg: "bg-gray-800/90 backdrop-blur-xl",
      border: "border-gray-700",
      text: "text-gray-100",
      subtext: "text-gray-400",
      hover: "hover:bg-gray-700/50",
      dropdown: "bg-gray-800/95 backdrop-blur-xl border-gray-700",
      active: "bg-cyan-600/20 border-cyan-500 text-cyan-400",
    },
    light: {
      bg: "bg-white/90 backdrop-blur-xl",
      border: "border-gray-300",
      text: "text-gray-900",
      subtext: "text-gray-600",
      hover: "hover:bg-gray-100/60",
      dropdown: "bg-white/95 backdrop-blur-xl border-gray-300",
      active: "bg-blue-600/20 border-blue-500 text-blue-600",
    },
  };

  const t = themeClasses[theme] || themeClasses.dark;

  const handleSelect = (currency) => {
    onCurrencyChange(currency.code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Currency Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${t.bg} ${t.border} ${t.hover} transition-all duration-200 hover:scale-105`}
      >
        <span className="text-lg">{currentCurrency.flag}</span>
        <DollarSign size={16} className={t.subtext} />
        <span className={`font-medium ${t.text}`}>{currentCurrency.code}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${t.subtext}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-2xl z-50 ${t.dropdown} max-h-96 overflow-y-auto`}
        >
          <div className="p-2">
            <div
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${t.subtext} border-b ${t.border} mb-2`}
            >
              <Globe size={16} />
              Select Currency
            </div>

            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleSelect(currency)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                  currency.code === currentCurrency.code ? t.active : t.hover
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currency.flag}</span>
                  <div className="text-left">
                    <div className={`font-medium ${t.text}`}>
                      {currency.country}
                    </div>
                    <div className={`text-sm ${t.subtext}`}>
                      {currency.name} ({currency.code})
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm ${t.subtext}`}>
                    {currency.symbol}
                  </span>
                  {currency.code === currentCurrency.code && (
                    <Check size={16} className="text-cyan-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
