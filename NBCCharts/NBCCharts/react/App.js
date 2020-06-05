import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AccountsScreen from './src/screens/accounts';
import AccountDetailsScreen from './src/screens/accountDetails';
import AccountInfoScreen from './src/screens/accountInfo';
import AppBar from './src/components/presentation/AppBar';
import React from 'react';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


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
  AccountDetails: {
    screen: AccountDetailsScreen,
    navigationOptions: ({navigation, navigationOptions}) => ({
      header: props => <AppBar {...props} navigation={navigation} navigationOptions={navigationOptions}/>,
      headerStyle: {
        backgroundColor: "transparent"
      }
    }),
  },
  AccountInfo: {
    screen: AccountInfoScreen,
    navigationOptions: ({navigation, navigationOptions}) => ({
      header: props => <AppBar {...props} navigation={navigation} navigationOptions={navigationOptions}/>,
      headerStyle: {
        backgroundColor: "transparent"
      }
    }),
  },
});

const App = createAppContainer(MainNavigator);

export default App;
