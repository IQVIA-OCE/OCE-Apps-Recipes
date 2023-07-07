import React, { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Portal,
  Provider as ApolloProvider,
  DefaultTheme,
  DarkTheme,
} from 'apollo-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import store from './src/store/store';
import UpdateActivityPlan from './src/screens/UpdateActivityPlan/UpdateActivityPlan';
import {
  getAccountInfo,
  getDescribedAPCR,
  getAccountsList,
  getPlanCycleDates,
} from './src/store/applicationSlice/applicationSlice';
import NewActivityPlanChangeRequest from './src/screens/NewActivityPlanChangeRequest/NewActivityPlanChangeRequest';
import RemoveActivityPlan from './src/screens/RemoveActivityPlan/RemoveActivityPlan';
import { NEW_ACTIVITY } from './src/constants/routes';
import NotificationBanner from './src/components/NotificationBanner/NotificationBanner';
import Loader from './src/components/Loader/Loader';
import AddActivityToPlan from './src/screens/AddActivityToPlan/AddActivityToPlan';
import { sfNetAPI, layoutBridge } from 'oce-apps-bridges';
import { NavigationContainer } from '@react-navigation/native';

Icon.loadFont();

sfNetAPI.enablePromises();

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={NEW_ACTIVITY}
      screenOptions={{
        headerShown: false,
        cardStyle: { ...Platform.select({ web: { flex: 1 } }) },
      }}
    >
      <Stack.Screen
        name="NewActivityPlanChangeRequest"
        component={NewActivityPlanChangeRequest}
      />
      <Stack.Screen
        name="UpdateActivityPlan"
        component={UpdateActivityPlan}
      />
      <Stack.Screen
        name="RemoveActivityPlan"
        component={RemoveActivityPlan}
      />
      <Stack.Screen
        name="AddActivityToPlan"
        component={AddActivityToPlan}
      />
    </Stack.Navigator>
  );
};

const Root = ({ parentId }) => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;

  useEffect(() => {
    dispatch(getDescribedAPCR());
    dispatch(getAccountInfo(parentId));
    dispatch(getAccountsList());
    dispatch(getPlanCycleDates(parentId));
  }, []);

  return (
    <ApolloProvider theme={theme}>
      <Portal>
        <Loader />
        <NotificationBanner />
      </Portal>
      <Navigation />
    </ApolloProvider>
  );
};

const App = ({ recordId, instanceId }) => {
  if (instanceId) {
    layoutBridge.setHeight(500);
  }

  return (
    <NavigationContainer>
      <Provider store={store}>
        <Root parentId={recordId} testID="root" />
      </Provider>
    </NavigationContainer>
  );
};

export default App;
