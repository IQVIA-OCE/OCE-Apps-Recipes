import React, { useEffect, useState } from 'react';
import { Search, neutral02 } from 'apollo-react-native';
import { NAMESPACE } from '../constants';
import { useDebounce } from '../hooks/useDebounce';
import { StyleSheet, Text } from 'react-native';
import { usePrevious } from '../hooks/usePrevious';
import { localized } from 'oce-apps-bridges';
const MIN_CHARS_FOR_SEARCH = 3;

export const SearchInput = ({ isDisabled, onSearch}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(localSearchQuery, 400);
  const previousDebouncedSearchQuery = usePrevious(debouncedSearchQuery);


  useEffect(() => {
    const searchQuery =
      debouncedSearchQuery.length >= MIN_CHARS_FOR_SEARCH
        ? debouncedSearchQuery
        : '';

    const isSearchQueryChanged =
      Boolean(previousDebouncedSearchQuery || searchQuery) &&
      searchQuery !== previousDebouncedSearchQuery;

    if (isSearchQueryChanged) {
      onSearch(searchQuery);
    }
  }, [debouncedSearchQuery, previousDebouncedSearchQuery]);

  const handleSearchChange = value => {
    setLocalSearchQuery(value);
  };
  return (
    <Search
      style={styles.searchBar}
      placeholder={
        localized(
          `${NAMESPACE}search`,
          'Search...'
        )
      }
      value={localSearchQuery}
      onChangeText={handleSearchChange}
      disabled={isDisabled}
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
