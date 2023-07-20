import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'apollo-react-native';
import color from 'color'

export const ItemSeparator = () => {
    const theme = useTheme();
    return (
        <View testID="itemSeparator" style={[styles.separator,
        {
            backgroundColor: theme.dark
                ? color(theme.colors.placeholder).darken(0.7).hex()
                : color(theme.colors.surface).darken(0.1).hex()
        }]} />
    );
};

const styles = StyleSheet.create({
    separator: {
        height: 3,
    },
});
