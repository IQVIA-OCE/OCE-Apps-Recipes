import React from 'react';
import { NativeModules, ScrollView, Platform } from 'react-native';
import { sfNetAPI } from 'oce-apps-bridges';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ApolloProvider } from 'apollo-react-native';
import { AccountTeam } from './src/screens/AccountTeam';
import { store } from './src/store/store';

export default App = ({ instanceId, recordId }) => {

    sfNetAPI.enablePromises();
    if (instanceId) {
        const layout = NativeModules.LayoutBridge;
        layout.setHeight(600, instanceId);
    }
    if (Platform.OS === 'web') {
        return (
            <ReduxProvider store={store}>
                <ApolloProvider>
                    <ScrollView>
                        <AccountTeam accountId={recordId} />
                    </ScrollView>
                </ApolloProvider>
            </ReduxProvider >
        );
    }
    return (
        <ReduxProvider store={store}>
            <ApolloProvider>
                <AccountTeam accountId={recordId} />
            </ApolloProvider>
        </ReduxProvider >
    );
};
