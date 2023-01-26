import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AccountsScreen from './src/screens/accountsList';
import OneKeyValidationRequest from './src/screens/oneKeyValidationRequest';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppBar from './src/components/AppBar';
import React from 'react';
import { Provider, DarkTheme, DefaultTheme } from 'apollo-react-native';
import { Platform, useColorScheme } from 'react-native';

const MainNavigator = createStackNavigator({
  AccountsList: {
    screen: AccountsScreen,
    navigationOptions: ({ navigation, navigationOptions }) => ({
      header: props => <AppBar {...props} navigation={navigation} navigationOptions={navigationOptions}/>,
      headerStyle: {
        backgroundColor: "transparent"
      },
    }),
  },
  OneKeyValidationRequest: {
    screen: OneKeyValidationRequest,
    navigationOptions: ({ navigation, navigationOptions }) => ({
      header: props => <AppBar {...props} navigation={navigation} navigationOptions={navigationOptions}/>,
      headerStyle: {
        backgroundColor: "transparent"
      },
    }),
  }
});

Icon.loadFont();


const AppContainer = createAppContainer(MainNavigator);

const App = () => {
  let preferredTheme = DefaultTheme;

  if (Platform.OS !== 'web') {
      const colorScheme = useColorScheme();
      preferredTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  }
  return (
    <Provider theme={preferredTheme}>
       <AppContainer/>
    </Provider>
  );
}

export default App;
