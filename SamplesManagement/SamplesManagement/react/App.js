import React, { Component } from 'react';
import { Provider } from 'apollo-react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardScreen from './src/screens/DashboardScreen/DashboardScreen';
import SampleTransaction from './src/screens/TransactionScreen/SampleTransaction';
import RecordTypeSelectorScreen from './src/screens/RecordTypeSelectorScreen/RecordTypeSelectorScreen';
import AppContextProvider from './AppContext';
import StorageLocationList from './src/screens/StorageLocationList/StorageLocationList';
import SampleOrder from './src/screens/SampleOrder/SampleOrder';
import { NativeModules } from 'react-native';
import StorageLocation from './src/screens/StorageLocation/StorageLocation';

Icon.loadFont();

const AppNavigator = createStackNavigator(
  {
    Dashboard: {
      screen: DashboardScreen,
      navigationOptions: { header: null },
    },
    Transaction: {
      screen: SampleTransaction,
      navigationOptions: { header: null },
    },
    RecordTypeSelector: {
      screen: RecordTypeSelectorScreen,
      navigationOptions: { header: null },
    },
    StorageLocationList: {
      screen: StorageLocationList,
      navigationOptions: { header: null },
    },
    StorageLocation: {
      screen: StorageLocation,
      navigationOptions: { header: null },
    },
    SampleOrder: {
      screen: SampleOrder,
      navigationOptions: { header: null },
    },
  },
);

const App = createAppContainer(AppNavigator);

export default props => {
  const { instanceId } = props;

  if (instanceId) {
    const layout = NativeModules.LayoutBridge;
    layout.setHeight(600, instanceId);
  }

  return (
    <AppContextProvider>
      <Provider>
        <App />
      </Provider>
    </AppContextProvider>
  );
};
