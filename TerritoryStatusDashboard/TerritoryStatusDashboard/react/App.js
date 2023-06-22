import { DarkTheme, DefaultTheme, Portal, Provider as ApolloProvider } from 'apollo-react-native';
import { layoutBridge, sfNetAPI } from 'oce-apps-bridges';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider } from 'react-redux';
import { NotificationBanner } from './src/components/NotificationBanner';
import { TerritoryStatusScreen } from './src/screens/TerritoryStatusScreen';
import store from './src/store/store';
import { isMobilePhone, isWeb } from './src/utils';

Icon.loadFont();
sfNetAPI.enablePromises();

const PHONE_APP_HEIGHT = 550;
const DEFAULT_APP_HEIGHT = 330;

export const App = () => {
  const colorScheme = useColorScheme();
  let [preferredTheme, setPreferredTheme] = useState(DefaultTheme);

  layoutBridge.setHeight(isMobilePhone ? PHONE_APP_HEIGHT : DEFAULT_APP_HEIGHT);

  useEffect(() => {
    if (!isWeb) {
      setPreferredTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
    }
  }, [colorScheme]);

  return (
    <ReduxProvider store={store}>
      <ApolloProvider theme={preferredTheme}>
        <Portal>
          <NotificationBanner />
        </Portal>
        <TerritoryStatusScreen />
      </ApolloProvider>
    </ReduxProvider>
  );
};
