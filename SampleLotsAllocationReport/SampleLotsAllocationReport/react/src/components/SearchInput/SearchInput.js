import React, { useEffect, useState } from 'react';
import { Search, neutral02, useTheme } from '@oce-apps/apollo-react-native';
import { useDebounce, usePrevious } from '../../hooks';
import { StyleSheet } from 'react-native';

const MIN_CHARS_FOR_SEARCH = 1;

export const SearchInput = ({ isLoading, searchQuery, onSearch, onIconPress }) => {

  const theme = useTheme();

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

  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  const handleSearchChange = (value) => {
    setLocalSearchQuery(value);
  };

  const handleIconPress = () => {
    setLocalSearchQuery('');
    onIconPress();
  }

  return (
    <Search
      style={[styles.searchBar, { backgroundColor: theme.dark ? theme.colors.background : neutral02[500] }]}
      label={'Search'}
      placeholder={'Search'}
      value={localSearchQuery}
      onChangeText={handleSearchChange}
      onIconPress={handleIconPress}
      fullWidth
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    fontSize: 20,
  },
});
