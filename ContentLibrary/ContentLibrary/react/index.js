
 import { AppRegistry, NativeModules } from 'react-native';
 import App from './App';
 import { name as appName } from './app.json';
 import { Provider as ReduxProvider } from 'react-redux';
 import store from './src/store/store';
 import React from 'react';
 import { Provider as ApolloProvider } from 'apollo-react-native';
 
 console.reportErrorsAsExceptions = false;
 
 const Root = (initialProps) => {
   const { instanceId, recordId } = initialProps;
   
   if (instanceId) {
     const layout = NativeModules.LayoutBridge;
     layout.setHeight(500, instanceId);
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
