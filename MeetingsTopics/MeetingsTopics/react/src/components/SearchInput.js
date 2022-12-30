import React, { useEffect, useState } from 'react';
import { Search, neutral02 } from 'apollo-react-native';
import { NAMESPACE } from '../constants';
import { useDebounce, usePrevious } from '../hooks';
import { StyleSheet } from 'react-native';
import { localized } from 'oce-apps-bridges';
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
      style={styles.searchBar}
      placeholder={localized(`${NAMESPACE}search`, 'Search...')}
      value={localSearchQuery}
      onChangeText={handleSearchChange}
      fullWidth
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: neutral02[500],
    fontSize: 20,
  },
});
