import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { DarkTheme, DefaultTheme, Portal, Provider as ApolloProvider } from 'apollo-react-native';
import { Provider as ReduxProvider } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { layoutBridge, sfNetAPI } from 'oce-apps-bridges';

import { ApprovalRequestsTable } from './src/components/ApprovalRequestsTable/ApprovalRequestsTable';
import { store } from './src/store/store';
import { NotificationBanner } from './src/components/NotificationBanner/NotificationBanner';

Icon.loadFont();

sfNetAPI.enablePromises();

export const App = () => {
  const colorScheme = useColorScheme();
  const [preferredTheme, setPreferredTheme] = useState(DefaultTheme);

  useEffect(() => {
    layoutBridge.setHeight(600);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setPreferredTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
    }
  }, [colorScheme]);

  return (
    <ReduxProvider store={store}>
      <ApolloProvider theme={preferredTheme}>
        <Portal>
          <NotificationBanner />
        </Portal>
        <View style={styles.root}>
          <ApprovalRequestsTable />
        </View>
      </ApolloProvider>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        flex: 1,
      },
    }),
  },
});
