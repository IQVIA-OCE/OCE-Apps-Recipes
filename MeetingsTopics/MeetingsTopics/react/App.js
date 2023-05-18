import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TopicPickerScreen } from './src/screens/TopicPickerScreen/TopicPickerScreen';
import { Provider as ApolloProvider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store/store';
import { ErrorBanner } from './src/components/ErrorBanner';
import { layoutBridge } from 'oce-apps-bridges';
import { useColorScheme } from 'react-native';

Icon.loadFont();

export default ({ instanceId, parentId }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  return (
    <ReduxProvider store={store}>
      <ApolloProvider theme={theme}>
        <ErrorBanner />
        <TopicPickerScreen parentId={parentId}/>
      </ApolloProvider>
    </ReduxProvider>
  );
};
