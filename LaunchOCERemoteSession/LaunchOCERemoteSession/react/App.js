import React from "react";
import { Platform, ScrollView } from "react-native";
import CallsList from "./src/CallsList/CallsList";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider } from "apollo-react-native";
import { environment, layoutBridge } from "oce-apps-bridges";

Icon.loadFont();

export const isIphone = !Platform.isPad;

export const NAMESPACE = environment.namespace();

export default (props) => {
  const { instanceId, recordId } = props;

  if (instanceId) {
    if (recordId) {
      layoutBridge.setHeight(400, instanceId);
    } else {
      layoutBridge.setHeight(460, instanceId);
    }
  }

  return (
    <Provider>
      <CallsList recordId={recordId} />
    </Provider>
  );
};
