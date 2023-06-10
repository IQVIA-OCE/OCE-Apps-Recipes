import {
  DarkTheme,
  DefaultTheme,
  Provider as ApolloProvider,
} from 'apollo-react-native';
import { layoutBridge, sfNetAPI } from 'oce-apps-bridges';
import React from 'react';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider } from 'react-redux';
import { NotificationBanner } from './src/components/NotificationBanner';
import { ScreenContainer } from './src/components/ScreenContainer';
import store from './src/store/store';
import { isIOS } from './src/utils';

Icon.loadFont();
sfNetAPI.enablePromises();
layoutBridge.setHeight(600);

export const App = ({ recordId }) => {
  const colorScheme = useColorScheme();
  let preferredTheme = DefaultTheme;

  if (isIOS) {
    preferredTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  }

  return (
    <ReduxProvider store={store}>
      <ApolloProvider theme={preferredTheme}>
        <NotificationBanner />
        <ScreenContainer recordId={recordId} />
      </ApolloProvider>
    </ReduxProvider>
  );
};
