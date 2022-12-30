import React, { useState, useEffect } from 'react';
import { NativeModules, ScrollView, Appearance, Platform } from 'react-native';
import { sfNetAPI } from 'oce-apps-bridges';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ApolloProvider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { AccountTeam } from './src/screens/AccountTeam';
import { store } from './src/store/store';

export default App = ({ instanceId, recordId }) => {
    sfNetAPI.enablePromises();
    let [colorScheme, setColorScheme] = useState(DefaultTheme);

    if (instanceId) {
        const layout = NativeModules.LayoutBridge;
        layout.setHeight(600, instanceId);
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
    if (Platform.OS === 'web') {
        return (
            <ReduxProvider store={store}>
                <ApolloProvider theme={colorScheme}>
                    <ScrollView>
                        <AccountTeam accountId={recordId} />
                    </ScrollView>
                </ApolloProvider>
            </ReduxProvider >
        );
    }
    return (
        <ReduxProvider store={store}>
            <ApolloProvider theme={colorScheme}>
                <AccountTeam accountId={recordId} />
            </ApolloProvider>
        </ReduxProvider >
    );
};
