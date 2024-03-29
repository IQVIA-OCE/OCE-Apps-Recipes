import React from "react";
import { useColorScheme, Platform } from "react-native"
import { sfNetAPI, layoutBridge } from '@oce-apps/oce-apps-bridges';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as ApolloProvider, DarkTheme, DefaultTheme } from "@oce-apps/apollo-react-native";
import { Provider as ReduxProvider } from "react-redux";
import { ReportScreen } from './src/screens/ReportScreen/ReportScreen';
import { TransactionReportScreen } from './src/screens/TransactionReportScreen/TransactionReportScreen'
import { DTPAllocationReportDetail } from './src/screens/DTPAllocationReportDetail/DTPAllocationReportDetail'
import { NotificationBanner } from "./src/components/NotificationBanner/NotificationBanner";
import { showErrorNotification } from "./src/store/Notification/NotificationSlice";
import { store } from "./src/store/store"
import { isMobilePhone } from './src/constants';

Icon.loadFont()

const Stack = createStackNavigator();

export default ({ instanceId }) => {
    sfNetAPI.enablePromises();

    if (instanceId) {
        layoutBridge.setHeight(600, instanceId);
    }

    const colorScheme = useColorScheme();
    const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;

    if (isMobilePhone) {
        store.dispatch(showErrorNotification('Application is not available on mobile phones'));
    }
    return (
        <NavigationContainer>
            <ReduxProvider store={store}>
                <ApolloProvider theme={theme}>
                    <NotificationBanner />
                        {
                            !isMobilePhone && <Stack.Navigator initialRouteName="ReportScreen">
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

