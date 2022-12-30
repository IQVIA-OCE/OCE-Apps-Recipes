import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { store } from "./src/store/store"
import { layoutBridge } from 'oce-apps-bridges'
import { Provider as ApolloProvider } from "apollo-react-native";
import { Provider as ReduxProvider } from "react-redux";
import { ReportActivitiesScreen } from "./src/screens/ReportActivitiesScreen/ReportActivitiesScreen";
import { ReportAccountsScreen } from "./src/screens/ReportAccountsScreen/ReportAccountsScreen";

import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { NotificationBanner } from "./src/components/NotificationBanner/NotificationBanner";
import { showErrorNotification } from "./src/store/Notification/NotificationSlice";
import { sfNetAPI } from 'oce-apps-bridges';
import { isIphone } from './src/constants';

Icon.loadFont();
const Stack = createStackNavigator();

export default () => {
  sfNetAPI.enablePromises();

  layoutBridge.setHeight(600);

  if (isIphone) {
    store.dispatch(showErrorNotification(`Application is not available for iPhone`));
  }

  return (
    <NavigationContainer>

      <ReduxProvider store={store}>
        <ApolloProvider>
          <NotificationBanner/>

          {
            !isIphone &&
            <Stack.Navigator initialRouteName="ReportAccountsScreen">
              <Stack.Screen name="ReportAccountsScreen" component={ReportAccountsScreen} options={{title: '', headerShown: false}} />
              <Stack.Screen name="ReportActivitiesScreen" component={ReportActivitiesScreen} options={{ title: '', headerShown: false }} />
            </Stack.Navigator>
          }

        </ApolloProvider>
      </ReduxProvider>

    </NavigationContainer>
  );
};

