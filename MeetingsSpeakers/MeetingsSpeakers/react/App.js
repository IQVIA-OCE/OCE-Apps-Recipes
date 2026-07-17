import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ApolloProvider, DefaultTheme, DarkTheme } from '@oce-apps/apollo-react-native';
import { SpeakerPickerScreen } from './src/screens/SpeakerPickerScreen/SpeakerPickerScreen';
import { store } from './src/store/store';
import { NotificationContainer } from './src/components/NotificationContainer/NotificationContainer';
import { layoutBridge } from '@oce-apps/oce-apps-bridges';

Icon.loadFont();

export const App = ({ instanceId, parentId, recordTypeId }) => {
  const colorScheme = useColorScheme();
  const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;

  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  return (
    <ReduxProvider store={store}>
      <ApolloProvider theme={theme}>
        <NotificationContainer />
        <SpeakerPickerScreen parentId={parentId} recordTypeId={recordTypeId} />
      </ApolloProvider>
    </ReduxProvider>
  );
};
