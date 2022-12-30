import React, { useState, useEffect } from "react";
import { Appearance, Platform } from "react-native"
import { sfNetAPI } from 'oce-apps-bridges';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as ApolloProvider, DarkTheme, DefaultTheme } from "apollo-react-native";
import { Provider as ReduxProvider } from "react-redux";
import { ReportScreen } from './src/screens/ReportScreen/ReportScreen';
import { TransactionReportScreen } from './src/screens/TransactionReportScreen/TransactionReportScreen'
import { DTPAllocationReportDetail } from './src/screens/DTPAllocationReportDetail/DTPAllocationReportDetail'
import { NotificationBanner } from "./src/components/NotificationBanner/NotificationBanner";
import { showErrorNotification } from "./src/store/Notification/NotificationSlice";
import { store } from "./src/store/store"
import { isIphone } from './src/constants';
import { NativeModules } from 'react-native';

Icon.loadFont()

const Stack = createStackNavigator();

export default ({ instanceId }) => {
    sfNetAPI.enablePromises();

    if (instanceId) {
      const layout = NativeModules.LayoutBridge;
      layout.setHeight(600, instanceId);
    }

    let [colorScheme, setColorScheme] = useState(DefaultTheme);
    if (Platform.OS !== 'web') {
        const currentSelectedTheme = Appearance.getColorScheme();
        colorScheme = currentSelectedTheme === "dark" ? DarkTheme : DefaultTheme;

    }
    useEffect(() => {
        const themeListener = Appearance.addChangeListener(({ colorScheme }) => {
            if (Platform.OS !== 'web') {
                setColorScheme(colorScheme === 'dark' ? 'dark' : 'light');
            }
        }
        );

        return () => {
            themeListener.remove();
        };
    }, []);
    if (isIphone) {
        store.dispatch(showErrorNotification(`Application is not available for iPhone`));
    }
    return (
        <NavigationContainer>
            <ReduxProvider store={store}>
                <ApolloProvider theme={colorScheme}>
                    <NotificationBanner />
                    {
                        !isIphone && <Stack.Navigator initialRouteName="ReportScreen">
                            <Stack.Screen name="ReportScreen" component={ReportScreen} options={{ title: '', headerShown: false }} />
                            <Stack.Screen name="TransactionReportScreen" component={TransactionReportScreen} options={{ title: '', headerShown: false }} />
                            <Stack.Screen name="DTPAllocationReportDetail" component={DTPAllocationReportDetail} options={{ title: '', headerShown: false }} />
                        </Stack.Navigator>
                    }
                </ApolloProvider>
            </ReduxProvider>
        </NavigationContainer>
    );

}

