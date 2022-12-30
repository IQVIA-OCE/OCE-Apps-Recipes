import React from 'react';
import { useColorScheme } from 'react-native';
import { Provider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardScreen from './src/screens/DashboardScreen/DashboardScreen';
import SampleTransaction from './src/screens/TransactionScreen/SampleTransaction';
import RecordTypeSelectorScreen from './src/screens/RecordTypeSelectorScreen/RecordTypeSelectorScreen';
import InventoryScreen from './src/screens/InventoryScreen/InventoryScreenContainer';
import AppContextProvider from './AppContext';
import StorageLocationList from './src/screens/StorageLocationList/StorageLocationList';
import SampleOrder from './src/screens/SampleOrder/SampleOrder';
import StorageLocation from './src/screens/StorageLocation/StorageLocation';
import ManageLots from './src/screens/ManageLotsScreen/ManageLots';
import { layoutBridge } from 'oce-apps-bridges';

Icon.loadFont();

const AppNavigator = createStackNavigator(
  {
    Dashboard: {
      screen: DashboardScreen,
      navigationOptions: { header: null },
    },
    Inventory: {
      screen: InventoryScreen,
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
    ManageLots: {
      screen: ManageLots,
      navigationOptions: { header: null },
    },
  },
  // {
  //   initialRouteName: 'Inventory',
  // }
);

const App = createAppContainer(AppNavigator);

export default props => {
  const { instanceId } = props;

  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <AppContextProvider>
      <Provider theme={theme}>
        <App />
      </Provider>
    </AppContextProvider>
  );
};
