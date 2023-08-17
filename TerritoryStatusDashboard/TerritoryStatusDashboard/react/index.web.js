import { ApolloProgress } from 'apollo-react-native';
import { initialParams, useAppInit } from 'oce-apps-bridges';
import React from 'react';
import { AppRegistry, View } from 'react-native';
import { App } from './App';

const WithAppInit = () => {
  const [{ isLoading }] = useAppInit({ useLocalization: true });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ApolloProgress />
      </View>
    );
  }
  return <App {...initialParams} />;
};

AppRegistry.registerComponent('App', () => WithAppInit);

AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});
