import React, { useEffect, useState } from 'react';
import { Search, useTheme } from '@oce-apps/apollo-react-native';
import { useDebounce, usePrevious } from '../../hooks';
const MIN_CHARS_FOR_SEARCH = 1;

export const SearchInput = ({ isLoading, onSearch }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(localSearchQuery, 400);
  const previousDebouncedSearchQuery = usePrevious(debouncedSearchQuery);
  const [savedQuery, setSavedQuery] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const searchQuery =
      debouncedSearchQuery.length >= MIN_CHARS_FOR_SEARCH
        ? debouncedSearchQuery
        : '';

    const isSearchQueryChanged =
      Boolean(previousDebouncedSearchQuery || searchQuery) &&
      searchQuery !== previousDebouncedSearchQuery;

    if (isSearchQueryChanged && !isLoading) {
      setSavedQuery(searchQuery);
      onSearch(searchQuery);
    }
  }, [debouncedSearchQuery, previousDebouncedSearchQuery]);

  useEffect(() => {
    if (!isLoading && savedQuery !== localSearchQuery) {
      setSavedQuery(localSearchQuery);
      onSearch(localSearchQuery);
    }
  }, [isLoading]);

  const handleSearchChange = (value) => {
    setLocalSearchQuery(value);
  };

  return (
    <Search
      style={{fontSize: 20, backgroundColor: theme.colors.background}}
      placeholder={'Search Account...'}
      value={localSearchQuery}
      onChangeText={handleSearchChange}
      fullWidth
    />
  );
};
