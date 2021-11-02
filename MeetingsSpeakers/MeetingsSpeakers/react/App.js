import React from 'react';
import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ApolloProvider } from 'apollo-react-native';
import { SpeakerPickerScreen } from './src/screens/SpeakerPickerScreen/SpeakerPickerScreen';
import { store } from './src/store/store';
import { NotificationContainer } from './src/components/NotificationContainer/NotificationContainer';

Icon.loadFont();

export const App = ({ instanceId, parentId, recordTypeId }) => {
  if (instanceId) {
    const layout = NativeModules.LayoutBridge;
    layout.setHeight(600, instanceId);
  }

  return (
    <ReduxProvider store={store}>
      <ApolloProvider>
        <NotificationContainer />
        <SpeakerPickerScreen parentId={parentId} recordTypeId={recordTypeId} />
      </ApolloProvider>
    </ReduxProvider>
  );
};
