import { Platform, useColorScheme } from "react-native";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { DarkTheme, DefaultTheme, Provider } from "apollo-react-native";
import AccountsScreen from "./src/screens/accounts";
import AccountDetailsScreen from "./src/screens/accountDetails";
import AccountInfoScreen from "./src/screens/accountInfo";
import AppBar from "./src/components/presentation/AppBar";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { layoutBridge, sfNetAPI } from "oce-apps-bridges";

Icon.loadFont();

sfNetAPI.enablePromises();

const Stack = createStackNavigator();

const Root = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyle: { ...Platform.select({ web: { flex: 1 } }) } }}>
      <Stack.Screen
        name="AccountsList"
        component={AccountsScreen}
        options={{
          header: (props) => <AppBar {...props} />,
          headerTitle: "Accounts",
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
        options={{
          header: (props) => <AppBar {...props} />,
          headerTitle: "Accounts Details",
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="AccountInfo"
        component={AccountInfoScreen}
        options={{
          header: (props) => <AppBar {...props} />,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </Stack.Navigator>
  );
};

const App = ({ instanceId }) => {
  const colorScheme = useColorScheme();
  const dynamicTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const theme = Platform.OS === "web" ? DefaultTheme : dynamicTheme;

  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  return (
    <NavigationContainer>
      <Provider theme={theme}>
        <Root />
      </Provider>
    </NavigationContainer>
  );
};

export default App;
