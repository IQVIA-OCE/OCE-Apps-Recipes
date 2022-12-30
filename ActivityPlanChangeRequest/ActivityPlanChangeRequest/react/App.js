import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Portal, Provider as ApolloProvider } from 'apollo-react-native';
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
import { createStackNavigator } from 'react-navigation-stack';
import { NEW_ACTIVITY } from './src/constants/routes';
import { createAppContainer } from 'react-navigation';
import NotificationBanner from './src/components/NotificationBanner/NotificationBanner';
import Loader from './src/components/Loader/Loader';
import { NativeModules } from 'react-native';
import AddActivityToPlan from './src/screens/AddActivityToPlan/AddActivityToPlan';

Icon.loadFont();

const MainNavigator = createStackNavigator(
  {
    NewActivityPlanChangeRequest: {
      screen: NewActivityPlanChangeRequest,
      navigationOptions: {
        header: null,
      },
    },
    UpdateActivityPlan: {
      screen: UpdateActivityPlan,
      navigationOptions: {
        header: null,
      },
    },
    RemoveActivityPlan: {
      screen: RemoveActivityPlan,
      navigationOptions: {
        header: null,
      },
    },
    AddActivityToPlan: {
      screen: AddActivityToPlan,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: NEW_ACTIVITY,
  }
);
const Navigation = createAppContainer(MainNavigator);

const Root = ({ parentId }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDescribedAPCR());
    dispatch(getAccountInfo(parentId));
    dispatch(getAccountsList());
    dispatch(getPlanCycleDates(parentId));
  }, []);
  return (
    <ApolloProvider>
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
    const layout = NativeModules.LayoutBridge;
    layout.setHeight(500, instanceId);
  }

  return (
    <Provider store={store}>
      <Root parentId={recordId} testID="root"/>
    </Provider>
  )
}

export default App;
