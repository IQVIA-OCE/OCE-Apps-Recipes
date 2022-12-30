import React from 'react';
import { Platform, ScrollView } from 'react-native';
import CallDetailsHistory from './src/CallDetailsHistory';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'apollo-react-native';
import { layoutBridge } from 'oce-apps-bridges';

Icon.loadFont();

export const isIphone = !Platform.isPad;

export const NAMESPACE = 'OCE__';

export default props => {
  const { instanceId, recordId } = props;

  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  if (isIphone) {
    return (
      <Provider>
        <ScrollView>
          <CallDetailsHistory recordId={recordId} />
        </ScrollView>
      </Provider>
    )
  } else {
    return (
      <Provider>
        <CallDetailsHistory recordId={recordId} />
      </Provider>
    )
  }
}
