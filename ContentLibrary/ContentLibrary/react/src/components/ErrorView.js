import React from "react";
import { View, Text } from "react-native";

const ErrorView = () => {
    return (
        <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }} testID="error-view">
            <Text>Error. Something gone wrong.</Text>
        </View>
    );
};

export default ErrorView;
