import React from "react";
import { View, Text } from "react-native";

const OrderCell = ({ productName, productCode, style = {} }) => {
    return (
        <View style={style}>
            <Text style={{ color: '#000', marginBottom: 8, maxHeight: 40 }} testID="product-name">
                {productName}
            </Text>
            <Text style={{ color: '#b8b8b8' }} testID="product-code">{productCode}</Text>
        </View>
    );
};

export default OrderCell;