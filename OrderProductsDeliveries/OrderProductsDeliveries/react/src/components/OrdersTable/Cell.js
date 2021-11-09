import React from "react";
import { View, Text } from "react-native";

const Cell = ({ content, style = {} }) => {
    return (
        <View style={style}>
            <Text style={{ fontSize: 18 }} testID={"cell-text"}>
                {content}
            </Text>
        </View>
    );
};

export default Cell;