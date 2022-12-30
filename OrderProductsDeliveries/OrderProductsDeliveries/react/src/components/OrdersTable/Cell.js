import React from "react";
import { View, Text } from "react-native";
import { useTheme } from 'apollo-react-native';

const Cell = ({ content, style = {} }) => {
    const theme = useTheme();
    return (
        <View style={style}>
            <Text style={{ fontSize: 18, color: theme.colors.text }} testID={"cell-text"}>
                {content}
            </Text>
        </View>
    );
};

export default Cell;