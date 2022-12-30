import { Provider as ApolloProvider } from 'apollo-react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider } from 'react-redux';
import { layoutBridge } from 'oce-apps-bridges';
import NotificationBanner from './src/components/NotificationBanner';
import { BudgetPickerScreen } from './src/screens/BudgetPickerScreen/BudgetPickerScreen';
import store from './src/store/store';

Icon.loadFont();

export const App = ({ parentId }) => {
  layoutBridge.setHeight(600);

  return (
    <ReduxProvider store={store}>
      <ApolloProvider>
        <NotificationBanner />
        <BudgetPickerScreen parentId={parentId} />
      </ApolloProvider>
    </ReduxProvider>
  );
};
