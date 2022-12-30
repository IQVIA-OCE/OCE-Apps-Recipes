import React from 'react';
import { Search, neutral02 } from 'apollo-react-native';
import { StyleSheet } from 'react-native';

export const AccountTeamSearchInput = ({ onSearch }) => {
    return (
        <Search
            style={styles.searchBar}
            placeholder={'Search'}
            onChangeText={onSearch}
            disabled={false}
            size="small"

        />
    );
};

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: neutral02[500],
        fontSize: 20,
    },
});
