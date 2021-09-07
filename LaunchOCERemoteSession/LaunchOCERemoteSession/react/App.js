import React from "react";
import { NativeModules, Platform, ScrollView } from "react-native";
import CallsList from "./src/CallsList/CallsList";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider } from "apollo-react-native";
import { environment } from "./bridge/EnvironmentData/EnvironmentData.native";

Icon.loadFont();

export const isIphone = !Platform.isPad;

export const NAMESPACE = environment.namespace();

export default (props) => {
  const { instanceId, recordId } = props;

  if (instanceId) {
    const layout = NativeModules.LayoutBridge;
    if (recordId) {
      layout.setHeight(400, instanceId);
    } else {
      layout.setHeight(460, instanceId);
    }
  }

  return (
    <Provider>
      <CallsList recordId={recordId} />
    </Provider>
  );
};
