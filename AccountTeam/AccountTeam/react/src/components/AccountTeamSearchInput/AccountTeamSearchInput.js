import React from 'react';
import { Search, useTheme } from 'apollo-react-native';
import { StyleSheet } from 'react-native';

export const AccountTeamSearchInput = ({ onSearch }) => {
    const theme = useTheme();
    return (
        <Search
            style={[styles.searchBar, { backgroundColor: theme.colors.background }]}
            placeholder={'Search'}
            onChangeText={onSearch}
            disabled={false}
            size="small"

        />
    );
};

const styles = StyleSheet.create({
    searchBar: {
        fontSize: 20,
    },
});
