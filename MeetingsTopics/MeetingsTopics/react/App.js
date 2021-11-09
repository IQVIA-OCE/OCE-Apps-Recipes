import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TopicPickerScreen } from './src/screens/TopicPickerScreen/TopicPickerScreen';
import { Provider as ApolloProvider } from 'apollo-react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store/store';
import { ErrorBanner } from './src/components/ErrorBanner';
import { NativeModules } from 'react-native';

Icon.loadFont();

export default ({ instanceId, parentId }) => {
  if (instanceId) {
    const layout = NativeModules.LayoutBridge;
    layout.setHeight(600, instanceId);
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
