import React, { useEffect, useState } from 'react';
import { Search } from 'apollo-react-native';
import { usePrevious, useDebounce } from '../../hooks';
import { View } from 'react-native';

const MIN_CHARS_FOR_SEARCH = 3;

export const SearchInput = ({ isDisabled, onSearch }) => {
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

  const handleSearchChange = (value) => {
    setLocalSearchQuery(value);
  };
  return (
    <View>
        <Search
          placeholder={'Search'}
          value={localSearchQuery}
          onChangeText={handleSearchChange}
          disabled={false}
          size={'small'}
          fullWidth
          testID={'searchToDo'}
        />
    </View>
  );
};
