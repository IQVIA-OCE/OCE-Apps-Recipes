import React, { useEffect } from 'react';
import { Provider as ApolloProvider, DarkTheme, DefaultTheme } from '@oce-apps/apollo-react-native';
import { Platform, useColorScheme, View } from 'react-native';
import { environment, layoutBridge, logger } from '@oce-apps/oce-apps-bridges';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import Main from './src/components/Main/Main';
import NotificationContainer from './src/components/NotificationContainer/NotificationContainer';
import { isIphone } from './src/utils/index';
import { StyleSheet } from 'react-native';
import { Settings } from 'luxon';

Icon.loadFont();

Settings.defaultZoneName = environment.timeZone();

const App = () => {
  const colorScheme = useColorScheme();
  const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;

  useEffect(() => {
    layoutBridge.setHeight(isIphone ? 600 : 500).catch((error) => {
      logger.error('layoutBridge.setHeight error: ' + error);
    });
  }, []);

  return (
    <Provider store={store}>
      <ApolloProvider theme={theme}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <NotificationContainer />
          <Main />
        </View>
      </ApolloProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
