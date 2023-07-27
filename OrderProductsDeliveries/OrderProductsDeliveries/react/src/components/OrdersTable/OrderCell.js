import React from "react";
import { View, Text } from "react-native";
import { useTheme } from 'apollo-react-native';
import color from 'color';

export const OrderCell = ({ productName, productCode, style = {} }) => {
    const theme = useTheme();
    return (
        <View style={style}>
            <Text style={{ color: theme.colors.text, marginBottom: 8, maxHeight: 40 }} testID="product-name">
                {productName}
            </Text>
            <Text style={{ color: theme.dark ? color(theme.colors.text).lightness(60).hex() : '#b8b8b8' }} testID="product-code">{productCode}</Text>
        </View>
    );
};
