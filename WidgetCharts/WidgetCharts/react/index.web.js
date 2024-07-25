import React from "react";
import { AppRegistry, View } from "react-native";
import { ApolloProgress } from "@oce-apps/apollo-react-native";

import { useAppInit, initialParams } from "@oce-apps/oce-apps-bridges";
import App from "./App";

const WithAppInit = () => {
  const [{ isLoading }] = useAppInit({ useLocalization: true });

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ApolloProgress />
        </View>
    );
  }
  return <App {...initialParams} />;
};

AppRegistry.registerComponent('App', () => WithAppInit);

AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});
