import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AccountsScreen from './src/screens/accountsList';
import OneKeyValidationRequest from './src/screens/oneKeyValidationRequest';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppBar from './src/components/AppBar';
import React from 'react';


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

const App = createAppContainer(MainNavigator);

export default App;
