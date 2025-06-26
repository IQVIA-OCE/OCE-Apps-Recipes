import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AccountsScreen from './src/screens/accountsList';
import OneKeyValidationRequest from './src/screens/oneKeyValidationRequest';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppBar from './src/components/AppBar';
import React from 'react';
import { Provider, DarkTheme, DefaultTheme } from '@oce-apps/apollo-react-native';
import { Platform, useColorScheme } from 'react-native';
import { sfNetAPI } from '@oce-apps/oce-apps-bridges';

Icon.loadFont();

const Stack = createStackNavigator();

sfNetAPI.enablePromises();

const Root = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyle: { ...Platform.select({ web: { flex: 1 } }) } }}>
      <Stack.Screen name="AccountsList" component={AccountsScreen} options={{
        header: props => <AppBar {...props} />,
        headerTitle: "Accounts",
        headerStyle: {
          backgroundColor: "transparent"
        },
      }} />
      <Stack.Screen name="OneKeyValidationRequest" component={OneKeyValidationRequest} options={{
        header: props => <AppBar {...props} />,
        headerTitle: "Create Validation Request",
        headerStyle: {
          backgroundColor: "transparent"
        },
      }} />
    </Stack.Navigator>
  )
}

const App = () => {
  let preferredTheme = DefaultTheme;

  if (Platform.OS !== 'web') {
      const colorScheme = useColorScheme();
      preferredTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  }
  return (
    <NavigationContainer>
      <Provider theme={preferredTheme}>
        <Root />
      </Provider>
    </NavigationContainer>
  );
}

export default App;
