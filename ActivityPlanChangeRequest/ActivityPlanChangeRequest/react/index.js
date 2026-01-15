import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import React from 'react';

console.reportErrorsAsExceptions = false;

 AppRegistry.registerComponent(appName, () => App);
