import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@oce-apps/apollo-react-native';

export const ListEmptyComponent = () => {
    const theme = useTheme();
    return (
        <View style={{ backgroundColor: theme.colors.background }}>
            <View style={styles.wrapper}>
                <Text style={styles.accessor}>{'No Records Found'}</Text>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1, padding: 24
    },
    accessor: {
        fontSize: 16, fontWeight: '600', marginBottom: 5
    },
    value: {
        fontSize: 16
    }
});
