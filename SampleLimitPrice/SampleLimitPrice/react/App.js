import React, { useState, useEffect } from 'react';
import { ScrollView, Appearance, Platform } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SampleLimitWidget from "./src/screens/SampleLimitWidget/SampleLimitWidget";
import { Provider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { isIphone } from './src/constants';
import { layoutBridge } from "oce-apps-bridges";

Icon.loadFont()

export default (props) => {
    const { instanceId, recordId } = props;
    let [colorScheme, setColorScheme] = useState(DefaultTheme);
    if (instanceId) {
        layoutBridge.setHeight(600);
    }
    if (Platform.OS !== 'web') {
        const currentSelectedTheme = Appearance.getColorScheme();
        colorScheme = currentSelectedTheme === "dark" ? DarkTheme : DefaultTheme;

    }
    useEffect(() => {
        const themeListener = Appearance.addChangeListener(({ colorScheme }) => {
            if (Platform.OS !== 'web') {
                setColorScheme(colorScheme === 'dark' ? 'dark' : 'light');
            }
        }
        );

        return () => {
            themeListener.remove();
        };
    }, []);
    if (isIphone) {
        return (
            <Provider theme={colorScheme}>
                <ScrollView>
                    <SampleLimitWidget colorScheme={colorScheme} accountId={recordId} />
                </ScrollView>
            </Provider>
        )
    }
    return (
        <Provider theme={colorScheme}>
            <SampleLimitWidget colorScheme={colorScheme} accountId={recordId} />
        </Provider>
    )
};
