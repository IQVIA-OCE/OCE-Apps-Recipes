import { DarkTheme, DefaultTheme, Provider as ApolloProvider } from '@oce-apps/apollo-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider } from 'react-redux';
import { layoutBridge } from '@oce-apps/oce-apps-bridges';
import NotificationBanner from './src/components/NotificationBanner';
import { BudgetPickerScreen } from './src/screens/BudgetPickerScreen/BudgetPickerScreen';
import store from './src/store/store';

Icon.loadFont();

export const App = ({ parentId }) => {
  const colorScheme = useColorScheme();
  let [preferredTheme, setPreferredTheme] = useState(DefaultTheme);

  layoutBridge.setHeight(600);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setPreferredTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
    }
  }, [colorScheme]);

  return (
    <ReduxProvider store={store}>
      <ApolloProvider theme={preferredTheme}>
        <NotificationBanner />
        <BudgetPickerScreen parentId={parentId} />
      </ApolloProvider>
    </ReduxProvider>
  );
};
