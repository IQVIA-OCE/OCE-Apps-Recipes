import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TopicPickerScreen } from './src/screens/TopicPickerScreen/TopicPickerScreen';
import { Provider as ApolloProvider } from 'apollo-react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store/store';
import { ErrorBanner } from './src/components/ErrorBanner';
import { layoutBridge } from 'oce-apps-bridges';

Icon.loadFont();

export default ({ instanceId, parentId }) => {
  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  return (
    <ReduxProvider store={store}>
      <ApolloProvider>
        <ErrorBanner />
        <TopicPickerScreen parentId={parentId}/>
      </ApolloProvider>
    </ReduxProvider>
  );
};
