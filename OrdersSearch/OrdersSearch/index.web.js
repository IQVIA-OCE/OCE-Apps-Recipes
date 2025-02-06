import { AppRegistry } from 'react-native';
import {App} from './App';
import { name as appName } from './app.json';

console.reportErrorsAsExceptions = false;

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
 rootTag: document.getElementById('root'),
});
