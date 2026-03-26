import { useState, useEffect } from 'react';

// Debounce hook for search inputs
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Debounced search hook with API call
export const useDebouncedSearch = (searchFn, delay = 500) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchFn(debouncedSearchTerm)
        .then(setResults)
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm, searchFn]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isSearching,
  };
};
