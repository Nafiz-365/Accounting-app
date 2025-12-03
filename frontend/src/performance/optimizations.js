// Performance optimization configurations

import React from 'react';

// 1. Memoization hook for expensive calculations
export const useMemoizedCalculation = (calculation, deps = []) => {
  // ensure the first argument is an inline function expression and support both functions and values
  return React.useMemo(() => (typeof calculation === 'function' ? calculation() : calculation), [calculation, deps]);
};

// 2. Debounce hook for search/filter operations
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 3. Virtual scrolling configuration for large lists
export const virtualScrollConfig = {
  itemHeight: 50,
  bufferSize: 5,
  overscan: 3,
};

// 4. Performance monitoring utilities
export const performanceMonitor = {
  mark: (name) => performance.mark(name),
  measure: (name, startMark, endMark) => {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration}ms`);
  },
};

// 5. Optimized re-render prevention
export const areEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};
