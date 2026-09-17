import React, { useEffect } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { DarkTheme, DefaultTheme, Portal, Provider as ApolloProvider } from '@oce-apps/apollo-react-native';
import { Provider as ReduxProvider } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { layoutBridge, sfNetAPI } from '@oce-apps/oce-apps-bridges';

import { ApprovalRequestsTable } from './src/components/ApprovalRequestsTable/ApprovalRequestsTable';
import { store } from './src/store/store';
import { NotificationBanner } from './src/components/NotificationBanner/NotificationBanner';

Icon.loadFont();

sfNetAPI.enablePromises();

export const App = ({ instanceId }) => {
  const colorScheme = useColorScheme();
  const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;

  useEffect(() => {
    if (instanceId) {
      layoutBridge.setHeight(600);
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <ApolloProvider theme={theme}>
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
