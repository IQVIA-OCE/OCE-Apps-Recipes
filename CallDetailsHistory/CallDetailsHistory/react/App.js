import React from 'react';
import { Platform, ScrollView, useColorScheme } from 'react-native';
import CallDetailsHistory from './src/CallDetailsHistory';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { layoutBridge } from 'oce-apps-bridges';

Icon.loadFont();

export const isIphone = !Platform.isPad;

export const NAMESPACE = 'OCE__';

export default props => {
  const { instanceId, recordId } = props;

  const colorScheme = useColorScheme();
  const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;

  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  if (isIphone) {
    return (
      <Provider theme={theme}>
        <ScrollView>
          <CallDetailsHistory recordId={recordId} />
        </ScrollView>
      </Provider>
    )
  } else {
    return (
      <Provider theme={theme}>
        <CallDetailsHistory recordId={recordId} />
      </Provider>
    )
  }
}
