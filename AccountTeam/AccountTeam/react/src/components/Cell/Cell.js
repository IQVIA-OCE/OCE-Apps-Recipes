import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'apollo-react-native';

export const Cell = ({ accessor, value, style, accessorStyle, valueStyle, ...props }) => {
    return (
        <View style={[styles.wrapper, style]} {...props}>
            <Text style={[styles.accessor, accessorStyle]}>{accessor}</Text>
            <Text allowFontScaling style={{ ...styles.value, ...valueStyle }}>{value ? value : '--'}</Text>
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
