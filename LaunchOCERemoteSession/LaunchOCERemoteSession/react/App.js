import React, { useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import CallsList from "./src/CallsList/CallsList";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DarkTheme, DefaultTheme, Provider } from 'apollo-react-native';
import { environment, layoutBridge } from "oce-apps-bridges";

Icon.loadFont();

export const isIphone = !Platform.isPad;

export const NAMESPACE = environment.namespace();

export default (props) => {
  const { instanceId, recordId } = props;
  const colorScheme = useColorScheme();
  const [preferredTheme, setPreferredTheme] = useState(DefaultTheme);

  if (instanceId) {
    if (recordId) {
      layoutBridge.setHeight(400, instanceId);
    } else {
      layoutBridge.setHeight(460, instanceId);
    }
  }

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setPreferredTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
    }
  }, [colorScheme]);

  return (
    <Provider theme={preferredTheme}>
      <CallsList recordId={recordId} />
    </Provider>
  );
};
