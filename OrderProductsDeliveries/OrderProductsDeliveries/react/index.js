/**
 * @format
 */

 import { AppRegistry, NativeModules } from 'react-native';
 import App from './App';
 import { name as appName } from './app.json';
 import { Provider as ReduxProvider } from 'react-redux';
 import store from './src/stores';
 import React from 'react';
 import { Provider as ApolloProvider } from 'apollo-react-native';
 import { layoutBridge } from 'oce-apps-bridges'
 
 console.reportErrorsAsExceptions = false;
 
 const Root = (initialProps) => {
   const { instanceId, recordId } = initialProps;
 
   if (instanceId) {
    layoutBridge.setHeight(500);
   }

   return (
     <ReduxProvider store={store}>
       <ApolloProvider>
         <App recordId={recordId}/>
       </ApolloProvider>
     </ReduxProvider>
   );
 };
 
 AppRegistry.registerComponent(appName, () => Root);
 