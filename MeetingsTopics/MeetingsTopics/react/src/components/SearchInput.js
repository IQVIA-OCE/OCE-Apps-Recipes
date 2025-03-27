import React, { useEffect, useState } from 'react';
import { Search } from '@oce-apps/apollo-react-native';
import { NAMESPACE } from '../constants';
import { useDebounce, usePrevious } from '../hooks';
import { localized } from '@oce-apps/oce-apps-bridges';

const MIN_CHARS_FOR_SEARCH = 3;

export const SearchInput = ({ isLoading, onSearch }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(localSearchQuery, 400);
  const previousDebouncedSearchQuery = usePrevious(debouncedSearchQuery);
  const [savedQuery, setSavedQuery] = useState('');

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
      style={{ fontSize: 20 }}
      placeholder={localized(`${NAMESPACE}search`, 'Search...')}
      value={localSearchQuery}
      onChangeText={handleSearchChange}
      fullWidth
    />
  );
};
