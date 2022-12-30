import React from "react";
import { View, Text } from "react-native";

const NoConnectionView = () => {
    return (
        <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }} testID="no-connection-view">
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#696969' }}>!</Text>
            <Text>No internet connection</Text>
        </View>
    );
};

export default NoConnectionView;
