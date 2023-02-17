import React from 'react';
import { ScrollView, useColorScheme, Platform } from 'react-native';
import { sfNetAPI, layoutBridge } from 'oce-apps-bridges';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ApolloProvider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { AccountTeam } from './src/screens/AccountTeam';
import { store } from './src/store/store';

const App = ({ instanceId, recordId }) => {
    sfNetAPI.enablePromises();

    if (instanceId) {
        layoutBridge.setHeight(600, instanceId);
    }
    const colorScheme = useColorScheme();
    const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;

    if (Platform.OS === 'web') {
        return (
            <ReduxProvider store={store}>
                <ApolloProvider theme={theme}>
                    <ScrollView>
                        <AccountTeam accountId={recordId} />
                    </ScrollView>
                </ApolloProvider>
            </ReduxProvider >
        );
    }
    return (
        <ReduxProvider store={store}>
            <ApolloProvider theme={theme}>
                <AccountTeam accountId={recordId} />
            </ApolloProvider>
        </ReduxProvider >
    );
};

export default App;
