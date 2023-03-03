import React, {useEffect} from 'react';
import { useColorScheme, View, Text, Platform } from 'react-native';
import { Provider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardScreen from './src/screens/DashboardScreen/DashboardScreen';
import SampleTransaction from './src/screens/TransactionScreen/SampleTransaction';
import RecordTypeSelectorScreen from './src/screens/RecordTypeSelectorScreen/RecordTypeSelectorScreen';
import InventoryScreen from './src/screens/InventoryScreen/InventoryScreenContainer';
import AppContextProvider from './src/AppContext';
import StorageLocationList from './src/screens/StorageLocationList/StorageLocationList';
import SampleOrder from './src/screens/SampleOrder/SampleOrder';
import StorageLocation from './src/screens/StorageLocation/StorageLocation';
import ManageLots from './src/screens/ManageLotsScreen/ManageLots';
import { layoutBridge, sfNetAPI } from 'oce-apps-bridges';
import { NavigationContainer } from "@react-navigation/native";

sfNetAPI.enablePromises();

Icon.loadFont();

const Stack = createStackNavigator();

const Root = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />
      <Stack.Screen
        name="Inventory"
        component={InventoryScreen}
      />
      <Stack.Screen
        name="Transaction"
        component={SampleTransaction}
      />
      <Stack.Screen
        name="RecordTypeSelector"
        component={RecordTypeSelectorScreen}
      />
      <Stack.Screen
        name="StorageLocationList"
        component={StorageLocationList}
      />
      <Stack.Screen
        name="StorageLocation"
        component={StorageLocation}
      />
      <Stack.Screen
        name="SampleOrder"
        component={SampleOrder}
      />
      <Stack.Screen
        name="ManageLots"
        component={ManageLots}
      />
    </Stack.Navigator>
  )
}

export default props => {
  const { instanceId } = props;

  if(instanceId) {
    layoutBridge.setHeight(600);
  }else{
    if (Platform.OS === 'web'){
      layoutBridge.setHeight(1100);
    }
  }

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
   <NavigationContainer>
     <AppContextProvider>
       <Provider theme={theme}>
         <Root />
       </Provider>
     </AppContextProvider>
   </NavigationContainer>
  );
};
