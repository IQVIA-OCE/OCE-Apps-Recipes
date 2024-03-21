/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AttachmentsList from "./src/screens/AttachmentsList/AttachmentsList";
import SearchAttachments from "./src/screens/SearchAttachments/SearchAttachments";
import AttachmentsHeader from "./src/screens/AttachmentsList/AttachmentsHeader";
import SearchAttachmentsHeader from "./src/screens/SearchAttachments/SearchAttachmentsHeader";
import { useDispatch, Provider as ReduxProvider } from "react-redux";
import { setConnectionStatus, setRecordId } from "./src/store/AttachmentsListReducers";
import { NativeModules, NativeEventEmitter, useColorScheme, Platform } from 'react-native';
import { Provider as ApolloProvider, DarkTheme, DefaultTheme } from "@oce-apps/apollo-react-native";
import store from './src/store/store';
import { sfNetAPI } from '@oce-apps/oce-apps-bridges';


Icon.loadFont();
const { ReachabilityBridge } = NativeModules;
const reachabilityBridgeEmitter = new NativeEventEmitter(
    ReachabilityBridge
);

sfNetAPI.enablePromises();

const Stack = createStackNavigator();

const MainNavigator = () => {
    return (
      <Stack.Navigator screenOptions={{ cardStyle: { ...Platform.select({ web: { flex: 1 } }) } }}>
        <Stack.Screen
          name="AttachmentsList"
          component={AttachmentsList}
          options={{
            header: (props) => <AttachmentsHeader />,
          }}
        />
        <Stack.Screen
          name="SearchAttachments"
          component={SearchAttachments}
          options={{
            header: (props) => <SearchAttachmentsHeader />,
          }}
        />
      </Stack.Navigator>
    );
  };


let connectionStatusSubscription;

const Root = ({ recordId }) => {
    const dispatch = useDispatch();

    const colorScheme = useColorScheme();
    const preferredTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

    useEffect(() => {
        if (recordId) dispatch(setRecordId(recordId))
    }, [recordId]);

    useEffect(() => {
        connectionStatusSubscription = reachabilityBridgeEmitter.addListener(
            'NetworkReachabilityStatus',
            networkStatusString => {
                if (networkStatusString.prevStatus !== networkStatusString.currentStatus) {
                    dispatch(setConnectionStatus(networkStatusString));
                }
            }
        );

        return () => {
            connectionStatusSubscription.remove();
        }
    }, []);

    return (
      <NavigationContainer>
        <ApolloProvider theme={preferredTheme}>
            <MainNavigator />
        </ApolloProvider>
     </NavigationContainer>
    );
}

const App = (initialProps) => {
  const { instanceId, recordId } = initialProps;
  
  if (instanceId) {
    const layout = NativeModules.LayoutBridge;
    layout.setHeight(500, instanceId);
  }

  return (
    <ReduxProvider store={store}>
        <Root recordId={recordId}/>
    </ReduxProvider>
  );
};

export default App;
