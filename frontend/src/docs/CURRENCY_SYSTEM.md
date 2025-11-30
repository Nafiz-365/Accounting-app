# Multi-Currency System Documentation

## Overview

The Smart Accounting App now features a comprehensive multi-currency system that allows users to:

- Select from 20+ world currencies
- View real-time clocks based on currency's timezone
- Automatically format all financial amounts with proper currency symbols
- Persist currency preferences across sessions

## 🌍 Supported Currencies

| Currency | Country        | Symbol | Timezone            |
| -------- | -------------- | ------ | ------------------- |
| USD      | United States  | $      | America/New_York    |
| EUR      | European Union | €      | Europe/Paris        |
| GBP      | United Kingdom | £      | Europe/London       |
| JPY      | Japan          | ¥      | Asia/Tokyo          |
| CNY      | China          | ¥      | Asia/Shanghai       |
| INR      | India          | ₹      | Asia/Kolkata        |
| CAD      | Canada         | C$     | America/Toronto     |
| AUD      | Australia      | A$     | Australia/Sydney    |
| CHF      | Switzerland    | CHF    | Europe/Zurich       |
| SGD      | Singapore      | S$     | Asia/Singapore      |
| HKD      | Hong Kong      | HK$    | Asia/Hong_Kong      |
| SEK      | Sweden         | kr     | Europe/Stockholm    |
| NOK      | Norway         | kr     | Europe/Oslo         |
| DKK      | Denmark        | kr     | Europe/Copenhagen   |
| NZD      | New Zealand    | NZ$    | Pacific/Auckland    |
| MXN      | Mexico         | $      | America/Mexico_City |
| BRL      | Brazil         | R$     | America/Sao_Paulo   |
| ZAR      | South Africa   | R      | Africa/Johannesburg |
| KRW      | South Korea    | ₩      | Asia/Seoul          |
| TRY      | Turkey         | ₺      | Europe/Istanbul     |
| RUB      | Russia         | ₽      | Europe/Moscow       |

## 🎯 Components

### 1. CurrencySelector

**Location**: `src/components/CurrencySelector.jsx`

A dropdown component that allows users to select their preferred currency.

**Features**:

- Beautiful flag icons for each country
- Currency symbols and codes
- Hover effects and smooth transitions
- Searchable dropdown (scrollable list)
- Visual feedback for selected currency

**Usage**:

```jsx
<CurrencySelector
  selectedCurrency={currency}
  onCurrencyChange={setCurrency}
  theme={theme}
/>
```

### 2. RealTimeClock

**Location**: `src/components/RealTimeClock.jsx`

Displays current time and date based on selected currency's timezone.

**Features**:

- Real-time updates every second
- Automatically adjusts to currency's timezone
- Shows date in local format
- Displays country/timezone information
- Theme-aware styling

**Usage**:

```jsx
<RealTimeClock currency={currency} theme={theme} />
```

### 3. CurrencyContext

**Location**: `src/contexts/CurrencyContext.jsx`

Global context provider for currency management.

**Features**:

- Global currency state management
- Automatic localStorage persistence
- Currency formatting utilities
- Currency conversion functions

**Usage**:

```jsx
const { formatAmount, convertAmount, currency, setCurrency } = useCurrency();
```

### 4. Currency Utilities

**Location**: `src/utils/currencies.js`

Core currency data and utility functions.

**Features**:

- Complete currency database with exchange rates
- Formatting functions for different locales
- Currency conversion utilities
- Helper functions for currency lookups

**Usage**:

```jsx
import {
  formatCurrency,
  convertCurrency,
  getCurrencyByCode,
} from "../utils/currencies";

// Format amount with currency
const formatted = formatCurrency(1000, "USD"); // "$1,000.00"

// Convert between currencies
const converted = convertCurrency(1000, "USD", "EUR"); // ~920.00

// Get currency data
const currencyData = getCurrencyByCode("EUR");
```

## 🔧 Implementation Guide

### Adding Currency Formatting to Components

1. **Import the currency hook**:

```jsx
import { useCurrency } from "../contexts/CurrencyContext";
```

2. **Use the hook in your component**:

```jsx
const MyComponent = () => {
  const { formatAmount } = useCurrency();

  return (
    <div>
      <h1>Balance: {formatAmount(1234.56)}</h1>
      {/* Will display: "$1,234.56" or "€1,234.56" etc. */}
    </div>
  );
};
```

### Example: Updating Existing Components

**Before**:

```jsx
<p>$ {amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
```

**After**:

```jsx
<p>{formatAmount(amount)}</p>
```

### Currency Conversion

If you need to convert amounts from USD to the selected currency:

```jsx
const { convertAmount } = useCurrency();

// Convert from USD to current currency
const localAmount = convertAmount(100, "USD", currency);

// Convert from current currency to USD
const usdAmount = convertAmount(localAmount, currency, "USD");
```

## 🎨 Integration in Header

The currency selector and real-time clock are automatically integrated into the CompanyHeader:

```jsx
{
  /* Right Side Controls */
}
<div className="flex items-center gap-4">
  {/* Real Time Clock */}
  <RealTimeClock currency={currency} theme={theme} />
  {/* Currency Selector */}
  <CurrencySelector
    selectedCurrency={currency}
    onCurrencyChange={setCurrency}
    theme={theme}
  />
  {/* User Profile */}
  ...
</div>;
```

## 📱 Responsive Design

Both components are fully responsive:

- **Mobile**: Compact layout with essential information
- **Desktop**: Full layout with all features
- **Tablet**: Adaptive layout based on screen size

## 🔄 State Management

The currency system uses React Context for global state management:

1. **CurrencyProvider**: Wraps the entire app
2. **localStorage**: Persists user preferences
3. **Real-time updates**: Clock updates every second
4. **Automatic formatting**: All amounts use current currency

## 🎯 Updated Components

The following components have been updated to use the new currency system:

### ✅ Completed Updates

- **CompanyHeader**: Added currency selector and clock
- **TrialBalance**: All amounts now use currency formatting
- **StatCard**: Dashboard cards display in selected currency
- **Dashboard**: Financial overview uses currency formatting

### 🔄 Pending Updates

To update other components, follow these steps:

1. **BalanceSheet.jsx**:

```jsx
import { useCurrency } from "../contexts/CurrencyContext";
const { formatAmount } = useCurrency();
```

2. **IncomeStatement.jsx**:

```jsx
import { useCurrency } from "../contexts/CurrencyContext";
const { formatAmount } = useCurrency();
```

3. **GeneralLedger.jsx**:

```jsx
import { useCurrency } from "../contexts/CurrencyContext";
const { formatAmount } = useCurrency();
```

4. **Journal Entry Forms**:

```jsx
import { useCurrency } from "../contexts/CurrencyContext";
const { formatAmount } = useCurrency();
```

## 🎨 Styling and Themes

Both components support the app's theme system:

- **Dark theme**: Glassmorphism effects with dark backgrounds
- **Light theme**: Clean, bright design with subtle shadows
- **Hover effects**: Smooth transitions and micro-interactions
- **Responsive**: Adapts to all screen sizes

## 🚀 Performance Features

- **Optimized rendering**: Uses React.memo for expensive operations
- **Efficient state management**: Context API with minimal re-renders
- **Lazy loading**: Currency data loaded once and cached
- **Smooth animations**: CSS transitions for better UX

## 🔮 Future Enhancements

- **Live exchange rates**: Integration with financial APIs
- **Historical conversions**: Support for different time periods
- **Multi-currency reports**: Reports in multiple currencies
- **Currency calculator**: Built-in conversion tool
- **Custom currencies**: Support for custom or crypto currencies

## 🎯 Usage Tips

1. **Default currency**: USD is set as default
2. **Persistence**: User choice is saved automatically
3. **Timezone sync**: Clock follows currency's timezone
4. **Formatting**: All amounts automatically formatted
5. **Conversion**: Built-in conversion utilities available

## 🐛 Troubleshooting

### Common Issues

1. **Currency not displaying**: Check if CurrencyProvider wraps your component
2. **Wrong timezone**: Verify currency data includes correct timezone
3. **Formatting issues**: Ensure amount is a valid number
4. **Theme problems**: Check if theme prop is passed correctly

### Debug Steps

1. Check browser console for errors
2. Verify localStorage contains 'selectedCurrency'
3. Ensure all imports are correct
4. Test with different currencies

## 📞 Support

For issues or questions about the multi-currency system:

1. Check this documentation
2. Review the component code
3. Test with different browsers
4. Verify currency data in `currencies.js`

---

_This multi-currency system provides a seamless international experience for accounting professionals working across different regions and currencies._
