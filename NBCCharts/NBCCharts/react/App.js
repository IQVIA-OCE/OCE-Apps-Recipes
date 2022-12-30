import { Platform, useColorScheme } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { DarkTheme, DefaultTheme, Provider } from "apollo-react-native";
import AccountsScreen from "./src/screens/accounts";
import AccountDetailsScreen from "./src/screens/accountDetails";
import AccountInfoScreen from "./src/screens/accountInfo";
import AppBar from "./src/components/presentation/AppBar";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

Icon.loadFont();

const MainNavigator = createStackNavigator({
  AccountsList: {
    screen: AccountsScreen,
    navigationOptions: ({ navigation, navigationOptions }) => ({
      header: props => (
        <AppBar
          {...props}
          navigation={navigation}
          navigationOptions={navigationOptions}
        />
      ),
      headerStyle: {
        backgroundColor: "transparent"
      }
    })
  },
  AccountDetails: {
    screen: AccountDetailsScreen,
    navigationOptions: ({ navigation, navigationOptions }) => ({
      header: props => (
        <AppBar
          {...props}
          navigation={navigation}
          navigationOptions={navigationOptions}
        />
      ),
      headerStyle: {
        backgroundColor: "transparent"
      }
    })
  },
  AccountInfo: {
    screen: AccountInfoScreen,
    navigationOptions: ({ navigation, navigationOptions }) => ({
      header: props => (
        <AppBar
          {...props}
          navigation={navigation}
          navigationOptions={navigationOptions}
        />
      ),
      headerStyle: {
        backgroundColor: "transparent"
      }
    })
  }
});

const Root = createAppContainer(MainNavigator);

const App = () => {
  const colorScheme = useColorScheme();
  const dynamicTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const theme = Platform.OS === "web" ? DefaultTheme : dynamicTheme;

  return (
    <Provider theme={theme}>
      <Root />
    </Provider>
  );
};

export default App;
