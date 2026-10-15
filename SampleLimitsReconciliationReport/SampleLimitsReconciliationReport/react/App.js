import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from './src/store/store';
import { layoutBridge, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { Provider as ApolloProvider, DefaultTheme, DarkTheme } from '@oce-apps/apollo-react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { ReportActivitiesScreen } from './src/screens/ReportActivitiesScreen/ReportActivitiesScreen';
import { ReportAccountsScreen } from './src/screens/ReportAccountsScreen/ReportAccountsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { NotificationBanner } from './src/components/NotificationBanner/NotificationBanner';
import { showErrorNotification } from './src/store/Notification/NotificationSlice';
import { isIphone } from './src/constants';
import { Platform, useColorScheme } from 'react-native';

Icon.loadFont();
const Stack = createStackNavigator();

export default () => {
  let theme = DefaultTheme;

  if (Platform.OS !== 'web') {
    const colorScheme = useColorScheme();
    theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  }

  sfNetAPI.enablePromises();

  layoutBridge.setHeight(600);

  if (isIphone) {
    store.dispatch(showErrorNotification(`Application is not available for iPhone`));
  }



  return (
    <NavigationContainer>

      <ReduxProvider store={store}>
        <ApolloProvider theme={theme}>
          <NotificationBanner/>

          {
            !isIphone &&
            <Stack.Navigator initialRouteName='ReportAccountsScreen'>
              <Stack.Screen name='ReportAccountsScreen' component={ReportAccountsScreen} options={{title: '', headerShown: false}} />
              <Stack.Screen name='ReportActivitiesScreen' component={ReportActivitiesScreen} options={{ title: '', headerShown: false }} />
            </Stack.Navigator>
          }

        </ApolloProvider>
      </ReduxProvider>

    </NavigationContainer>
  );
};
