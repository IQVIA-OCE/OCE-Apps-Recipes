import React, { useState, useEffect } from 'react';
import { ScrollView, Appearance, Platform, useColorScheme } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SampleLimitWidget from "./src/screens/SampleLimitWidget/SampleLimitWidget";
import { Provider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { isIphone } from './src/constants';
import { layoutBridge } from "oce-apps-bridges";

Icon.loadFont()

export default (props) => {
    const { instanceId, recordId } = props;
    if (instanceId) {
        layoutBridge.setHeight(600);
    }
    const colorScheme = useColorScheme();
    const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;

    if (isIphone) {
        return (
            <Provider theme={theme}>
                <ScrollView>
                    <SampleLimitWidget colorScheme={colorScheme} accountId={recordId} />
                </ScrollView>
            </Provider>
        )
    }
    return (
        <Provider theme={theme}>
            <SampleLimitWidget colorScheme={colorScheme} accountId={recordId} />
        </Provider>
    )
};
