import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AccountsScreen from './src/screens/accounts';
import AccountDetailsScreen from './src/screens/accountDetails';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppBar from './src/components/presentation/AppBar';
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
  AccountDetails: {
    screen: AccountDetailsScreen,
    navigationOptions: ({navigation, navigationOptions}) => ({
      header: props => <AppBar {...props} navigation={navigation} navigationOptions={navigationOptions}/>,
      headerStyle: {        
        backgroundColor: "transparent"      
      }
    }),
  },
});

Icon.loadFont();

const App = createAppContainer(MainNavigator);

export default App;