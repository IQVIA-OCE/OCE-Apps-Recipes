import React, { useEffect } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { layoutBridge, sfNetAPI } from 'oce-apps-bridges';
import { Provider as ReduxProvider } from 'react-redux';
import { DarkTheme, DefaultTheme, Portal, Provider as ApolloProvider } from 'apollo-react-native';
import { CallToDosTable } from './src/components/CallToDosTable/CallToDosTable';
import { store } from './src/store/store';
import { NotificationBanner } from './src/components/NotificationBanner/NotificationBanner';

Icon.loadFont();

sfNetAPI.enablePromises();

export const App = ({ recordId, instanceId }) => {
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
        <View style={styles.root}>
          <CallToDosTable callId={recordId} />
        </View>
        <Portal>
          <NotificationBanner />
        </Portal>
      </ApolloProvider>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    padding: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        flex: 1,
      },
    }),
  },
});
