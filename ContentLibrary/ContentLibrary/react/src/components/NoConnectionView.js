import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@oce-apps/apollo-react-native";

const NoConnectionView = () => {
  const theme = useTheme();

    return (
        <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }} testID="no-connection-view">
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.text }}>!</Text>
            <Text style={{color: theme.colors.text}}>No internet connection</Text>
        </View>
    );
};

export default NoConnectionView;
