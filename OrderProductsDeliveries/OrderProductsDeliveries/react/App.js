import { DarkTheme, DefaultTheme, Provider as ApolloProvider } from '@oce-apps/apollo-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider } from 'react-redux';
import { layoutBridge } from '@oce-apps/oce-apps-bridges';
import { NotificationBanner } from "./src/components/NotificationBanner/NotificationBanner";
import { OrderProductsDeliveries } from "./src/screens/OrderProductsDeliveries";
import store from './src/stores/index';

Icon.loadFont();

export default ({instanceId, recordId}) => {
  const colorScheme = useColorScheme();
  let [preferredTheme, setPreferredTheme] = useState(DefaultTheme);

  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setPreferredTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
    }
  }, [colorScheme]);

  return (
      <ReduxProvider store={store}>
        <ApolloProvider theme={preferredTheme}>
          <NotificationBanner/>
          <OrderProductsDeliveries recordId={recordId}/>
        </ApolloProvider>
      </ReduxProvider>
  );
};
