/**
 * @format
 */

 import React from 'react';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { Provider } from 'apollo-react-native';

const RootWithProvider = () => {
    return <Provider><App/></Provider>
}

AppRegistry.registerComponent(appName, () => RootWithProvider);